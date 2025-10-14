---
title: アセット署名の取得
metaTitle: アセット署名の取得 | DAS API
description: 圧縮アセットのトランザクション署名を返します
tableOfContents: false
---

圧縮アセットに関連するトランザクション署名を返します。アセットはIDで識別するか、ツリーとリーフインデックスで識別できます。

## パラメータ

| 名前            | 必須 | 説明                                |
| --------------- | :------: | ------------------------------------------ |
| `assetId`       |    ✅ (またはtree + leafIndex)   | アセットのID。                       |
| `tree`          |    ✅ (またはassetId)    | リーフに対応するツリー。        |
| `leafIndex`     |    ✅ (またはassetId)    | アセットのリーフインデックス。               |
| `limit`         |          | 取得する署名の最大数。 |
| `page`          |          | 取得する「ページ」のインデックス。        |
| `before`        |          | 指定された署名より前の署名を取得。 |
| `after`         |          | 指定された署名より後の署名を取得。 |
| `cursor`        |          | 署名のカーソル。               |
| `sortDirection` |          | ソート方向。"asc"または"desc"のいずれか。 |

## プレイグラウンド

{% apiRenderer method="getAssetSignatures" /%}
