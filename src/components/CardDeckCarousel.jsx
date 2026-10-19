
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

function wrap(index, length) {
  return length ? ((index % length) + length) % length : 0
}

function tiltFor(index, max) {
  const value = (((index + 1) * 2654435761) >>> 0) / 4294967296
  return (value * 2 - 1) * max
}

function isThrow(dx, vx, width) {
  return (
    Math.abs(dx) > width * 0.28 ||
    (Math.abs(vx) > 0.55 && Math.abs(dx) > 24)
  )
}

const CSS = `
.cd-root {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  overflow: hidden;
  color: white;
  outline: none;
  box-sizing: border-box;
}

.cd-deck {
  position: relative;
  width: 100%;
  height: var(--cd-height, auto);
  min-height: 180px;
  touch-action: pan-y;
  perspective: 1200px;
  isolation: isolate;
}

.cd-card {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 16px;
  background: #10131c;
  box-shadow: 0 18px 50px -24px rgba(0,0,0,.8);
  transition:
    transform .6s cubic-bezier(.2,.8,.2,1),
    opacity .4s ease,
    filter .4s ease;
  will-change: transform;
}

.cd-card[data-top="1"] { cursor: grab; }
.cd-card[data-drag="1"] { cursor: grabbing; transition: none; }
.cd-card[data-fly="1"] {
  transition: transform .45s cubic-bezier(.3,.5,.3,1), opacity .45s ease;
}
.cd-card[data-snap="1"] { transition: none; }

.cd-card img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  pointer-events: none;
  user-select: none;
}

.cd-meta {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  min-width: 0;
}

.cd-cap { flex: 1; min-width: 0; overflow: hidden; }

.cd-cap > * {
  display: block;
  animation: cd-in .45s cubic-bezier(.2,.8,.2,1) both;
}

.cd-title {
  font-size: 15px;
  line-height: 1.4;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cd-sub {
  margin-top: 3px;
  font-size: 12px;
  line-height: 1.5;
  color: rgba(255,255,255,.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  animation-delay: .04s;
}

.cd-count {
  flex: none;
  color: rgba(255,255,255,.45);
  font: 500 11px/1 ui-monospace, monospace;
  letter-spacing: .1em;
}

.cd-count b { color: white; font-weight: 500; }

.cd-btn {
  flex: none;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(255,255,255,.14);
  border-radius: 50%;
  background: rgba(255,255,255,.03);
  color: white;
  cursor: pointer;
  transition: background .2s, border-color .2s;
}

.cd-btn:hover {
  background: rgba(255,255,255,.1);
  border-color: rgba(255,255,255,.3);
}

.cd-btn:focus-visible {
  outline: 2px solid #60a5fa;
  outline-offset: 3px;
}

@keyframes cd-in {
  from { transform: translateY(40%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@media (max-width: 640px) {
  .cd-root { gap: 14px; }
  .cd-deck { min-height: 150px; }
  .cd-card { border-radius: 12px; }
  .cd-meta { gap: 8px; }
  .cd-btn { width: 32px; height: 32px; }
  .cd-title { font-size: 13px; }
  .cd-sub { font-size: 11px; }
}

@media (prefers-reduced-motion: reduce) {
  .cd-card, .cd-card[data-fly="1"] { transition: opacity .2s; }
  .cd-cap > * { animation: none; }
}
`

export default function CardDeckCarousel({
  slides = [],
  autoplay = 4200,
  className = '',
  ariaLabel = 'Project screenshots',
}) {
  const count = slides.length
  const [top, setTop] = useState(0)
  const [over, setOver] = useState(null)
  const [deckHeight, setDeckHeight] = useState(0)

  const rootRef = useRef(null)
  const deckRef = useRef(null)
  const busy = useRef(false)
  const lastTouch = useRef(0)
  const topRef = useRef(0)
  const drag = useRef(null)
  const imageRatios = useRef({})

  topRef.current = top

  const reduce = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const later = (callback, ms) => window.setTimeout(callback, ms)

  const updateDeckHeight = useCallback(() => {
    const deck = deckRef.current
    if (!deck) return

    const width = deck.clientWidth
    if (!width) return

    const slide = slides[wrap(topRef.current, slides.length)]
    const ratio = slide?.image ? imageRatios.current[slide.image] : null

    if (ratio && Number.isFinite(ratio) && ratio > 0) {
      setDeckHeight(Math.max(180, width / ratio))
    }
  }, [slides])

  useEffect(() => {
    setTop(0)
    setOver(null)
    busy.current = false
  }, [slides])

  useEffect(() => {
    updateDeckHeight()

    const deck = deckRef.current
    if (!deck) return

    let observer

    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(updateDeckHeight)
      observer.observe(deck)
    }

    window.addEventListener('resize', updateDeckHeight)

    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', updateDeckHeight)
    }
  }, [updateDeckHeight, top])

  const handleImageLoad = (slide, event) => {
    const image = event.currentTarget

    if (image.naturalWidth && image.naturalHeight) {
      imageRatios.current[slide.image] =
        image.naturalWidth / image.naturalHeight
      updateDeckHeight()
    }
  }

  const throwTop = useCallback(
    (direction, fromX = 0, fromY = 0, directionY = 0) => {
      const width = deckRef.current?.offsetWidth || 400
      if (busy.current || count < 2) return

      busy.current = true

      const index = topRef.current
      const sign = direction >= 0 ? 1 : -1

      setOver({
        index,
        x: fromX + sign * width * 1.25,
        y: fromY + directionY * 0.4 - 30,
        rotation: sign * 12,
        mode: 'fly',
      })

      later(() => {
        setOver(null)
        setTop((current) => wrap(current + 1, count))
        busy.current = false
      }, reduce ? 150 : 430)
    },
    [count, reduce],
  )

  const pullBack = useCallback(() => {
    const width = deckRef.current?.offsetWidth || 400
    if (busy.current || count < 2) return

    busy.current = true

    const index = wrap(topRef.current - 1, count)

    setOver({
      index,
      x: -width * 1.25,
      y: -30,
      rotation: -12,
      mode: 'snap',
    })

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setOver({
          index,
          x: 0,
          y: 0,
          rotation: 0,
          mode: 'fly',
        })

        later(() => {
          setOver(null)
          setTop(index)
          busy.current = false
        }, reduce ? 150 : 430)
      })
    })
  }, [count, reduce])

  useEffect(() => {
    if (!autoplay || count < 2) return

    const root = rootRef.current
    let visible = true

    const observer =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting
          })
        : null

    if (root) observer?.observe(root)

    const timer = window.setInterval(() => {
      if (
        !visible ||
        document.hidden ||
        performance.now() - lastTouch.current < autoplay
      ) {
        return
      }

      throwTop(1)
    }, autoplay)

    return () => {
      window.clearInterval(timer)
      observer?.disconnect()
    }
  }, [autoplay, count, throwTop])

  const onPointerDown = (event) => {
    lastTouch.current = performance.now()

    if (
      busy.current ||
      (event.pointerType === 'mouse' && event.button !== 0)
    ) {
      return
    }

    event.currentTarget.setPointerCapture(event.pointerId)

    drag.current = {
      x: event.clientX,
      y: event.clientY,
      lastX: event.clientX,
      lastTime: event.timeStamp,
      velocityX: 0,
    }
  }

  const onPointerMove = (event) => {
    const current = drag.current
    if (!current) return

    const deltaTime = Math.max(1, event.timeStamp - current.lastTime)

    current.velocityX =
      0.8 * ((event.clientX - current.lastX) / deltaTime) +
      0.2 * current.velocityX

    current.lastX = event.clientX
    current.lastTime = event.timeStamp

    const dx = event.clientX - current.x
    const dy = event.clientY - current.y

    setOver({
      index: topRef.current,
      x: dx,
      y: dy,
      rotation: reduce ? 0 : dx * 0.035,
      mode: 'drag',
    })
  }

  const onPointerUp = (event) => {
    const current = drag.current
    drag.current = null
    lastTouch.current = performance.now()

    if (!current) return

    const dx = event.clientX - current.x
    const dy = event.clientY - current.y
    const width = deckRef.current?.offsetWidth || 400

    if (isThrow(dx, current.velocityX, width)) {
      throwTop(dx, dx, dy, dy)
    } else {
      setOver(null)
    }
  }

  const onKeyDown = (event) => {
    lastTouch.current = performance.now()

    if (event.key === 'ArrowRight') {
      throwTop(1)
    } else if (event.key === 'ArrowLeft') {
      pullBack()
    } else {
      return
    }

    event.preventDefault()
  }

  if (!count) return null

  const currentSlide = slides[wrap(top, count)] || {}

  return (
    <div
      ref={rootRef}
      className={['cd-root', className].filter(Boolean).join(' ')}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <style>{CSS}</style>

      <div
        ref={deckRef}
        className="cd-deck"
        style={deckHeight ? { '--cd-height': `${deckHeight}px` } : undefined}
      >
        {slides.map((slide, index) => {
          const depth = wrap(index - top, count)
          const offset = Math.min(depth, 3)

          const pose = {
            y: offset ? -offset * 10 : 0,
            scale: 1 - offset * 0.035,
            rotation: depth === 0 || reduce ? 0 : tiltFor(index, 4),
            opacity: depth > 3 ? 0 : 1,
          }

          const override = over?.index === index ? over : null
          const isTop = depth === 0

          const transform = override
            ? `translate(${override.x}px, ${override.y}px) rotate(${override.rotation}deg)`
            : `translateY(${pose.y}px) scale(${pose.scale}) rotate(${pose.rotation}deg)`

          return (
            <div
              key={`${slide.image || slide.title || 'slide'}-${index}`}
              className="cd-card"
              data-top={isTop ? '1' : '0'}
              data-drag={override?.mode === 'drag' ? '1' : '0'}
              data-fly={override?.mode === 'fly' ? '1' : '0'}
              data-snap={override?.mode === 'snap' ? '1' : '0'}
              style={{
                transform,
                zIndex: override ? count + 1 : count - depth,
                opacity: override ? 1 : pose.opacity,
                filter:
                  override || isTop ? 'none' : 'brightness(0.7)',
              }}
              aria-hidden={!isTop}
              onPointerDown={isTop ? onPointerDown : undefined}
              onPointerMove={isTop ? onPointerMove : undefined}
              onPointerUp={isTop ? onPointerUp : undefined}
              onPointerCancel={isTop ? onPointerUp : undefined}
            >
              {slide.image && (
                <img
                  src={slide.image}
                  alt={isTop ? slide.alt || slide.title || '' : ''}
                  draggable={false}
                  onLoad={(event) => handleImageLoad(slide, event)}
                />
              )}
            </div>
          )
        })}
      </div>

      <div className="cd-meta">
        <button
          type="button"
          className="cd-btn"
          aria-label="Previous screenshot"
          onClick={() => {
            lastTouch.current = performance.now()
            pullBack()
          }}
        >
          <svg
            viewBox="0 0 16 16"
            width="16"
            height="16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10 3 5 8l5 5"
              stroke="currentColor"
              strokeWidth="1.4"
            />
          </svg>
        </button>

        <div className="cd-cap" key={top} aria-hidden="true">
          {currentSlide.title && (
            <span className="cd-title">{currentSlide.title}</span>
          )}
          {currentSlide.caption && (
            <span className="cd-sub">{currentSlide.caption}</span>
          )}
        </div>

        <span className="cd-count" aria-hidden="true">
          <b>{String(top + 1).padStart(2, '0')}</b> /{' '}
          {String(count).padStart(2, '0')}
        </span>

        <button
          type="button"
          className="cd-btn"
          aria-label="Next screenshot"
          onClick={() => {
            lastTouch.current = performance.now()
            throwTop(1)
          }}
        >
          <svg
            viewBox="0 0 16 16"
            width="16"
            height="16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="m6 3 5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.4"
            />
          </svg>
        </button>
      </div>

      <div className="sr-only" aria-live="polite">
        Screenshot {top + 1} of {count}
        {currentSlide.title ? `: ${currentSlide.title}` : ''}
      </div>
    </div>
  )
}
