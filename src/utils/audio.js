// Lightweight Web Audio API synthesizer for tactile sci-fi UI and spacecraft audio
// Zero external audio files required, zero latency, zero copyright restrictions.

class SoundSystem {
  constructor() {
    this.ctx = null
    this.muted = true // Muted initially until user interacts (e.g. LAUNCH MISSION click)

    // Bus Gains
    this.masterGainNode = null
    this.sfxGainNode = null
    this.engineBusGainNode = null
    this.ambienceBusGainNode = null

    // Bus Volume Levels (calibrated for clear desktop/laptop speaker audibility)
    this.masterVolume = 0.85
    this.sfxVolume = 0.85
    this.engineVolume = 0.70
    this.ambienceVolume = 0.35

    // Ambient Space Drone Nodes
    this.ambientGain = null
    this.ambientOsc = null
    this.ambientFilter = null

    // Continuous Spaceship Engine Nodes
    this.engineOsc1 = null // Audible mid-range turbine (triangle)
    this.engineOsc2 = null // Deep sub-bass foundation (sine)
    this.noiseSource = null // Thruster hiss buffer source
    this.noiseFilter = null // Thruster bandpass filter
    this.noiseGain = null // Thruster hiss gain
    this.engineFilter = null // Master engine lowpass filter
    this.engineGain = null // Master engine gain
    this.engineRunning = false
    this.currentBoostState = false

    // Auto-resume on first user interaction fallback with clean listener removal
    if (typeof window !== 'undefined') {
      const removeInteractionListeners = () => {
        window.removeEventListener('pointerdown', resumeOnInteraction)
        window.removeEventListener('keydown', resumeOnInteraction)
        this._cleanupInteractionListeners = null
      }
      const resumeOnInteraction = () => {
        if (this.ctx) {
          if (this.ctx.state === 'suspended') {
            this.ctx.resume().then(() => {
              if (this.ctx && this.ctx.state === 'running') {
                removeInteractionListeners()
              }
            }).catch(() => {})
          } else if (this.ctx.state === 'running') {
            removeInteractionListeners()
          }
        }
      }
      this._cleanupInteractionListeners = removeInteractionListeners
      window.addEventListener('pointerdown', resumeOnInteraction, { passive: true })
      window.addEventListener('keydown', resumeOnInteraction, { passive: true })

      // Global audio state inspection
      window.__NEXUS_AUDIO_DEBUG__ = () => this.getDebugState()
    }
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      if (AudioContextClass) {
        try {
          this.ctx = new AudioContextClass()

          // Master Bus -> AudioContext Destination
          this.masterGainNode = this.ctx.createGain()
          this.masterGainNode.gain.setValueAtTime(
            this.muted ? 0 : this.masterVolume,
            this.ctx.currentTime
          )
          this.masterGainNode.connect(this.ctx.destination)

          // SFX Bus -> Master Bus
          this.sfxGainNode = this.ctx.createGain()
          this.sfxGainNode.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime)
          this.sfxGainNode.connect(this.masterGainNode)

          // Engine Bus -> Master Bus
          this.engineBusGainNode = this.ctx.createGain()
          this.engineBusGainNode.gain.setValueAtTime(this.engineVolume, this.ctx.currentTime)
          this.engineBusGainNode.connect(this.masterGainNode)

          // Ambience Bus -> Master Bus
          this.ambienceBusGainNode = this.ctx.createGain()
          this.ambienceBusGainNode.gain.setValueAtTime(this.ambienceVolume, this.ctx.currentTime)
          this.ambienceBusGainNode.connect(this.masterGainNode)
        } catch (e) {
          // Graceful fallback: audio fails safely without breaking app
        }
      }
    }
  }

  resumeContext() {
    this.init()
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        if (this._cleanupInteractionListeners && this.ctx && this.ctx.state === 'running') {
          this._cleanupInteractionListeners()
        }
      }).catch(() => {})
    } else if (this.ctx && this.ctx.state === 'running' && this._cleanupInteractionListeners) {
      this._cleanupInteractionListeners()
    }
  }

  setMasterVolume(val) {
    this.masterVolume = Math.max(0, Math.min(1, val))
    if (this.masterGainNode && this.ctx && !this.muted) {
      this.masterGainNode.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.05)
    }
  }

  setSFXVolume(val) {
    this.sfxVolume = Math.max(0, Math.min(1, val))
    if (this.sfxGainNode && this.ctx) {
      this.sfxGainNode.gain.setTargetAtTime(this.sfxVolume, this.ctx.currentTime, 0.05)
    }
  }

  setEngineVolume(val) {
    this.engineVolume = Math.max(0, Math.min(1, val))
    if (this.engineBusGainNode && this.ctx) {
      this.engineBusGainNode.gain.setTargetAtTime(this.engineVolume, this.ctx.currentTime, 0.05)
    }
  }

  unmute() {
    this.init()
    this.resumeContext()
    this.muted = false
    if (this.masterGainNode && this.ctx) {
      this.masterGainNode.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.05)
    }
    this.startAmbientDrone()
    this.startEngine()
  }

  toggleMute() {
    this.muted = !this.muted
    this.init()
    this.resumeContext()

    if (!this.muted) {
      if (this.masterGainNode && this.ctx) {
        this.masterGainNode.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.05)
      }
      this.playBeep(880, 0.08, 'sine', 0.18)
      this.startAmbientDrone()
      this.startEngine()
    } else {
      if (this.masterGainNode && this.ctx) {
        this.masterGainNode.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05)
      }
      this.stopAmbientDrone()
      this.stopEngine()
    }
    return this.muted
  }

  isMuted() {
    return this.muted
  }

  // Generate a procedural looping white noise buffer for realistic thruster hiss
  createNoiseBuffer() {
    if (!this.ctx) return null
    const bufferSize = this.ctx.sampleRate * 2 // 2 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const output = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1
    }
    return buffer
  }

  // ================= 1. AMBIENT SPACE DRONE =================
  startAmbientDrone() {
    if (this.muted || this.ambientOsc) return
    this.init()
    if (!this.ctx) return

    try {
      this.ambientOsc = this.ctx.createOscillator()
      this.ambientFilter = this.ctx.createBiquadFilter()
      this.ambientGain = this.ctx.createGain()

      this.ambientOsc.type = 'sine'
      this.ambientOsc.frequency.setValueAtTime(65, this.ctx.currentTime) // Low C sub drone

      this.ambientFilter.type = 'lowpass'
      this.ambientFilter.frequency.setValueAtTime(140, this.ctx.currentTime)

      this.ambientGain.gain.setValueAtTime(0.0001, this.ctx.currentTime)
      this.ambientGain.gain.setTargetAtTime(0.06, this.ctx.currentTime, 1.2)

      this.ambientOsc.connect(this.ambientFilter)
      this.ambientFilter.connect(this.ambientGain)
      this.ambientGain.connect(this.ambienceBusGainNode || this.masterGainNode)

      this.ambientOsc.start()
    } catch (e) {}
  }

  stopAmbientDrone() {
    if (this.ambientOsc && this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.2)
        setTimeout(() => {
          if (this.ambientOsc) {
            try { this.ambientOsc.stop() } catch (e) {}
            this.ambientOsc.disconnect()
            this.ambientOsc = null
            this.ambientGain = null
            this.ambientFilter = null
          }
        }, 300)
      } catch (e) {
        this.ambientOsc = null
      }
    }
  }

  // ================= 2. CONTINUOUS SPACESHIP ENGINE =================
  // Rich, multi-layered engine synthesizer audible on any desktop or laptop speakers
  startEngine() {
    if (this.muted || this.engineRunning) return
    this.init()
    if (!this.ctx) return

    try {
      const now = this.ctx.currentTime

      // 1. Audible Mid-Range Turbine (triangle wave: rich harmonics 120 Hz - 240 Hz)
      this.engineOsc1 = this.ctx.createOscillator()
      this.engineOsc1.type = 'triangle'
      this.engineOsc1.frequency.setValueAtTime(125, now)

      // 2. Sub-Bass Foundation (sine wave: 58 Hz)
      this.engineOsc2 = this.ctx.createOscillator()
      this.engineOsc2.type = 'sine'
      this.engineOsc2.frequency.setValueAtTime(58, now)

      // 3. Procedural Thruster Plasma Stream (looping bandpass noise)
      const noiseBuffer = this.createNoiseBuffer()
      if (noiseBuffer) {
        this.noiseSource = this.ctx.createBufferSource()
        this.noiseSource.buffer = noiseBuffer
        this.noiseSource.loop = true

        this.noiseFilter = this.ctx.createBiquadFilter()
        this.noiseFilter.type = 'bandpass'
        this.noiseFilter.frequency.setValueAtTime(650, now)
        this.noiseFilter.Q.setValueAtTime(1.8, now)

        this.noiseGain = this.ctx.createGain()
        this.noiseGain.gain.setValueAtTime(0.025, now)

        this.noiseSource.connect(this.noiseFilter)
        this.noiseFilter.connect(this.noiseGain)
      }

      // 4. Main Resonant Lowpass Filter
      this.engineFilter = this.ctx.createBiquadFilter()
      this.engineFilter.type = 'lowpass'
      this.engineFilter.frequency.setValueAtTime(380, now)
      this.engineFilter.Q.setValueAtTime(1.8, now)

      // 5. Main Engine Master Gain Node
      this.engineGain = this.ctx.createGain()
      this.engineGain.gain.setValueAtTime(0.0001, now)
      this.engineGain.gain.setTargetAtTime(0.14, now, 0.3) // Clear, audible standby volume

      // Connect graph
      this.engineOsc1.connect(this.engineFilter)
      this.engineOsc2.connect(this.engineFilter)
      this.engineFilter.connect(this.engineGain)

      if (this.noiseGain) {
        this.noiseGain.connect(this.engineGain)
        this.noiseSource.start()
      }

      this.engineGain.connect(this.engineBusGainNode || this.masterGainNode)

      this.engineOsc1.start()
      this.engineOsc2.start()
      this.engineRunning = true
    } catch (e) {
      this.engineRunning = false
    }
  }

  stopEngine() {
    if (this.engineRunning && this.engineGain && this.ctx) {
      try {
        this.engineGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.15)
        setTimeout(() => {
          if (this.engineOsc1) {
            try { this.engineOsc1.stop() } catch (e) {}
            this.engineOsc1.disconnect()
            this.engineOsc1 = null
          }
          if (this.engineOsc2) {
            try { this.engineOsc2.stop() } catch (e) {}
            this.engineOsc2.disconnect()
            this.engineOsc2 = null
          }
          if (this.noiseSource) {
            try { this.noiseSource.stop() } catch (e) {}
            this.noiseSource.disconnect()
            this.noiseSource = null
            this.noiseGain = null
            this.noiseFilter = null
          }
          this.engineGain = null
          this.engineFilter = null
          this.engineRunning = false
        }, 200)
      } catch (e) {
        this.engineRunning = false
      }
    }
  }

  // Smooth real-time modulation without recreating nodes (zero GC, zero audio clicks)
  updateEngine(speed = 0, isBoosting = false, isInspecting = false) {
    if (this.muted) return
    if (!this.engineRunning) {
      this.startEngine()
      return
    }
    if (!this.ctx || !this.engineGain || !this.engineFilter || !this.engineOsc1) return

    this.currentBoostState = isBoosting
    const now = this.ctx.currentTime

    // Mode A: Inspecting Dossier (flight paused -> engine quiet standby)
    if (isInspecting) {
      this.engineGain.gain.setTargetAtTime(0.06, now, 0.15)
      this.engineFilter.frequency.setTargetAtTime(240, now, 0.15)
      this.engineOsc1.frequency.setTargetAtTime(95, now, 0.15)
      this.engineOsc2.frequency.setTargetAtTime(45, now, 0.15)
      if (this.noiseGain) this.noiseGain.gain.setTargetAtTime(0.01, now, 0.15)
      return
    }

    // Mode B: Warp Boost (SHIFT) - noticeably stronger, powerful plasma afterburner
    if (isBoosting) {
      this.engineGain.gain.setTargetAtTime(0.42, now, 0.08)
      this.engineFilter.frequency.setTargetAtTime(1450, now, 0.08)
      this.engineOsc1.frequency.setTargetAtTime(215, now, 0.08)
      this.engineOsc2.frequency.setTargetAtTime(95, now, 0.08)
      if (this.noiseGain && this.noiseFilter) {
        this.noiseGain.gain.setTargetAtTime(0.18, now, 0.08)
        this.noiseFilter.frequency.setTargetAtTime(1600, now, 0.08)
      }
      return
    }

    // Mode C: Normal Propulsion / Speed Dynamics (smooth response to spaceship speed)
    const speedRatio = Math.min(1.0, Math.max(0, speed / 24.0))

    if (speed > 0.3) {
      // Cruise flight
      const targetVol = 0.16 + speedRatio * 0.16 // 0.16 to 0.32
      const targetFilter = 420 + speedRatio * 450 // 420 Hz to 870 Hz
      const targetFreq1 = 125 + speedRatio * 65 // 125 Hz to 190 Hz
      const targetFreq2 = 58 + speedRatio * 28 // 58 Hz to 86 Hz

      this.engineGain.gain.setTargetAtTime(targetVol, now, 0.08)
      this.engineFilter.frequency.setTargetAtTime(targetFilter, now, 0.08)
      this.engineOsc1.frequency.setTargetAtTime(targetFreq1, now, 0.08)
      this.engineOsc2.frequency.setTargetAtTime(targetFreq2, now, 0.08)

      if (this.noiseGain && this.noiseFilter) {
        this.noiseGain.gain.setTargetAtTime(0.03 + speedRatio * 0.06, now, 0.08)
        this.noiseFilter.frequency.setTargetAtTime(750 + speedRatio * 450, now, 0.08)
      }
    } else {
      // Idle / Stopped (tactile spaceship cockpit idle hum)
      this.engineGain.gain.setTargetAtTime(0.12, now, 0.12)
      this.engineFilter.frequency.setTargetAtTime(360, now, 0.12)
      this.engineOsc1.frequency.setTargetAtTime(120, now, 0.12)
      this.engineOsc2.frequency.setTargetAtTime(56, now, 0.12)
      if (this.noiseGain) this.noiseGain.gain.setTargetAtTime(0.015, now, 0.12)
    }
  }

  // ================= 3. DISCRETE SFX / UI AUDIO =================
  playBeep(freq = 600, duration = 0.08, type = 'sine', volume = 0.20) {
    if (this.muted) return
    this.resumeContext()
    if (!this.ctx) return

    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const now = this.ctx.currentTime

      osc.type = type
      osc.frequency.setValueAtTime(freq, now)

      gain.gain.setValueAtTime(volume, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

      osc.connect(gain)
      gain.connect(this.sfxGainNode || this.masterGainNode)

      osc.start()
      osc.stop(now + duration)
    } catch (e) {}
  }

  // Boost Activation Surge (triggered strictly ONCE when SHIFT engaged)
  playBoostStart() {
    if (this.muted) return
    this.resumeContext()
    if (!this.ctx) return

    try {
      const osc = this.ctx.createOscillator()
      const filter = this.ctx.createBiquadFilter()
      const gain = this.ctx.createGain()
      const now = this.ctx.currentTime

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(160, now)
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.22)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(450, now)
      filter.frequency.exponentialRampToValueAtTime(1600, now + 0.22)
      filter.Q.setValueAtTime(3.0, now)

      gain.gain.setValueAtTime(0.24, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.sfxGainNode || this.masterGainNode)

      osc.start()
      osc.stop(now + 0.30)
    } catch (e) {}
  }

  // Navigation Destination Selection (trigger once when selected destination changes)
  playNavSelect() {
    if (this.muted) return
    this.resumeContext()
    this.playBeep(880, 0.05, 'sine', 0.22)
    setTimeout(() => {
      this.playBeep(1320, 0.06, 'triangle', 0.18)
    }, 40)
  }

  // NAV LOCK Target Acquired (tactile lock-on)
  playTargetLock() {
    if (this.muted) return
    this.resumeContext()
    this.playBeep(784, 0.06, 'sine', 0.22)
    setTimeout(() => {
      this.playBeep(1174, 0.08, 'triangle', 0.20)
    }, 55)
  }

  // Arrival Confirmation (resonant celestial 4-note chord when entering destination radius)
  playArrival() {
    if (this.muted) return
    this.resumeContext()
    // Celestial triad: C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.50)
    const chord = [523.25, 659.25, 783.99, 1046.50]
    chord.forEach((freq, idx) => {
      setTimeout(() => {
        this.playBeep(freq, 0.26, 'sine', 0.20)
      }, idx * 75)
    })
  }

  // Enter Dossier / Panel Open Transition (triggered once on ENTER)
  playPanelOpen() {
    if (this.muted) return
    this.resumeContext()
    if (!this.ctx) return

    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const now = this.ctx.currentTime

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(260, now)
      osc.frequency.exponentialRampToValueAtTime(720, now + 0.18)

      gain.gain.setValueAtTime(0.25, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22)

      osc.connect(gain)
      gain.connect(this.sfxGainNode || this.masterGainNode)

      osc.start()
      osc.stop(now + 0.24)
    } catch (e) {}
  }

  // Exit Dossier / ESC Return Transition (triggered once on ESC)
  playPanelClose() {
    if (this.muted) return
    this.resumeContext()
    if (!this.ctx) return

    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const now = this.ctx.currentTime

      osc.type = 'sine'
      osc.frequency.setValueAtTime(580, now)
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.16)

      gain.gain.setValueAtTime(0.22, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.20)

      osc.connect(gain)
      gain.connect(this.sfxGainNode || this.masterGainNode)

      osc.start()
      osc.stop(now + 0.22)
    } catch (e) {}
  }

  // Tactile UI Click
  playClick() {
    if (this.muted) return
    this.resumeContext()
    this.playBeep(780, 0.04, 'sine', 0.18)
    setTimeout(() => this.playBeep(1200, 0.03, 'triangle', 0.14), 25)
  }

  // Tactile UI Hover
  playHover() {
    if (this.muted) return
    this.playBeep(520, 0.02, 'sine', 0.09)
  }

  // Fast-travel Warp Whoosh
  playWarp() {
    if (this.muted) return
    this.resumeContext()
    if (!this.ctx) return

    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const now = this.ctx.currentTime

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(160, now)
      osc.frequency.exponentialRampToValueAtTime(720, now + 0.18)
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.38)

      gain.gain.setValueAtTime(0.28, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.40)

      osc.connect(gain)
      gain.connect(this.sfxGainNode || this.masterGainNode)

      osc.start()
      osc.stop(now + 0.42)
    } catch (e) {}
  }

  // Discovery Fanfare (alias for arrival chime)
  playDiscovery() {
    this.playArrival()
  }

  // Temporary Test Engine Sound for audibility debugging
  testEngineSound() {
    this.unmute()
    if (!this.ctx) return
    const now = this.ctx.currentTime
    // Play a distinct 0.6s engine rev test burst
    try {
      const osc = this.ctx.createOscillator()
      const filter = this.ctx.createBiquadFilter()
      const gain = this.ctx.createGain()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(140, now)
      osc.frequency.linearRampToValueAtTime(260, now + 0.3)
      osc.frequency.linearRampToValueAtTime(140, now + 0.6)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(450, now)
      filter.frequency.linearRampToValueAtTime(1200, now + 0.3)
      filter.frequency.linearRampToValueAtTime(450, now + 0.6)

      gain.gain.setValueAtTime(0.35, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.masterGainNode)

      osc.start()
      osc.stop(now + 0.62)
    } catch (e) {}
  }

  // Debug State Exposer for verification
  getDebugState() {
    return {
      audioInitialized: !!this.ctx,
      contextState: this.ctx ? this.ctx.state : 'uninitialized',
      muted: this.muted,
      masterVolume: this.masterVolume,
      enginePlaying: this.engineRunning && !this.muted,
      boostActive: this.currentBoostState
    }
  }
}

export const soundManager = new SoundSystem()
