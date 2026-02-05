import { motion } from 'framer-motion'
import { useState } from 'react'
import api from '../services/api'
import HeroIcon from './Icon'

export default function FileUpload({ projectId, onUpload }) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = null

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFiles = async (files) => {
    for (let file of files) {
      await uploadFile(file)
    }
  }

  const uploadFile = async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    setUploading(true)
    try {
      await api.post(`/files/upload/${projectId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      onUpload()
    } catch (error) {
      console.error('Failed to upload file:', error)
      alert('Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`glass-effect p-6 rounded-xl text-center cursor-pointer transition-all ${
        dragActive
          ? 'border-2 border-cc-mint bg-opacity-20'
          : 'border-2 border-dashed border-glass hover:border-cc-blue'
      }`}
    >
      <div className="mb-2">
        <HeroIcon name="arrow-up-tray" size="xl" color="primary" className="mx-auto" />
      </div>
      <h4 className="font-semibold text-cc-text mb-1">Upload Files</h4>
      <p className="text-xs text-cc-text-muted mb-3">
        PDF, Excel, Word documents
      </p>
      <motion.label
        whileHover={{ scale: 1.05 }}
        className="inline-block px-4 py-2 bg-gradient-to-r from-cc-blue to-cc-pink text-cc-dark text-sm font-bold rounded-lg cursor-pointer flex items-center gap-2"
      >
        <HeroIcon name="folder" size="sm" color="default" className="!text-cc-dark" />
        Choose Files
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          accept=".pdf,.xlsx,.xls,.docx,.doc"
          disabled={uploading}
        />
      </motion.label>
      {uploading && (
        <div className="text-xs text-cc-mint mt-3 flex items-center justify-center gap-1">
          <HeroIcon name="arrow-path" size="xs" color="primary" className="animate-spin" />
          Uploading...
        </div>
      )}
    </motion.div>
  )
}
