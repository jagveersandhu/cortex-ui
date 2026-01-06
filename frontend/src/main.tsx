import React from "react"
import ReactDOM from "react-dom/client"
import App from "./app/App"
import "./index.css"

/* ===============================
   Session Context (Ephemeral RAG)
   =============================== */
import { SessionProvider } from "./context/SessionContext"

ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
).render(
  <React.StrictMode>
    <SessionProvider>
      <App />
    </SessionProvider>
  </React.StrictMode>
)