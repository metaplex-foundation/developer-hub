---
title: "End Date Guard"
metaTitle: "End Date Guard - Stop Minting After a Deadline | Core Candy Machine"
description: "The End Date guard sets a deadline after which minting from a Core Candy Machine is no longer allowed. Configure an end timestamp to automatically close your mint."
keywords:
  - end date
  - Core Candy Machine
  - candy guard
  - mint deadline
  - minting end time
  - time-based guard
  - Solana NFT
  - minting restriction
about:
  - Candy Machine guards
  - time-based minting controls
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

The **End Date** guard sets a deadline after which minting from a Core Candy Machine is no longer allowed. {% .lead %}

## Overview

The **End Date** guard specifies a date to end the mint. After this date, minting is no longer allowed.

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node label="Owner: Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node #candy-guard-guards label="Guards" theme="mint"/%}
{% node #endDate label="endDate" /%}
{% node #date label="- Date" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" #mint-candy-guard x="500" %}
  {% node theme="pink" %}
    Mint from

    _Candy Guard Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-8" %}
  {% node theme="pink" %}
    Mint from

    _Candy Machine Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="110" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="120" x="73" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}
{% edge from="date" to="mint-candy-guard" arrow="none" dashed=true %}
After that date

minting will fail
{% /edge %}

{% edge from="candy-guard-guards" to="guards" /%}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## Guard Settings

The End Date guard contains the following settings:

- **Date**: The date after which minting is no longer allowed.

{% dialect-switcher title="Set up a Candy Machine using the End Date guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { dateTime } from "@metaplex-foundation/umi";

create(umi, {
  // ...
  guards: {
    endDate: some({ date: dateTime("2022-01-24T15:30:00.000Z") }),
  },
});
```

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [EndDate](https://mpl-core-candy-machine.typedoc.metaplex.com/types/EndDate.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

Add this object into the guard section your config.json file:

```json
"endDate" : {
    "date": "string",
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Mint Settings

_The End Date guard does not need Mint Settings._

## Route Instruction

_The End Date guard does not support the route instruction._

## Notes

- The End Date guard only prevents new mints after the configured timestamp. It does not affect Assets that were already minted.
- To restrict minting to a specific window, combine the End Date guard with the [Start Date](/smart-contracts/core-candy-machine/guards/start-date) guard.
- The date value must be a valid UTC timestamp string passed through the `dateTime` helper from Umi.

