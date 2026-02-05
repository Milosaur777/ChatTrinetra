import { useState, useEffect } from 'react'
import api from '../services/api'

export default function HealthIndicator() {
  const [isHealthy, setIsHealthy] = useState(true)

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await api.get('/health')
        setIsHealthy(true)
      } catch {
        setIsHealthy(false)
      }
    }

    // Check immediately on mount
    checkHealth()

    // Then check every 60 seconds
    const interval = setInterval(checkHealth, 60000)
    return () => clearInterval(interval)
  }, [])

  if (isHealthy) return null

  return (
    <div
      className="fixed top-4 right-4 z-50 text-red-500 text-lg"
      title="Backend is currently down"
    >
      ℹ️
    </div>
  )
}
