---
title: 工作原理
metaTitle: 工作原理 | Metaplex 技能
description: 了解 Metaplex 技能的渐进式披露架构。
created: '02-23-2026'
updated: '03-04-2026'
keywords:
  - progressive disclosure
  - agent skill architecture
  - task router
  - SKILL.md
  - reference files
about:
  - Progressive disclosure
  - Agent Skill architecture
  - Context management
proficiencyLevel: Intermediate
---

Metaplex Skill 使用**渐进式披露**为 AI 代理提供恰好需要的上下文——不多不少。这在保持低令牌使用量的同时提供所有 Metaplex 程序的全面覆盖。{% .lead %}

## 概述

Metaplex Skill 使用两层渐进式披露架构，在最小化令牌使用量的同时为 AI 代理提供准确的 Metaplex 知识。

- 轻量级路由文件（`SKILL.md`）将任务映射到特定参考文件
- 代理仅读取与当前任务相关的文件
- 参考文件涵盖 CLI 命令、SDK 模式和概念基础
- 架构在覆盖所有 Metaplex 程序的同时保持上下文较小

## 架构

Skill 有两个层次：

1. **`SKILL.md`** — 代理首先读取的轻量级路由文件。包含所有程序的概述、工具选择指南以及将任务映射到特定参考文件的任务路由表。

2. **参考文件** — 涵盖 CLI 设置、程序特定 CLI 命令、SDK 模式和概念基础的详细文件。代理仅读取与当前任务相关的文件。

## 代理如何使用 Metaplex Skill

当您要求代理执行 Metaplex 任务时：

1. 代理读取 `SKILL.md` 并识别任务类型
2. 任务路由表将代理引导到相关参考文件
3. 代理仅读取那些文件并使用准确的命令和代码执行任务

例如，如果您请求*"在 devnet 上创建一个 Core NFT"*，代理读取 `SKILL.md`，将其识别为 CLI Core 任务，然后读取 `cli.md`（共享设置）和 `cli-core.md`（Core 特定命令）。

## 参考文件

Skill 包含按方法和程序组织的参考文件：

### CLI 参考

这些文件涵盖每个程序的 `mplx` CLI 命令。

| 文件 | 内容 |
|------|----------|
| `cli.md` | 共享 CLI 设置、配置、工具箱命令 |
| `cli-core.md` | Core NFT 和集合 CLI 命令 |
| `cli-token-metadata.md` | Token Metadata NFT/pNFT CLI 命令 |
| `cli-bubblegum.md` | 压缩 NFT (cNFT) CLI 命令 |
| `cli-candy-machine.md` | Candy Machine 设置和部署 CLI 命令 |
| `cli-genesis.md` | Genesis 代币发行 CLI 命令 |

### SDK 参考

这些文件涵盖每个程序的 Umi 和 Kit SDK 操作。

| 文件 | 内容 |
|------|----------|
| `sdk-umi.md` | Umi SDK 设置和常见模式 |
| `sdk-core.md` | 通过 Umi 的 Core NFT 操作 |
| `sdk-token-metadata.md` | 通过 Umi 的 Token Metadata 操作 |
| `sdk-bubblegum.md` | 通过 Umi 的压缩 NFT 操作 |
| `sdk-genesis.md` | 通过 Umi 的 Genesis 代币发行操作 |
| `sdk-token-metadata-kit.md` | 通过 Kit SDK 的 Token Metadata 操作 |

### 概念

这些文件涵盖账户结构和程序 ID 等共享知识。

| 文件 | 内容 |
|------|----------|
| `concepts.md` | 账户结构、PDA、程序 ID |

## 任务路由器

`SKILL.md` 中的任务路由器将每种任务类型映射到代理应读取的文件：

| 任务类型 | 加载的文件 |
|-----------|-------------|
| CLI 操作（共享设置） | `cli.md` |
| CLI: Core NFT/集合 | `cli.md` + `cli-core.md` |
| CLI: Token Metadata NFT | `cli.md` + `cli-token-metadata.md` |
| CLI: 压缩 NFT (Bubblegum) | `cli.md` + `cli-bubblegum.md` |
| CLI: Candy Machine (NFT 投放) | `cli.md` + `cli-candy-machine.md` |
| CLI: 代币发行 (Genesis) | `cli.md` + `cli-genesis.md` |
| CLI: 同质化代币 | `cli.md`（工具箱部分） |
| SDK 设置 (Umi) | `sdk-umi.md` |
| SDK: Core NFT | `sdk-umi.md` + `sdk-core.md` |
| SDK: Token Metadata | `sdk-umi.md` + `sdk-token-metadata.md` |
| SDK: 压缩 NFT (Bubblegum) | `sdk-umi.md` + `sdk-bubblegum.md` |
| SDK: Candy Machine（铸造/守卫） | `sdk-umi.md` |
| SDK: 使用 Kit 的 Token Metadata | `sdk-token-metadata-kit.md` |
| SDK: 代币发行 (Genesis) | `sdk-umi.md` + `sdk-genesis.md` |
| 账户结构、PDA、概念 | `concepts.md` |

## 注意事项

- Skill 是为 AI 编码代理设计的，可能不会渲染为人类可读的文档
- 参考文件与 [Skill 仓库](https://github.com/metaplex-foundation/skill)一起维护，可能独立于开发者中心更新
- 不支持 [Agent Skills](https://agentskills.io) 格式的代理仍可通过手动安装使用 Skill
