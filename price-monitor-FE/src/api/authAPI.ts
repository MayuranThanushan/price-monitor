import api from './axiosClient'
// baseURL already ends with /api so strip leading /api from paths
export const register = (payload:any) => api.post('/auth/register', payload)
export const login = (payload:any) => api.post('/auth/login', payload)
export const me = () => api.get('/auth/me')
export const updateUser = (payload:any) => api.put('/auth/update', payload)
export const forgotPassword = (payload:{ email: string }) => api.post('/auth/forgot-password', payload)

// Admin user management
export const adminUpdateUser = (id:string, payload:any) => api.put(`/admin/users/${id}`, payload)
export const adminResetUserPassword = (id:string) => api.post(`/admin/users/${id}/reset-password`)
