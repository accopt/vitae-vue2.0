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
      // 如果是 blob 响应（PDF下载等），不处理 message，直接返回
      if (res.config.responseType === 'blob' || res.data instanceof Blob) {
        return res
      }
      // assume API returns {message, ...}
      if (res?.data?.message) ElMessage.success(res.data.message)
      return res
    },
    (error) => {
      // 如果是 blob 响应出错，尝试从错误响应中提取消息
      if (error?.config?.responseType === 'blob' && error?.response?.data instanceof Blob) {
        // 尝试读取 blob 中的错误信息
        error.response.data.text().then((text: string) => {
          try {
            const json = JSON.parse(text)
            if (json.message) {
              ElMessage.error(json.message)
            }
          } catch (e) {
            ElMessage.error('下载失败，请重试')
          }
        }).catch(() => {
          ElMessage.error('下载失败，请重试')
        })
      } else {
        const msg = error?.response?.data?.message || error.message || '请求出错'
        ElMessage.error(msg)
      }
      if (error?.response?.status === 401) {
        try { const auth = useAuthStore(); auth.logout() } catch (e) {}
      }
      return Promise.reject(error)
    }
  )

  return { provide: { axios: instance, $axios: instance } }
})
