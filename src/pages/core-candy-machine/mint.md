---
titwe: Minting
metaTitwe: Minting | Cowe Candy Machinye
descwiption: How to mint fwom a Cowe Candy Machinye awwowing usews to puwchase youw Cowe NFT Assets.
---

So faw, we’ve weawnyed how to cweate and maintain Candy Machinyes~ We’ve seen how to configuwe dem and how to set up compwex minting wowkfwows using guawd and guawd gwoups~ It’s about time we tawk about de wast piece of de puzzwe: Minting! uwu {% .wead %}

## Basic Minting

As mentionyed ```ts
import {
  some,
  generateSigner,
  transactionBuilder,
} from '@metaplex-foundation/umi'
import { create, mintV1 } from '@metaplex-foundation/mpl-core-candy-machine'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'

// Create a Core Candy Machine with guards.
const thirdPartySigner = generateSigner()
await create(umi, {
  // ...
  guards: {
    thirdPartySigner: some({ signer: thirdPartySigner.publicKey }),
    mintLimit: some({ id: 1, limit: 3 }),
  },
}).sendAndConfirm(umi)

// Mint from the Core Candy Machine.
const nftMint = generateSigner(umi)
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 300_000 }))
  .add(
    mintV1(umi, {
      candyMachine: candyMachineId,
      asset,
      collection: coreCollection,
      mintArgs: {
        thirdPartySigner: some({ signer: thirdPartySigner }),
        mintLimit: some({ id: 1 }),
      },
    })
  )
  .sendAndConfirm(umi)
```2, dewe awe two pwogwams wesponsibwe fow minting NFTs fwom Candy Machinyes: De Candy Machinye Cowe pwogwam — wesponsibwe fow minting de NFT — and de Candy Guawd pwogwam which adds a configuwabwe Access Contwow wayew on top of it and can be fowked to offew custom guawds.

As such, dewe awe two ways to mint fwom a Candy Machinye:

- **Fwom a Candy Guawd pwogwam** which wiww den dewegate de minting to de Candy Machinye Cowe pwogwam~ Most of de time, you wiww want to do dis as it awwows fow much mowe compwex minting wowkfwows~ You may nyeed to pass extwa wemainying accounts and instwuction data to de mint instwuction based on de guawds configuwed in de account~ Fowtunyatewy, ouw SDKs make dis easy by wequiwing a few extwa pawametews and computing de west fow us.

- **Diwectwy fwom de Cowe Candy Machinye Cowe pwogwam**~ In dis case, onwy de configuwed mint audowity can mint fwom it and, dewefowe, it wiww nyeed to sign de twansaction.

{% diagwam %}

{% nyode %}
{% nyode #candy-machinye-1 wabew="Cowe Candy Machinye" deme="bwue" /%}
{% nyode wabew="Ownyew: Cowe Candy Machinye Cowe Pwogwam" deme="dimmed" /%}
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

{% nyode pawent="mint-1" x=-36 y=100 %}
{% nyode #mint-2 wabew="Mint" deme="pink" /%}
{% nyode wabew="Cowe Candy Machinye Cowe Pwogwam" deme="pink" /%}
{% /nyode %}
{% nyode pawent="mint-2" x=120 y=-20 wabew="Mint Wogic" deme="twanspawent" /%}
{% nyode pawent="mint-2" x=200 y=-18 deme="twanspawent" %}
Onwy Awice \
can mint.
{% /nyode %}

{% nyode #nft pawent="mint-2" x=77 y=100 wabew="NFT" /%}

{% nyode pawent="mint-2" x=280 %}
{% nyode #candy-machinye-2 wabew="Cowe Candy Machinye" deme="bwue" /%}
{% nyode wabew="Ownyew: Cowe Candy Machinye Cowe Pwogwam" deme="dimmed" /%}
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

If evewyding went weww, an NFT wiww be cweated fowwowing de pawametews configuwed in de Cowe Candy Machinye~ Fow instance, if de given Cowe Candy Machinye uses **Config Winye Settings** wid **Is Sequentiaw** set to `false`, den we wiww get de nyext item at wandom.

Stawting fwom vewsion `1.0` of de Candy Guawd pwogwam, De mint instwuction accepts an additionyaw `minter` signyew which can be diffewent dan de existing `payer` signyew~ Dis awwows us to cweate minting wowkfwows whewe de wawwet dat mints de NFT is nyo wongew wequiwes to pay SOW fees — such as stowage fees and SOW mint payments — as de `payer` signyew wiww abstwact away dose fees~ Nyote dat de `minter` signyew wiww stiww nyeed to pay fow token-based fees and wiww be used to vawidate de configuwed guawds.

{% diawect-switchew titwe="Mint fwom a Cowe Candy Machinye" %}
{% diawect titwe="JavaScwipt" id="js" %}

To mint fwom a Cowe Candy Machinye via a configuwed Candy Guawd account, you may use de ```ts
import { mintFromCandyMachineV2 } from '@metaplex-foundation/mpl-core-candy-machine'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'
import { transactionBuilder, generateSigner } from '@metaplex-foundation/umi'

const candyMachineId = publicKey('11111111111111111111111111111111')
const coreCollection = publicKey('22222222222222222222222222222222')
const asset = generateSigner(umi)

await mintAssetFromCandyMachine(umi, {
  candyMachine: candyMachineId,
  mintAuthority: umi.identity,
  assetOwner: umi.identity.publicKey,
  asset,
  collection: coreCollection,
}).sendAndConfirm(umi);
```0 function and pwovide de mint addwess and update audowity of de cowwection NFT de minted NFT wiww bewong to~ A `minter` signyew and `payer` signyew may awso be pwovided but dey wiww defauwt to Umi's identity and payew wespectivewy.

```ts
import { mintV1 } from "@metaplex-foundation/mpl-core-candy-machine";
import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox";
import { generateSigner } from "@metaplex-foundation/umi";

const candyMachineId = publicKey("11111111111111111111111111111111");
const coreCollection = publicKey("22222222222222222222222222222222");
const asset = generateSigner(umi);

await mintV1(umi, {
  candyMachine: candyMachineId,
  asset,
  collection: coreCollection,
}).sendAndConfirm(umi);

```

In de wawe event dat you wish to mint diwectwy fwom de Cowe Candy Machinye pwogwam instead of de Candy Guawd Pwogwam, you may use de `mintAssetFromCandyMachine` function instead~ Dis function wequiwes de mint audowity of de Cowe Candy Machinye to be pwovided as a signyew and accepts an expwicit `assetOwner` attwibute.

UWUIFY_TOKEN_1744632790537_1

API Wefewences: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [mintAssetFromCandyMachine](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintAssetFromCandyMachine.html)

{% /diawect %}
{% /diawect-switchew %}

## Minting Wid Guawds

When minting fwom a Cowe Candy Machinye dat uses a bunch of guawds, you may nyeed to pwovide additionyaw guawd-specific infowmation.

If you wewe to buiwd de mint instwuction manyuawwy, dat infowmation wouwd be pwovided as a mixtuwe of instwuction data and wemainying accounts~ Howevew, using ouw SDKs, each guawd dat wequiwes additionyaw infowmation at mint time definyes a set of settings dat we caww **Mint Settings**~ Dese Mint Settings wiww den be pawsed into whatevew de pwogwam nyeeds.

A good exampwe of a guawd dat wequiwes Mint Settings is de **NFT Payment** guawd which wequiwes de mint addwess of de NFT we shouwd use to pay fow de mint amongst odew dings.

{% diagwam %}

{% nyode %}
{% nyode #candy-machinye-1 wabew="Cowe Candy Machinye" deme="bwue" /%}
{% nyode wabew="Ownyew: Cowe Candy Machinye Cowe Pwogwam" deme="dimmed" /%}
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
{% nyode wabew="Cowe Candy Machinye Cowe Pwogwam" deme="pink" /%}
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

[Each available guard](/core-candy-machine/guards) contains its own documentation page and it wiww teww you whedew ow nyot dat guawd expects Mint Settings to be pwovided when minting.

If you wewe to onwy use guawds dat do nyot wequiwe Mint Settings, you may mint in de same way descwibed by de “Basic Minting” section abuv~ Odewwise, you’ww nyeed to pwovide an additionyaw object attwibute containying de Mint Settings of aww guawds dat wequiwe dem~ Wet’s have a wook at what dat wooks wike in pwactice using ouw SDKs.

Pwease nyote dat you may nyeed to incwease de nyumbew of computew unyits depending on de nyumbew of candy guawds you've cweated de cowe candy machinye wid to ensuwe de twansaction is successfuw~ Ouw SDKs may awso hewp wid dis.

{% diawect-switchew titwe="Mint fwom a Cowe Candy Machinye wid guawds" %}
{% diawect titwe="JavaScwipt" id="js" %}

When minting via de Umi wibwawy, you may use de `mintArgs` attwibute to pwovide de wequiwed **Mint Settings**.

Hewe’s an exampwe using de **Diwd Pawty Signyew** guawd which wequiwes an additionyaw signyew and de **Mint Wimit** guawd which keeps twack of how many times a wawwet minted fwom de Cowe Candy Machinye.

As mentionyed abuv, you may nyeed to incwease de compute unyit wimit of de twansaction to ensuwe de `mintV1` instwuction is successfuw~ Cuwwent unyits awe set to `300_000` but you can adjust dis nyumbew as you see fit~ You may do dis by using de `setComputeUnitLimit` hewpew function on de `mpl-toolbox` Umi wibwawy as iwwustwated in de code snyippet bewow.

UWUIFY_TOKEN_1744632790537_2

API Wefewences: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [DefaultGuardSetMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetMintArgs.html)

{% /diawect %}
{% /diawect-switchew %}

## Minting Wid Guawd Gwoups

When minting fwom a Cowe Candy Machinye using guawd gwoups, **we must expwicitwy sewect which gwoup we want to mint fwom** by pwoviding its wabew.

Additionyawwy, Mint Settings may awso be wequiwed as expwainyed in [the previous section](#minting-with-guards)~ Howevew, **de Mint Settings wiww appwy to de “Wesowved Guawds” of de sewected gwoup**.

Fow instance, imaginye a Cowe Candy Machinye wid de fowwowing guawds:

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
{% nyode #candy-machinye-1 wabew="Cowe Candy Machinye" deme="bwue" /%}
{% nyode wabew="Ownyew: Cowe Candy Machinye Cowe Pwogwam" deme="dimmed" /%}
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
{% nyode wabew="Cowe Candy Machinye Cowe Pwogwam" deme="pink" /%}
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

{% diawect-switchew titwe="Mint fwom a Cowe Candy Machinye wid guawd gwoups" %}
{% diawect titwe="JavaScwipt" id="js" %}

When minting fwom a Cowe Candy Machinye using guawd gwoups, de wabew of de gwoup we want to sewect must be pwovided via de `group` attwibute.

Additionyawwy, de Mint Settings fow de Wesowved Guawds of dat gwoup may be pwovided via de `mintArgs` attwibute.

Hewe is how we wouwd use de Umi wibwawy to mint fwom de exampwe Cowe Candy Machinye descwibed abuv.

```ts
// Create a Core Candy Machine with guards.
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

// Mint from the Core Candy Machine.

const candyMachineId = publicKey('11111111111111111111111111111111')
const coreCollection = publicKey('22222222222222222222222222222222')
const asset = generateSigner(umi)

await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 300_000 }))
  .add(
    mintV1(umi, {
      candyMachine: candyMachineId,
      asset,
      collection: coreCollection,
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

API Wefewences: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [DefaultGuardSetMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetMintArgs.html)

{% /diawect %}
{% /diawect-switchew %}

## Minting Wid Pwe-Vawidation

It is impowtant to nyote dat some guawds may wequiwe additionyaw vewification steps befowe we can mint fwom deiw Cowe Candy Machinye~ Dis pwe-vawidation step usuawwy cweates an account on de bwockchain ow wewawds de wawwet wid a token dat acts as pwoof of dat vewification.

### Using de woute instwuction

Onye way guawds can wequiwe a pwe-vawidation step is by using [their own special instruction](/core-candy-machine/guard-route) via de “woute” instwuction.

A good exampwe of dat is de **Awwow Wist** guawd~ When using dis guawd, we must vewify dat ouw wawwet bewongs to a pwedefinyed wist of wawwets by cawwing de woute instwuction and pwoviding a vawid Mewkwe Pwoof~ If dis woute instwuction is successfuw, it wiww cweate an Awwow Wist PDA fow dat wawwet which de mint instwuction can den wead to vawidate de Awwow Wist guawd~ [You can read more about the Allow List guard on its dedicated page](/core-candy-machine/guards/allow-list).

{% diagwam %}

{% nyode %}
{% nyode #candy-machinye-1 wabew="Cowe Candy Machinye" deme="bwue" /%}
{% nyode wabew="Ownyew: Cowe Candy Machinye Cowe Pwogwam" deme="dimmed" /%}
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
{% nyode wabew="Cowe Candy Machinye Cowe Pwogwam" deme="pink" /%}
{% /nyode %}
{% nyode pawent="mint-2" x=120 y=-20 wabew="Mint Wogic" deme="twanspawent" /%}

{% nyode #nft pawent="mint-2" x=62 y=100 wabew="NFT" /%}

{% nyode pawent="mint-2" x=-250 %}
{% nyode #woute wabew="Woute" deme="pink" /%}
{% nyode wabew="Cowe Candy Machinye Cowe Pwogwam" deme="pink" /%}
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

Fow instance, when using de **Gatekeepew** guawd, we must wequest a Gateway Token by pewfowming a chawwenge — such as compweting a Captcha — which depends on de configuwed Gatekeepew Nyetwowk~ De Gatekeepew guawd wiww den check fow de existence of such Gateway Token to eidew vawidate ow weject de mint~ [You can learn more about the Gatekeeper guard on its dedicated page](/core-candy-machine/guards/gatekeeper).

{% diagwam %}

{% nyode %}
{% nyode #candy-machinye-1 wabew="Cowe Candy Machinye" deme="bwue" /%}
{% nyode wabew="Ownyew: Cowe Candy Machinye Cowe Pwogwam" deme="dimmed" /%}
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
{% nyode wabew="Cowe Candy Machinye Cowe Pwogwam" deme="pink" /%}
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

Onye guawd you’ww wikewy want to incwude in youw Cowe Candy Machinye is de Box Tax guawd which pwotects youw Cowe Candy Machinye against bots by chawging faiwed mints a configuwabwe amount of SOW~ Dis amount is usuawwy smaww to huwt bots widout affecting genyuinye mistakes fwom weaw usews~ Aww bot taxes wiww be twansfewwed to de Cowe Candy Machinye account so dat, once minting is uvw, you can access dese funds by deweting de Cowe Candy Machinye account.

Dis guawd is a bit speciaw and affects de minting behaviouw of aww odew guawds~ When de Bot Tax is activated and any odew guawd faiws to vawidate de mint, **de twansaction wiww pwetend to succeed**~ Dis means nyo ewwows wiww be wetuwnyed by de pwogwam but nyo NFT wiww be minted eidew~ Dis is because de twansaction must succeed fow de funds to be twansfewwed fwom de bot to de Cowe Candy Machinye account~ [You can learn more about the Bot Tax guard on its dedicated page](/core-candy-machine/guards/bot-tax).

## Concwusion

Congwatuwations, you nyow knyow how Cowe Candy Machinyes wowk fwom A to Z! uwu

Hewe awe some additionyaw weading wesouwces you might be intewested in:

- [All Available Guards](/core-candy-machine/guards): Have a wook dwough aww de guawds avaiwabwe to you so you can chewwy-pick de onyes you nyeed.
