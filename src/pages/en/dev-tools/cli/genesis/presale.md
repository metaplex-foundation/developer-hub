---
title: Presale
metaTitle: Presale | Metaplex CLI
description: Create a presale bucket, deposit, and claim tokens from a Genesis presale using the Metaplex CLI.
keywords:
  - genesis presale
  - fixed-price token sale
  - presale bucket
  - mplx genesis presale
  - token presale CLI
about:
  - presale bucket
  - fixed-price token distribution
  - presale deposit and claim
  - Genesis CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
howToSteps:
  - Add a presale bucket with allocation, quoteCap, and time windows using bucket add-presale
  - Finalize the Genesis account to activate the launch
  - Wrap SOL and deposit quote tokens during the deposit window
  - Claim base tokens at the fixed price after the claim period opens
howToTools:
  - Metaplex CLI (mplx)
  - Solana CLI
faqs:
  - q: How is the presale price determined?
    a: The price is calculated as quoteCap divided by allocation. For example, 100 SOL quoteCap with 1,000,000 token allocation = 0.0001 SOL per token.
  - q: What happens if the presale doesn't fill completely?
    a: Users who deposited still receive tokens at the fixed price. Unsold tokens remain in the bucket.
  - q: Can I set deposit limits on a presale?
    a: Yes. Use minimumDeposit for a per-transaction minimum and depositLimit for a per-user maximum.
  - q: How do I calculate my token allocation from a presale?
    a: Your tokens = (your deposit / quoteCap) * allocation. If you deposited 1 SOL into a 100 SOL cap with 1M token allocation, you receive 10,000 tokens.
---

{% callout title="What You'll Do" %}
Run the full presale lifecycle from the CLI:
- Add a presale bucket with fixed-price token allocation
- Deposit quote tokens during the sale window
- Claim base tokens at the predetermined price
{% /callout %}

## Summary

A presale sells tokens at a fixed price determined by `quoteCap / allocation`. This page covers the full presale lifecycle — from creating the bucket to claiming tokens.

- **Distribution**: Fixed price — `quoteCap / allocation` determines the per-token cost
- **Commands**: `bucket add-presale`, `presale deposit`, `presale claim`
- **Price example**: 100 SOL quote cap / 1,000,000 tokens = 0.0001 SOL per token
- **Quote token**: Wrapped SOL by default — wrap SOL before depositing

## Out of Scope

Launch pool buckets, unlocked buckets, end behaviors, Genesis account creation, finalization, frontend integration.

**Jump to:** [Add Bucket](#add-presale-bucket) · [Deposit](#deposit) · [Claim](#claim) · [Full Lifecycle](#full-lifecycle-example) · [Common Errors](#common-errors) · [FAQ](#faq)

*Maintained by Metaplex Foundation · Last verified February 2026 · Requires Metaplex CLI (mplx)*

## Add Presale Bucket

The `mplx genesis bucket add-presale` command adds a presale bucket to a Genesis account.

```bash {% title="Add a presale bucket" %}
mplx genesis bucket add-presale <GENESIS_ADDRESS> \
  --allocation 1000000000000000 \
  --quoteCap 100000000000 \
  --bucketIndex 0 \
  --depositStart 1704067200 \
  --depositEnd 1704153600 \
  --claimStart 1704153601 \
  --claimEnd 1735689600
```

### Options

| Flag | Short | Description | Required |
|------|-------|-------------|----------|
| `--allocation <string>` | `-a` | Base token allocation in base units | Yes |
| `--quoteCap <string>` | | Total quote tokens accepted — determines price | Yes |
| `--bucketIndex <integer>` | `-b` | Bucket index | Yes |
| `--depositStart <string>` | | Unix timestamp when deposits open | Yes |
| `--depositEnd <string>` | | Unix timestamp when deposits close | Yes |
| `--claimStart <string>` | | Unix timestamp when claims open | Yes |
| `--claimEnd <string>` | | Unix timestamp when claims close (defaults to far future) | No |
| `--minimumDeposit <string>` | | Minimum deposit per transaction in quote token base units | No |
| `--depositLimit <string>` | | Maximum deposit per user in quote token base units | No |

### Pricing

Price is calculated as:
```text {% title="Price formula" %}
price per token = quoteCap / allocation
```

**Example**: 100 SOL quote cap (`100000000000` lamports) / 1,000,000 tokens (`1000000000000000` base units) = 0.0001 SOL per token

## Deposit

The `mplx genesis presale deposit` command deposits quote tokens into a presale bucket during the deposit window.

```bash {% title="Deposit into presale" %}
mplx genesis presale deposit <GENESIS_ADDRESS> --amount 10000000000 --bucketIndex 0
```

### Options

| Flag | Short | Description | Required |
|------|-------|-------------|----------|
| `--amount <string>` | `-a` | Amount of quote tokens in base units (e.g. lamports) | Yes |
| `--bucketIndex <integer>` | `-b` | Index of the presale bucket (default: 0) | No |

### Examples

1. Wrap SOL and deposit 10 SOL:
```bash {% title="Wrap and deposit" %}
mplx toolbox sol wrap 10
mplx genesis presale deposit <GENESIS_ADDRESS> --amount 10000000000 --bucketIndex 0
```

## Claim

The `mplx genesis presale claim` command claims base tokens from a presale bucket after the claim period starts.

Token allocation is calculated as:
```text {% title="Claim formula" %}
userTokens = (userDeposit / quoteCap) * allocation
```

```bash {% title="Claim from presale" %}
mplx genesis presale claim <GENESIS_ADDRESS> --bucketIndex 0
```

### Options

| Flag | Short | Description | Required |
|------|-------|-------------|----------|
| `--bucketIndex <integer>` | `-b` | Index of the presale bucket (default: 0) | No |
| `--recipient <string>` | | Recipient address for claimed tokens (default: signer) | No |

### Examples

1. Claim to your own wallet:
```bash {% title="Claim to self" %}
mplx genesis presale claim <GENESIS_ADDRESS> --bucketIndex 0
```

2. Claim to a different wallet:
```bash {% title="Claim to another wallet" %}
mplx genesis presale claim <GENESIS_ADDRESS> --bucketIndex 0 --recipient <WALLET_ADDRESS>
```

## Full Lifecycle Example

```bash {% title="Complete presale lifecycle" %}
# 1. Create the token
mplx genesis create \
  --name "Example Token" \
  --symbol "EXM" \
  --totalSupply 1000000000000000 \
  --decimals 9

GENESIS=<GENESIS_ADDRESS>

# 2. Timestamps
NOW=$(date +%s)
DEPOSIT_END=$((NOW + 86400))
CLAIM_START=$((DEPOSIT_END + 1))
CLAIM_END=$((NOW + 31536000))

# 3. Add presale bucket: 1M tokens at 100 SOL cap
mplx genesis bucket add-presale $GENESIS \
  --allocation 1000000000000000 \
  --quoteCap 100000000000 \
  --bucketIndex 0 \
  --depositStart $NOW \
  --depositEnd $DEPOSIT_END \
  --claimStart $CLAIM_START \
  --claimEnd $CLAIM_END

# 4. Add unlocked bucket for team to receive SOL
mplx genesis bucket add-unlocked $GENESIS \
  --recipient $(solana address) \
  --claimStart $CLAIM_START \
  --allocation 0

# 5. Finalize
mplx genesis finalize $GENESIS

# 6. Verify
mplx genesis fetch $GENESIS
mplx genesis bucket fetch $GENESIS --bucketIndex 0 --type presale

# 7. Wrap SOL and deposit
mplx toolbox sol wrap 1
mplx genesis presale deposit $GENESIS --amount 1000000000 --bucketIndex 0

# 8. After deposit period, claim
mplx genesis presale claim $GENESIS --bucketIndex 0
```

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Deposit period not active | Current time is outside `depositStart`–`depositEnd` | Check timestamps with `genesis bucket fetch --type presale` |
| Claim period not active | Claiming before `claimStart` | Wait until after the claim start timestamp |
| Presale full | Total deposits have reached `quoteCap` | The presale is fully subscribed — no more deposits accepted |
| No wrapped SOL | Depositing native SOL instead of wrapped | Run `mplx toolbox sol wrap <amount>` first |
| Below minimum deposit | Deposit amount is less than `minimumDeposit` | Increase the deposit amount to meet the minimum |
| Exceeds deposit limit | User's total deposits exceed `depositLimit` | Reduce the deposit amount — you've hit the per-user cap |
| Nothing to claim | User has no deposits in this presale bucket | Verify the correct `--bucketIndex` and that you deposited during the window |

## FAQ

**How is the presale price determined?**
The price is calculated as `quoteCap / allocation`. For example, 100 SOL quote cap with 1,000,000 token allocation = 0.0001 SOL per token.

**What happens if the presale doesn't fill completely?**
Users who deposited still receive tokens at the fixed price. Unsold tokens remain in the bucket.

**Can I set deposit limits on a presale?**
Yes. Use `--minimumDeposit` for a per-transaction minimum and `--depositLimit` for a per-user maximum.

**How do I calculate my token allocation from a presale?**
Your tokens = `(your deposit / quoteCap) * allocation`. If you deposited 1 SOL into a 100 SOL cap with 1M token allocation, you receive 10,000 tokens.

**What's the difference between a presale and a launch pool?**
A presale has a fixed price set by `quoteCap / allocation`. A launch pool has a dynamic price — tokens are distributed proportionally based on each user's share of total deposits.

## Glossary

| Term | Definition |
|------|------------|
| **Presale** | Bucket type that sells tokens at a fixed price determined by `quoteCap / allocation` |
| **Quote Cap** | Maximum total quote tokens the presale accepts — together with allocation, determines the token price |
| **Allocation** | Base token amount available in this presale bucket, in base units |
| **Deposit Limit** | Maximum quote tokens a single user can deposit |
| **Minimum Deposit** | Minimum quote tokens per deposit transaction |
| **Fixed Price** | The per-token cost, calculated as `quoteCap / allocation` — does not change with demand |
