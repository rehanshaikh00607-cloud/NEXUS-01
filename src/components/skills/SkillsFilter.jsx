import { SKILLS_CATEGORIES } from '../../data/skills'

export default function SkillsFilter({ activeCategory, onSelectCategory }) {
  return (
    <div className="skills-filter-bar">
      <span className="skills-filter-title">SECTOR FILTER:</span>
      <div className="skills-filter-pills">
        {SKILLS_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`skills-filter-pill ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
            type="button"
          >
            <span>{cat.label}</span>
            <span className="filter-pill-badge">{cat.count}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
