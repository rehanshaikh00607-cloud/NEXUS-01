import React from 'react'
import { Cpu, Terminal, Radio, Shield, CheckCircle2 } from 'lucide-react'

/**
 * TimelineEntry
 * Renders an individual spacecraft flight log timeline entry for Shadow Moon.
 * Follows the mission flight log format:
 * - Year marker
 * - Mission title & status badge
 * - ORGANIZATION label & content
 * - Mission details / description
 * - TECHNOLOGIES label & futuristic chips
 */
export default function TimelineEntry({ entry, index = 0 }) {
  const isCurrent = entry.isActive || entry.year === '2026'

  return (
    <div
      className={`flight-log-item ${isCurrent ? 'is-active-mission' : ''}`}
      style={{ '--entry-index': index }}
    >
      {/* Timeline Node Column */}
      <div className="flight-log-node-col">
        <div className="flight-log-beacon">
          <div className={`beacon-dot ${isCurrent ? 'beacon-pulse' : ''}`} />
          {isCurrent && <div className="beacon-ring" />}
        </div>
        <div className="flight-log-vertical-line" />
      </div>

      {/* Flight Log Card */}
      <div className="flight-log-card sci-fi-notch">
        {/* Card Header: Year & Mission Status */}
        <div className="flight-log-top-bar">
          <div className="flight-log-year-badge">
            <span className="year-number">{entry.year}</span>
          </div>

          <div className="flight-log-mission-title-wrap">
            <span className={`status-dot ${isCurrent ? 'active-dot' : ''}`}>●</span>
            <h3 className="mission-title">{entry.title}</h3>
            {entry.status && (
              <span className={`mission-status-pill ${isCurrent ? 'active' : ''}`}>
                {entry.status}
              </span>
            )}
          </div>
        </div>

        {/* Organization / Mission Assignment */}
        <div className="flight-log-section">
          <span className="log-label">
            <Terminal size={11} className="label-icon" />
            ORGANIZATION
          </span>
          <div className="log-value-organization">
            <span className="org-primary">{entry.organization}</span>
            {entry.organizationDetail && entry.organizationDetail !== entry.organization && (
              <span className="org-secondary">{entry.organizationDetail}</span>
            )}
          </div>
        </div>

        {/* Mission Details Description */}
        <div className="flight-log-section description-section">
          <p className="mission-description">{entry.description}</p>
        </div>

        {/* Technologies Used */}
        {entry.technologies && entry.technologies.length > 0 && (
          <div className="flight-log-section technologies-section">
            <span className="log-label">
              <Cpu size={11} className="label-icon" />
              TECHNOLOGIES
            </span>
            <div className="tech-tags-cloud">
              {entry.technologies.map((tech, techIdx) => (
                <span key={techIdx} className="tech-tag-chip">
                  <span className="tag-bracket">[</span>
                  <span className="tag-name">{tech}</span>
                  <span className="tag-bracket">]</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Sci-Fi Decorative Corner Accents */}
        <div className="card-corner corner-top-right" />
        <div className="card-corner corner-bottom-left" />
      </div>
    </div>
  )
}
