/**
 * 09-skill-solution.ts — 练习参考答案
 *
 * 本文件包含 exercises/09-skill-exercise.md 的参考解答。
 * 建议先独立完成练习，再对照参考。
 *
 * ⚠️ 本仓库的 "Skill" 均指 Agent Skills 开放标准（SKILL.md 格式）。
 */

import { query } from "@anthropic-ai/claude-agent-sdk";

// ============================================================
// 任务 1：使用 SKILL.md 进行代码审查
// ============================================================

async function task1_useSkill() {
  console.log("=== 任务 1：使用 SKILL.md 审查代码 ===\n");

  // 实际项目中从文件读取：
  // const skill = fs.readFileSync("./skills/code-review.md", "utf-8");

  const skill = `
## Code Review Skill

当用户要求审查代码时：
1. 检查正确性：逻辑是否正确？
2. 检查可读性：命名清晰吗？
3. 检查性能：有没有性能问题？
4. 检查安全性：有没有安全漏洞？

输出格式：总体评价 + 问题列表 + 改进建议
`;

  const code = `
function add(a, b) {
  return a + b;
}
`;

  console.log("使用 Skill 审查代码...\n");

  for await (const message of query({
    prompt: `请审查以下代码：\n\n${code}`,
    options: {
      allowedTools: [],
      systemPrompt: skill,
    },
  })) {
    console.log(message);
  }
}

// ============================================================
// 任务 2：为"代码翻译"设计 Skill 元数据
// ============================================================

function task2_designMetadata() {
  console.log("\n=== 任务 2：代码翻译 Skill 元数据 ===\n");

  const metadata = `
\`\`\`yaml
name: code-translator
description: 将 TypeScript/JavaScript 代码翻译成 Python，保持逻辑一致
trigger:
  - "翻译代码"
  - "转成 python"
  - "translate to python"
  - "用 python 重写"
version: 1.0.0
author: your-name@example.com
tags:
  - typescript
  - python
  - translation
\`\`\`
`;

  console.log("代码翻译 Skill 元数据：\n");
  console.log(metadata);

  console.log("\n【要点说明】");
  console.log("- name: 唯一标识，Agent 用它来识别 Skill");
  console.log("- description: 一句话说明 Skill 能做什么");
  console.log("- trigger: 用户可能说的触发词，Agent 据此判断是否调用此 Skill");
  console.log("- version: 版本号，便于管理和升级");
}

// ============================================================
// 任务 3：Skill 动态加载
// ============================================================

async function task3_dynamicLoad() {
  console.log("\n=== 任务 3：Skill 动态加载 ===\n");

  // 模拟 Skill 文件存储
  const skillFiles: Record<string, string> = {
    review: `## Code Review Skill\n当用户要求审查代码时...`,
    test: `## Unit Test Skill\n当用户要求编写测试时...`,
    api: `## API Design Skill\n当用户要求设计 API 时...`,
  };

  /**
   * 从 ./skills/ 目录动态加载 Skill
   */
  function loadSkill(skillName: string): string {
    // 实际项目中从文件系统读取
    // return fs.readFileSync(\`./skills/\${skillName}.md\`, "utf-8");
    return skillFiles[skillName] || "";
  }

  // 测试
  const task = "帮我 review 代码";
  const matched = Object.keys(skillFiles).find((key) =>
    task.toLowerCase().includes(key)
  );

  if (matched) {
    const skill = loadSkill(matched);
    console.log(\`匹配到 Skill: \${matched}\`);
    console.log(\`Skill 内容: \${skill.substring(0, 50)}...\`);
  } else {
    console.log("未匹配到任何 Skill");
  }
}

// ============================================================
// 主函数
// ============================================================

async function main() {
  await task1_useSkill();
  task2_designMetadata();
  await task3_dynamicLoad();
}

main().catch(console.error);
