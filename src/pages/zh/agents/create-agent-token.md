---
title: 创建代理代币
metaTitle: 在 Solana 上创建代理代币 | Metaplex Agent Kit
description: 使用 Metaplex Genesis 从代理的链上钱包发行代币。在 Solana 上注册代理，然后使用 Genesis 协议创建和分发代币。
keywords:
  - agent token
  - token launch
  - Genesis
  - agent wallet
  - Solana agents
  - Metaplex
about:
  - Agent Tokens
  - Genesis
  - Solana
proficiencyLevel: Beginner
created: '04-05-2026'
updated: '04-05-2026'
---

使用 Metaplex Genesis 协议从代理的链上钱包创建代币。 {% .lead %}

## 摘要

代理代币是直接从代理的链上钱包发行的代币。代理在 Solana 上注册身份后，使用 [Metaplex Genesis](/smart-contracts/genesis) 协议创建和分发代币。

- **注册** — 通过 [Metaplex Agent Registry](/agents/register-agent) 在 Solana 上注册代理身份
- **发行** — 通过 Metaplex API、SDK 或 CLI 使用 [Genesis](/smart-contracts/genesis) 协议发行代币
- **前提条件** — 创建代币前需要拥有链上钱包的已注册代理
- **支持** — 支持所有 Genesis 发行类型，包括启动池、预售和拍卖

## 代理代币创建流程

代理代币创建是一个两步流程，将代理身份注册与 Genesis 代币发行协议相结合。

### 第一步：在 Solana 上注册代理

代理必须首先[在 Solana 上向 Metaplex 注册](/agents/register-agent)，这将创建公开身份和链上钱包。注册会将身份记录绑定到 MPL Core 资产，使代理在链上可被发现。详细步骤请参阅[注册代理](/agents/register-agent)指南。

### 第二步：使用 Genesis 发行代币

注册后，代理使用 [Metaplex Genesis](/smart-contracts/genesis) 协议发行代币。Genesis 支持多种发行机制，包括启动池、预售和统一价格拍卖。代理可以通过以下方式与 Genesis 交互：

- **[Metaplex API](/smart-contracts/genesis/integration-apis)** — 通过 REST 端点以编程方式创建代币
- **[Metaplex SDK](/smart-contracts/genesis/sdk/javascript)** — JavaScript/TypeScript SDK 集成
- **[Metaplex CLI](/dev-tools/cli/genesis)** — 命令行代币发行工作流

完整的 Genesis 文档请参阅 [Genesis 概述](/smart-contracts/genesis)。

{% callout type="note" %}
代理代币创建的完整端到端文档即将推出。此页面将更新完整的代码示例和分步说明。
{% /callout %}

## 注意事项

- 代理在发行代币之前必须先[注册](/agents/register-agent)。注册会创建用于代币创建的链上钱包。
- 代理代币是通过 [Genesis](/smart-contracts/genesis) 发行的标准 SPL 代币，与 Solana 代币生态系统完全兼容。
- Genesis 协议处理所有代币分发机制（启动池、预售、拍卖），无论发行者是代理还是人类钱包。

*由 Metaplex 维护 · 2026 年 4 月验证 · [Genesis](https://github.com/metaplex-foundation/mpl-genesis)*
