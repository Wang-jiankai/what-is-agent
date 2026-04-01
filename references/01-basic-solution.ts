/**
 * 01-basic-solution.ts — 第一章练习参考答案
 *
 * 对应练习：exercises/01-basic-exercise.md
 * 对应概念：concepts/01-what-is-agent.md
 */

import { Agent } from "@anthropic-ai/claude-code";

// ============================================================
// 问候工具（Act - 行动）
// ============================================================
const tools = {
  // 问候工具
  async greet(name: string, hour: number): Promise<string> {
    let greeting: string;
    if (hour >= 0 && hour < 12) {
      greeting = "早上好";
    } else if (hour >= 12 && hour < 18) {
      greeting = "下午好";
    } else {
      greeting = "晚上好";
    }
    return `${greeting}，${name}！`;
  },

  // 获取当前时间工具（进阶任务）
  async getCurrentTime(): Promise<string> {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }
};

// ============================================================
// 创建 Agent 实例
// ============================================================
const agent = new Agent({
  model: "claude-opus-4-6",
  tools,
  systemPrompt: `你是一个友好的助手，擅长根据用户的名字和时间生成合适的问候语。
你可以使用 greet(name, hour) 工具来生成问候。
你也可以使用 getCurrentTime() 工具来获取当前时间。`
});

// ============================================================
// 运行 Agent
// ============================================================
async function main() {
  console.log("=== 基础任务 ===");
  // 模拟下午 3 点，向张三打招呼
  const result1 = await agent.run(
    "请向张三打招呼，现在时间是下午 3 点"
  );
  console.log("结果:", result1);

  console.log("\n=== 进阶任务 ===");
  // Agent 自动获取当前时间后打招呼
  const result2 = await agent.run(
    "请向李四打招呼，先获取当前时间再决定说什么"
  );
  console.log("结果:", result2);
}

main().catch(console.error);

// ============================================================
// 思考题答案
// ============================================================
/**
 * 1. 在代码中，哪个部分体现了 Agent 的"感知"能力？
 *    → agent.run() 接收用户的自然语言输入，这就是感知
 *
 * 2. 如果不定义任何工具，Agent 还能正常工作吗？为什么？
 *    → 可以运行，但能力受限。Agent 只能回复知识，无法执行操作
 *
 * 3. systemPrompt 对 Agent 行为有什么影响？
 *    → 决定 Agent 的角色定位、回答风格、可调用工具的行为描述
 */
