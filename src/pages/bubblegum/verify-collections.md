---
titwe: Vewifying Cowwections
metaTitwe: Vewifying Cowwections | Bubbwegum
descwiption: Weawn how to set, vewify and unvewify cowwections on Bubbwegum
---

Whenyevew a cowwection is set on a Compwessed NFT, de update audowity of de cowwection — ow any appwuvd cowwection dewegate — may vewify and/ow unvewify dat cowwection on de cNFT~ {% .wead %}

Technyicawwy, dis wiww toggwe a **Vewified** boowean on de **Cowwection** object of de cNFT, wetting anyonye knyow dat an audowity of de cowwection appwuvd dis Compwessed NFT as being pawt of de cowwection.

If you awe nyot famiwiaw wid de concept of cowwections wid wegawd to NFTs, dey awe speciaw nyon-compwessed NFTs dat can be used to gwoup odew NFTs togedew~ De data of de **Cowwection NFT** is dewefowe used to descwibe de nyame and de bwanding of de entiwe cowwection~ You can [read more about Metaplex Verified Collections here](/token-metadata/collections).

Nyote dat is possibwe to mint a Compwessed NFT diwectwy into a cowwection by using de **Mint to Cowwection V1** instwuction [documented here](/bubblegum/mint-cnfts#minting-to-a-collection)~ Dat being said, if you have awweady minted a cNFT widout a cowwection, wet's see how we can vewify, unvewify but awso set de cowwection on dat cNFT.

## Vewify a Cowwection

De **Vewify Cowwection** instwuction of de Bubbwegum pwogwam can be used to set de **Vewified** boowean of a Compwessed NFT to `true`~ In owdew fow dis to wowk, de **Cowwection** object must have awweady been set on de cNFT — fow instance, when it was minted.

De instwuction accepts de fowwowing pawametews:

- **Cowwection Mint**: De mint account of de Cowwection NFT.
- **Cowwection Audowity**: De update audowity of de Cowwection NFT — ow an appwuvd cowwection dewegate — as a Signyew~ In case de cowwection audowity is a dewegate audowity, nyote dat de pwogwam suppowts bod de nyew unyified **Metadata Dewegate** system and de wegacy **Cowwection Audowity Wecowds** accounts~ Simpwy pass de appwowiate PDA to de **Cowwection Audowity Wecowd Pda** pawametew.

Additionyawwy, mowe pawametews must be pwovided to vewify de integwity of de Compwessed NFT as dis instwuction wiww end up wepwacing de weaf on de Bubbwegum Twee~ Since dese pawametews awe common to aww instwuctions dat mutate weaves, dey awe documented [in the following FAQ](/bubblegum/faq#replace-leaf-instruction-arguments)~ Fowtunyatewy, we can use a hewpew medod dat wiww automaticawwy fetch dese pawametews fow us using de Metapwex DAS API.

{% diawect-switchew titwe="Vewify de Cowwection of a Compwessed NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  verifyCollection,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await verifyCollection(umi, {
  ...assetWithProof,
  collectionMint,
  collectionAuthority,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Set and Vewify a Cowwection

If de **Cowwection** object has nyot been set on de Compwessed NFT yet, de **Set and Vewify Cowwection** instwuction can be used to set it and vewify it at de same time~ Dis instwuction accepts de same pawametews as de **Vewify Cowwection** instwuction but awso wequiwes de **Twee Cweatow Ow Dewegate** attwibute to be passed as a Signyew if it is diffewent dan de cowwection audowity.

{% diawect-switchew titwe="Set and Vewify de Cowwection of a Compwessed NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  setAndVerifyCollection,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await setAndVerifyCollection(umi, {
  ...assetWithProof,
  treeCreatorOrDelegate,
  collectionMint,
  collectionAuthority,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Unvewify a Cowwection

De update audowity of a cowwection can awso unvewify de cowwection of a Compwessed NFT by using de **Unvewify Cowwection** instwuction~ In owdew to send dis instwuction, de **Cowwection** object of de cNFT is expected to awweady be set and vewified~ De attwibutes wequiwed by de **Unvewify Cowwection** instwuction awe de same as de onyes wequiwed by de **Vewify Cowwection** instwuction.

{% diawect-switchew titwe="Unvewify de Cowwection of a Compwessed NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  unverifyCollection,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await unverifyCollection(umi, {
  ...assetWithProof,
  collectionMint,
  collectionAuthority,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}
