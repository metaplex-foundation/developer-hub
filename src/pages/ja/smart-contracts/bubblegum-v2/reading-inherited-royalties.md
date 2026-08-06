---
title: 継承ロイヤリティの読み取り
metaTitle: 継承ロイヤリティの読み取り - Bubblegum V2 - Metaplex
description: ウォレット、マーケットプレイス、インデクサー、その他のクライアントが、MPL-Coreコレクションから販売者手数料を継承するBubblegum V2 cNFTのDAS getAssetレスポンスをどのように読むべきかを説明します。
created: '07-16-2026'
updated: '08-06-2026'
keywords:
  - inherited royalties
  - seller fee basis points
  - DAS API
  - getAsset
  - basis_points_raw
  - creators_raw
  - inherited
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
  - q: royalty.basis_points_rawが65535と表示されるのはなぜですか？
    a: リーフハッシュに使われるオンチェーン継承センチネルです。royalty.basis_pointsにはすでに表示用のコレクション料率が入っています。
  - q: 継承されたcNFTでcreators_rawが空なのはなぜですか？
    a: SFBPが継承される場合、リーフのcreatorsは空でなければなりません。コレクションのロイヤリティ受取人にはcreatorsを使用してください。
  - q: 継承していないcNFTについて変更は必要ですか？
    a: いいえ。継承を使用しない場合、_rawフィールドとinheritedは省略され、主なroyaltyとcreatorsフィールドは従来どおり動作します。
---

## 概要

Bubblegum V2は、リーフ上に販売者手数料を**継承センチネル**（`65535`）として保存し、MPL-CoreコレクションのRoyaltiesプラグインから実効料率を解決できます。DASは**コレクションから解決された値を主フィールドに置き**（表示用）、リーフ値は `_raw` フィールドに公開します（ハッシュ用）。

- **主フィールド**（`royalty.basis_points`、`creators`）はロイヤリティUIと支払い表示に使用
- **`_raw` フィールド**（`royalty.basis_points_raw`、`creators_raw`）は証明、ハッシュ、書き込み命令に使用
- 非継承アセットは変更なし — `_raw` / `inherited` は省略されます

このページは、`getAsset` / DASレスポンスを**読む**すべてのクライアント（ウォレット、マーケットプレイス、インデクサー、分析、アプリ）向けです。継承ロイヤリティのcNFTのミントと更新については、[ミント](/ja/smart-contracts/bubblegum-v2/mint-cnfts#inheriting-royalties-from-the-collection)および[更新](/ja/smart-contracts/bubblegum-v2/update-cnfts#inherited-royalties)を参照してください。

## 適用条件

次の条件を満たすとき、cNFTは継承ロイヤリティを使用しています。

- `Royalties` プラグインを持つMPL-Coreコレクション内のBubblegum V2アセットであり、かつ
- リーフの販売者手数料が継承センチネル `65535`（`0xffff`）である

コレクションロイヤリティを主フィールドに解決できる場合、DASは `royalty.inherited: true` と `royalty.basis_points_raw: 65535` でこれを示します。

## フィールド対応表

| 用途 | フィールド |
|------|------------|
| 表示料率 / ロイヤリティUI | `royalty.basis_points`、`royalty.percent` |
| 受取人表示 / 支払い分割 | `creators` |
| ハッシュ、マークル証明、書き込み命令 | `royalty.basis_points_raw`、`creators_raw` |
| 継承モードの検出 | `royalty.inherited`（または `basis_points_raw === 65535`） |

### 例: DASレスポンス（継承）

```json
"royalty": {
  "royalty_model": "creators",
  "target": null,
  "percent": 0.075,
  "basis_points": 750,
  "basis_points_raw": 65535,
  "inherited": true,
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

- `basis_points: 750` はユーザーに見せるコレクション料率（7.5%）です。
- `basis_points_raw: 65535` はリーフデータハッシュに使われるオンチェーンセンチネルであり — **655.35%のロイヤリティではありません**。
- `creators` はコレクション Royalties プラグインの受取人、`creators_raw: []` はハッシュ用のリーフ creators 配列です。

コレクションを解決できない場合、`basis_points` はフォールバックすることがあり、`basis_points_raw` は `65535` のままです。

## 検出と表示ヘルパー

```ts
const INHERIT = 0xffff // 65535

function isInheritedRoyalty(royalty: {
  basis_points: number
  basis_points_raw?: number | null
  inherited?: boolean | null
}): boolean {
  return (
    royalty.inherited === true ||
    royalty.basis_points_raw === INHERIT
  )
}

function leafBasisPoints(royalty: {
  basis_points: number
  basis_points_raw?: number | null
  inherited?: boolean | null
}): number {
  if (royalty.basis_points_raw != null) return royalty.basis_points_raw
  if (royalty.inherited) return INHERIT
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

`@metaplex-foundation/digital-asset-standard-api` を使う場合:

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

## やってはいけないこと

- `65535` や `6.5535%` をユーザー向けロイヤリティ料率として**表示しないでください** — その値は `basis_points_raw` にあります。
- 空の `creators_raw` がロイヤリティ受取人がいないことを意味すると**仮定しないでください**；表示用の受取人は `creators` にあります。
- リーフハッシュの再計算や Bubblegum 書き込み命令の構築時に、主フィールドの `basis_points` / `creators` を**使わないでください** — `basis_points_raw` と `creators_raw` を使ってください。

## Bubblegum SDK の注意

`getAssetWithProof` は書き込み命令が正しくハッシュされるよう、DASの**リーフ**フィールド（`basis_points_raw`、`creators_raw`）から `metadata` を構築します。`getAssetWithProof` 後にUI料率が必要な場合は、`rpcAsset.royalty.basis_points` と `rpcAsset.creators` を読んでください。[JavaScript SDK](/ja/smart-contracts/bubblegum-v2/sdk/javascript#getassetwithproof-and-inherited-royalties)を参照してください。

## 関連

- [圧縮NFTの取得](/ja/smart-contracts/bubblegum-v2/fetch-cnfts)
- [ミント — ロイヤリティの継承](/ja/smart-contracts/bubblegum-v2/mint-cnfts#inheriting-royalties-from-the-collection)
- [cNFTの更新 — 継承ロイヤリティ](/ja/smart-contracts/bubblegum-v2/update-cnfts#inherited-royalties)
- [NFTデータのハッシュ](/ja/smart-contracts/bubblegum-v2/hashed-nft-data)
- [DAS getAsset](/ja/dev-tools/das-api/methods/get-asset)
- [FAQ — 継承ロイヤリティ](/ja/smart-contracts/bubblegum-v2/faq#inherited-royalties)
