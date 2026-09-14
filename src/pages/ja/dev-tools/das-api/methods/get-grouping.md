---
title: グループ情報の取得
metaTitle: グループ情報の取得 | DAS API
description: グループ（キー、値）ペアのグループメタデータを返します。グループ名とインデックス済みメンバー数が含まれます。
created: '07-02-2026'
updated: '07-06-2026'
keywords:
  - das api getGrouping
  - get grouping metadata
  - group key group value
  - mpl-core groups
  - collection metadata
about:
  - DAS API
  - Group metadata
  - mpl-core GroupV1
proficiencyLevel: Beginner
tableOfContents: false
---

## 概要

`getGrouping` DAS API メソッドは、すべてのメンバーを列挙せずにグループ（キー、値）ペアのメタデータを返します。

- クエリしたグループの `group_key`、`group_name`、`group_size` を返します
- Token Metadata および mpl-core コレクションには `groupKey: "collection"` を使用します
- コレクション、アセット、ネストされたグループをまとめる [mpl-core GroupV1](/ja/smart-contracts/core) アカウントには `groupKey: "group"` を使用します
- 個々のメンバーを一覧するには [`getAssetsByGroup`](/ja/dev-tools/das-api/methods/get-assets-by-group) を使用します

## パラメーター

| 名前         | 必須 | 説明                                                                                    |
| ------------ | :------: | ---------------------------------------------------------------------------------------------- |
| `groupKey`   |    ✅    | グループのキー（例：`"collection"` または mpl-core グループの `"group"`）。                |
| `groupValue` |    ✅    | グループの値（コレクションまたは mpl-core グループのアドレスなど）。                           |

## レスポンス

レスポンスには以下が含まれます:

- `group_key` - クエリされたグループキー
- `group_name` - 利用可能な場合のグループ表示名
- `group_size` - グループ内のインデックス済みメンバー数

## プレイグラウンド

{% apiRenderer method="getGrouping" /%}

## Notes

- `getGrouping` は概要メタデータのみを返します — グループメンバーをページングするには [`getAssetsByGroup`](/ja/dev-tools/das-api/methods/get-assets-by-group) を使用してください
- `group_size` は指定した `groupKey`/`groupValue` ペアについて DAS がインデックスしたメンバー数を表します
- mpl-core GroupV1 グループでは、インデクサーが記録した内容に応じて、コレクション、アセット、ネストされたグループがメンバーとして含まれる場合があります
