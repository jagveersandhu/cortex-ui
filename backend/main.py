from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import uuid
from io import BytesIO

# =========================
# App Initialization
# =========================

app = FastAPI(
    title="Cortex Backend",
    version="1.1.0",
)

# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# Ollama Config
# =========================

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3.1:8b"

# =========================
# In-Memory Session Store (EPHEMERAL)
# =========================

SESSION_STORE: dict[str, str] = {}

# =========================
# Models
# =========================

class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None
    user_name: str | None = None


class ChatResponse(BaseModel):
    reply: str


class UploadResponse(BaseModel):
    session_id: str
    status: str


# =========================
# Health Check
# =========================

@app.get("/health")
def health():
    return {"status": "ok"}


# =========================
# FILE UPLOAD (EPHEMERAL RAG)
# =========================

@app.post("/upload", response_model=UploadResponse)
async def upload_document(file: UploadFile = File(...)):
    session_id = str(uuid.uuid4())

    # ---- Stage 1: Uploaded
    content = await file.read()

    # ---- Stage 2: Parse
    extracted_text = parse_file(file.filename, content)

    # ---- Stage 3: Store in memory
    SESSION_STORE[session_id] = extracted_text

    return UploadResponse(
        session_id=session_id,
        status="Document parsed and ready"
    )


# =========================
# Chat Endpoint (RAG-AWARE)
# =========================

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    context = ""

    if req.session_id and req.session_id in SESSION_STORE:
        context = SESSION_STORE[req.session_id]

    prompt = build_prompt(
        message=req.message,
        user_name=req.user_name,
        context=context
    )

    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False,
    }

    try:
        response = requests.post(
            OLLAMA_URL,
            json=payload,
            timeout=120
        )
        response.raise_for_status()

        data = response.json()

        return ChatResponse(
            reply=data.get("response", "").strip()
        )

    except Exception:
        return ChatResponse(
            reply="⚠️ Cortex backend error. Ensure Ollama is running."
        )


# =========================
# Prompt Engineering
# =========================

def build_prompt(message: str, user_name: str | None, context: str):
    system_prompt = """
You are Cortex, a premium AI assistant.
You answer strictly based on provided context when available.
If context is insufficient, say so clearly.
Do not mention internal systems or files.
"""

    name_block = f"The user's name is {user_name}." if user_name else ""

    context_block = f"""
DOCUMENT CONTEXT:
{context}
""" if context else ""

    return f"""
{system_prompt}
{name_block}

{context_block}

User: {message}
Cortex:
"""


# =========================
# File Parsers (Phase 1)
# =========================

def parse_file(filename: str, content: bytes) -> str:
    filename = filename.lower()

    # -------- TXT --------
    if filename.endswith(".txt"):
        return content.decode("utf-8", errors="ignore")

    # -------- PDF --------
    if filename.endswith(".pdf"):
        from pypdf import PdfReader
        reader = PdfReader(BytesIO(content))
        return "\n".join(page.extract_text() or "" for page in reader.pages)

    # -------- DOCX --------
    if filename.endswith(".docx"):
        from docx import Document
        doc = Document(BytesIO(content))
        return "\n".join(p.text for p in doc.paragraphs)

    # -------- PPTX --------
    if filename.endswith(".pptx"):
        from pptx import Presentation
        prs = Presentation(BytesIO(content))
        text = []
        for slide in prs.slides:
            for shape in slide.shapes:
                if hasattr(shape, "text"):
                    text.append(shape.text)
        return "\n".join(text)

    # -------- IMAGE OCR --------
    if filename.endswith((".png", ".jpg", ".jpeg", ".bmp", ".tiff")):
        from PIL import Image
        import pytesseract

        # ✅ SET TESSERACT PATH HERE (CRITICAL)
        pytesseract.pytesseract.tesseract_cmd = (
            r"C:\Program Files\Tesseract-OCR\tesseract.exe"
        )

        img = Image.open(BytesIO(content))
        return pytesseract.image_to_string(img)

    return "Unsupported file format."