/**
 * 02-with-planning.ts — 带规划能力的 Agent 示例
 *
 * 本章知识点：concepts/02 - 规划（Planning）
 *
 * 本示例展示 Agent 的两种规划模式：
 *   - Plan-and-Execute：先规划，再执行（通过 systemPrompt 实现）
 *   - ReAct：边推理边行动（Claude Agent SDK 默认行为）
 *
 * ⚠️ 注意：本 SDK 没有直接的 `planningMode` 配置项。
 *   规划能力是通过 systemPrompt 提示词来实现的。
 *   这与之前虚构的 `planningMode: "plan-and-execute"` 参数不同——那是假 API。
 *
 * 💡 结构化提示词进阶：
 *   想深入学习如何写高质量的 systemPrompt 和结构化指令？
 *   请参考 what-is-skill 仓库：https://github.com/Wang-jiankai/what-is-skill
 *   那里教你如何把专家经验固化成 SOP，让 Agent 稳定执行。
 *
 * 运行方式：
 *   npm install
 *   npx ts-node examples/02-with-planning.ts
 */

import { query } from "@anthropic-ai/claude-agent-sdk";
import * as fs from "fs";

// ============================================================
// 准备工作目录
// ============================================================
function setup() {
  if (!fs.existsSync("./tmp")) {
    fs.mkdirSync("./tmp");
  }
}

function cleanup() {
  if (fs.existsSync("./tmp")) {
    fs.rmSync("./tmp", { recursive: true });
  }
}

// ============================================================
// 模式一：Plan-and-Execute（先规划，再执行）
// ============================================================
// Claude Agent SDK 没有内置 planningMode，需要通过 systemPrompt 实现。
// 我们在提示词中要求 Agent 先列出计划，再执行。
//
// 这种模式的特点：
//   1. Agent 先花时间思考完整计划
//   2. 按顺序执行每个步骤
//   3. 适合需要全局规划的长任务
// ============================================================

async function planAndExecute() {
  console.log("=== 模式一：Plan-and-Execute（先规划，再执行） ===\n");

  const task =
    "在 ./tmp 目录下创建 3 个文件：info.txt（包含项目名称和版本）、config.json（包含端口 3000）、readme.md（简单说明）。按顺序创建它们。";

  for await (const message of query({
    prompt: task,
    options: {
      allowedTools: ["Write", "Bash", "Read", "Edit"],
      cwd: process.cwd(),
      // 通过 systemPrompt 指示 Agent 先规划，再执行
      // 这是 SDK 中实现 Plan-and-Execute 的方式
      systemPrompt: `你是一个专业的软件工程师。
当收到任务时：
1. 先在脑中列出完整的执行步骤（不要输出，只是计划）
2. 然后按顺序执行每一步
3. 每完成一步，简短汇报进度

请严格按照"先计划，再执行"的顺序处理任务。`,
    },
  })) {
    console.log(message);
  }
}

// ============================================================
// 模式二：ReAct（边推理边行动）
// ============================================================
// Claude Agent SDK 的默认行为就是 ReAct 模式。
// Agent 每执行一步都会思考："我做了什么？结果如何？下一步该做什么？"
//
// 这种模式的特点：
//   1. 推理和行动交替进行
//   2. Agent 根据上一步结果动态决定下一步
//   3. 适合复杂多步骤、需要灵活应变的任务
// ============================================================

async function reactMode() {
  console.log("\n=== 模式二：ReAct（边推理边行动） ===\n");

  const task =
    "在 ./tmp 目录下创建一个 todo.txt 文件，内容为今天的待办事项（3 项），然后读取并检查内容是否正确。";

  for await (const message of query({
    prompt: task,
    options: {
      allowedTools: ["Write", "Bash", "Read", "Edit"],
      cwd: process.cwd(),
      // 不设置特殊的 systemPrompt，使用 SDK 默认的 ReAct 行为
      // Agent 会边做边想，观察结果，灵活调整
      systemPrompt: `你是一个乐于助人的助手。你会边做边思考：
先推理下一步做什么，执行后观察结果，再决定下一步。
你会自然地将推理过程（Thought）和行动（Action）交替进行。`,
    },
  })) {
    console.log(message);
  }
}

// ============================================================
// 运行示例
// ============================================================
async function main() {
  console.log("🤖 Agent 规划模式演示\n");
  console.log("提示：确保已设置 ANTHROPIC_API_KEY 环境变量\n");

  setup();

  try {
    await planAndExecute();
    await reactMode();
  } finally {
    cleanup();
  }
}

main().catch(console.error);
