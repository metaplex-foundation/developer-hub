---
title: "Token2022 Payment"
metaTitle: "Candy Machine Guards - Token Payment"
description: "The Token2022 Payment guard allows minting by charging the payer some Token2022 tokens."
---

## Overview

The **Token Payment** guard allows minting by charging the payer some tokens from a configured mint account. Both the number of tokens and the destination address can also be configured.

If the payer does not have the required amount of tokens to pay, minting will fail.

![CandyMachinesV3-GuardsTokenPayment.png](https://docs.metaplex.com/assets/candy-machine-v3/CandyMachinesV3-GuardsTokenPayment.png#radius)

## Guard Settings

The Token Payment guard contains the following settings:

- **Amount**: The number of tokens to charge the payer.
- **Mint**: The address of the mint account defining the SPL Token we want to pay with.
- **Destination Associated Token Address (ATA)**: The address of the associated token account to send the tokens to. We can get this address by finding the Associated Token Address PDA using the **Token Mint** attribute and the address of any wallet that should receive these tokens.

{% dialect-switcher title="Set up a Candy Machine using the Token Payment guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

Note that, in this example, we’re using the current identity as the destination wallet.

```ts
import { findAssociatedTokenPda } from "@metaplex-foundation/mpl-toolbox";
create(umi, {
  // ...
  guards: {
    token2022Payment: some({
      amount: 300,
      mint: tokenMint.publicKey,
      destinationAta,
    }),
  },
});
```

API References: [create](https://mpl-candy-machine-js-docs.vercel.app/functions/create.html), [TokenPayment](https://mpl-candy-machine-js-docs.vercel.app/types/TokenPaymentArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

Add this object into the guard section your config.json file:

```json
"token2022Payment" : {
    "amount": number,
    "mint": "<PUBKEY>",
    "destinationAta": "<PUBKEY>"
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Mint Settings

The Token Payment guard contains the following Mint Settings:

- **Mint**: The address of the mint account defining the SPL Token we want to pay with.
- **Destination Associated Token Address (ATA)**: The address of the associated token account to send the tokens to.

Note that, if you’re planning on constructing instructions without the help of our SDKs, you will need to provide these Mint Settings and more as a combination of instruction arguments and remaining accounts. See the [Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#tokenpayment) for more details.

{% dialect-switcher title="Mint with the NFT Burn Guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

You may pass the Mint Settings of the Token Payment guard using the `mintArgs` argument like so.

```ts
mintV2(umi, {
  // ...
  mintArgs: {
    tokenPayment: some({
      mint: tokenMint.publicKey,
      destinationAta,
    }),
  },
});
```

API References: [mintV2](https://mpl-candy-machine-js-docs.vercel.app/functions/mintV2.html), [TokenPaymentMintArgs](https://mpl-candy-machine-js-docs.vercel.app/types/Token2022PaymentMintArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_As soon as a guard is assigned you cannot use sugar to mint - therefore there are no specific mint settings._

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route Instruction

_The Token Payment guard does not support the route instruction._
