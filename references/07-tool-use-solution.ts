/**
 * 07-tool-use-solution.ts — 练习参考答案
 *
 * 本文件包含 exercises/07-tool-use-exercise.md 的参考解答。
 * 建议先独立完成练习，再对照参考。
 */

import { query } from "@anthropic-ai/claude-agent-sdk";
import * as fs from "fs";
import * as path from "path";

// ============================================================
// 任务 1：项目初始化流程
// ============================================================

async function task1_projectInit() {
  console.log("=== 任务 1：项目初始化 ===\n");

  const task = `
请帮我完成以下步骤：

1. 在当前目录下创建一个名为 demo_project 的目录
2. 在 demo_project 目录中创建 package.json，内容为：
   {"name": "demo", "version": "1.0.0", "type": "module"}
3. 在 demo_project 目录中创建 index.ts，内容是 console.log("Hello")
4. 读取 demo_project/package.json 确认内容正确
5. 清理：删除 demo_project 目录

请一步一步执行，每步都要汇报结果。
`.trim();

  for await (const message of query({
    prompt: task,
    options: {
      allowedTools: ["Bash", "Read", "Write", "Edit", "Glob", "Grep"],
      cwd: process.cwd(),
    },
  })) {
    console.log(message);
  }
}

// ============================================================
// 任务 2：观察 Agent 工具选择策略
// ============================================================

async function task2_observeToolSelection() {
  console.log("\n=== 任务 2：观察工具选择策略 ===\n");

  const task =
    "搜索当前目录下所有 .ts 文件，统计一共有多少行代码";

  console.log(`任务：${task}\n`);

  for await (const message of query({
    prompt: task,
    options: {
      allowedTools: ["Bash", "Read", "Write", "Edit", "Glob", "Grep"],
      cwd: process.cwd(),
    },
  })) {
    console.log(message);
  }
}

// ============================================================
// 任务 3：文件搜索 + 内容替换 ReAct 循环
// ============================================================

async function task3_fileSearchReplace() {
  console.log("\n=== 任务 3：文件搜索 + 替换循环 ===\n");

  // 自定义工具
  interface Tool {
    name: string;
    description: string;
    execute: (args: any) => Promise<string>;
  }

  const tools: Tool[] = [
    {
      name: "Glob",
      description: "搜索匹配模式的文件。参数：pattern（如 *.md）",
      execute: async ({ pattern }: { pattern: string }) => {
        // 简化实现：在指定目录搜索
        const { globSync } = await import("glob");
        try {
          const files = globSync(pattern, { cwd: process.cwd() });
          return JSON.stringify(files);
        } catch {
          return "[]";
        }
      },
    },
    {
      name: "ReadFile",
      description: "读取文件内容。参数：path",
      execute: async ({ path: p }: { path: string }) => {
        try {
          return fs.readFileSync(p, "utf-8");
        } catch (e: any) {
          return `错误：${e.message}`;
        }
      },
    },
    {
      name: "ReplaceInFile",
      description: "替换文件内容。参数：path, old, new",
      execute: async ({
        path: p,
        old: oldStr,
        new: newStr,
      }: {
        path: string;
        old: string;
        new: string;
      }) => {
        try {
          let content = fs.readFileSync(p, "utf-8");
          const count = (content.match(oldStr) || []).length;
          content = content.split(oldStr).join(newStr);
          fs.writeFileSync(p, content, "utf-8");
          return `成功替换 ${count} 处`;
        } catch (e: any) {
          return `错误：${e.message}`;
        }
      },
    },
  ];

  const task =
    "在当前目录下所有 .md 文件中，把'AI'替换成'人工智能'";
  const TOOL_LIST = tools.map((t) => `- ${t.name}: ${t.description}`).join("\n");

  console.log(`任务：${task}\n`);
  console.log(`可用工具：\n${TOOL_LIST}\n`);

  let step = 0;
  while (step < 10) {
    step++;
    console.log(`--- 第 ${step} 轮 ---`);

    let result = "";
    for await (const message of query({
      prompt: `任务：${task}

可用工具：
${TOOL_LIST}

每次用 ACTION 调用一个工具，或者 FINAL 结束。`,
      options: {
        allowedTools: [],
        systemPrompt: "你是工具调用助手。",
      },
    })) {
      result += message;
    }
    const response = result;

    console.log(response);

    if (response.includes("FINAL")) break;

    const match = response.match(/ACTION:\s*(\{[\s\S]*?\})/i);
    if (match) {
      try {
        const call = JSON.parse(match[1]);
        console.log(`\n>>> 执行: ${call.name}`, call.args);
        const tool = tools.find((t) => t.name === call.name);
        if (tool) {
          const r = await tool.execute(call.args);
          console.log(`<<< 结果: ${r}`);
        }
      } catch (e: any) {
        console.log(`<<< 错误: ${e.message}`);
      }
    }
    console.log();
  }
}

// ============================================================
// 主函数
// ============================================================

async function main() {
  await task1_projectInit();
  // await task2_observeToolSelection();
  // await task3_fileSearchReplace();
}

main().catch(console.error);
