import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr: false,
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss','@element-plus/nuxt'],
  css: ['~/assets/css/tailwind.css', 'element-plus/dist/index.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  },
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        }
      }
    }
  },
  devServer: {
    port: 5173,
    host: "localhost", // 可选，用于局域网访问
  },
})
