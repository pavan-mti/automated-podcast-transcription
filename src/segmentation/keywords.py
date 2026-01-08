from keybert import KeyBERT

# Load model once
kw_model = KeyBERT()

def keyword_extractor(text, top_k=8):
    keywords = kw_model.extract_keywords(
        text, 
        keyphrase_ngram_range=(1, 2), 
        stop_words='english', 
        top_n=top_k
    )
    return [kw[0] for kw in keywords]