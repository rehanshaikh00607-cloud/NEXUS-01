import { useState, useEffect, useRef, useCallback } from 'react'
import { handGestureService } from '../services/handGestureService'
import { soundManager } from '../utils/audio'

/**
 * useHandGestures Hook
 * Bridges HandGestureService with React UI without causing high-frequency re-renders.
 * Passes the continuous mutable gestureInputRef to useSpaceshipControls.
 */
export function useHandGestures({ isInspecting = false } = {}) {
  const [isEnabled, setIsEnabled] = useState(false)
  const [status, setStatus] = useState('OFF')
  const [statusMessage, setStatusMessage] = useState('Gesture control disabled')
  const [showPreview, setShowPreview] = useState(false)
  const [currentGestureName, setCurrentGestureName] = useState('OFF')

  // Direct reference to continuous flight inputs (mutated in real-time, 0 React re-renders)
  const gestureInputRef = useRef(handGestureService.inputState)

  // Pause gesture input during modal inspection (Requirement 15)
  useEffect(() => {
    if (isInspecting) {
      gestureInputRef.current.active = false
      handGestureService.resetInputState()
    } else if (isEnabled && status === 'ACTIVE') {
      gestureInputRef.current.active = true
    }
  }, [isInspecting, isEnabled, status])

  // Low-frequency status updates (~5 Hz) for UI HUD text display
  useEffect(() => {
    if (!isEnabled || status !== 'ACTIVE') return

    const interval = setInterval(() => {
      const gName = gestureInputRef.current.gestureName
      setCurrentGestureName((prev) => (prev !== gName ? gName : prev))
    }, 180)

    return () => clearInterval(interval)
  }, [isEnabled, status])

  // Subscribe to service status transitions
  useEffect(() => {
    const unsubscribe = handGestureService.onStatusChange((newStatus, message) => {
      setStatus(newStatus)
      if (message) setStatusMessage(message)
      if (newStatus === 'ACTIVE') {
        setIsEnabled(true)
      } else if (newStatus === 'OFF' || newStatus === 'DENIED' || newStatus === 'ERROR') {
        setIsEnabled(false)
      }
    })

    return () => {
      unsubscribe()
      handGestureService.stop()
    }
  }, [])

  const enableGestureControl = useCallback(async () => {
    soundManager.playClick()
    const success = await handGestureService.start()
    if (success) {
      setIsEnabled(true)
      setShowPreview(true)
      soundManager.playTargetLock()
    }
  }, [])

  const disableGestureControl = useCallback(() => {
    soundManager.playClick()
    handGestureService.stop()
    setIsEnabled(false)
    setStatus('OFF')
    setShowPreview(false)
  }, [])

  const toggleGestureControl = useCallback(() => {
    if (isEnabled || status === 'ACTIVE') {
      disableGestureControl()
    } else {
      enableGestureControl()
    }
  }, [isEnabled, status, disableGestureControl, enableGestureControl])

  const togglePreview = useCallback(() => {
    soundManager.playClick()
    setShowPreview((prev) => !prev)
  }, [])

  const setPreviewCanvas = useCallback((canvas) => {
    handGestureService.setPreviewCanvas(canvas)
  }, [])

  return {
    isEnabled,
    status,
    statusMessage,
    showPreview,
    currentGestureName,
    gestureInputRef,
    toggleGestureControl,
    enableGestureControl,
    disableGestureControl,
    togglePreview,
    setPreviewCanvas
  }
}

export default useHandGestures
