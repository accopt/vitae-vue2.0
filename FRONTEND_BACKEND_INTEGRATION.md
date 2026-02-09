# 前后端集成说明

## 概述

本文档说明了前端代码如何与后端API集成，包括数据格式转换、字段映射和API调用方式。

## 主要更改

### 1. API响应格式适配

后端API统一返回格式：
```json
{
  "message": "操作成功/失败消息",
  "data": {...}  // 实际数据
}
```

前端已适配这种格式，从 `res?.data?.data` 中获取实际数据。

### 2. 字段命名转换

#### 前端 → 后端（请求）

| 前端字段 | 后端字段 | 说明 |
|---------|---------|------|
| `templateId` | `template_id` | 模板ID |
| `modules` | `selected_modules` | 选中的模块数组 |
| `personalInfo` | `personal_info` | 个人信息对象 |
| `education`, `work`, `project` 等 | `module_data` | 模块数据（嵌套在module_data中） |

#### 后端 → 前端（响应）

| 后端字段 | 前端字段 | 说明 |
|---------|---------|------|
| `template_id` | `templateId` | 模板ID |
| `selected_modules` | `modules` | 选中的模块数组 |
| `personal_info` | `personalInfo` | 个人信息对象 |
| `module_data` | `formData` | 模块数据（展开为各模块字段） |

### 3. 数据格式处理

#### JSON字符串解析

后端可能将数据存储为JSON字符串，前端需要安全解析：
- `selected_modules`: JSON字符串 → 数组
- `personal_info`: JSON字符串 → 对象
- `module_data`: JSON字符串 → 对象

前端已实现安全解析函数，避免解析错误导致的问题。

## API接口适配

### 1. GET /api/resume/templates

**后端返回格式**:
```json
{
  "message": "获取成功",
  "data": [
    {
      "id": "template1",
      "name": "经典模板",
      "description": "...",
      "preview": "...",
      "thumbnail": "..."
    }
  ]
}
```

**前端处理**:
```typescript
const res = await api.get('/resume/templates')
return res?.data?.data || res?.data?.templates || res?.data || []
```

### 2. GET /api/resume/modules

**后端返回格式**:
```json
{
  "message": "获取成功",
  "data": [
    {
      "id": "education",
      "name": "教育经历",
      "type": "education",
      "icon": "🎓"
    }
  ]
}
```

**前端处理**:
```typescript
const res = await api.get('/resume/modules')
return res?.data?.data || res?.data?.modules || res?.data || []
```

### 3. POST /api/resume/generate

**前端请求格式**:
```typescript
{
  template_id: "template1",
  selected_modules: ["education", "work"],
  personal_info: {
    name: "张三",
    email: "zhangsan@example.com"
  },
  module_data: {
    education: [...],
    work: [...]
  },
  draft_id: 123,  // 可选
  title: "我的简历"
}
```

**后端返回格式**:
```json
{
  "message": "简历生成成功",
  "data": {
    "id": 123,
    "resume_id": 123,
    "status": "completed",
    ...
  }
}
```

**前端处理**:
```typescript
const result = res?.data?.data || res?.data || {}
return {
  resumeId: result.id || result.resume_id,
  id: result.id || result.resume_id,
  ...result
}
```

### 4. POST /api/resume/draft

**前端请求格式**:
```typescript
{
  id: 123,  // 可选，更新时使用
  template_id: "template1",
  selected_modules: ["education", "work"],
  personal_info: {...},
  module_data: {
    education: [...],
    work: [...]
  },
  title: "我的简历"
}
```

**后端返回格式**:
```json
{
  "message": "草稿保存成功",
  "data": {
    "id": 123,
    "template_id": "template1",
    ...
  }
}
```

### 5. GET /api/resume/draft

**后端返回格式**:
- 不带参数：返回用户所有草稿数组
- 带id参数：返回指定草稿对象

```json
{
  "message": "获取成功",
  "data": [
    {
      "id": 123,
      "template_id": "template1",
      "selected_modules": "[\"education\", \"work\"]",  // JSON字符串
      "personal_info": "{\"name\": \"张三\"}",  // JSON字符串
      "module_data": "{...}",  // JSON字符串
      ...
    }
  ]
}
```

**前端处理**:
- 如果返回数组，取第一个（最新的）
- 安全解析JSON字符串
- 转换为前端期望的格式

## 数据流转

### 生成简历流程

1. **用户填写表单** → `formData` (前端格式)
2. **数据转换** → `processFormData()` 处理数据（文本转数组等）
3. **构建请求** → 转换为后端格式（`template_id`, `selected_modules`, `module_data`）
4. **发送请求** → `POST /api/resume/generate`
5. **处理响应** → 提取 `resumeId` 或 `id`

### 保存草稿流程

1. **用户操作** → 监听表单变化（防抖500ms）
2. **数据转换** → 保持原始格式（不处理文本转数组）
3. **构建请求** → 转换为后端格式
4. **发送请求** → `POST /api/resume/draft`
5. **保存草稿ID** → 更新 `currentDraftId` 用于后续更新

### 加载草稿流程

1. **页面加载** → `GET /api/resume/draft` (不带参数)
2. **获取数据** → 返回用户所有草稿数组
3. **选择最新** → 取第一个草稿
4. **解析数据** → 安全解析JSON字符串
5. **填充表单** → 恢复用户填写的数据

## 注意事项

### 1. 数据格式一致性

- **保存草稿时**: 保持原始格式，不进行数据转换（如文本转数组）
- **生成简历时**: 进行数据转换（如 `achievementsText` → `achievements` 数组）

### 2. 错误处理

- API调用失败时，前端使用默认数据（模板和模块）
- 草稿加载失败时，静默处理，不影响用户体验
- 所有JSON解析都使用安全解析函数，避免解析错误

### 3. 防抖处理

- 草稿保存使用500ms防抖，避免频繁请求
- 组件卸载时清理定时器

### 4. 字段兼容性

- 前端同时支持 `resumeId` 和 `id` 字段
- 后端字段名转换支持 `template_id` 和 `templateId` 两种格式
- JSON字符串和对象格式自动识别和处理

## 测试建议

### 1. 模板和模块加载
- 测试API返回格式是否正确
- 测试默认数据回退机制

### 2. 草稿保存和加载
- 测试新建草稿
- 测试更新草稿
- 测试草稿加载和数据恢复

### 3. 简历生成
- 测试数据格式转换
- 测试草稿ID传递
- 测试响应数据提取

### 4. 错误处理
- 测试API调用失败
- 测试JSON解析失败
- 测试网络错误

## 后续优化建议

1. **类型安全**: 为后端响应数据定义完整的TypeScript类型
2. **错误提示**: 改进错误处理，提供更友好的错误提示
3. **数据验证**: 在前端添加数据验证，确保数据格式正确
4. **缓存机制**: 考虑缓存模板和模块数据，减少API调用
5. **离线支持**: 考虑支持离线保存草稿到本地存储




