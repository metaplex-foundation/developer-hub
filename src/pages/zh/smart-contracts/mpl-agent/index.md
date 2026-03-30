---
title: MPL Agent Registry
metaTitle: MPL Agent Registry — Solana 链上代理身份 | Metaplex
description: 使用 MPL Core 资产在 Solana 上注册代理身份和委托执行的链上程序。
keywords:
  - MPL Agent Registry
  - agent identity
  - execution delegation
  - MPL Core
  - Solana smart contracts
about:
  - Smart Contracts
  - Solana
  - Metaplex
proficiencyLevel: Intermediate
created: '02-25-2026'
updated: '03-30-2026'
---

**MPL Agent Registry** 提供链上程序，用于在 Solana 上使用 MPL Core 资产注册代理身份和委托执行权限。{% .lead %}

## 概述

MPL Agent Registry 是一对 Solana 链上程序，将可验证的身份记录绑定到 MPL Core 资产，并通过执行档案管理执行委托。

- **Agent Identity 程序** — 注册身份 PDA，附加带有生命周期钩子的 `AgentIdentity` 插件，并可选链接 [Genesis](/smart-contracts/genesis) 代币
- **Agent Tools 程序** — 管理执行档案、执行委托记录和委托撤销
- **JavaScript/TypeScript SDK** — `@metaplex-foundation/mpl-agent-registry` 提供指令构建器和账户查询器
- **主网和开发网使用相同地址** — 两个程序在各网络上部署于相同地址

{% callout title="选择你的路径" %}
- **快速开始？** 参阅[入门指南](/smart-contracts/mpl-agent/getting-started)了解安装和首次注册
- **注册代理？** 参阅[注册代理](/agents/register-agent)指南
- **读取代理数据？** 参阅[读取代理数据](/agents/run-agent)指南
{% /callout %}

## 什么是 Agent Registry？

Agent Registry 将可验证的链上身份记录绑定到 MPL Core 资产。注册会创建一个 PDA（Program Derived Address），使代理在链上可被发现，并将 `AgentIdentity` 插件附加到 Core 资产，包含 Transfer、Update 和 Execute 事件的生命周期钩子。

一旦代理拥有身份，**Agent Tools** 程序允许资产所有者将执行权限委托给执行档案——允许指定的权限方代表代理资产执行操作。

## 程序

| 程序 | 地址 | 用途 |
|---------|---------|---------|
| **[Agent Identity](/smart-contracts/mpl-agent/identity)** | `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p` | 注册身份并将生命周期钩子附加到 Core 资产 |
| **[Agent Tools](/smart-contracts/mpl-agent/tools)** | `TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S` | 执行档案和执行委托 |

## 工作原理

### 身份注册

1. 使用 MPL Core 资产和 `agentRegistrationUri` 调用 `RegisterIdentityV1`
2. 程序从种子 `["agent_identity", <asset>]` 派生创建 PDA
3. 程序通过 CPI 调用 MPL Core，附加带有 URI 和 Transfer、Update、Execute 生命周期检查的 `AgentIdentity` 插件
4. PDA 存储资产的公钥以支持反向查找
5. 可选调用 `SetAgentTokenV1` 将 [Genesis](/smart-contracts/genesis) 代币链接到身份

### 执行委托

1. 执行方通过 `RegisterExecutiveV1` 注册档案
2. 资产所有者调用 `DelegateExecutionV1` 授予执行方代表代理资产执行的权限
3. 创建委托记录 PDA，将执行档案链接到资产
4. 所有者或执行方均可调用 `RevokeExecutionV1` 移除委托

## SDK

| 语言 | 包 |
|----------|---------|
| JavaScript/TypeScript | `@metaplex-foundation/mpl-agent-registry` |

```shell
npm install @metaplex-foundation/mpl-agent-registry
```

## 后续步骤

1. **[入门指南](/smart-contracts/mpl-agent/getting-started)** — 安装、设置和首次注册
2. **[Agent Identity](/smart-contracts/mpl-agent/identity)** — 身份程序详情、账户和 PDA 派生
3. **[Agent Tools](/smart-contracts/mpl-agent/tools)** — 执行档案和执行委托
