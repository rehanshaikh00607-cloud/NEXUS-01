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
  User,
  Radio,
  CheckCircle2,
  Rocket,
  Layers,
  Sparkles,
  MapPin,
  ShieldCheck,
  Target,
  Terminal
} from 'lucide-react'
import ProjectPanel from './ProjectPanel'
import AboutPanel from './about/AboutPanel'
import SkillsPanel from './skills/SkillsPanel'
import ExperiencePanel from './experience/ExperiencePanel'
import EducationPanel from './education/EducationPanel'
import { soundManager } from '../utils/audio'
import { commanderData } from '../data/destinations'
import { SKILLS_SUBSYSTEMS } from '../data/skills'

/**
 * MissionPanel
 * Primary modal overlay displaying readable dossiers for celestial destinations:
 * - Home (Flight briefing & controls)
 * - About Me (Pilot identity, what I build, stack, current focus)
 * - Projects (Interactive projects archive & case studies)
 * - Skills (Subsystems & proficiency metrics)
 * - Experience (Career milestones & station roles)
 * - Education (Academic modules & credentials)
 * - Contact (Transmission dispatch form & direct frequencies)
 */
export default function MissionPanel({
  destination,
  commander = commanderData,
  subsystems = SKILLS_SUBSYSTEMS,
  onClose,
  onWarpTo
}) {
  const [activeTechCategory, setActiveTechCategory] = useState('ALL')
  const [imgError, setImgError] = useState(false)
  const [commsForm, setCommsForm] = useState({ callsign: '', frequency: '', subject: '', message: '' })
  const [transmitted, setTransmitted] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  if (!destination) return null

  const handleClose = useCallback(() => {
    if (isExiting) return
    soundManager.playPanelClose()
    setIsExiting(true)
    setTimeout(() => {
      onClose()
    }, 220)
  }, [isExiting, onClose])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleClose])

  const handleDownloadResume = () => {
    soundManager.playClick()
    if (commander.resumeUrl && commander.resumeUrl.endsWith('.pdf')) {
      window.open(commander.resumeUrl, '_blank')
    } else {
      alert('Resume Placeholder: Place your resume.pdf in public/ or configure resumeUrl in src/data/destinations.js.')
    }
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

  const allTechCategories = [
    'ALL',
    ...(commander.technologies ? commander.technologies.map((t) => t.category) : [])
  ]

  return (
    <div className={`modal-backdrop ${isExiting ? 'exit-fade' : ''}`} onClick={handleClose}>
      <div
        className={`destination-modal-panel sci-fi-notch ${isExiting ? 'exit-scale' : ''} ${
          destination.id === 'projects' || destination.id === 'skills' || destination.id === 'experience' || destination.id === 'education' ? 'projects-modal-wide' : ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="dest-modal-header">
          <div className="dest-modal-identity">
            <span className="dest-sector-tag">
              <Compass size={13} /> {
                destination.id === 'projects'
                  ? 'NEXUS-01 // PROJECT ARCHIVE'
                  : destination.id === 'about'
                  ? 'NEXUS-01 // CREW PROFILE'
                  : destination.id === 'skills'
                  ? 'NEXUS-01 // TECHNICAL AVIONICS'
                  : destination.id === 'experience'
                  ? 'SECTOR-04 // CRATERED EXOMOON'
                  : destination.id === 'education'
                  ? 'SECTOR-05 // BRONZE PLANET'
                  : `${destination.sector} // ${destination.objectType}`
              }
            </span>
            <h2 className="dest-title">
              {
                destination.id === 'projects'
                  ? 'PROJECT DATABASE'
                  : destination.id === 'about'
                  ? 'ABOUT THE PILOT'
                  : destination.id === 'skills'
                  ? 'TECHNICAL SUBSYSTEMS & SKILLS'
                  : destination.id === 'experience'
                  ? 'SHADOW MOON'
                  : destination.id === 'education'
                  ? 'BRONZE PLANET'
                  : destination.name
              }
            </h2>
            <span className="dest-tagline">
              {
                destination.id === 'projects'
                  ? 'SELECT A PROJECT TO INSPECT'
                  : destination.id === 'about'
                  ? 'NEXUS-01 // CREW PROFILE'
                  : destination.id === 'skills'
                  ? 'SPACE STATION ALPHA // CORE PROFICIENCIES & CAPABILITIES'
                  : destination.id === 'experience'
                  ? 'NEXUS-01 // FLIGHT HISTORY'
                  : destination.id === 'education'
                  ? 'NEXUS-01 // ACADEMIC ARCHIVE'
                  : destination.tagline
              }
            </span>
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
                  You are piloting the <b>NEXUS-01</b> exploration vessel across orbital sectors.
                  Navigate through planetary bodies, research stations, and communication relays to explore
                  Arsh's software engineering projects and technical stack.
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
                      <li><b>H / ?</b> — Flight Manual</li>
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

          {/* ================= 2. ABOUT THE PILOT ================= */}
          {destination.id === 'about' && (
            <div className="dest-content-section about-destination-section">
              <AboutPanel onClose={handleClose} />
            </div>
          )}

          {/* ================= 3. PROJECTS ================= */}
          {destination.id === 'projects' && (
            <div className="dest-content-section">
              <ProjectPanel onClose={handleClose} />
            </div>
          )}

          {/* ================= 4. SKILLS ================= */}
          {destination.id === 'skills' && (
            <div className="dest-content-section skills-destination-section">
              <SkillsPanel onClose={handleClose} />
            </div>
          )}

          {/* ================= 5. EXPERIENCE ================= */}
          {destination.id === 'experience' && (
            <div className="dest-content-section experience-destination-section">
              <ExperiencePanel onClose={handleClose} />
            </div>
          )}

          {/* ================= 6. EDUCATION // BRONZE PLANET ================= */}
          {destination.id === 'education' && (
            <div className="dest-content-section education-destination-section">
              <EducationPanel onClose={handleClose} />
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
                    Send a direct transmission regarding project inquiries, open roles, or technical collaborations directly to Arsh.
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
                    {commander.commsFrequencies?.map((freq) => (
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
