# 简历模板实现示例

## 模板1：经典模板（两栏布局）

### HTML结构 (template1.html)

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>个人简历</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Microsoft YaHei', 'SimSun', serif;
      background: #f5f5f5;
    }
    
    .resume-container {
      display: flex;
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      background: white;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    
    /* 左侧边栏 */
    .left-sidebar {
      width: 35%;
      background: #1e3a8a;
      color: white;
      padding: 40px 25px;
    }
    
    .avatar-section {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .avatar-placeholder {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      margin: 0 auto;
      border: 3px solid white;
    }
    
    .personal-info-section h2 {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 20px;
      text-align: center;
    }
    
    .info-item {
      margin-bottom: 15px;
      font-size: 14px;
    }
    
    .info-item .label {
      display: inline-block;
      width: 60px;
      color: rgba(255,255,255,0.8);
    }
    
    .info-item .value {
      color: white;
    }
    
    .skills-section {
      margin-top: 40px;
    }
    
    .section-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid rgba(255,255,255,0.3);
    }
    
    .skill-item {
      margin-bottom: 20px;
    }
    
    .skill-name {
      font-size: 14px;
      margin-bottom: 8px;
    }
    
    .skill-bar {
      height: 8px;
      background: rgba(255,255,255,0.2);
      border-radius: 4px;
      overflow: hidden;
    }
    
    .skill-progress {
      height: 100%;
      background: white;
      border-radius: 4px;
    }
    
    /* 右侧内容 */
    .right-content {
      width: 65%;
      padding: 40px 35px;
      color: #333;
    }
    
    .right-content .section {
      margin-bottom: 35px;
    }
    
    .right-content .section-title {
      font-size: 20px;
      font-weight: bold;
      color: #1e3a8a;
      border-bottom: 3px solid #1e3a8a;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    
    .job-intention p {
      margin-bottom: 10px;
      font-size: 15px;
    }
    
    .work-item,
    .education-item {
      margin-bottom: 25px;
      padding-left: 20px;
      border-left: 3px solid #e2e8f0;
    }
    
    .work-header,
    .edu-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    
    .work-company,
    .edu-school {
      font-size: 18px;
      font-weight: bold;
      color: #1e293b;
    }
    
    .work-date,
    .edu-date {
      font-size: 14px;
      color: #64748b;
    }
    
    .work-position,
    .edu-major {
      font-size: 15px;
      color: #475569;
      margin-bottom: 10px;
    }
    
    .work-description {
      font-size: 14px;
      line-height: 1.8;
      color: #64748b;
      margin-bottom: 10px;
    }
    
    .achievements {
      list-style: none;
      padding-left: 0;
    }
    
    .achievements li {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 5px;
      padding-left: 20px;
      position: relative;
    }
    
    .achievements li::before {
      content: '•';
      position: absolute;
      left: 0;
      color: #1e3a8a;
      font-weight: bold;
    }
    
    .self-evaluation {
      font-size: 15px;
      line-height: 1.8;
      color: #475569;
      text-align: justify;
    }
    
    @media print {
      .resume-container {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="resume-container">
    <!-- 左侧边栏 -->
    <div class="left-sidebar">
      <!-- 头像 -->
      <div class="avatar-section">
        <div class="avatar-placeholder"></div>
      </div>
      
      <!-- 个人信息 -->
      <div class="personal-info-section">
        <h2>{{ personal_info.name or '姓名' }}</h2>
        {% if personal_info.age %}
        <div class="info-item">
          <span class="label">年龄：</span>
          <span class="value">{{ personal_info.age }}岁</span>
        </div>
        {% endif %}
        {% if personal_info.address %}
        <div class="info-item">
          <span class="label">地址：</span>
          <span class="value">{{ personal_info.address }}</span>
        </div>
        {% endif %}
        {% if personal_info.phone %}
        <div class="info-item">
          <span class="label">电话：</span>
          <span class="value">{{ personal_info.phone }}</span>
        </div>
        {% endif %}
        {% if personal_info.email %}
        <div class="info-item">
          <span class="label">邮箱：</span>
          <span class="value">{{ personal_info.email }}</span>
        </div>
        {% endif %}
      </div>
      
      <!-- 技能特长 -->
      {% if skill %}
      <div class="skills-section">
        <h3 class="section-title">技能特长</h3>
        {% for skill_item in skill %}
        <div class="skill-item">
          <div class="skill-name">{{ skill_item.category or '技能类别' }}</div>
          <div class="skill-bar">
            <div class="skill-progress" style="width: {% if skill_item.level == '熟练' %}95{% elif skill_item.level == '掌握' %}80{% else %}65{% endif %}%"></div>
          </div>
        </div>
        {% endfor %}
      </div>
      {% endif %}
    </div>
    
    <!-- 右侧内容 -->
    <div class="right-content">
      <!-- 求职意向 -->
      <div class="section">
        <h2 class="section-title">求职意向</h2>
        <div class="job-intention">
          {% if personal_info.target_position %}
          <p>职位：{{ personal_info.target_position }}</p>
          {% endif %}
          {% if personal_info.target_location %}
          <p>地点：{{ personal_info.target_location }}</p>
          {% endif %}
          {% if personal_info.salary %}
          <p>薪资：{{ personal_info.salary }}</p>
          {% endif %}
        </div>
      </div>
      
      <!-- 工作经历 -->
      {% if work %}
      <div class="section">
        <h2 class="section-title">工作经历</h2>
        {% for work_item in work %}
        <div class="work-item">
          <div class="work-header">
            <span class="work-company">{{ work_item.company or '公司名称' }}</span>
            <span class="work-date">
              {{ work_item.startDate or '' }}
              {% if work_item.endDate %} - {{ work_item.endDate }}{% else %} - 至今{% endif %}
            </span>
          </div>
          <div class="work-position">{{ work_item.position or '职位' }}</div>
          {% if work_item.description %}
          <div class="work-description">{{ work_item.description }}</div>
          {% endif %}
          {% if work_item.achievements %}
          <ul class="achievements">
            {% for achievement in work_item.achievements %}
            <li>{{ achievement }}</li>
            {% endfor %}
          </ul>
          {% endif %}
        </div>
        {% endfor %}
      </div>
      {% endif %}
      
      <!-- 教育经历 -->
      {% if education %}
      <div class="section">
        <h2 class="section-title">教育背景</h2>
        {% for edu_item in education %}
        <div class="education-item">
          <div class="edu-header">
            <span class="edu-school">{{ edu_item.school or '学校名称' }}</span>
            <span class="edu-date">
              {{ edu_item.startDate or '' }}
              {% if edu_item.endDate %} - {{ edu_item.endDate }}{% else %} - 至今{% endif %}
            </span>
          </div>
          <div class="edu-major">
            {{ edu_item.major or '专业' }}
            {% if edu_item.degree %} · {{ edu_item.degree }}{% endif %}
          </div>
          {% if edu_item.description %}
          <div class="work-description">{{ edu_item.description }}</div>
          {% endif %}
        </div>
        {% endfor %}
      </div>
      {% endif %}
      
      <!-- 项目经历 -->
      {% if project %}
      <div class="section">
        <h2 class="section-title">项目经历</h2>
        {% for project_item in project %}
        <div class="work-item">
          <div class="work-header">
            <span class="work-company">{{ project_item.name or '项目名称' }}</span>
            <span class="work-date">
              {{ project_item.startDate or '' }}
              {% if project_item.endDate %} - {{ project_item.endDate }}{% else %} - 至今{% endif %}
            </span>
          </div>
          <div class="work-position">{{ project_item.role or '角色' }}</div>
          {% if project_item.description %}
          <div class="work-description">{{ project_item.description }}</div>
          {% endif %}
          {% if project_item.technologies %}
          <div class="work-description">
            <strong>技术栈：</strong>
            {{ project_item.technologies | join(', ') }}
          </div>
          {% endif %}
          {% if project_item.achievements %}
          <ul class="achievements">
            {% for achievement in project_item.achievements %}
            <li>{{ achievement }}</li>
            {% endfor %}
          </ul>
          {% endif %}
        </div>
        {% endfor %}
      </div>
      {% endif %}
      
      <!-- 自我评价 -->
      {% if self_evaluation and self_evaluation.content %}
      <div class="section">
        <h2 class="section-title">自我评价</h2>
        <p class="self-evaluation">{{ self_evaluation.content }}</p>
      </div>
      {% endif %}
    </div>
  </div>
</body>
</html>
```

## 模板2：现代模板（单栏布局）

### HTML结构 (template2.html)

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>个人简历</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
      background: #f7fafc;
    }
    
    .resume-container {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      background: white;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
    }
    
    /* 顶部渐变背景 */
    .header-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 50px 40px;
      text-align: center;
    }
    
    .header-section h1 {
      font-size: 42px;
      font-weight: bold;
      margin-bottom: 15px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    
    .header-section .tagline {
      font-size: 16px;
      opacity: 0.95;
      margin-bottom: 20px;
    }
    
    .header-section .contact-info {
      display: flex;
      justify-content: center;
      gap: 30px;
      flex-wrap: wrap;
      font-size: 14px;
    }
    
    .header-section .contact-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    /* 内容区域 */
    .content-section {
      padding: 40px;
    }
    
    .section {
      margin-bottom: 40px;
    }
    
    .section-title {
      font-size: 22px;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 25px;
      padding-bottom: 12px;
      border-bottom: 3px solid #667eea;
      position: relative;
    }
    
    .section-title::before {
      content: '';
      position: absolute;
      left: 0;
      bottom: -3px;
      width: 60px;
      height: 3px;
      background: #764ba2;
    }
    
    /* 卡片式内容 */
    .card {
      background: #f7fafc;
      border-radius: 12px;
      padding: 25px;
      margin-bottom: 20px;
      border-left: 5px solid #667eea;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
    }
    
    .card:hover {
      transform: translateX(5px);
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
    }
    
    .card-title {
      font-size: 18px;
      font-weight: bold;
      color: #1e293b;
    }
    
    .card-date {
      font-size: 14px;
      color: #64748b;
      white-space: nowrap;
    }
    
    .card-subtitle {
      font-size: 16px;
      color: #475569;
      margin-bottom: 12px;
    }
    
    .card-description {
      font-size: 14px;
      line-height: 1.8;
      color: #64748b;
      margin-bottom: 12px;
    }
    
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }
    
    .tag {
      background: #e0e7ff;
      color: #4338ca;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
    }
    
    .achievements {
      list-style: none;
      padding-left: 0;
      margin-top: 12px;
    }
    
    .achievements li {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 8px;
      padding-left: 25px;
      position: relative;
      line-height: 1.6;
    }
    
    .achievements li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #667eea;
      font-weight: bold;
    }
    
    .skill-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
    
    .skill-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      border: 2px solid #e0e7ff;
    }
    
    .skill-category {
      font-size: 16px;
      font-weight: bold;
      color: #1e293b;
      margin-bottom: 12px;
    }
    
    .skill-items {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .skill-item {
      background: #f1f5f9;
      color: #475569;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 13px;
    }
    
    @media print {
      .resume-container {
        box-shadow: none;
      }
      
      .card:hover {
        transform: none;
      }
    }
  </style>
</head>
<body>
  <div class="resume-container">
    <!-- 顶部渐变背景 -->
    <div class="header-section">
      <h1>{{ personal_info.name or '姓名' }}</h1>
      {% if personal_info.tagline %}
      <p class="tagline">{{ personal_info.tagline }}</p>
      {% endif %}
      <div class="contact-info">
        {% if personal_info.phone %}
        <div class="contact-item">
          <span>📞</span>
          <span>{{ personal_info.phone }}</span>
        </div>
        {% endif %}
        {% if personal_info.email %}
        <div class="contact-item">
          <span>✉️</span>
          <span>{{ personal_info.email }}</span>
        </div>
        {% endif %}
        {% if personal_info.address %}
        <div class="contact-item">
          <span>📍</span>
          <span>{{ personal_info.address }}</span>
        </div>
        {% endif %}
      </div>
    </div>
    
    <!-- 内容区域 -->
    <div class="content-section">
      <!-- 工作经历 -->
      {% if work %}
      <div class="section">
        <h2 class="section-title">工作经历</h2>
        {% for work_item in work %}
        <div class="card">
          <div class="card-header">
            <div class="card-title">{{ work_item.company or '公司名称' }}</div>
            <div class="card-date">
              {{ work_item.startDate or '' }}
              {% if work_item.endDate %} - {{ work_item.endDate }}{% else %} - 至今{% endif %}
            </div>
          </div>
          <div class="card-subtitle">{{ work_item.position or '职位' }}</div>
          {% if work_item.description %}
          <div class="card-description">{{ work_item.description }}</div>
          {% endif %}
          {% if work_item.achievements %}
          <ul class="achievements">
            {% for achievement in work_item.achievements %}
            <li>{{ achievement }}</li>
            {% endfor %}
          </ul>
          {% endif %}
        </div>
        {% endfor %}
      </div>
      {% endif %}
      
      <!-- 教育经历 -->
      {% if education %}
      <div class="section">
        <h2 class="section-title">教育背景</h2>
        {% for edu_item in education %}
        <div class="card">
          <div class="card-header">
            <div class="card-title">{{ edu_item.school or '学校名称' }}</div>
            <div class="card-date">
              {{ edu_item.startDate or '' }}
              {% if edu_item.endDate %} - {{ edu_item.endDate }}{% else %} - 至今{% endif %}
            </div>
          </div>
          <div class="card-subtitle">
            {{ edu_item.major or '专业' }}
            {% if edu_item.degree %} · {{ edu_item.degree }}{% endif %}
          </div>
          {% if edu_item.description %}
          <div class="card-description">{{ edu_item.description }}</div>
          {% endif %}
        </div>
        {% endfor %}
      </div>
      {% endif %}
      
      <!-- 项目经历 -->
      {% if project %}
      <div class="section">
        <h2 class="section-title">项目经历</h2>
        {% for project_item in project %}
        <div class="card">
          <div class="card-header">
            <div class="card-title">{{ project_item.name or '项目名称' }}</div>
            <div class="card-date">
              {{ project_item.startDate or '' }}
              {% if project_item.endDate %} - {{ project_item.endDate }}{% else %} - 至今{% endif %}
            </div>
          </div>
          <div class="card-subtitle">{{ project_item.role or '角色' }}</div>
          {% if project_item.description %}
          <div class="card-description">{{ project_item.description }}</div>
          {% endif %}
          {% if project_item.technologies %}
          <div class="tags">
            {% for tech in project_item.technologies %}
            <span class="tag">{{ tech }}</span>
            {% endfor %}
          </div>
          {% endif %}
          {% if project_item.achievements %}
          <ul class="achievements">
            {% for achievement in project_item.achievements %}
            <li>{{ achievement }}</li>
            {% endfor %}
          </ul>
          {% endif %}
        </div>
        {% endfor %}
      </div>
      {% endif %}
      
      <!-- 技能特长 -->
      {% if skill %}
      <div class="section">
        <h2 class="section-title">技能特长</h2>
        <div class="skill-grid">
          {% for skill_item in skill %}
          <div class="skill-card">
            <div class="skill-category">{{ skill_item.category or '技能类别' }}</div>
            {% if skill_item.items %}
            <div class="skill-items">
              {% for item in skill_item.items %}
              <span class="skill-item">{{ item }}</span>
              {% endfor %}
            </div>
            {% endif %}
          </div>
          {% endfor %}
        </div>
      </div>
      {% endif %}
      
      <!-- 自我评价 -->
      {% if self_evaluation and self_evaluation.content %}
      <div class="section">
        <h2 class="section-title">自我评价</h2>
        <div class="card">
          <div class="card-description">{{ self_evaluation.content }}</div>
        </div>
      </div>
      {% endif %}
    </div>
  </div>
</body>
</html>
```

## 后端Python实现示例

```python
# backend/utils/resume_generator.py
from jinja2 import Environment, FileSystemLoader
import os

def generate_resume_html(template_id, personal_info, module_data):
    """
    根据template_id生成HTML内容
    
    Args:
        template_id: 模板ID (template1, template2, template3)
        personal_info: 个人信息字典
        module_data: 模块数据字典
    
    Returns:
        str: 渲染后的HTML字符串
    """
    # 获取模板目录
    current_dir = os.path.dirname(os.path.abspath(__file__))
    template_dir = os.path.join(current_dir, '..', 'templates', 'resume')
    
    # 初始化Jinja2环境
    env = Environment(
        loader=FileSystemLoader(template_dir),
        autoescape=True
    )
    
    # 选择模板文件
    template_file = f"{template_id}.html"
    
    try:
        template = env.get_template(template_file)
    except Exception as e:
        # 如果模板不存在，使用默认模板
        print(f"模板 {template_file} 不存在，使用默认模板: {e}")
        template = env.get_template("template1.html")
    
    # 准备模板上下文数据
    context = {
        'personal_info': personal_info or {},
        'education': module_data.get('education', []),
        'work': module_data.get('work', []),
        'project': module_data.get('project', []),
        'internship': module_data.get('internship', []),
        'research': module_data.get('research', []),
        'skill': module_data.get('skill', []),
        'self_evaluation': module_data.get('selfEvaluation', {}),
    }
    
    # 渲染模板
    html_content = template.render(**context)
    
    return html_content
```

## 在Flask路由中使用

```python
# backend/routes/resume.py
from flask import Blueprint, request, jsonify
from utils.resume_generator import generate_resume_html

resume_bp = Blueprint('resume', __name__, url_prefix='/api/resume')

@resume_bp.post("/generate")
def generate_resume():
    """生成简历"""
    data = request.get_json()
    template_id = data.get("template_id")
    personal_info = data.get("personal_info", {})
    module_data = data.get("module_data", {})
    
    # 生成HTML
    html_content = generate_resume_html(
        template_id=template_id,
        personal_info=personal_info,
        module_data=module_data
    )
    
    # 保存到数据库
    resume = Resume(
        template_id=template_id,
        content=html_content,
        # ... 其他字段
    )
    db.session.add(resume)
    db.session.commit()
    
    return jsonify({
        "message": "简历生成成功",
        "data": {
            "id": resume.id,
            "template_id": template_id
        }
    })
```







