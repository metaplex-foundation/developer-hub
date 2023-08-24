---
description: "Restricts the mint to a single address."
---

# Address Gate

## Overview

The **Address Gate** guard restricts the mint to a single address which must match the address of the minting wallet.

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node label="Owner: Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node #candy-guard-guards label="Guards" theme="green"/%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-guard" y="49" x="250" %}
{% node #guards label="Guards" theme="green" /%}
{% node #addressGate label="AddressGate" theme="green" /%}
{% node label="..." theme="dimmed" /%}
{% /node %}

{% node parent="addressGate" x="150" y="-9" %}
{% node #payer label="Payer" theme="indigo" /%}
{% node label="Owner: Any Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine" x="700" %}
  {% node #mint-candy-guard theme="pink" %}
    Mint from

    _Candy Guard Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" y="150" x="-8" %}
  {% node #mint-candy-machine theme="pink" %}
    Mint from 
    
    _Candy Machine Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="75" theme="blue" %}
  NFT
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}
{% edge from="addressGate" to="payer" arrow="none" dashed=true /%}
{% edge from="payer" to="mint-candy-guard" arrow="none" dashed=true%}
if the payer does not match the address on the guard 

Minting will fail
{% /edge %}
{% edge from="candy-guard-guards" to="guards" /%}
{% edge from="mint-candy-guard" to="mint-candy-machine" /%}


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
