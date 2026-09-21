import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * EngineGlow
 * Reusable aerospace propulsion effect:
 * - Dual vectoring plasma flame cones (inner core + outer sheath)
 * - Trailing exhaust ion particles streaming behind the vessel
 * - Highly responsive to flight states: IDLE/LOW SPEED, CRUISE, BOOST, and DECEL
 */
export default function EngineGlow({ thrustRef = null, isBoosting = false, speedRef = null }) {
  const leftOuterFlameRef = useRef()
  const leftInnerFlameRef = useRef()
  const rightOuterFlameRef = useRef()
  const rightInnerFlameRef = useRef()
  const engineLightRef = useRef()
  const particlePointsRef = useRef()

  // Pre-allocated reusable vectors for zero-allocation per-frame interpolation
  const tempOuterScale = useRef(new THREE.Vector3())
  const tempInnerScale = useRef(new THREE.Vector3())

  // Particle positions & lifetimes memoized (zero GC churn)
  const PARTICLE_COUNT = 40
  const { positions, velocities, life } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const vel = new Float32Array(PARTICLE_COUNT * 3)
    const lf = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const isLeft = i % 2 === 0
      pos[i * 3] = isLeft ? -0.46 : 0.46
      pos[i * 3 + 1] = 0
      pos[i * 3 + 2] = 1.4 + Math.random() * 0.4
      vel[i * 3] = (Math.random() - 0.5) * 0.12
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.12
      vel[i * 3 + 2] = 1.2 + Math.random() * 2.8
      lf[i] = Math.random()
    }
    return { positions: pos, velocities: vel, life: lf }
  }, [])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1)
    const t = state.clock.getElapsedTime()

    // Read real-time kinematics without triggering React re-renders
    const currentThrust = thrustRef?.current ? thrustRef.current.thrust : 0
    const boosting = thrustRef?.current ? thrustRef.current.isBoosting : isBoosting
    const currentSpeed = speedRef ? speedRef.current : 0

    // Dynamic flight state detection
    // 1. Boost (SHIFT)
    // 2. Normal Flight / Cruise (Thrust active or moving at speed)
    // 3. Low Speed / Stop (Idle pilot flame)
    let targetLength = 0.32 // Low speed / idle pilot flame
    let targetGirth = 0.55
    let targetLightIntensity = 0.45

    if (boosting) {
      targetLength = 2.45
      targetGirth = 1.25
      targetLightIntensity = 4.8
    } else if (currentThrust > 0.4 || currentSpeed > 4.0) {
      // Normal cruise propulsion
      const cruiseRatio = Math.min(1.0, currentThrust)
      targetLength = 0.95 + cruiseRatio * 0.65
      targetGirth = 0.85 + cruiseRatio * 0.25
      targetLightIntensity = 1.8 + cruiseRatio * 0.8
    } else if (currentSpeed > 0.5) {
      // Drifting / Low cruise
      targetLength = 0.55
      targetGirth = 0.68
      targetLightIntensity = 0.85
    }

    // High frequency plasma micro-flicker
    const flicker = Math.sin(t * 42) * 0.05 + (Math.random() - 0.5) * 0.04
    const flameLength = Math.max(0.2, targetLength + flicker)
    const flameGirth = targetGirth

    // Smooth exponential interpolation using pre-allocated Vector3 (zero GC)
    const flameAlpha = 1 - Math.exp(-14 * dt)
    tempOuterScale.current.set(flameGirth, flameGirth, flameLength)
    if (leftOuterFlameRef.current) leftOuterFlameRef.current.scale.lerp(tempOuterScale.current, flameAlpha)
    if (rightOuterFlameRef.current) rightOuterFlameRef.current.scale.lerp(tempOuterScale.current, flameAlpha)

    const innerLength = flameLength * 0.72
    const innerGirth = flameGirth * 0.52
    tempInnerScale.current.set(innerGirth, innerGirth, innerLength)
    if (leftInnerFlameRef.current) leftInnerFlameRef.current.scale.lerp(tempInnerScale.current, flameAlpha)
    if (rightInnerFlameRef.current) rightInnerFlameRef.current.scale.lerp(tempInnerScale.current, flameAlpha)

    // Dynamic light response
    if (engineLightRef.current) {
      engineLightRef.current.intensity = THREE.MathUtils.lerp(
        engineLightRef.current.intensity,
        targetLightIntensity,
        1 - Math.exp(-10 * dt)
      )
    }

    // Exhaust ion particles simulation
    if (particlePointsRef.current) {
      const geom = particlePointsRef.current.geometry
      const posAttr = geom.attributes.position

      const speedMult = boosting ? 4.2 : (currentThrust > 0.3 || currentSpeed > 4.0 ? 1.8 : 0.4)

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        life[i] += dt * speedMult * 2.2

        if (life[i] >= 1.0) {
          life[i] = 0
          const isLeft = i % 2 === 0
          posAttr.array[i * 3] = (isLeft ? -0.46 : 0.46) + (Math.random() - 0.5) * 0.08
          posAttr.array[i * 3 + 1] = (Math.random() - 0.5) * 0.08
          posAttr.array[i * 3 + 2] = 1.45
        } else {
          posAttr.array[i * 3] += velocities[i * 3] * dt
          posAttr.array[i * 3 + 1] += velocities[i * 3 + 1] * dt
          posAttr.array[i * 3 + 2] += (velocities[i * 3 + 2] * speedMult) * dt * 4.2
        }
      }
      posAttr.needsUpdate = true

      if (particlePointsRef.current.material) {
        particlePointsRef.current.material.opacity = boosting
          ? 0.85
          : (currentThrust > 0.3 || currentSpeed > 4.0 ? 0.55 : 0.2)
        particlePointsRef.current.material.size = boosting ? 0.34 : 0.22
      }
    }
  })

  return (
    <group>
      {/* ================= PORT (LEFT) THRUSTER ================= */}
      <group position={[-0.46, 0, 1.4]}>
        {/* Outer Plasma Cone */}
        <mesh ref={leftOuterFlameRef} position={[0, 0, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.22, 1.2, 16]} />
          <meshBasicMaterial
            color="#00f0ff"
            transparent
            opacity={0.75}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        {/* Inner High-Energy Core */}
        <mesh ref={leftInnerFlameRef} position={[0, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.13, 0.9, 16]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.95}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* ================= STARBOARD (RIGHT) THRUSTER ================= */}
      <group position={[0.46, 0, 1.4]}>
        {/* Outer Plasma Cone */}
        <mesh ref={rightOuterFlameRef} position={[0, 0, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.22, 1.2, 16]} />
          <meshBasicMaterial
            color="#00f0ff"
            transparent
            opacity={0.75}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        {/* Inner High-Energy Core */}
        <mesh ref={rightInnerFlameRef} position={[0, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.13, 0.9, 16]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.95}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Trailing Ion Exhaust Particles */}
      <points ref={particlePointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_COUNT}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#38bdf8"
          size={0.22}
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Dynamic Engine Lighting */}
      <pointLight
        ref={engineLightRef}
        position={[0, 0, 2.0]}
        color="#00f0ff"
        distance={8}
        intensity={1.0}
      />
    </group>
  )
}
