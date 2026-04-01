/**
 * 01-basic.ts — Agent 基础示例
 *
 * 本章知识点：concepts/01 - 什么是 Agent？
 * 本示例展示一个最简单的 Agent 具备的四个核心要素：
 *   - 感知（接收用户输入）
 *   - 思考（LLM 推理）
 *   - 行动（调用工具）
 *   - 反馈（根据结果调整）
 */

import { Agent } from "@anthropic-ai/claude-code";

// ============================================================
// 步骤 1：定义工具（Act - 行动）
// ============================================================
// 注意：以下工具均为【模拟实现】，仅供学习理解 Agent 工具调用机制
// 真实项目中请使用真实的搜索 API、计算库等

const tools = {
  // 搜索工具：模拟网页搜索（占位实现，非真实搜索）
  async search(query: string) {
    console.log(`🔍 执行搜索: "${query}"`);
    // ⚠️ 占位实现 —— 这里返回的是假数据
    // 真实场景应调用 Google Search API、Bing API 等
    return `搜索结果：关于 "${query}" 的相关信息...`;
  },

  // 计算工具：使用 Function 替代 eval()，避免 eval() 安全风险
  // ⚠️ 注意：此实现仅适用于简单数学表达式，教学演示用
  //        真实环境请使用专门的数学表达式解析库（如 mathjs）
  async calculate(expression: string) {
    console.log(`🧮 执行计算: ${expression}`);
    try {
      // 使用 Function 构造器比直接 eval() 稍安全（不访问局部作用域）
      // 但仍然是【教学演示用途】，生产环境禁止使用
      const safeEval = new Function(`return (${expression})`);
      return safeEval();
    } catch {
      return "计算表达式格式错误";
    }
  }
};

// ============================================================
// 步骤 2：创建 Agent 实例（感知 + 思考）
// ============================================================
const agent = new Agent({
  model: "claude-opus-4-6",
  tools,
  systemPrompt: `你是一个乐于助人的 AI 助手。
当你收到用户问题时，可以通过工具来帮助你回答。
Available tools: search, calculate。`
});

// ============================================================
// 步骤 3：运行 Agent（反馈循环）
// ============================================================
async function main() {
  console.log("🤖 Agent 启动...\n");

  // 问题 1：需要搜索信息
  const result1 = await agent.run("北京的人口大约有多少？");
  console.log("\n📤 Agent 回答:", result1);

  // 问题 2：需要计算
  const result2 = await agent.run(
    "如果我有 15 个苹果，送给朋友 7 个，还剩多少？"
  );
  console.log("\n📤 Agent 回答:", result2);

  // 问题 3：组合问题
  const result3 = await agent.run(
    "世界上最长的河流是哪个？它的长度大约是多少公里？"
  );
  console.log("\n📤 Agent 回答:", result3);
}

main().catch(console.error);
