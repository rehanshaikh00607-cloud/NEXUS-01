import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function SpaceStation({
  position = [-22, 8, -26],
  rotation = [0.2, 0.4, 0],
  scale = 1,
  rotationSpeed = 0.2
}) {
  const stationRef = useRef()
  const ringRef = useRef()
  const strobeRef = useRef()

  useFrame((state, delta) => {
    // Rotate the habitat ring for simulated gravity
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * rotationSpeed
    }

    // Gentle station drift
    if (stationRef.current) {
      stationRef.current.rotation.y += delta * 0.05
    }

    // Strobe navigation beacon
    if (strobeRef.current) {
      const t = state.clock.getElapsedTime()
      strobeRef.current.intensity = Math.sin(t * 4) > 0.85 ? 2.0 : 0.1
    }
  })

  return (
    <group ref={stationRef} position={position} rotation={rotation} scale={scale}>
      {/* Central Command Core Cylinder */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 5.0, 16]} />
        <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.3} />
      </mesh>

      {/* Docking Hub Spheres at Ends */}
      <mesh position={[0, 0, 2.6]}>
        <sphereGeometry args={[0.75, 16, 16]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, -2.6]}>
        <sphereGeometry args={[0.75, 16, 16]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Rotating Toroidal Habitat Ring */}
      <group ref={ringRef} position={[0, 0, 0]}>
        <mesh>
          <torusGeometry args={[3.2, 0.28, 16, 48]} />
          <meshStandardMaterial
            color="#1e293b"
            emissive="#0284c7"
            emissiveIntensity={0.2}
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>

        {/* 4 Radial Connecting Struts */}
        <mesh rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 6.4, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 6.4, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* Habitat Pods along ring */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
          <mesh
            key={i}
            position={[Math.cos(angle) * 3.2, Math.sin(angle) * 3.2, 0]}
          >
            <boxGeometry args={[0.6, 0.6, 0.8]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#00f0ff"
              emissiveIntensity={0.3}
              metalness={0.7}
              roughness={0.4}
            />
          </mesh>
        ))}
      </group>

      {/* Photovoltaic Solar Array Wings (Twin Pairs) */}
      <group position={[0, 0, 1.2]}>
        {/* Left Solar Panel */}
        <mesh position={[-3.0, 0, 0]}>
          <boxGeometry args={[3.5, 1.2, 0.04]} />
          <meshStandardMaterial
            color="#0369a1"
            emissive="#0284c7"
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        {/* Right Solar Panel */}
        <mesh position={[3.0, 0, 0]}>
          <boxGeometry args={[3.5, 1.2, 0.04]} />
          <meshStandardMaterial
            color="#0369a1"
            emissive="#0284c7"
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Communications Array Mast & Dish */}
      <group position={[0, 1.6, 2.5]} rotation={[-0.4, 0.3, 0]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 1.0, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.45, 0.25, 16, 1, true]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Navigation Strobe Light */}
      <pointLight ref={strobeRef} position={[0, 0, 3.2]} color="#00f0ff" distance={8} intensity={1} />
      <pointLight position={[0, 0, -3.2]} color="#f59e0b" distance={8} intensity={0.8} />
    </group>
  )
}
