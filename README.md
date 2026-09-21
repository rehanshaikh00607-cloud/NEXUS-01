# NEXUS-01 // Personal Mission Portfolio

A desktop-first 3D sci-fi interactive spacecraft portfolio experience built with **React**, **Three.js**, and **React Three Fiber**.

Pilot the **NEXUS-01** reconnaissance vessel through deep space, navigate orbital sectors, explore software engineering projects, and inspect career credentials.

---

## 🚀 Key Systems

- **Interactive 3D Flight Physics**: Smooth 6-DOF inspired spacecraft control with propulsion, reverse thrusters, yaw, pitch, roll trim, and warp boost afterburners.
- **Synthesized Real-Time Audio Engine**: Pure procedural Web Audio API synthesizer for propulsion turbine hum, afterburner hiss, tactile UI chimes, and celestial arrival fanfare (0 external audio files, 0 audio latency, 0 copyright restrictions).
- **Celestial Destination System**:
  1. **Launch Pad**: Starter dock & flight manual briefing
  2. **About Me**: Terrestrial exoplanet (Bio, philosophy, current engineering focus)
  3. **Projects**: Ringed Gas Giant with orbiting moonlets (Interactive project archive & case studies)
  4. **Skills**: Space Station Alpha (Full-stack technologies, avionics subsystems)
  5. **Experience**: Moon-like planet (Career milestones & flight history)
  6. **Education**: Bronze Exoplanet (Academic journey & certifications)
  7. **Contact**: Communications Satellite (Transmission dispatch form)
- **Desktop Telemetry HUD**: Futuristic 5-area cockpit telemetry overlay displaying speed, coordinates, target NAV LOCK bearing, mission status, and quick jump sector dock.
- **Performance Optimized**: Zero React re-renders during active flight, zero per-frame garbage collection allocations, shared Three.js geometries/materials, and efficient bloom convolution.

---

## 🕹️ Desktop Flight Controls

| Key | Action |
| :--- | :--- |
| **`W` / `↑`** | Forward Propulsion |
| **`S` / `↓`** | Reverse Thrusters (Brake) |
| **`A` / `D`** | Yaw Turn Left / Right |
| **`Q` / `E`** | Roll & Banking Trim |
| **`SHIFT`** | Warp Boost (Accelerate to Max Speed) |
| **`SPACE`** | Retro-braking Halt |
| **`←` / `→`** | Cycle Previous / Next Destination |
| **`ENTER`** | Inspect Celestial Destination Dossier |
| **`ESC`** | Close Dossier & Return to Flight |
| **`M`** | Mute / Unmute Transmission Audio |
| **`H` or `?`** | Toggle Flight Manual & Keybindings |
| **`MOUSE CLICK`**| Target Destination / Sector Jump / Case Study links |
| **`DOUBLE CLICK`**| Warp Directly to Destination Sector |

---

## 🛠️ Technology Stack

- **Framework**: [React 18](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **3D Graphics Engine**: [Three.js](https://threejs.org/) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) + [@react-three/drei](https://github.com/pmndrs/drei)
- **Post-Processing**: Three.js `EffectComposer` & `UnrealBloomPass`
- **Audio Synthesis**: Native Web Audio API procedural synthesizer
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Tailored sci-fi HUD CSS architecture

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open browser at http://localhost:5173/
```

---

## 📦 Production Build & Preview

```bash
# Compile optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🌐 Deployment Configuration

NEXUS-01 compiles to a static single-page application (`dist/`).

### Standard Static Deployment Settings
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: `>= 18`

### Platform Specifics
- **Vercel**: Configuration is provided in `vercel.json` with SPA route rewrites.
- **Netlify / Cloudflare Pages**: Routing rules are provided in `public/_redirects` (`/* /index.html 200`).
- **GitHub Pages**: Deploy the generated `dist` folder to your `gh-pages` branch.
