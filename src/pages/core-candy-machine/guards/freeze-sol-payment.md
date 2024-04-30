---
title: 'Freeze Sol Payment'
metaTitle: 'Core Candy Machine Guards - Freeze Sol Payment'
description: 'Set the price of the mint in SOL with a freeze period.'
---

## Overview

The **Freeze Sol Payment** guard allows minting frozen Assets by charging the payer an amount in SOL. Frozen Assets cannot be transferred or listed on any marketplaces until thawed.

Frozen Assets can be thawed by anyone as long as one of the following conditions is met:

- The Core Candy Machine has minted out.
- The Core Candy Machine was deleted.
- The configured Freeze Period — which can be a maximum of 30 days — has passed.

The funds are transferred to a "Freeze Escrow" account which must be initialized by the Candy Guard authority before minting can start. Once all Frozen Assets have been thawed, the funds can be unlocked and transferred to the configured destination account by the Candy Guard authority.

You may initialize the Freeze Escrow account, thaw Assets and unlock funds [via the route instruction](#route-instruction) of this guard.

{% diagram  %}

{% node #initialize label="Initialize Freeze Escrow" theme="indigo" /%}
{% node parent="initialize"  theme="transparent" x="-8" y="-1" %}
①
{% /node %}
{% edge from="initialize" to="freezeEscrow-pda" path="straight" /%}
{% node #freezeEscrow-pda label="Freeze Escrow PDA" theme="slate" parent="initialize" x="15" y="70" /%}
{% node theme="transparent" parent="freezeEscrow-pda" x="178" y="-15"%}
Funds are transferred

to the escrow account
{% /node %}
{% node #mintFrozen label="Mint Frozen Assets" theme="indigo" parent="initialize" x="250" /%}
{% node parent="mintFrozen"  theme="transparent" x="-8" y="-1" %}
②
{% /node %}
{% edge from="mintFrozen" to="frozen-NFT-bg2" path="straight" /%}
{% edge from="mintFrozen" to="freezeEscrow-pda" toPosition="right" fromPosition="bottom" /%}
{% node #frozen-NFT-bg2 label="Frozen Asset" theme="slate" parent="frozen-NFT" x="-10" y="-10" /%}
{% node #frozen-NFT-bg1 label="Frozen Asset" theme="slate" parent="frozen-NFT" x="-5" y="-5" /%}
{% node #frozen-NFT label="Frozen Asset" theme="slate" parent="mintFrozen" x="33" y="120" /%}

{% node #clock label="🕑" theme="transparent" parent="mintFrozen" x="165" y="-30" /%}
{% edge from="clock" to="clockDesc" arrow="none" theme="dimmed" path="straight" /%}
{% node #clockDesc  theme="transparent" parent="clock" y="220" x="-91" %}
_When all Assets have been minted_

_OR at the end of the freeze period._
{% /node %}

{% edge from="frozen-NFT" to="thawed-NFT-bg2" path="straight" /%}

{% node #thaw label="Thaw Assets" theme="indigo" parent="mintFrozen" x="200" /%}
{% node parent="thaw"  theme="transparent" x="-8" y="-1" %}
③
{% /node %}
{% edge from="thaw" to="thawed-NFT-bg2" path="straight" /%}
{% node #thawed-NFT-bg2 label="Thawed Asset" theme="slate" parent="thawed-NFT" x="-10" y="-10" /%}
{% node #thawed-NFT-bg1 label="Thawed Asset" theme="slate" parent="thawed-NFT" x="-5" y="-5" /%}
{% node #thawed-NFT label="Thawed Asset" theme="slate" parent="thaw" y="130" x="3" /%}


{% node #clock2 label="🕑" theme="transparent" parent="thaw" x="130" y="-30" /%}
{% edge from="clock2" to="clockDesc2" arrow="none" theme="dimmed" path="straight" /%}
{% node #clockDesc2  theme="transparent" parent="clock2" y="260" x="-91" %}
_When all Assets have been thawed._
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

{% dialect-switcher title="Set up a Candy Machine using the Freeze Sol Payment guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

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

API References: [create](https://mpl-core-candy-machine-js-docs.vercel.app/functions/create.html), [FreezeSolPayment](https://mpl-core-candy-machine-js-docs.vercel.app/types/FreezeSolPayment.html)

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

Note that, if you’re planning on constructing instructions without the help of our SDKs, you will need to provide these Mint Settings and more as a combination of instruction arguments and remaining accounts. See the [Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#freezesolpayment) for more details.

{% dialect-switcher title="Mint with the Freeze Sol Payment Guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

You may pass the Mint Settings of the Freeze Sol Payment guard using the `mintArgs` argument like so.

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    freezeSolPayment: some({ destination: umi.identity.publicKey }),
  },
})
```

API References: [mintV1](https://mpl-core-candy-machine-js-docs.vercel.app/functions/mintV1.html), [FreezeSolPaymentMintArgs](https://mpl-core-candy-machine-js-docs.vercel.app/types/FreezeSolPaymentMintArgs.html)

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

- [Overview](#overview)
- [Guard Settings](#guard-settings)
- [Mint Settings](#mint-settings)
- [Route Instruction](#route-instruction)
  - [Initialize the Freeze Escrow](#initialize-the-freeze-escrow)
  - [Thaw a Frozen Asset](#thaw-a-frozen-asset)
  - [Unlock Funds](#unlock-funds)
- [Stop Freezing Assets](#stop-freezing-Assets)
- [Freeze Escrows and Guard Groups](#freeze-escrows-and-guard-groups)

### Initialize the Freeze Escrow

_Path: `initialize`_

When using the Freeze Sol Payment guard, we must initialize the Freeze Escrow account before minting can start. This will create a PDA account derived from the Destination attribute of the guard's settings.

The Freeze Escrow PDA account will keep track of several parameters such as:

- How many Frozen Assets were minted through this guard.
- When was the first Frozen Asset minted via this guard as the Freeze Period starts counting after that.

When initializing this Freeze Escrow account, we must provide the following arguments to the route instruction of the guard:

- **Path** = `initialize`: Selects the path to execute in the route instruction.
- **Destination**: The address of the wallet that should eventually receive all payments related to this guard.
- **Period**: The amount of time in seconds that the Freeze Period should last. This can be a maximum of 30 days (2,592,000 seconds) and it will start from the very first Frozen Asset minted via this guard. The Freeze Period provides a safety mechanism to ensure Frozen Assets can eventually be thawed even if the Candy Machine never mints out.
- **Candy Guard Authority**: The authority of the Candy Guard account as a Signer.

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}

Owner: Candy Machine Core Program {% .whitespace-nowrap %}

{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node #guards label="Guards" theme="mint" z=1/%}
{% node #freezeSolPayment label="Freeze Sol Payment" /%}
{% node #amount label="- Amount"  /%}
{% node #destination label="- Destination" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" x="415" %}
  {% node #candy-guard-route theme="pink" %}
    Route with Path {% .whitespace-nowrap %}
    
    = *Initialize*
  {% /node %}
  {% node parent="candy-guard-route" theme="pink" %}
    Candy Machine Guard Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="candy-guard-route" y="-20" x="-4" theme="transparent" %}
  Initialize Freeze Escrow
{% /node %}

{% node #freeze-period parent="candy-guard-route" x="220" y="13" label="Freeze Period" theme="slate" /%}
{% edge from="freeze-period" to="candy-guard-route" theme="pink" path="straight" /%}

{% edge from="amount" to="candy-guard-route" theme="pink" toPosition="left" /%}


{% edge from="candy-guard-route" to="freezeEscrow-PDA3" theme="pink" path="straight" y="-10" /%}

{% node #freezeEscrow-PDA3 parent="destination" x="390" y="-10" %}
  Freeze Escrow PDA
{% /node %}

{% edge from="candy-guard" to="candy-machine" /%}

{% edge from="destination" to="freezeEscrow-PDA3" arrow="none" dashed=true path="straight" /%}

{% edge from="candy-guard-route" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

Last but not least, the Freeze Escrow PDA account will receive the funds of all Frozen Assets minted through this guard.

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node #guards label="Guards" theme="mint" z=1 /%}
{% node #freezeSolPayment label="Freeze Sol Payment" /%}
{% node #amount label="Amount"  /%}
{% node #destination label="Destination" /%}
{% node label="..." /%}
{% /node %}

{% node #freezeEscrow-PDA4 parent="destination" x="300" y="-8" theme="slate" %}
  Freeze Escrow PDA
{% /node %}
{% edge from="destination" to="freezeEscrow-PDA4" arrow="none" dashed=true path="straight" /%}

{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    Route with
    
    Path = *Initialize*
  {% /node %}
    {% node parent="candy-guard-route" theme="pink" %}
    Candy Machine Guard Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}
{% edge from="mint-candy-guard" to="freezeEscrow-PDA4" theme="pink" /%}

{% node parent="mint-candy-guard" y="150" x="2" %}
  {% node #mint-candy-machine theme="pink" %}
    Mint
  {% /node %}
  {% node parent="mint-candy-guard" theme="pink" %}
    Candy Machine Core Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="130" theme="transparent" %}
  Mint Logic
{% /node %}


{% edge from="mint-candy-machine" to="frozen-NFT" path="straight" /%}
{% node #frozen-NFT parent="mint-candy-machine" y="120" x="29" theme="slate" %}
  Frozen Asset
{% /node %}

{% edge from="candy-guard" to="candy-machine" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

{% sperator h="6" %}

{% dialect-switcher title="Initialize the Freeze Escrow" %}
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

API References: [route](https://mpl-core-candy-machine-js-docs.vercel.app/functions/route.html), [FreezeSolPaymentRouteArgsInitialize](https://mpl-core-candy-machine-js-docs.vercel.app/types/FreezeSolPaymentRouteArgsInitialize.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### Thaw a Frozen Asset

_Path: `thaw`_

Frozen Assets can be thawed by anyone as long as one of the following conditions is met:

- The Candy Machine has minted out.
- The Candy Machine was deleted.
- The configured Freeze Period — which can be a maximum of 30 days — has passed.

Note that since the funds in the Freeze Escrow are not transferrable until all Assets are thawed, this creates an incentive for the treasury to thaw all Assets as soon as possible.

To thaw a Frozen Asset, we must provide the following arguments to the route instruction of the guard:

- **Path** = `thaw`: Selects the path to execute in the route instruction.
- **Destination**: The address of the wallet that should eventually receive all payments related to this guard.
- **Asset Address**: The mint address of the Frozen Asset to thaw.
- **Asset Owner**: The address of the owner of the Frozen Asset to thaw.

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
  Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="-4" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Candy Machine Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #guards label="Guards" theme="mint" z=1 /%}
{% node #freezeSolPayment label="Freeze Sol Payment" /%}
{% node #amount label="Amount"  /%}
{% node #destination label="Destination" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" x="427" y="-14" %}
  {% node #candy-guard-route theme="pink" %}
    Route with
    
    Path = *thaw*
  {% /node %}
  {% node parent="mint-candy-guard" theme="pink" %}
    Candy Machine Core Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="candy-guard-route" y="-20" x="80" theme="transparent" %}
  Thaw a Frozen Asset
{% /node %}

{% node #freeze-period parent="candy-guard-route" x="218" y="15" label="Freeze Escrow PDA" /%}
{% edge from="freeze-period" to="candy-guard-route" theme="pink" path="straight" /%}

{% edge from="candy-machine" to="candy-guard-route" theme="pink" /%}
{% edge from="candy-guard" to="candy-guard-route" theme="pink" toPosition="left" /%}
{% edge from="amount" to="candy-guard-route" theme="pink" toPosition="left" /%}


{% edge from="candy-guard-route" to="freezeEscrow-PDA5" theme="pink" path="straight" /%}

{% node #frozen-NFT parent="candy-guard-route" y="-100" x="29" label="Frozen Asset" /%}
{% edge from="frozen-NFT" to="candy-guard-route" path="straight" /%}

{% node #freezeEscrow-PDA5 parent="candy-guard-route" x="25" y="150" label="Thawed Asset" /%}
{% edge from="candy-guard" to="candy-machine" /%}

{% edge from="candy-guard-guards" to="guards" /%}
{% edge from="candy-guard-route" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

{% seperator h="6" /%}

{% dialect-switcher title="Thaw a frozen Asset" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

In the example below, we thaw a Frozen Asset that belongs to the current identity.

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

API References: [route](https://mpl-core-candy-machine-js-docs.vercel.app/functions/route.html), [FreezeSolPaymentRouteArgsThaw](https://mpl-core-candy-machine-js-docs.vercel.app/types/FreezeSolPaymentRouteArgsThaw.html)

{% /totem %}
{% /dialect %}

{% /dialect-switcher %}

### Unlock Funds

_Path: `unlockFunds`_

Once all Frozen Assets have been thawed, the treasury can unlock the funds from the Freeze Escrow account. This will transfer the funds to the configured Destination address.

To unlock the funds, we must provide the following arguments to the route instruction of the guard:

- **Path** = `unlockFunds`: Selects the path to execute in the route instruction.
- **Destination**: The address of the wallet that should eventually receive all payments related to this guard.
- **Candy Guard Authority**: The authority of the Candy Guard account as a Signer.

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="19" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Candy Machine Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #guards label="Guards" theme="mint" z=1/%}
{% node #freezeSolPayment label="Freeze Sol Payment" /%}
{% node #amount label="Amount"  /%}
{% node #destination label="Destination" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" x="431" %}
  {% node #candy-guard-route theme="pink" %}
    Route with
    
    Path = *unlockFunds*
  {% /node %}
  {% node parent="mint-candy-guard" theme="pink" %}
    Candy Machine Guard Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}

{% node parent="candy-guard-route" y="-20" x="10" theme="transparent" %}
  Unlock funds from the escrow
{% /node %}

{% node #freeze-period parent="candy-guard-route" x="220" y="15" label="Freeze Escrow PDA" /%}
{% edge from="freeze-period" to="candy-guard-route" theme="pink" path="straight" /%}

{% edge from="amount" to="candy-guard-route" theme="pink" toPosition="left" /%}


{% node parent="candy-guard-route" y="209" x="-18" %}
{% node #destination-wallet label="Destination Wallet" theme="indigo" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program
{% /node %}
{% /node %}
{% edge from="destination-wallet" to="destination" arrow="none" dashed=true /%}
{% edge from="candy-guard-route" to="destination-wallet" theme="pink" path="straight" %}
Transfer all funds from

the Freeze Escrow Account
{% /edge %}


{% edge from="candy-guard" to="candy-machine" /%}

{% edge from="candy-guard-guards" to="guards" /%}

{% /diagram %}

{% separator h="6" /%}

{% dialect-switcher title="Unlock Funds" %}
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

API References: [route](https://mpl-core-candy-machine-js-docs.vercel.app/functions/route.html), [FreezeSolPaymentRouteArgsUnlockFunds](https://mpl-core-candy-machine-js-docs.vercel.app/types/FreezeSolPaymentRouteArgsUnlockFunds.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Stop Freezing Assets

It is possible to stop the freezing of Assets within a Freeze Sol Payment guard. In other words, new-minted Assets will no longer be frozen but **existing Frozen Assets will remain frozen**.

There are several ways of achieving this, which can be separated into two categories:

- ☀️ **Can Thaw**: Existing Frozen Assets can be thawed by anyone using the `thaw` path of the route instruction.
- ❄️ **Cannot Thaw**: Existing Frozen Assets cannot be thawed yet and we have to wait for one "Can Thaw" condition to be met.

With that in mind, here is the exhaustive list of ways to stop freezing Assets and whether or not each of them allows thawing existing Frozen Assets:

- The Candy Machine has minted out → ☀️ **Can Thaw**.
- The configured Freeze Period — which can be a maximum of 30 days — has passed → ☀️ **Can Thaw**.
- The Candy Machine account was deleted → ☀️ **Can Thaw**.
- The Candy Guard account was deleted → ❄️ **Cannot Thaw**.
- The Freeze Sol Payment guard was removed from the settings → ❄️ **Cannot Thaw**.

## Freeze Escrows and Guard Groups

When using multiple Freeze Sol Payment guards within various [Guard Groups](/programs/core-candy-machine/guard-groups), it is important to understand the relationship between a Freeze Sol Payment guard and a Freeze Escrow account.

The Freeze Escrow account is a PDA derived from a Destination address. This means that if **multiple Freeze Sol Payment guards** are configured to use the **same Destination address**, they will all **share the same Freeze Escrow account**.

Therefore, they will also share the same Freeze Period and all funds will be collected by the same escrow account. This also means, we only need to call the `initialize` route instruction once per configured Destination address. This implies that the route instruction is only required once per the configured Destination address.  Same applies for `unlockFunds`. To `thaw` you can use whichever label you like provided that those shared the same escrow account.

It is also possible to use multiple Freeze Sol Payment guards with different Destination addresses. In this case, each Freeze Sol Payment guard will have its own Freeze Escrow account and its own Freeze Period.

The example below illustrates a Candy Machine with three Freeze Sol Payment guards in three groups such that:

- Groups 1 and 2 share the same Destination address and therefore the same Freeze Escrow account.
- Group 3 has its own Destination address and therefore its own Freeze Escrow account.

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node #guards label="Guard Group 1" theme="mint" z=1/%}
{% node #freezeSolPayment label="Freeze Sol Payment" /%}
{% node #amount label="Amount = 1 SOL" /%}
{% node #destination label="Destination A" /%}
{% node label="..." /%}
{% node #guards-2 label="Guard Group 2" theme="mint" z=1/%}
{% node #freezeSolPayment-2 label="Freeze Sol Payment" /%}
{% node #amount-2 label="Amount = 2 SOL" /%}
{% node #destination-2 label="Destination A" /%}
{% node label="..." /%}
{% node #guards-3 label="Guard Group 3" theme="mint" z=1/%}
{% node #freezeSolPayment-3 label="Freeze Sol Payment" /%}
{% node #amount-3 label="Amount = 3 SOL" /%}
{% node #destination-3 label="Destination B" /%}
{% node label="..." /%}
{% /node %}
{% /node %}

{% node #freezeEscrow-PDA-A parent="destination" x="220" y="-22" %}
  Freeze Escrow PDA

  For Destination A
{% /node %}
{% edge from="destination" to="freezeEscrow-PDA-A" arrow="none" dashed=true path="straight" /%}
{% edge from="destination-2" to="freezeEscrow-PDA-A" arrow="none" dashed=true toPosition="bottom" /%}

{% node parent="freezeEscrow-PDA-A" y="-125" x="-4" %}
  {% node #route-init-a theme="pink" %}
    Route with 
    
    Path = *Initialize*
  {% /node %}
  {% node theme="pink" %}
    Candy Machine Guard Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="route-init-a" y="-20" x="50" theme="transparent" %}
  Initialize Freeze Escrow
{% /node %}
{% edge from="route-init-a" to="freezeEscrow-PDA-A" theme="pink" path="straight" /%}

{% node #freeze-period-a parent="route-init-a" x="240" y="15" theme="slate" %}
  Freeze Period A
{% /node %}
{% edge from="freeze-period-a" to="route-init-a" theme="pink" path="straight" /%}

{% node #freezeEscrow-PDA-B parent="destination-3" x="420" y="-22" %}
  Freeze Escrow PDA

  For Destination B
{% /node %}
{% edge from="destination-3" to="freezeEscrow-PDA-B" arrow="none" dashed=true path="straight" /%}

{% node parent="freezeEscrow-PDA-B" y="-125" x="-4" %}
  {% node #route-init-b theme="pink" %}
    Route with 
    
    Path = *Initialize*
  {% /node %}
  {% node theme="pink" %}
    Candy Machine Guard Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="route-init-b" y="-20" x="50" theme="transparent" %}
  Initialize Freeze Escrow
{% /node %}
{% edge from="route-init-b" to="freezeEscrow-PDA-B" theme="pink" path="straight" /%}

{% node #freeze-period-b parent="route-init-b" x="240" y="15" theme="slate" %}
  Freeze Period B
{% /node %}
{% edge from="freeze-period-b" to="route-init-b" theme="pink" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}

{% /diagram %}