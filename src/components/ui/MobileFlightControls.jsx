import { useState, useRef, useEffect } from 'react'
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Zap,
  Sparkles,
  Compass,
  ArrowRight
} from 'lucide-react'
import { soundManager } from '../../utils/audio'

export default function MobileFlightControls({
  touchInputRef,
  proximityDestination,
  onExplore,
  onSwitchMode
}) {
  const [activeKeys, setActiveKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    boost: false
  })

  const setInput = (direction, isPressed) => {
    if (touchInputRef && touchInputRef.current) {
      touchInputRef.current[direction] = isPressed
    }
    setActiveKeys((prev) => ({ ...prev, [direction]: isPressed }))

    // Haptic feedback if available
    if (isPressed && navigator.vibrate) {
      navigator.vibrate(8)
    }
  }

  // Prevent default context menu and touch actions on control pads
  const handleTouchStart = (dir) => (e) => {
    e.preventDefault()
    e.stopPropagation()
    setInput(dir, true)
  }

  const handleTouchEnd = (dir) => (e) => {
    e.preventDefault()
    e.stopPropagation()
    setInput(dir, false)
  }

  return (
    <div className="mobile-flight-controls-overlay">
      {/* Top Floating Prompt if approaching a destination */}
      {proximityDestination && (
        <div className="mobile-explore-toast sci-fi-notch">
          <div className="toast-left">
            <Sparkles size={16} className="text-cyan animate-pulse" />
            <div className="toast-text">
              <span className="toast-tag">TARGET IN RANGE</span>
              <span className="toast-name">
                {proximityDestination.proximityTitle || proximityDestination.name}
              </span>
            </div>
          </div>
          <button
            className="mobile-explore-btn"
            onClick={() => {
              soundManager.playWarp()
              onExplore(proximityDestination)
            }}
          >
            <span>EXPLORE</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      <div className="mobile-controls-bottom-bar">
        {/* Left Side: Virtual D-Pad for Directional Thrust & Yaw */}
        <div className="virtual-dpad-container">
          <div className="dpad-grid">
            <div className="dpad-cell empty"></div>
            <button
              className={`dpad-btn up ${activeKeys.forward ? 'active' : ''}`}
              onPointerDown={handleTouchStart('forward')}
              onPointerUp={handleTouchEnd('forward')}
              onPointerLeave={handleTouchEnd('forward')}
              onPointerCancel={handleTouchEnd('forward')}
              aria-label="Thrust Forward"
            >
              <ChevronUp size={22} />
            </button>
            <div className="dpad-cell empty"></div>

            <button
              className={`dpad-btn left ${activeKeys.left ? 'active' : ''}`}
              onPointerDown={handleTouchStart('left')}
              onPointerUp={handleTouchEnd('left')}
              onPointerLeave={handleTouchEnd('left')}
              onPointerCancel={handleTouchEnd('left')}
              aria-label="Turn Left"
            >
              <ChevronLeft size={22} />
            </button>

            <div className="dpad-center-hub">
              <div className="hub-core"></div>
            </div>

            <button
              className={`dpad-btn right ${activeKeys.right ? 'active' : ''}`}
              onPointerDown={handleTouchStart('right')}
              onPointerUp={handleTouchEnd('right')}
              onPointerLeave={handleTouchEnd('right')}
              onPointerCancel={handleTouchEnd('right')}
              aria-label="Turn Right"
            >
              <ChevronRight size={22} />
            </button>

            <div className="dpad-cell empty"></div>
            <button
              className={`dpad-btn down ${activeKeys.backward ? 'active' : ''}`}
              onPointerDown={handleTouchStart('backward')}
              onPointerUp={handleTouchEnd('backward')}
              onPointerLeave={handleTouchEnd('backward')}
              onPointerCancel={handleTouchEnd('backward')}
              aria-label="Reverse Thrusters"
            >
              <ChevronDown size={22} />
            </button>
            <div className="dpad-cell empty"></div>
          </div>
        </div>

        {/* Right Side: Boost & Mode Switch Trigger */}
        <div className="mobile-actions-container">
          <button
            className={`mobile-boost-btn ${activeKeys.boost ? 'active' : ''}`}
            onPointerDown={handleTouchStart('boost')}
            onPointerUp={handleTouchEnd('boost')}
            onPointerLeave={handleTouchEnd('boost')}
            onPointerCancel={handleTouchEnd('boost')}
            aria-label="Warp Boost"
          >
            <Zap size={20} className={activeKeys.boost ? 'text-cyan' : ''} />
            <span>BOOST</span>
          </button>

          {onSwitchMode && (
            <button
              className="mobile-mode-switch-btn"
              onClick={() => {
                soundManager.playClick()
                onSwitchMode('direct-nav')
              }}
              aria-label="Switch to Direct Navigation Mode"
            >
              <Compass size={14} className="text-cyan" />
              <span>DIRECT NAV</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
