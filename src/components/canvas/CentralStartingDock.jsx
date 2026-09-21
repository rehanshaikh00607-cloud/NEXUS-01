import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function CentralStartingDock() {
  const outerRingRef = useRef()
  const innerRingRef = useRef()
  const pylonLightsRef = useRef([])

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.08
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z -= delta * 0.12
    }
  })

  return (
    <group position={[0, -0.6, 0]}>
      {/* Outer Docking Guidance Ring */}
      <mesh ref={outerRingRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.2, 4.28, 64]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner Alignment Ring */}
      <mesh ref={innerRingRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.2, 3.25, 48]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 4 Orbital Docking Pylons with Runway Guidance Strobes */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => {
        const x = Math.cos(angle) * 4.25
        const z = Math.sin(angle) * 4.25
        return (
          <group key={idx} position={[x, 0, z]}>
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.06, 0.08, 0.6, 8]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} />
            </mesh>
            <mesh position={[0, 0.65, 0]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshBasicMaterial color="#00f0ff" />
            </mesh>
            <pointLight position={[0, 0.7, 0]} color="#00f0ff" distance={3} intensity={0.6} />
          </group>
        )
      })}
    </group>
  )
}
