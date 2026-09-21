import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Planet({
  position = [0, 0, 0],
  radius = 3,
  segments = 28,
  color = '#1e3a8a',
  surfaceColor = '#3b82f6',
  atmosphereColor = '#60a5fa',
  atmosphereOpacity = 0.2,
  hasRings = false,
  ringRadius = [4, 6],
  ringColor = '#93c5fd',
  ringOpacity = 0.5,
  rotationSpeed = 0.04,
  axialTilt = [0.2, 0.1, -0.1],
  hasClouds = true
}) {
  const planetRef = useRef()
  const cloudsRef = useRef()
  const groupRef = useRef()

  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * rotationSpeed
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * (rotationSpeed * 1.3)
    }
  })

  const cloudSegments = Math.max(16, Math.round(segments * 0.85))

  return (
    <group ref={groupRef} position={position} rotation={axialTilt}>
      {/* Main Celestial Body */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[radius, segments, segments]} />
        <meshStandardMaterial
          color={color}
          roughness={0.7}
          metalness={0.15}
          flatShading={false}
        />
      </mesh>

      {/* Atmospheric Cloud / Texture Detail Layer */}
      {hasClouds && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[radius * 1.015, cloudSegments, cloudSegments]} />
          <meshStandardMaterial
            color={surfaceColor}
            transparent
            opacity={0.32}
            roughness={0.9}
            wireframe={true}
          />
        </mesh>
      )}

      {/* Atmospheric Fresnel Rim Glow Shell */}
      <mesh>
        <sphereGeometry args={[radius * 1.07, Math.max(16, segments - 4), Math.max(16, segments - 4)]} />
        <meshBasicMaterial
          color={atmosphereColor}
          transparent
          opacity={atmosphereOpacity}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Optional Celestial Dust Rings */}
      {hasRings && (
        <mesh rotation={[Math.PI / 2 + 0.2, 0, 0]}>
          <ringGeometry args={[ringRadius[0], ringRadius[1], 64]} />
          <meshStandardMaterial
            color={ringColor}
            emissive={ringColor}
            emissiveIntensity={0.1}
            side={THREE.DoubleSide}
            transparent
            opacity={ringOpacity}
            roughness={0.8}
          />
        </mesh>
      )}
    </group>
  )
}
