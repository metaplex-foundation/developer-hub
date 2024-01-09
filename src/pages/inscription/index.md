---
title: Overview
metaTitle: Inscriptions - Overview
description: Provides a high-level overview of the Metaplex Inscriptions standard.
---
The Metaplex Inscription Program allows you to write data directly to Solana, using the blockchain as a method of data storage. The Inscription program also allows for this data storage to be optionally linked to an NFT. In this overview, we explain how this program works and how we can leverage its various features at a high level. {% .lead %}

{% quick-links %}

{% quick-link title="Getting Started" icon="InboxArrowDown" href="/inscription/getting-started" description="Find the language or library of your choice and get started with digital assets on Solana." /%}

{% quick-link title="API reference" icon="CodeBracketSquare" href="/inscription/references" description="Looking for something specific? Have a peak at our API References and find your answer." /%}

{% /quick-links %}

## Introduction

NFT JSON data and Images have historically been stored on decentralized storage providers like Arweave or IPFS. The Inscription program introduces Solana as another option for NFT data storage, allowing you to write that data directly to the chain. The Metaplex Inscription program introduces the novel use case of all of an NFT's associated data now being stored on Solana. This enables many new use cases such as Solana programs with trait-based bids, dynamic images that are updated via programs, or even RPG game state on-chain.

There are two different kinds of Inscriptions:
1. Inscriptions attached to NFT Mints.
2. Inscriptions as simple data storage.

Together with the [Inscription Gateway](https://github.com/metaplex-foundation/inscription-gateway) you can use the normal Token Metadata Standard and just point the URI to the gateway which again reads your data directly from chain without all players like wallets and explorers reading the data have to read it any differently than NFTs are read usually.   



## And a lot more

Whilst this provides a good overview of the Inscription program and what it has to offer, there’s still a lot more that can be done with it.

The other pages of this documentation aim to document it further and explain significant features in their own individual pages.

- [Inscription Gateway](/inscription/gateway)
- [Initialize](/inscription/initialize)
- [Write](/inscription/write)
- [Fetch](/inscription/fetch)
- [Clear](/inscription/clear)
- [close](/inscription/close)
- [Authorities](/inscription/authority)
