import React from 'react'
import { Award, ExternalLink, ShieldCheck, Calendar, Building2 } from 'lucide-react'
import { soundManager } from '../../utils/audio'

/**
 * CertificationCard
 * Renders an individual certification record in the spacecraft database format.
 */
export default function CertificationCard({ cert, index = 0 }) {
  const handleViewCredential = (e) => {
    soundManager.playClick()
    if (cert.credentialUrl && cert.credentialUrl.startsWith('http')) {
      window.open(cert.credentialUrl, '_blank', 'noopener,noreferrer')
    } else {
      e.preventDefault()
      alert(`[CREDENTIAL VERIFICATION]\n\nRecord: ${cert.code}\nName: ${cert.name}\nIssuer: ${cert.issuer}\n\nPlaceholder notice: Add your official certification verification URL in 'src/data/education.js' when available.`)
    }
  }

  return (
    <div
      className="certification-card sci-fi-notch"
      style={{ '--cert-index': index }}
    >
      {/* Top Bar: Code Badge */}
      <div className="cert-card-header">
        <div className="cert-code-badge">
          <Award size={13} className="text-bronze" />
          <span className="code-text">{cert.code}</span>
        </div>
        <span className="cert-status-tag">
          <ShieldCheck size={12} className="text-nominal" />
          SEC-VERIFIED
        </span>
      </div>

      {/* Certification Title */}
      <h4 className="cert-title">{cert.name}</h4>

      {/* Issuer & Date Details */}
      <div className="cert-details">
        <div className="cert-detail-row">
          <span className="cert-label">Issued by:</span>
          <span className="cert-value">{cert.issuer}</span>
        </div>
        <div className="cert-detail-row">
          <span className="cert-label">Date:</span>
          <span className="cert-value">{cert.date}</span>
        </div>
      </div>

      {/* Optional Skill tags */}
      {cert.skills && cert.skills.length > 0 && (
        <div className="cert-skills-wrap">
          {cert.skills.map((skill, i) => (
            <span key={i} className="cert-skill-pill">
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Action: View Credential */}
      <div className="cert-action-row">
        <button
          className="view-credential-btn"
          onClick={handleViewCredential}
          title="Inspect Credential Verification Record"
          type="button"
        >
          <span>[ VIEW CREDENTIAL ]</span>
          <ExternalLink size={12} className="btn-icon" />
        </button>
      </div>

      {/* Sci-Fi Decorative Corner */}
      <div className="card-corner corner-top-right bronze-corner" />
    </div>
  )
}
