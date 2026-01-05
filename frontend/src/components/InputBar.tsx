import { useState } from "react"
import { Mic, MicOff } from "lucide-react"

type InputBarProps = {
  value: string
  onChange: (value: string) => void
  onSend: (text: string) => void
  onMicClick: () => void
  micEnabled: boolean
}

export default function InputBar({
  value,
  onChange,
  onSend,
  onMicClick,
  micEnabled,
}: InputBarProps) {
  const [focused, setFocused] = useState(false)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!value.trim()) return
        onSend(value)
      }}
      className={`
        w-full flex items-center gap-3
        px-4 py-3 rounded-full
        glass border border-white/10
        transition-all duration-300
        ${
          focused
            ? "glow-purple-strong glow-animate"
            : "glow-purple"
        }
      `}
    >
      {/* ===============================
          INPUT
         =============================== */}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Ask Cortex"
        className="
          flex-1 bg-transparent outline-none
          text-white placeholder:text-white/40
        "
      />

      {/* ===============================
          MIC BUTTON
         =============================== */}
      <button
        type="button"
        onClick={onMicClick}
        className={`
          p-1 rounded-full transition
          ${
            micEnabled
              ? "mic-active glow-purple"
              : "mic-idle hover:text-white"
          }
        `}
        aria-label="Voice input"
      >
        {micEnabled ? <Mic size={18} /> : <MicOff size={18} />}
      </button>
    </form>
  )
}