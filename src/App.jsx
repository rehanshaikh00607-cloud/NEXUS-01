import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react'
import SpaceScene from './components/SpaceScene'
import HUD from './components/HUD'
import Navigation from './components/Navigation'

const MissionPanel = lazy(() => import('./components/MissionPanel'))
import { DESTINATIONS, commanderData } from './data/destinations'
import { SKILLS_SUBSYSTEMS } from './data/skills'
import { useSpaceshipControls } from './hooks/useSpaceshipControls'
import { useProximity } from './hooks/useProximity'
import { soundManager } from './utils/audio'
import {
  Rocket,
  FastForward,
  Orbit,
  Terminal,
  Sparkles,
  Move,
  Layers,
  MousePointer,
  CheckCircle2,
  Monitor,
  X
} from 'lucide-react'
import './styles/main.css'

// ================= RESPONSIVE DESKTOP-REQUIRED SCREEN (<900px) =================
function DesktopRequiredScreen() {
  return (
    <div className="desktop-required-overlay">
      <div className="desktop-required-card sci-fi-bracket">
        <div className="desktop-required-icon-wrapper">
          <Monitor size={44} className="text-cyan animate-pulse" />
        </div>
        <h1 className="desktop-required-title">DESKTOP EXPERIENCE REQUIRED</h1>
        <p className="desktop-required-subtitle">
          NEXUS-01 is designed for keyboard and mouse.
        </p>
        <div className="desktop-required-badge">
          <span>[ VIEW ON DESKTOP ]</span>
        </div>
      </div>
    </div>
  )
}

// ================= CINEMATIC BOOT & INTRO SEQUENCE =================
function CinematicIntro({ onLaunch }) {
  const [phase, setPhase] = useState(0)
  const [bootLines, setBootLines] = useState([])
  const [isFadingOut, setIsFadingOut] = useState(false)

  const BOOT_SEQUENCE = [
    'INITIALIZING SYSTEM...',
    'CALIBRATING NAVIGATION...',
    'LOADING STAR MAP...',
    'SYSTEM READY.'
  ]

  useEffect(() => {
    const tTitle = setTimeout(() => setPhase(1), 600)
    const tBootStart = setTimeout(() => setPhase(2), 1800)

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

    const tDirective = setTimeout(() => setPhase(3), 4100)
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
    soundManager.init()
    soundManager.resumeContext()
    soundManager.unmute()
    soundManager.playWarp()
    setIsFadingOut(true)
    setTimeout(() => {
      onLaunch()
    }, 600)
  }

  return (
    <div className={`cinematic-intro-overlay ${isFadingOut ? 'fade-out' : ''}`}>
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
        <div className={`intro-title-block ${phase >= 1 ? 'visible' : ''}`}>
          <div className="intro-orbit-icon">
            <Orbit size={28} className="intro-spin-icon text-cyan" />
          </div>
          <h1 className="intro-craft-title">NEXUS-01</h1>
          <p className="intro-sub-title">PERSONAL MISSION</p>
        </div>

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

        <div className={`intro-directive-block ${phase >= 3 ? 'visible' : ''}`}>
          <span className="directive-tag">MISSION:</span>
          <h2 className="directive-objective">DISCOVER MY WORK</h2>
        </div>

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

      <div className="intro-corner top-left"></div>
      <div className="intro-corner top-right"></div>
      <div className="intro-corner bottom-left"></div>
      <div className="intro-corner bottom-right"></div>
    </div>
  )
}

// ================= FLIGHT MANUAL & CONTROLS MODAL =================
function FlightManualModal({ onClose }) {
  const handleClose = () => {
    soundManager.playClick()
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="flight-manual-modal sci-fi-notch" onClick={(e) => e.stopPropagation()}>
        <div className="manual-header">
          <div className="manual-title-row">
            <Rocket size={18} className="text-cyan" />
            <h2>NEXUS-01 // FLIGHT MANUAL & CONTROLS</h2>
          </div>
          <button className="dest-close-btn" onClick={handleClose} title="Close Manual [ESC]">
            <span>CLOSE</span>
            <span className="key-tag">[ESC]</span>
            <X size={16} />
          </button>
        </div>

        <div className="manual-body">
          <p className="manual-intro">
            Welcome to the <b>NEXUS-01</b> reconnaissance vessel. Navigate orbital sectors to inspect
            Commander Arsh's engineering projects, technical stack, and career background.
          </p>

          <div className="manual-grid">
            <div className="manual-card sci-fi-notch">
              <div className="card-header">
                <Move size={15} className="text-cyan" />
                <h4>DESKTOP FLIGHT CONTROLS</h4>
              </div>
              <ul className="manual-keys-list">
                <li><span className="key-pill">W / S</span><span>Forward / backward propulsion</span></li>
                <li><span className="key-pill">← / →</span><span>Strafe left / right (physically move ship left / right)</span></li>
                <li><span className="key-pill">↑ / ↓</span><span>Move up / down (physically move ship up / down)</span></li>
                <li><span className="key-pill">Q / E</span><span>Roll trim left / right</span></li>
                <li><span className="key-pill highlight">SHIFT</span><span>Warp Boost (accelerate to max speed)</span></li>
                <li><span className="key-pill">SPACE</span><span>Retro-braking halt</span></li>
              </ul>
            </div>

            <div className="manual-card sci-fi-notch">
              <div className="card-header">
                <Layers size={15} className="text-cyan" />
                <h4>EXPLORATION & INTERACTION</h4>
              </div>
              <ul className="manual-keys-list">
                <li><span className="key-pill highlight-enter">ENTER</span><span>Interact / open selected or nearby destination</span></li>
                <li><span className="key-pill">ESC</span><span>Close active dossier or manual and return to flight</span></li>
                <li><span className="key-pill">NAV DOCK</span><span>Select destination via bottom sector dock</span></li>
                <li><span className="key-pill">M</span><span>Toggle synthesized sound effects</span></li>
                <li><span className="key-pill">H / ?</span><span>Open / Close Flight Manual</span></li>
              </ul>
            </div>

            <div className="manual-card sci-fi-notch">
              <div className="card-header">
                <MousePointer size={15} className="text-cyan" />
                <h4>MOUSE & POINTER CONTROLS</h4>
              </div>
              <ul className="manual-keys-list">
                <li><span className="key-pill">CLICK</span><span>Select & warp via Sector Jump dock</span></li>
                <li><span className="key-pill">CLICK</span><span>Interact with case studies & links</span></li>
                <li><span className="key-pill">CLICK</span><span>Return to flight button to resume</span></li>
              </ul>
            </div>

            <div className="manual-card sci-fi-notch">
              <div className="card-header">
                <Sparkles size={15} className="text-cyan" />
                <h4>PORTFOLIO DESTINATIONS</h4>
              </div>
              <ul className="manual-keys-list">
                <li><b>01. LAUNCH DOCK</b> — Flight controls & starter coordinates</li>
                <li><b>02. ABOUT ME</b> — Terrestrial planet (Identity & current focus)</li>
                <li><b>03. PROJECTS</b> — Ringed Gas Giant (AI Study Assistant, E-Commerce, Dashboard)</li>
                <li><b>04. SKILLS</b> — Space Station Alpha (Full-stack technologies)</li>
                <li><b>05. EXPERIENCE</b> — Moon-like planet (Career timeline & milestones)</li>
                <li><b>06. EDUCATION</b> — Bronze Exoplanet (Academic degrees)</li>
                <li><b>07. CONTACT</b> — Comms Satellite (Transmission dispatch)</li>
              </ul>
            </div>
          </div>

          <div className="manual-footer">
            <button className="action-btn primary" onClick={handleClose}>
              <CheckCircle2 size={16} />
              <span>RETURN TO EXPLORATION</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ================= PRIMARY APPLICATION COMPONENT =================
export default function App() {
  const [isIntroActive, setIsIntroActive] = useState(true)
  const [hudBooting, setHudBooting] = useState(false)
  const [isMuted, setIsMuted] = useState(() => soundManager.isMuted())
  const [showFlightManual, setShowFlightManual] = useState(false)

  const handleLaunchSequence = useCallback(() => {
    soundManager.init()
    soundManager.unmute()
    setIsMuted(soundManager.isMuted())
    setIsIntroActive(false)
    setHudBooting(true)
    setTimeout(() => {
      setHudBooting(false)
    }, 700)
  }, [])

  // Screen Width Guard: screens < 900px require desktop display
  const [isSmallScreen, setIsSmallScreen] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 900
  })

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 900)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Telemetry state
  const [telemetry, setTelemetry] = useState({
    speed: 0,
    isBoosting: false,
    x: 0,
    y: 0,
    z: 0
  })

  // Active Destination Selection & Modal state (clean state flow: NO TARGET -> TARGET SELECTED -> NAVIGATING -> ARRIVED -> INTERACT)
  const [selectedDestination, setSelectedDestination] = useState(null)
  const [activeModalDestination, setActiveModalDestination] = useState(null)
  const [warpTarget, setWarpTarget] = useState(null)

  // Audio mute handler
  const handleToggleMute = useCallback(() => {
    const muted = soundManager.toggleMute()
    setIsMuted(muted)
  }, [])

  // Help manual handler
  const handleToggleHelp = useCallback(() => {
    soundManager.playClick()
    setShowFlightManual((prev) => !prev)
  }, [])

  // Desktop Spaceship Controls hook
  const controls = useSpaceshipControls({
    isInspecting: !!activeModalDestination || showFlightManual,
    onTelemetryUpdate: setTelemetry,
    onToggleMute: handleToggleMute,
    onToggleHelp: handleToggleHelp
  })

  // Proximity & Discovery tracking hook
  const proximity = useProximity()
  const {
    proximityDestination,
    discoveredDestinations,
    discoveryBanner,
    getNearestTarget,
    getDistanceToDestination
  } = proximity

  // Nearest target for proximity awareness
  const nearestTarget = getNearestTarget(telemetry)

  // Locked destination for 3D in-world waypoint marker & HUD Nav Lock
  // Locked destination for 3D in-world waypoint marker & HUD Nav Lock
  // Follows clean state: NO TARGET -> TARGET SELECTED -> NAVIGATING -> ARRIVED -> INTERACT
  const lockedDestination = selectedDestination || null
  const lockedDistance = lockedDestination
    ? getDistanceToDestination(telemetry, lockedDestination)
    : null

  // NAV LOCK target acquired audio trigger (fires strictly once when target changes)
  const prevLockedRef = useRef(null)
  useEffect(() => {
    const currentId = lockedDestination?.id || null
    if (currentId && currentId !== prevLockedRef.current) {
      soundManager.playTargetLock()
    }
    prevLockedRef.current = currentId
  }, [lockedDestination])

  // Proximity explore action: halts spaceship movement and opens portfolio dossier
  const handleExploreDestination = useCallback((dest) => {
    if (!dest) return
    controls.stopMovement()
    soundManager.playPanelOpen()
    setActiveModalDestination(dest)
  }, [controls])

  // Stable ref for keyboard navigation handler to avoid re-binding window listener on every proximity/distance update
  const navStateRef = useRef({
    proximityDestination,
    selectedDestination,
    lockedDestination,
    lockedDistance,
    activeModalDestination,
    showFlightManual,
    handleExploreDestination
  })
  navStateRef.current = {
    proximityDestination,
    selectedDestination,
    lockedDestination,
    lockedDistance,
    activeModalDestination,
    showFlightManual,
    handleExploreDestination
  }

  // Keyboard navigation: ENTER (interact/open destination), ESCAPE (close/return)
  // Arrow keys are dedicated exclusively to physical 3D flight in useSpaceshipControls
  useEffect(() => {
    if (isIntroActive || isSmallScreen) return

    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
      const s = navStateRef.current

      if (e.key === 'Enter') {
        if (!s.activeModalDestination && !s.showFlightManual) {
          const isArrivedAtLocked =
            s.lockedDestination &&
            s.lockedDistance !== null &&
            s.lockedDistance !== undefined &&
            s.lockedDistance <= (s.lockedDestination.interactionRadius || s.lockedDestination.proximityRadius || 18)
          const targetToExplore = s.selectedDestination || s.lockedDestination || (isArrivedAtLocked ? s.lockedDestination : s.proximityDestination)

          if (targetToExplore) {
            s.handleExploreDestination(targetToExplore)
          } else {
            soundManager.playHover()
          }
        }
      } else if (e.key === 'Escape') {
        if (s.showFlightManual) {
          soundManager.playClick()
          setShowFlightManual(false)
        } else if (s.activeModalDestination) {
          soundManager.playPanelClose()
          setActiveModalDestination(null)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isIntroActive, isSmallScreen])

  // Fast-travel warp handler
  const handleWarpTo = useCallback((destId) => {
    soundManager.playWarp()
    controls.stopMovement()
    const dest = DESTINATIONS.find((d) => d.id === destId)
    if (dest) {
      setSelectedDestination(dest)
      setWarpTarget({ id: dest.id, timestamp: Date.now() })
      setActiveModalDestination((curr) => (curr ? dest : null))
    }
  }, [controls])

  const handleSelectDestination = useCallback((destOrId) => {
    soundManager.playNavSelect()
    const destId = typeof destOrId === 'string' ? destOrId : destOrId?.id
    const dest = DESTINATIONS.find((d) => d.id === destId)
    if (dest) {
      setSelectedDestination(dest)
    }
  }, [])

  const discoveredCount = Math.min(DESTINATIONS.length, Math.max(1, discoveredDestinations.size))

  // Responsive Small Screen Guard: do not attempt to render heavy 3D scene below 900px
  if (isSmallScreen) {
    return (
      <main className="app-container">
        <DesktopRequiredScreen />
      </main>
    )
  }

  return (
    <main className="app-container">
      {/* Layer 0: 3D WebGL Space Environment (Decoupled from high-frequency telemetry for 0 React re-renders during flight) */}
      <SpaceScene
        isInspecting={!!activeModalDestination}
        inspectDestination={activeModalDestination}
        warpTarget={warpTarget}
        controls={controls}
        proximity={proximity}
        onSelectDestination={handleSelectDestination}
        lockedDestination={lockedDestination}
      />

      {/* Layer 5: Subtle Cinematic Vignette (depth focus, deepens on boost) */}
      <div className={`cinematic-vignette-overlay ${telemetry.isBoosting ? 'boosting' : ''}`} />

      {/* Layer 100: Cinematic Opening Sequence */}
      {isIntroActive && (
        <CinematicIntro onLaunch={handleLaunchSequence} />
      )}

      {/* Layer 20: Futuristic HUD Overlay with 5-Area Desktop Layout */}
      {!isIntroActive && (
        <>
          <HUD
            telemetry={telemetry}
            missionStatus="ACTIVE"
            discoveredCount={discoveredCount}
            totalDestinations={DESTINATIONS.length}
            nearestTarget={nearestTarget}
            proximityDestination={proximityDestination}
            lockedDestination={lockedDestination}
            lockedDistance={lockedDistance}
            onExplore={handleExploreDestination}
            isInspecting={!!activeModalDestination}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onToggleHelp={handleToggleHelp}
            hudBooting={hudBooting}
            navigationSlot={
              !activeModalDestination && (
                <Navigation
                  currentProximity={proximityDestination}
                  nearestTarget={nearestTarget}
                  selectedDestination={selectedDestination}
                  onSelectDestination={(dest) => setSelectedDestination(dest)}
                  onWarpTo={handleWarpTo}
                />
              )
            }
          />

          {/* Layer 20: Arrival & Discovery Notification Banner */}
          {discoveryBanner && (
            <div className="discovery-notification sci-fi-bracket arrival-card">
              <div className="arrival-badge">
                <Sparkles size={14} className="text-cyan animate-pulse" />
                <span>{discoveryBanner.title || 'DESTINATION REACHED'}</span>
              </div>
              <div className="arrival-dest-name">
                {discoveryBanner.name}
              </div>
              <div className="arrival-progress-note">
                MISSION PROGRESS: <b>{discoveryBanner.count}</b> / {discoveryBanner.total} DESTINATIONS
              </div>
            </div>
          )}
        </>
      )}

      {/* Layer 30: Flight Manual & Keybindings Modal */}
      {showFlightManual && (
        <FlightManualModal onClose={() => setShowFlightManual(false)} />
      )}

      {/* Layer 30: Celestial Destination Mission Dossier Modal (Lazy-loaded for instant startup) */}
      {activeModalDestination && (
        <Suspense fallback={null}>
          <MissionPanel
            destination={activeModalDestination}
            commander={commanderData}
            subsystems={SKILLS_SUBSYSTEMS}
            onClose={() => setActiveModalDestination(null)}
            onWarpTo={handleWarpTo}
          />
        </Suspense>
      )}
    </main>
  )
}
