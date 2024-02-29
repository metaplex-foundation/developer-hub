---
title: Methods
metaTitle: DAS API - Methods
description: Callable API Methods for the Metaplex DAS API client.
---

The DAS API supports the following methods;

## `getAsset`

#### Parameters
| Name            | Required | Description                                |
| --------------- | :------: | ------------------------------------------ |
| `id`            |    ✅    | The id of the asset.                       |

```js
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const umi = createUmi('<ENDPOINT>').use(dasApi());
const assetId = publicKey('8TrvJBRa6Pzb9BDadqroHhWTHxaxK8Ws8r91oZ2jxaVV');

const asset = await umi.rpc.getAsset(assetId);
console.log(asset);
```

## `getAssetProof`

#### Parameters
| Name            | Required | Description                                |
| --------------- | :------: | ------------------------------------------ |
| `id`            |    ✅    | The id of the asset.                       |

```js
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const umi = createUmi('<ENDPOINT>').use(dasApi());
const assetId = publicKey('Ez6ezCMkRaUkWS5v6WVcP7uuCWiKadr3W2dHFkoZmteW');

const proof = await umi.rpc.getAssetProof(assetId);
console.log(proof);
```

## getAssetsByAuthority

#### Parameters
| Name               | Required | Description                                |
| ------------------ | :------: | ------------------------------------------ |
| `authorityAddress` |    ✅    | The address of the authority of the assets.|
| `sortBy`           |          | Sorting criteria. This is specified as an object `{ sortBy: <value>, sortDirection: <value> }`, where `sortBy` is one of `["created", "updated", "recentAction", "none"]` and `sortDirection` is one of `["asc", "desc"]`     |
| `limit`            |          | The maximum number of assets to retrieve.  |
| `page`             |          | The index of the "page" to retrieve.       |
| `before`           |          | Retrieve assets before the specified ID.   |
| `after`            |          | Retrieve assets after the specified ID.    |


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


## `getAssetsByCreator`

#### Parameters

| Name               | Required | Description                                |
| ------------------ | :------: | ------------------------------------------ |
| `creatorAddress`   |    ✅    | The address of the creator of the assets.  |
| `onlyVerified`     |          | Indicates whether to retrieve only verified assets or not.  |
| `sortBy`           |          | Sorting criteria. This is specified as an object `{ sortBy: <value>, sortDirection: <value> }`, where `sortBy` is one of `["created", "updated", "recentAction", "none"]` and `sortDirection` is one of `["asc", "desc"]`     |
| `limit`            |          | The maximum number of assets to retrieve.  |
| `page`             |          | The index of the "page" to retrieve.       |
| `before`           |          | Retrieve assets before the specified ID.   |
| `after`            |          | Retrieve assets after the specified ID.    |


```ts
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const umi = createUmi('<ENDPOINT>').use(dasApi());
const creator = publicKey('D3XrkNZz6wx6cofot7Zohsf2KSsu2ArngNk8VqU9cTY3');

const assets = await umi.rpc.getAssetsByCreator({
    creator,
    onlyVerified: false,
    limit: 10,
});
console.log(assets.items.length > 0);
```

## `getAssetsByGroup`

#### Parameters
| Name               | Required | Description                                |
| ------------------ | :------: | ------------------------------------------ |
| `groupKey`         |    ✅    | The key of the group (e.g., `"collection"`).  |
| `groupValue`       |    ✅    | The value of the group.  |
| `sortBy`           |          | Sorting criteria. This is specified as an object `{ sortBy: <value>, sortDirection: <value> }`, where `sortBy` is one of `["created", "updated", "recentAction", "none"]` and `sortDirection` is one of `["asc", "desc"]`     |
| `limit`            |          | The maximum number of assets to retrieve.  |
| `page`             |          | The index of the "page" to retrieve.       |
| `before`           |          | Retrieve assets before the specified ID.   |
| `after`            |          | Retrieve assets after the specified ID.    |



```ts
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


## `getAssetsByOwner`

#### Parameters
| Name               | Required | Description                                |
| ------------------ | :------: | ------------------------------------------ |
| `ownerAddress`     |    ✅    | The address of the owner of the assets.    |
| `sortBy`           |          | Sorting criteria. This is specified as an object `{ sortBy: <value>, sortDirection: <value> }`, where `sortBy` is one of `["created", "updated", "recentAction", "none"]` and `sortDirection` is one of `["asc", "desc"]`     |
| `limit`            |          | The maximum number of assets to retrieve.  |
| `page`             |          | The index of the "page" to retrieve.       |
| `before`           |          | Retrieve assets before the specified ID.   |
| `after`            |          | Retrieve assets after the specified ID.    |


```typescript
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



## `searchAssets`

#### Parameters
| Name                | Required | Description                                |
| ------------------- | :------: | ------------------------------------------ |
| `negate`            |          | Indicates whether the search criteria should be inverted or not.  |
| `conditionType`     |          | Indicates whether to retrieve all (`"all"`) or any (`"any"`) asset that matches the search criteria.  |
| `interface`         |          | The interface value (one of `["V1_NFT", "V1_PRINT" "LEGACY_NFT", "V2_NFT", "FungibleAsset", "Custom", "Identity", "Executable"]`).  |
| `ownerAddress`      |          | The address of the owner.  |
| `ownerType`         |          | Type of ownership `["single", "token"]`.  |
| `creatorAddress`    |          | The address of the creator.  |
| `creatorVerified`   |          | Indicates whether the creator must be verified or not.  |
| `authorityAddress`  |          | The address of the authority.  |
| `grouping`          |          | The grouping `["key", "value"]` pair.  |
| `delegateAddress`   |          | The address of the delegate.  |
| `frozen`            |          | Indicates whether the asset is frozen or not.  |
| `supply`            |          | The supply of the asset.  |
| `supplyMint`        |          | The address of the supply mint.  |
| `compressed`        |          | Indicates whether the asset is compressed or not.  |
| `compressible`      |          | Indicates whether the asset is compressible or not.  |
| `royaltyTargetType` |          | Type of royalty `["creators", "fanout", "single"]`.  |
| `royaltyTarget`     |          | The target address for royalties.  |
| `royaltyAmount`     |          | The royalties amount.  |
| `burnt`             |          | Indicates whether the asset is burnt or not.  |
| `sortBy`            |          | Sorting criteria. This is specified as an object `{ sortBy: <value>, sortDirection: <value> }`, where `sortBy` is one of `["created", "updated", "recentAction", "none"]` and `sortDirection` is one of `["asc", "desc"]`.     |
| `limit`             |          | The maximum number of assets to retrieve.  |
| `page`              |          | The index of the "page" to retrieve.       |
| `before`            |          | Retrieve assets before the specified ID.   |
| `after`             |          | Retrieve assets after the specified ID.    |
| `jsonUri`           |          | The value for the JSON URI.  |


```ts
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

