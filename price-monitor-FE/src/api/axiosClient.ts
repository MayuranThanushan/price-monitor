import axios from 'axios'

const api = axios.create({
  baseURL: (import.meta as any)?.env?.VITE_API_URL || 'http://localhost:4000',
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
