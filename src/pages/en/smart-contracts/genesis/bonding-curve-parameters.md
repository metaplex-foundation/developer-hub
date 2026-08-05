---
title: Bonding Curve — Protocol Parameters
metaTitle: Genesis Bonding Curve Protocol Parameters | Metaplex
description: Concrete protocol parameters for the Genesis Bonding Curve — token supply defaults, virtual reserves, fee schedule, and graduation target.
created: '08-03-2026'
updated: '08-05-2026'
keywords:
  - bonding curve
  - protocol parameters
  - virtual reserves
  - fee schedule
  - graduation
  - genesis
  - Metaplex
  - token supply
  - program ID
about:
  - Bonding Curve
  - Genesis
  - Protocol Parameters
proficiencyLevel: Intermediate
faqs:
  - q: What is the starting price of a Genesis Bonding Curve token?
    a: Starting price (in tokens per SOL) = (virtualTokens / 10^decimals) / (virtualSol / 10^9). virtualTokens is denominated in raw units and virtualSol in lamports, so both must be converted before quoting a tokens-per-SOL price. With the protocol defaults, this gives a fixed starting price regardless of when the curve opens.
  - q: How much SOL is raised by the time the curve graduates?
    a: The real lamports accumulated at graduation equal (k / virtualTokens) − virtualSol, where k = virtualSol × (virtualTokens + baseTokenAllocation); divide by 10^9 to express the result in SOL. In practice this equals the graduation target SOL listed in the Protocol Parameters table.
  - q: Can creators change the virtual reserves or token supply?
    a: No. Virtual reserves, token supply, and decimals are set by protocol defaults and cannot be overridden per-launch via the API.
  - q: Is the creator fee included in the 0.50% protocol fee?
    a: No. The creator fee is separate and additive. Both are calculated independently on the gross SOL amount of each swap and do not compound. Maximum total fee per swap is protocol fee + creator fee.
  - q: Do the bonding curve fees apply after graduation?
    a: No. After graduation, trading moves to the Raydium CPMM pool. The post-bond trading fee schedule applies instead — 0.40% protocol fee, 0.60% creator revenue, 0.21% LP fees, and 0.04% Raydium fee.
---

Concrete protocol parameters for the Genesis Bonding Curve — the fixed numbers that define every launch created via the Metaplex API. {% .lead %}

## Summary

All Genesis Bonding Curve launches share the same protocol-level parameters. These values are set by the Metaplex API and cannot be overridden per-launch.

- **Fixed supply and decimals** — every curve starts with 1,000,000,000 tokens at 6 decimal places
- **Immutable virtual reserves** — `virtualSol` and `virtualTokens` are set at curve creation and define the full price trajectory from first trade to graduation
- **Two-tier fee structure** — 0.50% protocol fee plus an optional creator fee on every swap; separate fee schedule applies after graduation to the Raydium CPMM pool
- **Automatic graduation** — fires when `baseTokenBalance` reaches zero; no manual trigger required

For the AMM pricing model that uses these parameters, see [Theory of Operation](/smart-contracts/genesis/bonding-curve-theory). For the raw swap formulas, see [Advanced Internals](/smart-contracts/genesis/bonding-curve-internals).

## Protocol Parameters

Every Genesis Bonding Curve launch is created with the following fixed protocol values.

| Parameter | Value | Notes |
|-----------|-------|-------|
| **Program ID** | `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` | Solana mainnet |
| **Token supply** | 1,000,000,000 | Raw units before decimals |
| **Decimals** | 6 | SPL token decimal places |
| **Token supply (with decimals)** | 1,000,000,000,000,000 | `supply × 10^decimals` |
| **`virtualSol`** | [TBD] lamports | Virtual SOL reserve — sets starting price |
| **`virtualTokens`** | [TBD] raw units | Virtual token reserve — paired with `virtualSol` |
| **Graduation target** | [TBD] SOL | Real SOL accumulated at full sell-out |
| **`baseTokenAllocation`** | 1,000,000,000,000,000 | All tokens allocated to the curve |

{% callout type="note" %}
`virtualSol` and `virtualTokens` are immutable after curve creation. Every event emitted by the program includes both values so that off-chain price calculations never require a separate account fetch. See [Indexing & Events](/smart-contracts/genesis/bonding-curve-indexing).
{% /callout %}

## Fee Schedule

Two distinct fee schedules apply over a token's life: one while the bonding curve is active, and a different one after graduation to Raydium.

### Bonding Curve (Active Phase)

Fees apply to the **SOL side** of every swap. Both fees are calculated independently on the gross SOL amount and do not compound. Net SOL in or out = gross − protocol fee − creator fee.

| Fee | Rate | Recipient |
|-----|------|-----------|
| **Protocol fee** | 0.50% | Metaplex fee wallet — transferred on every swap |
| **Creator fee** | 0.60% (max) | Configured `creatorFeeWallet` — accrued in bucket, claimed via `claimBondingCurveCreatorFeeV2` |

{% callout type="note" %}
The creator fee is optional. If no `creatorFeeWallet` is configured, no creator fee is charged. When configured, 0.60% is the protocol-defined maximum. The first buy is exempt from both fees when the first buy mechanism is used. See [Creator Fees](/smart-contracts/genesis/creator-fees).
{% /callout %}

### Post-Graduation (Raydium CPMM Pool)

After the curve graduates, trading moves to the Raydium CPMM pool. A different fee schedule applies:

| Fee | Rate | Recipient |
|-----|------|-----------|
| **Protocol fee** | 0.40% | Metaplex |
| **Creator revenue** | 0.60% | Creator fee wallet — claimed via `claimRaydiumCreatorFeeV2` |
| **LP fees** | 0.21% | Liquidity providers |
| **Raydium fee** | 0.04% | Raydium protocol |

## Price and Graduation Calculations

With the protocol defaults, the following values are fully determined at curve creation.

### Starting Price

The starting price is the ratio of the virtual reserves, converted from on-chain units (raw token units and lamports) to human units (tokens and SOL).

```
startingPrice (tokens per SOL) = (virtualTokens / 10^decimals) / (virtualSol / 10^9)
```

`virtualTokens` is stored in raw units and `virtualSol` in lamports, so divide by `10^decimals` (10^6 with protocol defaults) and `10^9` respectively before quoting a tokens-per-SOL price. This is the price a buyer sees on the very first swap (before any real SOL enters the pool).

### Market Cap at Graduation

At graduation, `baseTokenBalance = 0` and all real tokens have been sold. The real SOL accumulated equals the graduation target. The fully-diluted market cap at graduation:

```
graduationLamports = (k / virtualTokens) − virtualSol
  where k = virtualSol × (virtualTokens + baseTokenAllocation)
graduationSOL = graduationLamports / 10^9

priceAtGraduation (lamports per raw unit) = k / virtualTokens^2
fdvAtGraduation (SOL) = totalSupply (raw units) × priceAtGraduation / 10^9
```

### Constant Product Invariant

The invariant `k` is fixed at curve creation and never changes while the curve is active.

```
k = virtualSol × (virtualTokens + baseTokenAllocation)
```

`k` is constant throughout the life of the curve (rounded up on every swap).

## Notes

- Virtual reserves are included in every `BondingCurveSwapEvent` — off-chain price calculation does not require a separate RPC call to fetch the bucket account
- The protocol fee rate and virtual reserve values are set by Metaplex and cannot be overridden per-launch via the `createAndRegisterLaunch` API
- Graduation fires automatically on the swap that exhausts `baseTokenBalance` — the same transaction that clears the last token also triggers migration to Raydium
- Creator fees accrue in `creatorFeeAccrued` (not transferred per-swap); `creatorFeeClaimed` tracks cumulative claims; both reset-relative-to-accrual on each `claimBondingCurveCreatorFeeV2` call

## Quick Reference

| Item | Value |
|------|-------|
| Program ID | `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` |
| Default supply | `1,000,000,000` (1B tokens, 6 decimals) |
| `baseTokenAllocation` | `1,000,000,000,000,000` |
| Protocol swap fee | `0.50%` |
| Creator fee (max) | `0.60%` |
| Post-grad protocol fee | `0.40%` |
| Post-grad LP fees | `0.21%` |
| Post-grad Raydium fee | `0.04%` |
| `virtualSol` | `[TBD]` |
| `virtualTokens` | `[TBD]` |
| Graduation target | `[TBD] SOL` |
| JS SDK | `@metaplex-foundation/genesis` |
| Source | [GitHub](https://github.com/metaplex-foundation/mpl-genesis) |

## FAQ

### What is the starting price of a Genesis Bonding Curve token?

Starting price in tokens per SOL = `(virtualTokens / 10^decimals) / (virtualSol / 10^9)` — `virtualTokens` is in raw units and `virtualSol` in lamports, so both are converted before quoting the price. It is determined entirely by the protocol defaults — creators cannot set a custom starting price.

### How much SOL is raised by the time the curve graduates?

The real SOL accumulated at sell-out equals the graduation target listed in the Protocol Parameters table above. This follows directly from the constant product formula: `graduationLamports = (k / virtualTokens) − virtualSol`, divided by `10^9` to express it in SOL.

### Can creators change the virtual reserves or token supply?

No. `virtualSol`, `virtualTokens`, token supply, and decimals are protocol defaults set by the Metaplex API. There is no API parameter to override them per-launch.

### Is the creator fee included in the 0.50% protocol fee?

No. The protocol fee (0.50%) and the creator fee (up to 0.60%) are independent. Both are calculated on the gross SOL amount of the swap and subtracted separately. They do not compound.

### Do the bonding curve fees apply after graduation?

No. After graduation, the bonding curve account is closed and trading moves to the Raydium CPMM pool. The post-bond trading fee schedule applies — see the [Post-Graduation Fee Schedule](#post-graduation-raydium-cpmm-pool) table above.
