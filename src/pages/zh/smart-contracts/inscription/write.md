---
title: 写入Inscription数据
metaTitle: 写入Inscription数据 | Inscription
description: 学习如何向您的Inscription写入数据
---

[初始化](initialize)inscription账户后，可以向其写入数据。这对于关联inscriptions也是如此。确保您的初始化交易已完成（参见[发送交易](https://developers.metaplex.com/umi/transactions#sending-transactions)）。

{% dialect-switcher title="写入Inscription数据" %}
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


对于较大的数据，建议先`allocate`所需的空间，等待该交易完成，然后再`writeData`。以下示例在关联Inscription账户中分配数据：

{% dialect-switcher title="分配空间" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
import { allocate } from '@metaplex-foundation/mpl-inscription';
const fs = require('fs');

// 打开图像文件以获取原始字节。
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
