/**
 * ARSH-01 // About Destination Data Store
 * Centralized, editable information for the Commander / Crew Profile.
 * You can easily update your role, location, bio, focus areas, and technologies here.
 */

export const ABOUT_DATA = {
  profile: {
    name: "Arsh",
    role: "[YOUR ROLE]",
    location: "[YOUR LOCATION]",
    callsign: "NEXUS-01",
    status: "ACTIVE",
    clearance: "CREW COMMANDER",
    // Set to your image path (e.g. '/pilot/profile.jpg') when ready, or leave null for clean placeholder
    image: null
  },

  missionLog: {
    heading: "MISSION LOG",
    intro: "I am a developer focused on building interactive and modern digital experiences.",
    extendedLog: "Specializing in frontend architecture, modern web applications, and interactive 3D WebGL interfaces. Dedicated to clean code, responsive layouts, and intuitive user experiences."
  },

  currentFocus: [
    {
      number: "01",
      category: "DEVELOPMENT",
      title: "Building web applications and interactive experiences.",
      description: "Engineering scalable, responsive frontends and reliable web applications with modern design systems and 3D graphics."
    },
    {
      number: "02",
      category: "LEARNING",
      title: "Continuously improving my technical skills.",
      description: "Exploring advanced software engineering patterns, web performance optimizations, and modern full-stack frameworks."
    },
    {
      number: "03",
      category: "EXPLORATION",
      title: "Experimenting with creative technologies and new ideas.",
      description: "Prototyping creative WebGL shaders, interactive 3D mechanics, and next-generation web interfaces."
    }
  ],

  technologies: [
    "JavaScript",
    "React",
    "Three.js",
    "HTML",
    "CSS",
    "Git",
    "GitHub"
  ]
}
