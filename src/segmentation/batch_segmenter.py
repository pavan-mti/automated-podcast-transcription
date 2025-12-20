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
        return " ".join([seg["text"] for seg in data["segments"]])


def segment_single_file(transcript_path):
    if not os.path.exists(transcript_path):
        raise FileNotFoundError(f"Transcript not found: {transcript_path}")

    input_path = Path(transcript_path)
    file_id = input_path.stem  # IMPORTANT: use fileId everywhere

    print(f"Segmenting uploaded transcript: {file_id}")

    text = load_transcript(transcript_path)

    # Run segmentation algorithms
    tt = text_tiling_segments(text)
    bert = bert_topic_segments(text)

    output = {
        "file": f"{file_id}.json",
        "texttiling_segments": tt,
        "bert_segments": bert,
        "num_texttiling": len(tt),
        "num_bert": len(bert)
    }

    output_path = os.path.join(SEGMENT_OUTPUT_DIR, f"{file_id}.json")

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=4)

    print(f"Saved segments to {output_path}")


def segment_all_files():
    files = os.listdir(TRANSCRIPT_DIR)

    for file in files:
        if not file.endswith(".json"):
            continue

        input_path = os.path.join(TRANSCRIPT_DIR, file)
        file_id = Path(file).stem

        print(f"Segmenting transcript: {file_id}")

        text = load_transcript(input_path)

        tt = text_tiling_segments(text)
        bert = bert_topic_segments(text)

        output = {
            "file": f"{file_id}.json",
            "texttiling_segments": tt,
            "bert_segments": bert,
            "num_texttiling": len(tt),
            "num_bert": len(bert)
        }

        output_path = os.path.join(SEGMENT_OUTPUT_DIR, f"{file_id}.json")

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(output, f, indent=4)

        print(f"Saved segments to {output_path}")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        segment_single_file(sys.argv[1])
    else:
        segment_all_files()
