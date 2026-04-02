# 09 | 练习：Agent Skill 调用

> ⚠️ 本章 "Skill" 均指 **Agent Skills 开放标准**（SKILL.md 格式），来自 [agentskills.io](https://agentskills.io)。

## 🎯 练习目标

- 掌握读取 SKILL.md 并注入 Agent 的方法
- 理解 Skill 与 MCP 工具的区别
- 能为自定义场景设计 Skill 的 Level 1 元数据

---

## 📋 练习要求

### 基础任务（必做）

**任务 1：使用 SKILL.md 进行代码审查**

从 [what-is-skill 仓库](https://github.com/Wang-jiankai/what-is-skill/tree/main/examples) 找一个 SKILL.md 示例，复制到本地，用它引导 Agent 完成一次代码审查。

**验证方式**：对比不使用 Skill 和使用 Skill 的审查结果差异。

---

**任务 2：为"代码翻译"设计 Skill 元数据**

设计一个"把 TypeScript 代码翻译成 Python"的 Skill，编写 Level 1 元数据：

```yaml
name: <技能名>
description: <一句话描述>
trigger:
  - <触发词1>
  - <触发词2>
version: <版本>
author: <作者>
```

**验证方式**：元数据是否完整，trigger 是否能覆盖常见调用方式。

---

### 进阶任务（选做）

**任务 3：实现 Skill 动态加载**

写一个函数：

```typescript
function loadSkill(skillName: string): string {
  // 从 ./skills/ 目录读取对应的 SKILL.md 文件
  // 如果文件不存在，返回空字符串
}
```

然后用它根据用户输入动态选择 Skill 并执行。

---

## 🔍 思考题

1. Skill 的 Level 2 Instructions 和普通的 systemPrompt 有什么本质区别？
2. 如果一个 Skill 的 Instructions 和 Agent 的 systemPrompt 冲突了，应该以哪个为准？
3. Skill 和 MCP 工具分别在什么场景下使用？

---

## 💡 提示

- 本练习对应的概念文章：[`concepts/09-skill.md`](../concepts/09-skill.md)
- 参考答案：[`references/09-skill-solution.ts`](../references/09-skill-solution.ts)
- Skill 详细格式：[what-is-skill 仓库](https://github.com/Wang-jiankai/what-is-skill)
