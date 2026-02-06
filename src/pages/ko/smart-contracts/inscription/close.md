---
title: Inscription 닫기
metaTitle: 닫기 | Inscription
description: Inscription 계정을 닫는 방법을 알아보세요
---

inscription의 권한은 inscription 계정을 닫을 수 있습니다. 이는 inscription과 관련된 모든 가능한 계정을 닫고 다양한 임대료 면제 수수료를 소유자에게 반환합니다. `close`는 토큰의 `burn`과 유사하다고 생각하시면 됩니다.

inscription 계정을 닫으려면 **권한**이 있어야 합니다. 그 시점에서 inscription은 연관된 Inscription을 가져서는 안 됩니다.

다음은 SDK를 사용하여 inscription 계정을 닫는 방법입니다.

{% dialect-switcher title="Inscription 데이터 닫기" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { close, findInscriptionMetadataPda } from '@metaplex-foundation/mpl-inscription';

import { close, findInscriptionMetadataPda } from '@metaplex-foundation/mpl-inscription'

const inscriptionMetadataAccount = await findInscriptionMetadataPda(umi, {
  inscriptionAccount: inscriptionAccount.publicKey,
})

await close(umi, {
  inscriptionAccount: inscriptionAccount.publicKey,
  inscriptionMetadataAccount,
})
```

{% /totem %}
{% /dialect %}

{% /dialect-switcher %}
