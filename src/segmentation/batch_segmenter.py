import os
import sys
import json
from pathlib import Path

from src.segmentation.text_tiling import text_tiling_segments
from src.segmentation.bert_segmentation import bert_topic_segments

TRANSCRIPT_DIR = "data/transcripts"
SEGMENT_OUTPUT_DIR = "data/segments"

os.makedirs(SEGMENT_OUTPUT_DIR, exist_ok=True)


def load_transcript(path):
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
        return data["segments"]  # whisper segments


def flatten_text(segments):
    return " ".join(seg["text"] for seg in segments)


def find_segment_time(segment_text, whisper_segments):
    """
    Approximate start/end time by matching text
    """
    segment_text = segment_text.strip().lower()

    start_time = None
    end_time = None

    for ws in whisper_segments:
        if ws["text"].lower() in segment_text:
            start_time = ws["start"]
            break

    for ws in reversed(whisper_segments):
        if ws["text"].lower() in segment_text:
            end_time = ws["end"]
            break

    return start_time, end_time


def segment_single_file(transcript_path):
    if not os.path.exists(transcript_path):
        raise FileNotFoundError(f"Transcript not found: {transcript_path}")

    input_path = Path(transcript_path)
    file_id = input_path.stem

    print(f"Segmenting uploaded transcript: {file_id}")

    whisper_segments = load_transcript(transcript_path)
    text = flatten_text(whisper_segments)

    tt_raw = text_tiling_segments(text)
    bert_raw = bert_topic_segments(text)

    bert_segments = []

    for idx, seg_text in enumerate(bert_raw):
        start_time, end_time = find_segment_time(
            seg_text,
            whisper_segments
        )

        bert_segments.append({
            "segment_id": idx + 1,
            "text": seg_text,
            "start_time": start_time,
            "end_time": end_time
        })

    output = {
        "file": f"{file_id}.json",
        "bert_segments": bert_segments,
        "num_bert": len(bert_segments)
    }

    output_path = os.path.join(SEGMENT_OUTPUT_DIR, f"{file_id}.json")

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=4)

    print(f"Saved segments to {output_path}")


def segment_all_files():
    for file in os.listdir(TRANSCRIPT_DIR):
        if file.endswith(".json"):
            segment_single_file(os.path.join(TRANSCRIPT_DIR, file))


if __name__ == "__main__":
    if len(sys.argv) > 1:
        segment_single_file(sys.argv[1])
    else:
        segment_all_files()
