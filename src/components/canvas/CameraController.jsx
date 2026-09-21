import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const SECTION_VANTAGES = {
  bridge: {
    pos: [1.2, 0.6, 6.5],
    target: [0, 0, 0]
  },
  dossier: {
    pos: [-3.2, 1.0, 5.2],
    target: [0.3, 0.2, 0]
  },
  missions: {
    pos: [3.4, 1.5, 6.2],
    target: [-0.4, 0, 0]
  },
  subsystems: {
    pos: [-1.8, 1.2, -4.2],
    target: [0, 0, 0.6]
  },
  comms: {
    pos: [0, -0.8, 5.8],
    target: [0, 0.3, 0]
  }
}

export default function CameraController({ activeSection }) {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(...SECTION_VANTAGES.bridge.pos))
  const targetLook = useRef(new THREE.Vector3(...SECTION_VANTAGES.bridge.target))
  const currentLook = useRef(new THREE.Vector3(...SECTION_VANTAGES.bridge.target))
  const mousePos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const config = SECTION_VANTAGES[activeSection] || SECTION_VANTAGES.bridge
    targetPos.current.set(...config.pos)
    targetLook.current.set(...config.target)
  }, [activeSection])

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current.x = (e.clientX / window.innerWidth - 0.5) * 0.4
      mousePos.current.y = (e.clientY / window.innerHeight - 0.5) * 0.4
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame((state, delta) => {
    // Lerp camera position towards target with gentle mouse parallax
    const desiredX = targetPos.current.x + mousePos.current.x
    const desiredY = targetPos.current.y - mousePos.current.y
    const desiredZ = targetPos.current.z

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, desiredX, delta * 2.2)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, desiredY, delta * 2.2)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, desiredZ, delta * 2.2)

    currentLook.current.x = THREE.MathUtils.lerp(currentLook.current.x, targetLook.current.x, delta * 2.5)
    currentLook.current.y = THREE.MathUtils.lerp(currentLook.current.y, targetLook.current.y, delta * 2.5)
    currentLook.current.z = THREE.MathUtils.lerp(currentLook.current.z, targetLook.current.z, delta * 2.5)

    camera.lookAt(currentLook.current)
  })

  return null
}
