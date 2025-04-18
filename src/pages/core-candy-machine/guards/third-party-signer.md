---
title: Third Party Signer Guard
metaTitle: Third Party Signer Guard | Core Candy Machine
description: "The Core Candy Machine 'Third Party Signer' guard requires a predefined address to sign each mint transaction or the transaction will fail."
---

## Overview

The **Third Party Signer** guard requires a predefined address to sign each mint transaction. The signer will need to be passed within the mint settings of this guard.

This allows for more centralized mints where every single mint transaction has to go through a specific signer.

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
{% node label="Third Party Signer" /%}
{% node #guardSigner label="- Signer" /%}
{% node label="..." /%}
{% /node %}

{% node parent="guardSigner" #signer x="270" y="-19" %}
{% node  theme="indigo" %}
Signer {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: Any Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
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

{% node #nft parent="mint-candy-machine" y="140" x="93" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}
{% edge from="guardSigner" to="signer" arrow="none" dashed=true /%}
{% edge from="mint-candy-guard" to="signer" arrow="none" dashed=true  theme="pink" %}
If this Signer Account does not

sign the mint transaction

minting will fail
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}
## Guard Settings

The Third Party Signer guard contains the following settings:

- **Signer Key**: The address of the signer that will need to sign each mint transaction.

{% dialect-switcher title="Set up a Candy Machine using the Third Party Signer Guard" %}
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

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [ThirdPartySigner](https://mpl-core-candy-machine.typedoc.metaplex.com/types/ThirdPartySigner.html)

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
{% /dialect-switcher %}

## Route Instruction

_The Third Party Signer guard does not support the route instruction._
