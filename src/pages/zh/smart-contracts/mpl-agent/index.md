---
title: MPL 代理注册表
metaTitle: MPL 代理注册表 — Solana 链上代理身份 | Metaplex
description: 使用 MPL Core 资产在 Solana 上注册代理身份和委托执行权限的链上程序。
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
updated: '03-12-2026'
---

**MPL 代理注册表**提供链上程序，用于使用 MPL Core 资产在 Solana 上注册代理身份和委托执行权限。{% .lead %}

## Summary

MPL 代理注册表是一对链上 Solana 程序，将可验证的身份记录绑定到 MPL Core 资产，并通过执行委托档案管理执行委托。

- **代理身份程序** — 注册身份 PDA 并将带有生命周期钩子的 `AgentIdentity` 插件附加到 Core 资产
- **代理工具程序** — 管理执行档案和执行委托记录
- **JavaScript/TypeScript SDK** — `@metaplex-foundation/mpl-agent-registry` 提供指令构建器和账户获取器
- **主网和开发网地址相同** — 两个程序在各网络上部署于相同地址

{% callout title="选择您的路径" %}
- **快速开始？** 请参阅[快速入门](/smart-contracts/mpl-agent/getting-started)了解安装和首次注册
- **注册代理？** 请遵循[注册代理](/agents/register-agent)指南
- **读取代理数据？** 请遵循[读取代理数据](/agents/run-agent)指南
{% /callout %}

## 什么是代理注册表？

代理注册表将可验证的链上身份记录绑定到 MPL Core 资产。注册会创建一个 PDA（程序派生地址），使代理可在链上被发现，并将带有 Transfer、Update 和 Execute 事件生命周期钩子的 `AgentIdentity` 插件附加到 Core 资产。

一旦代理拥有身份，**代理工具**程序就允许资产所有者将执行权限委托给执行档案——允许指定的权限方代表代理资产执行操作。

## 程序

| 程序 | 地址 | 目的 |
|------|------|------|
| **[代理身份](/smart-contracts/mpl-agent/identity)** | `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p` | 注册身份并将生命周期钩子附加到 Core 资产 |
| **[代理工具](/smart-contracts/mpl-agent/tools)** | `TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S` | 执行档案和执行委托 |

## 工作原理

### 身份注册

1. 使用 MPL Core 资产和 `agentRegistrationUri` 调用 `RegisterIdentityV1`
2. 程序从种子 `["agent_identity", <asset>]` 创建派生的 PDA
3. 程序通过 CPI 调用 MPL Core，附加带有 URI 和 Transfer、Update、Execute 生命周期检查的 `AgentIdentity` 插件
4. PDA 存储资产的公钥以供反向查找

### 执行委托

1. 执行者通过 `RegisterExecutiveV1` 注册档案
2. 资产所有者调用 `DelegateExecutionV1`，授予执行者代表代理资产执行的权限
3. 创建将执行档案与资产关联的委托记录 PDA

## SDK

| 语言 | 包 |
|------|-----|
| JavaScript/TypeScript | `@metaplex-foundation/mpl-agent-registry` |

```shell
npm install @metaplex-foundation/mpl-agent-registry
```

## 下一步

1. **[快速入门](/smart-contracts/mpl-agent/getting-started)** — 安装、设置和首次注册
2. **[代理身份](/smart-contracts/mpl-agent/identity)** — 身份程序详情、账户和 PDA 派生
3. **[代理工具](/smart-contracts/mpl-agent/tools)** — 执行档案和执行委托

*由 [Metaplex](https://github.com/metaplex-foundation) 维护 · 最后验证于 2026 年 3 月 · [在 GitHub 上查看源代码](https://github.com/metaplex-foundation/mpl-agent)*
