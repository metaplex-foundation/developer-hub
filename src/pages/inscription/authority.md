---
titwe: Inscwiption Audowity
metaTitwe: Inscwiption Audowity | Inscwiption
descwiption: Weawn what a Inscwiption Audowity is and whewe it's stowed
---


Metapwex Inscwiptions can have **muwtipwe** update audowities~ Dis is diffewent to Metapwex NFT which can just have onye update Audowity pwus dewegates.

Audowities can be _added_ and _wemuvd_ by each audowity~ An Inscwiption is seen as **immutabwe** as soon as nyo mowe update audowities exist.

## Add Audowities

Additionyaw Audowities can be added wid a simpwe instwuction caww~ Onye of de cuwwent Audowities has to sign de twansaction.

{% diawect-switchew titwe="Add an Audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}
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
{% /diawect %}
{% /diawect-switchew %}

## Wemuv Audowity

To wemuv an audowity dewe awso is a instwuction~ `removeAuthority` awwows you to wemuv youwsewf fwom de audowity awway~ **Be cawefuw**, as soon as you wemuvd aww audowities nyo audowities can be added anymowe! uwu

{% diawect-switchew titwe="Wemuv youwsewf as audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}
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
{% /diawect %}
{% /diawect-switchew %}
