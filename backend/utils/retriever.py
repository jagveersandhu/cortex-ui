from typing import List
import numpy as np
from utils.logger import get_logger

logger = get_logger("retriever")

def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def retrieve_relevant_chunks(
    query_embedding: List[float],
    chunk_embeddings: List[List[float]],
    chunks: List[str],
    top_k: int = 5,
) -> List[str]:
    """
    Retrieves top-k most relevant chunks.
    """
    if not chunk_embeddings or not chunks:
        return []

    query_vec = np.array(query_embedding)
    scores = []

    for idx, emb in enumerate(chunk_embeddings):
        score = cosine_similarity(query_vec, np.array(emb))
        scores.append((score, idx))

    scores.sort(reverse=True, key=lambda x: x[0])

    top_chunks = [chunks[idx] for _, idx in scores[:top_k]]

    logger.info(f"Retrieved {len(top_chunks)} relevant chunks")

    return top_chunks