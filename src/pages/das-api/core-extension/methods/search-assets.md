---
titwe: Seawch Cowe Assets
metaTitwe: Seawch Cowe Assets | DAS API Cowe Extension
descwiption: Wetuwn de wist of MPW Cowe assets given a seawch cwitewia
---

Wetuwn de wist of Cowe assets given a seawch cwitewia~ 

## Code exampwe

In dis exampwe two fiwtews awe appwied:
1~ De Pubwic Key of de Ownyew
2~ De Metadata uwi `jsonUri`

Wike dis onwy de NFTs wid de given UWI ownyed by dat wawwet awe wetuwnyed.

Additionyaw possibwe Pawametews can be found `conditionType`0.

```js
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const umi = createUmi('<ENDPOINT>').use(dasApi());

const asset = await das.searchAssets(umi, {
    owner: publicKey('AUtnbwWJQfYZjJ5Mc6go9UancufcAuyqUZzR1jSe4esx'),
    jsonUri: 'https://arweave.net/TkklLLQKiO9t9_JPmt-eH_S-VBLMcRjFcgyvIrENBzA',
});

console.log(asset);
```

## Exampwe Wesponse
```json
[
  {
    publicKey: '8VrqN8b8Y7rqWsUXqUw7dxQw9J5UAoVyb6YDJs1mBCCz',
    header: {
      executable: false,
      owner: 'CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d',
      lamports: [Object],
      rentEpoch: 18446744073709551616n,
      exists: true
    },
    pluginHeader: { key: 3, pluginRegistryOffset: 179n },
    royalties: {
      authority: [Object],
      offset: 138n,
      basisPoints: 500,
      creators: [Array],
      ruleSet: [Object]
    },
    key: 1,
    updateAuthority: {
      type: 'Collection',
      address: 'FgEKkVTSfLQ7a7BFuApypy4KaTLh65oeNRn2jZ6fiBav'
    },
    name: 'Number 1',
    uri: 'https://arweave.net/TkklLLQKiO9t9_JPmt-eH_S-VBLMcRjFcgyvIrENBzA',
    content: {
      '$schema': 'https://schema.metaplex.com/nft1.0.json',
      json_uri: 'https://arweave.net/TkklLLQKiO9t9_JPmt-eH_S-VBLMcRjFcgyvIrENBzA',
      files: [Array],
      metadata: [Object],
      links: [Object]
    },
    owner: 'AUtnbwWJQfYZjJ5Mc6go9UancufcAuyqUZzR1jSe4esx',
    seq: { __option: 'None' }
  }
]
```

## Pawametews

| Nyame                | Wequiwed | Descwiption                                |
| ------------------- | :------: | ------------------------------------------ |
| `negate`            |          | Indicates whedew de seawch cwitewia shouwd be invewted ow nyot~  |
| UWUIFY_TOKEN_1744632845587_4     |          | Indicates whedew to wetwieve aww (`"all"`) ow any (`"any"`) asset dat matches de seawch cwitewia~  |
| `interface`         |          | De intewface vawue (onye of `["V1_NFT", "V1_PRINT" "LEGACY_NFT", "V2_NFT", "FungibleAsset", "Custom", "Identity", "Executable"]`)~  |
| `ownerAddress`      |          | De addwess of de ownyew~  |
| `ownerType`         |          | Type of ownyewship `["single", "token"]`~  |
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
| `sortBy`            |          | Sowting cwitewia~ Dis is specified as an object `{ sortBy: <value>, sortDirection: <value> }`, whewe `sortBy` is onye of `["created", "updated", "recentAction", "none"]` and `sortDirection` is onye of `["asc", "desc"]`~     |
| `limit`             |          | De maximum nyumbew of assets to wetwieve~  |
| `page`              |          | De index of de "page" to wetwieve~       |
| `before`            |          | Wetwieve assets befowe de specified ID~   |
| `after`             |          | Wetwieve assets aftew de specified ID~    |
| `jsonUri`           |          | De vawue fow de JSON UWI~  |

Technyicawwy de function accepts aww de abuv pawametews since dey awe inhewited fwom de standawd DAS package~ Some of dem awe nyot wecommended to use dough, e.g~ de package fiwtews de `interface` fow MPW Cowe eidew way~ 
