---
title: Inscription 초기화
metaTitle: Inscription 초기화 | Inscription
description: Metaplex Inscription을 생성하는 방법을 알아보세요
---

`initialize` 명령어는 데이터가 저장될 inscription 계정을 생성합니다. 세 가지 유형의 초기화가 있습니다:

1. `initializeFromMint` - NFT에 첨부된 Inscription용 - **아마도 이것을 원할 것입니다**
2. `initialize` - 저장소 제공자로서의 Inscription용
3. `initializeAssociatedInscription` - 추가 데이터 계정

초기화가 완료된 후 inscription에 [데이터를 작성](write)할 수 있습니다.

초기화할 때 번호 매기기에 사용되는 `shard`를 선택할 수 있습니다. 잠금을 최소화하기 위해 임의의 것을 사용해야 합니다. [여기에서 Sharding에 대해 더 읽어보세요](sharding)

## `initializeFromMint`

{% callout type="note" %}

이러한 inscription은 NFT와 유사하게 거래 가능합니다. 확신이 서지 않는다면 아마도 이것을 사용하고 싶을 것입니다.

{% /callout %}

거래 가능한 inscription을 원한다면 이런 종류의 inscription을 사용하고 싶을 것입니다. 이는 NFT에서 파생됩니다. 이 함수를 사용할 때는 NFT의 업데이트 권한이 있어야 합니다.

다음과 같이 할 수 있습니다:

{% dialect-switcher title="민트 Inscription 초기화" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
import {
  findInscriptionShardPda,
  initializeFromMint,
} from '@metaplex-foundation/mpl-inscription'

const inscriptionShardAccount = await findInscriptionShardPda(umi, {
  shardNumber: 0, //0과 31 사이의 임의 숫자
})
await initializeFromMint(umi, {
  mintAccount: mint.publicKey,
  inscriptionShardAccount,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## `Initialize`

{% callout type="warning" %}

이런 종류의 inscription은 **거래할 수 없습니다**. 게임과 같은 고급 사용 사례에만 권장합니다.

{% /callout %}

데이터가 작성되기 전에 Inscription을 초기화해야 합니다. 다음과 같이 할 수 있습니다:

{% dialect-switcher title="Inscription 초기화" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
import {
  findInscriptionMetadataPda,
  findInscriptionShardPda,
  initialize,
} from '@metaplex-foundation/mpl-inscription'

const inscriptionAccount = generateSigner(umi)

const inscriptionMetadataAccount = await findInscriptionMetadataPda(umi, {
  inscriptionAccount: inscriptionAccount.publicKey,
})
const inscriptionShardAccount = await findInscriptionShardPda(umi, {
  shardNumber: 0, //0과 31 사이의 임의 숫자
})

await initialize(umi, {
  inscriptionAccount,
  inscriptionShardAccount,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## `initializeAssociatedInscription`

하나의 Inscription 계정은 여러 연관된 Inscription 계정을 가질 수 있습니다. 이들은 `associationTag`를 기반으로 파생됩니다. 예를 들어 태그는 파일의 데이터 타입일 수 있습니다. 예: `image/png`.

연관된 inscription에 대한 포인터는 `inscriptionMetadata` 계정의 `associatedInscriptions` 필드에 있는 배열에 저장됩니다.

새로운 연관된 Inscription을 초기화하려면 다음 함수를 사용할 수 있습니다:

{% dialect-switcher title="연관된 Inscription 초기화" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
import {
  findInscriptionMetadataPda,
  initializeAssociatedInscription,
} from '@metaplex-foundation/mpl-inscription'

const inscriptionMetadataAccount = await findInscriptionMetadataPda(umi, {
  inscriptionAccount: inscriptionAccount.publicKey,
})

await initializeAssociatedInscription(umi, {
  inscriptionMetadataAccount,
  associationTag: 'image/png',
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
