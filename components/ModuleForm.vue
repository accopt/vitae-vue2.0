<template>
  <div class="module-form">
    <h3 class="section-title">填写个人信息</h3>
    <p class="section-description">请填写以下模块的详细信息</p>
    
    <el-tabs v-model="activeTab" type="card" class="module-tabs">
      <el-tab-pane
        v-for="moduleId in selectedModules"
        :key="moduleId"
        :label="getModuleName(moduleId)"
        :name="moduleId"
      >
        <div class="form-content">
          <!-- 教育经历 -->
          <div v-if="moduleId === 1 || moduleId === '1' || moduleId === 'education'" class="module-section">
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
          <div v-if="moduleId === 2" class="module-section">
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
                    <el-input
                      v-model="work.description"
                      type="textarea"
                      :rows="3"
                      placeholder="请输入工作描述"
                    />
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
          <div v-if="moduleId === 3" class="module-section">
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
                    <el-input
                      v-model="project.description"
                      type="textarea"
                      :rows="3"
                      placeholder="请输入项目描述"
                    />
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

          <!-- 实习经历 -->
          <div v-if="moduleId === 4" class="module-section">
            <div class="section-header">
              <h4 class="section-header-title">实习经历</h4>
              <el-button type="primary" size="small" @click="addInternship">添加实习经历</el-button>
            </div>
            <div v-for="(internship, index) in formData.internship" :key="index" class="form-item-group">
              <el-card class="form-card">
                <template #header>
                  <div class="card-header">
                    <span>实习经历 {{ index + 1 }}</span>
                    <el-button type="danger" size="small" text @click="removeInternship(index)">删除</el-button>
                  </div>
                </template>
                <el-form :model="internship" label-width="100px">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="公司名称">
                        <el-input v-model="internship.company" placeholder="请输入公司名称" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="职位">
                        <el-input v-model="internship.position" placeholder="请输入职位" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-form-item label="时间">
                    <el-date-picker
                      v-model="internship.startDate"
                      type="month"
                      placeholder="开始时间"
                      format="YYYY-MM"
                      value-format="YYYY-MM"
                    />
                    <span class="mx-2">至</span>
                    <el-date-picker
                      v-model="internship.endDate"
                      type="month"
                      placeholder="结束时间"
                      format="YYYY-MM"
                      value-format="YYYY-MM"
                    />
                  </el-form-item>
                  <el-form-item label="实习描述">
                    <el-input
                      v-model="internship.description"
                      type="textarea"
                      :rows="3"
                      placeholder="请输入实习描述"
                    />
                  </el-form-item>
                </el-form>
              </el-card>
            </div>
          </div>

          <!-- 科研成果 -->
          <div v-if="moduleId === 5" class="module-section">
            <div class="section-header">
              <h4 class="section-header-title">科研成果</h4>
              <el-button type="primary" size="small" @click="addResearch">添加科研成果</el-button>
            </div>
            <div v-for="(research, index) in formData.research" :key="index" class="form-item-group">
              <el-card class="form-card">
                <template #header>
                  <div class="card-header">
                    <span>科研成果 {{ index + 1 }}</span>
                    <el-button type="danger" size="small" text @click="removeResearch(index)">删除</el-button>
                  </div>
                </template>
                <el-form :model="research" label-width="100px">
                  <el-form-item label="论文/成果标题">
                    <el-input v-model="research.title" placeholder="请输入论文或成果标题" />
                  </el-form-item>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="作者">
                        <el-input v-model="research.authors" placeholder="请输入作者（可选）" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="发表时间">
                        <el-date-picker
                          v-model="research.date"
                          type="month"
                          placeholder="发表时间"
                          format="YYYY-MM"
                          value-format="YYYY-MM"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-form-item label="发表期刊/会议">
                    <el-input v-model="research.publication" placeholder="请输入发表期刊或会议（可选）" />
                  </el-form-item>
                  <el-form-item label="链接">
                    <el-input v-model="research.link" placeholder="请输入相关链接（可选）" />
                  </el-form-item>
                  <el-form-item label="描述">
                    <el-input
                      v-model="research.description"
                      type="textarea"
                      :rows="3"
                      placeholder="请输入成果描述（可选）"
                    />
                  </el-form-item>
                </el-form>
              </el-card>
            </div>
          </div>

          <!-- 技能特长 -->
          <div v-if="moduleId === 6" class="module-section">
            <div class="section-header">
              <h4 class="section-header-title">技能特长</h4>
              <el-button type="primary" size="small" @click="addSkill">添加技能类别</el-button>
            </div>
            <div v-for="(skill, index) in formData.skill" :key="index" class="form-item-group">
              <el-card class="form-card">
                <template #header>
                  <div class="card-header">
                    <span>技能类别 {{ index + 1 }}</span>
                    <el-button type="danger" size="small" text @click="removeSkill(index)">删除</el-button>
                  </div>
                </template>
                <el-form :model="skill" label-width="100px">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="技能类别">
                        <el-input v-model="skill.category" placeholder="例如：编程语言、工具软件等" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="熟练程度">
                        <el-select v-model="skill.level" placeholder="请选择熟练程度（可选）" class="w-full">
                          <el-option label="熟练" value="熟练" />
                          <el-option label="掌握" value="掌握" />
                          <el-option label="了解" value="了解" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-form-item label="技能项">
                    <el-input
                      v-model="skill.itemsText"
                      type="textarea"
                      :rows="3"
                      placeholder="请输入技能项，用逗号分隔"
                    />
                  </el-form-item>
                </el-form>
              </el-card>
            </div>
          </div>

          <!-- 自我评价 -->
          <div v-if="moduleId === 7" class="module-section">
            <div class="section-header">
              <h4 class="section-header-title">自我评价</h4>
            </div>
            <el-card class="form-card">
              <el-form :model="formData.selfEvaluation" label-width="100px">
                <el-form-item label="自我评价">
                  <el-input
                    v-model="formData.selfEvaluation.content"
                    type="textarea"
                    :rows="6"
                    placeholder="请简要介绍自己的优势、特点、职业目标等"
                  />
                </el-form-item>
              </el-form>
            </el-card>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type {
  EducationData,
  WorkData,
  ProjectData,
  InternshipData,
  ResearchData,
  SkillData,
  SelfEvaluationData
} from '@/services/resume'

interface Props {
  selectedModules: any[]
  modelValue: any
}
interface Emits {
  (e: 'update:modelValue', value: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
  console.log(props.selectedModules)
const activeTab = ref(props.selectedModules[0] || '')

const formData = computed({
  get: () => props.modelValue || {},
  set: (value) => emit('update:modelValue', value)
})

const initializeFormData = () => {
  const data: any = { ...formData.value }
  
  // 检查是否包含教育经历模块（支持数字1或字符串'education'）
  const hasEducation = props.selectedModules.includes('education') || 
                       props.selectedModules.includes(1) || 
                       props.selectedModules.includes('1')
  
  if (hasEducation && !data.education) {
    data.education = []
  }
  if (props.selectedModules.includes('work') && !data.work) {
    data.work = []
  }
  if (props.selectedModules.includes('project') && !data.project) {
    data.project = []
  }
  if (props.selectedModules.includes('internship') && !data.internship) {
    data.internship = []
  }
  if (props.selectedModules.includes('research') && !data.research) {
    data.research = []
  }
  if (props.selectedModules.includes('skill') && !data.skill) {
    data.skill = []
  }
  if (props.selectedModules.includes('selfEvaluation') && !data.selfEvaluation) {
    data.selfEvaluation = { content: '' }
  }
  
  formData.value = data
}

// 初始化表单数据
watch(() => props.selectedModules, (newModules) => {
  if (newModules.length > 0 && !activeTab.value) {
    activeTab.value = newModules[0]
  }
  initializeFormData()
}, { immediate: true })

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

// 实习经历
const addInternship = () => {
  if (!formData.value.internship) formData.value.internship = []
  formData.value.internship.push({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: ''
  })
}

const removeInternship = (index: number) => {
  formData.value.internship.splice(index, 1)
}

// 科研成果
const addResearch = () => {
  if (!formData.value.research) formData.value.research = []
  formData.value.research.push({
    title: '',
    authors: '',
    publication: '',
    date: '',
    description: '',
    link: ''
  })
}

const removeResearch = (index: number) => {
  formData.value.research.splice(index, 1)
}

// 技能特长
const addSkill = () => {
  if (!formData.value.skill) formData.value.skill = []
  formData.value.skill.push({
    category: '',
    items: [],
    level: '',
    itemsText: ''
  })
}

const removeSkill = (index: number) => {
  formData.value.skill.splice(index, 1)
}

// 数据转换：将文本转换为数组
const processFormData = () => {
  // 深拷贝数据
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
  
  // 处理技能项
  if (data.skill && Array.isArray(data.skill)) {
    data.skill = data.skill.map((skill: any) => {
      const processedSkill = { ...skill }
      if (processedSkill.itemsText) {
        processedSkill.items = processedSkill.itemsText
          .split(',')
          .map((item: string) => item.trim())
          .filter((item: string) => item.length > 0)
      }
      delete processedSkill.itemsText
      return processedSkill
    })
  }
  
  // 清理空数组和空对象
  Object.keys(data).forEach(key => {
    if (Array.isArray(data[key]) && data[key].length === 0) {
      delete data[key]
    } else if (typeof data[key] === 'object' && data[key] !== null) {
      if (Object.keys(data[key]).length === 0) {
        delete data[key]
      }
    }
  })
  
  return data
}

// 暴露处理后的数据
defineExpose({
  processFormData
})
</script>

<style scoped>
.module-form {
  @apply w-full;
}

.section-title {
  @apply text-2xl font-bold mb-2;
  color: #1e3a8a;
}

.section-description {
  @apply text-gray-600 mb-6;
}

.module-tabs {
  @apply mt-4;
}

.form-content {
  @apply mt-4;
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

.form-card {
  @apply mb-4;
}

.card-header {
  @apply flex items-center justify-between;
}
</style>

