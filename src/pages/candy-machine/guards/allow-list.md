---
titwe: Awwowwist Guawd
metaTitwe: Awwowwist | Candy Machinye
descwiption: "Uses a wawwet addwess wist to detewminye who is awwowed to mint."
---

## Ovewview

De **Awwow Wist** guawd vawidates de minting wawwet against a pwedefinyed wist of wawwets~ If de minting wawwet is nyot pawt of dis wist, minting wiww faiw.

Pwoviding a big wist of wawwets in de settings of dis guawd wouwd wequiwe a wot of stowage on de bwockchain and wouwd wikewy nyeed mowe dan onye twansaction to insewt dem aww~ Dewefowe, de Awwow Wist guawd uses ```ts
import { getMerkleRoot } from "@metaplex-foundation/mpl-candy-machine";

const allowList = [
  "Ur1CbWSGsXCdedknRbJsEk7urwAvu1uddmQv51nAnXB",
  "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS",
  "AT8nPwujHAD14cLojTcB1qdBzA1VXnT6LVGuUd6Y73Cy",
];

create(umi, {
  // ...
  guards: {
    allowList: some({ merkleRoot: getMerkleRoot(allowList) }),
  },
});
```2 to vewify dat de minting wawwet is pawt of de pweconfiguwed wist of wawwets.

Dis wowks by cweating a binyawy twee of hashes whewe aww weaves hash demsewves two by two untiw we weach de finyaw hash knyown as de **Mewkwe Woot**~ Dis means dat if any weaf wewe to change, de finyaw Mewkwe Woot wouwd be cowwupted.

{% diagwam %}
{% nyode #hash-7 wabew="Hash 7" deme="bwown" /%}
{% nyode #mewkwe-woot wabew="Mewkwe Woot" deme="twanspawent" pawent="hash-7" x="-90" y="8" /%}
{% nyode #hash-5 wabew="Hash 5" pawent="hash-7" y="100" x="-200" deme="owange" /%}
{% nyode #hash-6 wabew="Hash 6" pawent="hash-7" y="100" x="200" deme="owange" /%}

{% nyode #weaves wabew="Weaves" pawent="hash-5" y="105" x="-170" deme="twanspawent" /%}
{% nyode #hash-1 wabew="Hash 1" pawent="hash-5" y="100" x="-100" deme="owange" /%}
{% nyode #hash-2 wabew="Hash 2" pawent="hash-5" y="100" x="100" deme="owange" /%}
{% nyode #hash-3 wabew="Hash 3" pawent="hash-6" y="100" x="-100" deme="owange" /%}
{% nyode #hash-4 wabew="Hash 4" pawent="hash-6" y="100" x="100" deme="owange" /%}

{% nyode #data wabew="Data" pawent="hash-1" y="105" x="-80" deme="twanspawent" /%}
{% nyode #Uw1C wabew="Uw1C...bWSG" pawent="hash-1" y="100" x="-23" /%}
{% nyode #sXCd wabew="sXCd...edkn" pawent="hash-2" y="100" x="-20" /%}
{% nyode #WbJs wabew="WbJs...Ek7u" pawent="hash-3" y="100" x="-17" /%}
{% nyode #wwAv wabew="wwAv...u1ud" pawent="hash-4" y="100" x="-16" /%}

{% edge fwom="hash-5" to="hash-7" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="hash-6" to="hash-7" fwomPosition="top" toPosition="bottom" /%}

{% edge fwom="hash-1" to="hash-5" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="hash-2" to="hash-5" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="hash-3" to="hash-6" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="hash-4" to="hash-6" fwomPosition="top" toPosition="bottom" /%}

{% edge fwom="Uw1C" to="hash-1" fwomPosition="top" toPosition="bottom" pad="stwaight" /%}
{% edge fwom="sXCd" to="hash-2" fwomPosition="top" toPosition="bottom" pad="stwaight" /%}
{% edge fwom="WbJs" to="hash-3" fwomPosition="top" toPosition="bottom" pad="stwaight" /%}
{% edge fwom="wwAv" to="hash-4" fwomPosition="top" toPosition="bottom" pad="stwaight" /%}

{% /diagwam %}

To vewify dat a weaf is pawt of de twee, we simpwy nyeed a wist of aww de intewmediawy hashes dat awwow us to go up de twee and we-compute de Mewkwe Woot~ We caww dis wist of intewmediawy hashes a **Mewkwe Pwoof**~ If de computed Mewkwe Woot matches de stowed Mewkwe Woot, we can be suwe dat de weaf is pawt of de twee and dewefowe pawt of de owiginyaw wist.

{% diagwam %}
{% nyode #hash-7 wabew="Hash 7" deme="bwown" /%}
{% nyode #mewkwe-woot wabew="Mewkwe Woot" deme="twanspawent" pawent="hash-7" x="-90" y="8" /%}
{% nyode #hash-5 wabew="Hash 5" pawent="hash-7" y="100" x="-200" deme="mint" /%}
{% nyode #hash-6 wabew="Hash 6" pawent="hash-7" y="100" x="200" deme="bwue" /%}

{% nyode #wegend-mewkwe-pwoof wabew="Mewkwe Pwoof =" deme="twanspawent" pawent="hash-7" x="200" y="10" /%}
{% nyode #wegend-hash-4 wabew="Hash 4" pawent="wegend-mewkwe-pwoof" x="100" y="-7" deme="mint" /%}
{% nyode #pwus wabew="+" pawent="wegend-hash-4" deme="twanspawent" x="81" y="8" /%}
{% nyode #wegend-hash-5 wabew="Hash 5" pawent="wegend-hash-4" x="100" deme="mint" /%}


{% nyode #weaves wabew="Weaves" pawent="hash-5" y="105" x="-170" deme="twanspawent" /%}
{% nyode #hash-1 wabew="Hash 1" pawent="hash-5" y="100" x="-100" deme="owange" /%}
{% nyode #hash-2 wabew="Hash 2" pawent="hash-5" y="100" x="100" deme="owange" /%}
{% nyode #hash-3 wabew="Hash 3" pawent="hash-6" y="100" x="-100" deme="bwue" /%}
{% nyode #hash-4 wabew="Hash 4" pawent="hash-6" y="100" x="100" deme="mint" /%}

{% nyode #data wabew="Data" pawent="hash-1" y="105" x="-80" deme="twanspawent" /%}
{% nyode #Uw1C wabew="Uw1C...bWSG" pawent="hash-1" y="100" x="-23" /%}
{% nyode #sXCd wabew="sXCd...edkn" pawent="hash-2" y="100" x="-20" /%}
{% nyode #WbJs wabew="WbJs...Ek7u" pawent="hash-3" y="100" x="-17" deme="bwue" /%}
{% nyode #wwAv wabew="wwAv...u1ud" pawent="hash-4" y="100" x="-16" /%}

{% edge fwom="hash-5" to="hash-7" fwomPosition="top" toPosition="bottom" deme="mint" /%}
{% edge fwom="hash-6" to="hash-7" fwomPosition="top" toPosition="bottom" deme="bwue" /%}

{% edge fwom="hash-1" to="hash-5" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="hash-2" to="hash-5" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="hash-3" to="hash-6" fwomPosition="top" toPosition="bottom" deme="bwue" /%}
{% edge fwom="hash-4" to="hash-6" fwomPosition="top" toPosition="bottom" deme="mint" /%}

{% edge fwom="Uw1C" to="hash-1" fwomPosition="top" toPosition="bottom" pad="stwaight" /%}
{% edge fwom="sXCd" to="hash-2" fwomPosition="top" toPosition="bottom" pad="stwaight" /%}
{% edge fwom="WbJs" to="hash-3" fwomPosition="top" toPosition="bottom" pad="stwaight" deme="bwue" /%}
{% edge fwom="wwAv" to="hash-4" fwomPosition="top" toPosition="bottom" pad="stwaight" /%}

{% /diagwam %}

Dewefowe, de Awwow Wist guawd’s settings wequiwe a Mewkwe Woot which acts as a souwce of twud fow de pweconfiguwed wist of awwowed wawwets~ Fow a wawwet to pwuv it is on de awwowed wist, it must pwovide a vawid Mewkwe Pwoof dat awwows de pwogwam to we-compute de Mewkwe Woot and ensuwe it matches de guawd’s settings.

Nyote dat ouw SDKs pwovide hewpews to make it easy to cweate Mewkwe Woot and Mewkwe Pwoofs fow a given wist of wawwets.

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
{% nyode #candy-guawd-guawds wabew="Guawds" deme="mint" z=1 /%}
{% nyode #awwowWist wabew="AwwowWist" /%}
{% nyode #guawdMewkweWoot wabew="- Mewkwe Woot" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="awwowWist" x="250" y="10" %}
{% nyode #mewkweWoot deme="swate" %}
Mewkwe Woot {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% nyode pawent="mewkweWoot" x="170" %}
{% nyode #mewkwePwoof deme="swate" %}
Mewkwe Pwoof {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% nyode pawent="mewkweWoot" y="100" x="-12" %}
{% nyode #wawwetWist  %}
Wist of wawwets

awwowed to mint
{%/nyode %}
{% /nyode %}
{% edge fwom="mewkwePwoof" to="wawwetWist" awwow="nyonye" fwomPosition="bottom" toPosition="top" awwow="stawt" /%}
{% edge fwom="mewkweWoot" to="wawwetWist" awwow="nyonye" fwomPosition="bottom" toPosition="top" awwow="stawt" /%}


{% nyode pawent="mewkwePwoof" y="100" %}
{% nyode #payew wabew="Payew" deme="indigo" /%}
{% nyode deme="dimmed"%}
Ownyew: Any Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}
{% edge fwom="mewkwePwoof" to="payew" awwow="nyonye" fwomPosition="bottom" toPosition="top" awwow="stawt" pad="stwaight" /%}

{% nyode pawent="candy-machinye" x="740" %}
  {% nyode #woute-vawidation deme="pink" %}
    Woute fwom de

    _Candy Guawd Pwogwam_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="woute-vawidation" y="-20" x="100" deme="twanspawent" %}
  Vewify Mewkwe Pwoof
{% /nyode %}

{% nyode pawent="woute-vawidation" #awwowWist-pda y="130" x="32" %}
{% nyode deme="swate" %}
Awwowwist PDA {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% nyode pawent="awwowWist-pda" #mint-candy-guawd y="90" x="-31" %}
  {% nyode deme="pink" %}
    Mint fwom

    _Candy Guawd Pwogwam_ {% .whitespace-nyowwap %}
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-guawd" y="-20" x="100" deme="twanspawent" %}
  Access Contwow
{% /nyode %}

{% nyode pawent="mint-candy-guawd" #mint-candy-machinye y="110" x="-8" %}
  {% nyode deme="pink" %}
    Mint fwom 
    
    _Candy Machinye Pwogwam_ {% .whitespace-nyowwap %}
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-machinye" y="-20" x="110" deme="twanspawent" %}
  Mint Wogic
{% /nyode %}

{% nyode #nft pawent="mint-candy-machinye" y="110" x="70" deme="bwue" %}
  NFT
{% /nyode %}
{% edge fwom="mint-candy-machinye" to="nft" pad="stwaight" /%}

{% edge fwom="candy-guawd" to="candy-machinye" /%}
{% edge fwom="guawdMewkweWoot" to="mewkweWoot" awwow="stawt" pad="stwaight" /%}
{% edge fwom="mewkweWoot" to="woute-vawidation" awwow="nyonye" fwomPosition="top" dashed=twue /%}
{% edge fwom="mewkwePwoof" to="woute-vawidation" awwow="nyonye" fwomPosition="top" dashed=twue  %}
if de payew's Mewkwe Pwoof does nyot match 

de guawd's Mewkwe Woot vawidation wiww faiw
{% /edge %}
{% edge fwom="candy-guawd-guawds" to="guawds" /%}
{% edge fwom="woute-vawidation" to="awwowWist-pda" pad="stwaight" /%}
{% edge fwom="awwowWist-pda" to="mint-candy-guawd" pad="stwaight" /%}
{% edge fwom="mint-candy-guawd" to="mint-candy-machinye" pad="stwaight" /%}


{% /diagwam %}

## Guawd Settings

De Awwow Wist guawd contains de fowwowing settings:

- **Mewkwe Woot**: De Woot of de Mewkwe Twee wepwesenting de awwow wist.

{% diawect-switchew titwe="Set up a Candy Machinye using de Awwowwist guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

To hewp us manyage Mewkwe Twees, de Umi wibwawy pwovides two hewpew medods cawwed `getMerkleRoot` and `getMerkleProof` dat you may use wike so.

```ts
import {
  getMerkleProof,
  getMerkleRoot,
} from "@metaplex-foundation/mpl-candy-machine";

const allowList = [
  "Ur1CbWSGsXCdedknRbJsEk7urwAvu1uddmQv51nAnXB",
  "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS",
  "AT8nPwujHAD14cLojTcB1qdBzA1VXnT6LVGuUd6Y73Cy",
];

const merkleRoot = getMerkleRoot(allowList);
const validMerkleProof = getMerkleProof(
  allowList,
  "Ur1CbWSGsXCdedknRbJsEk7urwAvu1uddmQv51nAnXB"
);
const invalidMerkleProof = getMerkleProof(allowList, "invalid-address");
```

Once we have computed de Mewkwe Woot of ouw awwow wist, we can use it to set up de Awwow Wist guawd on ouw Candy Machinye.

UWUIFY_TOKEN_1744632714353_1

API Wefewences: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [AllowList](https://mpl-candy-machine.typedoc.metaplex.com/types/AllowList.html)

{% /totem %}
{% /diawect %}
{% diawect titwe="Sugaw" id="sugaw" %}
{% totem %}

Sugaw does nyot contain a function to cweate manyage de mewkwe woot~ When using a awwowwist wid sugaw you wouwd have to compute it befowehand e.g~ wid de pweviouswy descwibed JavaScwipt function ow [sol-tools](https://sol-tools.tonyboyle.io/cmv3/allow-list) and dan add de mewkwe woot hash to youw config wike dis:

```json
"allowList" : {
    "merkleRoot": "<HASH>"
}
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Mint Settings

De Awwow Wist guawd contains de fowwowing Mint Settings:

- **Mewkwe Woot**: De Woot of de Mewkwe Twee wepwesenting de awwow wist.

Nyote dat, befowe being abwe to mint, **we must vawidate de minting wawwet by pwoviding a Mewkwe Pwoof**~ See [Validate a Merkle Proof](#validate-a-merkle-proof) bewow fow mowe detaiws.

Awso nyote dat, if you’we pwannying on constwucting instwuctions widout de hewp of ouw SDKs, you wiww nyeed to add de Awwow Wist Pwoof PDA to de wemainying accounts of de mint instwuction~ See de [Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#allowlist) fow mowe detaiws.

{% diawect-switchew titwe="Mint wid de Awwow Wist guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

You may pass de Mint Settings of de Awwow Wist guawd using de `mintArgs` awgument wike so.

```ts
import { getMerkleRoot } from "@metaplex-foundation/mpl-candy-machine";

const allowList = [
  "Ur1CbWSGsXCdedknRbJsEk7urwAvu1uddmQv51nAnXB",
  "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS",
  "AT8nPwujHAD14cLojTcB1qdBzA1VXnT6LVGuUd6Y73Cy",
];

mintV2(umi, {
  // ...
  mintArgs: {
    allowList: some({ merkleRoot: getMerkleRoot(allowList) }),
  },
});
```

API Wefewences: [mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html), [AllowListMintArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/AllowListMintArgs.html)

{% /totem %}
{% /diawect %}
{% diawect titwe="Sugaw" id="sugaw" %}
{% totem %}

_As soon as a guawd is assignyed you cannyot use sugaw to mint - dewefowe dewe awe nyo specific mint settings._

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Woute Instwuction

De Awwow Wist woute instwuction suppowts de fowwowing featuwes.

### Vawidate a Mewkwe Pwoof

_Pad: `proof`_

Instead of passing de Mewkwe Pwoof diwectwy to de mint instwuction, de minting wawwet must pewfowm a [Pre-Validation](/candy-machine/mint#minting-with-pre-validation) by using de woute instwuction of de Awwow Wist guawd.

Dis woute instwuction wiww compute de Mewkwe Woot fwom de pwovided Mewkwe Pwoof and, if vawid, wiww cweate a nyew PDA account acting as pwoof dat de minting wawwet is pawt of de awwowed wist~ Dewefowe, when minting, de Awwow Wist guawd onwy nyeeds to check fow de existence of dis PDA account to audowize ow deny minting to de wawwet.

So why can’t we just vewify de Mewkwe Pwoof diwectwy widin de mint instwuction? owo Dat’s simpwy because, fow big awwow wists, Mewkwe Pwoofs can end up being pwetty wengdy~ Aftew a cewtain size, it becomes impossibwe to incwude it widin de mint twansaction dat awweady contains a decent amount of instwuctions~ By sepawating de vawidation pwocess fwom de minting pwocess, we make it possibwe fow awwow wists to be as big as we nyeed dem to be.

Dis pad of de woute instwuction accepts de fowwowing awguments:

- **Pad** = `proof`: Sewects de pad to execute in de woute instwuction.
- **Mewkwe Woot**: De Woot of de Mewkwe Twee wepwesenting de awwow wist.
- **Mewkwe Pwoof**: De wist of intewmediawy hashes dat shouwd be used to compute de Mewkwe Woot and vewify dat it matches de Mewkwe Woot stowed on de guawd’s settings.
- **Mintew** (optionyaw): De mintew account as a signyew if it is nyot de same as de payew~ When pwovided, dis account must be pawt of de awwow wist fow de pwoof to be vawid.

{% diawect-switchew titwe="Pwe-Vawidate a Wawwet" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

You may pass de "Pwoof" Woute Settings of de Awwow Wist guawd using de `routeArgs` awgument wike so.

```ts
import {
  getMerkleProof,
  getMerkleRoot,
} from "@metaplex-foundation/mpl-candy-machine";
import { publicKey } from "@metaplex-foundation/umi";

const allowList = [
  "Ur1CbWSGsXCdedknRbJsEk7urwAvu1uddmQv51nAnXB",
  "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS",
  "AT8nPwujHAD14cLojTcB1qdBzA1VXnT6LVGuUd6Y73Cy",
];

await route(umi, {
  // ...
  guard: "allowList",
  routeArgs: {
    path: "proof",
    merkleRoot: getMerkleRoot(allowList),
    merkleProof: getMerkleProof(allowList, publicKey(umi.identity)),
  },
}).sendAndConfirm(umi);
```

De `umi.identity` wawwet is nyow awwowed to mint fwom de Candy Machinye.

API Wefewences: [route](https://mpl-candy-machine.typedoc.metaplex.com/functions/route.html), [AllowListRouteArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/AllowListRouteArgs.html)

{% /totem %}
{% /diawect %}
{% diawect titwe="Sugaw" id="sugaw" %}
{% totem %}

_Sugaw can nyot be used to caww de "Pwoof" Woute._ 

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}