# Cortex

**Cortex** is a personal, premium AI chat application inspired by systems like ChatGPT, Gemini, and Grok — built with a modern UI, voice interaction, session-based memory, and an **ephemeral RAG pipeline** for document understanding.

It is designed as a **local-first, privacy-aware AI assistant** that can reason over user-provided documents **without permanently storing data**.

---

## Key Capabilities

### 🧠 Conversational AI
- High-quality chat interface with streaming-style UX
- Message actions: edit, regenerate, copy
- Context-aware responses powered by a local LLM (via Ollama)

### 🎙 Voice Interaction
- Microphone input with real-time speech-to-text
- Seamless switching between voice and text modes

### 📎 Document Intelligence (Ephemeral RAG)
- Upload documents during a chat session
- Supported formats:
  - PDF  
  - DOC / DOCX  
  - PPT / PPTX  
  - TXT  
  - Images (OCR-based, improving)

Documents are:
- Parsed
- Chunked adaptively
- Embedded
- Retrieved per query

**No persistence** — all data is cleared when the session ends.

### 🗂 Session-Based History
- Multiple chats in a single session
- Switch between topics using **New Chat**
- History exists only for the active session
- No database, no long-term storage

### 🔒 Privacy by Design
- No user data is stored
- No documents are saved
- No embeddings are persisted
- Everything lives in memory only

---

## Architecture Overview

### Frontend
- React + TypeScript
- Premium, minimal UI
- Modular component architecture
- Voice and file upload integrated directly into the chat flow

### Backend
- FastAPI
- Local LLM via Ollama
- Ephemeral RAG pipeline:
  - Parsing
  - Adaptive chunking
  - Embeddings
  - Retrieval
  - Prompt assembly
- Structured logging for observability (excluded from Git)

---

## Ephemeral RAG Design

Cortex does **not** preload data.

Instead:
1. User uploads a document
2. Cortex builds a temporary knowledge context
3. Queries are answered using only that context
4. Context is discarded on new chat or session end

This mirrors **real-world, privacy-first AI workflows**.

---

## Observability & Debugging

Cortex includes structured logging to track:
- File ingestion stages
- Chunking strategy decisions
- Embedding and retrieval timing
- LLM generation latency

Logs are written locally (`cortex.log`) and intentionally excluded from version control.

---

## Current Status

- ✅ Text, PDF, DOCX, PPTX support
- ✅ Session-only RAG
- ✅ Voice input
- ✅ Adaptive chunking & retrieval
- ⚠️ Image understanding via OCR (actively improving)
- 🚫 No long-term memory (by design)

---

## Vision

Cortex is evolving into a **personal AI workstation**:
- Local-first
- Modular
- Transparent
- Privacy-safe

Future phases may include:
- Improved multimodal image reasoning
- Tool calling / MCP-style integrations
- Optional persistent memory (opt-in)
- Model switching and routing

---

## Usage

Cortex is intended to be run locally and customized as a personal AI system.

It is **not a UI-only template anymore** — it is a **full AI application**.