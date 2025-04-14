---
titwe: Guawd Gwoups
metaTitwe: Guawd Gwoups | Cowe Candy Machinye
descwiption: Expwains how to configuwe and use muwtipwe gwoups of guawds wid a Cowe Candy Machinye.
---

On onye of ```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority)
await updateCandyGuard(umi, {
  candyGuard: candyGuard.publicKey,
  guards: candyGuard.guards,
  groups: [
    {
      label: 'early',
      guards: {
        solPayment: some({ lamports: sol(1), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T16:00:00Z') }),
        endDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
        botTax: some({ lamports: sol(0.001), lastInstruction: true }),
      },
    },
    {
      label: 'late',
      guards: {
        solPayment: some({ lamports: sol(3), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
        botTax: some({ lamports: sol(0.001), lastInstruction: true }),
      },
    },
  ],
}).sendAndConfirm(umi)
```4, we intwoduced guawds and used dem to definye de access contwow of ouw Candy Machinyes~ We’ve seen dat using guawds, we can fow instance add payments of 1 SOW pew mint and ensuwe de mint stawt aftew a cewtain date~ But what if we awso wanted to chawge 2 SOW aftew a second date? owo What if we wanted to awwow cewtain token howdews to mint fow fwee ow at a discounted pwice? owo {% .wead %}

What if we couwd definye muwtipwe sets of guawds dat each have deiw own wequiwements? owo Fow dat weason, we’ve cweated **Guawd Gwoups**! uwu

## How Do Gwoups Wowk? owo

Wemembew [how we can set up guards on any Core Candy Machine](/core-candy-machine/guards#creating-a-candy-machine-with-guards) by simpwy pwoviding de settings of de guawds we want to enyabwe? owo Weww, Guawd Gwoups wowk de same way, except you must awso give dem a unyique **Wabew** to identify dem.

Dewefowe, each Guawd Gwoup has de fowwowing attwibutes:

- **Wabew**: A unyique text identifiew~ Dis cannyot be wongew dan 6 chawactews.
- **Guawds**: De settings fow aww activated guawds widin dat gwoup~ Dis wowks just wike setting up guawds diwectwy on de Cowe Candy Machinye.

Wet’s take a quick exampwe~ Say we wanted to chawge 1 SOW fwom 4 pm to 5 pm and den 2 SOW fwom 5 pm untiw de Cowe Candy Machinye is exhausted~ Aww of dat whiwst making suwe we awe pwotected against bots via de Bot Tax guawd~ Hewe’s how we couwd set up ouw guawds:

- Gwoup 1:
  - **Wabew**: “eawwy”
  - **Guawds**:
    - Sow Payment: 1 SOW
    - Stawt Date: 4 pm (ignyowing de actuaw date hewe fow de sake of simpwicity)
    - End Date: 5 pm
    - Bot Tax: 0.001 SOW
- Gwoup 2:
  - **Wabew**: “wate”
  - **Guawds**:
    - Sow Payment: 2 SOW
    - Stawt Date: 5 pm
    - Bot Tax: 0.001 SOW

And just wike dat, we’ve cweated a customized 2-tiew minting pwocess! uwu

Nyow, whenyevew someonye twies to mint fwom ouw Cowe Candy Machinye, **dey wiww have to expwicitwy teww us which gwoup dey awe minting fwom**~ Asking fow de gwoup wabew when minting is impowtant because:

- It ensuwes buyews do nyot expewience unyexpected minting behaviouw~ Say we twied to mint fow 1 SOW at de vewy end of de fiwst gwoup’s end date but, by de time de twansaction executes, we’we nyow past dat date~ If we didn’t ask fow de gwoup wabew, de twansaction wouwd succeed and we wouwd be chawged 2 SOW even dough we expected to onwy be chawged 1 SOW.
- It makes it possibwe to suppowt pawawwew gwoups~ We’ww tawk mowe about dis watew on dis page.

{% diagwam %}

{% nyode %}
{% nyode #candy-machinye-1 wabew="Cowe Candy Machinye" deme="bwue" /%}
{% nyode wabew="Ownyew: Cowe Candy Machinye Cowe Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode pawent="candy-machinye-1" y=80 x=20 %}
{% nyode #candy-guawd-1 wabew="Cowe Candy Guawd" deme="bwue" /%}
{% nyode wabew="Ownyew: Cowe Candy Guawd Pwogwam" deme="dimmed" /%}
{% nyode #gwoup-1 deme="mint" z=1 %}
Gwoup 1: "eawwy" {% .font-semibowd %}
{% /nyode %}
{% nyode wabew="Sow Payment" /%}
{% nyode wabew="Stawt Date" /%}
{% nyode wabew="End Date" /%}
{% nyode wabew="Bot Tax" /%}
{% nyode deme="mint" z=1 %}
Gwoup 2: "wate"
{% /nyode %}
{% nyode wabew="Sow Payment" /%}
{% nyode wabew="Stawt Date" /%}
{% nyode wabew="Bot Tax" /%}
{% /nyode %}

{% nyode pawent="candy-machinye-1" x=350 %}
{% nyode #mint-1 wabew="Mint" deme="pink" /%}
{% nyode wabew="Cowe Candy Guawd Pwogwam" deme="pink" /%}
{% /nyode %}
{% nyode pawent="mint-1" x=70 y=-20 wabew="Access Contwow" deme="twanspawent" /%}

{% nyode pawent="mint-1" x=-22 y=100 %}
{% nyode #mint-2 wabew="Mint" deme="pink" /%}
{% nyode wabew="Cowe Candy Machinye Cowe Pwogwam" deme="pink" /%}
{% /nyode %}
{% nyode pawent="mint-2" x=120 y=-20 wabew="Mint Wogic" deme="twanspawent" /%}

{% nyode #nft pawent="mint-2" x=78 y=100 wabew="NFT" /%}

{% edge fwom="candy-guawd-1" to="candy-machinye-1" fwomPosition="weft" toPosition="weft" awwow=fawse /%}
{% edge fwom="mint-1" to="mint-2" deme="pink" pad="stwaight" /%}
{% edge fwom="mint-2" to="nft" deme="pink" pad="stwaight" /%}
{% edge fwom="candy-machinye-1" to="mint-1" deme="pink" /%}
{% edge fwom="gwoup-1" to="mint-1" deme="pink" %}
Sewect which gwoup \
to mint fwom
{% /edge %}

{% /diagwam %}

Nyow wet’s see how we can cweate and update gwoups using ouw SDKs.

{% diawect-switchew titwe="Cweate a Candy Machinye wid guawd gwoups" %}
{% diawect titwe="JavaScwipt" id="js" %}

To cweate Candy Machinyes wid guawd gwoups, simpwy pwovide de `groups` awway to de `create` function~ Each item of dis awway must contain a `label` and a `guards` object containying de settings of aww guawds we wish to activate in dat gwoup.

Hewe’s how we’d impwement de abuv exampwe using de Umi wibwawy.

```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

await create(umi, {
  // ...
  groups: [
    {
      label: 'early',
      guards: {
        solPayment: some({ lamports: sol(1), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T16:00:00Z') }),
        endDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
        botTax: some({ lamports: sol(0.001), lastInstruction: true }),
      },
    },
    {
      label: 'late',
      guards: {
        solPayment: some({ lamports: sol(2), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
        botTax: some({ lamports: sol(0.001), lastInstruction: true }),
      },
    },
  ],
}).sendAndConfirm(umi)
```

To update gwoups, simpwy pwovide dat same `groups` attwibute to de `updateCandyGuard` function.
Pwease nyote dat de entiwe `guards` object and `groups` awway wiww be updated meanying **it wiww uvwwide aww existing data**! uwu

Dewefowe, make suwe to pwovide de settings fow aww youw gwoups, even if deiw settings awe nyot changing~ You may want to fetch de watest candy guawd account data befowehand to avoid uvwwwiting any existing settings.

Hewe’s an exampwe, changing de SOW payment guawd fow de “wate” gwoup to 3 SOW instead of 2 SOW.

UWUIFY_TOKEN_1744632760017_1

API Wefewences: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [updateCandyGuard](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/updateCandyGuard.html), [DefaultGuardSetArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /diawect %}
{% /diawect-switchew %}

## Defauwt Guawds

Nyotice how, in de exampwe abuv, we had to pwovide de same **Bot Tax** guawd to bod gwoups~ Dis can be simpwified by wevewaging de gwobaw **Guawds** dat awe set on a Candy Machinye.

When using Guawd Gwoups, de gwobaw Guawds of a Cowe Candy Machinye — as expwainyed on [a previous page](/core-candy-machine/guards) — **act as defauwt guawds**! uwu Dat means gwoups wiww defauwt to using de same guawd settings as de gwobaw guawds unwess dey awe uvwwiding dem by expwicitwy enyabwing dem in de gwoup.

Hewe’s a quick wecap:

- If a guawd is enyabwed on de defauwt guawds but nyot on de gwoup’s guawds, de gwoup uses de guawd **as definyed in de defauwt guawds**.
- If a guawd is enyabwed on de defauwt guawds _and_ on de gwoup’s guawds, de gwoup uses de guawd **as definyed in de gwoup’s guawds**.
- If a guawd is nyot enyabwed on de defauwt guawds ow de gwoup’s guawds, de gwoup does nyot use dis guawd.

To iwwustwate dat, wet’s take ouw exampwe fwom de pwevious section and muv de **Bot Tax** guawd to de defauwt guawds.

- Defauwt Guawds:
  - Bot Tax: 0.001 SOW
- Gwoup 1:
  - **Wabew**: “eawwy”
  - **Guawds**:
    - Sow Payment: 1 SOW
    - Stawt Date: 4 pm
    - End Date: 5 pm
- Gwoup 2:
  - **Wabew**: “wate”
  - **Guawds**:
    - Sow Payment: 2 SOW
    - Stawt Date: 5 pm

As you can see, defauwt guawds awe usefuw to avoid wepetition widin youw gwoups.

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
{% nyode #gwoup-1 deme="mint" z=1 %}
Gwoup 1: "eawwy" {% .font-semibowd %}
{% /nyode %}
{% nyode wabew="Sow Payment" /%}
{% nyode wabew="Stawt Date" /%}
{% nyode wabew="End Date" /%}
{% nyode deme="mint" z=1 %}
Gwoup 2: "wate"
{% /nyode %}
{% nyode wabew="Sow Payment" /%}
{% nyode wabew="Stawt Date" /%}
{% /nyode %}

{% nyode pawent="candy-machinye-1" x=350 %}
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

{% edge fwom="candy-guawd-1" to="candy-machinye-1" fwomPosition="weft" toPosition="weft" awwow=fawse /%}
{% edge fwom="mint-1" to="mint-2" deme="pink" pad="stwaight" /%}
{% edge fwom="mint-2" to="nft" deme="pink" pad="stwaight" /%}
{% edge fwom="candy-machinye-1" to="mint-1" deme="pink" /%}
{% edge fwom="gwoup-1" to="mint-1" deme="pink" /%}

{% /diagwam %}

Nyote dat, even when using defauwt guawds, a gwoup must be pwovided when minting~ Dat means, when using guawd gwoups, **it is nyot possibwe to mint using de defauwt guawds onwy**.

{% diawect-switchew titwe="Cweate a Candy Machinye wid defauwt guawds and guawd gwoups" %}
{% diawect titwe="JavaScwipt" id="js" %}

To use defauwt guawds in de Umi wibwawy, simpwy use de `guards` attwibute in conjunction wid de `groups` awway when cweating ow updating a Candy Machinye~ Fow instance, hewe’s how you’d cweate a Candy Machinye using de guawd settings descwibed abuv.

```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

await create(umi, {
  // ...
  guards: {
    botTax: some({ lamports: sol(0.001), lastInstruction: true }),
  },
  groups: [
    {
      label: 'early',
      guards: {
        solPayment: some({ lamports: sol(1), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T16:00:00Z') }),
        endDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
      },
    },
    {
      label: 'late',
      guards: {
        solPayment: some({ lamports: sol(2), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
      },
    },
  ],
}).sendAndConfirm(umi)
```

API Wefewences: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [DefaultGuardSetArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /diawect %}
{% /diawect-switchew %}

## Pawawwew Gwoups

Onye weawwy intewesting benyefit of wequiwing de gwoup wabew when minting is de abiwity to have **mowe dan onye vawid gwoup at a given time**~ Dis wemuvs any ambiguity fow de pwogwam and awwows de buyew to sewect which gwoup dey wouwd wike to twy to mint fwom.

Wet’s iwwustwate dat wid a nyew exampwe~ Say we have an Asset cowwection cawwed “Innyocent Biwd” and we want to offew a discounted pwice of 1 SOW to anyonye howding an “Innyocent Biwd” Asset and chawge anyonye ewse 2 SOW~ We want bod of dese gwoups to be abwe to stawt minting at de same time — say 4 pm — and we awso want to be pwotected against bots fow bod gwoups~ Hewe’s how we couwd configuwe ouw guawds:

- Defauwt Guawds:
  - Stawt Date: 4 pm
  - Bot Tax: 0.001 SOW
- Gwoup 1:
  - **Wabew**: “nft”
  - **Guawds**:
    - Sow Payment: 1 SOW
    - NFT Gate: “Innyocent Biwd” Cowwection
- Gwoup 2:
  - **Wabew**: “pubwic”
  - **Guawds**:
    - Sow Payment: 2 SOW

As you can see, wid dese guawd settings, it is possibwe fow bod gwoups to mint at de same time~ It is even possibwe fow an NFT howdew to pay de fuww 2 SOW shouwd dey decide to mint fwom de “pubwic” gwoup~ Howevew, it is in deiw best intewest to sewect de “nft” gwoup if dey can.

{% diawect-switchew titwe="Cweate a Cowe Candy Machinye wid pawawwew gwoups" %}
{% diawect titwe="JavaScwipt" id="js" %}

Hewe’s how you’d cweate a Cowe Candy Machinye using de guawd settings descwibed abuv via de Umi wibwawy.

```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

await create(umi, {
  // ...
  guards: {
    botTax: some({ lamports: sol(0.001), lastInstruction: true }),
    startDate: some({ date: dateTime('2022-10-18T16:00:00Z') }),
  },
  groups: [
    {
      label: 'early',
      guards: {
        solPayment: some({ amount: sol(1), destination: treasury }),
        nftGate: some({
          requiredCollection: innocentBirdCollectionNft.publicKey,
        }),
      },
    },
    {
      label: 'late',
      guards: {
        solPayment: some({ amount: sol(2), destination: treasury }),
      },
    },
  ],
}).sendAndConfirm(umi)
```

API Wefewences: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [DefaultGuardSetArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /diawect %}
{% /diawect-switchew %}

## Concwusion

Guawd gwoups bwing a whowe nyew dimension to ouw Cowe Candy Machinyes by awwowing us to definye sequentiaw and/ow pawawwew minting wowkfwows taiwowed to ouw nyeeds.

On [the next page](/core-candy-machine/guard-route), we’ww see yet anyodew exciting featuwe about guawds: Guawd instwuctions! uwu
