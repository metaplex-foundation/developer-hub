---
title: How to Create an NFT On Solana
metaTitle: How to Create an NFT On Solana | Guides
description: Learn how to create an NFT on the Solana blockchain with Metaplex packages.
# remember to update dates also in /components/guides/index.js
created: '04-19-2024'
updated: '04-19-2025'
---

Metaplex provides 3 different standards for creating NFTs on the Solana blockchain including **Core**, **Token Metadata**, and **Bubblegum**. Each standard and protocol provides unique advantages for projects and spread across the wide spectrum of minting and NFT requirements for projects.

## Core Asset (Recommended)

Core is the newest and most advanced digital asset standard created by Metaplex. This standard provides optimized account structures and enhanced functionality through a powerful plugin system.

#### Why Use Core:

- Newest Standard: Core is the newest and most powerful digital asset standard created by Metaplex to date.
- Simplicity: Core was designed from the ground up with a **simplicity first approach**.
- Plugins: Core provides an advanced plugin system that allows Core Assets and Collections to store extra state, provide lifecycle validations, and an enhanced dynamic experience. The possibilities here are endless!
- Cost: While not as cheap as Bubblegum, Core is **significantly cheaper** to create and mint compared to Token Metadata due to the optimized account structures.

[Create An NFT with Core](/smart-contracts/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript)

## Token Metadata NFT/pNFT

Token Metadata is the Solana NFT standard that started it all. Created back in 2021 Token Metadata paved the way for NFTs on the Solana blockchain with a staggering 512 million NFTs minted since first inception.

#### Why Use Token Metadata:

- Tried and Trusted: Token Metadata has been used as Solana's primary NFT Token Standard for the last 4 years from projects such as Solana Monkey Business, DeGods, Claynosaurus just to name a few.
- Ecosystem Support: NFTs and pNFTs are supported Solana wide by marketplaces and wallets such as MagicEden, Tensor, Phantom, Solflare and many others.
- SPL Token Based: Token Metadata NFTs/pNFTs are based around Solana's SPL Token program.

[Create An NFT/pNFT with Token Metadata](/smart-contracts/token-metadata/guides/javascript/create-an-nft)

## Bubblegum cNFT

When it comes to creating NFTs that are cheap in mass then Bubblegum is the protocol to choose. Bubblegum uses the technology of **Compressed NFTs (cNFTs)** By applying a Merkle tree approach instead of creating accounts for each individual NFT.

#### Why Use Bubblegum:

- Cheap to deploy: Being a Merkle tree based product trees are cheap to deploy that can store millions of NFTs if needed.
- Mass Airdrops: Once a tree is created the cost of airdrop cNFTs is close to non-existent as the storage of the tree has already been paid for.

[Create 1,000,000 NFTs on Solana with Bubblegum](/smart-contracts/bubblegum/guides/javascript/how-to-create-1000000-nfts-on-solana)
