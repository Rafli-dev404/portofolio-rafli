
import { useEffect, useRef } from 'react'
import './GlowCard.css'

const glowColors = {
  blue: '220',
  purple: '280',
  green: '140',
  red: '0',
  orange: '30',
}

const sizes = {
  sm: 'glow-card--sm',
  md: 'glow-card--md',
  lg: 'glow-card--lg',
}

export default function GlowCard({
  children,
  className = '',
  glowColor = 'blue',
  size = 'md',
  width,
  height,
  customSize = false,
}) {
  const cardRef = useRef(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const handlePointerMove = (event) => {
      const rect = card.getBoundingClientRect()

      card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`)
      card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`)
      card.style.setProperty('--glow-opacity', '1')
    }

    const handlePointerLeave = () => {
      card.style.setProperty('--glow-opacity', '0')
    }

    card.addEventListener('pointermove', handlePointerMove)
    card.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      card.removeEventListener('pointermove', handlePointerMove)
      card.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [])

  const cardStyle = {
    '--glow-color': glowColors[glowColor] ?? glowColors.blue,
    ...(width !== undefined
      ? { width: typeof width === 'number' ? `${width}px` : width }
      : {}),
    ...(height !== undefined
      ? { height: typeof height === 'number' ? `${height}px` : height }
      : {}),
  }

  return (
    <article
      ref={cardRef}
      data-glow-card
      style={cardStyle}
      className={[
        'glow-card',
        'h-full',
        !customSize ? sizes[size] ?? sizes.md : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      <div className="glow-card__effect" aria-hidden="true" />
      <div className="glow-card__content h-full min-h-0">
        {children}
      </div>
    </article>
  )
}
