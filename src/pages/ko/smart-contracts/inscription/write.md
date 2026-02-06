---
title: Inscription 데이터 작성
metaTitle: Inscription 데이터 작성 | Inscription
description: Inscription에 데이터를 작성하는 방법을 알아보세요
---

inscription 계정을 [초기화](initialize)한 후 데이터를 작성할 수 있습니다. 연관된 inscription의 경우에도 마찬가지입니다.

{% dialect-switcher title="Inscription 데이터 작성" %}
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

더 큰 데이터의 경우 먼저 필요한 공간을 `allocate`하고 해당 트랜잭션이 완료될 때까지 기다린 다음 `writeData`를 사용하는 것이 좋습니다. 다음 예제는 연관된 Inscription 계정에 데이터를 할당합니다:

{% dialect-switcher title="공간 할당" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
import { allocate } from '@metaplex-foundation/mpl-inscription';
const fs = require('fs');

// 이미지 파일을 열어 원본 바이트를 가져옵니다.
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
