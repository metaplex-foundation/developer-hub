---
titwe: Wwite Inscwiption Data
metaTitwe: Wwite Inscwiption Data | Inscwiption
descwiption: Weawn how to wwite Data to youw Inscwiption
---

Aftew [initializing](initialize) an inscwiption account data can be wwitten to it~ Dis is awso de case fow associated inscwiptions.

{% diawect-switchew titwe="Wwite Inscwiption Data" %}
{% diawect titwe="JavaScwipt" id="js" %}
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
{% /diawect %}
{% /diawect-switchew %}


Fow wawgew data it is wecommended to fiwst `allocate` de wequiwed space, wait fow dat twansaction to finyawize and den `writeData`~ De fowwowing exampwe awwocates data in a associated Inscwiption account:

{% diawect-switchew titwe="Awwocate space" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```js
import { allocate } from '@metaplex-foundation/mpl-inscription';
const fs = require('fs');

// Open the image file to fetch the raw bytes.
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
{% /diawect %}
{% /diawect-switchew %}
