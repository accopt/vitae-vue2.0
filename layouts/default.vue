<template>
  <div class="layout-container">
    <!-- 顶部导航栏 -->
    <header class="navbar">
      <nav class="navbar-inner">
        <div class="navbar-content">
          <!-- Logo -->
          <NuxtLink to="/" class="navbar-logo">
            <span class="navbar-logo-icon">⭐</span>
            <span class="navbar-logo-text">CareerAI</span>
          </NuxtLink>

          <!-- 导航链接 -->
          <div class="navbar-links">
            <NuxtLink to="/create" class="navbar-link">AI写简历</NuxtLink>
            <NuxtLink to="/achievement" class="navbar-link">成就库</NuxtLink>
            <!-- <NuxtLink to="/pricing" class="navbar-link">定价</NuxtLink> -->
          </div>

          <!-- 右侧按钮 -->
          <div class="navbar-actions">
            <template v-if="!auth.isAuthenticated">
              <NuxtLink to="/login" class="navbar-action-link">登录</NuxtLink>
              <NuxtLink to="/register" class="navbar-action-btn">开始使用</NuxtLink>
            </template>
            <template v-else>
              <el-dropdown @command="handleCommand" trigger="click">
                <div class="user-avatar-wrapper">
                  <div v-if="auth.user?.avatar" class="user-avatar">
                    <img :src="auth.user.avatar" :alt="auth.user.username" />
                  </div>
                  <div v-else class="user-avatar user-avatar-placeholder">
                    {{ getFirstChar(auth.user?.username || '用户') }}
                  </div>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="profile">
                      <span class="dropdown-item-content">
                        <span class="dropdown-item-icon">👤</span>
                        <span>个人信息</span>
                      </span>
                    </el-dropdown-item>
                    <el-dropdown-item divided command="logout">
                      <span class="dropdown-item-content">
                        <span class="dropdown-item-icon">🚪</span>
                        <span>退出登录</span>
                      </span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </div>
        </div>
      </nav>
    </header>

    <!-- 主要内容区域 -->
    <main class="layout-main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const getFirstChar = (text: string) => {
  if (!text) return '用'
  return text.charAt(0).toUpperCase()
}

const handleCommand = (command: string) => {
  if (command === 'profile') {
    navigateTo('/profile')
  } else if (command === 'logout') {
    handleLogout()
  }
}

const handleLogout = () => {
  auth.logout()
}
</script>

<style scoped>
.layout-container {
  @apply min-h-screen;
  background: linear-gradient(to bottom, #f0f9ff 0%, #faf5ff 100%);
}

.navbar {
  @apply border-b bg-white/80 backdrop-blur-sm shadow-sm;
  border-color: #e2e8f0;
}

.navbar-inner {
  @apply container mx-auto px-4 sm:px-6 lg:px-8;
}

.navbar-content {
  @apply flex items-center justify-between h-16;
}

.navbar-logo {
  @apply flex items-center space-x-2;
  text-decoration: none;
}

.navbar-logo-icon {
  @apply text-lg;
  color: #3b82f6;
}

.navbar-logo-text {
  @apply text-xl font-semibold;
  color: #1e293b;
}

.navbar-links {
  @apply hidden md:flex items-center space-x-8;
}

.navbar-link {
  @apply transition-colors;
  color: #475569;
  text-decoration: none;
}

.navbar-link:hover {
  color: #1e293b;
}

.navbar-actions {
  @apply flex items-center space-x-4;
}

.navbar-action-link {
  @apply px-4 py-2 transition-colors;
  color: #475569;
  text-decoration: none;
}

.navbar-action-link:hover {
  color: #1e293b;
}

.navbar-action-btn {
  @apply px-4 py-2 rounded-md transition-colors text-white;
  background: #3b82f6;
  text-decoration: none;
}

.navbar-action-btn:hover {
  background: #2563eb;
}

.user-avatar-wrapper {
  @apply cursor-pointer;
}

.user-avatar {
  @apply w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold transition-all;
  background: #3b82f6;
}

.user-avatar:hover {
  background: #2563eb;
  transform: scale(1.05);
}

.user-avatar img {
  @apply w-full h-full rounded-full object-cover;
}

.user-avatar-placeholder {
  @apply text-sm;
}

.dropdown-item-content {
  @apply flex items-center space-x-2;
}

.dropdown-item-icon {
  @apply text-base;
}

.layout-main {
  @apply flex-1;
}
</style>
