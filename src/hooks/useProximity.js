import { useState, useRef, useCallback, useMemo } from 'react'
import * as THREE from 'three'
import { DESTINATIONS } from '../data/destinations'
import { soundManager } from '../utils/audio'

// Pre-allocate target coordinates once outside hook for zero GC
const PRECOMPUTED_TARGETS = DESTINATIONS.map((d) => ({
  ...d,
  radius: d.interactionRadius || d.proximityRadius || 15,
  pos: new THREE.Vector3(...(d.position || d.coordinates))
}))

/**
 * useProximity
 * Custom hook tracking distance to celestial bodies, destination discoveries,
 * arrival animations, and nearest target navigation lock.
 */
export function useProximity({ onDiscovery = null } = {}) {
  const [proximityDestination, setProximityDestination] = useState(null)
  const [discoveredDestinations, setDiscoveredDestinations] = useState(new Set(['home']))
  const [discoveryBanner, setDiscoveryBanner] = useState(null)

  // Throttling references
  const lastProximityDestId = useRef(null)

  /**
   * checkProximity
   * Called per frame from the 3D animation loop
   */
  const checkProximity = useCallback((shipPosition) => {
    if (!shipPosition) return

    let closestDest = null
    let closestDist = Infinity

    for (let i = 0; i < PRECOMPUTED_TARGETS.length; i++) {
      const dest = PRECOMPUTED_TARGETS[i]
      if (dest.id === 'home') continue
      const dist = shipPosition.distanceTo(dest.pos)
      if (dist < dest.radius && dist < closestDist) {
        closestDist = dist
        closestDest = dest
      }
    }

    const isTargetChanged = closestDest?.id !== lastProximityDestId.current

    if (isTargetChanged) {
      const wasInRange = !!lastProximityDestId.current

      lastProximityDestId.current = closestDest?.id || null

      setProximityDestination(closestDest)

      // Discovery & arrival tracking (triggers on arrival whenever entering range)
      if (closestDest && (!wasInRange || isTargetChanged)) {
        const isNewDiscovery = !discoveredDestinations.has(closestDest.id)
        let currentDiscovered = discoveredDestinations

        if (isNewDiscovery) {
          const nextSet = new Set(discoveredDestinations)
          nextSet.add(closestDest.id)
          setDiscoveredDestinations(nextSet)
          currentDiscovered = nextSet
        }

        soundManager.playDiscovery()

        const newCount = Math.min(DESTINATIONS.length, currentDiscovered.size)
        setDiscoveryBanner({
          title: 'DESTINATION REACHED',
          name: (closestDest.label || closestDest.shortName || closestDest.name).toUpperCase(),
          count: newCount,
          total: DESTINATIONS.length,
          isNew: isNewDiscovery
        })

        setTimeout(() => setDiscoveryBanner(null), 3800)

        if (isNewDiscovery && onDiscovery) onDiscovery(closestDest)
      }
    }
  }, [discoveredDestinations, onDiscovery])

  /**
   * getNearestTarget
   * Computes closest body for HUD Nav Lock
   */
  const getNearestTarget = useCallback((coords) => {
    if (!coords) return null
    let closest = null
    let minD = Infinity
    for (const d of DESTINATIONS) {
      if (d.id === 'home') continue
      const pos = d.position || d.coordinates
      const dx = pos[0] - coords.x
      const dy = pos[1] - coords.y
      const dz = pos[2] - coords.z
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
      if (dist < minD) {
        minD = dist
        closest = {
          ...d,
          dist: Math.round(dist),
          isArrived: dist <= (d.interactionRadius || d.proximityRadius || 15)
        }
      }
    }
    return closest
  }, [])

  /**
   * getDistanceToDestination
   * Computes distance from spaceship coordinates to a specific destination
   */
  const getDistanceToDestination = useCallback((coords, dest) => {
    if (!coords || !dest) return null
    const pos = dest.position || dest.coordinates
    if (!pos) return null
    const dx = pos[0] - coords.x
    const dy = pos[1] - coords.y
    const dz = pos[2] - coords.z
    return Math.round(Math.sqrt(dx * dx + dy * dy + dz * dz))
  }, [])

  return useMemo(() => ({
    proximityDestination,
    discoveredDestinations,
    discoveryBanner,
    checkProximity,
    getNearestTarget,
    getDistanceToDestination
  }), [
    proximityDestination,
    discoveredDestinations,
    discoveryBanner,
    checkProximity,
    getNearestTarget,
    getDistanceToDestination
  ])
}
