---
title: 程序和操作
metaTitle: 程序和操作 | Metaplex 技能
description: Metaplex Skill 覆盖的程序和操作的详细分析。
created: '02-23-2026'
updated: '03-04-2026'
keywords:
  - Core
  - Token Metadata
  - Bubblegum
  - Candy Machine
  - Genesis
  - mplx CLI
  - Umi SDK
  - Kit SDK
about:
  - Metaplex programs
  - CLI operations
  - SDK operations
proficiencyLevel: Beginner
---

Metaplex Skill 覆盖 CLI、Umi SDK 和 Kit SDK 中的五个程序。本页提供每个程序支持的功能以及使用时机的详细分析。{% .lead %}

## 概述

Metaplex Skill 为 AI 代理提供关于五个 Metaplex 程序及其在 CLI、Umi SDK 和 Kit SDK 中可用工具的知识。

- 所有五个程序（Core、Token Metadata、Bubblegum、Candy Machine、Genesis）都支持 CLI 和 Umi SDK
- Kit SDK 仅适用于 Token Metadata
- `mplx` CLI 无需编写代码即可处理大多数操作
- 使用本页确定适合您任务的程序和工具方法

## 程序覆盖

| 程序 | CLI | Umi SDK | Kit SDK |
|---------|-----|---------|---------|
| **Core** | Yes | Yes | — |
| **Token Metadata** | Yes | Yes | Yes |
| **Bubblegum** | Yes | Yes | — |
| **Candy Machine** | Yes | Yes | — |
| **Genesis** | Yes | Yes | — |

## Core

Solana 上的下一代 NFT 标准。Core NFT 比 Token Metadata NFT 便宜得多，支持版税强制、冻结委托、属性等插件系统。

**CLI** (`mplx core`)：创建和更新集合与资产，管理插件。

**Umi SDK**：完整的编程访问，包括按所有者/集合/创建者查询、插件配置和委托管理。

## Token Metadata

原始的 Metaplex NFT 标准。支持同质化代币、NFT、可编程 NFT (pNFT) 和版本。

**CLI** (`mplx tm`)：创建同质化代币、NFT、pNFT 和版本。转移和销毁资产。

**Umi SDK**：对所有 Token Metadata 操作的完整编程访问。

**Kit SDK**：使用 `@solana/kit` 以最少依赖进行 Token Metadata 操作。当您想避免 Umi 框架时很有用。

## Bubblegum（压缩 NFT）

使用 Merkle 树进行状态压缩，大规模创建 NFT。压缩 NFT 在初始树创建后仅需传统 NFT 的一小部分成本。

**CLI** (`mplx bg`)：创建 Merkle 树，铸造 cNFT（批量限制约 100），查询、更新、转移和销毁。

**Umi SDK**：完整的编程访问。对于超过约 100 的批量或 DAS API 查询，使用 SDK。

{% callout type="note" %}
压缩 NFT 操作需要支持 DAS 的 RPC 端点。标准 Solana RPC 端点不支持 cNFT 操作所需的 Digital Asset Standard API。
{% /callout %}

## Candy Machine

使用可配置的铸造规则（守卫）部署 NFT 投放。守卫控制谁可以铸造、何时、以什么价格以及多少个。

**CLI** (`mplx cm`)：设置 Candy Machine 配置、插入项目和部署。铸造需要 SDK。

**Umi SDK**：包括铸造操作和守卫配置的完整编程访问。

## Genesis

具有公平分发和自动向 Raydium 流动性毕业的代币发行协议。

**CLI** (`mplx genesis`)：创建和管理代币发行。

**Umi SDK**：用于创建和管理代币发行的完整编程访问。

## CLI 功能

`mplx` CLI 无需编写代码即可直接处理大多数 Metaplex 操作：

| 任务 | CLI 支持 |
|------|-------------|
| 创建同质化代币 | Yes |
| 创建 Core NFT/集合 | Yes |
| 创建 TM NFT/pNFT | Yes |
| 转移 TM NFT | Yes |
| 转移同质化代币 | Yes |
| 转移 Core NFT | 仅 SDK |
| 上传到 Irys | Yes |
| Candy Machine 投放 | Yes（设置/配置/插入——铸造需要 SDK） |
| 压缩 NFT (cNFT) | Yes（批量限制约 100，更大批量使用 SDK） |
| 检查 SOL 余额/空投 | Yes |
| 按所有者/集合查询资产 | 仅 SDK (DAS API) |
| 代币发行 (Genesis) | Yes |

## 选择指南

使用以下指导为您的任务选择合适的程序和工具。

### NFT: Core vs Token Metadata

| 选择 | 条件 |
|--------|------|
| **Core** | 新 NFT 项目、更低成本、插件、版税强制 |
| **Token Metadata** | 现有 TM 集合、需要版本、用于遗留兼容性的 pNFT |

### 何时使用压缩 NFT

以最低成本铸造数千个或更多 NFT 时使用 **Bubblegum**。前期成本是 Merkle 树创建；之后每次铸造仅需交易费用。

### 何时使用 Candy Machine

需要控制铸造规则（白名单、开始/结束日期、铸造限制、支付代币等）的 NFT 投放使用 **Core Candy Machine**。

### 同质化代币

同质化代币始终使用 **Token Metadata**。

### 代币发行

具有公平分发机制和自动 Raydium 流动性毕业的代币生成事件使用 **Genesis**。

### CLI vs SDK

| 选择 | 条件 |
|--------|------|
| **CLI** | 默认选择——直接执行，无需代码 |
| **Umi SDK** | 需要代码，或操作不被 CLI 支持 |
| **Kit SDK** | 特别使用 `@solana/kit` 且需要最少依赖（仅 Token Metadata） |

## 注意事项

- 压缩 NFT (Bubblegum) 操作需要支持 DAS 的 RPC 端点；标准 Solana RPC 不支持 Digital Asset Standard API
- Candy Machine 铸造需要 SDK——CLI 仅处理设置、配置和项目插入
- Core NFT 转移仅限 SDK，CLI 中不可用
- 按所有者或集合查询资产需要 DAS API（仅 SDK）
- Kit SDK 支持仅限于 Token Metadata；所有其他程序使用 Umi
