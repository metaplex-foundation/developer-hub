---
title: Deposit
metaTitle: Deposit into MPL-Distro | Metaplex CLI
description: Deposit SPL tokens into an MPL-Distro vault with mplx distro deposit.
keywords:
  - mplx distro deposit
  - fund token distribution
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
  - Pass the distribution address printed by distro create
  - Choose --amount in mint decimals or --basisAmount in base units
  - Confirm the new vault total in the command output
howToTools:
  - Metaplex CLI (mplx)
faqs:
  - q: Must the claim window be active to deposit?
    a: No. Deposits are allowed before, during, and after the claim window.
  - q: What is the difference between --amount and --basisAmount?
    a: --amount is a decimal using the mint's decimals (1.0 is one token). --basisAmount is raw base units (1_000_000 is one token when decimals are 6).
---

{% callout title="What You'll Do" %}
Move SPL tokens from your wallet into an [MPL-Distro](/smart-contracts/mpl-distro) vault:
- Deposit using human-readable amounts or raw base units
- Confirm the new `totalAmount` on the distribution
{% /callout %}

## Summary

The `mplx distro deposit` command transfers tokens from the current identity's associated token account into the distribution vault.

- **Required argument**: distribution public key
- **Required flag**: `--amount` or `--basisAmount` (mutually exclusive)
- **Deposits are not time-gated**: the claim window does not have to be active

The identity must hold enough tokens. The command fetches mint decimals to convert `--amount`.

**Jump to:** [Basic Usage](#basic-usage) · [Options](#options) · [Examples](#examples) · [Output](#output) · [Common Errors](#common-errors) · [FAQ](#faq)

## Basic Usage

Pass the distribution address and one amount flag.

```bash {% title="Deposit 1.0 token" %}
mplx distro deposit <DISTRIBUTION> --amount 1.0
```

```bash {% title="Deposit 1,000,000 base units" %}
mplx distro deposit <DISTRIBUTION> --basisAmount 1000000
```

## Options

Exactly one of `--amount` or `--basisAmount` must be set.

| Flag | Short | Description | Required |
|------|-------|-------------|----------|
| `--amount <number>` | `-a` | Human-readable amount using mint decimals | One of |
| `--basisAmount <integer>` | `-b` | Amount in token base units | One of |

For a 6-decimal mint, `--amount 1.0` and `--basisAmount 1000000` deposit the same quantity.

## Examples

Deposit after [`distro create`](/dev-tools/cli/distro/create):

```bash {% title="Fund a new distribution" %}
mplx distro deposit <DISTRIBUTION> --amount 1.0
```

## Output

On success the command prints decimal and base-unit amounts.

```text {% title="Expected output" %}
Deposited 1 tokens (1000000 basis) to distribution
Distribution: <DISTRIBUTION>
Mint: <TOKEN_MINT>
Amount deposited: 1 tokens (1000000 basis)
New total deposited: 1 tokens (1000000 basis)

Transaction: <SIGNATURE>
```

Use this output for decimal-aware totals. [`distro fetch`](/dev-tools/cli/distro/fetch) prints the same token amounts when the mint can be fetched.

## Common Errors

These failures happen when the vault cannot be funded.

| Error | Cause | Fix |
|-------|-------|-----|
| Either `--amount` or `--basisAmount` must be provided | Neither amount flag was set | Pass one of the two flags |
| Insufficient balance | Identity ATA has fewer tokens than requested | Mint or transfer tokens first |
| You do not have a token account for this mint | No ATA for this mint | Receive or mint the token first |
| `InvalidPublicKeyError` | The distribution argument is not a base58 public key | Pass the PDA printed by `distro create` |
| Distribution not found | Wrong PDA or cluster | Run `distro fetch` on the same RPC |

## Notes

Deposit does not check that the vault covers the sum of Merkle allocations.

- Fund at least the sum of every `amount` in the tree before claims begin. See [Funding and Recovery](/smart-contracts/mpl-distro/funding-and-recovery).
- Deposits are allowed before, during, and after the claim window.
- Create the token mint with [`toolbox token create`](/dev-tools/cli/toolbox/token-create) and add supply with [`toolbox token mint`](/dev-tools/cli/toolbox/token-mint) (`mint` amount is raw base units).

## FAQ

**Must the claim window be active to deposit?**
No. Deposits are allowed before, during, and after the claim window.

**What is the difference between --amount and --basisAmount?**
`--amount` is a decimal using the mint's decimals (`1.0` is one token). `--basisAmount` is raw base units (`1000000` is one token when decimals are 6).
