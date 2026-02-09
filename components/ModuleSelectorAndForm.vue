<template>
  <div class="module-selector-and-form">
    <h3 class="section-title">选择模块并填写信息</h3>
    <p class="section-description">选择要包含的模块，选中的模块必须填写完整信息才能继续</p>
    
    <!-- AI 自动补全开关 -->
    <el-card class="ai-toggle-card" shadow="never">
      <div class="ai-toggle-content">
        <div class="ai-toggle-left">
          <el-checkbox v-model="autoFillMissing" size="large">
            <span class="ai-toggle-label">开启 AI 自动补全</span>
          </el-checkbox>
          <p class="ai-toggle-desc">
            为未填写的描述字段（如工作描述、项目描述、自我评价等）自动生成内容，基于您的求职岗位智能撰写
          </p>
        </div>
        <div class="ai-toggle-right">
          <el-icon class="ai-icon"><MagicStick /></el-icon>
        </div>
      </div>
    </el-card>
    
    <!-- 模块选择区域 -->
    <div class="module-selector-section">
      <h4 class="subsection-title">选择模块</h4>
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
            <h4 class="module-name">{{ module.display_name || module.name }}</h4>
            <div class="module-description">{{ module.description }}</div>
          </div>
          <div v-if="selectedModules.includes(module.id)" class="module-check">
            <span class="check-icon">✓</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 模块信息填写区域 -->
    <div v-if="selectedModules.length > 0" class="module-form-section">
      <h4 class="subsection-title">填写模块信息</h4>
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
              <div v-if="!formData.education || formData.education.length === 0" class="empty-tip">
                <el-empty description="请至少添加一条教育经历" :image-size="100" />
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
                        <el-form-item label="学校名称" required>
                          <el-input v-model="edu.school" placeholder="请输入学校名称" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="专业" required>
                          <el-input v-model="edu.major" placeholder="请输入专业" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="学历" required>
                          <el-select v-model="edu.degree" placeholder="请选择学历" class="w-full">
                            <el-option label="本科" value="本科" />
                            <el-option label="硕士" value="硕士" />
                            <el-option label="博士" value="博士" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="时间" required>
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
            <div v-if="moduleId === 2 || moduleId === '2' || moduleId === 'work'" class="module-section">
              <div class="section-header">
                <h4 class="section-header-title">工作经历</h4>
                <el-button type="primary" size="small" @click="addWork">添加工作经历</el-button>
              </div>
              <div v-if="!formData.work || formData.work.length === 0" class="empty-tip">
                <el-empty description="请至少添加一条工作经历" :image-size="100" />
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
                        <el-form-item label="公司名称" required>
                          <el-input v-model="work.company" placeholder="请输入公司名称" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="职位" required>
                          <el-input v-model="work.position" placeholder="请输入职位" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-form-item label="时间" required>
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
            <div v-if="moduleId === 3 || moduleId === '3' || moduleId === 'project'" class="module-section">
              <div class="section-header">
                <h4 class="section-header-title">项目经历</h4>
                <el-button type="primary" size="small" @click="addProject">添加项目经历</el-button>
              </div>
              <div v-if="!formData.project || formData.project.length === 0" class="empty-tip">
                <el-empty description="请至少添加一条项目经历" :image-size="100" />
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
                        <el-form-item label="项目名称" required>
                          <el-input v-model="project.name" placeholder="请输入项目名称" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="担任角色" required>
                          <el-input v-model="project.role" placeholder="请输入担任角色" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-form-item label="时间" required>
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
            <div v-if="moduleId === 4 || moduleId === '4' || moduleId === 'internship'" class="module-section">
              <div class="section-header">
                <h4 class="section-header-title">实习经历</h4>
                <el-button type="primary" size="small" @click="addInternship">添加实习经历</el-button>
              </div>
              <div v-if="!formData.internship || formData.internship.length === 0" class="empty-tip">
                <el-empty description="请至少添加一条实习经历" :image-size="100" />
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
                        <el-form-item label="公司名称" required>
                          <el-input v-model="internship.company" placeholder="请输入公司名称" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="职位" required>
                          <el-input v-model="internship.position" placeholder="请输入职位" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-form-item label="时间" required>
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
            <div v-if="moduleId === 5 || moduleId === '5' || moduleId === 'research'" class="module-section">
              <div class="section-header">
                <h4 class="section-header-title">科研成果</h4>
                <el-button type="primary" size="small" @click="addResearch">添加科研成果</el-button>
              </div>
              <div v-if="!formData.research || formData.research.length === 0" class="empty-tip">
                <el-empty description="请至少添加一条科研成果" :image-size="100" />
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
                    <el-form-item label="论文/成果标题" required>
                      <el-input v-model="research.title" placeholder="请输入论文或成果标题" />
                    </el-form-item>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="作者">
                          <el-input v-model="research.authors" placeholder="请输入作者（可选）" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="发表时间" required>
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
            <div v-if="moduleId === 6 || moduleId === '6' || moduleId === 'skill'" class="module-section">
              <div class="section-header">
                <h4 class="section-header-title">技能特长</h4>
                <el-button type="primary" size="small" @click="addSkill">添加技能类别</el-button>
              </div>
              <div v-if="!formData.skill || formData.skill.length === 0" class="empty-tip">
                <el-empty description="请至少添加一个技能类别" :image-size="100" />
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
                        <el-form-item label="技能类别" required>
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
                    <el-form-item label="技能项" required>
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
            <div v-if="moduleId === 7 || moduleId === '7' || moduleId === 'selfEvaluation'" class="module-section">
              <div class="section-header">
                <h4 class="section-header-title">自我评价</h4>
              </div>
              <el-card class="form-card">
                <el-form :model="formData.selfEvaluation" label-width="100px">
                  <el-form-item label="自我评价" required>
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
    
    <div v-else class="empty-modules-tip">
      <el-empty description="请至少选择一个模块" :image-size="120" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { MagicStick } from '@element-plus/icons-vue'
import type { ResumeModule } from '@/services/resume'

interface Props {
  modules: ResumeModule[]
  modelValue: {
    selectedModules: string[]
    formData: any
    autoFillMissing?: boolean
  }
}

interface Emits {
  (e: 'update:modelValue', value: { selectedModules: string[], formData: any, autoFillMissing?: boolean }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const activeTab = ref('')

const autoFillMissing = computed({
  get: () => props.modelValue?.autoFillMissing || false,
  set: (value) => {
    emit('update:modelValue', {
      selectedModules: selectedModules.value,
      formData: formData.value,
      autoFillMissing: value
    })
  }
})

const selectedModules = computed({
  get: () => props.modelValue?.selectedModules || [],
  set: (value) => {
    emit('update:modelValue', {
      selectedModules: value,
      formData: formData.value,
      autoFillMissing: autoFillMissing.value
    })
  }
})

const formData = computed({
  get: () => props.modelValue?.formData || {},
  set: (value) => {
    emit('update:modelValue', {
      selectedModules: selectedModules.value,
      formData: value,
      autoFillMissing: autoFillMissing.value
    })
  }
})

// 初始化表单数据
const initializeFormData = () => {
  const data: any = { ...formData.value }
  
  const hasEducation = selectedModules.value.includes('education') || 
                       selectedModules.value.includes(1) || 
                       selectedModules.value.includes('1')
  
  if (hasEducation && !data.education) {
    data.education = []
  }
  if (selectedModules.value.includes('work') || selectedModules.value.includes(2) || selectedModules.value.includes('2')) {
    if (!data.work) data.work = []
  }
  if (selectedModules.value.includes('project') || selectedModules.value.includes(3) || selectedModules.value.includes('3')) {
    if (!data.project) data.project = []
  }
  if (selectedModules.value.includes('internship') || selectedModules.value.includes(4) || selectedModules.value.includes('4')) {
    if (!data.internship) data.internship = []
  }
  if (selectedModules.value.includes('research') || selectedModules.value.includes(5) || selectedModules.value.includes('5')) {
    if (!data.research) data.research = []
  }
  if (selectedModules.value.includes('skill') || selectedModules.value.includes(6) || selectedModules.value.includes('6')) {
    if (!data.skill) data.skill = []
  }
  if (selectedModules.value.includes('selfEvaluation') || selectedModules.value.includes(7) || selectedModules.value.includes('7')) {
    if (!data.selfEvaluation) data.selfEvaluation = { content: '' }
  }
  
  formData.value = data
}

watch(() => selectedModules.value, (newModules) => {
  if (newModules.length > 0 && !activeTab.value) {
    activeTab.value = newModules[0]
  }
  initializeFormData()
}, { immediate: true })

const toggleModule = (moduleId: string) => {
  const current = [...selectedModules.value]
  const index = current.indexOf(moduleId)
  if (index > -1) {
    current.splice(index, 1)
    // 移除模块时，清除对应的表单数据
    clearModuleData(moduleId)
  } else {
    current.push(moduleId)
    initializeFormData()
  }
  selectedModules.value = current
}

const clearModuleData = (moduleId: string) => {
  const data = { ...formData.value }
  if (moduleId === 'education' || moduleId === 1 || moduleId === '1') {
    delete data.education
  } else if (moduleId === 'work' || moduleId === 2 || moduleId === '2') {
    delete data.work
  } else if (moduleId === 'project' || moduleId === 3 || moduleId === '3') {
    delete data.project
  } else if (moduleId === 'internship' || moduleId === 4 || moduleId === '4') {
    delete data.internship
  } else if (moduleId === 'research' || moduleId === 5 || moduleId === '5') {
    delete data.research
  } else if (moduleId === 'skill' || moduleId === 6 || moduleId === '6') {
    delete data.skill
  } else if (moduleId === 'selfEvaluation' || moduleId === 7 || moduleId === '7') {
    delete data.selfEvaluation
  }
  formData.value = data
}

const getModuleName = (moduleId: string) => {
  const module = props.modules.find(m => m.id === moduleId)
  return module?.display_name || module?.name || moduleId
}

// 验证选中的模块是否都已填写
const validateModules = (): boolean => {
  if (selectedModules.value.length === 0) {
    ElMessage.warning('请至少选择一个模块')
    return false
  }

  for (const moduleId of selectedModules.value) {
    if (!isModuleFilled(moduleId)) {
      const moduleName = getModuleName(moduleId)
      ElMessage.warning(`请完善"${moduleName}"模块的信息`)
      return false
    }
  }
  return true
}

const isModuleFilled = (moduleId: string): boolean => {
  const data = formData.value
  
  if (moduleId === 'education' || moduleId === 1 || moduleId === '1') {
    if (!data.education || data.education.length === 0) return false
    return data.education.every((edu: any) => 
      edu.school && edu.major && edu.degree && edu.startDate && edu.endDate
    )
  }
  
  if (moduleId === 'work' || moduleId === 2 || moduleId === '2') {
    if (!data.work || data.work.length === 0) return false
    return data.work.every((work: any) => 
      work.company && work.position && work.startDate && work.endDate
    )
  }
  
  if (moduleId === 'project' || moduleId === 3 || moduleId === '3') {
    if (!data.project || data.project.length === 0) return false
    return data.project.every((project: any) => 
      project.name && project.role && project.startDate && project.endDate
    )
  }
  
  if (moduleId === 'internship' || moduleId === 4 || moduleId === '4') {
    if (!data.internship || data.internship.length === 0) return false
    return data.internship.every((internship: any) => 
      internship.company && internship.position && internship.startDate && internship.endDate
    )
  }
  
  if (moduleId === 'research' || moduleId === 5 || moduleId === '5') {
    if (!data.research || data.research.length === 0) return false
    return data.research.every((research: any) => 
      research.title && research.date
    )
  }
  
  if (moduleId === 'skill' || moduleId === 6 || moduleId === '6') {
    if (!data.skill || data.skill.length === 0) return false
    return data.skill.every((skill: any) => 
      skill.category && skill.itemsText
    )
  }
  
  if (moduleId === 'selfEvaluation' || moduleId === 7 || moduleId === '7') {
    return data.selfEvaluation && data.selfEvaluation.content && data.selfEvaluation.content.trim().length > 0
  }
  
  return true
}

// 数据转换：将文本转换为数组
const processFormData = () => {
  const data = JSON.parse(JSON.stringify(formData.value))
  
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

// 暴露方法
defineExpose({
  validateModules,
  processFormData,
  autoFillMissing
})
</script>

<style scoped>
.module-selector-and-form {
  @apply w-full;
}

.section-title {
  @apply text-2xl font-bold mb-2;
  color: #1e3a8a;
}

.section-description {
  @apply text-gray-600 mb-6;
}

.subsection-title {
  @apply text-lg font-semibold mb-4;
  color: #1e293b;
}

.module-selector-section {
  @apply mb-8;
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

.module-description {
  @apply text-xs text-gray-500 text-center mt-1;
}

.module-check {
  @apply absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center;
  background: #3b82f6;
}

.check-icon {
  @apply text-white text-xs font-bold;
}

.module-form-section {
  @apply mt-8;
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

.empty-tip {
  @apply py-8;
}

.empty-modules-tip {
  @apply py-12;
}

.w-full {
  width: 100%;
}

.ai-toggle-card {
  @apply mb-6 border-2;
  border-color: #e0e7ff;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.ai-toggle-content {
  @apply flex items-center justify-between;
  padding: 8px 0;
}

.ai-toggle-left {
  @apply flex-1;
}

.ai-toggle-label {
  @apply text-base font-semibold;
  color: #1e3a8a;
}

.ai-toggle-desc {
  @apply text-sm mt-2 ml-6;
  color: #64748b;
  line-height: 1.6;
}

.ai-toggle-right {
  @apply flex items-center justify-center;
  width: 48px;
  height: 48px;
}

.ai-icon {
  @apply text-3xl;
  color: #3b82f6;
}
</style>

