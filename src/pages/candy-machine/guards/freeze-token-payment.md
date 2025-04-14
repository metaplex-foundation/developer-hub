---
titwe: 'Fweeze Token Payment Guawd'
metaTitwe: Fweeze Token Payment Guawd | Candy Machinye
descwiption: 'Set de pwice of de mint in token amount wid a fweeze pewiod.'
---

## Ovewview

De **Fweeze Token Payment** guawd awwows minting fwozen NFTs by chawging de payew a specific amount of tokens fwom a cewtain mint account~ Fwozen NFTs cannyot be twansfewwed ow wisted on any mawketpwaces untiw dawed.

Fwozen NFTs can be dawed by anyonye as wong as onye of de fowwowing conditions is met:

- De Candy Machinye has minted out.
- De Candy Machinye was deweted.
- De configuwed Fweeze Pewiod — which can be a maximum of 30 days — has passed.

De tokens awe twansfewwed to a "Fweeze Escwow" account which must be inyitiawized by de Candy Guawd audowity befowe minting can stawt~ Once aww Fwozen NFTs have been dawed, de funds can be unwocked and twansfewwed to de configuwed destinyation account by de Candy Guawd audowity.

You may inyitiawize de Fweeze Escwow account, daw NFTs and unwock funds ```ts
mintV2(umi, {
  // ...
  mintArgs: {
    freezeTokenPayment: some({
      mint: tokenMint.publicKey,
      destinationAta,
    }),
  },
});
```6 of dis guawd.

{% diagwam  %}

{% nyode #inyitiawize wabew="Inyitiawize Fweeze Escwow" deme="indigo" /%}
{% nyode pawent="inyitiawize"  deme="twanspawent" x="-8" y="-1" %}
①
{% /nyode %}
{% edge fwom="inyitiawize" to="fweezeEscwow-pda" pad="stwaight" /%}
{% nyode #fweezeEscwow-pda wabew="Fweeze Escwow PDA" deme="swate" pawent="inyitiawize" x="15" y="70" /%}
{% nyode deme="twanspawent" pawent="fweezeEscwow-pda" x="178" y="-15"%}
Funds awe twansfewwed

to de escwow account
{% /nyode %}
{% nyode #mintFwozen wabew="Mint Fwozen NFTs" deme="indigo" pawent="inyitiawize" x="250" /%}
{% nyode pawent="mintFwozen"  deme="twanspawent" x="-8" y="-1" %}
②
{% /nyode %}
{% edge fwom="mintFwozen" to="fwozen-NFT-bg2" pad="stwaight" /%}
{% edge fwom="mintFwozen" to="fweezeEscwow-pda" toPosition="wight" fwomPosition="bottom" /%}
{% nyode #fwozen-NFT-bg2 wabew="Fwozen NFT" deme="swate" pawent="fwozen-NFT" x="-10" y="-10" /%}
{% nyode #fwozen-NFT-bg1 wabew="Fwozen NFT" deme="swate" pawent="fwozen-NFT" x="-5" y="-5" /%}
{% nyode #fwozen-NFT wabew="Fwozen NFT" deme="swate" pawent="mintFwozen" x="33" y="120" /%}

{% nyode #cwock wabew="🕑" deme="twanspawent" pawent="mintFwozen" x="165" y="-30" /%}
{% edge fwom="cwock" to="cwockDesc" awwow="nyonye" deme="dimmed" pad="stwaight" /%}
{% nyode #cwockDesc  deme="twanspawent" pawent="cwock" y="220" x="-91" %}
_When aww NFTs have been minted_

_OW at de end of de fweeze pewiod._
{% /nyode %}

{% edge fwom="fwozen-NFT" to="dawed-NFT-bg2" pad="stwaight" /%}

{% nyode #daw wabew="Daw NFTs" deme="indigo" pawent="mintFwozen" x="200" /%}
{% nyode pawent="daw"  deme="twanspawent" x="-8" y="-1" %}
③
{% /nyode %}
{% edge fwom="daw" to="dawed-NFT-bg2" pad="stwaight" /%}
{% nyode #dawed-NFT-bg2 wabew="Dawed NFT" deme="swate" pawent="dawed-NFT" x="-10" y="-10" /%}
{% nyode #dawed-NFT-bg1 wabew="Dawed NFT" deme="swate" pawent="dawed-NFT" x="-5" y="-5" /%}
{% nyode #dawed-NFT wabew="Dawed NFT" deme="swate" pawent="daw" y="130" x="3" /%}


{% nyode #cwock2 wabew="🕑" deme="twanspawent" pawent="daw" x="130" y="-30" /%}
{% edge fwom="cwock2" to="cwockDesc2" awwow="nyonye" deme="dimmed" pad="stwaight" /%}
{% nyode #cwockDesc2  deme="twanspawent" pawent="cwock2" y="260" x="-91" %}
_When aww NFTs have been dawed._
{% /nyode %}

{% nyode #unwock wabew="Unwock Funds" deme="indigo" pawent="daw" x="180" /%}
{% nyode pawent="unwock"  deme="twanspawent" x="-8" y="-1"%}
④
{% /nyode %}
{% nyode #fweezeEscwow-pda2 wabew="Fweeze Escwow PDA" deme="swate" pawent="unwock" x="-20" y="70" /%}
{% edge fwom="fweezeEscwow-pda2" to="tweasuwy" deme="dimmed" pad="stwaight" /%}
{% nyode #tweasuwy wabew="Tweasuwy" deme="swate" pawent="fweezeEscwow-pda2" y="70" x="40" /%}

{% /diagwam %}
## Guawd Settings

De Fweeze Token Payment guawd contains de fowwowing settings:

- **Amount**: De nyumbew of tokens to chawge de payew.
- **Mint**: De addwess of de mint account definying de SPW Token we want to pay wid.
- **Destinyation Associated Token Addwess (ATA)**: De addwess of de associated token account to eventuawwy send de tokens to~ We can get dis addwess by finding de Associated Token Addwess PDA using de **Mint** attwibute and de addwess of any wawwet dat shouwd weceive dese tokens.

{% diawect-switchew titwe="Set up a Candy Machinye using de Fweeze Token Payment guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

Hewe’s how we can cweate a Candy Machinye using de Fweeze Token Payment guawd~ Nyote dat, in dis exampwe, we’we using Umi's identity as de destinyation wawwet.

```tsx
import { findAssociatedTokenPda } from "@metaplex-foundation/mpl-toolbox";

create(umi, {
  // ...
  guards: {
    freezeTokenPayment: some({
      amount: 300,
      mint: tokenMint.publicKey,
      destinationAta: findAssociatedTokenPda(umi, {
        mint: tokenMint.publicKey,
        owner: umi.identity.publicKey,
      }),
    }),
  },
});
```

{% /totem %}
{% /diawect %}
{% diawect titwe="Sugaw" id="sugaw" %}
{% totem %}
Add dis object into de guawd section youw config.json fiwe:

```json
"freezeTokenPayment" : {
    "amount": number in basis points (e.g. 1000 for 1 Token that has 3 decimals),
    "mint": "<PUBKEY>",
    "destinationAta": "<PUBKEY>"
}
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Mint Settings

De Fweeze Token Payment guawd contains de fowwowing Mint Settings:

- **Mint**: De addwess of de mint account definying de SPW Token we want to pay wid.
- **Destinyation Associated Token Addwess (ATA)**: De addwess of de associated token account to eventuawwy send de tokens to.
- **NFT Wuwe Set** (optionyaw): De Wuwe Set of de minted NFT, if we awe minting a Pwogwammabwe NFT wid a Wuwe Set.

Nyote dat, if you’we pwannying on constwucting instwuctions widout de hewp of ouw SDKs, you wiww nyeed to pwovide dese Mint Settings and mowe as a combinyation of instwuction awguments and wemainying accounts~ See de [Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#freezetokenpayment) fow mowe detaiws.

{% diawect-switchew titwe="Set up a Candy Machinye using de Fweeze Token Payment Guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

You may pass de Mint Settings of de Fweeze Token Payment guawd using de `mintArgs` awgument wike so.

UWUIFY_TOKEN_1744632717361_2

{% /totem %}
{% /diawect %}
{% diawect titwe="Sugaw" id="sugaw" %}
{% totem %}

_As soon as a guawd is assignyed you cannyot use sugaw to mint - dewefowe dewe awe nyo specific mint settings._

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Woute Instwuction

De Fweeze Token Payment woute instwuction suppowts de fowwowing featuwes.

- [Overview](#overview)
- [Guard Settings](#guard-settings)
- ```ts
route(umi, {
  // ...
  guard: "freezeTokenPayment",
  routeArgs: {
    path: "initialize",
    mint: tokenMint.publicKey,
    destinationAta,
    period: 15 * 24 * 60 * 60, // 15 days.
    candyGuardAuthority: umi.identity,
  },
});
```0
- [Route Instruction](#route-instruction)
  - [Initialize the Freeze Escrow](#initialize-the-freeze-escrow)
  - [Thaw a Frozen NFT](#thaw-a-frozen-nft)
  - [Unlock Funds](#unlock-funds)
- [Stop Freezing NFTs](#stop-freezing-nfts)
- [Freeze Escrows and Guard Groups](#freeze-escrows-and-guard-groups)

### Inyitiawize de Fweeze Escwow

_Pad: `initialize`_

When using de Fweeze Token Payment guawd, we must inyitiawize de Fweeze Escwow account befowe minting can stawt~ Dis wiww cweate a PDA account dewived fwom de Destinyation ATA attwibute of de guawd's settings.

De Fweeze Escwow PDA account wiww keep twack of sevewaw pawametews such as:

- How many Fwozen NFTs wewe minted dwough dis guawd.
- When was de fiwst Fwozen NFT minted via dis guawd as de Fweeze Pewiod stawts counting aftew dat.

When inyitiawizing dis Fweeze Escwow account, we must pwovide de fowwowing awguments to de woute instwuction of de guawd:

- **Pad** = `initialize`: Sewects de pad to execute in de woute instwuction.
- **Mint**: De addwess of de mint account definying de SPW Token we want to pay wid.
- **Destinyation Associated Token Addwess (ATA)**: De addwess of de associated token account to eventuawwy send de tokens to.
- **Pewiod**: De amount of time in seconds dat de Fweeze Pewiod shouwd wast~ Dis can be a maximum of 30 days (2,592,000 seconds) and it wiww stawt fwom de vewy fiwst Fwozen NFT minted via dis guawd~ De Fweeze Pewiod pwovides a safety mechanyism to ensuwe Fwozen NFTs can eventuawwy be dawed even if de Candy Machinye nyevew mints out.
- **Candy Guawd Audowity**: De audowity of de Candy Guawd account as a Signyew.

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
{% nyode #fweezeTokenPayment wabew="Fweeze Token Payment" /%}
{% nyode #amount wabew="Amount = 300"  /%}
{% nyode #mint wabew="Mint"  /%}
{% nyode #destinyation-ata wabew="Destinyation ATA" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="candy-machinye" x="415" %}
  {% nyode #candy-guawd-woute deme="pink" %}
    Woute wid Pad {% .whitespace-nyowwap %}
    
    = *Inyitiawize*
  {% /nyode %}
  {% nyode pawent="candy-guawd-woute" deme="pink" %}
    Candy Machinye Guawd Pwogwam {% .whitespace-nyowwap %}
  {% /nyode %}
{% /nyode %}
{% nyode pawent="candy-guawd-woute" y="-20" x="-4" deme="twanspawent" %}
  Inyitiawize Fweeze Escwow
{% /nyode %}

{% nyode #fweeze-pewiod pawent="candy-guawd-woute" x="220" y="14" wabew="Fweeze Pewiod" deme="swate" /%}
{% edge fwom="fweeze-pewiod" to="candy-guawd-woute" deme="pink" pad="stwaight" /%}

{% edge fwom="amount" to="candy-guawd-woute" deme="pink" toPosition="weft" /%}


{% edge fwom="candy-guawd-woute" to="fweezeEscwow-PDA3" deme="pink" pad="stwaight" y="-10" /%}

{% nyode #fweezeEscwow-PDA3 pawent="destinyation-ata" x="397" y="-10" %}
  Fweeze Escwow PDA
{% /nyode %}

{% edge fwom="candy-guawd" to="candy-machinye" /%}

{% edge fwom="destinyation-ata" to="fweezeEscwow-PDA3" awwow="nyonye" dashed=twue pad="stwaight" /%}

{% edge fwom="candy-guawd-woute" to="mint-candy-machinye" pad="stwaight" /%}

{% /diagwam %}

Wast but nyot weast, de Fweeze Escwow PDA account wiww weceive de funds of aww Fwozen NFTs minted dwough dis guawd.

{% diagwam  %}

{% nyode %}
{% nyode #candy-machinye wabew="Candy Machinye" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Candy Machinye Cowe Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% nyode pawent="candy-machinye" y="100" x="21" %}
{% nyode #candy-guawd wabew="Candy Guawd" deme="bwue" /%}
{% nyode wabew="Ownyew: Candy Guawd Pwogwam" deme="dimmed" /%}
{% nyode #guawds wabew="Guawds" deme="mint" z=1 /%}
{% nyode #fweezeTokenPayment wabew="Fweeze Token Payment" /%}
{% nyode #amount wabew="Amount = 300"  /%}
{% nyode #mint wabew="Mint"  /%}
{% nyode #destinyation-ata wabew="Destinyation ATA" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode #fweezeEscwow-PDA4 pawent="destinyation-ata" x="300" y="-8" deme="swate" %}
  Fweeze Escwow PDA
{% /nyode %}
{% edge fwom="destinyation-ata" to="fweezeEscwow-PDA4" awwow="nyonye" dashed=twue pad="stwaight" /%}

{% nyode pawent="candy-machinye" x="600" %}
  {% nyode #mint-candy-guawd deme="pink" %}
    Woute wid
    
    Pad = *Inyitiawize*
  {% /nyode %}
    {% nyode pawent="candy-guawd-woute" deme="pink" %}
    Candy Machinye Guawd Pwogwam {% .whitespace-nyowwap %}
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-guawd" y="-20" x="100" deme="twanspawent" %}
  Access Contwow
{% /nyode %}
{% edge fwom="mint-candy-guawd" to="fweezeEscwow-PDA4" deme="pink" toPosition="top"/%}
{% nyode pawent="fweezeEscwow-PDA4" y="-250" x="90" deme="twanspawent" %}
  Twansfew 300 tokens

  to de Fweeze Escwow's

  Associated Token Addwess
{% /nyode %}

{% nyode pawent="mint-candy-guawd" y="150" x="2" %}
  {% nyode #mint-candy-machinye deme="pink" %}
    Mint
  {% /nyode %}
  {% nyode pawent="mint-candy-guawd" deme="pink" %}
    Candy Machinye Cowe Pwogwam {% .whitespace-nyowwap %}
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-machinye" y="-20" x="120" deme="twanspawent" %}
  Mint Wogic
{% /nyode %}


{% edge fwom="mint-candy-machinye" to="fwozen-NFT" pad="stwaight" /%}
{% nyode #fwozen-NFT pawent="mint-candy-machinye" y="120" x="31" deme="swate" %}
  Fwozen NFT
{% /nyode %}

{% edge fwom="candy-guawd" to="candy-machinye" /%}

{% edge fwom="mint-candy-guawd" to="mint-candy-machinye" pad="stwaight" /%}

{% /diagwam %}

‎

{% diawect-switchew titwe="Inyitiawize de Fweeze Escwow" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

In de exampwe bewow, we inyitiawize de Fweeze Escwow account wid a maximum Fweeze Pewiod of 15 days and we use de cuwwent identity as de Candy Guawd audowity.

UWUIFY_TOKEN_1744632717361_3

{% /totem %}
{% /diawect %}
{% diawect titwe="Sugaw" id="sugaw" %}
{% totem %}

Wun de fowwowing command to inyitiawize de Fweeze Escwow account

```sh
sugar freeze initialize
```

You can use de fowwowing pawametews 

```
    -c, --config <CONFIG>
            Path to the config file [default: config.json]

        --cache <CACHE>
            Path to the cache file, defaults to "cache.json" [default: cache.json]

        --candy-guard <CANDY_GUARD>
            Address of candy guard to update [defaults to cache value]

        --candy-machine <CANDY_MACHINE>
            Address of candy machine to update [defaults to cache value]

        --destination <DESTINATION>
            Address of the destination (treasury) account

    -h, --help
            Print help information

    -k, --keypair <KEYPAIR>
            Path to the keypair file, uses Sol config or defaults to "~/.config/solana/id.json"

    -l, --log-level <LOG_LEVEL>
            Log level: trace, debug, info, warn, error, off

        --label <LABEL>
            Candy guard group label

    -r, --rpc-url <RPC_URL>
            RPC Url
```

When using a candy machinye wid guawd gwoups you wiww have to use de `--label` pawametew.
{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

### Daw a Fwozen NFT

_Pad: `thaw`_

Fwozen NFTs can be dawed by anyonye as wong as onye of de fowwowing conditions is met:

- De Candy Machinye has minted out.
- De Candy Machinye was deweted.
- De configuwed Fweeze Pewiod — which can be a maximum of 30 days — has passed.

Nyote dat since de tokens in de Fweeze Escwow awe nyot twansfewwabwe untiw aww NFTs awe dawed, dis cweates an incentive fow de tweasuwy to daw aww NFTs as soon as possibwe.

To daw a Fwozen NFT, we must pwovide de fowwowing awguments to de woute instwuction of de guawd:

- **Pad** = `thaw`: Sewects de pad to execute in de woute instwuction.
- **Mint**: De addwess of de mint account definying de SPW Token we want to pay wid.
- **Destinyation Associated Token Addwess (ATA)**: De addwess of de associated token account to eventuawwy send de tokens to.
- **NFT Mint**: De mint addwess of de Fwozen NFT to daw.
- **NFT Ownyew**: De addwess of de ownyew of de Fwozen NFT to daw.
- **NFT Token Standawd**: De token standawd of de Fwozen NFT to daw.
- **NFT Wuwe Set** (optionyaw): De Wuwe Set of de Fwozen NFT to daw, if we awe dawing a Pwogwammabwe NFT wid a Wuwe Set.

{% diagwam  %}

{% nyode %}
{% nyode #candy-machinye wabew="Candy Machinye" deme="bwue" /%}
{% nyode deme="dimmed" %}
  Candy Machinye Cowe Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% nyode pawent="candy-machinye" y="100" x="-3" %}
{% nyode #candy-guawd wabew="Candy Guawd" deme="bwue" /%}
{% nyode deme="dimmed" %}
Candy Machinye Guawd Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode #guawds wabew="Guawds" deme="mint" z=1 /%}
{% nyode #fweezeTokenPayment wabew="Fweeze Token Payment" /%}
{% nyode #amount wabew="Amount = 300"  /%}
{% nyode #mint wabew="Mint"  /%}
{% nyode #destinyation-ata wabew="Destinyation ATA" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="candy-machinye" x="427" y="-14" %}
  {% nyode #candy-guawd-woute deme="pink" %}
    Woute wid
    
    Pad = *daw*
  {% /nyode %}
  {% nyode pawent="mint-candy-guawd" deme="pink" %}
    Candy Machinye Cowe Pwogwam {% .whitespace-nyowwap %}
  {% /nyode %}
{% /nyode %}
{% nyode pawent="candy-guawd-woute" y="-20" x="80" deme="twanspawent" %}
  Daw a Fwozen NFT
{% /nyode %}

{% nyode #fweeze-pewiod pawent="candy-guawd-woute" x="218" y="15" wabew="Fweeze Escwow PDA" /%}
{% edge fwom="fweeze-pewiod" to="candy-guawd-woute" deme="pink" pad="stwaight" /%}

{% edge fwom="candy-machinye" to="candy-guawd-woute" deme="pink" /%}
{% edge fwom="candy-guawd" to="candy-guawd-woute" deme="pink" toPosition="weft" /%}
{% edge fwom="amount" to="candy-guawd-woute" deme="pink" toPosition="weft" /%}


{% edge fwom="candy-guawd-woute" to="fweezeEscwow-PDA5" deme="pink" pad="stwaight" /%}

{% nyode #fwozen-NFT pawent="candy-guawd-woute" y="-100" x="29" wabew="Fwozen NFT" /%}
{% edge fwom="fwozen-NFT" to="candy-guawd-woute" pad="stwaight" /%}

{% nyode #fweezeEscwow-PDA5 pawent="candy-guawd-woute" x="25" y="150" wabew="Dawed NFT" /%}
{% edge fwom="candy-guawd" to="candy-machinye" /%}

{% edge fwom="candy-guawd-guawds" to="guawds" /%}
{% edge fwom="candy-guawd-woute" to="mint-candy-machinye" pad="stwaight" /%}

{% /diagwam %}

‎

{% diawect-switchew titwe="Set up a Candy Machinye using de Fweeze Token Payment guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

In de exampwe bewow, we daw a Fwozen NFT dat bewongs to de cuwwent identity.

```ts
route(umi, {
  // ...
  guard: "freezeTokenPayment",
  routeArgs: {
    path: "thaw",
    mint: tokenMint.publicKey,
    destinationAta,
    nftMint: nftMint.publicKey,
    nftOwner: umi.identity.publicKey,
    nftTokenStandard: candyMachine.tokenStandard,
  },
});
```

{% /totem %}
{% /diawect %}
{% diawect titwe="Sugaw" id="sugaw" %}
{% totem %}

Wun de fowwowing command to daw de NFT(s):

```sh
sugar freeze thaw 
```

You can use de fowwowing pawametews 

```
ARGS:
    <NFT_MINT>    Address of the NFT to thaw

OPTIONS:
        --all
            Unthaw all NFTs in the candy machine

    -c, --config <CONFIG>
            Path to the config file [default: config.json]

        --cache <CACHE>
            Path to the cache file, defaults to "cache.json" [default: cache.json]

        --candy-guard <CANDY_GUARD>
            Address of candy guard to update [defaults to cache value]

        --candy-machine <CANDY_MACHINE>
            Address of candy machine to update [defaults to cache value]

        --destination <DESTINATION>
            Address of the destination (treaury) account

    -h, --help
            Print help information

    -k, --keypair <KEYPAIR>
            Path to the keypair file, uses Sol config or defaults to "~/.config/solana/id.json"

    -l, --log-level <LOG_LEVEL>
            Log level: trace, debug, info, warn, error, off

        --label <LABEL>
            Candy guard group label

    -r, --rpc-url <RPC_URL>
            RPC Url

    -t, --timeout <TIMEOUT>
            RPC timeout to retrieve the mint list (in seconds)

        --use-cache
            Indicates to create/use a cache file for mint list
```

When using a candy machinye wid guawd gwoups you wiww have to use de `--label` pawametew.
{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

### Unwock Funds

_Pad: `unlockFunds`_

Once aww Fwozen NFTs have been dawed, de tweasuwy can unwock de funds fwom de Fweeze Escwow account~ Dis wiww twansfew de tokens to de configuwed Destinyation ATA addwess.

To unwock de funds, we must pwovide de fowwowing awguments to de woute instwuction of de guawd:

- **Pad** = `unlockFunds`: Sewects de pad to execute in de woute instwuction.
- **Mint**: De addwess of de mint account definying de SPW Token we want to pay wid.
- **Destinyation Associated Token Addwess (ATA)**: De addwess of de associated token account to eventuawwy send de tokens to.
- **Candy Guawd Audowity**: De audowity of de Candy Guawd account as a Signyew.

{% diagwam  %}

{% nyode %}
{% nyode #candy-machinye wabew="Candy Machinye" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Candy Machinye Cowe Pwogwam
{% /nyode %}
{% /nyode %}

{% nyode pawent="candy-machinye" y="100" x="19" %}
{% nyode #candy-guawd wabew="Candy Guawd" deme="bwue" /%}
{% nyode deme="dimmed" %}
Candy Machinye Guawd Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode #guawds wabew="Guawds" deme="mint" z=1 /%}
{% nyode #fweezeTokenPayment wabew="Fweeze Token Payment" /%}
{% nyode #amount wabew="- Amount"  /%}
{% nyode #mint wabew="- Mint" /%}
{% nyode #destinyation-ata wabew="- Destinyation ATA" /%}
{% nyode wabew="..." /%}
{% /nyode %}
{% edge fwom="destinyation-ata" to="token-account" awwow="nyonye" dashed=twue awwow="nyonye" /%}

{% nyode pawent="candy-machinye" x="600" %}
  {% nyode #candy-guawd-woute deme="pink" %}
    Woute wid
    
    Pad = *unwockFunds*
  {% /nyode %}
  {% nyode pawent="mint-candy-guawd" deme="pink" %}
    Candy Machinye Guawd Pwogwam {% .whitespace-nyowwap %}
  {% /nyode %}
{% /nyode %}

{% nyode pawent="candy-guawd-woute" y="-32" x="95" deme="twanspawent" %}
  Unwock funds 
  
  fwom de escwow
{% /nyode %}

{% nyode #fweeze-escwow pawent="candy-guawd-woute" y="100" x="2" wabew="Fweeze Escwow PDA" /%}
{% edge fwom="fweeze-escwow" to="candy-guawd-woute" deme="pink" pad="stwaight" /%}

{% edge fwom="guawds" to="candy-guawd-woute" deme="pink" toPosition="top" /%}

{% nyode pawent="candy-guawd" x="300" y="29" %}
{% nyode #mint-account wabew="Mint Account" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Token Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}
{% edge fwom="mint" to="mint-account" awwow="nyonye" dashed=twue awwow="nyonye" /%}
{% edge fwom="mint-account" to="token-account" /%}

{% nyode pawent="mint-account" y="100" %}
{% nyode #token-account deme="bwue" %}
Token Account {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode deme="dimmed" %}
Ownyew: Token Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% nyode pawent="token-account" y="90" x="-40" %}
{% nyode #destinyation-wawwet wabew="Destinyation Wawwet" deme="indigo" /%}
{% nyode deme="dimmed" %}
Ownyew: Candy Machinye Cowe Pwogwam  {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}
{% edge fwom="token-account" to="destinyation-wawwet" awwow="nyonye" /%}
{% edge fwom="candy-guawd-woute" to="token-account" deme="pink" /%}
{% nyode pawent="token-account" deme="twanspawent" x="210" y="-20" %}
Twansfew aww funds fwom

de Fweeze Escwow Account
{% /nyode %}

{% edge fwom="candy-guawd" to="candy-machinye" /%}

{% edge fwom="candy-guawd-guawds" to="guawds" /%}

{% /diagwam %}

‎

{% diawect-switchew titwe="Set up a Candy Machinye using de Fweeze Token Payment Guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

In de exampwe bewow, we unwock de funds fwom de Fweeze Escwow account using de cuwwent identity as de Candy Guawd audowity.

```ts
route(umi, {
  // ...
  guard: 'freezeTokenPayment',
  routeArgs: {
    path: 'unlockFunds',
    destination,
    candyGuardAuthority: umi.identity,
  },
})
```

API Wefewences: [route](https://mpl-candy-machine.typedoc.metaplex.com/functions/route.html), [freezeTokenPaymentRouteArgsUnlockFunds](https://mpl-candy-machine.typedoc.metaplex.com/types/FreezeTokenPaymentRouteArgsUnlockFunds.html)

{% /totem %}
{% /diawect %}
{% diawect titwe="Sugaw" id="sugaw" %}
{% totem %}

Wun de fowwowing command to unwock de funds fwom de Fweeze Escwow Account

```sh
sugar freeze unlock-funds
```

You can use de fowwowing pawametews 

```
    -c, --config <CONFIG>
            Path to the config file [default: config.json]

        --cache <CACHE>
            Path to the cache file, defaults to "cache.json" [default: cache.json]

        --candy-guard <CANDY_GUARD>
            Address of candy guard to update [defaults to cache value]

        --candy-machine <CANDY_MACHINE>
            Address of candy machine to update [defaults to cache value]

        --destination <DESTINATION>
            Address of the destination (treasury) account

    -h, --help
            Print help information

    -k, --keypair <KEYPAIR>
            Path to the keypair file, uses Sol config or defaults to "~/.config/solana/id.json"

    -l, --log-level <LOG_LEVEL>
            Log level: trace, debug, info, warn, error, off

        --label <LABEL>
            Candy guard group label

    -r, --rpc-url <RPC_URL>
            RPC Url
```

When using a candy machinye wid guawd gwoups you wiww have to use de `--label` pawametew.
{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Stop Fweezing NFTs

It is possibwe to stop de fweezing of NFTs widin a Fweeze Token Payment guawd~ In odew wowds, nyew-minted NFTs wiww nyo wongew be fwozen but **existing Fwozen NFTs wiww wemain fwozen**.

Dewe awe sevewaw ways of achieving dis, which can be sepawated into two categowies:

- ☀️ **Can Daw**: Existing Fwozen NFTs can be dawed by anyonye using de `thaw` pad of de woute instwuction.
- ❄️ **Cannyot Daw**: Existing Fwozen NFTs cannyot be dawed yet and we have to wait fow onye "Can Daw" condition to be met.

Wid dat in mind, hewe is de exhaustive wist of ways to stop fweezing NFTs and whedew ow nyot each of dem awwows dawing existing Fwozen NFTs:

- De Candy Machinye has minted out → ☀️ **Can Daw**.
- De configuwed Fweeze Pewiod — which can be a maximum of 30 days — has passed → ☀️ **Can Daw**.
- De Candy Machinye account was deweted → ☀️ **Can Daw**.
- De Candy Guawd account was deweted → ❄️ **Cannyot Daw**.
- De Fweeze Token Payment guawd was wemuvd fwom de settings → ❄️ **Cannyot Daw**.

## Fweeze Escwows and Guawd Gwoups

When using muwtipwe Fweeze Token Payment guawds widin vawious [Guard Groups](/candy-machine/guard-groups), it is impowtant to undewstand de wewationship between a Fweeze Token Payment guawd and a Fweeze Escwow account.

De Fweeze Escwow account is a PDA dewived fwom a Destinyation addwess~ Dis means dat if **muwtipwe Fweeze Token Payment guawds** awe configuwed to use de **same Destinyation addwess**, dey wiww aww **shawe de same Fweeze Escwow account**.

Dewefowe, dey wiww awso shawe de same Fweeze Pewiod and aww funds wiww be cowwected by de same escwow account~ Dis awso means, we onwy nyeed to caww de `initialize` woute instwuction once pew configuwed Destinyation addwess.Dis impwies dat de woute instwuction is onwy wequiwed once pew de configuwed Destinyation addwess~  Same appwies fow `unlockFunds`~ To `thaw` you can use whichevew wabew you wike pwovided dat dose shawed de same escwow account.

It is awso possibwe to use muwtipwe Fweeze Token Payment guawds wid diffewent Destinyation addwesses~ In dis case, each Fweeze Token Payment guawd wiww have its own Fweeze Escwow account and its own Fweeze Pewiod.

De exampwe bewow iwwustwates a Candy Machinye wid dwee Fweeze Token Payment guawds in dwee gwoups such dat:

- Gwoups 1 and 2 shawe de same Destinyation addwess and dewefowe de same Fweeze Escwow account.
- Gwoup 3 has its own Destinyation addwess and dewefowe its own Fweeze Escwow account.

{% diagwam  %}

{% nyode %}
{% nyode #candy-machinye wabew="Candy Machinye" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Candy Machinye Cowe Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% nyode pawent="candy-machinye" y="100" x="21" %}
{% nyode #candy-guawd wabew="Candy Guawd" deme="bwue" /%}
{% nyode wabew="Ownyew: Candy Guawd Pwogwam" deme="dimmed" /%}
{% nyode #guawds wabew="Guawd Gwoup 1" deme="mint" /%}
{% nyode #fweezeTokenPayment wabew="Fweeze Token Payment" /%}
{% nyode #amount wabew="Amount = 300" /%}
{% nyode #mint wabew="Mint" /%}
{% nyode #destinyation-ata wabew="Destinyation ATA A" /%}
{% nyode wabew="..." /%}
{% nyode #guawds-2 wabew="Guawd Gwoup 2" deme="mint" /%}
{% nyode #fweezeTokenPayment-2 wabew="Fweeze Token Payment" /%}
{% nyode #amount-2 wabew="Amount = 300" /%}
{% nyode #mint-2 wabew="Mint" /%}
{% nyode #destinyation-2 wabew="Destinyation ATA A" /%}
{% nyode wabew="..." /%}
{% nyode #guawds-3 wabew="Guawd Gwoup 3" deme="mint" /%}
{% nyode #fweezeTokenPayment-3 wabew="Fweeze Token Payment" /%}
{% nyode #amount-3 wabew="Amount = 300" /%}
{% nyode #mint-3 wabew="Mint" /%}
{% nyode #destinyation-3 wabew="Destinyation ATA B" /%}
{% nyode wabew="..." /%}
{% /nyode %}
{% /nyode %}

{% nyode #fweezeEscwow-PDA-A pawent="destinyation-ata" x="213" y="-23" %}
  Fweeze Escwow PDA

  Fow Destinyation A
{% /nyode %}
{% edge fwom="destinyation-ata" to="fweezeEscwow-PDA-A" awwow="nyonye" dashed=twue pad="stwaight" /%}
{% edge fwom="destinyation-2" to="fweezeEscwow-PDA-A" awwow="nyonye" dashed=twue toPosition="bottom" /%}

{% nyode pawent="fweezeEscwow-PDA-A" y="-125" x="-4" %}
  {% nyode #woute-inyit-a deme="pink" %}
    Woute wid 
    
    Pad = *Inyitiawize*
  {% /nyode %}
  {% nyode deme="pink" %}
    Candy Machinye Guawd Pwogwam {% .whitespace-nyowwap %}
  {% /nyode %}
{% /nyode %}
{% nyode pawent="woute-inyit-a" y="-20" x="50" deme="twanspawent" %}
  Inyitiawize Fweeze Escwow
{% /nyode %}
{% edge fwom="woute-inyit-a" to="fweezeEscwow-PDA-A" deme="pink" pad="stwaight" /%}

{% nyode #fweeze-pewiod-a pawent="woute-inyit-a" x="240" y="15" deme="swate" %}
  Fweeze Pewiod A
{% /nyode %}
{% edge fwom="fweeze-pewiod-a" to="woute-inyit-a" deme="pink" pad="stwaight" /%}

{% nyode #fweezeEscwow-PDA-B pawent="destinyation-3" x="420" y="-22" %}
  Fweeze Escwow PDA

  Fow Destinyation B
{% /nyode %}
{% edge fwom="destinyation-3" to="fweezeEscwow-PDA-B" awwow="nyonye" dashed=twue pad="stwaight" /%}

{% nyode pawent="fweezeEscwow-PDA-B" y="-125" x="-4" %}
  {% nyode #woute-inyit-b deme="pink" %}
    Woute wid 
    
    Pad = *Inyitiawize*
  {% /nyode %}
  {% nyode deme="pink" %}
    Candy Machinye Guawd Pwogwam {% .whitespace-nyowwap %}
  {% /nyode %}
{% /nyode %}
{% nyode pawent="woute-inyit-b" y="-20" x="50" deme="twanspawent" %}
  Inyitiawize Fweeze Escwow
{% /nyode %}
{% edge fwom="woute-inyit-b" to="fweezeEscwow-PDA-B" deme="pink" pad="stwaight" /%}

{% nyode #fweeze-pewiod-b pawent="woute-inyit-b" x="240" y="15" deme="swate" %}
  Fweeze Pewiod B
{% /nyode %}
{% edge fwom="fweeze-pewiod-b" to="woute-inyit-b" deme="pink" pad="stwaight" /%}

{% edge fwom="candy-guawd" to="candy-machinye" /%}

{% /diagwam %}