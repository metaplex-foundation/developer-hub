---
title: 关闭Inscriptions
metaTitle: 关闭 | Inscription
description: 学习如何关闭Inscription账户
---

inscription的权限可以关闭inscription账户。这将关闭与inscription关联的所有可能账户，并将各种租金豁免费用返还给所有者。可以将`close`视为类似于代币的`burn`。

要关闭inscription账户，您必须是**权限**持有者。此时inscription不能有关联的Inscriptions。

以下是如何使用我们的SDK关闭inscription账户。

{% dialect-switcher title="关闭Inscription数据" %}
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
