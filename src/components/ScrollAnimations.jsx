
import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollAnimations() {
  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (reduceMotion) return

    const ctx = gsap.context(() => {
      // Animasi elemen yang diberi atribut data-reveal.
      gsap.utils.toArray('[data-reveal]').forEach((element) => {
        const direction = element.dataset.reveal || 'up'

        const offsets = {
          up: { y: 40, x: 0 },
          down: { y: -40, x: 0 },
          left: { y: 0, x: 40 },
          right: { y: 0, x: -40 },
        }

        gsap.fromTo(
          element,
          {
            opacity: 0,
            ...offsets[direction],
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            clearProps: 'transform',
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })

      // Animasi bertahap untuk grup kartu.
      gsap.utils.toArray('[data-reveal-group]').forEach((group) => {
        const items = group.querySelectorAll('[data-reveal-item]')

        if (!items.length) return

        gsap.fromTo(
          items,
          {
            opacity: 0,
            y: 28,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.12,
            ease: 'power3.out',
            clearProps: 'transform',
            scrollTrigger: {
              trigger: group,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
    })

    return () => ctx.revert()
  }, [])

  return null
}
