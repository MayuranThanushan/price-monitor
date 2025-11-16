import create from 'zustand'

type AuthState = {
  token: string | null
  user: { id?: string; name?: string; email?: string } | null
  setAuth: (token: string, user: any) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('pm_token'),
  user: JSON.parse(localStorage.getItem('pm_user') || 'null'),
  setAuth: (token, user) => {
    localStorage.setItem('pm_token', token)
    localStorage.setItem('pm_user', JSON.stringify(user))
    set({ token, user })
  },
  clearAuth: () => {
    localStorage.removeItem('pm_token')
    localStorage.removeItem('pm_user')
    set({ token: null, user: null })
  }
}))
