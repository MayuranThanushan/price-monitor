import axios from 'axios'

// Resolve base host from env with backward compatibility
const env = (import.meta as any)?.env || {}
let host = env.VITE_API_BASE_URL || env.VITE_API_URL || ''
if (!host && typeof window !== 'undefined') host = window.location.origin
if (!host) host = 'https://pricemonitor-production.up.railway.app'

// Ensure single /api suffix (backend mounts routes under /api/*)
const baseURL = host.replace(/\/$/, '').match(/\/api$/) ? host : host.replace(/\/$/, '') + '/api'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('pm_token')
  if (token) {
    // ensure headers is a plain object we can assign to
    const headers = (cfg.headers as Record<string, string> | undefined) || {}
    headers.Authorization = `Bearer ${token}`
    cfg.headers = headers as any
  }
  return cfg
})

export default api
export { baseURL }
