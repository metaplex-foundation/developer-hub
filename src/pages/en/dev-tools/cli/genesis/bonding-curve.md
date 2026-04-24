---
title: Bonding Curve
metaTitle: Bonding Curve | Metaplex CLI
description: Create a bonding curve token launch, buy and sell tokens, check curve status, and inspect the bonding curve bucket using the Metaplex CLI.
keywords:
  - genesis bonding curve
  - genesis swap
  - bonding curve
  - mplx genesis swap
  - token swap
  - buy tokens
  - sell tokens
  - Metaplex CLI
about:
  - Genesis bonding curve
  - token swap
  - constant product AMM
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '04-09-2026'
updated: '04-09-2026'
howToSteps:
  - Create a bonding curve launch with genesis launch create --launchType bonding-curve
  - Buy tokens with genesis swap --buyAmount or sell with --sellAmount
  - Use genesis swap --info to check curve status and get price quotes
  - Inspect the bucket with genesis bucket fetch --type bonding-curve
howToTools:
  - Metaplex CLI (mplx)
faqs:
  - q: What pricing model does the bonding curve use?
    a: The bonding curve uses a constant-product formula. The price increases as more tokens are bought and decreases as tokens are sold.
  - q: Do I need to wrap SOL before buying?
    a: No. When buying with SOL, the swap command automatically wraps SOL to WSOL if needed.
  - q: How do I check the price before swapping?
    a: Use the --info flag to display curve status. Combine --info with --buyAmount or --sellAmount to get a quote without executing a swap.
  - q: What happens when the curve is fully filled?
    a: When all tokens are sold, the bonding curve auto-graduates to a Raydium CPMM pool. Trading continues on Raydium after graduation.
  - q: Can I create a bonding curve with the manual flow?
    a: No. Bonding curve launches are only available through the Genesis API via genesis launch create --launchType bonding-curve.
---

{% callout title="What You'll Do" %}
Run the full bonding curve lifecycle from the CLI:
- Create a bonding curve token launch via the Genesis API
- Buy and sell tokens on the curve
- Check curve status and get price quotes
- Inspect the bonding curve bucket
{% /callout %}

## Summary

A bonding curve launch creates a constant-product AMM where trading starts immediately — no deposit window. The price rises as SOL flows in, and the curve auto-graduates to a Raydium CPMM pool when all tokens are sold. This page covers the full bonding curve lifecycle.

- **Creation**: Via [`genesis launch create --launchType bonding-curve`](/dev-tools/cli/genesis/launch#bonding-curve) (API only, no manual flow)
- **Trading**: Buy with `genesis swap --buyAmount` or sell with `--sellAmount`
- **Info**: Check price, reserves, fill percentage with `genesis swap --info`
- **Inspect**: View bucket configuration with `genesis bucket fetch --type bonding-curve`
- **Graduation**: Auto-graduates to Raydium CPMM when fully filled

**Jump to:** [Create a Bonding Curve](#create-a-bonding-curve) · [Swap (Buy and Sell)](#swap-buy-and-sell) · [Checking Curve Status](#checking-curve-status) · [Inspect Bonding Curve Bucket](#inspect-bonding-curve-bucket) · [Full Lifecycle Example](#full-lifecycle-example) · [Common Errors](#common-errors) · [FAQ](#faq)

## Create a Bonding Curve

Bonding curve launches are created via the [Genesis API](/dev-tools/cli/genesis/launch#bonding-curve). Only `--name`, `--symbol`, and `--image` are required:

```bash {% title="Create a bonding curve launch" %}
mplx genesis launch create --launchType bonding-curve \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123"
```

Optionally configure creator fees, a first buy, or link to an [agent](/agents):

```bash {% title="With creator fee and first buy" %}
mplx genesis launch create --launchType bonding-curve \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --creatorFeeWallet <FEE_WALLET_ADDRESS> \
  --firstBuyAmount 0.1
```

```bash {% title="With agent" %}
mplx genesis launch create --launchType bonding-curve \
  --name "Agent Token" \
  --symbol "AGT" \
  --image "https://gateway.irys.xyz/abc123" \
  --agentAsset <AGENT_CORE_ASSET_ADDRESS> \
  --agentSetToken
```

See [Launch (API)](/dev-tools/cli/genesis/launch) for all flags and details.

{% callout type="note" %}
Bonding curves are only available through the Genesis API. There is no manual `bucket add-bonding-curve` command.
{% /callout %}

## Swap (Buy and Sell)

The `mplx genesis swap` command buys or sells tokens on the bonding curve.

```bash {% title="Buy tokens (spend 0.05 SOL)" %}
mplx genesis swap <GENESIS_ACCOUNT> --buyAmount 50000000
```

```bash {% title="Sell tokens" %}
mplx genesis swap <GENESIS_ACCOUNT> --sellAmount 500000000000
```

### Swap Options

| Flag | Short | Description | Required | Default |
|------|-------|-------------|----------|---------|
| `--buyAmount <string>` | | Amount of quote tokens to spend (e.g. lamports for SOL) | No | |
| `--sellAmount <string>` | | Amount of base tokens to sell | No | |
| `--slippage <integer>` | | Slippage tolerance in basis points | No | `200` (2%) |
| `--bucketIndex <integer>` | `-b` | Index of the bonding curve bucket | No | `0` |
| `--info` | | Display curve status and price quotes without swapping | No | `false` |

{% callout type="note" title="Exactly one amount required" %}
When swapping, provide exactly one of `--buyAmount` or `--sellAmount`. Use `--info` to view curve status without swapping.
{% /callout %}

### Swap Examples

Buy with custom slippage (1%):

```bash {% title="Buy with 1% slippage" %}
mplx genesis swap <GENESIS_ACCOUNT> --buyAmount 50000000 --slippage 100
```

### Swap Output

```text {% title="Expected swap output" %}
--------------------------------
  Direction: Buy
  Amount In: 50000000 (quote tokens)
  Amount Out: <base_tokens_received>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
--------------------------------
```

## Checking Curve Status

The `--info` flag displays the current curve state without executing a swap:

```bash {% title="Curve status only" %}
mplx genesis swap <GENESIS_ACCOUNT> --info
```

Combine `--info` with an amount to get a price quote:

```bash {% title="Buy quote (how many tokens for 0.1 SOL?)" %}
mplx genesis swap <GENESIS_ACCOUNT> --info --buyAmount 100000000
```

```bash {% title="Sell quote (how much SOL for selling tokens?)" %}
mplx genesis swap <GENESIS_ACCOUNT> --info --sellAmount 1000000000
```

The info output includes:
- Current price per token
- Reserve balances (base and quote)
- Fill percentage
- Whether the curve is currently swappable
- Price quote with fees and minimum output (when an amount is provided)

## Inspect Bonding Curve Bucket

The [`genesis bucket fetch`](/dev-tools/cli/genesis/manage#fetch-bucket) command with `--type bonding-curve` retrieves the full bucket configuration:

```bash {% title="Fetch bonding curve bucket" %}
mplx genesis bucket fetch <GENESIS_ACCOUNT> --type bonding-curve
```

Or let the CLI auto-detect the bucket type:

```bash {% title="Auto-detect bucket type" %}
mplx genesis bucket fetch <GENESIS_ACCOUNT>
```

## Full Lifecycle Example

```bash {% title="Complete bonding curve lifecycle" %}
# 1. Create a bonding curve launch
mplx genesis launch create --launchType bonding-curve \
  --name "My Token" --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123"

# (copy GENESIS_ACCOUNT from output)

# 2. Check curve status
mplx genesis swap <GENESIS_ACCOUNT> --info

# 3. Buy tokens (0.1 SOL)
mplx genesis swap <GENESIS_ACCOUNT> --buyAmount 100000000

# 4. Check price after buying
mplx genesis swap <GENESIS_ACCOUNT> --info

# 5. Sell some tokens
mplx genesis swap <GENESIS_ACCOUNT> --sellAmount 500000000000

# 6. Inspect bucket state
mplx genesis bucket fetch <GENESIS_ACCOUNT> --type bonding-curve
```

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Either --buyAmount or --sellAmount is required | No amount specified and `--info` not used | Add `--buyAmount`, `--sellAmount`, or `--info` |
| Cannot specify both --buyAmount and --sellAmount | Both amounts provided | Use exactly one amount per swap |
| Curve is not swappable | Curve hasn't started or is sold out (graduated) | Check status with `--info` — the curve may have graduated to Raydium |
| Slippage exceeded | Price moved beyond tolerance | Increase `--slippage` or retry with a smaller amount |
| Insufficient funds | Not enough SOL or tokens in wallet | Check your balance with `mplx toolbox sol balance` |

## Notes

- All amounts are in base units — for SOL, 1 SOL = 1,000,000,000 lamports
- When buying with SOL as the quote token, the swap command automatically wraps SOL to WSOL
- The default slippage of 200 bps (2%) protects against price movement between quote and execution
- Creator fees are always enabled on bonding curves — they default to the launching wallet and accrue in the bucket during trading
- After the curve graduates to Raydium, trading continues on the Raydium CPMM pool

## FAQ

**What pricing model does the bonding curve use?**
The bonding curve uses a constant-product formula. The price increases as more tokens are bought and decreases as tokens are sold.

**Do I need to wrap SOL before buying?**
No. When buying with SOL, the swap command automatically wraps SOL to WSOL if needed.

**How do I check the price before swapping?**
Use the `--info` flag to display curve status. Combine `--info` with `--buyAmount` or `--sellAmount` to get a quote without executing a swap.

**What happens when the curve is fully filled?**
When all tokens are sold, the bonding curve auto-graduates to a Raydium CPMM pool. Trading continues on Raydium after graduation.

**Can I create a bonding curve with the manual flow?**
No. Bonding curve launches are only available through the Genesis API via `genesis launch create --launchType bonding-curve`.

## Glossary

| Term | Definition |
|------|------------|
| **Bonding Curve** | A constant-product AMM that prices tokens based on supply — price rises as tokens are bought and falls as they are sold |
| **Graduation** | When all tokens on the curve are sold, liquidity auto-migrates to a Raydium CPMM pool |
| **Quote Token** | The token spent when buying (usually SOL) — amounts are in base units (lamports) |
| **Base Token** | The token being launched and traded on the curve |
| **Slippage** | Maximum allowed price deviation between quote and execution, in basis points |
| **Fill Percentage** | How much of the curve's total capacity has been filled (100% = graduation) |
| **Creator Fee** | A fee on swaps directed to the creator wallet, accrued in the bucket and claimed after graduation |
