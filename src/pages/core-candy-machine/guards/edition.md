---
title: "Edition"
metaTitle: "Candy Machine Guards - Edition"
description: "Allows minting Editions from candy machine."
---

## Overview

The **Edition** guard is a special kind of guard. It is not used to charge the buyer, or verify conditions that they are allowed to mint. Instead the Edition guard determines which edition number a created Asset should have. 

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Core Candy Guard" theme="blue" /%}
{% node label="Owner: Core Candy Guard Program" theme="dimmed" /%}
{% node #candy-guard-guards label="Guards" theme="mint"/%}
{% node #edition label="edition" /%}
{% node #editionStartOffset label="- editionStartOffset" /%}
{% node label="..." /%}
{% /node %}

{% node parent="editionStartOffset" x="270" y="-9"  %}
{% node #editionCounterPda %}
Edition Counter PDA {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="editionStartOffset" to="editionCounterPda" path="straight" /%}

{% node parent="candy-machine" #mint-candy-guard x="600" %}
  {% node theme="pink" %}
    Mint from

    _Core Candy Guard_
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="60" theme="transparent" %}
  Edition Number Control
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-8" %}
  {% node theme="pink" %}
    Mint from 
    
    _Core Candy Machine_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="110" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="120" x="65" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}
{% edge from="editionCounterPda" to="mint-candy-guard" arrow="none" dashed=true %}
Determine the 

edition number
{% /edge %}

{% edge from="candy-guard-guards" to="guards" /%}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## Guard Settings

The Edition guard contains the following settings:

- **editionStartOffset**: The number where the edition number starts counting up.

{% dialect-switcher title="Set up a Candy Machine using the Edition guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts

create(umi, {
  // ...
  guards: {
    edition: { editionStartOffset: 0 },
  },
});
```

API References: [create](https://mpl-core-candy-machine-js-docs.vercel.app/functions/create.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Mint Settings

_The Edition guard does not need Mint Settings._

## Route Instruction

_The Edition guard does not require a route instruction._
