---
title: FAQ
metaTitle: FAQ | Aura
description: Frequently asked questions about Aura
---

## General

### What use cases inspired Aura?

Decentralized applications struggle to compete with centralized alternatives because it can be difficult, costly, and slow to read and display the current state of blockchain data. Aura solves this by indexing and replicating the most important state across a decentralized network of node operators, while working in conjunction with the Metaplex Program Library (MPL) to speed up execution performance on Solana and the SVM by operating in compressed state.

### Why do we need decentralized indexing?

Censorship resistant applications require decentralized networks for performantly, accurately and reliably reading onchain state. In additional, decentralized systems can achieve greater networks effects and data replication which will allow them to compete fundamentally on performance and cost while also providing censorship resistance. 


### What protocols will Aura support?

Aura will be supporting the following protocols with the latest DAS methods:

- MPL Token Metadata (NFT/pNFT)
- MPL Core (Core Assets/Core Collections)
- MPL Bubblegum (cNFTs)
- Fungible SPL Tokens
- SPL Token22

### What does Elastic State Management mean?

Elastic State Management is the ability to move data out of compressed state into account space when needed and then back into compressed state when it's not needed.

## Aura's Nodes

### Can Aura also index Core and Token Metadata asset data?

Yes, Aura nodes will run the DAS API, allowing them to index all asset data, including Core and Token Metadata assets.

## Batch Minting

### What kind of assets will be minted with batch minting?

Aura’s batch minting feature enhances the Bubblegum program, reducing the number of transactions required to mint large batches of NFTs. The batch mint process populates an off-chain Bubblegum tree (with an optional canopy structure for better composability), optimizing the creation of thousands of digital assets. Despite the backend improvements, these batch-minted NFTs will function identically to legacy Bubblegum-minted cNFTs, ensuring seamless user experiences.

### How does batch minting work?

The process starts by preparing an empty Bubblegum tree, which is populated off-chain. The tree is serialized into a JSON file for indexing, and if a canopy is used, up to 24 canopy leaves are batched in a single operation. A transaction finalizing the mint is then initiated by an Aura node or another participant with the required stake. Solana processes the transaction, with Aura nodes verifying the file's hash and optionally validating the Merkle root.
