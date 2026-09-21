import { useMemo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function StarField({ count = null, radius = 160 }) {
  const pointsRef = useRef()

  // Adapt star count dynamically based on mobile GPU capacity (2,200 on mobile, 3,600 on desktop)
  const effectiveCount = useMemo(() => {
    if (count !== null) return count
    if (typeof window !== 'undefined' && (window.innerWidth <= 860 || 'ontouchstart' in window)) {
      return 2200
    }
    return 3600
  }, [count])

  // Generate procedural star positions, colors, and sizes
  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(effectiveCount * 3)
    const col = new Float32Array(effectiveCount * 3)
    const sz = new Float32Array(effectiveCount)

    const colorPalette = [
      new THREE.Color('#ffffff'), // Crisp white
      new THREE.Color('#a5f3fc'), // Pale cyan
      new THREE.Color('#93c5fd'), // Soft ice blue
      new THREE.Color('#fef08a'), // Warm star yellow
      new THREE.Color('#fdba74'), // Deep amber
    ]

    for (let i = 0; i < effectiveCount; i++) {
      // Distribute stars on and within a large spherical boundary
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const r = Math.cbrt(Math.random()) * radius + 25 // Avoid clustering too tight to center

      const sinPhi = Math.sin(phi)
      pos[i * 3] = r * sinPhi * Math.cos(theta)
      pos[i * 3 + 1] = r * sinPhi * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)

      // Random color from palette
      const chosenColor = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      col[i * 3] = chosenColor.r
      col[i * 3 + 1] = chosenColor.g
      col[i * 3 + 2] = chosenColor.b

      // Varied star size (majority small, occasional bright focal stars)
      sz[i] = Math.random() > 0.95 ? Math.random() * 2.2 + 1.2 : Math.random() * 1.0 + 0.4
    }

    return [pos, col, sz]
  }, [effectiveCount, radius])

  // Subtle continuous galactic rotation
  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.008
      pointsRef.current.rotation.x += delta * 0.004
    }
  })

  // Circular star texture with clean disposal
  const starTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)')
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.2)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 32, 32)

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [])

  useEffect(() => {
    return () => {
      if (starTexture) {
        starTexture.dispose()
      }
    }
  }, [starTexture])

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.4}
        vertexColors
        map={starTexture}
        transparent
        alphaTest={0.01}
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
