import { useState } from 'react'
import { User, MapPin, Briefcase, ShieldCheck, Compass } from 'lucide-react'

/**
 * ProfileCard
 * Modular profile component displaying:
 * - Profile image area with a clean sci-fi placeholder [ PROFILE IMAGE ]
 * - Name: Arsh
 * - Role: [YOUR ROLE]
 * - Location: [YOUR LOCATION]
 * - Duty Status: ACTIVE
 */
export default function ProfileCard({ profile }) {
  const [imgError, setImgError] = useState(false)
  const hasCustomImage = Boolean(profile.image && !imgError)

  return (
    <div className="about-profile-card sci-fi-notch">
      {/* Column 1: Profile Image Area */}
      <div className="profile-image-container">
        <div className="profile-image-frame">
          {hasCustomImage ? (
            <img
              src={profile.image}
              alt={profile.name}
              className="profile-img-element"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="profile-placeholder-box">
              <div className="pilot-avatar-icon-wrap">
                <User size={52} className="text-cyan" />
              </div>
              <span className="profile-placeholder-tag">[ PROFILE IMAGE ]</span>
            </div>
          )}

          <div className="photo-scanline-overlay"></div>
          <div className="photo-corner top-left"></div>
          <div className="photo-corner top-right"></div>
          <div className="photo-corner bottom-left"></div>
          <div className="photo-corner bottom-right"></div>
        </div>

        <div className="profile-status-pill">
          <span className="status-ping-dot"></span>
          <span>DUTY STATUS: {profile.status || 'ACTIVE'}</span>
        </div>
      </div>

      {/* Column 2: Identity & Metadata */}
      <div className="profile-details-column">
        <div className="profile-clearance-bar">
          <span className="clearance-badge">
            <ShieldCheck size={13} className="text-cyan" />
            <span>{profile.clearance || 'CREW COMMANDER'}</span>
          </span>
          <span className="callsign-badge">{profile.callsign || 'NEXUS-01'}</span>
        </div>

        <h2 className="pilot-display-name">{profile.name}</h2>
        
        <div className="profile-meta-grid">
          <div className="profile-meta-row">
            <div className="meta-icon-box">
              <Briefcase size={14} className="text-cyan" />
            </div>
            <div className="meta-content">
              <span className="meta-label">ROLE:</span>
              <span className="meta-value">{profile.role}</span>
            </div>
          </div>

          <div className="profile-meta-row">
            <div className="meta-icon-box">
              <MapPin size={14} className="text-cyan" />
            </div>
            <div className="meta-content">
              <span className="meta-label">LOCATION:</span>
              <span className="meta-value">{profile.location}</span>
            </div>
          </div>

          <div className="profile-meta-row">
            <div className="meta-icon-box">
              <Compass size={14} className="text-cyan" />
            </div>
            <div className="meta-content">
              <span className="meta-label">ASSIGNMENT:</span>
              <span className="meta-value">NEXUS-01 // DEEP SPACE EXPLORATION</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
