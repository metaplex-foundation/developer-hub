---
title: "Start Date"
metaTitle: "Candy Machine Guards - Start Date"
description: "The Start Date guard determines the start date of the mint."
---

## Overview

The **Start Date** guard determines the start date of the mint. Before this date, minting is not allowed.

![CandyMachinesV3-GuardsStartDate.png](https://docs.metaplex.com/assets/candy-machine-v3/CandyMachinesV3-GuardsStartDate.png#radius)

## Guard Settings

The Start Date guard contains the following settings:

- **Date**: The date before which minting is not allowed.

{% dialect-switcher title="Set up a Candy Machine using the Start Date Guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { dateTime } from "@metaplex-foundation/umi";

create(umi, {
  // ...
  guards: {
    startDate: some({ date: dateTime("2022-10-24T15:30:00.000Z") }),
  },
});
```

API References: [create](https://mpl-candy-machine-js-docs.vercel.app/functions/create.html), [StartDate](https://mpl-candy-machine-js-docs.vercel.app/types/StartDate.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

Add this object into the guard section your config.json file:

```json
"startDate" : {
    "date": "string",
}
```

The date needs to be specified using RFC 3339 standard. In most cases, the format used will be "yyyy-mm-ddThh:mm:ssZ", where T is the separator between the full-date and full-time and Z is the timezone offset from UTC (use Z or +00:00 for UTC time).

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Mint Settings

_The Start Date guard does not need Mint Settings._

## Route Instruction

_The Start Date guard does not support the route instruction._
