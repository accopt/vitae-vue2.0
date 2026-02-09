<template>
  <div class="resume-preview">
    <el-card class="preview-card">
      <template #header>
        <div class="preview-header">
          <h3 class="preview-title">简历预览</h3>
          <div class="preview-actions">
            <el-button size="small" @click="handleDownload">下载PDF</el-button>
            <el-button size="small" type="primary" @click="handlePrint">打印</el-button>
          </div>
        </div>
      </template>
      
      <!-- HTML渲染模式（推荐）：直接渲染后端返回的HTML -->
      <div 
        v-if="htmlContent" 
        class="resume-html-content"
        :class="templateClass"
        ref="resumeHtmlRef"
        v-html="htmlContent"
      ></div>
      
      <!-- 组件渲染模式：使用Vue组件渲染 -->
      <div 
        v-else
        class="resume-content" 
        :class="templateClass"
        ref="resumeContentRef"
      >
        <!-- 个人信息 -->
        <div v-if="resumeData.personalInfo" class="resume-section personal-info-section">
          <div class="section-header">
            <h1 class="name">{{ resumeData.personalInfo.name || '姓名' }}</h1>
          </div>
          <div class="contact-info">
            <span v-if="resumeData.personalInfo.email" class="contact-item">
              <el-icon><Message /></el-icon>
              {{ resumeData.personalInfo.email }}
            </span>
            <span v-if="resumeData.personalInfo.phone" class="contact-item">
              <el-icon><Phone /></el-icon>
              {{ resumeData.personalInfo.phone }}
            </span>
            <span v-if="resumeData.personalInfo.address" class="contact-item">
              <el-icon><Location /></el-icon>
              {{ resumeData.personalInfo.address }}
            </span>
          </div>
        </div>

        <!-- 教育经历 -->
        <div v-if="resumeData.education && resumeData.education.length > 0" class="resume-section">
          <h2 class="section-title">
            <el-icon><Reading /></el-icon>
            教育经历
          </h2>
          <div v-for="(edu, index) in resumeData.education" :key="index" class="section-item">
            <div class="item-header">
              <div class="item-title-line">
                <span class="item-title">{{ edu.school || '学校名称' }}</span>
                <span class="item-meta">{{ formatDateRange(edu.startDate, edu.endDate) }}</span>
              </div>
              <div class="item-subtitle">
                <span v-if="edu.major">{{ edu.major }}</span>
                <span v-if="edu.degree" class="degree"> · {{ edu.degree }}</span>
              </div>
            </div>
            <p v-if="edu.description" class="item-description">{{ edu.description }}</p>
          </div>
        </div>

        <!-- 工作经历 -->
        <div v-if="resumeData.work && resumeData.work.length > 0" class="resume-section">
          <h2 class="section-title">
            <el-icon><Briefcase /></el-icon>
            工作经历
          </h2>
          <div v-for="(work, index) in resumeData.work" :key="index" class="section-item">
            <div class="item-header">
              <div class="item-title-line">
                <span class="item-title">{{ work.company || '公司名称' }}</span>
                <span class="item-meta">{{ formatDateRange(work.startDate, work.endDate) }}</span>
              </div>
              <div class="item-subtitle">{{ work.position || '职位' }}</div>
            </div>
            <p v-if="work.description" class="item-description">{{ work.description }}</p>
            <ul v-if="work.achievements && work.achievements.length > 0" class="achievement-list">
              <li v-for="(achievement, i) in work.achievements" :key="i">{{ achievement }}</li>
            </ul>
          </div>
        </div>

        <!-- 项目经历 -->
        <div v-if="resumeData.project && resumeData.project.length > 0" class="resume-section">
          <h2 class="section-title">
            <el-icon><FolderOpened /></el-icon>
            项目经历
          </h2>
          <div v-for="(project, index) in resumeData.project" :key="index" class="section-item">
            <div class="item-header">
              <div class="item-title-line">
                <span class="item-title">{{ project.name || '项目名称' }}</span>
                <span class="item-meta">{{ formatDateRange(project.startDate, project.endDate) }}</span>
              </div>
              <div class="item-subtitle">{{ project.role || '角色' }}</div>
            </div>
            <p v-if="project.description" class="item-description">{{ project.description }}</p>
            <div v-if="project.technologies && project.technologies.length > 0" class="tech-stack">
              <span class="tech-label">技术栈：</span>
              <el-tag
                v-for="(tech, i) in project.technologies"
                :key="i"
                size="small"
                class="tech-tag"
              >
                {{ tech }}
              </el-tag>
            </div>
            <ul v-if="project.achievements && project.achievements.length > 0" class="achievement-list">
              <li v-for="(achievement, i) in project.achievements" :key="i">{{ achievement }}</li>
            </ul>
          </div>
        </div>

        <!-- 实习经历 -->
        <div v-if="resumeData.internship && resumeData.internship.length > 0" class="resume-section">
          <h2 class="section-title">
            <el-icon><Document /></el-icon>
            实习经历
          </h2>
          <div v-for="(internship, index) in resumeData.internship" :key="index" class="section-item">
            <div class="item-header">
              <div class="item-title-line">
                <span class="item-title">{{ internship.company || '公司名称' }}</span>
                <span class="item-meta">{{ formatDateRange(internship.startDate, internship.endDate) }}</span>
              </div>
              <div class="item-subtitle">{{ internship.position || '职位' }}</div>
            </div>
            <p v-if="internship.description" class="item-description">{{ internship.description }}</p>
          </div>
        </div>

        <!-- 科研成果 -->
        <div v-if="resumeData.research && resumeData.research.length > 0" class="resume-section">
          <h2 class="section-title">
            <el-icon><Trophy /></el-icon>
            科研成果
          </h2>
          <div v-for="(research, index) in resumeData.research" :key="index" class="section-item">
            <div class="item-header">
              <div class="item-title-line">
                <span class="item-title">{{ research.title || '成果标题' }}</span>
                <span v-if="research.date" class="item-meta">{{ research.date }}</span>
              </div>
              <div class="item-subtitle">
                <span v-if="research.authors">{{ research.authors }}</span>
                <span v-if="research.publication" class="publication"> · {{ research.publication }}</span>
              </div>
            </div>
            <p v-if="research.description" class="item-description">{{ research.description }}</p>
            <a v-if="research.link" :href="research.link" target="_blank" class="research-link">
              查看详情
            </a>
          </div>
        </div>

        <!-- 技能特长 -->
        <div v-if="resumeData.skill && resumeData.skill.length > 0" class="resume-section">
          <h2 class="section-title">
            <el-icon><Lightning /></el-icon>
            技能特长
          </h2>
          <div v-for="(skill, index) in resumeData.skill" :key="index" class="skill-item">
            <div class="skill-header">
              <span class="skill-category">{{ skill.category || '技能类别' }}</span>
              <span v-if="skill.level" class="skill-level">{{ skill.level }}</span>
            </div>
            <div v-if="skill.items && skill.items.length > 0" class="skill-tags">
              <el-tag
                v-for="(item, i) in skill.items"
                :key="i"
                size="small"
                class="skill-tag"
              >
                {{ item }}
              </el-tag>
            </div>
          </div>
        </div>

        <!-- 自我评价 -->
        <div v-if="resumeData.selfEvaluation?.content" class="resume-section">
          <h2 class="section-title">
            <el-icon><Star /></el-icon>
            自我评价
          </h2>
          <p class="self-evaluation">{{ resumeData.selfEvaluation.content }}</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Message,
  Phone,
  Location,
  Reading,
  Briefcase,
  FolderOpened,
  Document,
  Trophy,
  Lightning,
  Star
} from '@element-plus/icons-vue'
import type { ResumeData } from '@/services/resume'
import { getResumeDetail, downloadResumePDF } from '@/services/resume'

interface Props {
  resumeData?: ResumeData
  resumeId?: string | number
  templateId?: string
  htmlContent?: string  // 直接传入HTML内容
}

const props = defineProps<Props>()
const resumeContentRef = ref<HTMLElement>()
const resumeHtmlRef = ref<HTMLElement>()
const htmlContent = ref<string | null>(props.htmlContent || null)
const resumeTitle = ref<string>('我的简历')  // 简历标题，用于 PDF 文件名

// 根据templateId获取模板样式类
const templateClass = computed(() => {
  const templateId = props.templateId || props.resumeData?.templateId || 'template1'
  return `template-${templateId}`
})

// 如果传入了resumeId，获取简历详情（包含HTML内容）
onMounted(async () => {
  if (props.resumeId && !htmlContent.value) {
    try {
      const detail = await getResumeDetail(props.resumeId)
      if (detail) {
        if (detail.content) {
          htmlContent.value = detail.content
        }
        // 获取简历标题
        if (detail.title) {
          resumeTitle.value = detail.title
        }
      }
    } catch (error) {
      console.error('获取简历详情失败:', error)
    }
  }
})

// 监听resumeId变化
watch(() => props.resumeId, async (newId) => {
  if (newId) {
    try {
      const detail = await getResumeDetail(newId)
      if (detail) {
        if (detail.content && !htmlContent.value) {
          htmlContent.value = detail.content
        }
        // 更新简历标题
        if (detail.title) {
          resumeTitle.value = detail.title
        }
      }
    } catch (error) {
      console.error('获取简历详情失败:', error)
    }
  }
})

const formatDateRange = (startDate?: string, endDate?: string) => {
  if (!startDate && !endDate) return ''
  if (startDate && !endDate) return `${startDate} 至今`
  if (!startDate && endDate) return `至 ${endDate}`
  return `${startDate} - ${endDate}`
}

const handleDownload = async () => {
  // 优先使用后端 PDF 下载接口
  if (props.resumeId) {
    try {
      ElMessage.info('正在生成PDF，请稍候...')
      
      // 如果还没有获取标题，先获取简历详情
      if (resumeTitle.value === '我的简历') {
        try {
          const detail = await getResumeDetail(props.resumeId)
          if (detail?.title) {
            resumeTitle.value = detail.title
          }
        } catch (e) {
          console.warn('获取简历标题失败，使用默认标题')
        }
      }
      
      const { blob, filename: serverFilename } = await downloadResumePDF(props.resumeId)
      
      // 清理文件名中的非法字符
      const sanitizeFileName = (fileName: string): string => {
        return fileName
          .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')  // 替换 Windows 非法字符和控制字符
          .replace(/\s+/g, '_')  // 替换空格为下划线
          .trim() || '我的简历'
      }
      
      // 优先使用服务器返回的文件名，否则使用简历标题
      let downloadFilename = serverFilename
      if (!downloadFilename) {
        const safeFileName = sanitizeFileName(resumeTitle.value)
        downloadFilename = `${safeFileName}.pdf`
      } else {
        // 如果服务器返回的文件名没有扩展名，添加 .pdf
        if (!downloadFilename.endsWith('.pdf')) {
          downloadFilename = `${downloadFilename}.pdf`
        }
      }
      
      // 创建 blob URL 并触发下载
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = downloadFilename
      link.style.display = 'none'  // 隐藏链接
      link.setAttribute('download', downloadFilename)  // 确保设置 download 属性
      document.body.appendChild(link)
      
      // 触发点击下载
      link.click()
      
      // 延迟清理，确保下载开始
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link)
        }
        window.URL.revokeObjectURL(url)
      }, 200)
      
      ElMessage.success('PDF下载成功')
      return
    } catch (error: any) {
      console.error('后端PDF下载失败，尝试前端生成:', error)
      // 如果后端下载失败，尝试前端生成
    }
  }
  
  // 前端生成 PDF（备用方案）
  // try {
  //   ElMessage.info('正在生成PDF，请稍候...')
    
  //   // 获取要导出的内容元素
  //   const contentElement = htmlContent.value ? resumeHtmlRef.value : resumeContentRef.value
  //   if (!contentElement) {
  //     ElMessage.warning('无法生成PDF：内容为空')
  //     return
  //   }
    
  //   // 动态导入 html2pdf.js
  //   const html2pdf = (await import('html2pdf.js')).default
    
  //   // 清理文件名
  //   const sanitizeFileName = (fileName: string): string => {
  //     return fileName
  //       .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')  // 替换 Windows 非法字符和控制字符
  //       .replace(/\s+/g, '_')  // 替换空格为下划线
  //       .trim() || '我的简历'
  //   }
  //   const safeFileName = sanitizeFileName(resumeTitle.value || '我的简历')
    
  //   // 配置 PDF 选项（A4 格式）
  //   const opt = {
  //     margin: [0, 0, 0, 0],  // 上下左右边距（单位：mm）
  //     filename: `${safeFileName}.pdf`,
  //     image: { 
  //       type: 'jpeg', 
  //       quality: 0.98 
  //     },
  //     html2canvas: { 
  //       scale: 2,  // 提高清晰度
  //       useCORS: true,
  //       letterRendering: true,
  //       logging: false,
  //       backgroundColor: '#ffffff'  // 确保背景为白色
  //     },
  //     jsPDF: { 
  //       unit: 'mm', 
  //       format: 'a4',  // A4 格式 (210mm x 297mm)
  //       orientation: 'portrait'  // 纵向
  //     },
  //     pagebreak: { 
  //       mode: ['avoid-all', 'css', 'legacy'],
  //       before: '.page-break-before',
  //       after: '.page-break-after',
  //       avoid: '.page-break-avoid'
  //     }
  //   }
    
  //   // 生成 PDF
  //   await html2pdf().set(opt).from(contentElement).save()
    
  //   ElMessage.success('PDF生成成功')
  // } catch (error: any) {
  //   console.error('生成PDF失败:', error)
  //   ElMessage.error(error.message || 'PDF生成失败，请重试')
  // }
}

const handlePrint = () => {
  // 优先使用HTML内容
  const contentElement = htmlContent.value ? resumeHtmlRef.value : resumeContentRef.value
  if (!contentElement) {
    ElMessage.warning('无法打印：内容为空')
    return
  }
  
  // 创建打印窗口
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    ElMessage.error('无法打开打印窗口，请检查浏览器设置')
    return
  }
  
  // 获取内容
  const content = contentElement.innerHTML
  
  // 获取所有样式（包括内联样式和外部样式表）
  const styles = Array.from(document.styleSheets)
    .map(sheet => {
      try {
        return Array.from(sheet.cssRules)
          .map(rule => rule.cssText)
          .join('\n')
      } catch (e) {
        return ''
      }
    })
    .filter(Boolean)
    .join('\n')
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>简历打印</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body { 
            font-family: 'Microsoft YaHei', Arial, sans-serif;
            padding: 20px;
            background: white;
          }
          @page {
            size: A4;
            margin: 0;
          }
          ${styles}
          /* 打印样式优化 */
          @media print {
            body { 
              padding: 0;
              margin: 0;
            }
            .preview-header,
            .preview-actions,
            .el-card__header {
              display: none !important;
            }
            .resume-content,
            .resume-html-content {
              padding: 0 !important;
              margin: 0 !important;
              box-shadow: none !important;
            }
            /* 确保颜色打印 */
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `)
  printWindow.document.close()
  printWindow.focus()
  
  // 等待内容加载完成后打印
  setTimeout(() => {
    printWindow.print()
  }, 500)
}

</script>

<style scoped>
.resume-preview {
  @apply w-full;
}

.preview-card {
  @apply mb-6;
}

.preview-header {
  @apply flex items-center justify-between;
}

.preview-title {
  @apply text-xl font-bold m-0;
  color: #1e3a8a;
}

.preview-actions {
  @apply flex gap-2;
}

.resume-content {
  @apply p-8 bg-white;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  line-height: 1.8;
  color: #333;
}

.resume-section {
  @apply mb-8;
}

.personal-info-section {
  @apply text-center mb-10 pb-8 border-b-2 border-gray-300;
}

.section-header {
  @apply mb-4;
}

.name {
  @apply text-3xl font-bold mb-4;
  color: #1e3a8a;
}

.contact-info {
  @apply flex flex-wrap justify-center gap-4 text-gray-600;
}

.contact-item {
  @apply flex items-center gap-1;
}

.section-title {
  @apply text-xl font-bold mb-4 pb-2 flex items-center gap-2;
  color: #1e3a8a;
  border-bottom: 2px solid #1e3a8a;
}

.section-item {
  @apply mb-6;
}

.item-header {
  @apply mb-2;
}

.item-title-line {
  @apply flex justify-between items-center mb-1;
}

.item-title {
  @apply text-lg font-semibold;
  color: #1e293b;
}

.item-meta {
  @apply text-sm text-gray-500;
}

.item-subtitle {
  @apply text-base text-gray-600;
}

.degree {
  @apply text-gray-500;
}

.item-description {
  @apply text-gray-700 mt-2 mb-2;
  line-height: 1.8;
}

.achievement-list {
  @apply list-disc list-inside mt-2 ml-4 text-gray-700;
}

.achievement-list li {
  @apply mb-1;
}

.tech-stack {
  @apply mt-2 mb-2 flex flex-wrap items-center gap-2;
}

.tech-label {
  @apply text-sm text-gray-600;
}

.tech-tag {
  @apply mr-1;
}

.skill-item {
  @apply mb-4;
}

.skill-header {
  @apply flex justify-between items-center mb-2;
}

.skill-category {
  @apply font-semibold text-base;
  color: #1e293b;
}

.skill-level {
  @apply text-sm text-gray-500;
}

.skill-tags {
  @apply flex flex-wrap gap-2;
}

.skill-tag {
  @apply mr-1;
}

.publication {
  @apply text-gray-500;
}

.research-link {
  @apply text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block;
  text-decoration: underline;
}

.self-evaluation {
  @apply text-gray-700 leading-relaxed;
  line-height: 1.8;
}

/* ========== 模板1：经典模板 ========== */
.template-template1 .resume-content {
  @apply p-8 bg-white;
  font-family: 'Microsoft YaHei', 'SimSun', serif;
  line-height: 1.8;
  color: #333;
}

.template-template1 .personal-info-section {
  @apply text-center mb-10 pb-8;
  border-bottom: 3px solid #1e3a8a;
}

.template-template1 .name {
  @apply text-3xl font-bold mb-4;
  color: #1e3a8a;
  letter-spacing: 2px;
}

.template-template1 .section-title {
  @apply text-xl font-bold mb-4 pb-2 flex items-center gap-2;
  color: #1e3a8a;
  border-bottom: 2px solid #1e3a8a;
}

.template-template1 .section-item {
  @apply mb-6 pl-4;
  border-left: 3px solid #e2e8f0;
  padding-left: 20px;
}

/* ========== 模板2：现代模板 ========== */
.template-template2 .resume-content {
  @apply p-8 bg-white;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  line-height: 1.8;
  color: #2d3748;
  background: linear-gradient(to bottom, #f7fafc 0%, #ffffff 100%);
}

.template-template2 .personal-info-section {
  @apply text-center mb-10 pb-8;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.template-template2 .personal-info-section .name {
  @apply text-4xl font-bold mb-4;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.template-template2 .personal-info-section .contact-item {
  color: rgba(255, 255, 255, 0.9);
}

.template-template2 .section-title {
  @apply text-xl font-bold mb-4 pb-2 flex items-center gap-2;
  color: #667eea;
  border-bottom: 2px solid #667eea;
  background: linear-gradient(to right, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  border-bottom: 2px solid #667eea;
}

.template-template2 .section-item {
  @apply mb-6 p-4;
  background: #f7fafc;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  transition: all 0.3s ease;
}

.template-template2 .section-item:hover {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
  transform: translateX(4px);
}

/* ========== 模板3：创意模板 ========== */
.template-template3 .resume-content {
  @apply p-8 bg-white;
  font-family: 'Microsoft YaHei', 'Helvetica Neue', sans-serif;
  line-height: 1.9;
  color: #1a202c;
  background: #fffef5;
}

.template-template3 .personal-info-section {
  @apply text-left mb-10 pb-8;
  border-bottom: 4px double #ff9800;
  padding-bottom: 20px;
  position: relative;
}

.template-template3 .personal-info-section::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: #ff9800;
}

.template-template3 .name {
  @apply text-4xl font-bold mb-4;
  color: #ff9800;
  position: relative;
  display: inline-block;
}

.template-template3 .name::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 4px;
  background: #ff9800;
}

.template-template3 .section-title {
  @apply text-xl font-bold mb-4 pb-2 flex items-center gap-2;
  color: #ff9800;
  border-bottom: 3px solid #ff9800;
  position: relative;
  padding-left: 15px;
}

.template-template3 .section-title::before {
  content: '◆';
  position: absolute;
  left: 0;
  color: #ff9800;
  font-size: 16px;
}

.template-template3 .section-item {
  @apply mb-6 p-5;
  background: white;
  border: 2px solid #ffe0b2;
  border-radius: 0;
  position: relative;
  box-shadow: 4px 4px 0 #ffcc80;
}

.template-template3 .item-title {
  @apply text-lg font-semibold;
  color: #ff9800;
}

.template-template3 .tech-tag,
.template-template3 .skill-tag {
  background: #fff3e0;
  color: #e65100;
  border: 1px solid #ffcc80;
}

/* ========== 默认样式（当templateId不匹配时） ========== */
.resume-content {
  @apply p-8 bg-white;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  line-height: 1.8;
  color: #333;
}

/* HTML渲染模式样式 */
.resume-html-content {
  @apply w-full;
  /* A4尺寸 */
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  background: white;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  /* 确保 PDF 导出时使用 A4 格式 */
  page-break-after: auto;
  page-break-inside: avoid;
}

/* 样式穿透：确保后端传来的HTML标签样式正确应用 */
.resume-html-content :deep(.left-sidebar) {
  /* 模板1左侧边栏样式 - 由后端HTML自带样式控制 */
}

.resume-html-content :deep(.right-content) {
  /* 模板1右侧内容样式 - 由后端HTML自带样式控制 */
}

.resume-html-content :deep(.card) {
  /* 模板2卡片样式 - 由后端HTML自带样式控制 */
}

.resume-html-content :deep(.section-title) {
  /* 通用标题样式 - 由后端HTML自带样式控制 */
}

/* 打印样式 */
@media print {
  .preview-header,
  .preview-actions,
  .el-card__header {
    display: none !important;
  }
  
  .resume-content,
  .resume-html-content {
    padding: 0 !important;
    margin: 0 !important;
    box-shadow: none !important;
    width: 100% !important;
    min-height: auto !important;
  }
  
  /* 确保颜色打印 */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  
  /* 打印时统一使用简洁样式 */
  .template-template2 .personal-info-section {
    background: #667eea !important;
  }
  
  .template-template3 .section-item {
    box-shadow: none !important;
    border: 1px solid #ccc !important;
  }
  
  /* 分页控制 */
  .resume-section,
  .section {
    page-break-inside: avoid;
    break-inside: avoid;
  }
}
</style>

