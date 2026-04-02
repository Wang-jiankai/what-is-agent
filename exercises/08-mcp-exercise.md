# 08 | 练习：配置和使用 MCP 连接

## 🎯 练习目标

- 掌握 Claude Agent SDK 的 MCP 配置方法
- 能安装并配置一个 MCP 服务器
- 理解 MCP 客户端和服务端的通信流程

---

## 📋 练习要求

### 基础任务（必做）

**任务 1：安装并配置文件系统 MCP 服务器**

1. **安装**：
   ```bash
   npm install -g @modelcontextprotocol/server-filesystem
   ```

2. **配置**：编写一个简单的脚本，使用 MCP filesystem 服务器：
   - 创建一个目录 `mcp_test`
   - 用 MCP filesystem 工具在目录中创建一个文件 `hello.txt`
   - 用 MCP filesystem 工具读取文件内容
   - 列出目录内容

**验证方式**：脚本能否成功读写文件。

---

**任务 2：探索 MCP 服务器生态**

调研并整理一份 MCP 服务器清单，包含：

| 服务器名 | 功能 | 包名 | 是否需要 API Key |
|---------|------|------|----------------|
| filesystem | ... | ... | ... |
| github | ... | ... | ... |
| ... | ... | ... | ... |

至少调研 5 个 MCP 服务器（官方的 + 社区的）。

**验证方式**：整理的清单是否准确完整。

---

### 进阶任务（选做）

**任务 3：实现一个 MCP 客户端测试工具**

用 Claude Agent SDK 实现一个"MCP 服务器测试工具"：

- 输入：MCP 服务器的配置（command, args）
- 功能：尝试连接服务器，列出可用工具
- 输出：成功连接的服务器及其工具列表

**提示**：
```typescript
// 伪代码
const result = await query({
  prompt: "列出你连接的所有 MCP 服务器的可用工具",
  options: {
    allowedTools: [],
    mcpServers: {
      [serverName]: { command, args }
    }
  }
});
```

---

## 🔍 思考题

1. MCP 服务器和 Agent 内置工具（Read, Write, Bash）相比，有什么优势？
2. 如果一个 MCP 服务器需要收费的 API Key，你会如何评估是否值得使用？
3. MCP 协议和 OpenAI 的 Plugins 协议有什么本质区别？

---

## 💡 提示

- 本练习对应的概念文章：[`concepts/08-mcp.md`](../concepts/08-mcp.md)
- 参考答案：[`references/08-mcp-solution.ts`](../references/08-mcp-solution.ts)
- MCP 官方服务器列表：[github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)
