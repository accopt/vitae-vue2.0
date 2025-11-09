# 部署指南 — 前端 (Nuxt3) + 后端 (Flask)

本文档展示如何把前端 Nuxt3 与后端 Flask 一起部署（包含 Vercel / 本地生产方案）。

---

## 前提假设

- 后端 Flask 服务监听 `0.0.0.0:5000`，提供 `/api/*` 接口（例如 `/api/auth/login`）
- 前端使用 `NUXT_PUBLIC_API_BASE` 或 `runtimeConfig.public.apiBase` 指向后端或代理 `/api`
- 若使用代理开发（推荐），Nuxt dev 可代理到后端，生产部署请配置正确的环境变量或 Nginx 反向代理

---

## 使用 Vercel / Netlify 部署（前端）

### Vercel
- Vercel 对 Nuxt3 完整支持（SSR/Hybrid）。在项目设置中：
  - Build Command: `npm run build`
  - Output Directory: `.output/public`（当使用 Nuxt3 部署 SSR，需要 Serverless 或 Edge；若选择 static，则选择 `nuxi generate`）
  - Environment Variables:
    - `NUXT_PUBLIC_API_BASE` = `https://your-backend.example.com/api`

### Netlify
- 使用 `nuxi generate` 导出静态站点（如果网站不依赖 SSR）：
  - Build Command: `npm run generate`
  - Publish directory: `dist`

---

## Flask 后端生产注意事项

- 使用 `gunicorn` 或 `uvicorn`（若使用 ASGI 框架）
- 设置 CORS（如果前端直接访问后端）：

```py
from flask_cors import CORS
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "https://your-frontend.com"]}})
```

- 使用环境变量管理密钥（JWT_SECRET, DATABASE_URL 等）

---

## HTTPS / 反向代理（Nginx）

生产环境常用 Nginx 做反向代理，示例配置：

```nginx
server {
  listen 80;
  server_name example.com;

  location /api/ {
    proxy_pass http://127.0.0.1:5000/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  location / {
    proxy_pass http://127.0.0.1:3000;
    try_files $uri $uri/ /index.html;
  }
}
```

---

## 常见故障排查

- 401 未授权：确认前端已把 `Authorization: Bearer <token>` 头部带上；token 是否放在 Pinia/localStorage；后端是否读取 Authorization header。
- CORS 报错：确认 Flask CORS 配置覆盖 `/api/*`，并允许前端域名。
- 构建失败：检查 Node 版本（推荐 18+）与依赖版本。

---

## 本地生产部署

### 前端（Nuxt3）
1. 构建项目：`npm run build`
2. 预览生产版本：`npm run preview`
3. 生产环境运行：`node .output/server/index.mjs`

### 后端（Flask）
1. 安装依赖：`pip install -r requirements.txt`
2. 使用 gunicorn 运行：`gunicorn -w 4 -b 0.0.0.0:5000 app:app`  
