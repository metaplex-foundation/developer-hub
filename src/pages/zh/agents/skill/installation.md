---
title: 安装
metaTitle: 安装 | Metaplex 技能
description: 在 Claude Code、Cursor、Copilot 或任何 AI 编码代理中安装 Metaplex Skill。
created: '02-23-2026'
updated: '03-04-2026'
keywords:
  - agent skill installation
  - Claude Code skills
  - Cursor skills
  - Copilot skills
  - npx skills add
about:
  - Agent Skills
  - AI coding agent configuration
proficiencyLevel: Beginner
howToSteps:
  - Run npx skills add metaplex-foundation/skill in your project directory
  - Verify installation by asking your agent to perform a Metaplex operation
howToTools:
  - npx
  - Claude Code
  - Cursor
  - GitHub Copilot
---

安装 Metaplex Skill，让您的 AI 编码代理拥有所有 Metaplex 程序、CLI 命令和 SDK 模式的准确知识。{% .lead %}

## 概述

Metaplex Skill 可以通过 `npx skills` CLI 或手动将文件复制到代理的技能目录来安装。

- 通过 `npx skills add` 一键安装（兼容所有支持的代理）
- 支持 Claude Code 手动安装（项目范围或全局）
- 适用于 Claude Code、Cursor、Copilot、Windsurf 及其他代理
- 通过要求代理执行任何 Metaplex 操作来验证

## 通过 skills.sh（推荐）

最快的安装方式。在项目目录中运行：

```bash
npx skills add metaplex-foundation/skill
```

这适用于 Claude Code、Cursor、Copilot、Windsurf 以及任何支持 [Agent Skills](https://agentskills.io) 格式的代理。该命令将 Skill 文件下载到您的项目中，以便代理可以自动引用。

## Claude Code 手动安装

如果您不想使用 `npx skills`，可以手动复制 Skill 文件。

### 项目范围

将 Skill 文件复制到项目的 Claude 技能目录：

```bash
mkdir -p .claude/skills/metaplex
```

然后将 [GitHub 仓库](https://github.com/metaplex-foundation/skill) 中 `skills/metaplex/` 的内容复制到 `.claude/skills/metaplex/`。

### 全局

要使 Skill 在所有项目中可用：

```bash
mkdir -p ~/.claude/skills/metaplex
```

然后将 [GitHub 仓库](https://github.com/metaplex-foundation/skill) 中 `skills/metaplex/` 的内容复制到 `~/.claude/skills/metaplex/`。

## 验证安装

安装后，要求代理执行 Metaplex 操作。例如：

- *"用 Genesis 发行代币"*
- *"在 devnet 上创建 Core NFT 集合"*
- *"向我的树铸造压缩 NFT"*

如果 Skill 正确加载，代理将引用正确的 CLI 命令或 SDK 代码，而不会产生错误的标志或 API。

## 注意事项

- `npx skills add` 命令需要安装 Node.js 和 npm/npx
- 手动安装路径在项目范围（`.claude/skills/`）和全局（`~/.claude/skills/`）设置之间有所不同
- Skill 文件是静态引用——重新运行安装命令以获取最新版本
