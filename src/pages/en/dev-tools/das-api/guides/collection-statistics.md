---
title: Analyze Collection Statistics
metaTitle: Analyze Collection Statistics | DAS API Guides
description: Learn how to get insights about collection distribution and ownership using the DAS API
---

# Analyze Collection Statistics

This guide shows you how to analyze collection statistics, distribution, and ownership patterns using the DAS API. This is useful for building analytics dashboards, marketplace insights, or collection management tools.

## Basic Collection Statistics

Get fundamental statistics about a collection including total assets, ownership distribution. Be creative with the results and use the data to build your own insights.

{% totem %}
{% totem-accordion title="UMI Example" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  async function getCollectionStatistics(collectionAddress) {
    // Get all assets in the collection
    const collectionAssets = await umi.rpc.getAssetsByGroup({
      groupKey: 'collection',
      groupValue: collectionAddress,
      limit: 1000,
      displayOptions: {
        showCollectionMetadata: true
      }
    })

    const assets = collectionAssets.items
    
    // Basic statistics
    const totalAssets = assets.length
    const uniqueOwners = new Set(assets.map(asset => asset.ownership.owner))
      
    // Ownership distribution
    const ownershipCounts = {}
    assets.forEach(asset => {
      ownershipCounts[asset.ownership.owner] = (ownershipCounts[asset.ownership.owner] || 0) + 1
    })
    
    // Top owners
    const topOwners = Object.entries(ownershipCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
    
    console.log('Collection Statistics:')
    console.log(`Total assets: ${totalAssets}`)
    console.log(`Unique owners: ${uniqueOwners.size}`)
    console.log('Top 10 owners:', topOwners)
    
    return {
      totalAssets,
      uniqueOwners: uniqueOwners.size,
      ownershipCounts,
      topOwners
    }
  }

  // Usage
  const stats = await getCollectionStatistics('COLLECTION_ADDRESS')
})();
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript Example" %}

```javascript
(async () => {
  async function getCollectionStatistics(collectionAddress) {
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
          groupValue: collectionAddress,
          limit: 1000,
          options: {
            showCollectionMetadata: true,
          }
        }
      })
    })

    const data = await response.json()
    const assets = data.result.items
    
    // Basic statistics
    const totalAssets = assets.length
    const uniqueOwners = new Set(assets.map(asset => asset.ownership.owner))
      
    // Ownership distribution
    const ownershipCounts = {}
    assets.forEach(asset => {
      ownershipCounts[asset.ownership.owner] = (ownershipCounts[asset.ownership.owner] || 0) + 1
    })
    
    // Top owners
    const topOwners = Object.entries(ownershipCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
    
    console.log('Collection Statistics:')
    console.log(`Total assets: ${totalAssets}`)
    console.log(`Unique owners: ${uniqueOwners.size}`)
    console.log('Top 10 owners:', topOwners)
    
    return {
      totalAssets,
      uniqueOwners: uniqueOwners.size,
      ownershipCounts,
      topOwners
    }
  }

  // Usage
  const stats = await getCollectionStatistics('COLLECTION_ADDRESS')
})();
```
{% /totem-accordion %}
{% /totem %}

## Common Use Cases

- **Analytics Dashboards**: Display collection statistics and trends
- **Collection Management**: Monitor collection health and growth
- **Investor Tools**: Analyze collection performance and rarity

## Tips and Best Practices

1. **[Use pagination](/dev-tools/das-api/guides/pagination)** for large collections to get complete data
2. **Cache results** to improve performance for frequent queries
3. **Handle edge cases** like missing metadata or attributes
4. **Normalize data** for consistent analysis across collections
5. **Track trends** over time for meaningful insights

## Further Reading

- [Get All Tokens in a Collection](/dev-tools/das-api/guides/get-collection-nfts) - Retrieve all assets from a specific collection
- [Find Compressed NFTs](/dev-tools/das-api/guides/find-compressed-nfts) - Discover and work with compressed NFTs
- [Search Assets by Multiple Criteria](/dev-tools/das-api/guides/search-by-criteria) - Combine multiple filters for advanced queries
