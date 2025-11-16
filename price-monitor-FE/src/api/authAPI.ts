import api from './axiosClient'
export const register = (payload:any) => api.post('/api/auth/register', payload)
export const login = (payload:any) => api.post('/api/auth/login', payload)
export const me = () => api.get('/api/auth/me')
