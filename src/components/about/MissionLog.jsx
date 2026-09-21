import { Terminal } from 'lucide-react'

/**
 * MissionLog
 * Displays the pilot's short mission introduction log.
 */
export default function MissionLog({ missionLog }) {
  if (!missionLog) return null

  return (
    <div className="about-section-card sci-fi-notch">
      <div className="section-header-tag">
        <Terminal size={15} className="text-cyan" />
        <h3>{missionLog.heading || 'MISSION LOG'}</h3>
      </div>

      <div className="mission-log-body">
        <p className="mission-intro-paragraph">
          {missionLog.intro}
        </p>

        {missionLog.extendedLog && (
          <p className="mission-extended-paragraph">
            {missionLog.extendedLog}
          </p>
        )}
      </div>
    </div>
  )
}
