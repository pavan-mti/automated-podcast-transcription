from src.segmentation.summarizer import summarize_segment

text = "my friends particularly the ones that felt the most secure in their financial careers found themselves packing up their cubicles"

print(f"Input: {text}")
print("-" * 20)
summary = summarize_segment(text)
print(f"Summary: '{summary}'")
