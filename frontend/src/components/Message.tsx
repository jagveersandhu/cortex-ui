import { Copy, Pencil, RotateCcw } from "lucide-react"

type MessageProps = {
  message: {
    id: string
    role: "user" | "assistant"
    content: string
  }
  onEdit: (id: string) => void
  onRegenerate: (id: string) => void
}

export default function Message({
  message,
  onEdit,
  onRegenerate,
}: MessageProps) {
  const isUser = message.role === "user"

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
  }

  return (
    <div
      className={`
        relative group
        flex ${isUser ? "justify-end" : "justify-start"}
      `}
    >
      {/* ===============================
          MESSAGE BUBBLE
         =============================== */}
      <div
        className={`
          max-w-[75%]
          px-4 py-3 rounded-2xl
          text-sm leading-relaxed
          ${isUser
            ? "bg-white/10 text-white"
            : "bg-white/5 text-white/90"}
        `}
      >
        {message.content}
      </div>

      {/* ===============================
          ACTION BUTTONS (HOVER)
         =============================== */}
      <div
        className={`
          absolute -bottom-7
          ${isUser ? "right-2" : "left-2"}
          flex gap-2
          bg-black/70 backdrop-blur-md
          px-2 py-1 rounded-lg
          border border-white/10
          opacity-0 group-hover:opacity-100
          transition
          z-20
        `}
      >
        <ActionButton onClick={handleCopy} icon={<Copy size={14} />} />

        {isUser && (
          <ActionButton
            onClick={() => onEdit(message.id)}
            icon={<Pencil size={14} />}
          />
        )}

        {!isUser && (
          <ActionButton
            onClick={() => onRegenerate(message.id)}
            icon={<RotateCcw size={14} />}
          />
        )}
      </div>
    </div>
  )
}

/* ===============================
   ACTION BUTTON
   =============================== */

function ActionButton({
  onClick,
  icon,
}: {
  onClick: () => void
  icon: React.ReactNode
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