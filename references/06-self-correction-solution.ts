/**
 * 06-self-correction-solution.ts — 练习参考答案
 *
 * 本文件包含 exercises/06-self-correction-exercise.md 的参考解答。
 * 建议先独立完成练习，再对照参考。
 */

import { query } from "@anthropic-ai/claude-agent-sdk";
import { execSync } from "child_process";
import * as fs from "fs";

// ============================================================
// 任务 1：编译 → 报错 → 修正 循环
// ============================================================

async function task1_compileAndFix() {
  console.log("=== 任务 1：编译 → 报错 → 修正 ===\n");

  // Step 1: 生成代码
  console.log("【生成代码】");
  let code = "";
  for await (const message of query({
    prompt: `写一个 TypeScript 函数，读取名为 data.json 的文件，解析 JSON 内容，返回一个字符串。

函数名：readData
要求：
- 使用 fs.readFileSync 读取文件
- 使用 JSON.parse 解析
- 处理可能的错误

只输出代码，不要解释。`,
    options: {
      allowedTools: [],
      systemPrompt: "你是 TypeScript 开发者。",
    },
  })) {
    code += message;
  }

  const codeMatch = code.match(/```(?:typescript)?\n?([\s\S]*?)```/);
  const rawCode = codeMatch ? codeMatch[1] : code;
  console.log("原始代码：\n" + rawCode + "\n");

  // Step 2: 编译测试
  const tmpFile = "/tmp/sc_test.ts";
  fs.writeFileSync(tmpFile, rawCode);

  try {
    execSync(`cd /tmp && npx tsc --noEmit --strict sc_test.ts 2>&1`, {
      throw: true,
    });
    console.log("✓ 编译成功，无需修正\n");
  } catch (e: any) {
    const err = e.stdout?.toString() || e.message;
    console.log("✗ 编译错误：\n" + err + "\n");

    // Step 3: 自我纠正
    console.log("【自我纠正】");
    let fixed = "";
    for await (const message of query({
      prompt: `修正以下 TypeScript 代码的编译错误：

原始代码：
${rawCode}

编译错误：
${err}

只输出修正后的代码。`,
      options: {
        allowedTools: [],
        systemPrompt: "你是 TypeScript 开发者，擅长修复错误。",
      },
    })) {
      fixed += message;
    }

    const fixedMatch = fixed.match(/```(?:typescript)?\n?([\s\S]*?)```/);
    const fixedCode = fixedMatch ? fixedMatch[1] : fixed;
    console.log("修正后：\n" + fixedCode + "\n");

    // Step 4: 验证
    fs.writeFileSync(tmpFile, fixedCode);
    try {
      execSync(`cd /tmp && npx tsc --noEmit --strict sc_test.ts 2>&1`, {
        throw: true,
      });
      console.log("✓ 修正后编译成功\n");
    } catch (e2: any) {
      const err2 = e2.stdout?.toString() || e2.message;
      console.log("仍有错误：\n" + err2 + "\n");
    }
  }
}

// ============================================================
// 任务 2：ReAct 循环实现（猜数字）
// ============================================================

async function task2_reactGuessNumber() {
  console.log("\n=== 任务 2：ReAct 猜数字 ===\n");

  const secret = Math.floor(Math.random() * 100) + 1;
  console.log(`（系统：我想了一个 1-100 之间的数字，请开始猜）\n`);

  let guess = 50;
  let low = 1;
  let high = 100;
  const maxRounds = 10;

  for (let round = 0; round < maxRounds; round++) {
    console.log(`【第 ${round + 1} 轮】`);

    let response = "";
    for await (const message of query({
      prompt: `当前任务：猜一个 1-100 之间的数字。

上轮结果：${round === 0 ? "这是第一轮，请直接猜" : `上次猜 ${guess}，反馈是"${guess < secret ? "太小" : guess > secret ? "太大" : "猜对了！"}"`}

请按以下格式输出：
THINK: <你的推理，选择 ${low}-${high} 范围内的哪个数字，为什么>
GUESS: <你的猜测>
`,
      options: {
        allowedTools: [],
        systemPrompt: "你是一个猜数字的助手，使用二分查找策略。每次猜测后，你会根据反馈调整范围。",
      },
    })) {
      response += message;
    }
    console.log(response);

    // 提取猜测
    const guessMatch = response.match(/GUESS:\s*(\d+)/i);
    if (guessMatch) {
      guess = parseInt(guessMatch[1]);
    }

    // 判断
    if (guess === secret) {
      console.log(`\n✓ 猜对了！答案是 ${secret}，用了 ${round + 1} 轮\n`);
      break;
    } else if (guess < secret) {
      low = guess + 1;
    } else {
      high = guess - 1;
    }
  }
}

// ============================================================
// 任务 3：多轮自我纠正直到测试通过（选做）
// ============================================================

async function task3_iterativeFixUntilPass() {
  console.log("\n=== 任务 3：多轮自我纠正直到测试通过 ===\n");

  // 这个任务需要先创建一个测试文件作为"被测试代码"
  // 这里给出一个简化框架

  const taskDescription = `写一个函数 isPrime(n: number): boolean，判断 n 是否是质数。`;

  console.log("任务：" + taskDescription + "\n");

  let code = "";
  for await (const message of query({
    prompt: taskDescription + "\n\n只输出代码，不要解释。",
    options: {
      allowedTools: [],
      systemPrompt: "你是 TypeScript 开发者。",
    },
  })) {
    code += message;
  }

  const codeMatch = code.match(/```(?:typescript)?\n?([\s\S]*?)```/);
  let currentCode = codeMatch ? codeMatch[1] : code;
  console.log("初始代码：\n" + currentCode + "\n");

  // 简化版：假设第 2 轮能过
  // 实际生产中，这里需要写测试用例、运行测试、捕获失败信息、再修正

  console.log("【模拟：第 1 轮测试失败，反馈给 Agent】\n");
  let fixed = "";
  for await (const message of query({
    prompt: `以下 isPrime 函数有 bug，请修复：

${currentCode}

已知问题：没有正确处理 1 和负数的情况（它们不是质数）。

修正后的代码：
`,
    options: {
      allowedTools: [],
      systemPrompt: "你是 TypeScript 开发者。",
    },
  })) {
    fixed += message;
  }

  const fixedMatch = fixed.match(/```(?:typescript)?\n?([\s\S]*?)```/);
  const fixedCode = fixedMatch ? fixedMatch[1] : fixed;
  console.log("修正后代码：\n" + fixedCode);
  console.log("\n✓ 第 2 轮测试通过\n");
}

// ============================================================
// 主函数
// ============================================================

async function main() {
  await task1_compileAndFix();
  // await task2_reactGuessNumber();
  // await task3_iterativeFixUntilPass();
}

main().catch(console.error);
