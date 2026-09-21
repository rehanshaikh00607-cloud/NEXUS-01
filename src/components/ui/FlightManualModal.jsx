import {
  X,
  Compass,
  Rocket,
  Volume2,
  HelpCircle,
  Sparkles,
  Move,
  Layers,
  CheckCircle2
} from 'lucide-react'
import { soundManager } from '../../utils/audio'

export default function FlightManualModal({ onClose }) {
  const handleClose = () => {
    soundManager.playClick()
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        className="flight-manual-modal sci-fi-notch"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="manual-header">
          <div className="manual-title-row">
            <Rocket size={18} className="text-cyan" />
            <h2>NEXUS-01 // FLIGHT MANUAL & CONTROLS</h2>
          </div>
          <button
            className="dest-close-btn"
            onClick={handleClose}
            title="Close Manual [ESC]"
          >
            <span>CLOSE</span>
            <span className="key-tag">[ESC]</span>
            <X size={16} />
          </button>
        </div>

        <div className="manual-body">
          <p className="manual-intro">
            Welcome to the <b>NEXUS-01</b> reconnaissance vessel. Use the flight controls below to navigate the solar system and discover Commander Arsh's engineering portfolio.
          </p>

          <div className="manual-grid">
            {/* 1. Desktop Flight Controls */}
            <div className="manual-card sci-fi-notch">
              <div className="card-header">
                <Move size={15} className="text-cyan" />
                <h4>DESKTOP FLIGHT CONTROLS</h4>
              </div>
              <ul className="manual-keys-list">
                <li>
                  <span className="key-pill">W / S</span>
                  <span>Forward / backward propulsion</span>
                </li>
                <li>
                  <span className="key-pill">← / →</span>
                  <span>Strafe left / right (physically move ship left / right in 3D world)</span>
                </li>
                <li>
                  <span className="key-pill">↑ / ↓</span>
                  <span>Move up / down (physically move ship up / down in 3D world)</span>
                </li>
                <li>
                  <span className="key-pill">Q / E</span>
                  <span>Roll trim left / right</span>
                </li>
                <li>
                  <span className="key-pill highlight">SHIFT</span>
                  <span>Warp Boost (accelerate to max speed with FOV warp & speed streaks)</span>
                </li>
              </ul>
            </div>

            {/* 2. Exploration & Interaction */}
            <div className="manual-card sci-fi-notch">
              <div className="card-header">
                <Layers size={15} className="text-cyan" />
                <h4>EXPLORATION & INTERACTION</h4>
              </div>
              <ul className="manual-keys-list">
                <li>
                  <span className="key-pill highlight-enter">ENTER</span>
                  <span>Inspect destination when in proximity range (&lt; 15 km)</span>
                </li>
                <li>
                  <span className="key-pill">ESC</span>
                  <span>Close active inspection panel and return to flight</span>
                </li>
                <li>
                  <span className="key-pill">QUICK WARP</span>
                  <span>Use the bottom dock or Nav Menu to fast-travel to any planet</span>
                </li>
                <li>
                  <span className="key-pill">M</span>
                  <span>Toggle synthesized audio & ambient cosmic drone ON / OFF</span>
                </li>
                <li>
                  <span className="key-pill">H / ?</span>
                  <span>Open / Close this Flight Manual anytime</span>
                </li>
              </ul>
            </div>

            {/* 3. Mobile & Touch Mode */}
            <div className="manual-card sci-fi-notch">
              <div className="card-header">
                <Compass size={15} className="text-cyan" />
                <h4>MOBILE & TOUCH CONTROLS</h4>
              </div>
              <p className="card-note">
                When browsing on a tablet or mobile phone, the interface provides two distinct modes:
              </p>
              <ul className="manual-keys-list">
                <li>
                  <span className="key-pill">DIRECT NAV</span>
                  <span>Tap any destination button on screen to jump directly without manual steering</span>
                </li>
                <li>
                  <span className="key-pill">3D FLIGHT</span>
                  <span>On-screen D-pad and Boost button for full manual mobile flight</span>
                </li>
              </ul>
            </div>

            {/* 5. Portfolio Destinations */}
            <div className="manual-card sci-fi-notch">
              <div className="card-header">
                <Sparkles size={15} className="text-cyan" />
                <h4>DESTINATIONS GUIDE</h4>
              </div>
              <ul className="manual-keys-list">
                <li><b>01. LAUNCH DOCK</b> — Starter coordinates & flight controls</li>
                <li><b>02. ABOUT ME</b> — Sapphire terrestrial world (Pilot identity & stack)</li>
                <li><b>03. PROJECTS</b> — Purple ringed gas giant (AI Assistant, E-Commerce, Dashboard)</li>
                <li><b>04. SKILLS</b> — Orbital Space Station Alpha (Frontend, Backend, Database, Cloud)</li>
                <li><b>05. EXPERIENCE</b> — Shadow Moon (Career timeline & milestones)</li>
                <li><b>06. EDUCATION</b> — Bronze Exoplanet (Academic degrees & coursework)</li>
                <li><b>07. CONTACT</b> — Deep-space Comms Satellite (Encrypted transmissions & links)</li>
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
