import { motion } from 'framer-motion'
import { useState } from 'react'
import CreateProjectModal from './CreateProjectModal'
import ProjectDashboard from './ProjectDashboard'
import ProjectSettings from './ProjectSettings'

export default function MainContent({
  project,
  projects,
  onCreateProject,
  showNewProject,
  onCloseNewProject,
}) {
  const [showSettings, setShowSettings] = useState(false)
  const [currentProject, setCurrentProject] = useState(project)

  const handleProjectUpdate = (updatedProject) => {
    setCurrentProject(updatedProject)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-cc-dark">
      {/* Top Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-16 border-b border-glass-600 px-8 flex items-center justify-between bg-cc-darker/50 backdrop-blur-md"
      >
        <div>
          <h2 className="text-xl font-bold text-cc-text">
            {project ? project.name : 'Welcome'}
          </h2>
          <p className="text-xs text-cc-text-muted">
            {project ? project.description || 'No description' : 'Select or create a project'}
          </p>
        </div>

        {project && (
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(true)}
              className="px-4 py-2 rounded-lg glass-effect text-cc-text text-sm font-medium hover:border-cc-blue"
            >
              ⚙️ Settings
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-8">
        {showNewProject ? (
          <CreateProjectModal
            onCreate={onCreateProject}
            onClose={onCloseNewProject}
          />
        ) : project ? (
          <>
            <ProjectDashboard project={project} />
            {showSettings && (
              <ProjectSettings
                project={project}
                onClose={() => setShowSettings(false)}
                onUpdate={handleProjectUpdate}
              />
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex items-center justify-center"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🏴‍☠️</div>
              <h3 className="text-2xl font-bold text-cc-text mb-2">Welcome to CaptainClaw</h3>
              <p className="text-cc-text-muted mb-8">
                Create a new project or select one from the sidebar
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCloseNewProject}
                className="px-8 py-3 bg-gradient-to-r from-cc-pink to-cc-orange text-cc-dark font-bold rounded-lg"
              >
                Create First Project
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
