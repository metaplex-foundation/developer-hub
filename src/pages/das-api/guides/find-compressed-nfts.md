---
title: Find Compressed NFTs
metaTitle: Find Compressed NFTs | DAS API Guides
description: Learn how to discover and work with compressed NFTs using the DAS API
---

# Find Compressed NFTs

This guide shows you how to find and work with compressed NFTs using the DAS API. Compressed NFTs are a space-efficient way to store NFT data on Solana using Bubblegum or Bubblegum V2, and the DAS API provides special methods to handle them.

## Method 1: Finding Compressed NFTs by Owner

Discover compressed NFTs owned by a specific wallet:

{% totem %}
{% totem-accordion title="UMI Example" %}
```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

// Find compressed NFTs owned by a specific wallet
const ownerCompressedNfts = await umi.rpc.searchAssets({
  owner: publicKey('WALLET_ADDRESS'),
  compressed: true,
  limit: 1000,
  displayOptions: {
    showCollectionMetadata: true
  }
})

console.log(`Found ${ownerCompressedNfts.items.length} compressed NFTs owned by wallet`)

// Compare with regular NFTs
const regularNfts = await umi.rpc.searchAssets({
  owner: publicKey('WALLET_ADDRESS'),
  compressed: false,
  limit: 1000,
  displayOptions: {
    showCollectionMetadata: true
  }
})

console.log(`Regular NFTs: ${regularNfts.items.length}`)
console.log(`Compressed NFTs: ${ownerCompressedNfts.items.length}`)
console.log(`Total NFTs: ${regularNfts.items.length + ownerCompressedNfts.items.length}`)
```
{% /totem-accordion %}
{% /totem %}

## Method 2: Finding Compressed NFTs by Collection

Find compressed NFTs from a specific collection:

{% totem %}
{% totem-accordion title="UMI Example" %}
```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

// Find compressed NFTs from a specific collection
const collectionCompressedNfts = await umi.rpc.searchAssets({
  grouping: {
    key: 'collection',
    value: 'COLLECTION_ADDRESS'
  },
  compressed: true,
  limit: 1000,
  displayOptions: {
    showCollectionMetadata: true
  }
})

console.log(`Found ${collectionCompressedNfts.items.length} compressed NFTs in collection`)
```
{% /totem-accordion %}
{% /totem %}

## Method 3: Finding Compressed NFTs by Creator

Discover compressed NFTs created by a specific wallet:

{% totem %}
{% totem-accordion title="UMI Example" %}
```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

// Find compressed NFTs created by a specific wallet
const creatorCompressedNfts = await umi.rpc.searchAssets({
  creator: publicKey('CREATOR_ADDRESS'),
  compressed: true,
  limit: 1000,
  displayOptions: {
    showCollectionMetadata: true
  }
})

console.log(`Found ${creatorCompressedNfts.items.length} compressed NFTs created by wallet`)

// Compare with regular NFTs by same creator
const creatorRegularNfts = await umi.rpc.searchAssets({
  creator: publicKey('CREATOR_ADDRESS'),
  compressed: false,
  limit: 1000,
  displayOptions: {
    showCollectionMetadata: true
  }
})

console.log(`Creator's regular NFTs: ${creatorRegularNfts.items.length}`)
console.log(`Creator's compressed NFTs: ${creatorCompressedNfts.items.length}`)
console.log(`Creator's total NFTs: ${creatorRegularNfts.items.length + creatorCompressedNfts.items.length}`)
```
{% /totem-accordion %}
{% /totem %}

## Tips and Best Practices

1. **Use [pagination](/das-api/guides/pagination)** for large compressed NFT collections
2. **Handle errors gracefully** when proofs are unavailable
3. **Use appropriate display options** for compressed NFT metadata

## Further Reading

- [Get All Tokens in a Collection](/das-api/guides/get-collection-nfts) - Retrieve all assets from a specific collection
- [Get NFTs by Owner](/das-api/guides/get-nfts-by-owner) - Find all NFTs owned by a wallet
- [Search Assets by Multiple Criteria](/das-api/guides/search-by-criteria) - Combine multiple filters for advanced queries 