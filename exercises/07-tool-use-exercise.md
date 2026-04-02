# 07 | 练习：掌握 Agent 的工具调用

## 🎯 练习目标

- 熟练使用 Claude Agent SDK 的内置工具
- 理解工具调用的流程和 Agent 的决策过程
- 能设计自定义工具并实现工具调用循环

---

## 📋 练习要求

### 基础任务（必做）

**任务 1：使用内置工具完成一个项目初始化**

用 Claude Agent SDK + 内置工具，实现以下流程：

```
1. 创建一个新目录 project_demo
2. 在目录里创建 package.json（name: demo, version: 1.0.0）
3. 创建 index.ts，内容是 console.log("Hello")
4. 运行 npm install --no-save（不要实际安装依赖，只需初始化 package.json）
5. 读取 package.json 确认内容正确
6. 清理（删除目录）
```

**验证方式**：观察 Agent 是如何一步步调用工具完成任务的。

---

**任务 2：观察 Agent 的工具选择策略**

设计一个需要多种工具配合的任务：

```
任务：搜索当前目录下所有 .ts 文件，统计一共有多少行代码
```

**验证方式**：
- Agent 是否正确使用了 `Glob` 找到文件？
- 是否正确使用了 `Bash` 或 `Read` 获取文件内容？
- 统计逻辑是否合理？

---

### 进阶任务（选做）

**任务 3：实现一个"文件搜索 + 内容替换"的 ReAct 循环**

实现一个自定义工具循环：

1. **自定义工具**：
   - `SearchFiles(pattern)`: 搜索匹配的文件
   - `SearchInFile(path, keyword)`: 在文件中搜索关键字
   - `ReplaceInFile(path, old, new)`: 替换文件内容

2. **任务**：在当前目录下所有 `.md` 文件中，把"AI"替换成"人工智能"

**验证方式**：运行后检查文件内容是否被正确替换。

---

## 🔍 思考题

1. 如果把 `allowedTools` 设置为空数组 `[]`，Agent 的行为会有什么变化？
2. `allowedTools` 允许的工具数量是否有上限？无限扩张会有什么问题？
3. 工具调用和普通 LLM API 调用的本质区别是什么？

---

## 💡 提示

- 本练习对应的概念文章：[`concepts/07-tool-use.md`](../concepts/07-tool-use.md)
- 参考答案：[`references/07-tool-use-solution.ts`](../references/07-tool-use-solution.ts)
