---
title: Bonding Curve — Advanced Internals
metaTitle: Genesis Bonding Curve Advanced Internals | Metaplex
description: Deep reference for the Genesis Bonding Curve — swap price formulas, reverse calculation, reserve exhaustion clamping, BondingCurveBucketV2 account structure, and extensions.
updated: '04-09-2026'
keywords:
  - bonding curve
  - constant product AMM
  - swap formula
  - virtual reserves
  - reserve exhaustion
  - BondingCurveBucketV2
  - genesis
  - Metaplex
about:
  - Bonding Curve
  - Constant Product AMM
  - Genesis
proficiencyLevel: Advanced
---

Reference for Genesis Bonding Curve swap price formulas, reserve exhaustion handling, and the `BondingCurveBucketV2` onchain account structure. {% .lead %}

## Summary

This page covers implementation-level details for integrators building swap engines, pricing tools, or protocol tooling on top of the Genesis Bonding Curve.

- **Swap formulas** — exact `ceil(k / x)` buy and sell calculations
- **Reverse calculation** — computing required input for a desired output
- **Reserve exhaustion** — how the system clamps and recalculates when supply is near zero
- **`BondingCurveBucketV2`** — full field reference for the onchain account

For the conceptual model, fee structure, and lifecycle overview, see [Theory of Operation](/smart-contracts/genesis/bonding-curve-theory).

## Swap Price Formulas

All swap calculations use the combined reserves:

```
totalSol    = virtualSol + realSol
totalTokens = virtualTokens + realTokens
k           = totalSol × totalTokens
```

### Buy (SOL in, Tokens out)

```
inputReserve     = totalSol
outputReserve    = totalTokens

newInputReserve  = inputReserve + amountIn
newOutputReserve = ceil(k / newInputReserve)
tokensOut        = outputReserve - newOutputReserve
```

### Sell (Tokens in, SOL out)

```
inputReserve     = totalTokens
outputReserve    = totalSol

newInputReserve  = inputReserve + amountIn
newOutputReserve = ceil(k / newInputReserve)
solOut           = outputReserve - newOutputReserve
```

### Ceiling Division

Ceiling division (`ceil(k / x)`) is used in all swap calculations. This ensures the constant product invariant is never violated:

```
newInputReserve × (outputReserve − outputAmount) ≥ k
```

The pool can only gain value through trades, never lose it. Any rounding error accumulates in favor of the pool.

## Reverse Calculation: Required Input for a Desired Output

Used internally when clamping reserves at exhaustion — computes exactly how much input is needed to produce a specific output:

```
newOutputReserve = outputReserve - desiredAmountOut
newInputReserve  = ceil(k / newOutputReserve)
requiredAmountIn = newInputReserve - inputReserve
```

This is also useful for UX flows where the user specifies a desired token amount and the UI needs to show the exact SOL cost.

## Reserve Exhaustion and Clamping

When a swap would produce more output than the curve has available, the system clamps the output and recalculates the input — the transaction does not fail.

### Buy Clamping (Token Supply Exhausted)

If `tokensOut > baseTokenBalance`:

1. Output is capped at `baseTokenBalance`
2. Required SOL input is recalculated using the reverse formula
3. The buyer pays only for the tokens actually available
4. This final buy also triggers graduation

### Sell Clamping (SOL Supply Exhausted)

If the bucket does not hold enough SOL to cover both the gross output and the fees:

1. The system works backwards from the available SOL balance
2. Fees are recalculated on the available amount
3. The seller receives what remains after fees
4. Required token input is recalculated to match via the reverse formula

## BondingCurveBucketV2 Account Structure

The `BondingCurveBucketV2` account stores all bonding curve state. See the [Genesis JavaScript SDK](/smart-contracts/genesis/sdk/javascript) for the full TypeScript type definition.

### Core Reserve Fields

| Field | Type | Description |
|-------|------|-------------|
| `baseTokenBalance` | `bigint` | Tokens remaining on the curve. Zero means sold out. |
| `baseTokenAllocation` | `bigint` | Total tokens allocated at creation. |
| `quoteTokenDepositTotal` | `bigint` | Real SOL deposited by buyers (lamports). Starts at 0. |
| `virtualSol` | `bigint` | Virtual SOL reserve (pricing only, never deposited). |
| `virtualTokens` | `bigint` | Virtual token reserve (pricing only, never deposited). |

### Fee Configuration Fields

| Field | Type | Description |
|-------|------|-------------|
| `depositFee` | `number` | Protocol fee rate on SOL input side of buys. |
| `withdrawFee` | `number` | Protocol fee rate on SOL output side of sells. |
| `creatorFeeAccrued` | `bigint` | Total creator fees accrued, not yet claimed. |
| `creatorFeeClaimed` | `bigint` | Cumulative creator fees claimed to date. |

### Swap Condition Fields

| Field | Type | Description |
|-------|------|-------------|
| `swapStartCondition` | `object` | Condition that must be met before trading is allowed. |
| `swapEndCondition` | `object` | Condition that ends trading when triggered. |

### BondingCurveBucketV2 Extensions

The bucket includes an extensions block with independently configurable optional features:

| Extension | Description |
|-----------|-------------|
| **First Buy** | Designates a buyer and SOL amount for a fee-free initial purchase. Consumed after the first buy completes. |
| **Creator Fee** | An optional creator fee with a destination wallet address and fee rate. Fees are accrued in the bucket (`creatorFeeAccrued`) rather than transferred per-swap. Calculated independently from the protocol fee — does not compound with it. The first buy waives both. See [Creator Fees](/smart-contracts/genesis/creator-fees) for configuration and claiming. |

## Notes

- `virtualSol` and `virtualTokens` are set at curve creation and are immutable — they permanently define the price curve shape
- `ceil(k / x)` division is used in all swap calculations to ensure the pool never loses value; rounding accumulates in favor of the pool
- Graduation fires automatically on full token exhaustion — no separate instruction or crank is required
- The `BondingCurveBucketV2` discriminator is unique per account type; the `BondingCurveSwapEvent` discriminator is always byte `255`

## Quick Reference

| Formula | Expression |
|---------|-----------|
| Combined SOL reserve | `totalSol = virtualSol + realSol` |
| Combined token reserve | `totalTokens = virtualTokens + realTokens` |
| Constant product | `k = totalSol × totalTokens` |
| Current price (tokens/SOL) | `totalTokens / totalSol` |
| Buy output | `outputReserve − ceil(k / (inputReserve + amountIn))` |
| Sell output | `outputReserve − ceil(k / (inputReserve + amountIn))` |
| Required input for desired output | `ceil(k / (outputReserve − desiredOut)) − inputReserve` |
