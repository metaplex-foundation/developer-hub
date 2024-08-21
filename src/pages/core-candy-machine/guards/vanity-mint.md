---
title: "Core Candy Machine - Vanity Mint Guard"
metaTitle: "Core Candy Machine - Guards - Vanity Mint"
description: "The Core Candy Machine 'Vanity Mint' guard requires the minter to provide a specific vanity mint as Asset Address"
---

{% callout type="note" %}
This Guard is currently only available on devnet. [Follow us](https://x.com/metaplex) on twitter to see when it's merged to mainnet!
{% /callout %}

## Overview

The **Vanity Mint** guard allows minting if the specified mint address matches a specific format. This guard basically allows to add a Proof of Work (POW) requirement where the user has to grind for a Public Key that matches the pattern.

If the minter does not use a matching mint address, minting will fail.

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
{% node #vanityMint label="vanityMint" /%}
{% node #regEx label="- Regular Expression" /%}
{% node label="..." /%}
{% /node %}

{% node parent="regEx" x="270" y="-9"  %}
{% node #nftMint theme="blue" %}
Mint {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="regEx" to="nftMint" /%}


{% edge from="nftMint" to="mint-candy-guard" theme="indigo" dashed=true %}
Check that the mint Address

matches the Regular Expression
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

The Vanity Mint guard contains the following settings:

- **Regular Expression**: A Regex that the mint address has to match. E.g. if you want all mints to start with string `mplx` you could use this as `regex` Parameter.

{% dialect-switcher title="Set up a Candy Machine using the Asset Gate Guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    vanityMint: some({
      regex: "String",
    }),
  },
});
```

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [VanityMint](https://mpl-core-candy-machine.typedoc.metaplex.com/types/VanityMint.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Mint Settings

_The Vanity Mint guard does not require mint settings. It expects the mint address to match._

## Route Instruction

_The Vanity Mint guard does not support the route instruction._
