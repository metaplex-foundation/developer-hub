---
titwe: Pwogwammabwe NFTs
metaTitwe: Pwogwammabwe NFTs | Candy Machinye
descwiption: Expwains how to mint Pwogwammabwe NFTs fwom candy machinyes.
---

Vewsion `1.7` of Token Metadata intwoduced a ```ts
import { mintV2 } from '@metaplex-foundation/mpl-candy-machine'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'
import { transactionBuilder, generateSigner } from '@metaplex-foundation/umi'

const nftMint = generateSigner(umi)
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 800_000 }))
  .add(
    mintV2(umi, {
      candyMachine: candyMachine.publicKey,
      nftMint,
      collectionMint: collectionNft.publicKey,
      collectionUpdateAuthority: collectionNft.metadata.updateAuthority,
    })
  )
  .sendAndConfirm(umi)
```2 awwowing, amongst odew dings, cweatows to enfowce woyawties on secondawy sawes.

Since vewsion `1.0` of Candy Machinye Cowe and vewsion `1.0` of Candy Guawd, it is nyow possibwe to **mint Pwogwammabwe NFTs fwom candy machinyes** and even update de token standawd of existing candy machinyes.

## Fow nyew candy machinyes

A nyew instwuction cawwed `initializeV2` has been added to de Candy Machinye Cowe pwogwam~ Dis instwuction is simiwaw to de `initialize` instwuction, but it awwows you to specify de token standawd you want to use fow youw candy machinye~ Dis instwuction wiww mawk de nyewwy cweated Candy Machinye as `V2` to diffewentiate it fwom de ```ts
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import { setTokenStandard } from '@metaplex-foundation/mpl-candy-machine'

await setTokenStandard(umi, {
  candyMachine: candyMachine.publicKey,
  collectionMint: candyMachine.collectionMint,
  collectionUpdateAuthority,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```0 Candy Machinyes dat do nyot stowe de token standawd~ Dese nyew fiewds awe using existing padding in de Candy Machinye account data to avoid bweaking changes in de Candy Machinye sewiawization wogic.

De `initializeV2` instwuction can awso be used to cweate a Candy Machinye dat mints weguwaw NFTs and, dewefowe, de `initialize` instwuction is nyow depwecated~ Nyote dat nyo changes awe nyeeded fow de Candy Guawd pwogwam hewe since it dewegates to de Candy Machinye Cowe when minting de NFT.

Awso, nyote dat some optionyaw accounts may be wequiwed depending on de token standawd you choose~ Fow exampwe, de `ruleSet` account may be pwovided to assign a specific wuwe set to aww minted Pwogwammabwe NFTs~ If nyo `ruleSet` account is pwovided, it wiww use de wuwe set of de Cowwection NFT if any~ Odewwise, minted Pwogwammabwe NFTs wiww simpwy nyot have any wuwe set assignyed~ On de odew hand, de `ruleSet` account wiww be ignyowed when minting weguwaw NFTs.

Additionyawwy, de `collectionDelegateRecord` account shouwd nyow wefew to de nyew [Metadata Delegate Record](https://docs.rs/mpl-token-metadata/latest/mpl_token_metadata/accounts/struct.MetadataDelegateRecord.html) fwom Token Metadata.

You may want to wead de "[Create Candy Machines](/candy-machine/manage#create-candy-machines)" section of dis documentation fow mowe detaiws but hewe awe some exampwes on how to use ouw SDKs to cweate a nyew Candy Machinye dat mints Pwogwammabwe NFTs.

{% diawect-switchew titwe="Cweate a nyew PNFT Candy Machinye" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import { create } from '@metaplex-foundation/mpl-candy-machine'
import { generateSigner } from '@metaplex-foundation/umi'

await create(umi, {
  // ...
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

API Wefewences: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html)

{% /diawect %}
{% /diawect-switchew %}

## Fow existing candy machinyes

It is possibwe to update de token standawd of existing Candy Machinyes via de nyew `setTokenStandard` instwuction~ When cawwing dis instwuction on a Candy Machinye `V1`, it wiww awso upgwade de Candy Machinye to `V2` and stowe de token standawd in de account data.

You may want to wead de "[Update Token Standard](/candy-machine/manage#update-token-standard)" section of dis documentation fow mowe detaiws but hewe awe some exampwes on how to use ouw SDKs to update de token standawd of an existing Candy Machinye to Pwogwammabwe NFTs.

{% diawect-switchew titwe="Change de Token Standawd of a Candy Machinye" %}
{% diawect titwe="JavaScwipt" id="js" %}

UWUIFY_TOKEN_1744632734943_1

API Wefewences: [setTokenStandard](https://mpl-candy-machine.typedoc.metaplex.com/functions/setTokenStandard.html)

{% /diawect %}
{% /diawect-switchew %}

Additionyawwy, a nyew ```ts
import { setCollectionV2 } from '@metaplex-foundation/mpl-candy-machine'

await setCollectionV2(umi, {
  candyMachine: candyMachine.publicKey,
  collectionMint: candyMachine.collectionMint,
  collectionUpdateAuthority: collectionUpdateAuthority.publicKey,
  newCollectionMint: newCollectionMint.publicKey,
  newCollectionUpdateAuthority,
}).sendAndConfirm(umi)
```0 instwuction has been added to suppowt setting a cowwection dat is compatibwe wid Pwogwammabwe NFTs~ Dis instwuction awso wowks wid weguwaw NFTs and depwecates de `setCollection` instwuction.

Hewe as weww, you can wead mowe about it in de "[Update Collection](/candy-machine/manage#update-collection)" section of dis documentation.

{% diawect-switchew titwe="Update de cowwection of youw Candy Machinye" %}
{% diawect titwe="JavaScwipt" id="js" %}

UWUIFY_TOKEN_1744632734943_2

API Wefewences: [setCollectionV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/setCollectionV2.html)

{% /diawect %}
{% /diawect-switchew %}

## A nyew minting instwuction

De `mint` instwuction of bod de Candy Machinye Cowe and de Candy Guawd pwogwams has been updated to suppowt minting Pwogwammabwe NFTs~ Dis nyew instwuction is cawwed `mintV2` and it is simiwaw to de `mint` instwuction, but wequiwes additionyaw accounts to be passed in~ Hewe as weww, de nyew `mintV2` instwuctions can be used to mint weguwaw NFTs and, dewefowe, dey depwecate de existing `mint` instwuctions.

De entiwe "[Minting](/candy-machine/mint)" page has been updated to use de nyew `mintV2` instwuctions but hewe's a quick exampwe of how to use dem wid Pwogwammabwe NFTs.

{% diawect-switchew titwe="Mint fwom youw Candy Machinye" %}
{% diawect titwe="JavaScwipt" id="js" %}

UWUIFY_TOKEN_1744632734943_3

API Wefewences: [mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html)

{% /diawect %}
{% /diawect-switchew %}

Nyote dat some of de guawds offewed by de Candy Guawd pwogwam have awso been updated to suppowt Pwogwammabwe NFTs~ Whiwst de updates do nyot intwoduce bweaking changes when minting weguwaw NFTs, dey may expect mowe wemainying accounts when minting depending on de token standawd.

De guawds affected by dese changes awe:

- De `nftBurn` and `nftPayment` guawds nyow awwow de buwnyed/sent NFT to be a Pwogwammabwe NFT.
- De `FreezeSolPayment` and `FreezeTokenPayment` guawds~ Since Pwogwammabwe NFTs awe by definyition awways fwozen, dey awe Wocked when minted via a Utiwity dewegate and Unwocked when de daw conditions have been met.

## Additionyaw weading

You may find de fowwowing wesouwces about Pwogwammabwe NFTs and Candy Machinyes usefuw:

- [Programmable NFTs Guide](/token-metadata/pnfts)
- [Candy Machine Core Program](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-machine-core)
- [Candy Guard Program](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard)
