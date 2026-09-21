import { FileText, Award, Clock, Briefcase, Download, CheckCircle } from 'lucide-react'
import { soundManager } from '../../utils/audio'

export default function DossierSection({ data }) {
  const { commander } = data

  const handleDownloadResume = () => {
    soundManager.playClick()
    // Simulated resume download trigger
    alert('Simulated Flight Log / Resume Download: Commander Arsh Dossier [PDF ready].')
  }

  return (
    <section className="hud-panel dossier-panel sci-fi-notch">
      <div className="panel-inner">
        {/* Header Tag */}
        <div className="telemetry-bar">
          <div className="terminal-tag">
            <FileText size={14} />
            <span>PERSONNEL DOSSIER // SERVICE RECORD</span>
          </div>
          <button className="download-btn" onClick={handleDownloadResume}>
            <Download size={13} />
            <span>DOWNLOAD FLIGHT LOG (RESUME)</span>
          </button>
        </div>

        {/* Identity Dossier Card */}
        <div className="dossier-identity-grid">
          <div className="identity-cell">
            <span className="cell-label">OFFICER IDENTIFIER</span>
            <span className="cell-value highlight">{commander.callsign}</span>
          </div>
          <div className="identity-cell">
            <span className="cell-label">ASSIGNED CRAFT</span>
            <span className="cell-value">{commander.vessel}</span>
          </div>
          <div className="identity-cell">
            <span className="cell-label">DUTY STATUS</span>
            <span className="cell-value text-nominal">{commander.status}</span>
          </div>
          <div className="identity-cell">
            <span className="cell-label">SECURITY CLEARANCE</span>
            <span className="cell-value text-cyan">{commander.clearance}</span>
          </div>
        </div>

        {/* Experience Timeline */}
        <div className="section-block">
          <div className="block-title">
            <Briefcase size={16} className="text-cyan" />
            <h3>MISSION HISTORY & CAREER STATIONS</h3>
          </div>

          <div className="timeline-container">
            {commander.experience.map((exp, idx) => (
              <div key={idx} className="timeline-item">
                <div className="timeline-marker">
                  <div className="marker-dot"></div>
                  <div className="marker-line"></div>
                </div>
                <div className="timeline-content">
                  <div className="timeline-top">
                    <span className="station-role">{exp.role}</span>
                    <span className="station-period">{exp.period}</span>
                  </div>
                  <span className="station-name">{exp.station}</span>
                  <p className="station-desc">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Principles */}
        <div className="section-block">
          <div className="block-title">
            <Award size={16} className="text-cyan" />
            <h3>ENGINEERING PHILOSOPHY</h3>
          </div>

          <div className="philosophy-grid">
            <div className="philosophy-card">
              <h4>Precision Architecture</h4>
              <p>Writing type-safe, modular, and maintainable software engineered to withstand heavy telemetry loads.</p>
            </div>
            <div className="philosophy-card">
              <h4>Immersive Aesthetics</h4>
              <p>Blending high-performance WebGL 3D graphics with accessible, refined, and responsive user interfaces.</p>
            </div>
            <div className="philosophy-card">
              <h4>Continuous Telemetry</h4>
              <p>Obsessive monitoring, automated testing, and sub-second page performance benchmarks.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
