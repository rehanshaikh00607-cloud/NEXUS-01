import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Spacecraft({ activeSection }) {
  const shipRef = useRef()
  const thrusterLeftRef = useRef()
  const thrusterRightRef = useRef()
  const strobeRef = useRef()

  useFrame((state, delta) => {
    if (!shipRef.current) return

    // Subtle breathing/floating motion
    const t = state.clock.getElapsedTime()
    shipRef.current.position.y = Math.sin(t * 1.2) * 0.12
    shipRef.current.rotation.z = Math.sin(t * 0.8) * 0.04
    shipRef.current.rotation.x = Math.cos(t * 0.7) * 0.03

    // Thruster engine flicker / pulsing
    const pulse = 1.0 + Math.sin(t * 24) * 0.15 + Math.random() * 0.1
    if (thrusterLeftRef.current && thrusterRightRef.current) {
      thrusterLeftRef.current.scale.set(1, 1, pulse)
      thrusterRightRef.current.scale.set(1, 1, pulse)
    }

    // Strobe navigation light
    if (strobeRef.current) {
      strobeRef.current.intensity = Math.sin(t * 6) > 0.8 ? 2.5 : 0.2
    }
  })

  return (
    <group ref={shipRef} position={[0, 0, 0]} rotation={[0.15, -0.4, 0]}>
      {/* Main Fuselage (Chiseled sci-fi hull) */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[0.9, 4.2, 5]} />
        <meshStandardMaterial
          color="#0c1628"
          roughness={0.35}
          metalness={0.8}
          flatShading
        />
      </mesh>

      {/* Underbelly Armor Plating */}
      <mesh position={[0, -0.15, 0.2]} rotation={[0.05, 0, 0]}>
        <boxGeometry args={[1.1, 0.25, 3.2]} />
        <meshStandardMaterial
          color="#050a14"
          roughness={0.45}
          metalness={0.9}
        />
      </mesh>

      {/* Cockpit Canopy (Glowing Neon Cyan) */}
      <mesh position={[0, 0.32, -0.5]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.45, 0.25, 1.4]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00b4d8"
          emissiveIntensity={1.2}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Port Wing (Left Swept Wing) */}
      <group position={[-1.2, -0.05, 0.5]} rotation={[0, -0.2, -0.08]}>
        <mesh>
          <boxGeometry args={[1.8, 0.06, 1.8]} />
          <meshStandardMaterial
            color="#091222"
            roughness={0.4}
            metalness={0.8}
          />
        </mesh>
        {/* Port Wingtip Navigation Light (Red) */}
        <mesh position={[-0.9, 0.05, 0.7]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={3} />
        </mesh>
      </group>

      {/* Starboard Wing (Right Swept Wing) */}
      <group position={[1.2, -0.05, 0.5]} rotation={[0, 0.2, 0.08]}>
        <mesh>
          <boxGeometry args={[1.8, 0.06, 1.8]} />
          <meshStandardMaterial
            color="#091222"
            roughness={0.4}
            metalness={0.8}
          />
        </mesh>
        {/* Starboard Wingtip Navigation Light (Green) */}
        <mesh position={[0.9, 0.05, 0.7]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={3} />
        </mesh>
      </group>

      {/* Dorsal Stabilizer Fin */}
      <mesh position={[0, 0.65, 1.1]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.08, 0.8, 1.0]} />
        <meshStandardMaterial
          color="#070e1c"
          roughness={0.3}
          metalness={0.85}
        />
      </mesh>

      {/* Tail Navigation Beacon */}
      <pointLight ref={strobeRef} position={[0, 1.1, 1.4]} color="#ffffff" distance={3} />

      {/* Twin Ion Thrusters */}
      {/* Left Thruster Nozzle */}
      <mesh position={[-0.42, 0, 2.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.26, 0.4, 16]} />
        <meshStandardMaterial color="#111827" metalness={0.95} roughness={0.2} />
      </mesh>
      {/* Left Thruster Plume */}
      <mesh ref={thrusterLeftRef} position={[-0.42, 0, 2.7]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.18, 1.2, 16]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.85} />
      </mesh>

      {/* Right Thruster Nozzle */}
      <mesh position={[0.42, 0, 2.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.26, 0.4, 16]} />
        <meshStandardMaterial color="#111827" metalness={0.95} roughness={0.2} />
      </mesh>
      {/* Right Thruster Plume */}
      <mesh ref={thrusterRightRef} position={[0.42, 0, 2.7]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.18, 1.2, 16]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.85} />
      </mesh>

      {/* Ship Identification Hull Text Decal Indicator */}
      <mesh position={[0, 0.26, 0.7]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.6, 0.12]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.6} />
      </mesh>
    </group>
  )
}
