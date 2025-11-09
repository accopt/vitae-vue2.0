<template>
  <div class="auth-page">
    <div class="auth-card">
      <h2 class="auth-title">注册</h2>
      <el-form :model="form" ref="formRef">
        <el-form-item label="用户名">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" show-password />
        </el-form-item>
        <div class="auth-actions">
          <el-button type="primary" :loading="loading" @click="onRegister">注册</el-button>
          <NuxtLink to="/login" class="auth-link">已有账号？登录</NuxtLink>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'blank'
})

import { register } from '@/services/auth'
import { ElMessage } from 'element-plus'
const formRef = ref()
const form = reactive({ username: '', email: '', password: '' })
const loading = ref(false)

const onRegister = async () => {
  if (!form.username || !form.password) {
    ElMessage.warning('用户名和密码必填')
    return
  }
  loading.value = true
  try {
    await register(form)
    ElMessage.success('注册成功，请登录')
    navigateTo('/login')
  } catch (e) {
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
