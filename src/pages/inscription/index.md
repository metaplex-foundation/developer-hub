---
title: Overview
metaTitle: Token Metadata - Overview
description: Provides a high-level overview of the Solana NFT standard.
---

Inscribing is the practice of treating the Solana blockchain as a form of data storage, much like Arweave or IPFS. While other data storage providers provide their own immutability and data integrity guarantees, there is demand for data directly on the native chain of the underlying NFT. Features such as dynamic metadata and images, on-chain attribute orders, and trait locked smart contracts all become possible with inscribed metadata. {% .lead %}

{% quick-links %}

{% quick-link title="Getting Started" icon="InboxArrowDown" href="/inscription/getting-started" description="Find the language or library of your choice and get started with inscribing data on Solana." /%}

{% quick-link title="API reference" icon="CodeBracketSquare" href="/inscription/references" description="Looking for something specific? Have a peak at our API References and find your answer." /%}

{% /quick-links %}

## Introduction

Metaplex inscriptions have two operating modes:

- Metadata inscribing
- Direct data storage

In both modes binary data of any format can be directly written to the chain through the Metaplex Inscription program. In addition, the Metaplex SDKs provide direct support for inscribing schemas commonly used for NFTs (i.e. JSON and Image formats).

The Metadata inscribing method creates a PDA attached to a mint account, the same way Metadata is attached to a token mint. The JSON and image data of the NFT can then be written directly to the chain in the PDA. This method provides a backup of the NFT data in the event that current data storage providers should ever go down and means the asset is “fully on Solana.”

Mint inscriptions also include a ranking, which offers a FCFS rarity claim when inscribing an NFT. Using a sharded counter to prevent resource contention, the Mint inscriptions are globally ranked based on their minting order. The direct data storage can be used as a direct alternative to providers like Arweave and IPFS, rather than as a backup. JSON and Image data can be written directly to the chain. One small caveat of this method is that a gateway is required to enable maximum ecosystem support, much like ar.io, arweave.net, gateway.ipfs.io, etc.

The Metaplex Inscription program is queued up for a full audit to prevent any security issues. The intention is for the program to be made immutable within 6 months to provide maximum security guarantees to users and the Foundation is open to moving upgrade authority into a community multi-sig sooner than this if we can find effective partners.