from src.segmentation.summarizer import summarize_segment

text = "were and the opportunities for work and career that lay in front of you i'm curious tell me how many have you had a pretty good idea of what you wanted to do for your career okay not too many"

print(f"Input: {text}")
print("-" * 20)
summary = summarize_segment(text)
print(f"Summary: {summary}")
