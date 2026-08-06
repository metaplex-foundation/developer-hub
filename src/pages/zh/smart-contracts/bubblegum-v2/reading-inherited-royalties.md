---
title: 读取继承版税
metaTitle: 读取继承版税 - Bubblegum V2 - Metaplex
description: 钱包、市场、索引器及其他客户端应如何读取 DAS getAsset 响应，以处理从 MPL-Core 集合继承卖家费用的 Bubblegum V2 cNFT。
created: '07-16-2026'
updated: '08-06-2026'
keywords:
  - inherited royalties
  - seller fee basis points
  - DAS API
  - getAsset
  - basis_points_raw
  - creators_raw
  - sfbp_inherited
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
  - q: 为什么 royalty.basis_points_raw 显示为 65535？
    a: 那是链上用于叶子哈希的继承哨兵值。royalty.basis_points 已包含用于展示的集合费率。
  - q: 为什么继承版税的 cNFT 上 creators_raw 为空？
    a: 当 SFBP 被继承时，叶子上的 creators 必须为空。请使用 creators 获取集合版税收款方。
  - q: 对于非继承版税的 cNFT，我需要改什么吗？
    a: 不需要。未使用继承时，_raw 字段与 sfbp_inherited 会被省略，主要的 royalty 与 creators 字段行为与之前相同。
---

## 摘要

Bubblegum V2 可以在叶子上以**继承哨兵**（`65535`）存储卖家费用，并从 MPL-Core 集合的 Royalties 插件解析有效费率。DAS 将**集合解析后的值放在主字段上**（用于展示），并在 `_raw` 字段上暴露叶子值（用于哈希）。

- 使用**主字段**（`royalty.basis_points`、`creators`）进行版税 UI 与分账展示
- 使用 **`_raw` 字段**（`royalty.basis_points_raw`、`creators_raw`）进行证明、哈希和写入指令
- 非继承资产保持不变 — `_raw` / `sfbp_inherited` 会被省略

本页面向任何**读取** `getAsset` / DAS 响应的客户端 — 钱包、市场、索引器、分析工具与应用。关于铸造与更新继承版税的 cNFT，请参阅[铸造](/zh/smart-contracts/bubblegum-v2/mint-cnfts#inheriting-royalties-from-the-collection)与[更新](/zh/smart-contracts/bubblegum-v2/update-cnfts#inherited-royalties)。

## 何时适用

当满足以下条件时，cNFT 正在使用继承版税：

- 它是位于带有 `Royalties` 插件的 MPL-Core 集合中的 Bubblegum V2 资产，并且
- 叶子上的卖家费用为继承哨兵 `65535`（`0xffff`）

当可以将集合版税解析到主字段时，DAS 会以 `royalty.sfbp_inherited: true` 和 `royalty.basis_points_raw: 65535` 表明这一点。

## 字段对照表

| 用例 | 字段 |
|------|------|
| 展示费率 / 版税 UI | `royalty.basis_points`、`royalty.percent` |
| 展示收款方 / 分账比例 | `creators` |
| 哈希、默克尔证明、写入指令 | `royalty.basis_points_raw`、`creators_raw` |
| 检测继承模式 | `royalty.sfbp_inherited`（或 `basis_points_raw === 65535`） |

### 示例 DAS 响应（继承）

```json
"royalty": {
  "royalty_model": "creators",
  "target": null,
  "percent": 0.075,
  "basis_points": 750,
  "basis_points_raw": 65535,
  "sfbp_inherited": true,
  "primary_sale_happened": false,
  "locked": false
},
"creators": [
  {
    "address": "CJkzXwVwqiaSvMuRb3obrZHdrPFjCMBJBDrjspn72tDv",
    "share": 100,
    "verified": true
  }
],
"creators_raw": []
```

- `basis_points: 750` 是向用户展示的集合费率（7.5%）。
- `basis_points_raw: 65535` 是叶子数据哈希中使用的链上哨兵 — **不是** 655.35% 的版税。
- `creators` 是集合 Royalties 插件中的收款方；`creators_raw: []` 是用于哈希的叶子 creators 数组。

如果无法解析集合，`basis_points` 可能回退，而 `basis_points_raw` 仍为 `65535`。

## 检测与展示辅助函数

```ts
const INHERIT = 0xffff // 65535

function isInheritedRoyalty(royalty: {
  basis_points: number
  basis_points_raw?: number | null
  sfbp_inherited?: boolean | null
}): boolean {
  return (
    royalty.sfbp_inherited === true ||
    royalty.basis_points_raw === INHERIT
  )
}

function leafBasisPoints(royalty: {
  basis_points: number
  basis_points_raw?: number | null
  sfbp_inherited?: boolean | null
}): number {
  if (royalty.basis_points_raw != null) return royalty.basis_points_raw
  if (royalty.sfbp_inherited) return INHERIT
  return royalty.basis_points
}

function leafCreators(asset: {
  creators: Array<{ address: string; share: number; verified: boolean }>
  creators_raw?: Array<{
    address: string
    share: number
    verified: boolean
  }> | null
}) {
  return asset.creators_raw ?? asset.creators
}
```

使用 `@metaplex-foundation/digital-asset-standard-api`：

```ts
import {
  SELLER_FEE_BASIS_POINTS_INHERIT,
  isInheritedSfbpRoyalty,
  getRawSellerFeeBasisPoints,
  getResolvedSellerFeeBasisPoints,
} from '@metaplex-foundation/digital-asset-standard-api'

const royalty = asset.royalty
if (isInheritedSfbpRoyalty(royalty)) {
  const rate = getResolvedSellerFeeBasisPoints(royalty) // e.g. 750 (display)
  const leaf = getRawSellerFeeBasisPoints(royalty) // 65535
  const payees = asset.creators // collection payees
  const leafCreators = asset.creators_raw ?? []
}
```

## 不要这样做

- **不要**将 `65535` 或 `6.5535%` 作为面向用户的版税费率展示 — 该值位于 `basis_points_raw`。
- **不要**假设空的 `creators_raw` 表示没有版税收款方；展示用收款方位于 `creators`。
- 在重新计算叶子哈希或构建 Bubblegum 写入指令时，**不要**使用主字段的 `basis_points` / `creators` — 请使用 `basis_points_raw` 与 `creators_raw`。

## Bubblegum SDK 说明

`getAssetWithProof` 从 DAS 的**叶子**字段（`basis_points_raw`、`creators_raw`）构建 `metadata`，以便写入指令正确哈希。在 `getAssetWithProof` 之后如需展示费率，请读取 `rpcAsset.royalty.basis_points` 与 `rpcAsset.creators`。详见 [JavaScript SDK](/zh/smart-contracts/bubblegum-v2/sdk/javascript#getassetwithproof-and-inherited-royalties)。

## 相关内容

- [获取压缩 NFT](/zh/smart-contracts/bubblegum-v2/fetch-cnfts)
- [铸造 — 继承版税](/zh/smart-contracts/bubblegum-v2/mint-cnfts#inheriting-royalties-from-the-collection)
- [更新 cNFT — 继承版税](/zh/smart-contracts/bubblegum-v2/update-cnfts#inherited-royalties)
- [哈希 NFT 数据](/zh/smart-contracts/bubblegum-v2/hashed-nft-data)
- [DAS getAsset](/zh/dev-tools/das-api/methods/get-asset)
- [FAQ — 继承版税](/zh/smart-contracts/bubblegum-v2/faq#inherited-royalties)
