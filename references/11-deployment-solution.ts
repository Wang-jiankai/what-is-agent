/**
 * 11-deployment-solution.ts — 练习参考答案
 *
 * 本文件包含 exercises/11-deployment-exercise.md 的参考解答。
 * 建议先独立完成练习，再对照参考。
 */

import { query } from "@anthropic-ai/claude-agent-sdk";

// ============================================================
// 任务 1：环境变量配置
// ============================================================

function task1_envConfig() {
  console.log("=== 任务 1：环境变量配置 ===\n");

  // 1. .env.example 文件内容
  console.log("【.env.example】");
  console.log(`
ANTHROPIC_API_KEY=your_api_key_here
LOG_LEVEL=info
NODE_ENV=development
PORT=3000
MAX_TOKENS=4096
RATE_LIMIT_PER_SECOND=2
`.trim());

  // 2. .gitignore 应包含
  console.log("\n【.gitignore 添加】");
  console.log(`
# 环境变量
.env
.env.local
.env.*.local
`.trim());

  // 3. src/config.ts
  console.log("\n【src/config.ts】");
  console.log(`
import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const configSchema = z.object({
  anthropicApiKey: z.string().min(1, "ANTHROPIC_API_KEY 必须设置"),
  logLevel: z.enum(["debug", "info", "warn", "error"]).default("info"),
  nodeEnv: z.enum(["development", "production", "test"]).default("development"),
  port: z.coerce.number().default(3000),
});

export const config = configSchema.parse(process.env);

console.log("当前配置：", {
  nodeEnv: config.nodeEnv,
  logLevel: config.logLevel,
  port: config.port,
  hasApiKey: !!config.anthropicApiKey,
});
`.trim());
}

// ============================================================
// 任务 2：带降级的 Agent 调用
// ============================================================

async function queryWithFallback(prompt: string): Promise<string> {
  try {
    // 优先使用 Claude
    let result = "";
    for await (const message of query({
      prompt,
      options: { allowedTools: [] },
    })) {
      result += message;
    }
    return result;
  } catch (error: any) {
    console.error("Agent 调用失败:", error.message);

    // 降级响应
    return "抱歉，我现在无法回答这个问题。请稍后再试，或联系技术支持。";
  }
}

async function task2_queryWithFallback() {
  console.log("\n=== 任务 2：带降级的 Agent 调用 ===\n");

  // 测试正常情况
  console.log("测试正常情况：");
  const result = await queryWithFallback("1+1 等于几？");
  console.log("结果:", result.substring(0, 50), "...\n");

  // 测试错误情况（不设置 API Key）
  console.log("测试降级情况（模拟 API 失败）：");
  // 这里无法真正模拟，只需确保 try-catch 能捕获错误
}

// ============================================================
// 任务 3：TokenBucket 限流器
// ============================================================

class TokenBucket {
  private tokens: number;
  private readonly capacity: number;
  private readonly refillRate: number; // 每毫秒补充的 token 数
  private lastRefill: number;

  constructor(capacity: number, refillPerSecond: number) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillPerSecond / 1000;
    this.lastRefill = Date.now();
  }

  async acquire(): Promise<void> {
    // 先补充 token
    this.refill();

    if (this.tokens >= 1) {
      this.tokens -= 1;
      console.log(`✓ 获取 token 成功，剩余 ${this.tokens}/${this.capacity}`);
      return;
    }

    // 没有足够的 token，等待
    const waitTime = Math.ceil(1 / this.refillRate);
    console.log(`✗ 暂无 token，等待 ${waitTime}ms...`);
    await new Promise((resolve) => setTimeout(resolve, waitTime));
    return this.acquire();
  }

  private refill() {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const tokensToAdd = elapsed * this.refillRate;

    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }
}

async function task3_tokenBucket() {
  console.log("\n=== 任务 3：TokenBucket 限流器 ===\n");

  const limiter = new TokenBucket(3, 1); // 容量3，每秒补充1

  console.log("模拟 6 次请求...\n");

  for (let i = 1; i <= 6; i++) {
    console.log(`【请求 ${i}】`);
    await limiter.acquire();
    await new Promise((resolve) => setTimeout(resolve, 100)); // 模拟处理时间
  }

  console.log("\n✓ 测试完成");
}

// ============================================================
// 主函数
// ============================================================

async function main() {
  task1_envConfig();
  await task2_queryWithFallback();
  await task3_tokenBucket();
}

main().catch(console.error);
