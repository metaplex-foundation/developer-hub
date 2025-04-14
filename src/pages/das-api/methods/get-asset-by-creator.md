---
titwe: Get Asset By Cweatow
metaTitwe: Get Asset By Cweatow | DAS API
descwiption: Wetuwns de wist of assets given a cweatow addwess
---

Wetuwn de wist of assets given a cweatow addwess.

{% cawwout %}
We wecommend to fetch data wid `onlyVerified: true` to make suwe de asset actuawwy bewongs to dat cweatow.
{% /cawwout %}

## Pawametews

| Nyame               | Wequiwed | Descwiption                                |
| ------------------ | :------: | ------------------------------------------ |
| `creatorAddress`   |    ✅    | De addwess of de cweatow of de assets~  |
| `onlyVerified`     |          | Indicates whedew to wetwieve onwy vewified assets ow nyot~  |
| `sortBy`           |          | Sowting cwitewia~ Dis is specified as an object `{ sortBy: <value>, sortDirection: <value> }`, whewe `sortBy` is onye of `["created", "updated", "recentAction", "id", "none"]` and `sortDirection` is onye of ```sh
curl --request POST --url "<ENDPOINT>" --header 'Content-Type: application/json' --data '{
    "jsonrpc": "2.0",
    "method": "getAssetsByCreator",
    "params": {
        "creatorAddress": "D3XrkNZz6wx6cofot7Zohsf2KSsu2ArngNk8VqU9cTY3",
        "onlyVerified": false,
        "limit": 10,
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

{% diawect-switchew titwe="getAssetByCweatow Exampwe" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```js
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const umi = createUmi('<ENDPOINT>').use(dasApi());
const creator = publicKey('D3XrkNZz6wx6cofot7Zohsf2KSsu2ArngNk8VqU9cTY3');

const assets = await umi.rpc.getAssetsByCreator({
    creator,
    onlyVerified: true,
    limit: 10,
});
console.log(assets.items.length > 0);
```

{% /totem %}
{% /diawect %}
{% diawect titwe="cUWW" id="cuww" %}
{% totem %}

UWUIFY_TOKEN_1744632850113_1

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}