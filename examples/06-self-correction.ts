/**
 * 06-self-correction.ts — Agent 自我纠正能力演示
 *
 * 本章知识点：concepts/06 - 自我纠正（Self-Correction）
 *
 * 本示例展示：
 *   - Part A：ReAct 循环——推理→行动→观察→调整
 *   - Part B：外部验证触发纠正——代码编译失败后的自我修正
 *
 * 运行方式：
 *   npm install
 *   npx ts-node examples/06-self-correction.ts
 */

import { query } from "@anthropic-ai/claude-agent-sdk";
import { execSync } from "child_process";

// ============================================================
// Part A：ReAct 循环演示
// ============================================================
// ReAct = Reasoning + Acting + Observing + Adjusting
//
// 本演示：
//   模拟一个 Agent 尝试"找一个目录下最大的文件"
//   通过 ReAct 循环，不断观察结果、调整策略，直到找到答案
// ============================================================

const REACT_PROMPT = `你是一个擅长 ReAct 循环的助手。当前任务：

**任务：找出当前目录下最大的文件**

你每次可以选择一个工具来执行。工具执行后，你会看到结果（Observe）。
然后思考结果，决定下一步怎么做，直到任务完成。

可用的工具：
- Bash("command"): 执行 shell 命令
- Read("path"): 读取文件内容
- Glob("pattern"): 查找匹配的文件

重要：
1. 每步都要先 THINK（推理），再 ACT（行动）
2. 每次 ACT 后，都要 OBSERVE（观察结果）
3. 根据 OBSERVE 决定是否 ADJUST（调整策略）
4. 不断循环，直到任务完成或确认无法完成
5. 最终输出你找到的最大文件路径和大小

请按以下格式输出：
THINK: <你的推理>
ACT: <使用的工具和参数>
---
<等待结果>
OBSERVE: <观察到的结果>
ADJUST: <是否需要调整，如何调整>
---
...继续循环...`;

async function reactDemo() {
  console.log("=== Part A：ReAct 循环 ===\n");
  console.log("任务：找出当前目录下最大的文件\n");

  let maxFile = { path: "", size: 0 };

  // 简化版 ReAct 循环
  for (let i = 0; i < 5; i++) {
    console.log(`--- 第 ${i + 1} 轮 ---`);

    const response = await new Promise<string>((resolve) => {
      let result = "";
      query({
        prompt: `当前是第 ${i + 1} 轮。

${i === 0 ? REACT_PROMPT : "请根据上一轮的结果，继续执行直到找到最大文件。"}`,
        options: {
          allowedTools: ["Bash", "Read", "Glob"],
          systemPrompt: `你是一个遵循 ReAct 循环的助手。
每次输出格式：
THINK: <你的推理>
ACT: <工具调用，JSON格式，如 {"name": "Bash", "args": {"command": "ls -la"} }
OBSERVE: <观察结果>
ADJUST: <是否需要调整策略>`,
        },
      }).subscribe({
        next(message) {
          result += message;
        },
        complete() {
          resolve(result);
        },
        error(err) {
          resolve("错误：" + err);
        },
      });
    });

    console.log(response + "\n");

    // 简单判断是否完成（通过输出内容判断）
    if (
      response.includes("最大文件") ||
      (response.includes("OBSERVE") && response.includes("完成"))
    ) {
      break;
    }
  }
}

// ============================================================
// Part B：外部验证触发纠正
// ============================================================
// 场景：让 Agent 生成一段代码，然后编译。
// 如果编译失败，根据错误信息让 Agent 自动修正。
//
// 这是实际开发中最常见的自我纠正场景。
// ============================================================

const CODE_GEN_PROMPT = `请写一个 TypeScript 函数，接受一个字符串数组，
返回每个字符串的长度。函数名叫 getLengths。
只输出代码，不要解释。`;

async function selfCorrectionDemo() {
  console.log("\n=== Part B：外部验证触发纠正 ===\n");

  // Step 1: 让 Agent 生成代码
  console.log("【第一步：生成代码】");
  let code = "";
  for await (const message of query({
    prompt: CODE_GEN_PROMPT,
    options: {
      allowedTools: [],
      systemPrompt: "你是 TypeScript 开发者，只输出代码。",
    },
  })) {
    code += message;
  }
  // 提取代码块
  const codeMatch = code.match(/```(?:typescript)?\n?([\s\S]*?)```/);
  const rawCode = codeMatch ? codeMatch[1] : code;
  console.log("生成的代码：\n" + rawCode + "\n");

  // Step 2: 尝试编译
  console.log("【第二步：编译验证】");
  try {
    // 写入临时文件
    const fs = await import("fs");
    fs.writeFileSync("/tmp/test_code.ts", rawCode);

    // 用 tsc 编译（静默模式）
    execSync("cd /tmp && npx tsc --noEmit test_code.ts 2>&1", {
      throw: true,
    });
    console.log("✓ 编译成功！\n");
  } catch (error: any) {
    const compileError = error.stdout?.toString() || error.message;
    console.log("✗ 编译失败：\n" + compileError + "\n");

    // Step 3: 根据错误，让 Agent 自我纠正
    console.log("【第三步：自我纠正】");
    let fixedCode = "";
    for await (const message of query({
      prompt: `以下 TypeScript 代码有编译错误，请修正：

原始代码：
${rawCode}

编译错误：
${compileError}

请只输出修正后的代码，不要解释。
如果错误无法修复，请说明原因。`,
      options: {
        allowedTools: [],
        systemPrompt: "你是 TypeScript 开发者，擅长修复代码错误。",
      },
    })) {
      fixedCode += message;
    }

    const fixedMatch = fixedCode.match(/```(?:typescript)?\n?([\s\S]*?)```/);
    const fixed = fixedMatch ? fixedMatch[1] : fixedCode;
    console.log("修正后的代码：\n" + fixed + "\n");

    // Step 4: 再次编译验证
    console.log("【第四步：再次验证】");
    try {
      const fs = await import("fs");
      fs.writeFileSync("/tmp/test_code_fixed.ts", fixed);
      execSync("cd /tmp && npx tsc --noEmit test_code_fixed.ts 2>&1", {
        throw: true,
      });
      console.log("✓ 修正后编译成功！\n");
    } catch (e: any) {
      const err = e.stdout?.toString() || e.message;
      console.log("仍然有错误：\n" + err + "\n");
    }
  }
}

// ============================================================
// 运行示例
// ============================================================
async function main() {
  console.log("🤖 Agent 自我纠正能力演示\n");
  console.log("提示：确保已设置 ANTHROPIC_API_KEY 环境变量\n");

  await selfCorrectionDemo();
}

main().catch(console.error);
