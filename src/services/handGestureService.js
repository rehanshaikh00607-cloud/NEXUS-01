import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'

/**
 * HandGestureService
 * High-performance, client-side hand tracking service for NEXUS-01.
 * 100% local browser execution using MediaPipe HandLandmarker WebAssembly/WebGL.
 * Zero frames or video data are transmitted over the network.
 */
class HandGestureService {
  constructor() {
    this.handLandmarker = null
    this.isInitializing = false
    this.isRunning = false
    this.videoElement = null
    this.mediaStream = null
    this.animFrameId = null
    this.lastVideoTime = -1

    // Optional mini HUD preview canvas
    this.previewCanvas = null
    this.previewCtx = null

    // Continuous mutable flight input state (read directly by kinematics loop with 0 React re-renders)
    this.inputState = {
      active: false,
      handDetected: false,
      forward: false,
      backward: false,
      left: false,
      right: false,
      up: false,
      down: false,
      rollLeft: false,
      rollRight: false,
      boost: false,
      rawX: 0.5,
      rawY: 0.5,
      smoothedX: 0.5,
      smoothedY: 0.5,
      tiltAngle: 0,
      gestureName: 'OFF',
      confidence: 0
    }

    // Exponential moving average filter states
    this.smoothedX = 0.5
    this.smoothedY = 0.5
    this.smoothedTilt = 0
    this.isPinching = false

    // Tuning constants
    this.DEADZONE_X = 0.08
    this.DEADZONE_Y = 0.08
    this.ROLL_DEADZONE = 0.24 // ~14 degrees
    this.SMOOTHING_ALPHA = 0.38
    this.TILT_SMOOTHING_ALPHA = 0.30

    // Callback listeners for UI status changes (low-frequency only)
    this.statusListeners = new Set()
  }

  onStatusChange(callback) {
    this.statusListeners.add(callback)
    return () => this.statusListeners.delete(callback)
  }

  notifyStatus(status, detail = null) {
    this.statusListeners.forEach((cb) => {
      try {
        cb(status, detail)
      } catch (err) {
        console.error('Status listener error:', err)
      }
    })
  }

  setPreviewCanvas(canvas) {
    this.previewCanvas = canvas
    this.previewCtx = canvas ? canvas.getContext('2d') : null
  }

  /**
   * Lazy-loads MediaPipe HandLandmarker models
   */
  async initLandmarker() {
    if (this.handLandmarker) return this.handLandmarker
    if (this.isInitializing) {
      while (this.isInitializing) {
        await new Promise((r) => setTimeout(r, 50))
      }
      return this.handLandmarker
    }

    this.isInitializing = true
    this.notifyStatus('INITIALIZING', 'Loading MediaPipe Hand Vision Engine...')

    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      )

      this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'GPU'
        },
        runningMode: 'VIDEO',
        numHands: 1,
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5
      })

      this.isInitializing = false
      return this.handLandmarker
    } catch (err) {
      this.isInitializing = false
      console.error('Failed to initialize MediaPipe HandLandmarker:', err)
      this.notifyStatus('ERROR', err.message || 'Vision engine initialization failed')
      throw err
    }
  }

  /**
   * Requests webcam stream and initiates local tracking
   */
  async start() {
    if (this.isRunning) return true

    try {
      this.notifyStatus('REQUESTING_CAMERA', 'Requesting webcam access...')

      // 1. Request camera permission only upon explicit user action
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 320 },
          height: { ideal: 240 },
          frameRate: { ideal: 30, max: 30 },
          facingMode: 'user'
        },
        audio: false
      })

      this.mediaStream = stream

      // 2. Prepare hidden video element for decoding frames
      if (!this.videoElement) {
        const video = document.createElement('video')
        video.setAttribute('playsinline', '')
        video.setAttribute('webkit-playsinline', '')
        video.muted = true
        video.autoplay = true
        video.style.position = 'fixed'
        video.style.top = '-9999px'
        video.style.left = '-9999px'
        video.style.width = '320px'
        video.style.height = '240px'
        video.style.opacity = '0'
        video.style.pointerEvents = 'none'
        document.body.appendChild(video)
        this.videoElement = video
      }

      this.videoElement.srcObject = stream
      await this.videoElement.play()

      // 3. Initialize Vision Engine
      await this.initLandmarker()

      // Guard if stopped while initializing
      if (!this.mediaStream) {
        this.stop()
        return false
      }

      this.isRunning = true
      this.inputState.active = true
      this.notifyStatus('ACTIVE', 'Hand tracking active')

      // 4. Start detection loop
      this.lastVideoTime = -1
      this.startTrackingLoop()

      return true
    } catch (err) {
      console.warn('Camera access or gesture tracking startup failed:', err)
      this.stop()
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        this.notifyStatus('DENIED', 'Camera permission denied')
      } else {
        this.notifyStatus('ERROR', err.message || 'Webcam unavailable')
      }
      return false
    }
  }

  /**
   * Cleanly stops webcam stream and neutralizes all flight inputs
   */
  stop() {
    this.isRunning = false

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId)
      this.animFrameId = null
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => {
        try {
          t.stop()
        } catch (e) {
          // ignore
        }
      })
      this.mediaStream = null
    }

    if (this.videoElement) {
      this.videoElement.srcObject = null
      if (this.videoElement.parentNode) {
        this.videoElement.parentNode.removeChild(this.videoElement)
      }
      this.videoElement = null
    }

    // Reset all inputs to neutral immediately
    this.resetInputState()
    this.inputState.active = false
    this.notifyStatus('OFF', 'Gesture control disabled')
  }

  /**
   * Gesture loss safety: immediately resets all movement inputs to zero
   */
  resetInputState() {
    const s = this.inputState
    s.handDetected = false
    s.forward = false
    s.backward = false
    s.left = false
    s.right = false
    s.up = false
    s.down = false
    s.rollLeft = false
    s.rollRight = false
    s.boost = false
    s.gestureName = this.isRunning ? 'SEARCHING HAND...' : 'OFF'
    s.confidence = 0
    this.isPinching = false
  }

  /**
   * Main detection loop running at webcam frame rate (~30 FPS)
   */
  startTrackingLoop() {
    const detectFrame = () => {
      if (!this.isRunning) return

      if (
        this.videoElement &&
        this.videoElement.readyState >= 2 &&
        this.videoElement.currentTime !== this.lastVideoTime &&
        this.handLandmarker
      ) {
        const startTimeMs = performance.now()
        this.lastVideoTime = this.videoElement.currentTime

        try {
          const results = this.handLandmarker.detectForVideo(this.videoElement, startTimeMs)
          this.processLandmarks(results)
        } catch (err) {
          console.error('HandLandmarker frame detection error:', err)
        }
      }

      this.animFrameId = requestAnimationFrame(detectFrame)
    }

    this.animFrameId = requestAnimationFrame(detectFrame)
  }

  /**
   * Landmark processing & gesture classification
   */
  processLandmarks(results) {
    if (!results || !results.landmarks || results.landmarks.length === 0) {
      // GESTURE LOSS SAFETY: When hand disappears, instantly clear inputs
      this.resetInputState()
      this.drawPreview(null)
      return
    }

    const landmarks = results.landmarks[0]
    if (!landmarks || landmarks.length < 21) {
      this.resetInputState()
      this.drawPreview(null)
      return
    }

    const s = this.inputState
    s.handDetected = true

    // Landmark references:
    // 0: WRIST
    // 1-4: THUMB (4 = TIP)
    // 5-8: INDEX (5 = MCP, 6 = PIP, 8 = TIP)
    // 9-12: MIDDLE (9 = MCP, 10 = PIP, 12 = TIP)
    // 13-16: RING (13 = MCP, 14 = PIP, 16 = TIP)
    // 17-20: PINKY (17 = MCP, 18 = PIP, 20 = TIP)
    const wrist = landmarks[0]
    const thumbTip = landmarks[4]
    const indexMCP = landmarks[5]
    const indexPIP = landmarks[6]
    const indexTip = landmarks[8]
    const middleMCP = landmarks[9]
    const middlePIP = landmarks[10]
    const middleTip = landmarks[12]
    const ringMCP = landmarks[13]
    const ringPIP = landmarks[14]
    const ringTip = landmarks[16]
    const pinkyMCP = landmarks[17]
    const pinkyPIP = landmarks[18]
    const pinkyTip = landmarks[20]

    // 1. Palm Center & Normalization (Mirrored for natural mirror-like webcam control)
    // Moving your hand to your left (screen left) gives lower X; moving to your right gives higher X
    const rawPalmX = (wrist.x + indexMCP.x + pinkyMCP.x) / 3
    const rawPalmY = (wrist.y + indexMCP.y + pinkyMCP.y) / 3
    const mirroredX = 1.0 - rawPalmX
    const normalizedY = rawPalmY

    s.rawX = mirroredX
    s.rawY = normalizedY

    // Exponential moving average filter for smooth, jitter-free position
    this.smoothedX = this.smoothedX * (1 - this.SMOOTHING_ALPHA) + mirroredX * this.SMOOTHING_ALPHA
    this.smoothedY = this.smoothedY * (1 - this.SMOOTHING_ALPHA) + normalizedY * this.SMOOTHING_ALPHA
    s.smoothedX = this.smoothedX
    s.smoothedY = this.smoothedY

    // 2. Palm scale metric (distance from wrist to middle MCP knuckle) for invariant distance checks
    const palmScale = Math.hypot(middleMCP.x - wrist.x, middleMCP.y - wrist.y) || 0.15

    // 3. Finger extension tests
    // A finger is extended when its tip is farther from the wrist than its intermediate PIP knuckle
    const distToWrist = (pt) => Math.hypot(pt.x - wrist.x, pt.y - wrist.y)

    const isIndexExtended = distToWrist(indexTip) > distToWrist(indexPIP) * 1.15
    const isMiddleExtended = distToWrist(middleTip) > distToWrist(middlePIP) * 1.15
    const isRingExtended = distToWrist(ringTip) > distToWrist(ringPIP) * 1.15
    const isPinkyExtended = distToWrist(pinkyTip) > distToWrist(pinkyPIP) * 1.15

    const extendedCount =
      (isIndexExtended ? 1 : 0) +
      (isMiddleExtended ? 1 : 0) +
      (isRingExtended ? 1 : 0) +
      (isPinkyExtended ? 1 : 0)

    // 4. Recognized Gestures Classification:
    // - CLOSED FIST: All 4 non-thumb fingers are curled
    const isClosedFist = !isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended

    // - TWO-FINGER / V SIGN: Index and Middle extended, Ring and Pinky curled
    const isTwoFinger = isIndexExtended && isMiddleExtended && !isRingExtended && !isPinkyExtended

    // - PINCH: Distance between Thumb Tip and Index Tip
    const pinchDist = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y) / palmScale
    if (!this.isPinching && pinchDist < 0.24) {
      this.isPinching = true
    } else if (this.isPinching && pinchDist > 0.35) {
      this.isPinching = false
    }
    const isPinchBoost = this.isPinching

    // - ROLL (HAND TILT): Angle of vector from wrist to middle MCP in mirrored screen coordinates
    // When upright, dy < 0, dx ~ 0 -> angle ~ 0
    // Tilting hand to the left tilts vector left; tilting right tilts vector right
    const tiltVectorX = (middleMCP.x - wrist.x) * -1 // mirrored
    const tiltVectorY = middleMCP.y - wrist.y
    const rawTiltAngle = Math.atan2(tiltVectorX, -tiltVectorY)
    this.smoothedTilt = this.smoothedTilt * (1 - this.TILT_SMOOTHING_ALPHA) + rawTiltAngle * this.TILT_SMOOTHING_ALPHA
    s.tiltAngle = this.smoothedTilt

    // 5. Map Gestures to Continuous Flight Controls:
    // A. Forward & Backward (Closed Fist = FWD, Two-Finger = BACK)
    s.forward = isClosedFist
    s.backward = isTwoFinger

    // B. Warp Speed Boost (Pinch = SHIFT boost)
    s.boost = isPinchBoost

    // C. Directional Navigation with Center Dead Zone (Open Palm or Hand Position)
    // Center of screen is (0.5, 0.5)
    const offsetX = this.smoothedX - 0.5
    const offsetY = 0.5 - this.smoothedY // inverted so hand UP gives positive offsetY

    s.left = offsetX < -this.DEADZONE_X
    s.right = offsetX > this.DEADZONE_X
    s.up = offsetY > this.DEADZONE_Y
    s.down = offsetY < -this.DEADZONE_Y

    // D. Roll Trim (Hand Tilt with Dead Zone)
    s.rollLeft = this.smoothedTilt < -this.ROLL_DEADZONE
    s.rollRight = this.smoothedTilt > this.ROLL_DEADZONE

    // 6. Descriptive gesture tag for HUD display
    const gestureTags = []
    if (isPinchBoost) gestureTags.push('PINCH [BOOST]')
    if (isClosedFist) {
      gestureTags.push('FIST [FWD]')
    } else if (isTwoFinger) {
      gestureTags.push('V-SIGN [REV]')
    } else if (extendedCount >= 3) {
      gestureTags.push('OPEN PALM')
    }

    if (s.left) gestureTags.push('LEFT')
    if (s.right) gestureTags.push('RIGHT')
    if (s.up) gestureTags.push('UP')
    if (s.down) gestureTags.push('DOWN')
    if (s.rollLeft) gestureTags.push('ROLL ◀')
    if (s.rollRight) gestureTags.push('ROLL ▶')

    s.gestureName = gestureTags.length > 0 ? gestureTags.join(' + ') : 'STEADY [DEADZONE]'

    // 7. Render debug preview on HUD mini-canvas if active
    this.drawPreview(landmarks)
  }

  /**
   * Draws a lightweight sci-fi hand tracking reticle and skeleton onto the preview canvas
   */
  drawPreview(landmarks) {
    if (!this.previewCanvas || !this.previewCtx) return

    const canvas = this.previewCanvas
    const ctx = this.previewCtx
    const w = canvas.width
    const h = canvas.height

    ctx.clearRect(0, 0, w, h)

    // Optional mirrored video background
    if (this.videoElement && this.videoElement.readyState >= 2) {
      ctx.save()
      ctx.translate(w, 0)
      ctx.scale(-1, 1)
      ctx.globalAlpha = 0.55
      ctx.drawImage(this.videoElement, 0, 0, w, h)
      ctx.restore()
    }

    // Sci-fi deadzone grid reticle
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)'
    ctx.lineWidth = 1
    ctx.strokeRect(
      w * (0.5 - this.DEADZONE_X),
      h * (0.5 - this.DEADZONE_Y),
      w * (this.DEADZONE_X * 2),
      h * (this.DEADZONE_Y * 2)
    )

    // Center crosshair
    ctx.beginPath()
    ctx.moveTo(w * 0.5 - 6, h * 0.5)
    ctx.lineTo(w * 0.5 + 6, h * 0.5)
    ctx.moveTo(w * 0.5, h * 0.5 - 6)
    ctx.lineTo(w * 0.5, h * 0.5 + 6)
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)'
    ctx.stroke()

    if (!landmarks) return

    // Draw hand landmarks (mirrored to match user movement)
    ctx.save()
    ctx.fillStyle = this.inputState.boost ? '#f59e0b' : '#00f0ff'
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.7)'
    ctx.lineWidth = 1.5

    // Skeleton connections
    const SKELETON = [
      [0, 1], [1, 2], [2, 3], [3, 4], // thumb
      [0, 5], [5, 6], [6, 7], [7, 8], // index
      [0, 9], [9, 10], [10, 11], [11, 12], // middle
      [0, 13], [13, 14], [14, 15], [15, 16], // ring
      [0, 17], [17, 18], [18, 19], [19, 20] // pinky
    ]

    ctx.beginPath()
    SKELETON.forEach(([i, j]) => {
      const p1 = landmarks[i]
      const p2 = landmarks[j]
      ctx.moveTo((1 - p1.x) * w, p1.y * h)
      ctx.lineTo((1 - p2.x) * w, p2.y * h)
    })
    ctx.stroke()

    // Keypoints
    landmarks.forEach((pt, idx) => {
      const x = (1 - pt.x) * w
      const y = pt.y * h
      ctx.beginPath()
      ctx.arc(x, y, idx === 4 || idx === 8 ? 3.5 : 2, 0, Math.PI * 2)
      ctx.fill()
    })

    // Palm position indicator
    const px = this.inputState.smoothedX * w
    const py = this.inputState.smoothedY * h
    ctx.beginPath()
    ctx.arc(px, py, 6, 0, Math.PI * 2)
    ctx.strokeStyle = this.inputState.boost ? '#f59e0b' : '#38bdf8'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.restore()
  }
}

export const handGestureService = new HandGestureService()
export default handGestureService
