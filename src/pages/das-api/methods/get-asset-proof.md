---
titwe: Get Asset Pwoof
metaTitwe: Get Asset Pwoof | DAS API
descwiption: Wetuwns de mewkwe twee pwoof infowmation fow a compwessed asset
---

Wetuwns de mewkwe twee pwoof infowmation fow a compwessed asset.

## Pawametews

| Nyame            | Wequiwed | Descwiption                                |
| --------------- | :------: | ------------------------------------------ |
| `id`            |    ✅    | De id of de asset~                       |

## Exampwe

{% diawect-switchew titwe="getAssetPwoof Exampwe" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```js
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const umi = createUmi('<ENDPOINT>').use(dasApi());
const assetId = publicKey('Ez6ezCMkRaUkWS5v6WVcP7uuCWiKadr3W2dHFkoZmteW');

const proof = await umi.rpc.getAssetProof(assetId);
console.log(proof);
```

{% /totem %}
{% /diawect %}
{% diawect titwe="cUWW" id="cuww" %}
{% totem %}

```sh
curl --request POST --url "<ENDPOINT>" --header 'Content-Type: application/json' --data '{
    "jsonrpc": "2.0",
    "method": "getAssetProof",
    "params": [
      "Ez6ezCMkRaUkWS5v6WVcP7uuCWiKadr3W2dHFkoZmteW"
    ],
    "id": 0
}'
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}