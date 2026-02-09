<template>
  <div class="template-selector">
    <h3 class="section-title">选择简历模板</h3>
    <p class="section-description">选择一个适合你的简历模板，不同的模板适合不同的行业和职位</p>
    
    <div class="template-grid">
      <div
        v-for="template in templates"
        :key="template.id"
        class="template-card"
        :class="{ 
          'template-card-selected': selectedTemplate?.id === template.id || props.selectedTemplateId === template.id 
        }"
        @click="selectTemplate(template)"
      >
        <div class="template-thumbnail">
          <!-- 优先显示预览图片 -->
          <img 
            v-if="template.preview_image && !imageErrors[template.id]" 
            :src="template.preview_image" 
            :alt="template.name"
            class="template-preview-image"
            @error="(e) => handleImageError(e, template.id)"
          />
          <!-- 如果没有预览图片或图片加载失败，则显示HTML预览 -->
          <div 
            v-if="!template.preview_image || imageErrors[template.id]" 
            class="template-preview" 
            v-html="template.thumbnail || template.preview"
          ></div>
        </div>
        <div class="template-info">
          <h4 class="template-name">{{ template.name }}</h4>
          <p class="template-description">{{ template.description }}</p>
        </div>
        <div 
          v-if="selectedTemplate?.id === template.id || props.selectedTemplateId === template.id" 
          class="template-check"
        >
          <span class="check-icon">✓</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ResumeTemplate } from '@/services/resume'

interface Props {
  templates: ResumeTemplate[]
  modelValue?: ResumeTemplate | null
  selectedTemplateId?: string
}

interface Emits {
  (e: 'update:modelValue', value: ResumeTemplate | null): void
  (e: 'update:selectedTemplateId', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 记录图片加载失败的模板ID
const imageErrors = ref<Record<string, boolean>>({})

const selectedTemplate = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    if (value) {
      emit('update:selectedTemplateId', value.id)
    }
  }
})

const selectTemplate = (template: ResumeTemplate) => {
  selectedTemplate.value = template
  emit('update:selectedTemplateId', template.id)
}

// 处理图片加载错误
const handleImageError = (event: Event, templateId: string) => {
  // 标记该模板的图片加载失败
  imageErrors.value[templateId] = true
  console.warn('模板预览图片加载失败:', (event.target as HTMLImageElement).src)
}
</script>

<style scoped>
.template-selector {
  @apply w-full;
}

.section-title {
  @apply text-2xl font-bold mb-2;
  color: #1e3a8a;
}

.section-description {
  @apply text-gray-600 mb-6;
}

.template-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}

.template-card {
  @apply relative bg-white rounded-lg border-2 border-gray-200 p-4 cursor-pointer transition-all;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.template-card:hover {
  @apply border-blue-400;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  transform: translateY(-2px);
}

.template-card-selected {
  @apply border-blue-500;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
}

.template-thumbnail {
  @apply w-full aspect-[3/4] bg-gray-50 rounded-md overflow-hidden mb-4;
  border: 1px solid #e2e8f0;
  position: relative;
}

.template-preview-image {
  @apply w-full h-full object-cover;
  display: block;
}

.template-preview {
  @apply w-full h-full p-4 text-xs;
  background: white;
  color: #1e293b;
}

.template-info {
  @apply flex flex-col;
}

.template-name {
  @apply text-lg font-semibold mb-1;
  color: #1e293b;
}

.template-description {
  @apply text-sm;
  color: #64748b;
}

.template-check {
  @apply absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center;
  background: #3b82f6;
}

.check-icon {
  @apply text-white text-sm font-bold;
}
</style>

