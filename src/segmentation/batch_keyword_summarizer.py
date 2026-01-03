import os
import sys
import json

from src.segmentation.keywords import keyword_extractor
from src.segmentation.summarizer import summarize_segment
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

SEGMENT_DIR = "data/segments"
OUTPUT_DIR = "database"

os.makedirs(OUTPUT_DIR, exist_ok=True)

sentiment_analyzer = SentimentIntensityAnalyzer()


def process_single_file(segment_filename):
    seg_path = os.path.join(SEGMENT_DIR, segment_filename)
    if not os.path.exists(seg_path):
        raise FileNotFoundError(f"Segment file not found: {seg_path}")

    with open(seg_path, "r", encoding="utf-8") as f:
        seg_data = json.load(f)

    bert_segments = seg_data.get("bert_segments", [])
    file_name = seg_data.get("file")

    final_output = []

    for seg in bert_segments:
        sentiment_score = sentiment_analyzer.polarity_scores(
            seg["text"]
        )["compound"]

        record = {
            "file": file_name,
            "segment_id": seg["segment_id"],
            "text": seg["text"],

            # ✅ semantic enrichment
            "summary": summarize_segment(seg["text"]),
            "keywords": keyword_extractor(seg["text"]),

            # ✅ PRESERVED timestamps (DO NOT TOUCH)
            "start_time": seg.get("start_time"),
            "end_time": seg.get("end_time"),

            "sentiment": {
                "score": sentiment_score
            }
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
