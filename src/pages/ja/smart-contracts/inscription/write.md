---
title: Inscriptionデータの書き込み
metaTitle: Inscriptionデータの書き込み | Inscription
description: Inscriptionにデータを書き込む方法を学びます
---

inscriptionアカウントを[初期化](initialize)した後、データを書き込むことができます。これは関連するinscriptionの場合も同様です。

{% dialect-switcher title="Inscriptionデータの書き込み" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
import { writeData } from '@metaplex-foundation/mpl-inscription';

await writeData(umi, {
  inscriptionAccount: inscriptionAccount.publicKey,
  inscriptionMetadataAccount,
  authority,
  value: Buffer.from(
    '{"description": "A bread! But onchain!", "external_url": "https://breadheads.io"}'
  ),
  associatedTag: null,
  offset: 0,
})
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

大きなデータの場合は、まず必要なスペースを`allocate`し、そのトランザクションがファイナライズされるまで待ってから`writeData`することをお勧めします。以下の例は、関連Inscriptionアカウントにデータを割り当てます：

{% dialect-switcher title="スペースの割り当て" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
import { allocate } from '@metaplex-foundation/mpl-inscription';
const fs = require('fs');

// 画像ファイルを開いて、生バイトを取得します。
const imageBytes: Buffer = await fs.promises.readFile('test/large_bread.png')
const resizes = Math.floor(imageBytes.length / 10240) + 1
for (let i = 0; i < resizes; i += 1) {
  await allocate(umi, {
    inscriptionAccount: associatedInscriptionAccount,
    inscriptionMetadataAccount,
    associatedTag: 'image/png',
    targetSize: imageBytes.length,
  }).sendAndConfirm(umi)
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
