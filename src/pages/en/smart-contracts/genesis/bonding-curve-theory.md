---
title: Bonding Curve — Theory of Operation
metaTitle: Genesis Bonding Curve — How It Works | Metaplex
description: How the Genesis Bonding Curve works — constant product pricing, virtual reserves, fee structure, first buy mechanism, and lifecycle phases.
updated: '04-08-2026'
keywords:
  - bonding curve
  - constant product AMM
  - virtual reserves
  - token launch
  - Genesis
  - Metaplex
  - graduation
  - Raydium CPMM
  - swap fee
  - creator fee
about:
  - Bonding Curve
  - Constant Product AMM
  - Token Launch
  - Genesis
proficiencyLevel: Intermediate
faqs:
  - q: What is the difference between a bonding curve launch and a launch pool?
    a: A launch pool has a fixed deposit window and fixed price discovery — users deposit during the window and receive tokens proportionally. A bonding curve has no fixed window — users can buy and sell at any time after the swap window opens, with the price rising as more SOL flows in and falling as tokens are sold back. Price is continuous and deterministic, not batch-settled.
  - q: Why does Genesis Bonding Curve use virtual reserves instead of a standard AMM?
    a: A standard constant product AMM (x * y = k) is not designed to sell out completely — the price of the last few tokens approaches infinity. Virtual reserves (virtual SOL and virtual tokens added at initialization) set a practical starting price and shape the curve so that all real tokens can be sold through at bounded prices.
  - q: What triggers graduation and what happens to the accumulated SOL?
    a: Graduation fires automatically when all tokens on the curve have been sold — no manual trigger is required. The accumulated real SOL is migrated into a Raydium CPMM pool for ongoing secondary trading.
  - q: Are the protocol fee and the creator fee compounded?
    a: No. Both fees are calculated independently on the gross SOL amount of each swap and subtracted separately. The net amount entering or leaving the curve is gross minus protocol fee minus creator fee — they do not compound.
  - q: Does the first buyer pay any fees?
    a: No. When the first buy mechanism is configured, all fees (protocol swap fee and creator fee) are waived for the designated buyer's initial purchase. All subsequent swaps — including further buys by the same wallet — are charged the normal fees.
---

Genesis Bonding Curve uses a `x × y = k` constant product pricing model with virtual reserves to enable deterministic, continuously-available token launches on Solana. {% .lead %}

## Summary

Genesis Bonding Curve uses a constant product AMM with virtual reserves to price a complete token sell-out at bounded, predictable prices.

- **Constant product AMM** — price rises as SOL flows in and falls as tokens are sold back, following `x × y = k`
- **Virtual reserves** — SOL and token reserves seeded at initialization to set a practical starting price and allow the curve to fully sell out
- **Three lifecycle phases** — Created → Active → Graduated; graduation fires automatically when all tokens are sold and migrates liquidity to a Raydium CPMM pool
- **Two fee types** — a protocol swap fee on every trade plus an optional creator fee; both apply to the SOL side and do not compound

For the raw swap formulas, reverse calculation math, and full account field reference, see [Advanced Internals](/smart-contracts/genesis/bonding-curve-internals).

## Constant Product AMM Pricing

Genesis Bonding Curve uses the same `x × y = k` formula used by Uniswap V2 and Raydium. The price at any moment is determined by the ratio of token reserves to SOL reserves — buying tokens reduces the token supply and raises the price; selling tokens increases the supply and lowers it.

### Why Bonding Curves Require Virtual Reserves

A plain `x × y = k` curve has asymptotes at both ends that make it unsuitable for a sell-out launch. Standard AMMs avoid this by seeding real liquidity on both sides and never intending to fully sell out — slippage simply makes the extremes impractical to trade near. Bonding curve launches are different: they are designed to **completely sell out**.

- **Bottom asymptote** — with no SOL in the pool at launch, a buyer could drain all tokens for any nonzero SOL amount
- **Top asymptote** — the price of the last few tokens approaches infinity, making a full sell-out impossible at practical prices

Genesis Bonding Curve solves this by seeding the curve with **virtual reserves** — both virtual SOL and virtual tokens — that exist only in the pricing math. The virtual reserves set a finite starting price and shape the curve so that all real tokens can be sold through at practical, bounded prices.

### Reserve Accounting

The curve maintains two sets of reserves that are combined for the AMM formula:

| Reserve | Field | Description |
|---------|-------|-------------|
| **Virtual SOL** | `virtualSol` | Added at initialization. Sets the starting price. Never actually deposited — exists only in the math. |
| **Virtual tokens** | `virtualTokens` | Added at initialization, paired with virtual SOL to anchor the curve. |
| **Real SOL** | `quoteTokenDepositTotal` | Actual SOL deposited by buyers. Starts at 0 and grows with each buy. |
| **Real tokens** | `bucket.baseTokenBalance` | Actual tokens remaining. Starts at the full allocation and decreases with each buy. |

The effective reserves used in the AMM formula are:

```
totalSol    = virtualSol + realSol
totalTokens = virtualTokens + realTokens
k           = totalSol × totalTokens
```

A higher `virtualSol` relative to `virtualTokens` means a higher starting price. The current price in tokens per SOL is:

```
price = (virtualTokens + realTokens) / (virtualSol + realSol)
```

## Fee Structure

Fees are applied to the **SOL side** of every swap, regardless of direction — deducted from SOL input on buys and from SOL output on sells.

### Protocol Swap Fee and Creator Fee

Every swap is subject to a protocol swap fee. Creators can optionally add a creator fee on top:

| Fee | Who sets it | Destination |
|-----|-------------|-------------|
| **Protocol swap fee** | Protocol (not configurable by creator) | Metaplex fee wallet (`feeQuoteTokenAccount`) — transferred on every swap |
| **Creator fee** | Creator or agent (optional) | Accrued in bucket (`creatorFeeAccrued`) — claimed via permissionless `claimBondingCurveCreatorFeeV2` |

Both fees are calculated **independently** on the gross SOL amount and do not compound. The net amount entering or leaving the curve is:

```
net = gross − protocolFee − creatorFee
```

{% callout type="note" %}
The protocol swap fee is transferred to the Metaplex fee wallet on every swap. Creator fees are **accrued** in the bucket (`creatorFeeAccrued`) rather than transferred immediately — call the permissionless `claimBondingCurveCreatorFeeV2` instruction to collect them. After graduation, creator fees continue to accrue from Raydium LP trading and are claimed via `claimRaydiumCreatorFeeV2`. For configuration and full claiming instructions, see [Creator Fees](/smart-contracts/genesis/creator-fees).
{% /callout %}

For current protocol fee schedules, see the [Protocol Fees](/protocol-fees) page.

### Fee Application by Trade Direction

**Buy (SOL → tokens):**
1. Fees are calculated on the gross SOL input
2. Fees are subtracted: `amountInAfterFees = amountIn − fees`
3. The AMM formula runs on `amountInAfterFees`
4. The buyer receives the full token output — no fee on the output side

**Sell (tokens → SOL):**
1. No fee on the token input — the full token amount enters the AMM
2. The AMM formula produces a gross SOL output
3. Fees are calculated on the gross SOL output
4. The seller receives: `netSolOut = grossSolOut − fees`

### Graduation Fee

An additional fee is charged at graduation to cover the cost of initializing the Raydium CPMM liquidity pool. See [Protocol Fees](/protocol-fees) for the current rate.

## First Buy Mechanism

The first buy mechanism allows a designated buyer to make a fee-free initial purchase when the curve is created.

When configured, the following rules apply:

1. **Co-signature required** — the designated buyer's wallet must co-sign the curve creation transaction
2. **Fees waived** — all fees (protocol swap fee and creator fee) are waived for this initial purchase only
3. **One-time only** — after the first buy completes, the mechanism is consumed; all subsequent swaps by any wallet, including the same buyer, are charged the normal fees

## Bonding Curve Lifecycle

A Genesis Bonding Curve launch moves through three sequential phases:

### Phase 1: Created

The curve is initialized with the token allocation, virtual reserve parameters, fee configuration, swap window start time, and any extensions (first buy, creator fee). No trading is possible yet.

### Phase 2: Active

Once the configured start time is reached, users can buy and sell tokens freely. The price moves continuously according to the constant product formula as SOL flows in (buys) and out (sells). There is no deposit window — trading is always open while the curve is active.

### Phase 3: Graduated

When all tokens on the curve have been sold, graduation fires **automatically** — no manual trigger is required. The accumulated real SOL is migrated into a Raydium CPMM pool for ongoing secondary trading. The bonding curve itself is closed.

{% callout type="note" %}
Unlike a [launch pool](/smart-contracts/genesis/launch-pool), a bonding curve has no fixed end time. Graduation is triggered by supply exhaustion, not by a timer.
{% /callout %}

## Notes

- Virtual reserves exist only in the pricing math — they are never deposited onchain as real assets
- Creator fees are accrued in the bucket (`creatorFeeAccrued`), not transferred per-swap; see [Creator Fees](/smart-contracts/genesis/creator-fees) for configuration and claiming (`claimBondingCurveCreatorFeeV2` / `claimRaydiumCreatorFeeV2`)
- Graduation fires automatically on full token exhaustion — no separate instruction is required
- The protocol swap fee rate is set by Metaplex and is not configurable by creators; see [Protocol Fees](/protocol-fees) for current rates
- The first buy mechanism is configured at curve creation and cannot be added after the fact
- For raw swap formulas, reverse calculation, and reserve exhaustion handling, see [Advanced Internals](/smart-contracts/genesis/bonding-curve-internals)

## FAQ

### What is the difference between a bonding curve launch and a launch pool?
A [launch pool](/smart-contracts/genesis/launch-pool) has a fixed deposit window and batch price discovery — users deposit during the window and receive tokens proportionally at a single clearing price. A bonding curve has no fixed window: users can buy and sell at any time after the swap window opens, with the price updating continuously after every trade.

### Why does Genesis Bonding Curve use virtual reserves instead of a standard AMM?
A standard `x × y = k` curve approaches infinity at both extremes, making a complete sell-out impossible at practical prices. Virtual reserves (virtual SOL and virtual tokens added at initialization) anchor the curve with a finite starting price and shape it so that all real tokens can be sold through at bounded, predictable prices.

### What triggers graduation and what happens to the accumulated SOL?
Graduation fires automatically when all tokens on the curve have been sold — no separate instruction is required. The accumulated real SOL is migrated into a Raydium CPMM pool for ongoing secondary trading, and the bonding curve account is closed.

### Are the protocol fee and the creator fee compounded?
No. Both fees are calculated independently on the gross SOL amount of each swap. The net amount is `gross − protocolFee − creatorFee`. They do not compound.

### Does the first buyer pay any fees?
No. When the first buy mechanism is configured, all fees are waived for that initial purchase. All subsequent swaps — including further buys from the same wallet — are charged the normal protocol and creator fees.

## Glossary

| Term | Definition |
|------|------------|
| **Constant product AMM** | An automated market maker using `x × y = k` where the product of reserves is held constant |
| **Virtual reserves** | SOL and token amounts added at curve initialization that exist only in the pricing math; they set the starting price and enable a complete sell-out |
| **Real reserves** | Actual SOL deposited by buyers (`quoteTokenDepositTotal`) and actual tokens remaining (`baseTokenBalance`) |
| **`k` invariant** | The constant `k = totalSol × totalTokens`; ceiling division ensures swaps can only increase `k`, never decrease it |
| **Graduation** | The event triggered automatically when all curve tokens are sold; migrates accumulated SOL into a Raydium CPMM pool |
| **Raydium CPMM** | The Raydium constant product market maker pool that receives the bonding curve's liquidity at graduation |
| **First buy** | An optional extension that designates a wallet and SOL amount for a one-time fee-free initial purchase at curve creation |
| **Creator fee** | An optional per-swap fee configured by the creator; accrued in the bucket and collected via `claimBondingCurveCreatorFeeV2`; see [Creator Fees](/smart-contracts/genesis/creator-fees) |
| **Protocol swap fee** | A per-swap fee set by Metaplex; charged on every buy and sell; not configurable by creators |
| **Graduation fee** | A one-time fee charged at graduation to cover the cost of initializing the Raydium CPMM pool |
