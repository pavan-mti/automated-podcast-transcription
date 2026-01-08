from sentence_transformers import SentenceTransformer
from nltk.tokenize import sent_tokenize
from sklearn.metrics.pairwise import cosine_similarity
import nltk

nltk.download("punkt", quiet=True)

model = SentenceTransformer("all-MiniLM-L6-v2")

def bert_topic_segments(text, threshold=0.55):
    sentences = sent_tokenize(text)
    
    # Fallback for unpunctuated text (Vosk Small)
    if len(sentences) <= 1:
        words = text.split()
        if len(words) > 20:
             # Chunk into 20-word pseudo-sentences
             chunk_size = 20
             sentences = [" ".join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]
    embeddings = model.encode(sentences)

    segments = []
    current_segment = [sentences[0]]

    for i in range(1, len(sentences)):
        sim = cosine_similarity([embeddings[i]], [embeddings[i-1]])[0][0]

        # Topic shift detected
        if sim < threshold:
            segments.append(" ".join(current_segment))
            current_segment = []

        current_segment.append(sentences[i])

    segments.append(" ".join(current_segment))
    return segments
