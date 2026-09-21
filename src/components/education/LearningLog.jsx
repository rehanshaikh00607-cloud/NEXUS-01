import React from 'react'
import { Radio, Sparkles, Compass, CheckCircle2 } from 'lucide-react'
import { CURRENTLY_LEARNING_DATA } from '../../data/education'

/**
 * LearningLog
 * Displays the pilot's active studies and continuous learning subjects.
 */
export default function LearningLog({ data = CURRENTLY_LEARNING_DATA }) {
  return (
    <div className="learning-log-card sci-fi-notch">
      {/* Header */}
      <div className="learning-log-header">
        <div className="learning-header-title">
          <Radio size={14} className="text-bronze animate-pulse" />
          <h4>{data.heading || 'CURRENTLY LEARNING'}</h4>
        </div>
        <span className="learning-radar-tag">ACTIVE SCAN</span>
      </div>

      <p className="learning-log-intro">
        Continuous skill acquisition, active technical deep-dives, and emerging framework research:
      </p>

      {/* Items List */}
      <div className="learning-items-list">
        {data.items.map((item, idx) => (
          <div key={item.id || idx} className="learning-item-row">
            <div className="learning-item-meta">
              <span className="learning-bullet text-bronze">&gt;</span>
              <span className="learning-name">{item.name}</span>
            </div>

            {item.category && (
              <span className="learning-cat-badge">{item.category}</span>
            )}
          </div>
        ))}
      </div>

      {/* Decorative Corner */}
      <div className="card-corner corner-top-right bronze-corner" />
    </div>
  )
}
