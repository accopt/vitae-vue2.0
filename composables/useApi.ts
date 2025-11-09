export const useApi = () => {
  const nuxt = useNuxtApp()
  const axios = nuxt.$axios
  return {
    get: (url: string, params?: any) => axios.get(url, { params }),
    post: (url: string, data?: any) => axios.post(url, data),
    put: (url: string, data?: any) => axios.put(url, data),
    delete: (url: string, params?: any) => axios.delete(url, { params })
  }
}
