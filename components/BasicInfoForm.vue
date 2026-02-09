<template>
  <div class="basic-info-form">
    <h3 class="section-title">填写核心信息</h3>
    <p class="section-description">请填写以下核心信息，这些信息将用于生成您的简历</p>
    
    <el-card class="form-card">
      <el-form :model="formData" label-width="120px" :rules="rules" ref="formRef">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input 
                v-model="formData.name" 
                placeholder="请输入姓名"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生年月" prop="birthDate">
              <el-date-picker
                v-model="formData.birthDate"
                type="month"
                placeholder="请选择出生年月"
                format="YYYY-MM"
                value-format="YYYY-MM"
                class="w-full"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="formData.gender">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作年限" prop="workYears">
              <el-select 
                v-model="formData.workYears" 
                placeholder="请选择工作年限"
                class="w-full"
              >
                <el-option label="应届毕业生" value="应届毕业生" />
                <el-option label="1年以下" value="1年以下" />
                <el-option label="1-3年" value="1-3年" />
                <el-option label="3-5年" value="3-5年" />
                <el-option label="5-10年" value="5-10年" />
                <el-option label="10年以上" value="10年以上" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="求职岗位" prop="targetPosition">
              <el-input 
                v-model="formData.targetPosition" 
                placeholder="请输入求职岗位"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input 
                v-model="formData.phone" 
                placeholder="请输入联系电话"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

export interface BasicInfo {
  name: string
  birthDate: string
  gender: string
  targetPosition: string
  workYears: string
  phone: string
}

interface Props {
  modelValue: Partial<BasicInfo>
}

interface Emits {
  (e: 'update:modelValue', value: Partial<BasicInfo>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formRef = ref<FormInstance>()

const formData = computed({
  get: () => props.modelValue || {},
  set: (value) => emit('update:modelValue', value)
})

// 表单验证规则
const rules: FormRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  birthDate: [
    { required: true, message: '请选择出生年月', trigger: 'change' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  targetPosition: [
    { required: true, message: '请输入求职岗位', trigger: 'blur' }
  ],
  workYears: [
    { required: true, message: '请选择工作年限', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
}

// 验证表单
const validate = async (): Promise<boolean> => {
  if (!formRef.value) return false
  try {
    await formRef.value.validate()
    return true
  } catch (error) {
    ElMessage.warning('请完善核心信息')
    return false
  }
}

// 暴露验证方法
defineExpose({
  validate
})
</script>

<style scoped>
.basic-info-form {
  @apply w-full;
}

.section-title {
  @apply text-2xl font-bold mb-2;
  color: #1e3a8a;
}

.section-description {
  @apply text-gray-600 mb-6;
}

.form-card {
  @apply mt-4;
}

.w-full {
  width: 100%;
}
</style>





