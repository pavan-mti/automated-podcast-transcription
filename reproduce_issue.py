from transformers import pipeline

text = "were and the opportunities for work and career that lay in front of you i'm curious tell me how many have you had a pretty good idea of what you wanted to do for your career okay not too many"

print("--- Testing current model (facebook/bart-large-cnn) ---")
try:
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
    summary = summarizer(text, max_length=60, min_length=10, do_sample=False)
    print(f"Summary: {summary[0]['summary_text']}")
except Exception as e:
    print(f"Error: {e}")

print("\n--- Testing alternative model (philschmid/bart-large-cnn-samsum) ---")
try:
    summarizer_alt = pipeline("summarization", model="philschmid/bart-large-cnn-samsum")
    summary_alt = summarizer_alt(text, max_length=60, min_length=10, do_sample=False)
    print(f"Summary: {summary_alt[0]['summary_text']}")
except Exception as e:
    print(f"Error: {e}")
