import { useRef, useEffect, useCallback, useMemo } from 'react'
import * as THREE from 'three'
import { soundManager } from '../utils/audio'

/**
 * useSpaceshipControls
 * Desktop-First flight kinematics hook handling keyboard inputs and 60 FPS
 * frame-rate independent zero-g flight simulation.
 *
 * Desktop Keyboard Controls:
 * - W / ↑: Forward propulsion
 * - S / ↓: Reverse thrusters / braking
 * - A: Move / yaw turn left (with banking)
 * - D: Move / yaw turn right (with banking)
 * - Q: Roll trim left
 * - E: Roll trim right
 * - Shift: Warp speed boost
 * - Space: Retro-braking to halt
 * - M: Toggle audio mute
 * - H: Toggle flight manual
 */
export function useSpaceshipControls({
  isInspecting = false,
  onTelemetryUpdate = null,
  onToggleMute = null,
  onToggleHelp = null,
  gestureInputRef = null
} = {}) {
  const isInspectingRef = useRef(isInspecting)
  useEffect(() => {
    isInspectingRef.current = isInspecting
    if (isInspecting) {
      keys.current.forward = false
      keys.current.backward = false
      keys.current.left = false
      keys.current.right = false
      keys.current.up = false
      keys.current.down = false
      keys.current.rollLeft = false
      keys.current.rollRight = false
      keys.current.boost = false
      keys.current.brake = false
    }
  }, [isInspecting])
  // Real-time keyboard tracking ref
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
    rollLeft: false,
    rollRight: false,
    boost: false,
    brake: false
  })

  // Kinematic flight state references
  const speed = useRef(0)
  const rollAngle = useRef(0)
  const pitchAngle = useRef(0)
  const isAutoLeveling = useRef(false)
  const wasBoosting = useRef(false)

  // Internal reusable Three.js vectors & objects (zero GC churn)
  const internalVectors = useRef({
    localForward: new THREE.Vector3(0, 0, -1),
    localRight: new THREE.Vector3(1, 0, 0),
    localUp: new THREE.Vector3(0, 1, 0),
    inputDir: new THREE.Vector3(),
    worldMoveDir: new THREE.Vector3(),
    currentVelocity: new THREE.Vector3(),
    targetVelocity: new THREE.Vector3(),
    tempRollQuat: new THREE.Quaternion(),
    bearingWorldVec: new THREE.Vector3(),
    bearingLocalVec: new THREE.Vector3(),
    invShipQuat: new THREE.Quaternion()
  })

  // Real-time thrust state for rendering plumes without React re-renders
  const thrustRef = useRef({
    thrust: 0,
    isBoosting: false
  })

  // Telemetry throttling references
  const lastTelemetryTime = useRef(0)

  // Attach global desktop keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return
      if (isInspectingRef.current) return

      const code = e.code
      const key = e.key ? e.key.toLowerCase() : ''

      // Prevent browser window scroll while active in 3D flight
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(code) ||
          ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
        e.preventDefault()
      }

      // Propulsion Forward & Backward (W / S)
      if (code === 'KeyW' || key === 'w') {
        keys.current.forward = true
      }
      if (code === 'KeyS' || key === 's') {
        keys.current.backward = true
      }

      // Physical Strafe Left & Right (ArrowLeft / ArrowRight or A / D)
      if (code === 'ArrowLeft' || code === 'KeyA' || key === 'arrowleft' || key === 'a') {
        keys.current.left = true
      }
      if (code === 'ArrowRight' || code === 'KeyD' || key === 'arrowright' || key === 'd') {
        keys.current.right = true
      }

      // Physical Vertical Movement Up & Down (ArrowUp / ArrowDown or R / F)
      if (code === 'ArrowUp' || code === 'KeyR' || key === 'arrowup' || key === 'r') {
        keys.current.up = true
      }
      if (code === 'ArrowDown' || code === 'KeyF' || key === 'arrowdown' || key === 'f') {
        keys.current.down = true
      }

      // Roll Left & Roll Right (Q / E)
      if (code === 'KeyQ' || key === 'q') {
        keys.current.rollLeft = true
      }
      if (code === 'KeyE' || key === 'e') {
        keys.current.rollRight = true
      }

      // Warp Speed Boost (SHIFT)
      if (code === 'ShiftLeft' || code === 'ShiftRight' || key === 'shift') {
        keys.current.boost = true
      }

      // Retro-braking Halt (SPACE)
      if (code === 'Space' || key === ' ') {
        keys.current.brake = true
      }

      // Auto-leveling (C)
      if (code === 'KeyC' || key === 'c') {
        isAutoLeveling.current = true
        setTimeout(() => { isAutoLeveling.current = false }, 800)
      }

      // Sound Toggle (M)
      if (code === 'KeyM' || key === 'm') {
        if (onToggleMute) onToggleMute()
      }

      // Flight Manual Toggle (H / ?)
      if (code === 'KeyH' || key === 'h' || code === 'Slash' || key === '?') {
        if (onToggleHelp) onToggleHelp()
      }
    }

    const handleKeyUp = (e) => {
      const code = e.code
      const key = e.key ? e.key.toLowerCase() : ''

      if (code === 'KeyW' || key === 'w') {
        keys.current.forward = false
      }
      if (code === 'KeyS' || key === 's') {
        keys.current.backward = false
      }
      if (code === 'ArrowLeft' || code === 'KeyA' || key === 'arrowleft' || key === 'a') {
        keys.current.left = false
      }
      if (code === 'ArrowRight' || code === 'KeyD' || key === 'arrowright' || key === 'd') {
        keys.current.right = false
      }
      if (code === 'ArrowUp' || code === 'KeyR' || key === 'arrowup' || key === 'r') {
        keys.current.up = false
      }
      if (code === 'ArrowDown' || code === 'KeyF' || key === 'arrowdown' || key === 'f') {
        keys.current.down = false
      }
      if (code === 'KeyQ' || key === 'q') {
        keys.current.rollLeft = false
      }
      if (code === 'KeyE' || key === 'e') {
        keys.current.rollRight = false
      }
      if (code === 'ShiftLeft' || code === 'ShiftRight' || key === 'shift') {
        keys.current.boost = false
      }
      if (code === 'Space' || key === ' ') {
        keys.current.brake = false
      }
    }

    const handleBlur = () => {
      keys.current.forward = false
      keys.current.backward = false
      keys.current.left = false
      keys.current.right = false
      keys.current.up = false
      keys.current.down = false
      keys.current.rollLeft = false
      keys.current.rollRight = false
      keys.current.boost = false
      keys.current.brake = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleBlur)
    }
  }, [onToggleMute, onToggleHelp])

  /**
   * stopMovement
   * Immediately halts ship velocity (e.g. when entering modal panel or warping)
   */
  const stopMovement = useCallback(() => {
    speed.current = 0
    rollAngle.current = 0
    pitchAngle.current = 0
    thrustRef.current.thrust = 0
    thrustRef.current.isBoosting = false
    internalVectors.current.currentVelocity.set(0, 0, 0)
    internalVectors.current.targetVelocity.set(0, 0, 0)
    keys.current.forward = false
    keys.current.backward = false
    keys.current.left = false
    keys.current.right = false
    keys.current.up = false
    keys.current.down = false
    keys.current.rollLeft = false
    keys.current.rollRight = false
    keys.current.boost = false
    keys.current.brake = false
    wasBoosting.current = false
    soundManager.updateEngine(0, false, true)
  }, [])

  /**
   * updateFlightKinematics
   * Executed once per animation frame (delta seconds)
   * The ONE authoritative flight pipeline that modifies shipGroup.position
   */
  const updateFlightKinematics = useCallback((delta, shipGroup, collisionDestination = null, targetWorldPos = null) => {
    if (!shipGroup) return

    const dt = Math.min(Math.max(delta, 0.001), 0.1)
    const k = keys.current
    const g = isInspectingRef.current ? null : gestureInputRef?.current

    // Directional Inputs:
    // W/S = forward/backward along local -Z
    // A/D = left/right along local X
    // R/F = up/down along local Y
    // Keyboard and gesture controls coexist and combine safely (Requirement 13)
    let forwardInput = 0
    if (k.forward || (g?.active && g?.forward)) forwardInput += 1
    if (k.backward || (g?.active && g?.backward)) forwardInput -= 1

    let rightInput = 0
    if (k.right || (g?.active && g?.right)) rightInput += 1
    if (k.left || (g?.active && g?.left)) rightInput -= 1

    let upInput = 0
    if (k.up || (g?.active && g?.up)) upInput += 1
    if (k.down || (g?.active && g?.down)) upInput -= 1

    const isBrake = k.brake
    const isBoost = k.boost || (g?.active && g?.boost)

    // Pre-allocated vector references (zero GC churn)
    const inputDir = internalVectors.current.inputDir
    const worldMoveDir = internalVectors.current.worldMoveDir
    const currentVelocity = internalVectors.current.currentVelocity
    const targetVelocity = internalVectors.current.targetVelocity
    const localForward = internalVectors.current.localForward
    const tempRollQuat = internalVectors.current.tempRollQuat

    // 1. Roll Control (Q / E or Hand Tilt) - Rotates spaceship quaternion around local forward axis
    const rollSpeed = 2.2 // rad/s
    let rollDelta = 0
    if (k.rollLeft || (g?.active && g?.rollLeft)) rollDelta -= rollSpeed * dt // roll left
    if (k.rollRight || (g?.active && g?.rollRight)) rollDelta += rollSpeed * dt // roll right

    if (rollDelta !== 0) {
      tempRollQuat.setFromAxisAngle(localForward, rollDelta)
      shipGroup.quaternion.multiply(tempRollQuat)
    }

    // Visual Banking tilt for lateral movement (ArrowLeft / ArrowRight / Gesture Left/Right)
    let desiredVisualBank = 0
    if (k.left || (g?.active && g?.left)) desiredVisualBank += 0.35
    if (k.right || (g?.active && g?.right)) desiredVisualBank -= 0.35
    rollAngle.current = THREE.MathUtils.lerp(rollAngle.current, desiredVisualBank, 1 - Math.exp(-8.0 * dt))

    // Visual Pitch tilt for vertical movement (ArrowUp / ArrowDown / Gesture Up/Down)
    let desiredVisualPitch = 0
    if (k.up || (g?.active && g?.up)) desiredVisualPitch += 0.22
    if (k.down || (g?.active && g?.down)) desiredVisualPitch -= 0.22
    pitchAngle.current = THREE.MathUtils.lerp(pitchAngle.current, desiredVisualPitch, 1 - Math.exp(-8.0 * dt))

    // 2. Build local 3D direction vector
    // Model coordinate axes:
    // Local Forward is (0, 0, -1) -> forwardInput moves along -Z
    // Local Right is (1, 0, 0) -> rightInput moves along +X
    // Local Up is (0, 1, 0) -> upInput moves along +Y
    inputDir.set(rightInput, upInput, -forwardInput)

    const hasInput = inputDir.lengthSq() > 0.0001
    if (hasInput && !isBrake) {
      // Normalize combined movement vector so diagonal movement is not faster
      inputDir.normalize()

      // Transform local movement direction into world space based on ship's world orientation
      worldMoveDir.copy(inputDir).applyQuaternion(shipGroup.quaternion)

      // Speeds: 24 km/s normal, 48 km/s boost
      const MOVE_SPEED = 24.0
      const BOOST_SPEED = 48.0
      const activeSpeed = isBoost ? BOOST_SPEED : MOVE_SPEED

      targetVelocity.copy(worldMoveDir).multiplyScalar(activeSpeed)
    } else {
      targetVelocity.set(0, 0, 0)
    }

    // 3. Smooth acceleration / deceleration
    const accelRate = isBrake ? 9.5 : (hasInput ? (isBoost ? 6.5 : 5.5) : 5.0)
    currentVelocity.lerp(targetVelocity, 1 - Math.exp(-accelRate * dt))

    if (!hasInput && currentVelocity.lengthSq() < 0.001) {
      currentVelocity.set(0, 0, 0)
    }

    // 4. Authoritative displacement in Three.js world space
    if (currentVelocity.lengthSq() > 0.00001) {
      shipGroup.position.addScaledVector(currentVelocity, dt)
    }

    // Navigation Bearing & Collision / Arrival Kinematics
    let navBearing = null
    const hasTarget = targetWorldPos || (collisionDestination?.coordinates || collisionDestination?.position)

    if (collisionDestination && hasTarget) {
      const tx = targetWorldPos ? targetWorldPos.x : (collisionDestination.coordinates ? collisionDestination.coordinates[0] : collisionDestination.position[0])
      const ty = targetWorldPos ? targetWorldPos.y : (collisionDestination.coordinates ? collisionDestination.coordinates[1] : collisionDestination.position[1])
      const tz = targetWorldPos ? targetWorldPos.z : (collisionDestination.coordinates ? collisionDestination.coordinates[2] : collisionDestination.position[2])
      const dx = tx - shipGroup.position.x
      const dy = ty - shipGroup.position.y
      const dz = tz - shipGroup.position.z
      const distToTarget = Math.hypot(dx, dy, dz)

      // Compute relative direction indicator in ship's local frame (Requirement 6)
      if (distToTarget > 0.1) {
        const bWorld = internalVectors.current.bearingWorldVec
        const bLocal = internalVectors.current.bearingLocalVec
        const invQ = internalVectors.current.invShipQuat

        bWorld.set(dx / distToTarget, dy / distToTarget, dz / distToTarget)
        invQ.copy(shipGroup.quaternion).invert()
        bLocal.copy(bWorld).applyQuaternion(invQ)

        // In ship local space: Forward is -Z, Right is +X, Up is +Y
        const targetName = collisionDestination.shortName || collisionDestination.name || 'TARGET'
        if (bLocal.z > 0.35) {
          navBearing = { code: 'BEHIND', arrow: '▼', label: `▼ ${targetName} BEHIND` }
        } else if (bLocal.x < -0.2) {
          navBearing = { code: 'PORT', arrow: '◀', label: `◀ ${targetName} STEER LEFT` }
        } else if (bLocal.x > 0.2) {
          navBearing = { code: 'STARBOARD', arrow: '▶', label: `▶ ${targetName} STEER RIGHT` }
        } else {
          navBearing = { code: 'ON COURSE', arrow: '▲', label: `▲ ${targetName} ON COURSE` }
        }
      }

      // Requirement 7 & 8: Deceleration upon arrival and anti-clipping protection
      if (collisionDestination.id !== 'home') {
        const planetBodyRadius = collisionDestination.radius || 4.0
        const minSafeDist = planetBodyRadius + 2.5
        const arrivalThreshold = collisionDestination.interactionRadius || collisionDestination.proximityRadius || 18.0

        // Smoothly reduce forward movement upon arrival so ship does not overshoot
        if (distToTarget <= arrivalThreshold) {
          const maxArrivalSpeed = 6.0
          if (currentVelocity.length() > maxArrivalSpeed) {
            currentVelocity.clampLength(
              0,
              THREE.MathUtils.lerp(currentVelocity.length(), maxArrivalSpeed, 1 - Math.exp(-4.0 * dt))
            )
          }
        }

        // Surface boundary collision protection: prevent clipping inside celestial bodies
        if (distToTarget < minSafeDist && distToTarget > 0.001) {
          const pushFactor = minSafeDist / distToTarget
          shipGroup.position.x = tx - (tx - shipGroup.position.x) * pushFactor
          shipGroup.position.y = ty - (ty - shipGroup.position.y) * pushFactor
          shipGroup.position.z = tz - (tz - shipGroup.position.z) * pushFactor
          currentVelocity.multiplyScalar(0.5)
        }
      }
    }

    // 5. Update scalar speed reference for HUD, Camera & Engine Glow
    const currentSpeed = currentVelocity.length()
    speed.current = currentSpeed

    // 6. Engine thrust visual state
    const isMovingForward = forwardInput > 0
    const isMovingAnywhere = hasInput && currentSpeed > 0.1
    thrustRef.current.thrust = isMovingForward ? (isBoost ? 1.0 : 0.65) : (isMovingAnywhere ? (isBoost ? 0.85 : 0.45) : 0.0)
    thrustRef.current.isBoosting = isBoost && hasInput

    // 6b. Continuous Engine & Boost Sound (smooth, non-clicking parameter modulation)
    const isActuallyBoosting = isBoost && hasInput
    if (isActuallyBoosting && !wasBoosting.current) {
      soundManager.playBoostStart()
    }
    wasBoosting.current = isActuallyBoosting

    soundManager.updateEngine(currentSpeed, isActuallyBoosting, isInspectingRef.current)

    // 7. Telemetry dispatch for real-time HUD (throttled for desktop smoothness)
    const now = performance.now()
    const isMoving = currentVelocity.lengthSq() > 0.0001 || hasInput || isBoost || isBrake
    if (onTelemetryUpdate && (now - lastTelemetryTime.current > 75 || !isMoving)) {
      if (isMoving || now - lastTelemetryTime.current > 250) {
        const posX = shipGroup.position.x
        const posY = shipGroup.position.y
        const posZ = shipGroup.position.z

        onTelemetryUpdate({
          speed: Math.round(currentSpeed * 10) / 10,
          isBoosting: isBoost,
          x: Math.round(posX),
          y: Math.round(posY),
          z: Math.round(posZ),
          rawX: posX.toFixed(2),
          rawY: posY.toFixed(2),
          rawZ: posZ.toFixed(2),
          navBearing,
          inputW: k.forward,
          inputA: k.left,
          inputS: k.backward,
          inputD: k.right,
          inputR: k.up,
          inputF: k.down
        })
        lastTelemetryTime.current = now
      }
    }
  }, [onTelemetryUpdate])

  return useMemo(() => ({
    speed,
    thrustRef,
    rollAngle,
    pitchAngle,
    updateFlightKinematics,
    stopMovement
  }), [updateFlightKinematics, stopMovement])
}
