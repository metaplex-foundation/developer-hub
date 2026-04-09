---
title: Core Collections
metaTitle: Core Collections Overview | Metaplex Core
description: An overview of Core Collections on Solana — how they group Assets, store shared metadata, and apply collection-level plugins.
updated: '04-08-2026'
keywords:
  - NFT collection
  - Core Collection
  - mpl-core collection
  - group NFTs
  - collection metadata
about:
  - NFT collections
  - Collection management
proficiencyLevel: Beginner
faqs:
  - q: What's the difference between a Collection and an Asset?
    a: A Collection is a container that groups Assets together. It has its own metadata but cannot be owned or transferred like an Asset. Assets are the actual NFTs that users own.
  - q: Can I add an existing Asset to a Collection?
    a: Yes, use the update instruction with the newCollection parameter. The Asset's update authority must have permission to add it to the target Collection.
  - q: Do I need a Collection for my NFTs?
    a: No. Assets can exist standalone without a Collection. However, Collections enable collection-level royalties, easier discoverability, and batch operations.
  - q: Can I remove an Asset from a Collection?
    a: Yes, use the update instruction to change the Asset's collection. You need the appropriate authority on both the Asset and Collection.
  - q: What happens if I delete a Collection?
    a: Collections cannot be deleted while they contain Assets. Remove all Assets first, then the Collection account can be closed.
---

## Summary

A **Core Collection** is a Solana account that groups related [Core Assets](/smart-contracts/core/what-is-an-asset) under shared metadata and plugins.

- Collections store a name, URI, and optional plugins that apply to all member Assets
- Assets reference their Collection via the `collection` field at creation or update time
- Collection-level plugins (e.g. [Royalties](/smart-contracts/core/plugins/royalties)) propagate to all member Assets unless overridden at the Asset level
- Creating a Collection costs ~0.0015 SOL in rent

**Jump to a task:** [Create Collection](/smart-contracts/core/collections/create) · [Fetch Collection](/smart-contracts/core/collections/fetch) · [Update Collection](/smart-contracts/core/collections/update)

## What are Collections?

A Core Collection is a group of Assets that belong together as part of the same series or set. To group Assets together, you first create a Collection account that stores the shared metadata — collection name and image URI. The Collection account acts as the front cover for your collection and can also hold collection-wide plugins.

The data stored and accessible from the Collection account is as follows:

| Field | Description |
| --- | --- |
| key | The account key discriminator |
| updateAuthority | The authority of the collection |
| name | The collection name |
| uri | The URI to the collection's off-chain metadata |
| numMinted | The total number of Assets ever minted into the collection |
| currentSize | The number of Assets currently in the collection |

{% callout type="note" %}
Core Collections only group Core Assets. To work with Token Metadata NFTs use [mpl-token-metadata](https://developers.metaplex.com/token-metadata). For compressed NFTs use [Bubblegum](/smart-contracts/bubblegum).
{% /callout %}

## Notes

- Assets can exist standalone without a Collection — a Collection is not required
- Collection plugins are inherited by member Assets unless the Asset has its own overriding plugin of the same type
- `numMinted` counts all Assets ever created in the collection; `currentSize` is the live count
- Collections cannot be closed while they contain Assets — remove all Assets first

## Quick Reference

### Program ID

| Network | Address |
|---------|---------|
| Mainnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
| Devnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |

### Collection Operations

| Operation | Page | SDK Function |
|-----------|------|--------------|
| Create a Collection | [Create Collection](/smart-contracts/core/collections/create) | `createCollection` |
| Fetch a Collection | [Fetch Collection](/smart-contracts/core/collections/fetch) | `fetchCollection` |
| Update Collection metadata | [Update Collection](/smart-contracts/core/collections/update) | `updateCollection` |
| Update a Collection plugin | [Update Collection](/smart-contracts/core/collections/update) | `updateCollectionPlugin` |

### Cost Breakdown

| Item | Cost |
|------|------|
| Collection account rent | ~0.0015 SOL |
| Transaction fee | ~0.000005 SOL |
| **Total** | **~0.002 SOL** |

## FAQ

### What's the difference between a Collection and an Asset?

A Collection is a container that groups Assets together. It has its own metadata (name, image) but cannot be owned or transferred like an Asset. Assets are the actual NFTs that users own.

### Can I add an existing Asset to a Collection?

Yes, use the `update` instruction with the `newCollection` parameter. The Asset's update authority must have permission to add it to the target Collection.

### Do I need a Collection for my NFTs?

No. Assets can exist standalone without a Collection. However, Collections enable collection-level royalties, easier discoverability, and batch operations.

### Can I remove an Asset from a Collection?

Yes, use the `update` instruction to change the Asset's collection. You need the appropriate authority on both the Asset and Collection.

### What happens if I delete a Collection?

Collections cannot be deleted while they contain Assets. Remove all Assets first, then the Collection account can be closed.

## Glossary

| Term | Definition |
|------|------------|
| **Collection** | A Core account that groups related Assets under shared metadata |
| **Update Authority** | The account that can modify Collection metadata and plugins |
| **numMinted** | Counter tracking total Assets ever created in the Collection |
| **currentSize** | Number of Assets currently in the Collection |
| **Collection Plugin** | A plugin attached to the Collection that may apply to all member Assets |
| **URI** | URL pointing to off-chain JSON metadata for the Collection |
