export const useApi = () => {
  const nuxt = useNuxtApp()
  const axios = nuxt.$axios
  return {
    get: (url: string, params?: any, config?: any) => axios.get(url, { params, ...config }),
    post: (url: string, data?: any, config?: any) => axios.post(url, data, config),
    put: (url: string, data?: any, config?: any) => axios.put(url, data, config),
    delete: (url: string, params?: any, config?: any) => axios.delete(url, { params, ...config })
  }
}
