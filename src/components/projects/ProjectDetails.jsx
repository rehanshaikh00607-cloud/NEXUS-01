import {
  ArrowLeft,
  ExternalLink,
  GitBranch,
  Shield,
  Layers,
  Target,
  Trophy,
  FileText,
  CheckCircle2
} from 'lucide-react'
import { soundManager } from '../../utils/audio'

/**
 * ProjectDetails
 * Spacecraft mission terminal specification view.
 *
 * Visual Hierarchy:
 * 1. Project Name & Number
 * 2. What the project does (Description & Tagline)
 * 3. Technology stack (Tags)
 * 4. User's role / contribution (if available)
 * 5. Architectural case study (Challenge, Solution, Result)
 * 6. Action Links (Live Demo, GitHub - ONLY rendered if URLs exist in data)
 * 7. In-panel Return controls (← BACK TO PROJECTS, ← RETURN TO FLIGHT)
 */
export default function ProjectDetails({ project, onBack, onReturnToFlight }) {
  if (!project) return null

  const handleLiveDemo = () => {
    if (!project.liveDemoUrl) return
    soundManager.playClick()
    window.open(project.liveDemoUrl, '_blank', 'noopener,noreferrer')
  }

  const handleGitHub = () => {
    if (!project.githubUrl) return
    soundManager.playClick()
    window.open(project.githubUrl, '_blank', 'noopener,noreferrer')
  }

  const handleBack = () => {
    soundManager.playClick()
    onBack()
  }

  const handleFlight = () => {
    soundManager.playClick()
    if (onReturnToFlight) onReturnToFlight()
  }

  return (
    <div className="project-details-view animate-fade-in">
      {/* 1. PROJECT HEADER & NUMBER */}
      <div className="project-details-header sci-fi-notch">
        <div className="details-header-top">
          <span className="project-detail-num">{project.number}</span>
          <button
            id="details-back-btn-top"
            className="details-back-btn"
            onClick={handleBack}
            title="Return to project list (ESC)"
            type="button"
          >
            <ArrowLeft size={14} />
            <span>← BACK TO PROJECTS</span>
          </button>
        </div>
        <h2 className="project-detail-title">{project.name}</h2>
        {project.tagline && (
          <p className="project-detail-tagline">{project.tagline}</p>
        )}
      </div>

      {/* Visual Preview Banner (if image available) */}
      {project.image && (
        <div className="project-details-banner sci-fi-notch">
          <img
            src={project.image}
            alt={project.name}
            className="details-banner-img"
            onError={(e) => {
              e.target.style.display = 'none'
              if (e.target.nextSibling) {
                e.target.nextSibling.style.display = 'flex'
              }
            }}
          />
          <div className="details-banner-fallback" style={{ display: 'none' }}>
            <Layers size={36} className="text-cyan animate-pulse" />
            <span>[ {project.name} // SYSTEM TELEMETRY PREVIEW ]</span>
          </div>
        </div>
      )}

      {/* 2. WHAT THE PROJECT DOES (DESCRIPTION) */}
      {project.description && (
        <div className="details-section-box sci-fi-notch">
          <div className="section-title-tag">
            <FileText size={15} className="text-cyan" />
            <h3>DESCRIPTION</h3>
          </div>
          <p className="section-body-text">{project.description}</p>
        </div>
      )}

      {/* 3. TECHNOLOGY STACK */}
      {project.technologies && project.technologies.length > 0 && (
        <div className="details-section-box sci-fi-notch">
          <div className="section-title-tag">
            <Layers size={15} className="text-cyan" />
            <h3>TECHNOLOGY STACK</h3>
          </div>
          <div className="tech-tags-list">
            {project.technologies.map((tech) => (
              <span key={tech} className="detail-tech-pill">
                <span className="pill-dot"></span>
                <span>{tech}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 4. USER'S ROLE & CONTRIBUTION (ONLY if available) */}
      {project.role && (
        <div className="details-section-box sci-fi-notch role-highlight-box">
          <div className="section-title-tag">
            <Shield size={15} className="text-cyan" />
            <h3>MY ROLE & CONTRIBUTION</h3>
          </div>
          <p className="section-body-text">{project.role}</p>
        </div>
      )}

      {/* KEY FEATURES (if available) */}
      {project.features && project.features.length > 0 && (
        <div className="details-section-box sci-fi-notch">
          <div className="section-title-tag">
            <CheckCircle2 size={15} className="text-cyan" />
            <h3>KEY CAPABILITIES</h3>
          </div>
          <ul className="details-features-list">
            {project.features.map((feature, idx) => (
              <li key={idx}>
                <span className="bullet text-cyan">&gt;</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 5. ARCHITECTURAL CASE STUDY (Challenge, Solution, Result) */}
      {(project.challenge || project.solution || project.result) && (
        <div className="details-casestudy-grid">
          {project.challenge && (
            <div className="details-section-box sci-fi-notch">
              <div className="section-title-tag">
                <Target size={15} className="text-cyan" />
                <h3>TECHNICAL CHALLENGE</h3>
              </div>
              <p className="section-body-text">{project.challenge}</p>
            </div>
          )}

          {project.solution && (
            <div className="details-section-box sci-fi-notch">
              <div className="section-title-tag">
                <Layers size={15} className="text-cyan" />
                <h3>ENGINEERING SOLUTION</h3>
              </div>
              <p className="section-body-text">{project.solution}</p>
            </div>
          )}

          {project.result && (
            <div className="details-section-box sci-fi-notch">
              <div className="section-title-tag">
                <Trophy size={15} className="text-cyan" />
                <h3>DELIVERED OUTCOME</h3>
              </div>
              <p className="section-body-text">{project.result}</p>
            </div>
          )}
        </div>
      )}

      {/* 6. PROJECT ACTIONS & LINKS (ONLY rendered if URLs exist) */}
      <div className="project-details-actions-panel sci-fi-notch">
        <div className="primary-actions-row">
          {/* LIVE DEMO: only render if link exists */}
          {project.liveDemoUrl && (
            <button
              id="project-live-demo-btn"
              className="detail-action-btn primary"
              onClick={handleLiveDemo}
              title="Open project deployment in a new tab"
              type="button"
            >
              <ExternalLink size={15} />
              <span>LIVE DEMO</span>
            </button>
          )}

          {/* GITHUB: only render if link exists */}
          {project.githubUrl && (
            <button
              id="project-github-btn"
              className="detail-action-btn secondary"
              onClick={handleGitHub}
              title="Inspect source code on GitHub"
              type="button"
            >
              <GitBranch size={15} />
              <span>GITHUB</span>
            </button>
          )}

          {/* Return to Project List */}
          <button
            id="project-back-grid-btn"
            className="detail-action-btn back"
            onClick={handleBack}
            title="Return to Projects List"
            type="button"
          >
            <ArrowLeft size={15} />
            <span>← BACK TO PROJECTS</span>
          </button>
        </div>

        {/* 7. Dedicated Return to Flight Action Bar */}
        <div className="details-return-flight-bar">
          <button
            id="details-return-to-flight-btn"
            className="detail-action-btn return-flight"
            onClick={handleFlight}
            title="Close dossier and resume spaceship flight"
            type="button"
          >
            <ArrowLeft size={16} />
            <span>← RETURN TO FLIGHT</span>
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
