import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import api from '../services/api'

export default function ProjectSettings({ project, onClose, onUpdate }) {
  const [formData, setFormData] = useState(project || {})
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState([])

  // Fetch files for this project
  useEffect(() => {
    if (project) {
      fetchFiles()
    }
  }, [project])

  const fetchFiles = async () => {
    try {
      const response = await api.get(`/files/project/${project.id}`)
      setFiles(response.data)
    } catch (error) {
      console.error('Failed to fetch files:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.put(`/projects/${project.id}`, formData)
      onUpdate(response.data)
      onClose()
    } catch (error) {
      console.error('Failed to update project:', error)
      alert('Failed to update project settings')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteFile = async (fileId) => {
    if (!confirm('Delete this file?')) return

    try {
      await api.delete(`/files/${fileId}`)
      fetchFiles()
    } catch (error) {
      console.error('Failed to delete file:', error)
      alert('Failed to delete file')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        className="glass-effect w-full max-w-2xl max-h-screen overflow-y-auto p-8 rounded-2xl"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-cc-text">Project Settings</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={onClose}
            className="text-cc-text-muted hover:text-cc-text text-2xl"
          >
            ✕
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cc-mint">Project Info</h3>

            <div>
              <label className="block text-sm font-medium text-cc-text mb-2">
                Project Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 glass-effect text-cc-text placeholder-cc-text-muted focus:outline-none focus:border-cc-mint"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cc-text mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-2 glass-effect text-cc-text placeholder-cc-text-muted focus:outline-none focus:border-cc-mint resize-none"
              />
            </div>
          </div>

          {/* AI Personality */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cc-blue">AI Personality</h3>

            <div>
              <label className="block text-sm font-medium text-cc-text mb-2">
                System Prompt
              </label>
              <textarea
                name="system_prompt"
                value={formData.system_prompt || ''}
                onChange={handleChange}
                rows="3"
                placeholder="Define how the AI should behave..."
                className="w-full px-4 py-2 glass-effect text-cc-text placeholder-cc-text-muted focus:outline-none focus:border-cc-blue resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-cc-text mb-2">
                  Tone
                </label>
                <select
                  name="tone"
                  value={formData.tone || 'neutral'}
                  onChange={handleChange}
                  className="w-full px-4 py-2 glass-effect text-cc-text focus:outline-none focus:border-cc-blue"
                >
                  <option value="neutral">Neutral</option>
                  <option value="friendly">Friendly</option>
                  <option value="formal">Formal</option>
                  <option value="creative">Creative</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-cc-text mb-2">
                  Language
                </label>
                <select
                  name="language"
                  value={formData.language || 'Swedish'}
                  onChange={handleChange}
                  className="w-full px-4 py-2 glass-effect text-cc-text focus:outline-none focus:border-cc-blue"
                >
                  <option value="Swedish">Swedish</option>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                </select>
              </div>
            </div>
          </div>

          {/* Text Formatting */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cc-orange">Text Formatting</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-cc-text mb-2">
                  Font Family
                </label>
                <select
                  name="font_family"
                  value={formData.font_family || 'Times New Roman'}
                  onChange={handleChange}
                  className="w-full px-4 py-2 glass-effect text-cc-text focus:outline-none focus:border-cc-orange"
                >
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Arial">Arial</option>
                  <option value="Calibri">Calibri</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-cc-text mb-2">
                  Body Font Size (pt)
                </label>
                <input
                  type="number"
                  name="font_size"
                  value={formData.font_size || 12}
                  onChange={handleChange}
                  min="10"
                  max="20"
                  className="w-full px-4 py-2 glass-effect text-cc-text focus:outline-none focus:border-cc-orange"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cc-text mb-2">
                  Line Spacing
                </label>
                <input
                  type="number"
                  name="line_spacing"
                  value={formData.line_spacing || 1.5}
                  onChange={handleChange}
                  min="1"
                  max="3"
                  step="0.1"
                  className="w-full px-4 py-2 glass-effect text-cc-text focus:outline-none focus:border-cc-orange"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cc-text mb-2">
                  Heading Font Size (pt)
                </label>
                <input
                  type="number"
                  name="heading_font_size"
                  value={formData.heading_font_size || 14}
                  onChange={handleChange}
                  min="12"
                  max="28"
                  className="w-full px-4 py-2 glass-effect text-cc-text focus:outline-none focus:border-cc-orange"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="heading_bold"
                checked={formData.heading_bold !== false}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm text-cc-text">Bold headings</span>
            </label>
          </div>

          {/* Files Section */}
          {files.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-cc-pink">Uploaded Files ({files.length})</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 glass-effect rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-cc-text truncate">{file.filename}</p>
                      <p className="text-xs text-cc-text-muted">
                        {(file.file_size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteFile(file.id)}
                      className="text-cc-pink hover:text-red-400 font-bold"
                    >
                      🗑️
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cc-mint to-cc-blue text-cc-dark font-bold rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {loading ? '⏳ Saving...' : '💾 Save Settings'}
            </motion.button>

            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 glass-effect text-cc-text font-medium rounded-lg hover:border-cc-text"
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
