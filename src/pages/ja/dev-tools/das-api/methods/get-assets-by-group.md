---
title: Get Assets By Group
metaTitle: Get Assets By Group | DAS API
description: グループ（キー、値）ペアを指定してアセットのリストを返します
tableOfContents: false
---

グループ（キー、値）ペアを指定してアセットのリストを返します。

Token Metadata および mpl-core コレクションには `groupKey: "collection"` を使用します。[mpl-core GroupV1](/ja/smart-contracts/core) アカウントのメンバー（コレクション、アセット、ネストされたグループ）を取得するには `groupKey: "group"` を使用します。

すべてのアセットを列挙せずにグループ名とメンバー数を取得するには [`getGrouping`](/ja/dev-tools/das-api/methods/get-grouping) を使用してください。

## パラメーター

| 名前               | 必須 | 説明                                |
| ------------------ | :------: | ------------------------------------------ |
| `groupKey`         |    ✅    | グループのキー（例：`"collection"` または mpl-core グループの `"group"`）。  |
| `groupValue`       |    ✅    | グループの値。  |
| `sortBy`           |          | ソート条件。これは`{ sortBy: <value>, sortDirection: <value> }`のオブジェクトとして指定され、`sortBy`は`["created", "updated", "recentAction", "id", "none"]`のいずれか、`sortDirection`は`["asc", "desc"]`のいずれかです。     |
| `limit`            |          | 取得するアセットの最大数。  |
| `page`             |          | 取得する「ページ」のインデックス。       |
| `before`           |          | 指定されたIDより前のアセットを取得。   |
| `after`            |          | 指定されたIDより後のアセットを取得。    |
| `options`          |          | 表示オプションオブジェクト。詳細は[表示オプション](/ja/dev-tools/das-api/display-options)を参照してください。 |

## Playground

{% apiRenderer method="getAssetsByGroup" /%}
