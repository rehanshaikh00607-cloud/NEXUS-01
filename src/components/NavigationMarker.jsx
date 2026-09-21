import { useRef, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

/**
 * NavigationMarker
 * In-world 3D waypoint beacon hovering above the locked celestial destination:
 * - Dynamically increases scale and luminosity as the spaceship approaches
 * - Concentric pulsing arrival rings in range
 * - Clear, high-contrast world-projected HUD label
 */
function NavigationMarkerComponent({ destination = null, distance = null }) {
  const diamondRef = useRef()
  const beamRef = useRef()
  const ringRef = useRef()
  const tempScale = useRef(new THREE.Vector3())

  const proxRadius = destination?.proximityRadius || 15
  const isArrived = distance !== null && distance <= proxRadius
  const approachFactor = distance !== null
    ? THREE.MathUtils.clamp(1 - (distance - proxRadius) / 50, 0, 1)
    : 0

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()

    if (diamondRef.current) {
      diamondRef.current.rotation.y += delta * (1.2 + approachFactor * 1.5)
      diamondRef.current.position.y = Math.sin(t * (2.5 + approachFactor * 1.5)) * 0.45

      // Smoothly scale up as ship approaches destination (zero GC)
      const targetScale = 0.9 + approachFactor * 0.45
      tempScale.current.set(targetScale, targetScale, targetScale)
      diamondRef.current.scale.lerp(tempScale.current, 0.1)
    }

    if (beamRef.current) {
      beamRef.current.material.opacity = 0.28 + approachFactor * 0.35 + Math.sin(t * 3.5) * 0.15
    }

    if (ringRef.current) {
      const ringScale = 1.0 + (Math.sin(t * 3) * 0.5 + 0.5) * 0.6
      ringRef.current.scale.set(ringScale, ringScale, ringScale)
      ringRef.current.material.opacity = (0.35 + approachFactor * 0.45) * (1 - (ringScale - 1.0) / 0.6)
    }
  })

  if (!destination || !destination.coordinates) return null

  const [x, y, z] = destination.coordinates
  const markerYOffset = (destination.radius || 4.5) + 3.8
  const markerPos = [x, y + markerYOffset, z]
  const beaconColor = isArrived ? '#10b981' : (destination.color || '#00f0ff')

  return (
    <group position={markerPos}>
      {/* 1. Holographic Rotating Diamond (◆) */}
      <group ref={diamondRef}>
        <mesh>
          <octahedronGeometry args={[0.9, 0]} />
          <meshBasicMaterial
            color={beaconColor}
            wireframe
            transparent
            opacity={0.75 + approachFactor * 0.25}
          />
        </mesh>
        <mesh>
          <octahedronGeometry args={[0.5, 0]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.8 + approachFactor * 0.2}
          />
        </mesh>

        {/* Concentric Proximity Pulse Ring */}
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.4, 1.55, 32]} />
          <meshBasicMaterial
            color={beaconColor}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* 2. Vertical Guiding Light Beam */}
      <mesh ref={beamRef} position={[0, -markerYOffset / 2, 0]}>
        <cylinderGeometry args={[0.08, 0.12, markerYOffset, 8]} />
        <meshBasicMaterial
          color={beaconColor}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Projected World HTML Waypoint Label */}
      <Html
        position={[0, 2.2 + approachFactor * 0.4, 0]}
        center
        distanceFactor={38}
        zIndexRange={[15, 0]}
        className="world-nav-label-container"
      >
        <div className={`in-world-nav-marker sci-fi-notch ${isArrived ? 'is-arrived-marker' : ''}`}>
          <div className="marker-header">
            <span className="marker-dot" style={{ backgroundColor: beaconColor }}></span>
            <span className="marker-sector">{destination.sector || 'DESTINATION'}</span>
          </div>

          <div className="marker-name">
            {destination.proximityTitle || destination.shortName || destination.name}
          </div>

          <div className="marker-dist">
            {isArrived ? (
              <span className="marker-arrived-tag">IN RANGE // PRESS [ENTER]</span>
            ) : distance !== null ? (
              `${distance} KM`
            ) : (
              'LOCKED'
            )}
          </div>

          <div className="marker-arrow">↓</div>
        </div>
      </Html>
    </group>
  )
}

const NavigationMarker = memo(NavigationMarkerComponent)
export default NavigationMarker
