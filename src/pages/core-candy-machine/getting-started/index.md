---
title: Getting Started
metaTitle: Getting Started | Core Candy Machine
description: The starting point in getting to know the Core Candy Machine program and packages.
---

Choose your preferred language or library below to get started or learn more about how Candy Machine works. {% .lead %}

{% quick-links %}

{% quick-link title="JavaScript" icon="JavaScript" href="/core-candy-machine/getting-started/js" description="Get started with our JavaScript library based on the Umi framework." /%}

{% quick-link title="Rust" icon="Rust" href="/core-candy-machine/getting-started/rust" description="Get started with our Rust crate." /%}

<!-- {% quick-link title="Sugar" icon="SolidCake" href="/core-candy-machine/sugar/getting-started" description="Get started using the command-line tool Sugar." /%} -->

{% /quick-links %}

## Candy Machine 101

Candy Machine have 4 different phases:
- [Creating and Configuring a Candy Machine](#create-and-configure)
- [Loading all the Assets](#load-items)
- [Minting the Assets](#mint-asset)
- [Deleting and Withdraw the Candy Machine](#delete-and-withdraw)

{% diagram %}
{% node #action-1 label="1. Create & Configure" theme="pink" /%}
{% node #action-2 label="2. Insert Items" parent="action-1" y="50" theme="pink" /%}

{% node parent="action-1" x="250" %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node label="Settings" /%}
{% node #item-1 label="Item 1" /%}
{% node #item-2 label="Item 2" /%}
{% node #item-3 label="Item 3" /%}
{% node #item-rest label="..." /%}
{% /node %}

{% node parent="candy-machine" x="180" y="20" %}
{% node #mint label="3. Mint" theme="pink" /%}
{% node #mint-1 label="Mint #1" theme="pink" /%}
{% node #mint-2 label="Mint #2" theme="pink" /%}
{% node #mint-3 label="Mint #3" theme="pink" /%}
{% /node %}

{% node #nft-1 parent="mint" x="120" label="Asset" theme="blue" /%}
{% node #nft-2 parent="nft-1" y="50" label="Asset" theme="blue" /%}
{% node #nft-3 parent="nft-2" y="50" label="Asset" theme="blue" /%}

{% edge from="action-1" to="candy-machine" path="straight" /%}
{% edge from="action-2" to="item-1" /%}
{% edge from="action-2" to="item-2" /%}
{% edge from="action-2" to="item-3" /%}
{% edge from="action-2" to="item-rest" /%}
{% edge from="item-1" to="mint-1" /%}
{% edge from="item-2" to="mint-2" /%}
{% edge from="item-3" to="mint-3" /%}
{% edge from="mint-1" to="nft-1" path="bezier" /%}
{% edge from="mint-2" to="nft-2" path="bezier" /%}
{% edge from="mint-3" to="nft-3" path="bezier" /%}
{% /diagram %}

### Create and Configure

Start by creating a new Core Candy Machine and configuring it with custom settings. This includes defining a collection that will be assigned to all NFTs created by the Candy Machine and all the customization that natively comes by adding [Candy Guards]() to the Candy Machine.

**Note**: Candy Guards are modular code that adds custom behavior to the Candy Machine.

Learn more about [How to create a Candy Machine]()

### Load Items

A newly created Candy Machine can't mint NFTs until it’s loaded with the assets to be minted.

Each item to load includes:
- `name`: The name of the Asset.
- `uri`: The URI pointing to the [JSON schema](/core/json-schema) of the Asset that has already been uploaded via either an onchain (e.g. Arweave, IPFS) or off-chain (e.g. AWS, your own server) storage provider. 

**Note**: If you're not familiar with how to upload metadata, you can follow [this paragraph](/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript#creating-the-metadata-for-the-asset) or use Sugar!

Learn more about [How to load a Candy Machine]()

### Mint Asset

Once all items are loaded into the Candy Machine and pre-configured conditions are met, users can begin minting assets. 

**Note**: To let the user easily access a way to mint from the candy machine, we've created this guide: [Create a Website for minting Assets from your Core Candy Machine](/guides/create-a-core-candy-machine-ui)

Learn more about [How to Mint from a Candy Machine]()

### Delete and Withdraw

After the Candy Machine has fulfilled its purpose, it can be safely deleted to reclaim the rent paid for storing its data on-chain.

Learn more about [How to Delete a Candy Machine]()

----todo

## Candy Guards

Now that we understand how Core Candy Machines work, let’s dig into the various ways creators can protect and customize the mint process of their Core Candy Machine.

Creators can use what we call “**Guards**” to add various features to their Core Candy Machine. The Metaplex Core Candy Machine ships with an additional Solana Program called **Candy Guard** that ships with [**a total of 23 default guards**](/core-candy-machine/guards). By using an additional program, it allows advanced developers to fork the default Candy Guard program to create their own custom guards whilst still being able to rely on the main Candy Machine program.

Each guard can be enabled and configured at will so creators can pick and choose the features they need. Disabling all guards would be equivalent to allowing anyone to mint our NFTs for free at any time, which is likely not what we want. So let’s have a look at a few guards to create a more realistic example.

Say a Core Candy Machine has the following guards:

- **Sol Payment**: This guard ensures the minting wallet has to pay a configured amount of SOL to a configured destination wallet.
- **Start Date**: This guard ensures minting can only start after the configured time.
- **Mint Limit**: This guard ensures each wallet cannot mint more than a configured amount.
- **Bot Tax**: This guard is a bit special. It doesn’t guard against anything but it changes the behaviour of a failed mint to prevent bots from minting Candy Machines. When this guard is activated, if any other activated guard fails to validate the mint, it will charge a small configured amount of SOL to the wallet that tried to mint.

What we end up with is a bot-protected Candy Machine that charges SOL, launches at a specific time and only allows a limited amount of mints per wallet. Here’s a concrete example.

{% diagram %}
{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node label="Settings" /%}
{% node #items label="Items" /%}
{% node #guards %}
Guards:

- Sol Payment (0.1 SOL)
- Start Date (Jan 6th)
- Mint Limit (1)
- Bot Tax (0.01 SOL)

{% /node %}
{% /node %}

{% node parent="candy-machine" x="250" %}
{% node #mints label="Assets" theme="pink" /%}
{% node #mint-1 label="#1: Wallet A (1 SOL) on Jan 5th" theme="pink" /%}
{% node #mint-2 label="#2: Wallet B (3 SOL) on Jan 6th" theme="pink" /%}
{% node #mint-3 label="#3: Wallet B (2 SOL) on Jan 6th" theme="pink" /%}
{% node #mint-4 label="#4: Wallet C (0.5 SOL) on Jan 6th" theme="pink" /%}
{% /node %}
{% node #fail-1 parent="mints" x="250" theme="red" %}
Too early {% .text-xs %} \
Bot tax charged
{% /node %}
{% node #nft-2 parent="fail-1" y="50" label="Asset" theme="blue" /%}
{% node #fail-3 parent="nft-2" y="50" theme="red" %}
Minted 1 already {% .text-xs %} \
Bot tax charged
{% /node %}
{% node #fail-4 parent="fail-3" y="50" theme="red" %}
Not enough SOL {% .text-xs %} \
Bot tax charged
{% /node %}

{% edge from="candy-machine" to="mint-1" /%}
{% edge from="candy-machine" to="mint-2" /%}
{% edge from="candy-machine" to="mint-3" /%}
{% edge from="candy-machine" to="mint-4" /%}
{% edge from="mint-1" to="fail-1" path="bezier" /%}
{% edge from="mint-2" to="nft-2" path="bezier" /%}
{% edge from="mint-3" to="fail-3" path="bezier" /%}
{% edge from="mint-4" to="fail-4" path="bezier" /%}
{% /diagram %}

As you can see, with more than 23 default guards and the ability to create custom guards, it enables creators to cherry-pick the features that matters to them and compose their perfect Candy Machine. This is such a powerful feature that we’ve dedicated many pages to it. The best place to start to know more about guards is the [Candy Guards](/core-candy-machine/guards) page.
Documents the latest changes.