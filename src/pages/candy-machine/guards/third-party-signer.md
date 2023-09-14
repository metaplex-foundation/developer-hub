---
title: "Third Party Signer"
metaTitle: "Candy Machine Guards - Third Party Signer"
description: "The Third Party Signer guard requires a predefined address to sign each mint transaction."
---

## Overview

The **Third Party Signer** guard requires a predefined address to sign each mint transaction. The signer will need to be passed within the mint settings of this guard.

This allows for more centralized mints where every single mint transaction has to go through a specific signer.

![CandyMachinesV3-GuardsThirdPartySigner.png](https://docs.metaplex.com/assets/candy-machine-v3/CandyMachinesV3-GuardsThirdPartySigner.png#radius)

## Guard Settings

The Third Party Signer guard contains the following settings:

- **Signer Key**: The address of the signer that will need to sign each mint transaction.

{% dialect-switcher title="Set up a Candy Machine using the Third Pary Signer Guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
const myConfiguredSigner = generateSigner(umi);

create(umi, {
  // ...
  guards: {
    thirdPartySigner: some({ signerKey: myConfiguredSigner.publicKey }),
  },
});
```

API References: [create](https://mpl-candy-machine-js-docs.vercel.app/functions/create.html), [ThirdPartySigner](https://mpl-candy-machine-js-docs.vercel.app/types/ThirdPartySigner.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

Add this object into the guard section your config.json file:

```json
"thirdPartySigner" : {
    "signerKey": "<PUBKEY>"
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Mint Settings

The Third Party Signer guard contains the following Mint Settings:

- **Signer**: The required third-party signer. The address of this signer must match the Signer Key in the guard settings.

{% dialect-switcher title="Mint with the Third Party Signer Guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

When minting via the Umi library, simply provide the third-party signer via the `signer` attribute like so.

```ts
create(umi, {
  // ...
  guards: {
    thirdPartySigner: some({ signer: myConfiguredSigner }),
  },
});
```

Remember to also sign the transaction with the myConfiguredSigner keypair. 

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_As soon as a guard is assigned you cannot use sugar to mint - therefore there are no specific mint settings._

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route Instruction

_The Third Party Signer guard does not support the route instruction._
