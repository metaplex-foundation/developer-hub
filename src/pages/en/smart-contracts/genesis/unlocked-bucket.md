---
title: Unlocked Buckets
metaTitle: Genesis Unlocked Buckets — Treasury and Non-Vesting Allocations | Metaplex
description: Use a Genesis UnlockedBucketV2 to receive raised SOL and hold non-vesting token allocations, and claim them with claimUnlockedV2 once the claim window opens.
created: '10-29-2026'
updated: '11-24-2026'
keywords:
  - Genesis unlocked bucket
  - UnlockedBucketV2
  - claimUnlockedV2
  - addUnlockedBucketV2
  - launch treasury
  - raised SOL withdrawal
  - team token allocation
about:
  - Genesis unlocked buckets
  - Treasury allocations
  - Token claims
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - Add an UnlockedBucketV2 with a recipient, allocation, and claim window before finalizing
  - Point the sale bucket's SendQuoteTokenPercentage end behavior at the Unlocked bucket
  - Run triggerBehaviorsV2 after deposits close to move the raised SOL
  - Call claimUnlockedV2 once the claim window opens
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: What is an Unlocked bucket in Genesis?
    a: An UnlockedBucketV2 is an outflow bucket that pays its full balance of base tokens and quote tokens to one recipient once its claim window opens. It has no deposits and no vesting.
  - q: When should I use an Unlocked bucket instead of a claim schedule bucket?
    a: Use an Unlocked bucket for funds the recipient should get all at once, such as raised SOL for the treasury or a market-maker allocation. Use a ClaimScheduleBucketV2 for team or investor tokens that must unlock over time.
  - q: Does the recipient have to sign claimUnlockedV2?
    a: No. Any payer can send claimUnlockedV2, but the tokens always go to the recipient stored on the bucket. Pass the recipient explicitly, because the SDK defaults the recipient to the payer.
  - q: Can I claim an Unlocked bucket more than once?
    a: Yes. Each claim sweeps the current balance, so later credits from rollover or reallocation behaviors can be claimed again while the claim window is open.
  - q: Is there a fee to claim raised SOL from an Unlocked bucket?
    a: The bucket's claim fee is deducted from the quote tokens when they are claimed. Current rates are listed under Protocol Fees on the Genesis overview page.
---

An `UnlockedBucketV2` is the [Genesis](/smart-contracts/genesis) bucket that pays its entire balance, base tokens and raised quote tokens alike, to one recipient as soon as its claim window opens. {% .lead %}

## Summary

An Unlocked bucket holds an optional base token allocation, receives quote tokens such as raised SOL through end behaviors, and lets anyone sweep both balances to its recipient during the claim window.

- One bucket has one recipient and no vesting curve
- The usual destination for sale proceeds, rolled-over Raydium tokens, and reallocated tokens from a failed sale
- `claimUnlockedV2` is permissionless and repeatable, but always pays the stored recipient
- Use a [claim schedule bucket](/smart-contracts/genesis/project-vesting) instead when tokens must vest

**Jump to:** [When to Use](#when-to-use-an-unlocked-bucket) · [Add](#adding-an-unlocked-bucket) · [Fund](#funding-an-unlocked-bucket) · [Claim](#claiming-from-an-unlocked-bucket) · [Errors](#common-unlocked-bucket-errors)

## When to Use an Unlocked Bucket

An Unlocked bucket fits any allocation the recipient should receive in full at a single moment, rather than over time.

| Use case | Bucket | Why |
|----------|--------|-----|
| Raised SOL for the project treasury | `UnlockedBucketV2` | Receives `SendQuoteTokenPercentage` proceeds and pays them out in one claim |
| Market-maker or exchange inventory | `UnlockedBucketV2` | Tokens are needed at listing, without a cliff |
| Destination for unused Raydium base tokens | `UnlockedBucketV2` | Receives `BaseTokenRollover` credits after graduation |
| Destination for a failed sale's unsold tokens | `UnlockedBucketV2` | Receives `ReallocateBaseTokensOnFailure` credits |
| Team, advisor, or investor tokens | [`ClaimScheduleBucketV2`](/smart-contracts/genesis/project-vesting) | Needs a cliff and linear unlocks |
| Depositor vesting in a Launch Pool | Launch Pool `claimSchedule` extension | Vests each depositor's own tokens |

## Adding an Unlocked Bucket

`addUnlockedBucketV2` creates the bucket before `finalizeV2` with a recipient, a base token allocation, and a claim window.

{% code-tabs-imported from="genesis/add_unlocked_treasury_bucket_v2" frameworks="umi" filename="addUnlockedBucket" /%}

| Argument | Description |
|----------|-------------|
| `recipient` | Wallet that receives every claim |
| `baseTokenAllocation` | Base tokens reserved from the total supply. `0n` for a bucket that only receives quote tokens |
| `claimStartCondition` | When claims open. A start slot: `TimeAbsolute`, `TimeRelative`, or `Always` |
| `claimEndCondition` | When claims close. `TimeAbsolute`, `TimeRelative`, or `Never` |
| `backendSigner` | Optional co-signer required on every claim. The Genesis authority can rotate or clear it later with `setBucketBackendSignerV2` |
| `bucketIndex` | PDA seeds `["unlocked_v2", genesisAccount, bucketIndex]`. Defaults to `0` |

{% callout type="warning" %}
Use `createNeverCondition()` as the claim end for any Unlocked bucket that receives `BaseTokenRollover` or failure reallocations. Tokens credited after the claim window closes can never be claimed.
{% /callout %}

`updateUnlockedBucketV2` can change the allocation and claim conditions before `finalizeV2`. Unlocked buckets do not run end behaviors of their own; they are always a destination.

## Funding an Unlocked Bucket

An Unlocked bucket starts with its base token allocation and receives everything else from other buckets' [end behaviors](/smart-contracts/genesis/end-behaviors).

| Credit | Source bucket behavior | Typical timing |
|--------|------------------------|----------------|
| Raised quote tokens | `SendQuoteTokenPercentage` on a Launch Pool, Presale, or bonding curve | After deposits close |
| Unused Raydium base tokens | `BaseTokenRollover` on a Raydium CPMM bucket | After graduation |
| Unsold base tokens on failure | `ReallocateBaseTokensOnFailure` on a sale or Raydium bucket | After a failed sale |
| Unvested tokens | `ReallocateBaseTokensOnCancel` on a claim schedule bucket | After cancellation |

Pass the Unlocked bucket and its quote token account as a remaining-account pair to `triggerBehaviorsV2`. The quote token account is the [associated token account](/solana/understanding-solana-accounts#associated-token-accounts-atas) owned by the bucket for the quote mint.

{% code-tabs-imported from="genesis/trigger_launch_pool_graduation_v2" frameworks="umi" filename="triggerBehaviorsV2" /%}

## Claiming from an Unlocked Bucket

`claimUnlockedV2` sweeps the bucket's full base token balance and its quote token balance, minus the claim fee, to the stored recipient.

{% code-tabs-imported from="genesis/claim_unlocked_v2" frameworks="umi" filename="claimUnlockedV2" /%}

| Rule | Detail |
|------|--------|
| Signer | Any fee payer; the recipient does not need to sign |
| Destination | Always the stored `recipient`; a mismatch fails with `RecipientMismatch` |
| SDK default | `recipient` defaults to the payer, so pass it explicitly when a crank claims |
| Window | Claim start must be met and claim end not met |
| Repeat claims | Allowed whenever there is a new balance to sweep |
| Backend signer | Must co-sign if configured |

{% callout type="note" %}
Run `triggerBehaviorsV2` on the sale bucket before claiming. Until then, the raised SOL is still in the sale bucket and the claim only pays out base tokens.
{% /callout %}

### Claiming at Raydium Graduation

A `TimeRelative` claim start that references `BucketTimes.Graduate` opens only after `triggerConditionsV2` runs on the Unlocked bucket with the Raydium bucket as a remaining account. See [Conditions and Triggers](/smart-contracts/genesis/conditions#opening-claims-at-raydium-graduation).

### Claiming After a Failed Sale

A sale with a `TransmitFailure` behavior pointing at the Unlocked bucket opens the claim immediately when the sale fails, ignoring the claim start condition. The claim end condition still applies.

## Common Unlocked Bucket Errors

Unlocked bucket errors identify a claim outside its window, a wrong recipient, or a bucket with nothing left to sweep.

| Error | Cause | Resolution |
|-------|-------|------------|
| `RecipientMismatch` | `recipient` differs from the bucket's stored recipient | Fetch the bucket and pass `bucket.recipient` |
| `UnlockedBucketAlreadyClaimed` | Both base and quote balances are zero | Wait for new credits, or nothing remains |
| `InvalidBackendSigner` | The configured backend signer did not co-sign | Add the backend signer, or rotate a lost key with `setBucketBackendSignerV2` |
| `ClaimNotStarted` | The claim start condition is not met | Wait, or run `triggerConditionsV2` first for a `TimeRelative` start |
| `UnlockedBucketClaimEnded` | The claim end condition has passed | Use a `Never` claim end on buckets that receive late credits |

## Notes

- With a wrapped SOL quote mint, a claim closes the bucket's quote token account. Recreate the ATA before running another behavior that sends quote tokens to the bucket.
- A `TransmitFailure` from any sale opens the bucket, so attach it only from the sale whose graduation the bucket waits for.
- Claim fees are listed under [Protocol Fees](/smart-contracts/genesis#protocol-fees).
- Examples were run on devnet with `@metaplex-foundation/genesis@0.44.0` against the deployed Genesis program release `genesis v0.41.0` (`GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`). Source: [metaplex-foundation/genesis](https://github.com/metaplex-foundation/genesis).

## FAQ

### What is an Unlocked bucket in Genesis?

An `UnlockedBucketV2` is an outflow bucket that pays its full balance of base tokens and quote tokens to one recipient once its claim window opens. It has no deposits and no vesting.

### When should I use an Unlocked bucket instead of a claim schedule bucket?

Use an Unlocked bucket for funds the recipient should get all at once, such as raised SOL for the treasury or a market-maker allocation. Use a `ClaimScheduleBucketV2` for team or investor tokens that must unlock over time.

### Does the recipient have to sign claimUnlockedV2?

No. Any payer can send `claimUnlockedV2`, but the tokens always go to the recipient stored on the bucket. Pass the recipient explicitly, because the SDK defaults the recipient to the payer.

### Can I claim an Unlocked bucket more than once?

Yes. Each claim sweeps the current balance, so later credits from rollover or reallocation behaviors can be claimed again while the claim window is open.

### Is there a fee to claim raised SOL from an Unlocked bucket?

The bucket's claim fee is deducted from the quote tokens when they are claimed. Current rates are listed under [Protocol Fees](/smart-contracts/genesis#protocol-fees) on the Genesis overview page.

## Glossary

| Term | Definition |
|------|------------|
| **UnlockedBucketV2** | A Genesis outflow bucket that pays its full balance to one recipient during a claim window |
| **Recipient** | The wallet stored on the bucket that receives every claim |
| **Claim window** | The period between the claim start and claim end conditions |
| **Sweep** | A claim that transfers the bucket's entire current balance |
| **Quote tokens** | The token depositors pay with, usually wrapped SOL |
