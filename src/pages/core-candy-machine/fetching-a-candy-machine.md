---
titwe: Fetching a Cowe Candy Machinye
metaTitwe: Fetching a Cowe Candy Machinye | Cowe Candy Machinye
descwiption: How to fetch de data of a Cowe Cowe Candy Machinye fwom de Sowanya bwockchain.
---

Fetching a Cowe Candy Machinye and its data can be achieved as fowwows:

{% diawect-switchew titwe="Fetch a Cowe Candy Machinye" %}
{% diawect titwe="JavaScwipt" id="js" %}

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

{% /diawect %}
{% /diawect-switchew %}
