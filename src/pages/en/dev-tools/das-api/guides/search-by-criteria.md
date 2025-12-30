---
title: Search Assets by Multiple Criteria
metaTitle: Search Assets by Multiple Criteria | DAS API Guides
description: Learn how to combine multiple filters to find specific digital assets
---

This guide shows you how to use the DAS API's `searchAssets` method to find digital assets using multiple filters and criteria. This powerful method allows you to combine various parameters to create complex queries for finding specific assets.

## Method 1: Basic Multi-Criteria Search

The `searchAssets` method lets you combine multiple filters—for example, to find assets owned by a given wallet and created by a particular creator.

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

  // Search for assets with multiple criteria
  const searchResults = await umi.rpc.searchAssets({
    owner: publicKey("WALLET_ADDRESS"),
    creator: publicKey("CREATOR_ADDRESS"),
    limit: 1000,
    displayOptions: {
      showCollectionMetadata: true,
    },
  });

  console.log(`Found ${searchResults.items.length} assets matching criteria`);
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
          creatorAddress: 'CREATOR_ADDRESS',
          limit: 1000,
          options: {
            showCollectionMetadata: true,
          }
        },
      }),
    }
  );

  const data = await response.json();
  console.log(`Found ${data.result.items.length} assets`);
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
      "creatorAddress": "CREATOR_ADDRESS",
      "limit": 1000,
      "options": {
        "showCollectionMetadata": true,
      }
    }
  }'
```
{% /totem-accordion %}
{% /totem %}

## Method 2: Collection and Owner Search

Find assets from a specific collection owned by a particular wallet:

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
{% /totem %}

## Method 3: Advanced Filtering with Multiple Conditions

Combine filters for complex queries. For example, find NFTs that:  
• belong to a given collection  
• are owned by a specific wallet  
• are **not** frozen or compressed  
• have a verified creator  
• are sorted by creation date (descending)  
and include collection metadata:

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
  
    // Complex search with multiple criteria
    const complexSearch = await umi.rpc.searchAssets({
      owner: publicKey('WALLET_ADDRESS'),
      creator: publicKey('CREATOR_ADDRESS'),
      grouping: ["collection", "COLLECTION_ADDRESS"],
      frozen: false,
      compressed: false,
      displayOptions: {
        showCollectionMetadata: true,
      }
    })
  
  console.log(
    `Found ${complexSearch.items.length} assets matching complex criteria`
  );
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
        creatorAddress: 'CREATOR_ADDRESS',
        grouping: ['collection', 'COLLECTION_ADDRESS'],
        frozen: false,
        compressed: false,
        options: {
          showCollectionMetadata: true,
        }
      }
    })
  })

  const data = await response.json()
  console.log(`Found ${data.result.items.length} assets matching complex criteria`)
})();
```
{% /totem-accordion %}
{% /totem %}
## Tips and Best Practices

1. **Start simple**: Begin with basic criteria and add complexity gradually
2. **Use [Pagination](/dev-tools/das-api/guides/pagination)**: For large result sets, implement proper pagination
3. **Cache results**: Store frequently accessed search results
4. **Combine filters wisely**: Too many filters may return no results
5. **Handle empty results**: Always check for empty result sets, but keep in mind that some assets may be hidden or not indexed yet
6. **Use [Display Options](/dev-tools/das-api/display-options)**: Include relevant display options for your use case
7. **Sort results**: Use sorting to present data in meaningful ways
8. **Test queries**: Verify your search criteria with known data

## Next Steps

- [Get All Tokens in a Collection](/dev-tools/das-api/guides/get-collection-nfts) - Retrieve all assets from a specific collection
- [Get NFTs by Owner](/dev-tools/das-api/guides/get-nfts-by-owner) - Find all NFTs owned by a wallet
- [Get Assets By Creator](/dev-tools/das-api/methods/get-assets-by-creator) - Discover all tokens created by a specific wallet

## Further Reading

- [Get Assets By Creator](/dev-tools/das-api/methods/get-assets-by-creator) - Discover all tokens created by a specific wallet
- [Get All Tokens in a Collection](/dev-tools/das-api/guides/get-collection-nfts) - Retrieve all assets from a specific collection
- [Find Compressed NFTs](/dev-tools/das-api/guides/find-compressed-nfts) - Discover and work with compressed NFTs
