---
title: Breakdown of A CMV4
metaTitle: Candy Machine V4 - Account Overview
description: Candy Machine V4 on Chain Account Overview
---

## Introduction

By September 2022, 78% of all NFTs in Solana were minted through Metaplex’s Candy Machine. This includes most of the well known NFT projects in the Solana ecosystem.

Here are some of the features it offers.

- Accept payments in SOL, NFTs or any Solana token.
- Restrict your launch via start/end dates, mint limits, third party signers, etc.
- Protect your launch against bots via configurable bot taxes and gatekeepers like Captchas.
- Restrict minting to specific NFT/Token holders or to a curated list of wallets.
- Create multiple minting groups with different sets of rules.
- Reveal your NFTs after the launch whilst allowing your users to verify that information.
- And so much more!

Interested? Let’s give you a little tour of how Candy Machines work!

## The Lifecycle of a Candy Machine

The very first step is for the creator to create a new Candy Machine and configure it however they want.

{% diagram %}
{% node #action label="1. Create & Configure" theme="pink" /%}
{% node parent="action" x="250" %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node label="Settings" /%}
{% /node %}
{% edge from="action" to="candy-machine" path="straight" /%}
{% /diagram %}

The created Candy Machine keeps track its own settings which helps us understand how all of its NFTs should be minted. For instance, there is a `collection` parameter which will be assigned to all NFTs minted from this Candy Machine. We will see how to create and configure Candy Machines in more details, including some code examples, in the following pages: [Candy Machine Settings](/core-candy-machine/settings) and [Managing Candy Machines](/core-candy-machine/manage).

However, we still don’t know which NFTs should be minted from that Candy Machine. In other words, the Candy Machine is not loaded. So our next step, is to insert items into the Candy Machine.

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
{% edge from="action-1" to="candy-machine" path="straight" /%}
{% edge from="action-2" to="item-1" /%}
{% edge from="action-2" to="item-2" /%}
{% edge from="action-2" to="item-3" /%}
{% edge from="action-2" to="item-rest" /%}
{% /diagram %}

Each item is composed of two parameters:

- A `name`: The name of the NFT.
- A `uri`: The URI pointing to the [JSON metadata](https://developers.metaplex.com/token-metadata/token-standard#the-non-fungible-standard) of the NFT. This implies that the JSON metadata has already been uploaded via either an on-chain (e.g. Arweave, IPFS) or off-chain (e.g. AWS, your own server) storage provider. The tools that you can use to create the Candy Machine, like Sugar or the JS SDK offer helpers to do so.

All other parameters are shared between all NFTs and are therefore kept in the settings of the Candy Machine directly to avoid repetition. See [Inserting Items](/core-candy-machine/insert-items) for more details.

Notice how, at this point, no real NFTs have been created yet. We are simply loading the Candy Machine with all the data it needs to **create NFTs on-demand**, at mint time. Which brings us to the next step.

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

{% node #nft-1 parent="mint" x="120" label="NFT" theme="blue" /%}
{% node #nft-2 parent="nft-1" y="50" label="NFT" theme="blue" /%}
{% node #nft-3 parent="nft-2" y="50" label="NFT" theme="blue" /%}

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

Once the Candy Machine is loaded and all pre-configured conditions are met, users can start minting NFTs from it. It’s only at this point that an NFT is created on the Solana blockchain. Note that, before minting, some users may need to perform additional verification steps — such as doing a Captcha or sending a Merkle Proof. See [Minting](/core-candy-machine/mint) for more details.

Once all NFTs have been minted from a Candy Machine, it has served its purpose and can safely be deleted to free some storage space on the blockchain and claim some rent back. See [Managing Candy Machines](/core-candy-machine/manage) for more details.

{% diagram %}
{% node #action-1 label="4. Delete" theme="pink" /%}
{% node parent="action-1" x="150" %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node label="Settings" /%}
{% node #item-1 label="Item 1" /%}
{% node #item-2 label="Item 2" /%}
{% node #item-3 label="Item 3" /%}
{% node #item-rest label="..." /%}
{% /node %}
{% node #nft-1 parent="candy-machine" x="200" label="NFT" theme="blue" /%}
{% node #nft-2 parent="nft-1" y="50" label="NFT" theme="blue" /%}
{% node #nft-3 parent="nft-2" y="50" label="NFT" theme="blue" /%}
{% edge from="action-1" to="candy-machine" path="straight" /%}
{% /diagram %}

## Candy Machine Account Structure

Explain what data is stored and what role that data has for the user.

{% totem %}
{% totem-accordion title="On Chain Candy Machine V4 Data Structure" %}

The onchain account structure of an MPL Core Asset. [Link](https://github.com/metaplex-foundation/mpl-core/blob/ce5d16f2de3c0038caae81a8c6496420b1a0462a/programs/mpl-core/src/state/asset.rs#L19)

| Name           | Type    | Size | Description                                              |     |
| -------------- | ------- | ---- | -------------------------------------------------------- | --- |
| version        | u8      | 1    | version of the candymachine                              |     |
| features       | [u8; 6] | 6    | What feature flags are enabled for the candy machine     |     |
| authority      | Pubkey  | 32   | The Authority of the Candy Machine                       |     |
| mint_authority | Pubkey  | 32   | The Mint Authority of the Candy Machine                  |     |
| collection     | Pubkey  | 32   | The collection address assigned to the Candy Machine     |     |
| items_redeemed | u64     |      | How many items have been redeemed from the Candy Machine |     |

{% /totem-accordion %}
{% /totem %}

## Candy Guards

Now that we understand how Candy Machines work, let’s dig into the various ways creators can protect and customise the mint process of their Candy Machine.

Creators can use what we call “**Guards**” to add various features to their Candy Machine. The Metaplex Candy Machine ships with an additional Solana Program called **Candy Guard** that ships with [**a total of 23 default guards**](/core-candy-machine/guards). By using an additional program, it allows advanced developers to fork the default Candy Guard program to create their own custom guards whilst still being able to rely on the main Candy Machine program.

Each guard can be enabled and configured at will so creators can pick and choose the features they need. Disabling all guards would be equivalent to allowing anyone to mint our NFTs for free at any time, which is likely not what we want. So let’s have a look at a few guards to create a more realistic example.

Say a Candy Machine has the following guards:

- **Sol Payment**: This guard ensures the minting wallet has to pay a configured amount of SOL to a configured destination wallet.
- **Start Date**: This guard ensures minting can only start after the configured time.
- **Mint Limit**: This guard ensures each wallet cannot mint more than a configured amount.
- **Bot Tax**: This guard is a bit special. It doesn’t guard against anything but it changes the behaviour of a failed mint to prevent bots from minting Candy Machines. When this guard is activated, if any other activated guard fails to validate the mint, it will charge a small configured amount of SOL to the wallet that tried to mint.

What we end up with is a bot-protected Candy Machine that charges SOL, launches at a specific time and only allows a limited amount of mints per wallet. Here’s a concrete example.

{% diagram %}
{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
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
{% node #mints label="Mints" theme="pink" /%}
{% node #mint-1 label="#1: Wallet A (1 SOL) on Jan 5th" theme="pink" /%}
{% node #mint-2 label="#2: Wallet B (3 SOL) on Jan 6th" theme="pink" /%}
{% node #mint-3 label="#3: Wallet B (2 SOL) on Jan 6th" theme="pink" /%}
{% node #mint-4 label="#4: Wallet C (0.5 SOL) on Jan 6th" theme="pink" /%}
{% /node %}
{% node #fail-1 parent="mints" x="250" theme="red" %}
Too early {% .text-xs %} \
Bot tax charged
{% /node %}
{% node #nft-2 parent="fail-1" y="50" label="NFT" theme="blue" /%}
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

## Next steps

Whilst this provides a good overview of Candy Machines, there is a lot more to discover and learn about them. Here’s what you can expect in the other pages of this Candy Machine documentation.

- [Getting Started](/core-candy-machine/getting-started). Lists the various libraries and SDKs you can use to manage Candy Machines.
- [Candy Machine Settings](/core-candy-machine/settings). Explains Candy Machine settings in great detail.
- [Managing Candy Machines](/core-candy-machine/manage). Explains how to manage Candy Machines.
- [Inserting Items](/core-candy-machine/insert-items). Explains how to load items into Candy Machines.
- [Candy Guards](/core-candy-machine/guards). Explains how guards work and how to enable them.
- [Guard Groups](/core-candy-machine/guard-groups). Explains how to configure multiple groups of guards.
- [Special Guard Instructions](/core-candy-machine/guard-route). Explains how to execute guard-specific instructions.
- [Minting](/core-candy-machine/mint). Explains how to mint from Candy Machines and how to handle pre-mint requirements.
- [How-To Guides](/core-candy-machine/how-to-guides). Lists practical articles relevant to Candy Machines.
- [Conceptual Guides](/core-candy-machine/conceptual-guides). Lists theoretical articles relevant to Candy Machines.
- [References](/core-candy-machine/references). Lists API References relevant to Candy Machines.
- [Updates](/core-candy-machine/updates). Documents the latest changes.
