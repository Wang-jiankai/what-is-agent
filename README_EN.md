# 🧠 What is Agent?

> **"Agent" is one of the core concepts in AI.** This repository is designed for absolute beginners, helping you thoroughly understand what an Agent is through clear concept explanations and runnable code examples.

---

> 🌐 **Language**: [中文](./README.md) | [English（当前）](./README_EN.md)

---

## 📚 Series Repositories

This series contains three repositories to help you master the core concepts of Claude Code:

| Repository | Topic | One-liner |
|------------|-------|-----------|
| 🔗 [what-is-agent](https://github.com/Wang-jiankai/what-is-agent) | **Agent** | AI's "brain" — autonomously plans and executes tasks |
| 🔗 [what-is-skill](https://github.com/Wang-jiankai/what-is-skill) | **Skill** | AI's "toolbox" — modular plugins that extend capabilities |
| 🔗 [what-is-mcp](https://github.com/Wang-jiankai/what-is-mcp) | **MCP** | AI's "interface standard" — a bridge to the external world |

---

## 🔰 What is an Agent?

An **Agent** is a system that can:

- **Perceive the environment** — receive input from users or external sources
- **Think autonomously** — use LLM reasoning to devise plans
- **Use tools** — execute code, search the web, read/write files, etc.
- **Iterate and reflect** — adjust next steps based on execution results

> **In simple terms:** **Agent = Brain (LLM) + Tools + Memory + Planning**

### Framework Selection

This repository uses **Claude Agent SDK** as the primary teaching framework.

| Item | Details |
|------|---------|
| **Package** | `@anthropic-ai/claude-agent-sdk` |
| **Latest Version** | v0.2.83 (2026-04-02) |
| **Repository** | [github.com/anthropics/claude-agent-sdk](https://github.com/anthropics/claude-agent-sdk) |
| **Positioning** | Anthropic official SDK, same底层 architecture as Claude Code |
| **Features** | Enterprise-grade, native MCP integration, lifecycle hooks, streaming output |

> **Why not other frameworks?**
> - LangGraph: Most mature but complex configuration, steep learning curve
> - CrewAI: Easiest to start but less flexible
> - AutoGen: Microsoft-backed but complex setup
> - OpenAI Swarm: **Discontinued** — no longer maintained

### Common Agent Design Patterns

| Pattern | Characteristics | Best For |
|---------|----------------|---------|
| **ReAct** | Combines reasoning and action in a loop | Complex multi-step tasks |
| **Plan-and-Execute** | Plan first, then execute | Tasks requiring global planning |
| **Claude Agent SDK** | Official standard, streaming, MCP integration | Production-grade applications |

---

## 💡 Core Concepts

### 1. Planning
Break down complex tasks into sub-steps and execute them systematically.

### 2. Tool Use
Agents interact with the external world through "tools" — code execution, web search, file operations.

### 3. Memory
Agents can persist conversation history, user preferences, and context for continuous interaction.

### 4. Reflection
Agents review their own actions, check for errors, and self-correct.

### 5. Multi-Framework
Understand the design philosophy and best-fit scenarios of different Agent frameworks.

---

## 🛠️ TypeScript Code Examples

### Basic Agent

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

// Run Agent (streaming output)
for await (const message of query({
  prompt: "What is the approximate population of Beijing?",
  options: {
    allowedTools: ["Bash", "Read", "Edit", "Write"]  // Allowed tools
  }
})) {
  console.log(message);
}
```

### Agent with Tools and System Prompt

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

// Configure Agent behavior with system prompt
for await (const message of query({
  prompt: "Create a simple HTTP server listening on port 3000 for me",
  options: {
    allowedTools: ["Bash", "Read", "Edit", "Write", "Glob", "Grep"],
    systemPrompt: `You are a professional software engineer.
      When given a task, first plan the steps, then execute them in order.`
  }
})) {
  console.log(message);
}
```

> These are **real API** examples. Claude Agent SDK uses a streaming `query()` function, not a class-based `new Agent()` pattern.

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm or yarn
- TypeScript compiler (`npm install -g typescript`)

### Installation

```bash
# Clone the repository
git clone https://github.com/Wang-jiankai/what-is-agent.git
cd what-is-agent

# Install dependencies
npm install
```

### Run Examples

```bash
# Compile TypeScript
npx tsc

# Run basic example
npx ts-node examples/01-basic.ts

# Run planning example
npx ts-node examples/02-with-planning.ts
```

---

## 📂 Repository Structure

```
what-is-agent/
├── README.md              # Project overview (Chinese)
├── README_EN.md          # Project overview (English)
├── LICENSE               # MIT License
├── package.json          # Project dependencies
├── tsconfig.json         # TypeScript configuration
├── .gitignore            # Git ignore rules
│
├── concepts/             # 📚 Core concept articles (read with assets/ for best experience)
│   ├── 01-what-is-agent.md
│   ├── 02-planning.md
│   ├── 03-memory.md
│   ├── 04-reflection.md
│   └── 05-frameworks.md
│
├── examples/             # 💻 Runnable code examples (each maps to one concept)
│   ├── 01-basic.ts               # Maps to concepts/01: Agent basics
│   ├── 02-with-planning.ts       # Maps to concepts/02: Planning
│   ├── 03-with-memory.ts         # Maps to concepts/03: Memory
│   ├── 04-with-reflection.ts     # Maps to concepts/04: Reflection
│   └── 05-multi-framework.ts     # Maps to concepts/05: Frameworks
│
├── exercises/             # 🏋️ Exercises (one per concepts/ chapter)
│   ├── 01-basic-exercise.md
│   ├── 02-planning-exercise.md
│   ├── 03-memory-exercise.md
│   ├── 04-reflection-exercise.md
│   └── 05-frameworks-exercise.md
│
├── references/            # 📝 Exercise reference solutions (check after attempting)
│   ├── 01-basic-solution.ts
│   ├── 02-planning-solution.ts
│   ├── 03-memory-solution.ts
│   ├── 04-reflection-solution.ts
│   └── 05-frameworks-solution.ts
│
└── assets/                # 🖼️ Architecture & flow diagrams (referenced by concepts/)
    ├── agent-architecture.png    # Core architecture diagram (read with concepts/01)
    ├── planning-flow.png         # Planning flow diagram (read with concepts/02)
    ├── memory-model.png          # Memory model diagram (read with concepts/03)
    ├── reflection-loop.png       # Reflection loop diagram (read with concepts/04)
    └── framework-comparison.png  # Framework comparison (read with concepts/05)
```

### Folder Responsibilities

| Folder | Content | Purpose |
|--------|---------|---------|
| `concepts/` | Theory articles, one per chapter | Build conceptual foundation |
| `examples/` | Runnable code, with concept mapping in header | Learn by doing |
| `exercises/` | Progressive exercises, one per chapter | Reinforce learning |
| `references/` | Reference solutions for exercises | Self-check after attempting |
| `assets/` | Diagrams referenced by `concepts/` articles | Visual aid |

### How to Use This Repository

Follow this path through the material:

```
Step 1  →  Read concepts/01 introductory article
           ↓
Step 2  →  Run examples/01 first code sample
           ↓
Step 3  →  Complete exercises/01 corresponding exercise
           ↓
Step 4  →  Check references/01 reference solution (self-review)
           ↓
Step 5  →  Move to next chapter (concepts/02 → examples/02 → ...)

Repeat until all 5 chapters are complete.
```

> **Tip:** Exercise difficulty increases with each chapter. Try to work through exercises independently before consulting `references/`.

---

## 📖 Further Learning

- [Claude Agent SDK Official Docs](https://github.com/anthropics/claude-agent-sdk)
- [Agent Architecture Design Guide](https://github.com/anthropics/anthropic-cookbook)
- [Stanford AI Agent Paper](https://arxiv.org/abs/2308.03688)
- [MCP Official Protocol](https://modelcontextprotocol.io)

---

## 🤝 Contributing

Issues and Pull Requests are welcome! If you have better examples or documentation improvements, feel free to reach out.

---

## 📄 License

MIT License © 2024 Wang-jiankai
