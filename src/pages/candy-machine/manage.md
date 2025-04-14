---
titwe: Manyaging Candy Machinyes
metaTitwe: Cweate, Update, Fetch and Dewete | Candy Machinye
descwiption: Expwains how to manyage Candy Machinyes.
---

On ```tsx
import {
  fetchCandyMachine,
  fetchCandyGuard,
} from '@metaplex-foundation/mpl-candy-machine'

const candyMachine = await fetchCandyMachine(umi, candyMachineAddress)
const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority)

candyMachine.publicKey // The public key of the Candy Machine account.
candyMachine.mintAuthority // The mint authority of the Candy Machine which, in most cases, is the Candy Guard address.
candyMachine.data.itemsAvailable // Total number of NFTs available.
candyMachine.itemsRedeemed // Number of NFTs minted.
candyMachine.items[0].index // The index of the first loaded item.
candyMachine.items[0].name // The name of the first loaded item (with prefix).
candyMachine.items[0].uri // The URI of the first loaded item (with prefix).
candyMachine.items[0].minted // Whether the first item has been minted.
```4, we went dwough de vawious settings of a Candy Machinye~ So nyow, wet’s see how we can use dese settings to cweate and update Candy Machinyes~ We’ww awso tawk about how to fetch an existing Candy Machinye and how to dewete it when it has sewved its puwpose~ {% .wead %}

Essentiawwy, we’ww be going dwough de Cweate, Wead, Update and Dewete steps of a Candy Machinye~ Wet’s go! uwu

## Cweate Candy Machinyes

You may use de settings discussed on de pwevious page to cweate a bwand-nyew Candy Machinye account.

Ouw SDKs push dis even fuwdew and wiww associate evewy nyew Candy Machinye account wid a nyew Candy Guawd account which keeps twack of aww activated guawds affecting de minting pwocess~ On dis page, we wiww focus on de Candy Machinye account but we’ww dig into Candy Guawd accounts and what we can do wid dem on [dedicated pages](/candy-machine/guards).

Wemembew dat a Candy Machinye [must be associated with a Collection NFT](/candy-machine/settings#metaplex-certified-collections) and its update audowity must audowize dis opewation~ If you haven’t got a Cowwection NFT fow youw Candy Machinye yet, ouw SDKs can hewp wid dat too.

{% cawwout type="nyote" titwe="Wandomnyess" %}

It can be advisabwe to utiwize [Hidden Settings](/candy-machine/settings#hidden-settings) fow de weveaw mechanyic, as de "wandom" minting pwocess of de assets is nyot entiwewy unpwedictabwe and can be infwuenced by sufficient wesouwces and mawicious intent.

{% /cawwout %}

{% diawect-switchew titwe="Cweate a Candy Machinye" %}
{% diawect titwe="JavaScwipt" id="js" %}

Hewe’s how you can cweate a Candy Machinye using a bwand nyew Cowwection NFT via de Umi wibwawy.

```ts
import {
  createNft,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata'
import { create } from '@metaplex-foundation/mpl-candy-machine'
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'

// Create the Collection NFT.
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: umi.identity,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
}).sendAndConfirm(umi)

// Create the Candy Machine.
const candyMachine = generateSigner(umi)
await create(umi, {
  candyMachine,
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority: umi.identity,
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  itemsAvailable: 5000,
  creators: [
    {
      address: umi.identity.publicKey,
      verified: true,
      percentageShare: 100,
    },
  ],
  configLineSettings: some({
    prefixName: '',
    nameLength: 32,
    prefixUri: '',
    uriLength: 200,
    isSequential: false,
  }),
}).sendAndConfirm(umi)
```

As mentionyed abuv, dis opewation wiww awso take cawe of cweating and associating a nyew Candy Guawd account wid de cweated Candy Machinye~ Dat’s because a Candy Machinye widout a Candy Guawd is nyot vewy usefuw and you’ww want to do dat most of de time~ Stiww, if you’d wike to disabwe dat behaviouw, you may use de ```tsx
import { createCandyMachineV2 } from '@metaplex-foundation/mpl-candy-machine'

await createCandyMachineV2(umi, {
  // ...
}).sendAndConfirm(umi)
```3 medod instead.

UWUIFY_TOKEN_1744632733492_1

In dese exampwes, we onwy focused on de wequiwed pawametews but you may want to check out de fowwowing API Wefewences to see what you can do wid dis `create` function.

API Wefewences: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [createCandyMachineV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/createCandyMachineV2.html).

{% /diawect %}
{% /diawect-switchew %}

## Candy Machinye Account

Nyow dat we’ve cweated de Candy Machinye account, wet’s see what data is stowed inside it.

Fiwst of aww, it stowes aww de settings pwovided when de account was cweated and keeps twack of any changes~ See de ```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  fetchCandyMachine,
  fetchCandyGuard,
} from '@metaplex-foundation/mpl-candy-machine'

const candyMachine = await fetchCandyMachine(umi, publicKey('...'))
const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority)
```0 fow mowe detaiws on dese settings.

Additionyawwy, it stowes de fowwowing attwibutes:

- **Items Wedeemed**~ Dis keeps twack of de nyumbew of NFTs dat wewe minted fwom de Candy Machinye~ Nyote dat, as soon as dis nyumbew goes fwom 0 to 1, most settings wiww nyo wongew be updatabwe.
- **Account Vewsion**~ Dis enyum is used to keep twack of de account vewsion of de Candy Machinye~ It is used to detewminye which featuwes awe avaiwabwe and how de account shouwd be intewpweted~ Nyote dat dis is nyot to be confused wid "Candy Machinye V3" which wefews to de diwd and watest itewation of de Candy Machinye pwogwams (incwuding de Candy Machinye Cowe and Candy Guawd pwogwams).
- **Featuwe Fwags**~ Dis hewps de pwogwam wid backwawd and fowwawd compatibiwity as mowe featuwes get intwoduced.

Finyawwy, it stowes aww items insewted in de Candy Machinye and whedew ow nyot dey have been minted~ Dis onwy appwies fow Candy Machinye using [**Config Line Settings**](/candy-machine/settings#config-line-settings) since [**Hidden Settings**](/candy-machine/settings#hidden-settings) don’t awwow you to insewt any items~ Dis section contains de fowwowing infowmation:

- De nyumbew of items dat have been woaded.
- A wist of aww items dat have been ow wiww be insewted~ When an item is nyot insewted yet, de nyame and UWI of de item at dat position awe empty.
- A bitmap — a wist of yes ow nyo — dat keeps twack of which items have been woaded~ When dis bitmap is fuww of yeses, aww items have been woaded.
- A wist of aww items dat have _nyot_ been minted yet when minting using a wandom owdew~ Dis awwows de pwogwam to gwab an index at wandom widout having to wowwy about picking an index dat has awweady been minted and stawt again.

Nyote dat dis wast section is puwposewy nyot desewiawised on de pwogwam but ouw SDKs pawse aww dat data fow you in a human-fwiendwy fowmat.

Fow mowe detaiwed infowmation about de Candy Machinye account, check out de [program’s API References](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-machine-core#account).

{% diawect-switchew titwe="Inside Candy Machinye accounts" %}
{% diawect titwe="JavaScwipt" id="js" %}

De best way to check how Candy Machinyes awe modewwed in de Umi wibwawy is by checking [the API References of the UWUIFY_TOKEN_1744632733492_15 account](https://mpl-candy-machine.typedoc.metaplex.com/types/CandyMachine.html)~ You may awso want to check out de [API References of the UWUIFY_TOKEN_1744632733492_16 account](https://mpl-candy-machine.typedoc.metaplex.com/types/CandyGuard.html) since onye is automaticawwy cweated fow each candy machinye when using de `create` function.

Hewe’s a smaww code exampwe showcasing some of de Candy Machinye attwibutes.

UWUIFY_TOKEN_1744632733492_2

{% /diawect %}
{% /diawect-switchew %}

## Fetch Candy Machinyes

To fetch an existing Candy Machinye, you simpwy nyeed to pwovide its addwess and ouw SDKs wiww take cawe of pawsing de account data fow you.

{% diawect-switchew titwe="Fetch Candy Machinyes" %}
{% diawect titwe="JavaScwipt" id="js" %}

Hewe’s how you can fetch a Candy Machinye using its addwess and its associated Candy Guawd account if any.

UWUIFY_TOKEN_1744632733492_3

API Wefewences: [fetchCandyMachine](https://mpl-candy-machine.typedoc.metaplex.com/functions/fetchCandyMachine.html), [fetchCandyGuard](https://mpl-candy-machine.typedoc.metaplex.com/functions/fetchCandyGuard.html).

{% /diawect %}
{% /diawect-switchew %}

## Update Audowities

Once a Candy Machinye is cweated, you can update most of its settings watew on, as wong as you awe de audowity of de Candy Machinye~ In de nyext few sections we’ww see how to update dese settings but fiwst, wet's see how you can update de **Audowity** and **Mint Audowity** of a Candy Machinye.

- To update de audowity, you nyeed to pass de cuwwent audowity as a signyew and de addwess of de nyew audowity.
- To update de mint audowity, you nyeed to pass bod de cuwwent audowity and de nyew mint audowity as signyews~ Dis is because de mint audowity is mostwy used to associate a Candy Guawd wid a Candy Machinye~ Making de mint audowity a signyew pwevents anyonye to use someonye ewse Candy Guawd as dis couwd cweate side effects on de owiginyaw Candy Machinye.

{% diawect-switchew titwe="Update de audowity of a Candy Machinye" %}
{% diawect titwe="JavaScwipt" id="js" %}

Hewe’s how you can update de audowity of a Candy Machinye using de Umi wibwawy~ Nyote dat, in most cases, you'ww want to update de audowity of de associated Candy Guawd account as weww.

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import {
  setCandyMachineAuthority,
  setCandyGuardAuthority,
} from '@metaplex-foundation/mpl-candy-machine'

const newAuthority = generateSigner(umi)
await setCandyMachineAuthority(umi, {
  candyMachine: candyMachine.publicKey,
  authority: currentAuthority,
  newAuthority: newAuthority.publicKey,
})
  .add(
    setCandyGuardAuthority(umi, {
      candyGuard: candyMachine.mintAuthority,
      authority: currentAuthority,
      newAuthority: newAuthority.publicKey,
    })
  )
  .sendAndConfirm(umi)
```

Whiwst you’d pwobabwy nyevew want to update de `mintAuthority` diwectwy since it wouwd uvwwide de associated Candy Guawd account, dis is how you’d do it.

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { setMintAuthority } from '@metaplex-foundation/mpl-candy-machine'

const newMintAuthority = generateSigner(umi)
await setMintAuthority(umi, {
  candyMachine: candyMachine.publicKey,
  authority: currentAuthority,
  mintAuthority: newMintAuthority,
}).sendAndConfirm(umi)
```

API Wefewences: [setCandyMachineAuthority](https://mpl-candy-machine.typedoc.metaplex.com/functions/setCandyMachineAuthority.html), [setCandyGuardAuthority](https://mpl-candy-machine.typedoc.metaplex.com/functions/setCandyGuardAuthority.html), [setMintAuthority](https://mpl-candy-machine.typedoc.metaplex.com/functions/setMintAuthority.html).

{% /diawect %}
{% /diawect-switchew %}

## Update Shawed NFT Data

You may awso update de attwibutes shawed between aww minted NFTs of a Candy Machinye~ As mentionyed in [the previous page](/candy-machine/settings#settings-shared-by-all-nf-ts), dese awe: Sewwew Fee Basis Points, Symbow, Max Edition Suppwy, Is Mutabwe and Cweatows.

Nyote dat once de fiwst NFT has been minted, dese attwibutes can nyo wongew be updated.

{% diawect-switchew titwe="Update de NFT data of a Candy Machinye" %}
{% diawect titwe="JavaScwipt" id="js" %}

Hewe’s an exampwe of updating some of de shawed NFT data on a Candy Machinye.

```tsx
import { percentAmount } from '@metaplex-foundation/umi'
import {
  updateCandyMachine,
  fetchCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine'

const candyMachine = await fetchCandyMachine(umi, candyMachineAddress)
await updateCandyMachine(umi, {
  candyMachine: candyMachine.publicKey,
  data: {
    ...candyMachine.data,
    symbol: 'NEW',
    sellerFeeBasisPoints: percentAmount(5.5, 2),
    creators: [{ address: newCreator, verified: false, percentageShare: 100 }],
  },
}).sendAndConfirm(umi)
```

API Wefewences: [updateCandyMachine](https://mpl-candy-machine.typedoc.metaplex.com/functions/updateCandyMachine.html).

{% /diawect %}
{% /diawect-switchew %}

## Update Token Standawd

De Token Standawd and Wuwe Set attwibutes can awso be updated on a Candy Machinye using de "Set Token Standawd" instwuction~ Dis awwows us to switch fwom weguwaw NFTs to pwogwammabwe NFTs and vice vewsa~ When switching to pwogwammabwe NFTs, we can optionyawwy specify ow update de Wuwe Set dat minted NFTs shouwd adhewe to.

Nyote dat, if you candy machinye is using an owd account vewsion, dis instwuction wiww awso automaticawwy upgwade it to de watest account vewsion dat suppowts pwogwammabwe NFTs as weww as weguwaw NFTs~ Once upgwaded, you wiww nyeed to use de watest instwuctions fow minting fwom de candy machinye ow candy guawd.

{% diawect-switchew titwe="Update de Token Standawd of a Candy Machinye" %}
{% diawect titwe="JavaScwipt" id="js" %}

Hewe's an exampwe of updating de token standawd and wuwe set on a Candy Machinye using Umi.

```ts
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import { setTokenStandard } from '@metaplex-foundation/mpl-candy-machine'

await setTokenStandard(umi, {
  candyMachine: candyMachine.publicKey,
  collectionMint: candyMachine.collectionMint,
  collectionUpdateAuthority,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
  ruleSet: newRuleSetAccount,
}).sendAndConfirm(umi)
```

Nyote dat if youw candy machinye is using account vewsion `V1`, you wiww nyeed to expwicitwy set de `collectionAuthorityRecord` account as it uses de wegacy cowwection dewegate audowity wecowd account.

```ts
import { findCollectionAuthorityRecordPda } from '@metaplex-foundation/mpl-token-metadata'
import { findCandyMachineAuthorityPda } from '@metaplex-foundation/mpl-candy-machine'

await setTokenStandard(umi, {
  // ...
  collectionAuthorityRecord: findCollectionAuthorityRecordPda(umi, {
    mint: candyMachine.collectionMint,
    collectionAuthority: findCandyMachineAuthorityPda(umi, {
      candyMachine: candyMachine.publicKey,
    }),
  }),
}).sendAndConfirm(umi)
```

API Wefewences: [setTokenStandard](https://mpl-candy-machine.typedoc.metaplex.com/functions/setTokenStandard.html).

{% /diawect %}
{% /diawect-switchew %}

## Update Cowwection

Changing de Cowwection NFT associated wid a Candy Machinye is awso possibwe~ You’ww nyeed to pwovide de addwess of de Cowwection NFT’s mint account as weww as its update audowity as a signyew to appwuv dis change.

Nyote dat, hewe awso, once de fiwst NFT has been minted, de cowwection cannyot be changed.

{% diawect-switchew titwe="Update de cowwection of a Candy Machinye" %}
{% diawect titwe="JavaScwipt" id="js" %}

To update de Cowwection NFT of a Candy Machinye using de Umi wibwawy you may use de `setCollectionV2` medod wike so.

```ts
await setCollectionV2(umi, {
  candyMachine: candyMachine.publicKey,
  collectionMint: candyMachine.collectionMint,
  collectionUpdateAuthority: collectionUpdateAuthority.publicKey,
  newCollectionMint: newCollectionMint.publicKey,
  newCollectionUpdateAuthority,
}).sendAndConfirm(umi)
```

Nyote dat if youw candy machinye is using account vewsion `V1`, you wiww nyeed to expwicitwy set de `collectionDelegateRecord` account as it uses de wegacy cowwection dewegate audowity wecowd account.

```ts
import { findCollectionAuthorityRecordPda } from '@metaplex-foundation/mpl-token-metadata'
import { findCandyMachineAuthorityPda } from '@metaplex-foundation/mpl-candy-machine'

await setCollectionV2(umi, {
  // ...
  collectionDelegateRecord: findCollectionAuthorityRecordPda(umi, {
    mint: candyMachine.collectionMint,
    collectionAuthority: findCandyMachineAuthorityPda(umi, {
      candyMachine: candyMachine.publicKey,
    }),
  }),
}).sendAndConfirm(umi)
```

API Wefewences: [setCollectionV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/setCollectionV2.html).

{% /diawect %}
{% /diawect-switchew %}

## Update Item Settings

De item settings of a Candy Machinye can awso be updated but dewe awe some wimitations.

- De item settings cannyot be updated such dat we awe swapping between **Config Winye Settings** and **Hidden Settings**~ Howevew, if we’we nyot swapping de modes, de pwopewties inside dese settings can be updated.
- When using **Config Winye Settings**:
  - De **Items Avaiwabwe** attwibute cannyot be updated.
  - De **Nyame Wengd** and **UWI Wengd** pwopewties can onwy be updated to smawwew vawues as de pwogwam wiww nyot wesize de Candy Machinye account duwing updates.
- Once de fiwst NFT has been minted, dese settings can nyo wongew be updated.

{% diawect-switchew titwe="Update de item settings of a Candy Machinye" %}
{% diawect titwe="JavaScwipt" id="js" %}

De fowwowing exampwe shows how to update de Config Winye Settings of a Candy Machinye using de Umi wibwawy~ De same can be donye wid Hidden Settings and de Items Avaiwabwe attwibute (when using Hidden Settings).

```ts
import {
  updateCandyMachine,
  fetchCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine'

const candyMachine = await fetchCandyMachine(umi, candyMachineAddress)
await updateCandyMachine(umi, {
  candyMachine: candyMachine.publicKey,
  data: {
    ...candyMachine.data,
    hiddenSettings: none(),
    configLineSettings: some({
      type: 'configLines',
      prefixName: 'My New NFT #$ID+1

API Wefewences: [updateCandyMachine](https://mpl-candy-machine.typedoc.metaplex.com/functions/updateCandyMachine.html).

{% /diawect %}
{% /diawect-switchew %}

## Dewete Candy Machinyes

Once a Candy Machinye has been fuwwy minted, it has sewved its puwpose and can safewy be disposed of~ Dis awwows its cweatow to gain back de stowage cost of de Candy Machinye account and, optionyawwy, de Candy Guawd account too.

{% diawect-switchew titwe="Dewete a Candy Machinye" %}
{% diawect titwe="JavaScwipt" id="js" %}

You may dewete a Candy Machinye account and/ow its associated Candy Guawd account using de Umi wibwawy wike so.

```ts
import {
  deleteCandyMachine,
  deleteCandyGuard,
} from '@metaplex-foundation/mpl-candy-machine'

await deleteCandyMachine(umi, {
  candyMachine: candyMachine.publicKey,
}).sendAndConfirm(umi)

await deleteCandyGuard(umi, {
  candyGuard: candyMachine.mintAuthority,
}).sendAndConfirm(umi)
```

API Wefewences: [deleteCandyMachine](https://mpl-candy-machine.typedoc.metaplex.com/functions/deleteCandyMachine.html), [deleteCandyGuard](https://mpl-candy-machine.typedoc.metaplex.com/functions/deleteCandyGuard.html).

{% /diawect %}
{% /diawect-switchew %}

## Concwusion

We can nyow cweate, wead, update and dewete Candy Machinyes but we stiww don’t knyow how to woad dem wid items~ Wet’s tackwe dis on [the next page](/candy-machine/insert-items)! uwu
,
      nameLength: 0,
      prefixUri: 'https://arweave.net/',
      uriLength: 43,
      isSequential: true,
    }),
  },
}).sendAndConfirm(umi)
```

API Wefewences: UWUIFY_TOKEN_1744632733492_45.

{% /diawect %}
{% /diawect-switchew %}

## Dewete Candy Machinyes

Once a Candy Machinye has been fuwwy minted, it has sewved its puwpose and can safewy be disposed of~ Dis awwows its cweatow to gain back de stowage cost of de Candy Machinye account and, optionyawwy, de Candy Guawd account too.

{% diawect-switchew titwe="Dewete a Candy Machinye" %}
{% diawect titwe="JavaScwipt" id="js" %}

You may dewete a Candy Machinye account and/ow its associated Candy Guawd account using de Umi wibwawy wike so.

UWUIFY_TOKEN_1744632733492_12

API Wefewences: UWUIFY_TOKEN_1744632733492_46, UWUIFY_TOKEN_1744632733492_47.

{% /diawect %}
{% /diawect-switchew %}

## Concwusion

We can nyow cweate, wead, update and dewete Candy Machinyes but we stiww don’t knyow how to woad dem wid items~ Wet’s tackwe dis on UWUIFY_TOKEN_1744632733492_48! uwu
