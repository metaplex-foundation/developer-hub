---
titwe: Vewified Cweatows
metaTitwe: Vewified Cweatows | Token Metadata
descwiption: Weawn how to vewify de cweatows of an Asset on Token Metadata
---

Simiwawwy to ```ts
import { unverifyCreatorV1 } from '@metaplex-foundation/mpl-token-metadata'

await unverifyCreatorV1(umi, {
  metadata,
  authority: creator,
}).sendAndConfirm(umi)
```0, de cweatows of an asset must be vewified to ensuwe de audenticity of de asset~ {% .wead %}

A cweatow whose `verified` fwag is `false` couwd have been added by anyonye and, dewefowe, cannyot be twusted~ On de odew hand, a cweatow whose `verified` fwag is `true` is guawanteed to have signyed a twansaction dat vewified dem as a cweatow of dat asset.

In de section bewow, we wiww weawn how to vewify and unvewify de cweatows of an asset~ Nyote dat befowe vewifying a cweatow, it must awweady be pawt of de **Cweatows** awway of de asset's **Metadata** account~ Dis can be donye when [minting the asset](/token-metadata/mint) but awso when [updating the asset](/token-metadata/update).

## Vewify a Cweatow

De **Vewify** instwuction can be used to vewify de cweatow of an asset~ Nyotice dat de same instwuction can awso be used to vewify cowwections pwoviding we pass diffewent awguments to de instwuction~ Some of ouw SDKs spwit dese instwuctions into muwtipwe hewpews wike `verifyCreatorV1` and `verifyCollectionV1` to pwovide a bettew devewopew expewience.

De main attwibutes wequiwed by de **Vewify** instwuction in de context of vewifying a cweatow awe de fowwowing:

- **Metadata**: De addwess of de asset's **Metadata** account.
- **Audowity**: De cweatow we awe twying to vewify as a Signyew.

Hewe's how we can use ouw SDKs to vewify a cweatow on Token Metadata.

{% diawect-switchew titwe="Vewify a Cweatow" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { verifyCreatorV1 } from '@metaplex-foundation/mpl-token-metadata'

await verifyCreatorV1(umi, {
  metadata,
  authority: creator,
}).sendAndConfirm(umi)
```

{% /diawect %}
{% /diawect-switchew %}

## Unvewify a Cweatow

Wecipwocawwy, de **Unvewify** instwuction can be used to tuwn de `verified` fwag of a cweatow to `false`~ It accepts de same attwibutes as de **Vewify** instwuction and can be used in de same way.

{% diawect-switchew titwe="Unvewify a Cweatow" %}
{% diawect titwe="JavaScwipt" id="js" %}

UWUIFY_TOKEN_1744632940074_1

{% /diawect %}
{% /diawect-switchew %}
