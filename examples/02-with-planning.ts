/**
 * 02-with-planning.ts — 带规划能力的 Agent 示例
 *
 * 本章知识点：concepts/02 - 规划（Planning）
 * 本示例展示 Agent 的两种规划模式：
 *   - Plan-and-Execute：先规划，再执行
 *   - ReAct：边推理边行动
 */

import { Agent } from "@anthropic-ai/claude-code";

// ============================================================
// 工具定义
// ============================================================
const tools = {
  // 搜索工具（模拟实现）
  async search(query: string) {
    console.log(`🔍 搜索: "${query}"`);
    return `关于 "${query}" 的搜索结果...`;
  },

  // 读取文件（模拟实现）
  async readFile(path: string) {
    console.log(`📄 读取文件: ${path}`);
    return `文件 ${path} 的内容...`;
  },

  // 写文件（模拟实现）
  async writeFile(path: string, content: string) {
    console.log(`✍️ 写入文件: ${path}`);
    return `成功写入 ${path}`;
  },

  // 执行命令（模拟实现）
  async executeCommand(cmd: string) {
    console.log(`⚙️ 执行命令: ${cmd}`);
    return `命令 "${cmd}" 执行完成`;
  }
};

// ============================================================
// 模式一：Plan-and-Execute（先规划，再执行）
// ============================================================
// 这种模式下，Agent 会先花时间制定完整计划，然后按顺序执行
const planAndExecuteAgent = new Agent({
  model: "claude-opus-4-6",
  tools,
  planningMode: "plan-and-execute", // 开启 Plan-and-Execute 模式
  systemPrompt: `你是一个专业的软件工程师助手。
当收到任务时，你会先制定完整的执行计划，列出所有步骤，再按顺序执行。
planningMode: plan-and-execute — 先规划，后执行。`
});

// ============================================================
// 模式二：ReAct（边推理边行动）
// ============================================================
// 这种模式下，Agent 每执行一步都会思考"我做了什么？结果如何？下一步该做什么？"
const reactAgent = new Agent({
  model: "claude-opus-4-6",
  tools,
  planningMode: "react", // 开启 ReAct 模式
  systemPrompt: `你是一个专业的软件工程师助手。
你会边做边思考：先推理下一步做什么，执行后观察结果，再决定下一步。
planningMode: react — 推理 + 行动 交替循环。`
});

// ============================================================
// 运行示例
// ============================================================
async function main() {
  console.log("=== 模式一：Plan-and-Execute ===\n");
  const result1 = await planAndExecuteAgent.run(
    "帮我创建一个简单的 HTTP 服务器，监听 3000 端口"
  );
  console.log("\n📤 结果:", result1);

  console.log("\n=== 模式二：ReAct ===\n");
  const result2 = await reactAgent.run(
    "帮我创建一个简单的 HTTP 服务器，监听 3000 端口"
  );
  console.log("\n📤 结果:", result2);
}

main().catch(console.error);
