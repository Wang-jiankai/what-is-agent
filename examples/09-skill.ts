/**
 * 09-skill.ts — Agent Skill 调用演示
 *
 * 本章知识点：concepts/09 - Skill 调用
 *
 * 本示例展示：
 *   - Part A：如何读取 SKILL.md 并注入 systemPrompt
 *   - Part B：模拟一个 Skill 动态加载的流程
 *
 * 运行方式：
 *   npm install
 *   npx ts-node examples/09-skill.ts
 */

import { query } from "@anthropic-ai/claude-agent-sdk";
import * as fs from "fs";

// ============================================================
// Part A：读取 SKILL.md 文件并注入 systemPrompt
// ============================================================
// 实际项目中，SKILL.md 文件来自 what-is-skill 仓库或团队共享的 Skill 库。
// 这里用一个内嵌的 Skill 字符串模拟文件读取。
// ============================================================

const CODE_REVIEW_SKILL = `## Code Review Skill

当用户要求审查代码时，请按以下步骤进行：

### 审查维度

1. **正确性**：逻辑是否正确？边界情况处理了吗？
2. **可读性**：命名清晰吗？注释到位吗？
3. **性能**：有没有明显的性能问题？
4. **安全性**：有没有安全漏洞？

### 输出格式

每次代码审查必须包含：
- 总体评价（1-5 星）
- 具体问题列表（问题描述 + 位置 + 建议）
- 总结和优先级建议（高/中/低）

### 注意事项

- 如果代码看起来完全没问题，也要给出"整体评价良好"的反馈
- 不要过度挑剔，聚焦于真正影响功能的问题
- 优先指出会导致 bug 或安全问题的问题`;

async function skillLoadingDemo() {
  console.log("=== Part A：Skill 调用演示 ===\n");

  // 实际项目中从文件读取：
  // const skill = fs.readFileSync("./skills/code-review.md", "utf-8");

  const code = `
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n-1) + fibonacci(n-2);
}
`;

  console.log("【代码】");
  console.log(code);
  console.log("\n【使用 Skill 审查代码】\n");

  for await (const message of query({
    prompt: `请审查以下代码：\n\n${code}`,
    options: {
      allowedTools: [],
      systemPrompt: CODE_REVIEW_SKILL,
    },
  })) {
    console.log(message);
  }
}

// ============================================================
// Part B：动态 Skill 选择
// ============================================================
// 根据用户输入自动选择合适的 Skill
// ============================================================

const SKILLS: Record<string, string> = {
  "review": `## Code Review Skill ...
（完整内容同上）`,

  "test": `## Unit Test Skill

当用户要求编写测试时：
1. 先理解被测代码的功能
2. 设计测试用例（正常路径 + 边界情况）
3. 编写可运行的测试代码
4. 确保测试覆盖关键路径`,

  "api": `## API Design Skill

当用户要求设计 API 时：
1. 明确 API 的使用场景和用户
2. 选择合适的 HTTP 方法和状态码
3. 设计清晰的 endpoint 和参数
4. 考虑错误处理和版本管理`,
};

function matchSkill(prompt: string): string | null {
  const lower = prompt.toLowerCase();
  if (lower.includes("review") || lower.includes("审查")) return "review";
  if (lower.includes("test") || lower.includes("测试")) return "test";
  if (lower.includes("api") || lower.includes("接口")) return "api";
  return null;
}

async function dynamicSkillDemo() {
  console.log("\n=== Part B：动态 Skill 选择 ===\n");

  const tasks = [
    "帮我 review 这段代码",
    "帮我写测试用例",
    "设计一个用户登录的 API",
  ];

  for (const task of tasks) {
    console.log(`\n【任务】${task}`);
    const skillKey = matchSkill(task);
    if (skillKey && SKILLS[skillKey]) {
      console.log(`匹配到 Skill：${skillKey}`);
      console.log(`（实际使用时从 ./skills/${skillKey}.md 读取）`);
    } else {
      console.log("未匹配到特定 Skill，使用通用系统提示");
    }
  }
}

// ============================================================
// 运行示例
// ============================================================
async function main() {
  console.log("🤖 Agent Skill 调用演示\n");
  console.log("提示：确保已设置 ANTHROPIC_API_KEY 环境变量\n");

  await skillLoadingDemo();

  console.log("\n" + "=".repeat(50) + "\n");

  await dynamicSkillDemo();

  console.log("\n\n--- Skill 详细格式请参考 what-is-skill 仓库 ---");
}

main().catch(console.error);
