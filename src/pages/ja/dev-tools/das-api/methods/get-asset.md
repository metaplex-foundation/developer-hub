---
title: Get Asset
metaTitle: Get Asset | DAS API
description: 圧縮/標準アセットの情報を返します
tableOfContents: false
---

メタデータとオーナーを含む圧縮/標準アセットの情報を返します。

MPL-Coreコレクションから販売者手数料を継承するBubblegum V2 cNFTでは、リーフ値は `royalty.basis_points` / `creators` に残り、コレクションから解決された表示値は `royalty.basis_points_inherited`、`royalty.percent_inherited`、`creators_inherited` にあります。[継承ロイヤリティの読み取り](/ja/smart-contracts/bubblegum-v2/reading-inherited-royalties)を参照してください。

## パラメーター

| 名前            | 必須 | 説明                                |
| --------------- | :------: | ------------------------------------------ |
| `id`            |    ✅    | アセットのID。                       |
| `options`       |          | 表示オプションオブジェクト。詳細は[表示オプション](/ja/dev-tools/das-api/display-options)を参照してください。 |

## Playground

{% apiRenderer method="getAsset" /%}
