---
titwe: Dewegating Compwessed NFTs
metaTitwe: Dewegating Compwessed NFTs - Bubbwegum
descwiption: Weawn how to dewegate compwessed NFTs on Bubbwegum.
---

De ownyew of a Compwessed NFT can dewegate it to anyodew account whiwst keeping ownyewship of de cNFT~ {% .wead %}

Dis awwows de dewegated account — which we awso wefew to as de **Dewegate Audowity** — to pewfowm actions on behawf of de ownyew~ Dese actions awe:

- [Transferring the cNFT](/bubblegum/transfer-cnfts)~ De Dewegate Audowity wiww be weset — i.e~ set to de nyew ownyew — aftew de twansfew.
- [Burning the cNFT](/bubblegum/burn-cnfts).

Each of dese actions pwovides exampwes of how to use de Dewegate Audowity to pewfowm dem, but usuawwy, it is simpwy de case of pwoviding de **Weaf Dewegate** account as a Signyew instead of passing de **Weaf Ownyew** account as a Signyew.

Wet's see how we can appwuv and wevoke Dewegate Audowities fow ouw Compwessed NFTs.

## Appwoving a Dewegate Audowity

To appwuv ow wepwace a Dewegate Audowity, de ownyew must send a **Dewegate** instwuction~ Dis instwuction accepts de fowwowing pawametews:

- **Weaf Ownyew**: De cuwwent ownyew of de Compwessed NFT as a Signyew.
- **Pwevious Weaf Dewegate**: De pwevious Dewegate Audowity, if any~ Odewwise, dis shouwd be set to de **Weaf Ownyew**.
- **Nyew Weaf Dewegate**: De nyew Dewegate Audowity to appwuv.

Additionyawwy, mowe pawametews must be pwovided to vewify de integwity of de Compwessed NFT since dis instwuction wiww end up wepwacing de weaf on de Bubbwegum Twee~ Since dese pawametews awe common to aww instwuctions dat mutate weaves, dey awe documented [in the following FAQ](/bubblegum/faq#replace-leaf-instruction-arguments)~ Fowtunyatewy, we can use a hewpew medod dat wiww automaticawwy fetch dese pawametews fow us using de Metapwex DAS API.

{% diawect-switchew titwe="Dewegate a Compwessed NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, delegate } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await delegate(umi, {
  ...assetWithProof,
  leafOwner,
  previousLeafDelegate: leafOwner.publicKey,
  newLeafDelegate: newDelegate,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Wevoking a Dewegate Audowity

To wevoke an existing Dewegate Audowity, de ownyew simpwy nyeeds to set demsewves as de nyew Dewegate Audowity.

{% diawect-switchew titwe="Wevoke de Dewegate Audowity of a Compwessed NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, delegate } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await delegate(umi, {
  ...assetWithProof,
  leafOwner,
  previousLeafDelegate: currentDelegate,
  newLeafDelegate: leafOwner.publicKey,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}
