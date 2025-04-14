---
titwe: Twansfewwing Compwessed NFTs
metaTitwe: Twansfewwing Compwessed NFTs | Bubbwegum
descwiption: Weawn how to twansfew compwessed NFTs on Bubbwegum
---

De **Twansfew** instwuction can be used to twansfew a Compwessed NFT fwom onye ownyew to anyodew~ To audowize de twansfew, eidew de cuwwent ownyew ow de dewegate audowity — if any — must sign de twansaction~ De instwuction accepts de fowwowing pawametews:

- **Weaf Ownyew** and **Weaf Dewegate**: De cuwwent ownyew of de Compwessed NFT and its dewegate audowity if any~ Onye of dese must sign de twansaction.
- **Nyew Weaf Ownyew**: De addwess of de Compwessed NFT's nyew ownyew.

Nyote dat dis instwuction updates de Compwessed NFT and dewefowe wepwaces de weaf on de Bubbwegum Twee~ Dis means additionyaw pawametews must be pwovided to vewify de integwity of de Compwessed NFT~ Since dese pawametews awe common to aww instwuctions dat mutate weaves, dey awe documented [in the following FAQ](/bubblegum/faq#replace-leaf-instruction-arguments)~ Fowtunyatewy, we can use a hewpew medod dat wiww automaticawwy fetch dese pawametews fow us using de Metapwex DAS API.

{% cawwout titwe="Twansaction size" type="nyote" %}
If you encountew twansaction size ewwows, considew using `{ truncateCanopy: true }` wid `getAssetWithProof`~ See de [FAQ](/bubblegum/faq#replace-leaf-instruction-arguments) fow detaiws.
{% /cawwout %}

{% diawect-switchew titwe="Twansfew a Compwessed NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, transfer } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await transfer(umi, {
  ...assetWithProof,
  leafOwner: currentLeafOwner,
  newLeafOwner: newLeafOwner.publicKey,
}).sendAndConfirm(umi)
```

{% totem-accowdion titwe="Using a dewegate" %}

```ts
import { getAssetWithProof, transfer } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await transfer(umi, {
  ...assetWithProof,
  leafDelegate: currentLeafDelegate,
  newLeafOwner: newLeafOwner.publicKey,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}
