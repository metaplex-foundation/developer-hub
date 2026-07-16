---
title: 継承ロイヤリティの読み取り
metaTitle: 継承ロイヤリティの読み取り - Bubblegum V2 - Metaplex
description: ウォレット、マーケットプレイス、インデクサー、その他のクライアントが、MPL-Coreコレクションから販売者手数料を継承するBubblegum V2 cNFTのDAS getAssetレスポンスをどのように読むべきかを説明します。
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
  - q: royalty.basis_pointsが65535と表示されるのはなぜですか？
    a: オンチェーンの継承センチネルです。ユーザー向けのコレクション料率にはroyalty.basis_points_inheritedを使用してください。
  - q: 継承されたcNFTでcreatorsが空なのはなぜですか？
    a: SFBPが継承される場合、リーフのcreatorsは空でなければなりません。コレクションのロイヤリティ受取人にはcreators_inheritedを使用してください。
  - q: 継承していないcNFTについて変更は必要ですか？
    a: いいえ。継承を使用しない場合、*_inheritedフィールドは省略され、主なroyaltyとcreatorsフィールドは従来どおり動作します。
---

## 概要

Bubblegum V2は、リーフ上に販売者手数料を**継承センチネル**（`65535`）として保存し、MPL-CoreコレクションのRoyaltiesプラグインから実効料率を解決できます。DASはハッシュ用に主フィールドへリーフ値を保持し、表示用に `*_inherited` フィールドを追加します。

- **リーフフィールド**は証明、ハッシュ、書き込み命令に使用
- **`*_inherited` フィールド**はロイヤリティUIと支払い表示に使用
- 非継承アセットは変更なし — `*_inherited` は省略されます

このページは、`getAsset` / DASレスポンスを**読む**すべてのクライアント（ウォレット、マーケットプレイス、インデクサー、分析、アプリ）向けです。継承ロイヤリティのcNFTのミントと更新については、[ミント](/ja/smart-contracts/bubblegum-v2/mint-cnfts#inheriting-royalties-from-the-collection)および[更新](/ja/smart-contracts/bubblegum-v2/update-cnfts#inherited-royalties)を参照してください。

## 適用タイミング

次の条件を満たす場合、cNFTは継承ロイヤリティを使用しています:

- `Royalties` プラグインを持つMPL-Coreコレクション内のBubblegum V2アセットであり、かつ
- リーフの販売者手数料が継承センチネル `65535`（`0xffff`）である

DASはコレクションロイヤリティを解決できる場合、`royalty.basis_points` を `65535` に設定し、継承フィールドを埋めます。

## フィールドマップ

| 用途 | フィールド |
|------|------------|
| ハッシュ、マークル証明、書き込み命令 | `royalty.basis_points`、`royalty.percent`、`creators` |
| 表示料率 / ロイヤリティUI | `royalty.basis_points_inherited`、`royalty.percent_inherited` |
| 受取人表示 / 支払い分割 | `creators_inherited` |

### リーフ（正規 / ハッシュ）

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

- `basis_points: 65535` は **655.35% のロイヤリティではありません** — リーフデータハッシュで使われるオンチェーンセンチネルです。
- 継承SFBPでは `creators: []` が想定されます。継承フィールドがある場合、空のcreators配列を「ロイヤリティ受取人がいない」と解釈しないでください。

### 表示（コレクションから解決）

| フィールド | 例 | 意味 |
|------------|-----|------|
| `royalty.basis_points_inherited` | `750` | ベーシスポイント単位のコレクション料率（7.5%） |
| `royalty.percent_inherited` | `0.075` | 同じ料率の小数表現 |
| `creators_inherited` | `[{ address, share, verified }]` | コレクション Royalties プラグインのクリエイター |

コレクションを解決できない場合、`basis_points` が `65535` のまま `*_inherited` が省略されることがあります。

## 検出と表示ヘルパー

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

`@metaplex-foundation/digital-asset-standard-api` を使う場合:

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

## やってはいけないこと

- ユーザー向けロイヤリティ料率として `65535` や `6.5535%` を**表示しないでください**。
- 継承使用時に、空の `creators` をロイヤリティ受取人なしと**仮定しないでください**。
- リーフハッシュの再計算や Bubblegum 書き込み命令の構築時に、`basis_points_inherited` や `creators_inherited` を**使わないでください** — リーフの `basis_points` とリーフの `creators` が必要です。

## Bubblegum SDK に関する注意

`getAssetWithProof` は書き込み命令が正しくハッシュされるよう、DASの**リーフ**フィールドから `metadata` を構築します。`getAssetWithProof` 後にUI料率が必要な場合は、`rpcAsset.royalty.basis_points_inherited` と `rpcAsset.creators_inherited` を読んでください。[JavaScript SDK](/ja/smart-contracts/bubblegum-v2/sdk/javascript#getassetwithproof-and-inherited-royalties)を参照してください。

## 関連

- [圧縮NFTの取得](/ja/smart-contracts/bubblegum-v2/fetch-cnfts)
- [ミント — ロイヤリティの継承](/ja/smart-contracts/bubblegum-v2/mint-cnfts#inheriting-royalties-from-the-collection)
- [cNFTの更新 — 継承ロイヤリティ](/ja/smart-contracts/bubblegum-v2/update-cnfts#inherited-royalties)
- [NFTデータのハッシュ化](/ja/smart-contracts/bubblegum-v2/hashed-nft-data)
- [DAS getAsset](/ja/dev-tools/das-api/methods/get-asset)
- [FAQ — 継承ロイヤリティ](/ja/smart-contracts/bubblegum-v2/faq#inherited-royalties)
