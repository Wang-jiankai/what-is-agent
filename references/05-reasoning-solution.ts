/**
 * 05-reasoning-solution.ts — 练习参考答案
 *
 * 本文件包含 exercises/05-reasoning-exercise.md 的参考解答。
 * 建议先独立完成练习，再对照参考。
 */

import { query } from "@anthropic-ai/claude-agent-sdk";

// ============================================================
// 任务 1：CoT 提示词设计
// ============================================================

async function task1_cotPrompt() {
  console.log("=== 任务 1：CoT 提示词设计 ===\n");

  const cotPrompt = `你是一个专业的技术顾问。当你解决问题时，请严格遵循以下步骤：

1. 【理解问题】首先确认你完全理解了问题的核心诉求
2. 【列出步骤】将解决问题分成 3-5 个清晰的步骤
3. 【逐步推理】每一步都要写出"因为 X，所以 Y"的推理过程
4. 【验证结论】检查最终答案是否合理

请用中文回答，格式如下：
第一步：...（因为...）
第二步：...（因为...）
...
最终答案：...`;

  const problem =
    "我有一个包含 100 万条用户数据的 Excel 文件，需要找出注册时间最早的前 10 名用户。最简单的做法是什么？";

  console.log(`问题：${problem}\n`);

  console.log("使用 CoT 提示词：\n");
  for await (const message of query({
    prompt: problem,
    options: {
      allowedTools: [],
      systemPrompt: cotPrompt,
    },
  })) {
    console.log(message);
  }
}

// ============================================================
// 任务 2：对比直接回答 vs CoT
// ============================================================

async function task2_directVsCot() {
  console.log("\n=== 任务 2：直接回答 vs CoT ===\n");

  const problem =
    "某个公司在 A 城市的增长率为 20%，B 城市为 15%，C 城市为 10%。如果 A 城市有 100 个用户，B 有 80 个，C 有 60 个，哪个城市对未来增长贡献最大？";

  console.log(`问题：${problem}\n`);

  // 方式 A：直接回答
  console.log("【方式 A：直接回答】\n");
  for await (const message of query({
    prompt: problem,
    options: {
      allowedTools: [],
      systemPrompt: "你是助手，直接简洁回答问题。",
    },
  })) {
    console.log(message);
  }

  // 方式 B：CoT
  console.log("\n【方式 B：CoT 分步思考】\n");
  for await (const message of query({
    prompt: problem,
    options: {
      allowedTools: [],
      systemPrompt: `请分步思考以下问题，每一步写出推理过程：

1. 先计算每个城市的绝对增长量
2. 再判断哪个城市的增长量最大
3. 给出最终答案

格式：第一步：...第二步：...最终答案：...`,
    },
  })) {
    console.log(message);
  }
}

// ============================================================
// 任务 3：简化版 ToT 实现
// ============================================================

async function task3_totImplementation() {
  console.log("\n=== 任务 3：简化版 ToT 实现 ===\n");

  const problem = "如何减少服务器的 API 响应时间？";

  console.log(`问题：${problem}\n`);

  // Step 1: 生成多个方案
  console.log("【第一步：生成 3 个方案】");
  let solutionsText = "";
  for await (const message of query({
    prompt: `为以下问题提出 3 种不同的解决方向：

问题：${problem}

要求：
- 方案 A：从缓存角度出发
- 方案 B：从数据库优化角度出发
- 方案 C：从架构/服务拆分角度出发

每个方案给出：核心思路 + 具体做法 + 预期效果`,
    options: {
      allowedTools: [],
      systemPrompt: "你是架构专家，擅长系统性思考。",
    },
  })) {
    solutionsText += message;
  }
  console.log(solutionsText + "\n");

  // Step 2: 评估方案
  console.log("【第二步：评估方案】");
  const evaluations: string[] = [];
  const方案s = ["方案 A", "方案 B", "方案 C"];
  for (const s of 方案s) {
    let evalText = "";
    for await (const message of query({
      prompt: `评估"${s}"解决"${problem}"的效果，给出 1-10 分和简要理由：`,
      options: {
        allowedTools: [],
        systemPrompt: "你是评估专家，简洁直接。",
      },
    })) {
      evalText += message;
    }
    evaluations.push(`${s}: ${evalText}`);
    console.log(`${s}: 完成`);
  }

  // Step 3: 选择最优
  console.log("\n【第三步：选择最优并深入】");
  for await (const message of query({
    prompt: `根据评估：${evaluations.join("; ")}
问题：${problem}

请选择最优方案，并给出详细的实施步骤：`,
    options: {
      allowedTools: [],
      systemPrompt: "你是决策专家。直接给出最优方案和实施细节。",
    },
  })) {
    console.log(message);
  }
}

// ============================================================
// 主函数
// ============================================================

async function main() {
  await task1_cotPrompt();
  // await task2_directVsCot();
  // await task3_totImplementation();
}

main().catch(console.error);
