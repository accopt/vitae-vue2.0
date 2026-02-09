<template>
  <div class="module-selector">
    <h3 class="section-title">选择简历模块</h3>
    <p class="section-description">选择你想要包含在简历中的模块，至少选择一个模块</p>
    
    <div class="module-grid">
      <div
        v-for="module in modules"
        :key="module.id"
        class="module-card"
        :class="{ 'module-card-selected': selectedModules.includes(module.id) }"
        @click="toggleModule(module.id)"
      >
        <div class="module-icon">{{ module.icon }}</div>
        <div class="module-info">
          <h4 class="module-name">{{ module.display_name }}</h4>
          <div>{{ module.description }}</div>
        </div>
        <div v-if="selectedModules.includes(module.id)" class="module-check">
          <span class="check-icon">✓</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ResumeModule } from '@/services/resume'

interface Props {
  modules: ResumeModule[]
  modelValue: string[]
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedModules = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const toggleModule = (moduleId: string) => {
  const current = [...selectedModules.value]
  const index = current.indexOf(moduleId)
  if (index > -1) {
    current.splice(index, 1)
  } else {
    current.push(moduleId)
  }
  selectedModules.value = current
}
</script>

<style scoped>
.module-selector {
  @apply w-full;
}

.section-title {
  @apply text-2xl font-bold mb-2;
  color: #1e3a8a;
}

.section-description {
  @apply text-gray-600 mb-6;
}

.module-grid {
  @apply grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4;
}

.module-card {
  @apply relative bg-white rounded-lg border-2 border-gray-200 p-4 cursor-pointer transition-all flex flex-col items-center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  min-height: 120px;
}

.module-card:hover {
  @apply border-blue-400;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  transform: translateY(-2px);
}

.module-card-selected {
  @apply border-blue-500 bg-blue-50;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
}

.module-icon {
  @apply text-4xl mb-3;
}

.module-info {
  @apply flex flex-col items-center;
}

.module-name {
  @apply text-sm font-semibold text-center;
  color: #1e293b;
}

.module-check {
  @apply absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center;
  background: #3b82f6;
}

.check-icon {
  @apply text-white text-xs font-bold;
}
</style>

