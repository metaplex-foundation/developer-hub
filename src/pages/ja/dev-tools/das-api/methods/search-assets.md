---
title: Search Assets
metaTitle: Search Assets | DAS API
description: 検索条件を指定してアセットのリストを返します
tableOfContents: false
---

検索条件を指定してアセットのリストを返します。

## パラメーター

| 名前                | 必須 | 説明                                |
| ------------------- | :------: | ------------------------------------------ |
| `negate`            |          | 検索条件を反転するかどうかを示します。  |
| `conditionType`     |          | 検索条件に一致するすべて（`"all"`）またはいずれか（`"any"`）のアセットを取得するかを示します。  |
| `interface`         |          | インターフェース値（`["V1_NFT", "V1_PRINT" "LEGACY_NFT", "V2_NFT", "FungibleAsset", "Custom", "Identity", "Executable"]`のいずれか）。  |
| `ownerAddress`      |          | オーナーのアドレス。  |
| `ownerType`         |          | 所有権のタイプ`["single", "token"]`。  |
| `creatorAddress`    |          | クリエイターのアドレス。  |
| `creatorVerified`   |          | クリエイターが検証済みでなければならないかを示します。  |
| `authorityAddress`  |          | オーソリティのアドレス。  |
| `grouping`          |          | グルーピング`["key", "value"]`ペア。  |
| `delegateAddress`   |          | デリゲートのアドレス。  |
| `frozen`            |          | アセットが凍結されているかを示します。  |
| `supply`            |          | アセットの供給量。  |
| `supplyMint`        |          | 供給ミントのアドレス。  |
| `compressed`        |          | アセットが圧縮されているかを示します。  |
| `compressible`      |          | アセットが圧縮可能かを示します。  |
| `royaltyTargetType` |          | ロイヤリティのタイプ`["creators", "fanout", "single"]`。  |
| `royaltyTarget`     |          | ロイヤリティのターゲットアドレス。  |
| `royaltyAmount`     |          | ロイヤリティ金額。  |
| `burnt`             |          | アセットが焼却されているかを示します。  |
| `sortBy`            |          | ソート条件。これは`{ sortBy: <value>, sortDirection: <value> }`のオブジェクトとして指定され、`sortBy`は`["created", "updated", "recentAction", "id", "none"]`のいずれか、`sortDirection`は`["asc", "desc"]`のいずれかです。     |
| `limit`             |          | 取得するアセットの最大数。  |
| `page`              |          | 取得する「ページ」のインデックス。       |
| `before`            |          | 指定されたIDより前のアセットを取得。   |
| `after`             |          | 指定されたIDより後のアセットを取得。    |
| `jsonUri`           |          | JSON URIの値。  |
| `options`           |          | 表示オプションオブジェクト。詳細は[表示オプション](/ja/das-api/display-options)を参照してください。 |

## Playground

{% apiRenderer method="searchAssets" /%}