import { Rocket, Orbit, Compass, Globe, FolderGit2, Cpu, History, GraduationCap, Radio } from 'lucide-react'
import { DESTINATIONS } from '../../data/portfolioData'
import { soundManager } from '../../utils/audio'

const DEST_ICONS = {
  home: Rocket,
  about: Globe,
  projects: FolderGit2,
  skills: Cpu,
  experience: History,
  education: GraduationCap,
  contact: Radio
}

export default function MobileDirectNav({
  currentProximity,
  onSelectDestination,
  onSwitchMode
}) {
  return (
    <div className="mobile-direct-nav-panel sci-fi-notch">
      <div className="direct-nav-header">
        <div className="direct-nav-title">
          <Compass size={14} className="text-cyan" />
          <span>SIMPLIFIED DESTINATION NAV</span>
        </div>
        {onSwitchMode && (
          <button
            className="switch-to-flight-btn"
            onClick={() => {
              soundManager.playClick()
              onSwitchMode('free-flight')
            }}
            title="Switch to 3D touch free-flight mode"
          >
            <Orbit size={13} className="text-cyan" />
            <span>ENABLE 3D FLIGHT</span>
          </button>
        )}
      </div>

      <p className="direct-nav-hint">
        Tap any celestial destination to warp and inspect dossier:
      </p>

      <div className="direct-nav-cards-scroll">
        {DESTINATIONS.map((dest, idx) => {
          const IconComponent = DEST_ICONS[dest.id] || Compass
          const isNear = currentProximity && currentProximity.id === dest.id

          return (
            <button
              key={dest.id}
              className={`direct-dest-card ${isNear ? 'is-current' : ''}`}
              onClick={() => {
                soundManager.playWarp()
                onSelectDestination(dest.id)
              }}
            >
              <div className="card-top-row">
                <span className="dest-index">0{idx + 1}</span>
                <IconComponent size={16} className="dest-card-icon" style={{ color: dest.color }} />
              </div>

              <div className="dest-card-details">
                <span className="dest-card-name">{dest.shortName}</span>
                <span className="dest-card-sector">{dest.sector}</span>
              </div>

              {isNear && <div className="card-active-indicator">NEARBY</div>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
