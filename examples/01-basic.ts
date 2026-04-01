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
// 工具是 Agent 与外部世界交互的桥梁
const tools = {
  // 搜索工具：模拟网页搜索
  async search(query: string) {
    console.log(`🔍 执行搜索: "${query}"`);
    return `搜索结果：关于 "${query}" 的相关信息...`;
  },

  // 计算工具：模拟简单计算
  async calculate(expression: string) {
    console.log(`🧮 执行计算: ${expression}`);
    return eval(expression);
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
  const result1 = await agent.run(
    "北京的人口大约有多少？"
  );
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
