import { useState, useEffect, useCallback } from 'react'
import { PROJECTS_DATA } from '../../data/projects'
import ProjectGrid from './ProjectGrid'
import ProjectDetails from './ProjectDetails'
import { soundManager } from '../../utils/audio'

/**
 * ProjectsPanel
 * Spacecraft Mission Terminal Projects Coordinator:
 * - Displays projects archive grid with keyboard and mouse selection
 * - Replaces grid in-place with focused ProjectDetails view upon selection
 * - Handles ESC key hierarchy:
 *     In details view: ESC -> return to project list
 *     In project list: ESC -> return to spaceship flight
 * - Handles Arrow Keys & ENTER for keyboard-based project selection
 */
export default function ProjectsPanel({
  projects = PROJECTS_DATA,
  onClose
}) {
  const [selectedProject, setSelectedProject] = useState(null)
  const [focusedIndex, setFocusedIndex] = useState(0)

  const handleSelectProject = useCallback((project) => {
    soundManager.playWarp()
    setSelectedProject(project)
  }, [])

  const handleBackToGrid = useCallback(() => {
    soundManager.playClick()
    setSelectedProject(null)
  }, [])

  // Keyboard navigation inside Projects panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return

      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        if (selectedProject) {
          handleBackToGrid()
        } else if (onClose) {
          soundManager.playClick()
          onClose()
        }
      } else if (!selectedProject) {
        // Grid navigation
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault()
          soundManager.playClick()
          setFocusedIndex((prev) => (prev + 1) % projects.length)
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault()
          soundManager.playClick()
          setFocusedIndex((prev) => (prev - 1 + projects.length) % projects.length)
        } else if (e.key === 'Enter') {
          e.preventDefault()
          if (projects[focusedIndex]) {
            handleSelectProject(projects[focusedIndex])
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown, true) // capture phase
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [selectedProject, focusedIndex, projects, handleBackToGrid, handleSelectProject, onClose])

  return (
    <div className="projects-panel-container">
      {/* Subtitle / Context Telemetry Bar */}
      <div className="projects-context-bar sci-fi-notch">
        <div className="context-left">
          <span className="context-beacon-dot"></span>
          <span className="context-subtitle-text">
            {selectedProject
              ? `MISSION TERMINAL // SPECIFICATION VIEW // ${selectedProject.number}`
              : 'MISSION TERMINAL // SELECT A PROJECT TO INSPECT'}
          </span>
        </div>
        <div className="context-right">
          <span className="context-counter-tag">
            {selectedProject ? '1 OF 1 INSPECTED' : `${projects.length} PROJECTS ARCHIVED`}
          </span>
        </div>
      </div>

      {/* Main Content View: Grid or Details */}
      {!selectedProject ? (
        <ProjectGrid
          projects={projects}
          onSelectProject={handleSelectProject}
          focusedIndex={focusedIndex}
        />
      ) : (
        <ProjectDetails
          project={selectedProject}
          onBack={handleBackToGrid}
          onReturnToFlight={onClose}
        />
      )}
    </div>
  )
}
