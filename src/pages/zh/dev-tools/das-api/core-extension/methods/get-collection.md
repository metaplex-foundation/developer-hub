---
title: 获取 Core 集合
metaTitle: 获取集合 | DAS API Core 扩展
description: 返回 MPL Core 集合的信息
---

返回 MPL Core 集合的信息，包括其元数据、所有者和解析的插件数据。

## 代码示例

将 `<ENDPOINT>` 替换为您的个人 RPC，将 `<PublicKey>` 值替换为您要获取的 MPL Core 集合的公钥。

```js
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import { das }  from '@metaplex-foundation/mpl-core-das';
import { publicKey } from '@metaplex-foundation/umi';

const umi = createUmi('<ENDPOINT>').use(dasApi());
const collectionId = publicKey('<PublicKey>');

const collection = await das.getCollection(umi, collectionId);
console.log(collection);
```


## 示例响应

```json
{
  publicKey: 'FgEKkVTSfLQ7a7BFuApypy4KaTLh65oeNRn2jZ6fiBav',
  uri: 'https://arweave.net/TkklLLQKiO9t9_JPmt-eH_S-VBLMcRjFcgyvIrENBzA',
  name: 'Number Collection',
  content: {
    '$schema': 'https://schema.metaplex.com/nft1.0.json',
    json_uri: 'https://arweave.net/TkklLLQKiO9t9_JPmt-eH_S-VBLMcRjFcgyvIrENBzA',
    files: [ [Object] ],
    metadata: {
      attributes: [Array],
      description: 'Collection of 10 numbers on the blockchain. This is the number 1/10.',
      name: 'Number Collection',
      symbol: ''
    },
    links: {
      image: 'https://arweave.net/swS5eZNrKGtuu5ebdqotzPny4OBoM4wHneZ_Ld17ZU8?ext=png'
    }
  },
  header: {
    executable: false,
    owner: 'CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d',
    lamports: { basisPoints: 2268960n, identifier: 'SOL', decimals: 9 },
    rentEpoch: 18446744073709551616n,
    exists: true
  },
  royalties: {
    authority: { type: 'UpdateAuthority' },
    basisPoints: 500,
    creators: [ [Object] ],
    ruleSet: { __kind: 'None', type: 'None' },
    offset: 138n
  },
  key: 5,
  updateAuthority: 'AUtnbwWJQfYZjJ5Mc6go9UancufcAuyqUZzR1jSe4esx',
  numMinted: 1,
  currentSize: 1
}
```
