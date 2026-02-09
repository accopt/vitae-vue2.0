<template>
  <div class="create-resume-page">
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">AI生成简历</h1>
        <p class="page-description">只需三步，轻松生成专业简历</p>
      </div>

      <!-- 步骤导航 -->
      <div class="steps-container">
        <el-steps :active="currentStep" finish-status="success" align-center>
          <el-step title="选择模板" description="选择适合的简历模板" />
          <el-step title="核心信息" description="填写核心信息" />
          <el-step title="模块与信息" description="选择模块并填写信息" />
          <el-step title="生成简历" description="AI智能生成简历" />
        </el-steps>
      </div>

      <!-- 步骤内容 -->
      <div class="steps-content">
        <!-- 步骤1：选择模板 -->
        <div v-show="currentStep === 0" class="step-content">
          <TemplateSelector
            v-model="selectedTemplate"
            :templates="templates"
          />
        </div>

        <!-- 步骤2：核心信息填写 -->
        <div v-show="currentStep === 1" class="step-content">
          <BasicInfoForm
            v-model="basicInfo"
            ref="basicInfoFormRef"
          />
        </div>

        <!-- 步骤3：模块选择和信息填写 -->
        <div v-show="currentStep === 2" class="step-content">
          <ModuleSelectorAndForm
            v-model="moduleData"
            :modules="modules"
            ref="moduleSelectorAndFormRef"
          />
        </div>

        <!-- 步骤4：生成简历 -->
        <div v-show="currentStep === 3" class="step-content">
          <div class="generate-section">
            <div class="generate-header">
              <h3 class="section-title">准备生成简历</h3>
              <p class="section-description">请确认以下信息，确认后将开始生成简历</p>
            </div>
            
            <el-card class="review-card">
              <template #header>
                <div class="review-header">信息预览</div>
              </template>
              
              <div class="review-content">
                <div class="review-item">
                  <span class="review-label">选择的模板：</span>
                  <span class="review-value">{{ selectedTemplate?.name || '未选择' }}</span>
                </div>
                <div class="review-item">
                  <span class="review-label">核心信息：</span>
                  <span class="review-value">{{ basicInfo.name || '未填写' }}</span>
                </div>
                <div class="review-item">
                  <span class="review-label">选择的模块：</span>
                  <span class="review-value">{{ moduleData.selectedModules.map(id => getModuleName(id)).join('、') }}</span>
                </div>
                <div class="review-item">
                  <span class="review-label">填写的信息：</span>
                  <span class="review-value">{{ hasFormData ? '已填写' : '未填写' }}</span>
                </div>
                <div class="review-item">
                  <span class="review-label">AI 自动补全：</span>
                  <span class="review-value">
                    <el-tag :type="moduleData.autoFillMissing ? 'success' : 'info'" size="small">
                      {{ moduleData.autoFillMissing ? '已开启' : '未开启' }}
                    </el-tag>
                  </span>
                </div>
              </div>
            </el-card>
            
            <el-alert
              v-if="moduleData.autoFillMissing"
              title="AI 自动补全已开启"
              type="info"
              :closable="false"
              show-icon
              class="ai-alert"
            >
              <template #default>
                <p>系统将自动为未填写的描述字段生成内容，包括：</p>
                <ul class="ai-features-list">
                  <li>工作描述、工作成就</li>
                  <li>项目描述、技术栈、项目成就</li>
                  <li>教育经历描述、实习描述、科研成果描述</li>
                  <li>自我评价</li>
                </ul>
                <p class="ai-note">生成内容将基于您的求职岗位「{{ basicInfo.targetPosition }}」智能撰写</p>
              </template>
            </el-alert>

            <div v-if="generating" class="generating-status">
              <el-icon class="is-loading loading-icon">
                <Loading />
              </el-icon>
              <p class="generating-text">正在生成简历，请稍候...</p>
              <p v-if="moduleData.autoFillMissing" class="generating-hint">
                AI 正在为您补全内容，可能需要较长时间，请耐心等待
              </p>
            </div>

            <div v-if="generateSuccess" class="generate-success">
              <el-icon class="success-icon">
                <CircleCheck />
              </el-icon>
              <p class="success-text">简历生成成功！</p>
              <div class="success-actions">
                <el-button type="primary" @click="showPreview = true">查看简历</el-button>
                <el-button @click="router.push('/achievement')">前往成就库</el-button>
              </div>
            </div>
            
            <!-- 简历预览 -->
            <div v-if="showPreview && generatedResumeData" class="preview-container">
              <ResumePreview 
                :resume-data="generatedResumeData" 
                :resume-id="generatedResumeId"
                :template-id="selectedTemplate?.id"
                :html-content="generatedHtmlContent"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button
          v-if="currentStep > 0"
          @click="prevStep"
          :disabled="generating"
        >
          上一步
        </el-button>
        <el-button
          v-if="currentStep < 3"
          type="primary"
          @click="nextStep"
          :disabled="!canNextStep || generating"
        >
          下一步
        </el-button>
        <el-button
          v-if="currentStep === 3"
          type="primary"
          :loading="generating"
          @click="handleGenerate"
          :disabled="!canGenerate || generating"
        >
          开始生成简历
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Loading, CircleCheck } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { getResumeTemplates, getResumeModules, generateResume,  getResumeDetail, type ResumeTemplate, type ResumeModule, type ResumeData } from '@/services/resume'
import ResumePreview from '@/components/ResumePreview.vue'
import BasicInfoForm, { type BasicInfo } from '@/components/BasicInfoForm.vue'
import ModuleSelectorAndForm from '@/components/ModuleSelectorAndForm.vue'

const router = useRouter()

const currentStep = ref(0)
const selectedTemplate = ref<ResumeTemplate | null>(null)
const basicInfo = ref<Partial<BasicInfo>>({})
const moduleData = ref<{ selectedModules: string[], formData: any, autoFillMissing?: boolean }>({
  selectedModules: [],
  formData: {},
  autoFillMissing: false
})
const templates = ref<ResumeTemplate[]>([])
const modules = ref<ResumeModule[]>([])
const generating = ref(false)
const generateSuccess = ref(false)
const basicInfoFormRef = ref<any>(null)
const moduleSelectorAndFormRef = ref<any>(null)
const generatedResumeId = ref<string | null>(null)
const currentDraftId = ref<number | string | null>(null)
const showPreview = ref(false)
const generatedResumeData = ref<ResumeData | null>(null)
const generatedHtmlContent = ref<string | null>(null)

// 加载模板和模块
onMounted(async () => {
  try {
    // 如果API不存在，使用模拟数据
    try {
      const [templatesData, modulesData] = await Promise.all([
        getResumeTemplates(),
        getResumeModules()
      ])
      templates.value = templatesData.length > 0 ? templatesData : getDefaultTemplates()
      modules.value = modulesData.length > 0 ? modulesData : getDefaultModules()
    } catch (error) {
      // 如果API调用失败，使用默认数据
      templates.value = getDefaultTemplates()
      modules.value = getDefaultModules()
    }

    // 尝试加载草稿（获取最新的草稿）
    // try {
    //   const draft = await getResumeDraft()
    //   if (draft) {
    //     currentDraftId.value = draft.id || null
    //     if (draft.templateId) {
    //       selectedTemplate.value = templates.value.find(t => t.id === draft.templateId) || null
    //     }
    //     if (draft.modules && Array.isArray(draft.modules)) {
    //       selectedModules.value = draft.modules
    //     }
    //     if (draft.formData) {
    //       // 合并表单数据
    //       formData.value = { ...formData.value, ...draft.formData }
    //     }
    //     if (draft.personalInfo) {
    //       // 如果有个人信息，合并到formData中
    //       if (!formData.value.personalInfo) {
    //         formData.value.personalInfo = {}
    //       }
    //       Object.assign(formData.value.personalInfo, draft.personalInfo)
    //     }
    //   }
    // } catch (error) {
    //   // 忽略草稿加载错误
    //   console.log('加载草稿失败:', error)
    // }
  } catch (error) {
    console.error('加载数据失败:', error)
    templates.value = getDefaultTemplates()
    modules.value = getDefaultModules()
  }
})

// 默认模板数据
const getDefaultTemplates = (): ResumeTemplate[] => {
  return [
    {
      id: 'template1',
      name: '经典模板',
      description: '简洁大方的经典简历模板，适合大多数职位',
      preview: '<div style="padding: 20px;"><h2>个人简历</h2><p>姓名：</p><p>联系方式：</p></div>',
      thumbnail: '<div style="padding: 10px; background: #f0f0f0; border: 1px solid #ccc;"><h3 style="margin: 0;">经典模板</h3><p style="margin: 5px 0;">简洁大方</p></div>'
    },
    {
      id: 'template2',
      name: '现代模板',
      description: '现代化的设计风格，突出个人特色',
      preview: '<div style="padding: 20px;"><h2>个人简历</h2><p>姓名：</p><p>联系方式：</p></div>',
      thumbnail: '<div style="padding: 10px; background: #e3f2fd; border: 1px solid #2196f3;"><h3 style="margin: 0;">现代模板</h3><p style="margin: 5px 0;">现代设计</p></div>'
    },
    {
      id: 'template3',
      name: '创意模板',
      description: '富有创意的设计，适合设计类职位',
      preview: '<div style="padding: 20px;"><h2>个人简历</h2><p>姓名：</p><p>联系方式：</p></div>',
      thumbnail: '<div style="padding: 10px; background: #fff3e0; border: 1px solid #ff9800;"><h3 style="margin: 0;">创意模板</h3><p style="margin: 5px 0;">创意设计</p></div>'
    }
  ]
}

// 默认模块数据
const getDefaultModules = (): ResumeModule[] => {
  return [
    { id: 1, name: '教育经历', type: 'education', icon: '🎓' },
    { id: 2, name: '工作经历', type: 'work', icon: '💼' },
    { id: 3, name: '项目经历', type: 'project', icon: '🚀' },
    { id: 4, name: '实习经历', type: 'internship', icon: '📝' },
    { id: 5, name: '科研成果', type: 'research', icon: '🔬' },
    { id: 6, name: '技能特长', type: 'skill', icon: '⚡' },
    { id: 6, name: '自我评价', type: 'selfEvaluation', icon: '✨' }
  ]
}

const getModuleName = (moduleId: string) => {
  const module = modules.value.find(m => m.id === moduleId)
  return module?.display_name || module?.name || moduleId
}

// 是否可以进入下一步
const canNextStep = computed(() => {
  if (currentStep.value === 0) {
    return selectedTemplate.value !== null
  }
  if (currentStep.value === 1) {
    // 步骤2：核心信息必须填写完整
    return basicInfo.value.name && 
           basicInfo.value.birthDate && 
           basicInfo.value.gender && 
           basicInfo.value.targetPosition && 
           basicInfo.value.workYears && 
           basicInfo.value.phone
  }
  if (currentStep.value === 2) {
    // 步骤3：必须选择模块且所有选中的模块都已填写
    return moduleData.value.selectedModules.length > 0
  }
  return false
})

// 是否可以生成简历
const canGenerate = computed(() => {
  return selectedTemplate.value !== null && 
         moduleData.value.selectedModules.length > 0
})

// 是否有表单数据
const hasFormData = computed(() => {
  return Object.keys(moduleData.value.formData).length > 0
})

// 下一步
const nextStep = async () => {
  if (currentStep.value === 0) {
    if (!selectedTemplate.value) {
      ElMessage.warning('请选择一个简历模板')
      return
    }
    currentStep.value++
    return
  }
  
  if (currentStep.value === 1) {
    // 验证核心信息
    if (basicInfoFormRef.value) {
      const isValid = await basicInfoFormRef.value.validate()
      if (!isValid) {
        return
      }
    }
    currentStep.value++
    return
  }
  
  if (currentStep.value === 2) {
    // 验证模块选择和信息填写
    if (moduleSelectorAndFormRef.value) {
      const isValid = moduleSelectorAndFormRef.value.validateModules()
      if (!isValid) {
        return
      }
    }
    currentStep.value++
    return
  }
  
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

// 上一步
const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// 保存草稿
const saveDraft = async () => {
  try {
    // 构建草稿数据
    const draftData: any = {}
    
    if (selectedTemplate.value?.id) {
      draftData.templateId = selectedTemplate.value.id
    }
    
    if (basicInfo.value && Object.keys(basicInfo.value).length > 0) {
      draftData.basicInfo = basicInfo.value
    }
    
    if (moduleData.value.selectedModules.length > 0) {
      draftData.modules = moduleData.value.selectedModules
    }
    
    if (moduleData.value.formData && Object.keys(moduleData.value.formData).length > 0) {
      draftData.formData = moduleData.value.formData
    }
    
    // 只有有数据时才保存
    // if (draftData.templateId || draftData.modules || Object.keys(draftData).length > 0) {
    //   const result = await saveResumeDraft(draftData, currentDraftId.value || undefined)
    //   // 更新草稿ID
    //   if (result?.id) {
    //     currentDraftId.value = result.id
    //   }
    // }
  } catch (error) {
    // 忽略保存草稿错误
    console.log('保存草稿失败:', error)
  }
}

// 生成简历
const handleGenerate = async () => {
  if (!selectedTemplate.value) {
    ElMessage.warning('请选择一个简历模板')
    return
  }
  if (moduleData.value.selectedModules.length === 0) {
    ElMessage.warning('请至少选择一个模块')
    return
  }

  // 再次验证模块信息
  if (moduleSelectorAndFormRef.value) {
    const isValid = moduleSelectorAndFormRef.value.validateModules()
    if (!isValid) {
      return
    }
  }

  generating.value = true
  generateSuccess.value = false

  try {
    // 处理表单数据
    let processedFormData = moduleData.value.formData
    if (moduleSelectorAndFormRef.value && moduleSelectorAndFormRef.value.processFormData) {
      processedFormData = moduleSelectorAndFormRef.value.processFormData()
    }

    // 合并核心信息到personalInfo
    const personalInfo = {
      name: basicInfo.value.name,
      birthDate: basicInfo.value.birthDate,
      gender: basicInfo.value.gender,
      targetPosition: basicInfo.value.targetPosition,
      workYears: basicInfo.value.workYears,
      phone: basicInfo.value.phone
    }
    
    // 显示 AI 补全提示
    if (moduleData.value.autoFillMissing) {
      ElMessage.info('已开启 AI 自动补全，系统将为您生成未填写的描述内容')
    }

    // 生成简历标题（使用姓名+求职岗位，如果没有则使用默认值）
    const resumeTitle = personalInfo.name && personalInfo.targetPosition
      ? `${personalInfo.name}_${personalInfo.targetPosition}_简历`
      : personalInfo.name
        ? `${personalInfo.name}_简历`
        : '我的简历'

    // 构建简历数据
    const resumeData: ResumeData = {
      templateId: selectedTemplate.value.id,
      modules: moduleData.value.selectedModules,
      personalInfo: personalInfo,
      education: processedFormData.education,
      work: processedFormData.work,
      project: processedFormData.project,
      internship: processedFormData.internship,
      research: processedFormData.research,
      skill: processedFormData.skill,
      selfEvaluation: processedFormData.selfEvaluation,
      autoFillMissing: moduleData.value.autoFillMissing || false,
      title: resumeTitle  // 添加标题字段
    }

    // 调用生成API（传入草稿ID，如果存在）
    const result = await generateResume(resumeData, currentDraftId.value || undefined) 
    
    generating.value = false
    generateSuccess.value = true
    generatedResumeId.value = result?.resumeId || result?.id || null
    
    // 保存生成的简历数据用于预览
    generatedResumeData.value = resumeData
    
    // 尝试从后端获取完整的简历详情（如果后端返回了详情）
    if (generatedResumeId.value) {
      try {
        const detail = await getResumeDetail(generatedResumeId.value)
        if (detail) {
          console.log("detail",detail)
          // 如果后端返回了HTML内容，使用后端的HTML模板
          if (detail.content) {
            generatedHtmlContent.value = detail.content
          }
          // 如果后端返回了详情，使用后端的数据
          if (detail.moduleData) {
            generatedResumeData.value = {
              templateId: detail.templateId,
              modules: resumeData.modules, // 保持原有的模块列表
              personalInfo: detail.personalInfo || resumeData.personalInfo,
              education: detail.moduleData.education || resumeData.education,
              work: detail.moduleData.work || resumeData.work,
              project: detail.moduleData.project || resumeData.project,
              internship: detail.moduleData.internship || resumeData.internship,
              research: detail.moduleData.research || resumeData.research,
              skill: detail.moduleData.skill || resumeData.skill,
              selfEvaluation: detail.moduleData.selfEvaluation || resumeData.selfEvaluation
            }
          }
        }
      } catch (error) {
        // 如果获取详情失败，使用本地数据
        console.log('获取简历详情失败，使用本地数据:', error)
      }
    }
    
    ElMessage.success('简历生成成功！')
    
    // 自动显示预览
    showPreview.value = true
  } catch (error: any) {
    generating.value = false
    console.error('生成简历错误:', error)
    
    // 处理不同的错误类型
    let errorMsg = '生成简历失败，请重试'
    
    // 处理超时错误
    if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
      errorMsg = '生成简历超时，可能是 AI 补全耗时较长，请稍后重试或关闭 AI 自动补全功能'
    } else if (error?.response?.data?.message) {
      errorMsg = error.response.data.message
    } else if (error?.message) {
      errorMsg = error.message
    }
    
    // 如果是数据库约束错误，提供更友好的提示
    if (errorMsg.includes('NOT NULL constraint') || errorMsg.includes('content')) {
      errorMsg = '生成简历时发生错误：服务器端数据处理异常，请联系管理员'
    }
    
    ElMessage.error(errorMsg)
  }
}

// 查看简历（现在直接在页面内显示预览）
const viewResume = () => {
  showPreview.value = true
  // 滚动到预览区域
  setTimeout(() => {
    const previewElement = document.querySelector('.preview-container')
    if (previewElement) {
      previewElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, 100)
}

// 监听表单数据变化，自动保存草稿（防抖处理）
let saveDraftTimer: NodeJS.Timeout | null = null
watch([selectedTemplate, basicInfo, moduleData], () => {
  if (currentStep.value > 0) {
    // 防抖：延迟500ms保存，避免频繁请求
    if (saveDraftTimer) {
      clearTimeout(saveDraftTimer)
    }
    saveDraftTimer = setTimeout(() => {
      saveDraft()
    }, 500)
  }
}, { deep: true })

// 组件卸载时清理定时器
onUnmounted(() => {
  if (saveDraftTimer) {
    clearTimeout(saveDraftTimer)
  }
})
</script>

<style scoped>
.create-resume-page {
  @apply min-h-screen py-12;
}

.page-container {
  @apply container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl;
}

.page-header {
  @apply text-center mb-8;
}

.page-title {
  @apply text-4xl font-bold mb-2;
  color: #1e3a8a;
}

.page-description {
  @apply text-lg text-gray-600;
}

.steps-container {
  @apply mb-8;
}

.steps-content {
  @apply min-h-[500px] mb-8;
}

.step-content {
  @apply bg-white rounded-lg shadow-lg p-8 border border-gray-200;
}

.generate-section {
  @apply space-y-6;
}

.generate-header {
  @apply text-center mb-6;
}

.section-title {
  @apply text-2xl font-bold mb-2;
  color: #1e3a8a;
}

.section-description {
  @apply text-gray-600;
}

.review-card {
  @apply mb-6;
}

.review-header {
  @apply font-semibold text-lg;
  color: #1e293b;
}

.review-content {
  @apply space-y-4;
}

.review-item {
  @apply flex items-center;
}

.review-label {
  @apply font-medium mr-2;
  color: #64748b;
  min-width: 120px;
}

.review-value {
  @apply text-gray-800;
}

.ai-alert {
  @apply mb-6;
}

.ai-features-list {
  @apply mt-2 mb-2 ml-4;
  list-style-type: disc;
  color: #64748b;
}

.ai-features-list li {
  @apply mb-1;
}

.ai-note {
  @apply mt-2 text-sm;
  color: #3b82f6;
  font-weight: 500;
}

.generating-status {
  @apply flex flex-col items-center justify-center py-12;
}

.loading-icon {
  @apply text-4xl text-blue-500 mb-4;
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.generating-text {
  @apply text-lg text-gray-600;
}

.generating-hint {
  @apply text-sm text-blue-500 mt-2;
}

.generate-success {
  @apply flex flex-col items-center justify-center py-12;
}

.success-icon {
  @apply text-5xl text-green-500 mb-4;
}

.success-text {
  @apply text-xl font-semibold mb-4;
  color: #1e293b;
}

.success-actions {
  @apply flex gap-4 mt-4;
}

.preview-container {
  @apply mt-8;
}

.action-buttons {
  @apply flex justify-between items-center;
}

.action-buttons .el-button {
  @apply min-w-[120px];
}
</style>
