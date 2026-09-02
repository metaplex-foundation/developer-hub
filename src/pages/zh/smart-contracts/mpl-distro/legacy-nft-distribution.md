---
title: 旧版 NFT 分发
metaTitle: 用 MPL-Distro 向旧版 NFT 持有者分发代币
description: 按旧版 NFT mint 配置 MPL-Distro 分配，让每个 NFT 的当前所有者领取 SPL 代币。
keywords:
  - legacy NFT holder rewards
  - Token Metadata NFT airdrop
  - MPL-Distro NFT distribution
  - NFT-gated token claim
about:
  - MPL-Distro
  - Legacy NFTs
  - Holder Rewards
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '08-25-2026'
updated: '08-26-2026'
howToSteps:
  - 构建以旧版 NFT mint 地址为键的分配。
  - 创建并注资 LegacyNft 分发。
  - 解析当前 NFT 所有者和代币账户。
  - 提交 distributeToLegacyNft 领取。
howToTools:
  - MPL-Distro JavaScript SDK 0.4.x
  - Umi
faqs:
  - q: NFT 转移后谁收到分配？
    a: 领取执行时拥有 NFT 代币账户的钱包收到分配。
  - q: 之后的 NFT 所有者可以再次领取吗？
    a: 不可以。领取收据按 NFT mint、amount 和 nonce 键控，因此所有权转移不会重置它。
  - q: 此流程可以向 MPL Core 资产持有者分发代币吗？
    a: 不可以。LegacyNft 验证 SPL 代币账户所有权；Core 资产需要 Wallet 分发的资产签名者模式。
  - q: LegacyNft 适用于 pNFT 吗？
    a: 适用，前提是 pNFT 代币账户由原始 SPL Token 程序拥有且余额为 1。不支持 Token-2022 pNFT。
---

旧版 NFT 分发将代币分配附加到 NFT mint 地址，并在领取执行时向拥有每个 NFT 的钱包付款。 {% .lead %}

## 摘要

`LegacyNft` 分发以旧版 NFT mint 作为 Merkle 叶子，并在 `distributeToLegacyNft` 期间验证其当前 SPL 代币账户所有者。

- 从 NFT mint 地址而不是所有者钱包构建分配树。
- 用 `DistributionType.LegacyNft` 创建分发。
- 将分发代币发送到当前所有者的代币账户。
- 针对 NFT mint 记录收据，使所有权转移无法启用第二次领取。

{% callout title="仅限旧版 NFT" type="warning" %}
此流程验证余额为 1 的原始 SPL Token 账户。该代币程序上的 Token Metadata NFT 和 pNFT 符合条件。它与 MPL Core 资产或 Token-2022 NFT 不兼容。
{% /callout %}

## 旧版 NFT 分配模型

每笔分配提交旧版 NFT mint 地址、代币量和可选 nonce。

{% code-tabs-imported from="mpl-distro/legacy_nft_allocations" frameworks="umi" filename="legacyNftAllocations" /%}

不要从快照所有者钱包构建叶子。NFT mint 是稳定 identity，允许在领取前转移所有权。

## 旧版 NFT 所有权验证

程序在领取时从 NFT 的 SPL 代币账户验证当前所有权。

提供的 NFT 代币账户必须：

- 由原始 SPL Token 程序拥有。
- 使用 Merkle 叶子中提交的 NFT mint。
- 恰好持有 1 个代币。
- 由提供的 `nftOwner` 拥有。

程序不调用 [Token Metadata](/zh/smart-contracts/token-metadata)、Token Record 或 Authorization Rules。它只检查上面列出的 SPL 代币账户。

## 提交旧版 NFT 领取

`distributeToLegacyNft` 指令验证 mint 证明，并将代币发送到当前 NFT 所有者的 associated token account。

{% code-tabs-imported from="mpl-distro/claim_legacy_nft" frameworks="umi" filename="claimLegacyNft" /%}

省略 `nftOwner` 时，SDK 默认使用交易支付方并推导该支付方的 NFT 代币账户。当 Permissionless 服务代表另一所有者支付时，请显式提供 `nftOwner`。

{% code-tabs-imported from="mpl-distro/sponsored_legacy_nft_claim" frameworks="umi" filename="sponsoredLegacyNftClaim" /%}

## 旧版 NFT 领取收据

旧版 NFT 收据将 NFT mint 存储为其接收方 identity。

| 收据组成部分 | 值 |
|---|---|
| Recipient seed | NFT mint，不是所有者钱包 |
| Destination | 当前所有者针对分发 mint 的 associated token account |
| Ownership transfer effect | 改变谁可以收到未领取分配 |
| Repeat claim after transfer | 被拒绝，因为收据仍绑定到 NFT mint |

## 旧版 NFT 分发访问模式

Allowed distributor 模式适用于 NFT 所有者，而不是 NFT mint。

| 模式 | 领取签名者要求 |
|---|---|
| `Permissionless` | 任意支付方可以为已验证的当前所有者提交 |
| `Recipient` | 当前 `nftOwner` 必须签名 |
| `Permissioned` | 配置的 permissioned distributor 必须签名 |

当当前持有者必须选择加入时使用 `Recipient`。当中继者可以为已验证的当前所有者支付领取而无需该所有者签名时使用 `Permissionless`。

## 旧版 NFT 快照注意事项

Merkle 树固定符合条件的 NFT mint，而所有权在每个 mint 领取之前保持动态。

这种区别产生两种常见模型：

1. **Mint 资格模型：** 无论之后如何转移，符合条件的 NFT mint 都可以领取，领取时的所有者获得奖励。
2. **所有者快照模型：** 当快照后的转移不得移动资格时，改用快照所有者钱包并使用 [钱包分发](/zh/smart-contracts/mpl-distro/wallet-distribution)。

{% callout title="避免市场意外" type="note" %}
公开资格是跟随 NFT mint 还是快照所有者。买家可以收到未领取的基于 mint 的分配，但不能仅凭所有权判断领取状态；应用程序应检查领取收据。
{% /callout %}

## 注意事项

旧版 NFT 分发验证可替代代币账户事实，而不是完整的 NFT 元数据语义。

- 集合验证和 NFT 资格必须在生成根之前完成。
- 冻结或已委托的 NFT 代币账户仍需要应用层审查。
- 奖励代币到达 NFT 所有者的规范 associated token account。
- 当前程序在赎回后不关闭领取收据。

## 常见问题

### NFT 转移后谁收到分配？

领取执行时拥有 NFT 代币账户的钱包收到分配。

### 之后的 NFT 所有者可以再次领取吗？

不可以。领取收据按 NFT mint、amount 和 nonce 键控，因此所有权转移不会重置它。

### 此流程可以向 MPL Core 资产持有者分发代币吗？

不可以。`LegacyNft` 验证 SPL 代币账户所有权；Core 资产需要 `Wallet` 分发的资产签名者模式。

### LegacyNft 适用于 pNFT 吗？

适用，前提是 pNFT 代币账户由原始 SPL Token 程序拥有且余额为 1。程序不调用 Token Metadata、Token Record 或 Authorization Rules。不支持 Token-2022 pNFT。
