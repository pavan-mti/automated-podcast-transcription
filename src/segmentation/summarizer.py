from transformers import pipeline

summarizer = pipeline("summarization", model="philschmid/bart-large-cnn-samsum")

def summarize_segment(text):
    # Heuristic: If text is extremely short, just return it
    if len(text.split()) < 3:
        return text

    try:
        result = summarizer(
            text,
            max_length=90,
            min_length=5,
            do_sample=False
        )
        summary = result[0]["summary_text"]
        
        # Fallback if summary is garbage (e.g. ".")
        if len(summary) < 5 or not any(c.isalpha() for c in summary):
            return text
            
        return summary
    except Exception:
        # Fallback on error
        return text