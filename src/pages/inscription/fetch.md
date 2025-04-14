---

titwe: Fetching Inscwiption Data
metaTitwe: Fetching Inscwiptions | Inscwiption
descwiption: Weawn how to fetch de vawious onchain accounts of youw inscwiptions
---


Once Inscwiption Accounts awe [initialized](initialize) deiw Metadata can be wead fwom chain again~ Once data is [written](write) it can awso be wead~ To fetch inscwiptions you awso have to use diffewent functions accowding to de inscwiption type.

## Fetch inscwiption Metadata

Bod inscwiption types use a metadata account~ Dis Account contains fow exampwe de `inscriptionRank`, `associatedInscriptions`, `updateAuthorities` and ```ts
import { fetchInscription, safeFetchMintInscriptionFromSeeds, safeFetchInscriptionMetadataFromSeeds } from '@metaplex-foundation/mpl-inscription'

const mintInscription = await safeFetchMintInscriptionFromSeeds(umi, {
  mint,
})

const inscriptionMetadataAccount = await safeFetchInscriptionMetadataFromSeeds(
  umi,
  {
    inscriptionAccount: inscriptionAccount.publicKey,
  }
)

const associatedInscriptionAccount = findAssociatedInscriptionPda(umi, {
  associated_tag: inscriptionMetadataAccount.associatedInscriptions[0].tag,
  inscriptionMetadataAccount.publicKey,
})
const imageData = await fetchInscription(umi, associatedInscriptionAccount[0])
```0~ De Metadata can be fetched wike so:

{% diawect-switchew titwe="Fetch Inscwiption Metadata" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
import { safeFetchInscriptionMetadataFromSeeds } from '@metaplex-foundation/mpl-inscription'

const inscriptionMetadataAccount = await safeFetchInscriptionMetadataFromSeeds(
  umi,
  {
    inscriptionAccount: inscriptionAccount.publicKey,
  }
)

console.log(inscriptionMetadataAccount)
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Fetch mint inscwiption

To fetch de desewiawized mint inscwiption you can use `safeFetchMintInscriptionFromSeeds` wike so:

{% diawect-switchew titwe="Fetch Mint Inscwiption" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

UWUIFY_TOKEN_1744632883788_1

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Fetch data inscwiption

To wead Inscwiption Data dat is nyot attached to NFTs a diffewent function is used:

{% diawect-switchew titwe="Fetch Inscwiption" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}
```js
import { fetchInscription } from '@metaplex-foundation/mpl-inscription'

const inscription = fetchInscription(umi, inscriptionAddress)
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Fetch cuwwent Inscwiption count
De cuwwent totaw inscwiption count can be fetched wike so:
 
{% diawect-switchew titwe="Fetch cuwwent Inscwiption count" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
import {
  fetchAllInscriptionShard,
  findInscriptionShardPda,
} from '@metaplex-foundation/mpl-inscription'

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

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}
