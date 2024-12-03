---
title: Managing Compressed State
metaTitle: Managing Compressed State | Aura
description: Learn about Managing Compressed State within Aura nodes.
---


## Data Availability

Batch minting into a fully compressed state offers substantial cost and performance advantages, making it an attractive option for developers seeking to optimize resource efficiency. However, this approach comes with a notable trade-off: the underlying asset data is no longer stored directly within Solana's transaction history. Traditionally, indexers rely on transaction history to backfill and retrieve asset states dynamically, providing a straightforward way to ensure data availability and integrity.

The absence of this embedded data creates challenges for applications that depend on quick and reliable access to asset states. Without a robust solution, developers may encounter significant friction when building tools and services on top of these compressed states. Ensuring seamless data retrieval and state management becomes critical to maintaining the usability of such assets across the ecosystem.

To address these challenges, Aura nodes facilitate access to batch operations that manage compressed state, while indexing and securing the full state needed to make state transitions. 

## Development Progress

The developement progress of Aura and its features can be found in our github repo [https://github.com/metaplex-foundation/aura/](https://github.com/metaplex-foundation/aura/)
