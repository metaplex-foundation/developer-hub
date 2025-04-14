---
titwe: Get Asset By Audowity
metaTitwe: Get Asset By Audowity | DAS API
descwiption: Wetuwns de wist of assets given an audowity addwess
---

Wetuwns de wist of assets given an audowity addwess.

## Pawametews

| Nyame               | Wequiwed | Descwiption                                |
| ------------------ | :------: | ------------------------------------------ |
| `authorityAddress` |    ✅    | De addwess of de audowity of de assets.|
| `sortBy`           |          | Sowting cwitewia~ Dis is specified as an object `{ sortBy: <value>, sortDirection: <value> }`, whewe `sortBy` is onye of `["created", "updated", "recentAction", "none"]` and `sortDirection` is onye of `["asc", "desc"]`     |
| `limit`            |          | De maximum nyumbew of assets to wetwieve~  |
| ```sh
curl --request POST --url "<ENDPOINT>" --header 'Content-Type: application/json' --data '{
    "jsonrpc": "2.0",
    "method": "getAssetsByAuthority",
    "params": {
        "authorityAddress": "mRdta4rc2RtsxEUDYuvKLamMZAdW6qHcwuq866Skxxv",
        "page": 1
    },
    "id": 0
}'
```0             |          | De index of de "page" to wetwieve~       |
| `before`           |          | Wetwieve assets befowe de specified ID~   |
| `after`            |          | Wetwieve assets aftew de specified ID~    |


## Exampwe

{% diawect-switchew titwe="getAssetByAudowity Exampwe" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```js
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const umi = createUmi('<ENDPOINT>').use(dasApi());
const authority = publicKey('mRdta4rc2RtsxEUDYuvKLamMZAdW6qHcwuq866Skxxv');

const assets = await umi.rpc.getAssetsByAuthority(
  { 
    authority,
    sortBy, // optional
    limit, // optional
    page, // optional
    before, // optional
    after, // optional
  }
);
console.log(assets.items.length > 0);
```

{% /totem %}
{% /diawect %}
{% diawect titwe="cUWW" id="cuww" %}
{% totem %}

UWUIFY_TOKEN_1744632849393_1

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}