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
    title: "CURRENT STUDIES",
    isCurrent: true,
    institution: "[Add institution]",
    program: "[Add program]",
    description: "Add details about your current academic curriculum, major coursework, or research initiatives here.",
    status: "ENROLLED // IN PROGRESS",
    modules: ["Core Coursework 01", "Core Coursework 02", "Advanced Elective"]
  },
  {
    id: "academic-2024",
    year: "2024",
    title: "PREVIOUS EDUCATION",
    isCurrent: false,
    institution: "[Add institution]",
    program: "[Add program]",
    description: "Summary of your previous academic qualification, foundational degree, or secondary education.",
    status: "COMPLETED",
    modules: ["Foundational Module 01", "Foundational Module 02"]
  }
]

export const CERTIFICATIONS_DATA = [
  {
    id: "CERT-001",
    code: "CERT-001",
    name: "[CERTIFICATION NAME]",
    issuer: "[ORGANIZATION]",
    date: "[DATE]",
    credentialUrl: null, // Set to valid URL string when available; null provides safe placeholder
    skills: ["Software Engineering", "Cloud Infrastructure"]
  },
  {
    id: "CERT-002",
    code: "CERT-002",
    name: "[CERTIFICATION NAME]",
    issuer: "[ORGANIZATION]",
    date: "[DATE]",
    credentialUrl: null,
    skills: ["Full-Stack Development", "System Architecture"]
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
