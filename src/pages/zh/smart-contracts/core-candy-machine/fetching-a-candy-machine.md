---
title: 获取 Core Candy Machine
metaTitle: 获取 Core Candy Machine | Core Candy Machine
description: 如何从 Solana 区块链获取 Core Candy Machine 的数据。
---

获取 Core Candy Machine 及其数据可以按如下方式实现:

{% dialect-switcher title="获取 Core Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchCandyMachine, mplCandyMachine as mplCoreCandyMachine } from "@metaplex-foundation/mpl-core-candy-machine";
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

const mainnet = "https://api.mainnet-beta.solana.com"
const devnet = "https://api.devnet.solana.com"

const umi = createUmi(mainnet)
.use(mplCoreCandyMachine())

const candyMachineId = "11111111111111111111111111111111"

const candyMachine = await fetchCandyMachine( umi, publicKey(candyMachineId));

console.log({ candyMachine });
```

{% /dialect %}
{% /dialect-switcher %}
