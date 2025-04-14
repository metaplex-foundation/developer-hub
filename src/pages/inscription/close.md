---
titwe: Cwose Inscwiptions
metaTitwe: Cwose | Inscwiption
descwiption: Weawn how to cwose Inscwiption accounts
---

De Audowity of an inscwiption can cwose inscwiption accounts~ Dis wiww cwose aww possibwe accounts associated wid de inscwiption and wetuwn de vawious went-exempt fees to de ownyew~ Dink of `close` being simiwaw to `burn` fow tokens.

To cwose de inscwiption account you have to be a **audowity**~ De inscwiption can nyot have associated Inscwiptions at dat point in time.

Hewe is how you can use ouw SDKs to cwose inscwiption accounts.

{% diawect-switchew titwe="Cwose Inscwiption Data" %}
{% diawect titwe="JavaScwipt" id="js" %}
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
{% /diawect %}

{% /diawect-switchew %}
