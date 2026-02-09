<template>
  <div class="my-resumes-page">
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">我的简历</h1>
        <p class="page-description">查看和管理您生成的所有简历</p>
      </div>

      <!-- 操作栏 -->
      <div class="action-bar">
        <el-button type="primary" @click="navigateTo('/create')">
          <el-icon><Plus /></el-icon>
          生成新简历
        </el-button>
        <el-button @click="loadResumes" :loading="loading">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading && resumes.length === 0" class="loading-container">
        <el-icon class="is-loading loading-icon">
          <Loading />
        </el-icon>
        <p class="loading-text">加载中...</p>
      </div>

      <!-- 空状态 -->
      <el-empty
        v-else-if="!loading && resumes.length === 0"
        description="还没有生成任何简历"
        :image-size="200"
      >
        <el-button type="primary" @click="navigateTo('/create')">去生成简历</el-button>
      </el-empty>

      <!-- 简历列表 -->
      <div v-else class="resume-list">
        <el-card
          v-for="resume in resumes"
          :key="resume.id"
          class="resume-card"
          shadow="hover"
        >
          <template #header>
            <div class="card-header">
              <div class="card-title-section">
                <h3 class="resume-title">{{ resume.title }}</h3>
                <el-tag
                  :type="getStatusType(resume.status)"
                  size="small"
                  class="status-tag"
                >
                  {{ getStatusText(resume.status) }}
                </el-tag>
              </div>
            </div>
          </template>

          <div class="resume-content">
            <!-- 个人信息 -->
            <div v-if="resume.personalInfo" class="info-section">
              <div v-if="resume.personalInfo.name" class="info-item">
                <el-icon><User /></el-icon>
                <span>{{ resume.personalInfo.name }}</span>
              </div>
              <div v-if="resume.personalInfo.email" class="info-item">
                <el-icon><Message /></el-icon>
                <span>{{ resume.personalInfo.email }}</span>
              </div>
              <div v-if="resume.personalInfo.phone" class="info-item">
                <el-icon><Phone /></el-icon>
                <span>{{ resume.personalInfo.phone }}</span>
              </div>
            </div>

            <!-- 时间信息 -->
            <div class="time-section">
              <div v-if="resume.createdAt" class="time-item">
                <el-icon><Clock /></el-icon>
                <span>创建时间：{{ formatDate(resume.createdAt) }}</span>
              </div>
              <div v-if="resume.updatedAt" class="time-item">
                <el-icon><Edit /></el-icon>
                <span>更新时间：{{ formatDate(resume.updatedAt) }}</span>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="card-footer">
              <el-button type="primary" @click="viewResume(resume.id)">
                <el-icon><View /></el-icon>
                查看
              </el-button>
              <el-button @click="editResume(resume.id)">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button type="danger" @click="handleDelete(resume.id)">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
          </template>
        </el-card>
      </div>

      <!-- 简历详情对话框 -->
      <el-dialog
        v-model="previewVisible"
        title="简历预览"
        width="80%"
        :close-on-click-modal="false"
      >
        <ResumePreview
          v-if="currentResumeData"
          :resume-data="currentResumeData"
          :resume-id="currentResumeId"
        />
      </el-dialog>

      <!-- 编辑简历对话框 -->
      <el-dialog
        v-model="editDialogVisible"
        title="编辑简历"
        width="520px"
        :close-on-click-modal="false"
        :before-close="handleEditDialogBeforeClose"
        @closed="resetEditForm"
      >
        <div class="edit-dialog-body" v-loading="editDialogLoading">
          <el-form
            :model="editForm"
            label-width="90px"
            label-position="top"
            class="edit-form"
            :disabled="editDialogLoading"
          >
            <el-form-item label="简历标题">
              <el-input v-model="editForm.title" placeholder="请输入简历标题" />
            </el-form-item>

            <el-form-item label="使用模板">
              <el-select
                v-model="editForm.templateId"
                placeholder="请选择模板"
                clearable
                :disabled="editDialogLoading || templates.length === 0"
              >
                <el-option
                  v-for="template in templates"
                  :key="template.id"
                  :label="template.name"
                  :value="template.id"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="简历状态">
              <el-select v-model="editForm.status">
                <el-option
                  v-for="option in statusOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>

            <div class="edit-section-title">个人信息</div>
            <el-form-item label="姓名">
              <el-input v-model="editForm.personalInfo.name" placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="editForm.personalInfo.email" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="editForm.personalInfo.phone" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="地址">
              <el-input v-model="editForm.personalInfo.address" placeholder="请输入地址" />
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <el-button @click="editDialogVisible = false" :disabled="editSubmitLoading">
            取消
          </el-button>
          <el-button type="primary" :loading="editSubmitLoading" @click="handleEditSubmit">
            保存
          </el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Refresh,
  Loading,
  User,
  Message,
  Phone,
  Clock,
  Edit,
  View,
  Delete
} from '@element-plus/icons-vue'
import {
  getResumeList,
  getResumeDetail,
  deleteResume,
  getResumeTemplates,
  updateResume,
  type ResumeListItem,
  type ResumeData,
  type ResumeTemplate,
  type ResumeUpdatePayload
} from '~/services/resume'
import ResumePreview from '~/components/ResumePreview.vue'

type ResumeStatus = 'draft' | 'generating' | 'completed' | 'failed'
interface EditFormState {
  id: string | number | null
  title: string
  templateId: string
  status: ResumeStatus
  personalInfo: Record<string, any>
}

const createDefaultPersonalInfo = () => ({
  name: '',
  email: '',
  phone: '',
  address: ''
})
const createEmptyEditForm = (): EditFormState => ({
  id: null,
  title: '我的简历',
  templateId: '',
  status: 'completed',
  personalInfo: createDefaultPersonalInfo()
})

const statusOptions: { value: ResumeStatus; label: string }[] = [
  { value: 'completed', label: '已完成' },
  { value: 'generating', label: '生成中' },
  { value: 'failed', label: '生成失败' },
  { value: 'draft', label: '草稿' }
]

const templates = ref<ResumeTemplate[]>([])
const resumes = ref<ResumeListItem[]>([])
const loading = ref(false)
const previewVisible = ref(false)
const currentResumeId = ref<string | number | null>(null)
const currentResumeData = ref<ResumeData | null>(null)
const editDialogVisible = ref(false)
const editDialogLoading = ref(false)
const editSubmitLoading = ref(false)
const editForm = ref<EditFormState>(createEmptyEditForm())

// 加载简历列表
const loadResumes = async () => {
  loading.value = true
  try {
    resumes.value = await getResumeList()
    // 按创建时间倒序排列
    resumes.value.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return timeB - timeA
    })
  } catch (error: any) {
    console.error('加载简历列表失败:', error)
    ElMessage.error('加载简历列表失败，请重试')
  } finally {
    loading.value = false
  }
}

const loadTemplates = async () => {
  try {
    if (templates.value.length > 0) {
      return
    }
    templates.value = await getResumeTemplates()
  } catch (error) {
    console.error('加载模板失败:', error)
    templates.value = []
  }
}

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return dateString
  }
}

// 获取状态类型
const getStatusType = (status: string) => {
  const statusMap: Record<string, any> = {
    completed: 'success',
    generating: 'warning',
    failed: 'danger',
    draft: 'info'
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    completed: '已完成',
    generating: '生成中',
    failed: '生成失败',
    draft: '草稿'
  }
  return statusMap[status] || status
}

// 查看简历
const viewResume = async (resumeId: string | number) => {
  try {
    const detail = await getResumeDetail(resumeId)
    if (!detail) {
      ElMessage.warning('获取简历详情失败')
      return
    }

    // 转换为 ResumeData 格式
    currentResumeData.value = {
      templateId: detail.templateId || '',
      modules: [], // 如果需要可以从详情中获取
      personalInfo: detail.personalInfo,
      education: detail.moduleData?.education,
      work: detail.moduleData?.work,
      project: detail.moduleData?.project,
      internship: detail.moduleData?.internship,
      research: detail.moduleData?.research,
      skill: detail.moduleData?.skill,
      selfEvaluation: detail.moduleData?.selfEvaluation
    }
    currentResumeId.value = resumeId
    previewVisible.value = true
  } catch (error) {
    console.error('查看简历失败:', error)
    ElMessage.error('查看简历失败，请重试')
  }
}

// 编辑简历（跳转到创建页面）
const editResume = async (resumeId: string | number) => {
  editDialogVisible.value = true
  editDialogLoading.value = true
  try {
    await loadTemplates()
    const detail = await getResumeDetail(resumeId)
    if (!detail) {
      ElMessage.warning('获取简历详情失败，无法编辑')
      editDialogVisible.value = false
      return
    }
    editForm.value = {
      id: detail.id,
      title: detail.title || '我的简历',
      templateId: detail.templateId || '',
      status: (detail.status as ResumeStatus) || 'completed',
      personalInfo: {
        ...createDefaultPersonalInfo(),
        ...(detail.personalInfo || {})
      }
    }
  } catch (error) {
    console.error('加载简历详情失败:', error)
    ElMessage.error('加载简历详情失败，请稍后重试')
    editDialogVisible.value = false
  } finally {
    editDialogLoading.value = false
  }
}

const handleEditDialogBeforeClose = (done: () => void) => {
  if (editSubmitLoading.value) return
  done()
}

const resetEditForm = () => {
  editForm.value = createEmptyEditForm()
  editDialogLoading.value = false
}

const handleEditSubmit = async () => {
  if (!editForm.value.id) {
    ElMessage.warning('未找到要更新的简历')
    return
  }

  const payload: ResumeUpdatePayload = {
    title: editForm.value.title,
    templateId: editForm.value.templateId || undefined,
    personalInfo: editForm.value.personalInfo,
    status: editForm.value.status
  }

  // 如果没有可用的更新字段，提醒用户
  if (
    payload.title === undefined &&
    !payload.templateId &&
    !payload.personalInfo &&
    !payload.status
  ) {
    ElMessage.warning('请至少修改一项内容')
    return
  }

  editSubmitLoading.value = true
  try {
    await updateResume(editForm.value.id, payload)
    ElMessage.success('简历更新成功')
    editDialogVisible.value = false
    await loadResumes()
  } catch (error: any) {
    console.error('更新简历失败:', error)
    const message =
      error?.response?.data?.message ||
      error?.message ||
      '更新简历失败，请稍后重试'
    ElMessage.error(message)
  } finally {
    editSubmitLoading.value = false
  }
}

// 删除简历
const handleDelete = async (resumeId: string | number) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个简历吗？删除后无法恢复。',
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const success = await deleteResume(resumeId)
    if (success) {
      ElMessage.success('删除成功')
      // 重新加载列表
      await loadResumes()
    } else {
      ElMessage.error('删除失败，请重试')
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除简历失败:', error)
      ElMessage.error('删除失败，请重试')
    }
  }
}

// 页面加载时获取简历列表
onMounted(() => {
  loadResumes()
  loadTemplates()
})
</script>

<style scoped>
.my-resumes-page {
  @apply min-h-screen py-12;
  background: #f5f7fa;
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

.action-bar {
  @apply flex justify-between items-center mb-6;
}

.loading-container {
  @apply flex flex-col items-center justify-center py-20;
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

.loading-text {
  @apply text-lg text-gray-600;
}

.resume-list {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}

.resume-card {
  @apply transition-all duration-300 hover:shadow-lg;
}

.card-header {
  @apply flex justify-between items-center;
}

.card-title-section {
  @apply flex items-center gap-2;
  flex: 1;
}

.resume-title {
  @apply text-lg font-semibold m-0;
  color: #1e293b;
  flex: 1;
}

.status-tag {
  @apply ml-2;
}

.resume-content {
  @apply space-y-4;
}

.info-section {
  @apply space-y-2;
}

.info-item {
  @apply flex items-center gap-2 text-gray-700;
}

.time-section {
  @apply space-y-1 pt-2 border-t border-gray-200;
}

.time-item {
  @apply flex items-center gap-2 text-sm text-gray-500;
}

.card-footer {
  @apply flex justify-end gap-2;
}

.edit-dialog-body {
  @apply p-2;
}

.edit-section-title {
  @apply font-semibold text-gray-700 mt-4 mb-2;
}

.edit-form .el-form-item {
  @apply mb-4;
}

@media (max-width: 768px) {
  .resume-list {
    @apply grid-cols-1;
  }
  
  .action-bar {
    @apply flex-col gap-3 items-stretch;
  }
  
  .action-bar .el-button {
    @apply w-full;
  }
}
</style>
