import { useState } from "react"
import { sendMessageToAPI } from "../services/api"

export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [draft, setDraft] = useState("") // 👈 for Edit

  async function sendMessage(text: string) {
    if (!text.trim()) return

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    }

    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    const response = await sendMessageToAPI(text)

    const assistantMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: response,
    }

    setMessages((prev) => [...prev, assistantMsg])
    setLoading(false)
  }

  /* ===============================
     ✏️ EDIT MESSAGE
     =============================== */
  function editMessage(messageId: string) {
    setMessages((prev) => {
      const index = prev.findIndex((m) => m.id === messageId)
      if (index === -1) return prev

      setDraft(prev[index].content)
      return prev.slice(0, index) // remove everything after
    })
  }

  /* ===============================
     🔁 REGENERATE RESPONSE
     =============================== */
  async function regenerate(messageId: string) {
    setMessages((prev) => {
      const index = prev.findIndex((m) => m.id === messageId)
      if (index <= 0) return prev
      return prev.slice(0, index) // remove assistant msg
    })

    const prevUser = messages
      .slice()
      .reverse()
      .find((m) => m.role === "user")

    if (prevUser) {
      await sendMessage(prevUser.content)
    }
  }

  return {
    messages,
    loading,
    sendMessage,
    editMessage,
    regenerate,
    draft,
    setDraft,
  }
}