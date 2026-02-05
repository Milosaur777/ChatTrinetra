import { motion } from 'framer-motion'
import { useState } from 'react'
import { useCommandPalette } from '../contexts/CommandPaletteContext'

export default function Sidebar({
  projects,
  selectedProject,
  onSelectProject,
  onNewProject,
  onDeleteProject,
  loading
}) {
  const [hoveredId, setHoveredId] = useState(null)
  const { openPalette } = useCommandPalette()

  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-64 bg-cc-darker border-r border-glass-600 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-glass-600">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🏴‍☠️</div>
            <div>
              <h1 className="text-xl font-bold text-cc-text">CaptainClaw</h1>
              <p className="text-xs text-cc-text-muted">AI Projects</p>
            </div>
          </div>

          {/* Search Icon Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={openPalette}
            title="Search (Cmd+K)"
            className="p-2 rounded-lg hover:bg-cc-accent hover:bg-opacity-20 transition-colors text-xl"
          >
            🔍
          </motion.button>
        </div>

        {/* New Project Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewProject}
          className="w-full px-4 py-2 bg-gradient-to-r from-cc-mint to-cc-blue text-cc-dark font-semibold rounded-lg hover:opacity-90 text-sm"
        >
          + New Project
        </motion.button>
      </div>

      {/* Projects List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto p-4 space-y-2"
      >
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin text-2xl">⚙️</div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8 text-cc-text-muted text-sm">
            No projects yet
          </div>
        ) : (
          projects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelectProject(project)}
              className={`p-3 rounded-lg cursor-pointer group relative overflow-hidden ${
                selectedProject?.id === project.id
                  ? 'glass-effect bg-opacity-100 border-cc-mint border-2'
                  : 'glass-effect hover:border-glass border border-glass'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cc-mint/10 to-cc-blue/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <h3 className="font-semibold text-cc-text truncate text-sm">
                  {project.name}
                </h3>
                <p className="text-xs text-cc-text-muted truncate">
                  {project.description || 'No description'}
                </p>
              </div>

              {/* Delete Button */}
              {hoveredId === project.id && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteProject(project.id)
                  }}
                  className="absolute top-2 right-2 text-cc-pink hover:text-red-400 text-xs font-bold"
                >
                  ✕
                </motion.button>
              )}
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Footer */}
      <div className="p-4 border-t border-glass-600 text-center text-xs text-cc-text-muted">
        <p>v0.1.0 - MVP</p>
      </div>
    </motion.div>
  )
}
