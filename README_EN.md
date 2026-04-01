# 🧠 What is Agent?

> **"Agent" is one of the core concepts in AI.** This repository is designed for absolute beginners, helping you thoroughly understand what an Agent is through clear concept explanations and runnable code examples.

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

### Common Agent Frameworks Comparison

| Framework | Characteristics | Best For |
|-----------|----------------|---------|
| **Claude Agent** | Safety-first, stable, supports multi-turn conversation | General tasks, code assistant |
| **ReAct** | Combines reasoning and action in a loop | Complex multi-step tasks |
| **Plan-and-Execute** | Plan first, then execute | Tasks requiring global planning |

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

---

## 🛠️ TypeScript Code Examples

### Basic Agent

```typescript
import { Agent } from "@anthropic-ai/claude-code";

// Define available tools
const tools = {
  async search(query: string) {
    return `Search results for "${query}"...`;
  },
  async calculate(expression: string) {
    return eval(expression);
  }
};

// Create an Agent instance
const agent = new Agent({
  model: "claude-opus-4-6",
  tools,
  systemPrompt: "You are a helpful assistant skilled at answering questions and solving problems."
});

// Run the Agent
const result = await agent.run("What is the population of Beijing?");
console.log(result);
```

### Agent with Planning

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
  systemPrompt: `You are a professional software engineer.
    When given a task, first plan the steps, then execute them in order.`
});

// Complex task: automatically set up a project
await agent.run(
  "Create a TypeScript project with an Express server and React frontend for me"
);
```

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
npx ts-node examples/basic.ts

# Run planning example
npx ts-node examples/planning.ts
```

---

## 📖 Further Learning

- [Claude Agent Official Docs](https://docs.anthropic.com/claude-code)
- [Agent Architecture Design Guide](https://github.com/anthropics/anthropic-cookbook)
- [Stanford AI Agent Paper](https://arxiv.org/abs/2308.03688)

---

## 🤝 Contributing

Issues and Pull Requests are welcome! If you have better examples or documentation improvements, feel free to reach out.

---

## 📄 License

MIT License © 2024 Wang-jiankai
