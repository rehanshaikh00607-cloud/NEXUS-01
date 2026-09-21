/**
 * ARSH-01 // Projects Portfolio Data
 * Modular data store for featured software engineering projects.
 */

export const PROJECTS_DATA = [
  {
    id: "ai-study-assistant",
    number: "PROJECT 01",
    name: "AI STUDY ASSISTANT",
    tagline: "AI-powered learning and study platform",
    description: "An AI-powered learning and study platform that generates personalized quizzes, explains complex technical texts, and provides real-time programming assistance.",
    technologies: ["React", "Node.js", "JavaScript", "AI API"],
    image: "/projects/ai-study-assistant.jpg",
    features: [
      "On-demand quiz generation tailored to student comprehension levels",
      "Interactive code syntax breakdown and runtime error debugging",
      "Real-time streaming responses with markdown and LaTeX formula rendering",
      "Session history persistence and topic bookmarking for offline review"
    ],
    role: "Full-Stack Developer & System Architect. Responsible for system design, React frontend interface, API pipeline integration, and streaming performance optimization.",
    challenge: "Streaming large LLM responses with syntax formatting in real-time while maintaining sub-second UI responsiveness, preventing token timeouts, and delivering dependable responses.",
    solution: "Designed an asynchronous streaming architecture with Node.js and React, integrated optimistic state updates, and implemented client-side stream buffering with structured error fallback.",
    result: "Delivered sub-second response streaming, zero dropped sessions during concurrency testing, and a lightweight, distraction-free study tool.",
    liveDemoUrl: "https://example.com/ai-study-assistant-demo",
    githubUrl: "https://github.com/example/ai-study-assistant"
  },
  {
    id: "ecommerce-platform",
    number: "PROJECT 02",
    name: "E-COMMERCE PLATFORM",
    tagline: "Modern web storefront with interactive 3D product customization",
    description: "A high-performance e-commerce web platform featuring real-time 3D product configuration in WebGL, dynamic cart management, and seamless payment processing.",
    technologies: ["React", "Three.js", "Node.js", "JavaScript", "Express", "Stripe API"],
    image: "/projects/ecommerce-website.jpg",
    features: [
      "Real-time 3D product visualizer with 360-degree rotation and color customization",
      "Instant client-side cart updates with optimistic synchronization",
      "Faceted catalog search with category, price, and tag filtering",
      "Integrated end-to-end checkout with secure payment tokenization"
    ],
    role: "Full-Stack Engineer & 3D Specialist. Built the WebGL interactive product visualizer, engineered the catalog state store, and integrated the checkout pipeline.",
    challenge: "Rendering interactive 3D models smoothly in the browser without slowing down initial page loads or causing performance lag on lower-powered mobile devices.",
    solution: "Optimized 3D geometry meshes, implemented texture compression, decoupled the Three.js canvas render loop from React state updates, and added graceful 2D fallbacks.",
    result: "Achieved consistent 60 FPS rendering on modern browsers, under 1.5s initial load times, and a frictionless shopping experience from discovery to checkout.",
    liveDemoUrl: "https://example.com/ecommerce-platform-demo",
    githubUrl: "https://github.com/example/ecommerce-platform"
  },
  {
    id: "developer-analytics",
    number: "PROJECT 03",
    name: "DEVELOPER ANALYTICS",
    tagline: "Real-time engineering telemetry and service observability console",
    description: "A real-time developer metrics and telemetry console that aggregates server health, WebSocket event streams, build pipelines, and latency metrics into a unified dashboard.",
    technologies: ["React", "Node.js", "JavaScript", "WebSockets", "Docker", "Chart.js"],
    image: "/projects/developer-dashboard.jpg",
    features: [
      "Live streaming server telemetry with CPU, memory, and throughput metrics",
      "Real-time WebSocket event feed with search filtering and pause/resume",
      "Configurable threshold alerts for error spikes and latency degradation",
      "High-density responsive data visualization optimized for multi-screen setups"
    ],
    role: "Frontend & Infrastructure Engineer. Architected the real-time WebSocket client, designed the metric streaming graphs, and containerized the testing environment.",
    challenge: "Handling high-frequency incoming telemetry packets without overwhelming the browser DOM or causing frame drops during graph updates.",
    solution: "Implemented an in-memory sliding-window circular buffer, batched DOM updates via requestAnimationFrame, and used memoized canvas rendering for telemetry charts.",
    result: "Successfully sustained over 5,000 events per second with under 50ms render latency and zero UI freezing.",
    liveDemoUrl: "https://example.com/developer-analytics-demo",
    githubUrl: "https://github.com/example/developer-analytics"
  }
]
