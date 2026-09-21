import { useMemo, useRef, useEffect, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * StarField
 * Multi-layered procedural starfield with 3 depth tiers:
 * 1. Deep Background Stars: Far-field micro-stars establishing cosmic depth
 * 2. Mid-Field Navigation Stars: Crisp multi-spectral stars (white, cyan, blue, amber)
 * 3. Foreground Stellar Dust: Near-field motes offering parallax motion
 * 4. Deep-Space Nebula Volumes: Restrained, soft cosmic ambient haze
 */
function StarFieldComponent({ radius = 180 }) {
  const deepStarsRef = useRef()
  const midStarsRef = useRef()
  const dustRef = useRef()
  const nebulaGroupRef = useRef()

  // Circular star texture with smooth Gaussian radial falloff
  const starTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.25, 'rgba(255, 255, 255, 0.85)')
    gradient.addColorStop(0.65, 'rgba(255, 255, 255, 0.25)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 32, 32)

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [])

  useEffect(() => {
    return () => {
      if (starTexture) starTexture.dispose()
    }
  }, [starTexture])

  // Tier 1: Deep Background Stars (Far-field cosmic backdrop, radius 320-460)
  const [deepPositions, deepColors] = useMemo(() => {
    const count = 1800
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const deepPalette = [
      new THREE.Color('#94a3b8'), // Soft muted white
      new THREE.Color('#bae6fd'), // Distant faint ice blue
      new THREE.Color('#c4b5fd'), // Distant pale violet
      new THREE.Color('#67e8f9'), // Pale cyan
    ]

    for (let i = 0; i < count; i++) {
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const r = 320 + Math.random() * 140

      const sinPhi = Math.sin(phi)
      pos[i * 3] = r * sinPhi * Math.cos(theta)
      pos[i * 3 + 1] = r * sinPhi * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)

      const chosen = deepPalette[Math.floor(Math.random() * deepPalette.length)]
      col[i * 3] = chosen.r * 0.75
      col[i * 3 + 1] = chosen.g * 0.75
      col[i * 3 + 2] = chosen.b * 0.75
    }
    return [pos, col]
  }, [])

  // Tier 2: Mid-Field Navigation Stars (Core exploration sphere, radius 120-260)
  const [midPositions, midColors] = useMemo(() => {
    const count = 2200
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const midPalette = [
      new THREE.Color('#ffffff'), // Crisp diamond white
      new THREE.Color('#a5f3fc'), // Vivid pale cyan
      new THREE.Color('#93c5fd'), // Bright ice blue
      new THREE.Color('#fef08a'), // Warm star yellow
      new THREE.Color('#fed7aa'), // Soft stellar amber
    ]

    for (let i = 0; i < count; i++) {
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const r = 110 + Math.random() * (radius - 30)

      const sinPhi = Math.sin(phi)
      pos[i * 3] = r * sinPhi * Math.cos(theta)
      pos[i * 3 + 1] = r * sinPhi * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)

      const chosen = midPalette[Math.floor(Math.random() * midPalette.length)]
      col[i * 3] = chosen.r
      col[i * 3 + 1] = chosen.g
      col[i * 3 + 2] = chosen.b
    }
    return [pos, col]
  }, [radius])

  // Tier 3: Foreground Stellar Dust Motes (Local parallax layer, radius 25-95)
  const [dustPositions, dustColors] = useMemo(() => {
    const count = 350
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const dustColor = new THREE.Color('#38bdf8')

    for (let i = 0; i < count; i++) {
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const r = 25 + Math.random() * 70

      const sinPhi = Math.sin(phi)
      pos[i * 3] = r * sinPhi * Math.cos(theta)
      pos[i * 3 + 1] = r * sinPhi * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)

      col[i * 3] = dustColor.r
      col[i * 3 + 1] = dustColor.g
      col[i * 3 + 2] = dustColor.b
    }
    return [pos, col]
  }, [])

  // Parallax rotation rates per tier
  useFrame((state, delta) => {
    if (deepStarsRef.current) {
      deepStarsRef.current.rotation.y += delta * 0.0015
      deepStarsRef.current.rotation.x += delta * 0.0008
    }
    if (midStarsRef.current) {
      midStarsRef.current.rotation.y += delta * 0.005
      midStarsRef.current.rotation.x += delta * 0.0025
    }
    if (dustRef.current) {
      dustRef.current.rotation.y += delta * 0.012
      dustRef.current.rotation.z += delta * 0.006
    }
    if (nebulaGroupRef.current) {
      nebulaGroupRef.current.rotation.y += delta * 0.001
    }
  })

  return (
    <group>
      {/* Tier 1: Deep Background Stars */}
      <points ref={deepStarsRef} raycast={() => null}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[deepPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[deepColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.95}
          vertexColors
          map={starTexture}
          transparent
          alphaTest={0.01}
          opacity={0.65}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Tier 2: Mid-Field Navigation Stars */}
      <points ref={midStarsRef} raycast={() => null}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[midPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[midColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={1.45}
          vertexColors
          map={starTexture}
          transparent
          alphaTest={0.01}
          opacity={0.92}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Tier 3: Foreground Stellar Dust Motes */}
      <points ref={dustRef} raycast={() => null}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[dustColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.85}
          vertexColors
          map={starTexture}
          transparent
          alphaTest={0.01}
          opacity={0.38}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Subtle Deep Space Ambient Nebula Haze Volumes */}
      <group ref={nebulaGroupRef}>
        {/* Deep Cyan Cosmic Cloud Horizon */}
        <mesh position={[70, 40, -180]} rotation={[0.4, -0.2, 0.5]}>
          <planeGeometry args={[260, 180]} />
          <meshBasicMaterial
            color="#0369a1"
            transparent
            opacity={0.045}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Deep Indigo/Purple Stellar Cloud Horizon */}
        <mesh position={[-120, -60, -160]} rotation={[-0.3, 0.6, -0.2]}>
          <planeGeometry args={[280, 200]} />
          <meshBasicMaterial
            color="#4338ca"
            transparent
            opacity={0.04}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Deep Amber Galactic Core Rim */}
        <mesh position={[140, -50, 150]} rotation={[0.8, 0.3, -0.4]}>
          <planeGeometry args={[220, 160]} />
          <meshBasicMaterial
            color="#92400e"
            transparent
            opacity={0.035}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </group>
  )
}

const StarField = memo(StarFieldComponent)
export default StarField
