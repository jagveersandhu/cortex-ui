import { UploadResponse } from "../types/upload"

const BASE_URL = "http://localhost:8000"

export async function uploadDocument(file: File): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    throw new Error("Upload failed")
  }

  return res.json()
}