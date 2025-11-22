import api from './axiosClient'
export const register = (payload:any) => api.post('/api/auth/register', payload)
export const login = (payload:any) => api.post('/api/auth/login', payload)
export const me = () => api.get('/api/auth/me')
export const updateUser = (payload:any) => api.put('/api/auth/update', payload)
export const forgotPassword = (payload:{ email: string }) => api.post('/api/auth/forgot-password', payload)

// Admin user management
export const adminUpdateUser = (id:string, payload:any) => api.put(`/api/admin/users/${id}`, payload)
export const adminResetUserPassword = (id:string) => api.post(`/api/admin/users/${id}/reset-password`)
