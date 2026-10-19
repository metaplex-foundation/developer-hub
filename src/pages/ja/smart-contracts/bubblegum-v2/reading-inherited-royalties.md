---
title: 継承ロイヤリティの読み取り
metaTitle: 継承ロイヤリティの読み取り - Bubblegum V2 - Metaplex
description: ウォレット、マーケットプレイス、インデクサー、その他のクライアントが、MPL-Coreコレクションから販売者手数料を継承するBubblegum V2 cNFTのDAS getAssetレスポンスをどのように読むべきかを説明します。
created: '07-16-2026'
updated: '10-01-2026'
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
  - q: ウォレットやマーケットプレイスで私のcNFTのロイヤリティが655.35%と表示されるのはなぜですか？
    a: そのアプリのDASプロバイダーがまだ継承ロイヤリティに対応していないためです。コレクション料率の代わりに、リーフの継承センチネル65535をroyalty.basis_points（655.35%）に返し、creatorsは空になります。オンチェーンのロイヤリティは誤っていません。アプリはアップグレード済みのDASプロバイダーを使うか、コレクションのRoyaltiesプラグインを読み取る必要があります。
  - q: 継承していないcNFTについて変更は必要ですか？
    a: いいえ。継承を使用しない場合、_rawフィールドとinheritedは省略され、主なroyaltyとcreatorsフィールドは従来どおり動作します。
---

## 概要

Bubblegum V2は、リーフ上に販売者手数料を**継承センチネル**（`65535`）として保存し、MPL-CoreコレクションのRoyaltiesプラグインから実効料率を解決できます。DASは**コレクションから解決された値を主フィールドに置き**（表示用）、リーフ値は `_raw` フィールドに公開します（ハッシュ用）。

- **主フィールド**（`royalty.basis_points`、`creators`）はロイヤリティUIと支払い表示に使用
- **`_raw` フィールド**（`royalty.basis_points_raw`、`creators_raw`）は証明、ハッシュ、書き込み命令に使用
- 非継承アセットは変更なし — `_raw` / `inherited` は省略されます
- 継承ロイヤリティ未対応のDASプロバイダーは代わりに生のセンチネルを返し、アプリではクリエイターなしの**655.35%**のロイヤリティとして表示されます

このページは、`getAsset` / DASレスポンスを**読む**すべてのクライアント（ウォレット、マーケットプレイス、インデクサー、分析、アプリ）向けです。継承ロイヤリティのcNFTのミントと更新については、[ミント](/ja/smart-contracts/bubblegum-v2/mint-cnfts#inheriting-royalties-from-the-collection)および[更新](/ja/smart-contracts/bubblegum-v2/update-cnfts#inherited-royalties)を参照してください。

## 適用条件

次の条件を満たすとき、cNFTは継承ロイヤリティを使用しています。

- `Royalties` プラグインを持つMPL-Coreコレクション内のBubblegum V2アセットであり、かつ
- リーフの販売者手数料が継承センチネル `65535`（`0xffff`）である

コレクションロイヤリティを主フィールドに解決できる場合、DASは `royalty.inherited: true` と `royalty.basis_points_raw: 65535` でこれを示します。

## フィールド対応表

表示用の値とリーフの値は別々のDASフィールドにあり、書き込みにはリーフの値を使う必要があります。

| 用途 | フィールド |
|------|------------|
| 表示料率 / ロイヤリティUI | `royalty.basis_points`、`royalty.percent` |
| 受取人表示 / 支払い分割 | `creators` |
| ハッシュ、マークル証明、書き込み命令 | `royalty.basis_points_raw`、`creators_raw` |
| 継承モードの検出 | `royalty.inherited`（または `basis_points_raw === 65535`） |

### 例: DASレスポンス（継承）

継承されたアセットでは、`basis_points`にコレクションの解決済み料率が、`basis_points_raw`に`65535`のセンチネルが返ります。

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

## 継承ロイヤリティ未対応のDASプロバイダーからのレスポンス {% #unsupported-das %}

まだ継承ロイヤリティに対応していないDASプロバイダーはリーフデータをそのまま返すため、継承されたcNFTは**クリエイターなし**で**655.35%のロイヤリティ**（UIではしばしば「650%」や「655%」に丸められます）と表示されます。オンチェーンのアセットは正しく、インデクサーのレスポンスにコレクションの解決が欠けているだけです。

上の例と同じ継承アセットは、未対応のプロバイダーでは次のようになります。

```json
"royalty": {
  "royalty_model": "creators",
  "target": null,
  "percent": 6.5535,
  "basis_points": 65535,
  "primary_sale_happened": false,
  "locked": false
},
"creators": []
```

| フィールド | 対応済みDAS | 未対応DAS | 未対応DASでユーザーに見えるもの |
|-------|---------------|-----------------|-----------------------------------|
| `royalty.basis_points` | `750`（コレクション料率） | `65535`（リーフセンチネル） | 655.35%のロイヤリティ |
| `royalty.percent` | `0.075` | `6.5535` | 655.35%のロイヤリティ |
| `creators` | コレクション Royalties プラグインの受取人 | `[]` | ロイヤリティ受取人なし |
| `royalty.basis_points_raw` / `creators_raw` / `royalty.inherited` | あり | 省略 | — |

{% callout type="warning" title="655.35%は継承センチネルであり、実際のロイヤリティではありません" %}
ウォレット、マーケットプレイス、エクスプローラーがBubblegum V2 cNFTのロイヤリティを約650%と表示する場合、そのDASプロバイダーはまだ継承ロイヤリティに対応していません。アセットにもコレクションにも問題はありません。この値は`SELLER_FEE_BASIS_POINTS_INHERIT`センチネルである`65535`ベーシスポイントが、料率として読まれているものです。
{% /callout %}

クライアントは未対応のプロバイダーに次の3つの方法で対処できます。

- `basis_points_raw`なしの`royalty.basis_points === 65535`を継承として扱う — 下の`isInheritedRoyalty`ヘルパーがこれを行います。
- 実効料率と受取人を、DASではなくMPL-Coreコレクションの[Royaltiesプラグイン](/ja/smart-contracts/core/plugins/royalties)から読み取る。コレクションアドレスはアセットの`grouping`内の`group_key: "collection"`にあります。
- 継承ロイヤリティに対応したDASプロバイダーに切り替える。[RPCとDAS](/ja/solana/rpcs-and-das)を参照してください。

## 検出と表示ヘルパー

以下の3つのヘルパーは、継承ロイヤリティで挙動が変わる操作をカバーします。継承の検出、書き込み用リーフ値の復元、正しいクリエイターリストの選択です。

```ts
const INHERIT = 0xffff // 65535

function isInheritedRoyalty(royalty: {
  basis_points: number
  basis_points_raw?: number | null
  inherited?: boolean | null
}): boolean {
  if (royalty.inherited === true) return true
  if (royalty.basis_points_raw != null) {
    return royalty.basis_points_raw === INHERIT
  }
  // Older DAS versions return neither field and surface the sentinel
  // directly in basis_points. Without this, 65535 reads as a 655.35% fee.
  return royalty.basis_points === INHERIT
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

統合時の不具合の多くは、リーフの値をユーザーに表示してしまうか、表示用の値を書き込みでハッシュしてしまうことが原因です。

- `65535` ベーシスポイント（655.35%）をユーザー向けロイヤリティ料率として**表示しないでください** — 対応済みDASではその値は `basis_points_raw` にあり、[未対応DAS](#unsupported-das)ではコレクションから料率を解決する必要があることを意味します。
- 空の `creators_raw` がロイヤリティ受取人がいないことを意味すると**仮定しないでください**；表示用の受取人は `creators` にあります。
- リーフハッシュの再計算や Bubblegum 書き込み命令の構築時に、主フィールドの `basis_points` / `creators` を**使わないでください** — `basis_points_raw` と `creators_raw` を使ってください。

{% callout type="warning" title="未対応DASを使うマーケットプレイスでのロイヤリティ支払い" %}
継承ロイヤリティには、コレクション料率を主フィールドに解決する DAS インデクサーが必要です。[未対応の DAS プロバイダー](#unsupported-das)では、`getAsset` はリーフをそのまま返します：`royalty.basis_points: 65535`（655.35%）、`creators: []`、および `basis_points_raw` / `inherited` / `creators_raw` なし。

これらの DAS アセットフィールドだけを支払い分割に使うマーケットプレイスは、アセットを**ロイヤリティ受取人なし**（または無効な料率）とみなし、**クリエイターに何も支払わない**可能性があります。次のいずれかを優先してください：

- `inherited` / `_raw` とコレクション解決済みの `creators` / `basis_points` を返すアップグレード済み DAS、または
- 支払い分割のために MPL-Core コレクションの **Royalties** プラグインから直接読み取ること

ロイヤリティの*強制*（誰が転送できるか）は別です：コレクション Royalties プラグインの `ruleSet`（`ProgramAllowList` / `ProgramDenyList`）を設定してください。Bubblegum は転送時にロイヤリティ支払いをエスクローしません。
{% /callout %}

## Bubblegum SDK の注意

`getAssetWithProof` は**読み取り互換**を維持します：`metadata` は DAS の主フィールドを反映します（継承時は解決済みコレクション料率）。`currentMetadata` は書き込み用のリーフ正規値です。任意の兄弟フィールド `sellerFeeBasisPointsRaw` / `creatorsRaw` と `inherited` は DAS の `_raw` / 継承検出をミラーします。書き込みでは `...assetWithProof` を展開し、リーフ引数には `currentMetadata` を使い、表示用 `metadata` は渡さないでください。[JavaScript SDK](/ja/smart-contracts/bubblegum-v2/sdk/javascript#getassetwithproof-and-inherited-royalties)を参照してください。

## 注意事項

- DASのサポート状況はプロバイダーによって異なります。アップグレード済みのインデクサーは`basis_points_raw`、`creators_raw`、`inherited`を返しますが、古いものは3つとも返さず、`65535`のセンチネルを`basis_points`に直接載せます。これらのフィールドは任意として扱い、センチネルにフォールバックしてください。
- 継承は読み取り時にMPL-CoreコレクションのRoyaltiesプラグインから解決されます。コレクションの料率を変更すると、リーフに一切触れずに、継承しているすべてのアセットについてDASの報告値が変わります。
- ロイヤリティの*強制*とロイヤリティの*支払い*は別物です。どのプログラムが転送できるかはコレクションの`ruleSet`（`ProgramAllowList` / `ProgramDenyList`）が制御し、Bubblegumは転送時にロイヤリティ支払いをエスクローしません。
- 本ページはBubblegum V2（MPL-Bubblegum）に適用されます。V1ツリーにはコレクションレベルのロイヤリティ継承はありません。
- 本ページのDASフィールド（`basis_points_raw`、`creators_raw`、`inherited`）には`@metaplex-foundation/digital-asset-standard-api` **2.1.0以上**が必要です。`getAssetWithProof`の`currentMetadata`は`@metaplex-foundation/mpl-bubblegum` **5.1.0**で利用できますが、`sellerFeeBasisPointsRaw`、`creatorsRaw`、`inherited`の各フィールドはまだ公開されていません。これらは[mpl-bubblegum#173](https://github.com/metaplex-foundation/mpl-bubblegum/pull/173)で追加されます。それまでは`rpcAsset`から読み取ってください。

## よくある質問

### `royalty.basis_points_raw`が65535と表示されるのはなぜですか？

リーフハッシュに使われるオンチェーン継承センチネルです。`royalty.basis_points`にはすでに表示用のコレクション料率が入っています。

### 継承されたcNFTで`creators_raw`が空なのはなぜですか？

SFBPが継承される場合、リーフの`creators`は空でなければなりません。コレクションのロイヤリティ受取人には`creators`を使用してください。

### ウォレットやマーケットプレイスで私のcNFTのロイヤリティが655.35%と表示されるのはなぜですか？

そのアプリのDASプロバイダーがまだ継承ロイヤリティに対応していないためです。コレクション料率の代わりに、リーフの継承センチネル`65535`を`royalty.basis_points`（655.35%）に返し、`creators`は空になります。オンチェーンのロイヤリティは誤っていません。アプリはアップグレード済みのDASプロバイダーを使うか、コレクションのRoyaltiesプラグインを読み取る必要があります。[継承ロイヤリティ未対応のDASプロバイダーからのレスポンス](#unsupported-das)を参照してください。

### 継承していないcNFTについて変更は必要ですか？

いいえ。継承を使用しない場合、`_raw`フィールドと`inherited`は省略され、主な`royalty`と`creators`フィールドは従来どおり動作します。

## 関連

- [圧縮NFTの取得](/ja/smart-contracts/bubblegum-v2/fetch-cnfts)
- [ミント — ロイヤリティの継承](/ja/smart-contracts/bubblegum-v2/mint-cnfts#inheriting-royalties-from-the-collection)
- [cNFTの更新 — 継承ロイヤリティ](/ja/smart-contracts/bubblegum-v2/update-cnfts#inherited-royalties)
- [NFTデータのハッシュ](/ja/smart-contracts/bubblegum-v2/hashed-nft-data)
- [DAS getAsset](/ja/dev-tools/das-api/methods/get-asset)
- [FAQ — 継承ロイヤリティ](/ja/smart-contracts/bubblegum-v2/faq#inherited-royalties)
