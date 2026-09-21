import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Spaceship from './Spaceship'
import FollowCamera from './FollowCamera'
import WarpStreaks from './WarpStreaks'
import { DESTINATIONS } from '../../data/portfolioData'

// Pre-allocate destination target vectors once outside the component
const DESTINATION_TARGETS = DESTINATIONS.map((d) => ({
  ...d,
  pos: new THREE.Vector3(...d.coordinates)
}))

export default function SpaceshipController({
  isIntroActive = false,
  isInspecting = false,
  inspectDestination = null,
  warpTarget = null,
  touchInputRef = null,
  onProximityChange,
  onTelemetryUpdate
}) {
  const shipGroupRef = useRef()

  // Flight Kinematics State (Pure refs - zero React re-renders during flight)
  const speed = useRef(0)
  const targetSpeed = useRef(0)
  const yawRate = useRef(0)
  const rollAngle = useRef(0)
  const pitchAngle = useRef(0)

  // Visual engine plume ref
  const thrustRef = useRef({ thrust: 0, isBoosting: false })

  // Pre-allocated reusable math instances to prevent GC pressure
  const tempForward = useRef(new THREE.Vector3())
  const tempYawQuat = useRef(new THREE.Quaternion())
  const yawAxis = useRef(new THREE.Vector3(0, 1, 0))

  // Throttling timers & value caches to prevent excessive React state updates in App.jsx
  const lastTelemetryTime = useRef(0)
  const lastTelemetryValues = useRef({ speed: -1, isBoosting: false, x: 9999, y: 9999, z: 9999 })
  const lastProximityDestId = useRef(null)
  const lastProximityDist = useRef(null)
  const lastProximityTime = useRef(0)

  // Active keyboard inputs
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    rollLeft: false,
    rollRight: false,
    boost: false
  })

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = true
          break
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = true
          break
        case 'KeyA':
          keys.current.left = true
          break
        case 'KeyD':
          keys.current.right = true
          break
        case 'KeyQ':
          keys.current.rollLeft = true
          break
        case 'KeyE':
          keys.current.rollRight = true
          break
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.current.boost = true
          break
        default:
          break
      }
    }

    const handleKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = false
          break
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = false
          break
        case 'KeyA':
          keys.current.left = false
          break
        case 'KeyD':
          keys.current.right = false
          break
        case 'KeyQ':
          keys.current.rollLeft = false
          break
        case 'KeyE':
          keys.current.rollRight = false
          break
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.current.boost = false
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Handle Warp Fast-Travel Jumps
  useEffect(() => {
    if (warpTarget && shipGroupRef.current) {
      const dest = DESTINATION_TARGETS.find((d) => d.id === warpTarget.id)
      if (dest) {
        // Position ship slightly outside destination's radius, oriented toward it
        const offset = new THREE.Vector3(0, 1.5, dest.proximityRadius * 0.75)
        const newPos = dest.pos.clone().add(offset)
        shipGroupRef.current.position.copy(newPos)

        // Point ship towards destination center
        shipGroupRef.current.lookAt(dest.pos)
        speed.current = 0
        targetSpeed.current = 0
        yawRate.current = 0
        rollAngle.current = 0
      }
    }
  }, [warpTarget])

  // Kinematics Loop
  useFrame((state, delta) => {
    if (!shipGroupRef.current) return

    const dt = Math.min(delta, 0.1)
    const now = state.clock.getElapsedTime()
    const k = keys.current
    const t = touchInputRef?.current || {}

    // Combine keyboard and touch directional inputs
    const isForward = k.forward || t.forward
    const isBackward = k.backward || t.backward
    const isLeft = k.left || t.left
    const isRight = k.right || t.right
    const isBoost = k.boost || t.boost

    // If currently playing intro sequence or inspecting a destination modal, freeze velocity
    if (isIntroActive || isInspecting) {
      speed.current = THREE.MathUtils.lerp(speed.current, 0, 1 - Math.exp(-6.0 * dt))
      yawRate.current = THREE.MathUtils.lerp(yawRate.current, 0, 1 - Math.exp(-6.0 * dt))
      rollAngle.current = THREE.MathUtils.lerp(rollAngle.current, 0, 1 - Math.exp(-6.0 * dt))
      pitchAngle.current = THREE.MathUtils.lerp(pitchAngle.current, 0, 1 - Math.exp(-6.0 * dt))

      thrustRef.current.thrust = 0
      thrustRef.current.isBoosting = false
      return
    }

    // 1. Calculate Target Linear Speed
    const MAX_FORWARD_SPEED = 10.0
    const BOOST_SPEED = 20.0
    const REVERSE_SPEED = -4.0

    let desiredSpeed = 0
    if (isForward) {
      desiredSpeed = isBoost ? BOOST_SPEED : MAX_FORWARD_SPEED
    } else if (isBackward) {
      desiredSpeed = REVERSE_SPEED
    }

    targetSpeed.current = desiredSpeed
    const accelRate = isForward ? (isBoost ? 5.5 : 4.0) : 2.5
    speed.current = THREE.MathUtils.lerp(speed.current, targetSpeed.current, 1 - Math.exp(-accelRate * dt))

    // 2. Yaw (Turn Left / Right)
    const MAX_YAW_RATE = 1.15
    let desiredYawRate = 0
    if (isLeft) desiredYawRate += MAX_YAW_RATE
    if (isRight) desiredYawRate -= MAX_YAW_RATE

    const yawAccel = 4.5
    yawRate.current = THREE.MathUtils.lerp(yawRate.current, desiredYawRate, 1 - Math.exp(-yawAccel * dt))

    if (Math.abs(yawRate.current) > 0.0001) {
      tempYawQuat.current.setFromAxisAngle(yawAxis.current, yawRate.current * dt)
      shipGroupRef.current.quaternion.multiply(tempYawQuat.current)
    }

    // 3. Banking (Roll)
    const MAX_AUTO_BANK = 0.42
    let desiredRoll = - (yawRate.current / MAX_YAW_RATE) * MAX_AUTO_BANK

    const MANUAL_ROLL = 0.65
    if (k.rollLeft) desiredRoll += MANUAL_ROLL
    if (k.rollRight) desiredRoll -= MANUAL_ROLL

    const rollRate = 4.0
    rollAngle.current = THREE.MathUtils.lerp(rollAngle.current, desiredRoll, 1 - Math.exp(-rollRate * dt))

    // 4. Pitch
    const desiredPitch = (speed.current / MAX_FORWARD_SPEED) * -0.04
    pitchAngle.current = THREE.MathUtils.lerp(pitchAngle.current, desiredPitch, 1 - Math.exp(-3.0 * dt))

    // 5. Apply Movement using pre-allocated vector
    tempForward.current.set(0, 0, -1).applyQuaternion(shipGroupRef.current.quaternion)
    shipGroupRef.current.position.addScaledVector(tempForward.current, speed.current * dt)

    // Visual Mesh Banking & Pitch
    const visualMesh = shipGroupRef.current.children[0]
    if (visualMesh) {
      visualMesh.rotation.z = rollAngle.current
      visualMesh.rotation.x = pitchAngle.current
    }

    // Engine plume visuals updated via ref (zero React state updates)
    const currentThrustRatio = Math.max(0, speed.current / MAX_FORWARD_SPEED)
    thrustRef.current.thrust = currentThrustRatio
    thrustRef.current.isBoosting = isBoost && isForward

    // 6. Proximity Detection against pre-allocated targets
    const shipPos = shipGroupRef.current.position
    let closestDest = null
    let closestDist = Infinity

    for (let i = 0; i < DESTINATION_TARGETS.length; i++) {
      const dest = DESTINATION_TARGETS[i]
      const dist = shipPos.distanceTo(dest.pos)
      if (dist < dest.proximityRadius && dist < closestDist) {
        closestDist = dist
        closestDest = dest
      }
    }

    // Throttle proximity callbacks to prevent continuous React re-renders
    if (onProximityChange) {
      const roundedDist = closestDist !== Infinity ? Math.round(closestDist * 10) : null
      const isTargetChanged = closestDest?.id !== lastProximityDestId.current
      const isDistChanged = Math.abs((roundedDist || 0) - (lastProximityDist.current || 0)) >= 1

      if (isTargetChanged || (isDistChanged && now - lastProximityTime.current > 0.12)) {
        lastProximityDestId.current = closestDest?.id || null
        lastProximityDist.current = roundedDist
        lastProximityTime.current = now
        onProximityChange(closestDest, roundedDist)
      }
    }

    // 7. Telemetry Callback throttled to ~10 Hz (every 100ms) with change detection
    if (onTelemetryUpdate && now - lastTelemetryTime.current > 0.09) {
      const roundedSpeed = Math.abs(Math.round(speed.current * 10))
      const roundedX = Math.round(shipPos.x)
      const roundedY = Math.round(shipPos.y)
      const roundedZ = Math.round(shipPos.z)
      const isB = isBoost && isForward

      const prev = lastTelemetryValues.current
      if (
        prev.speed !== roundedSpeed ||
        prev.isBoosting !== isB ||
        prev.x !== roundedX ||
        prev.y !== roundedY ||
        prev.z !== roundedZ
      ) {
        lastTelemetryValues.current = { speed: roundedSpeed, isBoosting: isB, x: roundedX, y: roundedY, z: roundedZ }
        lastTelemetryTime.current = now
        onTelemetryUpdate({
          speed: roundedSpeed,
          isBoosting: isB,
          x: roundedX,
          y: roundedY,
          z: roundedZ
        })
      }
    }
  })

  return (
    <>
      <group ref={shipGroupRef} position={[0, 0, 0]}>
        <Spaceship
          thrustRef={thrustRef}
        />
      </group>

      <WarpStreaks
        targetRef={shipGroupRef}
        thrustRef={thrustRef}
        speedRef={speed}
      />

      <FollowCamera
        targetRef={shipGroupRef}
        thrustRef={thrustRef}
        speedRef={speed}
        isInspecting={isInspecting}
        inspectDestination={inspectDestination}
      />
    </>
  )
}
