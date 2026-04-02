/**
 * 04-reflection.ts — Agent 反思能力演示
 *
 * 本章知识点：concepts/04 - 反思（Reflection）
 *
 * 本示例展示：
 *   - Part A：双角色循环——执行者 + 评审者
 *   - Part B：带 CRITIC 框架的结构化反思
 *
 * 运行方式：
 *   npm install
 *   npx ts-node examples/04-reflection.ts
 */

import { query } from "@anthropic-ai/claude-agent-sdk";

// ============================================================
// Part A：双角色循环（执行者 → 评审者 → 修正者）
// ============================================================
// 核心思想：
//   1. 执行者（Generator）根据任务生成初稿
//   2. 评审者（Reviewer）检查初稿的问题
//   3. 修正者（Reviser）根据评审意见改进
// ============================================================

/** 执行者：根据任务生成初稿 */
async function generate(task: string, systemPrompt: string): Promise<string> {
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
  return result.trim();
}

/** 评审者：检查初稿的问题 */
async function review(
  content: string,
  task: string,
  framework: string
): Promise<string> {
  let result = "";
  for await (const message of query({
    prompt: `请检查以下内容相对于原始任务的问题。

原始任务：${task}

待审查内容：
${content}

使用以下反思框架进行检查：
${framework}

请列出具体问题，不要只说"看起来不错"。`,
    options: {
      allowedTools: [],
      systemPrompt:
        "你是严格的技术评审专家。你会深入检查内容的正确性、完整性和逻辑性。你会明确指出问题，而不是敷衍地说"没问题"。",
    },
  })) {
    result += message;
  }
  return result.trim();
}

/** 修正者：根据评审意见改进 */
async function revise(
  original: string,
  reviewFeedback: string,
  task: string
): Promise<string> {
  let result = "";
  for await (const message of query({
    prompt: `请根据评审意见改进以下内容。

原始任务：${task}

原始内容：
${original}

评审意见：
${reviewFeedback}

请输出一版改进后的内容。`,
    options: {
      allowedTools: [],
      systemPrompt:
        "你是专业的内容改进专家。你会认真采纳评审意见，对每条问题进行针对性改进。",
    },
  })) {
    result += message;
  }
  return result.trim();
}

async function dualRoleDemo() {
  console.log("=== Part A：双角色循环 ===\n");

  const task =
    "用 TypeScript 写一个函数，计算斐波那契数列的第 N 项";

  const generatorPrompt =
    "你是一个专业的 TypeScript 开发者。请为用户生成代码，只输出代码，不要解释。";

  console.log(`【任务】${task}\n`);

  // 第一轮：生成初稿
  console.log("【生成者】生成初稿...");
  const draft1 = await generate(task, generatorPrompt);
  console.log("初稿：\n" + draft1.substring(0, 200) + "...\n");

  // 第一轮：评审
  console.log("【评审者】评审初稿...");
  const feedback1 = await review(draft1, task, "检查：1) 正确性 2) 边界处理 3) 代码风格");
  console.log("评审意见：\n" + feedback1 + "\n");

  // 第一轮：修正
  console.log("【修正者】根据意见改进...");
  const revised1 = await revise(draft1, feedback1, task);
  console.log("改进版：\n" + revised1.substring(0, 200) + "...\n");

  // 可以多轮迭代：修正后再评审，再修正
  console.log("【第二轮评审】检查改进版...");
  const feedback2 = await review(revised1, task, "检查：还有遗留问题吗？");
  console.log("二次评审：\n" + feedback2 + "\n");
}

// ============================================================
// Part B：CRITIC 框架结构化反思
// ============================================================
// 使用 CRITIC 框架进行系统性反思：
//   C - Correctness（正确性）
//   R - Relevance（相关性）
//   I - Completeness（完整性）
//   T - Truthfulness（真实性）
//   I - Insight（洞察）
//   C - Coherence（连贯性）
// ============================================================

const CRITIC_FRAMEWORK = `
请使用 CRITIC 框架对内容进行结构化反思，对每个维度给出评价（✓ 通过 / ⚠️ 需改进 / ✗ 错误）：

C - Correctness（正确性）：
  - 事实是否正确？逻辑是否成立？

R - Relevance（相关性）：
  - 内容是否回应了用户的核心问题？

I - Completeness（完整性）：
  - 是否遗漏了重要的方面？

T - Truthfulness（真实性）：
  - 是否有编造的信息或无法验证的断言？

I - Insight（洞察）：
  - 是否提供了有价值的深层分析？

C - Coherence（连贯性）：
  - 结构是否清晰？逻辑是否通顺？
`;

async function criticFrameworkDemo() {
  console.log("\n=== Part B：CRITIC 框架结构化反思 ===\n");

  const content = `
React 的虚拟 DOM 是一个轻量级的 JavaScript 对象，它代表了真实 DOM 的结构。
当状态变化时，React 会创建新的虚拟 DOM 树，通过对比（diff）找出变化的部分，
然后只更新真实 DOM 中变化的部分，这就是所谓的"DOM diffing"算法。
这个机制让 React 能够高效地更新页面。
  `.trim();

  console.log("【待反思内容】");
  console.log(content + "\n");

  console.log("【使用 CRITIC 框架反思】\n");
  let reflection = "";
  for await (const message of query({
    prompt: `请使用以下 CRITIC 框架反思这段关于 React 虚拟 DOM 的描述：

${content}

${CRITIC_FRAMEWORK}`,
    options: {
      allowedTools: [],
      systemPrompt:
        "你是严格的技术评审专家。用 CRITIC 框架进行深度反思。",
    },
  })) {
    reflection += message;
  }
  console.log(reflection);

  // 根据反思结果，生成改进版
  console.log("\n【生成改进版】");
  let improved = "";
  for await (const message of query({
    prompt: `请根据以上反思意见，输出一版改进后的 React 虚拟 DOM 描述：

原始内容：
${content}

反思意见：
${reflection}

改进后的内容：
  `.trim(),
    options: {
      allowedTools: [],
      systemPrompt: "你是 React 技术专家，擅长清晰准确地解释概念。",
    },
  })) {
    improved += message;
  }
  console.log(improved);
}

// ============================================================
// 运行示例
// ============================================================
async function main() {
  console.log("🤖 Agent 反思能力演示\n");
  console.log("提示：确保已设置 ANTHROPIC_API_KEY 环境变量\n");

  await dualRoleDemo();

  console.log("\n" + "=".repeat(50) + "\n");

  await criticFrameworkDemo();
}

main().catch(console.error);
