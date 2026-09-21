import { Layers, Cpu, Terminal, GitBranch } from 'lucide-react'

const ICON_MAP = {
  Layers,
  Cpu,
  Terminal,
  GitBranch
}

export default function SubsystemCard({ subsystem }) {
  const IconComponent = ICON_MAP[subsystem.icon] || Cpu

  return (
    <div className="subsystem-card sci-fi-notch">
      <div className="subsystem-card-header">
        <div className="subsystem-icon-box">
          <IconComponent size={18} className="text-cyan" />
        </div>
        <div className="subsystem-title-box">
          <h4>{subsystem.sector}</h4>
          <p className="subsystem-desc">{subsystem.description}</p>
        </div>
      </div>

      <div className="skills-list">
        {subsystem.skills.map((skill) => {
          const isCore = skill.status === 'CORE STACK'
          const isSpecialty = skill.status === 'SPECIALTY'

          return (
            <div key={skill.name} className="skill-item">
              <div className="skill-info">
                <div className="skill-name-col">
                  <span className="skill-name">{skill.name}</span>
                  {skill.highlight && (
                    <span className="skill-highlight-text">{skill.highlight}</span>
                  )}
                </div>

                <div className="skill-status-col">
                  <span
                    className={`skill-status-tag ${
                      isCore ? 'status-core' : isSpecialty ? 'status-specialty' : 'status-proficient'
                    }`}
                  >
                    {skill.status}
                  </span>
                  <span className="skill-pct-readout">{skill.level}%</span>
                </div>
              </div>

              <div className="skill-meter-track">
                <div
                  className={`skill-meter-fill ${
                    isSpecialty ? 'meter-specialty' : isCore ? 'meter-core' : 'meter-proficient'
                  }`}
                  style={{ width: `${skill.level}%` }}
                >
                  <div className="skill-meter-glint"></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
