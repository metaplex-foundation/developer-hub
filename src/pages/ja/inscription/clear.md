---
title: Inscriptionデータのクリア
metaTitle: データのクリア | Inscription
description: Inscriptionデータのクリア方法を学びます
---

inscriptionの更新権限は、inscriptionが刻印されていない限り、**ClearData**命令を使用してそのデータと関連するinscriptionのデータをクリアできます。**ClearData**命令では、**権限**の1つがトランザクションに署名する必要があります。

データをクリアすると、すべての既存データが削除され、inscriptionアカウントのサイズが0にリサイズされます。

以下は、SDKを使用してinscriptionデータをクリアする方法です。

{% dialect-switcher title="Inscriptionデータのクリア" %}
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
  associatedTag: null, // 作成時に使用したのと同じタグをここで使用します
})
```

`associatedTag`は、関連するinscriptionアカウントを正しく導出するために使用されます。

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}