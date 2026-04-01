# 🧠 What is Agent?

> **"Agent" 是 AI 领域最核心的概念之一。** 本仓库面向零基础新手，通过清晰的概念讲解与可运行的代码示例，带你彻底理解什么是 Agent。

---

## 📚 系列仓库

本系列共三个仓库，帮你系统掌握 Claude Code 的核心概念：

| 仓库 | 主题 | 一句话描述 |
|------|------|-----------|
| 🔗 [what-is-agent](https://github.com/Wang-jiankai/what-is-agent) | **Agent** | AI 的"大脑"，能自主规划与执行任务 |
| 🔗 [what-is-skill](https://github.com/Wang-jiankai/what-is-skill) | **Skill** | AI 的"工具箱"，扩展能力的模块化插件 |
| 🔗 [what-is-mcp](https://github.com/Wang-jiankai/what-is-mcp) | **MCP** | AI 的"接口标准"，连接外部世界的桥梁 |

---

## 🔰 什么是 Agent？

**Agent（智能体）** 是一种能够：

- **感知环境** — 接收来自用户或外部的输入
- **自主思考** — 利用大语言模型的推理能力制定计划
- **调用工具** — 执行代码、搜索信息、读写文件等操作
- **迭代反馈** — 根据执行结果不断调整下一步行动

> 简单来说：**Agent = 大脑（LLM）+ 工具 + 记忆 + 规划能力**

### 常见 Agent 框架对比

| 框架 | 特点 | 适用场景 |
|------|------|---------|
| **Claude Agent** | 注重安全性与稳定性，支持多轮对话 | 通用任务、代码助手 |
| **ReAct** | 结合推理与行动，循环执行 | 复杂多步骤任务 |
| **Plan-and-Execute** | 先规划再执行，适合长任务 | 需要全局规划的任务 |

---

## 💡 核心概念

### 1. 规划（Planning）
Agent 将复杂任务分解为多个子步骤，有条理地执行。

### 2. 工具调用（Tool Use）
Agent 通过"工具"与外部世界交互，如执行代码、搜索网页、操作文件。

### 3. 记忆（Memory）
Agent 可以保存对话历史、用户偏好、上下文信息，实现连续交互。

### 4. 反射（Reflection）
Agent 能回顾自身行为，检查错误并纠正。

---

## 🛠️ TypeScript 代码示例

### 基础 Agent 示例

```typescript
import { Agent } from "@anthropic-ai/claude-code";

// 定义可用工具
const tools = {
  async search(query: string) {
    return `搜索结果: 关于 "${query}" 的信息...`;
  },
  async calculate(expression: string) {
    return eval(expression);
  }
};

// 创建 Agent 实例
const agent = new Agent({
  model: "claude-opus-4-6",
  tools,
  systemPrompt: "你是一个乐于助人的助手，擅长回答问题和解决问题。"
});

// 运行 Agent
const result = await agent.run("北京的人口有多少？");
console.log(result);
```

### 带规划的 Agent 示例

```typescript
import { Agent } from "@anthropic-ai/claude-code";

const agent = new Agent({
  model: "claude-opus-4-6",
  tools: {
    search,
    readFile,
    writeFile,
    executeCommand
  },
  systemPrompt: `你是一个专业的软件工程师。
    当收到任务时，先规划好步骤，再按顺序执行。`
});

// 复杂任务：自动完成项目搭建
await agent.run(
  "帮我创建一个 TypeScript 项目，包含 Express 服务器和 React 前端"
);
```

---

## 🚀 运行说明

### 前置要求

- Node.js ≥ 18
- npm 或 yarn
- TypeScript 编译器 (`npm install -g typescript`)

### 安装

```bash
# 克隆仓库
git clone https://github.com/Wang-jiankai/what-is-agent.git
cd what-is-agent

# 安装依赖
npm install
```

### 运行示例

```bash
# 编译 TypeScript
npx tsc

# 运行基础示例
npx ts-node examples/basic.ts

# 运行规划示例
npx ts-node examples/planning.ts
```

---

## 📖 扩展学习

- [Claude Agent 官方文档](https://docs.anthropic.com/claude-code)
- [Agent 架构设计指南](https://github.com/anthropics/anthropic-cookbook)
- [斯坦福 AI Agent 论文](https://arxiv.org/abs/2308.03688)

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！如果你有更好的示例或文档改进，随时联系我们。

---

## 📄 许可证

MIT License © 2024 Wang-jiankai
