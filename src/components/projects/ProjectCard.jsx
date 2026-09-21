import { Layers, ArrowRight, UserCheck } from 'lucide-react'
import { soundManager } from '../../utils/audio'

/**
 * ProjectCard
 * Spacecraft mission terminal project card displaying:
 * - Project number (e.g. PROJECT 01)
 * - Project name
 * - Short description
 * - Technology tags (e.g. React • Node.js • Three.js)
 * - Role / Contribution badge if available
 * - Project visual preview with HUD fallback
 * - VIEW PROJECT action button
 * - Keyboard accessible (tabIndex, Enter/Space activation)
 */
export default function ProjectCard({
  project,
  onSelect,
  isFocused = false
}) {
  const handleClick = () => {
    soundManager.playWarp()
    onSelect(project)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <article
      className={`project-card sci-fi-notch ${isFocused ? 'is-keyboard-focused' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View project details for ${project.name}`}
    >
      {/* Top Header Row */}
      <div className="card-top-header">
        <span className="project-card-num">{project.number}</span>
        {project.role && (
          <span className="project-card-role-tag" title={project.role}>
            <UserCheck size={11} className="text-cyan" />
            <span>ROLE SPECIFIED</span>
          </span>
        )}
      </div>

      {/* Identity: Title & Description */}
      <div className="card-identity-block">
        <h3 className="project-card-title">{project.name}</h3>
        <p className="project-card-desc">{project.description || project.tagline}</p>
      </div>

      {/* Tech Stack Row */}
      <div className="project-card-tech-row" aria-label="Technologies used">
        {project.technologies?.map((tech) => (
          <span key={tech} className="tech-badge">
            {tech}
          </span>
        ))}
      </div>

      {/* Visual Preview / HUD Fallback */}
      <div className="project-card-image-wrap">
        <img
          src={project.image}
          alt={`${project.name} preview`}
          className="project-card-image"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none'
            if (e.target.nextSibling) {
              e.target.nextSibling.style.display = 'flex'
            }
          }}
        />
        <div className="project-image-fallback" style={{ display: 'none' }}>
          <Layers size={26} className="text-cyan animate-pulse" />
          <span className="fallback-label">[ {project.name} // VISUAL DATA ]</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="project-card-footer">
        <button
          className="view-project-btn"
          onClick={(e) => {
            e.stopPropagation()
            handleClick()
          }}
          type="button"
          tabIndex={-1}
        >
          <span>VIEW PROJECT</span>
          <ArrowRight size={14} className="btn-arrow" />
        </button>
      </div>
    </article>
  )
}
