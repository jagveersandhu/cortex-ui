import { useRef, useState } from "react"

export function useSpeechRecognition() {
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const [listening, setListening] = useState(false)

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)

  function start(onResult: (text: string) => void) {
    if (!isSupported) {
      alert("Speech recognition is not supported in this browser.")
      return
    }

    const SpeechRecognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognitionCtor) return

    const recognition = new SpeechRecognitionCtor()

    recognition.lang = "en-US"
    recognition.interimResults = false
    recognition.continuous = false

    recognition.onstart = () => setListening(true)

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      onResult(transcript)
    }

    recognition.onerror = () => {
      setListening(false)
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognition.start()
    recognitionRef.current = recognition
  }

  function stop() {
    recognitionRef.current?.stop()
    setListening(false)
  }

  return {
    start,
    stop,
    listening,
    supported: isSupported,
  }
}