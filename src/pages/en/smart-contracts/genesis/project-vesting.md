---
title: Project Vesting
metaTitle: Project Token Vesting with ClaimScheduleBucketV2 | Genesis | Metaplex
description: Create on-chain project token vesting schedules with Genesis ClaimScheduleBucketV2, including cliffs, periodic unlocks, claims, pauses, cancellation, and recipient transfers.
created: '08-24-2026'
updated: '08-24-2026'
keywords:
  - Genesis project vesting
  - ClaimScheduleBucketV2
  - ClaimSchedule
  - token vesting
  - team token vesting
  - token cliff
  - Solana vesting
  - on-chain vesting
about:
  - Genesis project vesting
  - ClaimScheduleBucketV2
  - Token claim schedules
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - Configure a ClaimSchedule with a cliff and periodic linear unlocks
  - Add a ClaimScheduleBucketV2 before finalizing the Genesis account
  - Claim vested tokens to the current stored recipient
  - Configure optional pause, cancellation, and recipient transfer policies
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: What is the difference between ClaimScheduleBucketV2 and ClaimSchedule?
    a: ClaimScheduleBucketV2 is a Genesis outflow bucket that holds one recipient's allocation and runtime state. ClaimSchedule is the reusable cliff and linear unlock curve stored inside that bucket.
  - q: Does the vesting recipient have to submit each claim?
    a: No. ClaimClaimScheduleV2 is permissionless, but the program always transfers tokens to the recipient stored on the bucket. If a backend signer extension is configured, that signer must also authorize each claim.
  - q: Can a project change a vesting schedule after vesting begins?
    a: No. UpdateClaimScheduleBucketV2 works only before finalization, before the claim gate or either schedule condition is met, and before any claim. A TimeRelative claim gate, linear start, or cliff also disables updates immediately.
  - q: What happens to unvested tokens when a vesting bucket is canceled?
    a: Cancellation freezes vesting and preserves any vested amount for the recipient. If the bucket has a ReallocateBaseTokensOnCancel behavior, anyone can trigger that behavior to move the unvested remainder to an UnlockedBucketV2.
  - q: Can one ClaimScheduleBucketV2 vest tokens to multiple recipients?
    a: No. Each bucket has one recipient. Create one ClaimScheduleBucketV2 for each recipient or allocation that needs independent accounting or policy controls.
---

Genesis project vesting uses a `ClaimScheduleBucketV2` to release one token allocation to one recipient according to an on-chain cliff and periodic linear schedule. {% .lead %}

{% callout title="What You'll Build" %}
This guide creates a one-year project token vesting allocation with a 10% cliff, monthly linear unlocks, and optional authority controls.
{% /callout %}

## Summary

`ClaimScheduleBucketV2` is a first-class [Genesis](/smart-contracts/genesis) outflow bucket for project, team, advisor, or treasury token vesting. It stores the recipient, allocation, claim history, vesting curve, pause state, policy controls, and optional cancellation behavior onchain.

- One bucket vests one token allocation to one current recipient
- A `ClaimSchedule` combines an independent cliff with period-based linear unlocks
- Claims are permissionless but always pay the bucket's recipient
- Optional policies support authority pauses, cancellation, recipient cancellation, and recipient transfers

**Jump to:** [Quick Start](#quick-start) · [Vesting Mechanics](#claim-schedule-vesting-mechanics) · [Runtime Controls](#project-vesting-runtime-controls) · [Cancellation](#reallocating-unvested-tokens-after-cancellation) · [Reference](#quick-reference)

## ClaimScheduleBucketV2 and ClaimSchedule

`ClaimScheduleBucketV2` is the account that owns a project allocation, while `ClaimSchedule` is the reusable vesting curve embedded in that account.

| Type | Purpose |
|------|---------|
| `ClaimScheduleBucketV2` | Stores one recipient, allocation, claimed amount, schedule, claim gate, pause state, policies, and end behaviors |
| `ClaimSchedule` | Defines the cliff amount, cliff condition, linear start condition, duration, and unlock period |
| `ClaimScheduleV2Extensions` | Stores runtime policy flags and an optional backend claim signer |

{% callout type="note" %}
Genesis has no `ClaimScheduleBucketV1`. Use the `V2` account and instruction names for project vesting. A `ClaimSchedule` is also used by other bucket extensions, so the schedule type alone does not identify a project vesting bucket.
{% /callout %}

## Quick Start

The quick start adds a one-year vesting bucket with a 10% cliff and monthly linear unlocks to an initialized but not yet finalized Genesis V2 account.

Complete [Genesis setup](/smart-contracts/genesis/getting-started) first and reserve the vesting allocation from the base token supply. The sum of all bucket allocations must fit within the Genesis account's total supply.

### Create a Project Vesting Bucket

`addClaimScheduleBucketV2` creates the bucket before the Genesis account is finalized.

{% code-tabs-imported from="genesis/add_claim_schedule_bucket_v2" frameworks="umi" filename="addClaimScheduleBucketV2" /%}

Add all other distribution buckets, then call `finalizeV2` as described in [Genesis setup](/smart-contracts/genesis/getting-started). Finalization is irreversible.

### Claim Vested Project Tokens

`claimClaimScheduleV2` transfers every currently vested, unclaimed token to the bucket's stored recipient.

{% code-tabs-imported from="genesis/claim_claim_schedule_v2" frameworks="umi" filename="claimClaimScheduleV2" /%}

The payer does not have to be the recipient. The instruction creates the recipient's [associated token account](/solana/understanding-solana-accounts#associated-token-accounts-atas) when needed and can never redirect tokens to the payer.

{% callout type="note" %}
A claim can return `NothingToClaim` when no complete vesting period has elapsed since the previous claim. Wait for another period or check the fetched bucket state before sending the transaction.
{% /callout %}

## Claim Schedule Vesting Mechanics

A claim schedule unlocks the cliff allocation independently from the remaining linear allocation.

| Field | Constraint | Effect |
|-------|------------|--------|
| `startCondition` | `TimeAbsolute`, `TimeRelative`, or `Never` | Anchors the linear vesting timeline |
| `duration` | Greater than zero, no longer than 10 years | Defines when the linear allocation is fully vested |
| `period` | Greater than zero and no longer than `duration` | Makes linear vesting advance in discrete steps |
| `cliffCondition` | `TimeAbsolute`, `TimeRelative`, or `Never` | Unlocks the cliff independently from the linear schedule |
| `cliffAmountBps` | `0` to `10_000` | Assigns 0% to 100% of the allocation to the cliff |

For allocation `A` and cliff basis points `C`, the cliff amount is `A × C / 10,000`. The remaining `A - cliffAmount` vests linearly in complete `period` steps over `duration`.

{% callout type="note" %}
The cliff does not delay the linear schedule automatically. Set `startCondition` and `cliffCondition` to the intended timestamps explicitly; either condition may trigger before, during, or after the other.
{% /callout %}

{% callout type="warning" %}
Set the cliff no later than `startCondition + duration`. A successful claim after linear completion fires the bucket's end condition; a later cliff would then be beyond the frozen effective time and could never become claimable.
{% /callout %}

### Claim Gate and Vesting Curve

`claimStartCondition` gates token withdrawals, while `claimSchedule.startCondition` controls when the linear allocation accrues.

This separation supports schedules that accrue before claims open. For example, vesting can start on an employment date while `claimStartCondition` prevents withdrawals until a token generation event.

`TimeAbsolute` conditions update themselves when a claim checks them. `TimeRelative` conditions are passive and require `triggerConditionsV2` with each referenced bucket passed as a writable remaining account.

{% code-tabs-imported from="genesis/trigger_claim_schedule_conditions_v2" frameworks="umi" filename="triggerConditionsV2" /%}

Run this permissionless crank after the reference condition is met and before claiming or evaluating the vesting state.

### Periodic Linear Unlocks

The `period` field makes the linear allocation unlock in steps rather than continuously.

With a 365-day duration and a 30-day period, the linear allocation increases after each complete 30-day period. Any rounding remainder becomes claimable when the full duration ends.

### Pause-Adjusted Vesting Time

Pausing a bucket stops vesting time, and resuming shifts the effective timeline by the total paused duration.

The bucket records `pausedAt` and `totalSecondsPaused`. A cancellation while paused freezes the schedule at `pausedAt`, so time spent paused cannot increase the vested amount.

## Project Vesting Runtime Controls

Runtime controls are disabled by default and must be enabled with policy flags when the bucket is created.

| Policy flag | Authorized role | Instruction | Result |
|-------------|-----------------|-------------|--------|
| `pausable` | Genesis authority | `setClaimSchedulePausedStateV2` | Pauses or resumes vesting accrual |
| `cancelable` | Genesis authority | `cancelClaimScheduleBucketV2` | Freezes vesting at the cancellation time |
| `cancelableByRecipient` | Recipient | `cancelClaimScheduleBucketV2` | Lets the recipient freeze vesting |
| `transferable` | Genesis authority | `transferRecipientClaimScheduleBucketV2` | Changes the vesting recipient |
| `transferableByRecipient` | Recipient | `transferRecipientClaimScheduleBucketV2` | Lets the current recipient transfer the allocation |

{% callout type="warning" %}
Enable only the controls required by the project's vesting agreement. Authority cancellation or recipient transfer rights materially change the guarantees provided to the recipient.
{% /callout %}

### Pause and Resume Project Vesting

`setClaimSchedulePausedStateV2` pauses or resumes a bucket when `pausable` was enabled at creation.

{% code-tabs-imported from="genesis/pause_claim_schedule_bucket_v2" frameworks="umi" filename="pauseClaimScheduleBucketV2" /%}

Set `paused: false` to resume. Only the Genesis authority can use this control.

### Cancel Project Vesting

`cancelClaimScheduleBucketV2` freezes vesting but does not remove tokens that were already vested.

{% code-tabs-imported from="genesis/cancel_claim_schedule_bucket_v2" frameworks="umi" filename="cancelClaimScheduleBucketV2" /%}

The recipient can continue claiming the vested remainder. Unvested tokens stay in Genesis accounting unless a `ReallocateBaseTokensOnCancel` end behavior is configured and triggered.

### Transfer the Project Vesting Recipient

`transferRecipientClaimScheduleBucketV2` changes the wallet that receives all future claims.

{% code-tabs-imported from="genesis/transfer_claim_schedule_recipient_v2" frameworks="umi" filename="transferClaimScheduleRecipientV2" /%}

The authorized signer depends on whether `transferable` or `transferableByRecipient` was enabled.

## Reallocating Unvested Tokens After Cancellation

`ReallocateBaseTokensOnCancel` moves 100% of a canceled bucket's unvested remainder to an `UnlockedBucketV2`.

Configure the behavior before calling `finalizeV2`, either in `addClaimScheduleBucketV2.endBehaviors` or with `setClaimScheduleBucketV2Behaviors`. The Genesis program rejects behavior configuration after finalization.

{% code-tabs-imported from="genesis/reallocate_claim_schedule_on_cancel_v2" frameworks="umi" filename="reallocateClaimScheduleOnCancelV2" /%}

The behavior changes bucket balances, not the original allocation values. It can run only after the claim schedule bucket has ended, and each claim schedule bucket can have at most one cancellation reallocation behavior.

{% callout type="note" %}
Schedules using `TimeRelative` start or cliff conditions must have those conditions triggered before cancellation reallocation can calculate the vested amount. Run `triggerConditionsV2` with the required reference accounts first.
{% /callout %}

## Updating Project Vesting Before Launch

`updateClaimScheduleBucketV2` can replace the allocation, schedule, or claim start condition only before finalization and before vesting has begun.

The bucket rejects updates with `ClaimScheduleUpdateForbidden` after any tokens have been claimed, after `claimStartCondition` is met, or after the linear start or cliff condition is met. A `TimeRelative` condition in any of those three slots also disables updates immediately because the program cannot verify its referenced bucket during an update. Runtime pause, cancellation, and transfer controls use their dedicated instructions instead of the update instruction.

## Fetching Project Vesting State

`fetchClaimScheduleBucketV2` returns the allocation, claim progress, effective pause state, policies, and end behaviors.

{% code-tabs-imported from="genesis/fetch_claim_schedule_bucket_v2" frameworks="umi" filename="fetchClaimScheduleBucketV2" /%}

The accounting invariant is `baseTokenBalance = baseTokenAllocation - amountClaimed` until an end behavior reallocates an unvested balance.

## ClaimScheduleBucketV2 Account Fields

The `ClaimScheduleBucketV2` account stores fixed vesting state followed by a variable-length list of end behaviors.

| Field | Description |
|-------|-------------|
| `bucket` | Shared bucket header containing allocation, remaining balance, mints, index, and fee data |
| `recipient` | Wallet that receives every vested token claim |
| `amountClaimed` | Cumulative tokens transferred to the recipient |
| `claimSchedule` | Cliff and period-based linear vesting curve |
| `claimStartCondition` | Independent gate that must open before claims |
| `claimEndCondition` | Program-owned end condition fired by cancellation or natural completion |
| `paused` | Whether vesting time is currently stopped |
| `pausedAt` | Timestamp at which the current pause began |
| `totalSecondsPaused` | Accumulated pause duration excluded from vesting |
| `extensions` | Runtime policies and optional backend signer |
| `endBehaviors` | Actions available after the bucket ends |

## Common Project Vesting Errors

Claim schedule errors identify invalid schedule configuration, unauthorized controls, or actions attempted at the wrong lifecycle stage.

| Error | Cause | Resolution |
|-------|-------|------------|
| `InvalidClaimSchedulePeriod` | `period` is zero | Use a positive period |
| `InvalidClaimScheduleDuration` | `duration` is zero or over 10 years | Use a duration from 1 second through 315,360,000 seconds |
| `ClaimScheduleDurationTooShort` | `period` exceeds `duration` | Reduce the period or increase the duration |
| `InvalidClaimScheduleCliffAmount` | `cliffAmountBps` exceeds `10_000` | Use 0 to 10,000 basis points |
| `NothingToClaim` | No new cliff or complete linear period has vested | Wait for the next unlock or inspect bucket state |
| `ClaimScheduleUpdateForbidden` | The claim gate or schedule has begun, tokens were claimed, or a relevant condition is `TimeRelative` | Configure absolute-time fields before they trigger; relative schedules cannot be updated |
| `ClaimScheduleUnauthorized` | The signer is not allowed to use the control | Use the Genesis authority or recipient required by the enabled policy |
| `ClaimSchedulePolicyDisabled` | The requested pause, cancel, or transfer policy is off | Enable the policy when creating the bucket |
| `InvalidBackendSigner` | A configured backend signer did not authorize the claim | Include the configured backend signer |
| `ClaimScheduleConditionNotTriggered` | Cancellation reallocation depends on unresolved relative conditions | Trigger the relative schedule conditions first |

## Quick Reference

Project vesting is available through Genesis V2 and `@metaplex-foundation/genesis`.

| Item | Value |
|------|-------|
| Program | `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` |
| Tested SDK | `@metaplex-foundation/genesis@0.41.1` |
| Tested Umi compatibility | `@metaplex-foundation/umi@^1.4.1` |
| Bucket PDA seeds | `"claim_schedule_v2"`, Genesis account, `bucketIndex` as `u8` |
| Maximum vesting duration | 315,360,000 seconds (10 years) |
| Cliff range | 0 to 10,000 basis points |
| Recipients per bucket | One |
| Bucket creation fee | 0 |
| Devnet validation | Full add, finalize, pause, transfer, claim, cancel, and reallocation flow passed on 2026-08-24 ([test account](https://explorer.solana.com/address/3jjvwp9QnUfU2RJGzhJNJZPXH4HT6TrbaUcemku4ZYhT?cluster=devnet)) |
| Source | [metaplex-foundation/genesis](https://github.com/metaplex-foundation/genesis) |

## Notes

Project vesting has lifecycle and authorization constraints that should be included in the project's token distribution design.

- Add and configure `ClaimScheduleBucketV2` accounts before calling `finalizeV2`.
- Create one bucket per recipient or independently managed allocation.
- Claims are permissionless unless the optional backend signer extension is configured.
- A backend signer adds claim authorization but cannot redirect a claim away from the current stored recipient.
- Cancellation preserves vested tokens; reclaiming unvested tokens requires `ReallocateBaseTokensOnCancel`.
- A `Never` schedule permanently locks tokens and is primarily used for [locked LP tokens](/smart-contracts/genesis/locked-lp-tokens).

## FAQ

### What is the difference between ClaimScheduleBucketV2 and ClaimSchedule?

`ClaimScheduleBucketV2` is a Genesis outflow bucket that holds one recipient's allocation and runtime state. `ClaimSchedule` is the reusable cliff and linear unlock curve stored inside that bucket.

### Does the vesting recipient have to submit each claim?

No. `claimClaimScheduleV2` is permissionless, but the program always transfers tokens to the recipient stored on the bucket. If a backend signer extension is configured, that signer must also authorize each claim.

### Can a project change a vesting schedule after vesting begins?

No. `updateClaimScheduleBucketV2` works only before finalization, before the claim gate or either schedule condition is met, and before any claim. A `TimeRelative` claim gate, linear start, or cliff also disables updates immediately.

### What happens to unvested tokens when a vesting bucket is canceled?

Cancellation freezes vesting and preserves any vested amount for the recipient. If the bucket has a `ReallocateBaseTokensOnCancel` behavior, anyone can trigger that behavior to move the unvested remainder to an `UnlockedBucketV2`.

### Can one ClaimScheduleBucketV2 vest tokens to multiple recipients?

No. Each bucket has one recipient. Create one `ClaimScheduleBucketV2` for each recipient or allocation that needs independent accounting or policy controls.

## Glossary

Project vesting terminology distinguishes the bucket account, its embedded schedule, and its lifecycle controls.

| Term | Definition |
|------|------------|
| **ClaimScheduleBucketV2** | A Genesis outflow bucket that vests one base token allocation to one recipient |
| **ClaimSchedule** | A reusable cliff and period-based linear token unlock curve |
| **Claim gate** | The bucket-level `claimStartCondition` that controls when withdrawals may begin |
| **Cliff** | A percentage of the total allocation unlocked when an independent condition triggers |
| **Period** | The interval used to advance linear vesting in discrete steps |
| **Effective time** | Wall-clock time adjusted to exclude the bucket's paused duration |
| **Cancellation reallocation** | An end behavior that moves a canceled bucket's unvested remainder to an unlocked bucket |
