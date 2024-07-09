---
title: How to Create an Nft On Solana
metaTitle: How to Create an Nft On Solana
description: Learn how to create an Nft on the Solana blockchain with Metaplex packages.
# remember to update dates also in /components/guides/index.js
created: '06-16-2024'
updated: '06-18-2024'
---

Metaplex provides 3 different standards for creating Nft's on the Solana blockchain including **Core**, **Token Metadata**, and **Bubblegum**. Each standard and protocol provides unique advantages for projects and spread across the wide spectrum of minting and Nft requirements for projects.

## Core Asset (Recommmended)

Token Metadata is a protocol within Metaplex that focuses on the metadata aspects of NFTs. This standard defines how metadata is stored, retrieved, and associated with NFTs, ensuring that NFTs have rich, meaningful, and verifiable information attached to them.

#### Why Use Core:

- Newest Standard: Core is the newest and most powerful digital asset standard created by Metaplex to date.
- Simplicity: Core was designed from the ground up with a **simplicity first approach**.
- Plugins: Core provides an advanced plugin system that allows Core Assets and Collections to store extra state, provide lifecycle validations, and an enhanced dynamic experiance. The possibilities here are endless!
- Cost: While not as cheap as Bubblegum, Core is **significantly cheaper** to create and mint compared to Token Metadata due to the optimized account structures.

[Create An Nft with Core](/core/guides/javascript/how-to-create-a-core-nft-asset)

## Token Metadata Nft/pNft

Token Metadata is the Solana Nft standard that started it all. Created back in 2021 Token Metadata paved the way for Nfts on the Solana blockchain with a staggering 512 million Nfts minted since first inception.

#### Why Use Token Metadata:

- Tried and Trusted: Token Metadata has been used as Solana's primary Nft Token Standard for the last 4 years from projects such as Solana Monkey Bussiness, Degods, Claynosaurus just to name a few.
- Eco System Support: Nfts and pNfts are supported Solana wide by marketplaces and wallets such as MagicEden, Tensor, Phantom, Solflare and many others.
- SPL Token Based: Token Metadata Nfts/pNfts are based around Solana's Spl Token program.

[Create An Nft/pNft with Token Metadata](/core/guides/create-and-nft)

## Bubblegum cNft

When it comes to creating nfts that are cheap in mass then Bubblegum is the protocol to choose. Bubblegum uses the technology of **Compresed Nfts (cNfts)** By applying a merkletree approach instead of creating accounts for each invidiual Nft.

#### Why Use Bubblegum:

- Cheap to deploy: Metaplex Core offers a robust set of tools to handle all aspects of NFT creation and management, making it a one-stop solution for developers.

[Create An cNft with Bubble](/core/guides/create-and-nft)
