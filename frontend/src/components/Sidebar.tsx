import { useState } from "react"
import {
  Pencil,
  Mic,
  MicOff,
  History,
  ChevronLeft,
} from "lucide-react"
import cortexLogo from "../assets/Cortex_logo.png"
import type { ChatSession } from "../hooks/useChat"

/* ===============================
   PROPS
   =============================== */
type SidebarProps = {
  micEnabled: boolean
  onMicToggle: (active: boolean) => void
  onHomeClick: () => void
  onNewChat: () => void

  /* Session-only history */
  history: ChatSession[]
  onSelectHistory: (session: ChatSession) => void
}

export default function Sidebar({
  micEnabled,
  onMicToggle,
  onHomeClick,
  onNewChat,
  history,
  onSelectHistory,
}: SidebarProps) {
  const [open, setOpen] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  return (
    <>
      {/* ===============================
          FIXED LOGO — HOME
         =============================== */}
      <div className="fixed top-6 left-0 w-16 z-50 flex justify-center">
        <button
          onClick={onHomeClick}
          className="w-10 h-10 flex items-center justify-center hover:opacity-90 transition"
          aria-label="Go to home"
        >
          <img
            src={cortexLogo}
            alt="Cortex"
            className="w-10 h-10 object-contain opacity-90"
          />
        </button>
      </div>

      {/* ===============================
          SIDEBAR
         =============================== */}
      <aside
        className={`
          h-full bg-black border-r border-white/10
          transition-[width] duration-300 ease-in-out
          ${open ? "w-64" : "w-16"}
          flex flex-col
        `}
      >
        {/* spacer for logo */}
        <div className="h-[88px]" />

        <nav
          className={`
            flex flex-col gap-3 px-2
            ${open ? "items-stretch" : "items-center"}
          `}
        >
          {/* NEW CHAT */}
          <NavItem
            icon={<Pencil size={20} />}
            label="Chat"
            open={open}
            active
            onClick={() => {
              onNewChat()
              setShowHistory(false)
            }}
          />

          {/* MIC TOGGLE */}
          <NavItem
            icon={micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            label="Voice"
            open={open}
            onClick={() => onMicToggle(!micEnabled)}
          />

          {/* HISTORY TOGGLE */}
          <NavItem
            icon={<History size={20} />}
            label="History"
            open={open}
            onClick={() => setShowHistory((v) => !v)}
          />

          {/* HISTORY LIST */}
          {open && showHistory && (
            <>
              {history.length > 0 ? (
                <div className="mt-1 space-y-1">
                  {history.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => onSelectHistory(session)}
                      className="
                        w-full text-left px-3 py-2 rounded-lg
                        text-sm text-white/70
                        hover:bg-white/10 hover:text-white
                        transition
                      "
                    >
                      {session.title}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-2 text-xs text-white/40">
                  No history yet
                </div>
              )}
            </>
          )}
        </nav>

        <div className="flex-1" />

        {/* COLLAPSE BUTTON */}
        <div
          className={`pb-4 flex ${
            open ? "justify-end pr-4" : "justify-center"
          }`}
        >
          <button
            onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center"
          >
            <ChevronLeft
              size={18}
              className={`transition-transform ${open ? "" : "rotate-180"}`}
            />
          </button>
        </div>
      </aside>
    </>
  )
}

/* ===============================
   NAV ITEM
   =============================== */
function NavItem({
  icon,
  label,
  open,
  active = false,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  open: boolean
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`
        h-11
        ${
          open
            ? "flex items-center gap-3 px-3 rounded-xl"
            : "w-11 flex items-center justify-center rounded-xl"
        }
        text-sm transition
        ${
          active
            ? "bg-white/10 text-white"
            : "text-white/70 hover:bg-white/10 hover:text-white"
        }
      `}
    >
      {icon}
      {open && <span>{label}</span>}
    </button>
  )
}