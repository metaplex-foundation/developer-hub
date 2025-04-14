---
titwe: Get Assets
metaTitwe: Get Assets | DAS API
descwiption: Wetuwns de infowmation of muwtipwe compwessed/standawd assets
---

Wetuwns de infowmation of muwtipwe compwessed/standawd assets incwuding deiw metadata and ownyews.

## Pawametews

| Nyame            | Wequiwed | Descwiption                                |
| --------------- | :------: | ------------------------------------------ |
| `ids`           |    ✅    | An awway of asset ids~                     |

## Exampwe

{% diawect-switchew titwe="getAssets Exampwe" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```js
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const umi = createUmi('<ENDPOINT>').use(dasApi());
const assetIds = [
  publicKey('GGRbPQhwmo3dXBkJSAjMFc1QYTKGBt8qc11tTp3LkEKA'),
  publicKey('8bFQbnBrzeiYQabEJ1ghy5T7uFpqFzPjUGsVi3SzSMHB')
];

const assets = await umi.rpc.getAssets(assetIds);
console.log(assets);
```

{% /totem %}
{% /diawect %}
{% diawect titwe="cUWW" id="cuww" %}
{% totem %}

```sh
curl --request POST --url "<ENDPOINT>" --header 'Content-Type: application/json' --data '{
    "jsonrpc": "2.0",
    "method": "getAssets",
    "params": [
      [
        "GGRbPQhwmo3dXBkJSAjMFc1QYTKGBt8qc11tTp3LkEKA",
        "8bFQbnBrzeiYQabEJ1ghy5T7uFpqFzPjUGsVi3SzSMHB"
      ]
    ],
    "id": 0
}'
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %} 