import { Compass, Zap, Activity, Shield } from 'lucide-react'

export default function TelemetryRail() {
  return (
    <aside className="telemetry-rail">
      <div className="telemetry-box">
        <div className="telemetry-header">
          <span className="telemetry-tag">// FLIGHT TELEMETRY</span>
          <div className="live-pulse"></div>
        </div>

        <div className="telemetry-grid">
          <div className="telemetry-node">
            <div className="node-title">
              <Compass size={13} />
              <span>ORBIT SECTOR</span>
            </div>
            <div className="node-data">SECTOR-09 // ORION BETA</div>
          </div>

          <div className="telemetry-node">
            <div className="node-title">
              <Zap size={13} />
              <span>WARP CORE</span>
            </div>
            <div className="node-data text-cyan">99.4% [NOMINAL]</div>
            <div className="mini-meter">
              <div className="mini-fill" style={{ width: '96%' }}></div>
            </div>
          </div>

          <div className="telemetry-node">
            <div className="node-title">
              <Activity size={13} />
              <span>VELOCITY</span>
            </div>
            <div className="node-data">28,420 KM/H</div>
          </div>

          <div className="telemetry-node">
            <div className="node-title">
              <Shield size={13} />
              <span>HULL INTEGRITY</span>
            </div>
            <div className="node-data text-nominal">100% SECURE</div>
            <div className="mini-meter">
              <div className="mini-fill fill-green" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
