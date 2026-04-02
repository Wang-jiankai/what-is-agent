/**
 * 08-mcp.ts — MCP 连接演示
 *
 * 本章知识点：concepts/08 - MCP 连接
 *
 * 本示例展示：
 *   - Part A：Claude Agent SDK 中的 MCP 配置方式
 *   - Part B：常用 MCP 服务器的配置示例
 *
 * ⚠️ 注意：
 *   运行 MCP 示例需要先安装对应的 MCP 服务器。
 *   示例 A 需要 @modelcontextprotocol/server-filesystem
 *   示例 B 需要 @modelcontextprotocol/server-github
 *
 * 安装命令：
 *   npm install -g @modelcontextprotocol/server-filesystem
 *   npm install -g @modelcontextprotocol/server-github
 *   （需要设置 GITHUB_TOKEN 环境变量）
 *
 * 运行方式：
 *   npm install
 *   npx ts-node examples/08-mcp.ts
 */

import { query } from "@anthropic-ai/claude-agent-sdk";

// ============================================================
// Part A：MCP 文件系统服务器
// ============================================================
// 配置一个本地文件系统 MCP 服务器，
// 让 Agent 可以读写指定目录的文件。
// ============================================================

async function mcpFilesystemDemo() {
  console.log("=== Part A：MCP 文件系统服务器 ===\n");

  // 创建一个临时目录用于演示
  const fs = await import("fs");
  const demoDir = "./mcp_demo_data";
  if (!fs.existsSync(demoDir)) {
    fs.mkdirSync(demoDir);
  }
  fs.writeFileSync(
    `${demoDir}/note.txt`,
    "这是一个 MCP 文件系统演示文件。创建时间：" + new Date().toISOString()
  );

  console.log(`已创建演示目录：${demoDir}`);
  console.log("正在配置 MCP 服务器...\n");

  const task = `请完成以下任务：

1. 读取 ./${demoDir}/note.txt 的内容
2. 在 ./${demoDir}/ 下创建一个新文件 response.txt，内容是"我是 MCP 生成的回复"
3. 列出 ./${demoDir}/ 目录下的所有文件
4. 汇报你使用了哪些工具

`;

  try {
    for await (const message of query({
      prompt: task,
      options: {
        allowedTools: ["Read", "Bash", "Write", "Edit", "Glob"],
        // MCP 服务器配置：让 Agent 使用文件系统 MCP 服务器
        mcpServers: {
          filesystem: {
            command: "npx",
            args: ["-y", "@modelcontextprotocol/server-filesystem", `./${demoDir}`],
          },
        },
      },
    })) {
      console.log(message);
    }
  } catch (error: any) {
    console.log("错误（可能是 MCP 服务器未安装）：", error.message);
    console.log("\n解决方法：");
    console.log("  npm install -g @modelcontextprotocol/server-filesystem");
  }

  // 清理
  console.log("\n--- 清理演示目录 ---");
  if (fs.existsSync(demoDir)) {
    const files = fs.readdirSync(demoDir);
    console.log(`${demoDir} 目录内容：`);
    files.forEach((f) => console.log("  -", f));
  }
}

// ============================================================
// Part B：常用 MCP 服务器配置一览
// ============================================================
// 展示如何配置多种常用的 MCP 服务器。
// 每个配置包含：服务器用途、npm 包名、必要参数。
// ============================================================

interface MCPServerConfig {
  name: string;
  package: string;
  description: string;
  args?: string[];
  env?: Record<string, string>;
}

const MCP_SERVERS: MCPServerConfig[] = [
  {
    name: "filesystem",
    package: "@modelcontextprotocol/server-filesystem",
    description: "本地文件系统读写",
    args: ["./data"],
  },
  {
    name: "github",
    package: "@modelcontextprotocol/server-github",
    description: "GitHub API 操作（Issues, PRs, Repos）",
    env: { GITHUB_TOKEN: "你的 GitHub Personal Access Token" },
  },
  {
    name: "slack",
    package: "@modelcontextprotocol/server-slack",
    description: "Slack 消息发送",
    env: { SLACK_BOT_TOKEN: "你的 Slack Bot Token" },
  },
  {
    name: "brave-search",
    package: "@modelcontextprotocol/server-brave-search",
    description: "网页搜索",
    env: { BRAVE_API_KEY: "你的 Brave Search API Key" },
  },
];

function printServerConfigs() {
  console.log("\n=== Part B：常用 MCP 服务器配置一览 ===\n");

  console.log("以下是可以接入 Claude Agent SDK 的 MCP 服务器：\n");

  for (const server of MCP_SERVERS) {
    console.log(`【${server.name}】`);
    console.log(`  包名：${server.package}`);
    console.log(`  功能：${server.description}`);
    console.log(`  安装：npm install -g ${server.package}`);
    console.log(`  配置：`);
    console.log(`    command: "npx"`);
    console.log(`    args: ${JSON.stringify(server.args || [])}`);
    if (server.env) {
      console.log(`    环境变量：${Object.keys(server.env).join(", ")}`);
    }
    console.log();
  }

  console.log("使用示例：");
  console.log(`
const serverConfig = {
  command: "npx",
  args: ["-y", "@modelcontextprotocol/server-filesystem", "./data"]
};

// 在 query() 的 options 中传入
for await (const message of query({
  prompt: "读取文件",
  options: {
    allowedTools: ["Read"],
    mcpServers: { filesystem: serverConfig }
  }
})) {
  console.log(message);
}
`);
}

// ============================================================
// 运行示例
// ============================================================
async function main() {
  console.log("🤖 MCP 连接演示\n");
  console.log("提示：确保已设置 ANTHROPIC_API_KEY 环境变量\n");

  // 先打印配置一览
  printServerConfigs();

  console.log("\n" + "=".repeat(50) + "\n");

  // 尝试运行文件系统演示
  await mcpFilesystemDemo();
}

main().catch(console.error);
