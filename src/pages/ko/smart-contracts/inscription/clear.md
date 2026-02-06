---
title: Inscription 데이터 지우기
metaTitle: 데이터 지우기 | Inscription
description: Inscription 데이터를 지우는 방법을 알아보세요
---

inscription의 업데이트 권한은 inscription이 각인되지 않은 상태라면 **ClearData** 명령어를 사용하여 해당 데이터와 연관된 inscription의 데이터를 지울 수 있습니다. **ClearData** 명령어는 **권한** 중 하나가 트랜잭션에 서명해야 합니다.

데이터를 지우면 모든 기존 데이터가 제거되고 inscription 계정의 크기가 0으로 조정됩니다.

다음은 SDK를 사용하여 inscription 데이터를 지우는 방법입니다.

{% dialect-switcher title="Inscription 데이터 지우기" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts

import { clearData, findInscriptionMetadataPda } from '@metaplex-foundation/mpl-inscription'

const inscriptionMetadataAccount = await findInscriptionMetadataPda(umi, {
  inscriptionAccount: inscriptionAccount.publicKey,
})

await clearData(umi, {
  inscriptionAccount: inscriptionAccount.publicKey,
  inscriptionMetadataAccount,
  associatedTag: null, //생성 시 사용한 것과 동일한 태그를 여기에 사용하세요
})
```

`associatedTag`는 연관된 inscription 계정을 올바르게 파생하는 데 사용됩니다.

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
