import { useState } from 'react'
import { PROJECTS_DATA } from '../../data/projectsData'
import { soundManager } from '../../utils/audio'
import {
  ExternalLink,
  GitBranch,
  FileText,
  X,
  CheckCircle2,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react'

export default function ProjectsPanel({
  projects = PROJECTS_DATA,
  title = "MISSION PROJECTS ARCHIVE",
  subtitle = "Deployed Software, Web Applications & Interactive Experiences"
}) {
  const [selectedFilter, setSelectedFilter] = useState('ALL')
  const [activeCaseStudy, setActiveCaseStudy] = useState(null)

  // Extract distinct categories dynamically
  const categories = ['ALL', ...new Set(projects.map((p) => p.category))]

  const filteredProjects = selectedFilter === 'ALL'
    ? projects
    : projects.filter((p) => p.category === selectedFilter)

  const handleFilterClick = (cat) => {
    soundManager.playClick()
    setSelectedFilter(cat)
  }

  const handleOpenCaseStudy = (project) => {
    soundManager.playWarp()
    setActiveCaseStudy(project)
  }

  const handleCloseCaseStudy = () => {
    soundManager.playClick()
    setActiveCaseStudy(null)
  }

  return (
    <div className="projects-panel-wrapper">
      {/* Panel Top Heading & Category Filters */}
      <div className="projects-panel-header">
        <div className="header-info">
          <div className="header-badge">
            <Layers size={13} className="text-cyan" />
            <span>{title}</span>
          </div>
          <p className="header-subtitle">{subtitle}</p>
        </div>

        <div className="category-filter-chips">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-chip ${selectedFilter === cat ? 'active' : ''}`}
              onClick={() => handleFilterClick(cat)}
            >
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="projects-cards-grid">
        {filteredProjects.map((project) => (
          <article key={project.id} className="project-card sci-fi-notch">
            {/* Project Screenshot Container */}
            <div className="project-screenshot-container">
              <img
                src={project.screenshot}
                alt={`${project.name} preview`}
                className="project-screenshot-img"
                loading="lazy"
                onError={(e) => {
                  // Elegant fallback if image cannot be loaded
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              {/* Fallback placeholder badge */}
              <div className="screenshot-fallback" style={{ display: 'none' }}>
                <Sparkles size={24} className="text-cyan" />
                <span>{project.name} // SCREENSHOT PREVIEW</span>
              </div>

              <div className="screenshot-overlay-tag">
                <span className="status-badge">{project.status}</span>
                <span className="category-badge">{project.category}</span>
              </div>
            </div>

            {/* Project Details */}
            <div className="project-card-body">
              <div className="project-title-row">
                <h3 className="project-name">{project.name}</h3>
              </div>

              <p className="project-description">{project.description}</p>

              {/* Engineering Metrics Highlight */}
              {project.metrics && (
                <div className="project-metrics-callout">
                  <CheckCircle2 size={13} className="text-cyan flex-shrink-0" />
                  <span>{project.metrics}</span>
                </div>
              )}

              {/* Technology Tags */}
              <div className="project-tech-tags">
                {project.technologies.map((tech) => (
                  <span key={tech} className="tech-badge">
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action Buttons: Case Study, Live Demo, GitHub */}
              <div className="project-card-actions">
                <button
                  className="action-btn-case-study"
                  onClick={() => handleOpenCaseStudy(project)}
                  title="Inspect Architecture Case Study"
                >
                  <FileText size={14} />
                  <span>View Case Study</span>
                  <ChevronRight size={13} />
                </button>

                <div className="external-links-group">
                  <a
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="action-link-btn"
                    onClick={() => soundManager.playClick()}
                    title="Launch Live Demo"
                  >
                    <ExternalLink size={14} />
                    <span>Live Demo</span>
                  </a>

                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="action-link-btn github"
                    onClick={() => soundManager.playClick()}
                    title="View Source on GitHub"
                  >
                    <GitBranch size={14} />
                    <span>GitHub</span>
                  </a>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Case Study Modal Inspection View */}
      {activeCaseStudy && (
        <div className="case-study-backdrop" onClick={handleCloseCaseStudy}>
          <div
            className="case-study-modal sci-fi-notch"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="case-study-header">
              <div>
                <span className="case-study-tag">CASE STUDY // SPECIFICATION DEEP-DIVE</span>
                <h2 className="case-study-title">{activeCaseStudy.name}</h2>
                <span className="case-study-tagline">{activeCaseStudy.tagline}</span>
              </div>

              <button
                className="case-study-close-btn"
                onClick={handleCloseCaseStudy}
                aria-label="Close Case Study"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="case-study-body">
              {/* Project Screenshot Large */}
              <div className="case-study-preview-banner">
                <img
                  src={activeCaseStudy.screenshot}
                  alt={activeCaseStudy.name}
                  className="banner-img"
                />
              </div>

              {activeCaseStudy.caseStudy && (
                <>
                  <div className="case-study-section">
                    <h4>EXECUTIVE OVERVIEW</h4>
                    <p>{activeCaseStudy.caseStudy.overview || activeCaseStudy.description}</p>
                  </div>

                  <div className="case-study-section">
                    <h4>TECHNICAL CHALLENGE</h4>
                    <p>{activeCaseStudy.caseStudy.challenge}</p>
                  </div>

                  <div className="case-study-section">
                    <h4>ARCHITECTURE & SOLUTION</h4>
                    <p>{activeCaseStudy.caseStudy.solution || activeCaseStudy.caseStudy.architecture}</p>
                  </div>

                  <div className="case-study-section">
                    <h4>QUANTIFIABLE OUTCOMES</h4>
                    <p>{activeCaseStudy.caseStudy.outcome || activeCaseStudy.caseStudy.results}</p>
                  </div>

                  {activeCaseStudy.caseStudy.keyFeatures && (
                    <div className="case-study-section">
                      <h4>KEY SYSTEM HIGHLIGHTS</h4>
                      <ul className="features-list">
                        {activeCaseStudy.caseStudy.keyFeatures.map((feat, i) => (
                          <li key={i}>
                            <span className="bullet text-cyan">&gt;</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}

              {/* Technologies Used */}
              <div className="case-study-section">
                <h4>FULL SUBSYSTEM STACK</h4>
                <div className="tech-pills-wrap">
                  {activeCaseStudy.technologies.map((t) => (
                    <span key={t} className="tech-pill-large">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Direct Links */}
              <div className="case-study-actions">
                <a
                  href={activeCaseStudy.liveDemoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="cs-btn primary"
                  onClick={() => soundManager.playClick()}
                >
                  <ExternalLink size={15} />
                  <span>Launch Live Deployment</span>
                </a>

                <a
                  href={activeCaseStudy.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="cs-btn secondary"
                  onClick={() => soundManager.playClick()}
                >
                  <GitBranch size={15} />
                  <span>Inspect Source Code</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
