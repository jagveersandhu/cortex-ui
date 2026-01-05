import { useState, useRef } from "react"
import { sendMessageToAPI } from "../services/api"

export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [draft, setDraft] = useState("")

  // Keep latest messages for regenerate (avoids stale state)
  const messagesRef = useRef<ChatMessage[]>([])
  messagesRef.current = messages

  /* ===============================
     📩 SEND MESSAGE
     =============================== */
  async function sendMessage(text: string) {
    if (!text.trim()) return

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    }

    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    try {
      const response = await sendMessageToAPI(text)

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response,
      }

      setMessages((prev) => [...prev, assistantMsg])
    } finally {
      setLoading(false)
      setDraft("")
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
     🔁 REGENERATE RESPONSE
     =============================== */
  async function regenerate(messageId: string) {
    const current = messagesRef.current
    const index = current.findIndex((m) => m.id === messageId)

    if (index === -1 || current[index].role !== "assistant") return

    const prevUser = [...current]
      .slice(0, index)
      .reverse()
      .find((m) => m.role === "user")

    if (!prevUser) return

    setMessages(current.slice(0, index))
    await sendMessage(prevUser.content)
  }

  /* ===============================
     🏠 RESET CHAT
     =============================== */
  function resetChat() {
    setMessages([])
    setDraft("")
    setLoading(false)
  }

  return {
    messages,
    loading,
    draft,
    setDraft,
    sendMessage,
    editMessage,
    regenerate,
    resetChat,
  }
}

export type UseChatReturn = ReturnType<typeof useChat>