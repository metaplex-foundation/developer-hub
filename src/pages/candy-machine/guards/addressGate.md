---
description: "Restricts the mint to a single address."
---

# Address Gate

## Overview

The **Address Gate** guard restricts the mint to a single address which must match the address of the minting wallet.

{% diagram height="md:h-[200px]" %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node label="Owner: Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine" x="-240" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-guard" y="100" %}
{% node #payer label="Payer" theme="indigo" /%}
{% node label="Owner: Any Program" theme="dimmed" /%}
{% /node %}

{% edge from="candy-guard" to="candy-machine" /%}
{% edge from="candy-guard" to="payer" arrow="none" dashed=true /%}

{% /diagram %}

## Guard Settings

The Address Gate guard contains the following settings:

- **Address**: The only address that is allowed to mint from the Candy Machine.

{% dialect-switcher title="Set up a Candy Machine using the Address Gate guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    addressGate: some({ address: someWallet.publicKey }),
  },
});
```

API References: [create](https://mpl-candy-machine-js-docs.vercel.app/functions/create.html), [AddressGate](https://mpl-candy-machine-js-docs.vercel.app/types/AddressGate.html)


{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

Add this object into the guard section your config.json file: 

```json
"addressGate" : {
    "address": "<PUBKEY>"
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

Now, only the defined public key will be able to mint from this Candy Machine.

## Mint Settings

_The Address Gate guard does not need Mint Settings._

## Route Instruction

_The Address Gate guard does not support or require the route instruction._
