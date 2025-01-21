---
title: Reading Solana and SVM Data
metaTitle: Reading Solana and SVM Data | Aura
description: Learn about Reading Solana and SVM data with Metaplex Aura.
---

The Metaplex Aura data network provides developers performant, reliable and accurate read access to onchain state for Solana and other SVM based chains like Eclipse.

Indexers and RPC providers often face substantial challenges in maintaining data consistency and performance. This is due to several issues:

- **Data Consistency**: Solana nodes frequently fall out of sync, and the Geyser plugin may skip updates, especially during node resynchronization. This can lead to inconsistencies in the data provided by indexers.
- **Rising Storage Costs**: As the volume of data continues to grow, maintaining and managing indices requires more storage and increases associated costs.
- **User Experience**: Fragmented data availability can result in provider lock-in, forcing users to rely on multiple RPC providers to access all their digital assets across different protocols.

Aura provides performant, decentralized and comprehensive indexing of digital asset data and addresses these challenges. Key features include:

- **Automated Synchronization**: Ensures data integrity across the network by allowing nodes to assist each other in case of overload, ensuring consistency.
- **Integrated Media CDN**: Provides optimized media delivery, significantly improving load times for pages displaying digital assets.
- **Support for Light Clients**: Allows node operators to index only specific protocols or sub-protocols (e.g., Core assets or a particular Bubblegum tree). Light clients can function without running a full Solana node or Geyser plugin, instead relying on updates from the Aura network. This results in considerably lower infrastructure costs compared to maintaining a full Solana node.
- **Implements the Digital Asset Standard API**: Implements the DAS API, which is the primary interface for accessing digital asset data on the SVM.

## Development Progress

The developement progress of Aura and its features can be found in our github repo [https://github.com/metaplex-foundation/aura/](https://github.com/metaplex-foundation/aura/)






