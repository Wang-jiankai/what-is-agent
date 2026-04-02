/**
 * 08-mcp-solution.ts — 练习参考答案
 *
 * 本文件包含 exercises/08-mcp-exercise.md 的参考解答。
 * 建议先独立完成练习，再对照参考。
 */

import { query } from "@anthropic-ai/claude-agent-sdk";

// ============================================================
// 任务 1：配置文件系统 MCP 服务器
// ============================================================

async function task1_filesystemMCP() {
  console.log("=== 任务 1：文件系统 MCP 服务器 ===\n");

  const fs = await import("fs");
  const demoDir = "./mcp_test";

  // 创建演示目录
  if (!fs.existsSync(demoDir)) {
    fs.mkdirSync(demoDir);
  }

  console.log(`目录 ${demoDir} 已创建\n`);

  const task = `
请在 ./${demoDir}/ 目录下：
1. 创建 hello.txt，内容是"Hello from MCP!"
2. 读取 hello.txt 的内容
3. 列出 ./${demoDir}/ 下的所有文件
`;

  try {
    for await (const message of query({
      prompt: task,
      options: {
        allowedTools: [],
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
    console.log("MCP 服务器连接失败：", error.message);
    console.log("\n请先安装：npm install -g @modelcontextprotocol/server-filesystem");
  }

  // 清理
  if (fs.existsSync(demoDir)) {
    const files = fs.readdirSync(demoDir);
    console.log(`\n${demoDir} 目录内容：`);
    files.forEach((f) => console.log("  -", f));
    fs.rmSync(demoDir, { recursive: true });
  }
}

// ============================================================
// 任务 2：MCP 服务器生态调研
// ============================================================

interface MCPServer {
  name: string;
  package: string;
  description: string;
  needsApiKey: boolean;
  official: boolean;
}

function task2_mcpResearch() {
  console.log("\n=== 任务 2：MCP 服务器生态调研 ===\n");

  const servers: MCPServer[] = [
    // 官方服务器
    {
      name: "filesystem",
      package: "@modelcontextprotocol/server-filesystem",
      description: "本地文件系统读写操作",
      needsApiKey: false,
      official: true,
    },
    {
      name: "github",
      package: "@modelcontextprotocol/server-github",
      description: "GitHub API（Issues, PRs, Repos, Search）",
      needsApiKey: true,
      official: true,
    },
    {
      name: "slack",
      package: "@modelcontextprotocol/server-slack",
      description: "Slack 消息发送和频道管理",
      needsApiKey: true,
      official: true,
    },
    {
      name: "brave-search",
      package: "@modelcontextprotocol/server-brave-search",
      description: "网页搜索（Brave Search API）",
      needsApiKey: true,
      official: true,
    },
    {
      name: "google-maps",
      package: "@modelcontextprotocol/server-google-maps",
      description: "Google Maps 地理编码、地点搜索、路线规划",
      needsApiKey: true,
      official: true,
    },
    // 社区服务器
    {
      name: "chroma",
      package: "chroma-mcp-server",
      description: "Chroma 向量数据库（内存模式）",
      needsApiKey: false,
      official: false,
    },
    {
      name: "postgres",
      package: "@modelcontextprotocol/server-postgres",
      description: "PostgreSQL 数据库操作",
      needsApiKey: false,
      official: false,
    },
    {
      name: "sentry",
      package: "@modelcontextprotocol/server-sentry",
      description: "Sentry 错误追踪",
      needsApiKey: true,
      official: false,
    },
  ];

  console.log("| 服务器名 | 功能 | 包名 | 需要 API Key | 来源 |");
  console.log("|---------|------|------|-------------|------|");
  for (const s of servers) {
    console.log(
      `| ${s.name} | ${s.description} | ${s.package} | ${s.needsApiKey ? "是" : "否"} | ${s.official ? "官方" : "社区"} |`
    );
  }

  console.log("\n完整列表请参考：https://github.com/modelcontextprotocol/servers");
}

// ============================================================
// 任务 3：MCP 客户端测试工具（选做框架）
// ============================================================

async function task3_mcpTestTool() {
  console.log("\n=== 任务 3：MCP 测试工具框架 ===\n");

  // 这是一个测试 MCP 服务器连接的框架
  // 实际使用时需要替换具体的 server 配置

  const serverConfig = {
    filesystem: {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-filesystem", "./test_data"],
    },
  };

  console.log("测试 MCP 服务器连接...\n");

  try {
    const response = await new Promise<string>((resolve) => {
      let result = "";
      query({
        prompt: "请列出你当前可以使用的所有工具，包括 MCP 服务器提供的工具。",
        options: {
          allowedTools: ["Read", "Bash", "Write", "Glob", "Grep"],
          mcpServers: serverConfig,
        },
      }).subscribe({
        next(m) {
          result += m;
        },
        complete() {
          resolve(result);
        },
        error(err: any) {
          resolve("错误：" + err.message);
        },
      });
    });

    console.log(response);
    console.log("\n✓ MCP 服务器连接成功！");
  } catch (error: any) {
    console.log("✗ 连接失败：", error.message);
  }
}

// ============================================================
// 主函数
// ============================================================

async function main() {
  task2_mcpResearch();
  // await task1_filesystemMCP();
  // await task3_mcpTestTool();
}

main().catch(console.error);
