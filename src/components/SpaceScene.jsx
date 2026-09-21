import { Suspense, useRef, useEffect, useState, useCallback, memo, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import StarField from './StarField'
import Planet from './Planet'
import SpaceStation from './SpaceStation'
import Spaceship from './Spaceship'
import FollowCamera from './FollowCamera'
import NavigationMarker from './NavigationMarker'
import { DESTINATIONS } from '../data/destinations'

// Satellite Sub-Model for Contact Destination
const SatelliteModel = memo(function SatelliteModel({ position = [14, 5, -16], scale = 0.95 }) {
  const satRef = useRef()
  const beaconRef = useRef()

  useFrame((state, delta) => {
    if (satRef.current) {
      satRef.current.rotation.y += delta * 0.2
      satRef.current.rotation.x += delta * 0.1
    }
    if (beaconRef.current) {
      beaconRef.current.intensity = 1.0 + Math.sin(state.clock.elapsedTime * 4) * 0.8
    }
  })

  return (
    <group ref={satRef} position={position} scale={scale}>
      {/* Main Bus */}
      <mesh>
        <boxGeometry args={[0.8, 0.8, 1.0]} />
        <meshStandardMaterial
          color="#d97706"
          emissive="#b45309"
          emissiveIntensity={0.25}
          metalness={0.95}
          roughness={0.2}
        />
      </mesh>

      {/* Solar Arrays */}
      <group position={[-1.5, 0, 0]}>
        <mesh>
          <boxGeometry args={[2.0, 0.7, 0.04]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0369a1"
            emissiveIntensity={0.2}
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>
      </group>
      <group position={[1.5, 0, 0]}>
        <mesh>
          <boxGeometry args={[2.0, 0.7, 0.04]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0369a1"
            emissiveIntensity={0.2}
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>
      </group>

      {/* Dish Antenna */}
      <mesh position={[0, 0.65, 0]} rotation={[0.4, 0.2, 0]}>
        <coneGeometry args={[0.65, 0.35, 16, 1, true]} />
        <meshStandardMaterial
          color="#e2e8f0"
          metalness={0.9}
          roughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Pulsing Beacon Light */}
      <pointLight ref={beaconRef} color="#f59e0b" distance={10} intensity={1.5} />
    </group>
  )
})

// Starting Dock Model for Home Destination (Hexagonal Station Ring & Navigation Beacon)
const StartingDockModel = memo(function StartingDockModel({ position = [0, 0, 0], scale = 1.0 }) {
  const groupRef = useRef()

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Central Command Core */}
      <mesh>
        <cylinderGeometry args={[1.8, 2.2, 2.5, 6]} />
        <meshStandardMaterial
          color="#1e293b"
          emissive="#0284c7"
          emissiveIntensity={0.22}
          metalness={0.92}
          roughness={0.24}
        />
      </mesh>

      {/* Inner Rotating Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.8, 0.25, 12, 32]} />
        <meshStandardMaterial
          color="#0ea5e9"
          emissive="#38bdf8"
          emissiveIntensity={0.4}
          metalness={0.85}
          roughness={0.2}
        />
      </mesh>

      {/* Outer Hexagonal Docking Girders */}
      <mesh rotation={[0, Math.PI / 6, 0]}>
        <cylinderGeometry args={[5.2, 5.2, 0.35, 6, 1, true]} />
        <meshStandardMaterial
          color="#475569"
          metalness={0.9}
          roughness={0.3}
          wireframe={true}
        />
      </mesh>
    </group>
  )
})

// Orbiting Moonlets for Projects Destination (reusing single geometry and material)
const OrbitingMoonlets = memo(function OrbitingMoonlets({ count = 3, orbitRadius = 11.5 }) {
  const outerRingRef = useRef()
  const beaconLightRef = useRef()

  const sharedMoonletGeo = useMemo(() => new THREE.SphereGeometry(0.75, 16, 16), [])
  const sharedMoonletMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#c084fc',
        emissive: '#a855f7',
        emissiveIntensity: 0.3,
        metalness: 0.7,
        roughness: 0.4
      }),
    []
  )

  useEffect(() => {
    return () => {
      sharedMoonletGeo.dispose()
      sharedMoonletMat.dispose()
    }
  }, [sharedMoonletGeo, sharedMoonletMat])

  useFrame((state, delta) => {
    if (outerRingRef.current) {
      outerRingRef.current.rotation.y += delta * 0.22
      outerRingRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.12
    }
    if (beaconLightRef.current) {
      beaconLightRef.current.intensity = 1.2 + Math.sin(state.clock.elapsedTime * 3) * 0.6
    }
  })

  const moonlets = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      const x = Math.cos(angle) * orbitRadius
      const z = Math.sin(angle) * orbitRadius
      const y = Math.sin(angle * 2) * 1.5
      return { id: i, position: [x, y, z] }
    })
  }, [count, orbitRadius])

  return (
    <group ref={outerRingRef}>
      {moonlets.map((m) => (
        <group key={m.id} position={m.position}>
          <mesh geometry={sharedMoonletGeo} material={sharedMoonletMat} />
          <pointLight color="#d8b4fe" distance={6} intensity={0.8} />
        </group>
      ))}
      <pointLight ref={beaconLightRef} color="#a855f7" distance={22} intensity={1.5} />
    </group>
  )
})

// Static colors for WarpStreaks to avoid runtime hex allocation inside useFrame
const COLOR_WARP_BOOST = new THREE.Color('#a5f3fc')
const COLOR_WARP_CRUISE = new THREE.Color('#38bdf8')

// Warp Speed Lines & Dust Particles with velocity stretch and dynamic boost glow
const WarpStreaksField = memo(function WarpStreaksField({ targetRef, speedRef, thrustRef, count = 200 }) {
  const pointsRef = useRef()
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 36
      pos[i * 3 + 1] = (Math.random() - 0.5) * 26
      pos[i * 3 + 2] = (Math.random() - 0.5) * 48
      vel[i] = 0.6 + Math.random() * 0.6
    }
    return { positions: pos, velocities: vel }
  }, [count])

  useFrame((state, delta) => {
    if (!pointsRef.current || !targetRef?.current) return
    const ship = targetRef.current
    const points = pointsRef.current
    const geom = points.geometry
    const posAttr = geom.attributes.position

    const currentSpeed = speedRef ? speedRef.current : 0
    const isBoosting = thrustRef?.current?.isBoosting || false

    points.position.copy(ship.position)
    points.quaternion.copy(ship.quaternion)

    const streamMultiplier = isBoosting ? 6.5 : Math.max(0.15, currentSpeed * 0.24)
    const dt = Math.min(delta, 0.1)

    for (let i = 0; i < count; i++) {
      const idx = i * 3 + 2
      let z = posAttr.array[idx]
      z += streamMultiplier * velocities[i] * 60 * dt
      if (z > 24) {
        z -= 48
        posAttr.array[i * 3] = (Math.random() - 0.5) * 36
        posAttr.array[i * 3 + 1] = (Math.random() - 0.5) * 26
      }
      posAttr.array[idx] = z
    }
    posAttr.needsUpdate = true

    if (points.material) {
      points.material.size = isBoosting ? 0.44 : currentSpeed > 2 ? 0.25 : 0.16
      points.material.opacity = isBoosting ? 0.88 : currentSpeed > 1 ? 0.5 : 0.18
      points.material.color.copy(isBoosting ? COLOR_WARP_BOOST : COLOR_WARP_CRUISE)
    }
  })

  return (
    <points ref={pointsRef} raycast={() => null}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color="#38bdf8"
        size={0.2}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
})

// Lightweight, restrained Three.js bloom post-processing pipeline
// Cap internal buffer resolution to 384x216 for superior fill-rate efficiency while preserving cinematic glow
function PostProcessingEffect() {
  const { gl, scene, camera, size } = useThree()
  const composerRef = useRef()
  const bloomPassRef = useRef()

  useEffect(() => {
    const composer = new EffectComposer(gl)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    // Performance-optimized bloom resolution (capped to max 384x216):
    // Saves 44% shader convolution fill-rate while preserving soft, low-frequency atmospheric bloom
    const bloomRes = new THREE.Vector2(
      Math.min(384, Math.max(192, Math.floor(size.width * 0.35))),
      Math.min(216, Math.max(108, Math.floor(size.height * 0.35)))
    )
    const bloomPass = new UnrealBloomPass(
      bloomRes,
      0.36, // strength: subtle, restrained, non-arcade
      0.28, // radius: tight, crisp
      0.85  // threshold: only high-intensity emissives bloom
    )
    bloomPassRef.current = bloomPass
    composer.addPass(bloomPass)

    const outputPass = new OutputPass()
    composer.addPass(outputPass)

    composer.setSize(size.width, size.height)
    composerRef.current = composer

    return () => {
      composer.dispose()
    }
  }, [gl, scene, camera])

  useEffect(() => {
    if (composerRef.current) {
      composerRef.current.setSize(size.width, size.height)
    }
    if (bloomPassRef.current) {
      bloomPassRef.current.resolution.set(
        Math.min(384, Math.max(192, Math.floor(size.width * 0.35))),
        Math.min(216, Math.max(108, Math.floor(size.height * 0.35)))
      )
    }
  }, [size])

  useFrame((state, delta) => {
    if (composerRef.current) {
      composerRef.current.render(delta)
    }
  }, 1)

  return null
}

// Interactive Destination Wrapper with Raycast Hit Sphere, Hover Effect, Holographic Reticle, and Approach Glow
const ClickableDestinationTarget = memo(function ClickableDestinationTarget({
  destination,
  isSelected = false,
  isHovered = false,
  isArrived = false,
  onHover,
  onSelect,
  onRegisterRef,
  hitRadius = 6,
  shipRef = null,
  children
}) {
  const groupRef = useRef()
  const reticleRef = useRef()
  const destPos = useRef(new THREE.Vector3(...(destination.position || destination.coordinates)))
  const proxRadius = destination?.interactionRadius || destination?.proximityRadius || 18

  useEffect(() => {
    if (groupRef.current && onRegisterRef) {
      onRegisterRef(destination.id, groupRef.current)
    }
  }, [destination.id, onRegisterRef])

  useFrame((state, delta) => {
    if (reticleRef.current) {
      let approachRatio = 0
      if (isSelected && shipRef?.current) {
        const dist = shipRef.current.position.distanceTo(destPos.current)
        approachRatio = THREE.MathUtils.clamp(1 - (dist - proxRadius) / 50, 0, 1)
      }
      reticleRef.current.rotation.z += delta * (0.2 + approachRatio * 0.25)
    }
  })

  const handleClick = (e) => {
    e.stopPropagation()
    onSelect(destination.id)
  }

  const handlePointerOver = (e) => {
    e.stopPropagation()
    onHover(destination.id)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = (e) => {
    e.stopPropagation()
    onHover((curr) => (curr === destination.id ? null : curr))
    document.body.style.cursor = 'auto'
  }

  const targetColor = isArrived ? '#10b981' : (destination.color || '#00f0ff')

  return (
    <group
      ref={groupRef}
      position={destination.coordinates}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Invisible Raycast Hit Proxy Sphere with visible=true to ensure Three.js Raycaster always intercepts */}
      <mesh
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[hitRadius, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Subtle Visual Hover Ring Highlight */}
      {isHovered && !isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[hitRadius * 0.94, hitRadius * 1.02, 48]} />
          <meshBasicMaterial
            color={destination.color || '#00f0ff'}
            transparent
            opacity={0.65}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Selected Holographic Targeting Reticle */}
      {isSelected && (
        <group rotation={[-Math.PI / 2, 0, 0]}>
          {/* Inner Guidance Orbit Ring */}
          <mesh>
            <ringGeometry args={[hitRadius * 1.04, hitRadius * 1.09, 64]} />
            <meshBasicMaterial
              color={targetColor}
              transparent
              opacity={isArrived ? 0.95 : 0.65}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          {/* Outer Rotating Reticle Brackets */}
          <group ref={reticleRef}>
            <mesh>
              <ringGeometry args={[hitRadius * 1.15, hitRadius * 1.17, 32]} />
              <meshBasicMaterial
                color={targetColor}
                transparent
                opacity={isArrived ? 0.75 : 0.45}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
            {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
              <mesh
                key={idx}
                position={[Math.cos(angle) * hitRadius * 1.16, Math.sin(angle) * hitRadius * 1.16, 0]}
                rotation={[0, 0, angle]}
              >
                <planeGeometry args={[hitRadius * 0.16, 0.08]} />
                <meshBasicMaterial
                  color={targetColor}
                  transparent
                  opacity={isArrived ? 0.9 : 0.75}
                  side={THREE.DoubleSide}
                  depthWrite={false}
                />
              </mesh>
            ))}
          </group>
        </group>
      )}

      {/* Render Celestial Body at Local Center (0, 0, 0) */}
      {children}
    </group>
  )
})

// Inner Scene Coordinator
function SceneContents({
  isInspecting,
  inspectDestination,
  warpTarget,
  controls,
  proximity,
  onSelectDestination,
  lockedDestination = null,
  lockedDistance = null
}) {
  const shipRef = useRef()
  const destObjectsRef = useRef({})
  const [hoveredDestId, setHoveredDestId] = useState(null)

  const registerDestRef = useCallback((id, obj) => {
    destObjectsRef.current[id] = obj
  }, [])

  const isArrivedAtLocked =
    lockedDestination &&
    proximity.proximityDestination?.id === lockedDestination.id

  useEffect(() => {
    if (warpTarget && shipRef.current) {
      const dest = DESTINATIONS.find((d) => d.id === warpTarget.id)
      if (dest) {
        const offset = new THREE.Vector3(0, 1.5, dest.proximityRadius * 0.75)
        const targetPos = new THREE.Vector3(...dest.coordinates).add(offset)
        shipRef.current.position.copy(targetPos)
        shipRef.current.lookAt(dest.coordinates[0], dest.coordinates[1], dest.coordinates[2])
      }
    }
  }, [warpTarget])

  const shipWorldVec = useRef(new THREE.Vector3())
  const destWorldVec = useRef(new THREE.Vector3())

  useFrame((state, delta) => {
    if (!isInspecting && shipRef.current) {
      let targetWorldPos = null
      if (lockedDestination) {
        const destObj = destObjectsRef.current[lockedDestination.id]
        if (destObj) {
          destObj.getWorldPosition(destWorldVec.current)
          targetWorldPos = destWorldVec.current
        }
      }
      controls.updateFlightKinematics(delta, shipRef.current, lockedDestination, targetWorldPos)
    }
    if (shipRef.current) {
      shipRef.current.getWorldPosition(shipWorldVec.current)
      proximity.checkProximity(shipWorldVec.current)
    }
  })

  const handleDestClick = useCallback((destId) => {
    if (onSelectDestination) onSelectDestination(destId)
  }, [onSelectDestination])

  return (
    <>
      {/* Refined Cinematic Atmosphere & Fog - 0.0032 preserves distant planet silhouettes */}
      <fogExp2 attach="fog" args={['#02040a', 0.0032]} />

      {/* Balanced Cinematic Lighting */}
      <ambientLight intensity={0.48} color="#dbeafe" />
      <directionalLight position={[70, 45, 55]} intensity={2.8} color="#ffffff" />
      <directionalLight position={[-60, -35, -45]} intensity={0.95} color="#00f0ff" />
      <directionalLight position={[0, 65, 0]} intensity={0.4} color="#818cf8" />

      {/* Multi-tier Layered Procedural Starfield & Deep Haze */}
      <StarField radius={180} />

      {/* Destination 01: Home / Launch Pad */}
      <ClickableDestinationTarget
        destination={DESTINATIONS[0]}
        isSelected={lockedDestination?.id === 'home'}
        isHovered={hoveredDestId === 'home'}
        isArrived={isArrivedAtLocked && lockedDestination?.id === 'home'}
        onHover={setHoveredDestId}
        onSelect={handleDestClick}
        onRegisterRef={registerDestRef}
        hitRadius={5.5}
        shipRef={shipRef}
      >
        <StartingDockModel />
      </ClickableDestinationTarget>

      {/* Destination 02: About Me (Blue Earth-like Planet) */}
      <ClickableDestinationTarget
        destination={DESTINATIONS[1]}
        isSelected={lockedDestination?.id === 'about'}
        isHovered={hoveredDestId === 'about'}
        isArrived={isArrivedAtLocked && lockedDestination?.id === 'about'}
        onHover={setHoveredDestId}
        onSelect={handleDestClick}
        onRegisterRef={registerDestRef}
        hitRadius={8.0}
        shipRef={shipRef}
      >
        <Planet
          position={[0, 0, 0]}
          radius={5.2}
          segments={32}
          color="#083344"
          surfaceColor="#06b6d4"
          atmosphereColor="#38bdf8"
          atmosphereOpacity={0.38}
          rotationSpeed={0.04}
          axialTilt={[-0.2, 0.3, 0.1]}
        />
      </ClickableDestinationTarget>

      {/* Destination 03: Projects (Purple Planet with Orbiting Moonlets) */}
      <ClickableDestinationTarget
        destination={DESTINATIONS[2]}
        isSelected={lockedDestination?.id === 'projects'}
        isHovered={hoveredDestId === 'projects'}
        isArrived={isArrivedAtLocked && lockedDestination?.id === 'projects'}
        onHover={setHoveredDestId}
        onSelect={handleDestClick}
        onRegisterRef={registerDestRef}
        hitRadius={16.0}
        shipRef={shipRef}
      >
        <Planet
          position={[0, 0, 0]}
          radius={7.2}
          segments={32}
          color="#3b0764"
          surfaceColor="#a855f7"
          atmosphereColor="#c084fc"
          atmosphereOpacity={0.35}
          hasRings={true}
          ringRadius={[9.2, 15.2]}
          ringColor="#d8b4fe"
          ringOpacity={0.55}
          rotationSpeed={0.03}
          axialTilt={[0.35, 0.1, -0.2]}
        >
          <OrbitingMoonlets count={3} orbitRadius={11.5} />
        </Planet>
      </ClickableDestinationTarget>

      {/* Destination 04: Skills (Orbital Space Station) */}
      <ClickableDestinationTarget
        destination={DESTINATIONS[3]}
        isSelected={lockedDestination?.id === 'skills'}
        isHovered={hoveredDestId === 'skills'}
        isArrived={isArrivedAtLocked && lockedDestination?.id === 'skills'}
        onHover={setHoveredDestId}
        onSelect={handleDestClick}
        onRegisterRef={registerDestRef}
        hitRadius={6.0}
        shipRef={shipRef}
      >
        <SpaceStation position={[0, 0, 0]} rotation={[0.2, 0.4, 0]} scale={0.98} rotationSpeed={0.25} />
      </ClickableDestinationTarget>

      {/* Destination 05: Experience (Moon-like Planet) */}
      <ClickableDestinationTarget
        destination={DESTINATIONS[4]}
        isSelected={lockedDestination?.id === 'experience'}
        isHovered={hoveredDestId === 'experience'}
        isArrived={isArrivedAtLocked && lockedDestination?.id === 'experience'}
        onHover={setHoveredDestId}
        onSelect={handleDestClick}
        onRegisterRef={registerDestRef}
        hitRadius={5.2}
        shipRef={shipRef}
      >
        <Planet
          position={[0, 0, 0]}
          radius={3.0}
          segments={24}
          color="#334155"
          surfaceColor="#64748b"
          atmosphereColor="#94a3b8"
          atmosphereOpacity={0.24}
          rotationSpeed={0.02}
          axialTilt={[0.4, 0.1, -0.1]}
        />
      </ClickableDestinationTarget>

      {/* Destination 06: Education (Bronze Exoplanet) */}
      <ClickableDestinationTarget
        destination={DESTINATIONS[5]}
        isSelected={lockedDestination?.id === 'education'}
        isHovered={hoveredDestId === 'education'}
        isArrived={isArrivedAtLocked && lockedDestination?.id === 'education'}
        onHover={setHoveredDestId}
        onSelect={handleDestClick}
        onRegisterRef={registerDestRef}
        hitRadius={6.0}
        shipRef={shipRef}
      >
        <Planet
          position={[0, 0, 0]}
          radius={3.8}
          segments={26}
          color="#451a03"
          surfaceColor="#b45309"
          atmosphereColor="#f59e0b"
          atmosphereOpacity={0.3}
          rotationSpeed={0.045}
          axialTilt={[0.15, -0.2, 0.3]}
        />
      </ClickableDestinationTarget>

      {/* Destination 07: Contact (Communication Satellite) */}
      <ClickableDestinationTarget
        destination={DESTINATIONS[6]}
        isSelected={lockedDestination?.id === 'contact'}
        isHovered={hoveredDestId === 'contact'}
        isArrived={isArrivedAtLocked && lockedDestination?.id === 'contact'}
        onHover={setHoveredDestId}
        onSelect={handleDestClick}
        onRegisterRef={registerDestRef}
        hitRadius={4.5}
        shipRef={shipRef}
      >
        <SatelliteModel position={[0, 0, 0]} scale={0.95} />
      </ClickableDestinationTarget>

      {/* In-World 3D Navigation Marker Beacon toward Locked Destination */}
      {lockedDestination && (
        <NavigationMarker destination={lockedDestination} distance={lockedDistance} />
      )}

      {/* Controllable Spaceship with dynamic banking and tilt */}
      <group ref={shipRef} position={[0, 0, 0]}>
        <Spaceship
          thrustRef={controls.thrustRef}
          bankRef={controls.rollAngle}
          pitchRef={controls.pitchAngle}
          speedRef={controls.speed}
        />
      </group>

      {/* Warp Speed Streaks */}
      <WarpStreaksField targetRef={shipRef} speedRef={controls.speed} thrustRef={controls.thrustRef} />

      {/* Third-Person Cinematic Follow Camera */}
      <FollowCamera
        targetRef={shipRef}
        speedRef={controls.speed}
        thrustRef={controls.thrustRef}
        isInspecting={isInspecting}
        inspectDestination={inspectDestination}
      />

      {/* Subtle Cinematic Bloom Post-Processing Pass */}
      <PostProcessingEffect />
    </>
  )
}

/**
 * SpaceScene
 * Primary Three.js canvas container and 3D space environment.
 */
const SpaceScene = memo(function SpaceScene({
  isInspecting = false,
  inspectDestination = null,
  warpTarget = null,
  controls,
  proximity,
  onSelectDestination = null,
  lockedDestination = null,
  lockedDistance = null
}) {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 2.6, 7.6], fov: 48 }}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance', stencil: false, depth: true }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#02040a']} />
        <Suspense fallback={null}>
          <SceneContents
            isInspecting={isInspecting}
            inspectDestination={inspectDestination}
            warpTarget={warpTarget}
            controls={controls}
            proximity={proximity}
            onSelectDestination={onSelectDestination}
            lockedDestination={lockedDestination}
            lockedDistance={lockedDistance}
          />
        </Suspense>
      </Canvas>
    </div>
  )
})

export default SpaceScene
