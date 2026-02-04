import { motion } from 'framer-motion'
import { useState } from 'react'

export default function CreateProjectModal({ onCreate, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    system_prompt: 'You are a helpful AI assistant.',
    tone: 'neutral',
    language: 'Swedish',
    font_family: 'Times New Roman',
    font_size: 12,
    line_spacing: 1.5,
    heading_font_size: 14,
    heading_bold: true,
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    setLoading(true)
    try {
      await onCreate(formData)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        className="glass-effect w-full max-w-2xl max-h-screen overflow-y-auto p-8 rounded-2xl"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
      >
        <h2 className="text-2xl font-bold text-cc-text mb-6">Create New Project</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cc-mint">Project Info</h3>

            <div>
              <label className="block text-sm font-medium text-cc-text mb-2">
                Project Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="My awesome project"
                className="w-full px-4 py-2 glass-effect text-cc-text placeholder-cc-text-muted focus:outline-none focus:border-cc-mint"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cc-text mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What is this project about?"
                rows="3"
                className="w-full px-4 py-2 glass-effect text-cc-text placeholder-cc-text-muted focus:outline-none focus:border-cc-mint resize-none"
              />
            </div>
          </div>

          {/* System Prompt */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cc-blue">AI Personality</h3>

            <div>
              <label className="block text-sm font-medium text-cc-text mb-2">
                System Prompt
              </label>
              <textarea
                name="system_prompt"
                value={formData.system_prompt}
                onChange={handleChange}
                placeholder="Define how the AI should behave..."
                rows="3"
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
                  value={formData.tone}
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
                  value={formData.language}
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

          {/* Formatting */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cc-orange">Text Formatting</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-cc-text mb-2">
                  Font Family
                </label>
                <select
                  name="font_family"
                  value={formData.font_family}
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
                  value={formData.font_size}
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
                  value={formData.line_spacing}
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
                  value={formData.heading_font_size}
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
                checked={formData.heading_bold}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm text-cc-text">Bold headings</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cc-mint to-cc-blue text-cc-dark font-bold rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {loading ? '⏳ Creating...' : '✨ Create Project'}
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
