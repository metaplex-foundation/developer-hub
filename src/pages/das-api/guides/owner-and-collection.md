---
title: Get Assets by Owner and Collection
metaTitle: Get Assets by Owner and Collection | DAS API Guides
description: Learn how to find digital assets from a specific collection owned by a particular wallet
---

# Get Assets by Owner and Collection

This guide shows you how to find digital assets that belong to a specific collection and are owned by a particular wallet address. This is useful for building collection-specific portfolio views, marketplace features, or analytics tools.

## Method 1: Using Search Assets with Owner and Collection Grouping (Recommended)

The `searchAssets` method allows you to combine owner and collection filters for precise results.

### UMI Example

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

// Find assets from a specific collection owned by a wallet
const collectionAssets = await umi.rpc.searchAssets({
  owner: publicKey('WALLET_ADDRESS'),
  grouping: {
    key: 'collection',
    value: 'COLLECTION_ADDRESS'
  },
  limit: 1000,
  displayOptions: {
    showCollectionMetadata: true,
  }
})

console.log(`Found ${collectionAssets.items.length} assets from collection owned by wallet`)
console.log(`Total available: ${collectionAssets.total}`)

// Process each asset
collectionAssets.items.forEach(asset => {
  console.log(`Asset ID: ${asset.id}`)
  console.log(`Name: ${asset.content.metadata?.name || 'Unknown'}`)
  console.log(`Interface: ${asset.interface}`)
  console.log('---')
})
```

### JavaScript Example

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
      ownerAddress: 'WALLET_ADDRESS',
      groupKey: 'collection',
      groupValue: 'COLLECTION_ADDRESS',
      limit: 1000,
      options: {
        showCollectionMetadata: true
      }
    }
  })
})

const data = await response.json()
console.log(`Found ${data.result.items.length} assets from collection owned by wallet`)
```

### cURL Example

```bash
curl -X POST https://api.mainnet-beta.solana.com \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "searchAssets",
    "params": {
      "ownerAddress": "WALLET_ADDRESS",
      "groupKey": "collection",
      "groupValue": "COLLECTION_ADDRESS",
      "limit": 1000,
      "options": {
        "showCollectionMetadata": true
      }
    }
  }'
```

## Common Use Cases

- **Collection Portfolio**: Display all assets from a specific collection owned by a user
- **Marketplace Integration**: Show available assets from a collection in a user's wallet
- **Collection Analytics**: Analyze holdings and value within specific collections
- **Rarity Tools**: Identify rare assets within collections
- **Trading Tools**: Track collection holdings for trading strategies

## Tips and Best Practices

1. **Use [Pagination](/das-api/guides/pagination)** for large datasets
2. **Include [Display Options](/das-api/guides/display-options)** to get additional metadata
3. **Sort results** to present data in meaningful ways
4. **Handle empty results** gracefully when collections are empty
5. **Verify collection addresses** before querying

## Further Reading

- [Get All Tokens in a Collection](/das-api/guides/get-collection-nfts) - Retrieve all assets from a specific collection
- [Get NFTs by Owner](/das-api/guides/get-nfts-by-owner) - Find all NFTs owned by a wallet
- [Search Assets by Multiple Criteria](/das-api/guides/search-by-criteria) - Combine multiple filters for advanced queries 