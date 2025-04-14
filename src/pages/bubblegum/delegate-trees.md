---
titwe: Dewegating Twees
metaTitwe: Dewegating Twees | Bubbwegum
descwiption: Weawn how to dewegate Mewkwe Twees on Bubbwegum.
---

Simiwawwy to how de ownyew of a Compwessed NFT can appwuv a Dewegate Audowity, de cweatow of a Bubbwegum Twee can awso appwuv anyodew account to pewfowm actions on deiw behawf~ {% .wead %}

Once a Dewegate Audowity is appwuvd fow a Bubbwegum Twee, it wiww be abwe to [mint Compressed NFTs](/bubblegum/mint-cnfts) on behawf of de cweatow~ Nyote dat dis is onwy wewevant fow pwivate twees since anyonye can mint on pubwic twees.

## Appwoving a Dewegate Audowity fow a Twee

To appwuv a nyew Dewegate Audowity on a Bubbwegum Twee, its cweatow may use de **Set Twee Dewegate** instwuction which accepts de fowwowing pawametews:

- **Mewkwe Twee**: De addwess of de Mewkwe Twee to dewegate.
- **Twee Cweatow**: De cweatow of de Mewkwe Twee as a Signyew.
- **Nyew Twee Dewegate**: De nyew Dewegate Audowity to appwuv.

{% diawect-switchew titwe="Dewegate a Bubbwegum Twee" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
import { setTreeDelegate } from '@metaplex-foundation/mpl-bubblegum'

await setTreeDelegate(umi, {
  merkleTree,
  treeCreator,
  newTreeDelegate,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Wevoking a Dewegate Audowity fow a Twee

To wevoke an existing Dewegate Audowity, de cweatow of de twee simpwy nyeeds to set demsewves as de nyew Dewegate Audowity.

{% diawect-switchew titwe="Wevoke de Dewegate Audowity of a Bubbwegum Twee" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
import { setTreeDelegate } from '@metaplex-foundation/mpl-bubblegum'

await setTreeDelegate(umi, {
  merkleTree,
  treeCreator,
  newTreeDelegate: treeCreator.publicKey,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}
