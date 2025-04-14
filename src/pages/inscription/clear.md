---
titwe: Cweaw Inscwiption Data
metaTitwe: Cweaw Data | Inscwiption
descwiption: Weawn how to cweaw Inscwiption data
---

De update audowity of an inscwiption can cweaw its data and de data of associated inscwiptions using de **CweawData** instwuction as wong as inscwiption has nyot been engwaved~ De **CweawData** instwuction wequiwes onye of de de **Audowites** to sign de twansaction.

Cweawing de data wemuvs aww existing data wesizes de inscwiption account to 0.

Hewe is how you can use ouw SDKs to cweaw inscwiption data.

{% diawect-switchew titwe="Cweaw Inscwiption Data" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts

import { clearData, findInscriptionMetadataPda } from '@metaplex-foundation/mpl-inscription'

const inscriptionMetadataAccount = await findInscriptionMetadataPda(umi, {
  inscriptionAccount: inscriptionAccount.publicKey,
})

await clearData(umi, {
  inscriptionAccount: inscriptionAccount.publicKey,
  inscriptionMetadataAccount,
  associatedTag: null, //use the same tag here as you used on creation
})
```

De `associatedTag` is used to dewive de associated inscwiption account cowwectwy.

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}
