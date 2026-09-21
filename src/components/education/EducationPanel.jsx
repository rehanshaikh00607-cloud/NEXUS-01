import React from 'react'
import { ArrowLeft, Award, BookOpen, Compass, Database, Globe, GraduationCap, ShieldCheck } from 'lucide-react'
import EducationTimeline from './EducationTimeline'
import CertificationCard from './CertificationCard'
import LearningLog from './LearningLog'
import {
  ACADEMIC_JOURNEY,
  CERTIFICATIONS_DATA,
  CURRENTLY_LEARNING_DATA,
  EDUCATION_HEADER_STATS
} from '../../data/education'
import { soundManager } from '../../utils/audio'

/**
 * EducationPanel
 * Top-level modular container for the BRONZE PLANET destination.
 * Contains:
 * - Telemetry header ribbon
 * - Two-column responsive layout:
 *   - Column 1: Academic Journey timeline
 *   - Column 2: Certification Database + Currently Learning log
 * - In-panel Return to Flight action bar
 */
export default function EducationPanel({ onClose }) {
  const handleReturnToFlight = () => {
    soundManager.playClick()
    if (onClose) onClose()
  }

  return (
    <div className="education-panel-wrapper animate-fade-in">
      {/* Top Telemetry Banner */}
      <div className="education-telemetry-banner sci-fi-notch">
        <div className="telemetry-item">
          <Globe size={14} className="telemetry-icon text-bronze" />
          <div className="telemetry-data">
            <span className="telemetry-label">CELESTIAL OBJECT</span>
            <span className="telemetry-value text-bronze">{EDUCATION_HEADER_STATS.destination}</span>
          </div>
        </div>

        <div className="telemetry-item">
          <Compass size={14} className="telemetry-icon text-cyan" />
          <div className="telemetry-data">
            <span className="telemetry-label">SECTOR COORDINATES</span>
            <span className="telemetry-value">{EDUCATION_HEADER_STATS.sector} // [24, 20, -38]</span>
          </div>
        </div>

        <div className="telemetry-item">
          <Award size={14} className="telemetry-icon text-nominal" />
          <div className="telemetry-data">
            <span className="telemetry-label">CERTIFICATIONS</span>
            <span className="telemetry-value">{EDUCATION_HEADER_STATS.totalCertifications} CREDENTIALS</span>
          </div>
        </div>

        <div className="telemetry-item">
          <BookOpen size={14} className="telemetry-icon text-ice" />
          <div className="telemetry-data">
            <span className="telemetry-label">ACADEMIC ARCHIVE</span>
            <span className="telemetry-value">STATUS // {EDUCATION_HEADER_STATS.archiveStatus}</span>
          </div>
        </div>
      </div>

      {/* Main Content: Two-Column Responsive Layout */}
      <div className="education-content-grid">
        {/* Column 1: Academic Journey Timeline */}
        <div className="education-column academic-column">
          <EducationTimeline entries={ACADEMIC_JOURNEY} />
        </div>

        {/* Column 2: Certification Database & Learning Log */}
        <div className="education-column credentials-column">
          {/* Certification Database Section */}
          <div className="certifications-section">
            <div className="section-header-badge">
              <Award size={15} className="text-bronze" />
              <h3 className="section-heading">CERTIFICATION DATABASE</h3>
              <span className="section-sub-tag">// VERIFIED CREDENTIALS</span>
            </div>

            <div className="certifications-grid">
              {CERTIFICATIONS_DATA.map((cert, idx) => (
                <CertificationCard key={cert.id || idx} cert={cert} index={idx} />
              ))}
            </div>
          </div>

          {/* Currently Learning Section */}
          <div className="learning-log-section">
            <LearningLog data={CURRENTLY_LEARNING_DATA} />
          </div>
        </div>
      </div>

      {/* Return to Flight Action Bar */}
      <div className="education-return-bar sci-fi-notch">
        <button
          id="education-return-flight-btn"
          className="dest-return-flight-btn footer-btn bronze-btn"
          onClick={handleReturnToFlight}
          aria-label="Return to flight"
          type="button"
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
  )
}
