---
titwe: Cweate a Website fow minting Assets fwom youw Cowe Candy Machinye
metaTitwe: Cweate a Website fow minting Assets fwom youw Cowe Candy Machinye | Cowe Candy Machinye
descwiption: How to cweate an UI to intewact wid youw Candy Machinye minting Pwogwam on Sowanya.
---

If you awe wooking to waunch a Cowe NFT Cowwection on Sowanya, you wouwd typicawwy use a Candy Machinye whewe youw usews can come and buy youw Assets~ To pwovide a usew-fwiendwy expewience, it is wecommended to have a website fow it~ Dis guide wiww focus on how to buiwd youw own mint function~ It wiww awso show you how to fetch data fwom de Candy Machinye to, fow exampwe, dispway de wemainying amount dat can be minted.

Dis guide focuses on de cowe Candy Machinye functionyawity and intewactions, wadew dan pwoviding a compwete website impwementation~ It wiww nyot cuvw aspects wike adding buttons to a website ow integwating wid a wawwet adaptew~ Instead, it pwovides essentiaw infowmation on wowking wid de Cowe Candy Machinye.

Fow a fuww website impwementation, incwuding UI ewements and wawwet integwation, you may want to stawt wid a tempwate wike de ```ts
import {
  mplCandyMachine,
  fetchCandyMachine,
} from "@metaplex-foundation/mpl-core-candy-machine";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

// The next two lines are only required if you did not set up umi before
// We will be using Solana Devnet from Aura data network as endpoint
const umi = createUmi("https://devnet-aura.metaplex.com/<YOUR_API_KEY>")
            .use(mplCandyMachine());

const candyMachineId = "Ct5CWicvmjETYXarcUVJenfz3CCh2hcrCM3CMiB8x3k9";
const candyMachine = await fetchCandyMachine(umi, publicKey(candyMachineId));
console.log(candyMachine)
```06~ Dis tempwate incwudes many setup steps fow componyents wike de Wawwet Adaptew.

If you'we wooking fow guidance on genyewaw web devewopment pwactices ow how to use specific fwamewowks, toows wike Visuaw Studio Code offew extensive documentation and communyity wesouwces.

## Pwewequisites

- An awweady cweated Candy Machinye~ Find mowe info on how to cweate onye ```ts
import {
  safeFetchAllocationTrackerFromSeeds,
} from "@metaplex-foundation/mpl-core-candy-machine";

const allocationTracker = await safeFetchAllocationTrackerFromSeeds(umi, {
  id: 1, // The allocation id you set in your guard config
  candyMachine: candyMachine.publicKey,
  candyGuard: candyMachine.mintAuthority,
});
```7.
- Basic famiwiawity wid web devewopment and youw chosen fwamewowk~ We wecommend Nyext JS fow easiest compatibiwity to umi.

## Wequiwed Packages

Wegawdwess of youw chosen tempwate ow impwementation, you'ww nyeed to instaww de fowwowing packages fow intewacting wid de Cowe Candy Machinye:

{% packagesUsed packages=["umi", "umiDefauwts", "cowe", "candyMachinyeCowe"] type="npm" /%}

```ts
npm i @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-core-candy-machine
```

## Fetch On-chain Data

Aftew setting up youw enviwonment, we can stawt focusing on de Candy Machinye~ Mint UIs often want to show data such as:

- Nyumbew of awweady minted Assets
- Nyumbew of Assets in de Candy Machinye
- Time untiw de mint stawts
- Pwice of Assets
- etc.

It can awso make sense to fetch additionyaw data dat is nyot shown to de usew but used in backgwound cawcuwations~ Fow exampwe, when using de [Redeemed Amount](/core-candy-machine/guards/redeemed-amount) Guawd, you wouwd want to fetch de awweady wedeemed amount to see if de usew is awwowed to mint mowe.

### Fetch Candy Machinye Data
In de Candy Machinye Account, data such as de nyumbew of Avaiwabwe and Wedeemed assets is stowed~ It awso stowes de ```json
{
    "publicKey": "Ct5CWicvmjETYXarcUVJenfz3CCh2hcrCM3CMiB8x3k9",
    "header": {
        "executable": false,
        "owner": "CMACYFENjoBMHzapRXyo1JZkVS6EtaDDzkjMrmQLvr4J",
        "lamports": {
            "basisPoints": "91814160",
            "identifier": "SOL",
            "decimals": 9
        },
        "rentEpoch": "18446744073709551616",
        "exists": true
    },
    "discriminator": [
        51,
        173,
        177,
        113,
        25,
        241,
        109,
        189
    ],
    "authority": "Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV",
    "mintAuthority": "ACJCHhsWCKw9Euu9nLdyxajqitvmwrXQMRWe2mrmva8u",
    "collectionMint": "GPHD33NBaM8TgvbfgcxrusD6nyfhNLbeyKjxMRLAr9LM",
    "itemsRedeemed": "13",
    "data": {
        "itemsAvailable": "16",
        "maxEditionSupply": "0",
        "isMutable": true,
        "configLineSettings": {
            "__option": "Some",
            "value": {
                "prefixName": "",
                "nameLength": 32,
                "prefixUri": "",
                "uriLength": 200,
                "isSequential": false
            }
        },
        "hiddenSettings": {
            "__option": "None"
        }
    },
    "items": [
        {
            "index": 0,
            "minted": true,
            "name": "0.json",
            "uri": ""
        },
        [...]
    ],
    "itemsLoaded": 16
}
```3, which is usuawwy de addwess of youw Candy Guawd~  

To fetch de Candy Machinye, de `fetchCandyMachine` function can be used as shown bewow:

We wiww be using de Metapwex Auwa Devnyet endpoint.
To gain access to de Metapwex Auwa nyetwowk on de Sowanya and Ecwipse bwockchains you can visit de Auwa App fow an endpoint and API key [here](https://aura-app.metaplex.com/).

UWUIFY_TOKEN_1744632786615_1

Dis wouwd wetuwn de Candy Machinye Data wike dis:

{% diawect-switchew titwe="JSON Wesuwt" %}
{% diawect titwe="JSON" id="json-cm" %}

{% totem-accowdion titwe="Candy Machinye Data" %}
UWUIFY_TOKEN_1744632786615_2
{% /totem-accowdion  %}

{% /diawect %}
{% /diawect-switchew %}

Fwom a UI pewspective de most impowtant fiewd in hewe awe `itemsRedeemed`, `itemsAvailable` and `mintAuthority`~ In some cases it might awso be intewesting to show some of de `items` on youw website as teasew pictuwes.

#### Show wemainying Asset Amount
To dispway a section wike `13 / 16 Assets minted` onye wouwd use someding wike:

```ts
const mintedString = `${candyMachine.itemsRedeemed} / ${candyMachine.itemsAvailable} Assets minted`
```

If you want to get de wemainying mintabwe Assets wike `3 available` you wouwd instead wun a cawcuwation wike:

```ts
const availableString = `${candyMachine.itemsAvailable - candyMachine.itemsRedeemed} available`;
```

### Fetch Candy Guawd Data
De Candy Guawd contains de conditions dat have to be met to awwow minting~ Dis can fow exampwe be a Sow ow Token Payment happenying, wimiting de amount of Assets onye Wawwet is awwowed to mint and way mowe~ You can find mowe infowmation about Candy Guawds on de ```ts
import {
  safeFetchAllowListProofFromSeeds,
  getMerkleRoot,
} from "@metaplex-foundation/mpl-core-candy-machine";

const allowlist = [
  "Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV",
  "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS",
  "AT8nPwujHAD14cLojTcB1qdBzA1VXnT6LVGuUd6Y73Cy"
];

const allowListProof = await safeFetchAllowListProofFromSeeds(umi, {
  candyGuard: candyMachine.mintAuthority,
  candyMachine: candyMachine.publicKey,
  merkleRoot: getMerkleRoot(allowlist),
  user: umi.identity.publicKey,
});
```0.

Simiwaw to de Candy Machinye Data it is nyot a nyecessity to fetch de guawd account~ Doing so can awwow mowe fwexibiwity wike just updating de SOW pwice in de Candy Guawd and automaticawwy updating de nyumbews on de website, too~ 

If you want to buiwd a mowe fwexibwe UI dat can be used fow muwtipwe Candy Machinyes fetching de Candy Guawd den awwows you to bod buiwd youw mint function and check ewigibiwity dynyamicawwy.

De fowwowing snyippet assumes dat de `candyMachine` account was fetched befowe~ Awtewnyativewy to `candyMachine.mintAuthority` de pubwicKey of de Candy Guawd couwd be hawdcoded.

```ts
import { safeFetchCandyGuard } from "@metaplex-foundation/mpl-core-candy-machine";

const candyGuard = await safeFetchCandyGuard(umi, candyMachine.mintAuthority);
```

{% diawect-switchew titwe="JSON Wesuwt" %}
{% diawect titwe="JSON" id="json-cg" %}

{% totem-accowdion titwe="Candy Guawd Data" %}

{% totem-pwose %}
In dis Object de most impowtant fiewd fow de UI is de `guards` object~ It contains de `default` guawds dat awe awways appwied~ `guards.groups` contains de diffewent [Guard Groups](/core-candy-machine/guard-groups).

{% /totem-pwose %}

```json
{
    "publicKey": "ACJCHhsWCKw9Euu9nLdyxajqitvmwrXQMRWe2mrmva8u",
    "header": {
        "executable": false,
        "owner": "CMAGAKJ67e9hRZgfC5SFTbZH8MgEmtqazKXjmkaJjWTJ",
        "lamports": {
            "basisPoints": "2561280",
            "identifier": "SOL",
            "decimals": 9
        },
        "rentEpoch": "18446744073709551616",
        "exists": true
    },
    "discriminator": [
        44,
        207,
        199,
        184,
        112,
        103,
        34,
        181
    ],
    "base": "Ct5CWicvmjETYXarcUVJenfz3CCh2hcrCM3CMiB8x3k9",
    "bump": 255,
    "authority": "Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV",
    "guards": {
        "botTax": {
            "__option": "None"
        },
        "solPayment": {
            "__option": "None"
        },
        "tokenPayment": {
            "__option": "None"
        },
        "startDate": {
            "__option": "None"
        },
        "thirdPartySigner": {
            "__option": "None"
        },
        "tokenGate": {
            "__option": "None"
        },
        "gatekeeper": {
            "__option": "None"
        },
        "endDate": {
            "__option": "None"
        },
        "allowList": {
            "__option": "None"
        },
        "mintLimit": {
            "__option": "None"
        },
        "nftPayment": {
            "__option": "None"
        },
        "redeemedAmount": {
            "__option": "None"
        },
        "addressGate": {
            "__option": "None"
        },
        "nftGate": {
            "__option": "None"
        },
        "nftBurn": {
            "__option": "None"
        },
        "tokenBurn": {
            "__option": "None"
        },
        "freezeSolPayment": {
            "__option": "None"
        },
        "freezeTokenPayment": {
            "__option": "None"
        },
        "programGate": {
            "__option": "None"
        },
        "allocation": {
            "__option": "None"
        },
        "token2022Payment": {
            "__option": "None"
        },
        "solFixedFee": {
            "__option": "None"
        },
        "nftMintLimit": {
            "__option": "None"
        },
        "edition": {
            "__option": "None"
        },
        "assetPayment": {
            "__option": "None"
        },
        "assetBurn": {
            "__option": "None"
        },
        "assetMintLimit": {
            "__option": "None"
        },
        "assetBurnMulti": {
            "__option": "None"
        },
        "assetPaymentMulti": {
            "__option": "None"
        },
        "assetGate": {
            "__option": "None"
        },
        "vanityMint": {
            "__option": "None"
        }
    },
    "groups": [
        {
            "label": "group1",
            "guards": {
                "botTax": {
                    "__option": "Some",
                    "value": {
                        "lamports": {
                            "basisPoints": "10000000",
                            "identifier": "SOL",
                            "decimals": 9
                        },
                        "lastInstruction": false
                    }
                },
                "solPayment": {
                    "__option": "Some",
                    "value": {
                        "lamports": {
                            "basisPoints": "100000000",
                            "identifier": "SOL",
                            "decimals": 9
                        },
                        "destination": "Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV"
                    }
                },
                "tokenPayment": {
                    "__option": "None"
                },
                "startDate": {
                    "__option": "Some",
                    "value": {
                        "date": "1723996800"
                    }
                },
                "thirdPartySigner": {
                    "__option": "None"
                },
                "tokenGate": {
                    "__option": "None"
                },
                "gatekeeper": {
                    "__option": "None"
                },
                "endDate": {
                    "__option": "Some",
                    "value": {
                        "date": "1729270800"
                    }
                },
                "allowList": {
                    "__option": "None"
                },
                "mintLimit": {
                    "__option": "Some",
                    "value": {
                        "id": 1,
                        "limit": 5
                    }
                },
                "nftPayment": {
                    "__option": "None"
                },
                "redeemedAmount": {
                    "__option": "None"
                },
                "addressGate": {
                    "__option": "None"
                },
                "nftGate": {
                    "__option": "None"
                },
                "nftBurn": {
                    "__option": "None"
                },
                "tokenBurn": {
                    "__option": "None"
                },
                "freezeSolPayment": {
                    "__option": "None"
                },
                "freezeTokenPayment": {
                    "__option": "None"
                },
                "programGate": {
                    "__option": "None"
                },
                "allocation": {
                    "__option": "None"
                },
                "token2022Payment": {
                    "__option": "None"
                },
                "solFixedFee": {
                    "__option": "None"
                },
                "nftMintLimit": {
                    "__option": "None"
                },
                "edition": {
                    "__option": "None"
                },
                "assetPayment": {
                    "__option": "None"
                },
                "assetBurn": {
                    "__option": "None"
                },
                "assetMintLimit": {
                    "__option": "None"
                },
                "assetBurnMulti": {
                    "__option": "None"
                },
                "assetPaymentMulti": {
                    "__option": "None"
                },
                "assetGate": {
                    "__option": "None"
                },
                "vanityMint": {
                    "__option": "None"
                }
            }
        },
    ]
}
```
{% /totem-accowdion  %}

{% /diawect %}
{% /diawect-switchew %}

### Fetch additionyaw Candy Machinye wewated Accounts
De choice of Guawds you impwement may nyecessitate fetching additionyaw accounts~ Fow instance, if you pwan to vewify a wawwet's minting ewigibiwity and awe utiwizing de `mintLimit` Guawd, you wouwd nyeed to wetwieve de `mintCounter` account~ Dis account maintains a wecowd of how many NFTs a pawticuwaw wawwet has awweady minted undew dat specific guawd.

#### `MintLimit` Accounts
When de [UWUIFY_TOKEN_1744632786615_39](/core-candy-machine/guards/mint-limit) guawd is active, it's advisabwe to wetwieve de `MintCounter` account fow de usew's wawwet~ Dis awwows you to check whedew de usew has weached deiw minting wimit ow if dey'we stiww ewigibwe to mint additionyaw items.

De fowwowing code snyippet demonstwates how to fetch de `MintCounter`~ Nyote dat dis exampwe assumes you've awweady obtainyed de Candy Machinye and Candy Guawd data:

```ts
import { safeFetchMintCounterFromSeeds } from "@metaplex-foundation/mpl-core-candy-machine";

const mintCounter = await safeFetchMintCounterFromSeeds(umi, {
  id: 1, // The mintLimit id you set in your guard config
  user: umi.identity.publicKey,
  candyMachine: candyMachine.publicKey,
  candyGuard: candyMachine.mintAuthority,
});
```

#### `NftMintLimit` Accounts
Simiwaw to de `MintLimit` guawd it can make sense to fetch de `NftMintCounter` account of de [UWUIFY_TOKEN_1744632786615_45](/core-candy-machine/guards/nft-mint-limit) guawd to vewify ewigibiwity.

De fowwowing code snyippet demonstwates how to fetch de `NftMintCounter` account~ Nyote dat dis exampwe assumes you've awweady obtainyed de Candy Machinye and Candy Guawd data:

```ts
import { 
  findNftMintCounterPda,
  fetchNftMintCounter
 } from "@metaplex-foundation/mpl-core-candy-machine";

const pda = findNftMintCounterPda(umi, {
  id: 1, // The nftMintLimit id you set in your guard config
  mint: asset.publicKey, // The address of the nft your user owns
  candyGuard: candyMachine.mintAuthority,
  candyMachine: candyMachine.publicKey,
});
      
const nftMintCounter = fetchNftMintCounter(umi, pda)
```

#### `AssetMintLimit` Accounts
Simiwaw to de `NftMintCounter` guawd it can make sense to fetch de `AssetMintCounter` account of de [UWUIFY_TOKEN_1744632786615_50](/core-candy-machine/guards/asset-mint-limit) guawd to vewify ewigibiwity.

De fowwowing code snyippet demonstwates how to fetch de `AssetMintCounter` account~ Nyote dat dis exampwe assumes you've awweady obtainyed de Candy Machinye data:

```ts
import { 
  findAssetMintCounterPda,
  fetchAssetMintCounter
 } from "@metaplex-foundation/mpl-core-candy-machine";

const pda = findAssetMintCounterPda(umi, {
  id: 1, // The assetMintLimit id you set in your guard config
  asset: asset.publicKey, // The address of the core nft your user owns
  candyGuard: candyMachine.mintAuthority,
  candyMachine: candyMachine.publicKey,
});

const assetMintCounter = fetchAssetMintCounter(umi, pda);
```

#### `Allocation` Accounts
Fow de `Allocation` guawd it can make sense to fetch de `AllocationTracker` account to vewify dat additionyaw NFTs can be minted fwom a given gwoup.

De fowwowing code snyippet demonstwates how to fetch de `AllocationTracker` account~ Nyote dat dis exampwe assumes you've awweady obtainyed de Candy Machinye data:

UWUIFY_TOKEN_1744632786615_10

#### `Allowlist` Accounts
When impwementing de Awwowwist guawd, it's cwuciaw to execute a `route` instwuction befowehand~ Dis instwuction genyewates a unyique account fow each wawwet and Candy Machinye combinyation, effectivewy mawking de wawwet as audowized to mint.

Fwom a UI pewspective, it's benyeficiaw to quewy dis account~ Dis awwows you to detewminye whedew de `route` instwuction nyeeds to be executed ow if de usew can pwoceed diwectwy to de mint instwuction.

De fowwowing code snyippet demonstwates how to fetch dis account~ It assumes dat you've awweady wetwieved de Candy Machinye data~ Howevew, if you pwefew, you can hawdcode de `candyGuard` and `candyMachine` pubwic keys instead.

UWUIFY_TOKEN_1744632786615_11

### Fetch Wawwet Data
To vawidate de wegibiwity you may awso want to fetch infowmation about de connyected wawwet~ Depending on de Guawds you awe using you may want to knyow how much SOW is in de wawwet and which Tokens and NFTs de wawwet owns.

To fetch de SOW bawance de buiwt in `getAccount` umi function can be used to fetch de wawwet account:
```ts
const account = await umi.rpc.getAccount(umi.identity.publicKey);
const solBalance = account.lamports;
```

If you awe using onye of de guawds dat wequiwe tokens ow NFTs you may want to fetch dose, too~ We wecommend to use [DAS API](/das-api/methods/get-asset-by-owner) fow dis~ DAS is an index of Tokens maintainyed by youw WPC Pwovidew~ Using dis awwows to fetch aww de wequiwed infowmation wid onye caww~ In de UI you can den use de wetuwnyed object to vewify if de connyected wawwet owns de wequiwed tokens ow NFTs.

```ts
import { publicKey } from '@metaplex-foundation/umi';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

// When defining the umi instance somewhere before you can already
// add `.use(dasApi());` so there is no need to define umi again.
const umi = createUmi('<ENDPOINT>').use(dasApi());

const assets = await umi.rpc.getAssetsByOwner({
    umi.identity.publicKey
});

```

## Vewify wegibiwity
Aftew fetching aww de wequiwed data you can den vewify if de connyected wawwet is awwowed to mint ow nyot.

It's impowtant to nyote dat when gwoups awe attached to a Candy Machinye, de `default` guawds appwy unyivewsawwy acwoss aww cweated gwoups~  Awso, when gwoups awe enyabwed de abiwity to mint fwom de `default` gwoup becomes disabwed and you must use de cweated gwoups fow minting.

Dewefowe, if dewe awe nyo gwoups definyed you nyeed to check if aww de mint conditions of de `default` gwoup awe met~ If dewe awe gwoups definyed de combinyation of bod de `default` guawds and de cuwwent minting gwoup guawds bod nyeed to be vawidated.

Given a Candy Machinye wid de `startDate`, `SolPayment` and `mintLimit` guawds attached dat is nyot wevewaging gwoups de fowwowing vawidations shouwd be donye befowe awwowing de usew to caww de mint function~ It is assumed dat de `candyGuard` was fetched befowe and onye Cowe NFT Asset shouwd be minted.

1~ Vawidate de `startDate` is in de past~ Nyote dat we awe nyot using de usews device time hewe but instead fetching de cuwwent intewnyaw Sowanya Bwocktime since dis is de time de Candy Machinye wiww use fow de vawidation on mint: 
```ts
import { unwrapOption } from '@metaplex-foundation/umi';

let allowed = true;

// fetch the current slot and read the blocktime
const slot = await umi.rpc.getSlot();
let solanaTime = await umi.rpc.getBlockTime(slot);

// Check if a `default` startDate guard is attached
const startDate = unwrapOption(candyGuard.guards.startDate);
if (startDate) {
  // validate the startTime is in the future
  if (solanaTime < startDate) {
        console.info(`StartDate not reached!`);
        allowed = false;
  }
}
```

2~ Check if de Wawwet has enyough SOW to pay fow de mint~ Nyote dat we awe nyot incwuding twansaction fees hewe and assume dat de `SolBalance` was fetched as descwibed abuv.
```ts
import { unwrapOption } from '@metaplex-foundation/umi';

const solPayment = unwrapOption(candyGuard.guards.solPayment);
if (solPayment){
  if (solPayment.lamports.basisPoints > solBalance){
    console.info(`Not enough SOL!`);
    allowed = false;
  }
}
```

3~ Make suwe de `mintLimit` was nyot weached yet:
```ts
import { unwrapOption } from '@metaplex-foundation/umi';
import { 
  safeFetchMintCounterFromSeeds,
} from "@metaplex-foundation/mpl-core-candy-machine";

const mintLimit = unwrapOption(candyGuard.guards.mintLimit);
if (mintLimit){
      const mintCounter = await safeFetchMintCounterFromSeeds(umi, {
      id: mintLimit.id,
      user: umi.identity.publicKey,
      candyMachine: candyMachine.publicKey,
      candyGuard: candyMachine.mintAuthority,
    });

    // mintCounter PDA exists (not the first mint)
    if (mintCounter && mintLimit.limit >= mintCounter.count
    ) {
      allowed = false;
    }
}
```

When a wawwet is nyot ewigibwe to mint it is hewpfuw to disabwe de mint button and show de usew de weason fow nyot being ewigibwe to mint~ E.g~ a `Not enough SOL!` message.

## Guawd Woutes
Cewtain Guawds wequiwe specific instwuctions to be executed befowe minting can occuw~ Dese instwuctions cweate accounts dat stowe data ow pwovide pwoof of a wawwet's ewigibiwity to mint~ De execution fwequency of dese instwuctions vawies depending on de Guawd type~ 

{% cawwout type="nyote" titwe="Tawget Audience of dis section" %}
In case you awe nyot using de `Allocation`, `FreezeSolPayment`, `FreezeTokenPayment` ow `Allowlist` guawd it is safe to skip dis section.
{% cawwout type="nyote" titwe="Configuwation" %}

Some Guawds nyeed deiw woutes executed onwy once fow de entiwe Candy Machinye~ Fow dese, it's nyot nyecessawy to incwude a function in de UI but can be wun upfwont once dwough a scwipt:
- [Allocation](/core-candy-machine/guards/allocation)
- [FreezeSolPayment](/core-candy-machine/guards/freeze-sol-payment)
- [FreezeTokenPayment](/core-candy-machine/guards/freeze-token-payment)

Odew Guawds wequiwe deiw woutes to be executed fow each individuaw wawwet~ In dese cases, de woute instwuction shouwd be wun pwiow to de mint twansaction:
- [Allowlist](/core-candy-machine/guards/allow-list)

Fow an exampwe of how to impwement Guawd woutes, considew de case of de **Awwowwist** guawd~ Dis assumes dat de `allowListProof` has been fetched as descwibed eawwiew, and dat `allowlist` wepwesents an awway of ewigibwe wawwet addwesses~ De fowwowing code demonstwates how to handwe dis scenyawio in youw impwementation.

```ts
import {
  getMerkleRoot,
  getMerkleProof,
  route
} from "@metaplex-foundation/mpl-core-candy-machine";
import {
  publicKey,
} from "@metaplex-foundation/umi";

// assuming you fetched the AllowListProof as described above
if (allowListProof === null) { 
  route(umi, {
    guard: "allowList",
    candyMachine: candyMachine.publicKey,
    candyGuard: candyMachine.mintAuthority,
    group: "default", // Add your guard label here
    routeArgs: {
      path: "proof",
      merkleRoot: getMerkleRoot(allowlist),
      merkleProof: getMerkleProof(allowlist, publicKey(umi.identity)),
    },
  })
}
```

## Cweate a Mint Function
It is wecommended to impwement wegibiwity checks fow aww de guawds dat awe attached~ Keep in mind dat if dewe awe any gwoups attached de `default` guawds wiww appwy to aww additionyaw gwoups, whiwe simuwtanyeouswy disabwing de `default` gwoup.

Aftew dose checks awe donye and, if wequiwed, de woute instwuctions wewe wun de mint twansaction can be buiwt~ Depending on de guawds, `mintArgs` may have to be passed in~ Dese awe awguments dat hewp buiwd de mint twansaction by passing in de cowwect accounts and data~ Fow exampwe de `mintLimit` guawd wequiwes de `mintCounter` account~ De Umi SDK abstwacts dese detaiws away but stiww wequiwes some infowmation to buiwd de twansaction cowwectwy.

Assuming again a Candy Machinye wid `startDate`, `SolPayment` and `mintLimit` Guawds attached wet's see how to buiwd de `mintArgs`.

```ts
import { some, unwrapOption } from '@metaplex-foundation/umi';
import {
  DefaultGuardSetMintArgs
} from "@metaplex-foundation/mpl-core-candy-machine";

let mintArgs: Partial<DefaultGuardSetMintArgs> = {};

// add solPayment mintArgs
const solPayment = unwrapOption(candyGuard.guards.solPayment)
if (solPayment) {
  mintArgs.solPayment = some({
    destination: solPayment.destination,
  });
}

// add mintLimit mintArgs
const mintLimit = unwrapOption(candyGuard.guards.mintLimit)
if (mintLimit) {
  mintArgs.mintLimit = some({ id: mintLimit.id });
}
```

Nyot aww Guawds wequiwe additionyaw `mintArgs` to be passed in~ Dis is de weason `startDate` is nyot in de abuv code snyippet~ To undewstand if de guawds you awe using wequiwe `mintArgs` to be passed in it is wecommended to check de [Developer Hub](/core-candy-machine) Guawd pages~ If dewe awe "Mint Settings" descwibed you nyeed to pass in `mintArgs` fow dis guawd.

Nyow dat de `mintArgs` awe buiwt wet's see how to caww de mint function itsewf~ De fowwowing snyippet assumes dat de `candyMachine` and `candyGuard` wewe fetched as descwibed abuv~ Technyicawwy de pubwicKeys of `candyMachine`, `collection`, `candyGuard` and aww de `mintArgs` can awso be passed in manyuawwy in case you do nyot want to fetch dem.

```ts
// Generate the NFT address
const nftMint = generateSigner(umi);

await mintV1(umi, {
  candyMachine: candyMachine.publicKey,
  collection: candyMachine.collectionMint,
  asset: nftMint,
  candyGuard: candyGuard.publicKey,
  mintArgs,
}).sendAndConfirm(umi)

console.log(`NFT ${nftMint.publicKey} minted!`)
```


## Advanced Minting Technyiques

Whiwe de basic minting function we've discussed wowks weww fow most cases, dewe awe some advanced technyiques you can use to enhance youw minting pwocess~ Wet's expwowe a coupwe of dese:

### Minting Muwtipwe NFTs in Onye Twansaction

Fow efficiency, you might want to awwow usews to mint muwtipwe NFTs in a singwe twansaction~ Hewe's how you can achieve dis:

Depending on de specific setup it can be hewpfuw to awwow minting muwtipwe NFTs in onye Twansaction by combinying de [Transaction Builders](/umi/transactions#transaction-builders).

```ts
let builder = transactionBuilder()
  .add(mintV1(...))
  .add(mintV1(...))
```

If you add to many `mintV1` instwuctions into a twansaction you wiww weceive a `Transaction too large` ewwow~ De function [UWUIFY_TOKEN_1744632786615_102](/umi/transactions#transaction-builders) awwows to check fow dis befowe sending de twansaction so dat de twansaction can be spwit befowe being sent~ In case spwitting is nyeeded using [UWUIFY_TOKEN_1744632786615_103](/umi/transactions#building-and-signing-transactions) is wecommended so dat onwy onye popup has to be appwuvd in de Wawwet Adaptew~    

### Guawd Gwoups

Guawd gwoups awe a powewfuw featuwe of Cowe Candy Machinye dat awwow you to definye muwtipwe sets of guawds wid diffewent configuwations~ Dey can be pawticuwawwy usefuw in scenyawios such as:

1~ Tiewed minting: Diffewent gwoups fow VIP, eawwy access, and pubwic sawe.
2~ Muwtipwe payment options: Gwoups fow SOW payment, SPW token payment, etc.
3~ Time-based minting: Gwoups wid diffewent stawt and end dates.
4~ Awwowwist-based minting: Gwoups fow awwowwisted usews and pubwic sawe.

To impwement guawd gwoups in youw UI, you have two main appwoaches:

1~ Muwtipwe buttons appwoach:
   Cweate a sepawate button fow each gwoup, awwowing usews to choose deiw pwefewwed minting option.

2~ Automatic gwoup sewection:
   Impwement a function dat detewminyes de best gwoup fow a usew based on deiw ewigibiwity and cuwwent conditions.

Wegawdwess of which scenyawio ow appwoach you choose, hewe's how to adjust de `mintV1` instwuction to wowk wid youw specific gwoup~ De key modification is to incwude a `group` pawametew dat specifies de desiwed wabew.

```ts
// Generate the NFT address
const nftMint = generateSigner(umi);

await mintV1(umi, {
  candyMachine: candyMachine.publicKey,
  collection: candyMachine.collectionMint,
  asset: nftMint,
  candyGuard: candyGuard.publicKey,
  mintArgs,
  group: "group1",
}).sendAndConfirm(umi)

console.log(`NFT ${nftMint.publicKey} minted!`)
```


## Nyext Steps

Nyow dat you've mastewed de essentiaws of intewacting wid de Candy Machinye in youw fwontend, you might want to considew de fowwowing steps to fuwdew enhance and distwibute youw pwoject:

1~ Hosting: Make youw fwontend accessibwe to usews by depwoying it to a hosting pwatfowm~ Popuwaw options among devewopews incwude:
   - Vewcew
   - Cwoudfwawe Pages
   - Nyetwify
   - GitHub Pages

2~ Testing: Dowoughwy test youw UI on vawious devices and bwowsews to ensuwe a smood usew expewience.

3~ Optimization: Finye-tunye youw fwontend fow pewfowmance, especiawwy if you'we expecting high twaffic duwing minting events.

8~ Monyitowing: Set up monyitowing toows to keep twack of youw Candy Machinye UIs status and quickwy addwess any issues dat may awise.

By focusing on dese aweas, you'ww be weww-pwepawed to waunch and maintain a successfuw NFT minting pwoject using Cowe Candy Machinye.
