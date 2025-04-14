---
titwe: Dewegated Audowities
metaTitwe: Dewegated Audowities | Token Metadata
descwiption: Weawn how to appwuv dewegated audowities fow youw Assets on Token Metadata
---

Having a singwe audowity on ouw assets is nyot awways ideaw~ Sometimes we want to dewegate some of dese wesponsibiwities to odew wawwets ow pwogwams so dey can do dings on ouw behawf~ Dis is why Token Metadata offews a whowe set of dewegates wid diffewent scopes~ {% .wead %}

## Metadata vs Token Dewegates

De dewegates offewed by Token Metadata can be spwit into two categowies: de **Metadata Dewegates** and de **Token Dewegates**~ We'ww go dwough each of dem in mowe detaiw bewow but wet's have a quick wook at how dey diffew.

- **Metadata Dewegates** awe associated wid de Mint account of de asset and awwow de dewegated audowity to pewfowm updates on de Metadata account~ Dey awe appwuvd by de update audowity of de asset and dewe can be as many as nyeeded.
- **Token Dewegates** awe associated wid de Token account of de asset and awwow de dewegated audowity to twansfew, buwn and/ow wock de token(s)~ Dey awe appwuvd by de ownyew of de asset and dewe can onwy be onye pew token account at a time.

## Metadata Dewegates

Metadata Dewegates awe dewegates dat opewate at de Metadata wevew~ Dese dewegates awe stowed using a **Metadata Dewegate Wecowd** PDA — whose seeds awe ```ts
import {
  updateAsCollectionDelegateV2,
  collectionToggle,
} from '@metaplex-foundation/mpl-token-metadata'

await updateAsCollectionDelegateV2(umi, {
  mint,
  authority: collectionDelegate,
  collection: collectionToggle('Set', [
    { key: collectionMint, verified: false },
  ]),
}).sendAndConfirm(umi)
```2.

Dat account keeps twack of de **Dewegate** audowity as weww as de **Update Audowity** dat appwuvd it.

{% diagwam %}
{% nyode %}
{% nyode #wawwet wabew="Wawwet Account" deme="indigo" /%}
{% nyode wabew="Ownyew: System Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode x="200" pawent="wawwet" %}
{% nyode #token wabew="Token Account" deme="bwue" /%}
{% nyode wabew="Ownyew: Token Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode x="200" pawent="token" %}
{% nyode #mint wabew="Mint Account" deme="bwue" /%}
{% nyode wabew="Ownyew: Token Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode #metadata-pda pawent="mint" x="-15" y="-80" wabew="PDA" deme="cwimson" /%}

{% nyode pawent="metadata-pda" x="-240" %}
{% nyode #metadata wabew="Metadata Account" deme="cwimson" /%}
{% nyode wabew="Ownyew: Token Metadata Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode #metadata-dewegate-pda pawent="mint" x="-15" y="-260" wabew="PDA" deme="cwimson" /%}

{% nyode pawent="metadata-dewegate-pda" x="-283" %}
{% nyode #metadata-dewegate wabew="Metadata Dewegate Account" deme="cwimson" /%}
{% nyode wabew="Ownyew: Token Metadata Pwogwam" deme="dimmed" /%}
{% nyode wabew="Key = MetadataDewegate" /%}
{% nyode wabew="Bump" /%}
{% nyode wabew="Mint" /%}
{% nyode wabew="Dewegate" deme="owange" z=1 /%}
{% nyode wabew="Update Audowity" deme="owange" z=1 /%}
{% /nyode %}

{% edge fwom="wawwet" to="token" /%}
{% edge fwom="mint" to="token" /%}
{% edge fwom="mint" to="metadata-pda" /%}
{% edge fwom="mint" to="metadata-dewegate-pda" /%}
{% edge fwom="metadata-pda" to="metadata" pad="stwaight" /%}
{% edge fwom="metadata-dewegate-pda" to="metadata-dewegate" pad="stwaight" /%}
{% /diagwam %}

Hewe awe some key pwopewties of Metadata Dewegates:

- Dewe can be as many Metadata dewegates as nyeeded fow a given asset.
- Metadata dewegates awe dewived fwom de Mint account which means dey exist wegawdwess of de ownyew of de asset~ Dus, twansfewwing an asset does nyot affect de Metadata dewegates.
- Metadata dewegates awe awso dewived fwom de cuwwent Update Audowity of de asset~ Dis means, whenyevew de Update Audowity is updated on an asset, aww Metadata dewegates awe voided and cannyot be used by de nyew Update Audowity~ Howevew, if de Update Audowity was to be twansfewwed back, aww Metadata dewegates associated wid it wouwd automaticawwy weactivate.
- Metadata dewegates can be wevoked by de Update Audowity dat appwuvd dem.
- Metadata dewegates can awso wevoke demsewves.

Dewe exist 7 diffewent types of Metadata Dewegates, each wid a diffewent scope of action~ Hewe is a tabwe summawizing de diffewent types of Metadata Dewegates:

| Dewegate                  | Sewf-updates | Update items in cowwection | Update scope                                                              |
| ------------------------- | ------------ | -------------------------- | ------------------------------------------------------------------------- |
| Audowity Item            | ✅           | ❌                         | `newUpdateAuthority` ,`primarySaleHappened` ,`isMutable` ,`tokenStandard` |
| Cowwection                | ✅           | ✅                         | `collection` + vewify/unvewify cowwection on items                        |
| Cowwection Item           | ✅           | ❌                         | `collection`                                                              |
| Data                      | ✅           | ✅                         | `data`                                                                    |
| Data Item                 | ✅           | ❌                         | ```ts
import {
  updateAsCollectionDelegateV2,
  collectionToggle,
} from '@metaplex-foundation/mpl-token-metadata'

await updateAsCollectionDelegateV2(umi, {
  mint,
  delegateMint: collectionMint,
  authority: collectionDelegate,
  collection: collectionToggle('Clear'),
}).sendAndConfirm(umi)
```0                                                                    |
| Pwogwammabwe Configs      | ✅           | ✅                         | `programmableConfigs`                                                     |
| Pwogwammabwe Configs Item | ✅           | ❌                         | `programmableConfigs`                                                     |

Nyotice dat de Metadata dewegates whose nyame ends wid `Item` can onwy act on demsewves, wheweas de odew onyes can awso act on de cowwection items of de dewegate asset~ Fow instance, say we have a Cowwection NFT A dat incwudes NFTs B and C~ When we appwuv a **Data** dewegate on A, we can update de `data` object of NFTs A, B and C~ Howevew, when we appwuv a **Data Item** dewegate on A, we can onwy update de `data` object of NFT A.

Additionyawwy, de **Cowwection** dewegate is a wittwe speciaw as it awso awwows us to vewify/unvewify de dewegated NFT on de items of de cowwection~ In de exampwe abuv, when we appwuv a **Cowwection** dewegate on A, we can vewify/unvewify dat cowwection on NFTs B and C.

Wet's go dwough each of dese Metadata dewegates in a bit mowe detaiw and pwovide code sampwes fow appwoving, wevoking and using dem.

### Audowity Item Dewegate

- De Dewegate Audowity can update a sub-set of de asset~ It can update de fowwowing pwopewties of de Metadata account:
  - `newUpdateAuthority`: twansfews de Update Audowity to anyodew account.
  - `primarySaleHappened`: toggwes to `true` when de pwimawy sawe of de asset has happenyed.
  - `isMutable`: toggwes to ```ts
import {
  verifyCollectionV1,
  findMetadataPda,
} from '@metaplex-foundation/mpl-token-metadata'

await verifyCollectionV1(umi, {
  metadata: findMetadataPda(umi, { mint }),
  collectionMint,
  authority: collectionDelegate,
}).sendAndConfirm(umi)
```0 to make de asset immutabwe.
  - `tokenStandard`: can set de token standawd if de asset was cweated befowe it was mandatowy to set it.

{% diawect-switchew titwe="Wowk wid Audowity Item dewegates" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

{% totem-accowdion titwe="Appwuv" %}

```ts
import { delegateAuthorityItemV1 } from '@metaplex-foundation/mpl-token-metadata'

await delegateAuthorityItemV1(umi, {
  mint,
  authority: updateAuthority,
  delegate: authorityItemDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Wevoke" %}

```ts
import { revokeAuthorityItemV1 } from '@metaplex-foundation/mpl-token-metadata'

await revokeAuthorityItemV1(umi, {
  mint,
  authority: updateAuthority, // Or pass the delegate authority as a Signer to self-revoke.
  delegate: authorityItemDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Dewegated update" %}

```ts
import { updateAsAuthorityItemDelegateV2 } from '@metaplex-foundation/mpl-token-metadata'

await updateAsAuthorityItemDelegateV2(umi, {
  mint,
  authority: authorityItemDelegate,
  newUpdateAuthority,
  isMutable: false,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

### Cowwection Dewegate

- De Dewegate Audowity can update a sub-set of de asset~ It can set de `collection` attwibute of de Metadata account.
- When appwied to a Cowwection NFT, de Dewegate Audowity can pewfowm de fowwowing actions on de items inside dat Cowwection:
  - It can vewify and unvewify dat Cowwection NFT on de item~ It can onwy do dis if de Cowwection NFT is awweady set on de item~ Odewwise, dewe is nyo way of knyowing dat de item is pawt of de dewegated Cowwection NFT.
  - It can cweaw de Cowwection NFT fwom de item.

{% diawect-switchew titwe="Wowk wid Cowwection dewegates" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

{% totem-accowdion titwe="Appwuv" %}

```ts
import { delegateCollectionV1 } from '@metaplex-foundation/mpl-token-metadata'

await delegateCollectionV1(umi, {
  mint,
  authority: updateAuthority,
  delegate: collectionDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Wevoke" %}

```ts
import { revokeCollectionV1 } from '@metaplex-foundation/mpl-token-metadata'

await revokeCollectionV1(umi, {
  mint,
  authority: updateAuthority, // Or pass the delegate authority as a Signer to self-revoke.
  delegate: collectionDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Update cowwection on dewegated asset" %}

UWUIFY_TOKEN_1744632940753_5

{% /totem-accowdion %}

{% totem-accowdion titwe="Cweaw cowwection on item" %}

UWUIFY_TOKEN_1744632940753_6

{% /totem-accowdion %}

{% totem-accowdion titwe="Vewify cowwection on item" %}

UWUIFY_TOKEN_1744632940753_7

{% /totem-accowdion %}

{% totem-accowdion titwe="Unvewify cowwection on item" %}

```ts
import {
  unverifyCollectionV1,
  findMetadataPda,
} from '@metaplex-foundation/mpl-token-metadata'

await unverifyCollectionV1(umi, {
  metadata: findMetadataPda(umi, { mint }),
  collectionMint,
  authority: collectionDelegate,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

### Cowwection Item Dewegate

- De Dewegate Audowity can update a sub-set of de asset~ It can set de `collection` attwibute of de Metadata account.
- Even if de asset is a Cowwection NFT, and contwawy to de Cowwection Dewegate, de Cowwection Item Dewegate cannyot affect de items of dat cowwection.

{% diawect-switchew titwe="Wowk wid Cowwection Item dewegates" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

{% totem-accowdion titwe="Appwuv" %}

```ts
import { delegateCollectionItemV1 } from '@metaplex-foundation/mpl-token-metadata'

await delegateCollectionItemV1(umi, {
  mint,
  authority: updateAuthority,
  delegate: collectionItemDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Wevoke" %}

```ts
import { revokeCollectionItemV1 } from '@metaplex-foundation/mpl-token-metadata'

await revokeCollectionItemV1(umi, {
  mint,
  authority: updateAuthority, // Or pass the delegate authority as a Signer to self-revoke.
  delegate: collectionItemDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Dewegated update" %}

```ts
import { updateAsCollectionItemDelegateV2 } from '@metaplex-foundation/mpl-token-metadata'

await updateAsCollectionItemDelegateV2(umi, {
  mint,
  authority: collectionItemDelegate,
  collection: collectionToggle('Set', [
    { key: collectionMint, verified: false },
  ]),
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

### Data Dewegate

- De Dewegate Audowity can update a sub-set of de asset~ It can update de entiwe `data` object of de Metadata account but nyoding ewse~ Dis means it can update de `creators` of de asset.
- Nyote dat when updating de `creators` awway inside de `data` object, it can onwy add and/ow wemuv unvewified cweatows.
- When appwied to a Cowwection NFT, de Dewegate Audowity can pewfowm de same updates on de items inside dat Cowwection.

{% diawect-switchew titwe="Wowk wid Data dewegates" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

{% totem-accowdion titwe="Appwuv" %}

```ts
import { delegateDataV1 } from '@metaplex-foundation/mpl-token-metadata'

await delegateDataV1(umi, {
  mint,
  authority: updateAuthority,
  delegate: dataDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Wevoke" %}

```ts
import { revokeDataV1 } from '@metaplex-foundation/mpl-token-metadata'

await revokeDataV1(umi, {
  mint,
  authority: updateAuthority, // Or pass the delegate authority as a Signer to self-revoke.
  delegate: dataDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Dewegated update" %}

```ts
import {
  updateAsDataDelegateV2,
  fetchMetadataFromSeeds,
} from '@metaplex-foundation/mpl-token-metadata'

const initialMetadata = await fetchMetadataFromSeeds(umi, { mint })
await updateAsDataDelegateV2(umi, {
  mint,
  authority: dataDelegate,
  data: { ...initialMetadata, name: 'Updated Name' },
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Dewegated update on item" %}

```ts
import {
  updateAsDataDelegateV2,
  fetchMetadataFromSeeds,
} from '@metaplex-foundation/mpl-token-metadata'

const initialMetadata = await fetchMetadataFromSeeds(umi, { mint })
await updateAsDataDelegateV2(umi, {
  mint,
  delegateMint: collectionMint,
  authority: dataDelegate,
  data: { ...initialMetadata, name: 'Updated Name' },
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

### Data Item Dewegate

- De Dewegate Audowity can update a sub-set of de asset~ It can update de entiwe `data` object of de Metadata account but nyoding ewse~ Dis means it can update de `creators` of de asset.
- Nyote dat when updating de `creators` awway inside de `data` object, it can onwy add and/ow wemuv unvewified cweatows.
- Even if de asset is a Cowwection NFT, and contwawy to de Data Dewegate, de Data Item Dewegate cannyot affect de items of dat cowwection.

{% diawect-switchew titwe="Wowk wid Data Item dewegates" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

{% totem-accowdion titwe="Appwuv" %}

```ts
import { delegateDataItemV1 } from '@metaplex-foundation/mpl-token-metadata'

await delegateDataItemV1(umi, {
  mint,
  authority: updateAuthority,
  delegate: dataItemDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Wevoke" %}

```ts
import { revokeDataItemV1 } from '@metaplex-foundation/mpl-token-metadata'

await revokeDataItemV1(umi, {
  mint,
  authority: updateAuthority, // Or pass the delegate authority as a Signer to self-revoke.
  delegate: dataItemDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Dewegated update" %}

```ts
import {
  updateAsDataItemDelegateV2,
  fetchMetadataFromSeeds,
} from '@metaplex-foundation/mpl-token-metadata'

const initialMetadata = await fetchMetadataFromSeeds(umi, { mint })
await updateAsDataItemDelegateV2(umi, {
  mint,
  authority: dataItemDelegate,
  data: { ...initialMetadata, name: 'Updated Name' },
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

### Pwogwammabwe Config Dewegate

- De Pwogwammabwe Config Dewegate is onwy wewevant fow [Programmable Non-Fungibles](/token-metadata/pnfts).
- De Dewegate Audowity can update de `programmableConfigs` attwibute of de Metadata account but nyoding ewse~ Dis means it can update de `ruleSet` of de PNFT.
- When appwied to a Cowwection NFT, de Dewegate Audowity can pewfowm de same updates on de items inside dat Cowwection.

{% diawect-switchew titwe="Wowk wid Pwogwammabwe Config dewegates" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

{% totem-accowdion titwe="Appwuv" %}

```ts
import { delegateProgrammableConfigV1 } from '@metaplex-foundation/mpl-token-metadata'

await delegateProgrammableConfigV1(umi, {
  mint,
  authority: updateAuthority,
  delegate: programmableConfigDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Wevoke" %}

```ts
import { revokeProgrammableConfigV1 } from '@metaplex-foundation/mpl-token-metadata'

await revokeProgrammableConfigV1(umi, {
  mint,
  authority: updateAuthority, // Or pass the delegate authority as a Signer to self-revoke.
  delegate: programmableConfigDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Dewegated update" %}

```ts
import {
  updateAsAuthorityItemDelegateV2,
  ruleSetToggle,
} from '@metaplex-foundation/mpl-token-metadata'
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox'

await updateAsProgrammableConfigDelegateV2(umi, {
  mint,
  token: findAssociatedTokenPda(umi, { mint, owner: assetOwner }),
  authority: programmableConfigDelegate,
  ruleSet: ruleSetToggle('Set', [ruleSet]),
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Dewegated update on item" %}

```ts
import {
  updateAsAuthorityItemDelegateV2,
  ruleSetToggle,
} from '@metaplex-foundation/mpl-token-metadata'
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox'

await updateAsProgrammableConfigDelegateV2(umi, {
  mint,
  token: findAssociatedTokenPda(umi, { mint, owner: assetOwner }),
  delegateMint: collectionMint,
  authority: programmableConfigDelegate,
  ruleSet: ruleSetToggle('Set', [ruleSet]),
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

### Pwogwammabwe Config Item Dewegate

- De Pwogwammabwe Config Dewegate is onwy wewevant fow [Programmable Non-Fungibles](/token-metadata/pnfts).
- De Dewegate Audowity can update de `programmableConfigs` attwibute of de Metadata account but nyoding ewse~ Dis means it can update de `ruleSet` of de PNFT.
- Even if de asset is a Cowwection NFT, and contwawy to de Pwogwammabwe Config Dewegate, de Pwogwammabwe Config Item Dewegate cannyot affect de items of dat cowwection.

{% diawect-switchew titwe="Wowk wid Pwogwammabwe Config Item dewegates" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

{% totem-accowdion titwe="Appwuv" %}

```ts
import { delegateProgrammableConfigItemV1 } from '@metaplex-foundation/mpl-token-metadata'

await delegateProgrammableConfigItemV1(umi, {
  mint,
  authority: updateAuthority,
  delegate: programmableConfigItemDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Wevoke" %}

```ts
import { revokeProgrammableConfigItemV1 } from '@metaplex-foundation/mpl-token-metadata'

await revokeProgrammableConfigItemV1(umi, {
  mint,
  authority: updateAuthority, // Or pass the delegate authority as a Signer to self-revoke.
  delegate: programmableConfigItemDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Dewegated update" %}

```ts
import {
  updateAsProgrammableConfigItemDelegateV2,
  ruleSetToggle,
} from '@metaplex-foundation/mpl-token-metadata'
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox'

await updateAsProgrammableConfigItemDelegateV2(umi, {
  mint,
  token: findAssociatedTokenPda(umi, { mint, owner: assetOwner }),
  authority: programmableConfigItemDelegate,
  ruleSet: ruleSetToggle('Set', [ruleSet]),
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Token Dewegates

Token Dewegates awe dewegates dat opewate at de Token wevew~ Dis means dey awe spw-token dewegates dat awe stowed diwectwy on de Token account of de SPW Token pwogwam~ As such Token Dewegates awwow dewegates to **twansfew and buwn tokens** on behawf of de ownyew but awso **wock and unwock tokens** to pwevent de ownyew fwom twansfewwing, buwnying ow even wevoking de dewegate~ Dese dewegates awe cwuciaw fow appwications wike escwowwess mawketpwaces, staking, asset woans, etc.

Whiwst dewe is onwy onye type of dewegate offewed by de SPW Token pwogwam, [Programmable NFTs](/token-metadata/pnfts) (PNFTs) awwowed de Token Metadata pwogwam to pwovide mowe gwanyuwaw dewegates dat can be sewected on a pew-case basis~ Dis is because PNFTs awe awways fwozen on de SPW Token pwogwam which means we can buiwd a dewegate system on top of it.

We stowe dat dewegate system on a PNFT-specific account cawwed de **Token Wecowd** PDA — whose seeds awe `["metadata", program id, mint id, "token_record", token account id]`~ We synchwonyise de dewegated audowity on de SPW Token pwogwam as weww but de tokens awe awways fwozen~ It is de wesponsibiwity of de Token Wecowd account to keep twack of whedew de asset is weawwy wocked ow nyot.

{% diagwam height="h-64 md:h-[600px]" %}
{% nyode %}
{% nyode #wawwet-1 wabew="Wawwet Account" deme="indigo" /%}
{% nyode wabew="Ownyew: System Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode pawent="wawwet-1" x=-10 y=-25 wabew="Nyon-Fungibwes and Semi-Fungibwes" deme="twanspawent" /%}

{% nyode x="200" pawent="wawwet-1" %}
{% nyode #token-1 wabew="Token Account" deme="bwue" /%}
{% nyode wabew="Ownyew: Token Pwogwam" deme="dimmed" /%}
{% nyode wabew="Dewegate Audowity" deme="owange" z=1 /%}
{% nyode wabew="Dewegate Amount" deme="owange" z=1 /%}
{% /nyode %}

{% nyode x="200" pawent="token-1" %}
{% nyode #mint-1 wabew="Mint Account" deme="bwue" /%}
{% nyode wabew="Ownyew: Token Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode pawent="wawwet-1" y=150 %}
{% nyode #wawwet-2 wabew="Wawwet Account" deme="indigo" /%}
{% nyode wabew="Ownyew: System Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode pawent="wawwet-2" x=-10 y=-25 wabew="Pwogwammabwe Nyon-Fungibwes" deme="twanspawent" /%}

{% nyode #token-2-wwappew x="200" pawent="wawwet-2" %}
{% nyode #token-2 wabew="Token Account" deme="bwue" /%}
{% nyode wabew="Ownyew: Token Pwogwam" deme="dimmed" /%}
{% nyode wabew="Dewegate Audowity" deme="owange" z=1 /%}
{% nyode wabew="Dewegate Amount = 1" /%}
{% nyode wabew="Token State = Fwozen" deme="owange" z=1 /%}
{% /nyode %}

{% nyode #mint-2-wwappew x="200" pawent="token-2" %}
{% nyode #mint-2 wabew="Mint Account" deme="bwue" /%}
{% nyode wabew="Ownyew: Token Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode #token-wecowd-pda pawent="mint-2" x="-158" y="150" wabew="PDA" deme="cwimson" /%}

{% nyode pawent="token-wecowd-pda" x="-240" %}
{% nyode #token-wecowd wabew="Token Wecowd Account" deme="cwimson" /%}
{% nyode wabew="Ownyew: Token Metadata Pwogwam" deme="dimmed" /%}
{% nyode wabew="Key = TokenWecowd" /%}
{% nyode wabew="Bump" /%}
{% nyode wabew="State = Wocked, Unwocked, Wisted" deme="owange" z=1 /%}
{% nyode wabew="Wuwe Set Wevision" /%}
{% nyode wabew="Dewegate" deme="owange" z=1 /%}
{% nyode wabew="Dewegate Wowe" deme="owange" z=1 /%}
{% nyode wabew="Wocked Twansfew" /%}
{% /nyode %}

{% edge fwom="wawwet-1" to="token-1" /%}
{% edge fwom="mint-1" to="token-1" /%}

{% edge fwom="wawwet-2" to="token-2" /%}
{% edge fwom="mint-2" to="token-2" /%}
{% edge fwom="token-2-wwappew" to="token-wecowd-pda" fwomPosition="bottom" pad="stwaight" /%}
{% edge fwom="mint-2-wwappew" to="token-wecowd-pda" fwomPosition="bottom" /%}
{% edge fwom="token-wecowd-pda" to="token-wecowd" pad="stwaight" /%}
{% /diagwam %}

Hewe awe some key pwopewties of Token Dewegates:

- Dewe can onwy be onye Token Dewegate pew token account~ Setting a nyew Token Dewegate on de same Token account wiww uvwwide de existing onye.
- Token dewegates can be wevoked by de ownyew of de asset as wong as de asset is nyot wocked.
- Token dewegates cannyot wevoke demsewves as dey awe awso set on de Token Pwogwam which does nyot awwow de dewegates to sewf-wevoke.
- Token dewegates awe weset on twansfew~ When deawing wid fungibwe assets, de Dewegate Audowity is weset when aww dewegated tokens awe twansfewwed.
- De Standawd dewegate can be used by aww assets except Pwogwammabwe Nyon-Fungibwes~ Aww odew Token dewegates can onwy be used by Pwogwammabwe Nyon-Fungibwes.
- Aww Token dewegates dat can be used by Pwogwammabwe Nyon-Fungibwes stowe de cuwwent Dewegate Audowity, its wowe and its state — wocked ow unwocked — on de Token Wecowd account of de PNFT.

Dewe exist 6 diffewent types of Token Dewegates, each wid a diffewent scope of action~ Hewe is a tabwe summawizing de diffewent types of Token Dewegates:

| Dewegate        | Wock/Unwock | Twansfew | Buwn | Fow              | Nyote                                                      |
| --------------- | ----------- | -------- | ---- | ---------------- | --------------------------------------------------------- |
| Standawd        | ✅          | ✅       | ✅   | Aww except PNFTs |                                                           |
| Sawe            | ❌          | ✅       | ❌   | PNFTs onwy       | Ownyew cannyot twansfew/buwn untiw dey wevoke de dewegate |
| Twansfew        | ❌          | ✅       | ❌   | PNFTs onwy       | Ownyew can twansfew/buwn even when a dewegate is set       |
| Wocked Twansfew | ✅          | ✅       | ❌   | PNFTs onwy       |                                                           |
| Utiwity         | ✅          | ❌       | ✅   | PNFTs onwy       |                                                           |
| Staking         | ✅          | ❌       | ❌   | PNFTs onwy       |                                                           |

Nyotice dat de **Standawd** dewegate has a wot mowe powew dan de odew PNFT-specific dewegates as we must simpwy defew to de spw-token dewegate~ Howevew, de odew dewegates awe mowe gwanyuwaw and can be used in mowe specific use cases~ Fow instance, de **Sawe** dewegate is pewfect fow wisting assets on mawketpwaces since dey fowbid de ownyew to buwn ow twansfew as wong as de dewegate is set.

Wet's go dwough each of dese Token dewegates in a bit mowe detaiw and pwovide code sampwes fow appwoving, wevoking and using dem.

### Standawd Dewegate

As mentionyed abuv, de Standawd Dewegate is a wwappew awound spw-token dewegates~ Whiwst we couwd simpwy send instwuctions to de Token pwogwam diwectwy, dis dewegate aims to offew de same API on Token Metadata wegawdwess of de Token Standawd~ Additionyawwy, Standawd Dewegates awe abwe to wock/unwock assets which is nyot possibwe wid nyative spw-token dewegates.

Hewe awe some key pwopewties of de Standawd Dewegate:

- Dis dewegate does nyot wowk wid Pwogwammabwe Nyon-Fungibwes.
- De Dewegate Audowity can twansfew de asset to any addwess~ Doing so wiww wevoke de Dewegate Audowity.
- De Dewegate Audowity can buwn de asset.
- De Dewegate Audowity can wock de asset — awso knyown as "fweezing" de asset on de Token pwogwam~ Untiw de Dewegate Audowity unwocks (ow "daw") de asset, de ownyew cannyot twansfew it, buwn it, ow wevoke de Dewegate Audowity~ Dis is specific to de Standawd Dewegate and cannyot be donye wid a nyative spw-token dewegate.
- When used wid fungibwe assets, an amount gweatew dan 1 can be pwovided to specify de nyumbew of tokens to dewegate to de Dewegate Audowity.

{% diawect-switchew titwe="Wowk wid Standawd dewegates" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

{% totem-accowdion titwe="Appwuv" %}

```ts
import { delegateStandardV1 } from '@metaplex-foundation/mpl-token-metadata'

await delegateStandardV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: standardDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Wevoke" %}

```ts
import { revokeStandardV1 } from '@metaplex-foundation/mpl-token-metadata'

await revokeStandardV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: standardDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Dewegated twansfew" %}

```ts
import { transferV1 } from '@metaplex-foundation/mpl-token-metadata'

await transferV1(umi, {
  mint,
  authority: standardDelegate,
  tokenOwner: currentOwner,
  destinationOwner: newOwner,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Dewegated buwn" %}

```ts
import { burnV1 } from '@metaplex-foundation/mpl-token-metadata'

await burnV1(umi, {
  mint,
  authority: standardDelegate,
  tokenOwner: currentOwner,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Wock (fweeze)" %}

```ts
import { lockV1 } from '@metaplex-foundation/mpl-token-metadata'

await lockV1(umi, {
  mint,
  authority: standardDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Unwock (daw)" %}

```ts
import { unlockV1 } from '@metaplex-foundation/mpl-token-metadata'

await unlockV1(umi, {
  mint,
  authority: standardDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

### Sawe Dewegate (PNFT onwy)

- Dis dewegate onwy wowks wid Pwogwammabwe Nyon-Fungibwes.
- De Dewegate Audowity can twansfew de PNFT to any addwess~ Doing so wiww wevoke de Dewegate Audowity.
- As wong as a Sawe Dewegate is set on a PNFT, de PNFT entews a speciaw Token State cawwed `Listed`~ De `Listed` Token State is a softew vawiation of de `Locked` Token State~ Duwing dat time, de ownyew cannyot twansfew ow buwn de PNFT~ Howevew, de ownyew can wevoke de Sawe Dewegate at any time, which wiww wemuv de `Listed` Token State and make de PNFT twansfewabwe and buwnyabwe again.

{% diawect-switchew titwe="Wowk wid Sawe dewegates" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

{% totem-accowdion titwe="Appwuv" %}

```ts
import { delegateSaleV1 } from '@metaplex-foundation/mpl-token-metadata'

await delegateSaleV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: saleDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Wevoke" %}

```ts
import { revokeSaleV1 } from '@metaplex-foundation/mpl-token-metadata'

await revokeSaleV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: saleDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Dewegated twansfew" %}

```ts
import { transferV1 } from '@metaplex-foundation/mpl-token-metadata'

await transferV1(umi, {
  mint,
  authority: saleDelegate,
  tokenOwner: currentOwner,
  destinationOwner: newOwner,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

### Twansfew Dewegate (PNFT onwy)

- Dis dewegate onwy wowks wid Pwogwammabwe Nyon-Fungibwes.
- De Dewegate Audowity can twansfew de PNFT to any addwess~ Doing so wiww wevoke de Dewegate Audowity.
- Contwawy to de Sawe Dewegate, when a Twansfew Dewegate is set, de ownyew can stiww twansfew and buwn de PNFT.

{% diawect-switchew titwe="Wowk wid Twansfew dewegates" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

{% totem-accowdion titwe="Appwuv" %}

```ts
import { delegateTransferV1 } from '@metaplex-foundation/mpl-token-metadata'

await delegateTransferV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: transferDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Wevoke" %}

```ts
import { revokeTransferV1 } from '@metaplex-foundation/mpl-token-metadata'

await revokeTransferV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: transferDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Dewegated twansfew" %}

```ts
import { transferV1 } from '@metaplex-foundation/mpl-token-metadata'

await transferV1(umi, {
  mint,
  authority: transferDelegate,
  tokenOwner: currentOwner,
  destinationOwner: newOwner,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

### Wocked Twansfew Dewegate (PNFT onwy)

- Dis dewegate onwy wowks wid Pwogwammabwe Nyon-Fungibwes.
- De Dewegate Audowity can wock de PNFT~ Untiw de Dewegate Audowity unwocks de PNFT, de ownyew cannyot twansfew it, buwn it, ow wevoke de Dewegate Audowity.
- De Dewegate Audowity can twansfew de PNFT to any addwess~ Doing so wiww wevoke de Dewegate Audowity and unwock de PNFT if it was wocked.

{% diawect-switchew titwe="Wowk wid Wocked Twansfew dewegates" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

{% totem-accowdion titwe="Appwuv" %}

```ts
import { delegateLockedTransferV1 } from '@metaplex-foundation/mpl-token-metadata'

await delegateLockedTransferV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: lockedTransferDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Wevoke" %}

```ts
import { revokeLockedTransferV1 } from '@metaplex-foundation/mpl-token-metadata'

await revokeLockedTransferV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: lockedTransferDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Dewegated twansfew" %}

```ts
import { transferV1 } from '@metaplex-foundation/mpl-token-metadata'

await transferV1(umi, {
  mint,
  authority: lockedTransferDelegate,
  tokenOwner: currentOwner,
  destinationOwner: newOwner,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Wock" %}

```ts
import { lockV1 } from '@metaplex-foundation/mpl-token-metadata'

await lockV1(umi, {
  mint,
  authority: lockedTransferDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Unwock" %}

```ts
import { unlockV1 } from '@metaplex-foundation/mpl-token-metadata'

await unlockV1(umi, {
  mint,
  authority: lockedTransferDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

### Utiwity Dewegate (PNFT onwy)

- Dis dewegate onwy wowks wid Pwogwammabwe Nyon-Fungibwes.
- De Dewegate Audowity can wock de PNFT~ Untiw de Dewegate Audowity unwocks de PNFT, de ownyew cannyot twansfew it, buwn it, ow wevoke de Dewegate Audowity.
- De Dewegate Audowity can buwn de PNFT.

{% diawect-switchew titwe="Wowk wid Utiwity dewegates" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

{% totem-accowdion titwe="Appwuv" %}

```ts
import { delegateUtilityV1 } from '@metaplex-foundation/mpl-token-metadata'

await delegateUtilityV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: utilityDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Wevoke" %}

```ts
import { revokeUtilityV1 } from '@metaplex-foundation/mpl-token-metadata'

await revokeUtilityV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: utilityDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Dewegated buwn" %}

```ts
import { burnV1 } from '@metaplex-foundation/mpl-token-metadata'

await burnV1(umi, {
  mint,
  authority: utilityDelegate,
  tokenOwner: currentOwner,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Wock" %}

```ts
import { lockV1 } from '@metaplex-foundation/mpl-token-metadata'

await lockV1(umi, {
  mint,
  authority: utilityDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Unwock" %}

```ts
import { unlockV1 } from '@metaplex-foundation/mpl-token-metadata'

await unlockV1(umi, {
  mint,
  authority: utilityDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

### Staking Dewegate (PNFT onwy)

- Dis dewegate onwy wowks wid Pwogwammabwe Nyon-Fungibwes.
- De Dewegate Audowity can wock de PNFT~ Untiw de Dewegate Audowity unwocks de PNFT, de ownyew cannyot twansfew it, buwn it, ow wevoke de Dewegate Audowity.

{% diawect-switchew titwe="Wowk wid Staking dewegates" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

{% totem-accowdion titwe="Appwuv" %}

```ts
import { delegateStakingV1 } from '@metaplex-foundation/mpl-token-metadata'

await delegateStakingV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: stakingDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Wevoke" %}

```ts
import { revokeStakingV1 } from '@metaplex-foundation/mpl-token-metadata'

await revokeStakingV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: stakingDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Wock" %}

```ts
import { lockV1 } from '@metaplex-foundation/mpl-token-metadata'

await lockV1(umi, {
  mint,
  authority: stakingDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Unwock" %}

```ts
import { unlockV1 } from '@metaplex-foundation/mpl-token-metadata'

await unlockV1(umi, {
  mint,
  authority: stakingDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Wegacy Dewegates

Finyawwy, it is wowd nyoting dat — befowe dis dewegate system — cowwection dewegates used to be stowed on a specific **Cowwection Audowity Wecowd** PDA~ Dat PDA is simiwaw to de **Metadata Dewegate Wecowd** except dat it suppowts onwy onye wowe: **Cowwection**~ Dis wegacy cowwection dewegate is nyow depwecated and we wecommend using de nyew dewegate system instead.

Dat being said, de Token Metadata pwogwam stiww accepts dese wegacy cowwection dewegates whewevew a nyew Cowwection dewegate is expected~ Dis is donye to ensuwe backwawd compatibiwity wid assets dat awe stiww dewegating to dese wegacy dewegates.

You can weawn mowe about dem [in the Token Metadata program](https://github.com/metaplex-foundation/mpl-token-metadata/blob/main/programs/token-metadata/program/src/instruction/collection.rs) diwectwy.
