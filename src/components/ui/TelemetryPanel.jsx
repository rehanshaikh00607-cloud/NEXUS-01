import { Activity, Compass, Zap, Disc } from 'lucide-react'

export default function TelemetryPanel() {
  return (
    <aside className="telemetry-panel left-panel">
      <div className="panel-header">
        <span className="panel-tag">// TELEMETRY FEED</span>
        <div className="live-dot"></div>
      </div>

      <div className="panel-content">
        <div className="telemetry-metric">
          <div className="metric-label">
            <Compass size={14} />
            <span>ORBIT SECTOR</span>
          </div>
          <span className="metric-val">SECTOR-09 // EPSILON</span>
        </div>

        <div className="telemetry-metric">
          <div className="metric-label">
            <Zap size={14} />
            <span>REACTOR OUTPUT</span>
          </div>
          <span className="metric-val">98.4 GW [STABLE]</span>
          <div className="meter-bar">
            <div className="meter-fill" style={{ width: '92%' }}></div>
          </div>
        </div>

        <div className="telemetry-metric">
          <div className="metric-label">
            <Activity size={14} />
            <span>QUANTUM LINK</span>
          </div>
          <span className="metric-val">48.2 ms SYNC</span>
          <div className="meter-bar">
            <div className="meter-fill" style={{ width: '78%' }}></div>
          </div>
        </div>

        <div className="telemetry-metric">
          <div className="metric-label">
            <Disc size={14} />
            <span>3D PROBE ENGINE</span>
          </div>
          <span className="metric-val highlight">THREE.JS / R3F ACTIVE</span>
        </div>
      </div>
    </aside>
  )
}
