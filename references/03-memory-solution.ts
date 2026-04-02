/**
 * 03-memory-solution.ts — 练习参考答案
 *
 * 本文件包含 exercises/03-memory-exercise.md 的参考解答。
 * 建议先独立完成练习，再对照参考。
 */

import { query } from "@anthropic-ai/claude-agent-sdk";

// ============================================================
// 任务 1：会话上下文——让 Agent 记住用户名字
// ============================================================

async function task1_sessionContext() {
  console.log("=== 任务 1：会话上下文 ===\n");

  // 维护一个消息历史数组
  const messages: Array<{ role: "user" | "assistant"; content: string }> = [];

  const rounds = [
    "我叫王小明，是一名前端工程师，住在杭州。",
    "我今天早餐吃的什么？",
    "我刚才说我住在哪里？",
    "帮我规划一下明天的日程。",
    "我叫什么名字？",
  ];

  for (const userInput of rounds) {
    console.log(`【用户】${userInput}`);

    // 把用户消息加入历史
    messages.push({ role: "user", content: userInput });

    // 调用 query 时传入历史消息（这里简化处理，实际 SDK 参数可能不同）
    for await (const response of query({
      // 传入历史消息列表作为上下文
      // 注意：SDK 的实际 API 可能需要通过 systemPrompt 来注入历史
      prompt: userInput,
      options: {
        allowedTools: [],
        systemPrompt: `你是用户的助手。以下是本次对话的历史记录：

${messages
  .map((m) => `${m.role === "user" ? "用户" : "助手"}：${m.content}`)
  .join("\n")}

请根据以上历史信息回答用户的问题。`,
      },
    })) {
      console.log(`【Agent】${response}`);
      messages.push({ role: "assistant", content: response });
    }
    console.log();
  }
}

// ============================================================
// 任务 2：ChromaDB 持久化记忆
// ============================================================

async function task2_chromaMemory() {
  console.log("=== 任务 2：ChromaDB 持久化记忆 ===\n");

  // 注意：这个任务需要 ChromaDB 服务器运行
  // 启动方式：docker run -p 8000:8000 ghcr.io/chroma-core/chroma:latest

  console.log("⚠️ ChromaDB 需要本地服务器");
  console.log("启动服务器后再运行此代码。\n");

  try {
    const { ChromaClient } = await import("chroma-js");

    const client = new ChromaClient({ path: "http://localhost:8000" });
    const collection = await client.getOrCreateCollection({
      name: "user_memories",
    });

    // 存储 3 条记忆
    const memories = [
      "用户的生日是 1995 年 3 月 15 日",
      "用户对 React 技术栈最熟悉",
      "用户在上个月完成了项目 A",
    ];

    console.log("存储记忆...\n");
    for (let i = 0; i < memories.length; i++) {
      await collection.add({
        ids: [`memory_${i}`],
        documents: [memories[i]],
      });
      console.log(`  ✓ ${memories[i]}`);
    }

    // 检索
    const userQuery = "用户最近做了什么项目？生日是什么时候？";
    console.log(`\n查询： "${userQuery}"`);

    const results = await collection.query({
      queryTexts: [userQuery],
      nResults: 3,
    });

    const relevantMemories = results.documents?.[0] ?? [];

    console.log("\n检索到的记忆：");
    relevantMemories.forEach((m, i) => console.log(`  ${i + 1}. ${m}`));

    // 注入 systemPrompt 并回答
    console.log("\n--- Agent 回答 ---\n");

    const systemPrompt = `你是用户的私人助手。以下是你知道的关于用户的信息：

${relevantMemories.join("\n")}

请根据以上信息回答用户的问题。`;

    for await (const response of query({
      prompt: userQuery,
      options: {
        allowedTools: [],
        systemPrompt,
      },
    })) {
      console.log(`【Agent】${response}`);
    }
  } catch (error) {
    console.log("ChromaDB 连接失败：请确保服务器已启动");
    console.log("docker run -p 8000:8000 ghcr.io/chroma-core/chroma:latest");
  }
}

// ============================================================
// 任务 3：分析 Context Window 截断行为
// ============================================================

async function task3_contextWindow() {
  console.log("=== 任务 3：分析 Context Window 截断行为 ===\n");

  // 这是一个演示脚本，让 Agent 持续对话
  // 观察第几轮开始忘记第 1 轮的信息

  const messages: Array<{ role: "user" | "assistant"; content: string }> = [];
  const KEY_INFO = "我的秘密代码是 12345，请记住这个数字。";

  console.log(`【第 1 轮】${KEY_INFO}`);
  messages.push({ role: "user", content: KEY_INFO });

  // 持续 30 轮对话
  for (let round = 2; round <= 30; round++) {
    const question =
      round % 5 === 0
        ? "我刚才说的秘密代码是什么？"
        : `这是第 ${round} 轮对话。`;

    messages.push({ role: "user", content: question });

    const historyText = messages
      .slice(0, -1) // 排除当前轮
      .map((m) => `${m.role}：${m.content}`)
      .join("\n");

    for await (const response of query({
      prompt: question,
      options: {
        allowedTools: [],
        systemPrompt: `对话历史：\n${historyText}\n\n你是助手。`,
      },
    })) {
      if (round % 5 === 0) {
        console.log(`【第 ${round} 轮】Agent：${response}`);
      }
      messages.push({ role: "assistant", content: response });
    }
  }
}

// ============================================================
// 主函数
// ============================================================

async function main() {
  // 先跑任务 1（不需要外部依赖）
  await task1_sessionContext();

  // 任务 2 需要 ChromaDB 服务器，按需运行
  // await task2_chromaMemory();

  // 任务 3 观察截断行为
  // await task3_contextWindow();
}

main().catch(console.error);
