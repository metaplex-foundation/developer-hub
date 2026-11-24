---
title: End Behaviors
metaTitle: Genesis End Behaviors and triggerBehaviorsV2 | Metaplex
description: Reference for Genesis end behaviors — SendQuoteTokenPercentage, SendStartPrice, BaseTokenRollover, TransmitFailure, and reallocation — and when to run the permissionless triggerBehaviorsV2 crank.
created: '10-29-2026'
updated: '11-24-2026'
keywords:
  - Genesis end behaviors
  - triggerBehaviorsV2
  - SendQuoteTokenPercentage
  - SendStartPrice
  - BaseTokenRollover
  - TransmitFailure
  - ReallocateBaseTokensOnFailure
  - token launch proceeds routing
about:
  - Genesis end behaviors
  - Launch proceeds routing
  - Launch failure handling
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: What is an end behavior in Genesis?
    a: An end behavior is an action stored on a bucket that moves tokens or data to another bucket after the source bucket ends, such as sending sale proceeds to a treasury or to a Raydium graduation bucket. Behaviors run when someone calls triggerBehaviorsV2.
  - q: Who can call triggerBehaviorsV2?
    a: Any wallet. triggerBehaviorsV2 only requires a fee payer signature. Each behavior runs at most once because the program marks it processed.
  - q: What happens to end behaviors if a Launch Pool misses its minimum threshold?
    a: The Launch Pool enters failure mode. Only ReallocateBaseTokensOnFailure and TransmitFailure behaviors run, so deposited SOL stays in the bucket for depositor refunds.
  - q: Can I change end behaviors after finalizing?
    a: No. Configure behaviors when adding the bucket or with the matching set*BucketV2Behaviors instruction before finalizeV2. The program rejects behavior changes after finalization.
  - q: Why are there leftover base tokens after Raydium graduation?
    a: Graduation only moves the base tokens needed to match the quote tokens at the start price. Any remainder of the Raydium bucket allocation stays in Genesis until a BaseTokenRollover behavior on the Raydium bucket moves it to another bucket.
---

[Genesis](/smart-contracts/genesis) end behaviors are post-phase actions stored on a bucket, such as routing sale proceeds to a treasury or a Raydium pool, and `triggerBehaviorsV2` is the permissionless crank that executes them. {% .lead %}

## Summary

An end behavior moves quote tokens, base tokens, a price, or a failure flag from a source bucket to a destination bucket once the source bucket has ended.

- Six behavior types cover proceeds routing, graduation pricing, leftover tokens, and failure handling
- Behaviors are configured before `finalizeV2` and cannot change afterwards
- `triggerBehaviorsV2` runs every unprocessed behavior on one source bucket and needs only a fee payer
- A sale that misses its minimum threshold runs only its failure behaviors

**Jump to:** [Behavior Types](#genesis-end-behavior-types) · [Configuring](#configuring-end-behaviors) · [triggerBehaviorsV2](#running-end-behaviors-with-trigger-behaviors-v2) · [Graduation Routing](#routing-proceeds-to-raydium-graduation) · [Failure Handling](#failure-handling-with-transmit-failure)

## Genesis End Behavior Types

Genesis has six end behavior types, and each is allowed only on specific source bucket types.

| Behavior | What it does | Allowed source buckets |
|----------|--------------|------------------------|
| `SendQuoteTokenPercentage` | Sends `percentageBps` of the collected quote tokens (such as SOL) to the destination | Launch Pool, Presale, Bonding curve |
| `SendStartPrice` | Writes the sale's final price to a Raydium bucket as its pool start price | Launch Pool, Presale, Bonding curve |
| `BaseTokenRollover` | Sends `percentageBps` of the remaining base tokens to the destination | Presale, Raydium CPMM, Raydium CLMM |
| `ReallocateBaseTokensOnFailure` | Failure mode only: sends `percentageBps` of the remaining base tokens to the destination | Launch Pool, Presale, Raydium CPMM, Raydium CLMM |
| `TransmitFailure` | Failure mode only: marks a follow-on bucket as failed | Launch Pool, Presale |
| `ReallocateBaseTokensOnCancel` | Sends a canceled or completed vesting bucket's unvested remainder to the destination | Claim schedule |

The program rejects a behavior on an unsupported source bucket with `BehaviorNotSupportedForBucketType`.

### Behavior Object Shapes

Each behavior is a tagged object with a fixed `padding` length. Pass `processed: false` when configuring.

{% totem %}

```typescript {% title="endBehaviors.ts" %}
const endBehaviors = [
  { __kind: 'SendQuoteTokenPercentage', padding: Array(4).fill(0), destinationBucket, percentageBps: 8_000, processed: false },
  { __kind: 'SendStartPrice', padding: Array(6).fill(0), destinationBucket, processed: false },
  { __kind: 'BaseTokenRollover', padding: Array(4).fill(0), destinationBucket, percentageBps: 10_000, processed: false },
  { __kind: 'ReallocateBaseTokensOnFailure', padding: Array(4).fill(0), destinationBucket, percentageBps: 10_000, processed: false },
  { __kind: 'TransmitFailure', padding: Array(6).fill(0), destinationBucket, processed: false },
  { __kind: 'ReallocateBaseTokensOnCancel', padding: Array(6).fill(0), destinationBucket, processed: false },
]
```

{% /totem %}

`percentageBps` uses basis points, where `10_000` is 100%. Each `SendQuoteTokenPercentage` is calculated from the sale's total proceeds (deposits, capped at the soft cap when one is set), and each `BaseTokenRollover` from the same snapshotted balance, so two behaviors of `2_000` and `8_000` send 20% and 80% of the same amount.

## Configuring End Behaviors

End behaviors are set on the source bucket with the matching `set*BucketV2Behaviors` instruction, or for Raydium CPMM and claim schedule buckets also in their `add*BucketV2` instruction, and both must happen before `finalizeV2`.

| Source bucket | Set at creation | Replace before finalize |
|---------------|-----------------|-------------------------|
| Launch Pool | `setLaunchPoolBucketV2Behaviors` after `addLaunchPoolBucketV2Base` | `setLaunchPoolBucketV2Behaviors` |
| Presale | `setPresaleBucketV2Behaviors` after `addPresaleBucketV2Base` | `setPresaleBucketV2Behaviors` |
| Raydium CPMM | `addRaydiumCpmmBucketV2({ endBehaviors })` | `setRaydiumCpmmBucketV2Behaviors` |
| Claim schedule | `addClaimScheduleBucketV2({ endBehaviors })` | `setClaimScheduleBucketV2Behaviors` |

Launch Pool and Presale buckets are created with their `Base` instruction, because the combined `addLaunchPoolBucketV2` and `addPresaleBucketV2` instructions exceed Solana's 1,232-byte transaction size limit. A destination can be a bucket that has not been created yet. Derive its PDA first, for example with `findRaydiumCpmmBucketV2Pda` or `findUnlockedBucketV2Pda`, so the buckets can reference each other in any order.

{% callout type="warning" %}
Behaviors are permanent after `finalizeV2`. Check every destination address and percentage before finalizing.
{% /callout %}

## Running End Behaviors with triggerBehaviorsV2

`triggerBehaviorsV2` executes every unprocessed behavior on one source bucket (`primaryBucket`) and marks each one processed so it can never run twice.

| Property | Value |
|----------|-------|
| Signer | Fee payer only (permissionless) |
| Source | One bucket per instruction (`primaryBucket`) |
| Remaining accounts | One `(destination bucket, destination quote token account)` pair per distinct destination, all writable |
| Re-running | Safe; processed behaviors are skipped |

The destination quote token account is the [associated token account](/solana/understanding-solana-accounts#associated-token-accounts-atas) for the quote mint. It is owned by the destination bucket itself, except for Raydium buckets, where it is owned by the Raydium bucket signer PDA (`findRaydiumBucketSignerPda`).

{% code-tabs-imported from="genesis/trigger_launch_pool_graduation_v2" frameworks="umi" filename="triggerBehaviorsV2" /%}

### When Each Source Bucket Can Run Behaviors

Each source bucket type accepts `triggerBehaviorsV2` only after it has ended.

| Source bucket | Ready when | Error if too early |
|---------------|------------|--------------------|
| Launch Pool | `depositEndCondition` is met | `LaunchPoolNotEnded` |
| Presale | `depositEndCondition` is met | `PresaleBucketNotEnded` |
| Bonding curve | `swapEndCondition` is met (sell-out) | `BondingCurveNotEnded` |
| Raydium CPMM | The pool has graduated, or the bucket was marked failed | `InvalidBucketState` |
| Claim schedule | `claimEndCondition` is met (cancellation, completed vesting, or a transmitted failure) | `ClaimScheduleBucketNotEnded` |

{% callout type="note" %}
Run `triggerBehaviorsV2` on the sale bucket before the team claims proceeds. Raised SOL stays in the sale bucket until its `SendQuoteTokenPercentage` behaviors run, although depositors can still claim their base tokens.
{% /callout %}

## Routing Proceeds to Raydium Graduation

A Raydium CPMM bucket needs exactly one `SendQuoteTokenPercentage` and exactly one `SendStartPrice` behavior pointing at it, both from the same source bucket.

`SendQuoteTokenPercentage` supplies the quote side of the pool, and `SendStartPrice` supplies the ratio used to size the base side. For a Launch Pool the start price is `baseTokenAllocation / quoteTokenDepositTotal`, using the soft cap amount instead of the deposit total when the pool is oversubscribed.

At graduation the base tokens paired into the pool are `quoteTokenInSigner × priceNumerator / priceDenominator`, where `quoteTokenInSigner` is the quote amount the Raydium bucket actually received. Size the Raydium bucket's `baseTokenAllocation` to the Launch Pool allocation multiplied by the percentage sent to the pool: when 20% of the proceeds go to the pool, use 20% of the Launch Pool allocation. A Launch Pool forwards proceeds without a fee by default (launch fees are charged when the creator claims proceeds, see [Protocol Fees](/smart-contracts/genesis#protocol-fees)), so graduation then pairs the whole allocation. Add a `BaseTokenRollover` behavior anyway, so rounding dust or a fee override on the sale bucket cannot strand base tokens.

{% callout type="warning" %}
Never point two sale buckets at the same Raydium bucket. `SendStartPrice` can be written only once per destination, and graduation needs a single consistent source for the quote tokens and the price.
{% /callout %}

### Recovering Unused Raydium Base Tokens with BaseTokenRollover

Base tokens in the Raydium bucket allocation that graduation did not use stay in Genesis until a `BaseTokenRollover` behavior on the Raydium bucket moves them.

Add the behavior when creating the Raydium bucket, then run `triggerBehaviorsV2` with the Raydium bucket as `primaryBucket` after graduation.

{% code-tabs-imported from="genesis/rollover_raydium_cpmm_base_tokens_v2" frameworks="umi" filename="baseTokenRollover" /%}

## Failure Handling with TransmitFailure

A Launch Pool or Presale with a `minimumQuoteTokenThreshold` enters failure mode when total deposits end below the threshold, and only its failure behaviors run.

In failure mode, quote tokens stay in the sale bucket so depositors can call `refundLaunchPoolV2`. The two failure behaviors handle everything downstream:

| Behavior | Effect on the destination |
|----------|---------------------------|
| `ReallocateBaseTokensOnFailure` | Moves unsold base tokens from the sale bucket to the destination, usually an Unlocked bucket |
| `TransmitFailure` → Raydium CPMM | Marks the Raydium bucket failed, so graduation is closed (`BucketLaunchFailed`) and its own `ReallocateBaseTokensOnFailure` can run |
| `TransmitFailure` → Claim schedule | Ends the vesting bucket as failed, so its `ReallocateBaseTokensOnCancel` returns the full remaining balance. A schedule that already ended is left unchanged |
| `TransmitFailure` → Unlocked | Opens the Unlocked bucket's claim immediately, bypassing its claim start condition |

{% code-tabs-imported from="genesis/launch_pool_failure_handling_v2" frameworks="umi" filename="launchPoolFailureHandling" /%}

{% callout type="note" %}
An Unlocked bucket that receives late rollover or failure credits should use `createNeverCondition()` as its `claimEndCondition`. Base tokens credited after a closed claim window can never be claimed.
{% /callout %}

## Common End Behavior Errors

End behavior errors identify an unsupported behavior, a mismatched remaining-account list, or a source bucket that has not ended yet.

| Error | Cause | Resolution |
|-------|-------|------------|
| `BehaviorNotSupportedForBucketType` | The behavior is not allowed on that source bucket | Use a source from the [behavior table](#genesis-end-behavior-types) |
| `InvalidRemainingAccountsLength` | Remaining accounts are not `(bucket, quote token account)` pairs | Pass exactly one pair per destination |
| `InvalidSecondaryBucket` | A remaining account is not a valid destination bucket | Pass the destination bucket PDA from the behavior |
| `InvalidAtaDerivation` | The destination quote token account is not the canonical ATA | Derive it with `findAssociatedTokenPda` using the correct owner |
| `LaunchPoolNotEnded` | The Launch Pool deposit window is still open | Wait for `depositEndCondition` |
| `StartPriceAlreadySet` | A second `SendStartPrice` targeted the same Raydium bucket | Use one sale bucket per Raydium bucket |

## Notes

- `SendQuoteTokenPercentage`, `BaseTokenRollover`, and `ReallocateBaseTokensOnCancel` move token balances only. `ReallocateBaseTokensOnFailure` also moves allocation: it debits the source bucket's `baseTokenAllocation` and credits the destination's.
- A bucket can carry several behaviors of the same type with different destinations, for example to split proceeds. Two exceptions: a Raydium bucket accepts exactly one `SendQuoteTokenPercentage` and one `SendStartPrice`, and a claim schedule bucket allows at most one `ReallocateBaseTokensOnCancel`.
- With a wrapped SOL quote mint, claiming an Unlocked bucket closes its quote token account. Recreate the ATA before running a behavior that sends quote tokens to it again.
- Fees that apply when proceeds leave a sale bucket are listed in [Protocol Fees](/smart-contracts/genesis#protocol-fees).
- Examples were run on devnet with `@metaplex-foundation/genesis@0.44.0` against the deployed Genesis program release `genesis v0.41.0` (`GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`). Source: [metaplex-foundation/genesis](https://github.com/metaplex-foundation/genesis).

## FAQ

### What is an end behavior in Genesis?

An end behavior is an action stored on a bucket that moves tokens or data to another bucket after the source bucket ends, such as sending sale proceeds to a treasury or to a Raydium graduation bucket. Behaviors run when someone calls `triggerBehaviorsV2`.

### Who can call triggerBehaviorsV2?

Any wallet. `triggerBehaviorsV2` only requires a fee payer signature. Each behavior runs at most once because the program marks it processed.

### What happens to end behaviors if a Launch Pool misses its minimum threshold?

The Launch Pool enters failure mode. Only `ReallocateBaseTokensOnFailure` and `TransmitFailure` behaviors run, so deposited SOL stays in the bucket for depositor refunds.

### Can I change end behaviors after finalizing?

No. Configure behaviors when adding the bucket or with the matching `set*BucketV2Behaviors` instruction before `finalizeV2`. The program rejects behavior changes after finalization.

### Why are there leftover base tokens after Raydium graduation?

Graduation only moves the base tokens needed to match the quote tokens at the start price. Any remainder of the Raydium bucket allocation stays in Genesis until a `BaseTokenRollover` behavior on the Raydium bucket moves it to another bucket.

## Glossary

| Term | Definition |
|------|------------|
| **End behavior** | An action stored on a source bucket that runs after the bucket ends |
| **Source bucket** | The bucket whose behaviors run, passed as `primaryBucket` |
| **Destination bucket** | The bucket that receives tokens, a price, or a failure flag |
| **Failure mode** | The state of a sale that ended below its `minimumQuoteTokenThreshold` |
| **Start price** | The `priceNumerator / priceDenominator` ratio a Raydium bucket uses to size the pool |
| **Processed flag** | Per-behavior marker that prevents a behavior from running twice |
