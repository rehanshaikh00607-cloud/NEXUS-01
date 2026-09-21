import { useState, useEffect } from 'react'
import { Volume2, VolumeX, Orbit, Menu, X, ShieldCheck } from 'lucide-react'
import { soundManager } from '../../utils/audio'

export default function Header({ activeSection, setActiveSection, mobileMenuOpen, setMobileMenuOpen }) {
  const [time, setTime] = useState('')
  const [isMuted, setIsMuted] = useState(soundManager.isMuted())

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = String(now.getUTCHours()).padStart(2, '0')
      const minutes = String(now.getUTCMinutes()).padStart(2, '0')
      const seconds = String(now.getUTCSeconds()).padStart(2, '0')
      setTime(`${hours}:${minutes}:${seconds} UTC`)
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleAudioToggle = () => {
    const muted = soundManager.toggleMute()
    setIsMuted(muted)
  }

  return (
    <header className="hud-header">
      <div className="hud-header-left">
        <button
          className="vessel-badge"
          onClick={() => {
            soundManager.playWarp()
            setActiveSection('bridge')
          }}
          title="Return to Bridge"
        >
          <div className="badge-ring">
            <Orbit size={18} className="badge-spin" />
          </div>
          <div className="badge-text">
            <span className="vessel-name">NEXUS-01</span>
            <span className="vessel-class">EXPLORATION CLASS</span>
          </div>
        </button>

        <div className="status-pill">
          <ShieldCheck size={14} className="status-pill-icon" />
          <span>STATUS: <b className="text-nominal">NOMINAL</b></span>
        </div>
      </div>

      <div className="hud-header-right">
        <div className="telemetry-clock">
          <span className="clock-label">MISSION TIME</span>
          <span className="clock-val">{time || '00:00:00 UTC'}</span>
        </div>

        {/* Audio Toggle */}
        <button
          className={`hud-control-btn ${!isMuted ? 'active' : ''}`}
          onClick={handleAudioToggle}
          title={isMuted ? 'Enable sci-fi interface audio' : 'Mute interface audio'}
        >
          {!isMuted ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <span className="btn-label">{!isMuted ? 'AUDIO: ON' : 'AUDIO: MUTED'}</span>
        </button>

        {/* Mobile Menu Toggle */}
        <button
          className="hud-control-btn mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  )
}
