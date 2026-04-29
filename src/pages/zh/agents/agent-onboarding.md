---
title: Agent 入门指南
metaTitle: Metaplex Agent 入门指南 | Solana 上的 AI Agent
description: Metaplex Agent 入门指南内容概述 — 面向 Solana 上自主 Agent 的钱包创建、身份注册、委托及代币发行说明。
keywords:
  - agent onboarding
  - agent registration
  - Solana agents
  - autonomous agents
  - Metaplex Agent Registry
  - agent wallet
  - agent identity
  - EIP-8004
about:
  - Autonomous Agents
  - Agent Registry
  - Solana
proficiencyLevel: Beginner
created: '04-29-2026'
updated: '04-29-2026'
---

Metaplex Agent 入门指南是所有在 Solana 上与 Metaplex 程序集成的自主 Agent 的规范起点 — 涵盖钱包设置、身份注册、委托及可选的代币发行。 {% .lead %}

## Summary

[Agent 入门指南](https://www.metaplex.com/agents/ONBOARD.md)引导 Agent 完成在 Solana 上建立可验证链上身份并使用 Metaplex Agent Registry 开始运营所需的全部步骤。

- **适用对象** — AI Agent 及在 Solana 上部署自主 Agent 的开发者
- **涵盖内容** — CLI 设置、钱包创建、Core 资产注册、钱包激活、委托及代币发行
- **格式** — 逐命令操作指南，专为 Agent 或其运营者直接使用而设计
- **前提条件** — 一个已充值至少 0.2 SOL 的 Solana 钱包，用于支付注册和交易费用

{% quick-links %}

{% quick-link title="阅读入门指南" icon="BookOpen" href="https://www.metaplex.com/agents/ONBOARD.md" description="Agent 入门完整文档 — 如果您是 Agent 或正在部署 Agent，请打开此文档。" /%}

{% quick-link title="注册 Agent" icon="InboxArrowDown" href="/agents/register-agent" description="铸造 Core 资产并将其注册到 Metaplex Agent Registry 的分步指南。" /%}

{% quick-link title="Metaplex Skill" icon="CodeBracketSquare" href="/agents/skill" description="为您的编码 Agent 提供 Metaplex 程序的最新知识。" /%}

{% /quick-links %}

## 入门指南涵盖的内容

本指南以 Agent 运行 CLI 命令的线性顺序组织，引导 Agent 逐步完成运营准备。

**安装与 RPC 设置** — 安装 Metaplex CLI 并配置 RPC 端点。Devnet 提供默认端点；mainnet 需要专用 RPC URL。

**钱包创建与充值** — 生成主钱包，并充值至少 0.2 SOL 以支付 [Core](/core) 资产注册费和持续的交易费用。

**Agent 注册** — 铸造一个 [Core](/core) 资产作为 Agent 的链上身份，其元数据符合 EIP-8004 Agent 标准。此过程生成 Agent 的 Core 资产地址 — 所有后续操作均需此地址。

**钱包激活** — 为 Asset Signer PDA 充值并激活，该运营钱包供 Agent 自主提交交易使用。

**委托（可选）** — 授权独立的 executor 钱包代表 Agent 提交交易。

**代币发行（可选）** — 通过 [Genesis](/smart-contracts/genesis) 使用 LaunchPool（48 小时存款窗口，最低募集 250 SOL 或 25,000 USDC）或 Bonding Curve（即时交易，无最低要求）创建代币。

## 哪些人应该阅读入门指南

**AI Agent** — 本指南专为运行 Metaplex CLI 的 Agent 直接使用而编写。如果您是 Agent，请在执行任何注册命令前阅读完整文档。

**部署 Agent 的开发者** — 在与其他 Metaplex 程序集成之前，将本指南作为引导新 Agent 链上身份的规范参考。

## Notes

- mainnet 注册需要专用 RPC 端点 — 默认 devnet RPC 在 mainnet 上不可用
- 注册生成的 Core 资产地址是[创建 Agent 代币](/agents/create-agent-token)、[Agent 商业](/agents/agentic-commerce)及其他 Agent 工作流的必要条件
- LaunchPool 募集要求最低 250 SOL 或 25,000 USDC，并需 48 小时存款窗口；Bonding Curve 发行无最低要求，可立即开始交易
- 所有命令通过 Agent PDA 路由 — 主钱包签名并支付费用，但执行归属于 Agent 的链上身份
