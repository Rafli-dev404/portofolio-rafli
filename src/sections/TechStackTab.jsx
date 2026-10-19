
import { useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'

const technologies = [
  { name: 'HTML', logo: 'https://cdn.simpleicons.org/html5/E34F26' },
  { name: 'CSS', logo: 'https://cdn.simpleicons.org/css/1572B6' },
  { name: 'JavaScript', logo: 'https://cdn.simpleicons.org/javascript/F7DF1E' },
  { name: 'Tailwind CSS', logo: 'https://cdn.simpleicons.org/tailwindcss/06B6D4' },
  { name: 'React', logo: 'https://cdn.simpleicons.org/react/61DAFB' },
  { name: 'PHP', logo: 'https://cdn.simpleicons.org/php/777BB4' },
  { name: 'Laravel', logo: 'https://cdn.simpleicons.org/laravel/FF2D20' },
  { name: 'Git', logo: 'https://cdn.simpleicons.org/git/F05032' },
  { name: 'Node.js', logo: 'https://cdn.simpleicons.org/nodedotjs/339933' },
  { name: 'Vite', logo: 'https://cdn.simpleicons.org/vite/646CFF' },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.075,
    },
  },
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.92,
    rotateX: 8,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      opacity: { duration: 0.45, ease: 'easeOut' },
      y: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
      scale: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
      rotateX: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
      filter: { duration: 0.5, ease: 'easeOut' },
    },
  },
}

function TechnologyCard({ technology, index, reduceMotion }) {
  const cardRef = useRef(null)

  return (
    <motion.div
      ref={cardRef}
      variants={reduceMotion ? undefined : cardVariants}
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.2 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { delay: index * 0.025 }
      }
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -7,
              scale: 1.025,
              transition: {
                duration: 0.28,
                ease: [0.2, 0.8, 0.2, 1],
              },
            }
      }
      style={{ transformPerspective: 900 }}
      className="group relative flex min-w-0 flex-col items-center"
    >
      {/* Kartu utama */}
      <div className="relative aspect-square w-full max-w-[140px]">
        <div
          className="absolute -inset-px rounded-[1.1rem] bg-gradient-to-br from-sky-400/0 via-cyan-300/0 to-blue-500/0 opacity-0 blur-md transition-all duration-500 group-hover:from-sky-400/25 group-hover:via-cyan-300/10 group-hover:to-blue-500/20 group-hover:opacity-100"
          aria-hidden="true"
        />

        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.07] via-white/[0.025] to-white/[0.01] shadow-lg shadow-black/10 transition-colors duration-500 group-hover:border-sky-300/35 group-hover:bg-sky-400/[0.045]">
          {/* Kilatan cahaya saat hover */}
          <div
            className="pointer-events-none absolute -inset-y-10 -left-1/2 w-1/3 -rotate-[25deg] bg-gradient-to-r from-transparent via-white/[0.13] to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[140%] group-hover:opacity-100"
            aria-hidden="true"
          />

          {/* Lingkaran ambient */}
          <div
            className="pointer-events-none absolute h-24 w-24 rounded-full bg-sky-400/[0.04] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
            aria-hidden="true"
          />

          {/* Ikon */}
          <motion.img
            src={technology.logo}
            alt={technology.name}
            loading="lazy"
            draggable="false"
            initial={false}
            whileHover={
              reduceMotion
                ? undefined
                : {
                    scale: 1.13,
                    rotate: [0, -3, 3, 0],
                    transition: {
                      scale: { duration: 0.3, ease: 'easeOut' },
                      rotate: { duration: 0.45, ease: 'easeInOut' },
                    },
                  }
            }
            className="relative z-10 h-12 w-12 object-contain drop-shadow-[0_0_0px_rgba(56,189,248,0)] transition-[filter] duration-500 group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.22)] sm:h-14 sm:w-14"
          />

          {/* Garis aksen bawah */}
          <div
            className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-300/80 to-transparent transition-all duration-500 group-hover:w-2/3"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Nama teknologi */}
      <motion.p
        className="mt-3 text-center text-sm font-medium text-white/55 transition-colors duration-300 group-hover:text-sky-300 sm:text-base"
      >
        {technology.name}
      </motion.p>
    </motion.div>
  )
}

export default function TechStackTab({ reduceMotion = false }) {
  const prefersReducedMotion = useReducedMotion()
  const shouldReduceMotion = reduceMotion || prefersReducedMotion

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : containerVariants}
      initial={shouldReduceMotion ? false : 'hidden'}
      whileInView={shouldReduceMotion ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.08 }}
      className="mx-auto grid max-w-5xl grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-9 lg:grid-cols-4 xl:grid-cols-5"
    >
      {technologies.map((technology, index) => (
        <TechnologyCard
          key={technology.name}
          technology={technology}
          index={index}
          reduceMotion={shouldReduceMotion}
        />
      ))}
    </motion.div>
  )
}
