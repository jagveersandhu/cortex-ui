import type { ChatMessage } from "../hooks/useChat"

/**
 * Generate a clean, human-readable chat title
 * from the first user message.
 */
export function generateChatTitle(
  messages: ChatMessage[],
  maxLength = 42
): string {
  const firstUserMessage = messages.find(
    (m) => m.role === "user"
  )

  if (!firstUserMessage) {
    return "New Chat"
  }

  let title = firstUserMessage.content
    .replace(/\s+/g, " ")
    .trim()

  // Remove trailing punctuation
  title = title.replace(/[?.!,:;]+$/, "")

  // Capitalize first letter
  title = title.charAt(0).toUpperCase() + title.slice(1)

  if (title.length > maxLength) {
    title = title.slice(0, maxLength).trim() + "…"
  }

  return title
}