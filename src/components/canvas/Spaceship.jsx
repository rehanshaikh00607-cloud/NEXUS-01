import { forwardRef, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const Spaceship = forwardRef(function Spaceship(
  { thrust = 0, isBoosting = false, thrustRef = null },
  ref
) {
  const thrusterLeftRef = useRef()
  const thrusterRightRef = useRef()
  const engineLightRef = useRef()
  const strobeRef = useRef()

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()

    // Read real-time thrust from ref if available to eliminate React state re-renders
    const currentThrust = thrustRef?.current ? thrustRef.current.thrust : thrust
    const currentBoosting = thrustRef?.current ? thrustRef.current.isBoosting : isBoosting

    // Thruster flame dynamic length and flicker
    // Base idle: 0.8, Full forward: 1.8, Boost: 3.2
    const baseScale = currentBoosting ? 2.8 : currentThrust > 0.05 ? 1.0 + currentThrust * 1.0 : 0.6
    const flicker = Math.sin(t * 30) * 0.15 + (Math.random() - 0.5) * 0.1
    const finalLength = Math.max(0.4, baseScale + flicker)
    const finalGirth = currentBoosting ? 1.3 : 0.8 + currentThrust * 0.3

    if (thrusterLeftRef.current && thrusterRightRef.current) {
      thrusterLeftRef.current.scale.set(finalGirth, finalGirth, finalLength)
      thrusterRightRef.current.scale.set(finalGirth, finalGirth, finalLength)
    }

    // Engine light glow intensity
    if (engineLightRef.current) {
      const targetIntensity = currentBoosting ? 3.5 : currentThrust > 0.05 ? 1.8 : 0.7
      engineLightRef.current.intensity = THREE.MathUtils.lerp(
        engineLightRef.current.intensity,
        targetIntensity,
        delta * 6
      )
    }

    // Navigation strobe flashing
    if (strobeRef.current) {
      strobeRef.current.intensity = Math.sin(t * 5) > 0.85 ? 2.5 : 0.2
    }
  })

  return (
    <group ref={ref}>
      {/* ================= Fuselage ================= */}
      {/* Nose Cone / Cockpit Forebody */}
      <mesh position={[0, 0, -1.3]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.75, 2.4, 6]} />
        <meshStandardMaterial
          color="#0c1628"
          roughness={0.35}
          metalness={0.8}
          flatShading
        />
      </mesh>

      {/* Mid Fuselage Chassis */}
      <mesh position={[0, 0, 0.4]}>
        <boxGeometry args={[1.2, 0.55, 1.8]} />
        <meshStandardMaterial
          color="#080f1e"
          roughness={0.4}
          metalness={0.85}
        />
      </mesh>

      {/* Underbelly Shielding */}
      <mesh position={[0, -0.22, 0.2]} rotation={[0.04, 0, 0]}>
        <boxGeometry args={[1.05, 0.2, 2.6]} />
        <meshStandardMaterial
          color="#040812"
          roughness={0.6}
          metalness={0.9}
        />
      </mesh>

      {/* Cockpit Canopy Visor (Glowing Cyan) */}
      <mesh position={[0, 0.34, -0.7]} rotation={[-0.32, 0, 0]}>
        <boxGeometry args={[0.5, 0.22, 1.3]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00b4d8"
          emissiveIntensity={1.3}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* ================= Wings ================= */}
      {/* Port (Left) Swept Wing */}
      <group position={[-1.4, -0.05, 0.6]} rotation={[0, -0.22, -0.08]}>
        <mesh>
          <boxGeometry args={[2.0, 0.08, 1.9]} />
          <meshStandardMaterial
            color="#0a1324"
            roughness={0.4}
            metalness={0.85}
          />
        </mesh>
        {/* Port Wingtip Navigation Light (Aviation Red) */}
        <mesh position={[-1.0, 0.05, 0.75]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={3} />
        </mesh>
      </group>

      {/* Starboard (Right) Swept Wing */}
      <group position={[1.4, -0.05, 0.6]} rotation={[0, 0.22, 0.08]}>
        <mesh>
          <boxGeometry args={[2.0, 0.08, 1.9]} />
          <meshStandardMaterial
            color="#0a1324"
            roughness={0.4}
            metalness={0.85}
          />
        </mesh>
        {/* Starboard Wingtip Navigation Light (Aviation Green) */}
        <mesh position={[1.0, 0.05, 0.75]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={3} />
        </mesh>
      </group>

      {/* Dorsal Stabilizer Fin */}
      <mesh position={[0, 0.68, 1.0]} rotation={[0.42, 0, 0]}>
        <boxGeometry args={[0.08, 0.85, 1.1]} />
        <meshStandardMaterial
          color="#070e1c"
          roughness={0.3}
          metalness={0.85}
        />
      </mesh>

      {/* Tail Navigation Beacon */}
      <pointLight ref={strobeRef} position={[0, 1.15, 1.4]} color="#ffffff" distance={4} intensity={0.4} />

      {/* ================= Propulsion & Engines ================= */}
      {/* Left Engine Nozzle */}
      <mesh position={[-0.45, 0, 1.45]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 0.45, 16]} />
        <meshStandardMaterial color="#0f172a" metalness={0.95} roughness={0.2} />
      </mesh>
      {/* Left Engine Flame Plume */}
      <mesh ref={thrusterLeftRef} position={[-0.45, 0, 2.1]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.2, 1.2, 16]} />
        <meshBasicMaterial
          color={isBoosting ? '#38bdf8' : '#00f0ff'}
          transparent
          opacity={isBoosting ? 0.95 : 0.8}
        />
      </mesh>

      {/* Right Engine Nozzle */}
      <mesh position={[0.45, 0, 1.45]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 0.45, 16]} />
        <meshStandardMaterial color="#0f172a" metalness={0.95} roughness={0.2} />
      </mesh>
      {/* Right Engine Flame Plume */}
      <mesh ref={thrusterRightRef} position={[0.45, 0, 2.1]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.2, 1.2, 16]} />
        <meshBasicMaterial
          color={isBoosting ? '#38bdf8' : '#00f0ff'}
          transparent
          opacity={isBoosting ? 0.95 : 0.8}
        />
      </mesh>

      {/* Rear Engine Dynamic Lighting */}
      <pointLight
        ref={engineLightRef}
        position={[0, 0, 2.0]}
        color={isBoosting ? '#38bdf8' : '#00f0ff'}
        distance={9}
        intensity={1.0}
      />
    </group>
  )
})

export default Spaceship
