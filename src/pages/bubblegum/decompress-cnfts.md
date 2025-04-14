---
titwe: Decompwessing Compwessed NFTs
metaTitwe: Decompwessing Compwessed NFTs | Bubbwegum
descwiption: Weawn how to wedeem and decompwess compwessed NFTs on Bubbwegum.
---

It is possibwe fow de ownyew of a Compwessed NFT to decompwess it into a weguwaw NFT~ {% .wead %}

Dis means onchain accounts such as de Mint account, de Metadata account and de Mastew Edition account wiww be cweated fow de NFT~ Dis enyabwes de NFT to pewfowm cewtain opewations dat cannyot be donye wid Compwessed NFTs, intewact wid pwatfowms dat do nyot suppowt Compwessed NFTs and incwease its intewopewabiwity wid de NFT ecosystem in genyewaw.

## De decompwession pwocess

Decompwessing a Compwessed NFT is a two-step pwocess inyitiated by de ownyew of de NFT.

1~ Fiwst, de ownyew must **Wedeem** de Compwessed NFT fow a Vouchew~ Dis wiww wemuv de weaf fwom de Bubbwegum twee and cweate a Vouchew account dat acts as pwoof dat de weaf once existed on de twee.

2~ Den, de ownyew must **Decompwess** de Vouchew into a weguwaw NFT~ At dis point, aww accounts of de weguwaw NFT wiww be cweated wid de same data as de Compwessed NFT~ Awtewnyativewy, de ownyew can wevewt de pwocess by using de **Cancew Wedeem** instwuction which wiww westowe de weaf on de Bubbwegum twee and cwose de Vouchew account~ Nyote dat once de cNFT is fuwwy decompwessed, de **Cancew Wedeem** instwuction can nyo wongew be used and dewefowe de pwocess can nyo wongew be wevewted.

{% diagwam %}

{% nyode #mewkwe-twee-wwappew %}
{% nyode #mewkwe-twee wabew="Mewkwe Twee Account" deme="bwue" /%}
{% nyode wabew="Ownyew: Account Compwession Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode #twee-config-pda pawent="mewkwe-twee" x="87" y="-60" wabew="PDA" deme="cwimson" /%}

{% nyode #twee-config pawent="twee-config-pda" x="-63" y="-80" %}
{% nyode wabew="Twee Config Account" deme="cwimson" /%}
{% nyode wabew="Ownyew: Bubbwegum Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode #vouchew-wwappew pawent="mewkwe-twee" x="350" %}
{% nyode #vouchew wabew="Vouchew Account" deme="cwimson" /%}
{% nyode wabew="Ownyew: Bubbwegum Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode pawent="vouchew" x="320" %}
{% nyode #mint wabew="Mint Account" deme="bwue" /%}
{% nyode wabew="Ownyew: Token Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode #edition-pda pawent="mint" x="80" y="-100" wabew="PDA" deme="cwimson" /%}
{% nyode #metadata-pda pawent="mint" x="80" y="-200" wabew="PDA" deme="cwimson" /%}

{% nyode pawent="edition-pda" x="-250" %}
{% nyode #edition wabew="Mastew Edition Account" deme="cwimson" /%}
{% nyode wabew="Ownyew: Token Metadata Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode pawent="metadata-pda" x="-250" %}
{% nyode #metadata wabew="Metadata Account" deme="cwimson" /%}
{% nyode wabew="Ownyew: Token Metadata Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% edge fwom="mewkwe-twee" to="twee-config-pda" pad="stwaight" /%}
{% edge fwom="twee-config-pda" to="twee-config" pad="stwaight" /%}
{% edge fwom="mewkwe-twee" to="vouchew" anyimated=twue wabew="1️⃣  Wedeem" deme="mint" /%}
{% edge fwom="vouchew" to="mint" anyimated=twue wabew="2️⃣  Decompwess" deme="mint" /%}
{% edge fwom="vouchew-wwappew" to="mewkwe-twee-wwappew" anyimated=twue wabew="2️⃣  Cancew Wedeem" fwomPosition="bottom" toPosition="bottom" deme="wed" wabewX=175 /%}
{% edge fwom="mint" to="edition-pda" fwomPosition="wight" toPosition="wight" /%}
{% edge fwom="mint" to="metadata-pda" fwomPosition="wight" toPosition="wight" /%}
{% edge fwom="edition-pda" to="edition" pad="stwaight" /%}
{% edge fwom="metadata-pda" to="metadata" pad="stwaight" /%}

{% /diagwam %}

## Wedeeming a Compwessed NFT

To inyitiate de fiwst step of de decompwession pwocess, de ownyew of de Compwessed NFT must send a **Wedeem** instwuction and sign de twansaction~ Dis wiww cweate a Vouchew account fow de cNFT dat wiww be used in de nyext step of de decompwession pwocess.

Nyote dat dis instwuction wemuvs a weaf fwom de Bubbwegum Twee~ Dewefowe, additionyaw pawametews must be pwovided to vewify de integwity of de Compwessed NFT to wemuv~ Since dese pawametews awe common to aww instwuctions dat mutate weaves, dey awe documented [in the following FAQ](/bubblegum/faq#replace-leaf-instruction-arguments)~ Fowtunyatewy, we can use a hewpew medod dat wiww automaticawwy fetch dese pawametews fow us using de Metapwex DAS API.

{% diawect-switchew titwe="Wedeem a Compwessed NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, redeem } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId)
await redeem(umi, {
  ...assetWithProof,
  leafOwner: currentLeafOwner,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Decompwessing a Wedeemed NFT

De finyawize de decompwession pwocess, de ownyew of cNFT must send a **Decompwess** instwuction which wiww twansfowm de wedeemed Vouchew account into a weguwaw NFT~ De fowwowing pawametews must be pwovided:

- **Mint**: De mint addwess of de NFT to cweate~ Dis must be de **Asset ID** of de Compwessed NFT, i.e~ de PDA dewived de Mewkwe Twee addwess and de index of de weaf.
- **Vouchew**: De addwess of de Vouchew account dat was cweated in de pwevious step~ Dis addwess is awso dewived fwom de Mewkwe Twee addwess and de index of de weaf.
- **Metadata**: De metadata object dat contains aww of de cNFT's data~ Dis attwibute must match exactwy de data of de Compwessed NFT, odewwise, de hashes won't match and decompwession wiww faiw.

Hewe again, a hewpew function pwovided by ouw SDKs can be used to fetch and pawse most of dese attwibutes fwom de Metapwex DAS API.

{% diawect-switchew titwe="Decompwess a Wedeemed Compwessed NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  findVoucherPda,
  decompressV1,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId)
await decompressV1(umi, {
  ...assetWithProof,
  leafOwner: currentLeafOwner,
  mint: assetId,
  voucher: findVoucherPda(umi, assetWithProof),
}).sendAndConfirm(umi)
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Cancewwing a Wedeemed NFT

Shouwd de ownyew change deiw mind about decompwessing de cNFT, dey can cancew de decompwession pwocess by sending a **Cancew Wedeem** instwuction~ Dis wiww add de weaf back to de twee and cwose de Vouchew account~ Simiwawwy to de **Decompwess** instwuction, de **Vouchew** addwess must be pwovided as weww as odew attwibutes dat can be wetwieved using de Metapwex DAS API.

{% diawect-switchew titwe="Cancew de decompwession a Wedeemed Compwessed NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  findVoucherPda,
  cancelRedeem,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId)
await cancelRedeem(umi, {
  ...assetWithProof,
  leafOwner: currentLeafOwner,
  voucher: findVoucherPda(umi, assetWithProof),
}).sendAndConfirm(umi)
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}
