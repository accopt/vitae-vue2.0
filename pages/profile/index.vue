<template>
  <div class="profile-container">
    <div class="profile-content">
      <div class="profile-card">
        <h2 class="profile-title">个人信息</h2>
        
        <!-- 用户信息表单 -->
        <el-tabs v-model="activeTab" class="profile-tabs">
          <el-tab-pane label="基本信息" name="info">
            <el-form :model="userForm" ref="userFormRef" label-width="100px" class="profile-form">
              <el-form-item label="头像">
                <div class="avatar-upload">
                  <div v-if="userForm.avatar" class="avatar-preview">
                    <img :src="userForm.avatar" alt="Avatar" @error="handleAvatarError" />
                  </div>
                  <div v-else class="avatar-placeholder">
                    {{ getFirstChar(userForm.username || '用户') }}
                  </div>
                  <div class="avatar-input-wrapper">
                    <el-input 
                      v-model="userForm.avatar" 
                      placeholder="请输入头像链接URL"
                      class="avatar-input"
                    />
                    <p class="avatar-hint">支持图片URL链接</p>
                  </div>
                </div>
              </el-form-item>
              
              <el-form-item label="用户名">
                <el-input v-model="userForm.username" placeholder="请输入用户名" />
              </el-form-item>
              
              <el-form-item label="邮箱">
                <el-input v-model="userForm.email" placeholder="请输入邮箱" type="email" />
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" :loading="saving" @click="handleSaveInfo">保存修改</el-button>
                <el-button @click="handleResetInfo">重置</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          
          <el-tab-pane label="修改密码" name="password">
            <el-form :model="passwordForm" ref="passwordFormRef" :rules="passwordRules" label-width="100px" class="profile-form">
              <el-form-item label="原密码" prop="oldPassword">
                <el-input 
                  v-model="passwordForm.oldPassword" 
                  type="password" 
                  placeholder="请输入原密码"
                  show-password
                />
              </el-form-item>
              
              <el-form-item label="新密码" prop="newPassword">
                <el-input 
                  v-model="passwordForm.newPassword" 
                  type="password" 
                  placeholder="请输入新密码"
                  show-password
                />
              </el-form-item>
              
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input 
                  v-model="passwordForm.confirmPassword" 
                  type="password" 
                  placeholder="请再次输入新密码"
                  show-password
                />
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" :loading="changingPassword" @click="handleChangePassword">修改密码</el-button>
                <el-button @click="handleResetPassword">重置</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { updateUserInfo, changePassword, getCurrentUser } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, reactive, onMounted } from 'vue'

const auth = useAuthStore()
const activeTab = ref('info')
const saving = ref(false)
const changingPassword = ref(false)
const userFormRef = ref()
const passwordFormRef = ref()

const userForm = reactive({
  username: '',
  email: '',
  avatar: ''
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const getFirstChar = (text: string) => {
  if (!text) return '用'
  return text.charAt(0).toUpperCase()
}

const loadUserInfo = async () => {
  try {
    const user = auth.user
    if (user) {
      userForm.username = user.username || ''
      userForm.email = user.email || ''
      userForm.avatar = user.avatar || ''
    } else {
      // 如果store中没有用户信息，从API获取
      const res = await getCurrentUser()
      const userData = res?.data || res
      if (userData) {
        userForm.username = userData.username || ''
        userForm.email = userData.email || ''
        userForm.avatar = userData.avatar || ''
        auth.setUser(userData)
      }
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

const handleSaveInfo = async () => {
  if (!userForm.username) {
    ElMessage.warning('请输入用户名')
    return
  }
  
  saving.value = true
  try {
    const res = await updateUserInfo({
      username: userForm.username,
      email: userForm.email,
      avatar: userForm.avatar
    })
    // 更新 store 中的用户信息
    const updatedUser = res?.user || res?.data || {
      username: userForm.username,
      email: userForm.email,
      avatar: userForm.avatar
    }
    auth.setUser({ ...auth.user, ...updatedUser })
    ElMessage.success('保存成功')
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || '保存失败，请重试')
  } finally {
    saving.value = false
  }
}

const handleResetInfo = () => {
  loadUserInfo()
}

const handleChangePassword = async () => {
  if (!passwordFormRef.value) return
  
  await passwordFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    
    changingPassword.value = true
    try {
      await changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      })
      ElMessage.success('密码修改成功')
      handleResetPassword()
    } catch (error: any) {
      ElMessage.error(error?.response?.data?.message || '密码修改失败，请重试')
    } finally {
      changingPassword.value = false
    }
  })
}

const handleResetPassword = () => {
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  if (passwordFormRef.value) {
    passwordFormRef.value.clearValidate()
  }
}

const handleAvatarError = () => {
  ElMessage.warning('头像加载失败，请检查链接是否正确')
  userForm.avatar = ''
}

onMounted(() => {
  loadUserInfo()
})
</script>

<style scoped>
.profile-container {
  @apply min-h-screen py-12;
}

.profile-content {
  @apply container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl;
}

.profile-card {
  @apply bg-white rounded-lg shadow-lg p-8 border border-gray-200;
}

.profile-title {
  @apply text-2xl font-bold mb-6;
  color: #1e3a8a;
}

.profile-tabs {
  @apply mt-4;
}

.profile-form {
  @apply mt-6;
}

.avatar-upload {
  @apply flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4;
}

.avatar-preview {
  @apply w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0;
}

.avatar-preview img {
  @apply w-full h-full object-cover;
}

.avatar-placeholder {
  @apply w-20 h-20 rounded-full flex items-center justify-center text-white font-semibold text-xl flex-shrink-0;
  background: #3b82f6;
}

.avatar-input-wrapper {
  @apply flex-1;
}

.avatar-input {
  @apply w-full;
}

.avatar-hint {
  @apply text-sm text-gray-500 mt-2;
}
</style>

