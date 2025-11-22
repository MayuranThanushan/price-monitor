import axios from 'axios'

// Determine API base URL (priority: explicit env -> legacy env name -> window -> localhost)
const env = (import.meta as any)?.env || {}
const explicit = env.VITE_API_BASE_URL || env.VITE_API_URL || 'https://pricemonitor-production.up.railway.app'
let derived = explicit
if (!derived && typeof window !== 'undefined') {
  // If frontend served from same domain, attempt relative API path assumption
  const origin = window.location.origin
  // If production domain detected, prefer it
  if (/pricemonitor-production\.up\.railway\.app/.test(origin)) {
    derived = origin
  }
}
const baseURL = derived || 'https://pricemonitor-production.up.railway.app'

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
