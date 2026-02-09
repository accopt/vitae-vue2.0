<template>
  <div class="resume-form">
    <h3 class="section-title">填写简历信息</h3>
    <p class="section-description">请填写以下信息，AI将帮助您优化简历内容</p>
    
    <el-tabs v-model="activeTab" type="card" class="form-tabs">
      <!-- 个人信息标签页 -->
      <el-tab-pane label="个人信息" name="personal">
        <div class="form-content">
          <el-card class="form-card">
            <el-form :model="formData.personalInfo" label-width="120px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="姓名" required>
                    <el-input 
                      v-model="formData.personalInfo.name" 
                      placeholder="请输入姓名"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="年龄">
                    <el-input-number 
                      v-model="formData.personalInfo.age" 
                      :min="16" 
                      :max="100"
                      placeholder="请输入年龄"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              
              <el-form-item label="头像">
                <el-upload
                  class="avatar-uploader"
                  :action="uploadAction"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="formData.personalInfo.avatar" :src="formData.personalInfo.avatar" class="avatar" />
                  <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
                <div class="upload-tip">支持JPG/PNG格式，大小不超过2MB</div>
              </el-form-item>
              
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="电话">
                    <el-input 
                      v-model="formData.personalInfo.phone" 
                      placeholder="请输入电话号码"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="邮箱">
                    <el-input 
                      v-model="formData.personalInfo.email" 
                      type="email"
                      placeholder="请输入邮箱地址"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              
              <el-form-item label="地址">
                <el-input 
                  v-model="formData.personalInfo.address" 
                  placeholder="请输入地址"
                />
              </el-form-item>
              
              <el-divider>求职意向</el-divider>
              
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="目标职位">
                    <el-input 
                      v-model="formData.personalInfo.targetPosition" 
                      placeholder="请输入目标职位"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="目标地点">
                    <el-input 
                      v-model="formData.personalInfo.targetLocation" 
                      placeholder="请输入目标工作地点"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="期望薪资">
                    <el-input 
                      v-model="formData.personalInfo.salary" 
                      placeholder="例如：面议 或 10k-15k"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="到岗时间">
                    <el-input 
                      v-model="formData.personalInfo.availability" 
                      placeholder="例如：随时到岗 或 一周内"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-card>
        </div>
      </el-tab-pane>
      
      <!-- 动态模块标签页 -->
      <el-tab-pane
        v-for="moduleId in selectedModules"
        :key="moduleId"
        :label="getModuleName(moduleId)"
        :name="moduleId"
      >
        <div class="form-content">
          <!-- 教育经历 -->
          <div v-if="isEducationModule(moduleId)" class="module-section">
            <div class="section-header">
              <h4 class="section-header-title">教育经历</h4>
              <el-button type="primary" size="small" @click="addEducation">添加教育经历</el-button>
            </div>
            <div v-for="(edu, index) in formData.education" :key="index" class="form-item-group">
              <el-card class="form-card">
                <template #header>
                  <div class="card-header">
                    <span>教育经历 {{ index + 1 }}</span>
                    <el-button type="danger" size="small" text @click="removeEducation(index)">删除</el-button>
                  </div>
                </template>
                <el-form :model="edu" label-width="100px">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="学校名称">
                        <el-input v-model="edu.school" placeholder="请输入学校名称" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="专业">
                        <el-input v-model="edu.major" placeholder="请输入专业" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="学历">
                        <el-select v-model="edu.degree" placeholder="请选择学历" class="w-full">
                          <el-option label="本科" value="本科" />
                          <el-option label="硕士" value="硕士" />
                          <el-option label="博士" value="博士" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="时间">
                        <el-date-picker
                          v-model="edu.startDate"
                          type="month"
                          placeholder="开始时间"
                          format="YYYY-MM"
                          value-format="YYYY-MM"
                        />
                        <span class="mx-2">至</span>
                        <el-date-picker
                          v-model="edu.endDate"
                          type="month"
                          placeholder="结束时间"
                          format="YYYY-MM"
                          value-format="YYYY-MM"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-form-item label="描述">
                    <el-input
                      v-model="edu.description"
                      type="textarea"
                      :rows="3"
                      placeholder="请输入教育经历描述（可选）"
                    />
                  </el-form-item>
                </el-form>
              </el-card>
            </div>
          </div>

          <!-- 工作经历 -->
          <div v-if="isWorkModule(moduleId)" class="module-section">
            <div class="section-header">
              <h4 class="section-header-title">工作经历</h4>
              <el-button type="primary" size="small" @click="addWork">添加工作经历</el-button>
            </div>
            <div v-for="(work, index) in formData.work" :key="index" class="form-item-group">
              <el-card class="form-card">
                <template #header>
                  <div class="card-header">
                    <span>工作经历 {{ index + 1 }}</span>
                    <el-button type="danger" size="small" text @click="removeWork(index)">删除</el-button>
                  </div>
                </template>
                <el-form :model="work" label-width="100px">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="公司名称">
                        <el-input v-model="work.company" placeholder="请输入公司名称" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="职位">
                        <el-input v-model="work.position" placeholder="请输入职位" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-form-item label="时间">
                    <el-date-picker
                      v-model="work.startDate"
                      type="month"
                      placeholder="开始时间"
                      format="YYYY-MM"
                      value-format="YYYY-MM"
                    />
                    <span class="mx-2">至</span>
                    <el-date-picker
                      v-model="work.endDate"
                      type="month"
                      placeholder="结束时间"
                      format="YYYY-MM"
                      value-format="YYYY-MM"
                    />
                  </el-form-item>
                  <el-form-item label="工作描述">
                    <div class="ai-optimize-wrapper">
                      <el-input
                        v-model="work.description"
                        type="textarea"
                        :rows="4"
                        placeholder="请输入工作描述，AI将帮助您优化内容"
                      />
                      <el-button 
                        type="primary" 
                        size="small" 
                        :loading="aiOptimizing[`work-${index}`]"
                        @click="optimizeWorkDescription(index)"
                        class="ai-optimize-btn"
                      >
                        <el-icon><MagicStick /></el-icon>
                        AI优化
                      </el-button>
                    </div>
                  </el-form-item>
                  <el-form-item label="工作成就">
                    <el-input
                      v-model="work.achievementsText"
                      type="textarea"
                      :rows="3"
                      placeholder="请输入工作成就，每行一个"
                    />
                  </el-form-item>
                </el-form>
              </el-card>
            </div>
          </div>

          <!-- 项目经历 -->
          <div v-if="isProjectModule(moduleId)" class="module-section">
            <div class="section-header">
              <h4 class="section-header-title">项目经历</h4>
              <el-button type="primary" size="small" @click="addProject">添加项目经历</el-button>
            </div>
            <div v-for="(project, index) in formData.project" :key="index" class="form-item-group">
              <el-card class="form-card">
                <template #header>
                  <div class="card-header">
                    <span>项目经历 {{ index + 1 }}</span>
                    <el-button type="danger" size="small" text @click="removeProject(index)">删除</el-button>
                  </div>
                </template>
                <el-form :model="project" label-width="100px">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="项目名称">
                        <el-input v-model="project.name" placeholder="请输入项目名称" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="担任角色">
                        <el-input v-model="project.role" placeholder="请输入担任角色" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-form-item label="时间">
                    <el-date-picker
                      v-model="project.startDate"
                      type="month"
                      placeholder="开始时间"
                      format="YYYY-MM"
                      value-format="YYYY-MM"
                    />
                    <span class="mx-2">至</span>
                    <el-date-picker
                      v-model="project.endDate"
                      type="month"
                      placeholder="结束时间"
                      format="YYYY-MM"
                      value-format="YYYY-MM"
                    />
                  </el-form-item>
                  <el-form-item label="项目描述">
                    <div class="ai-optimize-wrapper">
                      <el-input
                        v-model="project.description"
                        type="textarea"
                        :rows="4"
                        placeholder="请输入项目描述，AI将帮助您优化内容"
                      />
                      <el-button 
                        type="primary" 
                        size="small" 
                        :loading="aiOptimizing[`project-${index}`]"
                        @click="optimizeProjectDescription(index)"
                        class="ai-optimize-btn"
                      >
                        <el-icon><MagicStick /></el-icon>
                        AI优化
                      </el-button>
                    </div>
                  </el-form-item>
                  <el-form-item label="技术栈">
                    <el-input
                      v-model="project.technologiesText"
                      type="textarea"
                      :rows="2"
                      placeholder="请输入使用的技术栈，用逗号分隔"
                    />
                  </el-form-item>
                  <el-form-item label="项目成就">
                    <el-input
                      v-model="project.achievementsText"
                      type="textarea"
                      :rows="3"
                      placeholder="请输入项目成就，每行一个"
                    />
                  </el-form-item>
                </el-form>
              </el-card>
            </div>
          </div>

          <!-- 其他模块（实习、科研、技能、自我评价）可以类似实现 -->
          <!-- 为了简化，这里只展示核心模块，其他模块可以参考ModuleForm.vue的实现 -->
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage, ElUpload } from 'element-plus'
import { Plus, MagicStick } from '@element-plus/icons-vue'
import type {
  EducationData,
  WorkData,
  ProjectData
} from '@/services/resume'
import { optimizeResumeContent } from '@/services/resume'

interface Props {
  selectedModules: any[]
  modelValue: any
}

interface Emits {
  (e: 'update:modelValue', value: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const activeTab = ref('personal')
const uploadAction = ref('/api/upload/avatar') // 上传接口
const aiOptimizing = ref<Record<string, boolean>>({})

const formData = computed({
  get: () => props.modelValue || {},
  set: (value) => emit('update:modelValue', value)
})

// 初始化表单数据
const initializeFormData = () => {
  const data: any = { ...formData.value }
  
  if (!data.personalInfo) {
    data.personalInfo = {
      name: '',
      age: null,
      avatar: '',
      phone: '',
      email: '',
      address: '',
      targetPosition: '',
      targetLocation: '',
      salary: '',
      availability: ''
    }
  }
  
  if (props.selectedModules.some(m => isEducationModule(m)) && !data.education) {
    data.education = []
  }
  if (props.selectedModules.some(m => isWorkModule(m)) && !data.work) {
    data.work = []
  }
  if (props.selectedModules.some(m => isProjectModule(m)) && !data.project) {
    data.project = []
  }
  
  formData.value = data
}

watch(() => props.selectedModules, () => {
  initializeFormData()
}, { immediate: true })

// 模块判断函数
const isEducationModule = (moduleId: any) => {
  return moduleId === 'education' || moduleId === 1 || moduleId === '1'
}

const isWorkModule = (moduleId: any) => {
  return moduleId === 'work' || moduleId === 2 || moduleId === '2'
}

const isProjectModule = (moduleId: any) => {
  return moduleId === 'project' || moduleId === 3 || moduleId === '3'
}

const getModuleName = (moduleId: string) => {
  const names: Record<string, string> = {
    education: '教育经历',
    work: '工作经历',
    project: '项目经历',
    internship: '实习经历',
    research: '科研成果',
    skill: '技能特长',
    selfEvaluation: '自我评价'
  }
  return names[moduleId] || moduleId
}

// 头像上传
const handleAvatarSuccess = (response: any) => {
  if (response && response.url) {
    formData.value.personalInfo.avatar = response.url
    ElMessage.success('头像上传成功')
  }
}

const beforeAvatarUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('头像图片只能是 JPG/PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('头像图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 教育经历
const addEducation = () => {
  if (!formData.value.education) formData.value.education = []
  formData.value.education.push({
    school: '',
    major: '',
    degree: '',
    startDate: '',
    endDate: '',
    description: ''
  })
}

const removeEducation = (index: number) => {
  formData.value.education.splice(index, 1)
}

// 工作经历
const addWork = () => {
  if (!formData.value.work) formData.value.work = []
  formData.value.work.push({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
    achievements: [],
    achievementsText: ''
  })
}

const removeWork = (index: number) => {
  formData.value.work.splice(index, 1)
}

// 项目经历
const addProject = () => {
  if (!formData.value.project) formData.value.project = []
  formData.value.project.push({
    name: '',
    role: '',
    startDate: '',
    endDate: '',
    description: '',
    technologies: [],
    achievements: [],
    technologiesText: '',
    achievementsText: ''
  })
}

const removeProject = (index: number) => {
  formData.value.project.splice(index, 1)
}

// AI优化功能
const optimizeWorkDescription = async (index: number) => {
  const work = formData.value.work[index]
  if (!work.description || work.description.trim() === '') {
    ElMessage.warning('请先输入工作描述')
    return
  }
  
  const key = `work-${index}`
  aiOptimizing.value[key] = true
  
  try {
    const optimized = await optimizeResumeContent({
      type: 'work_description',
      content: work.description,
      context: {
        company: work.company,
        position: work.position
      }
    })
    
    if (optimized && optimized.content) {
      work.description = optimized.content
      ElMessage.success('AI优化成功')
    }
  } catch (error: any) {
    ElMessage.error(error.message || 'AI优化失败，请重试')
  } finally {
    aiOptimizing.value[key] = false
  }
}

const optimizeProjectDescription = async (index: number) => {
  const project = formData.value.project[index]
  if (!project.description || project.description.trim() === '') {
    ElMessage.warning('请先输入项目描述')
    return
  }
  
  const key = `project-${index}`
  aiOptimizing.value[key] = true
  
  try {
    const optimized = await optimizeResumeContent({
      type: 'project_description',
      content: project.description,
      context: {
        name: project.name,
        role: project.role
      }
    })
    
    if (optimized && optimized.content) {
      project.description = optimized.content
      ElMessage.success('AI优化成功')
    }
  } catch (error: any) {
    ElMessage.error(error.message || 'AI优化失败，请重试')
  } finally {
    aiOptimizing.value[key] = false
  }
}

// 数据转换：将响应式数据序列化为后端要求的JSON格式
const processFormData = () => {
  const data = JSON.parse(JSON.stringify(formData.value))
  
  // 处理工作经历的成就
  if (data.work && Array.isArray(data.work)) {
    data.work = data.work.map((work: any) => {
      const processedWork = { ...work }
      if (processedWork.achievementsText) {
        processedWork.achievements = processedWork.achievementsText
          .split('\n')
          .map((item: string) => item.trim())
          .filter((item: string) => item.length > 0)
      }
      delete processedWork.achievementsText
      return processedWork
    })
  }
  
  // 处理项目经历的技术栈和成就
  if (data.project && Array.isArray(data.project)) {
    data.project = data.project.map((project: any) => {
      const processedProject = { ...project }
      if (processedProject.technologiesText) {
        processedProject.technologies = processedProject.technologiesText
          .split(',')
          .map((item: string) => item.trim())
          .filter((item: string) => item.length > 0)
      }
      if (processedProject.achievementsText) {
        processedProject.achievements = processedProject.achievementsText
          .split('\n')
          .map((item: string) => item.trim())
          .filter((item: string) => item.length > 0)
      }
      delete processedProject.technologiesText
      delete processedProject.achievementsText
      return processedProject
    })
  }
  
  return data
}

// 暴露处理后的数据
defineExpose({
  processFormData
})
</script>

<style scoped>
.resume-form {
  @apply w-full;
}

.section-title {
  @apply text-2xl font-bold mb-2;
  color: #1e3a8a;
}

.section-description {
  @apply text-gray-600 mb-6;
}

.form-tabs {
  @apply mt-4;
}

.form-content {
  @apply mt-4;
}

.form-card {
  @apply mb-4;
}

.card-header {
  @apply flex items-center justify-between;
}

.module-section {
  @apply space-y-4;
}

.section-header {
  @apply flex items-center justify-between mb-4;
}

.section-header-title {
  @apply text-lg font-semibold;
  color: #1e293b;
}

.form-item-group {
  @apply mb-4;
}

/* 头像上传 */
.avatar-uploader {
  @apply inline-block;
}

.avatar-uploader :deep(.el-upload) {
  @apply border-2 border-dashed border-gray-300 rounded-lg cursor-pointer overflow-hidden relative;
  width: 120px;
  height: 120px;
  transition: all 0.3s;
}

.avatar-uploader :deep(.el-upload:hover) {
  @apply border-blue-500;
}

.avatar-uploader-icon {
  @apply text-4xl text-gray-400 absolute top-1/2 left-1/2;
  transform: translate(-50%, -50%);
}

.avatar {
  @apply w-full h-full object-cover;
}

.upload-tip {
  @apply text-sm text-gray-500 mt-2;
}

/* AI优化按钮 */
.ai-optimize-wrapper {
  @apply relative;
}

.ai-optimize-btn {
  @apply absolute top-2 right-2;
}

.ai-optimize-btn :deep(.el-icon) {
  @apply mr-1;
}
</style>







