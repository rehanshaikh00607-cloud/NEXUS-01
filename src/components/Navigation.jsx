import { memo } from 'react'
import { Rocket } from 'lucide-react'
import { DESTINATIONS } from '../data/destinations'

/**
 * Navigation
 * Desktop-First Sector Jump Navigation Dock:
 * - Displays all 7 destinations with index codes (01 to 07) and names
 * - Highlights active target with cyan glow (.is-active-dest)
 * - Shows pulsing proximity indicator (.near-ping) when ship is in range
 * - Clickable with mouse to warp/target destinations
 */
function NavigationComponent({
  currentProximity = null,
  nearestTarget = null,
  selectedDestination = null,
  onSelectDestination = null,
  onWarpTo = null
}) {
  return (
    <nav className="quick-warp-dock" aria-label="Sector Destinations Navigation">
      <div className="warp-dock-container sci-fi-bracket interactive">
        <div className="warp-dock-title">
          <Rocket size={14} className="text-cyan" />
          <span>SECTOR JUMP:</span>
        </div>

        <div className="warp-buttons-row">
          {DESTINATIONS.map((dest, i) => {
            const isSelected = selectedDestination
              ? selectedDestination.id === dest.id
              : (!currentProximity && nearestTarget?.id === dest.id)
            const isNear = currentProximity?.id === dest.id
            const isActive = isSelected

            return (
              <button
                key={dest.id}
                className={`warp-nav-btn ${isActive ? 'is-active-dest' : ''} ${isNear ? 'is-near' : ''}`}
                onClick={() => {
                  if (onSelectDestination) onSelectDestination(dest)
                }}
                onDoubleClick={() => {
                  if (onWarpTo) onWarpTo(dest.id)
                }}
                title={`Lock navigation on ${dest.name} (${dest.sector}) [Double-click to Warp]`}
              >
                <span className="dest-num">0{i + 1}</span>
                <span className="dest-lbl">{dest.shortName || dest.name}</span>
                {isNear && <span className="near-ping" title="Target in Proximity Range"></span>}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

const Navigation = memo(NavigationComponent)
export default Navigation
