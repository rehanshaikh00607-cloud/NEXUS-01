import { useEffect, useRef, useState, memo } from 'react'
import {
  Camera,
  Video,
  VideoOff,
  Hand,
  HelpCircle,
  X,
  Sparkles,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { soundManager } from '../../utils/audio'

const GestureControlWidget = memo(function GestureControlWidget({
  isEnabled,
  status,
  statusMessage,
  showPreview,
  currentGestureName,
  toggleGestureControl,
  disableGestureControl,
  togglePreview,
  setPreviewCanvas,
  onOpenHelp
}) {
  const canvasRef = useRef(null)
  const [showMiniHelp, setShowMiniHelp] = useState(false)

  // Attach canvas to gesture service when preview is shown
  useEffect(() => {
    if (showPreview && canvasRef.current) {
      setPreviewCanvas(canvasRef.current)
    } else {
      setPreviewCanvas(null)
    }
  }, [showPreview, setPreviewCanvas])

  const handleToggleMiniHelp = (e) => {
    e.stopPropagation()
    soundManager.playClick()
    setShowMiniHelp((prev) => !prev)
  }

  const isStarting = status === 'REQUESTING_CAMERA' || status === 'INITIALIZING'
  const isActive = status === 'ACTIVE'
  const isError = status === 'DENIED' || status === 'ERROR'

  return (
    <div className="gesture-hud-widget-container" aria-label="Webcam Gesture Flight Control">
      {/* 1. Main Gesture Status & Toggle Bar */}
      <div className={`gesture-hud-card sci-fi-bracket ${isActive ? 'active' : ''} ${isError ? 'error' : ''}`}>
        <div className="gesture-card-main-row">
          <div className="gesture-status-indicator">
            <span className={`gesture-beacon ${isActive ? 'live animate-pulse' : isStarting ? 'starting' : isError ? 'error' : 'off'}`} />
            <div className="gesture-title-group">
              <div className="gesture-label-row">
                <Hand size={13} className={isActive ? 'text-cyan' : 'text-slate-400'} />
                <span className="hud-sub-label">GESTURE FLIGHT</span>
              </div>
              <div className="gesture-state-text">
                {isStarting ? (
                  <span className="text-amber animate-pulse">STARTING...</span>
                ) : isActive ? (
                  <span className="text-cyan font-bold">ACTIVE</span>
                ) : isError ? (
                  <span className="text-red">UNAVAILABLE</span>
                ) : (
                  <span className="text-muted">CAMERA OFF</span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="gesture-card-actions">
            {!isActive && !isStarting ? (
              <button
                className="gesture-enable-btn sci-fi-button-primary"
                onClick={toggleGestureControl}
                title="Enable webcam gesture flight controls"
                id="enable-gesture-btn"
              >
                <Camera size={13} />
                <span>ENABLE GESTURE CONTROL</span>
              </button>
            ) : (
              <div className="gesture-active-controls">
                <button
                  className={`gesture-icon-btn ${showPreview ? 'active' : ''}`}
                  onClick={togglePreview}
                  title={showPreview ? 'Hide camera preview' : 'Show camera preview'}
                  id="toggle-gesture-preview-btn"
                >
                  {showPreview ? <Video size={13} className="text-cyan" /> : <VideoOff size={13} />}
                </button>
                <button
                  className="gesture-disable-btn"
                  onClick={disableGestureControl || toggleGestureControl}
                  title="Disable webcam gesture control"
                  id="disable-gesture-btn"
                >
                  <span>OFF</span>
                </button>
              </div>
            )}

            <button
              className="gesture-icon-btn"
              onClick={handleToggleMiniHelp}
              title="Hand gesture controls guide"
              id="gesture-help-btn"
            >
              <HelpCircle size={13} />
            </button>
          </div>
        </div>

        {/* Live Detected Gesture Feedback Readout */}
        {isActive && (
          <div className="gesture-live-chip-row">
            <span className="gesture-feedback-label">CURRENT GESTURE:</span>
            <span className="gesture-detected-chip sci-fi-bracket">
              <Sparkles size={11} className="text-cyan" />
              <b>{currentGestureName || 'SEARCHING HAND...'}</b>
            </span>
          </div>
        )}

        {/* Error / Denied notice */}
        {isError && (
          <div className="gesture-error-message">
            <AlertCircle size={12} className="text-red flex-shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* 2. Mini Collapsible Camera Preview with Hand Reticle */}
      {isActive && showPreview && (
        <div className="gesture-preview-box sci-fi-bracket">
          <div className="gesture-preview-header">
            <div className="preview-title">
              <span className="preview-live-dot" />
              <span>SENSOR CAM // MIRRORED</span>
            </div>
            <button
              className="preview-close-btn"
              onClick={togglePreview}
              title="Minimize Preview"
            >
              <X size={12} />
            </button>
          </div>
          <div className="preview-canvas-wrapper">
            <canvas
              ref={canvasRef}
              width={160}
              height={120}
              className="gesture-preview-canvas"
            />
          </div>
          <div className="preview-footer-hint">
            <span>ALIGN HAND INSIDE RETICLE</span>
          </div>
        </div>
      )}

      {/* 3. Mini Gesture Guide Tooltip / Modal */}
      {showMiniHelp && (
        <div className="gesture-mini-help-panel sci-fi-bracket" onClick={(e) => e.stopPropagation()}>
          <div className="mini-help-header">
            <div className="title-row">
              <Hand size={14} className="text-cyan" />
              <span>GESTURE FLIGHT MANUAL</span>
            </div>
            <button className="preview-close-btn" onClick={() => setShowMiniHelp(false)}>
              <X size={12} />
            </button>
          </div>
          <div className="mini-help-grid">
            <div className="help-item">
              <span className="help-gesture-badge">✋ OPEN PALM</span>
              <span className="help-action-desc">Move hand <b>LEFT / RIGHT / UP / DOWN</b></span>
            </div>
            <div className="help-item">
              <span className="help-gesture-badge">✊ CLOSED FIST</span>
              <span className="help-action-desc"><b>FORWARD</b> Propulsion (Holding W)</span>
            </div>
            <div className="help-item">
              <span className="help-gesture-badge">✌️ TWO FINGERS (V)</span>
              <span className="help-action-desc"><b>BACKWARD</b> Thrusters (Holding S)</span>
            </div>
            <div className="help-item">
              <span className="help-gesture-badge">🤏 PINCH</span>
              <span className="help-action-desc"><b>WARP BOOST</b> (Holding SHIFT)</span>
            </div>
            <div className="help-item">
              <span className="help-gesture-badge">🔄 HAND TILT</span>
              <span className="help-action-desc"><b>ROLL TRIM</b> Left / Right (Q / E)</span>
            </div>
            <div className="help-item safety">
              <span className="help-gesture-badge text-cyan">🛡️ GESTURE SAFETY</span>
              <span className="help-action-desc">Hand leaving camera halts all ship movement instantly.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

export default GestureControlWidget
