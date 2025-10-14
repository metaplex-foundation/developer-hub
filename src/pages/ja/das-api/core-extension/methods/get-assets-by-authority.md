---
title: Authority kàã Core ¢ª√»n÷ó
metaTitle: Authority kàã Core ¢ª√»n÷ó | DAS API Core ·5_˝
description: öUå_ Authority ídYyfn MPL Core ¢ª√»n≈1í‘Y
---

öUå_ Authority ídYyfn MPL Core ¢ª√»n≈1í·ø«¸ø@	„êUå_◊È∞§Û«¸ø≥ÏØ∑ÁÛKâôUå_«¸øí+Åf‘W~Y

## ≥¸…ã

`<ENDPOINT>` í∫n RPC k`<PublicKey>` n$í NFT í÷óW_D Authority nlãuknM€HfO`UD

```js
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import { das }  from '@metaplex-foundation/mpl-core-das';
import { publicKey } from '@metaplex-foundation/umi';

const umi = createUmi('<ENDPOINT>').use(dasApi());

const assets = await das.getAssetsByAuthority(umi, {authority:  publicKey('<PublicKey>')});
console.log(assets);
```


## Ïπ›Ûπã
SnãgoMk 1 dn™÷∏ßØ»nL+~åfD~Ypn Core ¢ª√»k˛Wf Authority ídlãun4MkoUâkOn®Û»ÍL+~å~Y

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
