---
title: Raydium CPMM Graduation
metaTitle: Graduate a Genesis Launch Pool to Raydium CPMM | Metaplex
description: Add a Raydium CPMM bucket to a Genesis Launch Pool or Presale, fund it with end behaviors, graduate it into a Raydium CP-Swap pool, and manage locked LP tokens and fees.
created: '10-29-2026'
updated: '11-24-2026'
keywords:
  - Raydium CPMM graduation
  - RaydiumCpmmBucketV2
  - graduateToRaydiumCpmmV2
  - addRaydiumCpmmBucketV2
  - Genesis liquidity pool
  - LP lock schedule
  - SendStartPrice
  - Raydium CP-Swap
about:
  - Raydium CPMM graduation
  - Genesis liquidity
  - LP token locking
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - Add a RaydiumCpmmBucketV2 with a start condition, allocation, and LP lock schedule before finalizing
  - Point SendQuoteTokenPercentage and SendStartPrice end behaviors from the sale bucket at the Raydium bucket
  - Run triggerBehaviorsV2 on the sale bucket after deposits close
  - Call graduateToRaydiumCpmmV2 to create the Raydium CP-Swap pool
  - Trigger graduation-relative conditions and roll over unused base tokens
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: Who can call graduateToRaydiumCpmmV2?
    a: Any wallet. Graduation only requires a fee payer signature, plus the backend signer if the Raydium bucket has the backendSigner extension. It succeeds once the bucket's start condition is met and the sale's end behaviors have delivered quote tokens and a start price.
  - q: How is the Raydium pool starting price set?
    a: The SendStartPrice end behavior copies the sale's final price to the Raydium bucket. For a Launch Pool the price is the Launch Pool base allocation divided by total deposits, or by the soft cap when oversubscribed.
  - q: What happens to LP tokens after graduation?
    a: LP tokens are held by the Raydium bucket signer PDA. With lpLockSchedule they unlock to the LP claim authority over time; with burnLp they are burned at graduation; with neither, the LP claim authority can claim them immediately.
  - q: What does Raydium pool creation cost?
    a: Pool creation costs the rent for the Raydium pool accounts plus a 0.15 SOL Raydium pool creation fee. The payer of addRaydiumCpmmBucketV2 pre-funds it, or the graduation payer covers it when deferPoolCreationCost is true.
  - q: Can I delay graduation after the launch is live?
    a: Only if the Raydium bucket has the postponableStart extension. The Genesis authority can then call postponeStartRaydiumCpmmBucketV2 within the configured number of postpones and delay budget, at least 30 minutes before the scheduled graduation.
---

A Raydium CPMM bucket turns part of a [Genesis](/smart-contracts/genesis) sale's proceeds into a Raydium CP-Swap liquidity pool, a step called graduation, and holds the resulting LP tokens under a lock, burn, or claim policy. {% .lead %}

{% callout title="What You'll Build" %}
This guide adds a `RaydiumCpmmBucketV2` to a [Launch Pool](/smart-contracts/genesis/launch-pool) launch, routes 20% of the raised SOL into it, graduates it into a Raydium pool, and locks the LP tokens for one year with quarterly unlocks.
{% /callout %}

## Summary

`RaydiumCpmmBucketV2` receives quote tokens and a start price from a sale bucket, then `graduateToRaydiumCpmmV2` creates a Raydium CP-Swap pool at that price with a matching amount of base tokens.

- The sale bucket funds graduation with `SendQuoteTokenPercentage` and `SendStartPrice` [end behaviors](/smart-contracts/genesis/end-behaviors)
- Graduation is a permissionless crank that fires the bucket's `Graduate` time, which other buckets can reference with [`TimeRelative` conditions](/smart-contracts/genesis/conditions)
- LP tokens can be locked on a schedule, burned, or left claimable
- Applies to Genesis V2 Raydium CPMM buckets, not the V1 `graduateToRaydiumCpmmV1` flow or Raydium CLMM buckets

**Jump to:** [Lifecycle](#raydium-cpmm-graduation-lifecycle) · [Add the Bucket](#adding-a-raydium-cpmm-bucket) · [Fund](#funding-the-raydium-bucket-from-the-sale) · [Graduate](#graduating-to-a-raydium-cp-swap-pool) · [LP Tokens](#managing-raydium-lp-tokens) · [Fees](#collecting-raydium-pool-fees) · [Reference](#quick-reference)

## Raydium CPMM Graduation Lifecycle

A Raydium CPMM bucket moves through four states: `Initialized`, `Funded`, `Graduated`, or failed.

| Step | Instruction | Who | Result |
|------|-------------|-----|--------|
| 1. Add the bucket | `addRaydiumCpmmBucketV2` | Genesis authority, before `finalizeV2` | Bucket and bucket signer PDA created; pool creation cost pre-funded |
| 2. Fund the bucket | `triggerBehaviorsV2` on the sale bucket | Anyone, after deposits close | Quote tokens and start price delivered |
| 3. Resolve the start | `triggerConditionsV2` on the Raydium bucket | Anyone; only needed for a `TimeRelative` start | `startCondition` resolved |
| 4. Graduate | `graduateToRaydiumCpmmV2` | Anyone, after the start is met | Raydium pool created; `Graduate` time recorded |
| 5. Follow-up | `triggerBehaviorsV2` on the Raydium bucket, `triggerConditionsV2` on dependent buckets | Anyone | Unused base tokens rolled over; graduation-relative claims opened |

{% callout type="note" %}
Graduation creates a Raydium CP-Swap (CPMM) pool. Raydium CLMM graduation uses a separate `RaydiumClmmBucketV2` with its own instructions and is not covered here.
{% /callout %}

## Adding a Raydium CPMM Bucket

`addRaydiumCpmmBucketV2` creates the bucket before `finalizeV2` and fixes its allocation, graduation start, LP policy, and end behaviors.

{% code-tabs-imported from="genesis/add_raydium_cpmm_bucket_v2" frameworks="umi" filename="addRaydiumCpmmBucketV2" /%}

### Raydium Bucket Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `baseTokenAllocation` | Yes | Maximum base tokens the pool can receive. Size it to the sale allocation × percentage of proceeds sent here |
| `startCondition` | Yes | Earliest time graduation can run. A start slot: `TimeAbsolute`, `TimeRelative`, or `Always` |
| `bucketIndex` | No | Index for the PDA seeds `["raydium_cpmm_v2", genesisAccount, bucketIndex]`. Defaults to `0` |
| `lpLockSchedule` | No | `ClaimSchedule` that unlocks LP tokens over time. Cannot be combined with `burnLp` |
| `burnLp` | No | `true` burns every LP token at graduation, permanently locking the liquidity |
| `lpClaimAuthority` | No | Wallet allowed to claim or burn LP tokens. `null` means the Genesis authority |
| `creatorFee` | No | `{ wallet }` to receive a share of Raydium creator fees. Changes the AMM config used at graduation |
| `postponableStart` | No | Lets the Genesis authority delay graduation after finalization. Requires a `TimeAbsolute` start, or a `TimeRelative` start anchored to the sale's `DepositEnd` or `SwapEnd` |
| `backendSigner` | No | Extra co-signer required for graduation and LP claims or burns. The Genesis authority can rotate or clear it later with `setBucketBackendSignerV2` |
| `deferPoolCreationCost` | No | `false` (default) pre-funds pool creation from this payer; `true` charges it to the graduation payer |
| `endBehaviors` | No | Usually a `BaseTokenRollover` to send unused base tokens to an Unlocked bucket |

{% callout type="warning" %}
Every bucket allocation must add up to the Genesis total supply before `finalizeV2`. The Raydium allocation counts toward that total even though part of it may later be rolled over.
{% /callout %}

## Funding the Raydium Bucket from the Sale

The sale bucket funds the Raydium bucket through two end behaviors that must both point at it: `SendQuoteTokenPercentage` for the quote tokens and `SendStartPrice` for the price.

{% totem %}

```typescript {% title="launchPoolEndBehaviors.ts" %}
endBehaviors: [
  {
    __kind: 'SendQuoteTokenPercentage',
    padding: Array(4).fill(0),
    destinationBucket: raydiumBucket,
    percentageBps: 2_000, // 20% of proceeds become pool liquidity
    processed: false,
  },
  {
    __kind: 'SendStartPrice',
    padding: Array(6).fill(0),
    destinationBucket: raydiumBucket,
    processed: false,
  },
  {
    __kind: 'SendQuoteTokenPercentage',
    padding: Array(4).fill(0),
    destinationBucket: treasuryBucket, // Unlocked bucket
    percentageBps: 8_000,
    processed: false,
  },
]
```

{% /totem %}

After the sale's deposit window closes, anyone can run `triggerBehaviorsV2` on the sale bucket. Pass each destination bucket with its quote token account; the Raydium bucket's quote account is owned by its bucket signer PDA.

{% code-tabs-imported from="genesis/trigger_launch_pool_graduation_v2" frameworks="umi" filename="triggerBehaviorsV2" /%}

### Raydium Pool Starting Price

The pool opens at the sale's final price, stored as `priceNumerator / priceDenominator` base tokens per quote token.

| Sale bucket | Start price |
|-------------|-------------|
| Launch Pool | `baseTokenAllocation / min(quoteTokenDepositTotal, softCap)` |
| Presale | `baseTokenAllocation / allocationQuoteTokenCap` |
| Bonding curve | Current curve price at sell-out |

Graduation pairs `quoteTokenInSigner × priceNumerator / priceDenominator` base tokens with the quote tokens. A Launch Pool forwards its proceeds without a fee by default, so a Raydium allocation sized to the sale allocation × the percentage sent here is paired in full. Any base tokens graduation does not use, for example rounding dust or the effect of a fee override on the sale bucket, stay in Genesis until a [`BaseTokenRollover`](/smart-contracts/genesis/end-behaviors#recovering-unused-raydium-base-tokens-with-base-token-rollover) moves them.

## Graduating to a Raydium CP-Swap Pool

`graduateToRaydiumCpmmV2` creates the Raydium CP-Swap pool, deposits the paired tokens, and records the bucket's `Graduate` time.

The instruction is permissionless: any wallet can pay for it once the bucket's `startCondition` is met and the bucket holds quote tokens and a start price. `deriveRaydiumPDAsV2` derives every Raydium account the instruction needs.

{% code-tabs-imported from="genesis/graduate_to_raydium_cpmm_v2" frameworks="umi" filename="graduateToRaydiumCpmmV2" /%}

{% callout type="note" %}
Raise the compute unit limit to about 400,000 for graduation. On devnet, pass `{ env: 'devnet' }` to `deriveRaydiumPDAsV2`, and pass `{ creatorFee: true }` when the bucket has the `creatorFee` extension so the matching AMM config is used.
{% /callout %}

### What Graduation Changes Onchain

Graduation updates the Raydium bucket and fires the conditions that depend on it.

- The pool state account is a Genesis-derived PDA (`["raydium_pool_state", raydiumBucket]`), so nobody can front-run pool creation.
- `graduatedBaseTokenAmount` records the base tokens paired into the pool, and `lpTokenBalance` the LP tokens received.
- `graduateCondition.triggeredTimestamp` is set, which makes `BucketTimes.Graduate` available to `TimeRelative` conditions.
- A `Triggered` start condition on `lpLockSchedule` fires at the same timestamp.

### Opening Claims After Graduation

Buckets whose claims reference `BucketTimes.Graduate` open only after `triggerConditionsV2` runs on each of them with the Raydium bucket as a remaining account.

{% code-tabs-imported from="genesis/trigger_conditions_after_graduation_v2" frameworks="umi" filename="triggerConditionsV2" /%}

See [Conditions and Triggers](/smart-contracts/genesis/conditions#opening-claims-at-raydium-graduation) for the full pattern.

### Postponing Graduation

`postponeStartRaydiumCpmmBucketV2` lets the Genesis authority push the graduation start later, but only when the bucket was created with `postponableStart`.

| `postponableStart` field | Meaning |
|--------------------------|---------|
| `maxPostpones` | Maximum number of postponements |
| `delayBudgetSeconds` | Maximum total delay allowed across all postponements |
| `timesPostponed` | Pass `0`; the program counts postponements |

{% code-tabs-imported from="genesis/postpone_start_raydium_cpmm_bucket_v2" frameworks="umi" filename="postponeStartRaydiumCpmmBucketV2" /%}

A postponement must be sent at least 30 minutes before the currently scheduled graduation (`PostponeTooLate`), must move it later (`PostponeNotLater`), must put the new graduation at least 24 hours out (`PostponeTooSoon`), and must stay within the delay budget (`PostponeExceedsMaxDelay`). It fails once the bucket has graduated or its sale has failed.

## Managing Raydium LP Tokens

After graduation, LP tokens sit in an associated token account owned by the Raydium bucket signer PDA, and the bucket's LP policy decides who can take them and when.

| Policy | Configuration | Result |
|--------|---------------|--------|
| Time-locked | `lpLockSchedule` | LP tokens unlock to the LP claim authority on the schedule |
| Permanently locked | `lpLockSchedule` with `Never` start and cliff (`createNeverClaimSchedule()`) | LP tokens can never be claimed |
| Burned | `burnLp: true` | All LP tokens are burned at graduation |
| Claimable | Neither option | LP claim authority can claim all LP tokens immediately |

{% code-tabs-imported from="genesis/claim_raydium_cpmm_lp_tokens_v2" frameworks="umi" filename="claimRaydiumCpmmLpTokensV2" /%}

`claimRaydiumCpmmLpTokensV2` transfers the requested `amount`, capped at what the schedule has unlocked, and fails with `InsufficientUnlockedAmount` when nothing is unlocked. The instruction only reads the schedule's `triggeredTimestamp` values: a `Triggered` start fires at graduation, but `TimeAbsolute` or `TimeRelative` schedule conditions need `triggerConditionsV2` on the Raydium bucket first.

The LP claim authority can also call `burnRaydiumCpmmLpTokensV2` to burn unclaimed LP tokens at any time, regardless of the lock schedule. [Locked LP Tokens](/smart-contracts/genesis/locked-lp-tokens) explains how to verify a lock onchain.

## Collecting Raydium Pool Fees

Raydium pools created by Genesis accrue creator fees to the Genesis Raydium signer, and permissionless collect instructions route them out.

| Instruction | When to use | Result |
|-------------|-------------|--------|
| `collectRaydiumCpmmFeesV2` | Bucket has no `creatorFee` extension | Creator fees go to the Genesis secondary fee wallet |
| `collectRaydiumCpmmFeesWithCreatorFeeV2` | Bucket has the `creatorFee` extension | Fees are split; the creator share accrues on the bucket |
| `claimRaydiumCreatorFeeV2` | After collecting with creator fee | Pays the accrued creator share to the configured wallet |

{% code-tabs-imported from="genesis/collect_raydium_cpmm_fees_v2" frameworks="umi" filename="collectRaydiumCpmmFees" /%}

With the `creatorFee` extension, collect with `collectRaydiumCpmmFeesWithCreatorFeeV2` and then pay the creator with `claimRaydiumCreatorFeeV2`:

{% code-tabs-imported from="genesis/collect_raydium_cpmm_fees_with_creator_fee_v2" frameworks="umi" filename="collectRaydiumCpmmFeesWithCreatorFee" /%}

Both collect instructions succeed without a transfer when no fees have accrued.

Trading fee rates for Launch Pool and Presale pools are listed in [Protocol Fees](/smart-contracts/genesis#protocol-fees).

## Common Raydium CPMM Errors

Raydium CPMM errors identify a graduation attempted at the wrong time, a missing funding step, or an LP action by the wrong signer.

| Error | Cause | Resolution |
|-------|-------|------------|
| `GraduationNotStarted` | `startCondition` is not met | Wait for the start time; run `triggerConditionsV2` first for a `TimeRelative` start |
| `InvalidAmount` | No quote tokens or no start price on the bucket | Run `triggerBehaviorsV2` on the sale bucket first |
| `BucketAlreadyGraduated` | The pool already exists | Nothing to do; continue with follow-up steps |
| `BucketLaunchFailed` | The sale missed its threshold and transmitted failure | Run the Raydium bucket's failure behaviors instead |
| `InsufficientFunds` | The bucket signer cannot pay pool creation | Fund the payer when `deferPoolCreationCost` is `true` |
| `StartPriceAlreadySet` | A second sale sent a start price to this bucket | Use one sale bucket per Raydium bucket |
| `BurnLpConflictsWithLpLockSchedule` | Both `burnLp` and `lpLockSchedule` were set | Choose one LP policy |
| `InsufficientUnlockedAmount` | No LP tokens are unlocked yet | Wait for the next unlock; trigger schedule conditions first |
| `InvalidLpClaimAuthority` | LP claim or burn signed by the wrong wallet | Sign with the LP claim authority, or the Genesis authority when none is set |
| `MissingBackendSigner` | The bucket requires a backend co-signer | Add the configured backend signer, or rotate a lost key with `setBucketBackendSignerV2` |

## Quick Reference

| Item | Value |
|------|-------|
| Genesis program | `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` |
| Raydium CP-Swap (mainnet) | `CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C` |
| Raydium CP-Swap (devnet) | `DRaycpLY18LhpbydsBWbVJtxpNv9oXPgjRSfpF2bWpYb` |
| Bucket PDA seeds | `"raydium_cpmm_v2"`, Genesis account, `bucketIndex` (`u8`) |
| Pool state PDA seeds | `"raydium_pool_state"`, Raydium bucket (Genesis program) |
| Pool creation cost | Raydium account rent + 0.15 SOL pool creation fee |
| Graduation compute | ~400,000 compute units |
| Tested SDK | `@metaplex-foundation/genesis@0.44.0` |
| Source | [metaplex-foundation/genesis](https://github.com/metaplex-foundation/genesis) |

## Notes

- `graduateToRaydiumCpmmV2`, `triggerBehaviorsV2`, `triggerConditionsV2`, and the fee collect instructions are permissionless. Run them from a keeper or backend; nothing happens automatically.
- Graduation is one-shot. Quote tokens sent to a graduated Raydium bucket are rejected rather than stranded.
- Fund each Raydium bucket from exactly one sale bucket, with one `SendQuoteTokenPercentage` and one `SendStartPrice`.
- `lpLockSchedule` and `burnLp` are mutually exclusive.
- Every example on this page was run on devnet with `@metaplex-foundation/genesis@0.44.0` against the deployed Genesis release `genesis v0.41.0`, including graduation into a real Raydium CP-Swap pool. On devnet, pass `{ env: 'devnet' }` to `deriveRaydiumPDAsV2`. Token-2022 base mints are not supported by the deployed program.

## FAQ

### Who can call graduateToRaydiumCpmmV2?

Any wallet. Graduation only requires a fee payer signature, plus the backend signer if the Raydium bucket has the `backendSigner` extension. It succeeds once the bucket's start condition is met and the sale's end behaviors have delivered quote tokens and a start price.

### How is the Raydium pool starting price set?

The `SendStartPrice` end behavior copies the sale's final price to the Raydium bucket. For a Launch Pool the price is the Launch Pool base allocation divided by total deposits, or by the soft cap when oversubscribed.

### What happens to LP tokens after graduation?

LP tokens are held by the Raydium bucket signer PDA. With `lpLockSchedule` they unlock to the LP claim authority over time; with `burnLp` they are burned at graduation; with neither, the LP claim authority can claim them immediately.

### What does Raydium pool creation cost?

Pool creation costs the rent for the Raydium pool accounts plus a 0.15 SOL Raydium pool creation fee. The payer of `addRaydiumCpmmBucketV2` pre-funds it, or the graduation payer covers it when `deferPoolCreationCost` is `true`.

### Can I delay graduation after the launch is live?

Only if the Raydium bucket has the `postponableStart` extension. The Genesis authority can then call `postponeStartRaydiumCpmmBucketV2` within the configured number of postpones and delay budget, at least 30 minutes before the scheduled graduation.
