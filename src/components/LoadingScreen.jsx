
import { useEffect, useState } from 'react'
import './LoadingScreen.css'

export default function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState('intro')

  useEffect(() => {
  const transitionTimer = setTimeout(() => {
    setPhase('warp')
  }, 2400)

  const completeTimer = setTimeout(() => {
    onComplete?.()
  }, 3300)

  return () => {
    clearTimeout(transitionTimer)
    clearTimeout(completeTimer)
  }
}, [onComplete])

  return (
    <div className={`loader-container phase-${phase}`}>
      <div className="loader-scene">
        
<h1 className="loader-welcome" aria-label="Welcome to my portfolio website">
  {['WELCOME', 'TO', 'MY', 'PORTFOLIO', 'WEBSITE'].map((word, index) => (
    <span
      className="welcome-word"
      key={word}
      style={{ '--word-index': index }}
      aria-hidden="true"
    >
      {word}
    </span>
  ))}
</h1>


        <div className="clouds" aria-hidden="true">
          <div className="cloud cloud1" />
          <div className="cloud cloud2" />
          <div className="cloud cloud3" />
          <div className="cloud cloud4" />
          <div className="cloud cloud5" />
        </div>

        <div className="loader" aria-hidden="true">
          <span>
            <span />
            <span />
            <span />
            <span />
          </span>

          <div className="base">
            <span />
            <div className="face" />
          </div>
        </div>

        <div className="longfazers" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="screen-motion-blur" aria-hidden="true" />
    </div>
  )
}
