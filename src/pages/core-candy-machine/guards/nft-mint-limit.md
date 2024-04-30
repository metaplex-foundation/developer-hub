---
title: "NFT Mint Limit"
metaTitle: "Core Candy Machine Guards - NFT Mint Limit"
description: "The NFT Mint Limit guard restricts minting to holders of a specified NFT collection and limits the amount of mints that can be done for a provided NFT."
---

## Overview

The NFT Mint Limit guard restricts minting to holders of a specified NFT collection and limits the amount of mints that can be done for a provided NFT. It can be considered as a combinatino of the [NFT Gate](/core-candy-machine/guards/nft-gate) and [Mint Limit](/core-candy-machine/guards/mint-limit) Guard, based on NFT Addresses instead of wallets. 

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

API References: [create](https://mpl-core-candy-machine-js-docs.vercel.app/functions/create.html), [MintLimit](https://mpl-core-candy-machine-js-docs.vercel.app/types/NftMintLimit.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Mint Settings

The NFT Mint Limit guard contains the following Mint Settings:

- **ID**: A unique identifier for this guard.
- **Mint**: The mint address of the NFT to provide as proof that the payer owns an NFT from the required collection.

Note that, if you’re planning on constructing instructions without the help of our SDKs, you will need to provide these Mint Settings and more as a combination of instruction arguments and remaining accounts. See the [Core Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#nftmintlimit) for more details.

{% dialect-switcher title="Mint with the NFT Mint Limit Guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

You may pass the Mint Settings of the Mint Limit guard using the `mintArgs` argument like so.

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    nftMintLimit: some({ id: 1, mint: nftToBurn.publicKey }),
  },
});
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route Instruction

_The NFT Mint Limit guard does not support the route instruction._
