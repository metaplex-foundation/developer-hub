---
title: グループ情報の取得（Core 拡張機能）
metaTitle: グループ情報の取得 | DAS API Core 拡張機能
description: コレクションまたはmpl-core GroupV1のグループ名とインデックス済みメンバー数を返します。
created: '07-22-2026'
updated: '07-22-2026'
keywords:
  - das getGrouping core extension
  - mpl-core-das getGrouping
  - group size
about:
  - DAS API
  - MPL Core
  - Core Groups
proficiencyLevel: Intermediate
---

## 概要

`das.getGrouping` は、すべてのメンバーを一覧表示せずに、グループのキーと値のペアに対するサマリーメタデータを返します。

- `group_key`、`group_name`、`group_size` を返します
- コレクションには `groupKey: "collection"` を、[GroupV1](/ja/smart-contracts/core/groups) には `groupKey: "group"` を使用します
- メンバーを一覧表示するには、[`getAssetsByGroup`](/ja/dev-tools/das-api/core-extension/methods/get-assets-by-group)（Core）または[基本のDASメソッド](/ja/dev-tools/das-api/methods/get-grouping)を使用します

## コード例

`das.getGrouping` はUmiインスタンスと `GroupV1` アドレスを受け取り、メンバーを一覧表示せずにグループ名とサイズを返します。

{% code-tabs-imported from="das-api/core-extension/get-grouping" frameworks="umi" /%}

## パラメータ

このヘルパーは、Umiインスタンスに続けてオプションオブジェクトを受け取ります。

| 名前         | 必須 | 説明 |
| ------------ | :------: | ----------- |
| `groupKey`   |    ✅    | `"collection"` または `"group"`。 |
| `groupValue` |    ✅    | コレクションまたはGroupV1のアドレス（文字列または公開鍵）。 |

## 注意事項

- `group_size` はインデクサーが記録した値を反映しており、オンチェーンの現在のベクトル長と一致するとは限りません。
- DASクライアント ≥ 2.1.0 と、`getGrouping` をサポートするRPCが必要です。
