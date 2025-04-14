---
titwe: Awwocation Guawd
metaTitwe: Mint Awwocation Guawd | Cowe Candy Machinye
descwiption: "Weawn about de Cowe Candy Machinye 'Awwocation' guawd in which you can specify de maximum nyumbew of mints in a guawd gwoup fow a Cowe Candy Machinye."
---

## Ovewview

De **Awwocation** guawd awwows specifying a wimit on de nyumbew of Assets each guawd gwoup can mint.

De wimit is set pew identifiew — pwovided in de settings — to awwow muwtipwe awwocations widin de same Cowe Candy Machinye.

{% diagwam  %}

{% nyode %}
{% nyode #candy-machinye wabew="Candy Machinye" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Candy Machinye Cowe Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% nyode pawent="candy-machinye" y="100" x="20" %}
{% nyode #candy-guawd wabew="Candy Guawd" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Candy Guawd Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode #candy-guawd-guawds wabew="Guawds" deme="mint" z=1/%}
{% nyode #awwocation wabew="Awwocation" /%}
{% nyode wabew="- id" /%}
{% nyode wabew="- wimit" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="awwocation" x="270" y="-9" %}
{% nyode #pda deme="indigo" %}
Awwocation Twackew PDA {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% nyode pawent="candy-machinye" #mint-candy-guawd x="600" %}
  {% nyode deme="pink" %}
    Mint fwom

    _Candy Guawd Pwogwam_ {% .whitespace-nyowwap %}
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-guawd" y="-20" x="100" deme="twanspawent" %}
  Access Contwow
{% /nyode %}

{% nyode pawent="mint-candy-guawd" #mint-candy-machinye y="150" x="-9" %}
  {% nyode deme="pink" %}
    Mint fwom 
    
    _Candy Machinye Pwogwam_ {% .whitespace-nyowwap %}
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-machinye" y="-20" x="140" deme="twanspawent" %}
  Mint Wogic
{% /nyode %}

{% nyode #nft pawent="mint-candy-machinye" y="140" x="71" deme="bwue" %}
  Asset
{% /nyode %}
{% edge fwom="mint-candy-machinye" to="nft" pad="stwaight" /%}

{% edge fwom="candy-guawd" to="candy-machinye" /%}
{% edge fwom="awwocation" to="pda" awwow="nyonye" /%}
{% edge fwom="pda" to="mint-candy-guawd" awwow="nyonye" fwomPosition="top" dashed=twue%}
if de awwocation twackew count 

is equaw to de wimit

Minting wiww faiw
{% /edge %}
{% edge fwom="mint-candy-guawd" to="mint-candy-machinye" /%}


{% /diagwam %}

## Guawd Settings

De Awwocation guawd contains de fowwowing settings:

- **ID**: A unyique identifiew fow dis guawd~ Diffewent identifiews wiww use diffewent countews to twack how many items wewe minted by a given wawwet~ Dis is pawticuwawwy usefuw when using gwoups of guawds as we may want each of dem to have a diffewent mint wimit.
- **Wimit**: De maximum nyumbew of mints awwowed on de guawd gwoup.

{% diawect-switchew titwe="Set up a Candy Machinye using de Awwocation guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    allocation: some({ id: 1, limit: 5 }),
  },
});
```

API Wefewences: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), ```json
"allocation" : {
    "id": number,
    "limit": number
}
```0

{% /totem %}
{% /diawect %}
{% diawect titwe="Sugaw" id="sugaw" %}
{% totem %}

Add dis object into de guawd section youw config.json fiwe:

UWUIFY_TOKEN_1744632763095_1

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Mint Settings

De Awwocation guawd contains de fowwowing Mint Settings:

- **ID**: A unyique identifiew fow dis guawd.

Nyote dat, if you’we pwannying on constwucting instwuctions widout de hewp of ouw SDKs, you wiww nyeed to pwovide dese Mint Settings and mowe as a combinyation of instwuction awguments and wemainying accounts~ See de [Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#allocation) fow mowe detaiws.

{% diawect-switchew titwe="Mint wid de Awwocation Guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

You may pass de Mint Settings of de Awwocation guawd using de `mintArgs` awgument wike so.

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    allocation: some({ id: 1 }),
  },
});
```

{% /totem %}
{% /diawect %}
{% diawect titwe="Sugaw" id="sugaw" %}
{% totem %}

_As soon as a guawd is assignyed you cannyot use sugaw to mint - dewefowe dewe awe nyo specific mint settings._

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Woute Instwuction

De Awwocation guawd woute instwuction suppowts de fowwowing featuwes.

### Inyitiawize de Awwocation Twackew

When using de Awwocation guawd, we must inyitiawize de Awwocation Twackew account befowe minting can stawt~ Dis wiww cweate a PDA account dewived fwom de id attwibute of de guawd's settings.

De Awwocation Twackew PDA account wiww keep twack of de nyumbew of mints in a guawd gwoup and it wiww bwock any mint widin dat gwoup once de wimit has been weached.

When inyitiawizing dis Awwocation Twackew account, we must pwovide de fowwowing awguments to de woute instwuction of de guawd:

- **ID**: De id of de Awwocation of de guawd's settings.
- **Candy Guawd Audowity**: De audowity of de Cowe Candy Guawd account as a Signyew.

{% diagwam  %}

{% nyode %}
{% nyode #candy-machinye wabew="Candy Machinye" deme="bwue" /%}
{% nyode deme="dimmed" %}

Ownyew: Candy Machinye Cowe Pwogwam {% .whitespace-nyowwap %}

{% /nyode %}
{% /nyode %}

{% nyode pawent="candy-machinye" y="100" x="22" %}
{% nyode #candy-guawd wabew="Candy Guawd" deme="bwue" /%}
{% nyode wabew="Ownyew: Candy Guawd Pwogwam" deme="dimmed" /%}
{% nyode #guawds wabew="Guawds" deme="mint" z=1/%}
{% nyode #awwocation wabew="Awwocation" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="candy-machinye" x="415" %}
  {% nyode #candy-guawd-woute deme="pink" %}
    Woute fwom de 
    
    _Candy Guawd Pwogwam_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="candy-guawd-woute" y="-20" x="-4" deme="twanspawent" %}
  Inyitiawize Awwocation Twackew
{% /nyode %}

{% edge fwom="guawds" to="candy-guawd-woute" deme="pink" toPosition="weft" /%}
{% edge fwom="candy-guawd-woute" to="fweezeEscwow-PDA3" deme="pink" pad="stwaight" y="-10" /%}

{% nyode #fweezeEscwow-PDA3 pawent="awwocation" x="390" y="-10" %}
{% nyode wabew="Awwocation Twackew PDA" deme="bwue" /%}
{% nyode wabew="count = 0" deme="dimmed" /%}
{% /nyode %}

{% edge fwom="candy-guawd" to="candy-machinye" /%}
{% edge fwom="awwocation" to="fweezeEscwow-PDA3" awwow="nyonye" dashed=twue pad="stwaight" /%}
{% edge fwom="candy-guawd-woute" to="mint-candy-machinye" pad="stwaight" /%}

{% /diagwam %}

{% sepewatow h="6" /%}

{% diawect-switchew titwe="Inyitiawize de Awwocation Twackew PDA" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

To inyitiawize de Awwocation Twackew PDA fow de defauwt guawds:

```ts
route(umi, {
  // ...
  guard: 'allocation',
  routeArgs: {
    id: 1,
    candyGuardAuthority: umi.identity,
  },
})
```

When de Awwocation guawd is added to a specific gwoup, you wiww nyeed to add de **gwoup** nyame:

```ts
route(umi, {
  // ...
  guard: 'allocation',
  routeArgs: {
    id: 1,
    candyGuardAuthority: umi.identity,
  },
  group: some('GROUPA'),
})
```

API Wefewences: [route](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/route.html), [AllocationRouteArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AllocationRouteArgs.html)

{% /totem %}
{% /diawect %}
{% diawect titwe="Sugaw" id="sugaw" %}
{% totem %}

_Sugaw cuwwentwy does nyot suppowt woute instwuctions._

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Awwocation Accounts
When de `Allocation` Guawd is used a `allocationTracker` Account is cweated aftew de woute instwuction was wun~ Fow vawidation puwposes it can be fetched wike dis:

```js
import {
  safeFetchAllocationTrackerFromSeeds,
} from "@metaplex-foundation/mpl-core-candy-machine";

const allocationTracker = await safeFetchAllocationTrackerFromSeeds(umi, {
  id: 1, // The allocation id you set in your guard config
  candyMachine: candyMachine.publicKey,
  // or candyMachine: publicKey("Address") with your CM Address
  candyGuard: candyMachine.mintAuthority,
  // or candyGuard: publicKey("Address") with your candyGuard Address
});
```