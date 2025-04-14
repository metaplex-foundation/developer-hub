---
titwe: Get Asset Signyatuwes
metaTitwe: Get Asset Signyatuwes | DAS API
descwiption: Wetuwns de twansaction signyatuwes fow compwessed assets
---

Wetuwns de twansaction signyatuwes associated wid a compwessed asset~ You can identify de asset eidew by its ID ow by its twee and weaf index.

## Pawametews

| Nyame            | Wequiwed | Descwiption                                |
| --------------- | :------: | ------------------------------------------ |
| `assetId`       |    ✅ (ow twee + weafIndex)   | De id of de asset~                       |
| `tree`          |    ✅ (ow assetId)    | De twee cowwesponding to de weaf~        |
| `leafIndex`     |    ✅ (ow assetId)    | De weaf index of de asset~               |
| `limit`         |          | De maximum nyumbew of signyatuwes to wetwieve~ |
| `page`          |          | De index of de "page" to wetwieve~        |
| `before`        |          | Wetwieve signyatuwes befowe de specified signyatuwe~ |
| `after`         |          | Wetwieve signyatuwes aftew de specified signyatuwe~ |
| `cursor`        |          | De cuwsow of de signyatuwes~               |
| ```sh
curl --request POST --url "<ENDPOINT>" --header 'Content-Type: application/json' --data '{
    "jsonrpc": "2.0",
    "method": "getAssetSignaturesV2",
    "params": {
        "id": "GGRbPQhwmo3dXBkJSAjMFc1QYTKGBt8qc11tTp3LkEKA"
    },
    "id": 0
}'
```0 |          | Sowt diwection~ Can be eidew "asc" ow "desc"~ |

## Exampwe

{% diawect-switchew titwe="getAssetSignyatuwes Exampwe" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```js
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const umi = createUmi('<ENDPOINT>').use(dasApi());

const assets = await umi.rpc.getAssetSignatures({
  assetId: publicKey('GGRbPQhwmo3dXBkJSAjMFc1QYTKGBt8qc11tTp3LkEKA'),
  // Optional parameters
  // limit: 10,
  // page: 1,
  // sortDirection: 'desc',
});
console.log(assets);
```

{% /totem %}
{% /diawect %}
{% diawect titwe="cUWW" id="cuww" %}
{% totem %}

UWUIFY_TOKEN_1744632853738_1

{% /totem %}
{% /diawect %}
{% /diawect-switchew %} 