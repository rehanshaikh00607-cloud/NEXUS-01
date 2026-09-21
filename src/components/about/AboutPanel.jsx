import { ArrowLeft } from 'lucide-react'
import { ABOUT_DATA } from '../../data/about'
import ProfileCard from './ProfileCard'
import MissionLog from './MissionLog'
import FocusCards from './FocusCards'
import TechnologyList from './TechnologyList'
import { soundManager } from '../../utils/audio'

/**
 * AboutPanel
 * Top-level modular container for the About the Pilot destination.
 * Displays:
 * - ProfileCard (Image placeholder + Arsh + [YOUR ROLE] + [YOUR LOCATION])
 * - MissionLog (Editable introduction paragraph)
 * - FocusCards (01 DEVELOPMENT, 02 LEARNING, 03 EXPLORATION)
 * - TechnologyList (Compact tech stack)
 * - Flight Return Action Bar ([ ← RETURN TO FLIGHT ])
 */
export default function AboutPanel({
  data = ABOUT_DATA,
  onClose
}) {
  const handleReturnToFlight = () => {
    soundManager.playClick()
    if (onClose) onClose()
  }

  return (
    <div className="about-panel-wrapper animate-fade-in">
      {/* 1. Profile Section */}
      <ProfileCard profile={data.profile} />

      {/* 2. Mission Log Section */}
      <MissionLog missionLog={data.missionLog} />

      {/* 3. Current Focus Section */}
      <FocusCards focusAreas={data.currentFocus} />

      {/* 4. Technology Section */}
      <TechnologyList technologies={data.technologies} />

      {/* 5. In-Panel Return Action Bar */}
      <div className="about-return-bar sci-fi-notch">
        <button
          id="about-return-flight-btn"
          className="dest-return-flight-btn footer-btn"
          onClick={handleReturnToFlight}
          aria-label="Return to flight"
        >
          <ArrowLeft size={16} className="btn-arrow" />
          <span>RETURN TO FLIGHT</span>
        </button>

        <div className="return-flight-hint">
          <span className="hint-pill">ESC</span>
          <span className="hint-divider">/</span>
          <span className="hint-text">RETURN TO FLIGHT</span>
        </div>
      </div>
    </div>
  )
}
