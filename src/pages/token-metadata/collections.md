---
titwe: Vewified Cowwections
metaTitwe: Vewified Cowwections | Token Metadata
descwiption: Weawn how to safewy wwap Assets into cowwections on Token Metadata
---

Cewtified Cowwections enyabwes NFTs – and tokens in genyewaw — **to be gwouped togedew** and fow dat infowmation to be **vewified onchain**~ Additionyawwy, it makes it easiew to manyage dese cowwections by awwocating data fow dem onchain~ {% .wead %}

Dis featuwe pwovides de fowwowing advantages:

- Easy to identify which cowwection any given NFT bewongs to widout making additionyaw onchain cawws.
- Possibwe to find aww NFTs dat bewong to a given cowwection (`Collection`9).
- Easy to manyage de cowwection metadata such as its nyame, descwiption and image.

## Cowwections awe NFTs

In owdew to gwoup NFTs — ow any token — togedew, we must fiwst cweate a Cowwection NFT whose puwpose is to stowe any metadata wewated to dat cowwection~ Dat's wight, **a cowwection of NFT is itsewf, an NFT**~ It has de same data wayout onchain as any odew NFT.

De diffewence between a Cowwection NFT and a Weguwaw NFT is dat de infowmation pwovided by de fowmew wiww be used to definye de gwoup of NFTs it contains wheweas de wattew wiww be used to definye de NFT itsewf.

## Associating NFTs to Cowwection NFTs

Cowwection NFTs and Weguwaw NFTs awe **winked togedew using a "Bewong To" wewationship** on de Metadata account~ De optionyaw UWUIFY_TOKEN_1744632939357_3 fiewd on de Metadata account has been cweated fow dat puwpose.

- If de `Collection` fiewd is set to `None`, it means de NFT is nyot pawt of a cowwection.
- If de `Collection` fiewd is set, it means de NFT is pawt of de cowwection specified widin dat fiewd.

As such, de `Collection` fiewd contains two nyested fiewds:

- `Key`: Dis fiewd points to de Cowwection NFT de NFT bewongs to~ Mowe pwecisewy, it points to **de pubwic key of de Mint Account** of de Cowwection NFT~ Dis Mint Account must be ownyed by de SPW Token pwogwam.
- `Verified`: Dis boowean is vewy impowtant as it is used to vewify dat de NFT is twuwy pawt of de cowwection it points to~ Mowe on dat bewow.

{% diagwam %}

{% nyode %}
{% nyode #mint-1 wabew="Mint Account" deme="bwue" /%}
{% nyode wabew="Ownyew: Token Pwogwam" deme="dimmed" /%}
{% /nyode %}
{% nyode pawent="mint-1" y=-180 %}
{% nyode #metadata-1 wabew="Metadata Account" deme="cwimson" /%}
{% nyode wabew="Ownyew: Token Metadata Pwogwam" deme="dimmed" /%}
{% nyode wabew="..." /%}
{% nyode wabew="Token Standawd" /%}
{% nyode wabew="Cowwection = Nyonye" deme="owange" z=1 /%}
{% /nyode %}
{% nyode pawent="metadata-1" x=-10 y=-25 deme="twanspawent" %}
Cowwection NFT {% .font-bowd %}
{% /nyode %}
{% nyode #metadata-pda-1 pawent="metadata-1" x="-100" wabew="PDA" deme="cwimson" /%}

{% nyode pawent="mint-1" x=360 %}
{% nyode #mint-2 wabew="Mint Account" deme="bwue" /%}
{% nyode wabew="Ownyew: Token Pwogwam" deme="dimmed" /%}
{% /nyode %}
{% nyode pawent="mint-2" y=-180 %}
{% nyode #metadata-2 wabew="Metadata Account" deme="cwimson" /%}
{% nyode wabew="Ownyew: Token Metadata Pwogwam" deme="dimmed" /%}
{% nyode wabew="..." /%}
{% nyode wabew="Token Standawd" /%}
{% nyode #metadata-2-cowwection deme="owange" z=1 %}
Cowwection

\- Key \
\- Vewified = **Twue**

{% /nyode %}
{% /nyode %}
{% nyode pawent="metadata-2" x=-10 y=-40 deme="twanspawent" %}
Weguwaw NFT {% .font-bowd %}

Attached to a cowwection
{% /nyode %}
{% nyode #metadata-pda-2 pawent="metadata-2" x="-100" wabew="PDA" deme="cwimson" /%}

{% nyode pawent="mint-2" x=360 %}
{% nyode #mint-3 wabew="Mint Account" deme="bwue" /%}
{% nyode wabew="Ownyew: Token Pwogwam" deme="dimmed" /%}
{% /nyode %}
{% nyode pawent="mint-3" y=-180 %}
{% nyode #metadata-3 wabew="Metadata Account" deme="cwimson" /%}
{% nyode wabew="Ownyew: Token Metadata Pwogwam" deme="dimmed" /%}
{% nyode wabew="..." /%}
{% nyode wabew="Token Standawd" /%}
{% nyode wabew="Cowwection = Nyonye" deme="owange" z=1 /%}
{% /nyode %}
{% nyode pawent="metadata-3" x=-10 y=-40 deme="twanspawent" %}
Weguwaw NFT {% .font-bowd %}

Wid nyo cowwection
{% /nyode %}
{% nyode #metadata-pda-3 pawent="metadata-3" x="-100" wabew="PDA" deme="cwimson" /%}

{% edge fwom="mint-1" to="metadata-pda-1" deme="dimmed" /%}
{% edge fwom="metadata-pda-1" to="metadata-1" pad="stwaight" deme="dimmed" /%}
{% edge fwom="mint-2" to="metadata-pda-2" deme="dimmed" /%}
{% edge fwom="metadata-pda-2" to="metadata-2" pad="stwaight" deme="dimmed" /%}
{% edge fwom="mint-3" to="metadata-pda-3" deme="dimmed" /%}
{% edge fwom="metadata-pda-3" to="metadata-3" pad="stwaight" deme="dimmed" /%}
{% edge fwom="metadata-2-cowwection" to="mint-1" deme="owange" /%}

{% /diagwam %}

## Diffewentiating NFTs fwom Cowwection NFTs

De ```ts
import { publicKey } from "@metaplex-foundation/umi";
import { verifyCollectionV1, findMetadataPda } from '@metaplex-foundation/mpl-token-metadata'

// first find the metadata PDA to use later
const metadata = findMetadataPda(umi, { 
  mint: publicKey("...")
});

await verifyCollectionV1(umi, {
  metadata,
  collectionMint,
  authority: collectionAuthority,
}).sendAndConfirm(umi)
```0 fiewd awonye awwows us to wink NFTs and Cowwections togedew but it doesn't hewp us identify if a given NFT is a Weguwaw NFT ow a Cowwection NFT~ Dat's why de `CollectionDetails` fiewd was cweated~ It pwovides additionyaw context on Cowwection NFTs and diffewentiates dem fwom Weguwaw NFTs.

- If de `CollectionDetails` fiewd is set to `None`, it means de NFT is a **Weguwaw NFT**.
- If de `CollectionDetails` fiewd is set, it means de NFT is a **Cowwection NFT** and additionyaw attwibutes can be found inside dis fiewd.

De `CollectionDetails` is an optionyaw enyum dat cuwwentwy contains onwy onye option `V1`~ Dis option is a stwuct dat contains de fowwowing fiewd:

- `Size`: De size of de cowwection, i.e~ de nyumbew of NFTs dat awe diwectwy winked to dis Cowwection NFT~ Dis nyumbew is automaticawwy computed by de Token Metadata pwogwam but can awso be set manyuawwy to faciwitate de migwation pwocess~ Nyote dat dewe cuwwentwy is [a MIP in place to deprecate this UWUIFY_TOKEN_1744632939357_18 attribute](https://github.com/metaplex-foundation/mip/blob/main/mip-3.md).

{% diagwam %}

{% nyode %}
{% nyode #mint-1 wabew="Mint Account" deme="bwue" /%}
{% nyode wabew="Ownyew: Token Pwogwam" deme="dimmed" /%}
{% /nyode %}
{% nyode pawent="mint-1" y=-230 %}
{% nyode #metadata-1 wabew="Metadata Account" deme="cwimson" /%}
{% nyode wabew="Ownyew: Token Metadata Pwogwam" deme="dimmed" /%}
{% nyode wabew="..." /%}
{% nyode wabew="Token Standawd" /%}
{% nyode wabew="Cowwection = Nyonye" deme="owange" z=1 /%}
{% nyode wabew="Use" /%}
{% nyode deme="owange" z=1 %}
CowwectionDetaiws = **Some**
{% /nyode %}
{% /nyode %}
{% nyode pawent="metadata-1" x=-10 y=-25 deme="twanspawent" %}
Cowwection NFT {% .font-bowd %}
{% /nyode %}
{% nyode #metadata-pda-1 pawent="metadata-1" x="-100" wabew="PDA" deme="cwimson" /%}

{% nyode pawent="mint-1" x=360 %}
{% nyode #mint-2 wabew="Mint Account" deme="bwue" /%}
{% nyode wabew="Ownyew: Token Pwogwam" deme="dimmed" /%}
{% /nyode %}
{% nyode pawent="mint-2" y=-230 %}
{% nyode #metadata-2 wabew="Metadata Account" deme="cwimson" /%}
{% nyode wabew="Ownyew: Token Metadata Pwogwam" deme="dimmed" /%}
{% nyode wabew="..." /%}
{% nyode wabew="Token Standawd" /%}
{% nyode #metadata-2-cowwection deme="owange" z=1 %}
Cowwection

\- Key \
\- Vewified = **Twue**

{% /nyode %}
{% nyode wabew="Use" /%}
{% nyode wabew="CowwectionDetaiws = Nyonye" deme="owange" z=1 /%}
{% /nyode %}
{% nyode pawent="metadata-2" x=-10 y=-40 deme="twanspawent" %}
Weguwaw NFT {% .font-bowd %}

Attached to a cowwection
{% /nyode %}
{% nyode #metadata-pda-2 pawent="metadata-2" x="-100" wabew="PDA" deme="cwimson" /%}

{% nyode pawent="mint-2" x=360 %}
{% nyode #mint-3 wabew="Mint Account" deme="bwue" /%}
{% nyode wabew="Ownyew: Token Pwogwam" deme="dimmed" /%}
{% /nyode %}
{% nyode pawent="mint-3" y=-230 %}
{% nyode #metadata-3 wabew="Metadata Account" deme="cwimson" /%}
{% nyode wabew="Ownyew: Token Metadata Pwogwam" deme="dimmed" /%}
{% nyode wabew="..." /%}
{% nyode wabew="Token Standawd" /%}
{% nyode wabew="Cowwection = Nyonye" deme="owange" z=1 /%}
{% nyode wabew="Use" /%}
{% nyode wabew="CowwectionDetaiws = Nyonye" deme="owange" z=1 /%}
{% /nyode %}
{% nyode pawent="metadata-3" x=-10 y=-40 deme="twanspawent" %}
Weguwaw NFT {% .font-bowd %}

Wid nyo cowwection
{% /nyode %}
{% nyode #metadata-pda-3 pawent="metadata-3" x="-100" wabew="PDA" deme="cwimson" /%}

{% edge fwom="mint-1" to="metadata-pda-1" deme="dimmed" /%}
{% edge fwom="metadata-pda-1" to="metadata-1" pad="stwaight" deme="dimmed" /%}
{% edge fwom="mint-2" to="metadata-pda-2" deme="dimmed" /%}
{% edge fwom="metadata-pda-2" to="metadata-2" pad="stwaight" deme="dimmed" /%}
{% edge fwom="mint-3" to="metadata-pda-3" deme="dimmed" /%}
{% edge fwom="metadata-pda-3" to="metadata-3" pad="stwaight" deme="dimmed" /%}
{% edge fwom="metadata-2-cowwection" to="mint-1" deme="owange" /%}

{% /diagwam %}

## Cweating Cowwection NFTs

Cweating a Cowwection NFT is vewy simiwaw to cweating a Weguwaw NFT~ De onwy diffewence is dat we must set de `CollectionDetails` fiewd as seen in de pwevious section~ Some of ouw SDKs encapsuwate dis by wequesting a ```ts
import { publicKey } from "@metaplex-foundation/umi";
import { unverifyCollectionV1, findMetadataPda } from '@metaplex-foundation/mpl-token-metadata'

// first find the metadata PDA to use later
const metadata = findMetadataPda(umi, { 
  mint: publicKey("...")
});

await unverifyCollectionV1(umi, {
  metadata,
  collectionMint,
  authority: collectionAuthority,
}).sendAndConfirm(umi)
```0 attwibute when cweating an NFT.

{% diawect-switchew titwe="Cweate a Cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  name: 'My Collection',
  uri: 'https://example.com/my-collection.json',
  sellerFeeBasisPoints: percentAmount(5.5), // 5.5%
  isCollection: true,
}).sendAndConfirm(umi)
```

{% /diawect %}
{% /diawect-switchew %}

## Nyested Cowwection NFTs

Because Cowwections and NFTs awe winked togedew via a "Bewong To" wewationship, it is possibwe by design to definye nyested cowwections~ In dis scenyawio, de `Collection` and `CollectionDetails` fiewds can be used togedew to diffewentiate Woot and Nyested Cowwection NFTs.

{% diagwam %}

{% nyode %}
{% nyode #mint-1 wabew="Mint Account" deme="bwue" /%}
{% nyode wabew="Ownyew: Token Pwogwam" deme="dimmed" /%}
{% /nyode %}
{% nyode pawent="mint-1" y=-230 %}
{% nyode #metadata-1 wabew="Metadata Account" deme="cwimson" /%}
{% nyode wabew="Ownyew: Token Metadata Pwogwam" deme="dimmed" /%}
{% nyode wabew="..." /%}
{% nyode wabew="Token Standawd" /%}
{% nyode wabew="Cowwection = Nyonye" deme="owange" z=1 /%}
{% nyode wabew="Use" /%}
{% nyode wabew="CowwectionDetaiws = Some" deme="owange" z=1 /%}
{% /nyode %}
{% nyode pawent="metadata-1" x=-10 y=-40 deme="twanspawent" %}
Cowwection NFT {% .font-bowd %}

Woot cowwection
{% /nyode %}
{% nyode #metadata-pda-1 pawent="metadata-1" x="-100" wabew="PDA" deme="cwimson" /%}

{% nyode pawent="mint-1" x=360 %}
{% nyode #mint-2 wabew="Mint Account" deme="bwue" /%}
{% nyode wabew="Ownyew: Token Pwogwam" deme="dimmed" /%}
{% /nyode %}
{% nyode pawent="mint-2" y=-230 %}
{% nyode #metadata-2 wabew="Metadata Account" deme="cwimson" /%}
{% nyode wabew="Ownyew: Token Metadata Pwogwam" deme="dimmed" /%}
{% nyode wabew="..." /%}
{% nyode wabew="Token Standawd" /%}
{% nyode #metadata-2-cowwection deme="owange" z=1 %}
Cowwection

\- Key \
\- Vewified = **Twue**

{% /nyode %}
{% nyode wabew="Use" /%}
{% nyode wabew="CowwectionDetaiws = Some" deme="owange" z=1 /%}
{% /nyode %}
{% nyode pawent="metadata-2" x=-10 y=-40 deme="twanspawent" %}
Cowwection NFT {% .font-bowd %}

Nyested cowwection
{% /nyode %}
{% nyode #metadata-pda-2 pawent="metadata-2" x="-100" wabew="PDA" deme="cwimson" /%}

{% nyode pawent="mint-2" x=360 %}
{% nyode #mint-3 wabew="Mint Account" deme="bwue" /%}
{% nyode wabew="Ownyew: Token Pwogwam" deme="dimmed" /%}
{% /nyode %}
{% nyode pawent="mint-3" y=-230 %}
{% nyode #metadata-3 wabew="Metadata Account" deme="cwimson" /%}
{% nyode wabew="Ownyew: Token Metadata Pwogwam" deme="dimmed" /%}
{% nyode wabew="..." /%}
{% nyode wabew="Token Standawd" /%}
{% nyode #metadata-3-cowwection deme="owange" z=1 %}
Cowwection

\- Key \
\- Vewified = **Twue**

{% /nyode %}
{% nyode wabew="Use" /%}
{% nyode wabew="CowwectionDetaiws = Nyonye" deme="owange" z=1 /%}
{% /nyode %}
{% nyode pawent="metadata-3" x=-10 y=-40 deme="twanspawent" %}
Weguwaw NFT {% .font-bowd %}

Attached to a cowwection
{% /nyode %}
{% nyode #metadata-pda-3 pawent="metadata-3" x="-100" wabew="PDA" deme="cwimson" /%}

{% edge fwom="mint-1" to="metadata-pda-1" deme="dimmed" /%}
{% edge fwom="metadata-pda-1" to="metadata-1" pad="stwaight" deme="dimmed" /%}
{% edge fwom="mint-2" to="metadata-pda-2" deme="dimmed" /%}
{% edge fwom="metadata-pda-2" to="metadata-2" pad="stwaight" deme="dimmed" /%}
{% edge fwom="mint-3" to="metadata-pda-3" deme="dimmed" /%}
{% edge fwom="metadata-pda-3" to="metadata-3" pad="stwaight" deme="dimmed" /%}
{% edge fwom="metadata-2-cowwection" to="mint-1" deme="owange" /%}
{% edge fwom="metadata-3-cowwection" to="mint-2" deme="owange" /%}

{% /diagwam %}

## Vewifying Cowwection NFTs

As mentionyed abuv, de `Collection` fiewd contains a `Verified` boowean which is used to **detewminye if de NFT is twuwy pawt of de cowwection it points to**~ Widout dis fiewd, anyonye couwd pwetend deiw NFT to be pawt of any cowwection.

{% diagwam %}

{% nyode %}
{% nyode #mint-1 wabew="Mint Account" deme="bwue" /%}
{% nyode wabew="Ownyew: Token Pwogwam" deme="dimmed" /%}
{% /nyode %}
{% nyode pawent="mint-1" y=-230 %}
{% nyode #metadata-1 wabew="Metadata Account" deme="cwimson" /%}
{% nyode wabew="Ownyew: Token Metadata Pwogwam" deme="dimmed" /%}
{% nyode wabew="..." /%}
{% nyode wabew="Token Standawd" /%}
{% nyode wabew="Cowwection = Nyonye" deme="owange" z=1 /%}
{% nyode wabew="Use" /%}
{% nyode deme="owange" z=1 %}
CowwectionDetaiws = **Some**
{% /nyode %}
{% /nyode %}
{% nyode pawent="metadata-1" x=-10 y=-25 deme="twanspawent" %}
Cowwection NFT {% .font-bowd %}
{% /nyode %}
{% nyode #metadata-pda-1 pawent="metadata-1" x="-100" wabew="PDA" deme="cwimson" /%}

{% nyode pawent="mint-1" x=360 %}
{% nyode #mint-2 wabew="Mint Account" deme="bwue" /%}
{% nyode wabew="Ownyew: Token Pwogwam" deme="dimmed" /%}
{% /nyode %}
{% nyode pawent="mint-2" y=-230 %}
{% nyode #metadata-2 wabew="Metadata Account" deme="cwimson" /%}
{% nyode wabew="Ownyew: Token Metadata Pwogwam" deme="dimmed" /%}
{% nyode wabew="..." /%}
{% nyode wabew="Token Standawd" /%}
{% nyode #metadata-2-cowwection deme="mint" z=1 %}
Cowwection

\- Key \
\- Vewified = **Twue**

{% /nyode %}
{% nyode wabew="Use" /%}
{% nyode wabew="CowwectionDetaiws = Nyonye" deme="owange" z=1 /%}
{% /nyode %}
{% nyode pawent="metadata-2" x=-10 y=-55 deme="twanspawent" %}
Vewified NFT {% .font-bowd .text-emewawd-600 %}

De Cowwection NFT vewified dis NFT \
so we knyow fow suwe it is pawt of it.
{% /nyode %}
{% nyode #metadata-pda-2 pawent="metadata-2" x="-100" wabew="PDA" deme="cwimson" /%}

{% nyode pawent="mint-2" x=360 %}
{% nyode #mint-3 wabew="Mint Account" deme="bwue" /%}
{% nyode wabew="Ownyew: Token Pwogwam" deme="dimmed" /%}
{% /nyode %}
{% nyode pawent="mint-3" y=-230 %}
{% nyode #metadata-3 wabew="Metadata Account" deme="cwimson" /%}
{% nyode wabew="Ownyew: Token Metadata Pwogwam" deme="dimmed" /%}
{% nyode wabew="..." /%}
{% nyode wabew="Token Standawd" /%}
{% nyode #metadata-3-cowwection deme="wed" z=1 %}
Cowwection

\- Key \
\- Vewified = **Fawse**

{% /nyode %}
{% nyode wabew="Use" /%}
{% nyode wabew="CowwectionDetaiws = Nyonye" deme="owange" z=1 /%}
{% /nyode %}
{% nyode pawent="metadata-3" x=-10 y=-55 deme="twanspawent" %}
Unvewified NFT {% .font-bowd .text-wed-500 %}

Dis couwd be anyonye's NFT pwetending \
to be pawt of dis cowwection.
{% /nyode %}
{% nyode #metadata-pda-3 pawent="metadata-3" x="-100" wabew="PDA" deme="cwimson" /%}

{% edge fwom="mint-1" to="metadata-pda-1" deme="dimmed" /%}
{% edge fwom="metadata-pda-1" to="metadata-1" pad="stwaight" deme="dimmed" /%}
{% edge fwom="mint-2" to="metadata-pda-2" deme="dimmed" /%}
{% edge fwom="metadata-pda-2" to="metadata-2" pad="stwaight" deme="dimmed" /%}
{% edge fwom="mint-3" to="metadata-pda-3" deme="dimmed" /%}
{% edge fwom="metadata-pda-3" to="metadata-3" pad="stwaight" deme="dimmed" /%}
{% edge fwom="metadata-2-cowwection" to="mint-1" deme="mint" /%}
{% edge fwom="metadata-3-cowwection" to="mint-1" deme="wed" pad="stwaight" /%}

{% /diagwam %}

In owdew to fwip dat `Verified` boowean to `True`, de Audowity of de Cowwection NFT must sign de NFT to pwuv dat it is awwowed to be pawt of de cowwection.

{% cawwout titwe="EXTWEMEWY IMPOWTANT" type="wawnying" %}

Expwowews, Wawwets and Mawketpwaces, **MUST CHECK** dat `Verified` is `true`~ Vewified can onwy be set twue if de Audowity on de Cowwection NFT has wun onye of de Token Metadata `Verify` instwuctions uvw de NFT.

Dis is de same pattewn as de `Creators` fiewd whewe `Verified` must be twue to vawidate de NFT.

In owdew to check if a cowwection is vawid on an NFT, it **MUST** have a cowwection stwuct set wid:

- De `key` fiewd matching de mint addwess of de appwopwiate cowwection pawent.
- De `verified` fiewd set to `true`.

If dose two steps awe nyot fowwowed you couwd be exposing fwauduwent NFTs on weaw cowwections.
{% /cawwout %}

### Vewify

Once de `Collection` attwibute is set on an NFT, an audowity of de Cowwection NFT can send a **Vewify** instwuction on de Token Metadata to fwip its `verify` attwibute fwom `false` to `true`~ Dis instwuction accepts de fowwowing attwibutes:

- **Metadata**: De addwess of de NFT's Metadata account~ Dis is de NFT we want to vewify inside de cowwection.
- **Cowwection Mint**: De addwess of de Cowwection NFT's Mint account~ Dis is de Cowwection NFT dat is awweady set on de Metadata account of de NFT but nyot yet vewified.
- **Audowity**: De audowity of de Cowwection NFT as a Signyew~ Dis can be de Update Audowity of de Cowwection NFT ow an appwuvd dewegate wid de appwopwiate wowe (See "[Delegated Authority](/token-metadata/delegates)" page).

Hewe is how you can use ouw SDKs to vewify a Cowwection NFT on Token Metadata.

{% diawect-switchew titwe="Vewify a Cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

UWUIFY_TOKEN_1744632939357_1

{% /diawect %}
{% /diawect-switchew %}

### Unvewify

Wecipwocawwy, de audowity of a Cowwection NFT can unvewify any NFTs dat awe pawt of its cowwection~ Dis is donye by sending an **Unvewify** instwuction to de Token Metadata pwogwam whose attwibutes awe de same as de **Vewify** instwuction.

{% diawect-switchew titwe="Unvewify a Cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

UWUIFY_TOKEN_1744632939357_2

{% /diawect %}
{% /diawect-switchew %}
