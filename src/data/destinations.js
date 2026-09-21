/**
 * ARSH-01 // Space Mission Portfolio Destinations
 * Celestial body coordinates, proximity thresholds, inspection cameras,
 * and Commander profile data.
 */

export const DESTINATIONS = [
  {
    id: "home",
    index: 0,
    name: "HOME",
    label: "LAUNCH PAD",
    position: [0, 0, 0],
    coordinates: [0, 0, 0],
    radius: 3.0,
    description: "Mission Control, Flight Telemetry & Vessel Hangar",
    tagline: "Mission Control, Flight Telemetry & Vessel Hangar",
    interactionRadius: 9.0,
    proximityRadius: 9.0,
    sector: "SECTOR-00",
    shortName: "HOME",
    proximityTitle: "LAUNCH PAD",
    objectType: "Central Orbital Dock",
    inspectCamera: [0, 3.5, 9.0],
    color: "#00f0ff"
  },
  {
    id: "about",
    index: 1,
    name: "ABOUT",
    label: "CREW PROFILE",
    position: [-44, 18, -50],
    coordinates: [-44, 18, -50],
    radius: 5.2,
    description: "Officer Identity, Background & Engineering Philosophy",
    tagline: "Officer Identity, Background & Engineering Philosophy",
    interactionRadius: 18.0,
    proximityRadius: 18.0,
    sector: "SECTOR-01",
    shortName: "ABOUT",
    proximityTitle: "ABOUT THE PILOT",
    objectType: "Sapphire Terrestrial Planet",
    inspectCamera: [-32, 22, -38],
    color: "#38bdf8"
  },
  {
    id: "projects",
    index: 2,
    name: "PROJECTS",
    label: "PROJECT ARCHIVE",
    position: [38, -10, -65],
    coordinates: [38, -10, -65],
    radius: 7.2,
    description: "Deployed Missions, Web Applications & 3D WebGL Software",
    tagline: "Deployed Missions, Web Applications & 3D WebGL Software",
    interactionRadius: 24.0,
    proximityRadius: 24.0,
    sector: "SECTOR-02",
    shortName: "PROJECTS",
    proximityTitle: "PROJECT ARCHIVE",
    objectType: "Ringed Gas Giant",
    inspectCamera: [26, -6, -48],
    color: "#c084fc"
  },
  {
    id: "skills",
    index: 3,
    name: "SKILLS",
    label: "SPACE STATION ALPHA",
    position: [-18, 7, -24],
    coordinates: [-18, 7, -24],
    radius: 3.5,
    description: "Avionics, Warp Reactors, Data Cores & Cloud Infrastructure",
    tagline: "Avionics, Warp Reactors, Data Cores & Cloud Infrastructure",
    interactionRadius: 13.0,
    proximityRadius: 13.0,
    sector: "SECTOR-03",
    shortName: "SKILLS",
    proximityTitle: "SPACE STATION ALPHA",
    objectType: "Orbital Space Station",
    inspectCamera: [-12, 10, -17],
    color: "#00f0ff"
  },
  {
    id: "experience",
    index: 4,
    name: "EXPERIENCE",
    label: "SHADOW MOON",
    position: [-22, -22, -60],
    coordinates: [-22, -22, -60],
    radius: 3.0,
    description: "Career Stations, Leadership & Flight Log History",
    tagline: "Career Stations, Leadership & Flight Log History",
    interactionRadius: 15.0,
    proximityRadius: 15.0,
    sector: "SECTOR-04",
    shortName: "EXPERIENCE",
    proximityTitle: "SHADOW MOON",
    objectType: "Cratered Exomoon",
    inspectCamera: [-16, -18, -50],
    color: "#818cf8"
  },
  {
    id: "education",
    index: 5,
    name: "EDUCATION",
    label: "BRONZE PLANET",
    position: [24, 20, -38],
    coordinates: [24, 20, -38],
    radius: 3.8,
    description: "Academic Degrees, Technical Certifications & Research",
    tagline: "Academic Degrees, Technical Certifications & Research",
    interactionRadius: 15.0,
    proximityRadius: 15.0,
    sector: "SECTOR-05",
    shortName: "EDUCATION",
    proximityTitle: "BRONZE PLANET",
    objectType: "Bronze Exoplanet",
    inspectCamera: [17, 23, -28],
    color: "#f59e0b"
  },
  {
    id: "contact",
    index: 6,
    name: "CONTACT",
    label: "COMMS SATELLITE",
    position: [14, 5, -16],
    coordinates: [14, 5, -16],
    radius: 2.2,
    description: "Subspace Quantum Uplink, Frequencies & Direct Comms",
    tagline: "Subspace Quantum Uplink, Frequencies & Direct Comms",
    interactionRadius: 10.0,
    proximityRadius: 10.0,
    sector: "SECTOR-06",
    shortName: "CONTACT",
    proximityTitle: "COMMS SATELLITE",
    objectType: "Scientific Deep-Space Satellite",
    inspectCamera: [11, 6.5, -11],
    color: "#10b981"
  }
]

export const getDestinationById = (id) => DESTINATIONS.find((d) => d.id === id) || null
export const getDestinationByIndex = (index) => DESTINATIONS[index] || null

export const commanderData = {
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
