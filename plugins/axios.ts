import { defineNuxtPlugin } from '#app'
import axios, { AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const instance = axios.create({
    baseURL: config.public.apiBase,
    timeout: 10000,
  })

  instance.interceptors.request.use((req) => {
    try {
      const auth = useAuthStore()
      if (auth.token) req.headers = req.headers || {}
      if (auth.token) req.headers.Authorization = `Bearer ${auth.token}`
    } catch (e) {}
    return req
  })

  instance.interceptors.response.use(
    (res: AxiosResponse) => {
      // assume API returns {message, ...}
      if (res?.data?.message) ElMessage.success(res.data.message)
      return res
    },
    (error) => {
      const msg = error?.response?.data?.message || error.message || '请求出错'
      ElMessage.error(msg)
      if (error?.response?.status === 401) {
        try { const auth = useAuthStore(); auth.logout() } catch (e) {}
      }
      return Promise.reject(error)
    }
  )

  return { provide: { axios: instance, $axios: instance } }
})
