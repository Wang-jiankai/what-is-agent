# 10 | 多 Agent 协作

> ⭐ **本章核心**：多个 Agent 如何协同工作。本章聚焦于协作模式与架构设计。

---

## 多 Agent 协作模式

### 为什么需要多 Agent？

单 Agent 的局限：
- 一个 Agent 难以同时精通所有领域
- 任务过多会导致 Context Window 压力
- 复杂任务需要不同专业能力分工

多 Agent 解决：
- 每个 Agent 专注一个领域（专业化）
- 多个 Agent 分工协作（并行化）
- 整体系统能力超过单个 Agent

### 常见协作模式

#### 模式一：父子结构（Supervisor + Workers）

```
       ┌─────────────┐
       │  Supervisor │
       │   Agent     │
       └──────┬──────┘
              │ 分解任务、协调
       ┌──────┴──────┬─────────────┐
       ▼             ▼             ▼
  ┌─────────┐  ┌─────────┐  ┌─────────┐
  │ Worker  │  │ Worker  │  │ Worker  │
  │ (搜索)  │  │ (代码)  │  │ (写作)  │
  └─────────┘  └─────────┘  └─────────┘
```

#### 模式二：顺序执行（Pipeline）

```
Agent A → Agent B → Agent C → 输出
(调研)   (分析)   (写作)    (最终结果)
```

#### 模式三：并行 + 汇总（Parallel + Aggregate）

```
      ┌─ Agent A (调研) ─┐
      ├─ Agent B (分析) ─┤─→ 汇总 Agent
      └─ Agent C (设计) ─┘
```

---

## 多 Agent 协作的挑战

| 挑战 | 描述 | 解决方案 |
|------|------|---------|
| **通信协议** | Agent 之间怎么传递信息？ | 共享消息队列 / 共享 Context |
| **状态同步** | 各 Agent 的进度怎么协调？ | Supervisor 集中管理 |
| **冲突解决** | 多个 Agent 意见不一致怎么办？ | 投票 / Supervisor 裁决 |
| **死锁** | Agent 互相等待对方怎么办？ | 超时机制 / 任务超时放弃 |

---

## 本章 Demo

`examples/10-multi-agent.ts` 中包含一个简化版的 Supervisor + Worker 协作演示：

```typescript
// Supervisor 分解任务给多个 Worker
async function supervisorDemo() {
  const task = "帮我调研竞品、分析市场、撰写报告";

  // Supervisor 分析任务，分解为子任务
  // Worker A: 调研竞品
  // Worker B: 分析市场
  // Worker C: 撰写报告
  // Supervisor 汇总结果
}
```

---

## 下一步

继续学习：[11 - 生产环境部署](../concepts/11-deployment.md)
