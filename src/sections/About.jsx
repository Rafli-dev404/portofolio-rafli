
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ImageTrail from '../components/ImageTrail'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef(null)
  const imageStageRef = useRef(null)
  const spotlightRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const imageStage = imageStageRef.current
    const spotlight = spotlightRef.current

    if (!section || !imageStage || !spotlight) return

    const ctx = gsap.context(() => {
      const title = section.querySelector('#about-title')
      const nameIntro = section.querySelector('.about-name-intro')
      const nameLines = section.querySelectorAll('.about-name-line')
      const image = section.querySelector('.about-image')
      const description = section.querySelector('.about-description')
      const divider = section.querySelector('.about-divider')
      const orbit = section.querySelector('.about-orbit')
      const imageGlow = section.querySelector('.about-image-glow')

      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

      if (reduceMotion) {
        gsap.set(
          [
            title,
            nameIntro,
            nameLines,
            image,
            description,
            divider,
            orbit,
            imageGlow,
          ],
          { clearProps: 'all' },
        )
        gsap.set(spotlight, { autoAlpha: 0 })
        return
      }

      gsap.set(title, {
        autoAlpha: 0,
        y: 24,
        filter: 'blur(8px)',
      })

      gsap.set(nameIntro, {
        autoAlpha: 0,
        x: -28,
      })

      // Animasi nama tanpa overflow-hidden atau yPercent.
      gsap.set(nameLines, {
        autoAlpha: 0,
        y: 35,
        rotateX: -12,
        transformOrigin: 'left center',
      })

      gsap.set(image, {
        autoAlpha: 0,
        scale: 0.84,
        rotateY: -12,
        rotateX: 5,
        transformPerspective: 1000,
      })

      gsap.set(description, {
        autoAlpha: 0,
        x: 35,
        filter: 'blur(6px)',
      })

      gsap.set(divider, {
        scaleX: 0,
        transformOrigin: 'left center',
      })

      gsap.set(orbit, {
        autoAlpha: 0,
        scale: 0.7,
      })

      gsap.set(imageGlow, {
        autoAlpha: 0,
        scale: 0.7,
      })

      gsap.set(spotlight, { autoAlpha: 0 })

      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        defaults: { ease: 'power3.out' },
      })

      intro
        .to(title, {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.75,
        })
        .to(
          nameIntro,
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.65,
          },
          '-=0.3',
        )
        .to(
          nameLines,
          {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            duration: 0.9,
            stagger: 0.13,
            ease: 'back.out(1.35)',
          },
          '-=0.25',
        )
        .to(
          image,
          {
            autoAlpha: 1,
            scale: 1,
            rotateY: 0,
            rotateX: 0,
            duration: 1,
            ease: 'back.out(1.2)',
          },
          '-=0.65',
        )
        .to(
          imageGlow,
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.9,
          },
          '-=0.75',
        )
        .to(
          orbit,
          {
            autoAlpha: 0.65,
            scale: 1,
            duration: 0.9,
          },
          '-=0.8',
        )
        .to(
          description,
          {
            autoAlpha: 1,
            x: 0,
            filter: 'blur(0px)',
            duration: 0.8,
          },
          '-=0.65',
        )
        .to(
          divider,
          {
            scaleX: 1,
            duration: 0.7,
            ease: 'power4.inOut',
          },
          '-=0.4',
        )

      // Parallax saat section digulir.
      gsap.to(nameLines, {
        y: -12,
        stagger: 0.04,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.3,
        },
      })

      gsap.to(image, {
        y: -28,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.4,
        },
      })

      gsap.to(description, {
        y: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      })

      // Orbit dan glow pada gambar.
      gsap.to(orbit, {
        rotate: 360,
        duration: 32,
        repeat: -1,
        ease: 'none',
      })

      gsap.to(imageGlow, {
        scale: 1.1,
        opacity: 0.7,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      // Spotlight mengikuti kursor.
      const moveSpotlight = (event) => {
        const rect = section.getBoundingClientRect()

        gsap.to(spotlight, {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          autoAlpha: 1,
          duration: 0.45,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      }

      const hideSpotlight = () => {
        gsap.to(spotlight, {
          autoAlpha: 0,
          duration: 0.35,
          overwrite: 'auto',
        })
      }

      section.addEventListener('pointermove', moveSpotlight)
      section.addEventListener('pointerleave', hideSpotlight)

      // Tilt gambar mengikuti kursor.
      const tiltImage = (event) => {
        if (event.pointerType === 'touch') return

        const rect = imageStage.getBoundingClientRect()
        const x = (event.clientX - rect.left) / rect.width
        const y = (event.clientY - rect.top) / rect.height

        gsap.to(imageStage, {
          rotateY: (x - 0.5) * 12,
          rotateX: (0.5 - y) * 10,
          duration: 0.5,
          ease: 'power3.out',
          transformPerspective: 1000,
          overwrite: 'auto',
        })
      }

      const resetTilt = () => {
        gsap.to(imageStage, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.55)',
          overwrite: 'auto',
        })
      }

      imageStage.addEventListener('pointermove', tiltImage)
      imageStage.addEventListener('pointerleave', resetTilt)

      return () => {
        section.removeEventListener('pointermove', moveSpotlight)
        section.removeEventListener('pointerleave', hideSpotlight)
        imageStage.removeEventListener('pointermove', tiltImage)
        imageStage.removeEventListener('pointerleave', resetTilt)
      }
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-title"
      className="relative isolate scroll-mt-24 overflow-hidden px-6 py-28 text-white sm:py-36"
    >
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-blue-500/[0.07] blur-[120px]" />
        <div className="absolute -right-32 top-1/4 h-72 w-72 rounded-full bg-indigo-500/[0.06] blur-[100px]" />
        <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-cyan-500/[0.04] blur-[100px]" />
      </div>

      {/* Cursor spotlight */}
      <div
        ref={spotlightRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-0 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
        style={{
          background:
            'radial-gradient(circle, rgba(59,130,246,0.10) 0%, rgba(59,130,246,0.035) 38%, transparent 72%)',
        }}
      />

      <h2
        id="about-title"
        className="relative z-10 mt-3 text-center font-primary text-3xl font-bold text-white sm:text-4xl"
      >
        About Me
      </h2>

      <div className="relative z-10 mx-auto mt-10 grid max-w-[1320px] grid-cols-1 items-center gap-14 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_340px_minmax(0,1fr)] lg:gap-8">
        {/* LEFT: NAME */}
        <div className="relative z-10 text-left lg:translate-x-14">
          <p className="about-name-intro mb-5 text-[clamp(3rem,5.5vw,6rem)] font-bold leading-[0.9] tracking-[-0.055em] text-blue-400">
            Hi, I'm
          </p>

          <h3 className="text-[clamp(3rem,5.5vw,6rem)] font-bold leading-[1.05] tracking-[-0.055em] text-white [perspective:800px]">
            <span className="about-name-line block">Rafli</span>
            <span className="about-name-line block">Rohimat</span>
          </h3>
          

<a
  href="/CV-Rafli-Rohimat.pdf"
  download="CV-Rafli-Rohimat.pdf"
  className="group mt-8 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] py-2.5 pl-3 pr-5 text-sm font-medium text-white/80 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400/40 hover:bg-blue-500/[0.08] hover:text-white hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)]"
>
  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-300 transition-all duration-300 group-hover:border-blue-400/40 group-hover:bg-blue-500/20 group-hover:text-blue-200">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 17v3h14v-3" />
    </svg>
  </span>

  <span className="flex flex-col items-start gap-0.5">
    <span className="text-sm font-semibold tracking-wide">
      Download CV
    </span>
    <span className="text-[11px] font-normal text-white/40 transition-colors group-hover:text-blue-200/70">
      PDF Document
    </span>
  </span>

  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="ml-1 text-white/30 transition-all duration-300 group-hover:translate-y-0.5 group-hover:text-blue-300"
    aria-hidden="true"
  >
    <path d="M12 5v14" />
    <path d="m19 12-7 7-7-7" />
  </svg>
</a>


        </div>

        {/* CENTER: IMAGE */}
        <div
          ref={imageStageRef}
          className="relative z-0 mx-auto flex w-full max-w-[340px] items-center justify-center [transform-style:preserve-3d] lg:translate-y-3"
        >
          <div className="about-orbit pointer-events-none absolute inset-[-7%] rounded-full border border-blue-400/20 [transform:rotateX(62deg)]">
            <span className="absolute left-[14%] top-[16%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.9)]" />
            <span className="absolute bottom-[14%] right-[12%] h-1.5 w-1.5 rounded-full bg-blue-300 shadow-[0_0_15px_rgba(96,165,250,0.9)]" />
          </div>

          <div className="about-image relative z-10 w-full">
            <div className="about-image-glow pointer-events-none absolute -inset-5 -z-10 rounded-[40%] bg-blue-500/20 blur-3xl" />

            <div className="mx-auto w-full max-w-[340px]">
              <ImageTrail />
            </div>
          </div>
        </div>

        {/* RIGHT: DESCRIPTION */}
        <div className="about-description relative z-10 mx-auto w-full max-w-[340px] lg:ml-15 lg:-translate-y-1">
          <p className="text-sm leading-7 text-white/75 sm:text-[15px]">
            Saya adalah web developer yang berfokus pada frontend
            development, dengan minat dalam membangun antarmuka yang
            responsif, fungsional, dan menarik secara visual. Saya terus
            mengembangkan kemampuan melalui berbagai proyek dengan
            mengutamakan pengalaman dan kenyamanan pengguna.
          </p>

          <div className="about-divider mt-7 h-px w-12 bg-blue-400/70" />
          
<a
  href="/#portfolio"
  className="mt-7 inline-flex items-center gap-2 rounded-full bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-blue-400 hover:shadow-[0_8px_30px_rgba(59,130,246,0.3)]"
>
  View Project
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M7 17 17 7" />
    <path d="M7 7h10v10" />
  </svg>
</a>
        </div>
      </div>
    </section>
  )
}
