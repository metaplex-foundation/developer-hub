---
title: Inscription権限
metaTitle: Inscription権限 | Inscription
description: Inscription権限とは何か、どこに保存されているかを学びます
---

Metaplex Inscriptionは**複数の**更新権限を持つことができます。これは1つの更新権限とデリゲートのみを持つことができるMetaplex NFTとは異なります。

権限は各権限によって_追加_および_削除_することができます。更新権限が存在しなくなった時点で、Inscriptionは**不変**とみなされます。

## 権限の追加

追加の権限は、簡単な命令呼び出しで追加できます。現在の権限の1つがトランザクションに署名する必要があります。

{% dialect-switcher title="権限を追加" %}
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

## 権限の削除

権限を削除するための命令もあります。`removeAuthority`を使用すると、権限配列から自分自身を削除することができます。**注意してください**、すべての権限を削除すると、もう権限を追加することができません！

{% dialect-switcher title="自分自身を権限から削除" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
import {
  removeAuthority,
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
