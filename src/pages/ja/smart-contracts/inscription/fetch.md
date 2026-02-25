---
title: Inscriptionデータの取得
metaTitle: Inscriptionの取得 | Inscription
description: inscriptionのさまざまなオンチェーンアカウントの取得方法を学びます
---

Inscriptionアカウントが[初期化](initialize)されると、そのメタデータを再びチェーンから読み取ることができます。データが[書き込まれる](write)と、それも読み取ることができます。inscriptionを取得するには、inscriptionタイプに応じて異なる関数を使用する必要があります。

## inscriptionメタデータの取得

両方のinscriptionタイプはメタデータアカウントを使用します。このアカウントには、例えば`inscriptionRank`、`associatedInscriptions`、`updateAuthorities`と[詳細](https://mpl-inscription.typedoc.metaplex.com/types/InscriptionMetadata.html)が含まれています。メタデータは以下のように取得できます：

{% dialect-switcher title="Inscriptionメタデータの取得" %}
{% dialect title="JavaScript" id="js" %}
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
{% /dialect %}
{% /dialect-switcher %}

## ミントinscriptionの取得

逆シリアル化されたミントinscriptionを取得するには、`safeFetchMintInscriptionFromSeeds`を以下のように使用できます：

{% dialect-switcher title="ミントInscriptionの取得" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
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
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## データinscriptionの取得

NFTに添付されていないInscriptionデータを読み取るには、異なる関数が使用されます：

{% dialect-switcher title="Inscriptionの取得" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}
```js
import { fetchInscription } from '@metaplex-foundation/mpl-inscription'

const inscription = fetchInscription(umi, inscriptionAddress)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 現在のInscription数の取得
現在の総inscription数は以下のように取得できます：

{% dialect-switcher title="現在のInscription数の取得" %}
{% dialect title="JavaScript" id="js" %}
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

console.log(`現在${numInscriptions}のMetaplex Inscriptionが存在します`)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
