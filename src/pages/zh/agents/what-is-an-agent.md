---
title: 什么是代理？
metaTitle: Solana 上的代理是什么？ | Metaplex Agent Registry
description: Solana 上的自主代理是具有内置钱包和链上身份记录的 MPL Core 资产。了解代理身份、钱包和执行委托的工作原理。
keywords:
  - Solana agents
  - autonomous agents
  - agent identity
  - MPL Core
  - execution delegation
  - Asset Signer
about:
  - Autonomous Agents
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '03-12-2026'
updated: '03-12-2026'
---

Solana 上的自主代理是由 [Metaplex Agent Registry](/smart-contracts/mpl-agent) 管理的、具有内置钱包和链上身份记录的 [MPL Core](/smart-contracts/core) 资产。{% .lead %}

## 概述

代理是一个已注册链上身份的 MPL Core 资产，可以在自己的 PDA 派生钱包中持有资金。执行被委托给链下运营者，因此代理可以自主行动，无需所有者批准每笔交易。

- **身份** — PDA 记录和 `AgentIdentity` 插件将可验证的身份绑定到 Core 资产
- **钱包** — 资产的内置 PDA 钱包（Asset Signer）无需暴露私钥即可持有 SOL、代币和其他资产
- **委托** — 链下执行者通过 Core 的 Execute 生命周期钩子代表代理签署交易
- **所有者控制** — 所有者可以随时撤销或切换委托，而无需更改代理的身份或钱包

## 代理资产的工作原理

每个 [MPL Core](/smart-contracts/core) 资产都有一个内置钱包——一个从资产公钥派生的 PDA。不存在私钥，因此钱包无法被盗。只有资产本身才能通过 Core 的 [Execute](/smart-contracts/core/execute-asset-signing) 生命周期钩子为自己的钱包签名。

这使得 Core 资产天然适合作为自主代理：

- **资产就是代理的身份** — 通过 [AgentIdentity](/agents/register-agent) 插件在链上注册
- **资产的 PDA 钱包持有代理的资金** — 仅由代理控制的 SOL、代币和其他资产
- **执行者代表代理行动** — 由于 Solana 不支持后台任务或链上推理，委托的[执行者](/agents/run-an-agent)代表代理签署交易。所有者无需批准每个操作。

所有者保留完全控制权。他们选择委托给哪个执行者，并可以随时撤销或切换委托——所有这些都无需更改代理的身份或钱包。

## 下一步

- **[技能](/agents/skill)** — 为 AI 编码代理提供 Metaplex 程序的完整知识
- **[注册代理](/agents/register-agent)** — 将身份记录绑定到 MPL Core 资产
- **[读取代理数据](/agents/run-agent)** — 验证注册并检查链上代理身份
- **[运行代理](/agents/run-an-agent)** — 设置执行者配置文件并委托执行

*由 Metaplex 维护 · 2026 年 3 月验证*
