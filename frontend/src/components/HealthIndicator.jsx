import { useState, useEffect, useRef } from 'react'
import api from '../services/api'

const pulsingDotStyles = `
  @keyframes pulse-indicator {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.8;
    }
  }
  
  .health-indicator-pulse {
    animation: pulse-indicator 1s infinite;
  }
`

export default function HealthIndicator() {
  const [isHealthy, setIsHealthy] = useState(true)
  const [showPopover, setShowPopover] = useState(false)
  const [lastError, setLastError] = useState(null)
  const prevHealthStatusRef = useRef(true)

  // Check backend health every 60 seconds (less aggressive)
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await api.get('/health')
        const newStatus = response.status === 200
        
        // Only update state if status actually changed
        if (newStatus !== prevHealthStatusRef.current) {
          setIsHealthy(newStatus)
          prevHealthStatusRef.current = newStatus
          
          if (newStatus) {
            setLastError(null)
          }
        }
      } catch (error) {
        const newStatus = false
        
        // Only update state if status actually changed
        if (newStatus !== prevHealthStatusRef.current) {
          setIsHealthy(newStatus)
          prevHealthStatusRef.current = newStatus
          setLastError(error.message || 'Backend unreachable')
          // Don't auto-show popover, only show on user click
        }
      }
    }

    // Check immediately on mount
    checkHealth()

    // Then check every 60 seconds (increased from 30 to reduce polling)
    const interval = setInterval(checkHealth, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <style>{pulsingDotStyles}</style>
      
      {/* Status Indicator - Top Right */}
      <div className="fixed top-4 right-4 z-50">
        {/* Indicator Button */}
        <button
          onClick={() => setShowPopover(!showPopover)}
          className="relative flex items-center gap-2 px-3 py-2 rounded-full bg-cc-darker border border-cc-border hover:border-cc-accent transition-colors cursor-pointer"
        >
          {/* Pulsing dot - CSS animation only */}
          <div
            className={`w-2 h-2 rounded-full ${
              isHealthy ? 'bg-green-500' : 'bg-red-500'
            } ${!isHealthy ? 'health-indicator-pulse' : ''}`}
          />
          <span className="text-xs font-mono text-cc-text">
            {isHealthy ? 'Backend OK' : 'Backend Down'}
          </span>
        </button>

        {/* Popover - Simple CSS display toggle */}
        {showPopover && !isHealthy && (
          <div className="absolute right-0 mt-2 w-80 bg-cc-darker border-2 border-red-500 rounded-lg p-4 shadow-2xl">
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
          </div>
        )}
      </div>
    </>
  )
}
