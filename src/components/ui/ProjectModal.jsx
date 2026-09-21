import { X, ExternalLink, GitBranch, Terminal, CheckCircle2 } from 'lucide-react'
import { soundManager } from '../../utils/audio'

export default function ProjectModal({ project, onClose }) {
  if (!project) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel sci-fi-notch"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-tag">
            <Terminal size={14} />
            <span>MISSION SPECIFICATION // {project.code}</span>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => {
              soundManager.playClick()
              onClose()
            }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-title-row">
            <div>
              <h3>{project.title}</h3>
              <span className="modal-category">{project.category} // STATUS: {project.status}</span>
            </div>
            <span className="status-badge-inline">{project.status}</span>
          </div>

          <div className="modal-section">
            <h4>MISSION OBJECTIVE</h4>
            <p>{project.summary}</p>
          </div>

          <div className="modal-section">
            <h4>ENGINEERING HIGHLIGHTS</h4>
            <div className="highlight-callout">
              <CheckCircle2 size={16} className="highlight-icon" />
              <span>{project.metrics}</span>
            </div>
          </div>

          <div className="modal-section">
            <h4>SUBSYSTEM ARCHITECTURE</h4>
            <div className="tech-pills-container">
              {project.tech.map((t) => (
                <span key={t} className="tech-pill-large">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="action-btn primary"
              onClick={() => soundManager.playClick()}
            >
              <ExternalLink size={16} />
              <span>LAUNCH LIVE INTERFACE</span>
            </a>

            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="action-btn secondary"
              onClick={() => soundManager.playClick()}
            >
              <GitBranch size={16} />
              <span>VIEW SOURCE FLIGHT CODE</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
