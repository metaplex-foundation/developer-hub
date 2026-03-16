---
title: Candy Guards
metaTitle: Candy Guards | Core Candy Machine
description: Candy Guards are modular access-control components that restrict and customize minting on a Core Candy Machine. Learn about guard types, the Candy Guard account, available guards, and how to compose them.
keywords:
  - candy guard
  - guard
  - access control
  - sol payment
  - start date
  - mint limit
  - bot tax
  - allow list
  - NFT gate
  - token gate
  - custom guard
  - minting restrictions
  - Core Candy Machine guards
  - Solana NFT mint
  - guard groups
  - freeze payment
about:
  - Candy Guards
  - Access control
  - NFT minting
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: Can I create custom Candy Guards?
    a: Yes. Because guards live in a separate Candy Guard program, anyone can fork and deploy their own Candy Guard program with custom guard logic while still relying on the Core Candy Machine Core program for minting. The Metaplex SDKs also let you register custom Candy Guard programs so you can use their standard API.
  - q: How many guards can I use at once on a single Core Candy Machine?
    a: You can enable any combination of the available guards simultaneously. Guards are composable, so you activate only the ones you need. For more complex scenarios you can also use guard groups to define multiple sets of guards on a single machine.
  - q: Do all guards require mint settings or route instructions?
    a: No. Only certain guards need additional on-chain accounts (mint settings) or a dedicated route instruction. Most guards are self-contained. Check the individual guard page to see whether mint settings or a route instruction applies.
  - q: What happens if a minter fails a guard check?
    a: The transaction is rejected. If the Bot Tax guard is enabled, the failing wallet is charged a configurable SOL penalty instead of receiving an outright error, which discourages bots from spamming invalid mint attempts.
  - q: Does updating guards on a Core Candy Machine replace all existing guard settings?
    a: Yes. A guard update overwrites the entire guard configuration. You must re-specify every guard you want active, not just the ones you are changing.
  - q: What is the difference between a Candy Guard and a guard group?
    a: A Candy Guard is the on-chain account that holds one default set of guards. Guard groups let you define multiple named sets of guards within the same Candy Guard account so different wallets or phases can follow different rules.
---

## Summary

Candy Guards are modular, composable access-control components that attach to a [Core Candy Machine](/smart-contracts/core-candy-machine) to restrict and customize the [minting](/smart-contracts/core-candy-machine/mint) process on Solana. {% .lead %}

- Each guard handles a single responsibility such as payment, scheduling, or wallet gating. {% .lead %}
- Guards are defined in a separate on-chain Core Candy Guard account that becomes the Mint Authority of the Candy Machine. {% .lead %}
- Over 25 built-in guards ship with the default Candy Guard program, covering SOL/token payments, allow lists, time windows, bot protection, and more. {% .lead %}
- Custom guards can be created by forking and deploying your own Candy Guard program. {% .lead %}

## What Is a Candy Guard?

A Candy Guard is a modular on-chain component that enforces a single access-control rule during the [minting](/smart-contracts/core-candy-machine/mint) process of a [Core Candy Machine](/smart-contracts/core-candy-machine). Each guard activates independently and can be combined with other guards to build the exact minting experience you need.

There is a large set of guards to choose from and each of them can be activated and configured at will.

We'll touch on [all available guards](#available-guards) later in this documentation but let's go through a few examples here to illustrate that.

- When the **Start Date** guard is enabled, minting will be forbidden before the preconfigured date. There is also an **End Date** guard to forbid minting after a given date.
- When the **Sol Payment** guard is enabled, the minting wallet will have to pay a configured amount to a configured destination wallet. Similar guards exist for paying with tokens or NFTs of a specific collection.
- The **Token Gate** and **NFT Gate** guards restrict minting to certain token holders and NFT holders respectively.
- The **Allow List** guard only allows minting if the wallet is part of a predefined list of wallets. Kind of like a guest list for minting.

As you can see, each guard takes care of one responsibility and one responsibility only which makes them composable. In other words, you can pick and choose the guards your need to create your perfect Candy Machine.

## Core Candy Guard Account

The Core Candy Guard account is the on-chain account that stores every activated guard and its configuration for a given [Core Candy Machine](/smart-contracts/core-candy-machine). Each Core Candy Machine account should typically be associated with its own Core Candy Guard account which will add a layer of protection to it.

This works by creating a Core Candy Guard account and making it the **Mint Authority** of the Core Candy Machine account. By doing so, it is no longer possible to mint directly from the main Core Candy Machine program. Instead, we must mint via the Core Candy Guard program which, if all guards are resolved successfully, will defer to the Core Candy Machine Core program to finish the minting process.

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Program" theme="dimmed" /%}
{% node label="Features" /%}
{% node label="Authority" /%}
{% node #mint-authority-1 %}

Mint Authority = Candy Guard {% .font-semibold %}

{% /node %}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" y=160 x=20 %}
{% node #candy-guard-1 label="Core Candy Guard" theme="blue" /%}
{% node label="Owner: Core Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node label="Sol Payment" /%}
{% node label="Token Payment" /%}
{% node label="Start Date" /%}
{% node label="End Date" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=350 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Core Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="Access Control" theme="transparent" /%}
{% node parent="mint-1" x=-120 y=-35 theme="transparent" %}
Anyone can mint as long \
as they comply with the \
activated guards.
{% /node %}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}
{% node parent="mint-2" x=215 y=-18 theme="transparent" %}
Only Alice \
can mint.
{% /node %}

{% node #nft parent="mint-2" x=78 y=100 label="NFT" /%}

{% node parent="mint-2" x=280 %}
{% node #candy-machine-2 label="Candy Machine" theme="blue" /%}
{% node label="Owner: Candy Machine Core Program" theme="dimmed" /%}
{% node label="Features" /%}
{% node label="Authority" /%}
{% node #mint-authority-2 %}

Mint Authority = Alice {% .font-semibold %}

{% /node %}
{% node label="..." /%}
{% /node %}

{% edge from="candy-guard-1" to="mint-authority-1" fromPosition="left" toPosition="left" arrow=false dashed=true /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="candy-guard-1" to="mint-1" theme="pink" /%}
{% edge from="candy-machine-2" to="mint-2" theme="pink" path="straight" /%}

{% /diagram %}

Note that, since Core Candy Machine and Core Candy Guard accounts work hand and hand together, our SDKs treat them as one entity. When you create a Core Candy Machine with our SDKs, an associated Core Candy Guard account will also be created by default. The same goes when updating Core Candy Machines as they allow you to update guards at the same time. We will see some concrete examples on this page.

## Why Guards Use a Separate Program

Guards live in a dedicated Candy Guard program — separate from the Core Candy Machine Core program — so that access-control logic is fully decoupled from mint logic. The reason guards don't live in the main Core Candy Machine program is to separate the access control logic from the main Core Candy Machine responsibility which is to mint an NFT.

This enables guards to not only be modular but extendable. Anyone can create and deploy their own Core Candy Guard program to create custom guards whilst relying on the Core Candy Machine Core program for all the rest.

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Core Candy Guard" theme="blue" /%}
{% node label="Owner: Core Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node label="Sol Payment" /%}
{% node label="Token Payment" /%}
{% node label="Start Date" /%}
{% node label="End Date" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=300 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Core Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=180 %}
{% node #mint-1b label="Mint" theme="pink" /%}
{% node label="Custom Core Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1b" x=-80 y=-22 label="Different Access Control" theme="transparent" /%}

{% node parent="mint-1" x=70 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=110 y=-20 label="Same Mint Logic" theme="transparent" /%}

{% node #nft parent="mint-2" x=77 y=100 label="NFT" /%}

{% node parent="mint-1b" x=250 %}
{% node #candy-machine-2 label="Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-2" y=80 x=0 %}
{% node #candy-guard-2 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Custom Core Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node label="Sol Payment" /%}
{% node label="Token Payment" /%}
{% node label="Start Date" /%}
{% node %}
My Custom Guard {% .font-semibold %}
{% /node %}
{% node label="..." /%}
{% /node %}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="candy-guard-2" to="candy-machine-2" fromPosition="right" toPosition="right" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" fromPosition="bottom" toPosition="top" /%}
{% edge from="mint-1b" to="mint-2" theme="pink" fromPosition="bottom" toPosition="top" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="candy-guard-1" to="mint-1" theme="pink" /%}
{% edge from="candy-machine-2" to="mint-1b" theme="pink" /%}
{% edge from="candy-guard-2" to="mint-1b" theme="pink" /%}

{% /diagram %}

Note that our SDKs also offer ways to register your own Core Candy Guard programs and their custom guards so you can leverage their friendly API and easily share your guards with others.

## Available Guards

The default Core Candy Guard program ships with over 25 built-in guards covering payment, scheduling, gating, and bot protection. In the following list, we'll provide a short description of each guard with a link pointing to their dedicated page for more advanced reading.

- [**Address Gate**](/smart-contracts/core-candy-machine/guards/address-gate): Restricts the mint to a single address.
- [**Allocation**](/smart-contracts/core-candy-machine/guards/allocation): Allows specifying a limit on the number of NFTs each guard group can mint.
- [**Allow List**](/smart-contracts/core-candy-machine/guards/allow-list): Uses a wallet address list to determine who is allowed to mint.
- [**Asset Burn Multi**](/smart-contracts/core-candy-machine/guards/asset-burn-multi): Restricts the mint to holders of a specified collection, requiring a burn of one or more core assets.
- [**Asset Burn**](/smart-contracts/core-candy-machine/guards/asset-burn): Restricts the mint to holders of a specified collection, requiring a burn of a single core asset.
- [**Asset Gate**](/smart-contracts/core-candy-machine/guards/asset-gate): Restricts the mint to holders of a specified collection.
- [**Asset Mint Limit**](/smart-contracts/core-candy-machine/guards/asset-mint-limit): Restricts minting to holders of a specified collection and limits the number of mints that can be executed for a provided Core Asset.
- [**Asset Payment Multi**](/smart-contracts/core-candy-machine/guards/asset-payment-multi): Set the price of the mint as multiple Core Assets of a specified collection.
- [**Asset Payment**](/smart-contracts/core-candy-machine/guards/asset-payment): Set the price of the mint as a Core Asset of a specified collection.
- [**Bot Tax**](/smart-contracts/core-candy-machine/guards/bot-tax): Configurable tax to charge invalid transactions.
- [**Edition**](/smart-contracts/core-candy-machine/guards/edition): Adds the Edition Plugin to the minted Core Asset. See the [Print Editions](/smart-contracts/core/guides/print-editions) guide for more information.
- [**End Date**](/smart-contracts/core-candy-machine/guards/end-date): Determines a date to end the mint.
- [**Freeze Sol Payment**](/smart-contracts/core-candy-machine/guards/freeze-sol-payment): Set the price of the mint in SOL with a freeze period.
- [**Freeze Token Payment**](/smart-contracts/core-candy-machine/guards/freeze-token-payment): Set the price of the mint in token amount with a freeze period.
- [**Gatekeeper**](/smart-contracts/core-candy-machine/guards/gatekeeper): Restricts minting via a Gatekeeper Network e.g. Captcha integration.
- [**Mint Limit**](/smart-contracts/core-candy-machine/guards/mint-limit): Specifies a limit on the number of mints per wallet.
- [**Nft Burn**](/smart-contracts/core-candy-machine/guards/nft-burn): Restricts the mint to holders of a specified collection, requiring a burn of the NFT.
- [**Nft Gate**](/smart-contracts/core-candy-machine/guards/nft-gate): Restricts the mint to holders of a specified collection.
- [**Nft Payment**](/smart-contracts/core-candy-machine/guards/nft-payment): Set the price of the mint as an NFT of a specified collection.
- [**Program Gate**](/smart-contracts/core-candy-machine/guards/program-gate): Restricts the programs that can be in a mint transaction
- [**Redeemed Amount**](/smart-contracts/core-candy-machine/guards/redeemed-amount): Determines the end of the mint based on the total amount minted.
- [**Sol Fixed fee**](/smart-contracts/core-candy-machine/guards/sol-fixed-fee): Set the price of the mint in SOL with a fixed price. Similar to the [Sol Payment](/smart-contracts/core-candy-machine/guards/sol-payment) guard.
- [**Sol Payment**](/smart-contracts/core-candy-machine/guards/sol-payment): Set the price of the mint in SOL.
- [**Start Date**](/smart-contracts/core-candy-machine/guards/start-date): Determines the start date of the mint.
- [**Third Party Signer**](/smart-contracts/core-candy-machine/guards/third-party-signer): Requires an additional signer on the transaction.
- [**Token Burn**](/smart-contracts/core-candy-machine/guards/token-burn): Restricts the mint to holders of a specified token, requiring a burn of the tokens.
- [**Token Gate**](/smart-contracts/core-candy-machine/guards/token-gate): Restricts the mint to holders of a specified token.
- [**Token Payment**](/smart-contracts/core-candy-machine/guards/token-payment): Set the price of the mint in token amount.
- [**Token22 Payment**](/smart-contracts/core-candy-machine/guards/token2022-payment): Set the price of the mint in token22 (token extension) amount.
- [**Vanity Mint**](/smart-contracts/core-candy-machine/guards/vanity-mint): Restricts the mint to by expecting the new mint address to match a specific pattern.

## Notes

- Guards are fully composable. You can activate any combination of the built-in guards on a single Core Candy Machine to create the exact minting experience you need.
- Creating custom guards requires forking and deploying your own Candy Guard program. The [Core](/smart-contracts/core) Candy Machine Core program itself does not need to change.
- Updating the guards on a Core Candy Machine overwrites the entire guard configuration. Always re-specify every guard you want active, not just the ones you are modifying.
- Some guards such as [Allow List](/smart-contracts/core-candy-machine/guards/allow-list) require a [route instruction](/smart-contracts/core-candy-machine/guard-route) to be called before minting to validate prerequisites.
- You can organize guards into multiple named sets using [guard groups](/smart-contracts/core-candy-machine/guard-groups), enabling different rules for different minting phases or wallet tiers.

## FAQ

### Can I create custom Candy Guards?

Yes. Because guards live in a separate Candy Guard program, anyone can fork and deploy their own Candy Guard program with custom guard logic while still relying on the Core Candy Machine Core program for minting. The Metaplex SDKs also let you register custom Candy Guard programs so you can use their standard API.

### How many guards can I use at once on a single Core Candy Machine?

You can enable any combination of the available guards simultaneously. Guards are composable, so you activate only the ones you need. For more complex scenarios you can also use [guard groups](/smart-contracts/core-candy-machine/guard-groups) to define multiple sets of guards on a single machine.

### Do all guards require mint settings or route instructions?

No. Only certain guards need additional on-chain accounts (mint settings) or a dedicated [route instruction](/smart-contracts/core-candy-machine/guard-route). Most guards are self-contained. Check the individual guard page to see whether mint settings or a route instruction applies.

### What happens if a minter fails a guard check?

The transaction is rejected. If the [Bot Tax](/smart-contracts/core-candy-machine/guards/bot-tax) guard is enabled, the failing wallet is charged a configurable SOL penalty instead of receiving an outright error, which discourages bots from spamming invalid mint attempts.

### Does updating guards on a Core Candy Machine replace all existing guard settings?

Yes. A guard update overwrites the entire guard configuration. You must re-specify every guard you want active, not just the ones you are changing.

### What is the difference between a Candy Guard and a guard group?

A Candy Guard is the on-chain account that holds one default set of guards. [Guard groups](/smart-contracts/core-candy-machine/guard-groups) let you define multiple named sets of guards within the same Candy Guard account so different wallets or phases can follow different rules.

## Glossary

| Term | Definition |
|------|------------|
| Guard | A modular on-chain component that enforces a single access-control rule during minting. |
| Candy Guard | The on-chain account that stores the full set of activated guards for a Core Candy Machine. |
| Candy Guard Program | The Solana program that owns Candy Guard accounts and evaluates all guard conditions before delegating to the Core Candy Machine Core program. |
| Mint Authority | The public key authorized to invoke mint on a Core Candy Machine; set to the Candy Guard account when guards are active. |
| Sol Payment | A guard that requires the minting wallet to pay a specified amount of SOL to a destination wallet. |
| Bot Tax | A guard that charges a configurable SOL penalty on failed mint transactions to deter bots. |
| Allow List | A guard that restricts minting to wallets present in a predefined Merkle-tree-based list. |
| Guard Groups | Named sets of guards within a single Candy Guard account, enabling different rules for different minting phases or wallet tiers. |
| Route Instruction | A dedicated instruction that some guards require to be called before minting to validate or set up prerequisites. See [Guard Route](/smart-contracts/core-candy-machine/guard-route). |
| Mint Settings | Additional on-chain account data that certain guards create or require during the mint process. |

