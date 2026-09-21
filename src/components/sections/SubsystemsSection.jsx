import { Cpu, Zap, Activity, HardDrive, Cloud } from 'lucide-react'

export default function SubsystemsSection({ data }) {
  const { subsystems } = data

  const getSectorIcon = (index) => {
    switch (index) {
      case 0: return <Cpu size={16} className="text-cyan" />
      case 1: return <Zap size={16} className="text-cyan" />
      case 2: return <HardDrive size={16} className="text-cyan" />
      default: return <Cloud size={16} className="text-cyan" />
    }
  }

  return (
    <section className="hud-panel subsystems-panel sci-fi-notch">
      <div className="panel-inner">
        {/* Header Telemetry */}
        <div className="telemetry-bar">
          <div className="terminal-tag">
            <Cpu size={14} />
            <span>SHIP SUBSYSTEMS // TECHNICAL CAPABILITIES</span>
          </div>
          <span className="status-badge-inline">ALL SYSTEMS NOMINAL</span>
        </div>

        {/* Subsystems Sectors Grid */}
        <div className="subsystems-grid">
          {subsystems.map((subsystem, idx) => (
            <div key={subsystem.sector} className="subsystem-card sci-fi-notch">
              <div className="subsystem-card-header">
                <div className="sector-title-wrap">
                  {getSectorIcon(idx)}
                  <h4>{subsystem.sector}</h4>
                </div>
              </div>

              <p className="subsystem-desc">{subsystem.description}</p>

              <div className="skills-list">
                {subsystem.skills.map((skill) => (
                  <div key={skill.name} className="skill-item">
                    <div className="skill-info">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-status-tag">{skill.status} // {skill.level}%</span>
                    </div>

                    <div className="skill-meter-track">
                      <div
                        className="skill-meter-fill"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
