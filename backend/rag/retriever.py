import numpy as np

def retrieve(query_embedding, chunks, embeddings, top_k=4):
    scores = np.dot(embeddings, query_embedding)
    top_idx = scores.argsort()[-top_k:][::-1]
    return [chunks[i] for i in top_idx]