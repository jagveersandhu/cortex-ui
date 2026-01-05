import { useEffect, useRef } from "react"

type Star = {
  x: number
  y: number
  r: number
  o: number
  vx: number
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener("resize", resize)

    const stars: Star[] = Array.from({ length: 140 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.4,
      o: Math.random() * 0.6 + 0.2,
      vx: Math.random() * 0.08 + 0.02,
    }))

    const draw = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const s of stars) {
        s.x += s.vx
        if (s.x > canvas.width) s.x = 0

        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(168, 85, 247, ${s.o})`
        ctx.fill()
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", resize)

      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="
        fixed inset-0
        z-0
        pointer-events-none
        select-none
      "
    />
  )
}