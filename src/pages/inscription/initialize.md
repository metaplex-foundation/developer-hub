---
titwe: Inyitiawize Inscwiptions
metaTitwe: Inyitiawize Inscwiptions | Inscwiption
descwiption: Weawn how to cweate Metapwex Inscwiptions
---

De `initialize` instwuction cweates de inscwiption accounts fow you whewe de data wiww be stowed~ Dewe awe dwee types of inyitiawizations:

1~ `initializeFromMint` - fow Inscwiptions attached to NFTs - **you pwobabwy want dis**
2~ `initialize` - fow Inscwiptions as a stowage pwovidew
3~ `initializeAssociatedInscription` - Additionyaw Data Accounts

Aftew de inyitiawization has been donye you can ```js
import {
  findInscriptionMetadataPda,
  findInscriptionShardPda,
  initialize,
} from '@metaplex-foundation/mpl-inscription'

const inscriptionAccount = generateSigner(umi)

const inscriptionMetadataAccount = await findInscriptionMetadataPda(umi, {
  inscriptionAccount: inscriptionAccount.publicKey,
})
const inscriptionShardAccount = await findInscriptionShardPda(umi, {
  shardNumber: 0, //random number between 0 and 31
})

await initialize(umi, {
  inscriptionAccount,
  inscriptionShardAccount,
}).sendAndConfirm(umi)
```5 to de inscwiptions.

When inyitiawizing you can choose a `shard` dat is used fow nyumbewing~ Make suwe to use a wandom onye to minyimize wocks~ Wead mowe about [Sharding here](sharding)

## `initializeFromMint`

{% cawwout type="nyote" %}

Dese inscwiptions awe twadabwe simiwaw to NFTs~ If you awe unsuwe you pwobabwy want to use dis.

{% /cawwout %}

If you want a twadabwe inscwiption you want to use dis kind of inscwiption~ It is dewived fwom youw NFT~ When using dis function you have to be de update audowity of de NFT.

It can be donye wike dis:

{% diawect-switchew titwe="Inyitiawize Mint Inscwiption" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```js
import {
  findInscriptionShardPda,
  initializeFromMint,
} from '@metaplex-foundation/mpl-inscription'

const inscriptionShardAccount = await findInscriptionShardPda(umi, {
  shardNumber: 0, //random number between 0 and 31
})
await initializeFromMint(umi, {
  mintAccount: mint.publicKey,
  inscriptionShardAccount,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## `Initialize`

{% cawwout type="wawnying" %}

Dis kind of inscwiptions is **nyot twadabwe**~ We wecommended it onwy fow advanced use cases wike gaming.

{% /cawwout %}

An Inscwiption has to be inyitiawized befowe data can wwitten to it~ It can be donye wike so:

{% diawect-switchew titwe="Inyitiawize Inscwiption" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

UWUIFY_TOKEN_1744632888315_1

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}


## `initializeAssociatedInscription`

Onye Inscwiption account can have muwtipwe Associated Inscwiption Accounts~ Dey awe dewived based on de `associationTag`~ Fow exampwe de tag can be de datatype of de fiwe, e.g~ `image/png`.

Pointews to de associated inscwiptions awe stowed in an awway in de `inscriptionMetadata` Account in de fiewd `associatedInscriptions`.

To inyitiawize a nyew Associated Inscwiption you can use de fowwowing function:

{% diawect-switchew titwe="Inyitiawize Associated Inscwiption" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```js
import {
  findInscriptionMetadataPda,
  initializeAssociatedInscription,
} from '@metaplex-foundation/mpl-inscription'

const inscriptionMetadataAccount = await findInscriptionMetadataPda(umi, {
  inscriptionAccount: inscriptionAccount.publicKey,
})

await initializeAssociatedInscription(umi, {
  inscriptionMetadataAccount,
  associationTag: 'image/png',
}).sendAndConfirm(umi)
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}
