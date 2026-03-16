---
title: "NFT Mint Limit Guard"
metaTitle: "NFT Mint Limit Guard - Per-NFT Mint Cap | Core Candy Machine"
description: "The Core Candy Machine NFT Mint Limit guard restricts minting to holders of a specified NFT collection and limits the number of Assets each NFT can mint, combining token-gated access with per-NFT rate limiting."
keywords:
  - NFT Mint Limit guard
  - Core Candy Machine
  - candy guard
  - per-NFT mint cap
  - mint counter PDA
  - token gated minting
  - rate limiting
  - Solana NFT
  - minting restriction
about:
  - Candy Machine guards
  - per-NFT mint rate limiting
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

The **NFT Mint Limit** guard restricts minting to holders of a specified NFT collection and caps the number of Assets each individual NFT can mint using an on-chain counter PDA. {% .lead %}

## Overview

The NFT Mint Limit guard restricts minting to holders of a specified NFT collection and limits the amount of mints that can be done for a provided Token Metadata NFT. It can be considered as a combination of the [NFT Gate](/smart-contracts/core-candy-machine/guards/nft-gate) and [Mint Limit](/smart-contracts/core-candy-machine/guards/mint-limit) Guard, based on NFT Addresses instead of wallets.

The limit is set per NFT Collection, per candy machine and per identifier — provided in the settings — to allow multiple nft mint limits within the same Core Candy Machine.

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="20" %}
{% node #candy-guard label="Core Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node #mintLimit label="NftMintLimit" /%}
{% node #limit label="- Limit" /%}
{% node #id label="- ID" /%}
{% node label="- Required Collection" /%}
{% node label="..." /%}
{% /node %}

{% node parent="id" x="270" y="-9"  %}
{% node #nftMintCounterPda %}
NFT Mint Counter PDA {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="id" to="nftMintCounterPda" /%}

{% node #nft parent="nftMintCounterPda" x="0" y="40"  label="Seeds: candyGuard, candyMachine, id, mint" theme="transparent"  /%}

{% edge from="mintLimit" to="mint-candy-guard" theme="indigo" dashed=true/%}
{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    Mint from

    _Candy Guard Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-30" %}
  {% node  theme="pink" %}
    Mint from

    _Core Candy Machine Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #asset parent="mint-candy-machine" y="140" x="90" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="asset" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" /%}

{% /diagram %}

## Guard Settings

The Mint Limit guard contains the following settings:

- **ID**: A unique identifier for this guard. Different identifiers will use different counters to track how many items were minted by providing a given NFT. This is particularly useful when using groups of guards as we may want each of them to have a different mint limit.
- **Limit**: The maximum number of mints allowed per NFT for that identifier.
- **Required Collection**: The mint address of the required NFT Collection. The NFT we provide as proof when minting must be part of this collection.

{% dialect-switcher title="Set up a Candy Machine using the NFT Mint Limit guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    nftMintLimit: some({
      id: 1,
      limit: 5,
      requiredCollection: requiredCollectionNft.publicKey,
    }),
  },
});
```

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [MintLimit](https://mpl-core-candy-machine.typedoc.metaplex.com/types/NftMintLimit.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Mint Settings

The NFT Mint Limit guard contains the following Mint Settings:

- **ID**: A unique identifier for this guard.
- **Mint**: The mint address of the NFT to provide as proof that the payer owns an NFT from the required collection.

Note that, if you're planning on constructing instructions without the help of our SDKs, you will need to provide these Mint Settings and more as a combination of instruction arguments and remaining accounts. See the [Core Candy Guard's program documentation](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#nftmintlimit) for more details.

{% dialect-switcher title="Mint with the NFT Mint Limit Guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

You may pass the Mint Settings of the Mint Limit guard using the `mintArgs` argument like so.

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    nftMintLimit: some({ id: 1, mint: nftToVerify.publicKey }),
  },
});
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route Instruction

_The NFT Mint Limit guard does not support the route instruction._

## NftMintLimit Accounts
When the `NftMintLimit` Guard is used a `NftMintCounter` Account is created for each NFT, CandyMachine and `id` combination. For validation purposes it can be fetched like this:

```js
import {
  findNftMintCounterPda,
  fetchNftMintCounter
 } from "@metaplex-foundation/mpl-core-candy-machine";

const pda = findNftMintCounterPda(umi, {
  id: 1, // The nftMintLimit id you set in your guard config
  mint: asset.publicKey, // The address of the nft your user owns
  candyMachine: candyMachine.publicKey,
  // or candyMachine: publicKey("Address") with your CM Address
  candyGuard: candyMachine.mintAuthority
  // or candyGuard: publicKey("Address") with your candyGuard Address
});

const nftMintCounter = fetchNftMintCounter(umi, pda)
```

## Notes

- The mint counter is tracked per NFT address, per Candy Machine, and per guard ID -- not per wallet. Different NFTs from the same collection each have their own independent counter.
- Using different guard IDs allows you to set multiple independent mint limits within the same Candy Machine (for example, different limits per guard group).
- The `NftMintCounter` PDA is derived from `[candyGuard, candyMachine, id, mint]` and can be fetched to check how many mints an NFT has already used.
- This guard uses Token Metadata NFTs (not Core Assets) for the collection verification.

