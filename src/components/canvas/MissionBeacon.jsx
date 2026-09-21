import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

export default function MissionBeacon() {
  const outerRingRef = useRef()
  const innerRingRef = useRef()
  const coreRef = useRef()
  const orbitRef = useRef()

  useFrame((state, delta) => {
    if (outerRingRef.current) {
      outerRingRef.current.rotation.x += delta * 0.4
      outerRingRef.current.rotation.y += delta * 0.6
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.y -= delta * 0.8
      innerRingRef.current.rotation.z += delta * 0.5
    }
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.3
    }
    if (orbitRef.current) {
      orbitRef.current.rotation.z += delta * 0.2
    }
  })

  return (
    <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.2}>
      <group position={[0, 0, 0]}>
        {/* Central Core */}
        <mesh ref={coreRef}>
          <octahedronGeometry args={[1.4, 0]} />
          <MeshDistortMaterial
            color="#00f0ff"
            emissive="#004466"
            wireframe
            distort={0.25}
            speed={2}
            roughness={0.1}
          />
        </mesh>

        {/* Inner Glowing Core */}
        <mesh>
          <sphereGeometry args={[0.7, 16, 16]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={1.5}
            roughness={0.2}
          />
        </mesh>

        {/* Middle Ring */}
        <mesh ref={innerRingRef}>
          <torusGeometry args={[2.2, 0.04, 16, 64]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={0.8}
            wireframe
          />
        </mesh>

        {/* Outer Ring */}
        <mesh ref={outerRingRef}>
          <torusGeometry args={[3.0, 0.03, 16, 64]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#1d4ed8"
            emissiveIntensity={0.6}
            wireframe
          />
        </mesh>

        {/* Orbital Beacon Satellite Nodes */}
        <group ref={orbitRef}>
          <mesh position={[2.6, 0, 0]}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={2} />
          </mesh>
          <mesh position={[-2.6, 0, 0]}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={2} />
          </mesh>
        </group>
      </group>
    </Float>
  )
}
