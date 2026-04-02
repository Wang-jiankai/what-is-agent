/**
 * 10-multi-agent-solution.ts — 练习参考答案
 *
 * 本文件包含 exercises/10-multi-agent-exercise.md 的参考解答。
 * 建议先独立完成练习，再对照参考。
 */

import { query } from "@anthropic-ai/claude-agent-sdk";

// ============================================================
// 任务 1：设计"写博客"的多 Agent 系统
// ============================================================

function task1_designBlogSystem() {
  console.log("=== 任务 1：博客撰写多 Agent 系统 ===\n");

  const design = `
┌─────────────────────────────────────────────────────────┐
│                    博客撰写系统                           │
└─────────────────────────────────────────────────────────┘

1. Supervisor（主编）
   输入：用户主题
   职责：分解任务、协调流程、最终审核
   输出：任务分解方案 + 最终博客

2. Researcher（研究员）
   输入：研究主题
   职责：收集资料、整理信息
   输出：资料整理报告

3. Writer（撰写员）
   输入：资料 + 写作要求
   职责：撰写初稿
   输出：博客初稿

4. Editor（编辑）
   输入：初稿
   职责：审核、修改、润色
   输出：最终定稿

流程：
用户 → Supervisor → Researcher ─┐
                 └→ Writer ──────→ Editor → 最终博客
`;

  console.log(design);
}

// ============================================================
// 任务 2：分析协作问题
// ============================================================

function task2_analyzeProblems() {
  console.log("\n=== 任务 2：多 Agent 协作问题分析 ===\n");

  const problems = [
    {
      scenario: "内容不一致",
      issue: "Writer 写的和 Researcher 收集的资料不符",
      solutions: [
        "Editor 在最终审核时进行一致性检查",
        "Researcher 输出结构化数据（JSON/大纲）而非自由文本",
        "Supervisor 在 Writer 和 Researcher 之间做中间对齐",
      ],
    },
    {
      scenario: "文档冲突",
      issue: "多 Agent 同时修改同一份文档",
      solutions: [
        "单一 Agent 负责单一文档（如 Writer 独管正文）",
        "使用版本控制系统，按顺序提交修改",
        "Supervisor 作为唯一写入口，其他 Agent 只提供修改建议",
      ],
    },
    {
      scenario: "某 Agent 卡住",
      issue: "处理时间过长导致系统卡住",
      solutions: [
        "每个 Agent 设置超时，超时后跳过或使用默认结果",
        "Supervisor 监控各 Agent 进度，超时则重新分配",
        "异步执行 + 结果回调，不用同步阻塞",
      ],
    },
  ];

  for (const p of problems) {
    console.log(`问题：${p.scenario}`);
    console.log(`表现：${p.issue}`);
    console.log("解决方案：");
    p.solutions.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
    console.log();
  }
}

// ============================================================
// 任务 3：两 Agent 对话
// ============================================================

async function task3_agentDebate() {
  console.log("\n=== 任务 3：两 Agent 辩论 ===\n");

  const topics = [
    "AI 是否会取代程序员？",
    "AI 编程助手是否让程序员变懒？",
  ];

  for (const topic of topics) {
    console.log(`\n【辩题】${topic}\n`);

    const systemA = `你是一个 AI 爱好者，认为 AI 对程序员有巨大帮助，能大幅提升效率，AI 不会取代程序员而是让他们升级。你说话要有说服力，用数据和案例支持你的观点。`;

    const systemB = `你是一个 AI 怀疑者，认为 AI 虽然有用，但存在很多问题，比如代码质量下降、安全隐患、过度依赖等，AI 在某些方面反而限制了程序员的发展。你说话要有批判性，提出具体的担忧和例子。`;

    // 第一轮
    console.log("【正方】");
    let responseA = "";
    for await (const message of query({
      prompt: `请就"${topic}"发表你的正方观点，200字以内。`,
      options: { allowedTools: [], systemPrompt: systemA },
    })) {
      responseA += message;
    }
    console.log(responseA);

    console.log("\n【反方】");
    let responseB = "";
    for await (const message of query({
      prompt: `对方（正方）的观点是：\n${responseA}\n\n请针对以上观点发表你的反方观点，200字以内。`,
      options: { allowedTools: [], systemPrompt: systemB },
    })) {
      responseB += message;
    }
    console.log(responseB);

    console.log("\n【总结】");
    for await (const message of query({
      prompt: `以下是关于"${topic}"的正反方辩论：

正方：${responseA}

反方：${responseB}

请作为中立主持人，总结这场辩论，并给出你的客观评价。`,
      options: {
        allowedTools: [],
        systemPrompt: "你是一个中立客观的主持人，擅长总结各方观点。",
      },
    })) {
      console.log(message);
    }
  }
}

// ============================================================
// 主函数
// ============================================================

async function main() {
  task1_designBlogSystem();
  task2_analyzeProblems();
  // await task3_agentDebate(); // 需要多次 API 调用，谨慎使用
}

main().catch(console.error);
