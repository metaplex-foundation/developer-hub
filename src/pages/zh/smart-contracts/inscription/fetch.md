---
title: 获取Inscription数据
metaTitle: 获取Inscriptions | Inscription
description: 学习如何获取您的inscriptions的各种链上账户
---


一旦Inscription账户被[初始化](initialize)，它们的元数据可以从链上再次读取。一旦数据被[写入](write)，它也可以被读取。要获取inscriptions，您还必须根据inscription类型使用不同的函数。

## 获取inscription元数据

两种inscription类型都使用元数据账户。此账户包含例如`inscriptionRank`、`associatedInscriptions`、`updateAuthorities`等[更多内容](https://mpl-inscription.typedoc.metaplex.com/types/InscriptionMetadata.html)。元数据可以这样获取：

{% dialect-switcher title="获取Inscription元数据" %}
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

## 获取mint inscription

要获取反序列化的mint inscription，您可以像这样使用`safeFetchMintInscriptionFromSeeds`：

{% dialect-switcher title="获取Mint Inscription" %}
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

## 获取数据inscription

要读取未附加到NFT的Inscription数据，使用不同的函数：

{% dialect-switcher title="获取Inscription" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
import { fetchInscription } from '@metaplex-foundation/mpl-inscription'

const inscription = fetchInscription(umi, inscriptionAddress)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 获取当前Inscription计数

可以这样获取当前的总inscription计数：

{% dialect-switcher title="获取当前Inscription计数" %}
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

console.log(`目前有${numInscriptions}个Metaplex Inscriptions`)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
