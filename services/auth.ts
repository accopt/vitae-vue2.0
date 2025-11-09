import { useApi } from '@/composables/useApi'
import { useAuthStore } from '@/stores/auth'

export const login = async (data: { username: string; password: string }) => {
  const api = useApi()
  const res = await api.post('/auth/login', data)
  // expect res.data or res to contain token; adapt based on backend
  const payload = res?.data || res
  const token = payload?.token || payload?.data?.token
  const user = payload?.user || payload?.data?.user || null
  const auth = useAuthStore() 
  if (token) auth.setToken(token)
  if (user) auth.setUser(user)
  return payload
}

export const register = async (data: { username: string; password: string; email?: string }) => {
  const api = useApi()
  const res = await api.post('/auth/register', data)
  return res
}

export const getCurrentUser = async () => {
  const api = useApi()
  const res = await api.get('/auth/me')
  return res?.data || res
}

export const updateUserInfo = async (data: { username?: string; email?: string; avatar?: string; [key: string]: any }) => {
  const api = useApi()
  const res = await api.put('/auth/profile', data)
  const payload = res?.data || res
  const user = payload?.user || payload?.data || payload
  const auth = useAuthStore()
  if (user) auth.setUser(user)
  return payload
}

export const changePassword = async (data: { oldPassword: string; newPassword: string }) => {
  const api = useApi()
  const res = await api.put('/auth/password', data)
  return res?.data || res
}
