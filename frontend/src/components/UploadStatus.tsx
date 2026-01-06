import { useSession } from "../context/SessionContext"

export default function UploadStatus() {
  const { uploadStage } = useSession()

  if (uploadStage === "idle") return null

  const labelMap: Record<string, string> = {
    uploading: "Uploading document…",
    uploaded: "Document uploaded",
    parsing: "Parsing & indexing document…",
    ready: "Cortex is ready to help!",
    error: "Upload failed. Try again.",
  }

  return (
    <div className="mb-3 text-sm text-purple-300 animate-pulse">
      {labelMap[uploadStage]}
    </div>
  )
}