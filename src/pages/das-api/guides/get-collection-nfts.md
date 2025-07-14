---
title: Get All Tokens in a Collection
metaTitle: Get All Tokens in a Collection | DAS API Guides
description: Learn how to retrieve all digital assets belonging to a specific collection
---

This guide shows you how to retrieve all digital assets (NFTs, tokens) that belong to a specific collection using the DAS API. This is useful for building collection explorers, analytics dashboards, or marketplace features.

## Method 1: Using Get Assets By Group (Recommended)

The `getAssetsByGroup` method is specifically designed to find assets that belong to a particular collection.

{% totem %}
{% totem-accordion title="UMI Example" %}

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
const umi = createUmi('<ENDPOINT>').use(dasApi())

// Get all assets in a specific collection
const collectionAssets = await umi.rpc.getAssetsByGroup({
  groupKey: 'collection',
  groupValue: '<COLLECTION_ADDRESS>'
})

console.log(`Found ${collectionAssets.items.length} assets in collection`)
console.log(`Total: ${collectionAssets.total} assets available`)

// Process each asset
collectionAssets.items.forEach(asset => {
  console.log(`Asset ID: ${asset.id}`)
  console.log(`Name: ${asset.content.metadata?.name || 'Unknown'}`)
  console.log(`Interface: ${asset.interface}`)
  console.log(`Owner: ${asset.ownership.owner}`)
  console.log('---')
})

})()
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript Example" %}

```javascript
(async () => {
const response = await fetch('<ENDPOINT>', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getAssetsByGroup',
      params: {
        groupKey: 'collection',
        groupValue: '<COLLECTION_ADDRESS>'
      }
    })
  })
  
  const data = await response.json()
  console.log(`Found ${data.result.items.length} assets in collection`)
})()
```
{% /totem-accordion %}
{% totem-accordion title="cURL Example" %}
```bash
curl -X POST <ENDPOINT> \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getAssetsByGroup",
    "params": {
      "groupKey": "collection",
      "groupValue": "COLLECTION_ADDRESS"
    }
  }'
```
{% /totem-accordion %}
{% /totem %}

## Method 2: Using Search Assets with Collection Filter

You can also use `searchAssets` with a collection grouping for more specific queries. See [Search Assets by Criteria](/das-api/guides/search-by-criteria) for more information.

{% totem %}
{% totem-accordion title="UMI Example" %}

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  // Search for all assets in a collection with additional filters
  const allCollectionNfts = await umi.rpc.searchAssets({
    grouping: ['collection', '<COLLECTION_ADDRESS>'],
    // Optional: DAS usually returns 10.000 assets
    limit: 1000,
    // Optional: Display collection metadata in each asset
    displayOptions: {
      showCollectionMetadata: true
    }
  });

  console.log(`Found ${allCollectionNfts.items.length} assets`)
})();
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript Example" %}

```javascript
(async () => {
  const response = await fetch('<ENDPOINT>', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'searchAssets',
      params: {
        grouping: ['collection', '<COLLECTION_ADDRESS>'],
        limit: 1000,
        options: {
          showCollectionMetadata: true,
        }
      }
    })
  })

  const data = await response.json()
  console.log(`Found ${data.result.items.length} assets`)
})();
```
{% /totem-accordion %}
{% /totem %}

## Method 3: Sorting Collection Assets

You can sort collection assets by various criteria:

{% totem %}
{% totem-accordion title="UMI Example" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  // Get collection assets sorted by creation date (newest first)
  const newestAssets = await umi.rpc.getAssetsByGroup({
    groupKey: 'collection',
    groupValue: 'COLLECTION_ADDRESS',
    limit: 1000,
    sortBy: {
      sortBy: 'created',
      sortDirection: 'desc'
    },
    displayOptions: {
      showCollectionMetadata: true
    }
  })

  // Get collection assets sorted by name
  const nameSortedAssets = await umi.rpc.getAssetsByGroup({
    groupKey: 'collection',
    groupValue: 'COLLECTION_ADDRESS',
    limit: 1000,
    sortBy: {
      sortBy: 'name',
      sortDirection: 'asc'
    },
    displayOptions: {
      showCollectionMetadata: true
    }
  })

  console.log('Newest assets first:')
newestAssets.items.slice(0, 5).forEach(asset => {
  console.log(`${asset.content.metadata?.name} - ID: ${asset.id}`)
})
})();
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript Example" %}

```javascript
(async () => {
  // Get collection assets sorted by creation date (newest first)
  const newestResponse = await fetch('<ENDPOINT>', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getAssetsByGroup',
      params: {
        groupKey: 'collection',
        groupValue: 'COLLECTION_ADDRESS',
        limit: 1000,
        sortBy: {
          sortBy: 'created',
          sortDirection: 'desc'
        },
        options: {
          showCollectionMetadata: true
        }
      }
    })
  })

  const newestData = await newestResponse.json()
  const newestAssets = newestData.result

  // Get collection assets sorted by name
  const nameResponse = await fetch('<ENDPOINT>', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getAssetsByGroup',
      params: {
        groupKey: 'collection',
        groupValue: 'COLLECTION_ADDRESS',
        limit: 1000,
        sortBy: {
          sortBy: 'name',
          sortDirection: 'asc'
        },
        options: {
          showCollectionMetadata: true
        }
      }
    })
  })

  const nameData = await nameResponse.json()
  const nameSortedAssets = nameData.result

  console.log('Newest assets first:')
  newestAssets.items.slice(0, 5).forEach(asset => {
    console.log(`${asset.content.metadata?.name} - ID: ${asset.id}`)
  })
})();
```
{% /totem-accordion %}
{% /totem %}

## Common Use Cases

- **Collection Explorers**: Display all assets in a collection with filtering and sorting
- **Marketplace Integration**: Show available assets from a specific collection
- **Analytics Dashboards**: Track collection statistics and ownership distribution
- **Gaming Applications**: Load all assets from a game's collection

## Tips and Best Practices

1. **Use [pagination](/das-api/guides/pagination)** for large collections to avoid rate limits
2. **Cache results** when possible to improve performance
3. **Include [display options](/das-api/guides/display-options)** to get additional metadata
4. **Sort results** to present data in meaningful ways
5. **Handle errors** gracefully when collection addresses are invalid

## Next Steps

- [Get Assets By Creator](/das-api/methods/get-assets-by-creator) - Discover all tokens created by a specific wallet
- [Get All Tokens in a Wallet](/das-api/guides/get-wallet-tokens) - See everything a wallet owns
- [Search Assets by Multiple Criteria](/das-api/guides/search-by-criteria) - Combine multiple filters for advanced queries
