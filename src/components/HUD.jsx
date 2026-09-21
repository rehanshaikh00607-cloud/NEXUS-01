import { memo } from 'react'
import {
  Orbit,
  Compass,
  Activity,
  Navigation as NavigationIcon,
  Zap,
  Volume2,
  VolumeX,
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react'

// Memoized Branding Card (Static, zero re-renders)
const HUDBrandingCard = memo(function HUDBrandingCard() {
  return (
    <div className="hud-branding-card sci-fi-bracket">
      <div className="vessel-row">
        <Orbit size={18} className="text-cyan badge-spin-slow" />
        <h1 className="hud-vessel-code">NEXUS-01</h1>
      </div>
      <span className="hud-sub-label">PERSONAL MISSION</span>
    </div>
  )
})

// Memoized Flight Controls Guide Card (Static, zero re-renders)
const HUDControlsCard = memo(function HUDControlsCard() {
  return (
    <div className="controls-hud-card sci-fi-bracket text-right" aria-label="Desktop Controls Guide">
      <div className="control-key-item">
        <span className="key-chip">W / S</span>
        <span className="key-action">FWD / BACK</span>
      </div>
      <div className="control-key-item">
        <span className="key-chip">← / →</span>
        <span className="key-action">STRAFE</span>
      </div>
      <div className="control-key-item">
        <span className="key-chip">↑ / ↓</span>
        <span className="key-action">UP / DOWN</span>
      </div>
      <div className="control-key-item">
        <span className="key-chip">Q / E</span>
        <span className="key-action">ROLL</span>
      </div>
      <div className="control-key-item">
        <span className="key-chip highlight-boost">SHIFT</span>
        <span className="key-action">BOOST</span>
      </div>
      <div className="control-key-item">
        <span className="key-chip highlight-cyan">ENTER</span>
        <span className="key-action">INTERACT</span>
      </div>
      <div className="control-key-item">
        <span className="key-chip">ESC</span>
        <span className="key-action">RETURN</span>
      </div>
    </div>
  )
})

// Memoized Status & Progress Card (Only re-renders when discovery count or audio mute changes)
const HUDStatusCard = memo(function HUDStatusCard({
  missionStatus = 'ACTIVE',
  discoveredCount = 1,
  totalDestinations = 7,
  isMuted = true,
  onToggleMute = null,
  onToggleHelp = null
}) {
  const progressPercent = Math.min(100, Math.round((discoveredCount / totalDestinations) * 100))

  return (
    <div className="hud-status-card sci-fi-bracket text-right">
      <div className="status-block">
        <div className="status-header-row">
          <span className="hud-sub-label">MISSION STATUS</span>
          <div className="hud-toggles-row">
            {onToggleMute && (
              <button
                className="hud-icon-toggle"
                onClick={onToggleMute}
                title={isMuted ? 'Unmute Transmission Audio [M]' : 'Mute Audio [M]'}
                aria-label="Toggle Audio"
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-cyan" />}
              </button>
            )}
            {onToggleHelp && (
              <button
                className="hud-icon-toggle"
                onClick={onToggleHelp}
                title="Toggle Flight Manual [H / ?]"
                aria-label="Help Manual"
              >
                <HelpCircle size={14} />
              </button>
            )}
          </div>
        </div>
        <div className="status-val-row">
          <span className="status-beacon-live"></span>
          <span className="status-val">{missionStatus}</span>
        </div>
      </div>

      <div className="status-block">
        <div className="status-header-row">
          <span className="hud-sub-label">SECTORS VISITED</span>
          <span className="counter-fraction">
            {discoveredCount} / {totalDestinations}
          </span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>
    </div>
  )
})

// Memoized Proximity Interaction Prompt
const HUDProximityCard = memo(function HUDProximityCard({
  target = null,
  isNavArrived = false,
  onExplore = null
}) {
  if (!target) return null

  const targetTitle = (target.label || target.shortName || target.name || '').toUpperCase()

  return (
    <div
      className="hud-proximity-card sci-fi-bracket interactive"
      onClick={() => onExplore && onExplore(target)}
      title="Press ENTER or click to inspect destination"
    >
      <div className="prox-card-header">
        <Sparkles size={13} className="text-cyan animate-pulse" />
        <span className="prox-card-tag">{isNavArrived ? 'DESTINATION REACHED' : 'APPROACHING DESTINATION'}</span>
      </div>
      <div className="prox-card-title">{targetTitle}</div>
      <div className="prox-card-action">
        <span className="prox-key-pill">[ENTER]</span>
        <span className="prox-action-text">EXPLORE</span>
        <ArrowRight size={13} className="text-cyan" />
      </div>
    </div>
  )
})

// Telemetry Readout Card (Updates with ship movement: speed, coordinates, nav lock distance)
const HUDTelemetryCard = memo(function HUDTelemetryCard({
  telemetry = { speed: 0, isBoosting: false, x: 0, y: 0, z: 0 },
  lockedDestination = null,
  lockedDistance = null,
  isInspecting = false,
  isNavArrived = false
}) {
  return (
    <div className="hud-telemetry-card sci-fi-bracket">
      <div className="telemetry-stat">
        <div className="stat-header">
          <Activity size={12} className="text-cyan" />
          <span className="hud-sub-label">SPEED</span>
        </div>
        <div className="speed-row">
          <span className="stat-numerical">{telemetry.speed}</span>
          <span className="stat-unit">KM/S</span>
          {telemetry.isBoosting && (
            <span className="boost-badge">
              <Zap size={10} /> BOOST
            </span>
          )}
        </div>
      </div>

      <div className="telemetry-stat">
        <div className="stat-header">
          <NavigationIcon size={12} className="text-cyan" />
          <span className="hud-sub-label">POSITION</span>
        </div>
        <div className="pos-coords">
          <span>X: <b>{telemetry.x}</b></span>
          <span>Y: <b>{telemetry.y}</b></span>
          <span>Z: <b>{telemetry.z}</b></span>
        </div>
      </div>

      {/* Nav Lock Indicator with dynamic distance countdown and ARRIVED status */}
      {!isInspecting && (
        <div className="hud-nav-lock-block">
          <div className="nav-lock-top">
            <Compass size={11} className={`text-cyan flex-shrink-0 ${lockedDestination ? 'animate-pulse' : ''}`} />
            <span className="nav-lock-lbl">NAV LOCK</span>
          </div>
          <div className="nav-lock-content-wrapper" key={lockedDestination ? lockedDestination.id : 'none'}>
            {lockedDestination ? (
              <>
                <div className="nav-lock-name">{lockedDestination.label || lockedDestination.shortName || lockedDestination.name}</div>
                <div className="nav-lock-distance-badge">
                  {isNavArrived ? (
                    <span className="dist-arrived arrived-pulse">ARRIVED</span>
                  ) : (
                    <span className="dist-km">{lockedDistance !== null ? `${lockedDistance} KM` : 'LOCKED'}</span>
                  )}
                </div>
                {!isNavArrived && telemetry.navBearing && (
                  <div className="nav-lock-bearing">
                    <span className="bearing-arrow">{telemetry.navBearing.arrow}</span>
                    <span className="bearing-text">{telemetry.navBearing.label}</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="nav-lock-name text-muted" style={{ opacity: 0.5, fontSize: '11px' }}>CLICK CELESTIAL BODY</div>
                <div className="nav-lock-distance-badge">
                  <span className="dist-km" style={{ color: 'rgba(255,255,255,0.35)' }}>NO TARGET</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
})

/**
 * HUD
 * Desktop-First 5-area telemetry HUD overlay, decomposed into memoized subcomponents
 * to isolate high-frequency telemetry updates from static UI cards.
 */
function HUDComponent({
  telemetry = { speed: 0, isBoosting: false, x: 0, y: 0, z: 0 },
  missionStatus = 'ACTIVE',
  discoveredCount = 1,
  totalDestinations = 7,
  proximityDestination = null,
  lockedDestination = null,
  lockedDistance = null,
  onExplore = null,
  isInspecting = false,
  isMuted = true,
  onToggleMute = null,
  onToggleHelp = null,
  navigationSlot = null,
  hudBooting = false
}) {
  const navLockTarget = lockedDestination
  const navLockRadius = navLockTarget?.interactionRadius || navLockTarget?.proximityRadius || 15
  const navLockDist = lockedDistance
  const isNavArrived = navLockDist !== null && navLockDist !== undefined && navLockDist <= navLockRadius
  const proxTarget = isNavArrived ? lockedDestination : proximityDestination
  const showProximityCard = Boolean((proximityDestination || isNavArrived) && !isInspecting)

  return (
    <div className={`hud-overlay-container ${hudBooting ? 'hud-boot-sequence' : ''}`}>
      {/* ================= TOP ROW ================= */}
      <div className="hud-top-bar">
        {/* TOP LEFT: Branding + Approaching Destination Prompt */}
        <div className="hud-area-top-left">
          <HUDBrandingCard />
          {showProximityCard && (
            <HUDProximityCard
              target={proxTarget}
              isNavArrived={isNavArrived}
              onExplore={onExplore}
            />
          )}
        </div>

        {/* TOP RIGHT: Mission Status & Toggles */}
        <div className="hud-area-top-right">
          <HUDStatusCard
            missionStatus={missionStatus}
            discoveredCount={discoveredCount}
            totalDestinations={totalDestinations}
            isMuted={isMuted}
            onToggleMute={onToggleMute}
            onToggleHelp={onToggleHelp}
          />
        </div>
      </div>

      {/* ================= BOTTOM ROW ================= */}
      <div className="hud-bottom-bar">
        {/* BOTTOM LEFT: Speed, Position Coordinates & Nav Lock */}
        <div className="hud-area-bottom-left">
          <HUDTelemetryCard
            telemetry={telemetry}
            lockedDestination={lockedDestination}
            lockedDistance={lockedDistance}
            isInspecting={isInspecting}
            isNavArrived={isNavArrived}
          />
        </div>

        {/* BOTTOM CENTER: Sector Jump (Destination Navigation Dock) */}
        <div className="hud-area-bottom-center">
          {navigationSlot}
        </div>

        {/* BOTTOM RIGHT: Controls Panel */}
        <div className="hud-area-bottom-right">
          <HUDControlsCard />
        </div>
      </div>
    </div>
  )
}

const HUD = memo(HUDComponent)
export default HUD
