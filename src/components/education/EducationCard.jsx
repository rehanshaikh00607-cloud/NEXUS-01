import React from 'react'
import { GraduationCap, BookOpen, Building2, Calendar, Award } from 'lucide-react'

/**
 * EducationCard
 * Renders an individual academic qualification in the Bronze Planet timeline.
 */
export default function EducationCard({ entry, index = 0 }) {
  const isCurrent = entry.isCurrent || entry.year === '2026'

  return (
    <div
      className={`academic-item ${isCurrent ? 'is-current-study' : ''}`}
      style={{ '--entry-index': index }}
    >
      {/* Node Column */}
      <div className="academic-node-col">
        <div className="academic-beacon">
          <div className={`beacon-dot-bronze ${isCurrent ? 'beacon-pulse-bronze' : ''}`} />
          {isCurrent && <div className="beacon-ring-bronze" />}
        </div>
        <div className="academic-vertical-line" />
      </div>

      {/* Academic Card */}
      <div className="academic-card sci-fi-notch">
        {/* Top Bar: Year & Title */}
        <div className="academic-top-bar">
          <div className="academic-year-badge">
            <Calendar size={12} className="text-bronze" />
            <span className="year-text">{entry.year}</span>
          </div>

          <div className="academic-title-wrap">
            <span className={`status-dot-bronze ${isCurrent ? 'active' : ''}`}>●</span>
            <h4 className="academic-title">{entry.title}</h4>
            {entry.status && (
              <span className={`academic-status-pill ${isCurrent ? 'active' : ''}`}>
                {entry.status}
              </span>
            )}
          </div>
        </div>

        {/* Institution & Program Grid */}
        <div className="academic-meta-grid">
          <div className="academic-meta-item">
            <span className="meta-label">
              <Building2 size={11} className="label-icon text-bronze" />
              INSTITUTION
            </span>
            <span className="meta-value">{entry.institution}</span>
          </div>

          <div className="academic-meta-item">
            <span className="meta-label">
              <GraduationCap size={11} className="label-icon text-bronze" />
              PROGRAM
            </span>
            <span className="meta-value program-highlight">{entry.program}</span>
          </div>
        </div>

        {/* Description / Overview */}
        {entry.description && (
          <p className="academic-desc">{entry.description}</p>
        )}

        {/* Coursework Modules / Focus Chips */}
        {entry.modules && entry.modules.length > 0 && (
          <div className="academic-modules-section">
            <span className="modules-label">
              <BookOpen size={11} className="label-icon text-cyan" />
              ACADEMIC MODULES
            </span>
            <div className="modules-chips">
              {entry.modules.map((mod, i) => (
                <span key={i} className="module-chip">
                  <span className="chip-bracket">[</span>
                  <span className="chip-name">{mod}</span>
                  <span className="chip-bracket">]</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Decorative corner accents */}
        <div className="card-corner corner-top-right bronze-corner" />
        <div className="card-corner corner-bottom-left bronze-corner" />
      </div>
    </div>
  )
}
