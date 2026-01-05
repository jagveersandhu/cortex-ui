import { useState } from "react"
import Sidebar from "../components/Sidebar"
import ChatArea from "../components/ChatArea"
import Starfield from "../components/Starfield"
import NamePromptModal from "../components/NamePromptModal"
import { useChat } from "../hooks/useChat"

export default function App() {
  const [userName, setUserName] = useState<string | null>(null)
  const [showNamePrompt, setShowNamePrompt] = useState(true)

  const [micEnabled, setMicEnabled] = useState(false)
  const [voiceMode, setVoiceMode] = useState(false)

  // ✅ SINGLE chat instance
  const chat = useChat()

  /* ===============================
     🏠 HOME CLICK
     =============================== */
  const handleHomeClick = () => {
    setVoiceMode(false)
    chat.resetChat()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="h-screen flex bg-black text-white relative overflow-hidden">
      <Starfield />

      {/* Brand — TEXT ONLY */}
      <button
        onClick={handleHomeClick}
        className="
          fixed top-6 left-1/2 -translate-x-1/2
          z-40
          text-2xl md:text-[26px]
          font-semibold tracking-[0.18em]
          text-white/95
          hover:opacity-90
          transition
        "
      >
        Cortex
      </button>

      <Sidebar
        micEnabled={micEnabled}
        onMicToggle={setMicEnabled}
        onHomeClick={handleHomeClick}
      />

      <ChatArea
        userName={userName ?? "there"}
        micEnabled={micEnabled}
        voiceMode={voiceMode}
        onVoiceStart={() => setVoiceMode(true)}
        onVoiceStop={() => setVoiceMode(false)}
        chat={chat}
      />

      {showNamePrompt && (
        <NamePromptModal
          onSubmit={(name) => {
            setUserName(name)
            setShowNamePrompt(false)
          }}
          onSkip={() => setShowNamePrompt(false)}
        />
      )}
    </div>
  )
}