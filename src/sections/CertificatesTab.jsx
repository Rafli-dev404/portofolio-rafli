
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

const certificates = [
  {
    image: '/images/sertifikatfe.jpeg',
  },
  {
    image: '/images/sertifikatkompetensi.jpeg',
  },
]

export default function CertificatesTab({ reduceMotion = false }) {
  const [selectedCertificate, setSelectedCertificate] = useState(null)
  const prefersReducedMotion = useReducedMotion()
  const shouldReduceMotion = reduceMotion || prefersReducedMotion

  useEffect(() => {
    if (!selectedCertificate) return

    const previousOverflow = document.body.style.overflow

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedCertificate(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [selectedCertificate])

  return (
    <>
      <div className="grid gap-8 sm:grid-cols-2">
        {certificates.map((certificate) => (
          <article
            key={certificate.image}
            data-portfolio-card
            className="group min-w-0"
          >
            <button
              type="button"
              onClick={() => setSelectedCertificate(certificate)}
              aria-label="Perbesar sertifikat"
              className="block w-full cursor-zoom-in overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] text-left transition-colors duration-300 hover:border-blue-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <img
                src={certificate.image}
                alt="Sertifikat"
                loading="lazy"
                className="aspect-[1.414/1] w-full object-contain"
              />
            </button>
          </article>
        ))}
      </div>

      <AnimatePresence>
        {selectedCertificate && (
          <motion.div
            key="certificate-modal"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.2,
              ease: 'easeOut',
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md sm:p-8"
            onClick={() => setSelectedCertificate(null)}
            role="presentation"
          >
            <button
              type="button"
              onClick={() => setSelectedCertificate(null)}
              aria-label="Tutup gambar"
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-3xl text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              ×
            </button>

            <motion.div
              initial={
                shouldReduceMotion
                  ? false
                  : { opacity: 0, scale: 0.98, y: 8 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                shouldReduceMotion
                  ? undefined
                  : { opacity: 0, scale: 0.98 }
              }
              transition={{
                duration: shouldReduceMotion ? 0 : 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex max-h-full w-full max-w-6xl flex-col items-center"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={selectedCertificate.image}
                alt="Sertifikat"
                className="max-h-[82vh] max-w-full rounded-lg object-contain shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
