import { useState, useRef } from "react"
import { sendMessageToAPI } from "../services/api"
import { generateChatTitle } from "../utils/chatTitle"

/* ===============================
   TYPES
   =============================== */

export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

export type ChatSession = {
  id: string
  title: string
  messages: ChatMessage[]
}

/* ===============================
   HOOK
   =============================== */

export function useChat() {
  /* -------- ACTIVE CHAT -------- */
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [draft, setDraft] = useState("")

  /* -------- SESSION-ONLY HISTORY -------- */
  const [history, setHistory] = useState<ChatSession[]>([])

  /* Prevent stale closures */
  const messagesRef = useRef<ChatMessage[]>([])
  messagesRef.current = messages

  /* ===============================
     📩 SEND MESSAGE (RAG-AWARE)
     =============================== */
  async function sendMessage(
    text: string,
    userName?: string,
    sessionId?: string
  ) {
    if (!text.trim()) return

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    }

    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    try {
      const response = await sendMessageToAPI(
        text,
        userName,
        sessionId
      )

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response,
      }

      setMessages((prev) => [...prev, assistantMsg])
    } finally {
      setLoading(false)
    }
  }

  /* ===============================
     ✏️ EDIT USER MESSAGE
     =============================== */
  function editMessage(messageId: string) {
    setMessages((prev) => {
      const index = prev.findIndex((m) => m.id === messageId)
      if (index === -1) return prev

      const msg = prev[index]
      if (msg.role !== "user") return prev

      setDraft(msg.content)
      return prev.slice(0, index)
    })
  }

  /* ===============================
     🔁 REGENERATE RESPONSE (RAG-AWARE)
     =============================== */
  async function regenerate(
    messageId: string,
    userName?: string,
    sessionId?: string
  ) {
    const current = messagesRef.current
    const index = current.findIndex((m) => m.id === messageId)

    if (index === -1 || current[index].role !== "assistant") return

    const prevUser = [...current]
      .slice(0, index)
      .reverse()
      .find((m) => m.role === "user")

    if (!prevUser) return

    setMessages(current.slice(0, index))
    setLoading(true)

    await sendMessage(
      prevUser.content,
      userName,
      sessionId
    )
  }

  /* ===============================
     🆕 NEW CHAT (ARCHIVE CURRENT)
     =============================== */
  function startNewChat() {
    const currentMessages = messagesRef.current

    if (currentMessages.length > 0) {
      setHistory((prev) => [
        {
          id: crypto.randomUUID(),
          title: generateChatTitle(currentMessages),
          messages: currentMessages,
        },
        ...prev,
      ])
    }

    setMessages([])
    setDraft("")
    setLoading(false)
  }

  /* ===============================
     📂 LOAD FROM HISTORY
     =============================== */
  function loadFromHistory(sessionId: string) {
    const session = history.find((h) => h.id === sessionId)
    if (!session) return

    setMessages(session.messages)
    setDraft("")
    setLoading(false)
  }

  /* ===============================
     🏠 HARD RESET
     =============================== */
  function resetChat() {
    setMessages([])
    setDraft("")
    setLoading(false)
  }

  return {
    /* active chat */
    messages,
    loading,
    draft,
    setDraft,

    /* actions */
    sendMessage,
    editMessage,
    regenerate,

    /* history */
    history,
    startNewChat,
    loadFromHistory,

    /* utility */
    resetChat,
  }
}

export type UseChatReturn = ReturnType<typeof useChat>