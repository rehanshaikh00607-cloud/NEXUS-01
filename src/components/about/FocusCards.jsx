import { Target, Code, GraduationCap, Compass } from 'lucide-react'

const FOCUS_ICONS = {
  DEVELOPMENT: Code,
  LEARNING: GraduationCap,
  EXPLORATION: Compass
}

/**
 * FocusCards
 * Displays 3 small cards for Current Focus:
 * 01 DEVELOPMENT
 * 02 LEARNING
 * 03 EXPLORATION
 */
export default function FocusCards({ focusAreas }) {
  if (!focusAreas || focusAreas.length === 0) return null

  return (
    <div className="about-section-card sci-fi-notch">
      <div className="section-header-tag">
        <Target size={15} className="text-cyan" />
        <h3>CURRENT FOCUS</h3>
      </div>

      <div className="focus-cards-grid">
        {focusAreas.map((item) => {
          const IconComponent = FOCUS_ICONS[item.category] || Target

          return (
            <div key={item.number} className="focus-card sci-fi-notch">
              <div className="focus-card-top">
                <span className="focus-card-num">{item.number}</span>
                <IconComponent size={16} className="focus-card-icon" />
              </div>

              <span className="focus-card-category">{item.category}</span>
              <p className="focus-card-title">{item.title}</p>

              {item.description && (
                <p className="focus-card-desc">{item.description}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
