---
title: Creator Fees on the Genesis Bonding Curve
metaTitle: Genesis Bonding Curve Creator Fees — Configure and Claim | Metaplex
description: How to configure a creator fee on a Genesis bonding curve launch, claim accrued fees during the active curve, and collect and claim post-graduation fees from a Raydium CPMM pool.
keywords:
  - creator fee
  - bonding curve
  - genesis
  - claimBondingCurveCreatorFeeV2
  - claimRaydiumCreatorFeeV2
  - collectRaydiumCpmmFeesWithCreatorFeeV2
  - deriveRaydiumPDAsV2
  - findRaydiumCpmmBucketV2Pda
  - fetchRaydiumCpmmBucketV2
  - creatorFeeWallet
  - creatorFeeAccrued
  - RaydiumCpmmBucketV2
  - Raydium CPMM
  - token launch
  - Solana
about:
  - Creator Fees
  - Bonding Curve
  - Genesis
  - Solana
programmingLanguage:
  - JavaScript
  - TypeScript
proficiencyLevel: Intermediate
created: '04-09-2026'
updated: '04-13-2026'
howToSteps:
  - Set creatorFeeWallet in the launch object when calling createAndRegisterLaunch
  - After launch, monitor creatorFeeAccrued in the bucket account using fetchBondingCurveBucketV2
  - Call claimBondingCurveCreatorFeeV2 to collect accrued fees during the active curve
  - After graduation, call collectRaydiumCpmmFeesWithCreatorFeeV2 to harvest LP fees from the Raydium pool into the Genesis bucket
  - Call claimRaydiumCreatorFeeV2 to transfer the accumulated bucket balance to the creator wallet
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: What is the default creator fee wallet if creatorFeeWallet is not set?
    a: The default is the launching wallet — the wallet that signed the createLaunch call. Set creatorFeeWallet explicitly in the launch object to redirect fees to any other address.
  - q: Are creator fees transferred on every swap?
    a: No. Creator fees are accrued in the bucket (creatorFeeAccrued) on each swap but are not transferred immediately. Call claimBondingCurveCreatorFeeV2 to collect them during the active curve, and collectRaydiumCpmmFeesWithCreatorFeeV2 followed by claimRaydiumCreatorFeeV2 after graduation.
  - q: Can anyone call claimBondingCurveCreatorFeeV2 or claimRaydiumCreatorFeeV2?
    a: Yes. All three permissionless fee instructions span both active-curve and post-graduation phases — collectRaydiumCpmmFeesWithCreatorFeeV2 and claimBondingCurveCreatorFeeV2 (active curve), and claimRaydiumCreatorFeeV2 (post-graduation). Any wallet can trigger them, but the SOL is always sent to the configured creator fee wallet, not the caller.
  - q: What is the difference between collectRaydiumCpmmFeesWithCreatorFeeV2 and claimRaydiumCreatorFeeV2?
    a: collectRaydiumCpmmFeesWithCreatorFeeV2 harvests accumulated LP trading fees from the Raydium CPMM pool into the Genesis RaydiumCpmmBucketV2 bucket. claimRaydiumCreatorFeeV2 transfers the balance already in the bucket to the creator fee wallet. Both steps are required to fully collect post-graduation fees.
  - q: Does the first buy pay creator fees?
    a: No. When a first buy is configured, all fees — both the protocol swap fee and creator fee — are waived for that one initial purchase. All subsequent swaps pay the normal creator fee.
  - q: How do I check how much creator fee has accrued?
    a: During the active curve, read the creatorFeeAccrued field from BondingCurveBucketV2 using fetchBondingCurveBucketV2. After graduation, read creatorFeeAccrued from RaydiumCpmmBucketV2 using fetchRaydiumCpmmBucketV2. See the Checking Accrued Creator Fees and Checking Accrued Raydium Creator Fees sections.
  - q: Can I change the creator fee wallet after launch?
    a: No. The creator fee wallet is set at curve creation and cannot be changed after the curve is live.
---

Creator fees are an optional per-swap fee on the [Genesis Bonding Curve](/smart-contracts/genesis/bonding-curve) that accrue to a configured wallet on every buy and sell. {% .lead %}

{% callout title="What You'll Learn" %}
- Configuring a creator fee wallet at launch
- Redirecting fees to a specific wallet or agent PDA
- Checking how much has accrued in the bucket
- Claiming accrued fees during the active curve
- Claiming post-graduation fees from the Raydium CPMM pool
{% /callout %}

## Summary

A creator fee is an optional per-swap fee on the Genesis Bonding Curve, applied to the SOL side of every buy and sell. Fees accrue in the bucket account (`creatorFeeAccrued`) rather than being transferred immediately — collect them via two permissionless instructions.

- **Configuration** — set `creatorFeeWallet` in the `launch` object at curve creation; defaults to the launching wallet if omitted
- **Accrual** — `creatorFeeAccrued` increments on every swap; fees are not transferred per-swap
- **Active curve claiming** — `claimBondingCurveCreatorFeeV2` collects accrued fees while the curve is live
- **Post-graduation claiming** — two-step: `collectRaydiumCpmmFeesWithCreatorFeeV2` harvests LP fees from the Raydium pool into the Genesis bucket, then `claimRaydiumCreatorFeeV2` transfers the bucket balance to the creator wallet

For how creator fees interact with swap pricing and the protocol swap fee, see [Theory of Operation — Fee Structure](/smart-contracts/genesis/bonding-curve-theory#fee-structure).

## Quick Start

This section gives the minimum steps to configure and claim creator fees across both the active curve and post-graduation phases.

### Quick Reference

This table summarizes when to call each fee instruction, the accounts it requires, and its effect on the creator fee lifecycle.

| Instruction | When to Use | Required Accounts | Output / Effect |
|---|---|---|---|
| `createAndRegisterLaunch` (set `creatorFeeWallet`) | Curve creation | Creator wallet, launch signer | Fee wallet configured on the bucket |
| `fetchBondingCurveBucketV2` (read `creatorFeeAccrued`) | Any time during active curve | Bucket PDA | Current accrued fee balance (lamports) |
| `claimBondingCurveCreatorFeeV2` | Active curve — collect accrued fees | Genesis account, bucket PDA, base mint, creator fee wallet | Accrued SOL transferred to creator wallet |
| `collectRaydiumCpmmFeesWithCreatorFeeV2` | Post-graduation — harvest LP fees | Genesis account, Raydium pool PDAs, Raydium bucket PDA | LP fees moved from Raydium pool into Genesis bucket |
| `claimRaydiumCreatorFeeV2` | Post-graduation — claim bucket balance | Genesis account, Raydium bucket PDA, base/quote mints, creator fee wallet | Bucket balance transferred to creator wallet |

**Jump to:** [Configure at Launch](#configuring-a-creator-fee-at-launch) · [Redirect to Wallet](#redirecting-creator-fees-to-a-specific-wallet) · [Agent PDA](#agent-launches-automatic-pda-routing) · [Combine with First Buy](#combining-creator-fees-with-a-first-buy) · [Check Accrued (Curve)](#checking-accrued-creator-fees) · [Claim During Curve](#claiming-creator-fees-during-the-active-curve) · [Check Raydium Fees](#checking-accrued-raydium-creator-fees) · [Collect from Raydium](#step-1--collect-fees-from-the-raydium-cpmm-pool) · [Claim After Graduation](#step-2--claim-fees-to-the-creator-wallet)

1. Set `creatorFeeWallet` in the `launch` object when calling `createAndRegisterLaunch`
2. After launch, read `bucket.creatorFeeAccrued` to monitor accumulated fees
3. Call `claimBondingCurveCreatorFeeV2` to collect fees while the curve is active
4. After graduation, call `collectRaydiumCpmmFeesWithCreatorFeeV2` to harvest LP fees from the Raydium pool
5. Call `claimRaydiumCreatorFeeV2` to transfer the bucket balance to the creator wallet

## Prerequisites

You must have the Genesis SDK, a configured Umi instance, and a funded Solana wallet.

- `@metaplex-foundation/genesis` SDK installed
- A Umi instance configured with your keypair identity — see [Launching a Bonding Curve via the Metaplex API](/smart-contracts/genesis/bonding-curve-launch#umi-setup)
- A funded Solana wallet for transaction fees

## Configuring a Creator Fee at Launch

Creator fees are configured in the `launch` object passed to `createAndRegisterLaunch` (or `createLaunch`). The `creatorFeeWallet` field is optional — if omitted, the launching wallet receives all fees by default. For the full launch flow, see [Launching a Bonding Curve via the Metaplex API](/smart-contracts/genesis/bonding-curve-launch).

### Redirecting Creator Fees to a Specific Wallet

Set `creatorFeeWallet` to direct accrued fees to any wallet address other than the launching wallet.

```typescript {% title="launch-with-creator-fee.ts" showLineNumbers=true %}
import { createAndRegisterLaunch } from '@metaplex-foundation/genesis/api';

const result = await createAndRegisterLaunch(umi, {}, {
  wallet: umi.identity.publicKey,
  launchType: 'bondingCurve',
  token: {
    name: 'My Token',
    symbol: 'MTK',
    image: 'https://gateway.irys.xyz/your-image-id',
  },
  launch: {
    creatorFeeWallet: 'FeeRecipientWalletAddress...',
  },
});
```

{% callout type="note" %}
The creator fee wallet is set at curve creation and cannot be changed after the curve is live.
{% /callout %}

### Agent Launches — Automatic PDA Routing

When launching on behalf of a Metaplex agent, the creator fee is automatically routed to the agent's PDA without setting `creatorFeeWallet` manually. For the full agent launch flow — Core execute wrapping and `setToken` association — see [Create an Agent Token](/agents/create-agent-token).

### Combining Creator Fees with a First Buy

You can configure a creator fee wallet and a first buy together. The first buy is always fee-free — no protocol fee or creator fee applies to that initial purchase. All subsequent swaps pay the normal creator fee.

```typescript {% title="launch-with-fee-and-first-buy.ts" %}
launch: {
  creatorFeeWallet: 'FeeRecipientWalletAddress...',
  firstBuyAmount: 0.5, // 0.5 SOL, fee-free for the first buyer
},
```

## Checking Accrued Creator Fees

The `creatorFeeAccrued` field on the `BondingCurveBucketV2` account tracks the total SOL accumulated since the last claim. Read it using `fetchBondingCurveBucketV2`:

```typescript {% title="check-creator-fees.ts" showLineNumbers=true %}
import {
  findBondingCurveBucketV2Pda,
  fetchBondingCurveBucketV2,
} from '@metaplex-foundation/genesis';
import { isSome, publicKey } from '@metaplex-foundation/umi';

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT_PUBKEY');
const baseMint = publicKey('TOKEN_MINT_PUBKEY');

const [bucketPda] = findBondingCurveBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

const bucket = await fetchBondingCurveBucketV2(umi, bucketPda);
console.log('Creator fees accrued (lamports):', bucket.creatorFeeAccrued);
console.log('Creator fees claimed to date (lamports):', bucket.creatorFeeClaimed);

// Read the configured creator fee wallet from the bucket extension
const creatorFeeExt = bucket.extensions.creatorFee;
const creatorFeeWallet = isSome(creatorFeeExt) ? creatorFeeExt.value.wallet : null;
console.log('Creator fee wallet:', creatorFeeWallet?.toString() ?? 'none configured');
```

## Claiming Creator Fees During the Active Curve

`claimBondingCurveCreatorFeeV2` transfers all accrued creator fees from the bucket to the configured creator fee wallet. Call it at any time while the curve is active.

```typescript {% title="claim-creator-fees.ts" showLineNumbers=true %}
import { claimBondingCurveCreatorFeeV2 } from '@metaplex-foundation/genesis';
import { isSome } from '@metaplex-foundation/umi';

// Read the creator fee wallet from the bucket extension before claiming.
const creatorFeeExt = bucket.extensions.creatorFee;
if (!isSome(creatorFeeExt)) throw new Error('No creator fee configured on this bucket');
const creatorFeeWallet = creatorFeeExt.value.wallet;

const result = await claimBondingCurveCreatorFeeV2(umi, {
  genesisAccount,
  bucket: bucketPda,
  baseMint,
  creatorFeeWallet,
}).sendAndConfirm(umi);

console.log('Creator fees claimed:', result.signature);
```

{% callout type="note" %}
`claimBondingCurveCreatorFeeV2` is permissionless — any wallet can call it, but the SOL is always sent to the configured creator fee wallet, not the caller.
{% /callout %}

## Claiming Creator Fees After Graduation

After the bonding curve [graduates](/smart-contracts/genesis/bonding-curve-theory#phase-3-graduated), liquidity migrates to a Raydium CPMM pool and creator fees continue to accrue from LP trading activity. Post-graduation fee collection is a **two-step process**: first collect accumulated LP trading fees from the Raydium pool into the Genesis `RaydiumCpmmBucketV2` bucket, then claim the bucket balance to the creator wallet.

### Checking Accrued Raydium Creator Fees

The `RaydiumCpmmBucketV2` account exposes `creatorFeeAccrued` and `creatorFeeClaimed` fields analogous to those on `BondingCurveBucketV2`. Derive and fetch it using `findRaydiumCpmmBucketV2Pda` and `fetchRaydiumCpmmBucketV2`.

```typescript {% title="check-raydium-fees.ts" showLineNumbers=true %}
import {
  findRaydiumCpmmBucketV2Pda,
  fetchRaydiumCpmmBucketV2,
} from '@metaplex-foundation/genesis';
import { isSome, publicKey } from '@metaplex-foundation/umi';

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT_PUBKEY');

const [raydiumBucketPda] = findRaydiumCpmmBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

const raydiumBucket = await fetchRaydiumCpmmBucketV2(umi, raydiumBucketPda);
const claimable = raydiumBucket.creatorFeeAccrued - raydiumBucket.creatorFeeClaimed;
console.log('Claimable Raydium creator fees (lamports):', claimable);

const creatorFeeExt = raydiumBucket.extensions.creatorFee;
const creatorFeeWallet = isSome(creatorFeeExt) ? creatorFeeExt.value.wallet : null;
console.log('Creator fee wallet:', creatorFeeWallet?.toString() ?? 'none configured');
```

{% callout type="note" %}
`raydiumBucket.creatorFeeAccrued` only reflects fees that have already been collected from the Raydium pool into the bucket. The Raydium pool itself may hold additional uncollected LP fees — run `collectRaydiumCpmmFeesWithCreatorFeeV2` to move those into the bucket before reading the final claimable balance.
{% /callout %}

### Step 1 — Collect Fees from the Raydium CPMM Pool

`collectRaydiumCpmmFeesWithCreatorFeeV2` harvests accumulated LP trading fees from the Raydium CPMM pool and credits them to the `RaydiumCpmmBucketV2` bucket signer's token account, updating `creatorFeeAccrued`. This step must run before claiming — there is nothing to claim until fees have been collected from Raydium.

Use `deriveRaydiumPDAsV2` to compute all required Raydium pool accounts from the base mint and bucket address. Pass `creatorFee: true` to select the creator-fee AMM config.

```typescript {% title="collect-raydium-fees.ts" showLineNumbers=true %}
import {
  collectRaydiumCpmmFeesWithCreatorFeeV2,
  deriveRaydiumPDAsV2,
  findRaydiumCpmmBucketV2Pda,
} from '@metaplex-foundation/genesis';
import { publicKey } from '@metaplex-foundation/umi';

const baseMint = publicKey('TOKEN_MINT_PUBKEY');
const quoteMint = publicKey('So11111111111111111111111111111111111111112'); // wSOL

const [raydiumBucketPda] = findRaydiumCpmmBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

const pdas = deriveRaydiumPDAsV2(umi, baseMint, raydiumBucketPda, {
  quoteMint,
  env: 'mainnet', // or 'devnet'
  creatorFee: true,
});

await collectRaydiumCpmmFeesWithCreatorFeeV2(umi, {
  baseMint,
  quoteMint,
  genesisAccount,
  poolState: pdas.poolState,
  raydiumCpmmBucket: raydiumBucketPda,
  ammConfig: pdas.ammConfig,
  poolAuthority: pdas.poolAuthority,
  baseVault: pdas.baseVault,
  quoteVault: pdas.quoteVault,
  raydiumProgram: pdas.raydiumProgram,
}).sendAndConfirm(umi);

console.log('Raydium LP fees collected into Genesis bucket');
```

{% callout type="note" %}
`collectRaydiumCpmmFeesWithCreatorFeeV2` is permissionless — any wallet can call it. The collected fees flow into the Genesis bucket signer's token account and are reflected in `creatorFeeAccrued` on the next bucket fetch.
{% /callout %}

### Step 2 — Claim Fees to the Creator Wallet

`claimRaydiumCreatorFeeV2` transfers the balance accumulated in the `RaydiumCpmmBucketV2` bucket to the configured creator fee wallet. Run this after collecting, or any time the bucket already holds an unclaimed balance from a previous collect.

```typescript {% title="claim-raydium-creator-fees.ts" showLineNumbers=true %}
import {
  claimRaydiumCreatorFeeV2,
  fetchRaydiumCpmmBucketV2,
  findRaydiumCpmmBucketV2Pda,
} from '@metaplex-foundation/genesis';
import { isSome, publicKey } from '@metaplex-foundation/umi';

const [raydiumBucketPda] = findRaydiumCpmmBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

// Re-fetch after collecting to get the updated creatorFeeAccrued.
const raydiumBucket = await fetchRaydiumCpmmBucketV2(umi, raydiumBucketPda);

const creatorFeeExt = raydiumBucket.extensions.creatorFee;
if (!isSome(creatorFeeExt)) throw new Error('No creator fee configured on this Raydium bucket');
const creatorFeeWallet = creatorFeeExt.value.wallet;

await claimRaydiumCreatorFeeV2(umi, {
  genesisAccount: raydiumBucket.bucket.genesis,
  bucket: raydiumBucketPda,
  baseMint: raydiumBucket.bucket.baseMint,
  quoteMint: raydiumBucket.bucket.quoteMint,
  creatorFeeWallet,
}).sendAndConfirm(umi);

console.log('Raydium creator fees claimed to:', creatorFeeWallet.toString());
```

{% callout type="note" %}
`claimRaydiumCreatorFeeV2` is permissionless — any wallet can trigger the claim, but the SOL (as wSOL) is always sent to the configured creator fee wallet, not the caller.
{% /callout %}

### Combined Collect-and-Claim Flow

Collect and claim in a single transaction by chaining the two builders. If the pool has no uncollected fees and the bucket balance is zero, skip both instructions to avoid a no-op transaction.

```typescript {% title="collect-and-claim-raydium.ts" showLineNumbers=true %}
import {
  collectRaydiumCpmmFeesWithCreatorFeeV2,
  claimRaydiumCreatorFeeV2,
  deriveRaydiumPDAsV2,
  fetchRaydiumCpmmBucketV2,
  findRaydiumCpmmBucketV2Pda,
} from '@metaplex-foundation/genesis';
import { isSome, publicKey, transactionBuilder } from '@metaplex-foundation/umi';

const baseMint = publicKey('TOKEN_MINT_PUBKEY');
const quoteMint = publicKey('So11111111111111111111111111111111111111112');
const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT_PUBKEY');

const [raydiumBucketPda] = findRaydiumCpmmBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

const raydiumBucket = await fetchRaydiumCpmmBucketV2(umi, raydiumBucketPda);

const creatorFeeExt = raydiumBucket.extensions.creatorFee;
if (!isSome(creatorFeeExt)) throw new Error('No creator fee configured');
const creatorFeeWallet = creatorFeeExt.value.wallet;

const pdas = deriveRaydiumPDAsV2(umi, baseMint, raydiumBucketPda, {
  quoteMint,
  env: 'mainnet', // or 'devnet'
  creatorFee: true,
});

await transactionBuilder()
  .add(collectRaydiumCpmmFeesWithCreatorFeeV2(umi, {
    baseMint,
    quoteMint,
    genesisAccount,
    poolState: pdas.poolState,
    raydiumCpmmBucket: raydiumBucketPda,
    ammConfig: pdas.ammConfig,
    poolAuthority: pdas.poolAuthority,
    baseVault: pdas.baseVault,
    quoteVault: pdas.quoteVault,
    raydiumProgram: pdas.raydiumProgram,
  }))
  .add(claimRaydiumCreatorFeeV2(umi, {
    genesisAccount,
    bucket: raydiumBucketPda,
    baseMint,
    quoteMint,
    creatorFeeWallet,
  }))
  .sendAndConfirm(umi);

console.log('Raydium creator fees collected and claimed to:', creatorFeeWallet.toString());
```

## Notes

These caveats cover fee timing, permissionless claiming, the two-step post-graduation flow, and first-buy fee waivers.

- Creator fees are accrued in the bucket (`creatorFeeAccrued`) on each swap, not transferred immediately — explicitly call the claim instructions to receive them; `creatorFeeClaimed` tracks the cumulative total claimed to date
- Both `claimBondingCurveCreatorFeeV2` and `claimRaydiumCreatorFeeV2` are permissionless: any wallet can trigger them, but the SOL always goes to the configured creator fee wallet, not the caller; `collectRaydiumCpmmFeesWithCreatorFeeV2` is also permissionless
- Post-graduation fees require two steps in order: `collectRaydiumCpmmFeesWithCreatorFeeV2` (harvest from Raydium pool → Genesis bucket), then `claimRaydiumCreatorFeeV2` (bucket → creator wallet); both can be combined in a single transaction
- `creatorFeeAccrued` and `creatorFeeClaimed` exist on both `BondingCurveBucketV2` (active curve) and `RaydiumCpmmBucketV2` (post-graduation); use `fetchBondingCurveBucketV2` and `fetchRaydiumCpmmBucketV2` respectively
- `creatorFeeWallet` defaults to the launching wallet if not set; it cannot be changed after the curve is created
- The first buy mechanism waives all fees (protocol and creator) for the designated initial purchase only; all subsequent swaps pay the normal creator fee
- Creator fees apply to the SOL side of every swap regardless of direction (buy or sell); they do not compound with the protocol swap fee
- For current fee rates, see the [Genesis Protocol Fees](/smart-contracts/genesis) page
- For swap-side context — reading bucket state, computing quotes, and executing trades — see [Bonding Curve Swap Integration](/smart-contracts/genesis/bonding-curve-swaps)

## FAQ

### What is the default creator fee wallet if `creatorFeeWallet` is not set?

The default creator fee wallet is the launching wallet — the wallet that signed the `createLaunch` call. Set `creatorFeeWallet` explicitly in the `launch` object to redirect fees to any other address.

### Are creator fees transferred on every swap?

No. Creator fees are accrued in the bucket (`creatorFeeAccrued`) on each swap but are not transferred immediately. Call `claimBondingCurveCreatorFeeV2` to collect them during the active curve. After graduation, call `collectRaydiumCpmmFeesWithCreatorFeeV2` to harvest LP fees from the Raydium pool, then `claimRaydiumCreatorFeeV2` to transfer them to the creator wallet.

### Can anyone call `claimBondingCurveCreatorFeeV2` or `claimRaydiumCreatorFeeV2`?

Yes. All three permissionless fee instructions span both the active-curve and post-graduation phases — `collectRaydiumCpmmFeesWithCreatorFeeV2` and `claimBondingCurveCreatorFeeV2` (active curve), and `claimRaydiumCreatorFeeV2` (post-graduation). Any wallet can trigger them, but the SOL is always sent to the configured creator fee wallet, not the caller.

### What is the difference between `collectRaydiumCpmmFeesWithCreatorFeeV2` and `claimRaydiumCreatorFeeV2`?

`collectRaydiumCpmmFeesWithCreatorFeeV2` pulls accumulated LP trading fees from the Raydium CPMM pool into the Genesis `RaydiumCpmmBucketV2` bucket — this updates `creatorFeeAccrued` on the bucket. `claimRaydiumCreatorFeeV2` then transfers that bucket balance to the creator fee wallet. You must run collect before claim; without a collect, there is no bucket balance to claim.

### Why is my `creatorFeeAccrued` on the Raydium bucket zero even though the pool is active?

`creatorFeeAccrued` on `RaydiumCpmmBucketV2` only reflects fees that have been collected from Raydium into the Genesis bucket via `collectRaydiumCpmmFeesWithCreatorFeeV2`. LP trading fees accumulate inside the Raydium pool state first — they do not appear in the Genesis bucket until you run the collect instruction.

### Does the first buy pay creator fees?

No. When a first buy is configured, all fees — protocol swap fee and creator fee — are waived for that one initial purchase. All subsequent swaps pay the normal creator fee.

### How do I check how much creator fee has accrued?

During the active curve, read the `creatorFeeAccrued` field from `BondingCurveBucketV2` using `fetchBondingCurveBucketV2`. After graduation, read `creatorFeeAccrued` from `RaydiumCpmmBucketV2` using `fetchRaydiumCpmmBucketV2`. See [Checking Accrued Creator Fees](#checking-accrued-creator-fees) and [Checking Accrued Raydium Creator Fees](#checking-accrued-raydium-creator-fees).

### Can I change the creator fee wallet after launch?

No. The creator fee wallet is set at curve creation and cannot be changed after the curve is live.
