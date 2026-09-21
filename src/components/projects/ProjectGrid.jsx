import ProjectCard from './ProjectCard'

/**
 * ProjectGrid
 * Displays the 3-card project archive grid with keyboard focus tracking.
 */
export default function ProjectGrid({
  projects,
  onSelectProject,
  focusedIndex = -1
}) {
  return (
    <div className="project-grid-wrapper animate-fade-in">
      <div className="project-cards-grid">
        {projects.map((project, idx) => (
          <ProjectCard
            key={project.id}
            project={project}
            onSelect={onSelectProject}
            isFocused={idx === focusedIndex}
          />
        ))}
      </div>
    </div>
  )
}
