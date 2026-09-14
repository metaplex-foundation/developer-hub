---
title: 钱包分发
metaTitle: MPL-Distro 钱包领取与 Merkle 证明
description: 构建钱包分配树、配置领取权限，并提交 MPL-Distro 代币领取。
keywords:
  - MPL-Distro wallet distribution
  - Merkle proof format
  - permissionless token claim
  - Solana airdrop
about:
  - MPL-Distro
  - Wallet Claims
  - Merkle Trees
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '08-25-2026'
updated: '08-27-2026'
howToSteps:
  - 定义钱包分配和唯一 nonce。
  - 生成并存储 Merkle 根和证明。
  - 以所需提交模式创建 Wallet 分发。
  - 用 distribute 指令提交每笔分配。
howToTools:
  - MPL-Distro JavaScript SDK 0.4.x
  - Umi
faqs:
  - q: 后端能否在接收方不签名的情况下提交领取？
    a: 可以。Permissionless 模式允许中继者支付 SOL 并提交证明。代币仍到达叶子地址。这用于无 gas 领取，不是 SPL 转账的批量替代。
  - q: 什么阻止同一钱包分配被领取两次？
    a: 确定性领取收据 PDA 记录每个唯一的 distribution、recipient、amount 和 nonce 元组。
  - q: totalClaimants 会限制成功领取次数吗？
    a: 不会。totalClaimants 是元数据；Merkle 包含和可用金库资金决定分配能否领取。
  - q: Core 资产分配叶子应放入哪个地址？
    a: 使用 Core 资产签名者 PDA。distributeToAssetAndClaim 随后将代币转移到当前所有者。
---

钱包分发将固定代币量分配给公钥，并通过 `distribute` 验证每笔分配。 {% .lead %}

## 摘要

钱包分发以钱包或其他公钥作为 Merkle 叶子 identity，并始终将分配转入该 identity 的 associated token account。

- 用 `prepareDistribution` 生成兼容的根和证明。
- 当重复的接收方和 amount 分配必须保持不同时设置 nonce。
- 选择与应用程序签名模型匹配的 distributor 模式。
- 保存每份证明，因为无法仅从链上根重建证明。

## 钱包分配形态

每笔钱包分配包含地址、代币基本单位的 amount，以及可选的无符号 64 位 nonce。

{% code-tabs-imported from="mpl-distro/wallet_allocations" frameworks="umi" filename="walletAllocations" /%}

amount 必须大于零。nonce 默认为零，仅当两片叶子否则会包含相同地址和 amount 时才应更改。

## MPL-Distro Merkle 格式

MPL-Distro 使用 Keccak-256 和已排序的内部节点对来哈希分配数据。

| 元素 | 编码 |
|---|---|
| Leaf data | `recipient_pubkey[32] || amount_u64_le || nonce_u64_le` |
| Leaf hash | `keccak256("claim" || leaf_data)` |
| Internal node | `keccak256(0x01 || min(left,right) || max(left,right))` |
| Odd node | 与自身配对 |
| Proof item | 一个 32 字节兄弟哈希 |
| Maximum configured height | 64 |

请使用 SDK 辅助函数，而不是独立实现此格式。用 SHA-256、大端整数、未排序对或不同域前缀生成的证明会以 `InvalidClaimProof` 失败。

{% callout title="树高度是证明上限" type="note" %}
链上 `treeHeight` 限制证明长度；它不会独立验证 `totalClaimants`。请传递 `prepareDistribution` 返回的值。
{% /callout %}

## 钱包领取提交模式

`allowedDistributor` 设置决定谁可以提交 `distribute`。

### Permissionless 钱包领取

Permissionless 领取允许任意有资金的支付方提交有效证明，而程序只将代币发送给已提交的接收方。

用于接收方付费的领取页面，或在有人实际领取时由中继者支付 SOL。不要用 Distro 从后端推送每一笔分配；那通常比直接 SPL 转账更贵。

### Recipient 签名的钱包领取

Recipient 领取要求已提交的接收方签署交易。

当受益人必须明确接受分配，或仅凭证明访问不得授权提交时使用此模式。

### Permissioned 钱包领取

Permissioned 领取需要配置的 `permissionedDistributor` 签名者。

当一个后端在更宽的链上领取窗口内控制释放时机时使用此模式。权限方稍后可以 [更改 permissioned distributor](/zh/smart-contracts/mpl-distro/updates#更改-permissioned-distributor)。

{% callout title="创建时设置 Permissioned Distributor" type="warning" %}
`createDistribution` 将 `permissionedDistributor` 默认为 System Program 公钥。当 `allowedDistributor` 为 `Permissioned` 时请传入真实 distributor 地址，否则每笔领取都会以 `InvalidDistributor` 失败。
{% /callout %}

## 提交钱包领取

`distribute` 指令验证证明，必要时创建 associated token account，转移代币，并原子地记录收据。

{% code-tabs-imported from="mpl-distro/claim_distribution" frameworks="umi" filename="claimDistribution" /%}

支付方支付交易费、{% fee product="mpl-distro" config="claim" fee="protocolFee" /%} 协议费和账户租金。可选领取收据租金补贴见 [注资与回收](/zh/smart-contracts/mpl-distro/funding-and-recovery)。

## 钱包领取收据

领取收据防止一笔精确分配被处理超过一次。

| 字段 | 值 |
|---|---|
| PDA seeds | `["claim_receipt", distribution, recipient, amount_le, nonce_le]` |
| Stored distribution | 分发 PDA |
| Stored recipient | 叶子中的钱包或公钥 |
| Stored amount | 已领取的代币基本单位 |
| Stored nonce | 叶子 nonce |
| Account size | 88 字节 |

在当前程序中，领取收据是永久的，没有关闭指令。

## 向 Core 资产签名者领取

`distributeToAssetAndClaim` 将 `Wallet` 分配领取到 [MPL Core](/zh/smart-contracts/core) 资产签名者 PDA，然后用 [Core Execute](/zh/smart-contracts/core/execute-asset-signing) 将代币转移到当前所有者。

从每个资产的签名者 PDA 构建 Merkle 叶子，而不是从所有者钱包。辅助函数随后从该 PDA 的 associated token account 转出已领取代币。

{% code-tabs-imported from="mpl-distro/claim_to_core_asset" frameworks="umi" filename="claimToCoreAsset" /%}

此辅助函数是 `Wallet` 分发流程。它不是 `LegacyNft` 领取，也不会在链上验证 Core 集合成员资格。

## 钱包分发安全检查清单

生产钱包分发应在发布根之前校验分配完整性。

- 确认分配之和不超过计划存款。
- 调用 SDK 之前拒绝零、负数或超出范围的 amount。
- 分配确定性 nonce 并与证明一起存储。
- 针对最终根测试随机证明和每个边缘分配。
- 将权限方和 permissioned-distributor 密钥放在浏览器应用程序之外。
- 确认集群时间戳，并在开始和结束边界周围留出运营时间。

## 注意事项

钱包分发可以使用任意公钥作为叶子 identity，但默认目的地是其 SPL 代币 associated token account。

- Core 资产领取使用 `distributeToAssetAndClaim`，并要求 Merkle 叶子中有资产签名者 PDA。
- `totalClaimants` 不是链上领取上限。
- 即使证明有效，金库代币不足时仍会失败。
- 两个精确边界时间戳都会接受领取：`startTime <= now <= endTime`。

## 常见问题

### 后端能否在接收方不签名的情况下提交领取？

可以。`Permissionless` 分发允许中继者支付 SOL 并提交证明。代币仍到达叶子地址。用于让没有 SOL 的接收方能够领取，而不是替代批量 SPL 转账。

### 什么阻止同一钱包分配被领取两次？

确定性领取收据 PDA 记录每个唯一的 distribution、recipient、amount 和 nonce 元组。

### totalClaimants 会限制成功领取次数吗？

不会。`totalClaimants` 是元数据；Merkle 包含和可用金库资金决定分配能否领取。

### Core 资产分配叶子应放入哪个地址？

使用 Core 资产签名者 PDA。`distributeToAssetAndClaim` 随后将代币转移到当前所有者。
