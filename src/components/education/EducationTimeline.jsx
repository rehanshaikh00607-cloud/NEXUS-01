import React from 'react'
import { GraduationCap } from 'lucide-react'
import EducationCard from './EducationCard'
import { ACADEMIC_JOURNEY } from '../../data/education'

/**
 * EducationTimeline
 * Vertical timeline displaying chronological academic qualifications.
 */
export default function EducationTimeline({ entries = ACADEMIC_JOURNEY }) {
  return (
    <div className="education-timeline-section">
      <div className="section-header-badge">
        <GraduationCap size={15} className="text-bronze" />
        <h3 className="section-heading">ACADEMIC JOURNEY</h3>
        <span className="section-sub-tag">// CHRONOLOGICAL ARCHIVE</span>
      </div>

      <div className="bronze-timeline-container" role="feed" aria-label="Academic Journey Timeline">
        <div className="timeline-track-bronze" aria-hidden="true" />

        {entries.map((entry, index) => (
          <EducationCard key={entry.id || index} entry={entry} index={index} />
        ))}
      </div>
    </div>
  )
}
