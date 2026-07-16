---
title: 读取继承版税
metaTitle: 读取继承版税 - Bubblegum V2 - Metaplex
description: 钱包、市场、索引器及其他客户端应如何读取 DAS getAsset 响应，以处理从 MPL-Core 集合继承卖家费用的 Bubblegum V2 cNFT。
created: '07-16-2026'
updated: '07-16-2026'
keywords:
  - inherited royalties
  - seller fee basis points
  - DAS API
  - getAsset
  - basis_points_inherited
  - creators_inherited
  - Bubblegum V2
about:
  - Compressed NFTs
  - DAS API
  - Royalties
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 为什么 royalty.basis_points 显示为 65535？
    a: 那是链上的继承哨兵值。向用户展示时请使用 royalty.basis_points_inherited 作为集合费率。
  - q: 为什么继承版税的 cNFT 上 creators 为空？
    a: 当 SFBP 被继承时，叶子上的 creators 必须为空。请使用 creators_inherited 获取集合版税收款方。
  - q: 对于非继承版税的 cNFT，我需要改什么吗？
    a: 不需要。未使用继承时，*_inherited 字段会被省略，主要的 royalty 与 creators 字段行为与之前相同。
---

## 摘要

Bubblegum V2 可以在叶子上以**继承哨兵**（`65535`）存储卖家费用，并从 MPL-Core 集合的 Royalties 插件解析有效费率。DAS 在主字段上保留叶子值（用于哈希），并添加 `*_inherited` 字段供展示使用。

- 使用**叶子字段**进行证明、哈希和写入指令
- 使用 **`*_inherited` 字段**进行版税 UI 与分账展示
- 非继承资产保持不变 — `*_inherited` 会被省略

本页面向任何**读取** `getAsset` / DAS 响应的客户端 — 钱包、市场、索引器、分析工具与应用。关于铸造与更新继承版税的 cNFT，请参阅[铸造](/zh/smart-contracts/bubblegum-v2/mint-cnfts#inheriting-royalties-from-the-collection)与[更新](/zh/smart-contracts/bubblegum-v2/update-cnfts#inherited-royalties)。

## 何时适用

当满足以下条件时，cNFT 正在使用继承版税：

- 它是位于带有 `Royalties` 插件的 MPL-Core 集合中的 Bubblegum V2 资产，并且
- 叶子上的卖家费用为继承哨兵 `65535`（`0xffff`）

当可以解析集合版税时，DAS 会将 `royalty.basis_points` 设为 `65535`，并填充继承字段以表明这一点。

## 字段对照表

| 用例 | 字段 |
|------|------|
| 哈希、默克尔证明、写入指令 | `royalty.basis_points`、`royalty.percent`、`creators` |
| 展示费率 / 版税 UI | `royalty.basis_points_inherited`、`royalty.percent_inherited` |
| 展示收款方 / 分账比例 | `creators_inherited` |

### 叶子（规范 / 哈希）

```json
"royalty": {
  "royalty_model": "creators",
  "target": null,
  "percent": 6.5535,
  "basis_points": 65535,
  "basis_points_inherited": 750,
  "percent_inherited": 0.075,
  "primary_sale_happened": false,
  "locked": false
},
"creators": [],
"creators_inherited": [
  {
    "address": "CJkzXwVwqiaSvMuRb3obrZHdrPFjCMBJBDrjspn72tDv",
    "share": 100,
    "verified": true
  }
]
```

- `basis_points: 65535` **不是** 655.35% 的版税 — 它是叶子数据哈希中使用的链上哨兵。
- 对于继承 SFBP，`creators: []` 是预期行为。当存在继承字段时，不要将空的 creators 数组视为“没有版税收款方”。

### 展示（从集合解析）

| 字段 | 示例 | 含义 |
|------|------|------|
| `royalty.basis_points_inherited` | `750` | 集合费率（basis points，7.5%） |
| `royalty.percent_inherited` | `0.075` | 同一费率的小数形式 |
| `creators_inherited` | `[{ address, share, verified }]` | 集合 Royalties 插件中的创作者 |

如果无法解析集合，在 `basis_points` 仍为 `65535` 的情况下，`*_inherited` 可能被省略。

## 检测与展示辅助函数

```ts
const INHERIT = 0xffff // 65535

function isInheritedRoyalty(royalty: {
  basis_points: number
  basis_points_inherited?: number | null
}): boolean {
  return (
    royalty.basis_points === INHERIT ||
    royalty.basis_points_inherited != null
  )
}

function displayBasisPoints(royalty: {
  basis_points: number
  basis_points_inherited?: number | null
}): number {
  return royalty.basis_points_inherited ?? royalty.basis_points
}

function displayCreators(asset: {
  creators: Array<{ address: string; share: number; verified: boolean }>
  creators_inherited?: Array<{
    address: string
    share: number
    verified: boolean
  }> | null
}) {
  return asset.creators_inherited ?? asset.creators
}
```

使用 `@metaplex-foundation/digital-asset-standard-api`：

```ts
import {
  SELLER_FEE_BASIS_POINTS_INHERIT,
  isInheritedSfbpRoyalty,
  getResolvedSellerFeeBasisPoints,
} from '@metaplex-foundation/digital-asset-standard-api'

const royalty = asset.royalty
if (isInheritedSfbpRoyalty(royalty)) {
  const rate = getResolvedSellerFeeBasisPoints(royalty) // e.g. 750
  const payees = asset.creators_inherited ?? asset.creators
}
```

## 不要这样做

- **不要**将 `65535` 或 `6.5535%` 作为面向用户的版税费率展示。
- 在使用继承时，**不要**假设空的 `creators` 表示没有版税收款方。
- 在重新计算叶子哈希或构建 Bubblegum 写入指令时，**不要**使用 `basis_points_inherited` 或 `creators_inherited` — 这些场景需要叶子上的 `basis_points` 与叶子上的 `creators`。

## Bubblegum SDK 说明

`getAssetWithProof` 从 DAS 的**叶子**字段构建 `metadata`，以便写入指令正确哈希。在 `getAssetWithProof` 之后如需展示费率，请读取 `rpcAsset.royalty.basis_points_inherited` 与 `rpcAsset.creators_inherited`。详见 [JavaScript SDK](/zh/smart-contracts/bubblegum-v2/sdk/javascript#getassetwithproof-and-inherited-royalties)。

## 相关内容

- [获取压缩 NFT](/zh/smart-contracts/bubblegum-v2/fetch-cnfts)
- [铸造 — 继承版税](/zh/smart-contracts/bubblegum-v2/mint-cnfts#inheriting-royalties-from-the-collection)
- [更新 cNFT — 继承版税](/zh/smart-contracts/bubblegum-v2/update-cnfts#inherited-royalties)
- [哈希 NFT 数据](/zh/smart-contracts/bubblegum-v2/hashed-nft-data)
- [DAS getAsset](/zh/dev-tools/das-api/methods/get-asset)
- [FAQ — 继承版税](/zh/smart-contracts/bubblegum-v2/faq#inherited-royalties)
