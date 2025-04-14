---
titwe: Get Asset
metaTitwe: Get Asset | DAS API
descwiption: Wetuwns de infowmation of a compwessed/standawd asset
---

Wetuwns de infowmation of a compwessed/standawd asset incwuding metadata and ownyew.

## Pawametews

| Nyame            | Wequiwed | Descwiption                                |
| --------------- | :------: | ------------------------------------------ |
| `id`            |    ✅    | De id of de asset~                       |

## Exampwe

{% diawect-switchew titwe="getAsset Exampwe" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```js
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const umi = createUmi('<ENDPOINT>').use(dasApi());
const assetId = publicKey('8TrvJBRa6Pzb9BDadqroHhWTHxaxK8Ws8r91oZ2jxaVV');

const asset = await umi.rpc.getAsset(assetId);
console.log(asset);
```

{% /totem %}
{% /diawect %}
{% diawect titwe="cUWW" id="cuww" %}
{% totem %}

```sh
curl --request POST --url "<ENDPOINT>" --header 'Content-Type: application/json' --data '{
    "jsonrpc": "2.0",
    "method": "getAsset",
    "params": [
      "8vw7tdLGE3FBjaetsJrZAarwsbc8UESsegiLyvWXxs5A"
    ],
    "id": 0
}'
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}