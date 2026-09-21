/**
 * ARSH-01 // Projects Portfolio Data
 * Separate from UI components for easy editing, replacing, or expanding.
 */

export const PROJECTS_DATA = [
  {
    id: "ai-study-assistant",
    name: "AI Study Assistant",
    tagline: "Interactive STEM learning tool with adaptive quizzes and code explanations",
    description: "A web application that generates personalized quizzes, breaks down complex technical texts, and provides step-by-step programming guidance using LLM integration.",
    technologies: ["React", "TypeScript", "Python", "FastAPI", "OpenAI API", "TailwindCSS"],
    screenshot: "/projects/ai-study-assistant.jpg",
    githubUrl: "https://github.com/[your-username]/ai-study-assistant",
    liveDemoUrl: "https://[your-ai-assistant-demo.com]",
    category: "AI & Web Applications",
    status: "ACTIVE",
    metrics: "[e.g. 500+ study sessions generated // sub-second token streaming]",
    caseStudy: {
      overview: "Students often hit bottlenecks when reviewing dense course materials or debugging code alone. AI Study Assistant provides on-demand explanations and targeted practice questions to reinforce understanding.",
      challenge: "Streaming responsive markdown output with math and code syntax formatting while keeping API latency low and preventing hallucinated explanations.",
      solution: "Built asynchronous streaming endpoints with FastAPI, structured JSON schema validations, and a clean React UI with live markdown rendering and session progress tracking.",
      outcome: "A fast, responsive study tool that lets users test their knowledge through targeted questions and clear explanations.",
      keyFeatures: [
        "On-demand quiz generation with customized difficulty levels",
        "Syntax-highlighted code explanation and error troubleshooting",
        "Session history and bookmarking for quick review",
        "Responsive layout optimized for both desktop and mobile study"
      ]
    }
  },
  {
    id: "ecommerce-website",
    name: "E-commerce Website",
    tagline: "Modern web storefront with interactive 3D product customization",
    description: "A responsive e-commerce web application featuring real-time 3D product customization in the browser, instant client-side cart updates, search filtering, and Stripe checkout.",
    technologies: ["React", "Three.js", "Node.js", "Express", "PostgreSQL", "Stripe API"],
    screenshot: "/projects/ecommerce-website.jpg",
    githubUrl: "https://github.com/[your-username]/ecommerce-website",
    liveDemoUrl: "https://[your-ecommerce-demo.com]",
    category: "Full-Stack & 3D",
    status: "COMPLETED",
    metrics: "[e.g. Smooth 60 FPS 3D rendering // under 1.5s initial page load]",
    caseStudy: {
      overview: "Traditional online stores rely on static 2D images that cannot show customizations in real time. This project pairs a modern shopping workflow with an interactive 3D visualizer in the browser.",
      challenge: "Rendering interactive 3D WebGL assets smoothly without degrading page load times or overloading mobile devices.",
      solution: "Optimized 3D geometry and texture maps, isolated the Three.js viewport into a dedicated component, and used optimistic UI updates for the shopping cart and checkout.",
      outcome: "A fast, responsive storefront that lets customers inspect product details interactively from any angle at a steady 60 FPS.",
      keyFeatures: [
        "Interactive 3D model viewer with rotation, zoom, and color variants",
        "Fast product catalog search, category filtering, and sorting",
        "Persistent shopping cart with local storage backup",
        "Secure checkout integration with Stripe"
      ]
    }
  },
  {
    id: "developer-dashboard",
    name: "Developer Dashboard",
    tagline: "Real-time operations console for service metrics, build status, and logs",
    description: "A central engineering dashboard aggregating live server health, WebSocket log streams, build status, and system alerts into a clean, high-density interface.",
    technologies: ["React", "TypeScript", "Node.js", "WebSockets", "Docker", "TailwindCSS"],
    screenshot: "/projects/developer-dashboard.jpg",
    githubUrl: "https://github.com/[your-username]/developer-dashboard",
    liveDemoUrl: "https://[your-dashboard-demo.com]",
    category: "DevOps & Tools",
    status: "ACTIVE",
    metrics: "[e.g. Real-time WebSocket feed under 50ms latency // zero dropped events]",
    caseStudy: {
      overview: "Monitoring distributed server health and deployment pipelines often requires juggling multiple terminal sessions and separate web consoles.",
      challenge: "Handling high-frequency incoming WebSocket logs and metric updates without bogging down the browser DOM or triggering unnecessary React re-renders.",
      solution: "Implemented a buffered message queue, throttled metric charts, and decoupled WebSocket feeds from UI state using memoized component structures.",
      outcome: "A dependable, lightweight monitoring interface that provides immediate visibility into system status.",
      keyFeatures: [
        "Real-time CPU, memory, and service status monitors",
        "Live streaming log viewer with text filtering and pause/resume controls",
        "Configurable alert thresholds for latency and error spikes",
        "Dark-themed, high-density layout optimized for multi-monitor setups"
      ]
    }
  }
]

