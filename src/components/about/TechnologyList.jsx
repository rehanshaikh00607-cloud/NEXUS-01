import { Cpu } from 'lucide-react'

/**
 * TechnologyList
 * Compact list of primary technologies for the About destination:
 * JavaScript, React, Three.js, HTML, CSS, Git, GitHub
 */
export default function TechnologyList({ technologies }) {
  if (!technologies || technologies.length === 0) return null

  return (
    <div className="about-section-card sci-fi-notch">
      <div className="section-header-tag">
        <Cpu size={15} className="text-cyan" />
        <h3>TECHNOLOGY</h3>
      </div>

      <div className="compact-tech-list">
        {technologies.map((tech) => (
          <span key={tech} className="compact-tech-pill">
            <span className="tech-indicator-dot"></span>
            <span className="tech-name-text">{tech}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
