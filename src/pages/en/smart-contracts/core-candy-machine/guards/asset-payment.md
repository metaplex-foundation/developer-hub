---
title: "Asset Payment Guard"
metaTitle: "Asset Payment Guard | Core Candy Machine"
description: "The Core Candy Machine 'Asset Payment' guard requires another Core Asset from a specific collection as payment for the mint from the Core Candy Machine"
---

## Overview

The **Asset Payment** guard allows minting by charging the payer a Core Asset from a specified Asset collection. The Asset will be transferred to a predefined destination.

If the payer does not own an Asset from the required collection, minting will fail.

To have the minter pay more than one Asset the [Asset Payment Multi Guard](/smart-contracts/core-candy-machine/guards/asset-payment-multi) can be used.

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="20" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node label="assetPayment" /%}
{% node #guardRequiredCollection label="- Required Collection" /%}
{% node #guardDestinationWallet label="- Destination Wallet" /%}
{% node label="..." /%}
{% /node %}

{% node parent="guardRequiredCollection" #collectionNftMint x="270" y="-100"  %}
{% node theme="blue" %}
Collection
{% /node %}
{% node theme="dimmed" %}
Owner: Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="guardRequiredCollection" to="collectionNftMint" /%}

{% node parent="guardDestinationWallet" #destinationWallet x="300"  %}
{% node theme="blue" %}
Destination Wallet {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: System Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="guardDestinationWallet" to="destinationWallet" /%}

{% edge from="collectionNftMint" to="mint-candy-guard" theme="indigo" dashed=true arrow="none" /%}

{% node parent="mint-candy-guard" theme="transparent" x="-180" y="20" %}
Transfers

1 Asset from

this collection
{% /node %}

{% edge from="mint-candy-guard" to="destinationWallet" theme="indigo" %}
{% /edge %}
{% node parent="candy-machine" #mint-candy-guard x="600" %}
  {% node theme="pink" %}
    Mint from

    _Core Candy Guard Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-9" %}
  {% node theme="pink" %}
    Mint from

    _Core Candy Machine Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="92" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## Guard Settings

The Asset Payment guard contains the following settings:

- **Required Collection**: The mint address of the required Collection. The Asset we use to pay with must be part of this collection.
- **Destination**: The address of the wallet that will receive all Assets.

{% dialect-switcher title="Set up a Candy Machine using the Asset Payment Guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    assetPayment: some({
      requiredCollection: requiredCollection.publicKey,
      destination: umi.identity.publicKey,
    }),
  },
});
```

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [AssetPayment](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetPayment.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Mint Settings

The Asset Payment guard contains the following Mint Settings:
- **Asset Address**: The address of the Asset to pay with. This must be part of the required collection and must belong to the minter.
- **Collection Address**: The Address of the Collection that is used for payment.
- **Destination**: The address of the wallet that will receive all Assets.

Note that, if you’re planning on constructing instructions without the help of our SDKs, you will need to provide these Mint Settings and more as a combination of instruction arguments and remaining accounts. See the [Core Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#assetpayment) for more details.

{% dialect-switcher title="Set up a Candy Machine using the Asset Payment Guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

You may pass the Mint Settings of the Asset Payment guard using the `mintArgs` argument like so.

```ts

mintV1(umi, {
  // ...
  mintArgs: {
    assetPayment: some({
      requiredCollection: publicKey(requiredCollection),
      destination,
      asset: assetToSend.publicKey,
    }),
  },
});
```

API References: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [AssetPaymentMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetPaymentMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route Instruction

_The Asset Payment guard does not support the route instruction._
