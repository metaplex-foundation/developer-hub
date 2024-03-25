---
title: Fetching Assets
metaTitle: Core - Fetching Assets
description: Learn how to fetch the various on-chain accounts of your assets on Core
---

## Fetch a single asset

To fetch a single Asset the following function can be used:

{% dialect-switcher title="Fetch a single asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchAssetV1 } from '@metaplex-foundation/mpl-core'

const asset = await fetchAssetV1(umi, assetAddress.publicKey)

console.log(asset)
```

{% /dialect %}
{% /dialect-switcher %}

## Fetch multiple Assets

Multiple Assets can either be fetched using a `getProgramAccounts` (GPA) call, which can be quite expensive and slow RPC wise, or using the `Digital Asset Standard` API, which is faster but requires [specific RPC providers](/rpc-providers).

### GPA fetch assets by owner

{% dialect-switcher title="fetch assets by owner" %}

{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { getAssetV1GpaBuilder, Key } from '@metaplex-foundation/mpl-core'

const owner = publicKey('11111111111111111111111111111111')

const assetsByOwner = await getAssetV1GpaBuilder(umi)
  .whereField('key', Key.AssetV1)
  .whereField('owner', owner)
  .getDeserialized()

console.log(assetsByOwner)
```

{% /dialect %}
{% /dialect-switcher %}

### GPA fetch assets by collection

{% dialect-switcher title="GPA fetch assets by collection" %}

{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { Key, getAssetV1GpaBuilder, updateAuthority } from 'core-preview'

const collection = publicKey('11111111111111111111111111111111')

const assetsByCollection = await getAssetV1GpaBuilder(umi)
  .whereField('key', Key.AssetV1)
  .whereField('updateAuthority', updateAuthority('Collection', [collection]))
  .getDeserialized()

console.log(assetsByCollection)
```

{% /dialect %}
{% /dialect-switcher %}

## DAS - Digital Asset Standard API

If you use a DAS enabled RPC you'll be able to take advantage of indexed Assets for lighting fast fetches and data retrieval.

DAS will index everything from metadata, off chain metadata, collection data, plugins (including Attributes), and more. To learn more about the Metaplex DAS API you can [click here](/das-api).

Below is an example of returned data from fetching a MPL Core Asset.

### FetchAsset Example

```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "result": {
    "authorities": [
      {
        "address": "Gi47RpRmg3wGsRRzFvcmyXHkELHznpx6DxEELGWBRWoC",
        "scopes": ["full"]
      }
    ],
    "burnt": false,
    "compression": {
      "asset_hash": "",
      "compressed": false,
      "creator_hash": "",
      "data_hash": "",
      "eligible": false,
      "leaf_id": 0,
      "seq": 0,
      "tree": ""
    },
    "content": {
      "$schema": "https://schema.metaplex.com/nft1.0.json",
      "files": [],
      "json_uri": "https://example.com/asset",
      "links": {},
      "metadata": {
        "name": "Test Asset",
        "symbol": ""
      }
    },
    "creators": [],
    "grouping": [
      {
        "group_key": "collection",
        "group_value": "8MPNmg4nyMGKdStSxbo2r2aoQGWz1pdjtYnQEt1kA2V7"
      }
    ],
    "id": "99A5ZcoaRSTGRigMpeu1u4wdgQsv6NgTDs5DR2Ug9TCQ",
    "interface": "MplCore",
    "mutable": true,
    "ownership": {
      "delegate": null,
      "delegated": false,
      "frozen": false,
      "owner": "Gi47RpRmg3wGsRRzFvcmyXHkELHznpx6DxEELGWBRWoC",
      "ownership_model": "single"
    },
    "plugins": {
      "FreezeDelegate": {
        "authority": {
          "Pubkey": {
            "address": "Gi47RpRmg3wGsRRzFvcmyXHkELHznpx6DxEELGWBRWoC"
          }
        },
        "data": {
          "frozen": false
        },
        "index": 0,
        "offset": 119
      }
    },
    "royalty": {
      "basis_points": 0,
      "locked": false,
      "percent": 0,
      "primary_sale_happened": false,
      "royalty_model": "creators",
      "target": null
    },
    "supply": null,
    "unknown_plugins": [
      {
        "authority": {
          "Pubkey": {
            "address": "Gi47RpRmg3wGsRRzFvcmyXHkELHznpx6DxEELGWBRWoC"
          }
        },
        "data": "CQA=",
        "index": 1,
        "offset": 121,
        "type": 9
      }
    ]
  }
}
```
