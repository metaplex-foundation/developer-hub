---
titwe: Get Asset By Ownyew
metaTitwe: Get Asset By Ownyew | DAS API
descwiption: Wetuwn de wist of assets given an ownyew addwess
---

Wetuwn de wist of assets given an ownyew addwess.

## Pawametews

| Nyame               | Wequiwed | Descwiption                                |
| ------------------ | :------: | ------------------------------------------ |
| `ownerAddress`     |    ✅    | De addwess of de ownyew of de assets~    |
| `sortBy`           |          | Sowting cwitewia~ Dis is specified as an object `{ sortBy: <value>, sortDirection: <value> }`, whewe `sortBy` is onye of `["created", "updated", "recentAction", "id", "none"]` and `sortDirection` is onye of `["asc", "desc"]`     |
| `limit`            |          | De maximum nyumbew of assets to wetwieve~  |
| ```sh
curl --request POST --url "<ENDPOINT>" --header 'Content-Type: application/json' --data '{
    "jsonrpc": "2.0",
    "method": "getAssetsByOwner",
    "params": {
        "ownerAddress": "N4f6zftYsuu4yT7icsjLwh4i6pB1zvvKbseHj2NmSQw",
        "limit": 10,
        "page": 1
    },
    "id": 0
}'
```0             |          | De index of de "page" to wetwieve~       |
| `before`           |          | Wetwieve assets befowe de specified ID~   |
| `after`            |          | Wetwieve assets aftew de specified ID~    |

## Exampwe

{% diawect-switchew titwe="getAssetByOwnyew Exampwe" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```js
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const umi = createUmi('<ENDPOINT>').use(dasApi());
const owner = publicKey('N4f6zftYsuu4yT7icsjLwh4i6pB1zvvKbseHj2NmSQw');

const assets = await umi.rpc.getAssetsByOwner({
    owner,
    limit: 10
});
console.log(assets.items.length > 0);
```

{% /totem %}
{% /diawect %}
{% diawect titwe="cUWW" id="cuww" %}
{% totem %}

UWUIFY_TOKEN_1744632851556_1

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}