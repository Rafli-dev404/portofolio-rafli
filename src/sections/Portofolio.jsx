
import { useLayoutEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import ProjectsTab from './ProjectsTab'
import CertificatesTab from './CertificatesTab'
import TechStackTab from './TechStackTab'

gsap.registerPlugin(ScrollTrigger)

const tabs = [
  {
    id: 'projects',
    label: 'Projects',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    id: 'certificates',
    label: 'Certificates',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <circle cx="12" cy="8" r="5" />
        <path d="M8.5 12 7.5 21l4.5-2.5 4.5 2.5-1-9" />
        <path d="m10 8 1.5 1.5L14.5 6" />
      </svg>
    ),
  },
  {
    id: 'techstack',
    label: 'Tech Stack',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="m8 8-4 4 4 4" />
        <path d="m16 8 4 4-4 4" />
        <path d="m14 4-4 16" />
      </svg>
    ),
  },
]

export default function Portofolio() {
  const [activeTab, setActiveTab] = useState('projects')

  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const tabsRef = useRef(null)
  const panelRef = useRef(null)
  const buttonRefs = useRef({})
  const animatedCardsRef = useRef(new WeakSet())

  const reduceMotion = useReducedMotion()

  // Entrance judul saja.
  useLayoutEffect(() => {
    const section = sectionRef.current
    const title = titleRef.current

    if (!section || !title) return

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(title, {
          clearProps: 'all',
        })
        return
      }

      gsap.set(title, {
        autoAlpha: 0,
        y: 22,
        filter: 'blur(8px)',
      })

      gsap.to(title, {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        },
      })
    }, section)

    return () => ctx.revert()
  }, [reduceMotion])

  // Entrance card.
  useLayoutEffect(() => {
    const panel = panelRef.current
    if (!panel) return

    const cards = panel.querySelectorAll('[data-portfolio-card]')

    if (reduceMotion) {
      gsap.set(cards, {
        clearProps: 'opacity,visibility,transform',
      })
      return
    }

    const newCards = Array.from(cards).filter(
      (card) => !animatedCardsRef.current.has(card)
    )

    if (!newCards.length) return

    newCards.forEach((card) => {
      animatedCardsRef.current.add(card)
    })

    gsap.fromTo(
      newCards,
      {
        autoAlpha: 0,
        y: 20,
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'opacity,visibility,transform',
      }
    )
  }, [activeTab, reduceMotion])

  // Hover card ringan.
  useLayoutEffect(() => {
    const panel = panelRef.current
    if (!panel || reduceMotion) return

    const cards = panel.querySelectorAll('[data-portfolio-card]')
    const cleanups = []

    cards.forEach((card) => {
      const onEnter = () => {
        gsap.to(card, {
          y: -5,
          duration: 0.25,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }

      const onLeave = () => {
        gsap.to(card, {
          y: 0,
          duration: 0.3,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      }

      card.addEventListener('pointerenter', onEnter)
      card.addEventListener('pointerleave', onLeave)

      cleanups.push(() => {
        card.removeEventListener('pointerenter', onEnter)
        card.removeEventListener('pointerleave', onLeave)
        gsap.killTweensOf(card)
      })
    })

    return () => cleanups.forEach((cleanup) => cleanup())
  }, [activeTab, reduceMotion])

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      aria-labelledby="portfolio-title"
      className="relative isolate scroll-mt-24 overflow-hidden px-6 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          ref={titleRef}
          id="portfolio-title"
          className="text-center font-primary text-3xl font-bold sm:text-4xl"
        >
          Portofolio
        </h2>

        <div
          ref={tabsRef}
          role="tablist"
          aria-label="Portfolio categories"
          className="mt-10 grid w-full grid-cols-3 gap-1 rounded-2xl border border-white/[0.08] bg-surface-strong p-1.5 sm:gap-2 sm:p-2"
        >
          {tabs.map((tab) => {
            const active = activeTab === tab.id

            return (
              <button
                key={tab.id}
                ref={(node) => {
                  buttonRefs.current[tab.id] = node
                }}
                id={`tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={`panel-${tab.id}`}
                tabIndex={active ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                className={`flex min-w-0 min-h-14 w-full items-center justify-center gap-2 rounded-xl border px-1.5 py-3 text-xs font-semibold transition-colors duration-300 sm:min-h-16 sm:gap-3 sm:px-3 sm:text-base ${
                  active
                    ? 'border-blue-400/20 bg-blue-500/10 text-blue-300 shadow-[0_0_24px_rgba(59,130,246,0.08)]'
                    : 'border-transparent text-text-tertiary hover:text-white'
                }`}
              >
                <span
                  className="flex shrink-0 items-center justify-center"
                  aria-hidden="true"
                >
                  {tab.icon}
                </span>

                <span className="whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>

        <div
          ref={panelRef}
          id={`panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          tabIndex={0}
          className="mt-8 outline-none"
        >
          {activeTab === 'projects' && (
            <ProjectsTab reduceMotion={reduceMotion} />
          )}

          {activeTab === 'certificates' && (
            <CertificatesTab reduceMotion={reduceMotion} />
          )}

          {activeTab === 'techstack' && (
            <TechStackTab reduceMotion={reduceMotion} />
          )}
        </div>
      </div>
    </section>
  )
}
