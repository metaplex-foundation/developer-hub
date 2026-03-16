---
title: "Program Gate Guard"
metaTitle: "Program Gate Guard - Restrict Transaction Programs | Core Candy Machine"
description: "The Core Candy Machine Program Gate guard restricts which programs can be included in a mint transaction, preventing bots from adding malicious instructions from arbitrary programs."
keywords:
  - Program Gate guard
  - Core Candy Machine
  - candy guard
  - transaction program allowlist
  - bot protection
  - mint security
  - Solana NFT
  - minting restriction
about:
  - Candy Machine guards
  - mint transaction program restrictions
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

The **Program Gate** guard restricts which programs can appear in a mint transaction, preventing bots from injecting malicious instructions from unauthorized programs. {% .lead %}

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

## Notes

- The `additional` list supports a maximum of 5 program addresses. Programs required for the standard Candy Machine mint flow are automatically allowed and do not need to be included.
- When this guard is enabled, any mint transaction that contains instructions from programs not in the allowlist will fail. This is an effective anti-bot measure but may block legitimate use cases if third-party programs are needed during the mint.
- This guard does not restrict CPI (cross-program invocation) calls made internally by allowed programs -- it only checks the top-level instructions in the transaction.

