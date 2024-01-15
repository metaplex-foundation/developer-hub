---
title: Fetching Inscription Data
metaTitle: Inscriptions - Fetching Inscriptions
description: Learn how to fetch the various on-chain accounts of your inscriptions
---

Once Inscription Accounts are [initialized](initialize) their Metadata can be read from chain again. Once data is [written](write) it can also be read. To fetch inscriptions you also have to use different functions according to the inscription type.

## Fetch mint inscription

## Fetch data inscription

To get the metadata of your inscription like your `inscriptionRank` we would use:

## Fetch current Inscription count

```ts
import { fetchAllInscriptionShard, findInscriptionShardPda } from '@metaplex-foundation/mpl-inscription';
const umi = await createUmi()
umi.use(mplInscription())

const shardKeys: Pda[]
for (let shardNumber = 0; shardNumber < 32; shardNumber += 1) {
  shardKeys.push(findInscriptionShardPda(umi, { shardNumber }))
}

const shards = await fetchAllInscriptionShard(umi, shardKeys)
let numInscriptions = 0
shards.forEach((shard) => {
  const rank = 32 * Number(shard.count) + shard.shardNumber
  numInscriptions = Math.max(numInscriptions, rank)
})

console.log(`Currently there are ${numInscriptions} Metaplex Inscriptions`)
```
