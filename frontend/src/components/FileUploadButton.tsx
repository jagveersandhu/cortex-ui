import { Paperclip } from "lucide-react"
import { useRef } from "react"
import { uploadDocument } from "../services/upload"
import { useSession } from "../context/SessionContext"

export default function FileUploadButton() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { setSessionId, setUploadStage, setHasDocument } = useSession()

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadStage("uploading")

      const res = await uploadDocument(file)

      setSessionId(res.session_id)
      setUploadStage("uploaded")

      // simulate backend parsing stage
      setTimeout(() => setUploadStage("parsing"), 500)
      setTimeout(() => {
        setUploadStage("ready")
        setHasDocument(true)
      }, 2000)
    } catch {
      setUploadStage("error")
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="p-1 hover:text-white text-white/70 transition"
        aria-label="Upload document"
      >
        <Paperclip size={18} />
      </button>

      <input
        ref={inputRef}
        type="file"
        hidden
        accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.png,.jpg,.jpeg,.webp"
        onChange={handleFileSelect}
      />
    </>
  )
}