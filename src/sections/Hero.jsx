
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Hero.css'

gsap.registerPlugin(ScrollTrigger)

function SpotifyPlaylist() {
  return (
    <div className="spotify-card">
      <div className="spotify-card-header">
        <div>
          <p className="spotify-label">MY PLAYLIST</p>
          <h2 className="spotify-heading">Now Playing</h2>
        </div>

        <span className="spotify-status">
          <span className="spotify-status-dot" />
          SPOTIFY
        </span>
      </div>

      <iframe
        title="Spotify Playlist"
        src="https://open.spotify.com/embed/playlist/0Zlt2aSEJrPiQ72Vj2gRWd?utm_source=generator&theme=0"
        width="100%"
        height="352"
        style={{ border: 0 }}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />

      <p className="spotify-caption">
        A little soundtrack to my world.
      </p>
    </div>
  )
}

export default function Hero() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const spotifyRef = useRef(null)
  const spotlightRef = useRef(null)
  const ambientRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const spotifyStage = spotifyRef.current
    const spotlight = spotlightRef.current
    const ambient = ambientRef.current

    if (
      !section ||
      !stage ||
      !spotifyStage ||
      !spotlight ||
      !ambient
    ) {
      return
    }

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const desktop = window.matchMedia(
      '(min-width: 1024px)',
    ).matches

    const ctx = gsap.context(() => {
      const intro = section.querySelector('.hero-content')
      const titleLines = section.querySelectorAll('.hero-title-line')
      const titleMasks = section.querySelectorAll('.hero-title-mask')
      const descriptions = section.querySelectorAll('.hero-description')
      const actions = section.querySelector('.hero-actions')
      const accent = section.querySelector('.hero-accent')
      const spotify = section.querySelector('.hero-spotify')
      const buttons = section.querySelectorAll('.hero-actions a')

      if (reduceMotion) {
        gsap.set(
          [
            stage,
            intro,
            titleLines,
            titleMasks,
            descriptions,
            actions,
            accent,
            spotify,
          ],
          {
            clearProps: 'all',
          },
        )

        gsap.set(spotlight, { autoAlpha: 0 })
        gsap.set(ambient, { clearProps: 'all' })

        ScrollTrigger.refresh()
        return
      }

      // Initial states
      gsap.set(stage, { autoAlpha: 0 })

      gsap.set(titleLines, {
        yPercent: 125,
        rotateX: -35,
        autoAlpha: 0,
        transformOrigin: 'left bottom',
      })

      gsap.set(descriptions, {
        y: 30,
        autoAlpha: 0,
        filter: 'blur(10px)',
      })

      gsap.set(actions, {
        y: 24,
        autoAlpha: 0,
      })

      gsap.set(spotify, {
        x: 90,
        y: 35,
        rotateY: -18,
        rotateX: 8,
        scale: 0.88,
        autoAlpha: 0,
        transformPerspective: 1200,
        transformOrigin: 'center center',
      })

      gsap.set(accent, {
        backgroundPosition: '100% 50%',
      })

      gsap.set(spotlight, {
        autoAlpha: 0,
      })

      // Cinematic entrance
      const entrance = gsap.timeline({
        defaults: {
          ease: 'power4.out',
        },
        onComplete: () => {
          ScrollTrigger.refresh()
        },
      })

      entrance
        .to(stage, {
          autoAlpha: 1,
          duration: 0.35,
        })
        .fromTo(
          titleMasks,
          {
            clipPath: 'inset(0 0 100% 0)',
          },
          {
            clipPath: 'inset(0 0 0% 0)',
            duration: 0.85,
            stagger: 0.12,
            ease: 'power3.inOut',
          },
          '-=0.1',
        )
        .to(
          titleLines,
          {
            yPercent: 0,
            rotateX: 0,
            autoAlpha: 1,
            duration: 1.15,
            stagger: 0.12,
            ease: 'expo.out',
          },
          '<',
        )
        .to(
          descriptions,
          {
            y: 0,
            autoAlpha: 1,
            filter: 'blur(0px)',
            duration: 0.85,
            stagger: 0.12,
          },
          '-=0.55',
        )
        .to(
          actions,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.75,
            ease: 'back.out(1.5)',
          },
          '-=0.45',
        )
        .to(
          spotify,
          {
            x: 0,
            y: 0,
            rotateY: 0,
            rotateX: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 1.25,
            ease: 'expo.out',
          },
          '-=0.8',
        )

      // Animated title gradient
      gsap.to(accent, {
        backgroundPosition: '0% 50%',
        duration: 2.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })

      // Ambient background drift
      gsap.to(ambient, {
        x: 36,
        y: -22,
        scale: 1.12,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      // Desktop scroll transition
      if (desktop && intro) {
        gsap.to(intro, {
          y: -100,
          x: -16,
          scale: 0.94,
          autoAlpha: 0,
          filter: 'blur(5px)',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8,
          },
        })

        gsap.to(spotify, {
          y: -65,
          rotateY: 5,
          scale: 0.96,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        })
      }

      // Pointer spotlight
      const moveSpotlight = (event) => {
        const rect = section.getBoundingClientRect()

        gsap.to(spotlight, {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          autoAlpha: 1,
          duration: 0.5,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      }

      const hideSpotlight = () => {
        gsap.to(spotlight, {
          autoAlpha: 0,
          duration: 0.45,
          overwrite: 'auto',
        })
      }

      section.addEventListener('pointermove', moveSpotlight)
      section.addEventListener('pointerleave', hideSpotlight)

      // 3D tilt for Spotify card
      const tiltSpotify = (event) => {
        if (event.pointerType === 'touch') return

        const rect = spotifyStage.getBoundingClientRect()
        if (!rect.width || !rect.height) return

        const x = (event.clientX - rect.left) / rect.width
        const y = (event.clientY - rect.top) / rect.height

        gsap.to(spotifyStage, {
          rotateY: (x - 0.5) * 12,
          rotateX: (0.5 - y) * 9,
          duration: 0.55,
          ease: 'power3.out',
          transformPerspective: 1200,
          overwrite: 'auto',
        })
      }

      const resetSpotifyTilt = () => {
        gsap.to(spotifyStage, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.9,
          ease: 'elastic.out(1, 0.55)',
          overwrite: 'auto',
        })
      }

      spotifyStage.addEventListener('pointermove', tiltSpotify)
      spotifyStage.addEventListener('pointerleave', resetSpotifyTilt)

      // Magnetic buttons
      const buttonCleanups = []

      buttons.forEach((button) => {
        const moveButton = (event) => {
          if (event.pointerType === 'touch') return

          const rect = button.getBoundingClientRect()
          const dx =
            event.clientX - (rect.left + rect.width / 2)
          const dy =
            event.clientY - (rect.top + rect.height / 2)

          gsap.to(button, {
            x: dx * 0.1,
            y: dy * 0.14,
            duration: 0.35,
            ease: 'power3.out',
            overwrite: 'auto',
          })
        }

        const resetButton = () => {
          gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.65,
            ease: 'elastic.out(1, 0.45)',
            overwrite: 'auto',
          })
        }

        button.addEventListener('pointermove', moveButton)
        button.addEventListener('pointerleave', resetButton)

        buttonCleanups.push(() => {
          button.removeEventListener('pointermove', moveButton)
          button.removeEventListener('pointerleave', resetButton)
        })
      })

      return () => {
        entrance.kill()

        section.removeEventListener('pointermove', moveSpotlight)
        section.removeEventListener('pointerleave', hideSpotlight)

        spotifyStage.removeEventListener('pointermove', tiltSpotify)
        spotifyStage.removeEventListener('pointerleave', resetSpotifyTilt)

        buttonCleanups.forEach((cleanup) => cleanup())
      }
    }, section)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="home"
      className="hero-scroll relative isolate overflow-clip bg-transparent text-white"
    >
      {/* Ambient light */}
      <div
        ref={ambientRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-[25%] top-[10%] z-0 h-[500px] w-[500px] rounded-full bg-blue-600/[0.10] blur-[140px]"
      />

      {/* Interactive spotlight */}
      <div
        ref={spotlightRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-0 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 opacity-0"
        style={{
          background:
            'radial-gradient(circle, rgba(59,130,246,0.13) 0%, rgba(59,130,246,0.045) 38%, transparent 72%)',
        }}
      />

      <div
        ref={stageRef}
        className="hero-scroll-stage relative z-10 flex min-h-[600px] h-svh w-full items-center"
      >
        <div className="hero-layout relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-24 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-10">
          {/* Hero content */}
          <div className="hero-content relative z-10">
            <h1 className="max-w-4xl text-5xl leading-[1.05] font-bold tracking-[-0.055em] sm:text-7xl lg:text-8xl [perspective:1000px]">
              <span className="hero-title-mask block overflow-hidden">
                <span className="hero-title-line block">
                  Building for
                </span>
              </span>

              <span className="hero-title-mask block overflow-hidden">
                <span className="hero-title-line hero-accent block bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400 bg-[length:200%_100%] bg-clip-text text-transparent">
                  the Web.
                </span>
              </span>
            </h1>

            <p className="hero-description mt-5 max-w-xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
              Mengembangkan pengalaman digital yang menggabungkan
              desain antarmuka, fungsionalitas, dan kenyamanan pengguna.
              Dari ide hingga implementasi, setiap detail dirancang
              untuk menciptakan produk digital yang responsif,
              intuitif, dan bermakna.
            </p>

            <div className="hero-actions mt-9 flex flex-wrap gap-4">
              <a
                href="#portfolio"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-blue-500"
              >
                Explore Projects
                <span aria-hidden="true">↗</span>
              </a>

              <a
                href="#contact"
                className="inline-flex items-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:border-white/35 hover:bg-white/[0.05]"
              >
                Let&apos;s Connect
              </a>
            </div>
          </div>

          {/* Spotify playlist */}
          <div
            ref={spotifyRef}
            className="hero-spotify relative z-10 [transform-style:preserve-3d]"
          >
            <SpotifyPlaylist />
          </div>
        </div>
      </div>
    </section>
  )
}
