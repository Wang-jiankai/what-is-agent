# 11 | 练习：生产环境部署

## 🎯 练习目标

- 掌握环境变量的正确配置方式
- 理解生产环境的错误处理策略
- 能为 Agent 应用设计基本的监控和限流方案

---

## 📋 练习要求

### 基础任务（必做）

**任务 1：配置生产环境变量**

为你的 Agent 项目配置完整的环境变量：

1. 创建 `.env.example` 文件（作为模板，包含所有需要的变量，不含实际值）
2. 在 `.gitignore` 中排除 `.env`
3. 编写一个 `src/config.ts`，从环境变量读取配置

```typescript
// src/config.ts 应包含
interface Config {
  anthropicApiKey: string;
  logLevel: "debug" | "info" | "warn" | "error";
  nodeEnv: "development" | "production" | "test";
  // ... 其他配置
}
```

**验证方式**：
- `.env.example` 能被分享给团队成员但不泄露敏感信息
- 运行 `NODE_ENV=production npm run dev` 时，Config 能正确读取

---

**任务 2：实现带降级的 Agent 调用**

实现一个 Agent 调用函数：

```typescript
async function queryWithFallback(prompt: string): Promise<string> {
  // 优先使用 Claude
  // 如果失败，降级到"抱歉，我现在无法回答这个问题"
}
```

**验证方式**：当 API Key 错误或网络中断时，返回友好的降级响应而不是崩溃。

---

### 进阶任务（选做）

**任务 3：实现一个简单的请求限流器**

用 TypeScript 实现一个 `TokenBucket` 限流器：

```typescript
class TokenBucket {
  constructor(capacity: number, refillRate: number) {}

  async acquire(): Promise<void> {
    // 尝试获取 token，如果没有则等待
  }
}
```

测试：
```typescript
const limiter = new TokenBucket(3, 1); // 容量3，每秒补充1
for (let i = 0; i < 5; i++) {
  await limiter.acquire();
  console.log(`请求 ${i + 1} 通过`);
}
```

---

## 🔍 思考题

1. 如果 API Key 泄露了，应该立即采取什么措施？之后怎么防止？
2. 生产环境中，日志应该记录哪些信息？哪些信息不应该记录？
3. 限流的目的是什么？除了限流，还有什么方法防止资源被耗尽？

---

## 💡 提示

- 本练习对应的概念文章：[`concepts/11-deployment.md`](../concepts/11-deployment.md)
- 参考答案：[`references/11-deployment-solution.ts`](../references/11-deployment-solution.ts)
