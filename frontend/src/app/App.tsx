import { useState } from "react"
import Sidebar from "../components/Sidebar"
import ChatArea from "../components/ChatArea"
import Starfield from "../components/Starfield"
import NamePromptModal from "../components/NamePromptModal"
import { useChat } from "../hooks/useChat"

export default function App() {
  const [userName, setUserName] = useState<string | null>(null)

  // onboarding → only once
  const [showNamePrompt, setShowNamePrompt] = useState(true)

  // layout control
  const [isChatView, setIsChatView] = useState(false)

  const [micEnabled, setMicEnabled] = useState(false)
  const [voiceMode, setVoiceMode] = useState(false)

  const chat = useChat()

  /* ===============================
     🏠 LOGO CLICK → WELCOME UI
     =============================== */
  const handleLogoClick = () => {
    setVoiceMode(false)
    chat.resetChat()

    // ⬅️ THIS IS THE KEY
    setIsChatView(false)

    // ❌ never reopen name modal
    setShowNamePrompt(false)

    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  /* ===============================
     ✏️ NEW CHAT → CHAT UI
     =============================== */
  const handleNewChat = () => {
    setVoiceMode(false)
    chat.resetChat()
    setIsChatView(true)
  }

  return (
    <div className="h-screen flex bg-black text-white relative overflow-hidden">
      <Starfield />

      {/* BRAND — CLICKABLE */}
      <button
        onClick={handleLogoClick}
        className="
          fixed top-6 left-1/2 -translate-x-1/2
          z-40
          text-2xl md:text-[26px]
          font-semibold tracking-[0.18em]
          text-white/95
          hover:opacity-90
          transition
          select-none
        "
      >
        Cortex
      </button>

      <Sidebar
        micEnabled={micEnabled}
        onMicToggle={setMicEnabled}
        onHomeClick={handleLogoClick}
        onNewChat={handleNewChat}
      />

      <ChatArea
        userName={userName ?? "there"}
        micEnabled={micEnabled}
        voiceMode={voiceMode}
        isChatView={isChatView}
        onStartChat={() => setIsChatView(true)}
        onVoiceStart={() => setVoiceMode(true)}
        onVoiceStop={() => setVoiceMode(false)}
        chat={chat}
      />

      {/* ONBOARDING — FIRST LOAD ONLY */}
      {showNamePrompt && (
        <NamePromptModal
          onSubmit={(name) => {
            setUserName(name)
            setShowNamePrompt(false)
            setIsChatView(false)
          }}
          onSkip={() => {
            setShowNamePrompt(false)
            setIsChatView(false)
          }}
        />
      )}
    </div>
  )
}