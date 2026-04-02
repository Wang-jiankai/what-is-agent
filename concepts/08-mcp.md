# 08 | MCP 连接

## 🎯 学习目标

- 理解什么是 MCP（Model Context Protocol）
- 掌握 Claude Agent SDK 如何通过 MCP 连接外部工具
- 理解 MCP 客户端与服务端的关系
- 能配置并使用 MCP 工具

---

## 📖 概念讲解

### 什么是 MCP？

**MCP = Model Context Protocol（模型上下文协议）**

如果你熟悉 USB-C——一种让电脑连接各种设备的统一接口标准——MCP 就是 AI 领域的"USB-C"。

```
传统方式：每个设备用自己的接口
  Agent → 专用适配器 A → 工具 A
  Agent → 专用适配器 B → 工具 B
  Agent → 专用适配器 C → 工具 C
  （每增加一个工具，就需要一个新的适配器）

MCP 方式：统一协议
  Agent → MCP 客户端 → MCP 服务器 → 各种工具
  （只需一个 MCP 客户端，就能接入所有 MCP 服务器）
```

### MCP 的核心组件

| 组件 | 角色 | 类比 |
|------|------|------|
| **MCP 客户端** | 在 Agent 端，负责与服务器通信 | USB-C 端口 |
| **MCP 服务器** | 在工具端，提供工具接口 | USB 设备 |
| **MCP 协议** | 客户端和服务器之间的通信规则 | USB 协议 |

> MCP 的详细讲解（包括如何开发 MCP 服务器），请参考：[what-is-mcp 仓库](https://github.com/Wang-jiankai/what-is-mcp)

---

## 上篇：Claude Agent SDK 的 MCP 支持

### SDK 中的 MCP 配置

Claude Agent SDK 原生支持 MCP，通过 `mcpServers` 配置：

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "使用 filesystem 工具读取当前目录的 package.json",
  options: {
    allowedTools: ["Read", "Bash"],  // 内置工具
    // MCP 服务器配置
    mcpServers: {
      // 官方 filesystem 服务器
      filesystem: {
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-filesystem", "./data"],
      },
    },
  },
})) {
  console.log(message);
}
```

### MCP 服务器的启动方式

| 方式 | 命令示例 | 适用场景 |
|------|---------|---------|
| **npx** | `npx -y @modelcontextprotocol/server-filesystem` | 快速试用 |
| **npm 全局安装** | `npm install -g @modelcontextprotocol/server-filesystem` | 本地长期使用 |
| **Docker** | `docker run ghcr.io/chroma-core/chroma` | 需要隔离环境 |
| **自定义服务** | 自己实现的 MCP 服务器 | 生产环境 |

---

## 下篇：常用 MCP 服务器一览

### 官方 MCP 服务器

Anthropic 官方维护了一系列 MCP 服务器：

| 服务器 | 功能 | 安装命令 |
|--------|------|---------|
| **filesystem** | 文件读写操作 | `npx -y @modelcontextprotocol/server-filesystem` |
| **github** | GitHub API 操作 | `npx -y @modelcontextprotocol/server-github` |
| **slack** | Slack 消息发送 | `npx -y @modelcontextprotocol/server-slack` |
| **brave-search** | 网页搜索 | `npx -y @modelcontextprotocol/server-brave-search` |

### 社区 MCP 服务器

| 服务器 | 功能 | 来源 |
|--------|------|------|
| **Chroma** | 向量数据库 | 官方生态 |
| **PostgreSQL** | 数据库操作 | 社区 |
| **Pinecone** | 向量检索 | 社区 |

---

## 串联：MCP 在 Agent 架构中的位置

```
                    ┌─────────────────────────────┐
                    │         Claude Agent         │
                    │                             │
                    │   ┌─────────────────────┐   │
                    │   │   MCP 客户端         │   │
                    │   │   (协议解析 + 通信)   │   │
                    │   └──────────┬──────────┘   │
                    └──────────────┼──────────────┘
                                   │ MCP 协议
                    ┌──────────────┼──────────────┐
                    │              │              │
               ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
               │  MCP    │    │  MCP    │    │  MCP    │
               │ Server  │    │ Server  │    │ Server  │
               │(文件系统) │    │ (GitHub) │    │ (搜索)   │
               └─────────┘    └─────────┘    └─────────┘
```

MCP 让 Agent 能够用**统一的方式**连接**各种外部工具**。

---

## 💡 生活中的类比

**MCP = 餐厅的"中央采购系统"：**

| 概念 | 对应 |
|------|------|
| MCP 客户端 | 餐厅的采购部门 |
| MCP 服务器 | 各类供应商（蔬菜商、肉商、调料商） |
| MCP 协议 | 统一的订单格式 |
| 工具 | 具体的食材 |

有了中央采购系统，厨师不需要知道每家供应商的联系方式，只需要下单，系统自动对接。

---

## 📝 章节回顾

**记住这三个关键点：**

1. **MCP 是工具的"USB-C"**
   统一的协议让 Agent 可以连接任何 MCP 兼容的工具

2. **MCP 客户端在 Agent 端，服务器在工具端**
   Agent 只需要一个 MCP 客户端，就能接入多个 MCP 服务器

3. **Claude Agent SDK 原生支持 MCP**
   通过 `mcpServers` 配置即可使用，无需额外代码

---

## ❓ 自我检测

- [ ] 能说出 MCP 客户端和服务端的关系吗？
- [ ] 能在 Claude Agent SDK 中配置一个 MCP 服务器吗？
- [ ] 如果没有 MCP，Agent 连接外部工具会面临什么问题？

如果都能回答，是时候进入下一章了。

---

## 🔗 相关资源

- 继续学习：[09 - Skill 调用](../concepts/09-skill.md)
- 深入理解 MCP：[what-is-mcp 仓库](https://github.com/Wang-jiankai/what-is-mcp)
- MCP 官方文档：[modelcontextprotocol.io](https://modelcontextprotocol.io)
