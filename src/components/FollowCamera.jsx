import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * FollowCamera
 * Desktop-First Third-Person Cinematic Chase Camera:
 * - Ultra-smooth position and rotation interpolation
 * - Comfortably frames spaceship against deep space without filling the screen
 * - Dynamic velocity pull-back: z: 8.5 (idle) -> 10.3 (cruise) -> 12.7 (boost)
 * - Dynamic FOV expansion: 53° (idle) -> 58° (cruise) -> 68° (boost)
 * - High-speed warp boost camera micro-shake
 * - Cinematic transition to destination inspection camera
 */
export default function FollowCamera({
  targetRef,
  speedRef,
  thrustRef,
  isInspecting = false,
  inspectDestination = null
}) {
  const { camera } = useThree()
  const currentLookAt = useRef(new THREE.Vector3(0, 0, -10))
  const initialized = useRef(false)

  // Reusable vectors for zero garbage collection
  const tempDestCoords = useRef(new THREE.Vector3())
  const tempInspectCamPos = useRef(new THREE.Vector3())
  const tempOffset = useRef(new THREE.Vector3())
  const tempLookAt = useRef(new THREE.Vector3())
  const tempCameraUp = useRef(new THREE.Vector3(0, 1, 0))

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1)

    // Mode 1: Inspecting Celestial Destination Dossier
    if (isInspecting && inspectDestination) {
      tempDestCoords.current.set(...inspectDestination.coordinates)
      tempInspectCamPos.current.set(...inspectDestination.inspectCamera)

      const posLerp = 1 - Math.exp(-3.5 * dt)
      const lookLerp = 1 - Math.exp(-4.5 * dt)
      camera.position.lerp(tempInspectCamPos.current, posLerp)
      currentLookAt.current.lerp(tempDestCoords.current, lookLerp)
      camera.up.set(0, 1, 0)
      camera.lookAt(currentLookAt.current)

      if (Math.abs(camera.fov - 50) > 0.05) {
        camera.fov = THREE.MathUtils.lerp(camera.fov, 50, 1 - Math.exp(-5.0 * dt))
        camera.updateProjectionMatrix()
      }
      return
    }

    // Mode 2: Following Controllable Spaceship
    if (!targetRef?.current) return
    const ship = targetRef.current
    const activeSpeed = speedRef ? speedRef.current : 0
    const isBoosting = thrustRef?.current?.isBoosting || false

    // Desktop third-person follow coordinates
    const speedRatio = Math.min(1.0, Math.max(0, activeSpeed / 18.0))
    const boostRatio = isBoosting ? 1.0 : 0.0

    const targetDist = 8.4 + speedRatio * 1.6 + boostRatio * 2.2
    const targetHeight = 2.7 + speedRatio * 0.35 + boostRatio * 0.4

    tempOffset.current.set(0, targetHeight, targetDist)
    tempOffset.current.applyQuaternion(ship.quaternion)
    tempOffset.current.add(ship.position)

    // Look-at point comfortably ahead of the nose
    tempLookAt.current.set(0, 0.5, -7.5)
    tempLookAt.current.applyQuaternion(ship.quaternion)
    tempLookAt.current.add(ship.position)

    // Camera up vector follows ship orientation roll
    tempCameraUp.current.set(0, 1, 0).applyQuaternion(ship.quaternion)

    // Initial snap on first mount
    if (!initialized.current) {
      camera.position.copy(tempOffset.current)
      currentLookAt.current.copy(tempLookAt.current)
      camera.up.copy(tempCameraUp.current)
      camera.lookAt(currentLookAt.current)
      initialized.current = true
      return
    }

    // Ultra-smooth synchronized exponential chase smoothing without jitter
    camera.position.lerp(tempOffset.current, 1 - Math.exp(-5.2 * dt))
    currentLookAt.current.lerp(tempLookAt.current, 1 - Math.exp(-6.0 * dt))
    camera.up.lerp(tempCameraUp.current, 1 - Math.exp(-5.2 * dt))
    camera.lookAt(currentLookAt.current)

    // Dynamic FOV expansion for speed sensation
    const targetFov = isBoosting ? 66 : 53 + speedRatio * 4.5
    if (Math.abs(camera.fov - targetFov) > 0.05) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 1 - Math.exp(-4.8 * dt))
      camera.updateProjectionMatrix()
    }
  })

  return null
}
