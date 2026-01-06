from fastapi import UploadFile
from session_store import set_session
from rag.chunker import chunk_text
from rag.embedder import embed_chunks
from parsers import pdf, docx, ppt, text, image

async def handle_upload(file: UploadFile, session_id: str):
    filename = file.filename.lower()

    if filename.endswith(".pdf"):
        raw_text = pdf.parse(file)
    elif filename.endswith(".docx"):
        raw_text = docx.parse(file)
    elif filename.endswith(".pptx"):
        raw_text = ppt.parse(file)
    elif filename.endswith(".txt"):
        raw_text = text.parse(file)
    else:
        raw_text = image.parse(file)

    chunks = chunk_text(raw_text)
    embeddings = embed_chunks(chunks)

    set_session(session_id, {
        "raw_text": raw_text,
        "chunks": chunks,
        "embeddings": embeddings,
    })