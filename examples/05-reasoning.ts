/**
 * 05-reasoning.ts — Agent 推理能力演示
 *
 * 本章知识点：concepts/05 - 推理（Reasoning）
 *
 * 本示例展示：
 *   - Part A：CoT（思维链）——显式展示推理步骤
 *   - Part B：ToT（思维树）——多路径探索与选择
 *
 * 运行方式：
 *   npm install
 *   npx ts-node examples/05-reasoning.ts
 */

import { query } from "@anthropic-ai/claude-agent-sdk";

// ============================================================
// Part A：CoT（思维链）——显式推理步骤
// ============================================================
// CoT 的核心是"不要直接给答案，先说出思考过程"。
// 这不是魔法，而是通过 systemPrompt 来引导 LLM 展示推理步骤。
// ============================================================

const COT_PROMPT = `你是一个擅长逐步推理的助手。当你解决问题时：

1. 先理解问题的核心是什么
2. 列出解决这个问题的关键步骤
3. 按步骤执行，每步都要写出"因为...所以..."
4. 最后给出答案

请用中文回答，每一步都要清晰标号。`;

async function chainOfThoughtDemo() {
  console.log("=== Part A：CoT（思维链）演示 ===\n");

  const problems = [
    {
      task: "一个水池有进水管和出水管。进水管 2 小时注满，出水管 3 小时排空。如果两个管同时打开，需要多少小时注满？",
      label: "水池问题",
    },
    {
      task: "小王比小李大 3 岁，小李比小张 大 2 岁。三人年龄之和是 30 岁。小王多少岁？",
      label: "年龄问题",
    },
  ];

  for (const { task, label } of problems) {
    console.log(`【${label}】`);
    console.log(`问题：${task}\n`);

    for await (const message of query({
      prompt: task,
      options: {
        allowedTools: [],
        systemPrompt: COT_PROMPT,
      },
    })) {
      console.log(message);
    }
    console.log("\n" + "-".repeat(40) + "\n");
  }
}

// ============================================================
// Part B：ToT（思维树）——多路径探索
// ============================================================
// ToT 的核心：一个问题，探索多条解决路径，评估后选择最优。
//
// 实现方式（简化版，不依赖外部框架）：
//   1. 让 LLM 提出 N 个可能的方案/思路
//   2. 对每个方案进行评估（优点/缺点/可行性）
//   3. 根据评估结果选择最优方案
//   4. 执行选定的方案
//
// 注意：这是简化版演示。生产环境可用专门的 ToT 框架。
// ============================================================

const TOT_GENERATE_PROMPT = `请为以下问题提出 3 种不同的解决思路/方案。

问题：{problem}

要求：
- 每个方案要有不同的出发点和思路
- 不要只给最终答案，要描述解决路径
- 方案之间要有明显区别

请用以下格式回答：

方案 A：{描述}
方案 B：{描述}
方案 C：{描述}`;

const TOT_EVALUATE_PROMPT = `请评估以下方案解决这个问题的优劣：

问题：{problem}

方案：{solution}

请从以下维度评估：
1. 正确性：这个方案能正确解决问题吗？
2. 效率：时间和资源消耗如何？
3. 可行性：实现难度如何？
4. 风险：有什么潜在问题？

最后给出 1-10 的综合评分。`;

const TOT_DECIDE_PROMPT = `根据以下评估结果，哪个方案最合适？为什么？

评估结果：
{evaluations}

请直接给出最优方案编号（A/B/C）和理由。`;

async function treeOfThoughtDemo() {
  console.log("=== Part B：ToT（思维树）演示 ===\n");

  const problem =
    "我需要给一个不熟悉技术的老板介绍什么是'大语言模型'，如何在 5 分钟内让他理解核心概念并产生兴趣？";

  console.log(`【问题】${problem}\n`);

  // Step 1: 生成 3 个方案
  console.log("【第一步：生成方案】");
  let solutionsText = "";
  for await (const message of query({
    prompt: TOT_GENERATE_PROMPT.replace("{problem}", problem),
    options: {
      allowedTools: [],
      systemPrompt: "你是一个擅长创意思考的策划专家。",
    },
  })) {
    solutionsText += message;
  }
  console.log(solutionsText + "\n");

  // 解析方案
  const solutions = extractSolutions(solutionsText);

  // Step 2: 评估每个方案
  console.log("【第二步：评估方案】\n");
  const evaluations: string[] = [];

  for (const [name, solution] of Object.entries(solutions)) {
    console.log(`评估 ${name}...`);
    let evalText = "";
    for await (const message of query({
      prompt: TOT_EVALUATE_PROMPT.replace("{problem}", problem).replace(
        "{solution}",
        solution
      ),
      options: {
        allowedTools: [],
        systemPrompt: "你是一个严格的项目评估专家。",
      },
    })) {
      evalText += message;
    }
    evaluations.push(`${name}：\n${evalText}`);
    console.log(`${name} 完成\n`);
  }

  // Step 3: 选择最优方案
  console.log("【第三步：选择最优】\n");
  let decision = "";
  for await (const message of query({
    prompt: TOT_DECIDE_PROMPT.replace("{evaluations}", evaluations.join("\n\n")),
    options: {
      allowedTools: [],
      systemPrompt: "你是一个果断的决策者，会基于证据做出选择。",
    },
  })) {
    decision += message;
  }
  console.log(decision);
}

/** 从 LLM 输出中解析出方案列表（简单版） */
function extractSolutions(text: string): Record<string, string> {
  const solutions: Record<string, string> = {};
  const matches = text.matchAll(/(方案[ABC])[：:]\s*([\s\S]*?)(?=方案[ABC]|$)/gi);
  for (const match of matches) {
    solutions[match[1]] = match[2].trim();
  }
  return solutions;
}

// ============================================================
// 运行示例
// ============================================================
async function main() {
  console.log("🤖 Agent 推理能力演示\n");
  console.log("提示：确保已设置 ANTHROPIC_API_KEY 环境变量\n");

  await chainOfThoughtDemo();

  console.log("=".repeat(50) + "\n");

  await treeOfThoughtDemo();
}

main().catch(console.error);
