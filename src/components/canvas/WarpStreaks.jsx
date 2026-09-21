import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * WarpStreaks
 * High-performance space dust & warp lines that stretch and stream past
 * based on the spaceship's active velocity and boost status.
 */
export default function WarpStreaks({
  targetRef,
  speedRef = null,
  thrustRef = null,
  count = 160
}) {
  const pointsRef = useRef()

  // Generate initial particle positions within a local bounding volume
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count)

    const boxSizeX = 35
    const boxSizeY = 25
    const boxSizeZ = 45

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * boxSizeX
      pos[i * 3 + 1] = (Math.random() - 0.5) * boxSizeY
      pos[i * 3 + 2] = (Math.random() - 0.5) * boxSizeZ
      vel[i] = 0.5 + Math.random() * 0.5
    }

    return { positions: pos, velocities: vel }
  }, [count])

  useFrame((state, delta) => {
    if (!pointsRef.current || !targetRef?.current) return

    const ship = targetRef.current
    const points = pointsRef.current
    const geom = points.geometry
    const posAttr = geom.attributes.position

    const currentSpeed = speedRef ? speedRef.current : 0
    const isBoosting = thrustRef?.current?.isBoosting || false

    // Follow spaceship position & orientation
    points.position.copy(ship.position)
    points.quaternion.copy(ship.quaternion)

    // Stream speed: base idle drift + forward speed multiplier + boost surge
    const streamMultiplier = isBoosting ? 6.0 : Math.max(0.2, currentSpeed * 0.22)
    const dt = Math.min(delta, 0.1)

    const boxDepth = 45
    const halfDepth = boxDepth / 2

    for (let i = 0; i < count; i++) {
      const idx = i * 3 + 2 // Z coordinate
      let z = posAttr.array[idx]

      // Particles stream backwards relative to ship's nose (-Z forward)
      z += streamMultiplier * velocities[i] * 60 * dt

      // Wrap around once past the rear
      if (z > halfDepth) {
        z -= boxDepth
        posAttr.array[i * 3] = (Math.random() - 0.5) * 35
        posAttr.array[i * 3 + 1] = (Math.random() - 0.5) * 25
      }

      posAttr.array[idx] = z
    }

    posAttr.needsUpdate = true

    // Dynamic material opacity and size during boost
    if (points.material) {
      points.material.size = isBoosting ? 0.42 : currentSpeed > 2 ? 0.26 : 0.18
      points.material.opacity = isBoosting ? 0.85 : currentSpeed > 1 ? 0.55 : 0.25
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#38bdf8"
        size={0.2}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
