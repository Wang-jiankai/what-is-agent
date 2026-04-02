/**
 * 03-memory.ts — Agent 记忆机制演示
 *
 * 本章知识点：concepts/03 - 记忆（Memory）
 *
 * 本示例展示 Agent 的两种记忆机制：
 *   - Part A：会话上下文（Session Context）— SDK 自动管理
 *   - Part B：持久化记忆 — 基于关键词的简单向量检索演示
 *
 * ⚠️ 注意：
 *   Part B 使用纯内存实现，不依赖外部服务。
 *   生产环境推荐使用 ChromaDB / FAISS / Pinecone 等专业向量数据库。
 *
 * 运行方式：
 *   npm install
 *   npx ts-node examples/03-memory.ts
 */

import { query } from "@anthropic-ai/claude-agent-sdk";

// ============================================================
// Part A：会话上下文（Session Context）
// ============================================================
// SDK 会自动把消息历史保存在内存中，每次 query() 调用都会携带。
// 当消息过长超出 Context Window 时，早期消息会被截断。
//
// 本演示：
//   1. 先告诉 Agent 用户的名字
//   2. 再问 Agent 用户叫什么名字（验证它记住了）
// ============================================================

async function sessionContextDemo() {
  console.log("=== Part A：会话上下文（Session Context） ===\n");

  console.log("【第一轮】用户说：'我叫王小明，请记住我'");
  const messages: Array<{ role: "user" | "assistant"; content: string }> = [];

  // 第一轮
  for await (const response of query({
    prompt: "我叫王小明，请记住我",
    options: {
      allowedTools: [],
      systemPrompt: "你是用户的助手，友好、简洁。",
    },
  })) {
    console.log("Agent：", response);
    messages.push({ role: "assistant", content: response });
  }

  // 第二轮：问 Agent 用户的名字（它应该从上下文记住）
  console.log("\n【第二轮】用户问：'我刚才告诉你我叫什么？'");

  for await (const response of query({
    prompt: "我刚才告诉你我叫什么？",
    options: {
      allowedTools: [],
      systemPrompt: "你是用户的助手，友好、简洁。",
    },
  })) {
    console.log("Agent：", response);
  }
}

// ============================================================
// Part B：简单持久化记忆（内存版向量检索演示）
// ============================================================
// 生产环境使用 ChromaDB / FAISS 等专业向量数据库。
// 这里用 TypeScript 手写一个极简版本，帮助理解 RAG 核心原理。
//
// 工作原理（简化版向量检索）：
//   1. 把每条记忆的关键词提取出来
//   2. 用户查询时，提取查询的关键词
//   3. 计算查询与每条记忆的"相关度"（重合关键词数量）
//   4. 返回最相关的几条记忆
// ============================================================

interface Memory {
  id: string;
  content: string;
  keywords: string[];
}

/** 极简的内存向量存储 */
class SimpleMemoryStore {
  private memories: Memory[] = [];

  /** 添加记忆 */
  add(content: string): void {
    const keywords = this.extractKeywords(content);
    this.memories.push({
      id: `mem_${this.memories.length}`,
      content,
      keywords,
    });
  }

  /** 提取关键词（简单实现：中文分词 + 过滤停用词） */
  private extractKeywords(text: string): string[] {
    // 简化处理：按空格和常见分隔符拆分
    // 生产环境请用 jieba 等专业中文分词库
    const words = text
      .toLowerCase()
      .split(/[\s,，。、！？：；""''（）]/g)
      .filter((w) => w.length > 1);
    return [...new Set(words)];
  }

  /** 检索最相关的记忆 */
  retrieve(query: string, topK = 3): Memory[] {
    const queryKeywords = this.extractKeywords(query);

    // 计算每条记忆与查询的相关度
    const scored = this.memories.map((mem) => {
      // 计算重合的关键词数量
      const overlap = mem.keywords.filter((k) =>
        queryKeywords.some((qk) => qk.includes(k) || k.includes(qk))
      ).length;
      return { mem, score: overlap };
    });

    // 按相关度排序，返回 topK
    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map((s) => s.mem);
  }
}

/** 演示用函数：构建带记忆的 systemPrompt */
function buildMemoryPrompt(memories: Memory[]): string {
  if (memories.length === 0) return "你是用户的助手。";

  const memoryText = memories.map((m) => `- ${m.content}`).join("\n");
  return `你是用户的私人助手。以下是你知道的关于用户的信息：

${memoryText}

回答用户问题时，结合以上信息。如果不确定，就说不知道。`;
}

async function vectorMemoryDemo() {
  console.log("\n=== Part B：持久化记忆（内存版向量检索） ===\n");

  // 创建一个记忆库
  const store = new SimpleMemoryStore();

  // 存储几条用户相关的记忆
  const memories = [
    "用户叫王小明，是一名全栈工程师",
    "用户最喜欢的编程语言是 TypeScript",
    "用户对 AI 领域特别感兴趣，尤其是 Agent 技术",
    "用户平时喝美式咖啡，不加糖",
    "用户住在上海，习惯晚睡晚起",
  ];

  console.log("正在存储记忆到向量数据库...\n");
  memories.forEach((m) => {
    store.add(m);
    console.log(`  ✓ ${m}`);
  });

  // 用户查询
  const userQuery = "用户对什么技术感兴趣？喜欢喝什么咖啡？";
  console.log(`\n用户查询： "${userQuery}"`);
  console.log("正在向量数据库中检索...\n");

  // 检索相关记忆
  const relevant = store.retrieve(userQuery);

  if (relevant.length > 0) {
    console.log("检索到的相关记忆：");
    relevant.forEach((m, i) => {
      console.log(`  ${i + 1}. ${m.content}`);
    });

    // 构建带记忆的 systemPrompt
    const systemPrompt = buildMemoryPrompt(relevant);

    console.log("\n--- 使用检索到的记忆回答问题 ---\n");

    for await (const response of query({
      prompt: userQuery,
      options: {
        allowedTools: [],
        systemPrompt,
      },
    })) {
      console.log("Agent：", response);
    }
  } else {
    console.log("没有找到相关记忆。");
  }
}

// ============================================================
// 运行示例
// ============================================================
async function main() {
  console.log("🤖 Agent 记忆机制演示\n");
  console.log("提示：确保已设置 ANTHROPIC_API_KEY 环境变量\n");

  await sessionContextDemo();

  console.log("\n" + "=".repeat(50) + "\n");

  await vectorMemoryDemo();
}

main().catch(console.error);
