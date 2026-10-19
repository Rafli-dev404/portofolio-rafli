
import { useEffect, useRef } from 'react'

const NODE_COUNT = 25
const BEAM_COUNT = 8

export default function ParticleDrift() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')

    if (!canvas || !ctx) return

    let width = 0
    let height = 0
    let animationId
    let lastTime = 0

    const nodes = []
    const beams = []

    function resize() {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

      width = rect.width
      height = rect.height

      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      nodes.length = 0
      beams.length = 0

      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          radius: 1.5 + Math.random() * 1.5,
          phase: Math.random() * Math.PI * 2,
        })
      }

      for (let i = 0; i < BEAM_COUNT; i++) {
        beams.push({
          x: Math.random() * width,
          y: Math.random() * height,
          length: 50 + Math.random() * 70,
          speed: 0.3 + Math.random() * 0.5,
          opacity: 0.12 + Math.random() * 0.15,
        })
      }
    }

    function draw(timestamp) {
      animationId = requestAnimationFrame(draw)

      const delta = lastTime
        ? Math.min((timestamp - lastTime) / 16.67, 2)
        : 1

      lastTime = timestamp

      ctx.clearRect(0, 0, width, height)

      // Vertical blue light beams
      for (const beam of beams) {
        beam.y += beam.speed * delta

        if (beam.y > height + beam.length) {
          beam.y = -beam.length
          beam.x = Math.random() * width
        }

        const gradient = ctx.createLinearGradient(
          beam.x,
          beam.y,
          beam.x,
          beam.y + beam.length,
        )

        gradient.addColorStop(0, 'rgba(59,130,246,0)')
        gradient.addColorStop(
          0.5,
          `rgba(96,165,250,${beam.opacity})`,
        )
        gradient.addColorStop(1, 'rgba(59,130,246,0)')

        ctx.beginPath()
        ctx.moveTo(beam.x, beam.y)
        ctx.lineTo(beam.x, beam.y + beam.length)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 5
        ctx.stroke()
      }

      // Floating glowing particles
      for (const node of nodes) {
        node.x += node.vx * delta
        node.y += node.vy * delta
        node.phase += 0.015 * delta

        if (node.x < 0) node.x = width
        if (node.x > width) node.x = 0
        if (node.y < 0) node.y = height
        if (node.y > height) node.y = 0

        const pulse = 0.7 + Math.sin(node.phase) * 0.3

        ctx.beginPath()
        ctx.arc(
          node.x,
          node.y,
          node.radius,
          0,
          Math.PI * 2,
        )

        ctx.fillStyle = `rgba(147,197,253,${0.55 * pulse})`
        ctx.shadowBlur = 10
        ctx.shadowColor = '#60A5FA'
        ctx.fill()
        ctx.shadowBlur = 0
      }
    }

    resize()

    window.addEventListener('resize', resize)
    animationId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#030509]"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#030509]/20 via-transparent to-transparent" />

      <div className="absolute inset-0 bg-gradient-to-t from-[#030509]/25 via-transparent to-[#030509]/10" />
    </div>
  )
}
