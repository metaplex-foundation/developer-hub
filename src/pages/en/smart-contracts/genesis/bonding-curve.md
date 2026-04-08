---
title: Bonding Curve
metaTitle: Genesis Bonding Curve Overview | Metaplex
description: Overview of the Genesis Bonding Curve — a constant product AMM that sells out its token supply and graduates into a Raydium CPMM pool.
updated: '04-08-2026'
keywords:
  - bonding curve
  - genesis
  - token launch
  - constant product AMM
  - graduation
  - Raydium CPMM
  - Solana
about:
  - Bonding Curve
  - Token Launch
  - Genesis
proficiencyLevel: Beginner
faqs:
  - q: What is the difference between a bonding curve and a launch pool?
    a: A bonding curve lets users buy and sell continuously from the moment trading opens — price moves with every trade. A launch pool has a fixed deposit window and settles at a single clearing price at the end.
  - q: When does graduation happen?
    a: Graduation fires automatically the moment all tokens on the curve are sold. The accumulated SOL migrates into a Raydium CPMM pool for ongoing secondary trading — no manual action is required.
  - q: Do I need to understand the AMM math to launch a token?
    a: No. The Launch via API guide covers everything needed to create and register a launch in a single SDK call. The Theory of Operation page is for integrators who need to understand pricing internals.
---

Genesis Bonding Curve is a constant product AMM that continuously prices a token supply until it sells out, then graduates into a Raydium CPMM pool. {% .lead %}

## Summary

A bonding curve launch gives every user the ability to buy and sell at any time after the swap window opens. Price rises as SOL flows in and falls as tokens are sold back — determined entirely by the constant product formula.

- **Continuous trading** — no fixed deposit window; buy and sell at any time while the curve is active
- **Deterministic pricing** — price is always calculable from the current reserve state; no batch settlement
- **Automatic graduation** — when all tokens sell out, accumulated SOL migrates to a Raydium CPMM pool automatically
- **Optional creator fee** — per-swap fee earned on the curve and in the post-graduation Raydium pool
- **Optional first buy** — fee-free initial purchase reserved for the launching wallet at curve creation

## Lifecycle

| Phase | Description |
|-------|-------------|
| **Created** | Curve initialized with reserves, fees, and start time. Trading not yet open. |
| **Active** | Swap window open. Users buy and sell freely; price moves with every trade. |
| **Graduated** | All tokens sold. Accumulated SOL migrated to Raydium CPMM. Curve account closed. |

Graduation is triggered automatically by full token exhaustion — there is no timer or manual step.

## How It Differs from Other Launch Types

| | Bonding Curve | Launch Pool | Presale |
|---|---|---|---|
| **Price discovery** | Continuous, per-trade | Batch at window close | Fixed |
| **Trading window** | Open until sold out | Fixed duration | Fixed duration |
| **Sell back** | Yes, at any time | No | No |
| **Graduation** | On sell-out | At window close | At window close |

## Which Guide Do You Need?

| Goal | Guide |
|------|-------|
| Launch a token via the API | [Launch via API](/smart-contracts/genesis/bonding-curve-launch) |
| Integrate swaps into an app or protocol | [Swap Integration](/smart-contracts/genesis/bonding-curve-swaps) |
| Index events and track price onchain | [Indexing & Events](/smart-contracts/genesis/bonding-curve-indexing) |
| Understand the AMM pricing model | [Theory of Operation](/smart-contracts/genesis/bonding-curve-theory) |
| Deep-dive into formulas and account structure | [Advanced Internals](/smart-contracts/genesis/bonding-curve-internals) |

## Notes

- A bonding curve has no fixed end time — graduation is triggered by supply exhaustion, not a timer
- Unlike a [launch pool](/smart-contracts/genesis/launch-pool) or [presale](/smart-contracts/genesis/presale), users can sell tokens back to the curve at any time while it is active
- The protocol swap fee is set by Metaplex and is not configurable by creators; see [Protocol Fees](/protocol-fees) for current rates
- Creator fees are accrued in the bucket and collected via the permissionless `claimBondingCurveCreatorFeeV2` instruction

## FAQ

### What is the difference between a bonding curve and a launch pool?
A [launch pool](/smart-contracts/genesis/launch-pool) collects deposits during a fixed window and settles everyone at the same clearing price at the end. A bonding curve has no window — users trade immediately after the swap start time, and price updates with every single trade.

### When does graduation happen?
Graduation fires automatically the instant `baseTokenBalance` reaches zero — the last buy that exhausts the supply also triggers the graduation process. The accumulated real SOL is migrated into a Raydium CPMM pool. No separate instruction or crank is required.

### Do I need to understand the AMM math to launch a token?
No. `createAndRegisterLaunch` in the [Launch via API](/smart-contracts/genesis/bonding-curve-launch) guide handles the full flow in one SDK call. The [Theory of Operation](/smart-contracts/genesis/bonding-curve-theory) page is for integrators building swap UIs, pricing engines, or protocol tooling.
