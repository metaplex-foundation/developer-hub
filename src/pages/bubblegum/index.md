---
title: Overview
metaTitle: Overview | Bubblegum
description: Provides a high-level overview of compressed NFTs.
---

Bubblegum is the Metaplex Protocol program for creating and interacting with compressed NFTs (cNFTs) on Solana. Compressed NFTs make it possible to scale the creation of NFTs to new orders of magnitude by rethinking the way we store data onchain. {% .lead %}

{% quick-links %}

{% quick-link title="Getting Started" icon="InboxArrowDown" href="/bubblegum/getting-started" description="Find the language or library of your choice and get started with compressed NFTs." /%}

{% quick-link title="API reference" icon="CodeBracketSquare" href="https://mpl-bubblegum.typedoc.metaplex.com/" target="_blank" description="Looking for something specific? Have a peak at our API References and find your answer." /%}

{% /quick-links %}

## Introduction

As NFTs have flourished on the Solana blockchain, there’s been an increasing need for NFTs to be as ubiquitous as any digital asset on the Internet: every single item in your game’s inventory, proof-of-engagement in your favourite consumer app, or even a profile for every human on the planet.

So far, though, these types of products have been held back by the cost of rent for NFTs on Solana, which is relatively cheap (0.012 SOL) but scales linearly; a billion NFTs would cost 12,000,000 SOL! From 10,000 NFTs at 3.5 SOL (34x), 1 million NFTs at 5 SOL (2,400x), and 1 billion NFTs at 500 SOL (24,000x), compression for NFTs drastically reduces the cost of onchain storage of NFTs to enable creators to be as expressive with the technology as they wish.

| Number of cNFTs | Storage Cost | Transaction Cost | Total Cost | Cost per cNFT |
| --------------- | ------------ | ---------------- | ---------- | ------------- |
| 10,000          | 3.48         | 0.005            | 3.485      | 0.0003485     |
| 100,000         | 4.17         | 0.05             | 4.22       | 0.0000422     |
| 1,000,000       | 4.85         | 0.5              | 5.35       | 0.0000053     |
| 100,000,000     | 6.45         | 50               | 56.45      | 0.0000006     |
| 1,000,000,000   | 7.13         | 500              | 507.13     | 0.0000005     |

These compressed NFTs can be transferred, delegated, and even decompressed into regular NFTs for interoperability with existing smart contracts.

## Lifecycle of an offer

The very first step is for the advertiser to **create** a new offer with the desired parameters.

{% diagram %}
{% node #action label="1. Create" theme="blue" /%}
{% node parent="action" x="300" %}
{% node #offer label="Offer #ID" theme="pink" /%}
{% node label="Parameters" /%}
{% /node %}
{% edge from="action" to="offer" path="straight" label="create offer parameters" /%}
{% /diagram %}

The created offer keeps track of its own parameters which helps us understand its type and how to handle it.
We explain the offer parameters [in a dedicated guide](/bubblegum/concurrent-merkle-trees).

Offers are identified globally by their unique identifier. Once an advertiser creates an offer, they cannot recreate it with the same parameters.

We will see how to create offers in more details [in the following page](/bubblegum/concurrent-merkle-trees).

After the offer is created, buyers can see and **accept** it in whole or in part.

{% diagram %}
{% node #action label="2. Accept" theme="green" /%}
{% node parent="action" x="300" %}
{% node #offer label="Offer #ID" theme="pink" /%}
{% /node %}
{% edge from="action" to="offer" path="straight" label="accept offer parameters" /%}
{% /diagram %}

Buyers accept the offer by interacting with the smart contract on the offer's destination chain.

**Example:**

- **Offer**: Selling 10 ETH (Base) for 10 SOL (Solana).
  
  - **Advertiser**:
    - Holds ETH on the Base chain.
    - Interacts with the OTC Market smart contract on the Base chain to create the offer.
  
  - **Buyer**:
    - Holds SOL on the Solana chain.
    - Interacts with the OTC Market smart contract on the Solana chain to accept the offer.

Once the entire amount in the offer has been purchased by buyers, the advertiser can **cancel** the offer, allowing them to create a new offer with the same parameters. This will also free some storage on the blockchain and return the rent to the advertiser (on Solana).

{% diagram %}
{% node #action label="3. Cancel" theme="red" /%}
{% node parent="action" x="250" %}
{% node #offer label="Offer #ID" theme="pink" /%}
{% /node %}
{% edge from="action" to="offer" path="straight" /%}
{% /diagram %}

In the next steps, advertisers will also have the option to **refill** the offer instead of canceling it entirely.

{% diagram %}
{% node #action label="Refill" theme="purple" /%}
{% node parent="action" x="250" %}
{% node #offer label="Offer #ID" theme="pink" /%}
{% /node %}
{% edge from="action" to="offer" path="straight" label="refill offer parameters" /%}
{% /diagram %}

Overall, the lifecycle of an offer follows the following path:

{% figure src="/assets/bakstag/lifecycle.svg" alt="Offer lifecycle (Created, Accepted, Refilled, Canceled)" caption="Offer lifecycle" /%}

We will discuss each of these actions in detail [in the features section](/bubblegum/concurrent-merkle-trees).

## Features

Even though NFT data does not live inside accounts, it is still possible to execute a variety of operations on compressed NFTs. This is possible by requesting the current NFT data and ensuring its hashed Leaf is valid on the Merkle Tree. As such, the following operations can be performed on compressed NFTs:

- [Mint a cNFT](/bubblegum/mint-cnfts) with or without an associated collection.
- [Transfer a cNFT](/bubblegum/transfer-cnfts).
- [Update the data of a cNFT](/bubblegum/update-cnfts).
- [Burn a cNFT](/bubblegum/burn-cnfts).
- [Decompress a cNFT into a regular NFT](/bubblegum/decompress-cnfts). Note that this enables interoperability with existing smart contracts but creates onchain accounts with rent fees.
- [Delegate a cNFT](/bubblegum/delegate-cnfts).
- [Verify and unverify a cNFT collection](/bubblegum/verify-collections).
- [Verify and unverify the creators of a cNFT](/bubblegum/verify-creators).

## Next steps

Now that we know how compressed NFTs work at a high level, we recommend checking out our [Getting Started](/bubblegum/getting-started) page which enumerates the various languages/frameworks that one can use to interact with compressed NFTs. Afterwards, the various [feature pages](/bubblegum/create-trees) can be used to learn more about the specific operations that can be performed on cNFTs. Finally, [advanced guides](/bubblegum/concurrent-merkle-trees) are also available to deepen your knowledge of cNFTs and Merkle Trees.
