# 01 | 基础练习：构建你的第一个 Agent

## 🎯 练习目标

- 理解 Agent 的四个核心要素（感知、思考、行动、反馈）
- 能够创建一个基础的 Agent 实例
- 能够为 Agent 定义简单的工具

---

## 📋 练习要求

### 基础任务（必做）

1. **创建 Agent 实例**
   - 选择一个你喜欢的 LLM 模型
   - 编写系统提示词（systemPrompt），定义 Agent 的角色

2. **定义一个"问候工具"**
   - 工具接收 `name`（姓名）和 `hour`（当前小时数 0-23）
   - 根据时间返回合适的问候语：
     - 00:00 - 11:59 → "早上好，{name}！"
     - 12:00 - 17:59 → "下午好，{name}！"
     - 18:00 - 23:59 → "晚上好，{name}！"

3. **让 Agent 调用这个工具**
   - 给 Agent 一个需要调用"问候工具"才能回答的问题

### 进阶任务（选做）

4. **添加第二个工具**
   - 创建一个"获取当前时间"工具（返回格式如 `HH:mm`）
   - 让 Agent 在回答前先查询当前时间

---

## 🔍 思考题

1. 在你的代码中，哪个部分体现了 Agent 的"**感知**"能力？
2. 如果不定义任何工具，Agent 还能正常工作吗？为什么？
3. 系统提示词（systemPrompt）对 Agent 的行为有什么影响？

---

## 💡 提示

- 本练习对应的概念文章：[`concepts/01-what-is-agent.md`](../concepts/01-what-is-agent.md)
- 参考答案：[`references/01-basic-solution.ts`](../references/01-basic-solution.ts)
- 先自己尝试，遇到了困难再看参考答案

**💡 结构化提示词进阶：**
如果对"如何写好 systemPrompt"感兴趣，想学习把专家经验固化成 SOP 的方法，请参考：
→ [what-is-skill 仓库](https://github.com/Wang-jiankai/what-is-skill)

## ⚠️ SDK 限制说明

Claude Agent SDK 使用内置工具（Read、Write、Bash 等），不直接支持自定义函数工具（如 `greet(name, hour)`）。

本练习有两种完成方式：

1. **推荐方式**：用 SDK 内置的 Bash 工具调用 Node.js 脚本，间接实现自定义工具（参考答案采用此方式）
2. **高级方式**：通过 MCP 协议扩展自定义工具（参见 what-is-mcp 仓库）

这两种方式分别对应了"用现有工具组合"和"扩展工具能力"两种思路，都是 Agent 开发中的真实场景。
