import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import api from '../services/api'
import HeroIcon from './Icon'

export default function ChatWindow({ conversation, files, onConversationUpdate }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('openrouter/anthropic/claude-haiku-4.5')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState(conversation?.title || '')
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState(null)
  const [currentConversation, setCurrentConversation] = useState(conversation)
  const messagesEndRef = useRef(null)
  const editInputRef = useRef(null)

  // Available models
  const models = [
    // Local Models (FREE!)
    { 
      value: 'ollama', 
      label: 'Ollama Local (Private)',
      description: 'Mistral 7B'
    },
    // OpenAI Models
    { 
      value: 'openai/gpt-4o', 
      label: 'GPT-4o (Latest)',
      description: 'Best performance'
    },
    { 
      value: 'openai/gpt-4-turbo', 
      label: 'GPT-4 Turbo',
      description: 'Fast & powerful'
    },
    { 
      value: 'openai/gpt-3.5-turbo', 
      label: 'GPT-3.5 Turbo',
      description: 'Budget friendly'
    },
    // OpenRouter Models
    { 
      value: 'openrouter/anthropic/claude-haiku-4.5', 
      label: 'Haiku (Fast & Cheap)',
      description: '$0.25/M tokens'
    },
    { 
      value: 'openrouter/google/gemini-flash-1.5', 
      label: 'Gemini Flash (Fast)',
      description: '$0.15/M tokens'
    },
    { 
      value: 'openrouter/anthropic/claude-sonnet-4.5', 
      label: 'Sonnet (Smart)',
      description: '$3/M tokens'
    },
    { 
      value: 'openrouter/anthropic/claude-opus-4', 
      label: 'Opus (Best)',
      description: '$15/M tokens'
    },
  ]

  // Fetch messages when conversation changes
  useEffect(() => {
    if (conversation) {
      setCurrentConversation(conversation)
      setEditedTitle(conversation.title)
      setIsEditingTitle(false)
      setEditError(null)
      fetchMessages()
    }
  }, [conversation])

  // Focus edit input when in edit mode
  useEffect(() => {
    if (isEditingTitle && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [isEditingTitle])

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/chat/history/${conversation.id}`)
      setMessages(response.data)
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  const handleSaveTitle = async () => {
    if (!editedTitle.trim()) {
      setEditError('Title cannot be empty')
      return
    }

    if (editedTitle === currentConversation.title) {
      setIsEditingTitle(false)
      return
    }

    setEditLoading(true)
    setEditError(null)

    try {
      const response = await api.patch(`/conversations/${currentConversation.id}`, {
        title: editedTitle.trim()
      })

      if (response.data.success) {
        setCurrentConversation(response.data.conversation)
        setIsEditingTitle(false)
        // Notify parent component of the update
        if (onConversationUpdate) {
          onConversationUpdate(response.data.conversation)
        }
      }
    } catch (error) {
      console.error('Failed to update conversation:', error)
      setEditError('Failed to save. Please try again.')
    } finally {
      setEditLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditedTitle(currentConversation.title)
    setIsEditingTitle(false)
    setEditError(null)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveTitle()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage = newMessage
    setNewMessage('')
    
    // Get selected file IDs
    const selectedFileIds = files
      .filter(f => selectedFiles.includes(f.id))
      .map(f => f.id)
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString()
    }])

    setLoading(true)
    try {
      const response = await api.post('/chat/send', {
        conversation_id: currentConversation.id,
        project_id: currentConversation.project_id,
        message: userMessage,
        referenced_file_ids: selectedFileIds,
        model: selectedModel
      })

      setMessages(prev => [...prev, {
        id: response.data.assistant_message_id,
        role: 'assistant',
        content: response.data.response,
        created_at: new Date().toISOString()
      }])
    } catch (error) {
      console.error('Failed to send message:', error)
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Failed to send message. Make sure backend is running on port 3001.',
        created_at: new Date().toISOString()
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-effect p-6 rounded-xl h-full flex flex-col"
    >
      {/* Header */}
      <div className="mb-4 pb-4 border-b border-glass">
        {isEditingTitle ? (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <input
                ref={editInputRef}
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Conversation title..."
                disabled={editLoading}
                className="flex-1 px-3 py-2 glass-effect text-cc-text placeholder-cc-text-muted text-base focus:outline-none focus:border-cc-mint disabled:opacity-50"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveTitle}
                disabled={editLoading || !editedTitle.trim()}
                className="px-3 py-2 bg-cc-mint text-cc-dark text-sm font-bold rounded hover:opacity-90 disabled:opacity-50 flex items-center gap-1"
                title="Save"
              >
                <HeroIcon name="check-circle" size="sm" color="default" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancelEdit}
                disabled={editLoading}
                className="px-3 py-2 glass-effect text-cc-text text-sm font-bold rounded hover:border-cc-orange disabled:opacity-50"
                title="Cancel"
              >
                <HeroIcon name="x-mark" size="sm" color="error" />
              </motion.button>
            </div>
            {editError && (
              <p className="text-xs text-cc-pink">{editError}</p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between group">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-cc-text">{currentConversation.title}</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditingTitle(true)}
                  className="opacity-0 group-hover:opacity-100 text-cc-text-muted hover:text-cc-mint"
                  title="Edit conversation title"
                >
                  <HeroIcon name="pencil-square" size="sm" color="muted" className="hover:!text-cc-mint" />
                </motion.button>
              </div>
              <p className="text-xs text-cc-text-muted">{currentConversation.description || 'No description'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div className="text-cc-text-muted">
              <div className="mb-2">
                <HeroIcon name="chat-bubble-left" size="xl" color="muted" className="mx-auto" />
              </div>
              <p>Start a conversation</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-cc-mint to-cc-blue text-cc-dark'
                    : 'glass-effect text-cc-text'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </motion.div>
          ))
        )}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="px-4 py-3 glass-effect rounded-xl">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-cc-mint animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-cc-blue animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 rounded-full bg-cc-pink animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Model Selector + File Selection + Input Area */}
      <div className="space-y-3">
        {/* File Selection */}
        {files.length > 0 && (
          <div className="flex gap-2 items-center flex-wrap">
            <label className="text-xs font-semibold text-cc-text-muted flex items-center gap-1">
              <HeroIcon name="folder" size="xs" color="muted" />
              Attach files:
            </label>
            {files.map(file => (
              <motion.button
                key={file.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedFiles(prev => 
                    prev.includes(file.id)
                      ? prev.filter(id => id !== file.id)
                      : [...prev, file.id]
                  )
                }}
                className={`px-3 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
                  selectedFiles.includes(file.id)
                    ? 'bg-cc-mint text-cc-dark'
                    : 'glass-effect text-cc-text hover:border-cc-mint'
                }`}
                title={`${file.file_size} bytes`}
              >
                <HeroIcon name="document" size="xs" color="default" className={selectedFiles.includes(file.id) ? '!text-cc-dark' : ''} />
                {file.filename}
              </motion.button>
            ))}
          </div>
        )}

        {/* Model Selector */}
        <div className="flex gap-2 items-center">
          <label className="text-xs font-semibold text-cc-text-muted">Model:</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={loading}
            className="flex-1 px-3 py-2 glass-effect text-cc-text text-sm focus:outline-none focus:border-cc-mint disabled:opacity-50"
            title="Select AI model for this conversation"
          >
            {models.map(model => (
              <option key={model.value} value={model.value}>
                {model.label} - {model.description}
              </option>
            ))}
          </select>
        </div>

        {/* Input Area */}
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1 px-4 py-3 glass-effect text-cc-text placeholder-cc-text-muted focus:outline-none focus:border-cc-mint disabled:opacity-50"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={loading || !newMessage.trim()}
            className="px-6 py-3 bg-gradient-to-r from-cc-pink to-cc-orange text-cc-dark font-bold rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
            title="Send message"
          >
            {loading ? (
              <HeroIcon name="arrow-path" size="sm" color="default" className="animate-spin" />
            ) : (
              <HeroIcon name="paper-airplane" size="sm" color="default" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
