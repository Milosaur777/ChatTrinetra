import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import api from '../services/api'
import ChatWindow from './ChatWindow'
import FileUpload from './FileUpload'
import HeroIcon from './Icon'

export default function ProjectDashboard({ project }) {
  const [conversations, setConversations] = useState([])
  const [files, setFiles] = useState([])
  const [selectedConv, setSelectedConv] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showNewConv, setShowNewConv] = useState(false)
  const [newConvTitle, setNewConvTitle] = useState('')

  // Fetch conversations and files
  useEffect(() => {
    if (project) {
      fetchData()
    }
  }, [project])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [convRes, filesRes] = await Promise.all([
        api.get(`/conversations/project/${project.id}`),
        api.get(`/files/project/${project.id}`)
      ])
      setConversations(convRes.data)
      setFiles(filesRes.data)
      if (convRes.data.length > 0) {
        setSelectedConv(convRes.data[0])
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateConversation = async () => {
    if (!newConvTitle.trim()) return

    try {
      const response = await api.post('/conversations', {
        project_id: project.id,
        title: newConvTitle
      })
      setConversations([response.data, ...conversations])
      setSelectedConv(response.data)
      setNewConvTitle('')
      setShowNewConv(false)
    } catch (error) {
      console.error('Failed to create conversation:', error)
    }
  }

  const handleConversationUpdate = (updatedConversation) => {
    // Update the conversation in the list
    setConversations(conversations.map(conv =>
      conv.id === updatedConversation.id ? updatedConversation : conv
    ))
    // Update the selected conversation
    setSelectedConv(updatedConversation)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Stats Bento */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <motion.div variants={itemVariants} className="glass-effect p-4 rounded-xl">
          <div className="mb-2">
            <HeroIcon name="chat-bubble-left" size="lg" color="primary" />
          </div>
          <div className="text-2xl font-bold text-cc-text">{conversations.length}</div>
          <div className="text-xs text-cc-text-muted">Conversations</div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-effect p-4 rounded-xl">
          <div className="mb-2">
            <HeroIcon name="document" size="lg" color="primary" />
          </div>
          <div className="text-2xl font-bold text-cc-text">{files.length}</div>
          <div className="text-xs text-cc-text-muted">Files Uploaded</div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-effect p-4 rounded-xl">
          <div className="mb-2">
            <HeroIcon name="cog" size="lg" color="primary" />
          </div>
          <div className="text-sm font-semibold text-cc-mint truncate">{project.tone}</div>
          <div className="text-xs text-cc-text-muted">Tone</div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-effect p-4 rounded-xl">
          <div className="mb-2">
            <HeroIcon name="globe-alt" size="lg" color="primary" />
          </div>
          <div className="text-sm font-semibold text-cc-blue truncate">{project.language}</div>
          <div className="text-xs text-cc-text-muted">Language</div>
        </motion.div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        {/* Left: Conversations + Files */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-4 overflow-hidden"
        >
          {/* Conversations */}
          <div className="glass-effect p-4 rounded-xl flex flex-col gap-4 overflow-hidden flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-cc-text">Conversations</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNewConv(!showNewConv)}
                className="text-cc-mint hover:text-cc-blue"
              >
                +
              </motion.button>
            </div>

            {showNewConv && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newConvTitle}
                  onChange={(e) => setNewConvTitle(e.target.value)}
                  placeholder="Conversation title..."
                  className="flex-1 px-3 py-2 glass-effect text-cc-text placeholder-cc-text-muted text-sm focus:outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateConversation()}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleCreateConversation}
                  className="px-3 py-2 bg-cc-mint text-cc-dark text-sm font-bold rounded"
                >
                  Go
                </motion.button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto space-y-2">
              {conversations.map((conv) => (
                <motion.button
                  key={conv.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedConv(conv)}
                  className={`w-full p-3 rounded-lg text-left text-sm transition-all ${
                    selectedConv?.id === conv.id
                      ? 'glass-effect border-2 border-cc-mint'
                      : 'glass-effect hover:border-cc-text border border-glass'
                  }`}
                >
                  <div className="font-semibold text-cc-text truncate">{conv.title}</div>
                  <div className="text-xs text-cc-text-muted">
                    {new Date(conv.created_at).toLocaleDateString()}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Files */}
          <FileUpload projectId={project.id} onUpload={fetchData} />
        </motion.div>

        {/* Right: Chat Window */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 overflow-hidden"
        >
          {selectedConv ? (
            <ChatWindow 
              conversation={selectedConv} 
              files={files}
              onConversationUpdate={handleConversationUpdate}
            />
          ) : (
            <div className="glass-effect p-8 rounded-xl h-full flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4">
                  <HeroIcon name="chat-bubble-left" size="xl" color="muted" className="mx-auto" />
                </div>
                <p className="text-cc-text-muted">Create or select a conversation to start</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
