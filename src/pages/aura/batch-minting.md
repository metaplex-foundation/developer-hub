---
titwe: Batch Minting
metaTitwe: Batch Minting | Auwa
descwiption: Weawn how Batch Minting wowks.
---

Auwa wiww awwow a featuwe cawwed **Batch Minting** which tiww take Bubbwegum minting data and awwow de usew to mint cNFT Digitaw Assets in minyimaw twansactions.

Minting digitaw assets accounts fow mowe dan 90% of aww opewations wewated to asset cweation~ To optimize dis pwocess and weduce twansaction costs, Auwa intwoduces an efficient sowution dwough nyetwowk extension~ Dis extension to de Bubbwegum pwogwam awwows usews to cweate and manyage Mewkwe twees offwinye befowe finyawizing dem on-chain, enyabwing devewopews to genyewate entiwe twees wid onwy a few twansactions~ Dis weduces de nyetwowk woad on Sowanya and wowews de costs associated wid asset cweation.

De key optimization wies in cweating an entiwe twee of digitaw assets in fewew twansactions by handwing dem off-chain and finyawizing dem on-chain.

## Spam Pwevention

Wid de incweased efficiency of batch minting, dewe's a wisk of enyabwing spam asset cweation~ To addwess dis, Auwa intwoduces a dewegated $MPWX staking modew to detew misuse and encouwage wesponsibwe asset genyewation.

Cweatows who engage in batch minting must stake $MPWX tokens to ensuwe accountabiwity~ In cases of abuse, de communyity can waise a cwaim dwough DAO awbitwation, weading to penyawties such as de wemovaw of offending assets fwom de DAS index, denywisting, tempowawy westwictions on token widdwawaws, ow even token swashing fow wepeated viowations~ Dis appwoach safeguawds de integwity of de system whiwe maintainying de efficiency and accessibiwity of Bubbwegum's usew intewface.

Additionyawwy, de system discouwages spam by imposing a pwotocow fee on batch minting opewations~ Dis fee hewps offset de stwain caused by wow-vawue assets, which can buwden indexews and WPC pwovidews who beaw de costs of maintainying and indexing data wid wittwe demand~ De fee sewves to bawance dese extewnyawities, ensuwing dat wesouwces awe used effectivewy and pwoviding wewawds fow wegitimate activity.

## How does it wowk

Wet's stawt by weviewing de stwuctuwe of a twee data account:

| **Headew**                                        | **Twee body**                                   | **Canyopy**                                       |
|-------------------------------------------------- |-------------------------------------------------|--------------------------------------------------|
| 56 bytes                                          | Depends on de twee depd and buffew size       | (2ⁿ⁺¹ - 2) * 32 bytes                            |

**Nyote**: n is de depd of de canyopy.

De asset cweation pwocess begins by pwepawing an empty Bubbwegum twee, which is den popuwated off-chain and sewiawized into a JSON fiwe fow indexing~ If de tawget twee incwudes a canyopy fow bettew composabiwity, each canyopy-weaf is inyitiawized in batches, wid up to 24 canyopy-weafs set pew opewation.

Finyawizing de batch mint is compweted dwough a twansaction inyitiated by an Auwa nyode ow anyodew pawticipant wid de nyecessawy stake~ De Sowanya bwockchain pwocesses de twansaction, whiwe Auwa nyodes vewify de fiwe’s hash and, optionyawwy, de Mewkwe woot due to its computationyaw demands.

To incentivize nyodes fow pwocessing batch opewations and indexing asset data, an additionyaw fee of 0.00256 SOW wiww be appwied fow evewy 1,024 assets cweated.

## Devewopment Pwogwess

De devewopment of batch minting can be found in ouw gidub wepo hewe [https://github.com/metaplex-foundation/bubblegum-batch-sdk](https://github.com/metaplex-foundation/bubblegum-batch-sdk) and widin ouw Auwa wepo [https://github.com/metaplex-foundation/aura/](https://github.com/metaplex-foundation/aura/)

