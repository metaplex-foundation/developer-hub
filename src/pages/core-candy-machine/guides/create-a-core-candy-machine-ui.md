---
title: Create a Website for minting Assets from your Core Candy Machine
metaTitle: Create a Website for minting Assets from your Core Candy Machine | Core Candy Machine
description: How to create an NFT collection on the Solana blockchain using Candy Machine.
---

If you are looking to launch a Core NFT Collection on Solana you would usually use a Candy Machine where your users can come and buy your Assets. To have a user friendly experience it is recommended to have a Website for it. This Guide will focus on how to build your very own mint function. It will also show you how to fetch data from the Candy Machine to for example show the remaining amount that can be minted.

The result of this Guide will not be a finalized website, but provides all the Metaplex related information you need to build your own. 

## Prerequisite

- A already created Candy Machine. Find more info on how to create one [here](https://developers.metaplex.com/core-candy-machine/create).
- A Website template. For example the [`metaplex-nextjs-tailwind-template`](https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-template). Using a Template like this allows you to skip many setup steps e.g. for the Wallet Adapter.
- Code Editor of your choice (recommended **Visual Studio Code**)

## First Steps
Download the template and install the required packages, e.g. using `npm install`

### Required Packages
Install the required packages for this guide (if they are not installed in your template already).

{% packagesUsed packages=["umi", "umiDefaults", "core", "candyMachineCore"] type="npm" /%}

```js
npm i @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-core @metaplex-foundation/mpl-core-candy-machine
```

## Fetch onchain Data

After setting up your environment we can start focusing on the Candy Machine. Mint UIs often want to show data like

- Amount of already minted Assets
- Amount of Assets in the Candy Machine
- Time until the mint starts
- Price of Assets
- etc.

It can also make sense to fetch additional Data that is not shown to the User but used in background calculations. E.g. when using the [Redeemed Amount](core-candy-machine/guards/redeemed-amount) Guard you would want to fetch the already redeemed Amount to see if the user is allowed to mint more.

### Fetch Candy Machine Data
In the Candy Machine Account Data like the Amount of Available and Redeemed assets is stored. It also stores the `mintAuthority` which usually is the address of your Candy Guard.  

To fetch the Candy Machine the `fetchCandyMachine` function can be used as shown below:

```js
import {
  mplCandyMachine,
  fetchCandyMachine,
} from "@metaplex-foundation/mpl-core-candy-machine";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

// The next two lines are only required if you did not set up umi before
const umi = createUmi("https://api.devnet.solana.com")
            .use(mplCandyMachine());

const candyMachineId = "Ct5CWicvmjETYXarcUVJenfz3CCh2hcrCM3CMiB8x3k9";
const candyMachine = await fetchCandyMachine(umi, publicKey(candyMachineId));
console.log(candyMachine)
```

This would return the Candy Machine Data like this:

{% dialect-switcher title="JSON Result" %}
{% dialect title="JSON" id="json-cm" %}

{% totem-accordion title="Candy Machine Data" %}
```json
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
```
{% /totem-accordion  %}

{% /dialect %}
{% /dialect-switcher %}

From a UI perspective the most important field in here are `itemsRedeemed`, `itemsAvailable` and `mintAuthority`. In some cases it might also be interesting to show some of the `items` on your website as teaser pictures.

#### Show remaining Asset Amount
To show a Section like `13 / 16 Assets minted` one would use something like:

```js
const mintedString = `${candyMachine.itemsRedeemed} / ${candyMachine.itemsAvailable} Assets minted`
```

If you want to get the remaining mintable Assets like `3 available` you would instead run a calculation like:

```js
const availableString = `${candyMachine.itemsAvailable - candyMachine.itemsRedeemed} available`;
```

### Fetch Candy Guard Data
The Candy Guard contains the conditions that have to be met to allow minting. This can for example be a Sol or Token Payment happening, limiting the Amount of Assets one Wallet is allowed to mint and way more. You can find more information about Candy Guards on the [Candy Guard Page](/core-candy-machine/guards).

Similar to the Candy Machine Data it is not a necessity to fetch the guard account. Doing so can allow more flexibility like just updating the SOL price in the Candy Guard and automatically updating the numbers on the website, too. 

If you want to build a more flexible UI that can be used for multiple Candy Machines fetching the Candy Guard then allows you to both building your mint function and checking eligibility dynamically.

The following snippet assumes that the `candyMachine` account was fetched before. Alternatively to `candyMachine.mintAuthority` the publicKey of the Candy Guard could be hardcoded.

```js
import { safeFetchCandyGuard } from "@metaplex-foundation/mpl-core-candy-machine";

const candyGuard = await safeFetchCandyGuard(umi, candyMachine.mintAuthority);
```

{% dialect-switcher title="JSON Result" %}
{% dialect title="JSON" id="json-cg" %}

{% totem-accordion title="Candy Guard Data" %}

{% totem-prose %}
In this Object the most important field for the UI is the `guards` object. It contains the `default` guards that are always applied. `guards.groups` contains the different [Guard Groups](/core-candy-machine/guard-groups).

{% /totem-prose %}

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
{% /totem-accordion  %}

{% /dialect %}
{% /dialect-switcher %}

### Fetch additional Candy Machine related Accounts
The choice of Guards you implement may necessitate fetching additional accounts. For instance, if you plan to verify a wallet's minting eligibility and are utilizing the `mintLimit` Guard, you would need to retrieve the `mintCounter` account. This account maintains a record of how many NFTs a particular wallet has already minted under that specific guard.

#### `MintLimit` Accounts
When the [`MintLimit`](/core-candy-machine/guards/mint-limit) guard is active, it's advisable to retrieve the `MintCounter` for the user's wallet. This allows you to check whether the user has reached their minting limit or if they're still eligible to mint more.

The following code snippet demonstrates how to fetch the `MintCounter`. Note that this example assumes you've already obtained the Candy Machine and Candy Guard data:

```js
import { safeFetchMintCounterFromSeeds } from "@metaplex-foundation/mpl-core-candy-machine";

const mintCounter = await safeFetchMintCounterFromSeeds(umi, {
  id: 1, // The mintLimit id you set in your guard config
  user: umi.identity.publicKey,
  candyMachine: candyMachine.publicKey,
  candyGuard: candyMachine.mintAuthority,
});
```

#### `NftMintLimit` Accounts
Similar to the `MintLimit` guard it can make sense to fetch the `NftMintCounter` of the [`NftMintLimit`](/core-candy-machine/guards/nft-mint-limit) guard to be able to verify eligibility.

The following code snippet demonstrates how to fetch the `NftMintCounter`. Note that this example assumes you've already obtained the Candy Machine and Candy Guard data:

```js
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
Similar to the `NftMintCounter` guard it can make sense to fetch the `AssetMintCounter` of the [`AssetMintLimit`](/core-candy-machine/guards/asset-mint-limit) guard to be able to verify eligibility.

The following code snippet demonstrates how to fetch the `AssetMintCounter`. Note that this example assumes you've already obtained the Candy Machine data:

```js
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
For the `Allocation` guard it can make sense to fetch the `AllocationTracker` to verify that more NFTs can be minted from a given group.

The following code snippet demonstrates how to fetch the `AllocationTracker`. Note that this example assumes you've already obtained the Candy Machine data:

```js
import {
  safeFetchAllocationTrackerFromSeeds,
} from "@metaplex-foundation/mpl-core-candy-machine";

const allocationTracker = await safeFetchAllocationTrackerFromSeeds(umi, {
  id: 1, // The allocation id you set in your guard config
  candyMachine: candyMachine.publicKey,
  candyGuard: candyMachine.mintAuthority,
});
```

#### `Allowlist` Accounts
When implementing the Allowlist guard, it's crucial to execute a `route` instruction beforehand. This instruction generates a unique account for each wallet and Candy Machine combination, effectively marking the wallet as authorized to mint.

From a UI perspective, it's beneficial to query this account. This allows you to determine whether the `route` instruction needs to be executed or if the user can proceed directly to the mint instruction.

The following code snippet demonstrates how to fetch this account. It assumes that you've already retrieved the Candy Machine data. However, if you prefer, you can hardcode the `candyGuard` and `candyMachine` public keys instead.

```js
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
```

### Fetch Wallet Data
To validate the legility you may also want to fetch information about the connected wallet. Depending on the Guards you are using you may want to know how much SOL is in the wallet and which Tokens and NFTs they own.

To fetch the SOL balance the built in `getAccount` umi function can be used to fetch the wallet account:
```js
const account = await umi.rpc.getAccount(umi.identity.publicKey);
const solBalance = account.lamports;
```

If you are using one of the guards that require tokens or NFTs you may want to fetch those, too. We recommend to use [DAS API](/das-api/methods/get-asset-by-owner) for this. DAS is an index of Tokens mainained by your RPC Provider. Using this allows to fetch all the required information with one call. In the UI you can then use the returned object to verify if the connected wallet owns the requried tokens or NFTs.

```js
import { publicKey } from '@metaplex-foundation/umi';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

// When defining the umi instance somewhere before you can already
// add `.use(dasApi());` so there is no need to define umi again.
const umi = createUmi('<ENDPOINT>').use(dasApi());

const assets = await umi.rpc.getAssetsByOwner({
    umi.identity.publicKey
});

```

## Verify legibility
After fetching all this data it can be used to check if a connected wallet is allowed to mint.

It's important to note that when groups are attached to a Candy Machine, the `default` guards apply universally across all groups. However, in this scenario, you must utilize the specific groups for minting, as minting directly from the `default` group is no longer an option.

Therefore, if there are no groups defined you need to check if all the mint conditions of the `default` group are met. If there are groups defined the combination of `default` guards and each group need to be validated.

Given a Candy Machine with the `startDate`, `SolPayment` and `mintLimit` guards attached that is not leveraging groups the following validations should be done before allowing the user to call the mint function. It is assumed that the `candyGuard` was fetched before and one Core NFT Asset should be minted.

1. Validate the `startDate` is in the past. Note that we are not using the users devices time here but instead fetch the current internal Solana Blocktime since this is the time the Candy Machine will use for the validation on mint: 
```js
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

2. Check if the Wallet has enough SOL to pay for the mint. Note that we are not including transaction fees here and assume that the `SolBalance` was fetched as described above.
```js
import { unwrapOption } from '@metaplex-foundation/umi';

const solPayment = unwrapOption(candyGuard.guards.solPayment);
if (solPayment){
  if (solPayment.lamports.basisPoints > solBalance){
    console.info(`Not enough SOL!`);
    allowed = false;
  }
}
```

3. Make sure the `mintLimit` was not reached yet:
```js
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

When the wallet is not eligible to mint it is helpful to disable the mint button and show the User the reason for it. E.g. a `Not enough SOL!` message.

## Guard Routes
Certain Guards require specific instructions to be executed before minting can occur. These instructions create accounts that store data or provide proof of a wallet's eligibility to mint. The execution frequency of these instructions varies depending on the Guard type. 

{% callout type="note" title="Target Audience of this section" %}
In case you are not using the `Allocation`, `FreezeSolPayment`, `FreezeTokenPayment` or `Allowlist` guard it is safe to skip this section.
{% callout type="note" title="Configuration" %}

Some Guards need their routes executed only once for the entire Candy Machine. For these, it's not necessary to include a function in the UI but can be run upfront once through a script:
- [Allocation](/core-candy-machine/guards/allocation)
- [FreezeSolPayment](/core-candy-machine/guards/freeze-sol-payment)
- [FreezeTokenPayment](/core-candy-machine/guards/freeze-token-payment)

Other Guards require their routes to be executed for each individual wallet. In these cases, the route instruction should be run prior to the mint transaction:
- [Allowlist](/core-candy-machine/guards/allow-list)

For an example of how to implement Guard routes, consider the case of the Allowlist guard. This assumes that the allowListProof has been fetched as described earlier, and that `allowlist` represents an array of eligible wallet addresses. The following code demonstrates how to handle this scenario in your implementation.

```js
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

## Create a Mint Function
Keep in mind that if there are any groups attached the `default` ones apply to all groups, but you also have to use the groups and can not mint from the `default` group anymore.

### Single Mint

### Mint multiple Core NFT Assets in one Transaction


### Guard Groups
- how to decide which group to use (buttons, automatic)
- how to pass in a label to the mint function

## Next Steps

Now that you learned the important information to interact with the Candy Machine in your Frontend you might want to host it so that it is available to your users. Often used by other Projects are e.g. Vercel and Cloudflare for this.
