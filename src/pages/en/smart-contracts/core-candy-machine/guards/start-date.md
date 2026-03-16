---
title: "Start Date Guard"
metaTitle: "Start Date Guard - Core Candy Machine Guard | Metaplex"
description: "The Start Date guard sets the earliest date and time when minting is allowed on a Core Candy Machine, blocking all mint attempts before the configured timestamp."
keywords:
  - start date
  - Core Candy Machine
  - candy guard
  - mint schedule
  - launch date
  - time-based minting
  - Solana NFT
  - minting restriction
about:
  - Candy Machine guards
  - time-based mint control
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

The **Start Date** guard sets the earliest date and time when minting is allowed on a Core Candy Machine, blocking all mint attempts before the configured timestamp. {% .lead %}

## Overview

The **Start Date** guard determines the start date of the mint. Before this date, minting is not allowed.

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Core Candy Guard" theme="blue" /%}
{% node label="Owner: Core Candy Guard Program" theme="dimmed" /%}
{% node #candy-guard-guards label="Guards" theme="mint"/%}
{% node #startDate label="startDate" /%}
{% node #date label="- Date" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" #mint-candy-guard x="500" %}
  {% node theme="pink" %}
    Mint from

    _Core Candy Guard Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-8" %}
  {% node theme="pink" %}
    Mint from

    _Core Candy Machine Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="150" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="120" x="93" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}
{% edge from="date" to="mint-candy-guard" arrow="none" dashed=true %}
Before that date

minting will fail
{% /edge %}

{% edge from="candy-guard-guards" to="guards" /%}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## Guard Settings

The Start Date guard contains the following settings:

- **Date**: The date before which minting is not allowed.

{% dialect-switcher title="Set up a Core Candy Machine using the Start Date Guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { dateTime } from "@metaplex-foundation/umi";

create(umi, {
  // ...
  guards: {
    startDate: some({ date: dateTime("2022-01-24T15:30:00.000Z") }),
  },
});
```

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [StartDate](https://mpl-core-candy-machine.typedoc.metaplex.com/types/StartDate.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Mint Settings

_The Start Date guard does not need Mint Settings._

## Route Instruction

_The Start Date guard does not support the route instruction._

## Notes

- The Start Date guard uses UTC timestamps. Ensure date values passed via `dateTime()` are in ISO 8601 format with explicit timezone information.
- To define both a start and end window for minting, combine the Start Date guard with the [End Date](/smart-contracts/core-candy-machine/guards/end-date) guard.
- The date comparison uses the on-chain Solana cluster clock, which may have slight drift from wall-clock time.

