---
title: "Core Candy Machine - Asset Burn Guard"
metaTitle: "Core Candy Machine - Guards - Asset Burn"
description: "The Core Candy Machine 'Asset Burn' guard restricts minting to holders of a predefined Collection and burns the holder's Asset during purchase from the Core Candy Machine."
---

{% callout type="note" %}
This Guard is currently only available on devnet. [Follow us](https://x.com/metaplex) on twitter to see when it's merged to mainnet!
{% /callout %}

## Overview

The **Asset Burn** guard restricts the mint to holders of a predefined Collection and burns the holder's Asset. Thus, the address of the Asset to burn must be provided by the payer when minting.

To have the minter burn more than one Asset the [Asset Burn Multi Guard](/core-candy-machine/guards/asset-burn-multi) can be used.

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="20" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node #nftBurn label="nftBurn" /%}
{% node #requiredCollection label="- Required Collection" /%}
{% node label="..." /%}
{% /node %}

{% node parent="requiredCollection" x="270" y="-9"  %}
{% node #collectionNftMint theme="blue" %}
Collection {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="requiredCollection" to="collectionNftMint" /%}


{% edge from="collectionNftMint" to="mint-candy-guard" theme="indigo" dashed=true %}
Burn 1 Asset 

from this collection
{% /edge %}
{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    Mint from

    _Candy Guard Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-9" %}
  {% node theme="pink" %}
    Mint from 
    
    _Candy Machine Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="69" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## Guard Settings

The Asset Burn guard contains the following settings:

- **Required Collection**: The address of the required Collection. The Asset we use to mint with must be part of this collection.

{% dialect-switcher title="Set up a Candy Machine using the Asset Burn guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    assetBurn: some({ requiredCollection: requiredCollection.publicKey }),
  },
});
```

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [AssetBurn](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetBurn.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Mint Settings

The Asset Burn guard contains the following Mint Settings:

- **Required Collection**: The mint address of the required Collection.
- **Address**: The address of the Asset to burn. This must be part of the required collection and must belong to the minter.

Note that, if you’re planning on constructing instructions without the help of our SDKs, you will need to provide these Mint Settings and more as a combination of instruction arguments and remaining accounts. See the [Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#asseturn) for more details.

{% dialect-switcher title="Mint with the Asset Burn Guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

You may pass the Mint Settings of the Asset Burn guard using the `mintArgs` argument like so.

```ts

mintV1(umi, {
  // ...
  mintArgs: {
    assetBurn: some({
      requiredCollection: requiredCollection.publicKey,
      asset: assetToBurn.publicKey,
    }),
  },
});
```

API References: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [AssetBurnMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetBurnMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route Instruction

_The Asset Burn guard does not support the route instruction._
