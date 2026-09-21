import { useState, useEffect } from 'react'
import { Rocket, FastForward, Orbit, Terminal, ShieldCheck } from 'lucide-react'
import { soundManager } from '../../utils/audio'

export default function CinematicIntro({ onLaunch }) {
  const [phase, setPhase] = useState(0) // 0: Pure Black Screen, 1: Title, 2: Boot sequence, 3: Mission directive, 4: Ready for Launch
  const [bootLines, setBootLines] = useState([])
  const [isFadingOut, setIsFadingOut] = useState(false)

  const BOOT_SEQUENCE = [
    'INITIALIZING SYSTEM...',
    'CALIBRATING NAVIGATION...',
    'LOADING STAR MAP...',
    'SYSTEM READY.'
  ]

  useEffect(() => {
    // 1. Initial black screen pause -> Phase 1: ARSH-01 // PERSONAL MISSION (0.6s)
    const tTitle = setTimeout(() => {
      setPhase(1)
    }, 600)

    // 2. Phase 2: Short system boot sequence begins (1.8s)
    const tBootStart = setTimeout(() => {
      setPhase(2)
    }, 1800)

    // Sequence the 4 boot lines
    const tBoot1 = setTimeout(() => {
      setBootLines([BOOT_SEQUENCE[0]])
      soundManager.playHover()
    }, 2000)

    const tBoot2 = setTimeout(() => {
      setBootLines((prev) => [...prev, BOOT_SEQUENCE[1]])
      soundManager.playHover()
    }, 2500)

    const tBoot3 = setTimeout(() => {
      setBootLines((prev) => [...prev, BOOT_SEQUENCE[2]])
      soundManager.playHover()
    }, 3000)

    const tBoot4 = setTimeout(() => {
      setBootLines((prev) => [...prev, BOOT_SEQUENCE[3]])
      soundManager.playHover()
    }, 3500)

    // 3. Phase 3: Mission Directive: DISCOVER MY WORK (4.1s)
    const tDirective = setTimeout(() => {
      setPhase(3)
    }, 4100)

    // 4. Phase 4: Launch button ready (4.9s)
    const tLaunchReady = setTimeout(() => {
      setPhase(4)
      soundManager.playClick()
    }, 4900)

    return () => {
      clearTimeout(tTitle)
      clearTimeout(tBootStart)
      clearTimeout(tBoot1)
      clearTimeout(tBoot2)
      clearTimeout(tBoot3)
      clearTimeout(tBoot4)
      clearTimeout(tDirective)
      clearTimeout(tLaunchReady)
    }
  }, [])

  const handleLaunch = () => {
    soundManager.playWarp()
    setIsFadingOut(true)
    setTimeout(() => {
      onLaunch()
    }, 850)
  }

  return (
    <div className={`cinematic-intro-overlay ${isFadingOut ? 'fade-out' : ''}`}>
      {/* Top Skip Button */}
      <button
        id="skip-intro-button"
        className="skip-intro-btn"
        onClick={handleLaunch}
        title="Skip sequence and enter 3D space scene"
      >
        <span>SKIP INTRO</span>
        <FastForward size={14} />
      </button>

      <div className="cinematic-content-container">
        {/* Step 2: NEXUS-01 // PERSONAL MISSION */}
        <div className={`intro-title-block ${phase >= 1 ? 'visible' : ''}`}>
          <div className="intro-orbit-icon">
            <Orbit size={28} className="intro-spin-icon text-cyan" />
          </div>
          <h1 className="intro-craft-title">NEXUS-01</h1>
          <p className="intro-sub-title">PERSONAL MISSION</p>
        </div>

        {/* Step 3: Boot Sequence */}
        <div className={`intro-terminal-box sci-fi-notch ${phase >= 2 ? 'visible' : ''}`}>
          <div className="terminal-header-bar">
            <Terminal size={12} className="text-cyan" />
            <span>SYS_KERNEL // BOOT INITIALIZATION</span>
          </div>

          <div className="boot-terminal-log">
            {bootLines.map((line, index) => (
              <div
                key={index}
                className={`boot-log-line ${line === 'SYSTEM READY.' ? 'ready-line' : ''}`}
              >
                <span className="log-prompt">&gt;</span>
                <span className="log-text">{line}</span>
                {index === bootLines.length - 1 && phase < 4 && (
                  <span className="cursor-blink">_</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 4: MISSION: DISCOVER MY WORK */}
        <div className={`intro-directive-block ${phase >= 3 ? 'visible' : ''}`}>
          <span className="directive-tag">MISSION:</span>
          <h2 className="directive-objective">DISCOVER MY WORK</h2>
        </div>

        {/* Step 5: Launch Mission Button */}
        <div className={`intro-launch-action ${phase >= 4 ? 'visible' : ''}`}>
          <button
            id="launch-mission-button"
            className="launch-mission-btn"
            onClick={handleLaunch}
          >
            <Rocket size={18} className="rocket-launch-icon" />
            <span>LAUNCH MISSION</span>
          </button>
          <span className="launch-hint">[ PRESS TO ENTER 3D SPACE FLIGHT ]</span>
        </div>
      </div>

      {/* Subtle CRT Scanlines and Corner Brackets */}
      <div className="intro-corner top-left"></div>
      <div className="intro-corner top-right"></div>
      <div className="intro-corner bottom-left"></div>
      <div className="intro-corner bottom-right"></div>
    </div>
  )
}
