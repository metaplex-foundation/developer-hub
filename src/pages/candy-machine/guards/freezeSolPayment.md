---
title: 'Freeze Sol Payment'
metaTitle: 'Candy Machine Guards - Freeze Sol Payment'
description: 'Set the price of the mint in SOL with a freeze period.'
---

## Overview

The **Freeze Sol Payment** guard allows minting frozen NFTs by charging the payer an amount in SOL. Frozen NFTs cannot be transferred or listed on any marketplaces until thawed.

Frozen NFTs can be thawed by anyone as long as one of the following conditions is met:

- The Candy Machine has minted out.
- The Candy Machine was deleted.
- The configured Freeze Period — which can be a maximum of 30 days — has passed.

The funds are transferred to a "Freeze Escrow" account which must be initialized by the Candy Guard authority before minting can start. Once all Frozen NFTs have been thawed, the funds can be unlocked and transferred to the configured destination account by the Candy Guard authority.

You may initialize the Freeze Escrow account, thaw NFTs and unlock funds [via the route instruction](#route-instruction) of this guard.

{% diagram  %}

{% node #initialize label="Initialize Freeze Escrow" theme="indigo" /%}
{% node parent="initialize"  theme="transparent" x="-8" y="-1" %}
①
{% /node %}
{% edge from="initialize" to="freezeEscrow-pda" path="straight" /%}
{% node #freezeEscrow-pda label="Freeze Escrow PDA" theme="slate" parent="initialize" x="15" y="70" /%}

{% node #mintFrozen label="Mint Frozen NFTs" theme="indigo" parent="initialize" x="250" /%}
{% node parent="mintFrozen"  theme="transparent" x="-8" y="-1" %}
②
{% /node %}
{% edge from="mintFrozen" to="frozen-NFT-bg2" path="straight" /%}
{% edge from="mintFrozen" to="freezeEscrow-pda" /%}
{% node #frozen-NFT-bg2 label="Frozen NFT" theme="slate" parent="frozen-NFT" x="-10" y="-10" /%}
{% node #frozen-NFT-bg1 label="Frozen NFT" theme="slate" parent="frozen-NFT" x="-5" y="-5" /%}
{% node #frozen-NFT label="Frozen NFT" theme="slate" parent="mintFrozen" x="33" y="120" /%}

{% node #clock label="🕑" theme="transparent" parent="mintFrozen" x="165" y="-30" /%}
{% edge from="clock" to="clockDesc" arrow="none" theme="dimmed" path="straight" /%}
{% node #clockDesc  theme="transparent" parent="clock" y="220" x="-91" %}
_When all NFTs have been minted_

_OR at the end of the freeze period._
{% /node %}

{% edge from="frozen-NFT" to="thawed-NFT-bg2" path="straight" /%}

{% node #thaw label="Thaw NFTs" theme="indigo" parent="mintFrozen" x="200" /%}
{% node parent="thaw"  theme="transparent" x="-8" y="-1" %}
③
{% /node %}
{% edge from="thaw" to="thawed-NFT-bg2" path="straight" /%}
{% node #thawed-NFT-bg2 label="Thawed NFT" theme="slate" parent="thawed-NFT" x="-10" y="-10" /%}
{% node #thawed-NFT-bg1 label="Thawed NFT" theme="slate" parent="thawed-NFT" x="-5" y="-5" /%}
{% node #thawed-NFT label="Thawed NFT" theme="slate" parent="thaw" y="130" x="3" /%}


{% node #clock2 label="🕑" theme="transparent" parent="thaw" x="130" y="-30" /%}
{% edge from="clock2" to="clockDesc2" arrow="none" theme="dimmed" path="straight" /%}
{% node #clockDesc2  theme="transparent" parent="clock2" y="260" x="-91" %}
_When all NFTs have been thawed._
{% /node %}

{% node #unlock label="Unlock Funds" theme="indigo" parent="thaw" x="180" /%}
{% node parent="unlock"  theme="transparent" x="-8" y="-1"%}
④
{% /node %}
{% node #freezeEscrow-pda2 label="Freeze Escrow PDA" theme="slate" parent="unlock" x="-20" y="70" /%}
{% edge from="freezeEscrow-pda2" to="treasury" theme="dimmed" path="straight" /%}
{% node #treasury label="Treasury" theme="slate" parent="freezeEscrow-pda2" y="70" x="40" /%}

{% /diagram %}
## Guard Settings

The Freeze Sol Payment guard contains the following settings:

- **Lamports**: The amount in SOL (or lamports) to charge the payer.
- **Destination**: The address of the wallet that should eventually receive all payments related to this guard.

{% dialect-switcher title="Set up a Candy Machine using the Address Gate guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

Here’s how we can create a Candy Machine using the Freeze Sol Payment guard. Note that, in this example, we’re using Umi's identity as the destination wallet.

```tsx
create(umi, {
  // ...
  guards: {
    freezeSolPayment: some({
      lamports: sol(1.5),
      destination: umi.identity.publicKey,
    }),
  },
})
```

API References: [create](https://mpl-candy-machine-js-docs.vercel.app/functions/create.html), [FreezeSolPayment](https://mpl-candy-machine-js-docs.vercel.app/types/FreezeSolPayment.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}
Add this object into the guard section your config.json file:

```json
"freezeSolPayment" : {
    "value": SOL value,
    "destination": "<PUBKEY>"
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Mint Settings

The Freeze Sol Payment guard contains the following Mint Settings:

- **Destination**: The address of the wallet that should eventually receive all payments related to this guard.
- **NFT Rule Set** (optional): The Rule Set of the minted NFT, if we are minting a Programmable NFT with a Rule Set.

Note that, if you’re planning on constructing instructions without the help of our SDKs, you will need to provide these Mint Settings and more as a combination of instruction arguments and remaining accounts. See the [Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#freezesolpayment) for more details.

{% dialect-switcher title="Set up a Candy Machine using the Address Gate guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

You may pass the Mint Settings of the Freeze Sol Payment guard using the `mintArgs` argument like so.

```ts
mintV2(umi, {
  // ...
  mintArgs: {
    freezeSolPayment: some({ destination: umi.identity.publicKey }),
  },
})
```

API References: [mintV2](https://mpl-candy-machine-js-docs.vercel.app/functions/mintV2.html), [FreezeSolPaymentMintArgs](https://mpl-candy-machine-js-docs.vercel.app/types/FreezeSolPaymentMintArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_As soon as a guard is assigned you cannot use sugar to mint - therefore there are no specific mint settings._

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route Instruction

The Freeze Sol Payment route instruction supports the following features.

- [Initialize the Freeze Escrow](#initialize-the-freeze-escrow)
- [Thaw a Frozen NFT](#thaw-a-frozen-nft)
- [Unlock Funds](#unlock-funds)

### Initialize the Freeze Escrow

_Path: `initialize`_

When using the Freeze Sol Payment guard, we must initialize the Freeze Escrow account before minting can start. This will create a PDA account derived from the Destination attribute of the guard's settings.

The Freeze Escrow PDA account will keep track of several parameters such as:

- How many Frozen NFTs were minted through this guard.
- When was the first Frozen NFT minted via this guard as the Freeze Period starts counting after that.

When initializing this Freeze Escrow account, we must provide the following arguments to the route instruction of the guard:

- **Path** = `initialize`: Selects the path to execute in the route instruction.
- **Destination**: The address of the wallet that should eventually receive all payments related to this guard.
- **Period**: The amount of time in seconds that the Freeze Period should last. This can be a maximum of 30 days (2,592,000 seconds) and it will start from the very first Frozen NFT minted via this guard. The Freeze Period provides a safety mechanism to ensure Frozen NFTs can eventually be thawed even if the Candy Machine never mints out.
- **Candy Guard Authority**: The authority of the Candy Guard account as a Signer.

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node label="Owner: Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node #candy-guard-guards label="Guards" theme="green"/%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-guard" y="49" x="230" %}
{% node #guards label="Guards" theme="green" /%}
{% node #freezeSolPayment label="Freeze Sol Payment" theme="green" /%}
{% node #amount label="Amount" theme="green" /%}
{% node #destination label="Destination" theme="green" /%}
{% node label="..." theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine" x="431" %}
  {% node #candy-guard-route theme="pink" %}
    Route from the

    _Candy Guard Program_

    with Path = *Initialize*
  {% /node %}
{% /node %}
{% node parent="candy-guard-route" y="-20" x="45" theme="transparent" %}
  Initialize Freeze Escrow
{% /node %}

{% node #freeze-period parent="candy-guard-route" x="220" y="27" label="Freeze Period" /%}
{% edge from="freeze-period" to="candy-guard-route" theme="pink" path="straight" /%}

{% edge from="candy-machine" to="candy-guard-route" theme="pink" /%}
{% edge from="candy-guard" to="candy-guard-route" theme="pink" toPosition="left" /%}
{% edge from="amount" to="candy-guard-route" theme="pink" toPosition="left" /%}


{% edge from="candy-guard-route" to="freezeEscrow-PDA" theme="pink" path="straight" /%}

{% node #freezeEscrow-PDA parent="destination" x="188" y="-9" theme="slate" %}
  Freeze Escrow PDA
{% /node %}

{% edge from="candy-guard" to="candy-machine" /%}

{% edge from="destination" to="freezeEscrow-PDA" arrow="none" dashed=true /%}

{% edge from="candy-guard-guards" to="guards" /%}
{% edge from="candy-guard-route" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

Last but not least, the Freeze Escrow PDA account will receive the funds of all Frozen NFTs minted through this guard.

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node label="Owner: Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node #candy-guard-guards label="Guards" theme="green"/%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-guard" y="49" x="250" %}
{% node #guards label="Guards" theme="green" /%}
{% node #freezeSolPayment label="Freeze Sol Payment" theme="green" /%}
{% node #amount label="Amount" theme="green" /%}
{% node #destination label="Destination" theme="green" /%}
{% node label="..." theme="dimmed" /%}
{% /node %}

{% node #freezeEscrow-PDA parent="destination" x="170" y="-8" theme="slate" %}
  Freeze Escrow PDA
{% /node %}
{% edge from="destination" to="freezeEscrow-PDA" arrow="none" dashed=true path="straight" /%}

{% node parent="candy-machine" x="700" %}
  {% node #mint-candy-guard theme="pink" %}
    Route from the

    _Candy Guard Program_

    with Path = *Initialize*
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}
{% edge from="mint-candy-guard" to="freezeEscrow-PDA" theme="pink" /%}

{% node parent="mint-candy-guard" y="150" x="-8" %}
  {% node #mint-candy-machine theme="pink" %}
    Mint from 
    
    _Candy Machine Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="110" theme="transparent" %}
  Mint Logic
{% /node %}


{% edge from="mint-candy-machine" to="frozen-NFT" path="straight" /%}
{% node #frozen-NFT parent="mint-candy-machine" y="120" x="48" theme="slate" %}
  Frozen NFT
{% /node %}

{% edge from="candy-guard" to="candy-machine" /%}
{% edge from="candy-machine" to="mint-candy-guard" theme="pink" toPosition="top" type="bezier" /%}
{% edge from="candy-guard" to="mint-candy-guard" theme="pink" toPosition="top" type="bezier" /%}

{% edge from="candy-guard-guards" to="guards" /%}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

‎

{% dialect-switcher title="Set up a Candy Machine using the Address Gate guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

In the example below, we initialize the Freeze Escrow account with a maximum Freeze Period of 15 days and we use the current identity as the Candy Guard authority.

```ts
route(umi, {
  // ...
  guard: 'freezeSolPayment',
  routeArgs: {
    path: 'initialize',
    destination: umi.identity.publicKey,
    period: 15 * 24 * 60 * 60, // 15 days.
    candyGuardAuthority: umi.identity,
  },
})
```

API References: [route](https://mpl-candy-machine-js-docs.vercel.app/functions/route.html), [FreezeSolPaymentRouteArgsInitialize](https://mpl-candy-machine-js-docs.vercel.app/types/FreezeSolPaymentRouteArgsInitialize.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

Run the following command to initialize the Freeze Escrow account

```sh
sugar freeze initialize
```

You can use the following parameters 

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

When using a candy machine with guard groups you will have to use the `--label` parameter.
{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### Thaw a Frozen NFT

_Path: `thaw`_

Frozen NFTs can be thawed by anyone as long as one of the following conditions is met:

- The Candy Machine has minted out.
- The Candy Machine was deleted.
- The configured Freeze Period — which can be a maximum of 30 days — has passed.

Note that since the funds in the Freeze Escrow are not transferrable until all NFTs are thawed, this creates an incentive for the treasury to thaw all NFTs as soon as possible.

To thaw a Frozen NFT, we must provide the following arguments to the route instruction of the guard:

- **Path** = `thaw`: Selects the path to execute in the route instruction.
- **Destination**: The address of the wallet that should eventually receive all payments related to this guard.
- **NFT Mint**: The mint address of the Frozen NFT to thaw.
- **NFT Owner**: The address of the owner of the Frozen NFT to thaw.
- **NFT Token Standard**: The token standard of the Frozen NFT to thaw.
- **NFT Rule Set** (optional): The Rule Set of the Frozen NFT to thaw, if we are thawing a Programmable NFT with a Rule Set.

![CandyMachinesV3-GuardsFreezeSolPayment3.png](/assets/candy-machine-v3/CandyMachinesV3-GuardsFreezeSolPayment3.png#radius)

{% dialect-switcher title="Set up a Candy Machine using the Address Gate guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

In the example below, we thaw a Frozen NFT that belongs to the current identity.

```ts
route(umi, {
  // ...
  guard: 'freezeSolPayment',
  routeArgs: {
    path: 'thaw',
    destination,
    nftMint: nftMint.publicKey,
    nftOwner: umi.identity.publicKey,
    nftTokenStandard: candyMachine.tokenStandard,
  },
})
```

API References: [route](https://mpl-candy-machine-js-docs.vercel.app/functions/route.html), [FreezeSolPaymentRouteArgsThaw](https://mpl-candy-machine-js-docs.vercel.app/types/FreezeSolPaymentRouteArgsThaw.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

Run the following command to thaw the NFT(s):

```sh
sugar freeze thaw 
```

You can use the following parameters 

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

When using a candy machine with guard groups you will have to use the `--label` parameter.
{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### Unlock Funds

_Path: `unlockFunds`_

Once all Frozen NFTs have been thawed, the treasury can unlock the funds from the Freeze Escrow account. This will transfer the funds to the configured Destination address.

To unlock the funds, we must provide the following arguments to the route instruction of the guard:

- **Path** = `unlockFunds`: Selects the path to execute in the route instruction.
- **Destination**: The address of the wallet that should eventually receive all payments related to this guard.
- **Candy Guard Authority**: The authority of the Candy Guard account as a Signer.

![CandyMachinesV3-GuardsFreezeSolPayment4.png](/assets/candy-machine-v3/CandyMachinesV3-GuardsFreezeSolPayment4.png#radius)

{% dialect-switcher title="Set up a Candy Machine using the Address Gate guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

In the example below, we unlock the funds from the Freeze Escrow account using the current identity as the Candy Guard authority.

```ts
route(umi, {
  // ...
  guard: 'freezeSolPayment',
  routeArgs: {
    path: 'unlockFunds',
    destination,
    candyGuardAuthority: umi.identity,
  },
})
```

API References: [route](https://mpl-candy-machine-js-docs.vercel.app/functions/route.html), [FreezeSolPaymentRouteArgsUnlockFunds](https://mpl-candy-machine-js-docs.vercel.app/types/FreezeSolPaymentRouteArgsUnlockFunds.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

Run the following command to unlock the funds from the Freeze Escrow Account

```sh
sugar freeze unlock-funds
```

You can use the following parameters 

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

When using a candy machine with guard groups you will have to use the `--label` parameter.
{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Stop Freezing NFTs

It is possible to stop the freezing of NFTs within a Freeze Sol Payment guard. In other words, new-minted NFTs will no longer be frozen but **existing Frozen NFTs will remain frozen**.

There are several ways of achieving this, which can be separated into two categories:

- ☀️ **Can Thaw**: Existing Frozen NFTs can be thawed by anyone using the `thaw` path of the route instruction.
- ❄️ **Cannot Thaw**: Existing Frozen NFTs cannot be thawed yet and we have to wait for one "Can Thaw" condition to be met.

With that in mind, here is the exhaustive list of ways to stop freezing NFTs and whether or not each of them allows thawing existing Frozen NFTs:

- The Candy Machine has minted out → ☀️ **Can Thaw**.
- The configured Freeze Period — which can be a maximum of 30 days — has passed → ☀️ **Can Thaw**.
- The Candy Machine account was deleted → ☀️ **Can Thaw**.
- The Candy Guard account was deleted → ❄️ **Cannot Thaw**.
- The Freeze Sol Payment guard was removed from the settings → ❄️ **Cannot Thaw**.

## Freeze Escrows and Guard Groups

When using multiple Freeze Sol Payment guards within various [Guard Groups](/programs/candy-machine/guard-groups), it is important to understand the relationship between a Freeze Sol Payment guard and a Freeze Escrow account.

The Freeze Escrow account is a PDA derived from a Destination address. This means that if **multiple Freeze Sol Payment guards** are configured to use the **same Destination address**, they will all **share the same Freeze Escrow account**.

Therefore, they will also share the same Freeze Period and all funds will be collected by the same escrow account. This also means, we only need to call the `initialize` route instruction once per configured Destination address.

It is also possible to use multiple Freeze Sol Payment guards with different Destination addresses. In this case, each Freeze Sol Payment guard will have its own Freeze Escrow account and its own Freeze Period.

The example below illustrates a Candy Machine with three Freeze Sol Payment guards in three groups such that:

- Groups 1 and 2 share the same Destination address and therefore the same Freeze Escrow account.
- Group 3 has its own Destination address and therefore its own Freeze Escrow account.

![CandyMachinesV3-GuardsFreezeSolPayment5.png](/assets/candy-machine-v3/CandyMachinesV3-GuardsFreezeSolPayment5.png#radius)
