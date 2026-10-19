
import { useCallback, useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'

import Navbar from './components/Navbar'
import ScrollReveal from './components/ScrollReveal'
import ParticleDrift from './components/ParticleDrift'
import LoadingScreen from './components/LoadingScreen'

import Hero from './sections/Hero'
import About from './sections/About'
import Portofolio from './sections/Portofolio'
import Contact from './sections/Contact'
import ProjectDetail from './sections/ProjectDetail'

function HomePage({ isLoading }) {
  const location = useLocation()

  useEffect(() => {
    if (isLoading || !location.state?.scrollToPortfolio) return

    const timeout = setTimeout(() => {
      const portfolioSection = document.getElementById('portfolio')

      if (portfolioSection) {
        portfolioSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }

      window.history.replaceState({}, document.title, '/')
    }, 300)

    return () => clearTimeout(timeout)
  }, [location.state, isLoading])

  return (
    <div className="relative isolate min-h-screen bg-[#030509]">
      {!isLoading && (
        <>
          <ParticleDrift />

          <div className="relative z-10">
            <Navbar />

            <main>
              <Hero />

              <ScrollReveal>
                <About />
              </ScrollReveal>

              <ScrollReveal delay={0.05}>
                <Portofolio />
              </ScrollReveal>

              <ScrollReveal>
                <Contact />
              </ScrollReveal>
            </main>
          </div>
        </>
      )}
    </div>
  )
}

function AppRoutes() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false)
  }, [])

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<HomePage isLoading={isLoading} />}
        />

        <Route
          path="/project/:slug"
          element={<ProjectDetail />}
        />
      </Routes>

      {isLoading && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
