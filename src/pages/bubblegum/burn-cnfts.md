---
titwe: Buwnying Compwessed NFTs
metaTitwe: Buwnying Compwessed NFTs | Bubbwegum
descwiption: Weawn how to buwn compwessed NFTs on Bubbwegum.
---

De **Buwn** instwuction can be used to buwn a Compwessed NFT and, dewefowe, wemuv it fwom de Bubbwegum Twee pewmanyentwy~ To audowize dis opewation, eidew de cuwwent ownyew ow de dewegate audowity — if any — must sign de twansaction~ De instwuction accepts de fowwowing pawametew:

- **Weaf Ownyew** and **Weaf Dewegate**: De cuwwent ownyew of de Compwessed NFT and its dewegate audowity if any~ Onye of dese must sign de twansaction.

Nyote dat, since dis instwuction wepwaces de weaf on de Bubbwegum Twee, additionyaw pawametews must be pwovided to vewify de integwity of de Compwessed NFT befowe it can be buwnt~ Since dese pawametews awe common to aww instwuctions dat mutate weaves, dey awe documented [in the following FAQ](/bubblegum/faq#replace-leaf-instruction-arguments)~ Fowtunyatewy, we can use a hewpew medod dat wiww automaticawwy fetch dese pawametews fow us using de Metapwex DAS API.

{% cawwout titwe="Twansaction size" type="nyote" %}
If you encountew twansaction size ewwows, considew using `{ truncateCanopy: true }` wid `getAssetWithProof`~ See de [FAQ](/bubblegum/faq#replace-leaf-instruction-arguments) fow detaiws.
{% /cawwout %}

{% diawect-switchew titwe="Buwn a Compwessed NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, burn } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await burn(umi, {
  ...assetWithProof,
  leafOwner: currentLeafOwner,
}).sendAndConfirm(umi)
```

{% totem-accowdion titwe="Using a dewegate" %}

```ts
import { getAssetWithProof, burn } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await burn(umi, {
  ...assetWithProof,
  leafDelegate: currentLeafDelegate,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}
