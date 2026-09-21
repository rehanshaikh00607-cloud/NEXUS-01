import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import SpaceScene from './SpaceScene'

export default function SpaceCanvas({
  isIntroActive = false,
  isInspecting = false,
  inspectDestination = null,
  warpTarget = null,
  touchInputRef = null,
  onSelectDestination = null,
  onProximityChange,
  onTelemetryUpdate
}) {
  // Mobile GPU fill-rate optimization: cap DPR at 1.5 on mobile/tablets, 2.0 on desktop
  const isMobileDevice = typeof window !== 'undefined' && (window.innerWidth <= 860 || 'ontouchstart' in window)
  const maxDpr = isMobileDevice ? 1.5 : 2

  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 2.6, 7.6], fov: 48 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
        dpr={[1, maxDpr]}
      >
        <color attach="background" args={['#02040a']} />

        <Suspense fallback={null}>
          <SpaceScene
            isIntroActive={isIntroActive}
            isInspecting={isInspecting}
            inspectDestination={inspectDestination}
            warpTarget={warpTarget}
            touchInputRef={touchInputRef}
            onSelectDestination={onSelectDestination}
            onProximityChange={onProximityChange}
            onTelemetryUpdate={onTelemetryUpdate}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
