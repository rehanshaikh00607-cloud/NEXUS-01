import { DESTINATIONS } from './destinations.js'

export { DESTINATIONS }

export const portfolioData = {
  commander: {
    name: "Arsh",
    callsign: "ARSH",
    role: "Software Engineer & Full-Stack Developer",
    designation: "SOFTWARE ENGINEER & FULL-STACK DEVELOPER",
    vessel: "NEXUS-01",
    clearance: "SOFTWARE ENGINEER",
    status: "OPEN FOR OPPORTUNITIES",
    currentOrbit: "PRIMARY SYSTEM // CORE SECTOR",
    location: "[Your City, Country / Remote]",
    photo: "/pilot/profile.jpg",
    resumeUrl: "/resume.pdf",

    // Concise, confident, human summary - no AI buzzwords
    shortIntroduction: "I am Arsh, a software engineer specializing in full-stack web applications and interactive 3D interfaces. I focus on writing clean, maintainable code, optimizing runtime performance, and shipping applications that are fast, accessible, and dependable.",

    // Explicit answer to "What I build"
    whatIBuild: "Full-stack web applications, real-time developer tools, and interactive 3D browser software. I work across the entire stack—from responsive React user interfaces and Three.js graphics to backend API architecture and database design.",

    // Current technical focus
    currentFocus: "Developing performant web applications with React, TypeScript, and Three.js, alongside scalable backend APIs and real-time data feeds.",

    focusPills: [
      "Full-Stack Web Applications",
      "Interactive 3D WebGL (Three.js & R3F)",
      "REST & Real-Time WebSocket APIs",
      "Performance & Frontend Architecture"
    ],

    bio: "Software engineer focused on building reliable web applications and interactive 3D tools. I emphasize clean architecture, fast load times, and intuitive interfaces built to scale.",

    technologies: [
      {
        category: "Frontend & 3D Graphics",
        items: ["React", "JavaScript (ES6+)", "TypeScript", "Three.js", "React Three Fiber", "HTML5 / CSS3", "TailwindCSS", "Vite"]
      },
      {
        category: "Backend & APIs",
        items: ["Node.js", "Express", "Python", "RESTful APIs", "WebSockets"]
      },
      {
        category: "Database & Storage",
        items: ["PostgreSQL", "MongoDB", "Redis"]
      },
      {
        category: "DevOps & Tools",
        items: ["Git", "GitHub", "Docker", "Linux / Bash", "npm / pnpm"]
      }
    ],

    flatTechnologies: [
      "React",
      "JavaScript",
      "TypeScript",
      "Three.js",
      "Node.js",
      "Python",
      "HTML/CSS",
      "PostgreSQL",
      "Docker",
      "Git"
    ],

    stats: [
      { label: "PRIMARY STACK", value: "React & Node" },
      { label: "SPECIALTY", value: "Full-Stack & 3D" },
      { label: "EXPERIENCE", value: "[X+] Years" },
      { label: "AVAILABILITY", value: "Available" }
    ],

    directives: [
      "Build fast, accessible web applications that perform smoothly on mobile and desktop.",
      "Develop interactive 3D WebGL experiences and real-time visualization tools in the browser.",
      "Design clean RESTful and WebSocket APIs backed by reliable data persistence.",
      "Maintain clean codebases with automated testing, CI/CD, and reproducible container environments."
    ],

    // Clear placeholders for unprovided experience
    experience: [
      {
        period: "[Start Date] — Present",
        role: "[Your Current Role / e.g. Software Engineer]",
        station: "[Your Current Company / Organization or Independent]",
        description: "[Describe your core responsibilities, key projects delivered, and the primary technologies you work with daily.]",
        achievements: [
          "[Key accomplishment or feature shipped, e.g. Built and shipped customer-facing dashboard]",
          "[Performance or architecture improvement, e.g. Reduced bundle size by 30% and improved load times]"
        ]
      },
      {
        period: "[Start Date] — [End Date]",
        role: "[Previous Role / e.g. Junior Developer or Full-Stack Intern]",
        station: "[Previous Company / Organization]",
        description: "[Summarize the products you built, bug fixes delivered, and how you collaborated with other engineers.]",
        achievements: [
          "[Key deliverable, e.g. Developed reusable UI components and integrated REST endpoints]",
          "[Team contribution, e.g. Improved test coverage across core application flows]"
        ]
      }
    ],

    // Clear placeholders for unprovided education
    education: [
      {
        degree: "[Your Degree / Major, e.g. B.S. in Computer Science]",
        institution: "[Your University or College Name]",
        period: "[Start Year] — [Graduation Year]",
        honors: "[Honors / GPA / Academic Distinction (Optional)]",
        focus: "[Core Focus, e.g. Software Engineering, Algorithms & Web Systems]",
        courses: [
          "Data Structures & Algorithms",
          "Web Application Architecture",
          "Database Management Systems",
          "Operating Systems & Networks",
          "Software Engineering Principles"
        ]
      },
      {
        degree: "[Certification or Secondary Credential, e.g. AWS Certified / Specialized Training]",
        institution: "[Issuing Organization or Platform]",
        period: "[Year Completed]",
        honors: "[Credential ID / Verification (Optional)]",
        focus: "[Key Topics Covered, e.g. Cloud Infrastructure, System Design, Modern Web Development]",
        courses: [
          "[Course or Domain 1]",
          "[Course or Domain 2]",
          "[Course or Domain 3]"
        ]
      }
    ]
  },

  // Aligned with PROJECTS_DATA for any components referencing portfolioData.missions
  missions: [
    {
      id: "msn-01",
      code: "PROJECT // 01",
      title: "AI Study Assistant",
      category: "AI & Web Applications",
      status: "ACTIVE",
      summary: "An interactive study companion that utilizes LLM integration to generate custom quizzes, summarize dense reading material, and provide step-by-step code and concept explanations.",
      metrics: "[e.g. 500+ study sessions generated // sub-second token streaming]",
      tech: ["React", "TypeScript", "Python", "FastAPI", "OpenAI API", "TailwindCSS"],
      liveUrl: "https://[your-ai-assistant-demo.com]",
      repoUrl: "https://github.com/[your-username]/ai-study-assistant"
    },
    {
      id: "msn-02",
      code: "PROJECT // 02",
      title: "E-commerce Website",
      category: "Full-Stack & 3D",
      status: "COMPLETED",
      summary: "A modern web storefront featuring an interactive 3D product visualizer with real-time color/material customization, fast catalog search, client-side cart, and Stripe checkout.",
      metrics: "[e.g. 60 FPS 3D rendering // under 1.5s initial page load]",
      tech: ["React", "Three.js", "Node.js", "Express", "PostgreSQL", "Stripe API"],
      liveUrl: "https://[your-ecommerce-demo.com]",
      repoUrl: "https://github.com/[your-username]/ecommerce-website"
    },
    {
      id: "msn-03",
      code: "PROJECT // 03",
      title: "Developer Dashboard",
      category: "DevOps & Tools",
      status: "ACTIVE",
      summary: "A real-time operations console that aggregates server health, WebSocket live log streams, build status, and error alerts into a unified high-density single-page interface.",
      metrics: "[e.g. Real-time WebSocket feed under 50ms latency // zero dropped events]",
      tech: ["React", "TypeScript", "WebSockets", "Docker", "Node.js", "TailwindCSS"],
      liveUrl: "https://[your-dashboard-demo.com]",
      repoUrl: "https://github.com/[your-username]/developer-dashboard"
    }
  ],

  subsystems: [
    {
      sector: "SECTOR-A // FRONTEND & 3D GRAPHICS",
      description: "Responsive user interfaces, interactive 3D viewports, and modern component architecture.",
      skills: [
        { name: "React & Component Architecture", level: 94, status: "CORE STACK" },
        { name: "JavaScript (ES6+) & TypeScript", level: 90, status: "CORE STACK" },
        { name: "Three.js & React Three Fiber", level: 86, status: "PROFICIENT" },
        { name: "HTML5, Modern CSS & TailwindCSS", level: 92, status: "CORE STACK" },
        { name: "State Management & Vite Tooling", level: 88, status: "PROFICIENT" }
      ]
    },
    {
      sector: "SECTOR-B // BACKEND & SYSTEMS",
      description: "API design, asynchronous workflows, microservices, and server integration.",
      skills: [
        { name: "Node.js & Express", level: 88, status: "CORE STACK" },
        { name: "Python & FastAPI", level: 82, status: "PROFICIENT" },
        { name: "RESTful API Design", level: 90, status: "CORE STACK" },
        { name: "WebSockets & Real-Time Feeds", level: 85, status: "PROFICIENT" }
      ]
    },
    {
      sector: "SECTOR-C // DATA CORE & STORAGE",
      description: "Relational databases, document stores, and caching layers.",
      skills: [
        { name: "PostgreSQL & Relational Schemas", level: 85, status: "PROFICIENT" },
        { name: "MongoDB & Document Stores", level: 82, status: "PROFICIENT" },
        { name: "Redis In-Memory Caching", level: 80, status: "PROFICIENT" }
      ]
    },
    {
      sector: "SECTOR-D // DEVOPS & TOOLS",
      description: "Version control, containerized deployments, Linux environments, and automation.",
      skills: [
        { name: "Git & GitHub Collaboration", level: 92, status: "CORE STACK" },
        { name: "Docker Containerization", level: 84, status: "PROFICIENT" },
        { name: "Linux Systems & Bash Scripting", level: 82, status: "PROFICIENT" },
        { name: "Build Optimization & CI/CD", level: 80, status: "PROFICIENT" }
      ]
    }
  ],

  comms: {
    frequencies: [
      { name: "EMAIL (DIRECT)", value: "[your.email@example.com]", link: "mailto:[your.email@example.com]" },
      { name: "GITHUB (SOURCE)", value: "github.com/[your-username]", link: "https://github.com/[your-username]" },
      { name: "LINKEDIN (NETWORK)", value: "linkedin.com/in/[your-username]", link: "https://linkedin.com/in/[your-username]" },
      { name: "TWITTER / X", value: "@[your-handle]", link: "https://x.com/[your-handle]" }
    ],
    statusMessage: "Available for software engineering roles, contract projects, and technical collaborations. Send a transmission or reach out directly."
  }
}
