/**
 * NEXUS-01 // Space Mission Portfolio - Education & Academic Data Store
 * Destination: BRONZE PLANET (SECTOR-05)
 * Subtitle: NEXUS-01 // ACADEMIC ARCHIVE
 *
 * All entries use clear placeholders where personal information has not been provided.
 * Do not invent schools, colleges, universities, degrees, grades, dates, or certifications.
 * Modify this file directly to update your academic background and credentials.
 */

export const ACADEMIC_JOURNEY = [
  {
    id: "academic-2026",
    year: "2026",
    title: "COMPUTER SCIENCE & SOFTWARE ENGINEERING",
    isCurrent: true,
    institution: "Higher Technical Institute",
    program: "B.S. in Computer Science",
    description: "Advanced curriculum focused on software engineering design patterns, distributed web systems, algorithmic optimization, and modern graphics programming.",
    status: "ENROLLED // IN PROGRESS",
    modules: ["Data Structures & Algorithms", "Full-Stack Web Architecture", "Computer Graphics & WebGL", "Database Systems"]
  },
  {
    id: "academic-2024",
    year: "2024",
    title: "FOUNDATIONAL COMPUTING & MATHEMATICS",
    isCurrent: false,
    institution: "Collegiate Studies",
    program: "Science & Computational Mathematics",
    description: "Rigorous training in discrete mathematics, analytical problem solving, object-oriented principles, and programming paradigms.",
    status: "COMPLETED",
    modules: ["Calculus & Linear Algebra", "Object-Oriented Programming", "Computational Logic"]
  }
]

export const CERTIFICATIONS_DATA = [
  {
    id: "CERT-001",
    code: "CERT-001",
    name: "Modern Full-Stack Web Architecture",
    issuer: "Technical Credentials Authority",
    date: "2025",
    credentialUrl: null,
    skills: ["React", "JavaScript (ES6+)", "REST APIs", "Vite"]
  },
  {
    id: "CERT-002",
    code: "CERT-002",
    name: "Interactive 3D Graphics & WebGL Engineering",
    issuer: "Graphics Computing Lab",
    date: "2025",
    credentialUrl: null,
    skills: ["Three.js", "WebGL", "Shader Fundamentals", "Performance Tuning"]
  }
]

export const CURRENTLY_LEARNING_DATA = {
  heading: "CURRENTLY LEARNING",
  status: "ACTIVE SCAN // KNOWLEDGE EXPANSION",
  items: [
    {
      id: "learn-01",
      name: "Technology / subject 01",
      category: "CORE FOCUS",
      progressPct: 75
    },
    {
      id: "learn-02",
      name: "Technology / subject 02",
      category: "ENGINEERING",
      progressPct: 60
    },
    {
      id: "learn-03",
      name: "Technology / subject 03",
      category: "EXPLORATION",
      progressPct: 45
    }
  ]
}

export const EDUCATION_HEADER_STATS = {
  sector: "SECTOR-05",
  destination: "BRONZE PLANET",
  callsign: "NEXUS-01",
  archiveStatus: "VERIFIED",
  totalDegrees: 2,
  totalCertifications: 2,
  activeSubjects: 3
}
