import { Suspense } from 'react'
import StarField from './StarField'
import Planet from './Planet'
import SpaceStation from './SpaceStation'
import Satellite from './Satellite'
import CentralStartingDock from './CentralStartingDock'
import SpaceshipController from './SpaceshipController'

export default function SpaceScene({
  isIntroActive = false,
  isInspecting = false,
  inspectDestination = null,
  warpTarget = null,
  touchInputRef = null,
  onSelectDestination = null,
  onProximityChange,
  onTelemetryUpdate
}) {
  const handleDestClick = (destId) => (e) => {
    e.stopPropagation()
    if (onSelectDestination) {
      onSelectDestination(destId)
    }
  }

  return (
    <Suspense fallback={null}>
      {/* Cosmic Fog */}
      <fogExp2 attach="fog" args={['#02040a', 0.008]} />

      {/* Lighting */}
      <ambientLight intensity={0.35} color="#dbeafe" />
      <directionalLight position={[60, 35, 45]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[-50, -25, -30]} intensity={0.65} color="#00f0ff" />

      {/* Procedural Starfield (Automatically adapts count to 2,200 on mobile, 3,600 on desktop) */}
      <StarField radius={180} />

      {/* ====================================================================
          DESTINATION 01: HOME / LAUNCH PAD [0, 0, 0]
          ==================================================================== */}
      <group onClick={handleDestClick('home')}>
        <CentralStartingDock />
      </group>

      {/* ====================================================================
          DESTINATION 02: ABOUT ME // EARTH-LIKE ICE WORLD [-44, 18, -50]
          ==================================================================== */}
      <group onClick={handleDestClick('about')}>
        <Planet
          position={[-44, 18, -50]}
          radius={5.0}
          segments={28}
          color="#083344"
          surfaceColor="#06b6d4"
          atmosphereColor="#38bdf8"
          atmosphereOpacity={0.35}
          hasRings={false}
          rotationSpeed={0.04}
          axialTilt={[-0.2, 0.3, 0.1]}
        />
      </group>

      {/* ====================================================================
          DESTINATION 03: PROJECTS // PURPLE RINGED GAS GIANT [38, -10, -65]
          ==================================================================== */}
      <group onClick={handleDestClick('projects')}>
        <Planet
          position={[38, -10, -65]}
          radius={7.0}
          segments={30}
          color="#3b0764"
          surfaceColor="#a855f7"
          atmosphereColor="#c084fc"
          atmosphereOpacity={0.3}
          hasRings={true}
          ringRadius={[9.0, 15.0]}
          ringColor="#d8b4fe"
          ringOpacity={0.5}
          rotationSpeed={0.03}
          axialTilt={[0.35, 0.1, -0.2]}
        />
      </group>

      {/* ====================================================================
          DESTINATION 04: SKILLS // SPACE STATION ALPHA [-18, 7, -24]
          ==================================================================== */}
      <group onClick={handleDestClick('skills')}>
        <SpaceStation
          position={[-18, 7, -24]}
          rotation={[0.2, 0.4, 0]}
          scale={0.95}
          rotationSpeed={0.25}
        />
      </group>

      {/* ====================================================================
          DESTINATION 05: EXPERIENCE // SHADOW MOON [-22, -22, -60]
          ==================================================================== */}
      <group onClick={handleDestClick('experience')}>
        <Planet
          position={[-22, -22, -60]}
          radius={2.8}
          segments={20}
          color="#1e1b4b"
          surfaceColor="#4338ca"
          atmosphereColor="#6366f1"
          atmosphereOpacity={0.22}
          hasRings={false}
          rotationSpeed={0.02}
          axialTilt={[0.4, 0.1, -0.1]}
        />
      </group>

      {/* ====================================================================
          DESTINATION 06: EDUCATION // BRONZE EXOPLANET [24, 20, -38]
          ==================================================================== */}
      <group onClick={handleDestClick('education')}>
        <Planet
          position={[24, 20, -38]}
          radius={3.6}
          segments={22}
          color="#451a03"
          surfaceColor="#b45309"
          atmosphereColor="#f59e0b"
          atmosphereOpacity={0.28}
          hasRings={false}
          rotationSpeed={0.045}
          axialTilt={[0.15, -0.2, 0.3]}
        />
      </group>

      {/* ====================================================================
          DESTINATION 07: CONTACT // COMMS SATELLITE [14, 5, -16]
          ==================================================================== */}
      <group onClick={handleDestClick('contact')}>
        <Satellite
          position={[14, 5, -16]}
          scale={0.9}
          orbitSpeed={0.2}
        />
      </group>

      {/* Extra background satellite orbiting the gas giant for extra depth */}
      <Satellite
        position={[32, -8, -58]}
        orbitCenter={[38, -10, -65]}
        orbitRadius={18}
        orbitSpeed={0.15}
        scale={0.8}
      />

      {/* ====================================================================
          CONTROLLABLE SPACESHIP & CAMERA
          ==================================================================== */}
      <SpaceshipController
        isIntroActive={isIntroActive}
        isInspecting={isInspecting}
        inspectDestination={inspectDestination}
        warpTarget={warpTarget}
        touchInputRef={touchInputRef}
        onProximityChange={onProximityChange}
        onTelemetryUpdate={onTelemetryUpdate}
      />
    </Suspense>
  )
}
