# 09 | Skill 调用

> ⭐ **本章核心**：Agent 如何调用 Skill 来扩展能力。本库聚焦于 Agent 的调用方式。
>
> **⚠️ 注意**：本仓库提到的 "Skill" 均指 **Agent Skills 开放标准**（SKILL.md 文件格式，来自 [agentskills.io](https://agentskills.io)），**不是** Claude Code 的 `/skills` 内置命令，也**不是** MCP Tools 的民间泛称。

---

## 本章要点

### Skill 是什么？

**Skill（技能）** 是一份结构化的文档（SKILL.md），告诉 Agent 某个领域的标准操作流程。

- MCP = USB-C 接口（怎么连接工具）
- Skill = SOP 手册（怎么把事情做对）

### Agent 调用 Skill 的方式

```typescript
import * as fs from "fs";

// 读取 Skill 文件
const skill = fs.readFileSync("./skills/code-review.md", "utf-8");

// 注入 systemPrompt
for await (const message of query({
  prompt: "帮我 review 这段代码",
  options: {
    systemPrompt: skill,
  },
})) {
  console.log(message);
}
```

### Skill vs Tool vs MCP

| 概念 | 解决的问题 | 存放位置 |
|------|-----------|---------|
| **MCP** | 连接外部工具 | 代码/服务 |
| **Tool** | 具体功能怎么调用 | 函数 |
| **Skill** | 做事的方法和规范 | SKILL.md 文档 |

---

## 深入学习 Skill

以下内容请参考 [what-is-skill 仓库](https://github.com/Wang-jiankai/what-is-skill)：

| 话题 | 位置 |
|------|------|
| Skill 的三种含义（Claude Code /skills、Agent Skills 开放标准、MCP Tools） | [what-is-skill README](https://github.com/Wang-jiankai/what-is-skill) |
| SKILL.md 的三层结构（YAML 元数据 + Instructions + 脚本） | [concepts/07-SKILL.md格式与结构.md](https://github.com/Wang-jiankai/what-is-skill/blob/main/concepts/07-SKILL.md格式与结构.md) |
| 如何写高质量的 Instructions | [concepts/09-写好Instructions.md](https://github.com/Wang-jiankai/what-is-skill/blob/main/concepts/09-写好Instructions.md) |
| 真实 SKILL.md 示例 | [examples/](https://github.com/Wang-jiankai/what-is-skill/tree/main/examples) |

---

## 下一步

继续学习：[10 - 多 Agent 协作](../concepts/10-multi-agent.md)
