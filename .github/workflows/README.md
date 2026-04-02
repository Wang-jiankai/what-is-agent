# GitHub Actions 工作流说明

本文件夹包含 3 个自动化工作流。

---

## 1. 依赖检查 `dependency-check.yml`

**作用**：检测 `@anthropic-ai/claude-agent-sdk` 是否有新版本

**触发**：每 3 天自动运行，或手动触发

**行为**：
- 有更新 → 在本月 issue 下追加评论
- 无更新 → 不创建 issue

**手动触发**：GitHub Actions → "Dependency Check" → Run workflow

---

## 2. Issue 周报 `summarize-issues.yml`

**作用**：汇总三个仓库（what-is-agent、what-is-mcp、what-is-skill）近 7 天的新 Issue

**触发**：每周一早上 9 点自动运行，或手动触发

**行为**：创建/更新本月 Issue 周报

**手动触发**：GitHub Actions → "Weekly Issue Summary" → Run workflow

---

## 3. 手动创建 Issue `create-issue.yml`

**作用**：通过表单手动创建一个 Issue

**触发**：仅手动触发

**输入**：
- `title` — Issue 标题
- `body` — Issue 内容（支持 Markdown）
- `labels` — 标签（可选，逗号分隔）

**手动触发**：GitHub Actions → "Create Issue" → Run workflow → 填写表单

---

## 通用说明

- 所有 workflow 都支持 **workflow_dispatch**，即 GitHub 网页手动触发
- 自动触发需要 push 权限（`GITHUB_TOKEN` 默认提供）
- `dependency-check` 和 `summarize-issues` 会自动在已有 issue 下追加，避免重复创建
