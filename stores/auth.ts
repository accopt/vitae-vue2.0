import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { ref, watch, computed } from 'vue'

// localStorage key constants
const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

// Helper functions for localStorage (SSR-safe)
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  if (import.meta.server) return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

const setToStorage = (key: string, value: any): void => {
  if (import.meta.server) return
  try {
    if (value === null || value === undefined) {
      localStorage.removeItem(key)
    } else {
      localStorage.setItem(key, JSON.stringify(value))
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

export const useAuthStore = defineStore('auth', () => {
  // Initialize from localStorage
  const token = ref<string | null>(getFromStorage(TOKEN_KEY, null))
  const user = ref<any>(getFromStorage(USER_KEY, null))

  // Watch for changes and sync to localStorage
  watch(token, (newVal) => {
    setToStorage(TOKEN_KEY, newVal)
  }, { immediate: false })

  watch(user, (newVal) => {
    setToStorage(USER_KEY, newVal)
  }, { immediate: false })

  const setToken = (val: string | null) => {
    token.value = val
  }

  const setUser = (val: any) => {
    user.value = val
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    ElMessage.success('已退出登录')
    // Navigation will be handled by middleware or the caller
    // For immediate redirect, we can use window.location in client
    if (import.meta.client && typeof window !== 'undefined') {
      // Use setTimeout to allow state updates to complete
      setTimeout(() => {
        window.location.href = '/login'
      }, 100)
    }
  }

  // Check if user is authenticated
  const isAuthenticated = computed(() => !!token.value)

  return { token, user, setToken, setUser, logout, isAuthenticated }
})
