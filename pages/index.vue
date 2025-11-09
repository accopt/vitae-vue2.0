<template>
  <div class="hero-container">
    <!-- 背景网格效果 -->
    <div class="hero-grid-bg"></div>
    
    <!-- 主要内容区域 -->
    <div class="hero-content">
      <div class="hero-wrapper">
        <!-- 小标题 -->
        <div class="hero-subtitle">
          <span class="hero-subtitle-icon">⭐</span>
          <span class="hero-subtitle-text">AI驱动的职业成长平台</span>
        </div>

        <!-- 大标题 -->
        <h1 class="hero-title">
          <div class="hero-title-line">记录每一个成就</div>
          <div class="hero-title-line">定制每一份简历</div>
        </h1>

        <!-- 描述文字 -->
        <p class="hero-description">
          构建你的职业成就库，让AI帮你智能优化。模块化组装、实时编辑、一键导出专业简历，从长期积累到高效求职的完整解决方案。
        </p>

        <!-- 操作按钮 -->
        <div class="hero-actions">
          <NuxtLink to="/create" class="btn-primary">
            <span>开始创建简历</span>
            <span class="btn-arrow">→</span>
          </NuxtLink>
          <button class="btn-secondary">
            查看演示
          </button>
        </div>
      </div>
    </div>

    <!-- 统计数据区域 -->
    <div class="stats-section">
      <div class="stats-container">
        <div class="stats-grid">
          <div class="stats-item">
            <div class="stats-number">10K+</div>
            <div class="stats-label">活跃用户</div>
          </div>
          <div class="stats-item">
            <div class="stats-number">50K+</div>
            <div class="stats-label">生成简历</div>
          </div>
          <div class="stats-item">
            <div class="stats-number">95%</div>
            <div class="stats-label">满意度</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 首页使用默认布局（default.vue），无需特别指定
</script>

<style scoped>
.hero-container {
  @apply relative min-h-screen;
  background: linear-gradient(to bottom, #f0f9ff 0%, #faf5ff 100%);
}

.hero-grid-bg {
  @apply absolute inset-0 opacity-30;
  background-image: 
    linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px);
  background-size: 2rem 2rem;
}

.hero-content {
  @apply relative container mx-auto px-4 sm:px-6 lg:px-8 py-20;
}

.hero-wrapper {
  @apply max-w-4xl mx-auto text-center;
}

.hero-subtitle {
  @apply flex items-center justify-center space-x-2 mb-6;
}

.hero-subtitle-icon {
  @apply text-sm;
}

.hero-subtitle-text {
  @apply text-sm;
  color: #6b7280;
}

.hero-title {
  @apply text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight;
  color: #1e3a8a;
}

.hero-title-line {
  @apply block;
}

.hero-description {
  @apply text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed;
  color: #4b5563;
}

.hero-actions {
  @apply flex flex-col sm:flex-row items-center justify-center gap-4 mb-20;
}

.btn-primary {
  @apply px-8 py-3 rounded-lg transition-all flex items-center space-x-2 text-white font-medium shadow-md hover:shadow-lg;
  background: #3b82f6;
  text-decoration: none;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-arrow {
  @apply text-lg;
}

.btn-secondary {
  @apply px-8 py-3 border rounded-lg transition-all font-medium shadow-sm hover:shadow-md;
  border-color: #cbd5e1;
  color: #475569;
  background: white;
}

.btn-secondary:hover {
  border-color: #94a3b8;
  background: #f8fafc;
  transform: translateY(-1px);
}

.stats-section {
  @apply relative border-t bg-white;
  border-color: #e2e8f0;
}

.stats-container {
  @apply container mx-auto px-4 sm:px-6 lg:px-8 py-16;
}

.stats-grid {
  @apply grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center;
}

.stats-item {
  @apply p-6 rounded-lg;
  background: white;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.stats-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stats-number {
  @apply text-4xl md:text-5xl font-bold mb-2;
  color: #1e3a8a;
}

.stats-label {
  color: #64748b;
}
</style>
