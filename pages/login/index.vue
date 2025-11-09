<template>
  <div class="auth-page">
    <div class="auth-card">
      <h2 class="auth-title">登录</h2>
      <el-form :model="form" ref="formRef" status-icon>
        <el-form-item label="用户名" prop="username" :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]">
          <el-input v-model="form.username" autocomplete="username" />
        </el-form-item>
        <el-form-item label="密码" prop="password" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
          <el-input v-model="form.password" type="password" autocomplete="current-password" show-password />
        </el-form-item>
        <div class="auth-actions">
          <el-button type="primary" :loading="loading" @click="onSubmit">登录</el-button>
          <NuxtLink to="/register" class="auth-link">没有账号？注册</NuxtLink>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'blank'
})

import { login, getCurrentUser } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const formRef = ref()
const form = reactive({ username: '', password: '' })
const loading = ref(false)
const auth = useAuthStore()

const onSubmit = async () => {
  if (!form.username || !form.password) {
    ElMessage.warning('请填写用户名与密码')
    return
  }
  loading.value = true
  try {
    const res = await login({ username: form.username, password: form.password })
    // if backend returns token only, then fetch profile
    if (!auth.user) {
      try {
        const me = await getCurrentUser()
        auth.setUser(me?.data || me)
      } catch (e) {}
    }
    navigateTo('/')
  } catch (e) {
    // error handled by axios interceptor
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  @apply min-h-screen flex items-center justify-center;
  background: linear-gradient(to bottom, #f0f9ff 0%, #faf5ff 100%);
  position: relative;
}

.auth-page::before {
  content: '';
  @apply absolute inset-0 opacity-30;
  background-image: 
    linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px);
  background-size: 2rem 2rem;
}

.auth-card {
  @apply w-full max-w-md p-8 rounded-lg shadow-lg relative z-10;
  background: white;
  border: 1px solid #e2e8f0;
}

.auth-title {
  @apply text-2xl mb-6 font-bold;
  color: #1e3a8a;
}

.auth-actions {
  @apply flex items-center justify-between mt-6;
}

.auth-link {
  @apply transition-colors;
  color: #3b82f6;
  text-decoration: none;
}

.auth-link:hover {
  color: #2563eb;
}
</style>
