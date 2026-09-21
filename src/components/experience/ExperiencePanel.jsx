import React from 'react'
import { ArrowLeft, Clock, Compass, Database, Moon, ShieldCheck, Sparkles } from 'lucide-react'
import TimelineEntry from './TimelineEntry'
import { EXPERIENCE_DATA, EXPERIENCE_HEADER_STATS } from '../../data/experience'
import { soundManager } from '../../utils/audio'

/**
 * ExperiencePanel
 * Mission Dossier for SHADOW MOON (SECTOR-04).
 * Presents the pilot's vertical career flight log archive:
 * - Telemetry header metrics
 * - Vertical timeline with spacecraft flight log entries
 * - In-panel Return to Flight action bar
 */
export default function ExperiencePanel({ onClose }) {
  const handleReturnToFlight = () => {
    soundManager.playClick()
    if (onClose) onClose()
  }

  return (
    <div className="experience-panel-wrapper animate-fade-in">
      {/* Flight Archive Telemetry Banner */}
      <div className="experience-telemetry-banner sci-fi-notch">
        <div className="telemetry-item">
          <Moon size={14} className="telemetry-icon text-moon" />
          <div className="telemetry-data">
            <span className="telemetry-label">CELESTIAL OBJECT</span>
            <span className="telemetry-value text-moon">{EXPERIENCE_HEADER_STATS.destination}</span>
          </div>
        </div>

        <div className="telemetry-item">
          <Compass size={14} className="telemetry-icon text-cyan" />
          <div className="telemetry-data">
            <span className="telemetry-label">SECTOR COORDINATES</span>
            <span className="telemetry-value">{EXPERIENCE_HEADER_STATS.sector} // [-22, -22, -60]</span>
          </div>
        </div>

        <div className="telemetry-item">
          <Database size={14} className="telemetry-icon text-nominal" />
          <div className="telemetry-data">
            <span className="telemetry-label">ARCHIVE LOGS</span>
            <span className="telemetry-value">{EXPERIENCE_HEADER_STATS.totalLogs} FLIGHT RECORDS</span>
          </div>
        </div>

        <div className="telemetry-item">
          <Clock size={14} className="telemetry-icon text-ice" />
          <div className="telemetry-data">
            <span className="telemetry-label">CHRONOLOGY</span>
            <span className="telemetry-value">{EXPERIENCE_HEADER_STATS.timeRange}</span>
          </div>
        </div>
      </div>

      {/* Vertical Flight Log Timeline */}
      <div className="shadow-moon-timeline-container" role="feed" aria-label="Flight History Timeline">
        <div className="timeline-track-glow" aria-hidden="true" />

        {EXPERIENCE_DATA.map((entry, index) => (
          <TimelineEntry key={entry.id || index} entry={entry} index={index} />
        ))}
      </div>

      {/* In-Panel Return to Flight Action Bar */}
      <div className="experience-return-bar sci-fi-notch">
        <button
          id="experience-return-flight-btn"
          className="dest-return-flight-btn footer-btn"
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
