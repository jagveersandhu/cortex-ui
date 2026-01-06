export type UploadStage =
  | "idle"
  | "uploading"
  | "uploaded"
  | "parsing"
  | "ready"
  | "error"

export type UploadResponse = {
  session_id: string
  status: "uploaded" | "parsed" | "ready"
}