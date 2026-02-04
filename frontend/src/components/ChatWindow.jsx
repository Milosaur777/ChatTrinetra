import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import api from '../services/api'

export default function ChatWindow({ conversation, files }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('openrouter/anthropic/claude-haiku-4.5')
  const [selectedFiles, setSelectedFiles] = useState([])
  const messagesEndRef = useRef(null)

  // Available models
  const models = [
    { 
      value: 'openrouter/anthropic/claude-haiku-4.5', 
      label: '💰 Haiku (Fast & Free)',
      description: '$0.25/M tokens'
    },
    { 
      value: 'openrouter/moonshotai/kimi-k2.5', 
      label: '🎯 Kimi K2.5 (Great for Code)',
      description: 'FREE this week!'
    },
    { 
      value: 'openrouter/google/gemini-flash-1.5', 
      label: '⚡ Gemini Flash (Fast)',
      description: '$0.15/M tokens'
    },
    { 
      value: 'openrouter/anthropic/claude-sonnet-4.5', 
      label: '🧠 Sonnet (Smart)',
      description: '$3/M tokens'
    },
    { 
      value: 'openrouter/anthropic/claude-opus-4', 
      label: '💎 Opus (Best)',
      description: '$15/M tokens'
    },
    { 
      value: 'ollama/llama2', 
      label: '🔒 Ollama Local (Private)',
      description: 'Run locally, 100% private'
    },
  ]

  // Fetch messages when conversation changes
  useEffect(() => {
    if (conversation) {
      fetchMessages()
    }
  }, [conversation])

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
        conversation_id: conversation.id,
        project_id: conversation.project_id,
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
        content: '❌ Failed to send message. Make sure backend is running on port 3001.',
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
        <h3 className="text-lg font-bold text-cc-text">{conversation.title}</h3>
        <p className="text-xs text-cc-text-muted">{conversation.description || 'No description'}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div className="text-cc-text-muted">
              <div className="text-4xl mb-2">👋</div>
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
            <label className="text-xs font-semibold text-cc-text-muted">Attach files:</label>
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
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  selectedFiles.includes(file.id)
                    ? 'bg-cc-mint text-cc-dark'
                    : 'glass-effect text-cc-text hover:border-cc-mint'
                }`}
                title={`${file.file_size} bytes`}
              >
                📎 {file.filename}
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
            className="px-6 py-3 bg-gradient-to-r from-cc-pink to-cc-orange text-cc-dark font-bold rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {loading ? '⏳' : '✈️'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
