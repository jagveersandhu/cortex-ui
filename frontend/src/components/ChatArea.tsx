import { useState } from "react"
import InputBar from "./InputBar"
import Message from "./Message"
import VoiceOverlay from "./VoiceOverlay"
import { UseChatReturn } from "../hooks/useChat"
import { useSpeechRecognition } from "../hooks/useSpeechRecognition"
import { uploadDocument } from "../services/api"

type ChatAreaProps = {
  userName: string
  micEnabled: boolean
  voiceMode: boolean
  isChatView: boolean
  onStartChat: () => void
  onVoiceStart: () => void
  onVoiceStop: () => void
  chat: UseChatReturn
}

export default function ChatArea({
  userName,
  micEnabled,
  voiceMode,
  isChatView,
  onStartChat,
  onVoiceStart,
  onVoiceStop,
  chat,
}: ChatAreaProps) {
  const {
    messages,
    sendMessage,
    editMessage,
    regenerate,
    draft,
    setDraft,
    loading,
  } = chat

  const [showMicWarning, setShowMicWarning] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)

  // 🔑 Ephemeral RAG session (per chat)
  const [ragSessionId, setRagSessionId] = useState<string | null>(null)

  // 🎙 Speech recognition
  const speech = useSpeechRecognition()

  /* ===============================
     🎤 VOICE OVERLAY
     =============================== */
  if (voiceMode) {
    return (
      <div className="flex-1 relative">
        <VoiceOverlay onClose={onVoiceStop} />
      </div>
    )
  }

  /* ===============================
     📩 SEND MESSAGE (RAG-AWARE)
     =============================== */
  const handleSend = (text: string) => {
    if (!text.trim()) return

    onStartChat()

    // ✅ Clear input immediately (UX-first)
    setDraft("")

    // ✅ Normalize null → undefined
    sendMessage(
      text,
      userName || undefined,
      ragSessionId || undefined
    )
  }

  /* ===============================
     🔁 REGENERATE (RAG-AWARE)
     =============================== */
  const handleRegenerate = (messageId: string) => {
    regenerate(
      messageId,
      userName || undefined,
      ragSessionId || undefined
    )
  }

  /* ===============================
     🎙 MIC
     =============================== */
  const handleMicClick = () => {
    if (!micEnabled) {
      setShowMicWarning(true)
      setTimeout(() => setShowMicWarning(false), 2500)
      return
    }

    speech.start((transcript) => {
      setDraft(transcript)
    })
  }

  /* ===============================
     📎 FILE UPLOAD (EPHEMERAL RAG)
     =============================== */
  const handleUpload = async (file: File) => {
    onStartChat()
    setUploadStatus("📤 Uploading document…")

    try {
      setUploadStatus("📄 Parsing document…")

      const sessionId = await uploadDocument(file)

      // 🔑 Bind document to THIS chat only
      setRagSessionId(sessionId)

      setUploadStatus("🧠 Cortex is ready to help!")
      setTimeout(() => setUploadStatus(null), 2500)
    } catch (err) {
      console.error(err)
      setUploadStatus("⚠️ Failed to process document")
      setTimeout(() => setUploadStatus(null), 3000)
    }
  }

  /* ===============================
     UI
     =============================== */
  return (
    <div className="flex-1 relative flex flex-col">
      <div
        className={`
          flex-1 px-6
          ${isChatView ? "overflow-y-auto pt-10 pb-36" : "flex items-center justify-center"}
        `}
      >
        {!isChatView ? (
          /* -------- WELCOME -------- */
          <div className="w-full max-w-3xl mx-auto flex flex-col items-start -mt-24">
            <div className="mb-3 text-white/80 text-base font-medium">
              ✨ Hi {userName}
            </div>

            <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
              What can I help you with?
            </h1>

            <div className="mt-6 w-full">
              <InputBar
                value={draft}
                onChange={setDraft}
                micEnabled={micEnabled}
                onSend={handleSend}
                onMicClick={handleMicClick}
                onUpload={handleUpload}
              />

              {showMicWarning && (
                <div className="mt-2 text-sm text-purple-300">
                  Mic is disabled. Enable it from the sidebar.
                </div>
              )}

              {uploadStatus && (
                <div className="mt-2 text-sm text-purple-300">
                  {uploadStatus}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* -------- CHAT -------- */
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            {messages.map((m) => (
              <Message
                key={m.id}
                message={m}
                onEdit={editMessage}
                onRegenerate={handleRegenerate}
              />
            ))}

            {(loading || uploadStatus) && (
              <div className="text-sm text-white/50 italic">
                {uploadStatus ?? "Cortex is thinking…"}
              </div>
            )}
          </div>
        )}
      </div>

      {isChatView && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6">
          <InputBar
            value={draft}
            onChange={setDraft}
            micEnabled={micEnabled}
            onSend={handleSend}
            onMicClick={handleMicClick}
            onUpload={handleUpload}
          />
        </div>
      )}
    </div>
  )
}