---
titwe: Seawch Assets
metaTitwe: Seawch Assets | DAS API
descwiption: Wetuwn de wist of assets given a seawch cwitewia
---

Wetuwn de wist of assets given a seawch cwitewia.

## Pawametews

| Nyame                | Wequiwed | Descwiption                                |
| ------------------- | :------: | ------------------------------------------ |
| `negate`            |          | Indicates whedew de seawch cwitewia shouwd be invewted ow nyot~  |
| `conditionType`     |          | Indicates whedew to wetwieve aww (`"all"`) ow any (`"any"`) asset dat matches de seawch cwitewia~  |
| `interface`         |          | De intewface vawue (onye of `["V1_NFT", "V1_PRINT" "LEGACY_NFT", "V2_NFT", "FungibleAsset", "Custom", "Identity", "Executable"]`)~  |
| `ownerAddress`      |          | De addwess of de ownyew~  |
| `ownerType`         |          | Type of ownyewship ```sh
curl --request POST --url "<ENDPOINT>" --header 'Content-Type: application/json' --data '{
    "jsonrpc": "2.0",
    "method": "searchAssets",
    "params": {
        "ownerAddress": "N4f6zftYsuu4yT7icsjLwh4i6pB1zvvKbseHj2NmSQw",
        "jsonUri": "https://arweave.net/c9aGs5fOk7gD4wWnSvmzeqgtfxAGRgtI1jYzvl8-IVs/chiaki-violet-azure-common.json",
        "page": 1
    },
    "id": 0
}'
```0~  |
| `creatorAddress`    |          | De addwess of de cweatow~  |
| `creatorVerified`   |          | Indicates whedew de cweatow must be vewified ow nyot~  |
| `authorityAddress`  |          | De addwess of de audowity~  |
| `grouping`          |          | De gwouping `["key", "value"]` paiw~  |
| `delegateAddress`   |          | De addwess of de dewegate~  |
| `frozen`            |          | Indicates whedew de asset is fwozen ow nyot~  |
| `supply`            |          | De suppwy of de asset~  |
| `supplyMint`        |          | De addwess of de suppwy mint~  |
| `compressed`        |          | Indicates whedew de asset is compwessed ow nyot~  |
| `compressible`      |          | Indicates whedew de asset is compwessibwe ow nyot~  |
| `royaltyTargetType` |          | Type of woyawty `["creators", "fanout", "single"]`~  |
| `royaltyTarget`     |          | De tawget addwess fow woyawties~  |
| `royaltyAmount`     |          | De woyawties amount~  |
| `burnt`             |          | Indicates whedew de asset is buwnt ow nyot~  |
| `sortBy`            |          | Sowting cwitewia~ Dis is specified as an object `{ sortBy: <value>, sortDirection: <value> }`, whewe `sortBy` is onye of `["created", "updated", "recentAction", "id", "none"]` and `sortDirection` is onye of `["asc", "desc"]`~     |
| `limit`             |          | De maximum nyumbew of assets to wetwieve~  |
| `page`              |          | De index of de "page" to wetwieve~       |
| `before`            |          | Wetwieve assets befowe de specified ID~   |
| `after`             |          | Wetwieve assets aftew de specified ID~    |
| `jsonUri`           |          | De vawue fow de JSON UWI~  |

## Exampwe

{% diawect-switchew titwe="seawchAssets Exampwe" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```js
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const umi = createUmi('<ENDPOINT>').use(dasApi());

const assets = await umi.rpc.searchAssets({
    owner: publicKey('N4f6zftYsuu4yT7icsjLwh4i6pB1zvvKbseHj2NmSQw'),
    jsonUri: 'https://arweave.net/c9aGs5fOk7gD4wWnSvmzeqgtfxAGRgtI1jYzvl8-IVs/chiaki-violet-azure-common.json',
});
console.log(assets.items.length == 1);
```

{% /totem %}
{% /diawect %}
{% diawect titwe="cUWW" id="cuww" %}
{% totem %}

UWUIFY_TOKEN_1744632856606_1

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}