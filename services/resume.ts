import { useApi } from '@/composables/useApi'

export interface ResumeTemplate {
  id: string
  name: string
  description: string
  preview?: string
  thumbnail?: string
  preview_image?: string  // 预览图片URL（优先使用）
}

export interface ResumeModule {
  id: string
  name: string
  type: 'education' | 'work' | 'project' | 'internship' | 'research' | 'skill' | 'selfEvaluation'
  icon: string
}

export interface EducationData {
  school: string
  major: string
  degree: string
  startDate: string
  endDate: string
  description?: string
}

export interface WorkData {
  company: string
  position: string
  startDate: string
  endDate: string
  description?: string
  achievements?: string[]
}

export interface ProjectData {
  name: string
  role: string
  startDate: string
  endDate: string
  description?: string
  technologies?: string[]
  achievements?: string[]
}

export interface InternshipData {
  company: string
  position: string
  startDate: string
  endDate: string
  description?: string
}

export interface ResearchData {
  title: string
  authors?: string
  publication?: string
  date: string
  description?: string
  link?: string
}

export interface SkillData {
  category: string
  items: string[]
  level?: string
}

export interface SelfEvaluationData {
  content: string
}

export interface ResumeData {
  templateId: string
  modules: string[]
  personalInfo?: {
    name?: string
    email?: string
    phone?: string
    address?: string
    birthDate?: string
    gender?: string
    targetPosition?: string
    workYears?: string
  }
  education?: EducationData[]
  work?: WorkData[]
  project?: ProjectData[]
  internship?: InternshipData[]
  research?: ResearchData[]
  skill?: SkillData[]
  selfEvaluation?: SelfEvaluationData
  autoFillMissing?: boolean  // 是否启用 AI 自动补全未填写的非必填字段
  title?: string  // 简历标题，用于 PDF 文件名
}

// 后端API请求数据格式
export interface ResumeGenerateRequest {
  template_id: string
  selected_modules: string[]
  personal_info?: {
    name?: string
    email?: string
    phone?: string
    address?: string
    birth_date?: string
    gender?: string
    target_position?: string
    work_years?: string
  }
  module_data?: {
    education?: EducationData[]
    work?: WorkData[]
    project?: ProjectData[]
    internship?: InternshipData[]
    research?: ResearchData[]
    skill?: SkillData[]
    selfEvaluation?: SelfEvaluationData
  }
  draft_id?: number | string
  title?: string
  auto_fill_missing?: boolean  // 是否启用 AI 自动补全未填写的非必填字段
  // 注意：content 字段应该由后端生成，前端不应该发送
  // 但如果后端有 bug，可能需要发送一个占位符
  // content?: string  // 仅在临时修复时使用
}

// 后端API草稿请求数据格式
export interface ResumeDraftRequest {
  id?: number | string
  template_id?: string
  title?: string
  personal_info?: {
    name?: string
    email?: string
    phone?: string
    address?: string
  }
  selected_modules?: string[]
  module_data?: {
    education?: EducationData[]
    work?: WorkData[]
    project?: ProjectData[]
    internship?: InternshipData[]
    research?: ResearchData[]
    skill?: SkillData[]
    selfEvaluation?: SelfEvaluationData
  }
}

export const getResumeTemplates = async (): Promise<ResumeTemplate[]> => {
  const api = useApi()
  const res = await api.get('/resume/templates')
  // 后端返回格式: { message: "获取成功", data: [...] }
  return res?.data?.data || res?.data?.templates || res?.data || []
}

export const getResumeModules = async (): Promise<ResumeModule[]> => {
  const api = useApi()
  const res = await api.get('/resume/modules')
  // 后端返回格式: { message: "获取成功", data: [...] }
  return res?.data?.data || res?.data?.modules || res?.data || []
}

export const generateResume = async (data: ResumeData, draftId?: number | string) => {
  const api = useApi()
  // 转换为后端期望的格式
  const requestData: ResumeGenerateRequest = {
    template_id: data.templateId,
    selected_modules: data.modules,
    personal_info: data.personalInfo ? {
      name: data.personalInfo.name,
      email: data.personalInfo.email,
      phone: data.personalInfo.phone,
      address: data.personalInfo.address,
      birth_date: data.personalInfo.birthDate,
      gender: data.personalInfo.gender,
      target_position: data.personalInfo.targetPosition,
      work_years: data.personalInfo.workYears
    } : undefined,
    module_data: {
      education: data.education,
      work: data.work,
      project: data.project,
      internship: data.internship,
      research: data.research,
      skill: data.skill,
      selfEvaluation: data.selfEvaluation
    },
    title: data.title || '我的简历',  // 使用传入的标题，如果没有则使用默认值
    auto_fill_missing: data.autoFillMissing === true  // 传递 AI 自动补全开关状态
  }
  
  if (draftId) {
    requestData.draft_id = draftId
  }
  
  // 为生成简历接口设置更长的超时时间（60秒）
  // 因为可能涉及 AI 补全、HTML 生成等耗时操作
  const res = await api.post('/resume/generate', requestData, {
    timeout: 60000  // 60秒超时
  })
  // 后端返回格式: { message: "简历生成成功", data: {...} }
  const result = res?.data?.data || res?.data || {}
  return {
    resumeId: result.id || result.resume_id,
    id: result.id || result.resume_id,
    ...result
  }
}

// export const saveResumeDraft = async (data: Partial<ResumeData>, draftId?: number | string) => {
//   const api = useApi()
//   // 转换为后端期望的格式
//   const requestData: ResumeDraftRequest = {}
  
//   if (draftId) {
//     requestData.id = draftId
//   }
  
//   if (data.templateId) {
//     requestData.template_id = data.templateId
//   }
  
//   if (data.modules && data.modules.length > 0) {
//     requestData.selected_modules = data.modules
//   }
  
//   if (data.personalInfo) {
//     requestData.personal_info = data.personalInfo
//   }
  
//   // 构建 module_data
//   const moduleData: any = {}
//   if (data.education) moduleData.education = data.education
//   if (data.work) moduleData.work = data.work
//   if (data.project) moduleData.project = data.project
//   if (data.internship) moduleData.internship = data.internship
//   if (data.research) moduleData.research = data.research
//   if (data.skill) moduleData.skill = data.skill
//   if (data.selfEvaluation) moduleData.selfEvaluation = data.selfEvaluation
  
//   if (Object.keys(moduleData).length > 0) {
//     requestData.module_data = moduleData
//   }
  
//   const res = await api.post('/resume/draft', requestData)
//   // 后端返回格式: { message: "草稿保存成功", data: {...} }
//   return res?.data?.data || res?.data || {}
// }

// export const getResumeDraft = async (draftId?: number | string) => {
//   const api = useApi()
//   const params = draftId ? { id: draftId } : {}
//   const res = await api.get('/resume/draft', params)
//   // 后端返回格式: { message: "获取成功", data: {...} 或 [...] }
//   const data = res?.data?.data || res?.data
  
//   // 如果没有数据或返回的是数组且为空，返回null
//   if (!data || (Array.isArray(data) && data.length === 0)) {
//     return null
//   }
  
//   // 如果返回数组，取第一个（最新的）
//   const draft = Array.isArray(data) ? data[0] : data
  
//   // 安全解析JSON字符串
//   const parseJsonSafely = (str: any, defaultValue: any = null) => {
//     if (!str) return defaultValue
//     if (typeof str === 'string') {
//       try {
//         return JSON.parse(str)
//       } catch (e) {
//         console.error('解析JSON失败:', e)
//         return defaultValue
//       }
//     }
//     return str
//   }
  
//   // 转换为前端期望的格式
//   const selectedModules = parseJsonSafely(draft.selected_modules, [])
//   const personalInfo = parseJsonSafely(draft.personal_info, {})
//   const moduleData = parseJsonSafely(draft.module_data, {})
  
//   return {
//     templateId: draft.template_id || draft.templateId,
//     modules: Array.isArray(selectedModules) ? selectedModules : [],
//     personalInfo: personalInfo || {},
//     formData: moduleData || {},
//     id: draft.id,
//     title: draft.title
//   }
// }

// 获取简历详情
export interface ResumeDetail {
  id: string | number
  title: string
  templateId: string
  content?: string
  personalInfo?: any
  moduleData?: any
  status: string
  createdAt?: string
  updatedAt?: string
}

export const getResumeDetail = async (resumeId: string | number): Promise<ResumeDetail | null> => {
  try {
    const api = useApi()
    const res = await api.get(`/resume/${resumeId}`)
    const data = res?.data?.data || res?.data
    
    if (!data) return null
    
    // 安全解析JSON字符串
    const parseJsonSafely = (str: any, defaultValue: any = null) => {
      if (!str) return defaultValue
      if (typeof str === 'string') {
        try {
          return JSON.parse(str)
        } catch (e) {
          console.error('解析JSON失败:', e)
          return defaultValue
        }
      }
      return str
    }
    
    return {
      id: data.id || data.resume_id,
      title: data.title || '我的简历',
      templateId: data.template_id || data.templateId,
      content: data.content,
      personalInfo: parseJsonSafely(data.personal_info, {}),
      moduleData: parseJsonSafely(data.module_data, {}),
      status: data.status || 'completed',
      createdAt: data.created_at || data.createdAt,
      updatedAt: data.updated_at || data.updatedAt
    }
  } catch (error) {
    console.error('获取简历详情失败:', error)
    return null
  }
}

// 简历列表项接口
export interface ResumeListItem {
  id: string | number
  title: string
  templateId?: string
  status: string
  createdAt?: string
  updatedAt?: string
  personalInfo?: {
    name?: string
    email?: string
    phone?: string
  }
}

// 获取简历列表
export const getResumeList = async (): Promise<ResumeListItem[]> => {
  try {
    const api = useApi()
    const res = await api.get('/resume/list')
    const data = res?.data?.data || res?.data || []
    
    if (!Array.isArray(data)) {
      return []
    }
    
    // 安全解析JSON字符串
    const parseJsonSafely = (str: any, defaultValue: any = null) => {
      if (!str) return defaultValue
      if (typeof str === 'string') {
        try {
          return JSON.parse(str)
        } catch (e) {
          return defaultValue
        }
      }
      return str
    }
    
    return data.map((item: any) => ({
      id: item.id || item.resume_id,
      title: item.title || '我的简历',
      templateId: item.template_id || item.templateId,
      status: item.status || 'completed',
      createdAt: item.created_at || item.createdAt,
      updatedAt: item.updated_at || item.updatedAt,
      personalInfo: parseJsonSafely(item.personal_info, {})
    }))
  } catch (error) {
    console.error('获取简历列表失败:', error)
    return []
  }
}

// 删除简历
export const deleteResume = async (resumeId: string | number): Promise<boolean> => {
  try {
    const api = useApi()
    await api.delete(`/resume/${resumeId}`)
    return true
  } catch (error) {
    console.error('删除简历失败:', error)
    return false
  }
}

export interface ResumeUpdatePayload {
  templateId?: string
  title?: string
  personalInfo?: Record<string, any>
  moduleData?: Record<string, any>
  content?: string
  status?: 'draft' | 'generating' | 'completed' | 'failed'
}

export const updateResume = async (
  resumeId: string | number,
  data: ResumeUpdatePayload
) => {
  const api = useApi()
  const payload: Record<string, any> = {}

  if (Object.prototype.hasOwnProperty.call(data, 'title')) {
    payload.title = data.title
  }
  if (data.templateId) {
    payload.template_id = data.templateId
  }
  if (Object.prototype.hasOwnProperty.call(data, 'personalInfo') && data.personalInfo) {
    payload.personal_info = data.personalInfo
  }
  if (Object.prototype.hasOwnProperty.call(data, 'moduleData') && data.moduleData) {
    payload.module_data = data.moduleData
  }
  if (Object.prototype.hasOwnProperty.call(data, 'content')) {
    payload.content = data.content
  }
  if (data.status) {
    payload.status = data.status
  }

  if (Object.keys(payload).length === 0) {
    throw new Error('没有需要更新的内容')
  }

  const res = await api.put(`/resume/${resumeId}`, payload)
  return res?.data?.data || res?.data || {}
}

// AI优化接口
export interface OptimizeRequest {
  type: 'work_description' | 'project_description' | 'self_evaluation' | 'education_description'
  content: string
  context?: Record<string, any>
}

export interface OptimizeResponse {
  content: string
  suggestions?: string[]
}

export const optimizeResumeContent = async (data: OptimizeRequest): Promise<OptimizeResponse> => {
  try {
    const api = useApi()
    const res = await api.post('/resume/optimize', data)
    return res?.data?.data || res?.data || { content: data.content }
  } catch (error) {
    console.error('AI优化失败:', error)
    throw error
  }
}

// 下载PDF
export const downloadResumePDF = async (resumeId: string | number): Promise<{ blob: Blob, filename?: string }> => {
  try {
    // 直接使用 useApi，但需要确保 responseType 正确传递
    const api = useApi()
    
    // 使用 axios 实例直接调用，确保 responseType 正确设置
    const nuxt = useNuxtApp()
    const axiosInstance = nuxt.$axios as any
    
    const res = await axiosInstance.get(`/resume/${resumeId}/download`, {
      responseType: 'blob',  // 重要：指定响应类型为 blob
      timeout: 60000  // 60秒超时
    })
    
    // 从响应头获取文件名
    const contentDisposition = res.headers?.['content-disposition'] || res.headers?.['Content-Disposition']
    let filename: string | undefined = undefined
    
    if (contentDisposition) {
      // 匹配文件名，支持多种格式
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '')
        // 处理 UTF-8 编码的文件名
        if (filename.startsWith("UTF-8''")) {
          filename = decodeURIComponent(filename.replace("UTF-8''", ''))
        } else if (filename.startsWith("UTF-8\'\'")) {
          filename = decodeURIComponent(filename.replace("UTF-8\'\'", ''))
        }
      }
    }
    
    // 确保返回的是 Blob 对象
    const blob = res.data instanceof Blob ? res.data : new Blob([res.data], { type: 'application/pdf' })
    
    return {
      blob,
      filename
    }
  } catch (error) {
    console.error('下载PDF失败:', error)
    throw error
  }
}

