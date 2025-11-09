import { defineNuxtPlugin } from '#app'
import { useAuthStore } from '@/stores/auth'
import { getCurrentUser } from '@/services/auth'

export default defineNuxtPlugin(async () => {
  // Only run on client side
  if (import.meta.server) return

  const auth = useAuthStore()

  // If token exists, verify it by fetching user info
  if (auth.token) {
    try {
      // Verify token by fetching current user
      const user = await getCurrentUser()
      auth.setUser(user?.data || user || user?.user)
    } catch (error: any) {
      // Token is invalid or expired
      if (error?.response?.status === 401) {
        // Clear invalid token (don't show logout message)
        auth.setToken(null)
        auth.setUser(null)
      }
    }
  }
})

