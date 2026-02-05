import axios from 'axios'

// Always use /api which NGINX proxies to backend
// NGINX config routes /api/* to localhost:3001
const baseURL = '/api'

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
