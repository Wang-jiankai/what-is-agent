# 11 | 生产环境部署

## 🎯 学习目标

- 理解将 Agent 应用从原型到生产的完整流程
- 掌握 API Key 管理、环境变量配置
- 了解常见部署方式（Vercel、服务器、Docker）
- 理解生产环境的监控和错误处理

---

## 📖 概念讲解

### 从原型到生产

```
原型阶段              生产阶段
─────────────────────────────────────
本地测试              7×24 小时运行
API Key 写在代码里    安全的环境变量管理
print 调试            结构化日志
单用户                多用户并发
无监控                有监控和告警
```

### 生产环境的核心要素

| 要素 | 说明 | 常见方案 |
|------|------|---------|
| **API Key 管理** | 不能硬编码在代码里 | .env 文件、环境变量、密钥服务 |
| **日志记录** | 追踪运行情况、排查问题 | 结构化日志、ELK、Pino |
| **错误处理** | 优雅地处理失败 | 重试、降级、错误边界 |
| **监控告警** | 知道系统什么时候出问题 | Prometheus + Grafana、Sentry |
| **扩缩容** | 流量变化时的应对 | Kubernetes、自动扩缩容 |
| **安全** | 防止滥用、保护数据 | 限流、鉴权、输入验证 |

---

## 上篇：环境配置与 API Key 管理

### 正确做法：使用环境变量

**❌ 错误：将 API Key 硬编码在代码中**
```typescript
const apiKey = "sk-ant-xxxxx"; // 不要这样做！
```

**✅ 正确：从环境变量读取**
```typescript
import * as dotenv from "dotenv";
dotenv.config(); // 加载 .env 文件

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  throw new Error("ANTHROPIC_API_KEY 环境变量未设置");
}
```

### .env 文件的使用

```bash
# .env 文件（不要提交到 Git！）
ANTHROPIC_API_KEY=sk-ant-xxxxx
LOG_LEVEL=info
NODE_ENV=production
```

```gitignore
# .gitignore
.env
.env.local
```

### 多环境配置

| 环境 | 用途 | 示例 .env 文件 |
|------|------|---------------|
| development | 本地开发 | .env.development |
| staging | 测试环境 | .env.staging |
| production | 线上环境 | .env.production |

---

## 下篇：常见部署方式

### 方式一：Vercel / Netlify（最简单）

适合：快速上线的小型应用

```bash
# vercel.json 配置示例
{
  "env": {
    "ANTHROPIC_API_KEY": "@anthropic-api-key"
  },
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

优点：零配置、CDN 加速、自动 HTTPS
缺点：冷启动延迟、函数计算限制

### 方式二：Docker 容器（最灵活）

适合：有定制需求、需要完整控制的应用

```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .

CMD ["node", "dist/index.js"]
```

```bash
# 构建和运行
docker build -t my-agent .
docker run -p 3000:3000 --env-file .env my-agent
```

### 方式三：传统服务器（最高控制力）

适合：企业级应用、需要长期稳定运行

```bash
# 使用 PM2 管理进程
npm install -g pm2
pm2 start dist/index.js --name agent-app
pm2 save
pm2 startup
```

---

## 串联：完整的生产部署 checklist

```
□ 代码审查
□ 单元测试 + 集成测试
□ 构建成功（npm run build）
□ 环境变量配置正确
□ API Key 已设置（生产环境）
□ 日志系统已配置
□ 错误告警已设置
□ 监控仪表盘已创建
□ HTTPS 已启用
□ 限流规则已配置
□ 备份策略已制定
□ 部署文档已更新
```

---

## 💡 常见错误处理

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| 429 Rate Limit | API 调用超过限制 | 添加重试逻辑 + 限流 |
| 401 Unauthorized | API Key 无效或过期 | 检查环境变量配置 |
| Context Overflow | 输入超出模型限制 | 减少输入长度、分片处理 |
| Timeout | 请求超时 | 增加超时时间、实现降级 |
| Memory Leak | 内存持续增长 | 检查对象引用、添加内存监控 |

---

## 📝 章节回顾

**记住这三个关键点：**

1. **API Key 绝不硬编码**
   用环境变量，.env 文件不要提交到 Git

2. **生产环境需要完整的观测手段**
   日志 + 监控 + 告警，三者缺一不可

3. **错误处理是 Agent 的生命线**
   网络不稳定、API 限流、模型响应慢——都要有应对方案

---

## ❓ 自我检测

- [ ] 能说出至少 3 个生产环境和开发环境的区别吗？
- [ ] 能正确配置 .env 文件并通过环境变量读取 API Key 吗？
- [ ] 能为你的 Agent 应用设计一个简单的错误处理策略吗？

---

## 🔗 相关资源

- 延伸阅读：[Claude API 速率限制](https://docs.anthropic.com/en/api/rate-limits)
- 延伸阅读：[PM2 进程管理](https://pm2.keymetrics.io/)
- 延伸阅读：[Sentry 错误追踪](https://sentry.io)
