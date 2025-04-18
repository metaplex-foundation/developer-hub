---
title: Fetching a Core Candy Machine
metaTitle: Fetching a Core Candy Machine | Core Candy Machine
description: How to fetch the data of a Core Core Candy Machine from the Solana blockchain.
---

Fetching a Core Candy Machine and its data can be achieved as follows:

{% dialect-switcher title="Fetch a Core Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchCandyMachine, mplCandyMachine as mplCoreCandyMachine } from "@metaplex-foundation/mpl-core-candy-machine";
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

const mainnet = "https://mainnet-aura.metaplex.com/<YOUR_API_KEY>"
const devnet = "https://devnet-aura.metaplex.com/<YOUR_API_KEY>"

const umi = createUmi(mainnet)
.use(mplCoreCandyMachine())

const candyMachineId = "11111111111111111111111111111111"

const candyMachine = await fetchCandyMachine( umi, publicKey(candyMachineId));

console.log({ candyMachine });
```

{% /dialect %}
{% /dialect-switcher %}
