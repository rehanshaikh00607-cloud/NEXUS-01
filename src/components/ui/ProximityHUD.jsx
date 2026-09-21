import { Compass, Sparkles, ArrowRight } from 'lucide-react'
import { soundManager } from '../../utils/audio'

export default function ProximityHUD({ destination, distance, onExplore }) {
  if (!destination) return null

  const displayTitle = destination.proximityTitle || destination.name

  return (
    <div
      className="proximity-hud sci-fi-notch"
      onClick={() => {
        soundManager.playWarp()
        onExplore(destination)
      }}
      title="Click or press ENTER to explore destination"
    >
      <div className="proximity-hud-left">
        <div className="proximity-radar-ping">
          <Compass size={20} className="ping-icon" />
          <div className="radar-wave"></div>
        </div>

        <div className="proximity-info">
          <div className="proximity-tag">
            <span>MISSION PROXIMITY DETECTED // {destination.sector}</span>
          </div>
          <h2 className="proximity-title">{displayTitle}</h2>
          <span className="proximity-tagline">{destination.tagline}</span>
        </div>
      </div>

      <div className="proximity-hud-right">
        <div className="proximity-dist">
          <span className="dist-lbl">RANGE</span>
          <span className="dist-val">{distance || 15} KM</span>
        </div>

        <button className="explore-btn">
          <span>PRESS <b>ENTER</b> TO EXPLORE</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
