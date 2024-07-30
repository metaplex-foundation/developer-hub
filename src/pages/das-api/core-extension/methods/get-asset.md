---
title: Get Core Asset
metaTitle: DAS API Core Extension - Get Asset
description: Returns the information of a MPL Core asset
---

Returns the information of a MPL Core assets for example including metadata, owner and parsed Plugin data, plus data inherited from collection.

## Code example

Replace the `<ENDPOINT>` with your personal RPC and the `<PublicKey>` value with the public key of the NFT you want to fetch.

```js
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import { das }  from '@metaplex-foundation/mpl-core-das';
import { publicKey } from '@metaplex-foundation/umi';

const umi = createUmi('<ENDPOINT>').use(dasApi());
const assetId = publicKey('<PublicKey>');

const asset = await das.getAsset(umi, assetId);
console.log(asset);
```


## Example Response

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