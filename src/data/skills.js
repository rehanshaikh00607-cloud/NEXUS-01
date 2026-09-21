/**
 * ARSH-01 // Space Station Alpha Technical Avionics & Subsystems
 * Centralized, editable technical skills, proficiency telemetry, and subsystem metrics.
 */

export const SKILLS_METRICS = {
  station: "SPACE STATION ALPHA",
  sector: "SECTOR-03 // ORBITAL AVIONICS",
  status: "SYSTEMS NOMINAL",
  coreFocus: "Full-Stack & 3D WebGL",
  totalTech: "20+",
  subsystemsCount: "4 Core Sectors"
}

export const SKILLS_CATEGORIES = [
  { id: "ALL", label: "ALL SUBSYSTEMS", count: 18 },
  { id: "frontend", label: "FRONTEND & 3D", count: 6 },
  { id: "backend", label: "BACKEND & APIS", count: 4 },
  { id: "database", label: "DATA & STORAGE", count: 4 },
  { id: "devops", label: "DEVOPS & TOOLS", count: 4 }
]

export const SKILLS_SUBSYSTEMS = [
  {
    id: "frontend",
    sector: "SECTOR-A // FRONTEND & 3D GRAPHICS",
    category: "frontend",
    icon: "Layers",
    description: "Responsive user interfaces, interactive 3D WebGL scenes, and modular component architectures.",
    skills: [
      { name: "React & Component Architecture", level: 94, status: "CORE STACK", highlight: "Hooks, Context, State & Reusable Components" },
      { name: "JavaScript (ES6+) & TypeScript", level: 92, status: "CORE STACK", highlight: "Async/Await, Modern ES Features, Type Safety" },
      { name: "Three.js & React Three Fiber", level: 88, status: "SPECIALTY", highlight: "3D Viewports, Shaders, Lighting, Mesh Instancing" },
      { name: "HTML5, Modern CSS & Canvas", level: 95, status: "CORE STACK", highlight: "Semantic Structure, Grid, Flexbox, Animations" },
      { name: "TailwindCSS & Design Systems", level: 90, status: "PROFICIENT", highlight: "Responsive Utilities, Glassmorphism, Dark UI" },
      { name: "Vite, Bundling & Web Performance", level: 88, status: "PROFICIENT", highlight: "Code Splitting, Tree Shaking, HMR Optimization" }
    ]
  },
  {
    id: "backend",
    sector: "SECTOR-B // BACKEND & SYSTEMS",
    category: "backend",
    icon: "Cpu",
    description: "Asynchronous APIs, microservices, real-time data feeds, and server architecture.",
    skills: [
      { name: "Node.js & Express Architecture", level: 90, status: "CORE STACK", highlight: "RESTful Endpoints, Middleware, Auth & Routing" },
      { name: "Python & Backend Services", level: 84, status: "PROFICIENT", highlight: "Automation, Data Processing & REST Services" },
      { name: "RESTful API Design & Integration", level: 92, status: "CORE STACK", highlight: "Clean Contract Design, Serialization, CORS & Security" },
      { name: "WebSockets & Real-Time Feeds", level: 86, status: "PROFICIENT", highlight: "Bi-directional Comms, Event Streams, Live Sync" }
    ]
  },
  {
    id: "database",
    sector: "SECTOR-C // DATA CORE & STORAGE",
    category: "database",
    icon: "Terminal",
    description: "Relational schemas, NoSQL document databases, and high-speed in-memory caches.",
    skills: [
      { name: "PostgreSQL & Relational Schemas", level: 88, status: "CORE STACK", highlight: "Relational Modeling, Indexing, Complex Queries" },
      { name: "MongoDB & Document Stores", level: 84, status: "PROFICIENT", highlight: "Aggregation Pipelines, Flexible Schemas, Atlas" },
      { name: "Redis In-Memory Caching", level: 82, status: "PROFICIENT", highlight: "Key-Value Stores, Session Management, Pub/Sub" },
      { name: "Database Design & Optimization", level: 86, status: "PROFICIENT", highlight: "Normalization, Query Tuning, Connection Pooling" }
    ]
  },
  {
    id: "devops",
    sector: "SECTOR-D // DEVOPS & TOOLS",
    category: "devops",
    icon: "GitBranch",
    description: "Version control workflows, containerized environments, and cloud deployment pipelines.",
    skills: [
      { name: "Git & GitHub Collaboration", level: 94, status: "CORE STACK", highlight: "Branching Strategies, PRs, Code Reviews, Releases" },
      { name: "Docker Containerization", level: 85, status: "PROFICIENT", highlight: "Multi-stage Builds, Docker Compose, Portability" },
      { name: "Linux Systems & Bash Shell", level: 84, status: "PROFICIENT", highlight: "Command Line Navigation, Scripting, Permissions" },
      { name: "CI/CD & Deployment Pipelines", level: 82, status: "PROFICIENT", highlight: "Automated Workflows, Vercel, Netlify, Cloud Hosts" }
    ]
  }
]

export const ALL_SKILL_TAGS = [
  "React",
  "Three.js",
  "React Three Fiber",
  "JavaScript (ES6+)",
  "TypeScript",
  "Node.js",
  "Express",
  "Python",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "HTML5",
  "CSS3",
  "TailwindCSS",
  "Vite",
  "Git",
  "GitHub",
  "Docker",
  "Linux / Bash",
  "WebSockets",
  "REST APIs"
]
