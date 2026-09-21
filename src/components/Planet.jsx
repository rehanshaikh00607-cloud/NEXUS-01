import { useRef, useMemo, useEffect, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Planet
 * Reusable procedural planet component supporting custom surface materials,
 * wireframe atmospheric clouds, luminous Fresnel rim glow, and planetary rings.
 * Optimized with memoized geometries and React.memo.
 */
function PlanetComponent({
  position = [0, 0, 0],
  radius = 3,
  segments = 32,
  color = '#1e3a8a',
  surfaceColor = '#3b82f6',
  atmosphereColor = '#60a5fa',
  atmosphereOpacity = 0.28,
  hasRings = false,
  ringRadius = [4, 6],
  ringColor = '#93c5fd',
  ringOpacity = 0.5,
  rotationSpeed = 0.04,
  axialTilt = [0.2, 0.1, -0.1],
  hasClouds = true,
  children = null
}) {
  const planetRef = useRef()
  const cloudsRef = useRef()
  const groupRef = useRef()

  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * rotationSpeed
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * (rotationSpeed * 1.35)
    }
  })

  const cloudSegments = Math.max(16, Math.round(segments * 0.85))
  const rimSegments = Math.max(16, segments - 4)

  // Memoize shared geometries for zero GC and instant instantiation
  const sphereGeom = useMemo(() => new THREE.SphereGeometry(radius, segments, segments), [radius, segments])
  const cloudsGeom = useMemo(
    () => (hasClouds ? new THREE.SphereGeometry(radius * 1.018, cloudSegments, cloudSegments) : null),
    [hasClouds, radius, cloudSegments]
  )
  const rimGeom = useMemo(
    () => new THREE.SphereGeometry(radius * 1.075, rimSegments, rimSegments),
    [radius, rimSegments]
  )
  const ringGeom = useMemo(
    () => (hasRings ? new THREE.RingGeometry(ringRadius[0], ringRadius[1], 64) : null),
    [hasRings, ringRadius]
  )

  useEffect(() => {
    return () => {
      sphereGeom.dispose()
      if (cloudsGeom) cloudsGeom.dispose()
      rimGeom.dispose()
      if (ringGeom) ringGeom.dispose()
    }
  }, [sphereGeom, cloudsGeom, rimGeom, ringGeom])

  return (
    <group ref={groupRef} position={position} rotation={axialTilt}>
      {/* Main Celestial Body */}
      <mesh ref={planetRef} geometry={sphereGeom}>
        <meshStandardMaterial
          color={color}
          emissive={surfaceColor}
          emissiveIntensity={0.08}
          roughness={0.65}
          metalness={0.2}
          flatShading={false}
        />
      </mesh>

      {/* Atmospheric Cloud / Surface Wireframe Detail Layer */}
      {hasClouds && cloudsGeom && (
        <mesh ref={cloudsRef} geometry={cloudsGeom}>
          <meshStandardMaterial
            color={surfaceColor}
            transparent
            opacity={0.35}
            roughness={0.8}
            wireframe={true}
          />
        </mesh>
      )}

      {/* Atmospheric Fresnel Rim Glow Shell */}
      <mesh geometry={rimGeom}>
        <meshBasicMaterial
          color={atmosphereColor}
          transparent
          opacity={atmosphereOpacity}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Optional Celestial Dust Rings */}
      {hasRings && ringGeom && (
        <mesh geometry={ringGeom} rotation={[Math.PI / 2 + 0.2, 0, 0]}>
          <meshStandardMaterial
            color={ringColor}
            emissive={ringColor}
            emissiveIntensity={0.15}
            side={THREE.DoubleSide}
            transparent
            opacity={ringOpacity}
            roughness={0.7}
          />
        </mesh>
      )}

      {/* Embedded orbiting children (e.g. moonlets, satellites) */}
      {children}
    </group>
  )
}

const Planet = memo(PlanetComponent)
export default Planet
