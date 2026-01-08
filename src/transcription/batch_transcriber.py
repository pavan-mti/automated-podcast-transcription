import os
import sys
from src.transcription.vosk_transcriber import transcribe_audio

PROCESSED_DIR = "data/processed"
TRANSCRIPT_DIR = "data/transcripts"


def transcribe_single_audio(audio_path):
    if not os.path.exists(audio_path):
        raise FileNotFoundError(f"Audio file not found: {audio_path}")

    base_name = os.path.splitext(os.path.basename(audio_path))[0]
    output_path = os.path.join(TRANSCRIPT_DIR, base_name + ".json")

    print(f"Transcribing uploaded file: {audio_path}")
    transcribe_audio(audio_path, output_path)


def transcribe_all_audios():
    files = os.listdir(PROCESSED_DIR)

    for f in files:
        if f.endswith((".wav", ".mp3")):
            input_path = os.path.join(PROCESSED_DIR, f)

            base_name = os.path.splitext(f)[0]
            output_path = os.path.join(TRANSCRIPT_DIR, base_name + ".json")

            print(f"Transcribing: {f}")
            transcribe_audio(input_path, output_path)

    print("\nAll transcripts generated successfully!")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        # 🔹 Single-file mode (backend upload)
        transcribe_single_audio(sys.argv[1])
    else:
        # 🔹 Batch mode (existing behavior)
        transcribe_all_audios()
