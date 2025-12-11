---
title: コレクション別にCore アセットを取得
metaTitle: コレクション別にCore アセットを取得 | DAS API Core 拡張機能
description: 指定されたコレクション内のすべてのMPL Core アセットの情報を返します
---

メタデータ、オーナー、解析されたプラグインデータ、およびコレクションから継承されたデータを含む、指定された権限を持つすべてのMPL Core アセットの情報を返します。

## コード例

`<ENDPOINT>`を個人のRPCに、`<PublicKey>`値をNFTを取得したいコレクションの公開鍵に置き換えてください。

```js
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import { das }  from '@metaplex-foundation/mpl-core-das';
import { publicKey } from '@metaplex-foundation/umi';

const umi = createUmi('<ENDPOINT>').use(dasApi());
const collection = publicKey('<PublicKey>');

const assets = await das.getAssetsByCollection(umi, { collection });
console.log(assets);
```


## レスポンス例
この例には配列内に1つのオブジェクトのみが含まれています。複数のCore アセットを持つコレクションの場合、配列にはより多くのエントリが含まれます。

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
