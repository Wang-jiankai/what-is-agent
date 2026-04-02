/**
 * 10-multi-agent.ts — 多 Agent 协作演示
 *
 * 本章知识点：concepts/10 - 多 Agent 协作
 *
 * 本示例展示：
 *   - 简化版 Supervisor + Workers 协作模式
 *
 * 运行方式：
 *   npm install
 *   npx ts-node examples/10-multi-agent.ts
 */

import { query } from "@anthropic-ai/claude-agent-sdk";

// ============================================================
// 多 Agent 协作：Supervisor + Workers 模式
// ============================================================
// 这是一个简化版的多 Agent 协作演示。
// 实际生产环境中，Agent 之间通过消息队列或共享状态进行通信。
// ============================================================

interface AgentResult {
  agent: string;
  result: string;
}

/** 模拟一个 Worker Agent */
async function runWorker(
  name: string,
  task: string,
  systemPrompt: string
): Promise<AgentResult> {
  console.log(`[${name}] 开始任务: ${task.substring(0, 30)}...`);

  let result = "";
  for await (const message of query({
    prompt: task,
    options: {
      allowedTools: [],
      systemPrompt,
    },
  })) {
    result += message;
  }

  console.log(`[${name}] 完成`);
  return { agent: name, result };
}

/** Supervisor：分析任务并分解 */
async function supervisorDemo() {
  console.log("=== Supervisor + Workers 多 Agent 协作 ===\n");

  const complexTask = "帮我做一个市场调研报告：分析竞品、功能对比、推荐方案";

  console.log(`原始任务：${complexTask}\n`);

  // Step 1: Supervisor 分析任务并分解
  console.log("[Supervisor] 分析任务，分解为子任务...\n");

  let plan = "";
  for await (const message of query({
    prompt: `请将以下任务分解为 3 个独立的子任务，每个子任务由一个专业 Agent 负责：

${complexTask}

输出格式（JSON数组）：
[
  {"agent": "Agent名称", "task": "具体任务描述", "skill": "所需专业技能"}
]
`,
    options: {
      allowedTools: [],
      systemPrompt:
        "你是任务分解专家，擅长将复杂任务拆分为可并行执行的子任务。输出必须是 JSON 格式。",
    },
  })) {
    plan += message;
  }
  console.log("分解结果：\n" + plan + "\n");

  // Step 2: 并行执行 Workers（简化版，实际需要真正的并发）
  console.log("--- 并行执行 Workers ---\n");

  // 模拟 3 个 Worker 的 systemPrompt
  const workers = [
    {
      name: "Researcher",
      task: "调研竞品：列出 5 个主要竞品的特点、优缺点",
      skill: "你是一个市场调研专家，擅长收集和分析竞品信息。",
    },
    {
      name: "Analyst",
      task: "功能对比：从功能、性能、价格三个维度对比竞品",
      skill: "你是一个数据分析专家，擅长对比分析。",
    },
    {
      name: "Writer",
      task: "撰写报告：根据调研和分析结果，撰写一份结构化的市场报告",
      skill: "你是一个专业报告撰写者，擅长清晰准确地表达分析结果。",
    },
  ];

  const results: AgentResult[] = [];

  // 顺序执行（真正的并行需要多进程/多机器）
  for (const worker of workers) {
    const result = await runWorker(worker.name, worker.task, worker.skill);
    results.push(result);
    console.log(`[${worker.name}] 结果预览: ${result.result.substring(0, 50)}...\n`);
  }

  // Step 3: Supervisor 汇总
  console.log("\n[Supervisor] 汇总结果...\n");

  const summary = results
    .map((r) => `## ${r.agent} 的结果\n${r.result}`)
    .join("\n\n");

  for await (const message of query({
    prompt: `请根据以下各 Agent 的输出，汇总成一份完整的市场调研报告：

${summary}

报告要求：
1. 结构清晰，有目录
2. 每个竞品有独立的章节
3. 最后有总结和推荐
`,
    options: {
      allowedTools: [],
      systemPrompt: "你是一个专业的报告撰写专家，擅长汇总多方信息。",
    },
  })) {
    console.log(message);
  }
}

// ============================================================
// 运行示例
// ============================================================
async function main() {
  console.log("🤖 多 Agent 协作演示\n");
  console.log("提示：确保已设置 ANTHROPIC_API_KEY 环境变量\n");

  await supervisorDemo();
}

main().catch(console.error);
