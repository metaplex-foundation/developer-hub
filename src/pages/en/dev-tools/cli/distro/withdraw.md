---
title: Withdraw
metaTitle: Withdraw from MPL-Distro | Metaplex CLI
description: Withdraw unclaimed MPL-Distro tokens with mplx distro withdraw while the claim window is inactive.
keywords:
  - mplx distro withdraw
  - recover unclaimed tokens
  - MPL-Distro CLI
  - Metaplex CLI
about:
  - MPL-Distro
  - Metaplex CLI
  - token distribution
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '08-27-2026'
updated: '08-27-2026'
howToSteps:
  - Confirm the distribution is Not Started or Ended
  - Pass --amount or --basisAmount as the distribution authority
  - Optionally set --recipient to send tokens to another wallet
howToTools:
  - Metaplex CLI (mplx)
faqs:
  - q: When does distro withdraw succeed?
    a: The authority can withdraw before startTime or after endTime. The program rejects withdrawals while the claim window is active.
  - q: Who can withdraw?
    a: Only the distribution authority. The CLI identity must match the on-chain authority.
---

{% callout title="What You'll Do" %}
Recover [MPL-Distro](/smart-contracts/mpl-distro) tokens from the vault:
- Withdraw as the distribution authority while the claim window is inactive
- Send tokens to the authority or to `--recipient`
{% /callout %}

## Summary

The `mplx distro withdraw` command transfers unclaimed tokens from the distribution vault to a recipient associated token account.

- **Required argument**: distribution public key
- **Required flag**: `--amount` or `--basisAmount` (mutually exclusive)
- **Signer**: the on-chain distribution authority
- **Window**: succeeds only when cluster time is before `startTime` or after `endTime`

Available balance is `totalAmount - claimAmount`. See [Funding and Recovery](/smart-contracts/mpl-distro/funding-and-recovery).

**Jump to:** [Basic Usage](#basic-usage) · [Options](#options) · [Examples](#examples) · [Output](#output) · [Common Errors](#common-errors) · [FAQ](#faq)

## Basic Usage

Withdraw to the authority wallet, or pass `--recipient`.

```bash {% title="Withdraw 0.5 tokens to the authority" %}
mplx distro withdraw <DISTRIBUTION> --amount 0.5
```

```bash {% title="Withdraw base units to another wallet" %}
mplx distro withdraw <DISTRIBUTION> \
  --basisAmount 500000 \
  --recipient <WALLET>
```

## Options

Exactly one amount flag is required. `--recipient` defaults to the authority.

| Flag | Short | Description | Required |
|------|-------|-------------|----------|
| `--amount <number>` | `-a` | Human-readable amount using mint decimals | One of |
| `--basisAmount <integer>` | `-b` | Amount in token base units | One of |
| `--recipient <string>` | `-r` | Destination wallet (defaults to the authority) | No |

For a 6-decimal mint, `--amount 0.5` and `--basisAmount 500000` withdraw the same quantity.

## Examples

Recover leftovers after the window ends:

```bash {% title="Recover remaining vault tokens" %}
mplx distro withdraw <DISTRIBUTION> --amount 0.5
```

## Output

On success the command prints the withdrawn amount and remaining available balance.

```text {% title="Expected output" %}
Withdrew 0.5 tokens (500000 basis) from distribution
Distribution: <DISTRIBUTION>
Mint: <TOKEN_MINT>
Amount withdrawn: 0.5 tokens (500000 basis)
Recipient: <WALLET>
Remaining available for withdrawal: 0.5 tokens (500000 basis)

Transaction: <SIGNATURE>
```

## Common Errors

These failures happen when the vault cannot be drained.

| Error | Cause | Fix |
|-------|-------|-----|
| Only the distribution authority can withdraw | CLI identity is not the authority | Switch keypair to the authority |
| Insufficient available balance for withdrawal | Amount exceeds `totalAmount - claimAmount` | Lower the amount |
| Distribution does not have a token account | Nothing has been deposited | Deposit first, or skip withdraw |
| Withdrawal rejected during the active window | `startTime <= now <= endTime` | Wait until before start or after end |
| `InvalidPublicKeyError` | The distribution argument is not a base58 public key | Pass the PDA printed by `distro create` |

The CLI does not pre-check the time window; the program returns the rejection.

## Notes

Withdraw recovers tokens, not unused receipt-rent subsidy.

- The CLI has no `withdrawSubsidy` command. Recover subsidy SOL with the [JavaScript SDK](/smart-contracts/mpl-distro/sdk/javascript).
- Create the distribution with a future `startTime` if you need to test withdraw before claims open.
- Claimed tokens cannot be withdrawn.

## FAQ

**When does distro withdraw succeed?**
The authority can withdraw before `startTime` or after `endTime`. The program rejects withdrawals while the claim window is active.

**Who can withdraw?**
Only the distribution authority. The CLI identity must match the on-chain authority.
