import { Cpu, Activity, Layers, ShieldCheck } from 'lucide-react'
import { SKILLS_METRICS } from '../../data/skills'

export default function SkillsHeaderMetrics() {
  return (
    <div className="skills-metrics-grid">
      <div className="skills-metric-tile sci-fi-notch">
        <div className="metric-tile-header">
          <Activity size={15} className="text-cyan" />
          <span className="metric-tile-label">STATION STATUS</span>
        </div>
        <div className="metric-tile-value">
          <span className="status-indicator-dot"></span>
          <span>{SKILLS_METRICS.status}</span>
        </div>
        <span className="metric-tile-sub">Orbital Avionics Core</span>
      </div>

      <div className="skills-metric-tile sci-fi-notch">
        <div className="metric-tile-header">
          <Layers size={15} className="text-cyan" />
          <span className="metric-tile-label">CORE FOCUS</span>
        </div>
        <div className="metric-tile-value text-cyan">
          {SKILLS_METRICS.coreFocus}
        </div>
        <span className="metric-tile-sub">Full Stack & 3D Visuals</span>
      </div>

      <div className="skills-metric-tile sci-fi-notch">
        <div className="metric-tile-header">
          <Cpu size={15} className="text-cyan" />
          <span className="metric-tile-label">ACTIVE SUBSYSTEMS</span>
        </div>
        <div className="metric-tile-value text-cyan">
          {SKILLS_METRICS.subsystemsCount}
        </div>
        <span className="metric-tile-sub">Engineered & Tested</span>
      </div>

      <div className="skills-metric-tile sci-fi-notch">
        <div className="metric-tile-header">
          <ShieldCheck size={15} className="text-cyan" />
          <span className="metric-tile-label">TOTAL TECHNOLOGIES</span>
        </div>
        <div className="metric-tile-value text-cyan">
          {SKILLS_METRICS.totalTech}
        </div>
        <span className="metric-tile-sub">Active Production Tools</span>
      </div>
    </div>
  )
}
