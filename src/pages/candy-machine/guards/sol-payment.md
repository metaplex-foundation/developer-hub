---
title: "Sol Payment"
metaTitle: "Candy Machine Guards - Sol Payment"
description: "The Sol Payment guard allows us to charge the payer an amount in SOL when minting."
---

## Overview

The **Sol Payment** guard allows us to charge the payer an amount in SOL when minting. Both the amount of SOL and the destination address can be configured.

![CandyMachinesV3-GuardsSolPayment.png](https://docs.metaplex.com/assets/candy-machine-v3/CandyMachinesV3-GuardsSolPayment.png#radius)

## Guard Settings

The Sol Payment guard contains the following settings:

- **Lamports**: The amount in SOL (or lamports) to charge the payer.
- **Destination**: The address of the wallet that should receive all payments related to this guard.

{% dialect-switcher title="Set up a Candy Machine using the Sol Payment guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

Note that, in this example, we’re using the current identity as the destination wallet.

```ts
create(umi, {
  // ...
  guards: {
    solPayment: some({
      lamports: sol(1.5),
      destination: umi.identity.publicKey,
    }),
  },
});
```

API References: [create](https://mpl-candy-machine-js-docs.vercel.app/functions/create.html), [SolPayment](https://mpl-candy-machine-js-docs.vercel.app/types/SolPayment.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

Add this object into the guard section your config.json file:

```json
"solPayment": {
    "value": 1,
    "destination": "<PUBKEY>"
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Mint Settings

The Sol Payment guard contains the following Mint Settings:

- **Destination**: The address of the wallet that should receive all payments related to this guard.

Note that, if you’re planning on constructing instructions without the help of our SDKs, you will need to provide these Mint Settings and more as a combination of instruction arguments and remaining accounts. See the [Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#solpayment) for more details.

{% dialect-switcher title="Mint with the Sol Payment Guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

You may pass the Mint Settings of the Sol Payment guard using the `mintArgs` argument like so.

```ts
mintV2(umi, {
  // ...
  mintArgs: {
    solPayment: some({ destination: treasury }),
  },
});
```

API References: [mintV2](https://mpl-candy-machine-js-docs.vercel.app/functions/mintV2.html), [SolPaymentMintArgs](https://mpl-candy-machine-js-docs.vercel.app/types/SolPaymentMintArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_As soon as a guard is assigned you cannot use sugar to mint - therefore there are no specific mint settings._

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route Instruction

_The Sol Payment guard does not support the route instruction._
