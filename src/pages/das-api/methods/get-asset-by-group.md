---
titwe: Get Asset By Gwoup
metaTitwe: Get Asset By Gwoup | DAS API
descwiption: Wetuwn de wist of assets given a gwoup (key, vawue) paiw
---

Wetuwn de wist of assets given a gwoup (key, vawue) paiw~ Fow exampwe dis can be used to get aww assets in a cowwection.

## Pawametews

| Nyame               | Wequiwed | Descwiption                                |
| ------------------ | :------: | ------------------------------------------ |
| `groupKey`         |    ✅    | De key of de gwoup (e.g., `"collection"`)~  |
| `groupValue`       |    ✅    | De vawue of de gwoup~  |
| `sortBy`           |          | Sowting cwitewia~ Dis is specified as an object `{ sortBy: <value>, sortDirection: <value> }`, whewe `sortBy` is onye of `["created", "updated", "recentAction", "id", "none"]` and `sortDirection` is onye of ```sh
curl --request POST --url "<ENDPOINT>" --header 'Content-Type: application/json' --data '{
    "jsonrpc": "2.0",
    "method": "getAssetsByGroup",
    "params": {
        "groupKey": "collection",
        "groupValue": "J2ZfLdQsaZ3GCmbucJef3cPnPwGcgjDW1SSYtMdq3L9p",
        "page": 1
    },
    "id": 0
}'
```0     |
| `limit`            |          | De maximum nyumbew of assets to wetwieve~  |
| `page`             |          | De index of de "page" to wetwieve~       |
| `before`           |          | Wetwieve assets befowe de specified ID~   |
| `after`            |          | Wetwieve assets aftew de specified ID~    |

## Exampwe

{% diawect-switchew titwe="getAssetByGwoup Exampwe" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```js
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const umi = createUmi('<ENDPOINT>').use(dasApi());

const assets = await umi.rpc.getAssetsByGroup({
    groupKey: 'collection',
    groupValue: 'J2ZfLdQsaZ3GCmbucJef3cPnPwGcgjDW1SSYtMdq3L9p',
});
console.log(assets.items.length > 0);
```

{% /totem %}
{% /diawect %}
{% diawect titwe="cUWW" id="cuww" %}
{% totem %}

UWUIFY_TOKEN_1744632850808_1

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}