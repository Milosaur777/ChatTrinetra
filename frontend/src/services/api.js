import axios from 'axios'

// Determine API URL based on environment
let baseURL = '/api'

// If frontend and backend are on different hosts, use full URL
if (import.meta.env.VITE_API_URL) {
  baseURL = import.meta.env.VITE_API_URL
} else if (!import.meta.env.DEV && window.location.hostname !== 'localhost') {
  // In production on a remote host, use the same domain but port 3001
  baseURL = `http://${window.location.hostname}:3001/api`
}

console.log('📡 API Base URL:', baseURL)

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default api
