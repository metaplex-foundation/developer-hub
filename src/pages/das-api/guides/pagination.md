---
title: Paginating DAS API Requests
metaTitle: Pagination | DAS API
description: Learn how to paginate DAS API Requests efficiently
---

# Paginating DAS API Requests

The Digital Asset Standard (DAS) API usually has a limit of 1,000 records per request. When you need to retrieve more data, pagination becomes essential. This guide covers the available pagination methods and best practices for implementing them efficiently.

## Understanding Sort Options

Before diving into pagination, it's important to understand the available sorting options as they affect how you'll paginate through results:

- `id` (Default): Sorts assets by their binary ID
- `created`: Sorts by creation timestamp
- `recentAction`: Sorts by last update timestamp
- `none`: No sorting applied (not recommended for pagination)

In addition to the sorting options, you can also use the `sortDirection` parameters `asc` or `desc` to sort the results in ascending or descending order.

## Pagination Methods

### Page-Based Pagination (Recommended for Beginners)

Page-based pagination is the easiest method to implement and understand. It's perfect for beginners and most common use cases.

#### How it works:
- Specify a page number and items per page
- Navigate through results by incrementing the page number

#### Key parameters:
- `page`: The current page number (starts at 1)
- `limit`: Number of items per page (usually max 1,000)
- `sortBy`: Sorting option

#### Considerations:
- Simple to implement and understand
- Works fine for most common use cases
- Performance may degrade with large page numbers

{% totem %}
{% totem-accordion title="UMI Example" %}
```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('https://api.mainnet-beta.solana.com').use(dasApi())

async function getAllAssetsByPage(collectionAddress: string) {
  const limit = 1000
  let page = 1
  let allAssets: any[] = []
  let hasMore = true

  while (hasMore) {
    console.log(`Fetching page ${page}...`)
    
    const assets = await umi.rpc.getAssetsByGroup({
      groupKey: 'collection',
      groupValue: collectionAddress,
      limit: limit,
      page: page,
      sortBy: {
        sortBy: 'created',
        sortDirection: 'desc'
      }
    })

    if (assets.items.length === 0) {
      hasMore = false
    } else {
      allAssets = [...allAssets, ...assets.items]
      page++
      
      // Safety check to prevent infinite loops
      if (page > 100) {
        console.log('Reached maximum page limit')
        break
      }
    }
  }

  console.log(`Total assets retrieved: ${allAssets.length}`)
  return allAssets
}

// Usage
const collectionAssets = await getAllAssetsByPage('J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w')
```
{% /totem-accordion %}
{% /totem %}

{% totem %}
{% totem-accordion title="JavaScript Example" %}
```javascript
const url = 'https://api.mainnet-beta.solana.com'

async function getAllAssetsByPage(collectionAddress) {
  let page = 1
  let allAssets = []
  let hasMore = true

  while (hasMore) {
    console.log(`Fetching page ${page}...`)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'getAssetsByGroup',
        params: {
          groupKey: 'collection',
          groupValue: collectionAddress,
          page: page,
          limit: 1000,
          sortBy: { sortBy: 'created', sortDirection: 'desc' },
        },
      }),
    })

    const { result } = await response.json()
    
    if (result.items.length === 0) {
      hasMore = false
    } else {
      allAssets = [...allAssets, ...result.items]
      page++
      
      // Safety check
      if (page > 100) {
        console.log('Reached maximum page limit')
        break
      }
    }
  }

  console.log(`Total assets retrieved: ${allAssets.length}`)
  return allAssets
}

// Usage
const collectionAssets = await getAllAssetsByPage('J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w')
```
{% /totem-accordion %}
{% /totem %}

### Cursor-Based Pagination (Recommended for Advanced Users)

For larger datasets or when performance is critical, cursor-based pagination offers better efficiency and is the recommended approach for production applications.

#### How it works:
- Uses a cursor string to track position
- Cursor value is returned with each response
- Pass the cursor to the next request to get the next page
- Perfect for sequential data traversal

#### Key parameters:
- `cursor`: Position marker for the next set of results
- `limit`: Number of items per page (max 1,000)
- `sortBy`: Must be set to `id` for cursor-based pagination

{% totem %}
{% totem-accordion title="UMI Example" %}
```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('https://api.mainnet-beta.solana.com').use(dasApi())

async function getAllAssetsByCursor(collectionAddress: string) {
  const limit = 1000
  let allAssets: any[] = []
  let cursor: string | undefined

  do {
    console.log(`Fetching batch with cursor: ${cursor || 'initial'}`)
    
    const response = await umi.rpc.searchAssets({
      grouping: {
        key: 'collection',
        value: collectionAddress
      },
      limit: limit,
      cursor: cursor,
      sortBy: {
        sortBy: 'id',
        sortDirection: 'asc'
      }
    })

    allAssets = [...allAssets, ...response.items]
    cursor = response.cursor
    
    console.log(`Fetched ${response.items.length} items, total: ${allAssets.length}`)
    
  } while (cursor !== undefined)

  console.log(`Total assets retrieved: ${allAssets.length}`)
  return allAssets
}

// Usage
const collectionAssets = await getAllAssetsByCursor('J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w')
```
{% /totem-accordion %}
{% /totem %}

{% totem %}
{% totem-accordion title="JavaScript Example" %}
```javascript
const url = 'https://api.mainnet-beta.solana.com'

async function getAllAssetsByCursor(collectionAddress) {
  let allAssets = []
  let cursor

  do {
    console.log(`Fetching batch with cursor: ${cursor || 'initial'}`)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'searchAssets',
        params: {
          grouping: ['collection', collectionAddress],
          limit: 1000,
          cursor: cursor,
          sortBy: { sortBy: 'id', sortDirection: 'asc' },
        },
      }),
    })

    const { result } = await response.json()
    
    allAssets = [...allAssets, ...result.items]
    cursor = result.cursor
    
    console.log(`Fetched ${result.items.length} items, total: ${allAssets.length}`)
    
  } while (cursor !== undefined)

  console.log(`Total assets retrieved: ${allAssets.length}`)
  return allAssets
}

// Usage
const collectionAssets = await getAllAssetsByCursor('J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w')
```
{% /totem-accordion %}
{% /totem %}

## Performance Comparison

| Method | Complexity | Performance | Use Case |
|--------|------------|-------------|----------|
| Page-based | Low | Good for small datasets | Beginners, simple applications |
| Cursor-based | Medium | Excellent | Production applications, large datasets |
| Range-based | High | Excellent | Advanced queries, parallel processing |

## Best Practices

### 1. Choose the Right Method
- **Use page-based pagination** for simple use cases and beginners
- **Use cursor-based pagination** for production applications and large collections
- **Use range-based pagination** for advanced querying patterns

### 2. Error Handling
- Always check for empty result sets
- Implement retry logic for failed requests
- Handle rate limits appropriately
- Add safety checks to prevent infinite loops

### 3. Performance Optimization
- Keep track of the last processed item
- Implement proper caching strategies, but keep in mind that data, especially proofs can change quickly
- Use appropriate sorting methods
- Consider implementing checkpoints for long-running operations

### 4. Data Consistency
- Always use sorting when paginating
- Maintain consistent sort parameters between requests

## Conclusion

Choosing the right pagination strategy depends on your specific use case:

- **For beginners and simple applications**: Use page-based pagination
- **For production applications**: Use cursor-based pagination
- **For advanced use cases**: Use range-based pagination

Cursor-based pagination is generally the best choice for most applications as it provides excellent performance and is relatively simple to implement. Page-based pagination is perfect for learning and simple use cases, while range-based pagination offers maximum flexibility for advanced scenarios.

## Further Reading

- [Get All Tokens in a Collection](/das-api/guides/get-collection-nfts) - Retrieve all assets from a specific collection
- [Search Assets by Criteria](/das-api/guides/search-by-criteria) - Advanced search and filtering
- [Find Compressed NFTs](/das-api/guides/find-compressed-nfts) - Working with compressed NFTs 