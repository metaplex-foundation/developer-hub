---
title: 入门指南
metaTitle: 在 Solana 上创建 MPL-Distro 代币分发
description: 创建 Merkle 分配、为 MPL-Distro 金库注资，并用 JavaScript SDK 提交钱包领取。
keywords:
  - MPL-Distro tutorial
  - create token distribution
  - Solana Merkle claim
  - SPL token airdrop
about:
  - MPL-Distro
  - JavaScript SDK
  - Wallet Distribution
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '08-25-2026'
updated: '08-27-2026'
howToSteps:
  - 安装 MPL-Distro 和 Umi JavaScript 包。
  - 构建并保存 Merkle 分配数据。
  - 创建链上分发并注资。
  - 提交并验证接收方领取。
howToTools:
  - Node.js 20 or newer
  - Umi
  - MPL-Distro JavaScript SDK 0.4.x
faqs:
  - q: MPL-Distro 会创建代币 mint 吗？
    a: 不会。创建分发前请先创建并注资 SPL 代币 mint。
  - q: Merkle 证明应存储在哪里？
    a: 程序只存储根，因此请将每个地址、amount、nonce 和证明存入持久数据库或领取文件。参见生产交付。
  - q: 一个钱包可以收到多笔分配吗？
    a: 可以。为每笔其他方面相同的钱包和 amount 分配指定不同的 nonce。
---

本指南使用 [MPL-Distro](/zh/smart-contracts/mpl-distro) 和 [Umi 框架](/zh/dev-tools/umi) 将现有代币发送到两个钱包。 {% .lead %}

## 摘要

MPL-Distro 启动需要现有 SPL 代币 mint、已保存的链下 Merkle 分配，以及分发金库中足够的代币。

- 用 `prepareDistribution` 构建根和证明。
- 创建为期七天、Permissionless 提交的 `Wallet` 分发。
- 在领取开始前存入所有分配之和。
- 提交树中承诺的精确 amount、nonce 和证明。

{% callout title="你将构建的内容" %}
你将创建一份两接收方分发，存入 `350,000` 代币基本单位，并提交第一位接收方的 `100,000` 单位领取。
{% /callout %}

{% callout title="从 CLI 创建并注资" type="note" %}
[Metaplex CLI](/zh/dev-tools/cli/distro) 可以创建分发并存入或提取代币。生成 Merkle 证明并提交领取请使用本 SDK 演练。
{% /callout %}

**跳转至：** [前置条件](#前置条件) · [安装](#安装-mpl-distro-sdk) · [创建](#创建钱包分发) · [注资](#为钱包分发注资) · [领取](#领取钱包分配) · [错误](#常见-mpl-distro-错误)

## 快速开始

MPL-Distro 快速开始有四个必需阶段。

1. 安装 MPL-Distro 客户端并向 Umi 注册 `mplDistro()`。
2. 生成并保存分配根、证明、amount 和 nonce。
3. 创建分发并存入完整代币分配。
4. 用 `distribute` 提交证明并验证领取收据。

## 前置条件

MPL-Distro 需要有资金的 Solana 签名者，以及由原始 SPL Token 程序拥有的现有 mint。

- Node.js 20 或更高版本
- 拥有租金、交易费和 {% fee product="mpl-distro" config="claim" fee="protocolFee" /%} 领取协议费用 SOL 的 [Umi](/zh/dev-tools/umi) identity
- 现有 [SPL 代币](/zh/solana/spl-tokens-and-token-programs) mint 及其权限方已注资的 associated token account
- 以代币基本单位表示的接收方地址和分配量（mint 的最小单位；6 位小数的代币每 1.0 代币为 `1_000_000` 单位）

{% callout type="warning" %}
示例不接受 Token-2022 mint。请使用原始 SPL Token 程序 mint。
{% /callout %}

## 安装 MPL-Distro SDK

在准备并提交交易的应用程序中安装 MPL-Distro 客户端及其 Umi 对等依赖。

```shell {% title="Terminal" %}
npm install @metaplex-foundation/mpl-distro@^0.4 \
  @metaplex-foundation/umi@^1.1 \
  @metaplex-foundation/umi-bundle-defaults \
  @metaplex-foundation/mpl-toolbox@^0.10
```

仅在向 Core 资产签名者领取时安装 [`@metaplex-foundation/mpl-core`](/zh/smart-contracts/mpl-distro/wallet-distribution#向-core-资产签名者领取)。

## 创建钱包分发

将接收方列表作为 Merkle 根提交，并将返回的证明保存在链下以创建分发。

{% code-tabs-imported from="mpl-distro/create_distribution" frameworks="umi" filename="createDistribution" /%}

`seed` 签名者使分发地址对某个 mint 唯一，因此同一代币可以有多个分发。结果 [PDA](/zh/solana/understanding-pdas) 使用 `["distribution", mint, seed]`，因此若应用程序需要再次推导地址，必须保留 seed 公钥。

{% callout title="领取期间分配数据不可变" type="warning" %}
在 `startTime <= now <= endTime` 期间，权限方不能更改 Merkle 根、树高度、开始时间或 claimant 数量。打开领取前请校验并备份完整分配文件。
{% /callout %}

## 为钱包分发注资

将至少等于所有分配之和的代币存入程序拥有的 associated token account 来为分发注资。当前分发权限方必须签署 `deposit`。

{% code-tabs-imported from="mpl-distro/fund_distribution" frameworks="umi" filename="fundDistribution" /%}

本教程只存入代币。可选的领取收据租金补贴见 [注资与回收](/zh/smart-contracts/mpl-distro/funding-and-recovery)。

## 领取钱包分配

提交从已提交列表生成的相同接收方、amount、nonce 和证明来领取分配。

{% code-tabs-imported from="mpl-distro/claim_distribution" frameworks="umi" filename="claimDistribution" /%}

程序会在需要时创建接收方的规范 associated token account，从金库转移代币，并创建领取收据。带有相同分配的第二笔交易会以 `AlreadyClaimed` 失败。

## 验证 MPL-Distro 账户

确认后通过获取分发和确定性领取收据来验证领取。

{% code-tabs-imported from="mpl-distro/verify_claim" frameworks="umi" filename="verifyClaim" /%}

## 常见 MPL-Distro 错误

MPL-Distro 错误标识不匹配的证明、窗口、权限和金库余额。

| 错误 | 原因 | 解决方法 |
|---|---|---|
| `InvalidClaimProof` | 地址、amount、nonce 或证明与已提交叶子不同 | 从同一份保存的分配记录加载所有值 |
| `DistributionNotStarted` | 集群时间戳早于 `startTime` | 等待配置的 Unix 时间戳 |
| `DistributionEnded` | 集群时间戳晚于 `endTime` | 权限方必须创建新分发 |
| `AlreadyClaimed` | 领取收据 PDA 已存在 | 将该分配视为已完成 |
| `InsufficientFunds` | 记录的分发余额低于领取金额 | 在活动窗口之前、期间或之后存入更多代币，或检查先前提取 |
| `RecipientMustSign` | 接收方门控领取缺少接收方签名者 | 以接收方作为签名者提交 |
| `InvalidDistributor` | permissioned distributor 不匹配 | 使用配置的 distributor 签名者 |

## 已验证配置

入门流程基于当前 MPL-Distro 客户端测试和生成的指令构建器。

| 组件 | 版本 |
|---|---|
| `@metaplex-foundation/mpl-distro` | 0.4.x |
| `@metaplex-foundation/umi` | 1.1.x 或更高 |
| `@metaplex-foundation/mpl-toolbox` | 0.10.x |
| Token program | 原始 SPL Token 程序 |

## 注意事项

入门流程演示小型钱包分发。[生产交付](/zh/smart-contracts/mpl-distro/production-delivery) 涵盖证明存储、领取页面和回收未领取代币。

- Unix 时间戳以秒计，不是 JavaScript 毫秒。
- 代币基本单位数量和时间戳使用 `bigint`。
- `prepareDistribution` 在 1,000 笔分配时切换到内存优化实现。
- 在受控 Node.js 进程中运行非常大的分配构建，并在向主网注资前测试证明交付。
- Permissionless 支付方可以为另一个钱包提交领取，但代币仍只到达该接收方。

## 常见问题

### MPL-Distro 会创建代币 mint 吗？

不会。创建分发前请先创建并注资 [SPL 代币](/zh/tokens/create-a-token) mint。

### Merkle 证明应存储在哪里？

程序只存储根，因此请将每个地址、amount、nonce 和证明存入持久数据库或领取文件。参见 [生产交付](/zh/smart-contracts/mpl-distro/production-delivery)。

### 一个钱包可以收到多笔分配吗？

可以。为每笔其他方面相同的钱包和 amount 分配指定不同的 nonce。
