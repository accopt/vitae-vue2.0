import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  // Allow access to login and register without token
  if (to.path === '/login' || to.path === '/register') return
  if (!auth.token) {
    return navigateTo('/login')
  }
})
