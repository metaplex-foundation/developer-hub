---
title: Overview
metaTitle: Inscriptions - Overview
description: Provides a high-level overview of the Metaplex Inscriptions standard.
---
The Metaplex inscription Program allows you to write data on chain. This Data can be attached to NFTs, but does not has to be. In this overview, we explain what this program does and how we can leverage its various features at a high level. {% .lead %}

{% quick-links %}

{% quick-link title="Getting Started" icon="InboxArrowDown" href="/inscription/getting-started" description="Find the language or library of your choice and get started with digital assets on Solana." /%}

{% quick-link title="API reference" icon="CodeBracketSquare" href="/inscription/references" description="Looking for something specific? Have a peak at our API References and find your answer." /%}

{% /quick-links %}

## Introduction

Before NFT Metadata was mostly stored off chain for example on Arweave or nft.storage. The inscription program allows you to instead write that data directly to the chain. When used with NFTs you can store everything related to the Metadata on Solana and do not have to rely on anything else.

There are two different kinds of Inscriptions:
1. Inscriptions attached to NFT Mints.
2. Inscriptions as storage providers.

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
