import { useState } from "react"
type NamePromptModalProps = {
  onSubmit: (name: string) => void
  onSkip: () => void
}

export default function NamePromptModal({
  onSubmit,
  onSkip,
}: NamePromptModalProps) {
  const [value, setValue] = useState("")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blur + dim */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      {/* Modal */}
      <div className="relative w-[360px] rounded-2xl bg-[#111] border border-white/10 p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-white mb-2">
          Make Cortex personal
        </h2>

        <p className="text-sm text-white/60 mb-4">
          Enter your name so responses feel more natural.
        </p>

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Your name"
          className="
            w-full mb-4 px-4 py-2 rounded-lg
            bg-black/40 border border-white/10
            text-white outline-none
            focus:ring-1 focus:ring-purple-500
          "
        />

        <div className="flex gap-2 justify-end">
          <button
            onClick={onSkip}
            className="text-sm text-white/50 hover:text-white"
          >
            Skip
          </button>

          <button
            onClick={() => value && onSubmit(value)}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-500"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}