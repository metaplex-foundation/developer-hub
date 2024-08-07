---
title: Metaplex Umi Plugins
metaTitle: Metaplex Umi Plugins | Umi
description: An overview of Metaplex built Umi Plugins.
---

Metaplex programs have been generated via Kinobi to work and run as plugin's via Umi. Each program in the Metaplex library has a different use and purpose in the Solana eco system. You can find even more Plugins to use with Umi in the [interface implementations page](/umi/implementations)!

## [Bubblegum (cNFT)](/bubblegum)

Bubblegum is a Metaplex program that deals with the creation and management of cNFTs (Compressed NFTS) on the Solana Blockchain. cNfts are cheaper to create and mint than their traditional NFT and pNFT counterparts from Token Metadata.

Program feature set includes:

- Minting
- Updating
- Transferring
- Burning
- Delegating
- Collection Management

## [Candy Machine](/candy-machine)

Candy Machine is a Metaplex program that allows you to set up a 'for sale' NFT and pNFT drop. Users can purchase from your candymachine and get back a random NFT/pNFT that is inside.

Program feature set includes:

- Minting NFTs
- Selling NFTs

## [Core](/core)

Core is the next generation Solana NFT standard that uses a single account design, reducing minting costs and improving Solana network load compared to alternatives. It also has a flexible plugin system that allows for developers to modify the behavior and functionality of assets. 

Program feature set includes:

- Minting
- Updating
- Transferring
- Burning
- Delegating
- Managing internal and external Plugins
- Deserializing
- Collection Management

## [DAS API](/das-api)

The state data of uncompressed NFTs is all stored in onchain accounts. This is expensive at scale. Compressed NFTs save space by encoding the state data into an onchain Merkle tree. The detailed account data is not stored onchain, but in data stores managed by RPC providers. The Metaplex Digital Asset Standard (DAS) API represents a unified interface for interacting with digital assets on Solana, supporting both standard (Token Metadata) and compressed (Bubblegum) assets.

Program feature set includes:

- Fast Data fetching, including compressed NFTs

## [Inscriptions](/inscription)

The Metaplex Inscription Program allows you to write data directly to Solana, using the blockchain as a method of data storage. The Inscription program also allows for this data storage to be optionally linked to an NFT. In this overview, we explain how this program works and how we can leverage its various features at a high level.

Program feature set includes:

- Writing Data directly to the Solana blockchain
- Reading inscription data from the Solana blockchain

## [Token Metadata (NFT, pNFT)](/token-metadata)

Token Metadata is a Metaplex program that deals with the creation and management of NFTs and pNFTs. Token Metadata NFTs were the first nft standard on Solana while pNFTs where later created to include royalty enforcement.

Program feature set includes:

- Data Fetching
- Minting
- Updating
- Transferring
- Burning
- Delegating
- Collection Management


## [Toolbox](/toolbox)

Mpl Toolbox includes a bunch of essential Solana and Metaplex programs to get you up and running with your decentralized applications.

- SOL Transfer
- SPL Token Creation/Management
- LUT Creation/Management (Address Lookup Table)
- Set/Modify Compute Units and Price
