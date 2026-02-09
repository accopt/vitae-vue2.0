# 后端修复指南：生成简历 content 字段错误

## 问题描述

在生成简历时，后端返回以下错误：
```
(sqlite3.IntegrityError) NOT NULL constraint failed: resumes.content
```

## 问题原因

后端在插入 `resumes` 表时，`content` 字段被设置为 `None`，但数据库要求该字段不能为空。

从错误信息看：
```python
[parameters: (1, 1, 1, '我的简历', None, None, '[1]', '{"education": [...]}', 'generating', ...)]
```

参数顺序为：
- `user_id`: 1
- `draft_id`: 1  
- `template_id`: 1
- `title`: '我的简历'
- `content`: None ❌ **问题在这里**
- `personal_info`: None
- `selected_modules`: '[1]'
- `module_data`: '{"education": [...]}'
- `status`: 'generating'

## 解决方案

后端需要修改插入逻辑，有以下几种方案：

### 方案 1：使用空字符串作为默认值（推荐，最简单）

在创建简历记录时，如果 `content` 还未生成，设置为空字符串 `""` 而不是 `None`：

**Flask + SQLAlchemy 修复示例：**

找到你的 `generate` 接口代码（通常在 `routes/resume.py` 或类似文件），修改如下：

```python
@resume_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate_resume():
    """生成简历"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # 验证必填字段
    if not data.get('template_id'):
        return jsonify({"message": "请选择模板"}), 400
    if not data.get('selected_modules') or len(data.get('selected_modules', [])) == 0:
        return jsonify({"message": "请至少选择一个模块"}), 400
    
    # 获取数据
    template_id = data.get('template_id')
    draft_id = data.get('draft_id')
    title = data.get('title', '我的简历')
    personal_info = data.get('personal_info')
    selected_modules = data.get('selected_modules', [])
    module_data = data.get('module_data', {})
    
    # ⚠️ 修复：使用空字符串而不是 None
    try:
        # 创建简历记录
        resume = Resume(
            user_id=user_id,
            draft_id=draft_id if draft_id else None,
            template_id=template_id,
            title=title,
            content="",  # ✅ 修复：使用空字符串，不能是 None
            personal_info=json.dumps(personal_info) if personal_info else None,
            selected_modules=json.dumps(selected_modules),
            module_data=json.dumps(module_data),
            status='generating',
            generated_at=datetime.now(),
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        db.session.add(resume)
        db.session.commit()
        
        resume_id = resume.id
        
        # TODO: 在这里添加实际的简历内容生成逻辑
        # 生成完成后更新 content 字段
        # generated_content = generate_resume_content(template_id, module_data, personal_info)
        # resume.content = generated_content
        # resume.status = 'completed'
        # db.session.commit()
        
        return jsonify({
            "message": "简历生成成功",
            "data": {
                "id": resume_id,
                "resume_id": resume_id,
                "status": "generating"
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"生成简历失败: {str(e)}"}), 500
```

**或者，如果你使用的是直接的 SQL 插入：**

```python
from sqlalchemy import text

# 修复前（错误）：
# content = None  # ❌ 这会导致错误

# 修复后（正确）：
content = ""  # ✅ 使用空字符串

db.session.execute(text("""
    INSERT INTO resumes (
        user_id, draft_id, template_id, title, content, 
        personal_info, selected_modules, module_data, status, 
        generated_at, created_at, updated_at
    ) VALUES (
        :user_id, :draft_id, :template_id, :title, :content,
        :personal_info, :selected_modules, :module_data, :status,
        :generated_at, :created_at, :updated_at
    )
"""), {
    'user_id': user_id,
    'draft_id': draft_id,
    'template_id': template_id,
    'title': title,
    'content': "",  # ✅ 修复：使用空字符串
    'personal_info': json.dumps(personal_info) if personal_info else None,
    'selected_modules': json.dumps(selected_modules),
    'module_data': json.dumps(module_data),
    'status': 'generating',
    'generated_at': datetime.now(),
    'created_at': datetime.now(),
    'updated_at': datetime.now()
})
db.session.commit()
```

### 方案 2：生成完成后再插入

先不插入数据库，等简历内容生成完成后再插入：

```python
# 1. 生成简历内容
content = generate_resume_content(template_id, module_data, personal_info)

# 2. 生成完成后再插入数据库
resume = Resume(
    user_id=user_id,
    draft_id=draft_id,
    template_id=template_id,
    title=title or '我的简历',
    content=content,  # 使用实际生成的内容
    personal_info=json.dumps(personal_info) if personal_info else None,
    selected_modules=json.dumps(selected_modules),
    module_data=json.dumps(module_data),
    status='completed'  # 直接设置为完成状态
)
db.session.add(resume)
db.session.commit()
```

### 方案 3：分两步插入和更新

先插入一个占位记录，然后异步生成内容并更新：

```python
# 步骤 1: 创建占位记录
resume = Resume(
    user_id=user_id,
    draft_id=draft_id,
    template_id=template_id,
    title=title or '我的简历',
    content="生成中...",  # 使用占位文本
    personal_info=json.dumps(personal_info) if personal_info else None,
    selected_modules=json.dumps(selected_modules),
    module_data=json.dumps(module_data),
    status='generating'
)
db.session.add(resume)
db.session.commit()
resume_id = resume.id

# 步骤 2: 异步生成内容（使用 Celery 或其他任务队列）
generate_resume_async.delay(resume_id, template_id, module_data, personal_info)
```

然后在异步任务中更新：
```python
@celery.task
def generate_resume_async(resume_id, template_id, module_data, personal_info):
    # 生成简历内容
    content = generate_resume_content(template_id, module_data, personal_info)
    
    # 更新记录
    resume = Resume.query.get(resume_id)
    if resume:
        resume.content = content
        resume.status = 'completed'
        db.session.commit()
```

### 方案 4：修改数据库模型（不推荐）

如果业务逻辑允许，可以修改数据库模型，让 `content` 字段允许为空：

```sql
ALTER TABLE resumes MODIFY COLUMN content TEXT NULL;
```

但这不是推荐方案，因为简历内容应该是必需的。

## 推荐的修复代码（SQLAlchemy）

如果你的后端使用 SQLAlchemy，可以这样修复：

```python
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from datetime import datetime
import json

# 在插入记录时
resume_data = {
    'user_id': user_id,
    'draft_id': draft_id if draft_id else None,
    'template_id': template_id,
    'title': title or '我的简历',
    'content': '',  # ✅ 使用空字符串
    'personal_info': json.dumps(personal_info) if personal_info else None,
    'selected_modules': json.dumps(selected_modules),
    'module_data': json.dumps(module_data),
    'status': 'generating',
    'generated_at': datetime.now(),
    'created_at': datetime.now(),
    'updated_at': datetime.now()
}

# 使用 SQLAlchemy
resume = Resume(**resume_data)
db.session.add(resume)
db.session.commit()
```

或者在模型定义时设置默认值：

```python
class Resume(db.Model):
    # ... 其他字段 ...
    content = db.Column(db.Text, nullable=False, default='')
    # ...
```

## 快速修复步骤（5分钟）

1. **找到生成简历的后端代码**
   - 通常在 `routes/resume.py`、`api/resume.py` 或 `views/resume.py` 中
   - 查找 `@app.route('/generate')` 或 `@resume_bp.route('/generate')`

2. **找到创建 Resume 对象的代码行**
   - 查找 `Resume(` 或 `INSERT INTO resumes`

3. **修改 content 字段**
   - 将 `content=None` 改为 `content=""`
   - 或者添加 `content=""` 如果没有设置

4. **保存并重启后端服务**

5. **测试**
   - 在前端尝试生成简历
   - 确认不再出现 `NOT NULL constraint failed` 错误

## 检查清单

- [ ] 确保插入 `resumes` 表时，`content` 字段不是 `None`
- [ ] 如果使用占位符，确保使用空字符串 `""` 而不是 `None`
- [ ] 如果使用两步插入，确保异步任务正确处理错误情况
- [ ] 测试生成简历功能，确保不再出现 `NOT NULL constraint failed` 错误
- [ ] 确保简历内容生成后能正确更新 `content` 字段

## 测试

修复后，测试以下场景：
1. ✅ 正常生成简历（所有字段都有值）
2. ✅ 生成简历时只有部分模块数据
3. ✅ 生成简历时没有个人信息
4. ✅ 生成简历时使用草稿ID

## 相关文件

后端需要检查的文件：
- 简历生成接口的实现（`/api/resume/generate`）
- 数据库模型定义（`Resume` 模型）
- 简历内容生成逻辑

