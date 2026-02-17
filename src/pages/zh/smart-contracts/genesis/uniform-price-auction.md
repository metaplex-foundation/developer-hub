---
title: Uniform Price Auction
metaTitle: Genesis 拍卖 | IDO 与 Solana 代币拍卖 | Metaplex
description: Solana 上的 IDO 风格代币拍卖，采用统一清算价格。SPL 代币发行的竞争性出价——面向机构和大规模融资的链上代币发售。
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - uniform price auction
  - token auction
  - IDO
  - initial DEX offering
  - clearing price
  - price discovery
  - sealed bid
  - competitive bidding
  - token offering
  - SPL token auction
  - crypto fundraising
about:
  - Auction mechanics
  - Price discovery
  - Competitive bidding
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 什么是 Uniform Price Auction？
    a: 一种所有中标者支付相同清算价格的拍卖方式，无论其个人出价金额如何。清算价格是最低的中标出价。
  - q: 清算价格是如何确定的？
    a: 出价按价格排序。清算价格设定在总出价数量等于可用代币数量的点上，所有中标者支付此统一价格。
  - q: 出价可以是私密的吗？
    a: 可以。Uniform Price Auction 支持公开和私密（密封）出价，具体取决于您的配置。
  - q: 什么时候应该使用 Uniform Price Auction？
    a: 当需要对大型参与者（鲸鱼、基金）进行价格发现时使用，他们更偏好结构化的拍卖形式，而非基于存款的发行方式。
---

**Uniform Price Auction** 为 Solana 上的代币发行提供 IDO 风格的竞争性出价机制。所有中标者支付相同的清算价格——即最低的中标出价——确保结构化代币发售和链上融资中公平的价格发现。 {% .lead %}

{% callout title="您将学到什么" %}
本概述涵盖：
- Uniform Price Auction 的工作原理
- 何时使用拍卖与其他发行机制
- 关键概念：出价、清算价格、分配
{% /callout %}

## 概要

Uniform Price Auction 在拍卖窗口期间收集出价，然后以单一清算价格分配代币。

- 用户以其选择的价格对代币数量进行出价
- 出价按价格排序；代币分配给出价最高者
- 所有中标者支付相同的清算价格（最低的中标出价）
- 支持公开或密封（私密）出价

## 不在范围内

固定价格销售（参见 [Presale](/zh/smart-contracts/genesis/presale)）、按比例分配（参见 [Launch Pool](/zh/smart-contracts/genesis/launch-pool)）以及拍卖后的流动性设置。

## 使用场景

| 使用场景 | 描述 |
|----------|-------------|
| **价格发现** | 通过竞争性出价让市场确定公平的代币价格 |
| **鲸鱼/基金参与** | 结构化的拍卖形式吸引大型机构参与者 |
| **受控访问** | 可根据需求设置门控或无门控 |

## 工作原理

1. **拍卖开启** - 用户提交出价，指定数量和价格
2. **出价期** - 出价累积（公开或密封）
3. **拍卖关闭** - 出价按价格从高到低排序
4. **设定清算价格** - 总出价数量等于可用代币的价格点
5. **分配** - 中标者获得代币，所有人支付清算价格

### 清算价格示例

```
Available tokens: 1,000,000
Bids received:
  - Bidder A: 500,000 tokens @ 0.001 SOL
  - Bidder B: 300,000 tokens @ 0.0008 SOL
  - Bidder C: 400,000 tokens @ 0.0006 SOL

Ranking (highest price first):
  1. Bidder A: 500,000 @ 0.001 SOL    (running total: 500,000)
  2. Bidder B: 300,000 @ 0.0008 SOL   (running total: 800,000)
  3. Bidder C: 400,000 @ 0.0006 SOL   (running total: 1,200,000)

Clearing price: 0.0006 SOL (Bidder C's price fills the auction)
Bidder C receives partial fill: 200,000 tokens
All winners pay 0.0006 SOL per token
```

## 对比

| 特性 | Launch Pool | Presale | Uniform Price Auction |
|---------|-------------|---------|----------------------|
| 价格 | 结束时发现 | 预先固定 | 清算价格 |
| 分配方式 | 按比例分配 | 先到先得 | 出价最高者 |
| 用户操作 | 存款 | 存款 | 出价（价格 + 数量） |
| 最适合 | 公平分配 | 可预测结果 | 大型参与者 |

## 注意事项

- Uniform Price Auction 适合有机构参与者兴趣的大型代币发行
- 清算价格机制确保所有中标者获得相同的价格
- 密封出价防止出价者根据他人的出价进行博弈

{% callout type="note" %}
Uniform Price Auction 的详细设置文档即将推出。目前，请参见 [Launch Pool](/zh/smart-contracts/genesis/launch-pool) 或 [Presale](/zh/smart-contracts/genesis/presale) 了解替代发行机制。
{% /callout %}

## 常见问题

### 什么是 Uniform Price Auction？
一种所有中标者支付相同清算价格的拍卖方式，无论其个人出价金额如何。清算价格是最低的中标出价。

### 清算价格是如何确定的？
出价按价格从高到低排序。清算价格设定在总出价数量等于可用代币数量的点上，所有中标者支付此统一价格。

### 出价可以是私密的吗？
可以。Uniform Price Auction 支持公开和私密（密封）出价，具体取决于您的配置。

### 什么时候应该使用 Uniform Price Auction？
当需要对大型参与者（鲸鱼、基金）进行价格发现时使用，他们更偏好结构化的拍卖形式，而非基于存款的发行方式。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Uniform Price Auction** | 所有中标者支付相同清算价格的拍卖方式 |
| **清算价格** | 最低的中标出价价格；所有中标者支付此价格 |
| **出价** | 用户指定代币数量和每代币价格的报价 |
| **密封出价** | 对其他参与者不可见的私密出价 |
| **部分成交** | 由于供应有限，出价仅被部分满足 |
| **价格发现** | 通过出价确定市场价值的过程 |

## 后续步骤

- [Launch Pool](/zh/smart-contracts/genesis/launch-pool) - 公平发射与按比例代币分配
- [Presale](/zh/smart-contracts/genesis/presale) - ICO 风格固定价格代币销售
- [发行代币](/zh/tokens/launch-token) - 端到端代币发行指南
- [Genesis 概览](/zh/smart-contracts/genesis) - 代币发射台概念与架构
