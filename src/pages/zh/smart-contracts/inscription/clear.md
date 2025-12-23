---
title: 清除Inscription数据
metaTitle: 清除数据 | Inscription
description: 学习如何清除Inscription数据
---

只要inscription尚未被镌刻，inscription的更新权限可以使用**ClearData**指令清除其数据及关联inscriptions的数据。**ClearData**指令需要其中一个**权限**来签署交易。

清除数据会删除所有现有数据并将inscription账户大小调整为0。

以下是如何使用我们的SDK清除inscription数据。

{% dialect-switcher title="清除Inscription数据" %}
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
  associatedTag: null, //在这里使用与创建时相同的标签
})
```

`associatedTag`用于正确派生关联inscription账户。

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
