---
title: Core コレクションを検索
metaTitle: Core コレクションを検索 | DAS API Core 拡張機能
description: 検索条件を指定してMPL Core コレクションのリストを返します
---

検索条件を指定してCore アセットのリストを返します。

## コード例

この例では2つのフィルターが適用されています：

1. オーナーの公開鍵
2. メタデータURI `jsonUri`

これにより、そのウォレットが所有する指定されたURIを持つNFTのみが返されます。

追加の可能なパラメータは[下記](#parameters)に記載されています。

```js
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const umi = createUmi('<ENDPOINT>').use(dasApi());

const asset = await das.searchAssets(umi, {
    owner: publicKey('AUtnbwWJQfYZjJ5Mc6go9UancufcAuyqUZzR1jSe4esx'),
    jsonUri: 'https://arweave.net/TkklLLQKiO9t9_JPmt-eH_S-VBLMcRjFcgyvIrENBzA',
});

console.log(asset);
```

## レスポンス例

```json
[
  {
    publicKey: '8VrqN8b8Y7rqWsUXqUw7dxQw9J5UAoVyb6YDJs1mBCCz',
    header: {
      executable: false,
      owner: 'CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d',
      lamports: [Object],
      rentEpoch: 18446744073709551616n,
      exists: true
    },
    pluginHeader: { key: 3, pluginRegistryOffset: 179n },
    royalties: {
      authority: [Object],
      offset: 138n,
      basisPoints: 500,
      creators: [Array],
      ruleSet: [Object]
    },
    key: 1,
    updateAuthority: {
      type: 'Collection',
      address: 'FgEKkVTSfLQ7a7BFuApypy4KaTLh65oeNRn2jZ6fiBav'
    },
    name: 'Number 1',
    uri: 'https://arweave.net/TkklLLQKiO9t9_JPmt-eH_S-VBLMcRjFcgyvIrENBzA',
    content: {
      '$schema': 'https://schema.metaplex.com/nft1.0.json',
      json_uri: 'https://arweave.net/TkklLLQKiO9t9_JPmt-eH_S-VBLMcRjFcgyvIrENBzA',
      files: [Array],
      metadata: [Object],
      links: [Object]
    },
    owner: 'AUtnbwWJQfYZjJ5Mc6go9UancufcAuyqUZzR1jSe4esx',
    seq: { __option: 'None' }
  }
]
```

## パラメータ

| 名前                | 必須 | 説明                                |
| ------------------- | :------: | ------------------------------------------ |
| `negate`            |          | 検索条件を反転するかどうかを示します。  |
| `conditionType`     |          | 検索条件に一致するすべて（`"all"`）またはいずれか（`"any"`）のアセットを取得するかどうかを示します。  |
| `interface`         |          | インターフェース値（`["V1_NFT", "V1_PRINT" "LEGACY_NFT", "V2_NFT", "FungibleAsset", "Custom", "Identity", "Executable"]`のいずれか）。  |
| `ownerAddress`      |          | オーナーのアドレス。  |
| `ownerType`         |          | 所有権のタイプ `["single", "token"]`。  |
| `creatorAddress`    |          | クリエイターのアドレス。  |
| `creatorVerified`   |          | クリエイターが検証されている必要があるかどうかを示します。  |
| `authorityAddress`  |          | 権限のアドレス。  |
| `grouping`          |          | グルーピング `["key", "value"]` ペア。  |
| `delegateAddress`   |          | デリゲートのアドレス。  |
| `frozen`            |          | アセットが凍結されているかどうかを示します。  |
| `supply`            |          | アセットの供給量。  |
| `supplyMint`        |          | 供給ミントのアドレス。  |
| `compressed`        |          | アセットが圧縮されているかどうかを示します。  |
| `compressible`      |          | アセットが圧縮可能かどうかを示します。  |
| `royaltyTargetType` |          | ロイヤリティのタイプ `["creators", "fanout", "single"]`。  |
| `royaltyTarget`     |          | ロイヤリティのターゲットアドレス。  |
| `royaltyAmount`     |          | ロイヤリティの金額。  |
| `burnt`             |          | アセットがバーンされているかどうかを示します。  |
| `sortBy`            |          | ソート条件。これはオブジェクト `{ sortBy: <value>, sortDirection: <value> }` として指定され、`sortBy` は `["created", "updated", "recentAction", "none"]` のいずれか、`sortDirection` は `["asc", "desc"]` のいずれかです。     |
| `limit`             |          | 取得するアセットの最大数。  |
| `page`              |          | 取得する「ページ」のインデックス。       |
| `before`            |          | 指定されたID以前のアセットを取得します。   |
| `after`             |          | 指定されたID以降のアセットを取得します。    |
| `jsonUri`           |          | JSON URIの値。  |

技術的には、これらすべてのパラメータは標準DASパッケージから継承されているため受け入れられますが、一部は使用が推奨されません。例えば、パッケージはMPL Coreの`interface`をいずれにせよフィルタリングします。
