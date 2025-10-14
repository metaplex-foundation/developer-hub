---
title: Authority k�� Core ����n֗
metaTitle: Authority k�� Core ����n֗ | DAS API Core �5_�
description: �U�_ Authority �dYyfn MPL Core ����n�1��Y
---

�U�_ Authority �dYyfn MPL Core ����n�1�����@	�U�_�鰤�����쯷��K��U�_����+�f�W~Y

## ��ɋ

`<ENDPOINT>` ��n RPC k`<PublicKey>` n$� NFT �֗W_D Authority nl�uknM�HfO`UD

```js
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import { das }  from '@metaplex-foundation/mpl-core-das';
import { publicKey } from '@metaplex-foundation/umi';

const umi = createUmi('<ENDPOINT>').use(dasApi());

const assets = await das.getAssetsByAuthority(umi, {authority:  publicKey('<PublicKey>')});
console.log(assets);
```


## ���
Sn�goMk 1 dn�ָ���nL+~�fD~Ypn Core ����k�Wf Authority �dl�un4MkoU�kOn����L+~�~Y

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
