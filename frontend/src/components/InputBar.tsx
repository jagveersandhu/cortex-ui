import { Mic, MicOff } from "lucide-react"

type InputBarProps = {
  value: string
  onChange: (value: string) => void
  onSend: () => void
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
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!value.trim()) return
        onSend()
      }}
      className={`
        w-full flex items-center gap-3
        px-4 py-3 rounded-full
        glass border border-white/10
        transition-all duration-300
        ${
          value.length > 0
            ? "glow-purple-strong glow-animate"
            : "glow-purple"
        }
      `}
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ask Cortex"
        className="
          flex-1 bg-transparent outline-none
          text-white placeholder:text-white/40
        "
        autoFocus
      />

      {/* 🎤 Mic Icon */}
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
      >
        {micEnabled ? <Mic size={18} /> : <MicOff size={18} />}
      </button>
    </form>
  )
}