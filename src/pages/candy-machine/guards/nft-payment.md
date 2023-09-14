---
title: "NFT Payment"
metaTitle: "Candy Machine Guards - NFT Payment"
description: "The NFT Payment guard allows minting by charging the payer an NFT from a specified NFT collection. The NFT will be transferred to a predefined destination."
---

## Overview

The **NFT Payment** guard allows minting by charging the payer an NFT from a specified NFT collection. The NFT will be transferred to a predefined destination.

If the payer does not own an NFT from the required collection, minting will fail.

![CandyMachinesV3-GuardsNFTPayment.png](https://docs.metaplex.com/assets/candy-machine-v3/CandyMachinesV3-GuardsNFTPayment.png#radius)

## Guard Settings

The NFT Payment guard contains the following settings:

- **Required Collection**: The mint address of the required NFT Collection. The NFT we use to pay with must be part of this collection.
- **Destination**: The address of the wallet that will receive all NFTs.

{% dialect-switcher title="Set up a Candy Machine using the NFT Payment Guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    nftPayment: some({
      requiredCollection: requiredCollectionNft.publicKey,
      destination: umi.identity.publicKey,
    }),
  },
});
```

API References: [create](https://mpl-candy-machine-js-docs.vercel.app/functions/create.html), [NftPayment](https://mpl-candy-machine-js-docs.vercel.app/types/NftPayment.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}
Add this object into the guard section your config.json file:

```json
"nftPayment" : {
    "requiredCollection": "<PUBKEY>",
    "destination": "<PUBKEY>"
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Mint Settings

The NFT Payment guard contains the following Mint Settings:

- **Destination**: The address of the wallet that will receive all NFTs.
- **Mint**: The mint address of the NFT to pay with. This must be part of the required collection and must belong to the minter.
- **Token Standard**: The token standard of the NFT used to pay.
- **Token Account** (optional): You may optionally provide the token account linking the NFT with its owner explicitly. By default, the associated token account of the payer will be used.
- **Rule Set** (optional): The Rule Set of the NFT used to pay, if we are paying using a Programmable NFT with a Rule Set.

Note that, if you’re planning on constructing instructions without the help of our SDKs, you will need to provide these Mint Settings and more as a combination of instruction arguments and remaining accounts. See the [Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#nftpayment) for more details.

{% dialect-switcher title="Set up a Candy Machine using the NFT Payment Guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

You may pass the Mint Settings of the NFT Payment guard using the `mintArgs` argument like so.

```ts
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";

mintV2(umi, {
  // ...
  mintArgs: {
    nftPayment: some({
      destination,
      mint: nftToPayWith.publicKey,
      tokenStandard: TokenStandard.NonFungible,
    }),
  },
});
```

API References: [mintV2](https://mpl-candy-machine-js-docs.vercel.app/functions/mintV2.html), [NftPaymentMintArgs](https://mpl-candy-machine-js-docs.vercel.app/types/NftPaymentMintArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_As soon as a guard is assigned you cannot use sugar to mint - therefore there are no specific mint settings._

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route Instruction

_The NFT Payment guard does not support the route instruction._
