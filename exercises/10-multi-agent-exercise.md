# 10 | 练习：多 Agent 协作

## 🎯 练习目标

- 理解 Supervisor + Workers 协作模式
- 能设计多 Agent 的任务分解方案
- 了解多 Agent 协作中的常见问题和解决方案

---

## 📋 练习要求

### 基础任务（必做）

**任务 1：设计一个"写博客"的多 Agent 系统**

设计一个由 3 个 Agent 组成的博客撰写系统：

| Agent | 职责 | 输入 | 输出 |
|-------|------|------|------|
| Researcher | 收集资料 | 博客主题 | 资料整理 |
| Writer | 撰写内容 | 资料 | 初稿 |
| Editor | 审核修改 | 初稿 | 定稿 |

**验证方式**：画出这个系统的流程图，说明各 Agent 之间的数据流动。

---

**任务 2：分析多 Agent 协作的潜在问题**

针对以下场景，分析可能的协作问题：

1. Writer Agent 写的内容和 Researcher Agent 收集的资料不一致
2. 三个 Agent 同时修改一份文档，产生冲突
3. 某个 Agent 处理时间过长，导致整个系统卡住

**验证方式**：能否针对每个问题提出至少一个解决方案？

---

### 进阶任务（选做）

**任务 3：实现一个简化版的两 Agent 对话**

用 Claude Agent SDK 实现两个 Agent 的对话：

```typescript
// Agent A 和 Agent B 互相聊天，讨论"AI 是否会取代程序员"
// Agent A 持正方观点
// Agent B 持反方观点
// 辩论 3 轮后，由第三方总结
```

**提示**：
- 每个 Agent 的 systemPrompt 定义其角色和立场
- 通过多次 query() 调用模拟多轮对话
- 第三轮结束后，让一个新的 Agent 总结辩论

---

## 🔍 思考题

1. 什么类型的任务适合用多 Agent？什么类型不适合？
2. 如果 Supervisor Agent 本身出错了，会对整个系统造成什么影响？
3. 多 Agent 协作和单一 Agent + 更好的 Planning，各有什么优劣？

---

## 💡 提示

- 本练习对应的概念文章：[`concepts/10-multi-agent.md`](../concepts/10-multi-agent.md)
- 参考答案：[`references/10-multi-agent-solution.ts`](../references/10-multi-agent-solution.ts)
