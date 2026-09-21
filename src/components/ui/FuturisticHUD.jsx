import { useMemo } from 'react'
import { Orbit, Compass, Radio, Activity, Navigation, Zap, Volume2, VolumeX, HelpCircle } from 'lucide-react'
import { DESTINATIONS } from '../../data/portfolioData'

export default function FuturisticHUD({
  telemetry = { speed: 0, isBoosting: false, x: 0, y: 0, z: 0 },
  missionStatus = 'ACTIVE',
  discoveredCount = 1,
  totalDestinations = 6,
  proximityDestination = null,
  isInspecting = false,
  isMobile = false,
  navMode = 'direct-nav',
  onToggleNavMode = null,
  isMuted = true,
  onToggleMute = null,
  onToggleHelp = null
}) {
  const progressPercent = Math.min(100, Math.round((discoveredCount / totalDestinations) * 100))

  // Real-time Nav Lock: compute nearest celestial body
  const nearestTarget = useMemo(() => {
    let closest = null
    let minD = Infinity
    for (const d of DESTINATIONS) {
      if (d.id === 'home') continue
      const dx = d.coordinates[0] - telemetry.x
      const dy = d.coordinates[1] - telemetry.y
      const dz = d.coordinates[2] - telemetry.z
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
      if (dist < minD) {
        minD = dist
        closest = { ...d, dist: Math.round(dist) }
      }
    }
    return closest
  }, [telemetry.x, telemetry.y, telemetry.z])

  return (
    <div className="futuristic-hud-grid">
      {/* ================= TOP-LEFT CORNER ================= */}
      <div className="hud-corner top-left sci-fi-bracket">
        <div className="corner-content">
          <div className="vessel-row">
            <Orbit size={16} className="text-cyan badge-spin-slow" />
            <h1 className="hud-vessel-code">NEXUS-01</h1>
          </div>
          <span className="hud-sub-label">PERSONAL MISSION</span>
        </div>
      </div>

      {/* ================= TOP-RIGHT CORNER ================= */}
      <div className="hud-corner top-right sci-fi-bracket">
        <div className="corner-content text-right">
          <div className="status-block">
            <div className="status-header-row">
              <span className="hud-sub-label">MISSION STATUS</span>
              <div className="hud-toggles-row">
                {onToggleMute && (
                  <button
                    className={`hud-icon-toggle ${!isMuted ? 'active' : ''}`}
                    onClick={onToggleMute}
                    title={isMuted ? 'Enable Synthesized Audio (M)' : 'Mute Audio (M)'}
                  >
                    {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} className="text-cyan animate-pulse" />}
                    <span>{isMuted ? 'MUTED' : 'AUDIO'}</span>
                  </button>
                )}
                {onToggleHelp && (
                  <button
                    className="hud-icon-toggle"
                    onClick={onToggleHelp}
                    title="Flight Manual & Keybindings (H / ?)"
                  >
                    <HelpCircle size={12} className="text-cyan" />
                    <span>HELP</span>
                  </button>
                )}
              </div>
            </div>

            <div className="status-active-badge">
              <span className="live-dot-pulse"></span>
              <span className="status-value">{isInspecting ? 'ANALYZING' : missionStatus}</span>
            </div>
            {isMobile && onToggleNavMode && (
              <button
                className="mobile-hud-mode-pill"
                onClick={onToggleNavMode}
                title="Toggle between Direct Destination Nav and 3D Flight Controls"
              >
                <Compass size={11} className="text-cyan" />
                <span>{navMode === 'direct-nav' ? 'DIRECT NAV' : '3D FLIGHT'}</span>
              </button>
            )}
          </div>

          {/* Mission Progress Indicator */}
          <div className="mission-progress-box">
            <div className="progress-labels">
              <span className="hud-sub-label">MISSION PROGRESS</span>
              <span className="progress-fraction">
                <b>{discoveredCount}</b> / {totalDestinations} DESTINATIONS
              </span>
            </div>

            {/* Segmented Progress Bar */}
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM-LEFT CORNER ================= */}
      <div className="hud-corner bottom-left sci-fi-bracket">
        <div className="corner-content">
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
              <Navigation size={12} className="text-cyan" />
              <span className="hud-sub-label">POSITION</span>
            </div>
            <div className="pos-coords">
              <span>X: <b>{telemetry.x}</b></span>
              <span>Y: <b>{telemetry.y}</b></span>
              <span>Z: <b>{telemetry.z}</b></span>
            </div>
          </div>

          {/* Navigation Target Lock Beacon */}
          {nearestTarget && !isInspecting && (
            <div className="hud-nav-lock-row">
              <Compass size={12} className="text-cyan flex-shrink-0" />
              <span className="nav-lock-lbl">NAV LOCK:</span>
              <span className="nav-lock-dest">{nearestTarget.shortName}</span>
              <span className="nav-lock-dist">{nearestTarget.dist} KM</span>
            </div>
          )}
        </div>
      </div>

      {/* ================= BOTTOM-RIGHT CORNER ================= */}
      <div className="hud-corner bottom-right sci-fi-bracket">
        <div className="corner-content text-right">
          <div className="controls-hud-card">
            <div className="control-key-item">
              <span className="key-chip">WASD</span>
              <span className="key-action">MOVE</span>
            </div>
            <div className="control-key-item">
              <span className="key-chip highlight-cyan">ENTER</span>
              <span className="key-action">INTERACT</span>
            </div>
            <div className="control-key-item">
              <span className="key-chip">ESC</span>
              <span className="key-action">CLOSE</span>
            </div>
            {onToggleHelp && (
              <div
                className="control-key-item clickable"
                onClick={onToggleHelp}
                title="Open Flight Manual (H / ?)"
              >
                <span className="key-chip">H</span>
                <span className="key-action">MANUAL</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
