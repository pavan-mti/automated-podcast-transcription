import os
import sys
import json
from src.segmentation.keywords import keyword_extractor
from src.segmentation.summarizer import summarize_segment

SEGMENT_DIR = "data/segments"
WHISPER_DIR = "data/transcripts"
OUTPUT_DIR = "database"


def align_segments(segments, whisper_segments):
    aligned = []

    for seg_id, seg_text in enumerate(segments, start=1):
        seg_text = seg_text.strip()
        seg_start = None
        seg_end = None

        for ws in whisper_segments:
            if ws["text"].strip().startswith(seg_text[:20]):
                seg_start = ws["start"]
                break

        for ws in reversed(whisper_segments):
            if ws["text"].strip().endswith(seg_text[-20:]):
                seg_end = ws["end"]
                break

        aligned.append({
            "segment_id": seg_id,
            "text": seg_text,
            "start_time": seg_start,
            "end_time": seg_end
        })

    return aligned


def process_single_file(segment_filename):
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    seg_path = os.path.join(SEGMENT_DIR, segment_filename)
    if not os.path.exists(seg_path):
        raise FileNotFoundError(f"Segment file not found: {seg_path}")

    with open(seg_path, "r", encoding="utf-8") as f:
        seg_data = json.load(f)

    whisper_file = segment_filename.replace(".json", ".json")
    whisper_path = os.path.join(WHISPER_DIR, whisper_file)

    with open(whisper_path, "r", encoding="utf-8") as f:
        whisper_data = json.load(f)

    whisper_segments = whisper_data.get("segments", [])
    text_segments = seg_data.get("bert_segments", [])

    aligned_segments = align_segments(text_segments, whisper_segments)

    final_output = []

    for seg in aligned_segments:
        record = {
            "file": whisper_file,
            "segment_id": seg["segment_id"],
            "text": seg["text"],
            "summary": summarize_segment(seg["text"]),
            "keywords": keyword_extractor(seg["text"]),
            "start_time": seg["start_time"],
            "end_time": seg["end_time"]
        }
        final_output.append(record)

    output_path = os.path.join(OUTPUT_DIR, segment_filename)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(final_output, f, indent=4)

    print(f"Saved final output: {output_path}")


def process_all_files():
    files = [f for f in os.listdir(SEGMENT_DIR) if f.endswith(".json")]

    for file in files:
        process_single_file(file)


if __name__ == "__main__":
    if len(sys.argv) > 1:
        process_single_file(sys.argv[1])
    else:
        process_all_files()
