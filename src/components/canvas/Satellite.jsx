import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Satellite({
  position = [12, -4, -14],
  orbitCenter = null,
  orbitRadius = 14,
  orbitSpeed = 0.3,
  scale = 0.8,
  initialAngle = 0
}) {
  const satRef = useRef()
  const dishRef = useRef()
  const angleRef = useRef(initialAngle)

  useFrame((state, delta) => {
    if (!satRef.current) return

    // If orbitCenter is provided, calculate circular orbit around that point
    if (orbitCenter) {
      angleRef.current += delta * orbitSpeed
      satRef.current.position.x = orbitCenter[0] + Math.cos(angleRef.current) * orbitRadius
      satRef.current.position.z = orbitCenter[2] + Math.sin(angleRef.current) * orbitRadius
      satRef.current.position.y = orbitCenter[1] + Math.sin(angleRef.current * 0.5) * 1.5
      satRef.current.rotation.y = -angleRef.current
    } else {
      // Gentle stationary tumbling/inspection
      satRef.current.rotation.y += delta * 0.2
      satRef.current.rotation.x += delta * 0.1
    }

    // Dish telemetry tracking
    if (dishRef.current) {
      dishRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.3
    }
  })

  return (
    <group ref={satRef} position={position} scale={scale}>
      {/* Satellite Main Bus (Hexagonal Chassis with Gold Foil Sheen) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.7, 0.7, 0.9]} />
        <meshStandardMaterial
          color="#d97706"
          emissive="#b45309"
          emissiveIntensity={0.2}
          metalness={0.95}
          roughness={0.25}
        />
      </mesh>

      {/* Equipment Bay Shielding */}
      <mesh position={[0, 0, -0.48]}>
        <cylinderGeometry args={[0.28, 0.28, 0.2, 12]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Folded Solar Wing Panels (Left & Right) */}
      <group position={[-1.4, 0, 0]}>
        <mesh>
          <boxGeometry args={[1.8, 0.6, 0.03]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0369a1"
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Connector Rod */}
        <mesh position={[1.0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, 0.4, 6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </mesh>
      </group>

      <group position={[1.4, 0, 0]}>
        <mesh>
          <boxGeometry args={[1.8, 0.6, 0.03]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0369a1"
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Connector Rod */}
        <mesh position={[-1.0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, 0.4, 6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </mesh>
      </group>

      {/* High-Gain Parabolic Communications Dish */}
      <group ref={dishRef} position={[0, 0.55, 0.2]} rotation={[0.4, 0, 0]}>
        <mesh position={[0, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.4, 0.2, 16, 1, true]} />
          <meshStandardMaterial
            color="#e2e8f0"
            metalness={0.9}
            roughness={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.35, 6]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1} />
        </mesh>
      </group>

      {/* Telemetry Sensor Booms */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.8, 6]} />
        <meshStandardMaterial color="#64748b" metalness={0.8} />
      </mesh>

      {/* Beacon Light */}
      <pointLight position={[0, 0.45, 0]} color="#00f0ff" distance={4} intensity={0.8} />
    </group>
  )
}
