---
title: Inscription权限
metaTitle: Inscription权限 | Inscription
description: 了解什么是Inscription权限以及它存储在哪里
---


Metaplex Inscriptions可以有**多个**更新权限。这与只能有一个更新权限加委托人的Metaplex NFT不同。

权限可以被每个权限_添加_和_移除_。一旦不再存在更新权限，Inscription就被视为**不可变的**。

## 添加权限

可以通过简单的指令调用添加额外的权限。当前权限之一必须签署交易。

{% dialect-switcher title="添加权限" %}
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

## 移除权限

要移除权限也有一个指令。`removeAuthority`允许您将自己从权限数组中移除。**请谨慎**，一旦您移除了所有权限，就不能再添加权限了！

{% dialect-switcher title="将自己作为权限移除" %}
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
