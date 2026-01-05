import { Mic, X } from "lucide-react"

export default function VoiceOverlay({
  onClose,
}: {
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/60 hover:text-white"
      >
        <X size={20} />
      </button>

      {/* Mic */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pulse" />

          {/* Button */}
          <div className="relative w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <Mic size={32} className="text-white" />
          </div>
        </div>

        <p className="text-white/60 text-sm">
          You may start speaking
        </p>
      </div>
    </div>
  )
}