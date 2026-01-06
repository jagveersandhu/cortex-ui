import { useState } from "react"
import Sidebar from "../components/Sidebar"
import ChatArea from "../components/ChatArea"
import Starfield from "../components/Starfield"
import NamePromptModal from "../components/NamePromptModal"
import { useChat, ChatSession } from "../hooks/useChat"

export default function App() {
  const [userName, setUserName] = useState<string | null>(null)
  const [showNamePrompt, setShowNamePrompt] = useState(true)
  const [isChatView, setIsChatView] = useState(false)

  const [micEnabled, setMicEnabled] = useState(false)
  const [voiceMode, setVoiceMode] = useState(false)

  // 🔑 SINGLE CHAT ENGINE (includes RAG session)
  const chat = useChat()

  const handleLoadHistory = (session: ChatSession) => {
    setVoiceMode(false)
    chat.loadFromHistory(session.id)
    setIsChatView(true)
  }

  const handleNewChat = () => {
    setVoiceMode(false)
    chat.startNewChat() // clears RAG safely
    setIsChatView(true)
  }

  const handleLogoClick = () => {
    setVoiceMode(false)
    chat.resetChat()    // clears RAG + messages
    setIsChatView(false)
    setShowNamePrompt(false)
  }

  return (
    <div className="h-screen flex bg-black text-white relative overflow-hidden">
      <Starfield />

      <button
        onClick={handleLogoClick}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-40"
      >
        Cortex
      </button>

      <Sidebar
        micEnabled={micEnabled}
        onMicToggle={setMicEnabled}
        onHomeClick={handleLogoClick}
        onNewChat={handleNewChat}
        history={chat.history}
        onSelectHistory={handleLoadHistory}
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