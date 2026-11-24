---
title: JavaScript SDK
metaTitle: JavaScript SDK | Genesis | Metaplex
description: API reference for the Genesis JavaScript SDK. Function signatures, condition and end behavior types, Raydium CPMM graduation instructions, and error codes for token launches on Solana.
created: '01-15-2025'
updated: '11-24-2026'
keywords:
  - Genesis SDK
  - JavaScript SDK
  - TypeScript SDK
  - token launch SDK
  - Umi framework
  - Genesis API reference
  - refundLaunchPoolV2
  - soft cap
  - triggerConditionsV2
  - triggerBehaviorsV2
  - graduateToRaydiumCpmmV2
  - addRaydiumCpmmBucketV2
  - TimeRelative condition
  - EndBehavior
about:
  - SDK installation
  - API reference
  - Genesis instructions
  - Raydium CPMM graduation
  - Genesis conditions and end behaviors
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: What is Umi and why is it required?
    a: Umi is Metaplex's JavaScript framework for Solana. It provides a consistent interface for building transactions, managing signers, and interacting with Metaplex programs.
  - q: Can I use the Genesis SDK in a browser?
    a: Yes. The SDK works in both Node.js and browser environments. For browsers, use a wallet adapter for signing instead of keypair files.
  - q: What's the difference between fetch and safeFetch?
    a: fetch throws an error if the account doesn't exist. safeFetch returns null instead, useful for checking if an account exists without error handling.
  - q: How do I retrieve the launch type for a token?
    a: Fetch the GenesisAccountV2 on-chain account using fetchGenesisAccountV2FromSeeds with the token mint. The launchType field returns 0 (Uninitialized) or 3 (LaunchPoolV1). You can also query all launches of a given type using the GPA builder.
  - q: Which Genesis instructions can any wallet call?
    a: triggerConditionsV2, triggerBehaviorsV2, graduateToRaydiumCpmmV2, collectRaydiumCpmmFeesV2, collectRaydiumCpmmFeesWithCreatorFeeV2, claimRaydiumCreatorFeeV2, claimUnlockedV2, and claimClaimScheduleV2 only require a fee payer signature. Funds always go to the addresses stored on the bucket. If a bucket has a backend signer extension, that signer must also co-sign graduation and claims.
  - q: Why does a claim still fail after Raydium graduation?
    a: Claim conditions that are TimeRelative to the Raydium bucket's Graduate time are not resolved by graduation or by the claim itself. Call triggerConditionsV2 on each dependent bucket and pass the Raydium CPMM bucket as a writable remaining account.
  - q: How do I handle transaction errors?
    a: Wrap sendAndConfirm calls in try/catch blocks and match the error name against the Common Errors table. Common errors include insufficient funds, already-finalized accounts, untriggered conditions, and graduation that has not started.
---

API reference for the Genesis JavaScript SDK (`@metaplex-foundation/genesis`). For complete tutorials, see [Launch Pool](/smart-contracts/genesis/launch-pool) or [Presale](/smart-contracts/genesis/presale). {% .lead %}

## Summary

The Genesis JavaScript SDK exposes every Genesis program instruction as a Umi builder, plus PDA helpers, account fetchers, and condition helpers for building token launches on Solana.

- Instruction builders cover bucket setup, deposits and claims, Raydium CPMM graduation, LP tokens and pool fees, unlocked buckets, and claim schedules
- `triggerConditionsV2` and `triggerBehaviorsV2` are permissionless cranks that resolve conditions and run end behaviors
- Conditions (`TimeAbsolute`, `TimeRelative`, `Triggered`, `TriggeredWithExpiry`, `Never`, `Always`) and end behaviors (six types) are documented with exact object shapes below
- Verified against `@metaplex-foundation/genesis` 0.44.0 and Genesis program `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`

**Jump to:** [Instructions](#instructions-reference) · [Raydium CPMM](#raydium-cpmm-graduation-signatures) · [Conditions and Behaviors](#condition-and-behavior-signatures) · [TimeCondition](#time-condition) · [EndBehavior](#end-behavior) · [Errors](#common-errors)

{% quick-links %}

{% quick-link title="NPM Package" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/genesis" description="@metaplex-foundation/genesis" /%}

{% quick-link title="TypeDoc" target="_blank" icon="JavaScript" href="https://mpl-genesis.typedoc.metaplex.com/" description="Auto-generated API docs" /%}

{% /quick-links %}

## Installation

The Genesis SDK installs from npm together with Umi and the Metaplex toolbox packages.

```bash
npm install @metaplex-foundation/genesis @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-toolbox \
  @metaplex-foundation/mpl-token-metadata
```

## Setup

The SDK registers as a Umi plugin with `.use(genesis())`.

```typescript {% title="setup.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { genesis } from '@metaplex-foundation/genesis';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(genesis())
  .use(mplTokenMetadata());
```

For complete implementation examples, see [Launch Pool](/smart-contracts/genesis/launch-pool) or [Presale](/smart-contracts/genesis/presale).

---

## Instructions Reference

The tables below list each Genesis instruction builder by area, with the accounts that must sign. "Payer only" means the instruction is permissionless: any wallet can send it, and funds always move to the addresses stored on the bucket.

### Core Instructions

| Function | Description | Signers |
|----------|-------------|---------|
| [initializeV2()](#initialize-v2) | Create Genesis Account and mint token | Authority, base mint |
| [finalizeV2()](#finalize-v2) | Lock configuration, activate launch | Authority |

### Bucket Creation Instructions

| Function | Description | Signers |
|----------|-------------|---------|
| [addLaunchPoolBucketV2()](#add-launch-pool-bucket-v2) | Add proportional distribution bucket | Authority |
| [addPresaleBucketV2()](#add-presale-bucket-v2) | Add fixed-price sale bucket | Authority |
| [addUnlockedBucketV2()](#add-unlocked-bucket-v2) | Add treasury/recipient bucket | Authority |
| [addRaydiumCpmmBucketV2()](#add-raydium-cpmm-bucket-v2) | Add Raydium CPMM graduation bucket | Authority |
| [addClaimScheduleBucketV2()](#add-claim-schedule-bucket-v2) | Add vesting bucket with a claim schedule | Authority |

### Launch Pool Instructions

| Function | Description | Signers |
|----------|-------------|---------|
| [depositLaunchPoolV2()](#deposit-launch-pool-v2) | Deposit SOL into Launch Pool | Depositor |
| [withdrawLaunchPoolV2()](#withdraw-launch-pool-v2) | Withdraw SOL (during deposit period) | Depositor |
| [claimLaunchPoolV2()](#claim-launch-pool-v2) | Claim tokens (after deposit period) | Payer only |
| [refundLaunchPoolV2()](#refund-launch-pool-v2) | Refund a deposit (failed threshold or exceeded soft cap) | Payer only |

### Presale Instructions

| Function | Description | Signers |
|----------|-------------|---------|
| [depositPresaleV2()](#deposit-presale-v2) | Deposit SOL into Presale | Depositor |
| [claimPresaleV2()](#claim-presale-v2) | Claim tokens (after deposit period) | Payer only |

### Unlocked Bucket Instructions

| Function | Description | Signers |
|----------|-------------|---------|
| [claimUnlockedV2()](#claim-unlocked-v2) | Send the bucket's base and quote token balances to its recipient | Payer only |

### Claim Schedule Instructions

| Function | Description | Signers |
|----------|-------------|---------|
| [claimClaimScheduleV2()](#claim-claim-schedule-v2) | Send vested tokens to the bucket recipient | Payer only |
| [setClaimSchedulePausedStateV2()](#claim-schedule-runtime-controls) | Pause or resume vesting | Authority |
| [cancelClaimScheduleBucketV2()](#claim-schedule-runtime-controls) | Stop vesting permanently | Authority or recipient |
| [transferRecipientClaimScheduleBucketV2()](#claim-schedule-runtime-controls) | Change the vesting recipient | Authority or recipient |

### Raydium CPMM Graduation Instructions

| Function | Description | Signers |
|----------|-------------|---------|
| [graduateToRaydiumCpmmV2()](#graduate-to-raydium-cpmm-v2) | Create the Raydium CPMM pool from the bucket's quote and base tokens | Payer only (+ backend signer if configured) |
| [postponeStartRaydiumCpmmBucketV2()](#postpone-start-raydium-cpmm-bucket-v2) | Move a postponable graduation start later | Authority |
| [claimRaydiumCpmmLpTokensV2()](#claim-raydium-cpmm-lp-tokens-v2) | Claim unlocked LP tokens | LP claim authority |
| [burnRaydiumCpmmLpTokensV2()](#burn-raydium-cpmm-lp-tokens-v2) | Burn unclaimed LP tokens | LP claim authority |
| [collectRaydiumCpmmFeesV2()](#collect-raydium-cpmm-fees-v2) | Collect Raydium creator fees to the Genesis fee wallet | Payer only |
| [collectRaydiumCpmmFeesWithCreatorFeeV2()](#collect-raydium-cpmm-fees-with-creator-fee-v2) | Collect creator fees and accrue the launch creator's share | Payer only |
| [claimRaydiumCreatorFeeV2()](#claim-raydium-creator-fee-v2) | Pay accrued creator fees to the creator wallet | Payer only |

### Condition and Behavior Instructions

| Function | Description | Signers |
|----------|-------------|---------|
| [triggerConditionsV2()](#trigger-conditions-v2) | Resolve every condition on one bucket | Payer only |
| [triggerBehaviorsV2()](#trigger-behaviors-v2) | Execute a bucket's end behaviors | Payer only |
| [set*BucketV2Behaviors()](#set-bucket-v2-behaviors) | Replace a bucket's end behaviors before finalization | Authority |

### Admin Instructions

| Function | Description | Signers |
|----------|-------------|---------|
| [revokeV2()](#revoke-v2) | Permanently revoke mint and/or freeze authority | Authority |
| [setBucketBackendSignerV2()](#set-bucket-backend-signer-v2) | Set, rotate, or clear a bucket's backend signer | Authority |

---

## Function Signatures

Each signature lists the arguments you normally pass. Accounts not shown, such as token accounts, token programs, and bucket signer PDAs, are derived by the SDK.

### initializeV2

```typescript
await initializeV2(umi, {
  baseMint,           // Signer - new token keypair
  quoteMint,          // PublicKey - deposit token (wSOL)
  fundingMode,        // number - use 0
  totalSupplyBaseToken, // bigint - supply with decimals
  name,               // string - token name
  symbol,             // string - token symbol
  uri,                // string - metadata URI
}).sendAndConfirm(umi);
```

### finalizeV2

```typescript
await finalizeV2(umi, {
  baseMint,           // PublicKey
  genesisAccount,     // PublicKey
}).sendAndConfirm(umi);
```

### addLaunchPoolBucketV2

```typescript
await addLaunchPoolBucketV2(umi, {
  genesisAccount,           // PublicKey
  baseMint,                 // PublicKey
  baseTokenAllocation,      // bigint - tokens for this bucket
  depositStartCondition,    // TimeCondition
  depositEndCondition,      // TimeCondition
  claimStartCondition,      // TimeCondition
  claimEndCondition,        // TimeCondition
  minimumDepositAmount,     // { amount: bigint } | null
  minimumQuoteTokenThreshold, // { amount: bigint } | null - floor, launch fails below it
  softCap,                  // { amount: bigint } | null - REQUIRED, ceiling on quote kept
  endBehaviors,             // EndBehavior[]
}).sendAndConfirm(umi);
```

{% callout type="warning" %}
`softCap` is a required argument as of `@metaplex-foundation/genesis` 0.42.0. Unlike the other Launch Pool extensions it has no default in the generated serializer, so pass `softCap: null` explicitly when the launch has no cap. See [Launch Pool Soft Cap](/smart-contracts/genesis/launch-pool#launch-pool-soft-cap) for behaviour.
{% /callout %}

### addPresaleBucketV2

```typescript
await addPresaleBucketV2(umi, {
  genesisAccount,           // PublicKey
  baseMint,                 // PublicKey
  baseTokenAllocation,      // bigint
  allocationQuoteTokenCap,  // bigint - SOL cap (sets price)
  depositStartCondition,    // TimeCondition
  depositEndCondition,      // TimeCondition
  claimStartCondition,      // TimeCondition
  claimEndCondition,        // TimeCondition
  minimumDepositAmount,     // bigint | null
  depositLimit,             // bigint | null - max per user
  endBehaviors,             // EndBehavior[]
}).sendAndConfirm(umi);
```

### addUnlockedBucketV2

An Unlocked bucket holds tokens for a single recipient, such as a team treasury. It receives base tokens from its own allocation and from rollover or reallocation behaviors, and quote tokens from `SendQuoteTokenPercentage` behaviors.

```typescript
await addUnlockedBucketV2(umi, {
  genesisAccount,       // PublicKey
  baseMint,             // PublicKey
  baseTokenAllocation,  // bigint - optional, usually 0n
  recipient,            // PublicKey - who receives claimed tokens
  claimStartCondition,  // TimeCondition
  claimEndCondition,    // TimeCondition
  backendSigner,        // { signer: PublicKey } | null - optional co-signer for claims
}).sendAndConfirm(umi);
```

### addRaydiumCpmmBucketV2

A Raydium CPMM bucket reserves base tokens and receives sale proceeds through end behaviors, then creates a Raydium CP-Swap pool at graduation. See [Locked LP Tokens](/smart-contracts/genesis/locked-lp-tokens) for how the LP lock works.

```typescript
await addRaydiumCpmmBucketV2(umi, {
  genesisAccount,        // PublicKey
  baseMint,              // PublicKey
  baseTokenAllocation,   // bigint - base tokens reserved for the pool
  startCondition,        // TimeCondition - earliest time graduation can run
  lpLockSchedule,        // ClaimSchedule | null - LP vesting; null = Genesis authority claims all LP
  lpClaimAuthority,      // PublicKey | null - null = Genesis authority
  burnLp,                // boolean - true burns all LP at graduation
  creatorFee,            // { wallet: PublicKey } | null - share of Raydium creator fees
  postponableStart,      // PostponableStart | null - allow postponeStartRaydiumCpmmBucketV2
  backendSigner,         // { signer: PublicKey } | null - co-signer for graduation and LP actions
  deferPoolCreationCost, // boolean - false: payer pre-funds pool creation now
  endBehaviors,          // EndBehavior[] - BaseTokenRollover / ReallocateBaseTokensOnFailure
}).sendAndConfirm(umi);
```

The bucket's `graduateCondition` is not an argument. The program creates it as a `Triggered` condition and fires it inside `graduateToRaydiumCpmmV2`, which makes `BucketTimes.Graduate` available as a `TimeRelative` reference for other buckets.

{% callout type="note" %}
A Raydium CPMM bucket must be the destination of exactly one `SendQuoteTokenPercentage` and exactly one `SendStartPrice` behavior, both from the same sale bucket. `finalizeV2` rejects the launch otherwise (`MissingRaydiumGraduationSource`, `DuplicateRaydiumGraduationSource`, `RaydiumGraduationSourceMismatch`). `burnLp: true` cannot be combined with an `lpLockSchedule` (`BurnLpConflictsWithLpLockSchedule`).
{% /callout %}

`PostponableStart` has the shape `{ maxPostpones: number, timesPostponed: 0, padding: Array(3).fill(0), delayBudgetSeconds: number }`. Create the bucket's PDA up front with `findRaydiumCpmmBucketV2Pda` so sale buckets can target it in their `endBehaviors` before it exists.

### addClaimScheduleBucketV2

A claim schedule bucket vests base tokens to one recipient over time. See [Project Vesting](/smart-contracts/genesis/project-vesting) for the vesting math and runtime controls.

```typescript
await addClaimScheduleBucketV2(umi, {
  genesisAccount,           // PublicKey
  baseMint,                 // PublicKey
  baseTokenAllocation,      // bigint
  recipient,                // PublicKey - defaults to the authority
  claimStartCondition,      // TimeCondition - claim gate
  claimSchedule,            // ClaimSchedule - start, duration, period, cliff
  pausable,                 // boolean - optional, default false
  cancelable,               // boolean - optional, default false
  cancelableByRecipient,    // boolean - optional, default false
  transferable,             // boolean - optional, default false
  transferableByRecipient,  // boolean - optional, default false
  backendSigner,            // { signer: PublicKey } | null
  endBehaviors,             // EndBehavior[] - at most one ReallocateBaseTokensOnCancel
}).sendAndConfirm(umi);
```

`ClaimSchedule` has the shape `{ startCondition, duration, period, cliffCondition, cliffAmountBps, reserved: Array(126).fill(0) }`. Build it with `createClaimSchedule({ startTime, endTime, cliffTime, cliffAmountBps, period })` for absolute times, or construct it with `createTimeRelativeCondition` start and cliff conditions to anchor vesting to graduation.

### depositLaunchPoolV2

```typescript
await depositLaunchPoolV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  amountQuoteToken,   // bigint - lamports
}).sendAndConfirm(umi);
```

### depositPresaleV2

```typescript
await depositPresaleV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  amountQuoteToken,   // bigint - lamports
}).sendAndConfirm(umi);
```

### withdrawLaunchPoolV2

```typescript
await withdrawLaunchPoolV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  amountQuoteToken,   // bigint - lamports
}).sendAndConfirm(umi);
```

### claimLaunchPoolV2

```typescript
await claimLaunchPoolV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  recipient,          // PublicKey
}).sendAndConfirm(umi);
```

### refundLaunchPoolV2

Refunds a Launch Pool deposit after the deposit window closes. The program derives the amount, so there is no amount argument: a missed `minimumQuoteTokenThreshold` refunds the full deposit, and an exceeded `softCap` refunds only the excess while leaving the depositor's token allocation intact.

```typescript
await refundLaunchPoolV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  recipient,          // PublicKey | Signer - depositor; base token account closed if they sign
}).sendAndConfirm(umi);
```

Only `payer` must sign, so refunds can be cranked permissionlessly on a depositor's behalf. Calling before the deposit window closes returns `LaunchPoolNotEnded`; calling when the floor was met and the cap was not exceeded returns `LaunchPoolThresholdMet`; calling twice returns `DepositAlreadyRefunded`.

### claimPresaleV2

```typescript
await claimPresaleV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  recipient,          // PublicKey
}).sendAndConfirm(umi);
```

### claimUnlockedV2

`claimUnlockedV2` sends the Unlocked bucket's full current base token balance and quote token balance to the recipient stored on the bucket, minus the protocol claim fee on the quote side.

```typescript
await claimUnlockedV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey - UnlockedBucketV2
  baseMint,           // PublicKey
  recipient,          // PublicKey - must match the bucket's recipient
  backendSigner,      // Signer - only if the bucket has a backend signer
}).sendAndConfirm(umi);
```

The claim can be repeated: later rollover or reallocation behaviors can credit more base tokens after an earlier claim. A claim with nothing left returns `UnlockedBucketAlreadyClaimed`, and a recipient that differs from the bucket's returns `RecipientMismatch`.

### claimClaimScheduleV2

`claimClaimScheduleV2` transfers every currently vested, unclaimed token to the bucket's stored recipient.

```typescript
await claimClaimScheduleV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey - ClaimScheduleBucketV2
  baseMint,           // PublicKey
  recipient,          // PublicKey - must match the bucket's recipient
  backendSigner,      // Signer - only if the bucket has a backend signer
}).sendAndConfirm(umi);
```

If the claim gate, linear start, or cliff is `TimeRelative`, call [triggerConditionsV2](#trigger-conditions-v2) on the claim schedule bucket first. A claim with nothing vested returns `NothingToClaim`.

### Claim Schedule Runtime Controls

The claim schedule runtime controls pause, cancel, or re-address a vesting bucket after finalization, and each one works only if the matching policy flag was set at creation.

```typescript
// Pause or resume vesting (requires pausable: true). Signer: Genesis authority.
await setClaimSchedulePausedStateV2(umi, {
  genesisAccount, bucket, signer: authority,
  paused: true, padding: Array(6).fill(0),
}).sendAndConfirm(umi);

// Stop vesting permanently (requires cancelable or cancelableByRecipient).
await cancelClaimScheduleBucketV2(umi, {
  genesisAccount, bucket, signer, // authority or recipient
  padding: Array(7).fill(0),
}).sendAndConfirm(umi);

// Change the recipient (requires transferable or transferableByRecipient).
await transferRecipientClaimScheduleBucketV2(umi, {
  genesisAccount, bucket, signer, // authority or recipient
  newRecipient,                   // PublicKey
  padding: Array(7).fill(0),
}).sendAndConfirm(umi);
```

A disabled policy returns `ClaimSchedulePolicyDisabled`, and a signer that the policy does not allow returns `ClaimScheduleUnauthorized`. After cancellation, a `ReallocateBaseTokensOnCancel` behavior run through `triggerBehaviorsV2` moves the unvested remainder.

### revokeV2

Permanently revokes mint and/or freeze authority for the base token.

```typescript
await revokeV2(umi, {
  genesisAccount,           // PublicKey
  baseMint,                 // PublicKey
  baseTokenProgram,         // PublicKey - required, e.g. SPL_TOKEN_PROGRAM_ID from mpl-toolbox
  revokeMintAuthority,      // boolean
  revokeFreezeAuthority,    // boolean
  padding: Array(5).fill(0), // required, no default
}).sendAndConfirm(umi);
```

### setBucketBackendSignerV2

`setBucketBackendSignerV2` sets, rotates, or clears the backend signer extension on any V2 bucket that supports one. It is the recovery path when a backend key is lost, because every action gated by that key, including user claims, otherwise stays blocked.

```typescript
await setBucketBackendSignerV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey - any V2 bucket with a backend signer slot
  authority,          // Signer - Genesis authority (defaults to identity)
  backendSigner,      // PublicKey - new co-signer; the default (all-zero) key clears it
}).sendAndConfirm(umi);
```

Rotating or clearing an existing backend signer works before or after `finalizeV2`. Adding a backend signer to a bucket that never had one is only allowed before finalization. The backend signer can be any key chosen by the Genesis authority.

---

## Raydium CPMM Graduation Signatures

Raydium CPMM graduation instructions create a Raydium CP-Swap pool from a Raydium CPMM bucket and then manage its LP tokens and pool fees. Use `deriveRaydiumPDAsV2(umi, baseMint, raydiumBucket, options)` to derive every Raydium account these instructions take.

### deriveRaydiumPDAsV2

`deriveRaydiumPDAsV2` returns the Raydium pool accounts for a Raydium CPMM bucket. The pool state is a Genesis-derived PDA, so nobody can create the pool before graduation.

```typescript
const raydium = deriveRaydiumPDAsV2(umi, baseMint, raydiumBucket, {
  quoteMint,   // PublicKey - optional, defaults to wSOL
  env,         // 'mainnet' | 'devnet' - optional, defaults to 'mainnet'
  creatorFee,  // boolean - optional, true selects the creator-fee AMM config
  ammConfig,   // PublicKey - optional override
});
// raydium.poolState, ammConfig, poolAuthority, lpMint, baseVault, quoteVault,
// createPoolFee, observationState, raydiumProgram, raydiumSigner, permission,
// creatorFeeShare, token0Mint, token1Mint, isProjectMintToken0
```

Pass `creatorFee: true` when the bucket has a `creatorFee` extension. A creator-fee AMM config without the extension, or the extension without a creator-fee AMM config, fails graduation with `InvalidCreatorFeeConfig`.

### graduateToRaydiumCpmmV2

`graduateToRaydiumCpmmV2` creates the Raydium pool, deposits the bucket's quote tokens and the matching base tokens at the sale's start price, and fires the bucket's `graduateCondition`.

```typescript
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 400_000 }))
  .add(
    graduateToRaydiumCpmmV2(umi, {
      genesisAccount,     // PublicKey
      bucket,             // PublicKey - RaydiumCpmmBucketV2
      baseMint,           // PublicKey
      quoteMint,          // PublicKey - optional, defaults to wSOL
      poolState: raydium.poolState,
      ammConfig: raydium.ammConfig,
      poolAuthority: raydium.poolAuthority,
      lpMint: raydium.lpMint,
      baseVault: raydium.baseVault,
      quoteVault: raydium.quoteVault,
      createPoolFee: raydium.createPoolFee,
      observationState: raydium.observationState,
      permission: raydium.permission,
      raydiumProgram: raydium.raydiumProgram,
      backendSigner,      // Signer - only if the bucket has a backend signer
    })
  )
  .sendAndConfirm(umi);
```

Graduation is permissionless: only the fee payer signs, plus the backend signer when the bucket has that extension. The instruction checks three things in order:

| Check | Error |
|-------|-------|
| The bucket has not graduated yet | `BucketAlreadyGraduated` |
| The funding sale did not fail (no `TransmitFailure` received) | `BucketLaunchFailed` |
| The bucket's `startCondition` is met | `GraduationNotStarted` |

Before graduating, run `triggerBehaviorsV2` on the sale bucket so the Raydium bucket has received its quote tokens and start price. If the `startCondition` is `TimeRelative`, run `triggerConditionsV2` on the Raydium bucket with the sale bucket as a remaining account first.

{% callout type="warning" %}
Graduation does not open claims on other buckets. Every Launch Pool, Unlocked, or claim schedule condition that is `TimeRelative` to `BucketTimes.Graduate` stays untriggered until someone calls [triggerConditionsV2](#trigger-conditions-v2) on that bucket with the Raydium bucket as a writable remaining account.
{% /callout %}

### postponeStartRaydiumCpmmBucketV2

`postponeStartRaydiumCpmmBucketV2` moves the graduation start later, and only works on buckets created with a `postponableStart` extension.

```typescript
await postponeStartRaydiumCpmmBucketV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey - RaydiumCpmmBucketV2
  authority,          // Signer - Genesis authority (defaults to identity)
  sourceBucket,       // PublicKey - sale bucket; required when startCondition is TimeRelative
  newStartValue,      // bigint - new unix time (TimeAbsolute) or new offset in seconds (TimeRelative)
  padding: Array(7).fill(0),
}).sendAndConfirm(umi);
```

Postponement is bounded by `maxPostpones` and `delayBudgetSeconds`, must happen at least 30 minutes before the scheduled graduation, and must move the start at least 24 hours out. Violations return `PostponeLimitReached`, `PostponeNotLater`, `PostponeExceedsMaxDelay`, `PostponeTooLate`, `PostponeTooSoon`, or `BucketNotPostponable`.

### claimRaydiumCpmmLpTokensV2

`claimRaydiumCpmmLpTokensV2` transfers unlocked LP tokens from the bucket signer to a destination token account, up to the amount the `lpLockSchedule` has vested.

```typescript
await claimRaydiumCpmmLpTokensV2(umi, {
  genesisAccount,            // PublicKey
  bucket,                    // PublicKey - RaydiumCpmmBucketV2
  baseMint,                  // PublicKey
  lpMint: raydium.lpMint,    // PublicKey
  recipient,                 // PublicKey - owner of the destination account
  destinationLpTokenAccount, // PublicKey - recipient's LP ATA, created if missing
  lpClaimAuthority,          // Signer - lpClaimAuthority, or the Genesis authority if unset
  backendSigner,             // Signer - only if the bucket has a backend signer
  amount,                    // bigint - LP tokens to claim
}).sendAndConfirm(umi);
```

Claiming before graduation returns `NoLpTokensToClaim`, a wrong signer returns `InvalidLpClaimAuthority`, and a claim with no LP tokens unlocked yet returns `InsufficientUnlockedAmount`. An `amount` above the unlocked balance is capped to it rather than rejected. An `lpLockSchedule` with `TimeRelative` conditions needs [triggerConditionsV2](#trigger-conditions-v2) on the Raydium bucket before claiming.

### burnRaydiumCpmmLpTokensV2

`burnRaydiumCpmmLpTokensV2` burns unclaimed LP tokens held by the bucket signer, permanently locking that share of pool liquidity.

```typescript
await burnRaydiumCpmmLpTokensV2(umi, {
  genesisAccount,          // PublicKey
  bucket,                  // PublicKey - RaydiumCpmmBucketV2
  baseMint,                // PublicKey
  lpMint: raydium.lpMint,  // PublicKey
  lpClaimAuthority,        // Signer
  backendSigner,           // Signer - only if the bucket has a backend signer
  amount,                  // bigint - capped to the unclaimed, unburned balance
}).sendAndConfirm(umi);
```

Burning ignores the `lpLockSchedule`, because it only forfeits value. To burn every LP token at graduation instead, create the bucket with `burnLp: true`.

### collectRaydiumCpmmFeesV2

`collectRaydiumCpmmFeesV2` collects the pool's accumulated Raydium creator fees and sends the quote side to the Genesis fee wallet, for pools created without a `creatorFee` extension.

```typescript
await collectRaydiumCpmmFeesV2(umi, {
  baseMint,                                  // PublicKey
  quoteMint,                                 // PublicKey - optional, defaults to wSOL
  poolState: raydium.poolState,
  ammConfig: raydium.ammConfig,
  poolAuthority: raydium.poolAuthority,
  baseVault: raydium.baseVault,
  quoteVault: raydium.quoteVault,
  raydiumProgram: raydium.raydiumProgram,
  creatorFeeShare: raydium.creatorFeeShare,
}).sendAndConfirm(umi);
```

The instruction returns successfully without a transfer when no fees have accumulated. A pool on a creator-fee AMM config returns `InvalidRaydiumAmmConfig`; use `collectRaydiumCpmmFeesWithCreatorFeeV2` for those pools.

### collectRaydiumCpmmFeesWithCreatorFeeV2

`collectRaydiumCpmmFeesWithCreatorFeeV2` collects creator fees from a pool whose bucket has a `creatorFee` extension, accrues the launch creator's share on the bucket, and sends the remainder to the Genesis fee wallet.

```typescript
await collectRaydiumCpmmFeesWithCreatorFeeV2(umi, {
  baseMint,                                  // PublicKey
  genesisAccount,                            // PublicKey
  raydiumCpmmBucket,                         // PublicKey - bucket with creatorFee extension
  poolState: raydium.poolState,
  ammConfig: raydium.ammConfig,              // creator-fee AMM config
  poolAuthority: raydium.poolAuthority,
  baseVault: raydium.baseVault,
  quoteVault: raydium.quoteVault,
  raydiumProgram: raydium.raydiumProgram,
  creatorFeeShare: raydium.creatorFeeShare,
}).sendAndConfirm(umi);
```

### claimRaydiumCreatorFeeV2

`claimRaydiumCreatorFeeV2` pays the accrued, unclaimed creator fee from the Raydium bucket to the wallet stored in its `creatorFee` extension. See [Creator Fees](/smart-contracts/genesis/creator-fees) for the end-to-end flow.

```typescript
await claimRaydiumCreatorFeeV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey - RaydiumCpmmBucketV2
  baseMint,           // PublicKey
  creatorFeeWallet,   // PublicKey - must match the creatorFee extension wallet
}).sendAndConfirm(umi);
```

When the quote mint is wSOL the fee is unwrapped and paid as native SOL. A wallet that differs from the extension returns `InvalidCreatorFeeWallet`.

---

## Condition and Behavior Signatures

Condition and behavior instructions advance a launch between phases. `triggerConditionsV2` resolves timing, `triggerBehaviorsV2` moves funds between buckets, and the `set*BucketV2Behaviors` family configures behaviors before finalization.

### triggerConditionsV2

`triggerConditionsV2` resolves every condition on one target bucket, including extension conditions such as a `claimSchedule` start and cliff or a Raydium `lpLockSchedule`. It is permissionless and only requires the fee payer to sign.

```typescript
await triggerConditionsV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey - the bucket whose conditions to resolve
  baseMint,           // PublicKey
})
  .addRemainingAccounts([
    // Every bucket the target's TimeRelative conditions reference, writable
    { pubkey: raydiumBucket, isSigner: false, isWritable: true },
  ])
  .sendAndConfirm(umi);
```

| Property | Value |
|----------|-------|
| Signer | Fee payer only |
| Target | One bucket per instruction |
| Remaining accounts | Every referenced bucket, **writable**, in any order |
| Self-references | Resolved without passing the target bucket again |
| Re-running | Safe; triggered conditions are skipped |

The instruction first resolves `TimeAbsolute` conditions on each remaining-account bucket, then resolves each `TimeRelative` condition on the target bucket whose reference is among them and whose time has passed. The recorded `triggeredTimestamp` is the reference time plus the offset, not the time the crank ran.

{% callout type="note" %}
`TimeRelative` conditions are never resolved lazily by deposits, claims, or graduation. After `graduateToRaydiumCpmmV2`, call `triggerConditionsV2` once per dependent bucket (Launch Pool, Unlocked, claim schedule) with the Raydium CPMM bucket as a writable remaining account. A cliff that is 90 days after graduation needs a second call after those 90 days.
{% /callout %}

### triggerBehaviorsV2

`triggerBehaviorsV2` executes every unprocessed end behavior on one source bucket (`primaryBucket`) and marks each one processed so it cannot run twice. It is permissionless and only requires the fee payer to sign.

```typescript
await triggerBehaviorsV2(umi, {
  genesisAccount,     // PublicKey
  primaryBucket,      // PublicKey - source bucket
  baseMint,           // PublicKey
})
  .addRemainingAccounts([
    // One (destination bucket, destination quote token account) pair per destination
    { pubkey: destinationBucket, isSigner: false, isWritable: true },
    { pubkey: destinationQuoteTokenAccount, isSigner: false, isWritable: true },
  ])
  .sendAndConfirm(umi);
```

The destination quote token account is the destination bucket's quote mint ATA. For a Raydium CPMM destination it is owned by the bucket signer PDA from `findRaydiumBucketSignerPda(umi, { bucket })`, not by the bucket itself. An odd number of remaining accounts returns `InvalidRemainingAccountsLength`.

| Source bucket | Ready when | Error if too early |
|---------------|------------|--------------------|
| Launch Pool | `depositEndCondition` is met | `LaunchPoolNotEnded` |
| Presale | `depositEndCondition` is met | `PresaleBucketNotEnded` |
| Raydium CPMM | The pool graduated, or the bucket was marked failed | `InvalidBucketState` |
| Claim schedule | Vesting was canceled, completed, or failed | `ClaimScheduleBucketNotEnded` |

### set*BucketV2Behaviors

The `set*BucketV2Behaviors` instructions replace the full `endBehaviors` list on an existing bucket. They require the Genesis authority and fail with `GenesisAccountFinalized` after `finalizeV2`.

```typescript
await setLaunchPoolBucketV2Behaviors(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  authority,          // Signer - Genesis authority (defaults to identity)
  padding: Array(3).fill(0), // required, no default
  endBehaviors,       // EndBehavior[] - replaces the existing list
}).sendAndConfirm(umi);
```

| Function | Bucket type | Allowed behaviors |
|----------|-------------|-------------------|
| `setLaunchPoolBucketV2Behaviors` | Launch Pool | `SendQuoteTokenPercentage`, `SendStartPrice`, `ReallocateBaseTokensOnFailure`, `TransmitFailure` |
| `setPresaleBucketV2Behaviors` | Presale | Launch Pool set plus `BaseTokenRollover` |
| `setRaydiumCpmmBucketV2Behaviors` | Raydium CPMM | `BaseTokenRollover`, `ReallocateBaseTokensOnFailure` |
| `setClaimScheduleBucketV2Behaviors` | Claim schedule | `ReallocateBaseTokensOnCancel` (at most one) |
| `setUnlockedBucketV2Behaviors` | Unlocked | None. Only an empty list is accepted |

The same signature applies to `setBondingCurveBucketV2Behaviors`, `setVaultBucketV2Behaviors`, and `setRaydiumClmmBucketV2Behaviors`. An unsupported behavior returns `BehaviorNotSupportedForBucketType`, and `SendQuoteTokenPercentage`, `BaseTokenRollover`, or `ReallocateBaseTokensOnFailure` totals above 10,000 bps return `BehaviorPercentageOverflow`.

---

## PDA Helpers

PDA helpers derive Genesis account addresses from their seeds, so buckets can reference each other before they exist.

| Function | Seeds |
|----------|-------|
| findGenesisAccountV2Pda() | `baseMint`, `genesisIndex` |
| findLaunchPoolBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findPresaleBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findUnlockedBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findRaydiumCpmmBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findClaimScheduleBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findRaydiumBucketSignerPda() | `bucket` (Raydium CPMM bucket) |
| findRaydiumSignerPda() | None (one per program) |
| findLaunchPoolDepositV2Pda() | `bucket`, `recipient` |
| findPresaleDepositV2Pda() | `bucket`, `recipient` |

```typescript
const [genesisAccountPda] = findGenesisAccountV2Pda(umi, { baseMint: mint.publicKey, genesisIndex: 0 });
const [bucketPda] = findLaunchPoolBucketV2Pda(umi, { genesisAccount: genesisAccountPda, bucketIndex: 0 });
const [depositPda] = findLaunchPoolDepositV2Pda(umi, { bucket: bucketPda, recipient: wallet });
const [raydiumBucketPda] = findRaydiumCpmmBucketV2Pda(umi, { genesisAccount: genesisAccountPda, bucketIndex: 0 });
```

Bucket indexes are counted per bucket type, so the first Launch Pool and the first Raydium CPMM bucket both use `bucketIndex: 0`.

---

## Fetch Functions

Fetch functions deserialize Genesis accounts. Every account type has `fetch*` (throws if missing), `safeFetch*` (returns `null`), and `fetchAll*` variants.

### Genesis Account

The Genesis Account stores top-level launch state including the [launch type](#launch-type). A backend crank sets the `launchType` field on-chain after creation via the `setLaunchTypeV2` instruction, so the value may initially be `Uninitialized` (0) until the crank processes it.

| Function | Returns |
|----------|---------|
| fetchGenesisAccountV2() | Genesis account state (throws if missing) |
| safeFetchGenesisAccountV2() | Genesis account state or `null` |
| fetchGenesisAccountV2FromSeeds() | Fetch by PDA seeds (`baseMint`, `genesisIndex`) |
| safeFetchGenesisAccountV2FromSeeds() | Same as above, returns `null` if missing |
| fetchAllGenesisAccountV2() | Batch fetch multiple genesis accounts |

```typescript
import {
  fetchGenesisAccountV2,
  fetchGenesisAccountV2FromSeeds,
  findGenesisAccountV2Pda,
  LaunchType,
} from '@metaplex-foundation/genesis';

// Fetch by PDA address
const [genesisAccountPda] = findGenesisAccountV2Pda(umi, {
  baseMint: mintAddress,
  genesisIndex: 0,
});
const account = await fetchGenesisAccountV2(umi, genesisAccountPda);
console.log(account.data.launchType); // 0 = Uninitialized, 3 = LaunchPoolV1

// Or fetch directly from seeds
const account2 = await fetchGenesisAccountV2FromSeeds(umi, {
  baseMint: mintAddress,
  genesisIndex: 0,
});

// Check launch type
if (account2.data.launchType === LaunchType.LaunchPoolV1) {
  console.log('This is a launch pool');
}
```

**Genesis account fields:** `authority`, `baseMint`, `quoteMint`, `totalSupplyBaseToken`, `totalAllocatedSupplyBaseToken`, `totalProceedsQuoteToken`, `fundingMode`, `launchType`, `bucketCount`, `finalized`

### GPA Builder — Query by Launch Type

Use `getGenesisAccountV2GpaBuilder()` to query all genesis accounts filtered by on-chain fields. This uses Solana's `getProgramAccounts` RPC method with byte-level filters for efficient lookups.

```typescript
import {
  getGenesisAccountV2GpaBuilder,
  LaunchType,
} from '@metaplex-foundation/genesis';

// Get all launch pool launches
const launchpools = await getGenesisAccountV2GpaBuilder(umi)
  .whereField('launchType', LaunchType.LaunchPoolV1)
  .getDeserialized();

// Filter by multiple fields
const finalizedLaunchpools = await getGenesisAccountV2GpaBuilder(umi)
  .whereField('launchType', LaunchType.LaunchPoolV1)
  .whereField('finalized', true)
  .getDeserialized();

for (const account of launchpools) {
  console.log(account.publicKey, account.data.baseMint, account.data.launchType);
}
```

{% callout type="note" %}
`launchType` is set retroactively by a backend crank after a launch is created. Recently created launches may still show `LaunchType.Uninitialized` (0) until the crank processes them.
{% /callout %}

### Buckets and Deposits

| Function | Returns |
|----------|---------|
| fetchLaunchPoolBucketV2() | Bucket state (throws if missing) |
| safeFetchLaunchPoolBucketV2() | Bucket state or `null` |
| fetchPresaleBucketV2() | Bucket state (throws if missing) |
| safeFetchPresaleBucketV2() | Bucket state or `null` |
| fetchUnlockedBucketV2() | Unlocked bucket state |
| fetchRaydiumCpmmBucketV2() | Raydium CPMM bucket state |
| fetchClaimScheduleBucketV2() | Claim schedule bucket state |
| fetchLaunchPoolDepositV2() | Deposit state (throws if missing) |
| safeFetchLaunchPoolDepositV2() | Deposit state or `null` |
| fetchPresaleDepositV2() | Deposit state (throws if missing) |
| safeFetchPresaleDepositV2() | Deposit state or `null` |

```typescript
const bucket = await fetchLaunchPoolBucketV2(umi, bucketPda);
const deposit = await safeFetchLaunchPoolDepositV2(umi, depositPda); // null if not found
const raydiumBucket = await fetchRaydiumCpmmBucketV2(umi, raydiumBucketPda);
console.log(raydiumBucket.graduateCondition.triggeredTimestamp); // Some(t) once graduated
```

**Bucket state fields:** `quoteTokenDepositTotal`, `weightedQuoteTokenTotal`, `depositCount`, `claimCount`, `refundCount`, `bucket.baseTokenAllocation`, `extensions`

**Deposit state fields:** `amountQuoteToken`, `weightedQuoteToken`, `claimed`, `refunded`

---

## Types

The types below are the argument and account shapes used across Genesis instructions. Every type is exported from `@metaplex-foundation/genesis`.

### LaunchPoolV2Extensions

Optional guards on a Launch Pool bucket, read from `bucket.extensions`. Every field is a Umi `Option`, so use `unwrapOption()` or check `.__option` before reading a value.

```typescript
{
  backendSigner: Option<BackendSigner>;
  depositPenalty: Option<LinearBpsScheduleV2>;
  withdrawPenalty: Option<LinearBpsScheduleV2>;
  bonusSchedule: Option<LinearBpsScheduleV2>;
  depositLimit: Option<DepositLimit>;                             // { limit: bigint }
  allowlist: Option<Allowlist>;
  claimSchedule: Option<ClaimSchedule>;
  minimumDepositAmount: Option<MinimumDepositAmount>;             // { amount: bigint }
  minimumQuoteTokenThreshold: Option<MinimumQuoteTokenThreshold>; // { amount: bigint } - floor
  softCap: Option<SoftCap>;                                       // { amount: bigint } - ceiling
}
```

Extensions can be added or removed individually with `addLaunchPoolBucketV2Extensions()` and `removeLaunchPoolBucketV2Extensions()`, selecting the field via `LaunchPoolV2ExtensionType`. Both are rejected once the Genesis Account is finalized.

### LaunchType

The on-chain launch type, set retroactively by a backend crank via the `setLaunchTypeV2` instruction. The launch type represents the underlying mechanism used for the launch.

```typescript
enum LaunchType {
  Uninitialized = 0,   // Not yet set by the crank
  LaunchPoolV1 = 3,    // Launch pool (proportional distribution)
}
```

The [Metaplex API](/api) returns this as a string (`'launchpool'`), while the on-chain SDK uses the numeric enum above.

### GenesisAccountV2

Top-level on-chain account for a Genesis launch. One account per token mint per launch index.

```typescript
{
  key: Key;
  bump: number;
  index: number;                          // Genesis index (usually 0)
  finalized: boolean;                     // true after finalizeV2()
  authority: PublicKey;                    // Launch creator
  baseMint: PublicKey;                     // Token being launched
  quoteMint: PublicKey;                    // Deposit token (e.g., wSOL)
  totalSupplyBaseToken: bigint;            // Total token supply
  totalAllocatedSupplyBaseToken: bigint;   // Supply allocated to buckets
  totalProceedsQuoteToken: bigint;         // Total deposits collected
  fundingMode: number;                     // Funding mode (0)
  launchType: number;                      // 0 = Uninitialized, 3 = LaunchPoolV1
  bucketCount: number;                     // Number of buckets
}
```

Account size: **136 bytes**. PDA seeds: `["genesis_v2", baseMint, genesisIndex]`.

### TimeCondition

A `TimeCondition` (SDK type `ConditionArgs`) is a 64-byte timing rule that records a `triggeredTimestamp` once met. Each variant has a different `padding` length, so build conditions with the SDK helpers rather than by hand.

| Variant | SDK helper | Met when | Resolves itself | `padding` |
|---------|------------|----------|-----------------|-----------|
| `TimeAbsolute` | `createTimeAbsoluteCondition(time)` | Clock reaches `time` | Yes, whenever an instruction checks it | 47 |
| `TimeRelative` | `createTimeRelativeCondition(bucket, bucketTime, timeOffset?)` | Reference bucket event + `timeOffset` has passed | No, only via `triggerConditionsV2` | 14 |
| `Triggered` | `createTriggeredCondition()` | The program fires it (graduation, bonding curve sell-out, presale sell-out) | Fired by the instruction that causes the event | 55 |
| `TriggeredWithExpiry` | `createTriggeredWithExpiryCondition(expiryTime)` | Program trigger or `expiryTime`, whichever is first | Yes, after `expiryTime` | 47 |
| `Never` | `createNeverCondition()` | Never | Not applicable | 55 |
| `Always` | None. Construct by hand | Always | Not applicable; records no timestamp | 55 |

```typescript {% title="conditions.ts" %}
import {
  BucketTimes,
  createNeverCondition,
  createTimeAbsoluteCondition,
  createTimeRelativeCondition,
  createTriggeredCondition,
  createTriggeredWithExpiryCondition,
} from '@metaplex-foundation/genesis';

// TimeAbsolute: { __kind, padding: Array(47), time, triggeredTimestamp: null }
const depositStart = createTimeAbsoluteCondition(1767225600n);

// TimeRelative: { __kind, bucketTime, padding: Array(14), timeOffset, bucket, triggeredTimestamp: null }
const claimStart = createTimeRelativeCondition(raydiumBucket, BucketTimes.Graduate, 0n);

// Triggered: { __kind, padding: Array(55), triggeredTimestamp: null }
const lpLockStart = createTriggeredCondition();

// TriggeredWithExpiry: { __kind, padding: Array(47), expiryTime, triggeredTimestamp: null }
const presaleEnd = createTriggeredWithExpiryCondition(1767830400n);

// Never: { __kind, padding: Array(55), triggeredTimestamp: null }
const lockedForever = createNeverCondition();

// Always (no helper)
const always = { __kind: 'Always', padding: Array(55).fill(0), triggeredTimestamp: null };
```

#### TimeRelative Bucket Times

A `TimeRelative` condition anchors to one event on the reference bucket, selected with the `BucketTimes` enum.

| `BucketTimes` | Reference bucket types |
|---------------|------------------------|
| `DepositStart`, `DepositEnd` | Launch Pool, Presale |
| `ClaimStart`, `ClaimEnd` | Launch Pool, Presale, Unlocked |
| `SwapStart`, `SwapEnd` | Bonding curve |
| `GraduateStart` | Raydium CPMM (its `startCondition`) |
| `Graduate` | Raydium CPMM (fires when the pool is created) |

`BucketTimes` also defines `LockStart` and `LockEnd` for lock buckets. A `bucketTime` that the reference bucket type does not have returns `InvalidPrimaryBucket` when the condition is resolved.

#### Condition Slots

Each condition field on a bucket accepts a subset of variants, and the program rejects others with `InvalidConditionTypeForSlot`.

| Slot | Allowed variants |
|------|------------------|
| Deposit start, Unlocked claim start, Raydium `startCondition`, claim schedule `claimStartCondition` | `TimeAbsolute`, `TimeRelative`, `Always` |
| Launch Pool and Presale `claimStartCondition` | `TimeAbsolute`, `TimeRelative` |
| Deposit end, claim end | `TimeAbsolute`, `TimeRelative`, `Never` |
| Presale `depositEndCondition` | End-slot variants plus `Triggered` and `TriggeredWithExpiry` |
| `ClaimSchedule` start and cliff | `TimeAbsolute`, `TimeRelative`, `Never` |
| Raydium `lpLockSchedule` start and cliff | `ClaimSchedule` variants plus `Triggered` (fires at graduation) |

### EndBehavior

An `EndBehavior` (SDK type `BehaviorArgs`) is an action stored on a source bucket that moves quote tokens, base tokens, a price, or a failure flag to a destination bucket after the source ends. Always pass `processed: false`; a pre-processed behavior returns `BehaviorAlreadyProcessed`.

| Variant | Effect on the destination | Allowed source buckets | `padding` |
|---------|---------------------------|------------------------|-----------|
| `SendQuoteTokenPercentage` | Sends `percentageBps` of the source's quote proceeds | Launch Pool, Presale, Bonding curve | 4 |
| `SendStartPrice` | Writes the sale's final price as the Raydium pool start price | Launch Pool, Presale, Bonding curve | 6 |
| `BaseTokenRollover` | Sends `percentageBps` of the remaining base tokens | Presale, Raydium CPMM, Raydium CLMM | 4 |
| `ReallocateBaseTokensOnFailure` | Failure only: sends `percentageBps` of the remaining base tokens | Launch Pool, Presale, Raydium CPMM, Raydium CLMM | 4 |
| `TransmitFailure` | Failure only: marks the destination as failed | Launch Pool, Presale | 6 |
| `ReallocateBaseTokensOnCancel` | Sends a canceled or completed vesting bucket's unvested remainder | Claim schedule | 6 |

```typescript {% title="endBehaviors.ts" %}
const endBehaviors = [
  { __kind: 'SendQuoteTokenPercentage', padding: Array(4).fill(0), destinationBucket, percentageBps: 8_000, processed: false },
  { __kind: 'SendStartPrice', padding: Array(6).fill(0), destinationBucket, processed: false },
  { __kind: 'BaseTokenRollover', padding: Array(4).fill(0), destinationBucket, percentageBps: 10_000, processed: false },
  { __kind: 'ReallocateBaseTokensOnFailure', padding: Array(4).fill(0), destinationBucket, percentageBps: 10_000, processed: false },
  { __kind: 'TransmitFailure', padding: Array(6).fill(0), destinationBucket, processed: false },
  { __kind: 'ReallocateBaseTokensOnCancel', padding: Array(6).fill(0), destinationBucket, processed: false },
];
```

`percentageBps` uses basis points, where `10_000` is 100%. A Launch Pool or Presale whose deposits end below `minimumQuoteTokenThreshold` runs only its failure behaviors (`ReallocateBaseTokensOnFailure`, `TransmitFailure`), and its quote tokens stay in the bucket for refunds. A `TransmitFailure` that targets a Raydium CPMM bucket must come from that bucket's graduation source (`TransmitFailureSourceMismatch`).

### Raydium CPMM Extension Types

`RaydiumCpmmV2ExtensionType` selects a Raydium CPMM bucket extension in `addRaydiumCpmmBucketV2Extensions()` and `removeRaydiumCpmmBucketV2Extensions()`, which are rejected after finalization.

```typescript
enum RaydiumCpmmV2ExtensionType {
  BackendSigner,     // { signer: PublicKey }
  LpLockSchedule,    // ClaimSchedule
  CreatorFee,        // { wallet: PublicKey }
  PostponableStart,  // PostponableStart
  LpClaimAuthority,  // PublicKey
  BurnLp,            // burn all LP at graduation
}
```

---

## Constants

Constants are exported from `@metaplex-foundation/genesis` for the program and the Raydium accounts Genesis accepts.

| Constant | Value |
|----------|-------|
| `GENESIS_PROGRAM_ID` | `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` |
| `WRAPPED_SOL_MINT` | `So11111111111111111111111111111111111111112` |
| `RAYDIUM_CP_SWAP_PROGRAM_ID_MAINNET` | `CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C` |
| `RAYDIUM_CP_SWAP_PROGRAM_ID_DEVNET` | `DRaycpLY18LhpbydsBWbVJtxpNv9oXPgjRSfpF2bWpYb` |
| `RAYDIUM_AMM_CONFIG_MAINNET` | `Bq9YmSkZ6f13L4rPsx9MxSXuyPfKCBbvrbvarKti1LdG` |
| `RAYDIUM_AMM_CONFIG_CREATOR_FEE_MAINNET` | `CRRS5ieQmBrZjWhcj99JuGrT5tyuWDaGAXLXLFjbAtjQ` |

---

## Common Errors

Genesis program errors surface by name (and numeric code) in the transaction logs and in the SDK's thrown `ProgramError`.

### General Errors

| Error | Cause |
|-------|-------|
| `insufficient funds` | Not enough SOL for fees |
| `already initialized` | Genesis Account exists |
| `GenesisAccountFinalized` (43) | Bucket, extension, or behavior change after `finalizeV2()` |
| `deposit period not active` | Outside deposit window |
| `ClaimNotStarted` (22) | Claim start condition not met, or a `TimeRelative` claim start not yet triggered |
| `InvalidSoftCap` (221) | `softCap.amount` is zero — pass `softCap: null` instead of `{ amount: 0n }` |
| `SoftCapBelowThreshold` (222) | `softCap.amount` is below `minimumQuoteTokenThreshold.amount` |
| `LaunchPoolNotEnded` (25) | `refundLaunchPoolV2()` or `triggerBehaviorsV2()` called before the deposit window closed |
| `LaunchPoolThresholdMet` (173) | Refund requested when the floor was met and the soft cap was not exceeded |
| `DepositAlreadyRefunded` (177) | `refundLaunchPoolV2()` called twice for the same deposit |
| `RecipientMismatch` (39) | Claim `recipient` differs from the recipient stored on the bucket |
| `UnlockedBucketAlreadyClaimed` (51) | `claimUnlockedV2()` with no base or quote balance left |
| `NothingToClaim` (233) | `claimClaimScheduleV2()` with nothing vested |
| `MissingBackendSigner` (145) / `InvalidBackendSigner` (69) | Bucket has a backend signer extension and it did not co-sign. If the key is lost, rotate it with `setBucketBackendSignerV2` |

### Condition Errors

| Error | Cause |
|-------|-------|
| `InvalidConditionTypeForSlot` (204) | Condition variant not allowed in that slot. See [Condition Slots](#condition-slots) |
| `InvalidPrimaryBucket` (149) | `TimeRelative` `bucketTime` does not exist on the reference bucket type |
| `UninitializedCondition` (203) | A condition was left zeroed; build it with an SDK helper |
| `InvalidConditionExpiry` (232) | `TriggeredWithExpiry` `expiryTime` is zero or out of range |
| `ClaimScheduleConditionNotTriggered` (241) | A `TimeRelative` claim schedule condition must be triggered before the cancel sweep can run |

### Graduation and Behavior Errors

| Error | Cause |
|-------|-------|
| `GraduationNotStarted` (189) | Raydium bucket `startCondition` not met; trigger a `TimeRelative` start first |
| `BucketLaunchFailed` (262) | The sale that funds the Raydium bucket failed (`TransmitFailure` received) |
| `BucketAlreadyGraduated` (188) | `graduateToRaydiumCpmmV2()` or a postpone called after graduation |
| `InvalidRaydiumAmmConfig` (202) | AMM config is not an approved Raydium config, or wrong config for the fee collect instruction |
| `InvalidCreatorFeeConfig` (216) | `creatorFee` extension and creator-fee AMM config do not match |
| `InvalidPoolStatePda` (219) | `poolState` was not derived with `deriveRaydiumPDAsV2` |
| `NoLpTokensToClaim` (200) | LP claim or burn before graduation |
| `InvalidLpClaimAuthority` (201) | LP claim or burn not signed by the LP claim authority |
| `InsufficientUnlockedAmount` (199) | LP claim when no LP tokens are unlocked yet |
| `BurnLpConflictsWithLpLockSchedule` (263) | `burnLp: true` combined with an `lpLockSchedule` |
| `MissingRaydiumGraduationSource` (270) | Raydium bucket is not targeted by exactly one `SendQuoteTokenPercentage` and one `SendStartPrice` |
| `DuplicateRaydiumGraduationSource` (271) | More than one sale bucket targets the same Raydium bucket |
| `RaydiumGraduationSourceMismatch` (272) | Quote tokens and start price come from different source buckets |
| `StartPriceAlreadySet` (273) | `SendStartPrice` already wrote the destination's price |
| `BehaviorNotSupportedForBucketType` (175) | Behavior variant not allowed on the source bucket type |
| `BehaviorPercentageOverflow` (168) | `SendQuoteTokenPercentage`, `BaseTokenRollover`, or `ReallocateBaseTokensOnFailure` totals exceed 10,000 bps |
| `ClaimScheduleMultipleCancelBehaviors` (240) | More than one `ReallocateBaseTokensOnCancel` on a claim schedule bucket |
| `BehaviorAlreadyProcessed` (247) | A behavior was written with `processed: true` |
| `InvalidRemainingAccountsLength` (198) | `triggerBehaviorsV2` remaining accounts are not (bucket, quote token account) pairs |
| `InvalidBucketState` (46) | `triggerBehaviorsV2` on a Raydium bucket that has neither graduated nor failed |
| `PostponeLimitReached` (225) – `BucketNotPostponable` (231) | `postponeStartRaydiumCpmmBucketV2` outside its policy limits |

---

## Notes

- `TimeRelative` conditions resolve only through `triggerConditionsV2`. Graduation fires the Raydium bucket's own `graduateCondition`, but it does not touch conditions on other buckets that reference it.
- `triggerConditionsV2`, `triggerBehaviorsV2`, and `graduateToRaydiumCpmmV2` only `assert_signer(payer)`, so a project backend, a keeper bot, or any user wallet can run the launch lifecycle. Graduation additionally needs the backend signer when the Raydium bucket has that extension.
- End behaviors, conditions, and extensions are fixed by `finalizeV2`, with two exceptions: `postponeStartRaydiumCpmmBucketV2` moves a graduation start on a bucket created with `postponableStart`, and `setBucketBackendSignerV2` rotates or clears an existing backend signer.
- Raydium CLMM graduation (`addRaydiumClmmBucketV2`, `graduateToRaydiumClmmV2`) exists in the SDK but is not documented on this page.
- Verified against `@metaplex-foundation/genesis` 0.44.0 and the deployed Genesis program release `genesis v0.41.0` (commit `86eb6121`). Token-2022 base mints are not supported by the deployed program. Source: [metaplex-foundation/genesis](https://github.com/metaplex-foundation/genesis). Maintained by Metaplex Foundation; last verified 2026-11-24.

---

## Quick Reference

| Item | Value |
|------|-------|
| Program | `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` |
| JS SDK | `@metaplex-foundation/genesis` (verified with 0.44.0) |
| Framework | Umi (`@metaplex-foundation/umi`) |
| Raydium CP-Swap (mainnet) | `CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C` |
| Permissionless cranks | `triggerConditionsV2`, `triggerBehaviorsV2`, `graduateToRaydiumCpmmV2` |
| Source | [GitHub](https://github.com/metaplex-foundation/genesis) |

---

## FAQ

### What is Umi and why is it required?
Umi is Metaplex's JavaScript framework for Solana. It provides a consistent interface for building transactions, managing signers, and interacting with Metaplex programs.

### Can I use the Genesis SDK in a browser?
Yes. The SDK works in both Node.js and browser environments. For browsers, use a wallet adapter for signing instead of keypair files.

### What's the difference between fetch and safeFetch?
`fetch` throws an error if the account doesn't exist. `safeFetch` returns `null` instead, useful for checking if an account exists.

### How do I retrieve the launch type for a token?
Fetch the `GenesisAccountV2` account using `fetchGenesisAccountV2FromSeeds()` with the token's mint address. The `launchType` field returns `0` (Uninitialized) or `3` (LaunchPoolV1). To query all launches of a given type, use the [GPA builder](#gpa-builder-query-by-launch-type). Alternatively, the [Metaplex API](/api) returns the launch type as a string in REST responses.

### Which Genesis instructions can any wallet call?
`triggerConditionsV2`, `triggerBehaviorsV2`, `graduateToRaydiumCpmmV2`, `collectRaydiumCpmmFeesV2`, `collectRaydiumCpmmFeesWithCreatorFeeV2`, `claimRaydiumCreatorFeeV2`, `claimUnlockedV2`, and `claimClaimScheduleV2` only require a fee payer signature. Funds always go to the addresses stored on the bucket. If a bucket has a backend signer extension, that signer must also co-sign graduation and claims.

### Why does a claim still fail after Raydium graduation?
Claim conditions that are `TimeRelative` to the Raydium bucket's `Graduate` time are not resolved by graduation or by the claim itself. Call [triggerConditionsV2](#trigger-conditions-v2) on each dependent bucket and pass the Raydium CPMM bucket as a writable remaining account.

### How do I handle transaction errors?
Wrap `sendAndConfirm` calls in try/catch blocks and match the error name against the [Common Errors](#common-errors) tables. Common errors include insufficient funds, already-finalized accounts, untriggered conditions, and graduation that has not started.

---

## Next Steps

For complete implementation tutorials:

- [Getting Started](/smart-contracts/genesis/getting-started) - Setup and first launch
- [Launch Pool](/smart-contracts/genesis/launch-pool) - Proportional distribution
- [Presale](/smart-contracts/genesis/presale) - Fixed-price sales
- [Project Vesting](/smart-contracts/genesis/project-vesting) - Claim schedule buckets
- [Locked LP Tokens](/smart-contracts/genesis/locked-lp-tokens) - Raydium LP lock verification
- [Creator Fees](/smart-contracts/genesis/creator-fees) - Creator fee collection and claims
