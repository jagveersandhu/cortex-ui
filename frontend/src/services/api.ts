const API_URL = import.meta.env.VITE_API_URL

/* ===============================
   TYPES
   =============================== */

type ChatResponse = {
  reply: string
}

type UploadResponse = {
  session_id: string
  status: string
}

/* ===============================
   💬 CHAT API (RAG-AWARE)
   =============================== */
export async function sendMessageToAPI(
  message: string,
  userName?: string,
  sessionId?: string | null
): Promise<string> {
  // UI-only fallback (frontend without backend)
  if (!API_URL) {
    return `Cortex is thinking about:\n\n"${message}"`
  }

  try {
    const res = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        user_name: userName ?? null,
        session_id: sessionId ?? null, // 🔑 RAG CONTEXT
      }),
    })

    if (!res.ok) {
      throw new Error(`Chat API error: ${res.status}`)
    }

    const data: ChatResponse = await res.json()
    return data.reply
  } catch (error) {
    console.error("Chat API failed:", error)
    return "⚠️ Cortex backend is not responding. Is the server running?"
  }
}

/* ===============================
   📎 FILE UPLOAD API (EPHEMERAL RAG)
   =============================== */
export async function uploadDocument(file: File): Promise<string> {
  if (!API_URL) {
    throw new Error("API URL not configured")
  }

  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    throw new Error(`Upload failed: ${res.status}`)
  }

  const data: UploadResponse = await res.json()

  // ✅ session_id becomes the RAG key for all future chats
  return data.session_id
}