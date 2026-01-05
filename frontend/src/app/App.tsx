import { useState } from "react"
import Sidebar from "../components/Sidebar"
import ChatArea from "../components/ChatArea"
import Starfield from "../components/Starfield"
import NamePromptModal from "../components/NamePromptModal"

export default function App() {
  const [userName, setUserName] = useState<string | null>(null)
  const [showNamePrompt, setShowNamePrompt] = useState(true)

  const [micEnabled, setMicEnabled] = useState(false)
  const [voiceMode, setVoiceMode] = useState(false)

  return (
    <div className="h-screen flex bg-black text-white relative overflow-hidden">
      {/* 🌌 Galaxy Starfield Background */}
      <Starfield />

      {/* Brand (TEXT ONLY – matches previous behavior) */}
      <div
        className="
          fixed top-6 left-1/2 -translate-x-1/2
          z-40
          text-2xl md:text-[26px]
          font-semibold tracking-[0.18em]
          text-white/95
          select-none
        "
      >
        Cortex
      </div>

      {/* Sidebar → mic ON/OFF only */}
      <Sidebar
        micEnabled={micEnabled}
        onMicToggle={setMicEnabled}
      />

      {/* ChatArea → voice overlay + messages */}
      <ChatArea
        userName={userName ?? "there"}
        micEnabled={micEnabled}
        voiceMode={voiceMode}
        onVoiceStart={() => setVoiceMode(true)}
        onVoiceStop={() => setVoiceMode(false)}
      />

      {/* ===============================
          NAME PROMPT MODAL (NON-BLOCKING)
         =============================== */}
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