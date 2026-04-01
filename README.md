# 🧠 What is Agent?

> **"Agent" 是 AI 领域最核心的概念之一。** 本仓库面向零基础新手，通过清晰的概念讲解与可运行的代码示例，带你彻底理解什么是 Agent。

---

> 🌐 **Language**: [English](./README_EN.md)

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

### 技术框架说明

本仓库选用 **Claude Agent SDK** 作为主要教学框架。

| 项目 | 详情 |
|------|------|
| **包名** | `@anthropic-ai/claude-agent-sdk` |
| **最新版本** | v0.2.83（2026-04-02） |
| **官网** | [github.com/anthropics/claude-agent-sdk](https://github.com/anthropics/claude-agent-sdk) |
| **定位** | Anthropic 官方 SDK，Claude Code 同款底层架构 |
| **特点** | 企业级、MCP 原生集成、生命周期钩子、流式输出 |

> **为什么不选其他框架？**
> - LangGraph：最成熟但配置复杂，学习曲线陡
> - CrewAI：上手最简单但灵活性差
> - AutoGen：微软背书但配置复杂，对非程序员不友好
> - OpenAI Swarm：已停止维护

### 常见 Agent 设计模式

| 模式 | 特点 | 适用场景 |
|------|------|---------|
| **ReAct** | 结合推理与行动，循环执行 | 复杂多步骤任务 |
| **Plan-and-Execute** | 先规划再执行，适合长任务 | 需要全局规划的任务 |
| **Claude Agent SDK** | 官方标准，流式输出，MCP 集成 | 生产级应用 |

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

### 5. 多框架（Frameworks）
了解不同 Agent 框架的设计哲学与适用场景。

---

## 🛠️ TypeScript 代码示例

### 基础 Agent 示例

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

// 运行 Agent（流式输出）
for await (const message of query({
  prompt: "北京的人口大约有多少？",
  options: {
    allowedTools: ["Bash", "Read", "Edit", "Write"]  // 允许的工具
  }
})) {
  console.log(message);
}
```

### 带工具定义的 Agent 示例

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

// 使用系统提示词配置 Agent 行为
for await (const message of query({
  prompt: "帮我创建一个简单的 HTTP 服务器，监听 3000 端口",
  options: {
    allowedTools: ["Bash", "Read", "Edit", "Write", "Glob", "Grep"],
    systemPrompt: `你是一个专业的软件工程师。当收到任务时，先规划好步骤，再按顺序执行。`
  }
})) {
  console.log(message);
}
```

> 以上为真实 API 示例。Claude Agent SDK 使用流式 `query()` 函数驱动 Agent，区别于类 `new Agent()` 的写法。

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
npx ts-node examples/01-basic.ts

# 运行规划示例
npx ts-node examples/02-with-planning.ts
```

---

## 📂 仓库目录结构

```
what-is-agent/
├── README.md              # 项目说明（中文）
├── README_EN.md          # 项目说明（英文）
├── LICENSE               # MIT 开源许可证
├── package.json          # 项目依赖配置
├── tsconfig.json         # TypeScript 编译配置
├── .gitignore            # Git 忽略文件
│
├── concepts/             # 📚 核心概念文章（与 assets/ 图片配合阅读效果更佳）
│   ├── 01-what-is-agent.md
│   ├── 02-planning.md
│   ├── 03-memory.md
│   ├── 04-reflection.md
│   └── 05-frameworks.md
│
├── examples/             # 💻 可运行代码示例（每个文件对应一个核心概念）
│   ├── 01-basic.ts               # 对应 concepts/01：Agent 基础结构
│   ├── 02-with-planning.ts       # 对应 concepts/02：规划能力
│   ├── 03-with-memory.ts         # 对应 concepts/03：记忆机制
│   ├── 04-with-reflection.ts     # 对应 concepts/04：自我反思
│   └── 05-multi-framework.ts     # 对应 concepts/05：多框架对比
│
├── exercises/             # 🏋️ 练习题（每道题对应一篇 concepts/ 文章）
│   ├── 01-basic-exercise.md
│   ├── 02-planning-exercise.md
│   ├── 03-memory-exercise.md
│   ├── 04-reflection-exercise.md
│   └── 05-frameworks-exercise.md
│
├── references/            # 📝 练习参考答案（建议先独立完成再对照）
│   ├── 01-basic-solution.ts
│   ├── 02-planning-solution.ts
│   ├── 03-memory-solution.ts
│   ├── 04-reflection-solution.ts
│   └── 05-frameworks-solution.ts
│
└── assets/                # 🖼️ 架构图、流程图（供 concepts/ 文章引用）
    ├── agent-architecture.png    # Agent 核心架构图（配合 concepts/01 阅读）
    ├── planning-flow.png         # 规划流程图（配合 concepts/02 阅读）
    ├── memory-model.png          # 记忆模型图（配合 concepts/03 阅读）
    ├── reflection-loop.png       # 反思循环图（配合 concepts/04 阅读）
    └── framework-comparison.png  # 框架对比图（配合 concepts/05 阅读）
```

### 文件夹职责

| 文件夹 | 内容 | 用途 |
|--------|------|------|
| `concepts/` | 核心理论文章，每篇讲一个知识点 | 帮助新手建立概念框架 |
| `examples/` | 精心设计的可运行代码，顶部标注对应概念 | 边学边实践 |
| `exercises/` | 难度递进的练习（与 concepts/ 章节一一对应）| 巩固学习效果 |
| `references/` | 对应练习的参考解答 | 供对照自查 |
| `assets/` | 架构图、流程图，供 `concepts/` 文章引用 | 辅助理解 |

### 如何使用本仓库

推荐按以下路径依次学习：

```
第 1 步  →  阅读 concepts/01 入门文章
           ↓
第 2 步  →  运行 examples/01 第一个代码示例
           ↓
第 3 步  →  完成 exercises/01 对应练习
           ↓
第 4 步  →  查阅 references/01 参考答案（自查）
           ↓
第 5 步  →  进入下一章（concepts/02 → examples/02 → ...）

循环往复，直至完成全部 5 章。
```

> **提示：** `exercises/` 的习题难度随章节递增。建议先独立思考，实在卡住再看 `references/`。

---

## 📖 扩展学习

- [Claude Agent SDK 官方文档](https://github.com/anthropics/claude-agent-sdk)
- [Agent 架构设计指南](https://github.com/anthropics/anthropic-cookbook)
- [斯坦福 AI Agent 论文](https://arxiv.org/abs/2308.03688)
- [MCP 官方协议](https://modelcontextprotocol.io)

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！如果你有更好的示例或文档改进，随时联系我们。

---

## 📄 许可证

MIT License © 2024 Wang-jiankai
