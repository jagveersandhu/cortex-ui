import { useState } from "react"
import InputBar from "./InputBar"
import Message from "./Message"
import VoiceOverlay from "./VoiceOverlay"
import { useChat } from "../hooks/useChat"

type ChatAreaProps = {
  userName: string
  micEnabled: boolean
  voiceMode: boolean
  onVoiceStart: () => void
  onVoiceStop: () => void
}

export default function ChatArea({
  userName,
  micEnabled,
  voiceMode,
  onVoiceStart,
  onVoiceStop,
}: ChatAreaProps) {
  const {
    messages,
    sendMessage,
    editMessage,
    regenerate,
    draft,
    setDraft,
    loading,
  } = useChat()

  const [showMicWarning, setShowMicWarning] = useState(false)

  const hasStartedChat = messages.length > 0

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

  return (
    <div className="flex-1 relative flex flex-col">
      {/* ===============================
          MAIN CONTENT
         =============================== */}
      <div
        className={`
          flex-1 px-6
          ${
            hasStartedChat
              ? "overflow-y-auto pt-10 pb-36"
              : "flex items-center justify-center"
          }
        `}
      >
        {!hasStartedChat ? (
          /* -------- WELCOME STATE -------- */
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
                onSend={() => {
                  sendMessage(draft)
                  setDraft("")
                }}
                onMicClick={() => {
                  if (!micEnabled) {
                    setShowMicWarning(true)
                    setTimeout(() => setShowMicWarning(false), 2500)
                    return
                  }
                  onVoiceStart()
                }}
              />

              {showMicWarning && (
                <div className="mt-2 text-sm text-purple-300">
                  Mic is disabled. Enable it from the sidebar.
                </div>
              )}
            </div>
          </div>
        ) : (
          /* -------- CHAT STATE -------- */
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            {messages.map((m) => (
              <Message
                key={m.id}
                message={m}
                onEdit={editMessage}
                onRegenerate={regenerate}
              />
            ))}

            {loading && (
              <div className="text-sm text-white/50 italic">
                Cortex is thinking…
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===============================
          BOTTOM INPUT (CHAT ONLY)
         =============================== */}
      {hasStartedChat && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6">
          <InputBar
            value={draft}
            onChange={setDraft}
            micEnabled={micEnabled}
            onSend={() => {
              sendMessage(draft)
              setDraft("")
            }}
            onMicClick={() => {
              if (!micEnabled) {
                setShowMicWarning(true)
                setTimeout(() => setShowMicWarning(false), 2500)
                return
              }
              onVoiceStart()
            }}
          />

          {showMicWarning && (
            <div className="mt-2 text-sm text-purple-300 text-center">
              Mic is disabled. Enable it from the sidebar.
            </div>
          )}
        </div>
      )}
    </div>
  )
}