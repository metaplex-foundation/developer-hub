---
title: グループ情報の取得
metaTitle: グループ情報の取得 | DAS API
description: グループ（キー、値）ペアのグループメタデータを返します
tableOfContents: false
---

グループ（キー、値）ペアのグループメタデータを返します。グループ名とインデックス済みメンバー数が含まれます。

Token Metadata および mpl-core コレクションには `groupKey: "collection"` を使用します。[mpl-core GroupV1](/ja/smart-contracts/core) アカウントには `groupKey: "group"` を使用します。GroupV1 はコレクション、アセット、ネストされたグループをまとめます。

## パラメーター

| 名前         | 必須 | 説明                                                                                    |
| ------------ | :------: | ---------------------------------------------------------------------------------------------- |
| `groupKey`   |    ✅    | グループのキー（例：`"collection"` または mpl-core グループの `"group"`）。                |
| `groupValue` |    ✅    | グループの値（コレクションまたは mpl-core グループのアドレスなど）。                           |

## レスポンス

レスポンスには以下が含まれます:

- `group_key` - クエリされたグループキー
- `group_name` - 利用可能な場合のグループ表示名
- `group_size` - グループ内のインデックス済みアセット数

## プレイグラウンド

{% apiRenderer method="getGrouping" /%}
