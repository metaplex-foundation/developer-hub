---
title: アセットの取得
metaTitle: アセットの取得 | DAS API
description: 複数の圧縮/標準アセットの情報を返します
tableOfContents: false
---

メタデータと所有者を含む、複数の圧縮/標準アセットの情報を返します。

## パラメータ

| 名前  | 必須 | 説明            |
| ----- | :------: | ---------------------- |
| `ids` |    ✅    | アセットIDの配列。 |
| `options` |          | 表示オプションオブジェクト。詳細は[表示オプション](/ja/dev-tools/das-api/display-options)を参照してください。 |

## プレイグラウンド

{% apiRenderer method="getAssets" /%}
