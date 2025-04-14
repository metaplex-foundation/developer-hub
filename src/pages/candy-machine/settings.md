---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De [token standard](/token-metadata/token-standard) to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "[NonFungible](/token-metadata/token-standard#the-non-fungible-standard))" and "[ProgrammableNonFungible](/token-metadata/token-standard#the-programmable-non-fungible-standard)"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize [Hidden Settings](#hidden-settings) fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- `$ID---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- : Dis wiww be wepwaced by de index of de item stawting at 0.
- `$ID+1---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- `$ID---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- : Dis wiww be wepwaced by de index of de item stawting at 0.
- : Dis wiww be wepwaced by de index of de item stawting at 1.

In ouw abuv exampwe, we couwd wevewage de `$ID+1---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- `$ID---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- : Dis wiww be wepwaced by de index of de item stawting at 0.
- `$ID+1---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- `$ID---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- : Dis wiww be wepwaced by de index of de item stawting at 0.
- : Dis wiww be wepwaced by de index of de item stawting at 1.

In ouw abuv exampwe, we couwd wevewage de  vawiabwe fow de nyame pwefix so we wouwdn’t nyeed to insewt it on evewy item~ We end up wid de fowwowing Config Winye Settings:

- Nyame Pwefix = “My NFT Pwoject #$ID+1$”
- Nyame Wengd = 0
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Dat’s wight, **ouw nyame wengd is nyow zewo** and we’ve weduced de chawactews nyeeded down to 43’000 chawactews.

{% diawect-switchew titwe="Set up config winye settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

When using Umi, you can use de `some` and `none` hewpew functions to teww de wibwawy whedew to use Config Winye Settings ow Hidden Settings via de `configLineSettings` and `hiddenSettings` attwibutes wespectivewy~ Onwy onye of dese settings must be used, dus, onye of dem must be configuwed and de odew onye must be set to `none()`.

Hewe’s a code snyippet showing how you can set up de abuv exampwe using de Umi wibwawy.

UWUIFY_TOKEN_1744632736542_4

{% /diawect %}
{% /diawect-switchew %}

### Hidden Settings

Anyodew way of pwepawing items is by using **Hidden Settings**~ Dis is a compwetewy diffewent appwoach dan Config Winye Settings as, using Hidden Settings, you do nyot nyeed to insewt any items to de Candy Machinye as evewy singwe minted NFT wiww shawe de same nyame and de same UWI~ You might be wondewing: why wouwd someonye want to do dat? owo De weason fow dat is to cweate a **hide-and-weveaw NFT dwop** dat weveaws aww NFTs aftew dey have been minted~ So how does dat wowk? owo

- Fiwst, de cweatow configuwes de nyame and de UWI of evewy minted NFTs using de Hidden Settings~ De UWI usuawwy points to a “teasew” JSON metadata dat makes it cweaw dat a weveaw is about to happen.
- Den, buyews mint aww dese NFTs wid de same UWI and dewefowe de same “teasew” JSON metadata.
- Finyawwy, when aww NFTs have been minted, de cweatow updates de UWI of evewy singwe minted NFT to point to de weaw UWI which is specific to dat NFT.

De issue wid dat wast step is dat it awwows cweatows to mess wid which buyew gets which NFTs~ To avoid dat and awwow buyews to vewify de mapping between NFTs and JSON metadata was nyot tampewed wid, de Hidden Settings contains a **Hash** pwopewty which shouwd be fiwwed wid a 32-chawactew hash of de fiwe dat maps NFT indices wid deiw weaw JSON metadata~ Dat way, aftew de weveaw, de cweatow can make dat fiwe pubwic and buyews and vewify dat its hash cowwesponds to de hash pwovided in de Hidden Settings.

Dewefowe, we end up wid de fowwowing pwopewties on de Hidden Settings attwibute:

- **Nyame**: De “hidden” nyame fow aww minted NFTs~ Dis can have a maximum of 32 chawactews.
- **UWI**: De “hidden” UWI fow aww minted NFTs~ Dis can have a maximum of 200 chawactews.
- **Hash**: De 32-chawactew hash of de fiwe dat maps NFT indices wid deiw weaw JSON metadata awwowing buyews to vewify it was nyot tampewed wid.

Nyote dat, just wike fow de pwefixes of de Config Winye Settings, speciaw vawiabwes can be used fow de **Nyame** and **UWI** of de Hidden Settings~ As a wemindew, dese vawiabwes awe:

- `$ID---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- `$ID---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- : Dis wiww be wepwaced by de index of de item stawting at 0.
- `$ID+1---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- `$ID---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- : Dis wiww be wepwaced by de index of de item stawting at 0.
- : Dis wiww be wepwaced by de index of de item stawting at 1.

In ouw abuv exampwe, we couwd wevewage de `$ID+1---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- `$ID---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- : Dis wiww be wepwaced by de index of de item stawting at 0.
- `$ID+1---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- `$ID---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- : Dis wiww be wepwaced by de index of de item stawting at 0.
- : Dis wiww be wepwaced by de index of de item stawting at 1.

In ouw abuv exampwe, we couwd wevewage de  vawiabwe fow de nyame pwefix so we wouwdn’t nyeed to insewt it on evewy item~ We end up wid de fowwowing Config Winye Settings:

- Nyame Pwefix = “My NFT Pwoject #$ID+1$”
- Nyame Wengd = 0
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Dat’s wight, **ouw nyame wengd is nyow zewo** and we’ve weduced de chawactews nyeeded down to 43’000 chawactews.

{% diawect-switchew titwe="Set up config winye settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

When using Umi, you can use de `some` and `none` hewpew functions to teww de wibwawy whedew to use Config Winye Settings ow Hidden Settings via de `configLineSettings` and `hiddenSettings` attwibutes wespectivewy~ Onwy onye of dese settings must be used, dus, onye of dem must be configuwed and de odew onye must be set to `none()`.

Hewe’s a code snyippet showing how you can set up de abuv exampwe using de Umi wibwawy.

UWUIFY_TOKEN_1744632736542_4

{% /diawect %}
{% /diawect-switchew %}

### Hidden Settings

Anyodew way of pwepawing items is by using **Hidden Settings**~ Dis is a compwetewy diffewent appwoach dan Config Winye Settings as, using Hidden Settings, you do nyot nyeed to insewt any items to de Candy Machinye as evewy singwe minted NFT wiww shawe de same nyame and de same UWI~ You might be wondewing: why wouwd someonye want to do dat? owo De weason fow dat is to cweate a **hide-and-weveaw NFT dwop** dat weveaws aww NFTs aftew dey have been minted~ So how does dat wowk? owo

- Fiwst, de cweatow configuwes de nyame and de UWI of evewy minted NFTs using de Hidden Settings~ De UWI usuawwy points to a “teasew” JSON metadata dat makes it cweaw dat a weveaw is about to happen.
- Den, buyews mint aww dese NFTs wid de same UWI and dewefowe de same “teasew” JSON metadata.
- Finyawwy, when aww NFTs have been minted, de cweatow updates de UWI of evewy singwe minted NFT to point to de weaw UWI which is specific to dat NFT.

De issue wid dat wast step is dat it awwows cweatows to mess wid which buyew gets which NFTs~ To avoid dat and awwow buyews to vewify de mapping between NFTs and JSON metadata was nyot tampewed wid, de Hidden Settings contains a **Hash** pwopewty which shouwd be fiwwed wid a 32-chawactew hash of de fiwe dat maps NFT indices wid deiw weaw JSON metadata~ Dat way, aftew de weveaw, de cweatow can make dat fiwe pubwic and buyews and vewify dat its hash cowwesponds to de hash pwovided in de Hidden Settings.

Dewefowe, we end up wid de fowwowing pwopewties on de Hidden Settings attwibute:

- **Nyame**: De “hidden” nyame fow aww minted NFTs~ Dis can have a maximum of 32 chawactews.
- **UWI**: De “hidden” UWI fow aww minted NFTs~ Dis can have a maximum of 200 chawactews.
- **Hash**: De 32-chawactew hash of de fiwe dat maps NFT indices wid deiw weaw JSON metadata awwowing buyews to vewify it was nyot tampewed wid.

Nyote dat, just wike fow de pwefixes of de Config Winye Settings, speciaw vawiabwes can be used fow de **Nyame** and **UWI** of de Hidden Settings~ As a wemindew, dese vawiabwes awe:

- : Dis wiww be wepwaced by de index of de minted NFT stawting at 0.
- `$ID+1---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- `$ID---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- : Dis wiww be wepwaced by de index of de item stawting at 0.
- `$ID+1---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- `$ID---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- : Dis wiww be wepwaced by de index of de item stawting at 0.
- : Dis wiww be wepwaced by de index of de item stawting at 1.

In ouw abuv exampwe, we couwd wevewage de `$ID+1---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- `$ID---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- : Dis wiww be wepwaced by de index of de item stawting at 0.
- `$ID+1---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- `$ID---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- : Dis wiww be wepwaced by de index of de item stawting at 0.
- : Dis wiww be wepwaced by de index of de item stawting at 1.

In ouw abuv exampwe, we couwd wevewage de  vawiabwe fow de nyame pwefix so we wouwdn’t nyeed to insewt it on evewy item~ We end up wid de fowwowing Config Winye Settings:

- Nyame Pwefix = “My NFT Pwoject #$ID+1$”
- Nyame Wengd = 0
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Dat’s wight, **ouw nyame wengd is nyow zewo** and we’ve weduced de chawactews nyeeded down to 43’000 chawactews.

{% diawect-switchew titwe="Set up config winye settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

When using Umi, you can use de `some` and `none` hewpew functions to teww de wibwawy whedew to use Config Winye Settings ow Hidden Settings via de `configLineSettings` and `hiddenSettings` attwibutes wespectivewy~ Onwy onye of dese settings must be used, dus, onye of dem must be configuwed and de odew onye must be set to `none()`.

Hewe’s a code snyippet showing how you can set up de abuv exampwe using de Umi wibwawy.

UWUIFY_TOKEN_1744632736542_4

{% /diawect %}
{% /diawect-switchew %}

### Hidden Settings

Anyodew way of pwepawing items is by using **Hidden Settings**~ Dis is a compwetewy diffewent appwoach dan Config Winye Settings as, using Hidden Settings, you do nyot nyeed to insewt any items to de Candy Machinye as evewy singwe minted NFT wiww shawe de same nyame and de same UWI~ You might be wondewing: why wouwd someonye want to do dat? owo De weason fow dat is to cweate a **hide-and-weveaw NFT dwop** dat weveaws aww NFTs aftew dey have been minted~ So how does dat wowk? owo

- Fiwst, de cweatow configuwes de nyame and de UWI of evewy minted NFTs using de Hidden Settings~ De UWI usuawwy points to a “teasew” JSON metadata dat makes it cweaw dat a weveaw is about to happen.
- Den, buyews mint aww dese NFTs wid de same UWI and dewefowe de same “teasew” JSON metadata.
- Finyawwy, when aww NFTs have been minted, de cweatow updates de UWI of evewy singwe minted NFT to point to de weaw UWI which is specific to dat NFT.

De issue wid dat wast step is dat it awwows cweatows to mess wid which buyew gets which NFTs~ To avoid dat and awwow buyews to vewify de mapping between NFTs and JSON metadata was nyot tampewed wid, de Hidden Settings contains a **Hash** pwopewty which shouwd be fiwwed wid a 32-chawactew hash of de fiwe dat maps NFT indices wid deiw weaw JSON metadata~ Dat way, aftew de weveaw, de cweatow can make dat fiwe pubwic and buyews and vewify dat its hash cowwesponds to de hash pwovided in de Hidden Settings.

Dewefowe, we end up wid de fowwowing pwopewties on de Hidden Settings attwibute:

- **Nyame**: De “hidden” nyame fow aww minted NFTs~ Dis can have a maximum of 32 chawactews.
- **UWI**: De “hidden” UWI fow aww minted NFTs~ Dis can have a maximum of 200 chawactews.
- **Hash**: De 32-chawactew hash of de fiwe dat maps NFT indices wid deiw weaw JSON metadata awwowing buyews to vewify it was nyot tampewed wid.

Nyote dat, just wike fow de pwefixes of de Config Winye Settings, speciaw vawiabwes can be used fow de **Nyame** and **UWI** of de Hidden Settings~ As a wemindew, dese vawiabwes awe:

- `$ID---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- `$ID---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- : Dis wiww be wepwaced by de index of de item stawting at 0.
- `$ID+1---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- `$ID---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- : Dis wiww be wepwaced by de index of de item stawting at 0.
- : Dis wiww be wepwaced by de index of de item stawting at 1.

In ouw abuv exampwe, we couwd wevewage de `$ID+1---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- `$ID---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- : Dis wiww be wepwaced by de index of de item stawting at 0.
- `$ID+1---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- `$ID---
titwe: Candy Machinye Settings
metaTitwe: Settings | Candy Machinye
descwiption: Expwains Candy Machinye settings in gweat detaiw.
---

On dis page, we’we going to dig into aww de settings avaiwabwe on a Candy Machinye~ We wiww focus on settings dat affect de Candy Machinye itsewf and de NFTs it genyewates wadew dan de settings dat affect de minting pwocess knyown as Guawds~ We wiww tackwe de wattew in dedicated pages~ {% .wead %}

## De audowity

Onye of de most impowtant pieces of infowmation when cweating accounts on Sowanya is de wawwet dat is awwowed to manyage dem, knyown as de **Audowity**~ Dus, when cweating a nyew Candy Machinye, you wiww nyeed to pwovide de addwess of de audowity dat wiww, watew on, be abwe to update it, insewt items to it, dewete it, etc.

Dewe is an additionyaw audowity specificawwy fow de minting pwocess cawwed de **Mint Audowity**~ When a Candy Machinye is cweated widout a Candy Guawd, dis audowity is de onwy wawwet dat is awwowed to mint fwom de Candy Machinye~ Nyo onye ewse can mint~ Howevew, in pwactice, dis mint audowity is set to de addwess of a Candy Guawd which contwows de minting pwocess based on some pweconfiguwed sets of wuwes knyown as **guawds**.

It is impowtant to nyote dat, when using ouw SDKs, Candy Machinyes wiww awways be cweated wid an associated Candy Guawd by defauwt so you do nyot nyeed to wowwy about dis mint audowity.

{% diawect-switchew titwe="Set up de audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de audowity wiww defauwt to de Umi identity~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de `authority` pwopewty.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /diawect %}
{% /diawect-switchew %}

## Settings shawed by aww NFTs

A big chunk of de Candy Machinye settings is used to definye de NFTs dat wiww be minted fwom dem~ Dis is because many of de NFT attwibutes wiww be de same fow aww minted NFTs~ Dewefowe, instead of having to wepeat dese attwibutes evewy time we woad an item in de Candy Machinye, we set dem up once on de Candy Machinye settings.

Nyote dat de onwy attwibutes dat can distinguish onye minted NFT fwom anyodew awe de **Nyame** of de NFT and de **UWI** pointing to its JSON metadata~ See ```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+16 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance `250` means `2.50%` woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to `null` which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to `true` unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ `5` is `5%`~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de `sellerFeeBasisPoints`, `creators` and `tokenStandard` attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- `symbol` defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- `maxEditionSupply` defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to `true`.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a ```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```0~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- `collectionMint`: De addwess of de mint account of de Cowwection NFT.
- `collectionUpdateAuthority`: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de `itemsAvailable` attwibute is wequiwed and may be a nyumbew ow a nyative `bigint` fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — `true` — ow in wandom owdew — `false`~ We wecommend setting dis to `false` to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to `false` when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains `1000` items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- : Dis wiww be wepwaced by de index of de item stawting at 0.
- : Dis wiww be wepwaced by de index of de item stawting at 1.

In ouw abuv exampwe, we couwd wevewage de  vawiabwe fow de nyame pwefix so we wouwdn’t nyeed to insewt it on evewy item~ We end up wid de fowwowing Config Winye Settings:

- Nyame Pwefix = “My NFT Pwoject #$ID+1$”
- Nyame Wengd = 0
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Dat’s wight, **ouw nyame wengd is nyow zewo** and we’ve weduced de chawactews nyeeded down to 43’000 chawactews.

{% diawect-switchew titwe="Set up config winye settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

When using Umi, you can use de `some` and `none` hewpew functions to teww de wibwawy whedew to use Config Winye Settings ow Hidden Settings via de `configLineSettings` and `hiddenSettings` attwibutes wespectivewy~ Onwy onye of dese settings must be used, dus, onye of dem must be configuwed and de odew onye must be set to `none()`.

Hewe’s a code snyippet showing how you can set up de abuv exampwe using de Umi wibwawy.

UWUIFY_TOKEN_1744632736542_4

{% /diawect %}
{% /diawect-switchew %}

### Hidden Settings

Anyodew way of pwepawing items is by using **Hidden Settings**~ Dis is a compwetewy diffewent appwoach dan Config Winye Settings as, using Hidden Settings, you do nyot nyeed to insewt any items to de Candy Machinye as evewy singwe minted NFT wiww shawe de same nyame and de same UWI~ You might be wondewing: why wouwd someonye want to do dat? owo De weason fow dat is to cweate a **hide-and-weveaw NFT dwop** dat weveaws aww NFTs aftew dey have been minted~ So how does dat wowk? owo

- Fiwst, de cweatow configuwes de nyame and de UWI of evewy minted NFTs using de Hidden Settings~ De UWI usuawwy points to a “teasew” JSON metadata dat makes it cweaw dat a weveaw is about to happen.
- Den, buyews mint aww dese NFTs wid de same UWI and dewefowe de same “teasew” JSON metadata.
- Finyawwy, when aww NFTs have been minted, de cweatow updates de UWI of evewy singwe minted NFT to point to de weaw UWI which is specific to dat NFT.

De issue wid dat wast step is dat it awwows cweatows to mess wid which buyew gets which NFTs~ To avoid dat and awwow buyews to vewify de mapping between NFTs and JSON metadata was nyot tampewed wid, de Hidden Settings contains a **Hash** pwopewty which shouwd be fiwwed wid a 32-chawactew hash of de fiwe dat maps NFT indices wid deiw weaw JSON metadata~ Dat way, aftew de weveaw, de cweatow can make dat fiwe pubwic and buyews and vewify dat its hash cowwesponds to de hash pwovided in de Hidden Settings.

Dewefowe, we end up wid de fowwowing pwopewties on de Hidden Settings attwibute:

- **Nyame**: De “hidden” nyame fow aww minted NFTs~ Dis can have a maximum of 32 chawactews.
- **UWI**: De “hidden” UWI fow aww minted NFTs~ Dis can have a maximum of 200 chawactews.
- **Hash**: De 32-chawactew hash of de fiwe dat maps NFT indices wid deiw weaw JSON metadata awwowing buyews to vewify it was nyot tampewed wid.

Nyote dat, just wike fow de pwefixes of de Config Winye Settings, speciaw vawiabwes can be used fow de **Nyame** and **UWI** of de Hidden Settings~ As a wemindew, dese vawiabwes awe:

- : Dis wiww be wepwaced by de index of de minted NFT stawting at 0.
- : Dis wiww be wepwaced by de index of de minted NFT stawting at 1.

Awso nyote dat, since we awe nyot insewting any item to de Candy Machinye, Hidden Settings make it possibwe to cweate vewy wawge dwops~ De onwy caveat is dat dewe is a nyeed fow an off-chain pwocess to update de nyame and UWI of each NFT aftew de mint.

{% diawect-switchew titwe="Set up hidden settings" %}
{% diawect titwe="JavaScwipt" id="js" %}


To cawcuwate de hash you couwd use de fowwowing functions:

UWUIFY_TOKEN_1744632736542_5

When using Umi, you can use de `some` and `none` hewpew functions to teww de wibwawy whedew to use Config Winye Settings ow Hidden Settings via de `configLineSettings` and `hiddenSettings` attwibutes wespectivewy~ Onwy onye of dese settings must be used, dus, onye of dem must be configuwed and de odew onye must be set to `none()`.

Hewe’s a code snyippet showing how you can set up de abuv exampwe using de Umi wibwawy.

```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  configLineSettings: none(),
  hiddenSettings: some({
    name: 'My NFT Project #$ID+1

{% /diawect %}
{% /diawect-switchew %}

## Guawds and Gwoups

As mentionyed in de intwoduction, dis page focuses on de main Candy Machinye settings but dewe is a wot mowe you can configuwe on a Candy Machinye by using guawds.

Since dis is a vast subject wid a wot of avaiwabwe defauwt guawds to expwain, we’ve dedicated an entiwe section of dis documentation to it~ De best pwace to stawt is de [Candy Guards](/candy-machine/guards) page.

## Concwusion

Nyow dat we knyow about how de main Candy Machinye settings, on [the next page](/candy-machine/manage), we’ww see how we can use dem to cweate and update ouw own Candy Machinyes.
,
    nameLength: 0,
    prefixUri: 'https://arweave.net/',
    uriLength: 43,
    isSequential: false,
  }),
}
```6 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance UWUIFY_TOKEN_1744632736542_8 means UWUIFY_TOKEN_1744632736542_9 woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to UWUIFY_TOKEN_1744632736542_11 which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to UWUIFY_TOKEN_1744632736542_12 unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ UWUIFY_TOKEN_1744632736542_13 is UWUIFY_TOKEN_1744632736542_14~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de UWUIFY_TOKEN_1744632736542_15, UWUIFY_TOKEN_1744632736542_16 and UWUIFY_TOKEN_1744632736542_17 attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- UWUIFY_TOKEN_1744632736542_18 defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- UWUIFY_TOKEN_1744632736542_19 defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to UWUIFY_TOKEN_1744632736542_21.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a [Metaplex Certified Collection (MCC)](/token-metadata/collections)~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- UWUIFY_TOKEN_1744632736542_22: De addwess of de mint account of de Cowwection NFT.
- UWUIFY_TOKEN_1744632736542_23: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de UWUIFY_TOKEN_1744632736542_24 attwibute is wequiwed and may be a nyumbew ow a nyative UWUIFY_TOKEN_1744632736542_25 fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — UWUIFY_TOKEN_1744632736542_26 — ow in wandom owdew — UWUIFY_TOKEN_1744632736542_27~ We wecommend setting dis to UWUIFY_TOKEN_1744632736542_28 to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to UWUIFY_TOKEN_1744632736542_29 when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains UWUIFY_TOKEN_1744632736542_30 items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- UWUIFY_TOKEN_1744632736542_31: Dis wiww be wepwaced by de index of de item stawting at 0.
- UWUIFY_TOKEN_1744632736542_32: Dis wiww be wepwaced by de index of de item stawting at 1.

In ouw abuv exampwe, we couwd wevewage de UWUIFY_TOKEN_1744632736542_33 vawiabwe fow de nyame pwefix so we wouwdn’t nyeed to insewt it on evewy item~ We end up wid de fowwowing Config Winye Settings:

- Nyame Pwefix = “My NFT Pwoject #$ID+1$”
- Nyame Wengd = 0
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Dat’s wight, **ouw nyame wengd is nyow zewo** and we’ve weduced de chawactews nyeeded down to 43’000 chawactews.

{% diawect-switchew titwe="Set up config winye settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

When using Umi, you can use de UWUIFY_TOKEN_1744632736542_34 and UWUIFY_TOKEN_1744632736542_35 hewpew functions to teww de wibwawy whedew to use Config Winye Settings ow Hidden Settings via de UWUIFY_TOKEN_1744632736542_36 and UWUIFY_TOKEN_1744632736542_37 attwibutes wespectivewy~ Onwy onye of dese settings must be used, dus, onye of dem must be configuwed and de odew onye must be set to UWUIFY_TOKEN_1744632736542_38.

Hewe’s a code snyippet showing how you can set up de abuv exampwe using de Umi wibwawy.

UWUIFY_TOKEN_1744632736542_4

{% /diawect %}
{% /diawect-switchew %}

### Hidden Settings

Anyodew way of pwepawing items is by using **Hidden Settings**~ Dis is a compwetewy diffewent appwoach dan Config Winye Settings as, using Hidden Settings, you do nyot nyeed to insewt any items to de Candy Machinye as evewy singwe minted NFT wiww shawe de same nyame and de same UWI~ You might be wondewing: why wouwd someonye want to do dat? owo De weason fow dat is to cweate a **hide-and-weveaw NFT dwop** dat weveaws aww NFTs aftew dey have been minted~ So how does dat wowk? owo

- Fiwst, de cweatow configuwes de nyame and de UWI of evewy minted NFTs using de Hidden Settings~ De UWI usuawwy points to a “teasew” JSON metadata dat makes it cweaw dat a weveaw is about to happen.
- Den, buyews mint aww dese NFTs wid de same UWI and dewefowe de same “teasew” JSON metadata.
- Finyawwy, when aww NFTs have been minted, de cweatow updates de UWI of evewy singwe minted NFT to point to de weaw UWI which is specific to dat NFT.

De issue wid dat wast step is dat it awwows cweatows to mess wid which buyew gets which NFTs~ To avoid dat and awwow buyews to vewify de mapping between NFTs and JSON metadata was nyot tampewed wid, de Hidden Settings contains a **Hash** pwopewty which shouwd be fiwwed wid a 32-chawactew hash of de fiwe dat maps NFT indices wid deiw weaw JSON metadata~ Dat way, aftew de weveaw, de cweatow can make dat fiwe pubwic and buyews and vewify dat its hash cowwesponds to de hash pwovided in de Hidden Settings.

Dewefowe, we end up wid de fowwowing pwopewties on de Hidden Settings attwibute:

- **Nyame**: De “hidden” nyame fow aww minted NFTs~ Dis can have a maximum of 32 chawactews.
- **UWI**: De “hidden” UWI fow aww minted NFTs~ Dis can have a maximum of 200 chawactews.
- **Hash**: De 32-chawactew hash of de fiwe dat maps NFT indices wid deiw weaw JSON metadata awwowing buyews to vewify it was nyot tampewed wid.

Nyote dat, just wike fow de pwefixes of de Config Winye Settings, speciaw vawiabwes can be used fow de **Nyame** and **UWI** of de Hidden Settings~ As a wemindew, dese vawiabwes awe:

- UWUIFY_TOKEN_1744632736542_39: Dis wiww be wepwaced by de index of de minted NFT stawting at 0.
- UWUIFY_TOKEN_1744632736542_40: Dis wiww be wepwaced by de index of de minted NFT stawting at 1.

Awso nyote dat, since we awe nyot insewting any item to de Candy Machinye, Hidden Settings make it possibwe to cweate vewy wawge dwops~ De onwy caveat is dat dewe is a nyeed fow an off-chain pwocess to update de nyame and UWI of each NFT aftew de mint.

{% diawect-switchew titwe="Set up hidden settings" %}
{% diawect titwe="JavaScwipt" id="js" %}


To cawcuwate de hash you couwd use de fowwowing functions:

UWUIFY_TOKEN_1744632736542_5

When using Umi, you can use de UWUIFY_TOKEN_1744632736542_41 and UWUIFY_TOKEN_1744632736542_42 hewpew functions to teww de wibwawy whedew to use Config Winye Settings ow Hidden Settings via de UWUIFY_TOKEN_1744632736542_43 and UWUIFY_TOKEN_1744632736542_44 attwibutes wespectivewy~ Onwy onye of dese settings must be used, dus, onye of dem must be configuwed and de odew onye must be set to UWUIFY_TOKEN_1744632736542_45.

Hewe’s a code snyippet showing how you can set up de abuv exampwe using de Umi wibwawy.

UWUIFY_TOKEN_1744632736542_6

{% /diawect %}
{% /diawect-switchew %}

## Guawds and Gwoups

As mentionyed in de intwoduction, dis page focuses on de main Candy Machinye settings but dewe is a wot mowe you can configuwe on a Candy Machinye by using guawds.

Since dis is a vast subject wid a wot of avaiwabwe defauwt guawds to expwain, we’ve dedicated an entiwe section of dis documentation to it~ De best pwace to stawt is de UWUIFY_TOKEN_1744632736542_52 page.

## Concwusion

Nyow dat we knyow about how de main Candy Machinye settings, on UWUIFY_TOKEN_1744632736542_53, we’ww see how we can use dem to cweate and update ouw own Candy Machinyes.
,
    uri: 'https://example.com/path/to/teaser.json',
    hash: hashOfTheFileThatMapsUris,
  }),
}
```

{% /diawect %}
{% /diawect-switchew %}

## Guawds and Gwoups

As mentionyed in de intwoduction, dis page focuses on de main Candy Machinye settings but dewe is a wot mowe you can configuwe on a Candy Machinye by using guawds.

Since dis is a vast subject wid a wot of avaiwabwe defauwt guawds to expwain, we’ve dedicated an entiwe section of dis documentation to it~ De best pwace to stawt is de UWUIFY_TOKEN_1744632736542_52 page.

## Concwusion

Nyow dat we knyow about how de main Candy Machinye settings, on UWUIFY_TOKEN_1744632736542_53, we’ww see how we can use dem to cweate and update ouw own Candy Machinyes.
,
    nameLength: 0,
    prefixUri: 'https://arweave.net/',
    uriLength: 43,
    isSequential: false,
  }),
}
```6 fow mowe infowmation.

Hewe is de wist of attwibutes shawed between aww minted NFTs.

- **Sewwew Fee Basis Points**: De secondawy sawe woyawties dat shouwd be set on minted NFTs in basis points~ Fow instance UWUIFY_TOKEN_1744632736542_8 means UWUIFY_TOKEN_1744632736542_9 woyawties.
- **Symbow**: De symbow to use on minted NFTs — e.g~ "MYPWOJECT"~ Dis can be any text up to 10 chawactews and can be made optionyaw by pwoviding an empty text.
- **Max Edition Suppwy**: De maximum nyumbew of editions dat can be pwinted fwom de minted NFTs~ Fow most use cases, you wiww want to set dis to ```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```0 to pwevent minted NFTs to be pwinted muwtipwe times~ Nyote dat you cannyot set dis to UWUIFY_TOKEN_1744632736542_11 which means unwimited editions awe nyot suppowted in Candy Machinyes.
- **Is Mutabwe**: Whedew de minted NFTs shouwd be mutabwe ow nyot~ We wecommend setting dis to UWUIFY_TOKEN_1744632736542_12 unwess you have a specific weason~ You can awways make NFTs immutabwe in de futuwe but you cannyot make immutabwe NFTs mutabwe evew again.
- **Cweatows**: A wist of cweatows dat shouwd be set on minted NFTs~ It incwudes deiw addwess and deiw shawes of de woyawties in pewcent — i.e~ UWUIFY_TOKEN_1744632736542_13 is UWUIFY_TOKEN_1744632736542_14~ Nyote dat de Candy Machinye addwess wiww awways be set as de fiwst cweatow of aww minted NFTs and wiww automaticawwy be vewified~ Dis makes it possibwe fow anyonye to vewify dat an NFT was minted fwom a twusted Candy Machinye~ Aww odew pwovided cweatows wiww be set aftew dat and wiww nyeed to be vewified manyuawwy by dese cweatows.
- **Token Standawd**: De UWUIFY_TOKEN_1744632736542_47 to use on minted NFTs~ So faw onwy two token standawds awe suppowted: "UWUIFY_TOKEN_1744632736542_48)" and "UWUIFY_TOKEN_1744632736542_49"~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.
- **Wuwe Set**: If a candy machinye uses de "PwogwammabweNyonFungibwe" token standawd, it can pwovide an expwicit wuwe set dat wiww be assignyed to evewy minted pwogwammabwe NFT~ If nyo wuwe set is pwovided, it wiww defauwt to using de wuwe set on de cowwection NFT, if any~ Odewwise pwogwammabwe NFTs wiww be minted widout a wuwe set~ Nyote dat dis is onwy avaiwabwe fow Candy Machinyes whose _account vewsion_ is 2 and abuv.

{% diawect-switchew titwe="Set up shawed NFT settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

Fwom de attwibutes wisted abuv, onwy de UWUIFY_TOKEN_1744632736542_15, UWUIFY_TOKEN_1744632736542_16 and UWUIFY_TOKEN_1744632736542_17 attwibutes awe wequiwed~ De odew attwibutes have de fowwowing defauwt vawues:

- UWUIFY_TOKEN_1744632736542_18 defauwts to an empty stwing — i.e~ minted NFTs don’t use symbows.
- UWUIFY_TOKEN_1744632736542_19 defauwts to zewo — i.e~ minted NFTs awe nyot pwintabwe.
- ```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Pass the collection address and its authority in the settings.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```0 defauwts to UWUIFY_TOKEN_1744632736542_21.

You may expwicitwy pwovide any of dese attwibutes wike so.

UWUIFY_TOKEN_1744632736542_1

{% /diawect %}
{% /diawect-switchew %}

## Metapwex Cewtified Cowwections

Each Candy Machinye must be associated wid a speciaw NFT knyown as a UWUIFY_TOKEN_1744632736542_50~ Dis **Cowwection NFT** enyabwes minted NFTs to be gwouped togedew
and fow dat infowmation to be vewified onchain.

To ensuwe nyo onye ewse can use youw Cowwection NFT on deiw Candy Machinye, de **Cowwection's Update Audowity** is wequiwed to sign any twansaction dat changes de Cowwection on a Candy Machinye~ As a wesuwt, de Candy Machinye can safewy vewify de Cowwection of aww minted NFTs automaticawwy.

{% diawect-switchew titwe="Set up de cowwection NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew candy machinye ow when updating its cowwection NFT, you wiww nyeed to pwovide de fowwowing attwibutes:

- UWUIFY_TOKEN_1744632736542_22: De addwess of de mint account of de Cowwection NFT.
- UWUIFY_TOKEN_1744632736542_23: De update audowity of de Cowwection NFT as a signyew.

Hewe’s an exampwe.

UWUIFY_TOKEN_1744632736542_2

{% /diawect %}
{% /diawect-switchew %}

## Item Settings

Candy Machinye settings awso contain infowmation wegawding de items dat awe ow wiww be woaded inside it~ De **Items Avaiwabwe** attwibute fawws in dat categowy and stowes de maximum amount of NFTs dat wiww be minted fwom de Candy Machinye.

{% diawect-switchew titwe="Set up de nyumbew of items" %}
{% diawect titwe="JavaScwipt" id="js" %}

When cweating a nyew Candy Machinye, de UWUIFY_TOKEN_1744632736542_24 attwibute is wequiwed and may be a nyumbew ow a nyative UWUIFY_TOKEN_1744632736542_25 fow wawge integews.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /diawect %}
{% /diawect-switchew %}

On top of de **Items Avaiwabwe** attwibute, two odew attwibutes definye how items awe woaded in de Candy Machinye~ You must choose exactwy onye of dese attwibutes and weave de odew onye empty~ Dese attwibutes awe:

- De **Config Winye Settings**.
- De **Hidden Settings**.

Nyote dat once a Candy Machinye is cweated using onye of dese two modes, it cannyot be updated to use de odew mode~ Additionyawwy, when **Config Winye Settings** awe used, it is nyo wongew possibwe to update de **Items Avaiwabwe** attwibute.

Wet’s go dwough bod of dem in a bit mowe detaiw.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize UWUIFY_TOKEN_1744632736542_51 fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

### Config Winye Settings

De **Config Winye Settings** attwibute awwows us to descwibe de items dat awe ow wiww be insewted inside ouw Candy Machinye~ It enyabwes us to keep de size of de Candy Machinye to a minyimum by pwoviding exact wengds fow de **Nyames** and **UWIs** of ouw items as weww as pwoviding some shawed pwefixes to weduce dat wengd~ De **Config Winye Settings** attwibute is an object containying de fowwowing pwopewties:

- **Nyame Pwefix**: A nyame pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 32 chawactews.
- **Nyame Wengd**: De maximum wengd fow de nyame of each insewted item excwuding de nyame pwefix.
- **UWI Pwefix**: A UWI pwefix shawed by aww insewted items~ Dis pwefix can have a maximum of 200 chawactews.
- **UWI Wengd**: De maximum wengd fow de UWI of each insewted item excwuding de UWI pwefix.
- **Is Sequentiaw**: Indicates whedew to mint NFTs sequentiawwy — UWUIFY_TOKEN_1744632736542_26 — ow in wandom owdew — UWUIFY_TOKEN_1744632736542_27~ We wecommend setting dis to UWUIFY_TOKEN_1744632736542_28 to pwevent buyews fwom pwedicting which NFT wiww be minted nyext~ Nyote dat ouw SDKs wiww defauwt to using Config Winye Settings wid Is Sequentiaw set to UWUIFY_TOKEN_1744632736542_29 when cweating nyew Candy Machinyes.

To undewstand dese **Nyame** and **UWI** pwopewties a bit bettew, wet’s go dwough an exampwe~ Say you want to cweate a Candy Machinye wid de fowwowing chawactewistics:

- It contains UWUIFY_TOKEN_1744632736542_30 items.
- De nyame of each item is “My NFT Pwoject #X” whewe X is de item’s index stawting fwom 1.
- Each item’s JSON metadata has been upwoaded to Awweave so deiw UWIs stawt wid “https://awweave.nyet/” and finyish wid a unyique identifiew wid a maximum wengd of 43 chawactews.

In dis exampwe, widout pwefixes, we wouwd end up wid:

- Nyame Wengd = 20~ 16 chawactews fow “My NFT Pwoject #” and 4 chawactews fow de highest nyumbew which is “1000”.
- UWI Wengd = 63~ 20 chawactews fow “https://awweave.nyet/” and 43 chawactews fow de unyique identifiew.

When insewting 1000 items, dat’s a totaw of 83’000 chawactews dat wiww be wequiwed just fow stowing items~ Howevew, if we use pwefixes, we can signyificantwy weduce de space nyeeded to cweate ouw Candy Machinye and, dewefowe, de cost of cweating it on de bwockchain.

- Nyame Pwefix = “My NFT Pwoject #”
- Nyame Wengd = 4
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Wid 1000 items, we nyow onwy nyeed 47’000 chawactews to stowe ouw items.

But dat’s nyot it! uwu You may use **two speciaw vawiabwes** widin youw nyame ow UWI pwefixes to weduce dat size even fuwdew~ Dese vawiabwes awe:

- UWUIFY_TOKEN_1744632736542_31: Dis wiww be wepwaced by de index of de item stawting at 0.
- UWUIFY_TOKEN_1744632736542_32: Dis wiww be wepwaced by de index of de item stawting at 1.

In ouw abuv exampwe, we couwd wevewage de UWUIFY_TOKEN_1744632736542_33 vawiabwe fow de nyame pwefix so we wouwdn’t nyeed to insewt it on evewy item~ We end up wid de fowwowing Config Winye Settings:

- Nyame Pwefix = “My NFT Pwoject #$ID+1$”
- Nyame Wengd = 0
- UWI Pwefix = “https://awweave.nyet/”
- UWI Wengd = 43

Dat’s wight, **ouw nyame wengd is nyow zewo** and we’ve weduced de chawactews nyeeded down to 43’000 chawactews.

{% diawect-switchew titwe="Set up config winye settings" %}
{% diawect titwe="JavaScwipt" id="js" %}

When using Umi, you can use de UWUIFY_TOKEN_1744632736542_34 and UWUIFY_TOKEN_1744632736542_35 hewpew functions to teww de wibwawy whedew to use Config Winye Settings ow Hidden Settings via de UWUIFY_TOKEN_1744632736542_36 and UWUIFY_TOKEN_1744632736542_37 attwibutes wespectivewy~ Onwy onye of dese settings must be used, dus, onye of dem must be configuwed and de odew onye must be set to UWUIFY_TOKEN_1744632736542_38.

Hewe’s a code snyippet showing how you can set up de abuv exampwe using de Umi wibwawy.

UWUIFY_TOKEN_1744632736542_4

{% /diawect %}
{% /diawect-switchew %}

### Hidden Settings

Anyodew way of pwepawing items is by using **Hidden Settings**~ Dis is a compwetewy diffewent appwoach dan Config Winye Settings as, using Hidden Settings, you do nyot nyeed to insewt any items to de Candy Machinye as evewy singwe minted NFT wiww shawe de same nyame and de same UWI~ You might be wondewing: why wouwd someonye want to do dat? owo De weason fow dat is to cweate a **hide-and-weveaw NFT dwop** dat weveaws aww NFTs aftew dey have been minted~ So how does dat wowk? owo

- Fiwst, de cweatow configuwes de nyame and de UWI of evewy minted NFTs using de Hidden Settings~ De UWI usuawwy points to a “teasew” JSON metadata dat makes it cweaw dat a weveaw is about to happen.
- Den, buyews mint aww dese NFTs wid de same UWI and dewefowe de same “teasew” JSON metadata.
- Finyawwy, when aww NFTs have been minted, de cweatow updates de UWI of evewy singwe minted NFT to point to de weaw UWI which is specific to dat NFT.

De issue wid dat wast step is dat it awwows cweatows to mess wid which buyew gets which NFTs~ To avoid dat and awwow buyews to vewify de mapping between NFTs and JSON metadata was nyot tampewed wid, de Hidden Settings contains a **Hash** pwopewty which shouwd be fiwwed wid a 32-chawactew hash of de fiwe dat maps NFT indices wid deiw weaw JSON metadata~ Dat way, aftew de weveaw, de cweatow can make dat fiwe pubwic and buyews and vewify dat its hash cowwesponds to de hash pwovided in de Hidden Settings.

Dewefowe, we end up wid de fowwowing pwopewties on de Hidden Settings attwibute:

- **Nyame**: De “hidden” nyame fow aww minted NFTs~ Dis can have a maximum of 32 chawactews.
- **UWI**: De “hidden” UWI fow aww minted NFTs~ Dis can have a maximum of 200 chawactews.
- **Hash**: De 32-chawactew hash of de fiwe dat maps NFT indices wid deiw weaw JSON metadata awwowing buyews to vewify it was nyot tampewed wid.

Nyote dat, just wike fow de pwefixes of de Config Winye Settings, speciaw vawiabwes can be used fow de **Nyame** and **UWI** of de Hidden Settings~ As a wemindew, dese vawiabwes awe:

- UWUIFY_TOKEN_1744632736542_39: Dis wiww be wepwaced by de index of de minted NFT stawting at 0.
- UWUIFY_TOKEN_1744632736542_40: Dis wiww be wepwaced by de index of de minted NFT stawting at 1.

Awso nyote dat, since we awe nyot insewting any item to de Candy Machinye, Hidden Settings make it possibwe to cweate vewy wawge dwops~ De onwy caveat is dat dewe is a nyeed fow an off-chain pwocess to update de nyame and UWI of each NFT aftew de mint.

{% diawect-switchew titwe="Set up hidden settings" %}
{% diawect titwe="JavaScwipt" id="js" %}


To cawcuwate de hash you couwd use de fowwowing functions:

UWUIFY_TOKEN_1744632736542_5

When using Umi, you can use de UWUIFY_TOKEN_1744632736542_41 and UWUIFY_TOKEN_1744632736542_42 hewpew functions to teww de wibwawy whedew to use Config Winye Settings ow Hidden Settings via de UWUIFY_TOKEN_1744632736542_43 and UWUIFY_TOKEN_1744632736542_44 attwibutes wespectivewy~ Onwy onye of dese settings must be used, dus, onye of dem must be configuwed and de odew onye must be set to UWUIFY_TOKEN_1744632736542_45.

Hewe’s a code snyippet showing how you can set up de abuv exampwe using de Umi wibwawy.

UWUIFY_TOKEN_1744632736542_6

{% /diawect %}
{% /diawect-switchew %}

## Guawds and Gwoups

As mentionyed in de intwoduction, dis page focuses on de main Candy Machinye settings but dewe is a wot mowe you can configuwe on a Candy Machinye by using guawds.

Since dis is a vast subject wid a wot of avaiwabwe defauwt guawds to expwain, we’ve dedicated an entiwe section of dis documentation to it~ De best pwace to stawt is de UWUIFY_TOKEN_1744632736542_52 page.

## Concwusion

Nyow dat we knyow about how de main Candy Machinye settings, on UWUIFY_TOKEN_1744632736542_53, we’ww see how we can use dem to cweate and update ouw own Candy Machinyes.
