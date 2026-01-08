import nltk
from nltk.tokenize import TextTilingTokenizer

nltk.download("punkt")

def text_tiling_segments(text):
    
    text = text.replace(". ", ".\n\n")
    
    tokenizer = TextTilingTokenizer()
    try:
        segments = tokenizer.tokenize(text)
    except ValueError:
        # Fallback if text is too short or lacks structure
        segments = [text]
    return segments