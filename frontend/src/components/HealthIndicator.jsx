import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'

export default function HealthIndicator() {
  const [isHealthy, setIsHealthy] = useState(true)
  const [showPopover, setShowPopover] = useState(false)
  const [lastError, setLastError] = useState(null)

  // Check backend health every 30 seconds
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await api.get('/health')
        if (response.status === 200) {
          setIsHealthy(true)
          setLastError(null)
        }
      } catch (error) {
        setIsHealthy(false)
        setLastError(error.message || 'Backend unreachable')
        setShowPopover(true)
      }
    }

    // Check immediately on mount
    checkHealth()

    // Then check every 30 seconds
    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Status Indicator - Top Right */}
      <motion.div
        className="fixed top-4 right-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Indicator Dot */}
        <motion.button
          onClick={() => setShowPopover(!showPopover)}
          className="relative flex items-center gap-2 px-3 py-2 rounded-full bg-cc-darker border border-cc-border hover:border-cc-accent transition-colors cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Pulsing dot */}
          <motion.div
            className={`w-2 h-2 rounded-full ${
              isHealthy ? 'bg-green-500' : 'bg-red-500'
            }`}
            animate={!isHealthy ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1, repeat: !isHealthy ? Infinity : 0 }}
          />
          <span className="text-xs font-mono text-cc-text">
            {isHealthy ? 'Backend OK' : 'Backend Down'}
          </span>
        </motion.button>

        {/* Popover */}
        <AnimatePresence>
          {showPopover && !isHealthy && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-80 bg-cc-darker border-2 border-red-500 rounded-lg p-4 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <h3 className="font-bold text-red-500">Backend Unavailable</h3>
              </div>

              {/* Error Message */}
              <p className="text-sm text-cc-text mb-3">
                The backend server is not responding. This might mean:
              </p>

              {/* Troubleshooting Tips */}
              <ul className="text-xs text-cc-text-muted space-y-2 mb-4 list-disc list-inside">
                <li>Server crashed or was restarted</li>
                <li>Network connection issue</li>
                <li>Port 3001 is blocked by firewall</li>
                <li>Database is locked or corrupted</li>
              </ul>

              {/* Error Details */}
              {lastError && (
                <div className="bg-cc-dark rounded p-2 mb-3 border border-red-900">
                  <p className="text-xs font-mono text-red-400">{lastError}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded transition-colors"
                >
                  Reload Page
                </button>
                <button
                  onClick={() => setShowPopover(false)}
                  className="flex-1 px-3 py-2 bg-cc-darker border border-cc-border hover:border-cc-accent text-cc-text text-xs font-bold rounded transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
