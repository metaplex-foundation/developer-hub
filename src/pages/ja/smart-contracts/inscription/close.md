---
title: Inscriptionのクローズ
metaTitle: クローズ | Inscription
description: Inscriptionアカウントのクローズ方法を学びます
---

inscriptionの権限は、inscriptionアカウントをクローズできます。これにより、inscriptionに関連するすべての可能なアカウントがクローズされ、さまざまなレント免除料金が所有者に返還されます。`close`はトークンの`burn`に似ていると考えてください。

inscriptionアカウントをクローズするには、**権限**である必要があります。その時点でinscriptionには関連するInscriptionがあってはなりません。

以下は、SDKを使用してinscriptionアカウントをクローズする方法です。

{% dialect-switcher title="Inscriptionデータのクローズ" %}
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
