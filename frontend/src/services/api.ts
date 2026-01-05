const API_URL = import.meta.env.VITE_API_URL

type ChatResponse = {
  reply: string
}

export async function sendMessageToAPI(
  message: string,
  userName?: string
): Promise<string> {
  // Fallback (useful during UI-only testing)
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
      }),
    })

    if (!res.ok) {
      throw new Error("API error")
    }

    const data: ChatResponse = await res.json()

    return data.reply
  } catch (err) {
    return "⚠️ Cortex backend is not responding. Is the server running?"
  }
}