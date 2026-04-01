/**
 * 01-basic.ts — Agent 基础示例
 *
 * 本章知识点：concepts/01 - 什么是 Agent？
 *
 * 本示例展示一个最简单的 Agent 具备的四个核心要素：
 *   - 感知（接收用户输入）
 *   - 思考（LLM 推理）
 *   - 行动（调用工具）
 *   - 反馈（根据结果调整）
 *
 * 运行方式：
 *   npm install
 *   npx ts-node examples/01-basic.ts
 *
 * 前置要求：设置环境变量 ANTHROPIC_API_KEY
 */

import { query } from "@anthropic-ai/claude-agent-sdk";

// ============================================================
// 工具说明
// ============================================================
// Claude Agent SDK 内置了以下工具，开箱即用：
//   - Read   ：读取文件内容
//   - Edit   ：编辑文件
//   - Write  ：写入文件
//   - Bash   ：执行终端命令
//   - Glob   ：按模式匹配文件
//   - Grep   ：搜索文件内容
//   - WebSearch：联网搜索
//
// 本示例使用 allowedTools 控制 Agent 可以调用哪些工具。
// 你可以把 allowedTools 看成 Agent 的"手"——没有工具，Agent 只能空想。

// ============================================================
// 运行 Agent（感知 → 思考 → 行动 → 反馈 循环）
// ============================================================
async function main() {
  console.log("🤖 Agent 启动...\n");
  console.log("提示：确保已设置 ANTHROPIC_API_KEY 环境变量\n");

  // --------------------------------------------------
  // 示例 1：简单问答（只允许 Bash 工具）
  // Agent 通过 LLM 推理直接回答，不需要调用外部工具
  // --------------------------------------------------
  console.log("=== 示例 1：简单问答（无需工具） ===\n");

  for await (const message of query({
    prompt: "北京的人口大约有多少？请给出一个大概的数字。",
    options: {
      // 只允许 Bash 工具（这里不会用到，只是演示 allowedTools 语法）
      allowedTools: ["Bash"],
    },
  })) {
    // message 是流式输出的片段，可能是文本、工具调用或最终结果
    console.log(message);
  }

  // --------------------------------------------------
  // 示例 2：Agent 调用内置工具（感知 → 行动）
  // Agent 发现需要信息，主动调用 WebSearch 工具
  // --------------------------------------------------
  console.log("\n=== 示例 2：Agent 调用工具（感知 + 行动） ===\n");

  for await (const message of query({
    prompt: "搜索一下今天 GitHub 热门项目的标题，返回前 3 个。",
    options: {
      // 允许 Agent 使用的工具列表
      allowedTools: ["WebSearch", "Bash", "Read", "Edit", "Write"],
    },
  })) {
    console.log(message);
  }

  // --------------------------------------------------
  // 示例 3：让 Agent 操作文件系统（真实的反馈循环）
  // Agent 会：读取文件 → 分析内容 → 写入结果
  // --------------------------------------------------
  console.log("\n=== 示例 3：Agent 操作文件系统 ===\n");

  // 创建一个测试文件，供 Agent 读取和操作
  const fs = await import("fs");

  if (!fs.existsSync("./tmp")) {
    fs.mkdirSync("./tmp");
  }
  fs.writeFileSync("./tmp/test.txt", "Hello, Agent!");

  for await (const message of query({
    prompt:
      "读取 ./tmp/test.txt 文件，然后在文件末尾追加一行 'Agent 已完成操作'。",
    options: {
      allowedTools: ["Read", "Edit", "Write", "Bash"],
      // cwd 指定 Agent 的工作目录
      cwd: process.cwd(),
    },
  })) {
    console.log(message);
  }

  // 验证结果
  const result = fs.readFileSync("./tmp/test.txt", "utf-8");
  console.log("\n📄 文件最终内容：", result);

  // 清理
  fs.rmSync("./tmp", { recursive: true });
}

main().catch(console.error);
