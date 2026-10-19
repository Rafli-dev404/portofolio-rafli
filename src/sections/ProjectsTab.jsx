
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import GlowCard from '../components/GlowCard'
import { projects } from '../data/projects'

export default function ProjectsTab({ reduceMotion = false }) {
  return (
    <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <motion.div
          key={project.slug}
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            duration: reduceMotion ? 0 : 0.5,
            delay: reduceMotion ? 0 : index * 0.1,
          }}
          className="min-w-0"
        >
          <GlowCard className="h-full">
            <Link
              to={`/project/${project.slug}`}
              className="group flex h-full flex-col rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              aria-label={`Lihat detail ${project.title}`}
            >
              <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
                <img
                  src={project.image}
                  alt={`Preview ${project.title}`}
                  loading="lazy"
                  className="aspect-[1.65/1] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-[#03050d]/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="rounded-full border border-white/20 bg-black/30 px-4 py-2 text-sm text-white backdrop-blur-sm">
                    View Details ↗
                  </span>
                </div>
              </div>

              <h3 className="mt-5 text-xl font-bold text-white transition-colors group-hover:text-blue-300">
                {project.title}
              </h3>

              <p className="mt-3 line-clamp-3 text-sm leading-6 text-text-tertiary">
                {project.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-text-tertiary"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex items-center gap-2 pt-5 text-sm font-medium text-blue-300">
                Explore Project
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
          </GlowCard>
        </motion.div>
      ))}
    </div>
  )
}
