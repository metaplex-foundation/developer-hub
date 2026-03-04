---
title: Launch Pool
metaTitle: Launch Pool | Metaplex CLI
description: Create a launch pool bucket, deposit, withdraw, transition, and claim tokens using the Metaplex CLI.
keywords:
  - launch pool
  - genesis launch pool
  - token distribution
  - proportional distribution
  - mplx genesis deposit
about:
  - launch pool bucket
  - proportional token distribution
  - deposit and claim lifecycle
  - end behaviors
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
howToSteps:
  - Add a launch pool bucket with allocation and time windows using bucket add-launch-pool
  - Optionally configure end behaviors, penalties, vesting, and allowlists
  - Wrap SOL and deposit quote tokens during the deposit window
  - Transition collected funds to destination buckets after deposits close (if end behaviors are set)
  - Claim base tokens proportional to your deposit after the claim period opens
howToTools:
  - Metaplex CLI (mplx)
  - Solana CLI
faqs:
  - q: How are tokens distributed in a launch pool?
    a: Tokens are distributed proportionally. If you deposited 10% of total quote tokens in the pool, you receive 10% of the bucket's base token allocation.
  - q: Can I withdraw after depositing?
    a: Yes, but only during the deposit period. After the deposit window closes, withdrawals are no longer possible.
  - q: What are end behaviors?
    a: End behaviors forward collected quote tokens from a launch pool to destination buckets (usually unlocked buckets) after the deposit period ends. Use the transition command to execute them.
  - q: What is a claim schedule?
    a: A claim schedule adds vesting to token claims — tokens are released gradually over time instead of all at once, with optional cliff periods.
---

{% callout title="What You'll Do" %}
Run the full launch pool lifecycle from the CLI:
- Add a launch pool bucket with allocation and time windows
- Configure optional penalties, vesting, and allowlists
- Deposit, withdraw, transition, and claim tokens
{% /callout %}

## Summary

A launch pool collects deposits during a window and distributes tokens proportionally. This page covers the full launch pool lifecycle — from creating the bucket to claiming tokens.

- **Distribution**: Proportional — your share of deposits determines your share of tokens
- **Commands**: `bucket add-launch-pool`, `deposit`, `withdraw`, `transition`, `claim`
- **Optional features**: End behaviors, deposit/withdraw penalties, bonus schedules, claim vesting, allowlists
- **Quote token**: Wrapped SOL by default — wrap SOL before depositing

## Out of Scope

Presale buckets, unlocked buckets, Genesis account creation, finalization, frontend integration, token economics modeling.

**Jump to:** [Add Bucket](#add-launch-pool-bucket) · [Deposit](#deposit) · [Withdraw](#withdraw) · [Transition](#transition) · [Claim](#claim) · [Full Lifecycle](#full-lifecycle-example) · [Common Errors](#common-errors) · [FAQ](#faq)

## Add Launch Pool Bucket

The `mplx genesis bucket add-launch-pool` command adds a launch pool bucket to a Genesis account.

```bash {% title="Add a launch pool bucket" %}
mplx genesis bucket add-launch-pool <GENESIS_ADDRESS> \
  --allocation 500000000000000 \
  --depositStart 1704067200 \
  --depositEnd 1704153600 \
  --claimStart 1704153601 \
  --claimEnd 1735689600
```

### Options

| Flag | Short | Description | Required |
|------|-------|-------------|----------|
| `--allocation <string>` | `-a` | Base token allocation in base units | Yes |
| `--depositStart <string>` | | Unix timestamp when deposits open | Yes |
| `--depositEnd <string>` | | Unix timestamp when deposits close | Yes |
| `--claimStart <string>` | | Unix timestamp when claims open | Yes |
| `--claimEnd <string>` | | Unix timestamp when claims close | Yes |
| `--bucketIndex <integer>` | `-b` | Bucket index (default: 0) | No |
| `--endBehavior <string>` | | Format: `<destinationBucketAddress>:<percentageBps>` where `10000` = 100%. Can be specified multiple times | No |
| `--minimumDeposit <string>` | | Minimum deposit per transaction in base units | No |
| `--depositLimit <string>` | | Maximum deposit per user in base units | No |
| `--minimumQuoteTokenThreshold <string>` | | Minimum total quote tokens required for the bucket to succeed | No |
| `--depositPenalty <json>` | | Penalty schedule JSON | No |
| `--withdrawPenalty <json>` | | Withdraw penalty schedule JSON (same format as depositPenalty) | No |
| `--bonusSchedule <json>` | | Bonus schedule JSON | No |
| `--claimSchedule <json>` | | Claim vesting schedule JSON | No |
| `--allowlist <json>` | | Allowlist configuration JSON | No |

### JSON Option Formats

**Penalty schedule** (deposit or withdraw):
```json {% title="Penalty schedule format" %}
{"slopeBps":0,"interceptBps":200,"maxBps":200,"startTime":0,"endTime":0}
```

**Bonus schedule**:
```json {% title="Bonus schedule format" %}
{"slopeBps":0,"interceptBps":0,"maxBps":0,"startTime":0,"endTime":0}
```

**Claim vesting schedule**:
```json {% title="Claim schedule format" %}
{"startTime":0,"endTime":0,"period":0,"cliffTime":0,"cliffAmountBps":0}
```

**Allowlist**:
```json {% title="Allowlist format" %}
{"merkleTreeHeight":10,"merkleRoot":"<hex>","endTime":0,"quoteCap":0}
```

### Examples

1. Basic launch pool:
```bash {% title="Basic launch pool" %}
mplx genesis bucket add-launch-pool <GENESIS_ADDRESS> \
  --allocation 500000000000000 \
  --depositStart 1704067200 \
  --depositEnd 1704153600 \
  --claimStart 1704153601 \
  --claimEnd 1735689600
```

2. With end behavior and minimum deposit:
```bash {% title="With end behavior" %}
mplx genesis bucket add-launch-pool <GENESIS_ADDRESS> \
  --allocation 500000000000000 \
  --depositStart 1704067200 \
  --depositEnd 1704153600 \
  --claimStart 1704153601 \
  --claimEnd 1735689600 \
  --endBehavior "<DESTINATION_BUCKET_ADDRESS>:10000" \
  --minimumDeposit 100000000
```

3. With claim vesting:
```bash {% title="With claim vesting" %}
mplx genesis bucket add-launch-pool <GENESIS_ADDRESS> \
  --allocation 500000000000000 \
  --depositStart 1704067200 \
  --depositEnd 1704153600 \
  --claimStart 1704153601 \
  --claimEnd 1735689600 \
  --claimSchedule '{"startTime":1704153601,"endTime":1735689600,"period":86400,"cliffTime":1704240000,"cliffAmountBps":1000}'
```

## Deposit

The `mplx genesis deposit` command deposits quote tokens into a launch pool bucket during the deposit window. If using SOL as the quote token, wrap it first.

```bash {% title="Deposit into launch pool" %}
mplx genesis deposit <GENESIS_ADDRESS> --amount 10000000000 --bucketIndex 0
```

### Options

| Flag | Short | Description | Required |
|------|-------|-------------|----------|
| `--amount <string>` | `-a` | Amount of quote tokens in base units (e.g. lamports) | Yes |
| `--bucketIndex <integer>` | `-b` | Index of the launch pool bucket (default: 0) | No |

### Examples

1. Wrap SOL and deposit 10 SOL:
```bash {% title="Wrap and deposit" %}
mplx toolbox sol wrap 10
mplx genesis deposit <GENESIS_ADDRESS> --amount 10000000000 --bucketIndex 0
```

## Withdraw

The `mplx genesis withdraw` command withdraws quote tokens from a launch pool bucket. Only available during the deposit period.

```bash {% title="Withdraw from launch pool" %}
mplx genesis withdraw <GENESIS_ADDRESS> --amount 5000000000 --bucketIndex 0
```

### Options

| Flag | Short | Description | Required |
|------|-------|-------------|----------|
| `--amount <string>` | `-a` | Amount of quote tokens to withdraw in base units | Yes |
| `--bucketIndex <integer>` | `-b` | Index of the launch pool bucket (default: 0) | No |

## Transition

The `mplx genesis transition` command executes end behaviors after the deposit period closes, moving collected quote tokens to destination buckets.

```bash {% title="Transition end behaviors" %}
mplx genesis transition <GENESIS_ADDRESS> --bucketIndex 0
```

### Options

| Flag | Short | Description | Required |
|------|-------|-------------|----------|
| `--bucketIndex <integer>` | `-b` | Index of the launch pool bucket | Yes |

### Notes

- Must be called after the deposit period ends
- Only needed if the bucket has end behaviors configured

## Claim

The `mplx genesis claim` command claims base tokens from a launch pool bucket. Users receive tokens proportional to their deposit.

```bash {% title="Claim from launch pool" %}
mplx genesis claim <GENESIS_ADDRESS> --bucketIndex 0
```

### Options

| Flag | Short | Description | Required |
|------|-------|-------------|----------|
| `--bucketIndex <integer>` | `-b` | Index of the launch pool bucket (default: 0) | No |
| `--recipient <string>` | | Recipient address for claimed tokens (default: signer) | No |

### Examples

1. Claim to your own wallet:
```bash {% title="Claim to self" %}
mplx genesis claim <GENESIS_ADDRESS> --bucketIndex 0
```

2. Claim to a different wallet:
```bash {% title="Claim to another wallet" %}
mplx genesis claim <GENESIS_ADDRESS> --bucketIndex 0 --recipient <WALLET_ADDRESS>
```

## Full Lifecycle Example

```bash {% title="Complete launch pool lifecycle" %}
# 1. Create the Genesis account
mplx genesis create \
  --name "My Token" \
  --symbol "MTK" \
  --totalSupply 1000000000000000 \
  --decimals 9

# (copy GENESIS_ADDRESS from output)
GENESIS=<GENESIS_ADDRESS>

# 2. Timestamps
NOW=$(date +%s)
DEPOSIT_END=$((NOW + 86400))
CLAIM_START=$((DEPOSIT_END + 1))
CLAIM_END=$((NOW + 31536000))

# 3. Add a launch pool bucket with end behavior
mplx genesis bucket add-launch-pool $GENESIS \
  --allocation 500000000000000 \
  --depositStart $NOW \
  --depositEnd $DEPOSIT_END \
  --claimStart $CLAIM_START \
  --claimEnd $CLAIM_END \
  --endBehavior "<UNLOCKED_BUCKET_ADDRESS>:10000"

# 4. Add an unlocked bucket to receive SOL
mplx genesis bucket add-unlocked $GENESIS \
  --recipient $(solana address) \
  --claimStart $CLAIM_START \
  --allocation 0

# 5. Finalize
mplx genesis finalize $GENESIS

# 6. Wrap SOL and deposit
mplx toolbox sol wrap 10
mplx genesis deposit $GENESIS --amount 10000000000 --bucketIndex 0

# 7. After deposit period, transition
mplx genesis transition $GENESIS --bucketIndex 0

# 8. Claim tokens
mplx genesis claim $GENESIS --bucketIndex 0

# 9. Revoke mint authority
mplx genesis revoke $GENESIS --revokeMint
```

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Deposit period not active | Current time is outside `depositStart`–`depositEnd` | Check timestamps with `genesis bucket fetch` |
| Claim period not active | Claiming before `claimStart` | Wait until after the claim start timestamp |
| Withdrawal period ended | Trying to withdraw after deposit window closed | Withdrawals are only available during the deposit period |
| No wrapped SOL | Depositing native SOL instead of wrapped | Run `mplx toolbox sol wrap <amount>` first |
| Below minimum deposit | Deposit amount is less than `minimumDeposit` | Increase the deposit amount to meet the minimum |
| Exceeds deposit limit | User's total deposits exceed `depositLimit` | Reduce the deposit amount — you've hit the per-user cap |
| End behavior not configured | Running `transition` on a bucket without end behaviors | Transition is only needed for buckets with `--endBehavior` |
| Deposit period not ended | Running `transition` before deposits close | Wait until after `depositEnd` timestamp |

## FAQ

**How are tokens distributed in a launch pool?**
Tokens are distributed proportionally. If you deposited 10% of the total quote tokens in the pool, you receive 10% of the bucket's base token allocation.

**Can I withdraw after depositing?**
Yes, but only during the deposit period. After the deposit window closes, withdrawals are no longer possible.

**What are end behaviors?**
End behaviors forward collected quote tokens from a launch pool to destination buckets (usually unlocked buckets) after the deposit period ends. You must call `genesis transition` to execute them.

**What is a claim schedule?**
A claim schedule adds vesting to token claims. Instead of receiving all tokens at once, they are released gradually based on the configured `period`, `cliffTime`, and `cliffAmountBps`.

**What happens if minimumQuoteTokenThreshold is not met?**
If the total deposits don't reach the threshold, the bucket does not succeed and depositors can reclaim their funds.

**Can I split end behaviors across multiple destinations?**
Yes. Specify `--endBehavior` multiple times with different destination addresses and percentages (in basis points, totaling 10000).

## Glossary

| Term | Definition |
|------|------------|
| **Launch Pool** | Bucket type that distributes tokens proportionally based on deposit share |
| **End Behavior** | Rules forwarding collected quote tokens to destination buckets after deposits close |
| **Transition** | The command that executes end behaviors — must be called explicitly after the deposit period |
| **Claim Schedule** | Vesting configuration controlling gradual token release over time |
| **Deposit Penalty** | Fee applied to deposits, configured as basis points with optional time-based slope |
| **Withdraw Penalty** | Fee applied to withdrawals during the deposit period |
| **Bonus Schedule** | Extra token allocation for early or specific-timing deposits |
| **Allowlist** | Merkle-tree-based access control limiting who can deposit |
| **Basis Points (bps)** | 1/100th of a percent — 10000 bps = 100%, 100 bps = 1% |
