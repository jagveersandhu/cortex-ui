import { useState } from "react"
import {
  Pencil,
  Mic,
  MicOff,
  History,
  ChevronLeft,
} from "lucide-react"
import cortexLogo from "../assets/Cortex_logo.png"

type SidebarProps = {
  micEnabled: boolean
  onMicToggle: (active: boolean) => void
  onHomeClick: () => void
}

export default function Sidebar({
  micEnabled,
  onMicToggle,
  onHomeClick,
}: SidebarProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* =====================================================
          FIXED LOGO — CLICKABLE HOME (GROK STYLE)
         ===================================================== */}
      <div
        className="
          fixed
          top-6
          left-0
          w-16
          z-50
          flex
          justify-center
        "
      >
        <button
          onClick={onHomeClick}
          className="
            w-10 h-10
            flex items-center justify-center
            hover:opacity-90
            transition
          "
          aria-label="Go to home"
        >
          <img
            src={cortexLogo}
            alt="Cortex"
            className="w-10 h-10 object-contain opacity-90"
          />
        </button>
      </div>

      {/* =====================================================
          SIDEBAR
         ===================================================== */}
      <aside
        className={`
          h-full
          bg-black
          border-r border-white/10
          transition-[width] duration-300 ease-in-out
          ${open ? "w-64" : "w-16"}
          flex flex-col
        `}
      >
        {/* Spacer — locks nav under logo */}
        <div className="h-[88px]" />

        {/* =====================================================
            NAV STACK
           ===================================================== */}
        <nav
          className={`
            flex flex-col
            ${open ? "items-stretch" : "items-center"}
            gap-3
            px-2
          `}
        >
          <NavItem
            icon={<Pencil size={20} />}
            label="Chat"
            open={open}
            active
          />

          <NavItem
            icon={micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            label="Voice"
            open={open}
            onClick={() => onMicToggle(!micEnabled)}
          />

          <NavItem
            icon={<History size={20} />}
            label="History"
            open={open}
          />
        </nav>

        <div className="flex-1" />

        {/* =====================================================
            COLLAPSE BUTTON — CORNER BEHAVIOR
           ===================================================== */}
        <div
          className={`
            pb-4
            flex
            ${open ? "justify-end pr-4" : "justify-center"}
          `}
        >
          <button
            onClick={() => setOpen(!open)}
            className="
              w-10 h-10
              rounded-lg
              hover:bg-white/10
              flex items-center justify-center
            "
          >
            <ChevronLeft
              size={18}
              className={`transition-transform ${
                open ? "" : "rotate-180"
              }`}
            />
          </button>
        </div>
      </aside>
    </>
  )
}

/* =====================================================
   NAV ITEM
   ===================================================== */

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
        text-sm
        transition
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