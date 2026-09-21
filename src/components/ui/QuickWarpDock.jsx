import { DESTINATIONS } from '../../data/portfolioData'
import { soundManager } from '../../utils/audio'
import { Rocket } from 'lucide-react'

export default function QuickWarpDock({
  currentProximity,
  onWarpTo
}) {
  return (
    <nav className="quick-warp-dock">
      <div className="warp-dock-container sci-fi-notch">
        <div className="warp-dock-title">
          <Rocket size={13} className="text-cyan" />
          <span>SECTOR JUMP:</span>
        </div>

        <div className="warp-buttons-row">
          {DESTINATIONS.map((dest, i) => {
            const isNear = currentProximity && currentProximity.id === dest.id
            return (
              <button
                key={dest.id}
                className={`warp-nav-btn ${isNear ? 'is-near' : ''}`}
                onClick={() => {
                  soundManager.playWarp()
                  onWarpTo(dest.id)
                }}
                title={`Fast-travel warp jump to ${dest.name}`}
              >
                <span className="dest-num">0{i + 1}</span>
                <span className="dest-lbl">{dest.shortName}</span>
                {isNear && <span className="near-ping"></span>}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
