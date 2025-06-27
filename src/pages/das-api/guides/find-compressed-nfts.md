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
import { publicKey } from "@metaplex-foundation/umi"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api"

(async () => {
  const umi = createUmi("<ENDPOINT>").use(dasApi());

  // Find compressed NFTs owned by a specific wallet
  const ownerCompressedNfts = await umi.rpc.searchAssets({
    owner: publicKey("WALLET_ADDRESS"),
    compressed: true,
    limit: 1000
  });

  console.log(
    `Found ${ownerCompressedNfts.items.length} compressed NFTs owned by wallet`
  );

  // Compare with regular NFTs
  const regularNfts = await umi.rpc.searchAssets({
    owner: publicKey("WALLET_ADDRESS"),
    compressed: false,
    limit: 1000
  });

  console.log(`Regular NFTs: ${regularNfts.items.length}`);
  console.log(`Compressed NFTs: ${ownerCompressedNfts.items.length}`);
  console.log(
    `Total NFTs: ${regularNfts.items.length + ownerCompressedNfts.items.length}`
  );
})();
```
{% /totem-accordion %}
{% /totem %}

## Method 2: Finding Compressed NFTs by Collection

Find compressed NFTs from a specific collection:

{% totem %}
{% totem-accordion title="UMI Example" %}
```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {

const umi = createUmi('https://mainnet.helius-rpc.com/?api-key=0aa5bfbe-0077-4414-9d87-02ffa09cc50b').use(dasApi())


// Find compressed NFTs from a specific collection
const collectionCompressedNfts = await umi.rpc.searchAssets({
  grouping: [
    'collection',
    '5PA96eCFHJSFPY9SWFeRJUHrpoNF5XZL6RrE1JADXhxf'
  ],
  compressed: true,
  limit: 1000,
  // Optional: Display collection metadata in each asset
  displayOptions: {
    showCollectionMetadata: true
  }
})

  console.log(
    `Found ${collectionCompressedNfts.items.length} compressed NFTs in collection`
  );
})();
```
{% /totem-accordion %}
{% /totem %}

## Method 3: Finding Compressed NFTs by Creator

Discover compressed NFTs created by a specific wallet:

{% totem %}
{% totem-accordion title="UMI Example" %}
```typescript
(async () => {
  const umi = createUmi("<ENDPOINT>").use(dasApi());

  // Find all NFTs created by a specific wallet (both compressed and regular)
  const allCreatorNfts = await umi.rpc.searchAssets({
    creator: publicKey("CREATOR_ADDRESS"),
    displayOptions: {
      showCollectionMetadata: true,
    },
  });

  // Filter by compression status
  const compressedNfts = allCreatorNfts.items.filter(
    (nft) => nft.compression?.compressed === true
  );
  const regularNfts = allCreatorNfts.items.filter(
    (nft) => !nft.compression?.compressed
  );

  console.log(
    `Found ${compressedNfts.length} compressed NFTs created by wallet`
  );
  console.log(`Creator's regular NFTs: ${regularNfts.length}`);
  console.log(`Creator's compressed NFTs: ${compressedNfts.length}`);
  console.log(`Creator's total NFTs: ${allCreatorNfts.items.length}`);
})();

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