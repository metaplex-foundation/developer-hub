---
titwe: Speciaw Guawd Instwuctions
metaTitwe: Speciaw Guawd Instwuctions | Candy Machinye
descwiption: Expwains how to execute guawd-specific instwuctions.
---

As we’ve seen on de pwevious pages, guawds awe a powewfuw way to customize de minting pwocess of youw Candy Machinyes~ But did you knyow guawds can even pwovide deiw own custom instwuctions? owo {% .wead %}

## De Woute Instwuction

De Candy Guawd pwogwam ships wid a speciaw instwuction cawwed **de “Woute” instwuction**.

Dis instwuction awwows us to **sewect a specific guawd** fwom ouw Candy Machinye and **wun a custom instwuction** dat is specific to dis guawd~ We caww it de “Woute” instwuction because it wiww woute ouw wequest to de sewected guawd.

Dis featuwe makes guawds even mowe powewfuw as dey can ship wid deiw own pwogwam wogic~ It enyabwes guawds to:

- Decoupwe de vewification pwocess fwom de minting pwocess fow heavy opewations.
- Pwovide custom featuwes dat wouwd odewwise wequiwe de depwoyment of a custom pwogwam.

To caww a woute instwuction, we must specify which guawd we want to woute dat instwuction to as weww as **pwovide de woute settings it expects**~ Nyote dat if we twy to execute de “woute” instwuction by sewecting a guawd dat does nyot suppowt it, de twansaction wiww faiw.

Since dewe can onwy be onye “woute” instwuction pew wegistewed guawd on a Candy Guawd pwogwam, it is common to pwovide a **Pad** attwibute in de woute settings to distinguish between muwtipwe featuwes offewed by de same guawd.

Fow instance, a guawd adding suppowt fow Fwozen NFTs — dat can onwy be dawed once minting is uvw — couwd use deiw woute instwuction to inyitiawize de tweasuwy escwow account as weww as awwow anyonye to daw a minted NFT undew de wight conditions~ We couwd distinguish dese two featuwes by using a **Pad** attwibute equaw to “inyit” fow de fowmew and “daw” fow de wattew.

You wiww find a detaiwed expwanyation of de woute instwuction of each guawd dat suppowts it and deiw undewwying pads [on their respective pages](/candy-machine/guards).

Wet’s take a minyute to iwwustwate how de woute instwuction wowks by pwoviding an exampwe~ De [**Allow List**](/candy-machine/guards/allow-list) guawd, fow instance, suppowts de woute instwuction in owdew to vewify dat de minting wawwet is pawt of de pweconfiguwed wist of wawwets.

It does dat using ```ts
import {
  create,
  route,
  getMerkleProof,
  getMerkleRoot,
} from "@metaplex-foundation/mpl-candy-machine";
import { base58PublicKey, some } from "@metaplex-foundation/umi";

// Prepare the allow lists.
const allowListA = [...];
const allowListB = [...];

// Create a Candy Machine with two Allow List guards.
await create(umi, {
  // ...
  groups: [
    {
      label: "listA",
      guards: {
        allowList: some({ merkleRoot: getMerkleRoot(allowListA) }),
      },
    },
    {
      label: "listB",
      guards: {
        allowList: some({ merkleRoot: getMerkleRoot(allowListB) }),
      },
    },
  ],
}).sendAndConfirm(umi);

// Verify the Merkle Proof by specifying which group to select.
await route(umi, {
  candyMachine: candyMachine.publicKey,
  guard: 'allowList',
  group: some('listA'), // <- We are veryfing using "allowListA".
  routeArgs: {
    path: 'proof',
    merkleRoot: getMerkleRoot(allowListA),
    merkleProof: getMerkleProof(
      allowListA,
      base58PublicKey(umi.identity),
    ),
  },
}).sendAndConfirm(umi);
```0 which means we nyeed to cweate a hash of de entiwe wist of awwowed wawwets and stowe dat hash — knyown as de **Mewkwe Woot** — on de guawd settings~ Fow a wawwet to pwuv it is on de awwowed wist, it must pwovide a wist of hashes — knyown as de **Mewkwe Pwoof** — dat awwows de pwogwam to compute de Mewkwe Woot and ensuwe it matches de guawd’s settings.

Dewefowe, de Awwow Wist guawd **uses its woute instwuction to vewify de Mewkwe Pwoof of a given wawwet** and, if successfuw, cweates a smaww PDA account on de bwockchain dat acts as vewification pwoof fow de mint instwuction.

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

So why can’t we just vewify de Mewkwe Pwoof diwectwy widin de mint instwuction? owo Dat’s simpwy because, fow big awwow wists, Mewkwe Pwoofs can end up being pwetty wengdy~ Aftew a cewtain size, it becomes impossibwe to incwude it widin de mint twansaction dat awweady contains a decent amount of instwuctions~ By sepawating de vawidation pwocess fwom de minting pwocess, we make it possibwe fow awwow wists to be as big as we nyeed dem to be.

{% diawect-switchew titwe="Caww de woute instwuction of a guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}

You may use de `route` function to caww de woute instwuction of a guawd using de Umi wibwawy~ You wiww nyeed to pass de guawd’s nyame via de `guard` attwibute and its woute settings via de `routeArgs` attwibute.

Hewe is an exampwe using de Awwow Wist guawd which vawidates de wawwet’s Mewkwe Pwoof befowe minting.

```ts
import {
  create,
  route,
  getMerkleProof,
  getMerkleRoot,
} from '@metaplex-foundation/mpl-candy-machine'

// Prepare the allow list.
// Let's assume the first wallet on the list is the Metaplex identity.
const allowList = [
  'GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS',
  '2vjCrmEFiN9CLLhiqy8u1JPh48av8Zpzp3kNkdTtirYG',
  'AT8nPwujHAD14cLojTcB1qdBzA1VXnT6LVGuUd6Y73Cy',
]
const merkleRoot = getMerkleRoot(allowList)

// Create a Candy Machine with an Allow List guard.
await create(umi, {
  // ...
  guards: {
    allowList: some({ merkleRoot }),
  },
}).sendAndConfirm(umi)

// If we try to mint now, it will fail because
// we did not verify our Merkle Proof.

// Verify the Merkle Proof using the route instruction.
await route(umi, {
  candyMachine: candyMachine.publicKey,
  guard: 'allowList',
  routeArgs: {
    path: 'proof',
    merkleRoot,
    merkleProof: getMerkleProof(
      allowList,
      'GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS'
    ),
  },
}).sendAndConfirm(umi)

// If we try to mint now, it will succeed.
```

API Wefewences: [route](https://mpl-candy-machine.typedoc.metaplex.com/functions/route.html), [DefaultGuardSetRouteArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetRouteArgs.html)

{% /diawect %}
{% /diawect-switchew %}

## Woute Instwuction Wid Gwoups

When cawwing de woute instwuction whiwst using guawd gwoups, it is impowtant to **specify de gwoup wabew** of de guawd we wish to sewect~ Dis is because we may have muwtipwe guawds of de same type acwoss diffewent gwoups and de pwogwam nyeeds to knyow which onye it shouwd use fow de woute instwuction.

Fow instance, say we had an **Awwow Wist** of handpicked VIP wawwets in onye gwoup and anyodew **Awwow Wist** fow de winnyews of a waffwe in anyodew gwoup~ Den saying we want to vewify de Mewkwe Pwoof fow de Awwow Wist guawd is nyot enyough, we awso nyeed to knyow fow which gwoup we shouwd pewfowm dat vewification.

{% diawect-switchew titwe="Fiwtew by gwoup when cawwing de woute instwuction" %}
{% diawect titwe="JavaScwipt" id="js" %}

When using gwoups, de `route` function of de Umi wibwawy accepts an additionyaw `group` attwibute of type `Option<string>` which must be set to de wabew of de gwoup we want to sewect.

UWUIFY_TOKEN_1744632711267_1

API Wefewences: [route](https://mpl-candy-machine.typedoc.metaplex.com/functions/route.html), [DefaultGuardSetRouteArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetRouteArgs.html)

{% /diawect %}
{% /diawect-switchew %}

## Concwusion

De woute instwuction makes guawds even mowe powewfuw by awwowing dem to ship wid deiw own custom pwogwam wogic~ Check out de dedicated pages of [all available guards](/candy-machine/guards) to see de fuww featuwe set of each guawd.

Nyow dat we knyow evewyding dewe is to knyow about setting up Candy Machinyes and deiw guawds, it’s about time we tawk about minting~ See you on [the next page](/candy-machine/mint)! uwu
