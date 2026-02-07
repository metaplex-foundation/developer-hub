---
title: Inscription 권한
metaTitle: Inscription 권한 | Inscription
description: Inscription 권한이 무엇인지와 어디에 저장되는지 알아보세요
---


Metaplex Inscription은 **여러** 업데이트 권한을 가질 수 있습니다. 이는 하나의 업데이트 권한과 대리자만 가질 수 있는 Metaplex NFT와 다릅니다.

권한은 각 권한에 의해 _추가_되고 _제거_될 수 있습니다. 더 이상 업데이트 권한이 존재하지 않으면 Inscription은 **불변**으로 간주됩니다.

## 권한 추가

추가 권한은 간단한 명령어 호출로 추가할 수 있습니다. 현재 권한 중 하나가 트랜잭션에 서명해야 합니다.

{% dialect-switcher title="권한 추가" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
import {
  addAuthority,
  findInscriptionMetadataPda,
} from '@metaplex-foundation/mpl-inscription'

const inscriptionMetadataAccount = await findInscriptionMetadataPda(umi, {
  inscriptionAccount: inscriptionAccount.publicKey,
})

await addAuthority(umi, {
  inscriptionMetadataAccount,
  newAuthority: authority.publicKey,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 권한 제거

권한을 제거하는 명령어도 있습니다. `removeAuthority`를 사용하면 권한 배열에서 자신을 제거할 수 있습니다. **주의하세요**, 모든 권한을 제거하면 더 이상 권한을 추가할 수 없습니다!

{% dialect-switcher title="권한에서 자신 제거" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
import {
  addAuthority,
  findInscriptionMetadataPda,
} from '@metaplex-foundation/mpl-inscription'

const inscriptionMetadataAccount = await findInscriptionMetadataPda(umi, {
  inscriptionAccount: inscriptionAccount.publicKey,
})

await removeAuthority(umi, {
  inscriptionMetadataAccount,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
