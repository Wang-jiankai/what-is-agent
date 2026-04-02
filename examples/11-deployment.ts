/**
 * 11-deployment.ts — 生产环境部署演示
 *
 * 本章知识点：concepts/11 - 生产环境部署
 *
 * 本示例展示：
 *   - Part A：正确的环境变量读取方式
 *   - Part B：带重试和超时错误处理的 Agent 调用
 *   - Part C：简单的限流实现
 *
 * 运行方式：
 *   npm install
 *   ANTHROPIC_API_KEY=sk-xxx npx ts-node examples/11-deployment.ts
 */

import { query } from "@anthropic-ai/claude-agent-sdk";
import * as dotenv from "dotenv";

// 加载 .env 文件
dotenv.config();

// ============================================================
// Part A：正确的环境变量读取
// ============================================================

function partA_envVariables() {
  console.log("=== Part A：环境变量配置 ===\n");

  // 正确的读取方式
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const logLevel = process.env.LOG_LEVEL || "info";
  const nodeEnv = process.env.NODE_ENV || "development";

  console.log("当前环境配置：");
  console.log(`  NODE_ENV: ${nodeEnv}`);
  console.log(`  LOG_LEVEL: ${logLevel}`);
  console.log(`  ANTHROPIC_API_KEY: ${apiKey ? "已设置 ✓" : "未设置 ✗"}`);

  if (!apiKey) {
    console.log("\n⚠️ 请设置 ANTHROPIC_API_KEY 环境变量");
    console.log("  export ANTHROPIC_API_KEY=sk-xxx  # Linux/Mac");
    console.log("  set ANTHROPIC_API_KEY=sk-xxx    # Windows");
  }
}

// ============================================================
// Part B：带重试和超时错误处理的 Agent 调用
// ============================================================

interface RetryOptions {
  maxRetries: number;
  retryDelay: number;
  timeout: number;
}

async function queryWithRetry(
  prompt: string,
  options: RetryOptions = { maxRetries: 3, retryDelay: 1000, timeout: 30000 }
): Promise<string> {
  const { maxRetries, retryDelay, timeout } = options;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`尝试 ${attempt + 1}/${maxRetries + 1}...`);

      const result = await Promise.race([
        collectQueryResult(prompt),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("请求超时")), timeout)
        ),
      ]);

      console.log("✓ 成功\n");
      return result;
    } catch (error: any) {
      console.log(`✗ 失败: ${error.message}`);

      if (attempt < maxRetries) {
        console.log(`等待 ${retryDelay}ms 后重试...\n`);
        await sleep(retryDelay);
      } else {
        console.log("\n✗ 已达到最大重试次数\n");
        throw error;
      }
    }
  }

  throw new Error("未预期的错误");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function collectQueryResult(prompt: string): Promise<string> {
  let result = "";
  for await (const message of query({
    prompt,
    options: { allowedTools: [] },
  })) {
    result += message;
  }
  return result;
}

async function partB_errorHandling() {
  console.log("\n=== Part B：重试与超时处理 ===\n");

  try {
    const result = await queryWithRetry("用一句话解释什么是人工智能", {
      maxRetries: 2,
      retryDelay: 500,
      timeout: 20000,
    });
    console.log("结果:", result);
  } catch (error: any) {
    console.log("最终错误:", error.message);
  }
}

// ============================================================
// Part C：简单限流实现
// ============================================================

class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens: number;
  private readonly refillRate: number; // 每毫秒补充的 token 数

  constructor(maxTokens: number, perSecond: number) {
    this.maxTokens = maxTokens;
    this.tokens = maxTokens;
    this.lastRefill = Date.now();
    this.refillRate = perSecond / 1000;
  }

  /** 尝试获取一个 token */
  async acquire(): Promise<void> {
    this.refill();

    if (this.tokens > 0) {
      this.tokens--;
      console.log(`限流器：获取 token，剩余 ${this.tokens}/${this.maxTokens}`);
      return;
    }

    // 没有可用 token，等待
    const waitTime = Math.ceil(1 / this.refillRate);
    console.log(`限流器：无可用 token，等待 ${waitTime}ms...`);
    await sleep(waitTime);
    return this.acquire();
  }

  /** 补充 token */
  private refill() {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const tokensToAdd = elapsed * this.refillRate;

    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }
}

async function partC_rateLimiter() {
  console.log("\n=== Part C：限流实现 ===\n");

  // 每秒最多 2 个请求，最多缓存 5 个
  const limiter = new RateLimiter(5, 2);

  console.log("模拟 7 次 API 调用...\n");

  for (let i = 1; i <= 7; i++) {
    console.log(`--- 第 ${i} 次调用 ---`);
    await limiter.acquire();
    console.log(`第 ${i} 次调用开始...\n`);
    await sleep(100); // 模拟 API 调用耗时
  }
}

// ============================================================
// 运行示例
// ============================================================
async function main() {
  console.log("🤖 生产环境部署演示\n");

  partA_envVariables();

  console.log("\n" + "=".repeat(50) + "\n");

  // Part B 和 C 需要 API Key
  if (process.env.ANTHROPIC_API_KEY) {
    await partB_errorHandling();

    console.log("\n" + "=".repeat(50) + "\n");

    await partC_rateLimiter();
  } else {
    console.log("⚠️ 未设置 API Key，跳过 Part B 和 Part C");
    console.log("\n要运行完整演示，请先设置：");
    console.log("export ANTHROPIC_API_KEY=sk-xxx");
  }
}

main().catch(console.error);
