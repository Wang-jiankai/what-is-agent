/**
 * 01-basic-solution.ts — 第一章练习参考答案
 *
 * 对应练习：exercises/01-basic-exercise.md
 * 对应概念：concepts/01-what-is-agent.md
 *
 * ⚠️ 重要说明：
 * Claude Agent SDK 使用内置工具（Read、Write、Bash 等），不直接支持
 * 自定义函数工具（如 greet(name, hour)）。这是真实 SDK 与练习期望的差异。
 *
 * 解决方案有两种：
 * 1. 用 Bash 调用 Node.js 脚本（间接实现自定义工具）
 * 2. 说明 SDK 限制，通过 MCP 扩展自定义工具
 *
 * 本参考答案采用方案 1：用 SDK 内置工具完成等效任务。
 */

import { query } from "@anthropic-ai/claude-agent-sdk";
import * as fs from "fs";
import * as path from "path";

// ============================================================
// 方案：用 Bash 工具调用 Node.js 脚本，模拟自定义工具
// ============================================================
// 这是一种"曲线救国"的方式——通过 Bash 执行 Node.js 命令，
// 间接实现 greet 和 getCurrentTime 的功能。

async function greet(name: string, hour: number): Promise<string> {
  let greeting: string;
  if (hour >= 0 && hour < 12) {
    greeting = "早上好";
  } else if (hour >= 12 && hour < 18) {
    greeting = "下午好";
  } else {
    greeting = "晚上好";
  }
  return `${greeting}，${name}！`;
}

async function getCurrentTime(): Promise<string> {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

// 将工具写成独立的 Node.js 脚本，供 Agent 通过 Bash 调用
function setupTools() {
  const tmpDir = path.join(process.cwd(), "tmp");
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  // greet 工具脚本
  fs.writeFileSync(
    path.join(tmpDir, "greet.js"),
    `
const [name, hour] = process.argv.slice(2);
let greeting;
if (hour >= 0 && hour < 12) greeting = "早上好";
else if (hour >= 12 && hour < 18) greeting = "下午好";
else greeting = "晚上好";
console.log(greeting + "，" + name + "！");
`
  );

  // getCurrentTime 工具脚本
  fs.writeFileSync(
    path.join(tmpDir, "getTime.js"),
    `
const now = new Date();
const h = String(now.getHours()).padStart(2, "0");
const m = String(now.getMinutes()).padStart(2, "0");
console.log(h + ":" + m);
`
  );
}

// ============================================================
// 练习 1 参考答案（基础任务）
// ============================================================
async function exercise1() {
  console.log("=== 练习 1：Agent 使用内置 Bash 工具 ===\n");

  setupTools();
  const tmpDir = path.join(process.cwd(), "tmp");

  // 模拟下午 3 点，向张三打招呼
  console.log("基础任务：向张三打招呼（下午 3 点）\n");

  for await (const message of query({
    prompt:
      '请在 ./tmp 目录下执行命令：node greet.js 张三 15，向张三打招呼。',
    options: {
      allowedTools: ["Bash", "Read", "Write"],
      cwd: process.cwd(),
      systemPrompt: `你是一个友好的助手。
你会使用 Bash 工具执行 Node.js 命令来完成任务。
每个工具调用后，观察结果，再决定下一步。`,
    },
  })) {
    console.log(message);
  }
}

// ============================================================
// 练习 2 参考答案（进阶任务）
// ============================================================
async function exercise2() {
  console.log("\n=== 练习 2：Agent 自动获取时间后打招呼 ===\n");

  const tmpDir = path.join(process.cwd(), "tmp");

  for await (const message of query({
    prompt:
      "请先获取当前时间（执行 node ./tmp/getTime.js），然后向李四打招呼（执行 node ./tmp/greet.js 李四 [获取到的小时数]）。先做第一步，再做第二步。",
    options: {
      allowedTools: ["Bash", "Read"],
      cwd: process.cwd(),
      systemPrompt: `你是一个友好的助手。
你会按顺序执行 Bash 命令：先获取时间，再打招呼。
每执行一步后，观察输出，再执行下一步。`,
    },
  })) {
    console.log(message);
  }
}

// ============================================================
// 清理
// ============================================================
function cleanup() {
  const tmpDir = path.join(process.cwd(), "tmp");
  if (fs.existsSync(tmpDir)) {
    fs.rmSync(tmpDir, { recursive: true });
  }
}

// ============================================================
// 运行
// ============================================================
async function main() {
  console.log("🤖 Agent 练习参考答案\n");
  console.log("提示：确保已设置 ANTHROPIC_API_KEY 环境变量\n");

  try {
    await exercise1();
    await exercise2();
  } finally {
    cleanup();
  }
}

main().catch(console.error);

// ============================================================
// 思考题答案
// ============================================================
/**
 * 1. 在代码中，哪个部分体现了 Agent 的"感知"能力？
 *    → prompt（"请向张三打招呼..."）是用户的输入，Agent 接收并理解它，这就是感知
 *
 * 2. 如果不定义任何工具，Agent 还能正常工作吗？为什么？
 *    → 可以运行，但能力受限。Agent 只能通过 LLM 推理回答问题，
 *      无法执行操作（如运行命令、读写文件）。这就是"工具是 Agent 的手"的意义。
 *
 * 3. systemPrompt 对 Agent 行为有什么影响？
 *    → 决定 Agent 的角色定位、回答风格、工具使用策略。
 *      本质上是在塑造 Agent 的"性格"和"能力边界"。
 */
