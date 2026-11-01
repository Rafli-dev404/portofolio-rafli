
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { useReducedMotion } from 'motion/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GlowCard from '../components/GlowCard'

gsap.registerPlugin(ScrollTrigger)

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 transition-colors duration-300 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/10'

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  })

  const [commentForm, setCommentForm] = useState({
    name: '',
    comment: '',
  })

  const [comments, setComments] = useState([])
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState('')

  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const headingLineRef = useRef(null)
  const contactCardRef = useRef(null)
  const commentCardRef = useRef(null)
  const commentListRef = useRef(null)
  const firstCommentRender = useRef(true)

  const reduceMotion = useReducedMotion()

  // Load komentar yang tersimpan.
  useEffect(() => {
    try {
      const saved = localStorage.getItem('portfolio-comments')
      if (saved) setComments(JSON.parse(saved))
    } catch {
      setComments([])
    }
  }, [])

  // Cinematic entrance: heading, light sweep, dan dua card.
  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const heading = headingRef.current
      const line = headingLineRef.current
      const contactCard = contactCardRef.current
      const commentCard = commentCardRef.current

      if (reduceMotion) {
        gsap.set(
          [heading, line, contactCard, commentCard],
          { clearProps: 'all' }
        )
        return
      }

      gsap.set(heading, {
        autoAlpha: 0,
        y: 30,
        filter: 'blur(12px)',
      })

      gsap.set(line, {
        scaleX: 0,
        transformOrigin: 'center',
      })

      gsap.set([contactCard, commentCard], {
        autoAlpha: 0,
        y: 60,
        rotateX: 8,
        scale: 0.96,
        transformPerspective: 1200,
        transformOrigin: 'center bottom',
      })

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 76%',
          toggleActions: 'play none none reverse',
        },
      })
        .to(heading, {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.9,
          ease: 'power4.out',
        })
        .to(line, {
          scaleX: 1,
          duration: 0.8,
          ease: 'power3.inOut',
        }, '-=0.5')
        .to(contactCard, {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 0.95,
          ease: 'power3.out',
        }, '-=0.25')
        .to(commentCard, {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 0.95,
          ease: 'power3.out',
        }, '-=0.7')
        .fromTo(
          section.querySelectorAll('[data-contact-field]'),
          {
            autoAlpha: 0,
            x: -14,
            filter: 'blur(4px)',
          },
          {
            autoAlpha: 1,
            x: 0,
            filter: 'blur(0px)',
            duration: 0.5,
            stagger: 0.075,
            ease: 'power3.out',
          },
          '-=0.45'
        )
    }, section)

    return () => ctx.revert()
  }, [reduceMotion])

  // Tilt 3D dan cahaya yang mengikuti posisi pointer.
  useEffect(() => {
    if (reduceMotion) return

    const cards = [
      contactCardRef.current,
      commentCardRef.current,
    ].filter(Boolean)

    const cleanups = []

    cards.forEach((card) => {
      let bounds

      const updateBounds = () => {
        bounds = card.getBoundingClientRect()
      }

      const onMove = (event) => {
        if (!bounds) updateBounds()

        const x = (event.clientX - bounds.left) / bounds.width
        const y = (event.clientY - bounds.top) / bounds.height

        const rotateY = (x - 0.5) * 5
        const rotateX = (0.5 - y) * 5

        card.style.setProperty('--glow-x', `${x * 100}%`)
        card.style.setProperty('--glow-y', `${y * 100}%`)

        gsap.to(card, {
          rotateX,
          rotateY,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: true,
          transformPerspective: 1200,
        })
      }

      const onLeave = () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.65,
          ease: 'elastic.out(1, 0.65)',
          overwrite: true,
        })
      }

      card.addEventListener('pointerenter', updateBounds)
      card.addEventListener('pointermove', onMove)
      card.addEventListener('pointerleave', onLeave)
      window.addEventListener('resize', updateBounds)

      cleanups.push(() => {
        card.removeEventListener('pointerenter', updateBounds)
        card.removeEventListener('pointermove', onMove)
        card.removeEventListener('pointerleave', onLeave)
        window.removeEventListener('resize', updateBounds)
        gsap.killTweensOf(card)
      })
    })

    return () => cleanups.forEach((cleanup) => cleanup())
  }, [reduceMotion])

  // Reveal komentar terbaru setelah posting.
  useLayoutEffect(() => {
    const list = commentListRef.current
    if (!list) return

    const newest = list.querySelector('[data-new-comment]')

    if (firstCommentRender.current) {
      firstCommentRender.current = false
      return
    }

    if (!newest || reduceMotion) return

    gsap.fromTo(
      newest,
      {
        autoAlpha: 0,
        y: 24,
        scale: 0.97,
        clipPath: 'inset(0 0 18% 0 round 12px)',
      },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        clipPath: 'inset(0 0 0% 0 round 12px)',
        duration: 0.65,
        ease: 'power3.out',
        clearProps: 'clipPath,transform,opacity,visibility',
      }
    )
  }, [comments, reduceMotion])

  const handleContactSubmit = (e) => {
  e.preventDefault()

  const phoneNumber = '6285801345594'

  const message = `Halo, saya ${form.name}.
Email: ${form.email}

Pesan:
${form.message}`

  const whatsappURL =
    `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  window.open(whatsappURL, '_blank', 'noopener,noreferrer')
}

  const handleCommentSubmit = (e) => {
    e.preventDefault()

    const name = commentForm.name.trim()
    const comment = commentForm.comment.trim()

    if (!name || !comment) return

    const newComment = {
      id: `${Date.now()}-${Math.random()}`,
      name,
      comment,
      date: new Date().toISOString(),
    }

    const updated = [newComment, ...comments]

    try {
      localStorage.setItem(
        'portfolio-comments',
        JSON.stringify(updated)
      )

      setComments(updated)
      setCommentForm({ name: '', comment: '' })
      setStatus('')
    } catch {
      setStatus('Komentar gagal disimpan di browser.')
    }
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby="contact-title"
      className="relative isolate scroll-mt-24 overflow-hidden px-5 py-24 sm:px-6"
    >
      {/* Ambient light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-28 -z-10 h-72 w-[min(80vw,700px)] -translate-x-1/2 rounded-full bg-blue-500/[0.07] blur-[100px]"
      />

      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2
            ref={headingRef}
            id="contact-title"
            className="mt-3 font-primary text-3xl font-bold text-white sm:text-4xl"
          >
            Contact Me
          </h2>

          <div className="mx-auto mt-5 h-px w-24 overflow-hidden bg-white/10">
            <div
              ref={headingLineRef}
              className="h-full w-full bg-gradient-to-r from-transparent via-blue-400 to-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-7 lg:grid-cols-2 lg:auto-rows-fr">
          {/* CONTACT CARD */}
          <div
            ref={contactCardRef}
            className="group relative flex min-w-0 lg:h-full"
            style={{
              transformStyle: 'preserve-3d',
              background:
                'radial-gradient(280px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(59,130,246,0.12), transparent 75%)',
            }}
          >
            <GlowCard className="w-full">
              <div className="h-full p-5 sm:p-7">
                <div className="mb-7">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
                    Send a message
                  </span>

                  <h3 className="mt-2 text-xl font-bold text-white">
                    Hubungi Saya
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-white/45">
                    Isi form berikut untuk menghubungi saya secara langsung.
                  </p>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div data-contact-field>
                    <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-white/75">
                      Nama
                    </label>
                    <input
                      id="contact-name"
                      required
                      maxLength={100}
                      autoComplete="name"
                      className={inputClass}
                      placeholder="Masukkan nama kamu"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  <div data-contact-field>
                    <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-white/75">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      maxLength={254}
                      autoComplete="email"
                      className={inputClass}
                      placeholder="nama@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  <div data-contact-field>
                    <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-white/75">
                      Pesan
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      maxLength={5000}
                      rows={5}
                      className={`${inputClass} resize-y`}
                      placeholder="Ceritakan pesan atau ide kamu..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </div>

                  <div data-contact-field>
                    <button
                      type="submit"
                      disabled={sending}
                      className="group/button relative inline-flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-blue-500 px-5 py-3 font-semibold text-white transition-colors duration-300 hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/button:translate-x-[450%]"
                      />
                      <span className="relative">
                        {sending ? 'Mengirim...' : 'Kirim Pesan'}
                      </span>
                      <span
                        aria-hidden="true"
                        className="relative transition-transform duration-300 group-hover/button:translate-x-1 group-hover/button:-translate-y-0.5"
                      >
                        ↗
                      </span>
                    </button>
                  </div>

                  {status && (
                    <p role="status" className="text-sm leading-relaxed text-blue-300">
                      {status}
                    </p>
                  )}
                </form>
              </div>
            </GlowCard>
          </div>

          {/* COMMENT CARD */}
          <div
            ref={commentCardRef}
            className="group relative flex min-w-0 lg:h-full"
            style={{
              transformStyle: 'preserve-3d',
              background:
                'radial-gradient(280px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(59,130,246,0.12), transparent 75%)',
            }}
          >
            <GlowCard className="w-full">
              <div className="flex h-full min-h-[620px] min-w-0 flex-col p-5 sm:p-7">
                <div className="mb-7 shrink-0">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
                    Community
                  </span>

                  <h3 className="mt-2 text-xl font-bold text-white">
                    Tinggalkan Komentar
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-white/45">
                    Tulis kesan, saran, atau sapaan untuk saya.
                  </p>
                </div>

                <form onSubmit={handleCommentSubmit} className="shrink-0 space-y-4">
                  <div data-contact-field>
                    <label htmlFor="comment-name" className="mb-2 block text-sm font-medium text-white/75">
                      Nama
                    </label>
                    <input
                      id="comment-name"
                      required
                      maxLength={80}
                      className={inputClass}
                      placeholder="Nama kamu"
                      value={commentForm.name}
                      onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                    />
                  </div>

                  <div data-contact-field>
                    <label htmlFor="comment-message" className="mb-2 block text-sm font-medium text-white/75">
                      Komentar
                    </label>
                    <textarea
                      id="comment-message"
                      required
                      maxLength={1000}
                      rows={3}
                      className={`${inputClass} resize-y`}
                      placeholder="Tulis komentar kamu..."
                      value={commentForm.comment}
                      onChange={(e) => setCommentForm({ ...commentForm, comment: e.target.value })}
                    />
                  </div>

                  <div data-contact-field>
                    <button
                      type="submit"
                      className="group/button relative inline-flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-blue-400/30 bg-blue-500/10 px-5 py-3 font-semibold text-blue-300 transition-colors duration-300 hover:border-blue-300/50 hover:bg-blue-500/20"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-blue-300/15 to-transparent transition-transform duration-700 group-hover/button:translate-x-[450%]"
                      />
                      <span className="relative">Posting Komentar</span>
                      <span
                        aria-hidden="true"
                        className="relative transition-transform duration-300 group-hover/button:translate-x-1 group-hover/button:-translate-y-0.5"
                      >
                        ↗
                      </span>
                    </button>
                  </div>
                </form>

                <div className="my-7 shrink-0 border-t border-white/10" />

                <div className="mb-4 flex shrink-0 items-center justify-between gap-3">
                  <h4 className="font-semibold text-white">
                    Riwayat Komentar
                  </h4>

                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/50">
                    {comments.length} komentar
                  </span>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-2 [scrollbar-color:rgba(96,165,250,0.4)_transparent] [scrollbar-width:thin]">
                  <div ref={commentListRef} className="space-y-3">
                    {comments.length === 0 ? (
                      <div className="flex min-h-[150px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 px-4 text-center">
                        <p className="text-sm text-white/50">
                          Belum ada komentar.
                        </p>
                        <p className="mt-1 text-xs text-white/30">
                          Jadilah orang pertama yang berkomentar!
                        </p>
                      </div>
                    ) : (
                      comments.map((item, index) => (
                        <article
                          key={item.id}
                          data-new-comment={index === 0 ? 'true' : undefined}
                          className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 transition-colors duration-300 hover:border-blue-400/25 hover:bg-blue-500/[0.035]"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-400/20 bg-blue-500/10 font-semibold text-blue-300">
                              {item.name.charAt(0).toUpperCase()}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="break-words text-sm font-semibold text-white">
                                {item.name}
                              </p>

                              <time dateTime={item.date} className="mt-1 block text-xs text-white/35">
                                {new Date(item.date).toLocaleString('id-ID', {
                                  dateStyle: 'medium',
                                  timeStyle: 'short',
                                })}
                              </time>

                              <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-white/65">
                                {item.comment}
                              </p>
                            </div>
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </GlowCard>
          </div>
        </div>
      </div>
    </section>
  )
}
