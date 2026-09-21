import { forwardRef, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import EngineGlow from './EngineGlow'

/**
 * Spaceship
 * 3D procedural spacecraft NEXUS-01:
 * - High-visibility aerospace silhouette with dual-tone metallic alloy plating
 * - Swept wings with cyan emissive trim strips and angled winglets
 * - Glowing crystalline cyan canopy visor
 * - Dual vectoring propulsion nacelles with integrated EngineGlow
 * - Navigation lights (port red, starboard green, dorsal white strobe)
 * - Smooth banking & pitch tilt responding to flight maneuvers
 */
const Spaceship = forwardRef(function Spaceship(
  { thrustRef = null, isBoosting = false, bankAngle = 0, pitchAngle = 0, bankRef = null, pitchRef = null, speedRef = null },
  ref
) {
  const visualMeshGroupRef = useRef()
  const strobeRef = useRef()
  const headlightRef = useRef()

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    const dt = Math.min(delta, 0.1)

    // Aerospace strobe: crisp double-pulse every 1.2 seconds
    if (strobeRef.current) {
      const cycle = t % 1.2
      const isPulse = (cycle < 0.07) || (cycle > 0.14 && cycle < 0.21)
      strobeRef.current.intensity = isPulse ? 3.8 : 0.15
    }

    // Smooth visual roll banking and pitch tilt responding to flight maneuvers
    if (visualMeshGroupRef.current) {
      const targetBank = bankRef ? bankRef.current : bankAngle
      const currentBank = visualMeshGroupRef.current.rotation.z

      visualMeshGroupRef.current.rotation.z = THREE.MathUtils.lerp(
        currentBank,
        targetBank,
        1 - Math.exp(-8.0 * dt)
      )

      const targetPitch = pitchRef ? pitchRef.current : pitchAngle
      visualMeshGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        visualMeshGroupRef.current.rotation.x,
        targetPitch,
        1 - Math.exp(-8.0 * dt)
      )
    }
  })

  return (
    <group ref={ref}>
      {/* Subtle Dedicated Aerospace Rim Light & Fill Light for Starfield Silhouette Visibility */}
      <pointLight position={[0, 3.2, 3.8]} color="#bae6fd" distance={12} intensity={1.5} />
      <pointLight position={[0, -1.8, 0]} color="#0284c7" distance={8} intensity={0.7} />
      <directionalLight position={[3, 4, 2]} intensity={0.8} color="#f0f9ff" />

      {/* Visual Model Container (receives smooth roll & pitch without disturbing root global quaternion) */}
      <group ref={visualMeshGroupRef}>
        {/* ================= 1. FUSELAGE / COCKPIT FOREBODY ================= */}
        {/* Forward Nose Cone (Crisp Angular Titanium Wedge) */}
        <mesh position={[0, 0.05, -1.55]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.72, 2.5, 6]} />
          <meshStandardMaterial
            color="#94a3b8"
            roughness={0.22}
            metalness={0.88}
            flatShading
          />
        </mesh>

        {/* Dorsal Spine Plate (Platinum High-Visibility Accent) */}
        <mesh position={[0, 0.22, -0.4]}>
          <boxGeometry args={[0.65, 0.22, 2.1]} />
          <meshStandardMaterial
            color="#e2e8f0"
            roughness={0.18}
            metalness={0.92}
          />
        </mesh>

        {/* Mid Fuselage Main Body */}
        <mesh position={[0, 0.02, 0.35]}>
          <boxGeometry args={[1.25, 0.58, 2.0]} />
          <meshStandardMaterial
            color="#64748b"
            roughness={0.24}
            metalness={0.85}
          />
        </mesh>

        {/* Underbelly Reinforced Heat Armor */}
        <mesh position={[0, -0.22, 0.25]} rotation={[0.04, 0, 0]}>
          <boxGeometry args={[1.15, 0.18, 2.7]} />
          <meshStandardMaterial
            color="#334155"
            roughness={0.35}
            metalness={0.9}
          />
        </mesh>

        {/* Cockpit Visor Canopy (Luminous Cyan Crystal) */}
        <mesh position={[0, 0.34, -0.85]} rotation={[-0.32, 0, 0]}>
          <boxGeometry args={[0.52, 0.25, 1.35]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#00f0ff"
            emissiveIntensity={2.2}
            roughness={0.08}
            metalness={0.95}
          />
        </mesh>

        {/* ================= 2. WINGS & AERODYNAMIC ACCENTS ================= */}
        {/* Port (Left) Swept Wing */}
        <group position={[-1.45, -0.02, 0.65]} rotation={[0, -0.22, -0.06]}>
          {/* Main Wing Surface */}
          <mesh>
            <boxGeometry args={[2.05, 0.08, 1.95]} />
            <meshStandardMaterial
              color="#5b6b82"
              roughness={0.24}
              metalness={0.86}
            />
          </mesh>
          {/* Leading Edge Luminous Cyan Accent Strip */}
          <mesh position={[-0.1, 0.05, -0.85]} rotation={[0, 0.24, 0]}>
            <boxGeometry args={[1.9, 0.03, 0.08]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>
          {/* Angled Winglet */}
          <mesh position={[-1.0, 0.2, 0.15]} rotation={[0, 0, -0.45]}>
            <boxGeometry args={[0.08, 0.45, 1.2]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.18} />
          </mesh>
          {/* Port Navigation Light (Aviation Red) */}
          <mesh position={[-1.15, 0.38, 0.65]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={3.5} />
          </mesh>
        </group>

        {/* Starboard (Right) Swept Wing */}
        <group position={[1.45, -0.02, 0.65]} rotation={[0, 0.22, 0.06]}>
          {/* Main Wing Surface */}
          <mesh>
            <boxGeometry args={[2.05, 0.08, 1.95]} />
            <meshStandardMaterial
              color="#5b6b82"
              roughness={0.24}
              metalness={0.86}
            />
          </mesh>
          {/* Leading Edge Luminous Cyan Accent Strip */}
          <mesh position={[0.1, 0.05, -0.85]} rotation={[0, -0.24, 0]}>
            <boxGeometry args={[1.9, 0.03, 0.08]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>
          {/* Angled Winglet */}
          <mesh position={[1.0, 0.2, 0.15]} rotation={[0, 0, 0.45]}>
            <boxGeometry args={[0.08, 0.45, 1.2]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.18} />
          </mesh>
          {/* Starboard Navigation Light (Aviation Green) */}
          <mesh position={[1.15, 0.38, 0.65]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={3.5} />
          </mesh>
        </group>

        {/* Dorsal Stabilizer Fin */}
        <mesh position={[0, 0.72, 1.05]} rotation={[0.42, 0, 0]}>
          <boxGeometry args={[0.09, 0.92, 1.15]} />
          <meshStandardMaterial
            color="#475569"
            roughness={0.22}
            metalness={0.88}
          />
        </mesh>

        {/* White Dorsal Flashing Strobe */}
        <pointLight
          ref={strobeRef}
          position={[0, 1.25, 1.45]}
          color="#ffffff"
          distance={5}
          intensity={0.6}
        />

        {/* Twin Forward Sensor Spotlights */}
        <mesh position={[-0.32, -0.05, -1.9]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#e0f2fe" />
        </mesh>
        <mesh position={[0.32, -0.05, -1.9]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#e0f2fe" />
        </mesh>
        <pointLight
          ref={headlightRef}
          position={[0, 0, -2.2]}
          color="#bae6fd"
          distance={10}
          intensity={1.2}
        />

        {/* ================= 3. DUAL ENGINE NACELLES ================= */}
        {/* Left Nacelle Cowling */}
        <mesh position={[-0.46, 0.02, 1.3]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.28, 0.6, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.18} />
        </mesh>
        {/* Left Glowing Intake Ring */}
        <mesh position={[-0.46, 0.02, 1.58]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.21, 0.03, 12, 24]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>

        {/* Right Nacelle Cowling */}
        <mesh position={[0.46, 0.02, 1.3]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.28, 0.6, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.18} />
        </mesh>
        {/* Right Glowing Intake Ring */}
        <mesh position={[0.46, 0.02, 1.58]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.21, 0.03, 12, 24]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>

        {/* Reusable Dual Engine Glow & Ion Exhaust Stream */}
        <EngineGlow thrustRef={thrustRef} isBoosting={isBoosting} speedRef={speedRef} />
      </group>
    </group>
  )
})

export default Spaceship
