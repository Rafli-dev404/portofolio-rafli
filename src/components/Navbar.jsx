
import { useState, useRef, useEffect, useCallback } from 'react'

const links = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Portofolio', href: '#portfolio' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  })

  const navRef = useRef(null)
  const tabRefs = useRef([])

  const moveIndicator = useCallback((index) => {
    const tab = tabRefs.current[index]
    const nav = navRef.current

    if (!tab || !nav) return

    const tabRect = tab.getBoundingClientRect()
    const navRect = nav.getBoundingClientRect()

    setIndicator({
      left: tabRect.left - navRect.left,
      width: tabRect.width,
      opacity: 1,
    })
  }, [])

  // Update active navigation saat section berubah.
  useEffect(() => {
    const sections = links
      .map((link) => document.querySelector(link.href))
      .filter(Boolean)

    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio,
          )

        if (!visibleSections.length) return

        const index = links.findIndex(
          (link) => link.href === `#${visibleSections[0].target.id}`,
        )

        if (index !== -1) setActive(index)
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0, 0.1, 0.25, 0.5],
      },
    )

    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  // Geser indikator mengikuti menu aktif.
  useEffect(() => {
    moveIndicator(active)

    const handleResize = () => moveIndicator(active)

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [active, moveIndicator])

  const handleNavigation = (index) => {
    setActive(index)
    setMenuOpen(false)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-transparent">
      <nav className="relative mx-auto flex max-w-6xl justify-center px-6 py-6 sm:py-7">
        {/* Desktop capsule */}
        <div
          ref={navRef}
          className="relative hidden items-center rounded-full border border-white/10 bg-[#080c16]/45 p-2 shadow-lg shadow-black/10 backdrop-blur-xl md:flex"
        >
          {/* Sliding active indicator */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-2 bottom-2 rounded-full border border-blue-400/20 bg-blue-500/15 transition-all duration-300 ease-out"
            style={{
              left: indicator.left,
              width: indicator.width,
              opacity: indicator.opacity,
            }}
          />

          {links.map((link, index) => (
            <a
              key={link.href}
              ref={(element) => {
                tabRefs.current[index] = element
              }}
              href={link.href}
              onClick={() => handleNavigation(index)}
              aria-current={active === index ? 'location' : undefined}
              className={`relative z-10 rounded-full px-5 py-2.5 text-sm transition-colors duration-200 ${
                active === index
                  ? 'text-white'
                  : 'text-white/55 hover:text-white'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="ml-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#080c16]/45 text-white shadow-lg shadow-black/10 backdrop-blur-xl md:hidden"
        >
          <span className="flex w-5 flex-col gap-1.5">
            <span
              className={`h-0.5 w-full rounded-full bg-current transition-transform duration-200 ${
                menuOpen ? 'translate-y-2 rotate-45' : ''
              }`}
            />
            <span
              className={`h-0.5 w-full rounded-full bg-current transition-opacity duration-200 ${
                menuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`h-0.5 w-full rounded-full bg-current transition-transform duration-200 ${
                menuOpen ? '-translate-y-2 -rotate-45' : ''
              }`}
            />
          </span>
        </button>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="absolute right-6 top-[calc(100%-0.5rem)] flex min-w-44 flex-col gap-1 rounded-2xl border border-white/10 bg-[#080c16]/60 p-2 shadow-xl shadow-black/20 backdrop-blur-xl md:hidden">
            {links.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => handleNavigation(index)}
                className={`rounded-xl px-4 py-3 text-sm transition-colors ${
                  active === index
                    ? 'bg-blue-500/15 text-white'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}
