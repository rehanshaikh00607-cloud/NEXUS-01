import { useState } from 'react'
import {
  User,
  MapPin,
  Sparkles,
  Award,
  Terminal,
  Cpu,
  Layers,
  ShieldCheck,
  Download,
  Send,
  ExternalLink,
  Target,
  Compass,
  CheckCircle2
} from 'lucide-react'
import { portfolioData } from '../../data/portfolioData'
import { soundManager } from '../../utils/audio'

export default function AboutPanel({ onWarpToContact }) {
  const { commander } = portfolioData
  const [imgError, setImgError] = useState(false)
  const [activeCategory, setActiveCategory] = useState('ALL')

  const handleDownloadResume = () => {
    soundManager.playClick()
    if (commander.resumeUrl && commander.resumeUrl.endsWith('.pdf')) {
      window.open(commander.resumeUrl, '_blank')
    } else {
      alert('Resume Placeholder: To link your resume, place resume.pdf in the public/ directory or set commander.resumeUrl in src/data/portfolioData.js.')
    }
  }

  const allTechCategories = [
    'ALL',
    ...(commander.technologies ? commander.technologies.map((t) => t.category) : [])
  ]

  return (
    <div className="about-panel-container">
      {/* 1. Header Hero Card: Profile Photo + Core Identity */}
      <div className="pilot-hero-card sci-fi-notch">
        <div className="pilot-photo-wrapper">
          <div className="pilot-photo-frame">
            {!imgError ? (
              <img
                src={commander.photo || '/pilot/profile.jpg'}
                alt={`${commander.name} - ${commander.role}`}
                className="pilot-profile-img"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="pilot-photo-fallback">
                <User size={64} className="text-cyan" />
              </div>
            )}
            <div className="photo-scanline-overlay"></div>
            <div className="photo-corner top-left"></div>
            <div className="photo-corner top-right"></div>
            <div className="photo-corner bottom-left"></div>
            <div className="photo-corner bottom-right"></div>
          </div>

          <div className="pilot-status-badge">
            <span className="pulse-indicator"></span>
            <span>DUTY STATUS: {commander.status || 'ACTIVE'}</span>
          </div>
        </div>

        {/* Identity & Core Details */}
        <div className="pilot-identity-details">
          <div className="identity-header-tags">
            <span className="clearance-tag">
              <ShieldCheck size={13} className="text-cyan" />
              <span>{commander.clearance || 'SOFTWARE ENGINEER'}</span>
            </span>
            <span className="callsign-tag">{commander.callsign}</span>
          </div>

          <h1 className="pilot-name">{commander.name}</h1>
          <h2 className="pilot-role">{commander.role}</h2>

          <div className="pilot-meta-row">
            <div className="pilot-meta-item">
              <MapPin size={15} className="text-cyan" />
              <span><b>Location:</b> {commander.location}</span>
            </div>
            <div className="pilot-meta-item">
              <Compass size={15} className="text-cyan" />
              <span><b>Vessel:</b> {commander.vessel}</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="pilot-quick-stats">
            {commander.stats?.map((stat) => (
              <div key={stat.label} className="quick-stat-box">
                <span className="stat-number">{stat.value}</span>
                <span className="stat-title">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Who I Am Section */}
      <div className="about-section-box sci-fi-notch">
        <div className="section-title-bar">
          <Terminal size={15} className="text-cyan" />
          <h3>WHO I AM</h3>
        </div>
        <p className="intro-paragraph">
          {commander.shortIntroduction || commander.bio}
        </p>
      </div>

      {/* 3. What I Build Section */}
      {commander.whatIBuild && (
        <div className="about-section-box sci-fi-notch">
          <div className="section-title-bar">
            <Layers size={15} className="text-cyan" />
            <h3>WHAT I BUILD</h3>
          </div>
          <p className="intro-paragraph">
            {commander.whatIBuild}
          </p>
          {commander.directives && commander.directives.length > 0 && (
            <div className="directives-sublist">
              {commander.directives.map((directive, idx) => (
                <div key={idx} className="directive-item">
                  <span className="bullet text-cyan">&gt;</span>
                  <span>{directive}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Current Focus Section */}
      <div className="about-section-box current-focus-box sci-fi-notch">
        <div className="section-title-bar">
          <Target size={15} className="text-cyan" />
          <h3>CURRENT FOCUS & EXPLORATIONS</h3>
        </div>
        <div className="focus-content-layout">
          <div className="focus-beacon-pulse">
            <Sparkles size={22} className="text-cyan animate-pulse" />
          </div>
          <div className="focus-text-details">
            <p className="focus-main-text">{commander.currentFocus}</p>
            <div className="focus-pill-tags">
              {(commander.focusPills || [
                "Full-Stack Web Applications",
                "Interactive 3D WebGL (Three.js & R3F)",
                "REST & Real-Time WebSocket APIs",
                "Performance & Frontend Architecture"
              ]).map((pill) => (
                <span key={pill} className="focus-pill">{pill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Strongest Technologies Section */}
      <div className="about-section-box sci-fi-notch">
        <div className="section-title-bar space-between">
          <div className="title-left">
            <Cpu size={15} className="text-cyan" />
            <h3>STRONGEST TECHNOLOGIES & STACK</h3>
          </div>
          <div className="category-filter-chips">
            {allTechCategories.map((cat) => (
              <button
                key={cat}
                className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => {
                  soundManager.playClick()
                  setActiveCategory(cat)
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grouped or Filtered Technologies Display */}
        <div className="tech-groups-grid">
          {commander.technologies?.map((group) => {
            const isVisible = activeCategory === 'ALL' || activeCategory === group.category
            if (!isVisible) return null

            return (
              <div key={group.category} className="tech-group-card">
                <span className="group-category-title">{group.category}</span>
                <div className="tech-tags-wrapper">
                  {group.items.map((tech) => (
                    <span key={tech} className="tech-pill-tag">
                      <span className="tech-dot"></span>
                      <span>{tech}</span>
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 5. Directives & Action Bar */}
      <div className="about-actions-card">
        <div className="action-buttons-group">
          <button
            className="action-btn primary"
            onClick={handleDownloadResume}
          >
            <Download size={15} />
            <span>DOWNLOAD FLIGHT LOG (RESUME)</span>
          </button>

          {onWarpToContact && (
            <button
              className="action-btn secondary"
              onClick={() => {
                soundManager.playWarp()
                onWarpToContact()
              }}
            >
              <Send size={15} />
              <span>DISPATCH TRANSMISSION (CONTACT)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
