---
title: Search Assets by Multiple Criteria
metaTitle: Search Assets by Multiple Criteria | DAS API Guides
description: Learn how to combine multiple filters to find specific digital assets
---

# Search Assets by Multiple Criteria

This guide shows you how to use the DAS API's `searchAssets` method to find digital assets using multiple filters and criteria. This powerful method allows you to combine various parameters to create complex queries for finding specific assets.

## Method 1: Basic Multi-Criteria Search

The `searchAssets` method supports combining multiple filters for precise asset discovery.

### UMI Example

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

// Search for assets with multiple criteria
const searchResults = await umi.rpc.searchAssets({
  owner: publicKey('WALLET_ADDRESS'),
  creator: publicKey('CREATOR_ADDRESS'),
  limit: 1000,
  displayOptions: {
    showCollectionMetadata: true,
  }
})

console.log(`Found ${searchResults.items.length} assets matching criteria`)
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
      creatorAddress: 'CREATOR_ADDRESS',
      limit: 1000,
      options: {
        showCollectionMetadata: true,
      }
    }
  })
})

const data = await response.json()
console.log(`Found ${data.result.items.length} assets`)
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
      "creatorAddress": "CREATOR_ADDRESS",
      "limit": 1000,
      "options": {
        "showCollectionMetadata": true,
      }
    }
  }'
```

## Method 2: Collection and Owner Search

Find assets from a specific collection owned by a particular wallet:

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
    showCollectionMetadata: true
  }
})

console.log(`Found ${collectionAssets.items.length} assets from collection owned by wallet`)
```

## Method 3: Advanced Filtering with Multiple Conditions

Combine various filters for complex queries, like searching for NFTs from a specific collection and owned by a specific wallet that are not frozen have a specific verified creator and are not compressed sorted by creation date in descending order including the collection metadata:

### UMI Example

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

// Complex search with multiple criteria
const complexSearch = await umi.rpc.searchAssets({
  owner: publicKey('WALLET_ADDRESS'),
  creator: publicKey('CREATOR_ADDRESS'),
  grouping: {
    key: 'collection',
    value: 'COLLECTION_ADDRESS'
  },
  creatorVerified: true,
  frozen: false,
  compressed: false,
  limit: 1000,
  sortBy: {
    sortBy: 'created',
    sortDirection: 'desc'
  },
  displayOptions: {
    showCollectionMetadata: true,
  }
})

console.log(`Found ${complexSearch.items.length} assets matching complex criteria`)
```

## Method 6: Search by JSON URI and Interface

Find assets with specific metadata or interface types:

### UMI Example

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

// Find assets with specific JSON URI pattern
const specificUriAssets = await umi.rpc.searchAssets({
  jsonUri: 'https://arweave.net/metadata/',
  limit: 1000,
  displayOptions: {
    showCollectionMetadata: true
  }
})

console.log(`Found ${specificUriAssets.items.length} assets with this metadata uri`)

```

## Tips and Best Practices

1. **Start simple**: Begin with basic criteria and add complexity gradually
2. **Use [Pagination](/das-api/guides/pagination)**: For large result sets, implement proper pagination
3. **Cache results**: Store frequently accessed search results
4. **Combine filters wisely**: Too many filters may return no results
5. **Handle empty results**: Always check for empty result sets, but keep in mind that some assets may be hidden or not indexed yet
6. **Use [Display Options](/das-api/guides/display-options)**: Include relevant display options for your use case
7. **Sort results**: Use sorting to present data in meaningful ways
8. **Test queries**: Verify your search criteria with known data

## Next Steps

- [Get All Tokens in a Collection](/das-api/guides/get-collection-nfts) - Retrieve all assets from a specific collection
- [Get NFTs by Owner](/das-api/guides/get-nfts-by-owner) - Find all NFTs owned by a wallet
- [Get Assets By Creator](/das-api/methods/get-assets-by-creator) - Discover all tokens created by a specific wallet

## Further Reading

- [Get Assets By Creator](/das-api/methods/get-assets-by-creator) - Discover all tokens created by a specific wallet
- [Get All Tokens in a Collection](/das-api/guides/get-collection-nfts) - Retrieve all assets from a specific collection
- [Find Compressed NFTs](/das-api/guides/find-compressed-nfts) - Discover and work with compressed NFTs 