---
title: Core Candy Machine Program Overview
metaTitle: Program Overview | Core Candy Machine
description: A comprehensive overview of the Core Candy Machine program architecture, lifecycle, account structure, and guard system for launching MPL Core Asset collections on Solana.
keywords:
  - core candy machine
  - candy machine overview
  - solana nft launch
  - mpl core candy machine
  - candy guard
  - nft minting
  - core assets
  - metaplex candy machine
  - candy machine lifecycle
  - candy machine account structure
  - guard system
  - config line settings
  - hidden settings
  - mint authority
  - candy machine architecture
  - solana nft distribution
  - bot protection
  - guard groups
about:
  - Core Candy Machine
  - Candy Guard
  - MPL Core
  - Solana NFT Launch
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: What is the Core Candy Machine and how does it differ from Candy Machine V3?
    a: Core Candy Machine is the latest Metaplex minting program designed specifically for MPL Core Assets. Candy Machine V3 mints Token Metadata NFTs using the older standard. Core Candy Machine produces lighter, more cost-efficient assets because MPL Core uses a single-account model instead of multiple accounts per NFT.
  - q: How many guards are available for Core Candy Machine?
    a: Core Candy Machine ships with over 23 default guards through the companion Candy Guard program. These guards cover payment collection (SOL, SPL tokens, NFTs), access control (allow lists, token gates, NFT gates), scheduling (start and end dates), and bot protection (bot tax, gatekeepers).
  - q: Can I use custom guards with Core Candy Machine?
    a: Yes. The guard system is implemented as a separate Candy Guard program that can be forked. Developers can create custom guards while still relying on the main Candy Machine program for the actual minting logic.
  - q: What happens to a Core Candy Machine after all items are minted?
    a: After all items are minted, the Candy Machine can be deleted (withdrawn) to reclaim the on-chain storage rent. This operation is irreversible and returns the SOL used for rent to the authority wallet.
  - q: Do I need to create NFTs before loading a Core Candy Machine?
    a: No. You load the Candy Machine with item metadata (name and URI pairs), not actual on-chain assets. The Core Assets are only created on-chain at the moment a user mints from the Candy Machine.
  - q: What is the difference between the Candy Machine authority and the mint authority?
    a: The authority controls configuration and management of the Candy Machine (updating settings, inserting items, withdrawing). The mint authority controls who can trigger minting. Typically, the Candy Guard account is set as the mint authority so that guard validations are enforced before any mint occurs.
---

## Summary

Core Candy Machine is the Metaplex minting and distribution program purpose-built for launching [MPL Core](/smart-contracts/core) Asset collections on Solana. It manages the full lifecycle of an NFT drop, from loading item metadata through guarded minting to post-launch cleanup.

- Supports over 23 composable [guards](/smart-contracts/core-candy-machine/guards) for payment, access control, scheduling, and bot protection
- Mints [MPL Core Assets](/smart-contracts/core) (single-account NFTs), not legacy Token Metadata NFTs
- Items are loaded as metadata references; on-chain assets are created only at mint time
- The separate [Candy Guard](/smart-contracts/core-candy-machine/guards) program provides a forkable access-control layer for custom minting workflows

## Introduction

By September 2022, 78% of all NFTs in Solana were minted through Metaplex's Candy Machine. This includes most of the well known NFT projects in the Solana ecosystem. Come 2024 Metaplex introduced the [Core](/smart-contracts/core) protocol which redefines NFTs on Solana and with it a new Candy Machine to accommodate the same minting mechanics users loved for the Core standard.

Here are some of the features it offers.

- Accept payments in SOL, NFTs or any Solana token.
- Restrict your launch via start/end dates, mint limits, third party signers, etc.
- Protect your launch against bots via configurable bot taxes and gatekeepers like Captchas.
- Restrict minting to specific Asset/NFT/Token holders or to a curated list of wallets.
- Create multiple minting groups with different sets of rules.
- Reveal your Assets after the launch whilst allowing your users to verify that information.
- And so much more!

{% callout type="note" %}
This page covers Core Candy Machine, which mints [MPL Core](/smart-contracts/core) Assets. If you need to mint Token Metadata NFTs, refer to [Candy Machine V3](/smart-contracts/candy-machine) instead.
{% /callout %}

## Core Candy Machine Lifecycle

The Core Candy Machine lifecycle consists of four sequential phases: creation, item loading, minting, and optional withdrawal. Each phase must complete before the next can begin.

### Phase 1 — Create and Configure the Candy Machine

The first step is for the creator to create a new Core Candy Machine and configure its settings, including the [collection](/smart-contracts/core/collections) address, item count, and optional [Config Line Settings](/smart-contracts/core-candy-machine/create) or [Hidden Settings](/smart-contracts/core-candy-machine/guides/create-a-core-candy-machine-with-hidden-settings).

{% diagram %}
{% node #action label="1. Create & Configure" theme="pink" /%}
{% node parent="action" x="250" %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node label="Settings" /%}
{% /node %}
{% edge from="action" to="candy-machine" path="straight" /%}
{% /diagram %}

The created Core Candy Machine keeps track of its own settings which determine how all of its Assets should be created. For instance, there is a `collection` parameter which will be assigned to all Assets created from this Core Candy Machine. See [Creating a Core Candy Machine](/smart-contracts/core-candy-machine/create) for details on all available settings.

### Phase 2 — Insert Items into the Candy Machine

After creation, the Candy Machine must be loaded with the metadata for each item to be minted. Each item consists of a `name` and a `uri` pointing to pre-uploaded JSON metadata.

{% diagram %}
{% node #action-1 label="1. Create & Configure" theme="pink" /%}
{% node #action-2 label="2. Insert Items" parent="action-1" y="50" theme="pink" /%}
{% node parent="action-1" x="250" %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
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

- A `name`: The name of the Asset.
- A `uri`: The URI pointing to the [JSON metadata](/smart-contracts/token-metadata/token-standard#the-non-fungible-standard) of the Asset. This implies that the JSON metadata has already been uploaded via either an on-chain (e.g. Arweave, IPFS) or off-chain (e.g. AWS, your own server) storage provider. The tools that you can use to create the Candy Machine, like the [CLI](/dev-tools/cli/cm) or the JS SDK offer helpers to do so.

All other parameters are shared between Assets and are therefore kept in the settings of the Candy Machine directly to avoid repetition. See [Inserting Items](/smart-contracts/core-candy-machine/insert-items) for more details.

{% callout type="note" %}
No actual on-chain Assets exist at this point. The Candy Machine only stores metadata references. Assets are created on the Solana blockchain at the moment of minting.
{% /callout %}

### Phase 3 — Mint Assets from the Candy Machine

Once the Candy Machine is fully loaded and all configured [guard](/smart-contracts/core-candy-machine/guards) conditions are satisfied, users can begin minting Core Assets. Each mint consumes one item from the Candy Machine and creates a new on-chain Asset.

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

Before minting, some users may need to perform additional verification steps — such as completing a Captcha or submitting a Merkle Proof. See [Minting](/smart-contracts/core-candy-machine/mint) for more details.

### Phase 4 — Withdraw the Candy Machine

After all Assets have been minted, the Candy Machine has served its purpose and can be deleted to reclaim on-chain storage rent. The authority receives the reclaimed SOL.

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
{% node #nft-1 parent="candy-machine" x="200" label="Asset" theme="blue" /%}
{% node #nft-2 parent="nft-1" y="50" label="Asset" theme="blue" /%}
{% node #nft-3 parent="nft-2" y="50" label="Asset" theme="blue" /%}
{% edge from="action-1" to="candy-machine" path="straight" /%}
{% /diagram %}

{% callout type="warning" %}
Withdrawing a Candy Machine is irreversible. Only withdraw after you are certain the minting process is complete. See [Withdrawing a Candy Machine](/smart-contracts/core-candy-machine/withdrawing-a-candy-machine) for details.
{% /callout %}

## Core Candy Machine Account Structure

The Core Candy Machine account stores all configuration and state data needed to manage the minting process. The on-chain data structure tracks the machine version, enabled features, authority keys, collection binding, and redemption count.

{% totem %}
{% totem-accordion title="On Chain Core Candy Machine Data Structure" %}

The on-chain account structure of a Core Candy Machine. [View on GitHub](https://github.com/metaplex-foundation/mpl-core-candy-machine)

| Name           | Type    | Size | Description                                              |
| -------------- | ------- | ---- | -------------------------------------------------------- |
| version        | u8      | 1    | Version of the Candy Machine account                     |
| features       | [u8; 6] | 6    | Feature flags enabled for the Candy Machine              |
| authority      | Pubkey  | 32   | The Authority wallet that manages the Candy Machine      |
| mint_authority | Pubkey  | 32   | The Mint Authority — typically the Candy Guard account   |
| collection     | Pubkey  | 32   | The MPL Core collection address assigned at creation     |
| items_redeemed | u64     | 8    | Count of items that have been minted from this machine   |

{% /totem-accordion %}
{% /totem %}

The **authority** controls management operations such as updating settings, inserting items, and withdrawing rent. The **mint_authority** controls who can trigger the mint instruction. When a [Candy Guard](/smart-contracts/core-candy-machine/guards) is attached, it becomes the mint authority so that all guard validations must pass before minting proceeds.

## Candy Guard System

The Candy Guard program is a companion Solana program that provides composable, configurable access control for Core Candy Machine minting. Guards are modular rules that restrict or modify the minting process.

Creators can use what we call "**Guards**" to add various features to their Core Candy Machine. The Metaplex Core Candy Machine ships with an additional Solana Program called **Candy Guard** that ships with [**a total of over 23 default guards**](/smart-contracts/core-candy-machine/guards). By using an additional program, it allows advanced developers to fork the default Candy Guard program to create their own [custom guards](/smart-contracts/core-candy-machine/custom-guards/generating-client) whilst still being able to rely on the main Candy Machine program.

Each guard can be enabled and configured at will so creators can pick and choose the features they need. Disabling all guards would be equivalent to allowing anyone to mint Assets for free at any time, which is likely not what creators want.

### Candy Guard Composition Example

Guards compose together to form a complete minting policy. The following example demonstrates how four guards combine to create a bot-protected, time-gated, rate-limited, paid mint.

Say a Core Candy Machine has the following guards:

- **[Sol Payment](/smart-contracts/core-candy-machine/guards/sol-payment)**: Ensures the minting wallet pays a configured amount of SOL to a configured destination wallet.
- **[Start Date](/smart-contracts/core-candy-machine/guards/start-date)**: Ensures minting can only begin after the configured time.
- **[Mint Limit](/smart-contracts/core-candy-machine/guards/mint-limit)**: Ensures each wallet cannot mint more than a configured amount.
- **[Bot Tax](/smart-contracts/core-candy-machine/guards/bot-tax)**: Charges a small configured amount of SOL to any wallet whose mint attempt fails guard validation, deterring automated bots.

What we end up with is a bot-protected Candy Machine that charges SOL, launches at a specific time and only allows a limited amount of mints per wallet. Here is a concrete example.

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

With more than 23 default guards and the ability to create custom guards, creators can cherry-pick the features that matter to them and compose their perfect Candy Machine. Guards can also be organized into [Guard Groups](/smart-contracts/core-candy-machine/guard-groups) to define multiple minting phases with different rules (for example, an early-access phase for allow-listed wallets followed by a public mint). The best place to start learning about guards is the [Candy Guards](/smart-contracts/core-candy-machine/guards) page.

## Notes

- Core Candy Machine mints [MPL Core](/smart-contracts/core) Assets exclusively. To mint Token Metadata NFTs, use [Candy Machine V3](/smart-contracts/candy-machine) instead.
- All items must be inserted before minting can begin when using Config Line Settings.
- The JSON metadata for each item must be uploaded to a storage provider (Arweave, IPFS, AWS, etc.) before inserting items into the Candy Machine.
- [Withdrawing](/smart-contracts/core-candy-machine/withdrawing-a-candy-machine) a Candy Machine is irreversible and deletes all on-chain data for that machine.
- The Candy Guard program is separate from the Candy Machine Core program. Forking the guard program for custom logic does not require modifying the core minting program.
- Guard validation failures with [Bot Tax](/smart-contracts/core-candy-machine/guards/bot-tax) enabled will charge the failed minter rather than simply rejecting the transaction.

*Maintained by [Metaplex Foundation](https://github.com/metaplex-foundation) · Last verified March 2026 · [View source on GitHub](https://github.com/metaplex-foundation/mpl-core-candy-machine)*

## FAQ

### What is the Core Candy Machine and how does it differ from Candy Machine V3?

Core Candy Machine is the latest Metaplex minting program designed specifically for [MPL Core](/smart-contracts/core) Assets. [Candy Machine V3](/smart-contracts/candy-machine) mints Token Metadata NFTs using the older standard. Core Candy Machine produces lighter, more cost-efficient assets because MPL Core uses a single-account model instead of multiple accounts per NFT.

### How many guards are available for Core Candy Machine?

Core Candy Machine ships with over 23 default [guards](/smart-contracts/core-candy-machine/guards) through the companion Candy Guard program. These guards cover payment collection (SOL, SPL tokens, NFTs), access control (allow lists, token gates, NFT gates), scheduling (start and end dates), and bot protection (bot tax, gatekeepers).

### Can developers create custom guards for Core Candy Machine?

Yes. The guard system is implemented as a separate Candy Guard program that can be forked. Developers can create [custom guards](/smart-contracts/core-candy-machine/custom-guards/generating-client) while still relying on the main Candy Machine program for the actual minting logic.

### What happens to a Core Candy Machine after all items are minted?

After all items are minted, the Candy Machine can be [withdrawn](/smart-contracts/core-candy-machine/withdrawing-a-candy-machine) to reclaim the on-chain storage rent. This operation is irreversible and returns the SOL used for rent to the authority wallet.

### Do items need to exist as on-chain Assets before loading a Core Candy Machine?

No. You load the Candy Machine with item metadata (name and URI pairs), not actual on-chain assets. The Core Assets are only created on the Solana blockchain at the moment a user mints from the Candy Machine. See [Inserting Items](/smart-contracts/core-candy-machine/insert-items) for details.

### What is the difference between the Candy Machine authority and the mint authority?

The **authority** controls configuration and management of the Candy Machine (updating settings, inserting items, withdrawing). The **mint authority** controls who can trigger minting. Typically, the [Candy Guard](/smart-contracts/core-candy-machine/guards) account is set as the mint authority so that guard validations are enforced before any mint occurs.

## Glossary

| Term | Definition |
|------|------------|
| Candy Machine | A temporary on-chain account that stores item metadata and configuration for an NFT launch. Items are minted from it one at a time until depleted. |
| Candy Guard | A companion Solana program that provides composable access-control rules (guards) for a Candy Machine. It acts as the mint authority and validates conditions before delegating to the Candy Machine program. |
| Guard | A single, modular rule within the Candy Guard program that restricts or modifies the minting process — for example, requiring SOL payment or enforcing a start date. |
| Guard Group | A named set of guards that defines a distinct minting phase or tier. Multiple guard groups allow different rules for different audiences (e.g., allow-list vs. public). |
| Config Line Settings | A Candy Machine configuration mode where each item's name and URI are stored individually on-chain with configurable length constraints. |
| Hidden Settings | A Candy Machine configuration mode where all minted Assets share the same initial metadata, typically used for post-mint reveal mechanics. |
| Item | A name and URI pair loaded into the Candy Machine that represents the metadata for one future Asset. Not an on-chain asset until minted. |
| Authority | The wallet that owns and manages the Candy Machine — authorized to update settings, insert items, and withdraw rent. |
| Mint Authority | The account authorized to call the mint instruction on the Candy Machine. Typically set to the Candy Guard account to enforce guard validation. |
| Collection | An [MPL Core collection](/smart-contracts/core/collections) address assigned to the Candy Machine at creation. All minted Assets are automatically added to this collection. |
