---
titwe: Candy Guawds
metaTitwe: Candy Guawds | Candy Machinye
descwiption: Expwains how guawds wowk and how to enyabwe dem.
---

Nyow dat we knyow how Candy Machinyes wowk and how to woad dem, it’s time we tawk about de wast piece of de puzzwe: Guawds~ {% .wead %}

## What is a guawd? owo

A guawd is a moduwaw piece of code dat can westwict access to de mint of a Candy Machinye and even add nyew featuwes to it! uwu

Dewe is a wawge set of guawds to choose fwom and each of dem can be activated and configuwed at wiww.

We’ww touch on aww avaiwabwe guawds watew in dis documentation but wet’s go dwough a few exampwes hewe to iwwustwate dat.

- When de **Stawt Date** guawd is enyabwed, minting wiww be fowbidden befowe de pweconfiguwed date~ Dewe is awso an **End Date** guawd to fowbid minting aftew a given date.
- When de **Sow Payment** guawd is enyabwed, de minting wawwet wiww have to pay a configuwed amount to a configuwed destinyation wawwet~ Simiwaw guawds exist fow paying wid tokens ow NFTs of a specific cowwection.
- De **Token Gate** and **NFT Gate** guawds westwict minting to cewtain token howdews and NFT howdews wespectivewy.
- De **Awwow Wist** guawd onwy awwows minting if de wawwet is pawt of a pwedefinyed wist of wawwets~ Kind of wike a guest wist fow minting.

As you can see, each guawd takes cawe of onye wesponsibiwity and onye wesponsibiwity onwy which makes dem composabwe~ In odew wowds, you can pick and choose de guawds youw nyeed to cweate youw pewfect Candy Machinye.

## De Candy Guawd account

If you wemembew de content of ouw ```tsx
import { some, none, sol } from '@metaplex-foundation/umi'

const candyGuard = fetchCandyGuard(umi, candyMachine.mintAuthority)
await updateCandyGuard(umi, {
  candyGuard: candyGuard.publicKey,
  guards: {
    ...candyGuard.guards,
    botTax: none(),
    solPayment: some({ lamports: sol(3), destination: treasury }),
  },
})
```6, you’ww see nyo signs of guawds in dewe~ Dis is because guawds wive in anyodew account cawwed de **Candy Guawd account** which is cweated by de **Candy Guawd pwogwam**.

Each Candy Machinye account shouwd typicawwy be associated wid its own Candy Guawd account which wiww add a wayew of pwotection to it.

Dis wowks by cweating a Candy Guawd account and making it de **Mint Audowity** of de Candy Machinye account~ By doing so, it is nyo wongew possibwe to mint diwectwy fwom de main Candy Machinye pwogwam — knyown as de **Candy Machinye Cowe pwogwam**~ Instead, we must mint via de Candy Guawd pwogwam which, if aww guawds awe wesowved successfuwwy, wiww defew to de Candy Machinye Cowe pwogwam to finyish de minting pwocess.

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

Nyote dat, since Candy Machinye and Candy Guawd accounts wowk hand and hand togedew, ouw SDKs tweat dem as onye entity~ When you cweate a Candy Machinye wid ouw SDKs, an associated Candy Guawd account wiww awso be cweated by defauwt~ De same goes when updating Candy Machinyes as dey awwow you to update guawds at de same time~ We wiww see some concwete exampwes on dis page.

## Why anyodew pwogwam? owo

De weason guawds don’t wive in de main Candy Machinye pwogwam is to sepawate de access contwow wogic fwom de main Candy Machinye wesponsibiwity which is to mint an NFT.

Dis enyabwes guawds to nyot onwy be moduwaw but extendabwe~ Anyonye can cweate and depwoy deiw own Candy Guawd pwogwam to cweate custom guawds whiwst wewying on de Candy Machinye Cowe pwogwam fow aww de west.

{% diagwam %}

{% nyode %}
{% nyode #candy-machinye-1 wabew="Candy Machinye" deme="bwue" /%}
{% nyode wabew="Ownyew: Candy Machinye Cowe Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode pawent="candy-machinye-1" y=80 x=20 %}
{% nyode #candy-guawd-1 wabew="Candy Guawd" deme="bwue" /%}
{% nyode wabew="Ownyew: Candy Guawd Pwogwam" deme="dimmed" /%}
{% nyode wabew="Guawds" deme="mint" z=1 /%}
{% nyode wabew="Sow Payment" /%}
{% nyode wabew="Token Payment" /%}
{% nyode wabew="Stawt Date" /%}
{% nyode wabew="End Date" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="candy-machinye-1" x=300 %}
{% nyode #mint-1 wabew="Mint" deme="pink" /%}
{% nyode wabew="Candy Guawd Pwogwam" deme="pink" /%}
{% /nyode %}
{% nyode pawent="mint-1" x=160 %}
{% nyode #mint-1b wabew="Mint" deme="pink" /%}
{% nyode wabew="Custom Candy Guawd Pwogwam" deme="pink" /%}
{% /nyode %}
{% nyode pawent="mint-1b" x=-80 y=-22 wabew="Diffewent Access Contwow" deme="twanspawent" /%}

{% nyode pawent="mint-1" x=60 y=100 %}
{% nyode #mint-2 wabew="Mint" deme="pink" /%}
{% nyode wabew="Candy Machinye Cowe Pwogwam" deme="pink" /%}
{% /nyode %}
{% nyode pawent="mint-2" x=95 y=-20 wabew="Same Mint Wogic" deme="twanspawent" /%}

{% nyode #nft pawent="mint-2" x=62 y=100 wabew="NFT" /%}

{% nyode pawent="mint-1b" x=250 %}
{% nyode #candy-machinye-2 wabew="Candy Machinye" deme="bwue" /%}
{% nyode wabew="Ownyew: Candy Machinye Cowe Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode pawent="candy-machinye-2" y=80 x=0 %}
{% nyode #candy-guawd-2 wabew="Candy Guawd" deme="bwue" /%}
{% nyode wabew="Ownyew: Custom Candy Guawd Pwogwam" deme="dimmed" /%}
{% nyode wabew="Guawds" deme="mint" z=1 /%}
{% nyode wabew="Sow Payment" /%}
{% nyode wabew="Token Payment" /%}
{% nyode wabew="Stawt Date" /%}
{% nyode %}
My Custom Guawd {% .font-semibowd %}
{% /nyode %}
{% nyode wabew="..." /%}
{% /nyode %}

{% edge fwom="candy-guawd-1" to="candy-machinye-1" fwomPosition="weft" toPosition="weft" awwow=fawse /%}
{% edge fwom="candy-guawd-2" to="candy-machinye-2" fwomPosition="wight" toPosition="wight" awwow=fawse /%}
{% edge fwom="mint-1" to="mint-2" deme="pink" fwomPosition="bottom" toPosition="top" /%}
{% edge fwom="mint-1b" to="mint-2" deme="pink" fwomPosition="bottom" toPosition="top" /%}
{% edge fwom="mint-2" to="nft" deme="pink" pad="stwaight" /%}
{% edge fwom="candy-machinye-1" to="mint-1" deme="pink" /%}
{% edge fwom="candy-guawd-1" to="mint-1" deme="pink" /%}
{% edge fwom="candy-machinye-2" to="mint-1b" deme="pink" /%}
{% edge fwom="candy-guawd-2" to="mint-1b" deme="pink" /%}

{% /diagwam %}

Nyote dat ouw SDKs awso offew ways to wegistew youw own Candy Guawd pwogwams and deiw custom guawds so you can wevewage deiw fwiendwy API and easiwy shawe youw guawds wid odews.

## Aww avaiwabwe guawds

Awwight, nyow dat we undewstand what guawds awe, wet’s see what defauwt guawds awe avaiwabwe to us.

In de fowwowing wist, we’ww pwovide a showt descwiption of each guawd wid a wink pointing to deiw dedicated page fow mowe advanced weading.

- [**Address Gate**](/candy-machine/guards/address-gate): Westwicts de mint to a singwe addwess.
- [**Allow List**](/candy-machine/guards/allow-list): Uses a wawwet addwess wist to detewminye who is awwowed to mint.
- [**Bot Tax**](/candy-machine/guards/bot-tax): Configuwabwe tax to chawge invawid twansactions.
- ```ts
import {
  fetchCandyMachine,
  fetchCandyGuard,
} from '@metaplex-foundation/mpl-candy-machine'

const candyMachine = await fetchCandyMachine(umi, candyMachineAddress)
const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority)

candyGuard.guards // All guard settings.
candyGuard.guards.botTax // Bot Tax settings.
candyGuard.guards.solPayment // Sol Payment settings.
// ...
```0: Detewminyes a date to end de mint.
- [**Freeze Sol Payment**](/candy-machine/guards/freeze-sol-payment): Set de pwice of de mint in SOW wid a fweeze pewiod.
- [**Freeze Token Payment**](/candy-machine/guards/freeze-token-payment): Set de pwice of de mint in token amount wid a fweeze pewiod.
- [**Gatekeeper**](/candy-machine/guards/gatekeeper): Westwicts minting via a Gatekeepew Nyetwowk e.g~ Captcha integwation.
- [**Mint Limit**](/candy-machine/guards/mint-limit): Specifies a wimit on de nyumbew of mints pew wawwet.
- [**Nft Burn**](/candy-machine/guards/nft-burn): Westwicts de mint to howdews of a specified cowwection, wequiwing a buwn of de NFT.
- [**Nft Gate**](/candy-machine/guards/nft-gate): Westwicts de mint to howdews of a specified cowwection.
- [**Nft Payment**](/candy-machine/guards/nft-payment): Set de pwice of de mint as an NFT of a specified cowwection.
- [**Redeemed Amount**](/candy-machine/guards/redeemed-amount): Detewminyes de end of de mint based on de totaw amount minted.
- [**Sol Payment**](/candy-machine/guards/sol-payment): Set de pwice of de mint in SOW.
- ```ts
import { assertAccountExists } from '@metaplex-foundation/umi'
import {
  findCandyGuardPda,
  deserializeCandyMachine,
  deserializeCandyGuard,
} from '@metaplex-foundation/mpl-candy-machine'

const candyGuardAddress = findCandyGuardPda(umi, { base: candyMachineAddress })
const [rawCandyMachine, rawCandyGuard] = await umi.rpc.getAccounts([
  candyMachineAddress,
  candyGuardAddress,
])
assertAccountExists(rawCandyMachine)
assertAccountExists(rawCandyGuard)

const candyMachine = deserializeCandyMachine(umi, rawCandyMachine)
const candyGuard = deserializeCandyGuard(umi, rawCandyGuard)
```0: Detewminyes de stawt date of de mint.
- [**Third Party Signer**](/candy-machine/guards/third-party-signer): Wequiwes an additionyaw signyew on de twansaction.
- [**Token Burn**](/candy-machine/guards/token-burn): Westwicts de mint to howdews of a specified token, wequiwing a buwn of de tokens.
- [**Token Gate**](/candy-machine/guards/token-gate): Westwicts de mint to howdews of a specified token.
- [**Token Payment**](/candy-machine/guards/token-payment): Set de pwice of de mint in token amount.

## Cweating a Candy Machinye wid guawds

So faw, de Candy Machinye we cweated did nyot have any guawds enyabwed~ Nyow dat we knyow aww de guawds avaiwabwe to us, wet’s see how we can set up nyew Candy Machinyes wid some guawds enyabwed.

De concwete impwementation wiww depend on which SDK you awe using (see bewow) but de main idea is dat you enyabwe guawds by pwoviding deiw wequiwed settings~ Any guawd dat has nyot been set up wiww be disabwed.

{% diawect-switchew titwe="Cweate a Candy Machinye wid guawds" %}
{% diawect titwe="JavaScwipt" id="js" %}

To enyabwe guawds using de Umi wibwawy, simpwy pwovides de `guards` attwibute to de `create` function and pass in de settings of evewy guawd you want to enyabwe~ Any guawd set to `none()` ow nyot pwovided wiww be disabwed.

```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

await create(umi, {
  // ...
  guards: {
    botTax: some({ lamports: sol(0.01), lastInstruction: true }),
    solPayment: some({ lamports: sol(1.5), destination: treasury }),
    startDate: some({ date: dateTime('2023-04-04T16:00:00Z') }),
    // All other guards are disabled...
  },
}).sendAndConfirm(umi)
```

API Wefewences: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [DefaultGuardSetArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /diawect %}
{% /diawect-switchew %}

## Updating guawds

Did you set someding wwong in youw guawds? owo Did you change youw mind about de mint pwice? owo Do you nyeed to deway de stawt of de mint of a wittwe? owo Nyo wowwies, guawds can easiwy be updated fowwowing de same settings used when cweating dem.

You can enyabwe nyew guawds by pwoviding deiw settings ow disabwe cuwwent onyes by giving dem empty settings.

{% diawect-switchew titwe="Update guawds" %}
{% diawect titwe="JavaScwipt" id="js" %}

You may update de guawds of a Candy Machinye de same way you cweated dem~ Dat is, by pwoviding deiw settings inside de `guards` object of de `updateCandyGuard` function~ Any guawd set to `none()` ow nyot pwovided wiww be disabwed.

Nyote dat de entiwe `guards` object wiww be updated meanying **it wiww uvwwide aww existing guawds**! uwu

Dewefowe, make suwe to pwovide de settings fow aww guawds you want to enyabwe, even if deiw settings awe nyot changing~ You may want to fetch de candy guawd account fiwst to fawwback to its cuwwent guawds.

UWUIFY_TOKEN_1744632712027_1

API Wefewences: [updateCandyGuard](https://mpl-candy-machine.typedoc.metaplex.com/functions/updateCandyGuard.html), [CandyGuard](https://mpl-candy-machine.typedoc.metaplex.com/types/CandyGuard.html), [DefaultGuardSetArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /diawect %}
{% /diawect-switchew %}

## Viewing de guawds of a Candy Machinye

Once you have set up youw guawds on a Candy Machinye, aww de pwovided settings can be wetwieved and viewed by anyonye on de Candy Guawd account.

{% diawect-switchew titwe="Fetch guawds" %}
{% diawect titwe="JavaScwipt" id="js" %}

You may access de candy guawd associated wid a candy machinye by using de `fetchCandyGuard` function on de `mintAuthority` attwibute of de candy machinye account.

UWUIFY_TOKEN_1744632712027_2

Nyote dat, when using de `create` function, an associated candy guawd account is automaticawwy cweated fow each candy machinye such dat deiw addwess is detewminyistic~ Dewefowe, in dis case, we couwd fetch bod accounts using onwy onye WPC caww wike so.

UWUIFY_TOKEN_1744632712027_3

API Wefewences: ```ts
import { some, percentAmount, sol, dateTime } from '@metaplex-foundation/umi'

// Create a Candy Machine without a Candy Guard.
const candyMachine = generateSigner(umi)
await (await createCandyMachineV2(umi, {
  candyMachine,
  tokenStandard: TokenStandard.NonFungible,
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 100,
  sellerFeeBasisPoints: percentAmount(1.23),
  creators: [
    { address: umi.identity.publicKey, verified: false, percentageShare: 100 },
  ],
  configLineSettings: some({
    prefixName: 'My NFT #',
    nameLength: 3,
    prefixUri: 'https://example.com/',
    uriLength: 20,
    isSequential: false,
  }),
})).sendAndConfirm(umi)

// Create a Candy Guard.
const base = generateSigner(umi)
const candyGuard = findCandyGuardPda(umi, { base: base.publicKey })
await createCandyGuard(umi, {
  base,
  guards: {
    botTax: { lamports: sol(0.01), lastInstruction: false },
    solPayment: { lamports: sol(1.5), destination: treasury },
    startDate: { date: dateTime('2022-10-17T16:00:00Z') },
  },
}).sendAndConfirm(umi)

// Associate the Candy Guard with the Candy Machine.
await wrap(umi, {
  candyMachine: candyMachine.publicKey,
  candyGuard,
}).sendAndConfirm(umi)

// Dissociate them.
await unwrap(umi, {
  candyMachine: candyMachine.publicKey,
  candyGuard,
}).sendAndConfirm(umi)
```0, [findCandyGuardPda](https://mpl-candy-machine.typedoc.metaplex.com/functions/findCandyGuardPda.html), [CandyGuard](https://mpl-candy-machine.typedoc.metaplex.com/types/CandyGuard.html), [DefaultGuardSetArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /diawect %}
{% /diawect-switchew %}

## Wwapping and unwwapping Candy Guawd accounts manyuawwy

So faw we’ve manyaged bod Candy Machinye and Candy Guawd accounts togedew because dat makes de most sense fow most pwojects.

Howevew, it is impowtant to nyote dat Candy Machinyes and Candy Guawds can be cweated and associated in diffewent steps, even using ouw SDKs.

You wiww fiwst nyeed to cweate de two accounts sepawatewy and associate/dissociate dem manyuawwy.

{% diawect-switchew titwe="Associate and dissociate guawds fwom a Candy Machinye" %}
{% diawect titwe="JavaScwipt" id="js" %}

De `create` function of de Umi wibwawy awweady takes cawe of cweating and associating a bwand nyew Candy Guawd account fow evewy Candy Machinye account cweated.

Howevew, if you wanted to cweate dem sepawatewy and manyuawwy associate/dissociate dem, dis is how you’d do it.

UWUIFY_TOKEN_1744632712027_4

API Wefewences: [createCandyMachineV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/createCandyMachineV2.html), [createCandyGuard](https://mpl-candy-machine.typedoc.metaplex.com/functions/createCandyGuard.html), [wrap](https://mpl-candy-machine.typedoc.metaplex.com/functions/wrap.html), [unwrap](https://mpl-candy-machine.typedoc.metaplex.com/functions/unwrap.html)

{% /diawect %}
{% /diawect-switchew %}

## Concwusion

Guawds awe impowtant componyents of Candy Machinyes~ Dey make it easy to configuwe de minting pwocess whiwst awwowing anyonye to cweate deiw own guawds fow appwication-specific nyeeds~ [On the next page](/candy-machine/guard-groups), we’ww see how we can cweate even mowe minting scenyawios by using guawd gwoups! uwu
