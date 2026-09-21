import { useState } from 'react'
import { FolderGit2, ExternalLink, GitBranch, Eye, Terminal } from 'lucide-react'
import { soundManager } from '../../utils/audio'

export default function MissionsSection({ data, onSelectProject }) {
  const { missions } = data
  const [activeFilter, setActiveFilter] = useState('ALL')

  const categories = ['ALL', 'Full-Stack', 'WebGL / 3D', 'Security & Cloud', 'AI & Systems']

  const filteredMissions = activeFilter === 'ALL'
    ? missions
    : missions.filter((m) => m.category.toLowerCase().includes(activeFilter.toLowerCase()))

  const handleFilterChange = (cat) => {
    soundManager.playClick()
    setActiveFilter(cat)
  }

  return (
    <section className="hud-panel missions-panel sci-fi-notch">
      <div className="panel-inner">
        {/* Header Telemetry */}
        <div className="telemetry-bar">
          <div className="terminal-tag">
            <FolderGit2 size={14} />
            <span>MISSION ARCHIVE // DEPLOYED PROJECTS</span>
          </div>
          <span className="count-tag">{filteredMissions.length} MISSIONS LOGGED</span>
        </div>

        {/* Category Filters */}
        <div className="category-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
              onClick={() => handleFilterChange(cat)}
            >
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Missions Grid */}
        <div className="missions-grid">
          {filteredMissions.map((mission) => (
            <article key={mission.id} className="mission-card sci-fi-notch">
              <div className="mission-card-header">
                <span className="mission-code">{mission.code}</span>
                <span className={`mission-status-badge status-${mission.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {mission.status}
                </span>
              </div>

              <h3 className="mission-title">{mission.title}</h3>
              <p className="mission-desc">{mission.summary}</p>

              {/* Tech Stack Chips */}
              <div className="tech-tags">
                {mission.tech.map((t) => (
                  <span key={t} className="tech-tag">
                    {t}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mission-actions">
                <button
                  className="mission-btn primary"
                  onClick={() => {
                    soundManager.playClick()
                    onSelectProject(mission)
                  }}
                  title="Inspect Full Mission Data"
                >
                  <Eye size={14} />
                  <span>INSPECT</span>
                </button>

                <a
                  href={mission.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mission-btn icon-only"
                  onClick={() => soundManager.playClick()}
                  title="Launch Live Application"
                >
                  <ExternalLink size={14} />
                </a>

                <a
                  href={mission.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mission-btn icon-only"
                  onClick={() => soundManager.playClick()}
                  title="View Source Repository"
                >
                  <GitBranch size={14} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
