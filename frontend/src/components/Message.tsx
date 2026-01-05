import { useState } from "react"
import { Copy, Pencil, RotateCcw } from "lucide-react"
import { ChatMessage } from "../hooks/useChat"

type MessageProps = {
  message: ChatMessage
  onEdit: (id: string) => void
  onRegenerate: (id: string) => void
}

export default function Message({
  message,
  onEdit,
  onRegenerate,
}: MessageProps) {
  const [hovered, setHovered] = useState(false)
  const isUser = message.role === "user"

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
  }

  return (
    <div
      className={`relative flex ${isUser ? "justify-end" : "justify-start"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* MESSAGE BUBBLE */}
      <div
        className={`
          max-w-[75%]
          px-4 py-3 rounded-2xl
          text-sm leading-relaxed
          ${isUser ? "bg-white/10 text-white" : "bg-white/5 text-white/90"}
        `}
      >
        {message.content}
      </div>

      {/* ACTIONS */}
      {hovered && (
        <div
          className={`
            absolute -bottom-7
            ${isUser ? "right-2" : "left-2"}
            flex gap-2
            bg-black/70 backdrop-blur-md
            px-2 py-1 rounded-lg
            border border-white/10
            z-20
          `}
        >
          <ActionButton icon={<Copy size={14} />} onClick={handleCopy} />

          {isUser && (
            <ActionButton
              icon={<Pencil size={14} />}
              onClick={() => onEdit(message.id)}
            />
          )}

          {!isUser && (
            <ActionButton
              icon={<RotateCcw size={14} />}
              onClick={() => onRegenerate(message.id)}
            />
          )}
        </div>
      )}
    </div>
  )
}

function ActionButton({
  icon,
  onClick,
}: {
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className="
        p-1 rounded-md
        text-white/70
        hover:text-white
        hover:bg-white/10
        transition
      "
    >
      {icon}
    </button>
  )
}