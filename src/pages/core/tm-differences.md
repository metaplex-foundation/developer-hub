---
title: Differences between Core and Token Metadata
metaTitle: Core - Differences between Core and Token Metadata
description: Differences between Core and Token Metadata
---

This page first explores the general improvements compared with TM and will later provide migration guide like information on how to use the TM equivalents of functions in core.

## Difference Overview

- **Unprecedented Cost Efficiency**: Metaplex Core offers the lowest minting costs compared to available alternatives. For instance, an NFT that would cost .0077 SOL with Token Extensions can be minted with Core for .0037 SOL.
- **Improved Developer Experience**: While most digital assets inherit the data needed to maintain an entire fungible token program, Core is optimized for NFTs, allowing all key data to be stored in a single Solana account. This dramatically reduces complexity for developers, while also helping improve network performance for Solana more broadly.
- **Enhanced Collection Management**: With first-class support for collections, developers and creators can easily manage collection-level configurations such as royalties and plugins, which can be uniquely overridden for individual NFTs. This can be done in a single transaction, reducing collection management costs and Solana transaction fees.
- **Advanced Plugin Support**: From built-in staking to asset-based point systems, the plugin architecture of Metaplex Core opens up a vast landscape of utility and customization. Plugins allow developers to to hook into any asset life cycle event like create, transfer and burn to add custom behaviors
- **Compatibility and Support**: Fully supported by the Metaplex Developer Platform, Core is set to integrate seamlessly with a suite of SDKs and upcoming programs, enriching the Metaplex ecosystem.
- **Out of the Box Indexing**: Expanding on the Metaplex Digital Asset Standard API (DAS API), Core assets will be automatically indexed and available for application developers through a common interface that is used for all Solana NFTs. However, a unique improvement is that with the Core attribute plugin, developers will be able to add on chain data that is now also automatically indexed.
