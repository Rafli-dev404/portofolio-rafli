
import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { projects } from '../data/projects'
import CardDeckCarousel from '../components/CardDeckCarousel'

export default function ProjectDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()

  const project = projects.find((item) => item.slug === slug)

  const slides = useMemo(() => {
    if (!project) return []

    const images = Array.isArray(project.detailImages)
      ? project.detailImages
      : [project.detailImage || project.image].filter(Boolean)

    return images.map((image, index) => ({
      image,
      title:
        images.length > 1
          ? `${project.title} — Screenshot ${index + 1}`
          : project.title,
      caption:
        images.length > 1
          ? `Tampilan ${index + 1} dari ${images.length}`
          : 'Project preview',
      alt: `Screenshot ${project.title} ${index + 1}`,
    }))
  }, [project])

  const handleBackToPortfolio = () => {
    navigate('/', {
      state: { scrollToPortfolio: true },
    })
  }

  if (!project) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#03050d] px-6 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Project tidak ditemukan
          </h1>

          <button
            type="button"
            onClick={handleBackToPortfolio}
            className="mt-5 inline-block text-blue-400 transition hover:text-blue-300"
          >
            ← Kembali ke Portfolio
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#03050d] text-white">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-sky-500/[0.09] blur-[130px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-20 h-[450px] w-[450px] rounded-full bg-indigo-500/[0.10] blur-[130px]"
      />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.45 }}
        className="relative mx-auto max-w-7xl px-6 pb-20 pt-28 sm:px-10 sm:pt-36 lg:px-12"
      >
        {/* Breadcrumb */}
        <div className="mb-12 flex flex-wrap items-center gap-3 text-sm">
          <button
            type="button"
            onClick={handleBackToPortfolio}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-white transition hover:border-blue-400/40 hover:bg-white/[0.07]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                d="M19 12H5m7 7-7-7 7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </button>

          <span className="text-white/30">Projects</span>
          <span className="text-white/40">›</span>

          <span className="max-w-[240px] truncate font-medium text-white/90">
            {project.title}
          </span>
        </div>

        {/* Main content */}
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          {/* Left column */}
          <div className="min-w-0">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
              Featured Project
            </p>

            <h1 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
              {project.overview}
            </p>

            <div className="mt-10">
              <h2 className="flex items-center gap-3 text-xl font-bold">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-5 w-5 text-white/60"
                  aria-hidden="true"
                >
                  <path
                    d="m8 8-4 4 4 4m8-8 4 4-4 4m-3-12-2 16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Technologies Used
              </h2>

              <div className="mt-6 flex flex-wrap gap-3">
                {project.tech.map((tech, index) => (
                  <span
                    key={tech}
                    className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm text-white/75 ${
                      index % 2 === 0
                        ? 'border-sky-300/10 bg-sky-300/[0.07]'
                        : 'border-violet-300/10 bg-violet-300/[0.06]'
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      className="h-4 w-4 text-white/60"
                      aria-hidden="true"
                    >
                      <path
                        d="m12 3 9 5v8l-9 5-9-5V8l9-5Z"
                        strokeLinejoin="round"
                      />
                      <path
                        d="m3.5 8.2 8.5 5 8.5-5M12 13.2V21"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {tech}
                  </span>
                ))}
              </div>

              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
                >
                  View Project
                  <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </div>

          {/* Right column: 16:9 screenshot carousel */}
          <div
            className={`min-w-0 ${
              project.slug === 'simad-mit'
                ? 'lg:pt-4'
                : 'lg:pt-12'
            }`}
          >
            {slides.length > 0 ? (
              <CardDeckCarousel
                key={project.slug}
                slides={slides}
                autoplay={4200}
                ariaLabel={`Screenshot carousel for ${project.title}`}
              />
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-sm text-white/50">
                Belum ada gambar proyek.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </main>
  )
}
