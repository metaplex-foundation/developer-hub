---
title: Get Assets By Group
metaTitle: Get Assets By Group | DAS API
description: グループ（キー、値）ペアを指定してアセットのリストを返します
tableOfContents: false
---

グループ（キー、値）ペアを指定してアセットのリストを返します。例えば、これはコレクション内のすべてのアセットを取得するために使用できます。

## パラメーター

| 名前               | 必須 | 説明                                |
| ------------------ | :------: | ------------------------------------------ |
| `groupKey`         |    ✅    | グループのキー（例：`"collection"`）。  |
| `groupValue`       |    ✅    | グループの値。  |
| `sortBy`           |          | ソート条件。これは`{ sortBy: <value>, sortDirection: <value> }`のオブジェクトとして指定され、`sortBy`は`["created", "updated", "recentAction", "id", "none"]`のいずれか、`sortDirection`は`["asc", "desc"]`のいずれかです。     |
| `limit`            |          | 取得するアセットの最大数。  |
| `page`             |          | 取得する「ページ」のインデックス。       |
| `before`           |          | 指定されたIDより前のアセットを取得。   |
| `after`            |          | 指定されたIDより後のアセットを取得。    |
| `options`          |          | 表示オプションオブジェクト。詳細は[表示オプション](/ja/dev-tools/das-api/display-options)を参照してください。 |

## Playground

{% apiRenderer method="getAssetsByGroup" /%}