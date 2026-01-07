from typing import List

DEFAULT_CHUNK_SIZE = 500
DEFAULT_OVERLAP = 80

def chunk_text(
    text: str,
    chunk_size: int = DEFAULT_CHUNK_SIZE,
    overlap: int = DEFAULT_OVERLAP,
) -> List[str]:
    """
    Splits text into overlapping chunks to preserve context.
    """
    if not text or not text.strip():
        return []

    words = text.split()
    chunks = []

    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk = words[start:end]
        chunks.append(" ".join(chunk))

        start = end - overlap
        if start < 0:
            start = 0

    return chunks