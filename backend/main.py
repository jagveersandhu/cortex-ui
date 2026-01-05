from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

# =========================
# App Initialization
# =========================

app = FastAPI(
    title="Cortex Backend",
    version="1.0.0",
)

# =========================
# CORS (REQUIRED FOR FRONTEND)
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",      # Vite
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],             # Handles OPTIONS automatically
    allow_headers=["*"],
)

# =========================
# Ollama Config
# =========================

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3.1:8b"

# =========================
# Request / Response Models
# =========================

class ChatRequest(BaseModel):
    message: str
    user_name: str | None = None


class ChatResponse(BaseModel):
    reply: str


# =========================
# Health Check
# =========================

@app.get("/health")
def health():
    return {"status": "ok"}


# =========================
# Chat Endpoint
# =========================

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    prompt = build_prompt(
        message=req.message,
        user_name=req.user_name
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

    except Exception as e:
        return ChatResponse(
            reply="⚠️ Cortex backend error. Ensure Ollama is running."
        )


# =========================
# Prompt Engineering
# =========================

def build_prompt(message: str, user_name: str | None):
    system_prompt = """
You are Cortex, a premium AI assistant.
You are concise, helpful, and technically strong.
Do not mention being an AI model.
"""

    if user_name:
        user_context = f"The user's name is {user_name}."
    else:
        user_context = ""

    return f"""
{system_prompt}
{user_context}

User: {message}
Cortex:
"""