---
title: "Core Candy Machine - Program Gate Guard"
metaTitle: "Core Candy Machine - Program Gate Guard"
description: "The Core Candy Machine 'Program Gate' guard restricts the programs that can be used during the mint transaction."
---

## Overview

The **Program Gate** guard restricts the programs that can be in a mint transaction. This is useful to prevent bots adding malicious instructions from arbitrary programs in the same transaction as the mint.

The guard allows the necessary programs for the mint and any other program specified in the configuration.

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="21" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node #addressGate label="ProgramGate" /%}
{% node #additional label="- additional" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" #mint-candy-guard x="595" %}
  {% node theme="pink" %}
    Mint from

    _Core Candy Guard Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-10" %}
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
{% edge from="additional" to="mint-candy-guard" arrow="none" dashed=true %}
if the mint transaction contains instructions 

from additional programs

Minting will fail
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## Guard Settings

The Program Gate guard contains the following settings:

- **Additional**: List of additional programs addresses (up to 5 addresses) that are allowed to include instructions on the mint transaction.

{% dialect-switcher title="Set up a Core Candy Machine using the Program Gate guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    programGate: some({ additional: [<PUBKEY 1>, <PUBKEY 2>, ..., <PUBKEY 5>] }),
  },
});
```

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [ProgramGate](https://mpl-core-candy-machine.typedoc.metaplex.com/types/ProgramGate.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Mint Settings

_The Program Gate guard does not need Mint Settings._

## Route Instruction

_The Program Gate guard does not support the route instruction._
