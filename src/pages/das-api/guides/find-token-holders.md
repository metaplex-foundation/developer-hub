---
title: Find Who Holds a Specific Token
metaTitle: Find Token Holders | DAS API Guides
description: Learn how to discover all wallets holding a particular token
---

# Find Who Holds a Specific NFT in a Collection

This guide shows you how to find all wallets that hold a specific NFT in a collection using the DAS API. This is useful for understanding token distribution, finding whale holders, or analyzing ownership patterns.

## Method 1: Using Search Assets (Recommended)

The `searchAssets` method is the most efficient way to find all holders of a specific NFT in a collection. `getAssetsByGroup` is also a good option, but it is less flexible.

{% totem %}
{% totem-accordion title="UMI Example" %}
```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

// Find all holders of a specific NFT in a collection
const holders = await umi.rpc.searchAssets({
  grouping: {
    key: 'collection',
    value: 'YOUR_COLLECTION_ADDRESS'
  },
  limit: 1000,
  displayOptions: {
    showCollectionMetadata: true
  }
})

console.log(`Found ${holders.items.length} holders`)
holders.items.forEach(asset => {
  console.log(`Owner: ${asset.ownership.owner}`)
  console.log(`Token ID: ${asset.id}`)
})
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript Example" %}
```javascript
const response = await fetch('https://api.mainnet-beta.solana.com', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'searchAssets',
    params: {
      groupKey: 'collection',
      groupValue: 'YOUR_COLLECTION_ADDRESS',
      limit: 1000,
      options: {
        showCollectionMetadata: true
      }
    }
  })
})

const data = await response.json()
console.log(`Found ${data.result.items.length} assets in collection`)
```
{% /totem-accordion %}
{% totem-accordion title="cURL Example" %}
```bash
curl -X POST https://api.mainnet-beta.solana.com \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "searchAssets",
    "params": {
      "groupKey": "collection",
      "groupValue": "YOUR_COLLECTION_ADDRESS",
      "limit": 1000,
      "options": {
        "showCollectionMetadata": true
      }
    }
  }'
```
{% /totem-accordion %}
{% /totem %}

## Method 2: Using Get Assets By Group

For collection-based NFTs, you can use also `getAssetsByGroup` to find all NFTs in a collection. It is easier to use than `searchAssets` but provides less options for further filtering.

{% totem %}
{% totem-accordion title="UMI Example" %}
```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi(
    "<<ENDPOINT>>"
  ).use(dasApi());

  // Get all assets in a collection
  const collectionAssets = await umi.rpc.getAssetsByGroup({
    groupKey: "collection",
    groupValue: "COLLECTION_ADDRESS",
  });

  // Extract unique owners
  const uniqueOwners = new Set();
  collectionAssets.items.forEach((asset) => {
    uniqueOwners.add(asset.ownership.owner);
  });

  console.log(`Found ${uniqueOwners.size} unique holders`);
  console.log("Holders:", Array.from(uniqueOwners));
})();
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript Example" %}
```javascript
(async () => {
  const response = await fetch(
    "<ENDPOINT>",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getAssetsByGroup",
        params: {
          groupKey: "collection",
          groupValue: "COLLECTION_ADDRESS",
        },
      }),
    }
  );
  const collectionAssets = await response.json();

  // Extract unique owners
  const uniqueOwners = new Set();
  collectionAssets.result.items.forEach((asset) => {
    uniqueOwners.add(asset.ownership.owner);
  });

  console.log(`Found ${uniqueOwners.size} unique holders`);
  console.log("Holders:", Array.from(uniqueOwners));
})();
```
{% /totem %}

## Method 3: For Individual Tokens

If you want to find holders of a specific individual NFT (not part of a collection), you'll need to use the NFT's specific ID.

{% totem %}
{% totem-accordion title="UMI Example" %}
```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi(
    "<ENDPOINT>"
  ).use(dasApi());

  // Get a specific token
  const token = await umi.rpc.getAsset({
    assetId: publicKey("SPECIFIC_TOKEN_ID")
  });

  console.log(`Token ${token.id} is owned by: ${token.ownership.owner}`);
})();

```
{% /totem-accordion %}
{% totem-accordion title="JavaScript Example" %}
```javascript
(async () => {
    const response = await fetch("<ENDPOINT>", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          "jsonrpc": "2.0",
          "id": 1,
          "method": "getAsset",
          "params": {
            "id": "SPECIFIC_TOKEN_ID"
          }
        })
    })
})();
```
{% /totem-accordion %}
{% /totem %}

## Tips and Best Practices

1. **Handle [Pagination](/das-api/guides/pagination)**: For large collections, always implement pagination to get all results.

2. **Use [Display Options](/das-api/guides/display-options)**: Enable `showCollectionMetadata` to get additional collection information.

3. **Cache Results**: Where NFT holder data doesn't change frequently, consider caching results for better performance.

4. **Rate Limiting**: Be mindful of API rate limits when making multiple requests.

## Related Guides

- [Get All Tokens in a Collection](/das-api/guides/get-collection-nfts)
- [Analyze Collection Statistics](/das-api/guides/collection-statistics)
- [Track Asset Transfers](/das-api/guides/track-transfers) 