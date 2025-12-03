---
title: Core Candy Machine 가져오기
metaTitle: Core Candy Machine 가져오기 | Core Candy Machine
description: Solana 블록체인에서 Core Candy Machine의 데이터를 가져오는 방법입니다.
---

Core Candy Machine과 해당 데이터를 가져오는 것은 다음과 같이 달성할 수 있습니다:

{% dialect-switcher title="Core Candy Machine 가져오기" %}
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