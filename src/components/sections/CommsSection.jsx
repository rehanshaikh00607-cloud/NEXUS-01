import { useState } from 'react'
import { Radio, Send, CheckCircle2, Terminal, ExternalLink, ShieldCheck } from 'lucide-react'
import { soundManager } from '../../utils/audio'

export default function CommsSection({ data }) {
  const { comms } = data
  const [formData, setFormData] = useState({
    callsign: '',
    frequency: '',
    subject: '',
    message: ''
  })
  const [transmitting, setTransmitting] = useState(false)
  const [transmitted, setTransmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.callsign || !formData.frequency || !formData.message) return

    soundManager.playWarp()
    setTransmitting(true)

    // Simulate quantum transmission uplink
    setTimeout(() => {
      setTransmitting(false)
      setTransmitted(true)
      setFormData({ callsign: '', frequency: '', subject: '', message: '' })
      soundManager.playClick()
    }, 1200)
  }

  return (
    <section className="hud-panel comms-panel sci-fi-notch">
      <div className="panel-inner">
        {/* Header Telemetry */}
        <div className="telemetry-bar">
          <div className="terminal-tag">
            <Radio size={14} />
            <span>TRANSMISSION UPLINK // SUBSPACE COMMS</span>
          </div>
          <span className="clearance-tag">SECURE CHANNEL 14.8 GHz</span>
        </div>

        <div className="comms-layout">
          {/* Left: Transmission Form */}
          <div className="comms-form-wrapper">
            <h3>TRANSMIT DISPATCH TO COMMANDER</h3>
            <p className="comms-intro">
              Dispatch an encrypted message directly to the bridge of NEXUS-01 for project inquiries, engineering contracts, or mission collaborations.
            </p>

            {transmitted ? (
              <div className="transmission-success-box sci-fi-notch">
                <CheckCircle2 size={32} className="text-nominal" />
                <h4>TRANSMISSION DISPATCHED</h4>
                <p>
                  Quantum packet successfully uploaded to NEXUS-01 comm logs. Commander Arsh will establish a return channel promptly.
                </p>
                <button
                  className="action-btn secondary"
                  onClick={() => setTransmitted(false)}
                >
                  TRANSMIT ANOTHER DISPATCH
                </button>
              </div>
            ) : (
              <form className="transmission-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="callsign">CALLSIGN / YOUR NAME *</label>
                    <input
                      id="callsign"
                      name="callsign"
                      type="text"
                      required
                      placeholder="e.g. Pilot Alex or Company X"
                      value={formData.callsign}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="frequency">RETURN COMM LINK / EMAIL *</label>
                    <input
                      id="frequency"
                      name="frequency"
                      type="email"
                      required
                      placeholder="e.g. alex@starfleet.org"
                      value={formData.frequency}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="subject">MISSION SUBJECT</label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="e.g. Frontend Architecture Mission / Contract"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="message">TRANSMISSION DATA / MESSAGE *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    required
                    placeholder="Enter project specifications, mission scope, or collaboration inquiry..."
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className={`transmit-btn ${transmitting ? 'transmitting' : ''}`}
                  disabled={transmitting}
                >
                  <Send size={16} />
                  <span>{transmitting ? 'ENCRYPTING & TRANSMITTING...' : 'DISPATCH TRANSMISSION'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Direct Frequencies */}
          <div className="comms-frequencies-wrapper">
            <h3>DIRECT FREQUENCIES</h3>
            <p className="frequencies-desc">
              Open frequencies for instant communication, code repository audits, and professional networking.
            </p>

            <div className="frequencies-list">
              {comms.frequencies.map((freq) => (
                <a
                  key={freq.name}
                  href={freq.link}
                  target="_blank"
                  rel="noreferrer"
                  className="frequency-card"
                  onClick={() => soundManager.playClick()}
                >
                  <div className="freq-info">
                    <span className="freq-name">{freq.name}</span>
                    <span className="freq-val">{freq.value}</span>
                  </div>
                  <ExternalLink size={14} className="freq-icon" />
                </a>
              ))}
            </div>

            <div className="encryption-notice">
              <ShieldCheck size={16} className="text-cyan" />
              <span>All transmissions encrypted with 4096-bit subspace hash protocols.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
