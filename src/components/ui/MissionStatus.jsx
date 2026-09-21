import { useState } from 'react'
import { Terminal, CheckCircle2, Rocket, RotateCcw } from 'lucide-react'

export default function MissionStatus() {
  const [warpPulse, setWarpPulse] = useState(0)

  const handlePulse = () => {
    setWarpPulse((prev) => prev + 1)
  }

  return (
    <div className="mission-status-container">
      <div className="status-card">
        <div className="card-badge">
          <Terminal size={14} />
          <span>PROJECT INITIALIZATION COMPLETE</span>
        </div>

        <h2>NEXUS-01 MISSION CONTROL</h2>
        <p className="status-desc">
          Core 3D Canvas, Orbit Controls, Shader Materials, and Futuristic HUD architecture are operational.
          Drag to rotate the 3D beacon or zoom to inspect deep space telemetry.
        </p>

        <div className="tech-stack-badges">
          <span className="badge">
            <CheckCircle2 size={13} className="badge-icon" /> React 18
          </span>
          <span className="badge">
            <CheckCircle2 size={13} className="badge-icon" /> Vite
          </span>
          <span className="badge">
            <CheckCircle2 size={13} className="badge-icon" /> Three.js
          </span>
          <span className="badge">
            <CheckCircle2 size={13} className="badge-icon" /> React Three Fiber
          </span>
          <span className="badge">
            <CheckCircle2 size={13} className="badge-icon" /> @react-three/drei
          </span>
          <span className="badge">
            <CheckCircle2 size={13} className="badge-icon" /> Sci-Fi CSS System
          </span>
        </div>

        <div className="action-row">
          <button className="primary-btn" onClick={handlePulse}>
            <Rocket size={16} />
            <span>INITIATE WARP PULSE {warpPulse > 0 ? `(${warpPulse})` : ''}</span>
          </button>
          <div className="hint-text">
            <span>[ SYSTEM STATUS: READY FOR MISSION EXPANSION ]</span>
          </div>
        </div>
      </div>
    </div>
  )
}
