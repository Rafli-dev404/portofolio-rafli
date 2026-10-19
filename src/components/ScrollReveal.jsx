
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
}) {
  const containerRef = useRef(null)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (reduceMotion) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        container,
        {
          autoAlpha: 0,
          y: 48,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: {
            trigger: container,
            start: 'top 88%',
            toggleActions: 'play none none none',
            once: true,
          },
        },
      )
    }, container)

    return () => ctx.revert()
  }, [delay])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}
