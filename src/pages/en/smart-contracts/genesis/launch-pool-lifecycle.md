---
title: Launch Pool Lifecycle with the SDK
metaTitle: Full Genesis Launch Pool Lifecycle with Raydium Graduation | Metaplex
description: End-to-end guide to running a Genesis Launch Pool with the JavaScript SDK — buckets, Raydium CPMM graduation, graduation-relative claims, team vesting, treasury, the operator crank, and the sale page.
created: '10-29-2026'
updated: '11-25-2026'
keywords:
  - Genesis launch pool lifecycle
  - token launch SDK
  - Raydium graduation
  - triggerBehaviorsV2
  - triggerConditionsV2
  - launch crank
  - token sale page
  - claim after graduation
about:
  - Genesis Launch Pool
  - Raydium CPMM graduation
  - Launch operations
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - Initialize a Genesis account and add Launch Pool, Raydium CPMM, Unlocked, and claim schedule buckets
  - Wire end behaviors and graduation-relative claim conditions, then finalize
  - Serve a sale page that reads bucket and deposit state while deposits are open
  - Run the crank to trigger behaviors, graduate to Raydium, roll over tokens, and trigger claim conditions
  - Let depositors, the treasury, and the team claim, then manage LP tokens and fees
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: Do I need to run my own crank for a launch built with the SDK?
    a: Yes. Plan to run your own crank for a launch created directly with the SDK. Every crank step — triggerBehaviorsV2, graduateToRaydiumCpmmV2, and triggerConditionsV2 — is permissionless and only needs a funded fee payer.
  - q: What happens if nobody runs the crank after deposits close?
    a: Nothing moves. The raised SOL stays in the Launch Pool, the Raydium pool is not created, and claims that are relative to graduation never open. Depositors' funds stay safe, but the launch stalls until someone sends the crank transactions.
  - q: How long after deposits close can users claim?
    a: As soon as the crank runs three steps — triggerBehaviorsV2 on the Launch Pool, graduateToRaydiumCpmmV2, and triggerConditionsV2 on the Launch Pool. A crank polling every minute typically completes them within a few minutes of the graduation start time.
  - q: Do the bucket allocations need to add up to the total supply?
    a: Yes. finalizeV2 requires the sum of every bucket's baseTokenAllocation to equal the Genesis account's total supply.
  - q: Can depositors' tokens vest instead of unlocking at claim?
    a: Yes. Add the claimSchedule extension to the Launch Pool bucket. Its start and cliff conditions can also be TimeRelative to the Raydium Graduate time.
---

This guide runs a complete [Genesis](/smart-contracts/genesis) [Launch Pool](/smart-contracts/genesis/launch-pool) with the JavaScript SDK, from bucket setup through Raydium graduation, graduation-relative claims, team vesting, and the operator crank that moves each phase forward. {% .lead %}

{% callout title="What You'll Build" %}
A launch that sells 60% of supply in a 3-day Launch Pool, sends 20% of the raised SOL to a Raydium CPMM pool and 80% to a treasury, opens every claim at the moment the pool goes live, and vests team tokens for a year after graduation.
{% /callout %}

{% callout title="No-Code Option" %}
To launch a token without writing code, use the [Metaplex token launchpad](https://www.metaplex.com). To create a launch pool with Raydium liquidity and vesting from code in a single call, use `createAndRegisterLaunch` from the [Genesis API client](/smart-contracts/genesis/sdk/api-client). This guide is for launches that need full control over every bucket and setting.
{% /callout %}

## Summary

A full SDK launch is four bucket types wired together before `finalizeV2`, plus a crank that sends permissionless transactions after the deposit window closes.

- Launch Pool sells tokens; Raydium CPMM creates liquidity; Unlocked holds the treasury; claim schedule vests the team
- Every claim uses a `TimeRelative` condition anchored to the Raydium `Graduate` time
- The crank runs `triggerBehaviorsV2`, `graduateToRaydiumCpmmV2`, and `triggerConditionsV2` — nothing happens automatically
- Run end to end on devnet with `@metaplex-foundation/genesis@0.44.0` against the deployed Genesis release `genesis v0.41.0`

## When to Use This Guide

Use this guide when a launch needs settings the Metaplex launchpad and API do not offer. Otherwise, the [Metaplex token launchpad](https://www.metaplex.com) or the [Genesis API client](/smart-contracts/genesis/sdk/api-client) creates a comparable launch pool with far less code.

| | Metaplex launchpad / Genesis API client | This guide (Genesis SDK) |
|---|---|---|
| Setup | A form, or one `createAndRegisterLaunch` call | About eight transactions you build and send |
| Listed on metaplex.com | Yes, the launch is registered with `registerLaunch` | No, the launch is not registered with the Metaplex API |
| Supply and decimals | 1 billion tokens and 6 decimals for a new token, by default | Any supply and decimals |
| Raydium liquidity | 20–100% of the raised funds; LP tokens locked for 1 year with quarterly unlocks | Any percentage, start condition, and LP policy |
| Buckets | A Launch Pool, an Unlocked bucket, then optional claim schedules | Any combination of Genesis buckets and end behaviors |
| After deposits close | Metaplex runs the crank: end behaviors, Raydium graduation, and claim conditions | You run the crank that triggers behaviors, graduation, and claims |

## Quick Start

The launch takes four steps, and each links to the section with the code.

1. [Configure and finalize the launch](#step-1-configure-and-finalize-the-launch): initialize the token, add the four buckets with their behaviors and graduation-relative conditions, then finalize.
2. [Build the sale page](#step-2-build-the-sale-page): read bucket and deposit state to show the phase, totals, and the wallet's position while deposits are open.
3. [Run the launch crank](#step-3-run-the-launch-crank): after deposits close, trigger behaviors, graduate to Raydium, roll over unused tokens, and open claims. The [runbook](#operator-crank-runbook) lists every transaction.
4. [Claim and finish the launch](#step-4-claims-and-post-launch-operations): depositors, the treasury, and the team claim; the authority revokes the mint and freeze authorities.

**Jump to:** [Architecture](#launch-architecture) · [Setup](#step-1-configure-and-finalize-the-launch) · [Sale Page](#step-2-build-the-sale-page) · [Crank](#step-3-run-the-launch-crank) · [Runbook](#operator-crank-runbook) · [Claims](#step-4-claims-and-post-launch-operations)

## Prerequisites

- Node.js 18+ and the packages `@metaplex-foundation/genesis`, `@metaplex-foundation/umi`, `@metaplex-foundation/umi-bundle-defaults`, and `@metaplex-foundation/mpl-toolbox`
- A funded authority wallet for setup and a funded crank wallet (they can be the same)
- Familiarity with [Genesis setup](/smart-contracts/genesis/getting-started)

| Tool | Tested version |
|------|----------------|
| `@metaplex-foundation/genesis` | 0.44.0 |
| `@metaplex-foundation/mpl-toolbox` | 0.12.x |
| `@metaplex-foundation/umi` | 1.x |
| Genesis program | `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` |

## Launch Architecture

The launch uses four buckets whose allocations add up to the 1,000,000-token total supply.

| Bucket | Type | Allocation | Receives | Claims open |
|--------|------|------------|----------|-------------|
| Launch Pool | `LaunchPoolBucketV2` | 600,000 | SOL deposits | Graduate time |
| Raydium CPMM | `RaydiumCpmmBucketV2` | 120,000 | 20% of SOL + start price | — (pool liquidity) |
| Treasury | `UnlockedBucketV2` | 80,000 | 80% of SOL + unused Raydium tokens | Graduate time |
| Team vesting | `ClaimScheduleBucketV2` | 200,000 | — | Graduate time; 10% cliff at +90 days, monthly unlocks over 1 year |

```
Launch Pool ──SendQuoteTokenPercentage 20% + SendStartPrice──▶ Raydium CPMM ──graduate──▶ Raydium pool
     │                                                              │
     └──SendQuoteTokenPercentage 80%──▶ Treasury ◀──BaseTokenRollover┘

Claim starts (Launch Pool, Treasury, Team) = TimeRelative(Raydium CPMM, Graduate, offset)
```

*Diagram: the Launch Pool's end behaviors send 20% of raised SOL and the start price to the Raydium CPMM bucket and 80% to the treasury Unlocked bucket; after graduation the Raydium bucket rolls unused base tokens into the treasury, and all claim start conditions reference the Raydium Graduate time.*

The Raydium allocation equals the Launch Pool allocation × 20%, matching the share of proceeds sent to the pool. See [Raydium CPMM Graduation](/smart-contracts/genesis/raydium-cpmm-graduation#raydium-pool-starting-price) for the sizing math.

## Step 1: Configure and Finalize the Launch

The setup script initializes the token, derives all four bucket addresses first so they can reference each other, adds the buckets, and finalizes with every bucket passed as a remaining account.

{% code-tabs-imported from="genesis/launch_pool_lifecycle_setup" frameworks="umi" filename="setupLaunch" /%}

### Key Configuration Choices in the Setup Script

Each choice below exists to keep the launch safe to crank and every allocation claimable.

| Choice | Reason |
|--------|--------|
| PDAs derived before any `add*` call | Buckets reference later buckets in behaviors and conditions |
| `claimStartCondition: atGraduation()` on three buckets | Nobody can claim or sell before liquidity exists |
| Raydium `startCondition` = deposit end | Graduation can run as soon as behaviors deliver SOL and price |
| `Triggered` LP lock start | The lock clock starts exactly at graduation, with no extra crank |
| Treasury `claimEndCondition: Never` | Rollover tokens that arrive after graduation stay claimable |
| `BaseTokenRollover` on the Raydium bucket | Recovers any base tokens graduation did not pair, such as rounding dust |

{% callout type="warning" %}
`finalizeV2` is irreversible. After it, bucket allocations, conditions, and end behaviors cannot change. Review every address, percentage, and timestamp first — ideally by running the whole lifecycle on devnet.
{% /callout %}

For a launch that can fail, add `minimumQuoteTokenThreshold` to the Launch Pool together with `ReallocateBaseTokensOnFailure` and `TransmitFailure` behaviors, so a failed sale returns tokens and unblocks the graduation-relative buckets. See [Failure Handling](/smart-contracts/genesis/end-behaviors#failure-handling-with-transmit-failure).

## Step 2: Build the Sale Page

The sale page reads the Launch Pool, Raydium, and deposit accounts to show the current phase, totals, and the connected wallet's position.

{% code-tabs-imported from="genesis/launch_pool_sale_page_state" frameworks="umi" filename="salePageState" /%}

| Sale page action | Instruction | Docs |
|------------------|-------------|------|
| Wrap SOL before depositing | `wrapSol` helpers | [Wrapping SOL](/smart-contracts/genesis/launch-pool#wrapping-sol) |
| Deposit | `depositLaunchPoolV2` | [Depositing](/smart-contracts/genesis/launch-pool#depositing) |
| Withdraw during the window | `withdrawLaunchPoolV2` | [Withdrawing](/smart-contracts/genesis/launch-pool#withdrawing) |
| Claim tokens | `claimLaunchPoolV2` | [Claiming Tokens](/smart-contracts/genesis/launch-pool#claiming-tokens) |
| Refund on oversubscription or failure | `refundLaunchPoolV2` | [Refunds](/smart-contracts/genesis/launch-pool#refunding-a-deposit) |

Optional Launch Pool extensions control who can deposit and how depositors receive tokens: `allowlist` for gated sales, `backendSigner` to require a server co-signature (for example after KYC), `depositLimit` and `minimumDepositAmount` for per-wallet bounds, and `claimSchedule` to vest depositor tokens. See [Launch Pool Extensions](/smart-contracts/genesis/launch-pool#launch-pool-extensions).

{% callout type="note" %}
Show "awaiting claim crank" as its own phase. Between graduation and the `triggerConditionsV2` call, the pool is live on Raydium but `claimLaunchPoolV2` still fails, which users otherwise read as a bug.
{% /callout %}

## Step 3: Run the Launch Crank

The crank is an idempotent script that checks onchain state and sends the next permissionless transaction, so it can run on a timer until every step is complete.

{% code-tabs-imported from="genesis/launch_pool_lifecycle_crank" frameworks="umi" filename="crank" /%}

Run it every minute from a server, a scheduled job, or a keeper bot. Any funded wallet can pay; it does not need the Genesis authority key. The crank only sends `triggerConditionsV2` for a bucket once one of its conditions is due, so it stays idle during the 90 days before the team cliff instead of paying a fee every minute.

## Operator Crank Runbook

The runbook lists every transaction the launch needs after `finalizeV2`, in order, with what breaks if it is skipped.

| # | When | Instruction | Signer | If skipped |
|---|------|-------------|--------|-----------|
| 1 | After `depositEnd` | `triggerBehaviorsV2` on the Launch Pool, with Raydium and treasury pairs | Any payer | No SOL or price reaches Raydium; graduation fails with `InvalidAmount`; treasury has no SOL |
| 2 | After step 1 and the Raydium `startCondition` | `graduateToRaydiumCpmmV2` | Any payer (+ backend signer if configured) | No pool; every graduation-relative claim stays closed |
| 3 | After step 2 | `triggerBehaviorsV2` on the Raydium bucket, with the treasury pair | Any payer | Unused Raydium base tokens stay locked in Genesis |
| 4 | After step 2 | `triggerConditionsV2` on Launch Pool, treasury, and team buckets, each with the Raydium bucket as remaining account | Any payer | **Claims never open**, even though the pool is live |
| 5 | Graduate + 90 days | `triggerConditionsV2` on the team bucket again | Any payer | Team cliff stays locked |
| 6 | Ongoing | `collectRaydiumCpmmFeesV2` or `collectRaydiumCpmmFeesWithCreatorFeeV2` | Any payer | Raydium creator fees accumulate uncollected |

{% callout type="warning" %}
Step 4 is the step teams most often miss. Graduation records the `Graduate` time on the Raydium bucket only; each bucket with a `TimeRelative` condition must be triggered separately. See [Conditions and Triggers](/smart-contracts/genesis/conditions#when-to-call-trigger-conditions-v2).
{% /callout %}

## Step 4: Claims and Post-Launch Operations

After the crank finishes, each party claims with its own instruction, and the Genesis authority handles the remaining admin actions.

| Who | Action | Instruction | Docs |
|-----|--------|-------------|------|
| Depositors | Claim purchased tokens | `claimLaunchPoolV2` | [Launch Pool](/smart-contracts/genesis/launch-pool#claiming-tokens) |
| Treasury | Claim 80% of SOL, base allocation, and rollover | `claimUnlockedV2` | [Unlocked Buckets](/smart-contracts/genesis/unlocked-bucket#claiming-from-an-unlocked-bucket) |
| Team | Claim vested tokens | `claimClaimScheduleV2` | [Project Vesting](/smart-contracts/genesis/project-vesting#claim-vested-project-tokens) |
| LP claim authority | Claim unlocked LP tokens each quarter | `claimRaydiumCpmmLpTokensV2` | [Raydium LP Tokens](/smart-contracts/genesis/raydium-cpmm-graduation#managing-raydium-lp-tokens) |
| Genesis authority | Revoke mint and freeze authority | `revokeV2` | [JavaScript SDK](/smart-contracts/genesis/sdk/javascript#revoke-v2) |

## Common Lifecycle Errors

Lifecycle errors usually mean a crank step ran out of order or a bucket configuration does not add up.

| Error | Cause | Resolution |
|-------|-------|------------|
| `LaunchPoolNotEnded` | Behaviors triggered before `depositEnd` | Wait for the deposit window to close |
| `InvalidAmount` on graduation | Launch Pool behaviors have not run | Run runbook step 1 first |
| `GraduationNotStarted` | Raydium `startCondition` not met | Wait, or trigger a `TimeRelative` start |
| `ClaimNotStarted` | `triggerConditionsV2` not run after graduation | Run runbook step 4 |
| `RecipientMismatch` | `claimUnlockedV2` sent without the stored recipient | Pass `recipient: bucket.recipient` |
| `TotalSupplyNotFullyAllocated` | Bucket allocations do not add up to the total supply | Recompute allocations before `finalizeV2` |
| `MissingFinalizeBucketAccounts` | `finalizeV2` was not given every bucket as a remaining account | Pass all bucket PDAs, read-only |

## Notes

- Do not rely on Metaplex infrastructure to crank a launch created directly with the SDK. Run your own crank, and monitor it.
- All crank instructions are idempotent: a repeated or concurrent transaction fails or no-ops without moving funds twice.
- The Launch Pool forwards proceeds to Raydium and the treasury without a fee by default; the treasury pays the claim fee when it claims. See [Protocol Fees](/smart-contracts/genesis#protocol-fees).
- This guide covers Raydium CPMM. Raydium CLMM graduation uses different buckets and instructions.
- The setup, sale page, and crank examples were run end to end on devnet with `@metaplex-foundation/genesis@0.44.0` against the deployed Genesis release `genesis v0.41.0`, with the deposit window shortened. On devnet, pass `{ env: 'devnet' }` to `deriveRaydiumPDAsV2`. Token-2022 base mints are not supported by the deployed program. Source: [metaplex-foundation/genesis](https://github.com/metaplex-foundation/genesis).

## FAQ

### Do I need to run my own crank for a launch built with the SDK?

Yes. Plan to run your own crank for a launch created directly with the SDK. Every crank step — `triggerBehaviorsV2`, `graduateToRaydiumCpmmV2`, and `triggerConditionsV2` — is permissionless and only needs a funded fee payer.

### What happens if nobody runs the crank after deposits close?

Nothing moves. The raised SOL stays in the Launch Pool, the Raydium pool is not created, and claims that are relative to graduation never open. Depositors' funds stay safe, but the launch stalls until someone sends the crank transactions.

### How long after deposits close can users claim?

As soon as the crank runs three steps — `triggerBehaviorsV2` on the Launch Pool, `graduateToRaydiumCpmmV2`, and `triggerConditionsV2` on the Launch Pool. A crank polling every minute typically completes them within a few minutes of the graduation start time.

### Do the bucket allocations need to add up to the total supply?

Yes. `finalizeV2` requires the sum of every bucket's `baseTokenAllocation` to equal the Genesis account's total supply.

### Can depositors' tokens vest instead of unlocking at claim?

Yes. Add the `claimSchedule` extension to the Launch Pool bucket. Its start and cliff conditions can also be `TimeRelative` to the Raydium `Graduate` time.

## Next Steps

- [Conditions and Triggers](/smart-contracts/genesis/conditions) - How `TimeRelative` conditions and `triggerConditionsV2` work
- [End Behaviors](/smart-contracts/genesis/end-behaviors) - Routing proceeds, rollovers, and failure handling
- [Raydium CPMM Graduation](/smart-contracts/genesis/raydium-cpmm-graduation) - The graduation bucket, LP tokens, and fees
- [Genesis API client](/smart-contracts/genesis/sdk/api-client) - Create a launch pool in one call and list it on metaplex.com
