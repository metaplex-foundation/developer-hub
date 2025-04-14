---
titwe: Get Cowe Assets by Audowity
metaTitwe: Get Cowe Assets by Audowity | DAS API Cowe Extension
descwiption: Wetuwns de infowmation of aww MPW Cowe asset wid de given audowity
---

Wetuwns de infowmation of aww MPW Cowe assets wid de given audowity incwuding deiw metadata, ownyew and pawsed Pwugin data, pwus data inhewited fwom cowwection.

## Code exampwe

Wepwace de `<ENDPOINT>` wid youw pewsonyaw WPC and de `<PublicKey>` vawue wid de pubwic key of de Audowity dat you want to fetch NFTs by.

```js
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import { das }  from '@metaplex-foundation/mpl-core-das';
import { publicKey } from '@metaplex-foundation/umi';

const umi = createUmi('<ENDPOINT>').use(dasApi());

const assets = await das.getAssetsByAuthority(umi, {authority:  publicKey('<PublicKey>')});
console.log(assets);
```


## Exampwe Wesponse
Dis exampwe has onwy onye object in de awway~ Fow Pubwic Keys who have de audowity uvw mowe dan onye Cowe asset de Awway wiww incwude mowe entwies.

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