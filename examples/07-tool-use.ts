/**
 * 07-tool-use.ts — Agent 工具调用演示
 *
 * 本章知识点：concepts/07 - 工具调用（Tool Use）
 *
 * 本示例展示：
 *   - Part A：Claude Agent SDK 内置工具的使用
 *   - Part B：自定义工具调用的 ReAct 循环（手动处理）
 *
 * 运行方式：
 *   npm install
 *   npx ts-node examples/07-tool-use.ts
 */

import { query } from "@anthropic-ai/claude-agent-sdk";
import * as fs from "fs";
import * as path from "path";

// ============================================================
// Part A：使用 Claude Agent SDK 内置工具
// ============================================================
// Claude Agent SDK 的 allowedTools 参数接受内置工具名称数组。
// Agent 会根据任务自动决定调用哪个工具。
// ============================================================

async function builtinToolsDemo() {
  console.log("=== Part A：内置工具调用 ===\n");

  const task =
    "请帮我完成以下任务：\n" +
    "1. 在当前目录下创建一个名为 demo.txt 的文件，内容为'Hello from Agent'\n" +
    "2. 读取这个文件，确认内容正确\n" +
    "3. 列出当前目录下的所有文件\n" +
    "4. 最后删除 demo.txt";

  console.log(`任务：${task}\n`);

  for await (const message of query({
    prompt: task,
    options: {
      // 允许使用这些内置工具
      allowedTools: ["Bash", "Read", "Write", "Edit", "Glob", "Grep"],
      cwd: process.cwd(),
    },
  })) {
    console.log(message);
  }
}

// ============================================================
// Part B：手动实现工具调用的 ReAct 循环
// ============================================================
// Claude Agent SDK 的内置工具很好用，但如果需要自定义工具逻辑，
// 可以自己实现一个 ReAct 循环，手动处理工具调用。
//
// 本示例演示如何自己实现一个简单的工具调用循环，
// 其中 Agent 负责推理"该用什么工具"，我们负责"执行工具并返回结果"。
// ============================================================

interface Tool {
  name: string;
  description: string;
  execute: (args: any) => Promise<string>;
}

interface ToolCall {
  name: string;
  args: any;
}

// 注册自定义工具
const tools: Tool[] = [
  {
    name: "ReadFile",
    description: "读取文件内容。参数：path（文件路径）",
    execute: async ({ path: p }: { path: string }) => {
      try {
        return fs.readFileSync(p, "utf-8");
      } catch {
        return `错误：无法读取文件 ${p}`;
      }
    },
  },
  {
    name: "WriteFile",
    description: "写入文件内容。参数：path（文件路径），content（内容）",
    execute: async ({
      path: p,
      content,
    }: {
      path: string;
      content: string;
    }) => {
      try {
        fs.writeFileSync(p, content, "utf-8");
        return `成功写入文件 ${p}`;
      } catch (e: any) {
        return `错误：无法写入文件 ${p} - ${e.message}`;
      }
    },
  },
  {
    name: "ListFiles",
    description: "列出目录下的文件。参数：dir（目录路径，默认为当前目录）",
    execute: async ({ dir }: { dir: string }) => {
      try {
        const files = fs.readdirSync(dir || process.cwd());
        return "文件列表：\n" + files.map((f) => "  - " + f).join("\n");
      } catch (e: any) {
        return `错误：无法列出目录 - ${e.message}`;
      }
    },
  },
];

const TOOL_LIST = tools.map((t) => `- ${t.name}: ${t.description}`).join("\n");

async function customToolsReActDemo() {
  console.log("\n=== Part B：手动实现工具调用循环 ===\n");

  const task =
    "请帮我创建一个名为 hello.txt 的文件，内容是'你好，世界！'，然后列出当前目录的文件，确认文件存在。";

  console.log(`任务：${task}\n`);
  console.log(`可用工具：\n${TOOL_LIST}\n`);

  // 模拟 Agent 的 ReAct 循环
  let step = 0;
  let history = "";

  while (step < 5) {
    step++;
    console.log(`--- 第 ${step} 轮 ---`);

    const response = await new Promise<string>((resolve) => {
      let result = "";
      query({
        prompt: `当前任务：${task}

历史记录：
${history}

请决定下一步做什么。你可以选择：
1. 使用工具完成任务
2. 如果任务完成，直接输出结果

输出格式：
THINK: <你的推理>
ACTION: <工具调用，JSON格式 {"name": "工具名", "args": {"参数": "值"}}>
或者：
FINAL: <如果任务完成，输出最终结果>`,
        options: {
          allowedTools: [],
          systemPrompt: `你是一个工具调用助手。

可用工具：
${TOOL_LIST}

重要规则：
- 如果可以用工具完成，用 ACTION
- 如果任务已完成，用 FINAL
- 每次只做一个动作`,
        },
      }).subscribe({
        next(message) {
          result += message;
        },
        complete() {
          resolve(result);
        },
        error(err: any) {
          resolve("错误：" + err);
        },
      });
    });

    console.log(response);
    history += `\n[第 ${step} 轮]\n${response}\n`;

    // 判断是否完成
    if (response.includes("FINAL:")) {
      console.log("\n✓ 任务完成！");
      break;
    }

    // 解析并执行工具调用
    const actionMatch = response.match(
      /ACTION:\s*(\{[\s\S]*?\})/i
    );
    if (actionMatch) {
      try {
        const call: ToolCall = JSON.parse(actionMatch[1]);
        console.log(`\n>>> 执行工具: ${call.name}`);
        const tool = tools.find((t) => t.name === call.name);
        if (tool) {
          const result = await tool.execute(call.args);
          console.log(`<<< 结果: ${result}`);
          history += `\n[执行结果]\n${result}\n`;
        } else {
          console.log(`<<< 错误：未知工具 ${call.name}`);
        }
      } catch (e: any) {
        console.log(`<<< 解析错误: ${e.message}`);
      }
    }
    console.log();
  }
}

// ============================================================
// 运行示例
// ============================================================
async function main() {
  console.log("🤖 Agent 工具调用演示\n");
  console.log("提示：确保已设置 ANTHROPIC_API_KEY 环境变量\n");

  await builtinToolsDemo();

  console.log("\n" + "=".repeat(50) + "\n");

  await customToolsReActDemo();
}

main().catch(console.error);
