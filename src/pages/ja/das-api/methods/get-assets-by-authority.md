---
title: 権限者別アセット取得
metaTitle: 権限者別アセット取得 | DAS API
description: 権限者アドレスを指定してアセットのリストを返します
tableOfContents: false
---

権限者アドレスを指定してアセットのリストを返します。

## パラメータ

| 名前               | 必須 | 説明                                |
| ------------------ | :------: | ------------------------------------------ |
| `authorityAddress` |    ✅    | アセットの権限者のアドレス。|
| `sortBy`           |          | ソート基準。これはオブジェクト`{ sortBy: <value>, sortDirection: <value> }`として指定されます。`sortBy`は`["created", "updated", "recentAction", "none"]`のいずれか、`sortDirection`は`["asc", "desc"]`のいずれかです。     |
| `limit`            |          | 取得するアセットの最大数。  |
| `page`             |          | 取得する「ページ」のインデックス。       |
| `before`           |          | 指定されたIDより前のアセットを取得。   |
| `after`            |          | 指定されたIDより後のアセットを取得。    |
| `options`          |          | 表示オプションオブジェクト。詳細は[表示オプション](/das-api/display-options)を参照してください。 |

## プレイグラウンド

{% apiRenderer method="getAssetsByAuthority" /%}
