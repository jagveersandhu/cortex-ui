from typing import List
from sentence_transformers import SentenceTransformer
from utils.logger import get_logger

logger = get_logger("embedder")

# Load once
_model = SentenceTransformer("all-MiniLM-L6-v2")

def embed_chunks(chunks: List[str]) -> List[list]:
    """
    Converts text chunks into embeddings.
    """
    if not chunks:
        return []

    logger.info(f"Embedding {len(chunks)} chunks")
    embeddings = _model.encode(chunks, convert_to_numpy=True)

    return embeddings.tolist()