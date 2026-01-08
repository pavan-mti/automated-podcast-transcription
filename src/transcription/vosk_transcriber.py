import os
import json
import wave
import subprocess
from vosk import Model, KaldiRecognizer

# Path to the model
MODEL_PATH = "models/vosk-model-small-en-us-0.15"

def convert_to_wav(input_path, output_path):
    """
    Converts input audio to 16kHz Mono WAV (PCM) required by Vosk
    using ffmpeg.
    """
    command = [
        "ffmpeg",
        "-i", input_path,
        "-ac", "1",            # Mono
        "-ar", "16000",        # 16kHz
        "-f", "wav",           # Format
        "-y",                  # Overwrite
        output_path
    ]
    subprocess.run(command, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def transcribe_audio(audio_path, output_path):
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Vosk model not found at {MODEL_PATH}. Please run scripts/download_vosk_model.py")

    # Vosk requires 16kHz mono WAV. We create a temp file.
    temp_wav = "temp_vosk_16k.wav"
    
    try:
        print(f"Converting {audio_path} to 16kHz mono WAV for Vosk...")
        convert_to_wav(audio_path, temp_wav)
        
        print("Loading Vosk model...")
        model = Model(MODEL_PATH)
        rec = KaldiRecognizer(model, 16000)
        rec.SetWords(True)

        wf = wave.open(temp_wav, "rb")
        
        results = []
        text_accumulated = ""
        
        print("Transcribing...")
        while True:
            data = wf.readframes(4000)
            if len(data) == 0:
                break
            if rec.AcceptWaveform(data):
                part = json.loads(rec.Result())
                if "text" in part:
                    text_accumulated += part["text"] + " "
                    # Vosk returns words too if SetWords(True)
                    if "result" in part:
                        results.extend(part["result"])
            # else:
            #     # Partial result, ignore for final JSON
            #     pass

        final_part = json.loads(rec.FinalResult())
        if "text" in final_part:
             text_accumulated += final_part["text"]
        if "result" in final_part:
             results.extend(final_part["result"])
        
        wf.close()
        
        
        # Transform Vosk words into "segments" for compatibility.
        # Group words into chunks (e.g., max 7 seconds duration or break on long silence).
        segments = []
        if results:
            current_seg = {"start": results[0]["start"], "end": 0, "text": []}
            
            for i, r in enumerate(results):
                # If gap > 0.8s or total duration > 10s, break
                is_pause = (r["start"] - results[i-1]["end"]) > 0.8 if i > 0 else False
                is_long = (r["end"] - current_seg["start"]) > 10.0
                
                if (is_pause or is_long) and current_seg["text"]:
                    # Finish current
                    current_seg["end"] = results[i-1]["end"]
                    current_seg["text"] = " ".join(current_seg["text"])
                    segments.append(current_seg)
                    
                    # Start new
                    current_seg = {"start": r["start"], "end": 0, "text": []}
                
                current_seg["text"].append(r["word"])
            
            # Append last
            if current_seg["text"]:
                current_seg["end"] = results[-1]["end"]
                current_seg["text"] = " ".join(current_seg["text"])
                segments.append(current_seg)
                
        else:
            segments = []

        transcript_json = {
            "audio_file": audio_path,
            "model": "vosk-small",
            "segments": segments,
            "text": text_accumulated.strip() 
        }

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(transcript_json, f, indent=4)

        print(f"Saved transcript to {output_path}")

    finally:
        if os.path.exists(temp_wav):
            os.remove(temp_wav)

