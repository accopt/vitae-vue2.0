# 简历生成系统 - 后端API接口文档

## 概述

本文档描述了简历生成系统的后端API接口规范。所有接口都需要用户认证（Bearer Token），除了明确说明的公开接口。

**基础URL**: `/api`

**认证方式**: Bearer Token (JWT)
- 请求头: `Authorization: Bearer <token>`

**响应格式**: JSON

---

## 1. 获取简历模板列表

### 接口信息
- **路径**: `/api/resume/templates`
- **方法**: `GET`
- **认证**: 需要
- **描述**: 获取所有可用的简历模板列表

### 请求参数
无

### 响应结构

#### 成功响应 (200 OK)

**方式1**: 返回模板数组
```json
[
  {
    "id": "template1",
    "name": "经典模板",
    "description": "简洁大方的经典简历模板，适合大多数职位",
    "preview": "<div>...</div>",
    "thumbnail": "<div>...</div>"
  },
  {
    "id": "template2",
    "name": "现代模板",
    "description": "现代化的设计风格，突出个人特色",
    "preview": "<div>...</div>",
    "thumbnail": "<div>...</div>"
  }
]
```

**方式2**: 返回包含templates字段的对象
```json
{
  "templates": [
    {
      "id": "template1",
      "name": "经典模板",
      "description": "简洁大方的经典简历模板，适合大多数职位",
      "preview": "<div>...</div>",
    "thumbnail": "<div>...</div>"
    }
  ]
}
```

#### 数据字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 模板唯一标识符 |
| name | string | 是 | 模板名称 |
| description | string | 是 | 模板描述 |
| preview | string | 是 | 模板预览HTML（完整预览） |
| thumbnail | string | 是 | 模板缩略图HTML（简化预览） |

#### 错误响应

**401 Unauthorized**
```json
{
  "message": "未授权，请先登录"
}
```

**500 Internal Server Error**
```json
{
  "message": "服务器内部错误"
}
```

---

## 2. 获取简历模块列表

### 接口信息
- **路径**: `/api/resume/modules`
- **方法**: `GET`
- **认证**: 需要
- **描述**: 获取所有可用的简历模块列表

### 请求参数
无

### 响应结构

#### 成功响应 (200 OK)

**方式1**: 返回模块数组
```json
[
  {
    "id": "education",
    "name": "教育经历",
    "type": "education",
    "icon": "🎓"
  },
  {
    "id": "work",
    "name": "工作经历",
    "type": "work",
    "icon": "💼"
  },
  {
    "id": "project",
    "name": "项目经历",
    "type": "project",
    "icon": "🚀"
  },
  {
    "id": "internship",
    "name": "实习经历",
    "type": "internship",
    "icon": "📝"
  },
  {
    "id": "research",
    "name": "科研成果",
    "type": "research",
    "icon": "🔬"
  },
  {
    "id": "skill",
    "name": "技能特长",
    "type": "skill",
    "icon": "⚡"
  },
  {
    "id": "selfEvaluation",
    "name": "自我评价",
    "type": "selfEvaluation",
    "icon": "✨"
  }
]
```

**方式2**: 返回包含modules字段的对象
```json
{
  "modules": [
    {
      "id": "education",
      "name": "教育经历",
      "type": "education",
      "icon": "🎓"
    }
  ]
}
```

#### 数据字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 模块唯一标识符 |
| name | string | 是 | 模块显示名称 |
| type | string | 是 | 模块类型，可选值：`education`, `work`, `project`, `internship`, `research`, `skill`, `selfEvaluation` |
| icon | string | 是 | 模块图标（emoji或图标代码） |

#### 错误响应

**401 Unauthorized**
```json
{
  "message": "未授权，请先登录"
}
```

---

## 3. 生成简历

### 接口信息
- **路径**: `/api/resume/generate`
- **方法**: `POST`
- **认证**: 需要
- **描述**: 根据用户选择的模板、模块和填写的信息生成简历

### 请求体

```json
{
  "templateId": "template1",
  "modules": ["education", "work", "project", "skill"],
  "personalInfo": {
    "name": "张三",
    "email": "zhangsan@example.com",
    "phone": "13800138000",
    "address": "北京市朝阳区"
  },
  "education": [
    {
      "school": "北京大学",
      "major": "计算机科学与技术",
      "degree": "本科",
      "startDate": "2018-09",
      "endDate": "2022-06",
      "description": "主修课程：数据结构、算法设计、操作系统等"
    }
  ],
  "work": [
    {
      "company": "腾讯科技有限公司",
      "position": "前端开发工程师",
      "startDate": "2022-07",
      "endDate": "2024-01",
      "description": "负责公司核心产品的前端开发工作",
      "achievements": [
        "优化页面加载速度，提升30%性能",
        "参与重构项目，代码可维护性提升50%"
      ]
    }
  ],
  "project": [
    {
      "name": "在线教育平台",
      "role": "前端负责人",
      "startDate": "2023-01",
      "endDate": "2023-06",
      "description": "开发一个在线教育平台，支持视频播放、在线考试等功能",
      "technologies": ["Vue.js", "TypeScript", "Element Plus"],
      "achievements": [
        "完成核心功能开发",
        "优化用户体验"
      ]
    }
  ],
  "internship": [
    {
      "company": "阿里巴巴",
      "position": "前端开发实习生",
      "startDate": "2021-07",
      "endDate": "2021-09",
      "description": "参与电商平台的前端开发工作"
    }
  ],
  "research": [
    {
      "title": "基于深度学习的图像识别研究",
      "authors": "张三, 李四",
      "publication": "计算机学报",
      "date": "2023-03",
      "description": "提出了一种新的图像识别算法",
      "link": "https://example.com/paper"
    }
  ],
  "skill": [
    {
      "category": "编程语言",
      "items": ["JavaScript", "TypeScript", "Python"],
      "level": "熟练"
    },
    {
      "category": "前端框架",
      "items": ["Vue.js", "React", "Nuxt.js"],
      "level": "掌握"
    }
  ],
  "selfEvaluation": {
    "content": "具有3年前端开发经验，熟悉Vue.js、React等前端框架，有丰富的项目经验。"
  }
}
```

### 请求字段说明

#### 基础字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| templateId | string | 是 | 选择的模板ID |
| modules | string[] | 是 | 选择的模块ID数组，至少包含一个 |
| personalInfo | object | 否 | 个人信息（可选） |
| education | EducationData[] | 否 | 教育经历数组（如果modules包含education） |
| work | WorkData[] | 否 | 工作经历数组（如果modules包含work） |
| project | ProjectData[] | 否 | 项目经历数组（如果modules包含project） |
| internship | InternshipData[] | 否 | 实习经历数组（如果modules包含internship） |
| research | ResearchData[] | 否 | 科研成果数组（如果modules包含research） |
| skill | SkillData[] | 否 | 技能特长数组（如果modules包含skill） |
| selfEvaluation | SelfEvaluationData | 否 | 自我评价（如果modules包含selfEvaluation） |

#### personalInfo 字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 否 | 姓名 |
| email | string | 否 | 邮箱 |
| phone | string | 否 | 电话 |
| address | string | 否 | 地址 |

#### EducationData 字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| school | string | 是 | 学校名称 |
| major | string | 是 | 专业 |
| degree | string | 是 | 学历（本科/硕士/博士） |
| startDate | string | 是 | 开始时间（格式：YYYY-MM） |
| endDate | string | 是 | 结束时间（格式：YYYY-MM） |
| description | string | 否 | 描述 |

#### WorkData 字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| company | string | 是 | 公司名称 |
| position | string | 是 | 职位 |
| startDate | string | 是 | 开始时间（格式：YYYY-MM） |
| endDate | string | 是 | 结束时间（格式：YYYY-MM） |
| description | string | 否 | 工作描述 |
| achievements | string[] | 否 | 工作成就数组 |

#### ProjectData 字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 项目名称 |
| role | string | 是 | 担任角色 |
| startDate | string | 是 | 开始时间（格式：YYYY-MM） |
| endDate | string | 是 | 结束时间（格式：YYYY-MM） |
| description | string | 否 | 项目描述 |
| technologies | string[] | 否 | 使用的技术栈数组 |
| achievements | string[] | 否 | 项目成就数组 |

#### InternshipData 字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| company | string | 是 | 公司名称 |
| position | string | 是 | 职位 |
| startDate | string | 是 | 开始时间（格式：YYYY-MM） |
| endDate | string | 是 | 结束时间（格式：YYYY-MM） |
| description | string | 否 | 实习描述 |

#### ResearchData 字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 论文/成果标题 |
| authors | string | 否 | 作者 |
| publication | string | 否 | 发表期刊/会议 |
| date | string | 是 | 发表时间（格式：YYYY-MM） |
| description | string | 否 | 成果描述 |
| link | string | 否 | 相关链接 |

#### SkillData 字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| category | string | 是 | 技能类别 |
| items | string[] | 是 | 技能项数组 |
| level | string | 否 | 熟练程度（熟练/掌握/了解） |

#### SelfEvaluationData 字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | 是 | 自我评价内容 |

### 响应结构

#### 成功响应 (200 OK)

```json
{
  "message": "简历生成成功",
  "resumeId": "resume_123456789",
  "id": "resume_123456789",
  "createdAt": "2024-01-15T10:30:00Z",
  "downloadUrl": "https://example.com/resumes/resume_123456789.pdf"
}
```

**注意**: 前端会优先读取 `resumeId` 字段，如果没有则读取 `id` 字段。

#### 数据字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| message | string | 响应消息 |
| resumeId | string | 生成的简历ID（建议使用此字段） |
| id | string | 简历ID（备用字段） |
| createdAt | string | 创建时间（ISO 8601格式） |
| downloadUrl | string | 简历下载链接（可选） |

#### 错误响应

**400 Bad Request** - 请求参数错误
```json
{
  "message": "请选择至少一个模块",
  "errors": {
    "modules": "modules字段不能为空"
  }
}
```

**401 Unauthorized**
```json
{
  "message": "未授权，请先登录"
}
```

**500 Internal Server Error**
```json
{
  "message": "生成简历失败，请重试"
}
```

---

## 4. 保存简历草稿

### 接口信息
- **路径**: `/api/resume/draft`
- **方法**: `POST`
- **认证**: 需要
- **描述**: 保存用户的简历草稿，用于临时存储用户填写的数据

### 请求体

请求体结构与"生成简历"接口相同，但所有字段都是可选的：

```json
{
  "templateId": "template1",
  "modules": ["education", "work"],
  "education": [
    {
      "school": "北京大学",
      "major": "计算机科学与技术",
      "degree": "本科",
      "startDate": "2018-09",
      "endDate": "2022-06"
    }
  ]
}
```

### 响应结构

#### 成功响应 (200 OK)

```json
{
  "message": "草稿保存成功",
  "draftId": "draft_123456789",
  "savedAt": "2024-01-15T10:30:00Z"
}
```

#### 错误响应

**401 Unauthorized**
```json
{
  "message": "未授权，请先登录"
}
```

**500 Internal Server Error**
```json
{
  "message": "保存草稿失败"
}
```

---

## 5. 获取简历草稿

### 接口信息
- **路径**: `/api/resume/draft`
- **方法**: `GET`
- **认证**: 需要
- **描述**: 获取当前用户保存的简历草稿

### 请求参数
无

### 响应结构

#### 成功响应 (200 OK)

**有草稿时**:
```json
{
  "templateId": "template1",
  "modules": ["education", "work", "project"],
  "personalInfo": {
    "name": "张三",
    "email": "zhangsan@example.com"
  },
  "education": [
    {
      "school": "北京大学",
      "major": "计算机科学与技术",
      "degree": "本科",
      "startDate": "2018-09",
      "endDate": "2022-06"
    }
  ],
  "work": [],
  "savedAt": "2024-01-15T10:30:00Z"
}
```

**无草稿时**:
```json
null
```
或
```json
{
  "message": "没有找到草稿"
}
```

#### 错误响应

**401 Unauthorized**
```json
{
  "message": "未授权，请先登录"
}
```

---

## 通用错误码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权，需要登录 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 数据验证规则

### 必填字段验证
- `templateId`: 生成简历时必填
- `modules`: 生成简历时必填，至少包含一个模块ID
- 各个模块的数据：如果 `modules` 数组中包含某个模块ID，则该模块的数据应该符合对应的数据结构

### 数据格式验证
- 日期格式：`YYYY-MM`（如：2024-01）
- 邮箱格式：标准邮箱格式
- 电话格式：建议支持常见电话号码格式

### 数据范围验证
- `degree`: 只能是 "本科"、"硕士"、"博士" 之一
- `level`: 只能是 "熟练"、"掌握"、"了解" 之一
- `type`: 只能是 "education"、"work"、"project"、"internship"、"research"、"skill"、"selfEvaluation" 之一

---

## 实现建议

### 1. 数据库设计

#### 简历模板表 (resume_templates)
```sql
CREATE TABLE resume_templates (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  preview TEXT,
  thumbnail TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 简历模块表 (resume_modules)
```sql
CREATE TABLE resume_modules (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  icon VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 简历草稿表 (resume_drafts)
```sql
CREATE TABLE resume_drafts (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  template_id VARCHAR(50),
  modules JSON,
  data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_draft (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### 简历表 (resumes)
```sql
CREATE TABLE resumes (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  template_id VARCHAR(50) NOT NULL,
  modules JSON NOT NULL,
  data JSON NOT NULL,
  file_path VARCHAR(255),
  download_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (template_id) REFERENCES resume_templates(id)
);
```

### 2. 文件存储

- 生成的简历文件可以存储为PDF格式
- 建议使用云存储服务（如AWS S3、阿里云OSS等）
- 文件命名建议：`resume_{resumeId}_{timestamp}.pdf`

### 3. AI生成逻辑

- 根据选择的模板和模块，结合用户填写的数据生成简历
- 可以使用模板引擎（如Jinja2、Handlebars等）渲染HTML
- 使用PDF生成库（如wkhtmltopdf、Puppeteer等）将HTML转换为PDF
- 可以考虑使用AI模型优化简历内容（可选）

### 4. 安全性考虑

- 所有接口都需要JWT认证
- 验证用户权限，确保用户只能访问自己的草稿和简历
- 对用户输入进行XSS防护
- 文件上传需要验证文件类型和大小
- 使用HTTPS传输敏感数据

### 5. 性能优化

- 模板和模块数据可以缓存（Redis）
- 简历生成可以考虑异步处理（消息队列）
- 使用CDN加速文件下载
- 数据库查询优化（索引）

---

## 示例代码

### Flask (Python) 示例

```python
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import json

resume_bp = Blueprint('resume', __name__, url_prefix='/api/resume')

@resume_bp.route('/templates', methods=['GET'])
@jwt_required()
def get_templates():
    """获取简历模板列表"""
    templates = [
        {
            "id": "template1",
            "name": "经典模板",
            "description": "简洁大方的经典简历模板，适合大多数职位",
            "preview": "<div>...</div>",
            "thumbnail": "<div>...</div>"
        }
    ]
    return jsonify(templates)

@resume_bp.route('/modules', methods=['GET'])
@jwt_required()
def get_modules():
    """获取简历模块列表"""
    modules = [
        {
            "id": "education",
            "name": "教育经历",
            "type": "education",
            "icon": "🎓"
        }
    ]
    return jsonify(modules)

@resume_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate_resume():
    """生成简历"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # 验证必填字段
    if not data.get('templateId'):
        return jsonify({"message": "请选择模板"}), 400
    if not data.get('modules') or len(data.get('modules', [])) == 0:
        return jsonify({"message": "请至少选择一个模块"}), 400
    
    # 生成简历逻辑
    resume_id = f"resume_{user_id}_{int(time.time())}"
    
    # TODO: 实现简历生成逻辑
    # 1. 获取模板
    # 2. 渲染数据
    # 3. 生成PDF
    # 4. 保存到数据库
    # 5. 上传到云存储
    
    return jsonify({
        "message": "简历生成成功",
        "resumeId": resume_id,
        "id": resume_id,
        "createdAt": datetime.now().isoformat(),
        "downloadUrl": f"https://example.com/resumes/{resume_id}.pdf"
    })

@resume_bp.route('/draft', methods=['POST'])
@jwt_required()
def save_draft():
    """保存草稿"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # TODO: 保存草稿到数据库
    # 使用 INSERT ... ON DUPLICATE KEY UPDATE 或 UPSERT
    
    return jsonify({
        "message": "草稿保存成功",
        "draftId": f"draft_{user_id}",
        "savedAt": datetime.now().isoformat()
    })

@resume_bp.route('/draft', methods=['GET'])
@jwt_required()
def get_draft():
    """获取草稿"""
    user_id = get_jwt_identity()
    
    # TODO: 从数据库获取草稿
    draft = get_draft_from_db(user_id)
    
    if not draft:
        return jsonify(None)
    
    return jsonify(draft)
```

### Node.js (Express) 示例

```javascript
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// 获取模板列表
router.get('/templates', authenticateToken, async (req, res) => {
  try {
    const templates = [
      {
        id: 'template1',
        name: '经典模板',
        description: '简洁大方的经典简历模板，适合大多数职位',
        preview: '<div>...</div>',
        thumbnail: '<div>...</div>'
      }
    ];
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取模块列表
router.get('/modules', authenticateToken, async (req, res) => {
  try {
    const modules = [
      {
        id: 'education',
        name: '教育经历',
        type: 'education',
        icon: '🎓'
      }
    ];
    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 生成简历
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const data = req.body;
    
    // 验证必填字段
    if (!data.templateId) {
      return res.status(400).json({ message: '请选择模板' });
    }
    if (!data.modules || data.modules.length === 0) {
      return res.status(400).json({ message: '请至少选择一个模块' });
    }
    
    // 生成简历
    const resumeId = `resume_${userId}_${Date.now()}`;
    
    // TODO: 实现简历生成逻辑
    
    res.json({
      message: '简历生成成功',
      resumeId: resumeId,
      id: resumeId,
      createdAt: new Date().toISOString(),
      downloadUrl: `https://example.com/resumes/${resumeId}.pdf`
    });
  } catch (error) {
    res.status(500).json({ message: '生成简历失败' });
  }
});

// 保存草稿
router.post('/draft', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const data = req.body;
    
    // TODO: 保存草稿到数据库
    
    res.json({
      message: '草稿保存成功',
      draftId: `draft_${userId}`,
      savedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: '保存草稿失败' });
  }
});

// 获取草稿
router.get('/draft', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // TODO: 从数据库获取草稿
    const draft = await getDraftFromDB(userId);
    
    if (!draft) {
      return res.json(null);
    }
    
    res.json(draft);
  } catch (error) {
    res.status(500).json({ message: '获取草稿失败' });
  }
});

module.exports = router;
```

---

## 测试用例

### 1. 获取模板列表
```bash
curl -X GET http://localhost:5000/api/resume/templates \
  -H "Authorization: Bearer <token>"
```

### 2. 获取模块列表
```bash
curl -X GET http://localhost:5000/api/resume/modules \
  -H "Authorization: Bearer <token>"
```

### 3. 生成简历
```bash
curl -X POST http://localhost:5000/api/resume/generate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "template1",
    "modules": ["education", "work"],
    "education": [{
      "school": "北京大学",
      "major": "计算机科学与技术",
      "degree": "本科",
      "startDate": "2018-09",
      "endDate": "2022-06"
    }]
  }'
```

### 4. 保存草稿
```bash
curl -X POST http://localhost:5000/api/resume/draft \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "template1",
    "modules": ["education"]
  }'
```

### 5. 获取草稿
```bash
curl -X GET http://localhost:5000/api/resume/draft \
  -H "Authorization: Bearer <token>"
```

---

## 更新日志

- 2024-01-15: 初始版本

---

## 联系方式

如有问题或建议，请联系开发团队。




