---
title: 生产交付
metaTitle: 在生产中交付 MPL-Distro 领取
description: 持久化 Merkle 证明，为接收方提供领取途径，并在窗口结束后回收未领取的 MPL-Distro 代币。
keywords:
  - MPL-Distro airdrop
  - Merkle proof delivery
  - token claim page
  - recover unclaimed tokens
about:
  - MPL-Distro
  - Claim Delivery
  - Token Airdrop
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '08-27-2026'
updated: '08-27-2026'
howToSteps:
  - 选择与谁应签名相匹配的领取提交模式。
  - 持久化每笔分配的地址、amount、nonce 和证明。
  - 通过领取页面或查询 API 交付这些记录。
  - 领取窗口结束后回收未领取代币。
howToTools:
  - MPL-Distro JavaScript SDK 0.4.x
  - Umi
faqs:
  - q: MPL-Distro 会托管领取网站吗？
    a: 不会。程序只存储 Merkle 根。应用程序必须持久化证明并提供领取页面或 API。
  - q: 电子邮件或 Discord 句柄可以作为 Merkle 叶子吗？
    a: 不可以。叶子是钱包公钥或旧版 NFT mint。链下渠道可以通知用户，但它们不是链上 identity。
  - q: 公开 Merkle 证明安全吗？
    a: 在 Permissionless 模式下，任何持有有效证明的人都可以提交领取；代币仍到达叶子地址。当仅凭证明访问不得授权提交时，请使用 Recipient 模式。
  - q: 后端是否应自行提交每一份 Merkle 证明？
    a: 不应该。每笔 Distro 领取都支付协议费，通常比 SPL 转账更贵。用中继者为用户发起的领取支付 SOL，或在部分分配可能未被领取时使用 Distro。
  - q: 何时可以回收未领取代币？
    a: 权限方可以在开始时间戳之前或结束时间戳之后提取代币。分发处于活动状态时提取会被拒绝。
---

[MPL-Distro](/zh/smart-contracts/mpl-distro) 在链上只存储 Merkle 根。生产空投将每笔分配的证明持久化在链下，并为接收方提供提交途径。 {% .lead %}

## 摘要

生产交付是围绕 MPL-Distro 分发的链下工作：存储领取记录、将其提供给正确的领取人，并在窗口结束时回收剩余。

- 用 [入门指南](/zh/smart-contracts/mpl-distro/getting-started) 流程或 [Metaplex CLI](/zh/dev-tools/cli/distro) 创建并注资分发。
- 在领取开放前持久化每笔分配的 `address`、`amount`、`nonce` 和 `proof`。
- 选择与谁应签名相匹配的 [Permissionless、Recipient 或 Permissioned](/zh/smart-contracts/mpl-distro/wallet-distribution#钱包领取提交模式) 提交。
- 窗口结束后用 [注资与回收](/zh/smart-contracts/mpl-distro/funding-and-recovery) 回收未领取代币。

{% callout title="没有托管的领取界面" type="note" %}
MPL-Distro 不提供领取网站，也不提供电子邮件、短信或 Discord identity。[Metaplex CLI](/zh/dev-tools/cli/distro) 可以创建、注资、查看和回收分发；它不生成 Merkle 证明，也不提交领取。通过你已在使用的任何渠道通知用户；链上叶子仍然是钱包或 [旧版 NFT](/zh/smart-contracts/mpl-distro/legacy-nft-distribution) mint。
{% /callout %}

**跳转至：** [前置条件](#前置条件) · [提交模式](#选择领取提交模式) · [持久化记录](#持久化分配记录) · [交付证明](#交付-merkle-证明) · [回收代币](#回收未领取代币)

## 快速开始

生产 MPL-Distro 空投在链上程序周围有五个交付步骤。

1. 构建完整分配列表并用 `prepareDistribution` 生成根。
2. 为每笔分配持久化一条领取记录，然后创建并注资分发。
3. 从按钱包或 NFT mint 键控的领取页面或查询 API 提供每条记录。
4. 用存储的 amount、nonce 和证明提交 `distribute` 或 `distributeToLegacyNft`。
5. 在 `endTime` 之后提取未领取代币和未使用的收据租金补贴。

## 前置条件

生产交付从现有 [SPL 代币](/zh/solana/spl-tokens-and-token-programs) mint 和已完成的分配列表开始。

- 一份 [入门指南](/zh/smart-contracts/mpl-distro/getting-started) 分发（或后端中相同的创建和存款步骤）
- 领取记录的持久存储（数据库、对象存储或可下载文件）
- 已为租金、网络费和 {% fee product="mpl-distro" config="claim" fee="protocolFee" /%} 协议费注资的领取交易支付方
- 分发类型：[钱包](/zh/smart-contracts/mpl-distro/wallet-distribution) 或 [旧版 NFT](/zh/smart-contracts/mpl-distro/legacy-nft-distribution)

分配量是代币基本单位。对于 6 位小数的 mint，`1.0` 代币是 `1_000_000`。

## 选择领取提交模式

`allowedDistributor` 决定谁可以提交有效证明；它不改变代币去向。

| 模式 | 谁签署领取 | 典型生产形态 |
|---|---|---|
| `Permissionless` | 任意有资金的支付方 | 用户或中继者付费的领取页面；代币仍到达叶子 |
| `Recipient` | 叶子钱包或当前 NFT 所有者 | 受益人必须批准交易的领取页面 |
| `Permissioned` | 配置的 `permissionedDistributor` | 一个后端是唯一允许提交证明的签名者 |

代币始终到达叶子的规范 [associated token account](/zh/solana/understanding-solana-accounts#associated-token-accounts-atas)（`LegacyNft` 则为当前 NFT 所有者的 ATA）。Permissionless 提交不能将资金重定向到支付方。

将分发权限方和任何 permissioned-distributor 密钥放在浏览器应用程序之外。

## 持久化分配记录

每笔领取需要该叶子在 `prepareDistribution` 中使用的相同地址、amount、nonce 和证明。链上账户无法仅从根重建这些值。

从完整列表开始，然后在相同索引存储证明：

```json {% title="allocations.json" %}
[
  {
    "address": "8SoWVrwJ6vPa3rcdNBkhznR54yJ6iQqPSmgcXVGnwtEu",
    "amount": "10000000",
    "nonce": "0"
  },
  {
    "address": "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS",
    "amount": "5000000",
    "nonce": "0"
  }
]
```

{% code-tabs-imported from="mpl-distro/persist_claim_records" frameworks="umi" filename="persistClaimRecords" /%}

`createDistribution` 之后，在每条记录上存储分发 [PDA](/zh/solana/understanding-pdas)。领取交易需要该地址以及 `mint`、`amount`、`nonce` 和 `proof`。

| 字段 | 用于 | 说明 |
|---|---|---|
| `address` | 叶子 identity | 钱包公钥或旧版 NFT mint |
| `amount` | 叶子数据 | 字符串或 `bigint` 形式的代币基本单位 |
| `nonce` | 叶子数据 | 默认为 `0`；同一地址和 amount 出现两次时需要 |
| `proof` | `distribute` | 每个树层级一个 32 字节兄弟哈希，按 SDK 顺序 |
| `distribution` | `distribute` | 创建后 `findDistributionPda` 的 PDA |

{% callout title="打开领取前存储证明" type="warning" %}
在 `startTime <= now <= endTime` 期间，权限方不能更改 Merkle 根、树高度、开始时间或 claimant 数量。窗口开始前请备份完整分配文件。
{% /callout %}

## 交付 Merkle 证明

应用程序查找一条存储记录并将其传给 `distribute` 或 `distributeToLegacyNft`。MPL-Distro 不索引接收方。

常见交付形态：

1. **领取页面。** 用户连接钱包、支付网络费，并提交其存储的证明。
2. **查询 API。** 服务将 `address` → `{ amount, nonce, proof, distribution }` 映射给你的前端或中继者。
3. **赞助领取。** 接收方（或资格检查）仍触发领取。中继者支付 SOL，使用户不需要有资金的钱包。代币仍到达叶子 ATA。

赞助领取不能替代在一次后端循环中发送每一笔分配。每笔 Distro 领取仍支付 {% fee product="mpl-distro" config="claim" fee="protocolFee" /%} 协议费。若每位接收方都将立即收到代币且无需领取步骤，请使用直接 [SPL 代币](/zh/solana/spl-tokens-and-token-programs) 转账。

当部分分配可能未被领取、你需要公开 Merkle 承诺和时间窗口，或中继者应仅为实际领取的人付费时，请使用 Distro。

对于 `LegacyNft`，按 NFT mint 键控查询。在领取时解析当前所有者；除非你本意是 [钱包分发](/zh/smart-contracts/mpl-distro/wallet-distribution)，否则不要将快照所有者冻结到叶子中。

不要从链上根重建证明。用不同哈希、字节序或叶子集生成的证明会以 `InvalidClaimProof` 失败。

## 打开领取窗口

仅当集群时间位于包含性 `startTime`–`endTime` 窗口内且金库持有足够代币时，领取才会成功。

在向每位接收方开放列表之前，用 [入门指南](/zh/smart-contracts/mpl-distro/getting-started) 流程创建、存款并提交第一笔测试领取。确认：

- 持久化文件中的样本证明与 `distribute` 匹配。
- 协议费支付方有足够 SOL 支付 {% fee product="mpl-distro" config="claim" fee="protocolFee" /%} 费用和收据租金，或已为 [收据补贴](/zh/smart-contracts/mpl-distro/funding-and-recovery#为领取收据补贴注资) 注资。
- 权限方密钥未暴露给领取前端。

## 监控领取

成功领取会创建永久领取收据 [PDA](/zh/solana/understanding-pdas)。获取该账户，或比较分发上的 `claimCount` / `claimAmount`，即可知道哪些分配已完成。

将该精确 `(distribution, recipient, amount, nonce)` 元组上的 `AlreadyClaimed` 视为成功。`LegacyNft` mint 的所有权转移不会重置收据。

## 回收未领取代币

仅当分发非活动时（`startTime` 之前或 `endTime` 之后），分发权限方才提取剩余代币和未使用的补贴 SOL。

`withdraw` 和 `withdrawSubsidy` 见 [注资与回收](/zh/smart-contracts/mpl-distro/funding-and-recovery#回收未领取代币)。在结束时间戳周围留出运营余量，以免最后一批领取与回收交易竞态。

## 生产交付检查清单

在用户依赖之前，将链下文件对照链上根进行校验。

- `amount` 值之和由金库存款覆盖。
- 每份持久化证明都是同一列表、同一顺序的 `prepareDistribution` 输出。
- 当泄露的证明不得足以提交时使用 `Recipient` 模式。
- 领取前端从不持有分发权限方。
- 未领取代币有可以在 `endTime` 之后调用 `withdraw` 的所有者。

## 注意事项

MPL-Distro 不能替代你的分配数据库、通知渠道或领取 UI。

- `totalClaimants` 是元数据，并不限制成功证明的数量。
- 领取收据不会被关闭，因此收据租金保持已分配。
- 大型列表应在受控 Node.js 进程中构建；`prepareDistribution` 在 1,000 个叶子时切换实现。

## 常见问题

### MPL-Distro 会托管领取网站吗？

不会。程序只存储 Merkle 根。应用程序必须持久化证明并提供领取页面或 API。

### 电子邮件或 Discord 句柄可以作为 Merkle 叶子吗？

不可以。叶子是钱包公钥或旧版 NFT mint。链下渠道可以通知用户，但它们不是链上 identity。

### 公开 Merkle 证明安全吗？

在 `Permissionless` 模式下，任何持有有效证明的人都可以提交领取；代币仍到达叶子地址。当仅凭证明访问不得授权提交时，请使用 `Recipient` 模式。

### 后端是否应自行提交每一份 Merkle 证明？

不应该。从后端提交每一份证明通常比 [SPL 代币](/zh/solana/spl-tokens-and-token-programs) 转账更贵，因为每笔 Distro 领取都支付协议费。使用中继者让没有 SOL 的用户仍能领取，或在部分分配可能未被领取且你需要 Merkle 窗口时使用 Distro。

### 何时可以回收未领取代币？

权限方可以在开始时间戳之前或结束时间戳之后提取代币。当 `startTime <= clusterTime <= endTime` 时提取会被拒绝。
