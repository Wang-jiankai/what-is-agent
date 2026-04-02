/**
 * 04-reflection-solution.ts — 练习参考答案
 *
 * 本文件包含 exercises/04-reflection-exercise.md 的参考解答。
 * 建议先独立完成练习，再对照参考。
 */

import { query } from "@anthropic-ai/claude-agent-sdk";

// ============================================================
// 任务 1：生成 → 反思 → 修正 循环
// ============================================================

async function task1_reflectionLoop() {
  console.log("=== 任务 1：回文函数的反思循环 ===\n");

  const task = "写一个 TypeScript 函数，判断字符串是否是回文";

  /** 生成者 */
  async function generate(task: string): Promise<string> {
    let result = "";
    for await (const message of query({
      prompt: task,
      options: {
        allowedTools: [],
        systemPrompt: "你是 TypeScript 开发者。只输出代码，不要解释。",
      },
    })) {
      result += message;
    }
    return result.trim();
  }

  /** 评审者 */
  async function review(content: string, task: string): Promise<string> {
    let result = "";
    for await (const message of query({
      prompt: `审查以下代码是否正确完成任务：${task}

代码：
${content}

请检查：
1. 核心逻辑是否正确？
2. 边界情况是否处理？（空字符串、单字符、大小写、包含空格/标点）
3. 代码风格是否良好？

列出发现的问题，如果都OK则说"通过"。`,
      options: {
        allowedTools: [],
        systemPrompt: "你是严格的代码评审员。",
      },
    })) {
      result += message;
    }
    return result.trim();
  }

  /** 修正者 */
  async function revise(
    original: string,
    feedback: string,
    task: string
  ): Promise<string> {
    let result = "";
    for await (const message of query({
      prompt: `原始任务：${task}

原始代码：
${original}

评审意见：
${feedback}

请根据评审意见修正代码，只输出代码。`,
      options: {
        allowedTools: [],
        systemPrompt: "你是 TypeScript 开发者，擅长修复代码问题。",
      },
    })) {
      result += message;
    }
    return result.trim();
  }

  // 第一轮
  console.log("【生成者】生成初稿...\n");
  const draft1 = await generate(task);
  console.log(draft1 + "\n");

  console.log("【评审者】检查...\n");
  const feedback1 = await review(draft1, task);
  console.log(feedback1 + "\n");

  // 第二轮
  console.log("【修正者】根据意见改进...\n");
  const draft2 = await revise(draft1, feedback1, task);
  console.log(draft2 + "\n");

  console.log("【评审者】二次检查...\n");
  const feedback2 = await review(draft2, task);
  console.log(feedback2);
}

// ============================================================
// 任务 2：CRITIC 框架评审
// ============================================================

async function task2_criticFramework() {
  console.log("\n=== 任务 2：CRITIC 框架评审 ===\n");

  const domain = "TypeScript 类型守卫（Type Guards）";
  const content = `TypeScript 的类型守卫是一种用来缩小变量类型范围的函数。
它返回布尔值，可以帮助我们在运行时检查一个值的类型。
常见的类型守卫有 typeof、instanceof 和 in 操作符。
使用类型守卫可以让我们更安全地处理联合类型。`;

  const criticFramework = `
请用以下 CRITIC 框架评审内容：

C - Correctness：正确吗？
R - Relevance：回应了核心问题吗？
I - Completeness：完整吗？
T - Truthfulness：没有编造信息吗？
I - Insight：有深层洞察吗？
C - Coherence：逻辑通顺吗？
`;

  console.log(`【领域】${domain}`);
  console.log(`【内容】${content}\n`);

  let reflection = "";
  for await (const message of query({
    prompt: `评审以下内容：

${content}

${criticFramework}`,
    options: {
      allowedTools: [],
      systemPrompt: "你是严格的技术评审专家。",
    },
  })) {
    reflection += message;
  }
  console.log("【CRITIC 反思】\n" + reflection + "\n");

  // 生成改进版
  let improved = "";
  for await (const message of query({
    prompt: `原始内容：
${content}

反思意见：
${reflection}

请输出一版改进后的内容：`,
    options: {
      allowedTools: [],
      systemPrompt: "你是 TypeScript 技术专家。",
    },
  })) {
    improved += message;
  }
  console.log("【改进版】\n" + improved);
}

// ============================================================
// 任务 3：多轮迭代直到通过（选做）
// ============================================================

async function task3_iterativeRefinement() {
  console.log("\n=== 任务 3：多轮迭代直到通过 ===\n");

  const task = "用 100 字介绍什么是闭包（Closure）";
  const MAX_ROUNDS = 5;

  async function generate(task: string): Promise<string> {
    let result = "";
    for await (const message of query({
      prompt: task,
      options: {
        allowedTools: [],
        systemPrompt: "你是编程教师。只输出内容，不要说其他话。",
      },
    })) {
      result += message;
    }
    return result.trim();
  }

  async function review(
    content: string,
    task: string
  ): Promise<{ pass: boolean; feedback: string }> {
    let result = "";
    for await (const message of query({
      prompt: `任务：${task}

内容：
${content}

请判断内容是否：
1. 准确描述了概念
2. 有实际代码示例
3. 语言清晰易懂

如果三点都满足，说"通过"。否则列出具体问题。`,
      options: {
        allowedTools: [],
        systemPrompt: "你是严格的评审员。",
      },
    })) {
      result += message;
    }
    const pass = result.includes("通过");
    return { pass, feedback: result };
  }

  async function revise(
    original: string,
    feedback: string,
    task: string
  ): Promise<string> {
    let result = "";
    for await (const message of query({
      prompt: `任务：${task}

原内容：
${original}

评审意见：
${feedback}

请根据意见改进：`,
      options: {
        allowedTools: [],
        systemPrompt: "你是编程教师，擅长改进解释。",
      },
    })) {
      result += message;
    }
    return result.trim();
  }

  let content = await generate(task);
  let round = 0;

  while (round < MAX_ROUNDS) {
    round++;
    console.log(`【第 ${round} 轮】`);
    console.log("内容：" + content.substring(0, 50) + "...\n");

    const { pass, feedback } = await review(content, task);
    console.log("评审：" + feedback + "\n");

    if (pass) {
      console.log(`✓ 第 ${round} 轮通过！`);
      break;
    }

    if (round < MAX_ROUNDS) {
      content = await revise(content, feedback, task);
    }
  }
}

// ============================================================
// 主函数
// ============================================================

async function main() {
  await task1_reflectionLoop();
  // await task2_criticFramework();
  // await task3_iterativeRefinement();
}

main().catch(console.error);
