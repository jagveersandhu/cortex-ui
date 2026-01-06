import { useState, useRef } from "react"
import { Mic, MicOff, Paperclip } from "lucide-react"

type InputBarProps = {
  value: string
  onChange: (value: string) => void
  onSend: (text: string) => void
  onMicClick: () => void
  onUpload: (file: File) => void
  micEnabled: boolean
}

export default function InputBar({
  value,
  onChange,
  onSend,
  onMicClick,
  onUpload,
  micEnabled,
}: InputBarProps) {
  const [focused, setFocused] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

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
        ${focused ? "glow-purple-strong glow-animate" : "glow-purple"}
      `}
    >
      {/* ===============================
          📎 UPLOAD BUTTON
         =============================== */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="
          p-1 rounded-full
          text-white/60
          hover:text-white
          hover:bg-white/10
          transition
        "
        aria-label="Upload document"
        title="Upload document"
      >
        <Paperclip size={18} />
      </button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept="
          .pdf,
          .doc,.docx,
          .txt,
          .ppt,.pptx,
          image/*
        "
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onUpload(file)
          e.target.value = "" // allow re-upload same file
        }}
      />

      {/* ===============================
          💬 TEXT INPUT
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
        aria-label="Chat input"
      />

      {/* ===============================
          🎙 MIC BUTTON
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
        aria-label={micEnabled ? "Start voice input" : "Mic disabled"}
        title={
          micEnabled
            ? "Speak to dictate"
            : "Enable microphone from sidebar"
        }
      >
        {micEnabled ? <Mic size={18} /> : <MicOff size={18} />}
      </button>
    </form>
  )
}