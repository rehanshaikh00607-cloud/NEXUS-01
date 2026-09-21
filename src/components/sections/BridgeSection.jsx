import { Rocket, Shield, Terminal, ArrowRight, Download, Send } from 'lucide-react'
import { soundManager } from '../../utils/audio'

export default function BridgeSection({ data, setActiveSection }) {
  const { commander } = data

  const handleNav = (section) => {
    soundManager.playWarp()
    setActiveSection(section)
  }

  return (
    <section className="hud-panel bridge-panel sci-fi-notch">
      <div className="panel-inner">
        {/* Top telemetry tag */}
        <div className="telemetry-bar">
          <div className="terminal-tag">
            <Terminal size={14} />
            <span>BRIDGE DECK // FLIGHT INITIALIZATION</span>
          </div>
          <span className="clearance-tag">{commander.clearance}</span>
        </div>

        {/* Hero Content */}
        <div className="bridge-hero">
          <div className="callsign-row">
            <span className="welcome-subtext">WELCOME ABOARD RECON VESSEL</span>
            <span className="callsign-badge">{commander.vessel}</span>
          </div>

          <h1 className="hero-headline">
            {commander.callsign}
          </h1>

          <h2 className="hero-subheadline">
            {commander.designation}
          </h2>

          <p className="hero-bio">
            {commander.bio}
          </p>
        </div>

        {/* Vital Stats Bar */}
        <div className="stats-row">
          {commander.stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <span className="stat-val">{stat.value}</span>
              <span className="stat-lbl">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Flight Directives Box */}
        <div className="directives-card">
          <div className="directives-header">
            <Shield size={14} className="text-cyan" />
            <span>PRIMARY FLIGHT DIRECTIVES</span>
          </div>
          <ul className="directives-list">
            {commander.directives.map((dir, idx) => (
              <li key={idx}>
                <span className="bullet-indicator">&gt;</span>
                <span>{dir}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bridge Action Launchers */}
        <div className="bridge-actions">
          <button
            className="action-btn primary"
            onClick={() => handleNav('missions')}
          >
            <Rocket size={16} />
            <span>EXPLORE MISSIONS</span>
            <ArrowRight size={14} />
          </button>

          <button
            className="action-btn secondary"
            onClick={() => handleNav('comms')}
          >
            <Send size={15} />
            <span>INITIATE TRANSMISSION</span>
          </button>

          <button
            className="action-btn tertiary"
            onClick={() => handleNav('dossier')}
          >
            <span>VIEW DOSSIER</span>
          </button>
        </div>
      </div>
    </section>
  )
}
