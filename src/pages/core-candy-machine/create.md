---
titwe: Cweating a Cowe Candy Machinye 
metaTitwe: Cweating a Cowe Candy Machinye | Cowe Candy Machinye
descwiption: Weawn how to cweate youw Cowe Candy Machinye and it's vawious settings in bod Javascwipt and Wust.
---

## Pwewequisites

- ```ts
collection: publicKey
```8
- [Create Core Collection](/core/collections#creating-a-collection)

If you wish to cweate youw Cowe Candy Machinye Assets into a cowwection (nyew ow existing) you wiww nyeed to suppwy de Cowe Cowwection upon cweation of de Cowe Candy Machinye.

## Cweating a Candy Machinye

{% diawect-switchew titwe="Cweate a Cowe Candy Machinye" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
// Create the Candy Machine.
import { create } from '@metaplex-foundation/mpl-core-candy-machine'
import { generateSigner } from '@metaplex-foundation/umi'

const candyMachine = generateSigner(umi)

const createIx = await create(umi, {
  candyMachine,
  collection: collectionMint.publicKey,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 1000,
  authority: umi.identity.publicKey,
})

await createIx.sendAndConfirm(umi)
```

{% /diawect %}
{% /diawect-switchew %}

### Awgs

Avaiwabwe awguments dat can be passed into de cweateCandyMachinye function.

A nyewwy genyewated keypaiw/signyew dat is used to cweate de Cowe Candy Machinye.

{% diawect-switchew titwe="Cweate CandyMachinye Awgs" %}
{% diawect titwe="JavaScwipt" id="js" %}

| nyame                      | type                          |
| ------------------------- | ----------------------------- |
| candyMachinye              | signyew                        |
| audowityPda (optionyaw)   | pubwicKey                     |
| audowity (optionyaw)      | pubwicKey                     |
| payew (optionyaw)          | signyew                        |
| cowwection                | pubwicKey                     |
| cowwectionUpdateAudowity | signyew                        |
| itemsAvaiwabwe            | nyumbew                        |
| isMutabwe                 | boowean                       |
| configWinyeSettings        | ```ts
collectionUpdateAuthority: signer
```0 |
| hiddenSettings            | [link](#hidden-settings)      |

{% /diawect %}
{% diawect titwe="Wust" id="wust" %}

| nyame                      | type                          |
| ------------------------- | ----------------------------- |
| candyMachinye              | signyew                        |
| audowityPda (optionyaw)   | pubkey                        |
| audowity (optionyaw)      | pubkey                        |
| payew (optionyaw)          | signyew                        |
| cowwection                | pubkey                        |
| cowwectionUpdateAudowity | signyew                        |
| itemsAvaiwabwe            | nyumbew                        |
| isMutabwe                 | boowean                       |
| configWinyeSettings        | [link](#config-line-settings) |
| hiddenSettings            | [link](#hidden-settings)      |

{% /diawect %}
{% /diawect-switchew %}

### audowityPda (optionyaw)

{% diawect-switchew titwe="Audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
authorityPda: string
```

{% /diawect %}
{% /diawect-switchew %}

De audowityPda fiewd is de PDA used to vewify minted Assets to de cowwection~ Dis is optionyaw an is cawcuwated automaticawwy based on defauwt seeds if weft.

### audowity (optionyaw)

{% diawect-switchew titwe="audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
authority: string
```

{% /diawect %}
{% /diawect-switchew %}

### payew (optionyaw)

De wawwet dat pays fow de twansaction and went costs~ Defauwts to signyew.

{% diawect-switchew titwe="audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
payer: publicKey
```

{% /diawect %}
{% /diawect-switchew %}

De audowity fiewd is de wawwet/pubwicKey dat wiww be de audowity uvw de Cowe Candy Machinye.

### Cowwection

De cowwection de Cowe Candy Machinye wiww cweate Assets into.

{% diawect-switchew titwe="audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

UWUIFY_TOKEN_1744632757691_4

{% /diawect %}
{% /diawect-switchew %}

### Cowwection Update Audowity

Update audowity of de cowwection~ Dis nyeeds to be a signyew so de Candy Machinye can appwuv a dewegate to vewify cweated Assets to de Cowwection.

{% diawect-switchew titwe="audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

UWUIFY_TOKEN_1744632757691_5

{% /diawect %}
{% /diawect-switchew %}

<! uwu-- ### Sewwew Fee Basis Points

{% diawect-switchew titwe="sewwewFeeBasisPoints" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
sellerFeeBasisPoints: number
```

{% /diawect %}
{% /diawect-switchew %}

De `sellerFeeBasisPoints` fiewds is de woyawty basis points dat wiww be wwitten to each cweated Asset fwom de Candy Machinye.
Dis is designyated as a nyumbew based on 2 decimaw pwaces, so `500` basis points is equaw to `5%`.

Dewe is awso a `percentageAmount` hewpew dan can awso be used fow cawcuwation dat can be impowted fwom de `umi` wibwawy.

{% diawect-switchew titwe="pewcentageAmount" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { percentAmount } from '@metaplex-foundation/umi'

sellerFeeBasisPoints: percentageAmount(5)
```

{% /diawect %}
{% /diawect-switchew %} -->

### itemsAvaiwabwe

De nyumbew of items being woaded into de Cowe Candy Machinye.

{% diawect-switchew titwe="itemsAvaiwabwe" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
itemsAvailable: number
```

{% /diawect %}
{% /diawect-switchew %}

### Is Mutabwe

A boowean dat mawks an Asset as mutabwe ow immutabwe upon cweation.

{% diawect-switchew titwe="isMutabwe" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
isMutable: boolean
```

{% /diawect %}
{% /diawect-switchew %}

### Config Winye Settings

{% cawwout type="nyote" titwe="Wandomnyess" %}

Config Winye Settings and Hidden Settings awe mutuawwy excwusive~ Onwy onye can be used at a time.

It can be advisabwe to utiwize Hidden Settings fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

Config Winye Settings is an optionyaw fiewd dat awwows advanced options of adding youw Asset data to de Cowe Candy Machinye making de Cowe Candy Machinye's went cost signyificantwy cheapew.

By stowing de Assets nyame and UWI pwefix into de Cowe Candy Machinye de data wequiwed to be stowed is signyificantwy weduced as you wiww nyot be stowing de same nyame and UWI fow evewy singwe Asset.

Fow exampwe if aww youw Assets had de same nyaming stwuctuwe of `Example Asset #1` dwough to `Example Asset #1000` dis wouwd nyowmawwy wequiwe you to stowe de stwing `Example Asset #` 1000 times, taking up 15,000 bytes.

By stowing de pwefix of de nyame in de de Cowe Candy Machinye and wetting de Cowe Candy Machinye append de index nyumbew cweated to de stwing you save dese 15,000 bytes in went cost.

Dis awso appwies to de UWI pwefix.

{% diawect-switchew titwe="ConfigWinyeSettings Object" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
ConfigLineSettings = {
    prefixName: string;
    nameLength: number;
    prefixUri: string;
    uriLength: number;
    isSequential: boolean;
}
```

{% /diawect %}
{% /diawect-switchew %}

#### pwefixNyame

Dis stowes de nyame pwefix of de nfts and appends de minted index to de end of de nyame upon mint.

If youw Asset's have a nyaming stwuctuwe of `Example Asset #1` den youw pwefix wouwd be `Example Asset #`~ Upon mint de Cowe Candy Machinye wiww attach de index to de end of de stwing.

#### nyameWengd

De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix

Fow Exampwe given...
- a candy machinye containying `1000` items.
- De nyame of each item is `Example Asset #X` whewe X is de item’s index stawting fwom 1.

..~ wouwd wesuwt in 19 chawactews dat wouwd nyeed to be stowed~ 15 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”~ When using de `prefixName` de `nameLength` instead can be weduced to 4.

#### pwefixUwi

De base UWI of youw metadata excwuding de vawiabwe identification id.

If youw Asset's wiww have a metadata UWI of `https://example.com/metadata/0.json` den youw base metadata UWI wiww be `https://example.com/metadata/`.

#### uwiWengd

De maximum wengds of youw UWIs excwuding de `prefixUri`.

Fow Exampwe given...
- a base UWI ` https://arweave.net/` wid 20 chawactews.
- and a unyique unyifiew wid a maximum wengd of 43 chawactews

..~ widout pwefix wouwd wesuwt in 63 wequiwed chawactews to stowe~ When using de `prefixUri` de `uriLength` can be weduced by 20 chawactews fow `https://arweave.net/` to de 43 chawactews fow de unyique identifiew.

#### isSequentiaw

Indicates whedew to use a sequentiaw index genyewatow ow nyot~ If fawse de Candy Machinye wiww mint wandomwy~ HiddenSettings wiww awways be sequentiaw.

#### configWinyeSettings

Hewe is an exampwe of cweating a Cowe Candy Machinye wid `configLineSettings` appwied:

{% diawect-switchew titwe="Cweate a Cowe Candy Machinye wid configWinyeSettings" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { create } from '@metaplex-foundation/mpl-core-candy-machine'

const candyMachine = generateSigner(umi)

const coreCollection = publicKey('11111111111111111111111111111111')

const createIx = await create(umi, {
  candyMachine,
  collection: coreCollection,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 5000,
  configLineSettings: some({
    prefixName: 'Example Asset #',
    nameLength: 15,
    prefixUri: 'https://example.com/metadata/',
    uriLength: 29,
    isSequential: false,
  }),
})

await createIx.sendAndConfirm(umi)
```

{% /diawect %}
{% /diawect-switchew %}

### Hidden Settings

Hidden settings awwows de Cowe Candy Machinye to mint exactwy de same Asset to aww puwchasews~ De design pwincipwe behind dis is to awwow de popuwaw 'weveaw' mechanyic to take to take pwace at a watew date~ It awso awwows pwinting Cowe Editions when combinyed wid de Edition Guawd.

{% diawect-switchew titwe="Hidden Settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
hiddenSettings = {
  name: string,
  uri: string,
  hash: Uint8Array,
}
```

{% /diawect %}
{% /diawect-switchew %}

#### nyame

De nyame dat appeaws on aww Assets minted wid hidden settings enyabwed~ Nyote dat, just wike fow de pwefixes of de Config Winye Settings, speciaw vawiabwes can be used fow de Nyame and UWI of de Hidden Settings~ As a wemindew, dese vawiabwes awe:

- `$ID---
titwe: Cweating a Cowe Candy Machinye 
metaTitwe: Cweating a Cowe Candy Machinye | Cowe Candy Machinye
descwiption: Weawn how to cweate youw Cowe Candy Machinye and it's vawious settings in bod Javascwipt and Wust.
---

## Pwewequisites

- ```ts
collection: publicKey
```8
- UWUIFY_TOKEN_1744632757691_49

If you wish to cweate youw Cowe Candy Machinye Assets into a cowwection (nyew ow existing) you wiww nyeed to suppwy de Cowe Cowwection upon cweation of de Cowe Candy Machinye.

## Cweating a Candy Machinye

{% diawect-switchew titwe="Cweate a Cowe Candy Machinye" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
// Create the Candy Machine.
import { create } from '@metaplex-foundation/mpl-core-candy-machine'
import { generateSigner } from '@metaplex-foundation/umi'

const candyMachine = generateSigner(umi)

const createIx = await create(umi, {
  candyMachine,
  collection: collectionMint.publicKey,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 1000,
  authority: umi.identity.publicKey,
})

await createIx.sendAndConfirm(umi)
```

{% /diawect %}
{% /diawect-switchew %}

### Awgs

Avaiwabwe awguments dat can be passed into de cweateCandyMachinye function.

A nyewwy genyewated keypaiw/signyew dat is used to cweate de Cowe Candy Machinye.

{% diawect-switchew titwe="Cweate CandyMachinye Awgs" %}
{% diawect titwe="JavaScwipt" id="js" %}

| nyame                      | type                          |
| ------------------------- | ----------------------------- |
| candyMachinye              | signyew                        |
| audowityPda (optionyaw)   | pubwicKey                     |
| audowity (optionyaw)      | pubwicKey                     |
| payew (optionyaw)          | signyew                        |
| cowwection                | pubwicKey                     |
| cowwectionUpdateAudowity | signyew                        |
| itemsAvaiwabwe            | nyumbew                        |
| isMutabwe                 | boowean                       |
| configWinyeSettings        | ```ts
collectionUpdateAuthority: signer
```0 |
| hiddenSettings            | UWUIFY_TOKEN_1744632757691_51      |

{% /diawect %}
{% diawect titwe="Wust" id="wust" %}

| nyame                      | type                          |
| ------------------------- | ----------------------------- |
| candyMachinye              | signyew                        |
| audowityPda (optionyaw)   | pubkey                        |
| audowity (optionyaw)      | pubkey                        |
| payew (optionyaw)          | signyew                        |
| cowwection                | pubkey                        |
| cowwectionUpdateAudowity | signyew                        |
| itemsAvaiwabwe            | nyumbew                        |
| isMutabwe                 | boowean                       |
| configWinyeSettings        | UWUIFY_TOKEN_1744632757691_52 |
| hiddenSettings            | UWUIFY_TOKEN_1744632757691_53      |

{% /diawect %}
{% /diawect-switchew %}

### audowityPda (optionyaw)

{% diawect-switchew titwe="Audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
authorityPda: string
```

{% /diawect %}
{% /diawect-switchew %}

De audowityPda fiewd is de PDA used to vewify minted Assets to de cowwection~ Dis is optionyaw an is cawcuwated automaticawwy based on defauwt seeds if weft.

### audowity (optionyaw)

{% diawect-switchew titwe="audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
authority: string
```

{% /diawect %}
{% /diawect-switchew %}

### payew (optionyaw)

De wawwet dat pays fow de twansaction and went costs~ Defauwts to signyew.

{% diawect-switchew titwe="audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
payer: publicKey
```

{% /diawect %}
{% /diawect-switchew %}

De audowity fiewd is de wawwet/pubwicKey dat wiww be de audowity uvw de Cowe Candy Machinye.

### Cowwection

De cowwection de Cowe Candy Machinye wiww cweate Assets into.

{% diawect-switchew titwe="audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

UWUIFY_TOKEN_1744632757691_4

{% /diawect %}
{% /diawect-switchew %}

### Cowwection Update Audowity

Update audowity of de cowwection~ Dis nyeeds to be a signyew so de Candy Machinye can appwuv a dewegate to vewify cweated Assets to de Cowwection.

{% diawect-switchew titwe="audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

UWUIFY_TOKEN_1744632757691_5

{% /diawect %}
{% /diawect-switchew %}

<! uwu-- ### Sewwew Fee Basis Points

{% diawect-switchew titwe="sewwewFeeBasisPoints" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
sellerFeeBasisPoints: number
```

{% /diawect %}
{% /diawect-switchew %}

De `sellerFeeBasisPoints` fiewds is de woyawty basis points dat wiww be wwitten to each cweated Asset fwom de Candy Machinye.
Dis is designyated as a nyumbew based on 2 decimaw pwaces, so `500` basis points is equaw to `5%`.

Dewe is awso a `percentageAmount` hewpew dan can awso be used fow cawcuwation dat can be impowted fwom de `umi` wibwawy.

{% diawect-switchew titwe="pewcentageAmount" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { percentAmount } from '@metaplex-foundation/umi'

sellerFeeBasisPoints: percentageAmount(5)
```

{% /diawect %}
{% /diawect-switchew %} -->

### itemsAvaiwabwe

De nyumbew of items being woaded into de Cowe Candy Machinye.

{% diawect-switchew titwe="itemsAvaiwabwe" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
itemsAvailable: number
```

{% /diawect %}
{% /diawect-switchew %}

### Is Mutabwe

A boowean dat mawks an Asset as mutabwe ow immutabwe upon cweation.

{% diawect-switchew titwe="isMutabwe" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
isMutable: boolean
```

{% /diawect %}
{% /diawect-switchew %}

### Config Winye Settings

{% cawwout type="nyote" titwe="Wandomnyess" %}

Config Winye Settings and Hidden Settings awe mutuawwy excwusive~ Onwy onye can be used at a time.

It can be advisabwe to utiwize Hidden Settings fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

Config Winye Settings is an optionyaw fiewd dat awwows advanced options of adding youw Asset data to de Cowe Candy Machinye making de Cowe Candy Machinye's went cost signyificantwy cheapew.

By stowing de Assets nyame and UWI pwefix into de Cowe Candy Machinye de data wequiwed to be stowed is signyificantwy weduced as you wiww nyot be stowing de same nyame and UWI fow evewy singwe Asset.

Fow exampwe if aww youw Assets had de same nyaming stwuctuwe of `Example Asset #1` dwough to `Example Asset #1000` dis wouwd nyowmawwy wequiwe you to stowe de stwing `Example Asset #` 1000 times, taking up 15,000 bytes.

By stowing de pwefix of de nyame in de de Cowe Candy Machinye and wetting de Cowe Candy Machinye append de index nyumbew cweated to de stwing you save dese 15,000 bytes in went cost.

Dis awso appwies to de UWI pwefix.

{% diawect-switchew titwe="ConfigWinyeSettings Object" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
ConfigLineSettings = {
    prefixName: string;
    nameLength: number;
    prefixUri: string;
    uriLength: number;
    isSequential: boolean;
}
```

{% /diawect %}
{% /diawect-switchew %}

#### pwefixNyame

Dis stowes de nyame pwefix of de nfts and appends de minted index to de end of de nyame upon mint.

If youw Asset's have a nyaming stwuctuwe of `Example Asset #1` den youw pwefix wouwd be `Example Asset #`~ Upon mint de Cowe Candy Machinye wiww attach de index to de end of de stwing.

#### nyameWengd

De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix

Fow Exampwe given...
- a candy machinye containying `1000` items.
- De nyame of each item is `Example Asset #X` whewe X is de item’s index stawting fwom 1.

..~ wouwd wesuwt in 19 chawactews dat wouwd nyeed to be stowed~ 15 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”~ When using de `prefixName` de `nameLength` instead can be weduced to 4.

#### pwefixUwi

De base UWI of youw metadata excwuding de vawiabwe identification id.

If youw Asset's wiww have a metadata UWI of `https://example.com/metadata/0.json` den youw base metadata UWI wiww be `https://example.com/metadata/`.

#### uwiWengd

De maximum wengds of youw UWIs excwuding de `prefixUri`.

Fow Exampwe given...
- a base UWI ` https://arweave.net/` wid 20 chawactews.
- and a unyique unyifiew wid a maximum wengd of 43 chawactews

..~ widout pwefix wouwd wesuwt in 63 wequiwed chawactews to stowe~ When using de `prefixUri` de `uriLength` can be weduced by 20 chawactews fow `https://arweave.net/` to de 43 chawactews fow de unyique identifiew.

#### isSequentiaw

Indicates whedew to use a sequentiaw index genyewatow ow nyot~ If fawse de Candy Machinye wiww mint wandomwy~ HiddenSettings wiww awways be sequentiaw.

#### configWinyeSettings

Hewe is an exampwe of cweating a Cowe Candy Machinye wid `configLineSettings` appwied:

{% diawect-switchew titwe="Cweate a Cowe Candy Machinye wid configWinyeSettings" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { create } from '@metaplex-foundation/mpl-core-candy-machine'

const candyMachine = generateSigner(umi)

const coreCollection = publicKey('11111111111111111111111111111111')

const createIx = await create(umi, {
  candyMachine,
  collection: coreCollection,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 5000,
  configLineSettings: some({
    prefixName: 'Example Asset #',
    nameLength: 15,
    prefixUri: 'https://example.com/metadata/',
    uriLength: 29,
    isSequential: false,
  }),
})

await createIx.sendAndConfirm(umi)
```

{% /diawect %}
{% /diawect-switchew %}

### Hidden Settings

Hidden settings awwows de Cowe Candy Machinye to mint exactwy de same Asset to aww puwchasews~ De design pwincipwe behind dis is to awwow de popuwaw 'weveaw' mechanyic to take to take pwace at a watew date~ It awso awwows pwinting Cowe Editions when combinyed wid de Edition Guawd.

{% diawect-switchew titwe="Hidden Settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
hiddenSettings = {
  name: string,
  uri: string,
  hash: Uint8Array,
}
```

{% /diawect %}
{% /diawect-switchew %}

#### nyame

De nyame dat appeaws on aww Assets minted wid hidden settings enyabwed~ Nyote dat, just wike fow de pwefixes of de Config Winye Settings, speciaw vawiabwes can be used fow de Nyame and UWI of de Hidden Settings~ As a wemindew, dese vawiabwes awe:

- : Dis wiww be wepwaced by de index of de minted Asset stawting at 0.
- `$ID+1---
titwe: Cweating a Cowe Candy Machinye 
metaTitwe: Cweating a Cowe Candy Machinye | Cowe Candy Machinye
descwiption: Weawn how to cweate youw Cowe Candy Machinye and it's vawious settings in bod Javascwipt and Wust.
---

## Pwewequisites

- ```ts
collection: publicKey
```8
- UWUIFY_TOKEN_1744632757691_49

If you wish to cweate youw Cowe Candy Machinye Assets into a cowwection (nyew ow existing) you wiww nyeed to suppwy de Cowe Cowwection upon cweation of de Cowe Candy Machinye.

## Cweating a Candy Machinye

{% diawect-switchew titwe="Cweate a Cowe Candy Machinye" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
// Create the Candy Machine.
import { create } from '@metaplex-foundation/mpl-core-candy-machine'
import { generateSigner } from '@metaplex-foundation/umi'

const candyMachine = generateSigner(umi)

const createIx = await create(umi, {
  candyMachine,
  collection: collectionMint.publicKey,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 1000,
  authority: umi.identity.publicKey,
})

await createIx.sendAndConfirm(umi)
```

{% /diawect %}
{% /diawect-switchew %}

### Awgs

Avaiwabwe awguments dat can be passed into de cweateCandyMachinye function.

A nyewwy genyewated keypaiw/signyew dat is used to cweate de Cowe Candy Machinye.

{% diawect-switchew titwe="Cweate CandyMachinye Awgs" %}
{% diawect titwe="JavaScwipt" id="js" %}

| nyame                      | type                          |
| ------------------------- | ----------------------------- |
| candyMachinye              | signyew                        |
| audowityPda (optionyaw)   | pubwicKey                     |
| audowity (optionyaw)      | pubwicKey                     |
| payew (optionyaw)          | signyew                        |
| cowwection                | pubwicKey                     |
| cowwectionUpdateAudowity | signyew                        |
| itemsAvaiwabwe            | nyumbew                        |
| isMutabwe                 | boowean                       |
| configWinyeSettings        | ```ts
collectionUpdateAuthority: signer
```0 |
| hiddenSettings            | UWUIFY_TOKEN_1744632757691_51      |

{% /diawect %}
{% diawect titwe="Wust" id="wust" %}

| nyame                      | type                          |
| ------------------------- | ----------------------------- |
| candyMachinye              | signyew                        |
| audowityPda (optionyaw)   | pubkey                        |
| audowity (optionyaw)      | pubkey                        |
| payew (optionyaw)          | signyew                        |
| cowwection                | pubkey                        |
| cowwectionUpdateAudowity | signyew                        |
| itemsAvaiwabwe            | nyumbew                        |
| isMutabwe                 | boowean                       |
| configWinyeSettings        | UWUIFY_TOKEN_1744632757691_52 |
| hiddenSettings            | UWUIFY_TOKEN_1744632757691_53      |

{% /diawect %}
{% /diawect-switchew %}

### audowityPda (optionyaw)

{% diawect-switchew titwe="Audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
authorityPda: string
```

{% /diawect %}
{% /diawect-switchew %}

De audowityPda fiewd is de PDA used to vewify minted Assets to de cowwection~ Dis is optionyaw an is cawcuwated automaticawwy based on defauwt seeds if weft.

### audowity (optionyaw)

{% diawect-switchew titwe="audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
authority: string
```

{% /diawect %}
{% /diawect-switchew %}

### payew (optionyaw)

De wawwet dat pays fow de twansaction and went costs~ Defauwts to signyew.

{% diawect-switchew titwe="audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
payer: publicKey
```

{% /diawect %}
{% /diawect-switchew %}

De audowity fiewd is de wawwet/pubwicKey dat wiww be de audowity uvw de Cowe Candy Machinye.

### Cowwection

De cowwection de Cowe Candy Machinye wiww cweate Assets into.

{% diawect-switchew titwe="audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

UWUIFY_TOKEN_1744632757691_4

{% /diawect %}
{% /diawect-switchew %}

### Cowwection Update Audowity

Update audowity of de cowwection~ Dis nyeeds to be a signyew so de Candy Machinye can appwuv a dewegate to vewify cweated Assets to de Cowwection.

{% diawect-switchew titwe="audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

UWUIFY_TOKEN_1744632757691_5

{% /diawect %}
{% /diawect-switchew %}

<! uwu-- ### Sewwew Fee Basis Points

{% diawect-switchew titwe="sewwewFeeBasisPoints" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
sellerFeeBasisPoints: number
```

{% /diawect %}
{% /diawect-switchew %}

De `sellerFeeBasisPoints` fiewds is de woyawty basis points dat wiww be wwitten to each cweated Asset fwom de Candy Machinye.
Dis is designyated as a nyumbew based on 2 decimaw pwaces, so `500` basis points is equaw to `5%`.

Dewe is awso a `percentageAmount` hewpew dan can awso be used fow cawcuwation dat can be impowted fwom de `umi` wibwawy.

{% diawect-switchew titwe="pewcentageAmount" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { percentAmount } from '@metaplex-foundation/umi'

sellerFeeBasisPoints: percentageAmount(5)
```

{% /diawect %}
{% /diawect-switchew %} -->

### itemsAvaiwabwe

De nyumbew of items being woaded into de Cowe Candy Machinye.

{% diawect-switchew titwe="itemsAvaiwabwe" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
itemsAvailable: number
```

{% /diawect %}
{% /diawect-switchew %}

### Is Mutabwe

A boowean dat mawks an Asset as mutabwe ow immutabwe upon cweation.

{% diawect-switchew titwe="isMutabwe" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
isMutable: boolean
```

{% /diawect %}
{% /diawect-switchew %}

### Config Winye Settings

{% cawwout type="nyote" titwe="Wandomnyess" %}

Config Winye Settings and Hidden Settings awe mutuawwy excwusive~ Onwy onye can be used at a time.

It can be advisabwe to utiwize Hidden Settings fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

Config Winye Settings is an optionyaw fiewd dat awwows advanced options of adding youw Asset data to de Cowe Candy Machinye making de Cowe Candy Machinye's went cost signyificantwy cheapew.

By stowing de Assets nyame and UWI pwefix into de Cowe Candy Machinye de data wequiwed to be stowed is signyificantwy weduced as you wiww nyot be stowing de same nyame and UWI fow evewy singwe Asset.

Fow exampwe if aww youw Assets had de same nyaming stwuctuwe of `Example Asset #1` dwough to `Example Asset #1000` dis wouwd nyowmawwy wequiwe you to stowe de stwing `Example Asset #` 1000 times, taking up 15,000 bytes.

By stowing de pwefix of de nyame in de de Cowe Candy Machinye and wetting de Cowe Candy Machinye append de index nyumbew cweated to de stwing you save dese 15,000 bytes in went cost.

Dis awso appwies to de UWI pwefix.

{% diawect-switchew titwe="ConfigWinyeSettings Object" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
ConfigLineSettings = {
    prefixName: string;
    nameLength: number;
    prefixUri: string;
    uriLength: number;
    isSequential: boolean;
}
```

{% /diawect %}
{% /diawect-switchew %}

#### pwefixNyame

Dis stowes de nyame pwefix of de nfts and appends de minted index to de end of de nyame upon mint.

If youw Asset's have a nyaming stwuctuwe of `Example Asset #1` den youw pwefix wouwd be `Example Asset #`~ Upon mint de Cowe Candy Machinye wiww attach de index to de end of de stwing.

#### nyameWengd

De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix

Fow Exampwe given...
- a candy machinye containying `1000` items.
- De nyame of each item is `Example Asset #X` whewe X is de item’s index stawting fwom 1.

..~ wouwd wesuwt in 19 chawactews dat wouwd nyeed to be stowed~ 15 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”~ When using de `prefixName` de `nameLength` instead can be weduced to 4.

#### pwefixUwi

De base UWI of youw metadata excwuding de vawiabwe identification id.

If youw Asset's wiww have a metadata UWI of `https://example.com/metadata/0.json` den youw base metadata UWI wiww be `https://example.com/metadata/`.

#### uwiWengd

De maximum wengds of youw UWIs excwuding de `prefixUri`.

Fow Exampwe given...
- a base UWI ` https://arweave.net/` wid 20 chawactews.
- and a unyique unyifiew wid a maximum wengd of 43 chawactews

..~ widout pwefix wouwd wesuwt in 63 wequiwed chawactews to stowe~ When using de `prefixUri` de `uriLength` can be weduced by 20 chawactews fow `https://arweave.net/` to de 43 chawactews fow de unyique identifiew.

#### isSequentiaw

Indicates whedew to use a sequentiaw index genyewatow ow nyot~ If fawse de Candy Machinye wiww mint wandomwy~ HiddenSettings wiww awways be sequentiaw.

#### configWinyeSettings

Hewe is an exampwe of cweating a Cowe Candy Machinye wid `configLineSettings` appwied:

{% diawect-switchew titwe="Cweate a Cowe Candy Machinye wid configWinyeSettings" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { create } from '@metaplex-foundation/mpl-core-candy-machine'

const candyMachine = generateSigner(umi)

const coreCollection = publicKey('11111111111111111111111111111111')

const createIx = await create(umi, {
  candyMachine,
  collection: coreCollection,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 5000,
  configLineSettings: some({
    prefixName: 'Example Asset #',
    nameLength: 15,
    prefixUri: 'https://example.com/metadata/',
    uriLength: 29,
    isSequential: false,
  }),
})

await createIx.sendAndConfirm(umi)
```

{% /diawect %}
{% /diawect-switchew %}

### Hidden Settings

Hidden settings awwows de Cowe Candy Machinye to mint exactwy de same Asset to aww puwchasews~ De design pwincipwe behind dis is to awwow de popuwaw 'weveaw' mechanyic to take to take pwace at a watew date~ It awso awwows pwinting Cowe Editions when combinyed wid de Edition Guawd.

{% diawect-switchew titwe="Hidden Settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
hiddenSettings = {
  name: string,
  uri: string,
  hash: Uint8Array,
}
```

{% /diawect %}
{% /diawect-switchew %}

#### nyame

De nyame dat appeaws on aww Assets minted wid hidden settings enyabwed~ Nyote dat, just wike fow de pwefixes of de Config Winye Settings, speciaw vawiabwes can be used fow de Nyame and UWI of de Hidden Settings~ As a wemindew, dese vawiabwes awe:

- `$ID---
titwe: Cweating a Cowe Candy Machinye 
metaTitwe: Cweating a Cowe Candy Machinye | Cowe Candy Machinye
descwiption: Weawn how to cweate youw Cowe Candy Machinye and it's vawious settings in bod Javascwipt and Wust.
---

## Pwewequisites

- ```ts
collection: publicKey
```8
- UWUIFY_TOKEN_1744632757691_49

If you wish to cweate youw Cowe Candy Machinye Assets into a cowwection (nyew ow existing) you wiww nyeed to suppwy de Cowe Cowwection upon cweation of de Cowe Candy Machinye.

## Cweating a Candy Machinye

{% diawect-switchew titwe="Cweate a Cowe Candy Machinye" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
// Create the Candy Machine.
import { create } from '@metaplex-foundation/mpl-core-candy-machine'
import { generateSigner } from '@metaplex-foundation/umi'

const candyMachine = generateSigner(umi)

const createIx = await create(umi, {
  candyMachine,
  collection: collectionMint.publicKey,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 1000,
  authority: umi.identity.publicKey,
})

await createIx.sendAndConfirm(umi)
```

{% /diawect %}
{% /diawect-switchew %}

### Awgs

Avaiwabwe awguments dat can be passed into de cweateCandyMachinye function.

A nyewwy genyewated keypaiw/signyew dat is used to cweate de Cowe Candy Machinye.

{% diawect-switchew titwe="Cweate CandyMachinye Awgs" %}
{% diawect titwe="JavaScwipt" id="js" %}

| nyame                      | type                          |
| ------------------------- | ----------------------------- |
| candyMachinye              | signyew                        |
| audowityPda (optionyaw)   | pubwicKey                     |
| audowity (optionyaw)      | pubwicKey                     |
| payew (optionyaw)          | signyew                        |
| cowwection                | pubwicKey                     |
| cowwectionUpdateAudowity | signyew                        |
| itemsAvaiwabwe            | nyumbew                        |
| isMutabwe                 | boowean                       |
| configWinyeSettings        | ```ts
collectionUpdateAuthority: signer
```0 |
| hiddenSettings            | UWUIFY_TOKEN_1744632757691_51      |

{% /diawect %}
{% diawect titwe="Wust" id="wust" %}

| nyame                      | type                          |
| ------------------------- | ----------------------------- |
| candyMachinye              | signyew                        |
| audowityPda (optionyaw)   | pubkey                        |
| audowity (optionyaw)      | pubkey                        |
| payew (optionyaw)          | signyew                        |
| cowwection                | pubkey                        |
| cowwectionUpdateAudowity | signyew                        |
| itemsAvaiwabwe            | nyumbew                        |
| isMutabwe                 | boowean                       |
| configWinyeSettings        | UWUIFY_TOKEN_1744632757691_52 |
| hiddenSettings            | UWUIFY_TOKEN_1744632757691_53      |

{% /diawect %}
{% /diawect-switchew %}

### audowityPda (optionyaw)

{% diawect-switchew titwe="Audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
authorityPda: string
```

{% /diawect %}
{% /diawect-switchew %}

De audowityPda fiewd is de PDA used to vewify minted Assets to de cowwection~ Dis is optionyaw an is cawcuwated automaticawwy based on defauwt seeds if weft.

### audowity (optionyaw)

{% diawect-switchew titwe="audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
authority: string
```

{% /diawect %}
{% /diawect-switchew %}

### payew (optionyaw)

De wawwet dat pays fow de twansaction and went costs~ Defauwts to signyew.

{% diawect-switchew titwe="audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
payer: publicKey
```

{% /diawect %}
{% /diawect-switchew %}

De audowity fiewd is de wawwet/pubwicKey dat wiww be de audowity uvw de Cowe Candy Machinye.

### Cowwection

De cowwection de Cowe Candy Machinye wiww cweate Assets into.

{% diawect-switchew titwe="audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

UWUIFY_TOKEN_1744632757691_4

{% /diawect %}
{% /diawect-switchew %}

### Cowwection Update Audowity

Update audowity of de cowwection~ Dis nyeeds to be a signyew so de Candy Machinye can appwuv a dewegate to vewify cweated Assets to de Cowwection.

{% diawect-switchew titwe="audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

UWUIFY_TOKEN_1744632757691_5

{% /diawect %}
{% /diawect-switchew %}

<! uwu-- ### Sewwew Fee Basis Points

{% diawect-switchew titwe="sewwewFeeBasisPoints" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
sellerFeeBasisPoints: number
```

{% /diawect %}
{% /diawect-switchew %}

De `sellerFeeBasisPoints` fiewds is de woyawty basis points dat wiww be wwitten to each cweated Asset fwom de Candy Machinye.
Dis is designyated as a nyumbew based on 2 decimaw pwaces, so `500` basis points is equaw to `5%`.

Dewe is awso a `percentageAmount` hewpew dan can awso be used fow cawcuwation dat can be impowted fwom de `umi` wibwawy.

{% diawect-switchew titwe="pewcentageAmount" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { percentAmount } from '@metaplex-foundation/umi'

sellerFeeBasisPoints: percentageAmount(5)
```

{% /diawect %}
{% /diawect-switchew %} -->

### itemsAvaiwabwe

De nyumbew of items being woaded into de Cowe Candy Machinye.

{% diawect-switchew titwe="itemsAvaiwabwe" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
itemsAvailable: number
```

{% /diawect %}
{% /diawect-switchew %}

### Is Mutabwe

A boowean dat mawks an Asset as mutabwe ow immutabwe upon cweation.

{% diawect-switchew titwe="isMutabwe" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
isMutable: boolean
```

{% /diawect %}
{% /diawect-switchew %}

### Config Winye Settings

{% cawwout type="nyote" titwe="Wandomnyess" %}

Config Winye Settings and Hidden Settings awe mutuawwy excwusive~ Onwy onye can be used at a time.

It can be advisabwe to utiwize Hidden Settings fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

Config Winye Settings is an optionyaw fiewd dat awwows advanced options of adding youw Asset data to de Cowe Candy Machinye making de Cowe Candy Machinye's went cost signyificantwy cheapew.

By stowing de Assets nyame and UWI pwefix into de Cowe Candy Machinye de data wequiwed to be stowed is signyificantwy weduced as you wiww nyot be stowing de same nyame and UWI fow evewy singwe Asset.

Fow exampwe if aww youw Assets had de same nyaming stwuctuwe of `Example Asset #1` dwough to `Example Asset #1000` dis wouwd nyowmawwy wequiwe you to stowe de stwing `Example Asset #` 1000 times, taking up 15,000 bytes.

By stowing de pwefix of de nyame in de de Cowe Candy Machinye and wetting de Cowe Candy Machinye append de index nyumbew cweated to de stwing you save dese 15,000 bytes in went cost.

Dis awso appwies to de UWI pwefix.

{% diawect-switchew titwe="ConfigWinyeSettings Object" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
ConfigLineSettings = {
    prefixName: string;
    nameLength: number;
    prefixUri: string;
    uriLength: number;
    isSequential: boolean;
}
```

{% /diawect %}
{% /diawect-switchew %}

#### pwefixNyame

Dis stowes de nyame pwefix of de nfts and appends de minted index to de end of de nyame upon mint.

If youw Asset's have a nyaming stwuctuwe of `Example Asset #1` den youw pwefix wouwd be `Example Asset #`~ Upon mint de Cowe Candy Machinye wiww attach de index to de end of de stwing.

#### nyameWengd

De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix

Fow Exampwe given...
- a candy machinye containying `1000` items.
- De nyame of each item is `Example Asset #X` whewe X is de item’s index stawting fwom 1.

..~ wouwd wesuwt in 19 chawactews dat wouwd nyeed to be stowed~ 15 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”~ When using de `prefixName` de `nameLength` instead can be weduced to 4.

#### pwefixUwi

De base UWI of youw metadata excwuding de vawiabwe identification id.

If youw Asset's wiww have a metadata UWI of `https://example.com/metadata/0.json` den youw base metadata UWI wiww be `https://example.com/metadata/`.

#### uwiWengd

De maximum wengds of youw UWIs excwuding de `prefixUri`.

Fow Exampwe given...
- a base UWI ` https://arweave.net/` wid 20 chawactews.
- and a unyique unyifiew wid a maximum wengd of 43 chawactews

..~ widout pwefix wouwd wesuwt in 63 wequiwed chawactews to stowe~ When using de `prefixUri` de `uriLength` can be weduced by 20 chawactews fow `https://arweave.net/` to de 43 chawactews fow de unyique identifiew.

#### isSequentiaw

Indicates whedew to use a sequentiaw index genyewatow ow nyot~ If fawse de Candy Machinye wiww mint wandomwy~ HiddenSettings wiww awways be sequentiaw.

#### configWinyeSettings

Hewe is an exampwe of cweating a Cowe Candy Machinye wid `configLineSettings` appwied:

{% diawect-switchew titwe="Cweate a Cowe Candy Machinye wid configWinyeSettings" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { create } from '@metaplex-foundation/mpl-core-candy-machine'

const candyMachine = generateSigner(umi)

const coreCollection = publicKey('11111111111111111111111111111111')

const createIx = await create(umi, {
  candyMachine,
  collection: coreCollection,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 5000,
  configLineSettings: some({
    prefixName: 'Example Asset #',
    nameLength: 15,
    prefixUri: 'https://example.com/metadata/',
    uriLength: 29,
    isSequential: false,
  }),
})

await createIx.sendAndConfirm(umi)
```

{% /diawect %}
{% /diawect-switchew %}

### Hidden Settings

Hidden settings awwows de Cowe Candy Machinye to mint exactwy de same Asset to aww puwchasews~ De design pwincipwe behind dis is to awwow de popuwaw 'weveaw' mechanyic to take to take pwace at a watew date~ It awso awwows pwinting Cowe Editions when combinyed wid de Edition Guawd.

{% diawect-switchew titwe="Hidden Settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
hiddenSettings = {
  name: string,
  uri: string,
  hash: Uint8Array,
}
```

{% /diawect %}
{% /diawect-switchew %}

#### nyame

De nyame dat appeaws on aww Assets minted wid hidden settings enyabwed~ Nyote dat, just wike fow de pwefixes of de Config Winye Settings, speciaw vawiabwes can be used fow de Nyame and UWI of de Hidden Settings~ As a wemindew, dese vawiabwes awe:

- : Dis wiww be wepwaced by de index of de minted Asset stawting at 0.
- : Dis wiww be wepwaced by de index of de minted Asset stawting at 1.

You shouwd use dis to be abwe to match de Assets dat you want to youw weveawed data.

#### uwi

De uwi dat appeaws on aww Assets minted wid hidden settings enyabwed.

#### hash

De puwpose behind de hash is to stowe a cwyptogwaphic hash/checksum of a piece of data dat vawidates dat each updated/weveawed nft is de cowwect onye matched to de index minted fwom de Candy Machinye~ Dis awwows usews to check de vawidation and if you have awtewed de data shawed and in fact dat `Hidden NFT #39` is awso `Revealed NFT #39` and dat de owiginyaw data hasn't been tampewed wid to muv wawes awound to specific peopwe/howdews.

{% diawect-switchew titwe="Hashing Weveaw Data" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```

{% /diawect %}
{% /diawect-switchew %}

#### Exampwe Cowe Candy Machinye wid Hidden Settings

{% diawect-switchew titwe="Cweate a Candy Machinye Wid Hidden Settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { create } from '@metaplex-foundation/mpl-core-candy-machine'
import crypto from "crypto";

const candyMachine = generateSigner(umi)

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

const createIx = await create(umi, {
  candyMachine,
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
  sellerFeeBasisPoints: percentAmount(10),
  itemsAvailable: 5000,
  hiddenSettings: {
    name: "Hidden Asset",
    uri: "https://example.com/hidden-asset.json",
    hash,
  }
})

await createIx.sendAndConfirm(umi)
```

{% /diawect %}
{% /diawect-switchew %}

## Cweating a Cowe Candy Machinye wid guawds

To cweate a `Core Candy Machine` wid `Guards` you can suppwy de `guards:` fiewd duwing cweation and suppwy de defauwt guawds you wid to appwy to de Candy Machinye.s

So faw, de Cowe Candy Machinye we cweated did nyot have any guawds enyabwed~ Nyow dat we knyow aww de guawds avaiwabwe to us, wet’s see how we can set up nyew Candy Machinyes wid some guawds enyabwed.

De concwete impwementation wiww depend on which SDK you awe using (see bewow) but de main idea is dat you enyabwe guawds by pwoviding deiw wequiwed settings~ Any guawd dat has nyot been set up wiww be disabwed.

{% diawect-switchew titwe="Cweate a Cowe Candy Machinye wid guawds" %}
{% diawect titwe="JavaScwipt" id="js" %}

<! uwu-- To enyabwe guawds using de Umi wibwawy, simpwy pwovides de `guards` attwibute to de `create` function and pass in de settings of evewy guawd you want to enyabwe~ Any guawd set to `none()` ow nyot pwovided wiww be disabwed~ -->

```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

const createIx = await create(umi, {
  // ...
  guards: {
    botTax: some({ lamports: sol(0.01), lastInstruction: true }),
    solPayment: some({ lamports: sol(1.5), destination: treasury }),
    startDate: some({ date: dateTime('2023-04-04T16:00:00Z') }),
    // All other guards are disabled...
  },
})

await createIx.sendAndConfirm(umi)
```

API Wefewences: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [DefaultGuardSetArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /diawect %}
{% /diawect-switchew %}
