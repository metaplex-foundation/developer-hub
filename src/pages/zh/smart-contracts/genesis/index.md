---
title: Genesis - Solana 代币发行智能合约
metaTitle: Genesis | Solana TGE 与代币发行平台 | 公平发射 | Metaplex
description: 使用 Genesis 智能合约在 Solana 上发行代币。构建代币生成事件 (TGE)、公平发射、ICO、定价销售和 Launch Pool 的链上解决方案。
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - token launch
  - TGE
  - token generation event
  - fair launch
  - ICO
  - launch pool
  - presale
  - Solana token
about:
  - Token launches
  - Genesis protocol
  - Fair distribution
proficiencyLevel: Beginner
faqs:
  - q: 什么是 Genesis？
    a: Genesis 是 Metaplex 为 Solana 上的代币生成事件 (TGE) 开发的智能合约。它为 Presale、Launch Pool 和拍卖提供链上基础设施。
  - q: Genesis 支持哪些发行机制？
    a: Genesis 支持三种机制 - Presale（固定价格）、Launch Pool（按比例分配与价格发现）和统一价格拍卖（基于出价的清算价格）。
  - q: 使用 Genesis 需要多少费用？
    a: Genesis 对存款收取 {% fee product="genesis" config="launchPool" fee="deposit" /%} 的协议费用。没有前期成本——您只需支付 Solana 交易费用以及募集资金的协议费用。
  - q: 发行后可以撤销代币权限吗？
    a: 可以。Genesis 提供了撤销铸造权限和冻结权限的指令，向持有者表明不会再铸造额外的代币。
  - q: Launch Pool 和 Presale 有什么区别？
    a: Presale 预先设定固定价格。Launch Pool 根据总存款有机地发现价格——存款越多意味着每个代币的隐含价格越高。
---

**Genesis** 是 Metaplex 为 Solana 上的**代币生成事件 (TGE)** 开发的智能合约。构建 Presale、Launch Pool 和拍卖，通过链上协调实现代币创建、分发和资金收集。{% .lead %}

{% callout title="选择您的路径" %}

- **刚接触 Genesis？** 从[快速入门](/zh/smart-contracts/genesis/getting-started)开始了解流程
- **准备好构建了？** 直接跳转到 [Launch Pool](/zh/smart-contracts/genesis/launch-pool) 或 [Presale](/zh/smart-contracts/genesis/presale)
- **需要 SDK 参考？** 查看 [JavaScript SDK](/zh/smart-contracts/genesis/sdk/javascript)
{% /callout %}

## 什么是 Genesis？

Genesis 为在 Solana 上发行代币提供链上基础设施。它处理：

- **代币创建**，包含元数据（名称、符号、图片）
- **资金收集**，来自参与者（SOL 存款）
- **分发**，基于您选择的机制
- **时间协调**，用于存款和领取窗口

将 Genesis 视为一个智能合约，它位于您（发行方）和参与者之间，确保公平、透明和自动化的代币分发。

## 发行机制

Genesis 支持三种可以组合使用的机制：

| 机制 | 价格 | 分发方式 | 最适合 |
|-----------|-------|--------------|----------|
| **[Launch Pool](/zh/smart-contracts/genesis/launch-pool)** | 结束时发现 | 按存款比例 | 公平发射、社区代币 |
| **[Presale](/zh/smart-contracts/genesis/presale)** | 预先固定 | 先到先得 | 可预测的募集、已知估值 |
| **[统一价格拍卖](/zh/smart-contracts/genesis/uniform-price-auction)** | 清算价格 | 最高出价者获胜 | 大规模募集、机构兴趣 |

### 我应该使用哪种？

**Launch Pool** - 您想要有机的价格发现和公平分配。每个存款的人都能按其份额比例获得代币。没有人会被抢先交易。

**Presale** - 您知道估值并希望价格可预测。设定固定价格，让参与者购买直到达到上限。

**拍卖** - 您希望大型参与者进行竞价。最适合有机构兴趣的成熟项目。

## 核心概念

### Genesis Account

您发行活动的中央协调器。当您初始化 Genesis Account 时，它会：

- 创建带有元数据的 SPL token
- 将总供应量铸造到托管账户
- 为添加分发 Bucket 提供基础

### Bucket

定义代币和资金如何流动的模块化组件：

| 类型 | 用途 | 示例 |
|------|---------|----------|
| **流入** | 从用户收集 SOL | Launch Pool、Presale |
| **流出** | 为团队/金库接收资金 | 解锁 Bucket |

### 时间条件

每个 Bucket 都有控制何时允许操作的时间窗口：

- **存款窗口** - 用户可以存入 SOL 的时间
- **领取窗口** - 用户可以领取代币的时间

## 协议费用

| 操作 | 费用 |
|--------|-----|
| 存款 | 存款金额的 {% fee product="genesis" config="launchPool" fee="deposit" /%} |
| 提款 | 提款金额的 {% fee product="genesis" config="launchPool" fee="withdraw" /%} |
| 领取 | 仅交易费用 |

没有前期成本。您只需为募集的资金支付费用。

## 程序信息

| 网络 | Program ID |
|---------|------------|
| Mainnet | `GENSkbxvLc7iBQvEAJv3Y5wVMHGD3RjfCNwWgU8Tqgkc` |
| Devnet | `GENSkbxvLc7iBQvEAJv3Y5wVMHGD3RjfCNwWgU8Tqgkc` |

## 安全性

发行完成后，撤销代币权限以表明不会再铸造额外的代币：

- **铸造权限** - 撤销以防止铸造新代币
- **冻结权限** - 撤销以防止冻结代币

有关权限管理的详细信息，请参阅[快速入门](/zh/smart-contracts/genesis/getting-started)。

## 常见问题

### 什么是 Genesis？

Genesis 是 Metaplex 为 Solana 上的代币生成事件 (TGE) 开发的智能合约。它为 Presale、Launch Pool 和拍卖提供链上基础设施，实现协调的代币创建和分发。

### Genesis 支持哪些发行机制？

Genesis 支持三种机制：**Launch Pool**（按比例分配与价格发现）、**Presale**（固定价格）和**统一价格拍卖**（基于出价的清算价格）。

### 使用 Genesis 需要多少费用？

Genesis 对存款收取 {% fee product="genesis" config="launchPool" fee="deposit" /%} 的协议费用。没有前期成本——您只需支付 Solana 交易费用以及募集资金的协议费用。

### 发行后可以撤销代币权限吗？

可以。Genesis 提供 `revokeMintAuthorityV2` 和 `revokeFreezeAuthorityV2` 指令来永久撤销权限。

### Launch Pool 和 Presale 有什么区别？

**Presale** 预先设定固定价格。**Launch Pool** 有机地发现价格——存款越多意味着每个代币的隐含价格越高，所有参与者按比例分配。

### 我可以组合多种发行机制吗？

可以。Genesis 使用 Bucket 系统，您可以添加多个流入 Bucket 并配置用于金库或归属的流出 Bucket。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Genesis Account** | 创建代币并管理所有 Bucket 的中央协调器 |
| **Bucket** | 定义代币/SOL 流向的模块化组件 |
| **流入 Bucket** | 从用户收集 SOL 的 Bucket |
| **流出 Bucket** | 通过结束行为接收资金的 Bucket |
| **Launch Pool** | 基于存款的分发，价格在结束时发现 |
| **Presale** | 以预定价格进行的固定价格销售 |
| **Quote Token** | 用户存入的代币（通常是 wSOL） |
| **Base Token** | 正在发行和分发的代币 |

## 后续步骤

1. **[快速入门](/zh/smart-contracts/genesis/getting-started)** - 了解 Genesis 流程
2. **[JavaScript SDK](/zh/smart-contracts/genesis/sdk/javascript)** - 安装和设置
3. **[Launch Pool](/zh/smart-contracts/genesis/launch-pool)** - 构建按比例分配的发行
4. **[Presale](/zh/smart-contracts/genesis/presale)** - 构建固定价格销售
