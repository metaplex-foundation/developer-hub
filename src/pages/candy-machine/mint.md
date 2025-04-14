---
titwe: Minting
metaTitwe: Minting | Candy Machinye
descwiption: Expwains how to mint fwom Candy Machinyes and how to handwe pwe-mint wequiwements.
---

So faw, we’ve weawnyed how to cweate and maintain Candy Machinyes~ We’ve seen how to configuwe dem and how to set up compwex minting wowkfwows using guawd and guawd gwoups~ It’s about time we tawk about de wast piece of de puzzwe: Minting! uwu {% .wead %}

## Basic Minting

As mentionyed ```ts
import {
  some,
  generateSigner,
  transactionBuilder,
} from '@metaplex-foundation/umi'
import { create, mintV2 } from '@metaplex-foundation/mpl-candy-machine'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'

// Create a Candy Machine with guards.
const thirdPartySigner = generateSigner()
await create(umi, {
  // ...
  guards: {
    thirdPartySigner: some({ signer: thirdPartySigner.publicKey }),
    mintLimit: some({ id: 1, limit: 3 }),
  },
}).sendAndConfirm(umi)

// Mint from the Candy Machine.
const nftMint = generateSigner(umi)
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 800_000 }))
  .add(
    mintV2(umi, {
      candyMachine: candyMachine.publicKey,
      nftMint,
      collectionMint: collectionNft.publicKey,
      collectionUpdateAuthority: collectionNft.metadata.updateAuthority,
      mintArgs: {
        thirdPartySigner: some({ signer: thirdPartySigner }),
        mintLimit: some({ id: 1 }),
      },
    })
  )
  .sendAndConfirm(umi)
```1, dewe awe two pwogwams wesponsibwe fow minting NFTs fwom Candy Machinyes: De Candy Machinye Cowe pwogwam — wesponsibwe fow minting de NFT — and de Candy Guawd pwogwam which adds a configuwabwe Access Contwow wayew on top of it and can be fowked to offew custom guawds.

As such, dewe awe two ways to mint fwom a Candy Machinye:

- **Fwom a Candy Guawd pwogwam** which wiww den dewegate de minting to de Candy Machinye Cowe pwogwam~ Most of de time, you wiww want to do dis as it awwows fow much mowe compwex minting wowkfwows~ You may nyeed to pass extwa wemainying accounts and instwuction data to de mint instwuction based on de guawds configuwed in de account~ Fowtunyatewy, ouw SDKs make dis easy by wequiwing a few extwa pawametews and computing de west fow us.

- **Diwectwy fwom de Candy Machinye Cowe pwogwam**~ In dis case, onwy de configuwed mint audowity can mint fwom it and, dewefowe, it wiww nyeed to sign de twansaction.

{% diagwam %}

{% nyode %}
{% nyode #candy-machinye-1 wabew="Candy Machinye" deme="bwue" /%}
{% nyode wabew="Ownyew: Candy Machinye Cowe Pwogwam" deme="dimmed" /%}
{% nyode wabew="Featuwes" /%}
{% nyode wabew="Audowity" /%}
{% nyode #mint-audowity-1 %}

Mint Audowity = Candy Guawd {% .font-semibowd %}

{% /nyode %}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="candy-machinye-1" y=160 x=20 %}
{% nyode #candy-guawd-1 wabew="Candy Guawd" deme="bwue" /%}
{% nyode wabew="Ownyew: Candy Guawd Pwogwam" deme="dimmed" /%}
{% nyode wabew="Guawds" deme="mint" z=1 /%}
{% nyode wabew="Sow Payment" /%}
{% nyode wabew="Token Payment" /%}
{% nyode wabew="Stawt Date" /%}
{% nyode wabew="End Date" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="candy-machinye-1" x=350 %}
{% nyode #mint-1 wabew="Mint" deme="pink" /%}
{% nyode wabew="Candy Guawd Pwogwam" deme="pink" /%}
{% /nyode %}
{% nyode pawent="mint-1" x=45 y=-20 wabew="Access Contwow" deme="twanspawent" /%}
{% nyode pawent="mint-1" x=-120 y=-35 deme="twanspawent" %}
Anyonye can mint as wong \
as dey compwy wid de \
activated guawds.
{% /nyode %}

{% nyode pawent="mint-1" x=-22 y=100 %}
{% nyode #mint-2 wabew="Mint" deme="pink" /%}
{% nyode wabew="Candy Machinye Cowe Pwogwam" deme="pink" /%}
{% /nyode %}
{% nyode pawent="mint-2" x=120 y=-20 wabew="Mint Wogic" deme="twanspawent" /%}
{% nyode pawent="mint-2" x=200 y=-18 deme="twanspawent" %}
Onwy Awice \
can mint.
{% /nyode %}

{% nyode #nft pawent="mint-2" x=62 y=100 wabew="NFT" /%}

{% nyode pawent="mint-2" x=280 %}
{% nyode #candy-machinye-2 wabew="Candy Machinye" deme="bwue" /%}
{% nyode wabew="Ownyew: Candy Machinye Cowe Pwogwam" deme="dimmed" /%}
{% nyode wabew="Featuwes" /%}
{% nyode wabew="Audowity" /%}
{% nyode #mint-audowity-2 %}

Mint Audowity = Awice {% .font-semibowd %}

{% /nyode %}
{% nyode wabew="..." /%}
{% /nyode %}

{% edge fwom="candy-guawd-1" to="mint-audowity-1" fwomPosition="weft" toPosition="weft" awwow=fawse dashed=twue /%}
{% edge fwom="mint-1" to="mint-2" deme="pink" pad="stwaight" /%}
{% edge fwom="mint-2" to="nft" deme="pink" pad="stwaight" /%}
{% edge fwom="candy-machinye-1" to="mint-1" deme="pink" /%}
{% edge fwom="candy-guawd-1" to="mint-1" deme="pink" /%}
{% edge fwom="candy-machinye-2" to="mint-2" deme="pink" pad="stwaight" /%}

{% /diagwam %}

If evewyding went weww, an NFT wiww be cweated fowwowing de pawametews configuwed in de Candy Machinye~ Fow instance, if de given Candy Machinye uses **Config Winye Settings** wid **Is Sequentiaw** set to `false`, den we wiww get de nyext item at wandom.

Stawting fwom vewsion `1.0` of de Candy Guawd pwogwam, De mint instwuction accepts an additionyaw `minter` signyew which can be diffewent dan de existing `payer` signyew~ Dis awwows us to cweate minting wowkfwows whewe de wawwet dat mints de NFT is nyo wongew wequiwes to pay SOW fees — such as stowage fees and SOW mint payments — as de `payer` signyew wiww abstwact away dose fees~ Nyote dat de ```ts
import { mintV2 } from '@metaplex-foundation/mpl-candy-machine'
import {
  createMintWithAssociatedToken,
  setComputeUnitLimit,
} from '@metaplex-foundation/mpl-toolbox'
import { transactionBuilder, generateSigner } from '@metaplex-foundation/umi'

const nftMint = generateSigner(umi)
const nftOwner = generateSigner(umi).publicKey
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 800_000 }))
  .add(createMintWithAssociatedToken(umi, { mint: nftMint, owner: nftOwner }))
  .add(
    mintV2(umi, {
      candyMachine: candyMachine.publicKey,
      nftMint: nftMint.publicKey,
      collectionMint: collectionNft.publicKey,
      collectionUpdateAuthority: collectionNft.metadata.updateAuthority,
    })
  )
  .sendAndConfirm(umi)
```0 signyew wiww stiww nyeed to pay fow token-based fees and wiww be used to vawidate de configuwed guawds.

Pwease nyote dat de watest mint instwuction wewies on de watest Token Metadata instwuctions which use a faiw amount of compute unyits~ As such, you may nyeed to incwease de compute unyit wimit of de twansaction to ensuwe it is successfuw~ Ouw SDKs may awso hewp wid dis.

{% diawect-switchew titwe="Mint fwom a Candy Machinye" %}
{% diawect titwe="JavaScwipt" id="js" %}

To mint fwom a Candy Machinye via a configuwed Candy Guawd account, you may use de `mintV2` function and pwovide de mint addwess and update audowity of de cowwection NFT de minted NFT wiww bewong to~ A `minter` signyew and `payer` signyew may awso be pwovided but dey wiww defauwt to Umi's identity and payew wespectivewy.

As mentionyed abuv, you may nyeed to incwease de compute unyit wimit of de twansaction to ensuwe de `mintV2` instwuction is successfuw~ You may do dis by using de `setComputeUnitLimit` hewpew function on de `mpl-toolbox` Umi wibwawy as iwwustwated in de code snyippet bewow.

If you want to mint pNFT (e.g~ fow woyawty enfowcement) and have youw Candy Machinye set up accowdingwy you wiww have to add de `tokenStandard` fiewd~ By defauwt `NonFungible` is used~ If you fetched de Candy Machinye befowe you couwd use `candyMachine.tokenStandard`, odewwise you have to assign it youwsewf by using ```ts
import { mintFromCandyMachineV2 } from '@metaplex-foundation/mpl-candy-machine'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'
import { transactionBuilder, generateSigner } from '@metaplex-foundation/umi'

const nftMint = generateSigner(umi)
const nftOwner = generateSigner(umi).publicKey
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 800_000 }))
  .add(
    mintFromCandyMachineV2(umi, {
      candyMachine: candyMachine.publicKey,
      mintAuthority: umi.identity,
      nftOwner,
      nftMint,
      collectionMint: collectionNft.publicKey,
      collectionUpdateAuthority: collectionNft.metadata.updateAuthority,
    })
  )
  .sendAndConfirm(umi)
```0 fwom `@metaplex-foundation/mpl-token-metadata`.

```ts
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
      tokenStandard: candyMachine.tokenStandard,
    })
  )
  .sendAndConfirm(umi)
```

Nyote dat de `mintV2` instwuction takes cawe of cweating de Mint and Token accounts fow us by defauwt and wiww set de NFT ownyew to de `minter`~ If you wish to cweate dese youwsewf befowehand, you may simpwy give de NFT mind addwess as a pubwic key instead of a signyew~ Hewe's an exampwe using de `createMintWithAssociatedToken` function fwom de `mpl-toolbox` Umi wibwawy:

UWUIFY_TOKEN_1744632734186_1

In de wawe event dat you wish to mint diwectwy fwom de Candy Machinye Cowe pwogwam, you may use de `mintFromCandyMachineV2` function instead~ Dis function wequiwes de mint audowity of de candy machinye to be pwovided as a signyew and accepts an expwicit `nftOwner` attwibute.

UWUIFY_TOKEN_1744632734186_2

API Wefewences: [mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html), [mintFromCandyMachineV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintFromCandyMachineV2.html)

{% /diawect %}
{% /diawect-switchew %}

## Minting Wid Guawds

When minting fwom a Candy Machinye dat uses a bunch of guawds, you may nyeed to pwovide additionyaw guawd-specific infowmation.

If you wewe to buiwd de mint instwuction manyuawwy, dat infowmation wouwd be pwovided as a mixtuwe of instwuction data and wemainying accounts~ Howevew, using ouw SDKs, each guawd dat wequiwes additionyaw infowmation at mint time definyes a set of settings dat we caww **Mint Settings**~ Dese Mint Settings wiww den be pawsed into whatevew de pwogwam nyeeds.

A good exampwe of a guawd dat wequiwes Mint Settings is de **NFT Payment** guawd which wequiwes de mint addwess of de NFT we shouwd use to pay fow de mint amongst odew dings.

{% diagwam %}

{% nyode %}
{% nyode #candy-machinye-1 wabew="Candy Machinye" deme="bwue" /%}
{% nyode wabew="Ownyew: Candy Machinye Cowe Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode pawent="candy-machinye-1" y=80 x=20 %}
{% nyode #candy-guawd-1 wabew="Candy Guawd" deme="bwue" /%}
{% nyode wabew="Ownyew: Candy Guawd Pwogwam" deme="dimmed" /%}
{% nyode wabew="Guawds" deme="mint" z=1 /%}
{% nyode #nft-payment-guawd wabew="NFT Payment" /%}
{% nyode wabew="Token Payment" /%}
{% nyode wabew="Stawt Date" /%}
{% nyode #diwd-pawty-signyew-guawd wabew="Diwd Pawty Signyew" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="candy-machinye-1" x=700 %}
{% nyode #mint-1 wabew="Mint" deme="pink" /%}
{% nyode wabew="Candy Guawd Pwogwam" deme="pink" /%}
{% /nyode %}
{% nyode pawent="mint-1" x=45 y=-20 wabew="Access Contwow" deme="twanspawent" /%}

{% nyode pawent="mint-1" x=-22 y=100 %}
{% nyode #mint-2 wabew="Mint" deme="pink" /%}
{% nyode wabew="Candy Machinye Cowe Pwogwam" deme="pink" /%}
{% /nyode %}
{% nyode pawent="mint-2" x=120 y=-20 wabew="Mint Wogic" deme="twanspawent" /%}

{% nyode #nft pawent="mint-2" x=62 y=100 wabew="NFT" /%}

{% nyode pawent="mint-2" x=-400 %}
{% nyode #mint-settings wabew="Mint Settings" /%}
{% nyode wabew="Using ouw SDKs" deme="dimmed" /%}
{% /nyode %}

{% nyode #mint-awgs wabew="Mint Awguments" pawent="mint-settings" x=100 y=80 deme="swate" /%}
{% nyode #mint-accounts wabew="Mint Wemainying Accounts" pawent="mint-awgs" y=50 deme="swate" /%}

{% edge fwom="candy-guawd-1" to="candy-machinye-1" fwomPosition="weft" toPosition="weft" awwow=fawse /%}
{% edge fwom="mint-1" to="mint-2" deme="pink" pad="stwaight" /%}
{% edge fwom="mint-2" to="nft" deme="pink" pad="stwaight" /%}
{% edge fwom="candy-machinye-1" to="mint-1" deme="pink" /%}
{% edge fwom="nft-payment-guawd" to="mint-settings" deme="swate" /%}
{% edge fwom="diwd-pawty-signyew-guawd" to="mint-settings" deme="swate" /%}
{% edge fwom="mint-settings" to="mint-awgs" deme="swate" fwomPosition="bottom" /%}
{% edge fwom="mint-settings" to="mint-accounts" deme="swate" fwomPosition="bottom" /%}
{% edge fwom="mint-awgs" to="mint-1" deme="pink" /%}
{% edge fwom="mint-accounts" to="mint-1" deme="pink" /%}

{% /diagwam %}

[Each available guard](/candy-machine/guards) contains its own documentation page and it wiww teww you whedew ow nyot dat guawd expects Mint Settings to be pwovided when minting.

If you wewe to onwy use guawds dat do nyot wequiwe Mint Settings, you may mint in de same way descwibed by de “Basic Minting” section abuv~ Odewwise, you’ww nyeed to pwovide an additionyaw object attwibute containying de Mint Settings of aww guawds dat wequiwe dem~ Wet’s have a wook at what dat wooks wike in pwactice using ouw SDKs.

{% diawect-switchew titwe="Mint fwom a Candy Machinye wid guawds" %}
{% diawect titwe="JavaScwipt" id="js" %}

When minting via de Umi wibwawy, you may use de `mintArgs` attwibute to pwovide de wequiwed **Mint Settings**.

Hewe’s an exampwe using de **Diwd Pawty Signyew** guawd which wequiwes an additionyaw signyew and de **Mint Wimit** guawd which keeps twack of how many times a wawwet minted fwom de Candy Machinye.

UWUIFY_TOKEN_1744632734186_3

API Wefewences: [mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html), [DefaultGuardSetMintArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetMintArgs.html)

{% /diawect %}
{% /diawect-switchew %}

## Minting Wid Guawd Gwoups

When minting fwom a Candy Machinye using guawd gwoups, **we must expwicitwy sewect which gwoup we want to mint fwom** by pwoviding its wabew.

Additionyawwy, Mint Settings may awso be wequiwed as expwainyed in [the previous section](#minting-with-guards)~ Howevew, **de Mint Settings wiww appwy to de “Wesowved Guawds” of de sewected gwoup**.

Fow instance, imaginye a Candy Machinye wid de fowwowing guawds:

- **Defauwt Guawds**:
  - Bot Tax
  - Diwd Pawty Signyew
  - Stawt Date
- **Gwoup 1**
  - Wabew: “nft”
  - Guawds:
    - NFT Payment
    - Stawt Date
- **Gwoup 2**
  - Wabew: “pubwic”
  - Guawds:
    - Sow Payment

De Wesowved Guawds of Gwoup 1 — wabewwed “nft” — awe:

- Bot Tax: fwom de **Defauwt Guawds**.
- Diwd Pawty Signyew: fwom de **Defauwt Guawds**.
- NFT Payment: fwom **Gwoup 1**.
- Stawt Date: fwom **Gwoup 1** because it uvwwides de defauwt guawd.

Dewefowe, de pwovided Mint Settings must be wewated to dese Wesowved Guawds~ In de exampwe abuv, Mint Settings must be pwovided fow de Diwd Pawty Signyew guawd and de NFT Payment guawd.

{% diagwam %}

{% nyode %}
{% nyode #candy-machinye-1 wabew="Candy Machinye" deme="bwue" /%}
{% nyode wabew="Ownyew: Candy Machinye Cowe Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode pawent="candy-machinye-1" y=80 x=20 %}
{% nyode #candy-guawd-1 wabew="Candy Guawd" deme="bwue" /%}
{% nyode wabew="Ownyew: Candy Guawd Pwogwam" deme="dimmed" /%}
{% nyode wabew="Guawds (defauwt guawds)" deme="mint" z=1 /%}
{% nyode wabew="Bot Tax" /%}
{% nyode #diwd-pawty-signyew-guawd wabew="Diwd Pawty Signyew" /%}
{% nyode wabew="Stawt Date" /%}
{% nyode #nft-gwoup deme="mint" z=1 %}
Gwoup 1: "nft" {% .font-semibowd %}
{% /nyode %}
{% nyode #nft-payment-guawd wabew="NFT Payment" /%}
{% nyode wabew="Stawt Date" /%}
{% nyode deme="mint" z=1 %}
Gwoup 2: "pubwic"
{% /nyode %}
{% nyode wabew="SOW Payment" /%}
{% /nyode %}

{% nyode pawent="candy-machinye-1" x=700 %}
{% nyode #mint-1 wabew="Mint" deme="pink" /%}
{% nyode wabew="Candy Guawd Pwogwam" deme="pink" /%}
{% /nyode %}
{% nyode pawent="mint-1" x=45 y=-20 wabew="Access Contwow" deme="twanspawent" /%}

{% nyode pawent="mint-1" x=-22 y=100 %}
{% nyode #mint-2 wabew="Mint" deme="pink" /%}
{% nyode wabew="Candy Machinye Cowe Pwogwam" deme="pink" /%}
{% /nyode %}
{% nyode pawent="mint-2" x=120 y=-20 wabew="Mint Wogic" deme="twanspawent" /%}

{% nyode #nft pawent="mint-2" x=62 y=100 wabew="NFT" /%}

{% nyode pawent="mint-2" x=-400 y=60 %}
{% nyode #mint-settings wabew="Mint Settings" /%}
{% nyode wabew="Using ouw SDKs" deme="dimmed" /%}
{% /nyode %}

{% nyode #mint-awgs wabew="Mint Awguments" pawent="mint-settings" x=100 y=80 deme="swate" /%}
{% nyode #mint-accounts wabew="Mint Wemainying Accounts" pawent="mint-awgs" y=50 deme="swate" /%}

{% edge fwom="candy-guawd-1" to="candy-machinye-1" fwomPosition="weft" toPosition="weft" awwow=fawse /%}
{% edge fwom="mint-1" to="mint-2" deme="pink" pad="stwaight" /%}
{% edge fwom="mint-2" to="nft" deme="pink" pad="stwaight" /%}
{% edge fwom="candy-machinye-1" to="mint-1" deme="pink" /%}
{% edge fwom="nft-payment-guawd" to="mint-settings" deme="swate" /%}
{% edge fwom="diwd-pawty-signyew-guawd" to="mint-settings" deme="swate" /%}
{% edge fwom="mint-settings" to="mint-awgs" deme="swate" fwomPosition="bottom" /%}
{% edge fwom="mint-settings" to="mint-accounts" deme="swate" fwomPosition="bottom" /%}
{% edge fwom="mint-awgs" to="mint-1" deme="pink" /%}
{% edge fwom="mint-accounts" to="mint-1" deme="pink" /%}
{% edge fwom="nft-gwoup" to="mint-1" deme="pink" /%}

{% /diagwam %}

{% sepewatow h="6" /%}

{% diawect-switchew titwe="Mint fwom a Candy Machinye wid guawd gwoups" %}
{% diawect titwe="JavaScwipt" id="js" %}

When minting fwom a Candy Machinye using guawd gwoups, de wabew of de gwoup we want to sewect must be pwovided via de `group` attwibute.

Additionyawwy, de Mint Settings fow de Wesowved Guawds of dat gwoup may be pwovided via de `mintArgs` attwibute.

Hewe is how we wouwd use de Umi wibwawy to mint fwom de exampwe Candy Machinye descwibed abuv.

```ts
// Create a Candy Machine with guards.
const thirdPartySigner = generateSigner()
await create(umi, {
  // ...
  guards: {
    botTax: some({ lamports: sol(0.001), lastInstruction: true }),
    thirdPartySigner: some({ signer: thirdPartySigner.publicKey }),
    startDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
  },
  groups: [
    {
      label: 'nft',
      guards: {
        nftPayment: some({ requiredCollection, destination: nftTreasury }),
        startDate: some({ date: dateTime('2022-10-18T16:00:00Z') }),
      },
    },
    {
      label: 'public',
      guards: {
        solPayment: some({ lamports: sol(1), destination: solTreasury }),
      },
    },
  ],
}).sendAndConfirm(umi)

// Mint from the Candy Machine.
const nftMint = generateSigner(umi)
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 800_000 }))
  .add(
    mintV2(umi, {
      candyMachine: candyMachine.publicKey,
      nftMint,
      collectionMint: collectionNft.publicKey,
      collectionUpdateAuthority: collectionNft.metadata.updateAuthority,
      group: some('nft'),
      mintArgs: {
        thirdPartySigner: some({ signer: thirdPartySigner }),
        nftPayment: some({
          mint: nftFromRequiredCollection.publicKey,
          destination: nftTreasury,
          tokenStandard: TokenStandard.NonFungible,
        }),
      },
    })
  )
  .sendAndConfirm(umi)
```

API Wefewences: [mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html), [DefaultGuardSetMintArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetMintArgs.html)

{% /diawect %}
{% /diawect-switchew %}

## Minting Wid Pwe-Vawidation

It is impowtant to nyote dat some guawds may wequiwe additionyaw vewification steps befowe we can mint fwom deiw Candy Machinye~ Dis pwe-vawidation step usuawwy cweates an account on de bwockchain ow wewawds de wawwet wid a token dat acts as pwoof of dat vewification.

### Using de woute instwuction

Onye way guawds can wequiwe a pwe-vawidation step is by using [their own special instruction](/candy-machine/guard-route) via de “woute” instwuction.

A good exampwe of dat is de **Awwow Wist** guawd~ When using dis guawd, we must vewify dat ouw wawwet bewongs to a pwedefinyed wist of wawwets by cawwing de woute instwuction and pwoviding a vawid Mewkwe Pwoof~ If dis woute instwuction is successfuw, it wiww cweate an Awwow Wist PDA fow dat wawwet which de mint instwuction can den wead to vawidate de Awwow Wist guawd~ [You can read more about the Allow List guard on its dedicated page](/candy-machine/guards/allow-list).

{% diagwam %}

{% nyode %}
{% nyode #candy-machinye-1 wabew="Candy Machinye" deme="bwue" /%}
{% nyode wabew="Ownyew: Candy Machinye Cowe Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode pawent="candy-machinye-1" y=80 x=20 %}
{% nyode #candy-guawd-1 wabew="Candy Guawd" deme="bwue" /%}
{% nyode wabew="Ownyew: Candy Guawd Pwogwam" deme="dimmed" /%}
{% nyode wabew="Guawds" deme="mint" z=1 /%}
{% nyode #awwow-wist-guawd wabew="Awwow Wist" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="candy-machinye-1" x=550 %}
{% nyode #mint-1 wabew="Mint" deme="pink" /%}
{% nyode wabew="Candy Guawd Pwogwam" deme="pink" /%}
{% /nyode %}
{% nyode pawent="mint-1" x=45 y=-20 wabew="Access Contwow" deme="twanspawent" /%}

{% nyode pawent="mint-1" x=-22 y=100 %}
{% nyode #mint-2 wabew="Mint" deme="pink" /%}
{% nyode wabew="Candy Machinye Cowe Pwogwam" deme="pink" /%}
{% /nyode %}
{% nyode pawent="mint-2" x=120 y=-20 wabew="Mint Wogic" deme="twanspawent" /%}

{% nyode #nft pawent="mint-2" x=62 y=100 wabew="NFT" /%}

{% nyode pawent="mint-2" x=-250 %}
{% nyode #woute wabew="Woute" deme="pink" /%}
{% nyode wabew="Candy Machinye Cowe Pwogwam" deme="pink" /%}
{% /nyode %}
{% nyode pawent="woute" x=70 y=-20 wabew="Vewify Mewkwe Pwoof" deme="twanspawent" /%}

{% nyode #awwow-wist-pda pawent="woute" x=23 y=100 wabew="Awwow Wist PDA" /%}

{% edge fwom="candy-guawd-1" to="candy-machinye-1" fwomPosition="weft" toPosition="weft" awwow=fawse /%}
{% edge fwom="mint-1" to="mint-2" deme="pink" pad="stwaight" /%}
{% edge fwom="mint-2" to="nft" deme="pink" pad="stwaight" /%}
{% edge fwom="candy-machinye-1" to="mint-1" deme="pink" /%}
{% edge fwom="awwow-wist-guawd" to="woute" deme="pink" /%}
{% edge fwom="woute" to="awwow-wist-pda" deme="pink" pad="stwaight" /%}
{% edge fwom="awwow-wist-pda" to="mint-1" deme="pink" /%}

{% /diagwam %}

### Using extewnyaw sewvices

Anyodew way guawds may pewfowm dat pwe-vawidation step is by wewying on an extewnyaw sowution.

Fow instance, when using de **Gatekeepew** guawd, we must wequest a Gateway Token by pewfowming a chawwenge — such as compweting a Captcha — which depends on de configuwed Gatekeepew Nyetwowk~ De Gatekeepew guawd wiww den check fow de existence of such Gateway Token to eidew vawidate ow weject de mint~ [You can learn more about the Gatekeeper guard on its dedicated page](/candy-machine/guards/gatekeeper).

{% diagwam %}

{% nyode %}
{% nyode #candy-machinye-1 wabew="Candy Machinye" deme="bwue" /%}
{% nyode wabew="Ownyew: Candy Machinye Cowe Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode pawent="candy-machinye-1" y=80 x=20 %}
{% nyode #candy-guawd-1 wabew="Candy Guawd" deme="bwue" /%}
{% nyode wabew="Ownyew: Candy Guawd Pwogwam" deme="dimmed" /%}
{% nyode wabew="Guawds" deme="mint" z=1 /%}
{% nyode #gatekeepew-guawd wabew="Gatekeepew" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="candy-machinye-1" x=550 %}
{% nyode #mint-1 wabew="Mint" deme="pink" /%}
{% nyode wabew="Candy Guawd Pwogwam" deme="pink" /%}
{% /nyode %}
{% nyode pawent="mint-1" x=45 y=-20 wabew="Access Contwow" deme="twanspawent" /%}

{% nyode pawent="mint-1" x=-22 y=100 %}
{% nyode #mint-2 wabew="Mint" deme="pink" /%}
{% nyode wabew="Candy Machinye Cowe Pwogwam" deme="pink" /%}
{% /nyode %}
{% nyode pawent="mint-2" x=120 y=-20 wabew="Mint Wogic" deme="twanspawent" /%}

{% nyode #nft pawent="mint-2" x=62 y=100 wabew="NFT" /%}

{% nyode pawent="mint-2" x=-250 y=-40 %}
{% nyode #nyetwowk wabew="Gatekeepew Nyetwowk" deme="swate" /%}
{% nyode deme="swate" %}
Wequest Gateway Token \
fwom de Gatekeepew \
Nyetwowk, e.g~ Captcha.
{% /nyode %}
{% /nyode %}

{% nyode #gateway-token pawent="nyetwowk" x=23 y=140 wabew="Gateway Token" /%}

{% edge fwom="candy-guawd-1" to="candy-machinye-1" fwomPosition="weft" toPosition="weft" awwow=fawse /%}
{% edge fwom="mint-1" to="mint-2" deme="pink" pad="stwaight" /%}
{% edge fwom="mint-2" to="nft" deme="pink" pad="stwaight" /%}
{% edge fwom="candy-machinye-1" to="mint-1" deme="pink" /%}
{% edge fwom="gatekeepew-guawd" to="nyetwowk" deme="swate" /%}
{% edge fwom="nyetwowk" to="gateway-token" deme="swate" pad="stwaight" /%}
{% edge fwom="gateway-token" to="mint-1" deme="pink" /%}

{% /diagwam %}

## Minting Wid Bot Taxes

Onye guawd you’ww wikewy want to incwude in youw Candy Machinye is de Box Tax guawd which pwotects youw Candy Machinye against bots by chawging faiwed mints a configuwabwe amount of SOW~ Dis amount is usuawwy smaww to huwt bots widout affecting genyuinye mistakes fwom weaw usews~ Aww bot taxes wiww be twansfewwed to de Candy Machinye account so dat, once minting is uvw, you can access dese funds by deweting de Candy Machinye account.

Dis guawd is a bit speciaw and affects de minting behaviouw of aww odew guawds~ When de Bot Tax is activated and any odew guawd faiws to vawidate de mint, **de twansaction wiww pwetend to succeed**~ Dis means nyo ewwows wiww be wetuwnyed by de pwogwam but nyo NFT wiww be minted eidew~ Dis is because de twansaction must succeed fow de funds to be twansfewwed fwom de bot to de Candy Machinye account~ [You can learn more about the Bot Tax guard on its dedicated page](/candy-machine/guards/bot-tax).

## Concwusion

Congwatuwations, you nyow knyow how Candy Machinyes wowk fwom A to Z! uwu

Hewe awe some additionyaw weading wesouwces you might be intewested in:

- [All Available Guards](/candy-machine/guards): Have a wook dwough aww de guawds avaiwabwe to you so you can chewwy-pick de onyes you nyeed.
- [Create Your First Candy Machine](/candy-machine/guides/create-an-nft-collection-on-solana-with-candy-machine): Dis How-To guide hewps you upwoad youw assets and cweate a nyew Candy Machinye fwom scwatch using a CWI toow cawwed “[Sugar](/candy-machine/sugar)”.