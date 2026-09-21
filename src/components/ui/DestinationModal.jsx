import { useState, useEffect, useCallback } from 'react'
import {
  X,
  ArrowLeft,
  Compass,
  ExternalLink,
  GitBranch,
  Send,
  Download,
  Briefcase,
  GraduationCap,
  Award,
  Cpu,
  FolderGit2,
  User,
  Radio,
  CheckCircle2,
  Rocket
} from 'lucide-react'
import ProjectsPanel from './ProjectsPanel'
import AboutPanel from './AboutPanel'
import { soundManager } from '../../utils/audio'

export default function DestinationModal({
  destination,
  data,
  onClose,
  onWarpTo
}) {
  const [activeProjectFilter, setActiveProjectFilter] = useState('ALL')
  const [commsForm, setCommsForm] = useState({ callsign: '', frequency: '', subject: '', message: '' })
  const [transmitted, setTransmitted] = useState(false)

  if (!destination) return null

  const { commander, missions, subsystems, comms } = data

  const handleClose = () => {
    soundManager.playClick()
    onClose()
  }

  const handleCommsSubmit = (e) => {
    e.preventDefault()
    if (!commsForm.callsign || !commsForm.frequency || !commsForm.message) return

    soundManager.playWarp()
    setTransmitted(true)
    setTimeout(() => {
      soundManager.playClick()
    }, 500)
  }

  const filteredMissions = activeProjectFilter === 'ALL'
    ? missions
    : missions.filter((m) => m.category.toLowerCase().includes(activeProjectFilter.toLowerCase()))

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        className="destination-modal-panel sci-fi-notch"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Destination Header */}
        <div className="dest-modal-header">
          <div className="dest-modal-identity">
            <span className="dest-sector-tag">
              <Compass size={13} /> {destination.sector} // {destination.objectType}
            </span>
            <h2 className="dest-title">{destination.name}</h2>
            <span className="dest-tagline">{destination.tagline}</span>
          </div>

          <button
            id="return-to-flight-btn-header"
            className="dest-return-flight-btn header-btn"
            onClick={handleClose}
            title="Return to spaceship flight (ESC)"
            aria-label="Return to flight"
          >
            <ArrowLeft size={16} className="btn-arrow" />
            <span>RETURN TO FLIGHT</span>
            <span className="key-tag">[ESC]</span>
          </button>
        </div>

        {/* Modal Dynamic Body based on destination.id */}
        <div className="dest-modal-body">
          {/* ================= 1. HOME / LAUNCH PAD ================= */}
          {destination.id === 'home' && (
            <div className="dest-content-section">
              <div className="home-hero-card sci-fi-notch">
                <div className="card-top-tag">
                  <Rocket size={14} className="text-cyan" />
                  <span>ORBITAL LAUNCH DOCK // STARTER COORDINATES [0, 0, 0]</span>
                </div>
                <h3>WELCOME TO THE NEXUS-01 PORTFOLIO ODYSSEY</h3>
                <p>
                  You are piloting the <b>NEXUS-01</b> reconnaissance craft across deep space.
                  Explore planetary systems, research stations, and communication satellites to inspect
                  the Commander's professional software engineering portfolio.
                </p>

                <div className="flight-briefing-grid">
                  <div className="briefing-box">
                    <span className="box-title">PILOT FLIGHT CONTROLS</span>
                    <ul className="controls-list-clean">
                      <li><b>W / ↑</b> — Forward Thrusters</li>
                      <li><b>S / ↓</b> — Reverse Thrusters</li>
                      <li><b>A / D (← / →)</b> — Yaw Turn Left / Right</li>
                      <li><b>Q / E</b> — Roll / Bank Trim</li>
                      <li><b>Shift</b> — Warp Speed Boost</li>
                      <li><b>Enter</b> — Explore Destination when in range</li>
                    </ul>
                  </div>

                  <div className="briefing-box">
                    <span className="box-title">QUICK AUTOPILOT WARP</span>
                    <p className="warp-desc">Instantly jump to any sector destination:</p>
                    <div className="quick-warp-buttons">
                      <button onClick={() => onWarpTo('about')} className="warp-btn">
                        <span>02. ABOUT ME</span>
                      </button>
                      <button onClick={() => onWarpTo('projects')} className="warp-btn">
                        <span>03. PROJECTS</span>
                      </button>
                      <button onClick={() => onWarpTo('skills')} className="warp-btn">
                        <span>04. SKILLS</span>
                      </button>
                      <button onClick={() => onWarpTo('experience')} className="warp-btn">
                        <span>05. EXPERIENCE</span>
                      </button>
                      <button onClick={() => onWarpTo('education')} className="warp-btn">
                        <span>06. EDUCATION</span>
                      </button>
                      <button onClick={() => onWarpTo('contact')} className="warp-btn">
                        <span>07. CONTACT</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. ABOUT ME ================= */}
          {destination.id === 'about' && (
            <div className="dest-content-section">
              <AboutPanel onWarpToContact={() => onWarpTo('contact')} />
            </div>
          )}

          {/* ================= 3. PROJECTS ================= */}
          {destination.id === 'projects' && (
            <div className="dest-content-section">
              <ProjectsPanel />
            </div>
          )}

          {/* ================= 4. SKILLS ================= */}
          {destination.id === 'skills' && (
            <div className="dest-content-section">
              <div className="subsystems-grid">
                {subsystems.map((subsystem) => (
                  <div key={subsystem.sector} className="subsystem-card sci-fi-notch">
                    <div className="subsystem-card-header">
                      <Cpu size={15} className="text-cyan" />
                      <h4>{subsystem.sector}</h4>
                    </div>
                    <p className="subsystem-desc">{subsystem.description}</p>
                    <div className="skills-list">
                      {subsystem.skills.map((skill) => (
                        <div key={skill.name} className="skill-item">
                          <div className="skill-info">
                            <span className="skill-name">{skill.name}</span>
                            <span className="skill-status-tag">{skill.status} // {skill.level}%</span>
                          </div>
                          <div className="skill-meter-track">
                            <div className="skill-meter-fill" style={{ width: `${skill.level}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 5. EXPERIENCE ================= */}
          {destination.id === 'experience' && (
            <div className="dest-content-section">
              <div className="experience-header-bar">
                <span className="sec-tag">WORK EXPERIENCE & CAREER TIMELINE</span>
                <button
                  className="download-btn"
                  onClick={() => {
                    soundManager.playClick()
                    if (commander.resumeUrl && commander.resumeUrl.endsWith('.pdf')) {
                      window.open(commander.resumeUrl, '_blank')
                    } else {
                      alert('Resume Placeholder: To link your resume, place resume.pdf in the public/ directory or set commander.resumeUrl in src/data/portfolioData.js.')
                    }
                  }}
                >
                  <Download size={13} />
                  <span>DOWNLOAD RESUME (PDF)</span>
                </button>
              </div>

              <div className="timeline-container">
                {commander.experience.map((exp, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-marker">
                      <div className="marker-dot"></div>
                      <div className="marker-line"></div>
                    </div>
                    <div className="timeline-content sci-fi-notch">
                      <div className="timeline-top">
                        <span className="station-role">{exp.role}</span>
                        <span className="station-period">{exp.period}</span>
                      </div>
                      <span className="station-name">{exp.station}</span>
                      <p className="station-desc">{exp.description}</p>
                      {exp.achievements && exp.achievements.length > 0 && (
                        <ul className="station-achievements">
                          {exp.achievements.map((item, i) => (
                            <li key={i}>
                              <span className="bullet text-cyan">&gt;</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 6. EDUCATION ================= */}
          {destination.id === 'education' && (
            <div className="dest-content-section">
              <div className="education-grid">
                {commander.education.map((edu, idx) => (
                  <div key={idx} className="education-card sci-fi-notch">
                    <div className="edu-top">
                      <GraduationCap size={20} className="text-cyan" />
                      <div>
                        <h4>{edu.degree}</h4>
                        <span className="edu-institution">{edu.institution} // {edu.period}</span>
                      </div>
                    </div>

                    <div className="edu-honors-pill">
                      <Award size={14} className="text-nominal" />
                      <span>{edu.honors}</span>
                    </div>

                    <p className="edu-focus"><b>Core Focus:</b> {edu.focus}</p>

                    <div className="courses-list">
                      <span className="courses-lbl">ACADEMIC MODULES:</span>
                      <div className="course-chips">
                        {edu.courses.map((c) => (
                          <span key={c} className="course-chip">{c}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 7. CONTACT ================= */}
          {destination.id === 'contact' && (
            <div className="dest-content-section">
              <div className="comms-layout">
                {/* Contact Form */}
                <div className="comms-form-wrapper">
                  <h3>GET IN TOUCH</h3>
                  <p className="comms-intro">
                    Send a message regarding project inquiries, open roles, or technical collaborations directly to Arsh.
                  </p>

                  {transmitted ? (
                    <div className="transmission-success-box sci-fi-notch">
                      <CheckCircle2 size={32} className="text-nominal" />
                      <h4>MESSAGE TRANSMITTED</h4>
                      <p>
                        Your message has been sent. Arsh will review the transmission and reply via your return email shortly.
                      </p>
                      <button
                        className="action-btn secondary"
                        onClick={() => setTransmitted(false)}
                      >
                        SEND ANOTHER MESSAGE
                      </button>
                    </div>
                  ) : (
                    <form className="transmission-form" onSubmit={handleCommsSubmit}>
                      <div className="form-row">
                        <div className="form-field">
                          <label>NAME *</label>
                          <input
                            type="text"
                            required
                            placeholder="Your Name or Company"
                            value={commsForm.callsign}
                            onChange={(e) => setCommsForm({ ...commsForm, callsign: e.target.value })}
                          />
                        </div>
                        <div className="form-field">
                          <label>EMAIL ADDRESS *</label>
                          <input
                            type="email"
                            required
                            placeholder="your.email@example.com"
                            value={commsForm.frequency}
                            onChange={(e) => setCommsForm({ ...commsForm, frequency: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="form-field">
                        <label>SUBJECT</label>
                        <input
                          type="text"
                          placeholder="Project Inquiry / Job Opportunity / Collaboration"
                          value={commsForm.subject}
                          onChange={(e) => setCommsForm({ ...commsForm, subject: e.target.value })}
                        />
                      </div>

                      <div className="form-field">
                        <label>MESSAGE *</label>
                        <textarea
                          rows="4"
                          required
                          placeholder="Write your message, project specifications, or questions here..."
                          value={commsForm.message}
                          onChange={(e) => setCommsForm({ ...commsForm, message: e.target.value })}
                        ></textarea>
                      </div>

                      <button type="submit" className="transmit-btn">
                        <Send size={15} />
                        <span>SEND MESSAGE</span>
                      </button>
                    </form>
                  )}
                </div>

                {/* Direct Frequencies */}
                <div className="comms-frequencies-wrapper">
                  <h3>DIRECT CHANNELS</h3>
                  <div className="frequencies-list">
                    {comms.frequencies.map((freq) => (
                      <a
                        key={freq.name}
                        href={freq.link}
                        target="_blank"
                        rel="noreferrer"
                        className="frequency-card"
                        onClick={() => soundManager.playClick()}
                      >
                        <div className="freq-info">
                          <span className="freq-name">{freq.name}</span>
                          <span className="freq-val">{freq.value}</span>
                        </div>
                        <ExternalLink size={14} className="freq-icon" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Return Bar */}
        <div className="dest-modal-footer">
          <button
            id="return-to-flight-btn-footer"
            className="dest-return-flight-btn footer-btn"
            onClick={handleClose}
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
    </div>
  )
}
