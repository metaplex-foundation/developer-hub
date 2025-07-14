---
title: Get NFTs by Owner
metaTitle: Get NFTs by Owner | DAS API Guides
description: Learn how to retrieve all non-fungible tokens owned by a specific wallet
---

# Get NFTs by Owner

This guide shows you how to retrieve all non-fungible tokens (NFTs) owned by a specific wallet address using the DAS API. This is useful for building NFT galleries, portfolio trackers, or marketplace features.

## Method 1: Using Get Assets By Owner with Interface Filter (Recommended)

The `getAssetsByOwner` method combined with interface filtering is the most efficient way to get NFTs owned by a specific wallet, it only returns the NFTs that apply to the interface filter, e.g. `MplCoreAsset` would not return compressed NFTs.

{% totem %}
{% totem-accordion title="UMI Example" %}

```typescript
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";

(async () => {
  const umi = createUmi(
    "<ENDPOINT>"
  ).use(dasApi());
  console.log("umi.rpc.getAssetsByOwner");
  // Get all NFTs owned by a specific wallet
  const ownerNfts = await umi.rpc.getAssetsByOwner({
    owner: publicKey("WALLET_ADDRESS"),
  });

  console.log(`Found ${ownerNfts.items.length} NFTs owned by this wallet`);
  console.log(`Total assets: ${ownerNfts.total}`);

  // Process each NFT
  ownerNfts.items.forEach((nft) => {
    console.log(`NFT ID: ${nft.id}`);
    console.log(`Name: ${nft.content.metadata?.name || "Unknown"}`);
    console.log(
      `Collection: ${
        nft.grouping?.find((g) => g.group_key === "collection")?.group_value ||
        "None"
      }`
    );
    console.log("---");
  });
})();
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript Example" %}

```javascript
(async () => {
  const response = await fetch("<ENDPOINT>", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getAssetsByOwner",
      params: {
        ownerAddress: "WALLET_ADDRESS",
        options: {
          showCollectionMetadata: true,
          showFungible: false, // to exclude fungible tokens
        },
      },
    }),
  });

  const data = await response.json();
  console.log(`Found ${data.result.items.length} NFTs`);
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
    "method": "getAssetsByOwner",
    "params": {
      "ownerAddress": "WALLET_ADDRESS",
      "options": {
        "showCollectionMetadata": true,
        "showFungible": false
      }
    }
  }'
```
{% /totem-accordion %}
{% /totem %}

## Method 2: Using Search Assets with Owner and Interface Filter

You can use `searchAssets` to get more specific results with additional filters like interface to get only `MplCoreAsset`s.

{% totem %}
{% totem-accordion title="UMI Example" %}
```typescript
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";

(async () => {
  const umi = createUmi(
    "<ENDPOINT>"
  ).use(dasApi());

  // Search for NFTs owned by a specific wallet
  const ownerNfts = await umi.rpc.searchAssets({
    owner: publicKey("WALLET_ADDRESS"),
    limit: 1000,
    interface: "MplCoreAsset",
    displayOptions: {
      showCollectionMetadata: true,
    },
  });

  console.log(`Found ${ownerNfts.items.length} Core Assets`);
})();


```
{% /totem-accordion %}
{% totem-accordion title="JavaScript Example" %}
```javascript
(async () => {
  const response = await fetch("<ENDPOINT>", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "searchAssets",
      params: {
        ownerAddress: "WALLET_ADDRESS",
        interface: "MplCoreAsset",
        limit: 1000,
        options: {
          showCollectionMetadata: true,
        },
      },
    }),
  });

  const data = await response.json();
  console.log(`Found ${data.result.items.length} Core Assets`);
})();
```
{% /totem-accordion %}
{% /totem %}

## Method 3: Filtering NFTs by Collection

You can filter NFTs by specific collections in addition to the wallet address, for example, when looking for NFTs from your own collection:

{% totem %}
{% totem-accordion title="UMI Example" %}
```typescript
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";

(async () => {
  const umi = createUmi(
    "<ENDPOINT>"
  ).use(dasApi());

  // Get NFTs from a specific collection owned by this wallet
  const collectionNfts = await umi.rpc.searchAssets({
    owner: publicKey("WALLET_ADDRESS"),
    grouping: ["collection", "COLLECTION_ADDRESS"],
    limit: 1000,
    displayOptions: {
      showCollectionMetadata: true,
      showFungible: false,
    },
  });

  console.log(`Found ${collectionNfts.items.length} NFTs from this collection`);
})();
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript Example" %}
```javascript
(async () => {
  const response = await fetch(
    "<ENDPOINT>",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "searchAssets",
        params: {
          ownerAddress: "WALLET_ADDRESS",
          grouping: [
            "collection",
            "COLLECTION_ADDRESS",
          ],
          options: {
            showCollectionMetadata: true,
          },
        },
      }),
    }
  );

  const data = await response.json();
  console.log(`Found ${data.result.items.length} NFTs from this collection in this wallet`);
})();

```
{% /totem-accordion %}
{% /totem %}

## Common Use Cases

- **NFT Galleries**: Display all NFTs owned by a user
- **Portfolio Trackers**: Monitor NFT holdings
- **Marketplace Integration**: Show user's NFT inventory
- **Collection Management**: Organize NFTs by collections
- **Gaming Applications**: Load user's NFT game assets

## Tips and Best Practices

1. **Use interface filtering** to get only NFTs (e.g. exclude fungible tokens)
2. **Implement [pagination](/das-api/guides/pagination)** for wallets with many NFTs
3. **Cache results** to improve performance for frequent queries
4. **Include [display options](/das-api/guides/display-options)** to get additional metadata
5. **Sort results** to present data in meaningful ways
6. **Filter by collections** to focus on specific NFT types

## Further Reading

- [Get Assets By Creator](/das-api/methods/get-assets-by-creator) - Discover all tokens created by a specific address
- [Get All Tokens in a Collection](/das-api/guides/get-collection-nfts) - Retrieve all assets from a specific collection
- [Search Assets by Multiple Criteria](/das-api/guides/search-by-criteria) - Combine multiple filters for advanced queries 