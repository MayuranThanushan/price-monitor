import axios from 'axios'

// Resolve base host from env with backward compatibility
const env = (import.meta as any)?.env || {}
let host = env.VITE_API_BASE_URL || env.VITE_API_URL || ''
if (!host && typeof window !== 'undefined') host = window.location.origin
if (!host) host = 'https://pricemonitor-production.up.railway.app'

function resolveHost(){
  const env = (import.meta as any)?.env || {}
  const override = typeof window !== 'undefined' ? window.localStorage.getItem('pm_api_host') : null
  let host = override || env.VITE_API_BASE_URL || env.VITE_API_URL || ''
  if (!host && typeof window !== 'undefined') host = window.location.origin
  // If still pointing to the frontend Vercel domain (no backend env provided) auto-switch to Railway production
  if (host && /price-monitor-three\.vercel\.app$/.test(host) && !override && !env.VITE_API_BASE_URL && !env.VITE_API_URL) {
    host = 'https://pricemonitor-production.up.railway.app'
  }
  if (!host) host = 'https://pricemonitor-production.up.railway.app'
  return host
}

function withApiSuffix(host: string){
  const trimmed = host.replace(/\/$/, '')
  return /\/api$/.test(trimmed) ? trimmed : trimmed + '/api'
}

let baseURL = withApiSuffix(resolveHost())

const api = axios.create({ baseURL, headers: { 'Content-Type': 'application/json' } })

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

export function overrideApiHost(newHost: string){
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('pm_api_host', newHost)
    baseURL = withApiSuffix(newHost)
    api.defaults.baseURL = baseURL
  }
}

export function currentApiHost(){
  return baseURL
}

export default api
export { baseURL }
