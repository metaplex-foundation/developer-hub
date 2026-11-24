---
title: Conditions and Triggers
metaTitle: Genesis Conditions, TimeRelative Timing, and triggerConditionsV2 | Metaplex
description: How Genesis bucket conditions work, including TimeAbsolute, TimeRelative, Triggered, and Never conditions, and when to call the permissionless triggerConditionsV2 crank.
created: '10-29-2026'
updated: '11-24-2026'
keywords:
  - Genesis conditions
  - TimeRelative
  - TimeAbsolute
  - triggerConditionsV2
  - BucketTimes
  - claim start relative to graduation
  - Genesis crank
  - token launch timing
about:
  - Genesis conditions
  - Launch timing
  - Condition triggering
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Do TimeRelative conditions trigger automatically?
    a: No. A TimeAbsolute condition updates itself whenever an instruction checks it, but a TimeRelative condition stays untriggered until someone calls triggerConditionsV2 on the bucket that owns it and passes the referenced bucket as a writable remaining account.
  - q: Who can call triggerConditionsV2?
    a: Any wallet. triggerConditionsV2 only requires a fee payer signature, so a project backend, a keeper bot, or a user's wallet can run it.
  - q: What timestamp does a TimeRelative condition record if the crank runs late?
    a: The condition records the reference time plus the offset, not the time the crank ran. Running triggerConditionsV2 late delays when the condition becomes visible onchain but does not shift vesting or claim math.
  - q: How do I open claims when a Raydium pool is created?
    a: Set the claim start condition to TimeRelative with the Raydium CPMM bucket as the reference and BucketTimes.Graduate as the bucket time. After graduation, call triggerConditionsV2 on each dependent bucket with the Raydium bucket as a remaining account.
  - q: Can I change a TimeRelative condition after finalization?
    a: No. Bucket conditions are fixed by finalizeV2. The only exception is a Raydium CPMM graduation start with the postponableStart extension, which the Genesis authority can push later within the configured limits.
---

[Genesis](/smart-contracts/genesis) conditions decide when each bucket phase opens and closes, such as deposits, claims, and graduation, and `triggerConditionsV2` is the permissionless crank that resolves conditions that cannot resolve themselves. {% .lead %}

## Summary

A Genesis condition is a 64-byte timing rule stored on a bucket that becomes "triggered" once its moment has passed, at which point the program records a `triggeredTimestamp`.

- `TimeAbsolute` fires at a fixed Unix timestamp and resolves itself whenever an instruction checks it
- `TimeRelative` fires at another bucket's event plus an offset, and needs `triggerConditionsV2` to resolve
- `Triggered` conditions are fired by the program, for example when a Raydium pool is created
- `triggerConditionsV2` requires only a fee payer signature, so any wallet can run it

**Jump to:** [Condition Types](#genesis-condition-types) · [Condition Slots](#condition-slots-by-bucket-type) · [TimeRelative](#time-relative-conditions-and-bucket-times) · [triggerConditionsV2](#resolving-conditions-with-trigger-conditions-v2) · [Claims at Graduation](#opening-claims-at-raydium-graduation)

## Genesis Condition Types

Genesis supports six condition types, and each bucket slot accepts a subset of them.

| Type | SDK helper | Fires when | Resolves itself |
|------|------------|------------|-----------------|
| `TimeAbsolute` | `createTimeAbsoluteCondition(time)` | Clock reaches `time` | Yes, on any instruction that checks it |
| `TimeRelative` | `createTimeRelativeCondition(bucket, bucketTime, offset)` | Referenced bucket event + `offset` has passed | No, needs `triggerConditionsV2` |
| `Triggered` | `createTriggeredCondition()` | The program fires it, such as at graduation or presale sell-out | Fired by the instruction that causes the event |
| `TriggeredWithExpiry` | `createTriggeredWithExpiryCondition(expiry)` | Program trigger or `expiryTime`, whichever is first | Yes, after expiry |
| `Never` | `createNeverCondition()` | Never | Not applicable |
| `Always` | Construct `{ __kind: 'Always', ... }` | Always met | Not applicable, records no timestamp |

Every condition carries a `triggeredTimestamp` option. `None` means the condition has not resolved onchain yet; `Some(t)` records the moment it fired.

{% callout type="note" %}
Use the SDK helpers rather than building condition objects by hand. Each variant has a different `padding` length, and a wrong length fails serialization.
{% /callout %}

## Condition Slots by Bucket Type

Each condition field on a bucket is a "slot", and the program rejects condition types a slot does not support with `InvalidConditionTypeForSlot`.

| Slot | Allowed types |
|------|---------------|
| Start slots (deposit start, Unlocked claim start, Raydium graduation start, vesting claim start) | `TimeAbsolute`, `TimeRelative`, `Always` |
| Launch Pool and Presale `claimStartCondition` | `TimeAbsolute`, `TimeRelative` |
| End slots (deposit end, claim end) | `TimeAbsolute`, `TimeRelative`, `Never` |
| Presale `depositEndCondition` | End slot types plus `Triggered` and `TriggeredWithExpiry` |
| Bonding curve `swapEndCondition` | `Triggered` only (sell-out) |
| `ClaimSchedule` start and cliff | `TimeAbsolute`, `TimeRelative`, `Never` |
| Raydium `lpLockSchedule` start and cliff | Schedule types plus `Triggered`, which fires at graduation |
| Raydium `graduateCondition` | Program-managed `Triggered`, set when the pool is created |

The Raydium CPMM `graduateCondition` is not an argument. The program creates it as `Triggered` when the bucket is added and fires it inside `graduateToRaydiumCpmmV2`, which is what makes `BucketTimes.Graduate` usable as a reference.

## TimeRelative Conditions and Bucket Times

A `TimeRelative` condition resolves to `referenceBucket.<bucketTime>.triggeredTimestamp + timeOffset` once that time has passed.

| Field | Type | Meaning |
|-------|------|---------|
| `bucket` | `PublicKey` | The reference bucket. It can be any bucket of the same Genesis account, including one added later |
| `bucketTime` | `BucketTimes` | Which event on the reference bucket to anchor to |
| `timeOffset` | `bigint` (seconds) | Delay after the reference event. Use `0n` for "at the same moment" |

The `BucketTimes` values each map to one condition on a specific bucket type:

| `BucketTimes` | Reference bucket types |
|---------------|------------------------|
| `DepositStart`, `DepositEnd` | Launch Pool, Presale |
| `ClaimStart`, `ClaimEnd` | Launch Pool, Presale, Unlocked |
| `SwapStart`, `SwapEnd` | Bonding curve |
| `GraduateStart` | Raydium CPMM (the graduation `startCondition`) |
| `Graduate` | Raydium CPMM (fires when the pool is created) |

Pairing a `BucketTimes` value with a bucket type outside this table fails with `InvalidPrimaryBucket` when the condition is resolved.

{% totem %}

```typescript {% title="timeRelativeConditions.ts" %}
import { BucketTimes, createTimeRelativeCondition } from '@metaplex-foundation/genesis'

const DAY = 86_400n

// Opens at the moment the Raydium pool is created
const claimStart = createTimeRelativeCondition(raydiumBucket, BucketTimes.Graduate)

// Opens 90 days after the Raydium pool is created
const cliff = createTimeRelativeCondition(raydiumBucket, BucketTimes.Graduate, 90n * DAY)

// Opens 1 hour after the Launch Pool deposit window closes
const graduationStart = createTimeRelativeCondition(launchPoolBucket, BucketTimes.DepositEnd, 3_600n)
```

{% /totem %}

{% callout type="warning" %}
A `TimeRelative` condition can only resolve after its reference event has resolved onchain. If the reference is itself `TimeRelative`, trigger the reference bucket first, then the dependent bucket.
{% /callout %}

## Resolving Conditions with triggerConditionsV2

`triggerConditionsV2` resolves every condition on one target bucket, including extension conditions such as a `claimSchedule` start and cliff.

The instruction first resolves `TimeAbsolute` conditions on each reference bucket passed as a remaining account, then resolves each `TimeRelative` condition on the target bucket whose reference matches one of those accounts and whose time has passed.

| Property | Value |
|----------|-------|
| Signer | Fee payer only (permissionless) |
| Target | One bucket per instruction (`bucket` account) |
| Remaining accounts | Every reference bucket, **writable**, in any order |
| Self-references | A condition that references its own bucket resolves without passing it again |
| Re-running | Safe; triggered conditions are skipped |

{% code-tabs-imported from="genesis/trigger_conditions_after_graduation_v2" frameworks="umi" filename="triggerConditionsV2" /%}

### When to Call triggerConditionsV2

Call `triggerConditionsV2` after the reference event and offset have both passed, and before any instruction that depends on the condition.

| Dependent action | Trigger this bucket | Pass as remaining account |
|------------------|---------------------|---------------------------|
| Launch Pool claim opening at graduation | Launch Pool | Raydium CPMM bucket |
| Unlocked bucket claim opening at graduation | Unlocked bucket | Raydium CPMM bucket |
| Vesting claim gate, linear start, or cliff at graduation | Claim schedule bucket | Raydium CPMM bucket |
| Graduation start relative to the sale end | Raydium CPMM bucket | Launch Pool or Presale bucket |
| Depositor vesting (`claimSchedule` extension) relative to graduation | Launch Pool | Raydium CPMM bucket |

Each condition resolves only once its own time has passed. A vesting bucket with a cliff 90 days after graduation needs one crank at graduation for the claim gate and linear start, and a second crank 90 days later for the cliff.

{% callout type="note" %}
The recorded `triggeredTimestamp` is always the reference time plus the offset, not the time the crank ran. A late crank delays when claims can begin, but it does not change how many tokens have vested.
{% /callout %}

## Opening Claims at Raydium Graduation

The standard pattern for opening claims when liquidity goes live is a `TimeRelative` claim start that references the Raydium CPMM bucket's `Graduate` time.

1. Derive the Raydium CPMM bucket PDA with `findRaydiumCpmmBucketV2Pda` before adding the buckets that reference it.
2. Set `claimStartCondition` on the Launch Pool, Unlocked, and claim schedule buckets to `createTimeRelativeCondition(raydiumBucket, BucketTimes.Graduate, offset)`.
3. After `graduateToRaydiumCpmmV2` succeeds, call `triggerConditionsV2` on each of those buckets with the Raydium bucket as a remaining account.
4. Claims succeed from that point on.

The [Launch Pool lifecycle guide](/smart-contracts/genesis/launch-pool-lifecycle) shows this pattern end to end, and [Raydium CPMM Graduation](/smart-contracts/genesis/raydium-cpmm-graduation) covers the graduation itself.

{% callout type="warning" %}
If graduation never happens, conditions that reference `Graduate` never resolve. Add a `TransmitFailure` [end behavior](/smart-contracts/genesis/end-behaviors#failure-handling-with-transmit-failure) to the sale bucket so a failed sale opens or unwinds the dependent buckets instead of leaving tokens stuck.
{% /callout %}

## Common Condition Errors

Condition errors identify an unsupported condition type for a slot, an unresolved reference, or an instruction that ran before its condition was met.

| Error | Cause | Resolution |
|-------|-------|------------|
| `InvalidConditionTypeForSlot` | The condition type is not allowed in that slot | Use a type from the [slot table](#condition-slots-by-bucket-type) |
| `InvalidPrimaryBucket` | The `bucketTime` does not exist on the reference bucket type | Match `BucketTimes` to the reference bucket type |
| `UninitializedCondition` | A condition object was left zeroed | Build conditions with the SDK helpers |
| `LaunchPoolNotEnded` | `triggerBehaviorsV2` ran before the deposit end condition | Wait for the deposit end time |
| `GraduationNotStarted` | Graduation ran before the Raydium `startCondition` resolved | Wait for the start time, or trigger a `TimeRelative` start first |

## Notes

- A `TimeRelative` condition is never resolved by deposits, claims, or other instructions on its own bucket. Only `triggerConditionsV2` resolves it.
- `triggerConditionsV2` resolves one target bucket per instruction. Several calls can share one transaction if they fit.
- A `TimeRelative` claim gate, linear start, or cliff disables `updateClaimScheduleBucketV2`, because the program cannot verify the referenced bucket during an update. See [Project Vesting](/smart-contracts/genesis/project-vesting).
- `Always` never records a `triggeredTimestamp`, so it cannot be used as a reference for `TimeRelative` conditions or in a `ClaimSchedule`.
- Examples were run on devnet with `@metaplex-foundation/genesis@0.44.0` against the deployed Genesis program release `genesis v0.41.0` (`GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`). Source: [metaplex-foundation/genesis](https://github.com/metaplex-foundation/genesis).

## FAQ

### Do TimeRelative conditions trigger automatically?

No. A `TimeAbsolute` condition updates itself whenever an instruction checks it, but a `TimeRelative` condition stays untriggered until someone calls `triggerConditionsV2` on the bucket that owns it and passes the referenced bucket as a writable remaining account.

### Who can call triggerConditionsV2?

Any wallet. `triggerConditionsV2` only requires a fee payer signature, so a project backend, a keeper bot, or a user's wallet can run it.

### What timestamp does a TimeRelative condition record if the crank runs late?

The condition records the reference time plus the offset, not the time the crank ran. Running `triggerConditionsV2` late delays when the condition becomes visible onchain but does not shift vesting or claim math.

### How do I open claims when a Raydium pool is created?

Set the claim start condition to `TimeRelative` with the Raydium CPMM bucket as the reference and `BucketTimes.Graduate` as the bucket time. After graduation, call `triggerConditionsV2` on each dependent bucket with the Raydium bucket as a remaining account.

### Can I change a TimeRelative condition after finalization?

No. Bucket conditions are fixed by `finalizeV2`. The only exception is a Raydium CPMM graduation start with the `postponableStart` extension, which the Genesis authority can push later within the configured limits.

## Glossary

| Term | Definition |
|------|------------|
| **Condition** | A timing rule stored on a bucket that records a `triggeredTimestamp` once met |
| **Slot** | A specific condition field on a bucket, such as `claimStartCondition` |
| **Reference bucket** | The bucket a `TimeRelative` condition is anchored to |
| **BucketTimes** | Enum naming the reference bucket event, such as `DepositEnd` or `Graduate` |
| **Crank** | A permissionless instruction anyone can send to advance onchain state |
| **Graduate time** | The moment `graduateToRaydiumCpmmV2` created the Raydium pool |
