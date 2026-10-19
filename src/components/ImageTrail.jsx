
import { useEffect, useRef } from 'react'

export default function ImageTrail() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    const ctx = canvas?.getContext('2d')

    if (!canvas || !container || !ctx) return

    const original = new Image()
    const samurai = new Image()

    original.src = '/images/profile.png'
    samurai.src = '/images/samurai1.png'

    const settings = {
      radius: 0.20,
      strength: 0.85,
      hardness: 0.60,
      tail: 0.50,
    }

    // Durasi animasi idle.
    const ORIGINAL_TIME = 3000
    const TRANSITION_TIME = 1200
    const SAMURAI_TIME = 2000
    const IDLE_DELAY = 1500
    const INTERACTION_TRANSITION = 250

    const CYCLE_TIME =
      ORIGINAL_TIME +
      TRANSITION_TIME +
      SAMURAI_TIME +
      TRANSITION_TIME

    // Siklus gambar dimulai saat ImageTrail pertama kali masuk viewport.
    let cycleStart = null

    let width = 0
    let height = 0
    let dpr = 1
    let frame = 0

    let lastPointer = null
    let trail = []

    let isInteracting = false
    let lastInteractionTime = 0
    let interactionStart = 0
    let interactionStartOpacity = 0

    let maskCanvas
    let maskCtx
    let blurCanvas
    let blurCtx
    let revealCanvas
    let revealCtx
    let fadeCanvas
    let fadeCtx

    const SCALE = 2.5

    let padX = 0
    let padY = 0
    let fullWidth = 0
    let fullHeight = 0

    function createLayer() {
      const layer = document.createElement('canvas')

      layer.width = Math.ceil(fullWidth * dpr)
      layer.height = Math.ceil(fullHeight * dpr)

      const layerCtx = layer.getContext('2d')

      layerCtx.setTransform(dpr, 0, 0, dpr, 0, 0)

      return [layer, layerCtx]
    }

    function resize() {
      const rect = container.getBoundingClientRect()

      width = rect.width
      height = rect.height

      dpr = Math.min(window.devicePixelRatio || 1, 2)

      fullWidth = width * SCALE
      fullHeight = height * SCALE

      padX = (fullWidth - width) / 2
      padY = (fullHeight - height) / 2

      canvas.width = Math.ceil(fullWidth * dpr)
      canvas.height = Math.ceil(fullHeight * dpr)

      canvas.style.width = `${fullWidth}px`
      canvas.style.height = `${fullHeight}px`
      canvas.style.left = `${-padX}px`
      canvas.style.top = `${-padY}px`

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      ;[maskCanvas, maskCtx] = createLayer()
      ;[blurCanvas, blurCtx] = createLayer()
      ;[revealCanvas, revealCtx] = createLayer()
      ;[fadeCanvas, fadeCtx] = createLayer()
    }

    function drawContain(target, image) {
      if (!image.complete || !image.naturalWidth) return

      const scale =
        Math.min(
          width / image.naturalWidth,
          height / image.naturalHeight
        ) * SCALE

      const drawWidth = image.naturalWidth * scale
      const drawHeight = image.naturalHeight * scale

      target.drawImage(
        image,
        (fullWidth - drawWidth) / 2,
        (fullHeight - drawHeight) / 2,
        drawWidth,
        drawHeight
      )
    }

    function smoothStep(t) {
      t = Math.max(0, Math.min(1, t))
      return t * t * (3 - 2 * t)
    }

    // Opacity samurai berdasarkan animasi otomatis.
    function getIdleSamuraiOpacity(now) {
      // Sebelum terlihat, tampilkan foto profil dan jangan jalankan siklus.
      if (cycleStart === null) return 0

      const elapsed = (now - cycleStart) % CYCLE_TIME

      if (elapsed < ORIGINAL_TIME) {
        return 0
      }

      if (elapsed < ORIGINAL_TIME + TRANSITION_TIME) {
        return smoothStep(
          (elapsed - ORIGINAL_TIME) / TRANSITION_TIME
        )
      }

      if (
        elapsed <
        ORIGINAL_TIME + TRANSITION_TIME + SAMURAI_TIME
      ) {
        return 1
      }

      const fadeProgress =
        (
          elapsed -
          ORIGINAL_TIME -
          TRANSITION_TIME -
          SAMURAI_TIME
        ) / TRANSITION_TIME

      return 1 - smoothStep(fadeProgress)
    }

    // Ketika mouse bergerak, transisikan ke foto profil.
    // Setelah idle, animasi otomatis mengambil alih kembali.
    function getSamuraiOpacity(now) {
      const idleOpacity = getIdleSamuraiOpacity(now)

      if (isInteracting) {
        const progress = smoothStep(
          (now - interactionStart) / INTERACTION_TRANSITION
        )

        const opacity =
          interactionStartOpacity * (1 - progress)

        if (now - lastInteractionTime >= IDLE_DELAY) {
          isInteracting = false
        }

        return opacity
      }

      return idleOpacity
    }

    function applyBottomFade() {
      if (!original.complete || !original.naturalWidth) return

      const scale =
        Math.min(
          width / original.naturalWidth,
          height / original.naturalHeight
        ) * SCALE

      const imageHeight = original.naturalHeight * scale
      const imageBottom = (fullHeight + imageHeight) / 2

      const fadeHeight = imageHeight * 0.30
      const fadeStart = imageBottom - fadeHeight

      const gradient = ctx.createLinearGradient(
        0,
        fadeStart,
        0,
        imageBottom
      )

      gradient.addColorStop(0, 'rgba(0,0,0,0)')
      gradient.addColorStop(0.35, 'rgba(0,0,0,0.12)')
      gradient.addColorStop(0.7, 'rgba(0,0,0,0.5)')
      gradient.addColorStop(1, 'rgba(0,0,0,1)')

      ctx.save()
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = gradient
      ctx.fillRect(0, fadeStart, fullWidth, fadeHeight)
      ctx.restore()
    }

    function handleMove(event) {
      const rect = container.getBoundingClientRect()

      const next = {
        x: event.clientX - rect.left + padX,
        y: event.clientY - rect.top + padY,
      }

      const now = performance.now()

      // Hanya mulai transisi ketika memasuki mode interaksi.
      if (!isInteracting) {
        interactionStartOpacity = getIdleSamuraiOpacity(now)
        interactionStart = now
        isInteracting = true
      }

      lastInteractionTime = now

      if (!lastPointer) {
        trail.push({ ...next, life: 1 })
        lastPointer = next
        return
      }

      const dx = next.x - lastPointer.x
      const dy = next.y - lastPointer.y
      const distance = Math.hypot(dx, dy)

      const spacing = Math.max(
        2,
        Math.min(width, height) * 0.008
      )

      const steps = Math.max(1, Math.ceil(distance / spacing))

      for (let i = 1; i <= steps; i++) {
        const t = i / steps

        trail.push({
          x: lastPointer.x + dx * t,
          y: lastPointer.y + dy * t,
          life: 1,
        })
      }

      lastPointer = next

      if (trail.length > 1800) {
        trail.splice(0, trail.length - 1800)
      }
    }

    function handleLeave() {
      lastPointer = null
    }

    function drawSmoothStroke(target, lineWidth) {
      if (!trail.length) return

      target.beginPath()
      target.lineCap = 'round'
      target.lineJoin = 'round'
      target.lineWidth = lineWidth
      target.strokeStyle = '#fff'
      target.fillStyle = '#fff'

      if (trail.length === 1) {
        target.arc(
          trail[0].x,
          trail[0].y,
          lineWidth / 2,
          0,
          Math.PI * 2
        )

        target.fill()
        return
      }

      target.moveTo(trail[0].x, trail[0].y)

      for (let i = 1; i < trail.length - 1; i++) {
        const current = trail[i]
        const next = trail[i + 1]

        target.quadraticCurveTo(
          current.x,
          current.y,
          (current.x + next.x) / 2,
          (current.y + next.y) / 2
        )
      }

      const last = trail[trail.length - 1]

      target.lineTo(last.x, last.y)
      target.stroke()
    }

    function drawSoftMask() {
      maskCtx.clearRect(0, 0, fullWidth, fullHeight)
      blurCtx.clearRect(0, 0, fullWidth, fullHeight)
      fadeCtx.clearRect(0, 0, fullWidth, fullHeight)

      const radius = Math.min(width, height) * settings.radius
      const innerWidth = radius * 2 * settings.hardness
      const outerWidth = radius * 2

      blurCtx.save()
      blurCtx.filter = `blur(${radius * 0.38}px)`
      blurCtx.globalAlpha = settings.strength

      drawSmoothStroke(blurCtx, outerWidth)

      blurCtx.restore()

      maskCtx.drawImage(blurCanvas, 0, 0, fullWidth, fullHeight)

      maskCtx.save()
      maskCtx.globalCompositeOperation = 'lighter'
      maskCtx.globalAlpha = settings.strength * 0.45

      drawSmoothStroke(maskCtx, innerWidth)

      maskCtx.restore()

      trail.forEach((point) => {
        const r = radius * Math.max(0.05, point.life)

        const gradient = fadeCtx.createRadialGradient(
          point.x,
          point.y,
          r * 0.1,
          point.x,
          point.y,
          r
        )

        gradient.addColorStop(
          0,
          `rgba(255,255,255,${point.life})`
        )

        gradient.addColorStop(
          0.55,
          `rgba(255,255,255,${point.life * 0.85})`
        )

        gradient.addColorStop(
          0.82,
          `rgba(255,255,255,${point.life * 0.35})`
        )

        gradient.addColorStop(1, 'rgba(255,255,255,0)')

        fadeCtx.fillStyle = gradient
        fadeCtx.beginPath()
        fadeCtx.arc(point.x, point.y, r, 0, Math.PI * 2)
        fadeCtx.fill()
      })

      maskCtx.save()
      maskCtx.globalCompositeOperation = 'destination-in'
      maskCtx.drawImage(fadeCanvas, 0, 0, fullWidth, fullHeight)
      maskCtx.restore()
    }

    function render() {
      if (!width || !height) {
        frame = requestAnimationFrame(render)
        return
      }

      const now = performance.now()
      const samuraiOpacity = getSamuraiOpacity(now)

      ctx.clearRect(0, 0, fullWidth, fullHeight)

      // Foto profil.
      if (original.complete && original.naturalWidth) {
        ctx.save()
        ctx.globalAlpha = 1 - samuraiOpacity
        drawContain(ctx, original)
        ctx.restore()
      }

      // Samurai dengan crossfade otomatis.
      if (samurai.complete && samurai.naturalWidth) {
        ctx.save()
        ctx.globalAlpha = samuraiOpacity
        drawContain(ctx, samurai)
        ctx.restore()
      }

      // Trail selalu tersedia, termasuk saat samurai sedang tampil.
      if (
        samurai.complete &&
        samurai.naturalWidth &&
        trail.length > 0
      ) {
        drawSoftMask()

        revealCtx.clearRect(0, 0, fullWidth, fullHeight)
        revealCtx.globalCompositeOperation = 'source-over'
        revealCtx.globalAlpha = 1

        drawContain(revealCtx, samurai)

        revealCtx.globalCompositeOperation = 'destination-in'
        revealCtx.drawImage(
          maskCanvas,
          0,
          0,
          fullWidth,
          fullHeight
        )

        revealCtx.globalCompositeOperation = 'source-over'

        ctx.save()
        ctx.globalAlpha = settings.strength
        ctx.drawImage(
          revealCanvas,
          0,
          0,
          fullWidth,
          fullHeight
        )
        ctx.restore()
      }

      applyBottomFade()

      const fadeSpeed =
        0.012 + (1 - settings.tail) * 0.018

      trail.forEach((point) => {
        point.life = Math.max(0, point.life - fadeSpeed)
      })

      trail = trail.filter((point) => point.life > 0)

      frame = requestAnimationFrame(render)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)

    // Mulai siklus hanya saat gambar pertama kali terlihat di viewport.
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && cycleStart === null) {
          cycleStart = performance.now()
        }
      },
      { threshold: 0.15 },
    )
    visibilityObserver.observe(container)

    original.onerror = () => {
      console.error('Gagal memuat foto:', original.src)
    }

    samurai.onerror = () => {
      console.error('Gagal memuat samurai:', samurai.src)
    }

    resize()
    render()

    // Listener pada container supaya koordinat trail konsisten.
    container.addEventListener('pointermove', handleMove)
    container.addEventListener('pointerleave', handleLeave)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()

      container.removeEventListener('pointermove', handleMove)
      container.removeEventListener('pointerleave', handleLeave)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/5] w-full max-w-md overflow-visible bg-transparent"
    >
      <canvas
        ref={canvasRef}
        className="absolute cursor-crosshair bg-transparent"
      />
    </div>
  )
}
