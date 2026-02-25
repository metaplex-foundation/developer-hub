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

  // Find all NFTs owned by a specific wallet (both compressed and regular)
  const allOwnerNfts = await umi.rpc.searchAssets({
    owner: publicKey("WALLET_ADDRESS"),
    limit: 1000
  });

  // Filter by compression status
  const compressedNfts = allOwnerNfts.items.filter(
    (nft) => nft.compression?.compressed === true
  );
  const regularNfts = allOwnerNfts.items.filter(
    (nft) => !nft.compression?.compressed
  );

  console.log(
    `Found ${compressedNfts.length} compressed NFTs owned by wallet`
  );
  console.log(`Regular NFTs: ${regularNfts.length}`);
  console.log(`Compressed NFTs: ${compressedNfts.length}`);
  console.log(`Total NFTs: ${allOwnerNfts.items.length}`);
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
        limit: 1000
      }
    })
  });

  const data = await response.json();
  const allOwnerNfts = data.result;

  // Filter by compression status
  const compressedNfts = allOwnerNfts.items.filter(
    (nft) => nft.compression?.compressed === true
  );
  const regularNfts = allOwnerNfts.items.filter(
    (nft) => !nft.compression?.compressed
  );

  console.log(
    `Found ${compressedNfts.length} compressed NFTs owned by wallet`
  );
  console.log(`Regular NFTs: ${regularNfts.length}`);
  console.log(`Compressed NFTs: ${compressedNfts.length}`);
  console.log(`Total NFTs: ${allOwnerNfts.items.length}`);
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
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  // Find all NFTs from a specific collection (both compressed and regular)
  const allCollectionNfts = await umi.rpc.searchAssets({
    grouping: [
      'collection',
      '<COLLECTION_ADDRESS>'
    ],
    limit: 1000,
    // Optional: Display collection metadata in each asset
    displayOptions: {
      showCollectionMetadata: true
    }
  });

  // Filter by compression status
  const compressedNfts = allCollectionNfts.items.filter(
    (nft) => nft.compression?.compressed === true
  );
  const regularNfts = allCollectionNfts.items.filter(
    (nft) => !nft.compression?.compressed
  );

  console.log(
    `Found ${compressedNfts.length} compressed NFTs in collection`
  );
  console.log(`Regular NFTs: ${regularNfts.length}`);
  console.log(`Compressed NFTs: ${compressedNfts.length}`);
  console.log(`Total NFTs: ${allCollectionNfts.items.length}`);
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
        grouping: [
          'collection',
          '<COLLECTION_ADDRESS>'
        ],
        limit: 1000,
        options: {
          showCollectionMetadata: true
        }
      }
    })
  });

  const data = await response.json();
  const allCollectionNfts = data.result;

  // Filter by compression status
  const compressedNfts = allCollectionNfts.items.filter(
    (nft) => nft.compression?.compressed === true
  );
  const regularNfts = allCollectionNfts.items.filter(
    (nft) => !nft.compression?.compressed
  );

  console.log(
    `Found ${compressedNfts.length} compressed NFTs in collection`
  );
  console.log(`Regular NFTs: ${regularNfts.length}`);
  console.log(`Compressed NFTs: ${compressedNfts.length}`);
  console.log(`Total NFTs: ${allCollectionNfts.items.length}`);
})();

```
{% /totem-accordion %}
{% /totem %}

## Method 3: Finding Compressed NFTs by Creator

Discover compressed NFTs created by a specific wallet:

{% totem %}
{% totem-accordion title="UMI Example" %}

```typescript
import { publicKey } from "@metaplex-foundation/umi"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api"

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
        creatorAddress: 'CREATOR_ADDRESS',
        options: {
          showCollectionMetadata: true,
        }
      }
    })
  });

  const data = await response.json();
  const allCreatorNfts = data.result;

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

1. **Use [pagination](/dev-tools/das-api/guides/pagination)** for large compressed NFT collections
2. **Handle errors gracefully** when proofs are unavailable
3. **Use appropriate display options** for compressed NFT metadata

## Further Reading

- [Get All Tokens in a Collection](/dev-tools/das-api/guides/get-collection-nfts) - Retrieve all assets from a specific collection
- [Get NFTs by Owner](/dev-tools/das-api/guides/get-nfts-by-owner) - Find all NFTs owned by a wallet
- [Search Assets by Multiple Criteria](/dev-tools/das-api/guides/search-by-criteria) - Combine multiple filters for advanced queries
