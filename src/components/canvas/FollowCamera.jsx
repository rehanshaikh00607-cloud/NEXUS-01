import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function FollowCamera({
  targetRef,
  speedRef = null,
  thrustRef = null,
  isBoosting = false,
  currentSpeed = 0,
  isInspecting = false,
  inspectDestination = null
}) {
  const { camera } = useThree()
  const currentLookAt = useRef(new THREE.Vector3(0, 0, -10))
  const initialized = useRef(false)

  // Pre-allocated reusable Vector3 instances to eliminate GC overhead in useFrame
  const tempDestCoords = useRef(new THREE.Vector3())
  const tempInspectCamPos = useRef(new THREE.Vector3())
  const tempOffset = useRef(new THREE.Vector3())
  const tempLookAt = useRef(new THREE.Vector3())

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1)

    // MODE 1: INSPECTION CAMERA (Framing destination object)
    if (isInspecting && inspectDestination) {
      tempDestCoords.current.set(...inspectDestination.coordinates)
      tempInspectCamPos.current.set(...inspectDestination.inspectCamera)

      const posLerp = 1 - Math.exp(-3.5 * dt)
      const lookLerp = 1 - Math.exp(-4.5 * dt)

      camera.position.lerp(tempInspectCamPos.current, posLerp)
      currentLookAt.current.lerp(tempDestCoords.current, lookLerp)
      camera.lookAt(currentLookAt.current)
      return
    }

    // MODE 2: FLIGHT CHASE CAMERA (Following Spaceship)
    if (!targetRef.current) return

    const ship = targetRef.current
    const activeSpeed = speedRef ? speedRef.current : currentSpeed
    const activeBoosting = thrustRef?.current ? thrustRef.current.isBoosting : isBoosting

    const boostDistanceOffset = activeBoosting ? 1.8 : Math.max(0, activeSpeed * 0.08)

    tempOffset.current.set(0, 2.6, 7.6 + boostDistanceOffset)
    tempOffset.current.applyQuaternion(ship.quaternion)
    tempOffset.current.add(ship.position)

    tempLookAt.current.set(0, 0.4, -6.0)
    tempLookAt.current.applyQuaternion(ship.quaternion)
    tempLookAt.current.add(ship.position)

    if (!initialized.current) {
      camera.position.copy(tempOffset.current)
      currentLookAt.current.copy(tempLookAt.current)
      camera.lookAt(currentLookAt.current)
      initialized.current = true
      return
    }

    const positionLerp = 1 - Math.exp(-5.0 * dt)
    const lookAtLerp = 1 - Math.exp(-6.5 * dt)

    camera.position.lerp(tempOffset.current, positionLerp)
    currentLookAt.current.lerp(tempLookAt.current, lookAtLerp)

    camera.lookAt(currentLookAt.current)

    // Dynamic FOV Warp Effect during Boost / Warp Speed
    const targetFov = isInspecting ? 50 : activeBoosting ? 68 : 55
    if (Math.abs(camera.fov - targetFov) > 0.05) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 1 - Math.exp(-5.0 * dt))
      camera.updateProjectionMatrix()
    }
  })

  return null
}
