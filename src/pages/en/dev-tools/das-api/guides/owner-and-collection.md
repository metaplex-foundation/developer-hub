---
title: Get Assets by Owner and Collection
metaTitle: Get Assets by Owner and Collection | DAS API Guides
description: Learn how to find digital assets from a specific collection owned by a particular wallet
---

This guide shows you how to find digital assets that belong to a specific collection and are owned by a particular wallet address. This is useful for building collection-specific portfolio views, marketplace features, or analytics tools.

## Using Search Assets with Owner and Collection Grouping

The `searchAssets` method allows you to combine owner and collection filters for precise results.

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

  // Find assets from a specific collection owned by a wallet
  const collectionAssets = await umi.rpc.searchAssets({
    owner: publicKey("WALLET_ADDRESS"),
    grouping: ["collection", "COLLECTION_ADDRESS"],
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
        ownerAddress: 'WALLET_ADDRESS',
        grouping: ['collection', 'COLLECTION_ADDRESS'],
        limit: 1000,
        options: {
          showCollectionMetadata: true
        }
      }
    })
  })

  const data = await response.json()
  console.log(`Found ${data.result.items.length} assets from collection owned by wallet`)
})();
```

{% /totem-accordion %}
{% totem-accordion title="cURL Example" %}

```bash
curl -X POST <ENDPOINT> \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "searchAssets",
    "params": {
      "ownerAddress": "WALLET_ADDRESS",
      "grouping": ["collection", "COLLECTION_ADDRESS"],
      "limit": 1000,
      "options": {
        "showCollectionMetadata": true
      }
    }
  }'
```

{% /totem-accordion %}
{% /totem %}

## Common Use Cases

- **Collection Portfolio**: Display all assets from a specific collection owned by a user
- **Marketplace Integration**: Show available assets from a collection in a user's wallet
- **Collection Analytics**: Analyze holdings within specific collections
- **Trading Tools**: Track collection holdings for trading strategies

## Tips and Best Practices

1. **Use [Pagination](/dev-tools/das-api/guides/pagination)** for large datasets
2. **Include [Display Options](/dev-tools/das-api/display-options)** to get additional metadata
3. **Sort results** to present data in meaningful ways
4. **Handle empty results** gracefully when collections are empty
5. **Verify collection addresses** before querying

## Further Reading

- [Get All Tokens in a Collection](/dev-tools/das-api/guides/get-collection-nfts) - Retrieve all assets from a specific collection
- [Get NFTs by Owner](/dev-tools/das-api/guides/get-nfts-by-owner) - Find all NFTs owned by a wallet
- [Search Assets by Multiple Criteria](/dev-tools/das-api/guides/search-by-criteria) - Combine multiple filters for advanced queries
