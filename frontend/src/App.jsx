import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import HealthIndicator from './components/HealthIndicator'
import api from './services/api'

function App() {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showNewProject, setShowNewProject] = useState(false)

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await api.get('/projects')
      setProjects(response.data)
      if (response.data.length > 0) {
        setSelectedProject(response.data[0])
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (projectData) => {
    try {
      const response = await api.post('/projects', projectData)
      setProjects([response.data, ...projects])
      setSelectedProject(response.data)
      setShowNewProject(false)
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  const handleDeleteProject = async (projectId) => {
    try {
      await api.delete(`/projects/${projectId}`)
      const filtered = projects.filter(p => p.id !== projectId)
      setProjects(filtered)
      setSelectedProject(filtered[0] || null)
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-screen w-screen bg-cc-dark overflow-hidden"
    >
      {/* Health Indicator */}
      <HealthIndicator />

      {/* Sidebar */}
      <Sidebar
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
        onNewProject={() => setShowNewProject(true)}
        onDeleteProject={handleDeleteProject}
        loading={loading}
      />

      {/* Main Content */}
      <MainContent
        project={selectedProject}
        projects={projects}
        onCreateProject={handleCreateProject}
        showNewProject={showNewProject}
        onCloseNewProject={() => setShowNewProject(false)}
      />
    </motion.div>
  )
}

export default App
