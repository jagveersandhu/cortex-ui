import { createContext, useContext, useState } from "react"

type UploadStage =
  | "idle"
  | "uploading"
  | "uploaded"
  | "parsing"
  | "ready"
  | "error"

type SessionContextType = {
  sessionId: string | null
  setSessionId: (id: string | null) => void

  uploadStage: UploadStage
  setUploadStage: (stage: UploadStage) => void

  hasDocument: boolean
  setHasDocument: (v: boolean) => void
}

const SessionContext = createContext<SessionContextType | null>(null)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [uploadStage, setUploadStage] = useState<UploadStage>("idle")
  const [hasDocument, setHasDocument] = useState(false)

  return (
    <SessionContext.Provider
      value={{
        sessionId,
        setSessionId,
        uploadStage,
        setUploadStage,
        hasDocument,
        setHasDocument,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) {
    throw new Error("useSession must be used inside SessionProvider")
  }
  return ctx
}