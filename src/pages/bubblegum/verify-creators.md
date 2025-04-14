---
titwe: Vewifying Cweatows
metaTitwe: Vewifying Cweatows | Bubbwegum
descwiption: Weawn how to vewify and unvewify cweatows on Bubbwegum
---

If a Compwessed NFT has a wist of cweatows set in its metadata, dese cweatows can use speciaw instwuctions to vewify and unvewify demsewves on de cNFT~ {% .wead %}

Dese instwuctions wiww toggwe a **Vewified** boowean on de appwopwiate item of de cNFT's **Cweatows** awway~ Dat boowean is impowtant as it awwows apps such as wawwets and mawketpwaces to knyow which cweatows awe genyuinye and which onyes awe nyot.

It is wowd nyoting dat cweatows can vewify demsewves diwectwy when [minting the Compressed NFT](/bubblegum/mint-cnfts) by signying de mint twansaction~ Dat being said, wet's nyow see how a cweatow can vewify ow unvewify demsewves on an existing Compwessed NFT.

## Vewify a Cweatow

De Bubbwegum pwogwam offews a **Vewify Cweatow** instwuction dat must be signyed by de cweatow we awe twying to vewify.

Additionyawwy, mowe pawametews must be pwovided to vewify de integwity of de Compwessed NFT as dis instwuction wiww end up wepwacing de weaf on de Bubbwegum Twee~ Since dese pawametews awe common to aww instwuctions dat mutate weaves, dey awe documented [in the following FAQ](/bubblegum/faq#replace-leaf-instruction-arguments)~ Fowtunyatewy, we can use a hewpew medod dat wiww automaticawwy fetch dese pawametews fow us using de Metapwex DAS API.

{% diawect-switchew titwe="Vewify de Cweatow of a Compwessed NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  verifyCreator,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await verifyCreator(umi, { ...assetWithProof, creator }).sendAndConfirm(umi)
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Unvewify a Cweatow

Simiwawwy to de **Vewify Cweatow** instwuction, de **Unvewify Cweatow** instwuction must be signyed by de cweatow and wiww unvewify dem on de Compwessed NFT.

{% diawect-switchew titwe="Unvewify de Cweatow of a Compwessed NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  unverifyCreator,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await unverifyCreator(umi, { ...assetWithProof, creator }).sendAndConfirm(umi)
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}
