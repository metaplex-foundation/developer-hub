---
title: Get Assets By Creator
metaTitle: Get Assets By Creator | DAS API
description: クリエイターアドレスを指定してアセットのリストを返します
tableOfContents: false
---

クリエイターアドレスを指定してアセットのリストを返します。

{% callout %}
アセットが実際にそのクリエイターに属していることを確認するため、`onlyVerified: true`でデータを取得することをお勧めします。
{% /callout %}

## パラメーター

| 名前               | 必須 | 説明                                |
| ------------------ | :------: | ------------------------------------------ |
| `creatorAddress`   |    ✅    | アセットのクリエイターのアドレス。  |
| `onlyVerified`     |          | 検証済みのアセットのみを取得するかを示します。  |
| `sortBy`           |          | ソート条件。これは`{ sortBy: <value>, sortDirection: <value> }`のオブジェクトとして指定され、`sortBy`は`["created", "updated", "recentAction", "id", "none"]`のいずれか、`sortDirection`は`["asc", "desc"]`のいずれかです。     |
| `limit`            |          | 取得するアセットの最大数。  |
| `page`             |          | 取得する「ページ」のインデックス。       |
| `before`           |          | 指定されたIDより前のアセットを取得。   |
| `after`            |          | 指定されたIDより後のアセットを取得。    |
| `options`          |          | 表示オプションオブジェクト。詳細は[表示オプション](/ja/dev-tools/das-api/display-options)を参照してください。 |

## Playground

{% apiRenderer method="getAssetsByCreator" /%}
