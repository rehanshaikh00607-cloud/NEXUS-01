import { Sparkles } from 'lucide-react'
import { ALL_SKILL_TAGS } from '../../data/skills'

export default function SkillTagCloud() {
  return (
    <div className="skill-tag-cloud-wrapper sci-fi-notch">
      <div className="tag-cloud-header">
        <Sparkles size={14} className="text-cyan" />
        <span className="tag-cloud-title">QUICK TELEMETRY SCAN // ALL REGISTERED TECHNOLOGIES</span>
      </div>
      <div className="tag-cloud-pills">
        {ALL_SKILL_TAGS.map((tag) => (
          <span key={tag} className="tag-cloud-pill">
            <span className="tag-pill-prefix">#</span>
            <span>{tag}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
