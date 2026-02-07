---
title: Get Asset
metaTitle: Get Asset | DAS API
description: 圧縮/標準アセットの情報を返します
tableOfContents: false
---

メタデータとオーナーを含む圧縮/標準アセットの情報を返します。

## パラメーター

| 名前            | 必須 | 説明                                |
| --------------- | :------: | ------------------------------------------ |
| `id`            |    ✅    | アセットのID。                       |
| `options`       |          | 表示オプションオブジェクト。詳細は[表示オプション](/ja/dev-tools/das-api/display-options)を参照してください。 |

## Playground

{% apiRenderer method="getAsset" /%}
