from transformers import pipeline

summarizer = pipeline("summarization", model="philschmid/bart-large-cnn-samsum")

text = "disruption and in the fullness of time at some point even that will be an underestimate even that will be"

print(f"Input: {text}")
print(f"Word count: {len(text.split())}")

try:
    # Testing without the 50-word guard, using same params as summarizer.py
    result = summarizer(
        text,
        max_length=90,
        min_length=5,
        do_sample=False
    )
    print(f"Model Summary: '{result[0]['summary_text']}'")
except Exception as e:
    print(f"Error: {e}")
