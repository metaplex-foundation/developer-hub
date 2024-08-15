---
title: Candy Guards
metaTitle: Candy Guards | Core Candy Machine
description: Learn about the different types of guards available for the Core Candy Machine and their functionality.
---

## What is a guard?

A guard is a modular piece of code that can restrict access to the mint of a Core Candy Machine and even add new features to it!

There is a large set of guards to choose from and each of them can be activated and configured at will.

We’ll touch on [all available guards](/core-candy-machine/guards) later in this documentation but let’s go through a few examples here to illustrate that.

- When the **Start Date** guard is enabled, minting will be forbidden before the preconfigured date. There is also an **End Date** guard to forbid minting after a given date.
- When the **Sol Payment** guard is enabled, the minting wallet will have to pay a configured amount to a configured destination wallet. Similar guards exist for paying with tokens or NFTs of a specific collection.
- The **Token Gate** and **NFT Gate** guards restrict minting to certain token holders and NFT holders respectively.
- The **Allow List** guard only allows minting if the wallet is part of a predefined list of wallets. Kind of like a guest list for minting.

As you can see, each guard takes care of one responsibility and one responsibility only which makes them composable. In other words, you can pick and choose the guards your need to create your perfect Candy Machine.

## The Core Candy Guard account

Each Core Candy Machine account should typically be associated with its own Core Candy Guard account which will add a layer of protection to it.

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

## Why another program?

The reason guards don’t live in the main Core Candy Machine program is to separate the access control logic from the main Core Candy Machine responsibility which is to mint an NFT.

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

## All available guards

Alright, now that we understand what guards are, let’s see what default guards are available to us.

In the following list, we’ll provide a short description of each guard with a link pointing to their dedicated page for more advanced reading.

- [**Address Gate**](/core-candy-machine/guards/address-gate): Restricts the mint to a single address.
- [**Allocation**](/core-candy-machine/guards/allocation): Allows specifying a limit on the number of NFTs each guard group can mint.
- [**Allow List**](/core-candy-machine/guards/allow-list): Uses a wallet address list to determine who is allowed to mint.
- [**Bot Tax**](/core-candy-machine/guards/bot-tax): Configurable tax to charge invalid transactions.
- [**End Date**](/core-candy-machine/guards/end-date): Determines a date to end the mint.
- [**Freeze Sol Payment**](/core-candy-machine/guards/freeze-sol-payment): Set the price of the mint in SOL with a freeze period.
- [**Freeze Token Payment**](/core-candy-machine/guards/freeze-token-payment): Set the price of the mint in token amount with a freeze period.
- [**Gatekeeper**](/core-candy-machine/guards/gatekeeper): Restricts minting via a Gatekeeper Network e.g. Captcha integration.
- [**Mint Limit**](/core-candy-machine/guards/mint-limit): Specifies a limit on the number of mints per wallet.
- [**Nft Burn**](/core-candy-machine/guards/nft-burn): Restricts the mint to holders of a specified collection, requiring a burn of the NFT.
- [**Nft Gate**](/core-candy-machine/guards/nft-gate): Restricts the mint to holders of a specified collection.
- [**Nft Payment**](/core-candy-machine/guards/nft-payment): Set the price of the mint as an NFT of a specified collection.
- [**Program Gate**](/core-candy-machine/guards/program-gate): Restricts the programs that can be in a mint transaction
- [**Redeemed Amount**](/core-candy-machine/guards/redeemed-amount): Determines the end of the mint based on the total amount minted.
- [**Sol Payment**](/core-candy-machine/guards/sol-payment): Set the price of the mint in SOL.
- [**Start Date**](/core-candy-machine/guards/start-date): Determines the start date of the mint.
- [**Third Party Signer**](/core-candy-machine/guards/third-party-signer): Requires an additional signer on the transaction.
- [**Token Burn**](/core-candy-machine/guards/token-burn): Restricts the mint to holders of a specified token, requiring a burn of the tokens.
- [**Token Gate**](/core-candy-machine/guards/token-gate): Restricts the mint to holders of a specified token.
- [**Token Payment**](/core-candy-machine/guards/token-payment): Set the price of the mint in token amount.
- [**Token22 Payment**](/core-candy-machine/guards/token2022-payment): Set the price of the mint in token22 (token extension) amount.

## Conclusion

Guards are important components of Core Candy Machines. They make it easy to configure the minting process whilst allowing anyone to create their own guards for application-specific needs.
