---
title: Metaplex 技能
metaTitle: Metaplex 技能 | 代理
description: 为 AI 编码代理提供 Metaplex 程序、CLI 命令和 SDK 模式完整知识的代理技能。
keywords:
  - agent skill
  - AI coding agent
  - Claude Code
  - Cursor
  - Copilot
  - Metaplex
  - Solana
  - NFT
about:
  - Agent Skills
  - AI-assisted development
  - Metaplex
proficiencyLevel: Beginner
created: '02-23-2026'
updated: '03-04-2026'
---

Metaplex Skill 是一个 [Agent Skill](https://agentskills.io)——一个为 AI 编码代理提供 Metaplex 程序、CLI 命令和 SDK 模式准确、最新知识的知识库。{% .lead %}

## 概述

Metaplex Skill 为 AI 编码代理提供所有 Metaplex 程序、CLI 命令和 SDK 模式的准确知识。

- 覆盖五个程序：Core、Token Metadata、Bubblegum、Candy Machine 和 Genesis
- 支持 CLI、Umi SDK 和 Kit SDK 方法
- 适用于 Claude Code、Cursor、Copilot、Windsurf 及其他兼容代理
- 使用渐进式披露最小化令牌使用量同时提供完整覆盖

您的 AI 代理可以参考 Skill 在第一次尝试时获取准确的命令和代码，而不是依赖错误的 API 或标志。

{% quick-links %}

{% quick-link title="安装" icon="InboxArrowDown" href="/agents/skill/installation" description="在 Claude Code、Cursor、Copilot 或任何支持 Agent Skills 格式的代理中安装技能。" /%}

{% quick-link title="工作原理" icon="CodeBracketSquare" href="/agents/skill/how-it-works" description="了解渐进式披露如何保持上下文轻量同时提供完整覆盖。" /%}

{% /quick-links %}

## 覆盖的程序

Skill 覆盖五个 Metaplex 程序及其完整操作集：

| 程序 | 用途 | CLI | Umi SDK | Kit SDK |
|---------|---------|-----|---------|---------|
| **[Core](/smart-contracts/core)** | 带插件和版税强制的下一代 NFT | Yes | Yes | — |
| **[Token Metadata](/smart-contracts/token-metadata)** | 同质化代币、NFT、pNFT、版本 | Yes | Yes | Yes |
| **[Bubblegum](/smart-contracts/bubblegum-v2)** | 通过 Merkle 树的压缩 NFT | Yes | Yes | — |
| **[Core Candy Machine](/smart-contracts/core-candy-machine)** | 带可配置守卫的 NFT 投放 | Yes | Yes | — |
| **[Genesis](/smart-contracts/genesis)** | 公平分发的代币发行 | Yes | Yes | — |

## 支持的操作

Skill 为 Metaplex 开发的三种方法提供参考材料：

- **CLI (`mplx`)** — 从终端直接执行 Metaplex 操作。资产创建、上传、Candy Machine 部署、树创建、转移等。
- **Umi SDK** — 覆盖所有程序的完整编程访问。按所有者/集合/创建者查询、DAS API 查询、委托管理和插件配置。
- **Kit SDK** — 使用 `@solana/kit` 以最少依赖进行 Token Metadata 操作。

## 兼容的代理

Skill 适用于任何支持 [Agent Skills](https://agentskills.io) 格式的 AI 编码代理：

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
- [Cursor](https://www.cursor.com/)
- [GitHub Copilot](https://github.com/features/copilot)
- [Codex](https://openai.com/index/codex/)
- [Windsurf](https://windsurf.com/)

## 下一步

- **[安装技能](/agents/skill/installation)** 开始使用
- **[工作原理](/agents/skill/how-it-works)** 了解架构
- **[程序和操作](/agents/skill/programs-and-operations)** 查看详细覆盖

## 注意事项

- Skill 需要支持 [Agent Skills](https://agentskills.io) 格式的 AI 编码代理
- Skill 文件是捆绑到项目中的静态引用——重新运行安装命令以更新
- `npx skills add` 命令需要 Node.js 和 npm/npx
