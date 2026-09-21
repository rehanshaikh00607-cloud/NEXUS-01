import { useState, useMemo } from 'react'
import { ArrowLeft } from 'lucide-react'
import SkillsHeaderMetrics from './SkillsHeaderMetrics'
import SkillsFilter from './SkillsFilter'
import SubsystemCard from './SubsystemCard'
import SkillTagCloud from './SkillTagCloud'
import { SKILLS_SUBSYSTEMS } from '../../data/skills'

export default function SkillsPanel({ onClose }) {
  const [activeCategory, setActiveCategory] = useState('ALL')

  const filteredSubsystems = useMemo(() => {
    if (activeCategory === 'ALL') {
      return SKILLS_SUBSYSTEMS
    }
    return SKILLS_SUBSYSTEMS.filter((sub) => sub.category === activeCategory)
  }, [activeCategory])

  return (
    <div className="skills-panel-wrapper">
      {/* Station Telemetry Metrics */}
      <SkillsHeaderMetrics />

      {/* Sector Category Filters */}
      <SkillsFilter
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Subsystem Cards Grid */}
      <div className="subsystems-grid">
        {filteredSubsystems.map((subsystem) => (
          <SubsystemCard key={subsystem.id} subsystem={subsystem} />
        ))}
      </div>

      {/* Quick Tag Cloud */}
      <SkillTagCloud />

      {/* Flight Return Bar */}
      <div className="skills-return-bar">
        <button
          className="dest-return-flight-btn return-action-btn"
          onClick={onClose}
          type="button"
        >
          <ArrowLeft size={16} />
          <span>RETURN TO FLIGHT</span>
        </button>
        <span className="return-hint-text">ESC / RETURN TO FLIGHT</span>
      </div>
    </div>
  )
}
