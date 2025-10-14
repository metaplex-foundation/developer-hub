---

title: Inscription 데이터 가져오기
metaTitle: Inscription 가져오기 | Inscription
description: inscription의 다양한 온체인 계정을 가져오는 방법을 알아보세요
---


Inscription 계정이 [초기화](initialize)되면 해당 메타데이터를 체인에서 다시 읽을 수 있습니다. 데이터가 [작성](write)되면 읽을 수도 있습니다. inscription을 가져오려면 inscription 유형에 따라 다른 함수를 사용해야 합니다.

## inscription 메타데이터 가져오기

두 inscription 유형 모두 메타데이터 계정을 사용합니다. 이 계정에는 예를 들어 `inscriptionRank`, `associatedInscriptions`, `updateAuthorities` 및 [기타](https://mpl-inscription.typedoc.metaplex.com/types/InscriptionMetadata.html) 정보가 포함됩니다. 메타데이터는 다음과 같이 가져올 수 있습니다:

{% dialect-switcher title="Inscription 메타데이터 가져오기" %}
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

## 민트 inscription 가져오기

역직렬화된 민트 inscription을 가져오려면 다음과 같이 `safeFetchMintInscriptionFromSeeds`를 사용할 수 있습니다:

{% dialect-switcher title="민트 Inscription 가져오기" %}
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

## 데이터 inscription 가져오기

NFT에 첨부되지 않은 Inscription 데이터를 읽으려면 다른 함수를 사용합니다:

{% dialect-switcher title="Inscription 가져오기" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}
```js
import { fetchInscription } from '@metaplex-foundation/mpl-inscription'

const inscription = fetchInscription(umi, inscriptionAddress)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 현재 Inscription 수 가져오기
현재 총 inscription 수는 다음과 같이 가져올 수 있습니다:

{% dialect-switcher title="현재 Inscription 수 가져오기" %}
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

console.log(`현재 ${numInscriptions}개의 Metaplex Inscription이 있습니다`)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}