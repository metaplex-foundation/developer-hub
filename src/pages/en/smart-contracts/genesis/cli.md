---
title: CLI Guide
metaTitle: Genesis - CLI Guide
description: Launch tokens using the Metaplex CLI (mplx) — create Genesis accounts, add buckets, deposit, claim, and manage your token launch from the terminal.
---

The Metaplex CLI (`mplx`) lets you run a full Genesis token launch from your terminal. This guide walks through every step — from creating the Genesis account to claiming tokens — using CLI commands instead of the SDK.

## Prerequisites

- The Metaplex CLI installed and on your `PATH`
- A Solana keypair file (e.g., `~/.config/solana/id.json`)
- SOL for transaction fees
- An RPC endpoint configured via `mplx config rpc add` or passed with `-r`

Check your setup:

```bash
mplx genesis --help
```

## Launch Pool Walkthrough

A Launch Pool collects deposits during a window and distributes tokens proportionally. Here's the full lifecycle.

### 1. Create the Genesis Account

This creates your token and the master coordination account.

```bash
mplx genesis create \
  --name "My Token" \
  --symbol "MTK" \
  --totalSupply 1000000000000000 \
  --decimals 9
```

Save the `Genesis Account` address from the output — you'll use it in every subsequent command.

{% callout type="note" %}
`totalSupply` is in base units. With 9 decimals, `1000000000000000` = 1,000,000 tokens.
{% /callout %}

### 2. Add a Launch Pool Bucket

Define the deposit/claim windows with Unix timestamps. The allocation is how many base tokens go into this bucket.

```bash
# Calculate timestamps (example: deposits open now, close in 24h, claims after that)
# depositStart:  $(date +%s)
# depositEnd:    $(date -d '+1 day' +%s)
# claimStart:    $(date -d '+1 day +1 second' +%s)
# claimEnd:      $(date -d '+1 year' +%s)

mplx genesis bucket add-launch-pool <GENESIS_ADDRESS> \
  --allocation 500000000000000 \
  --depositStart 1704067200 \
  --depositEnd 1704153600 \
  --claimStart 1704153601 \
  --claimEnd 1735689600
```

Save the `Bucket Address` from the output.

#### Optional: End Behaviors and Minimum Deposit

Send 100% of collected SOL to another bucket after deposits close:

```bash
mplx genesis bucket add-launch-pool <GENESIS_ADDRESS> \
  --allocation 500000000000000 \
  --depositStart 1704067200 \
  --depositEnd 1704153600 \
  --claimStart 1704153601 \
  --claimEnd 1735689600 \
  --endBehavior "<DESTINATION_BUCKET_ADDRESS>:10000" \
  --minimumDeposit 100000000
```

The `--endBehavior` format is `<destinationBucketAddress>:<percentageBps>` where `10000` = 100%. You can pass `--endBehavior` multiple times to split funds across buckets.

### 3. Add an Unlocked Bucket (Optional)

If your launch pool has end behaviors that send SOL somewhere, you need a destination. An unlocked bucket lets a designated recipient claim the forwarded SOL.

```bash
mplx genesis bucket add-unlocked <GENESIS_ADDRESS> \
  --recipient <RECIPIENT_WALLET_ADDRESS> \
  --claimStart 1704153601 \
  --allocation 0
```

`--allocation 0` means this bucket doesn't hold base tokens — it only receives quote tokens via end behaviors.

### 4. Finalize

Lock the configuration. After this, no more buckets can be added.

```bash
mplx genesis finalize <GENESIS_ADDRESS>
```

{% callout type="warning" %}
**Finalization is irreversible.** Double-check all bucket configurations before running this.
{% /callout %}

### 5. Deposit

Users deposit wrapped SOL into the launch pool during the deposit window. If depositing SOL, wrap it first:

```bash
mplx toolbox sol wrap 10
```

Then deposit:

```bash
mplx genesis deposit <GENESIS_ADDRESS> \
  --amount 10000000000 \
  --bucketIndex 0
```

The `--amount` is in lamports (1 SOL = 1,000,000,000 lamports).

### 6. Withdraw (Optional)

Users can withdraw during the deposit period:

```bash
mplx genesis withdraw <GENESIS_ADDRESS> \
  --amount 5000000000 \
  --bucketIndex 0
```

### 7. Transition

After deposits close, execute end behaviors to move collected SOL:

```bash
mplx genesis transition <GENESIS_ADDRESS> \
  --bucketIndex 0
```

### 8. Claim Tokens

After the claim period starts, users claim their proportional token allocation:

```bash
mplx genesis claim <GENESIS_ADDRESS> \
  --bucketIndex 0
```

Or claim to a different wallet:

```bash
mplx genesis claim <GENESIS_ADDRESS> \
  --bucketIndex 0 \
  --recipient <WALLET_ADDRESS>
```

### 9. Claim Unlocked (Team/Treasury)

If you set up an unlocked bucket to receive SOL from end behaviors:

```bash
mplx genesis claim-unlocked <GENESIS_ADDRESS> \
  --bucketIndex 1
```

### 10. Revoke Authorities

After the launch is complete, revoke mint authority so no new tokens can ever be minted:

```bash
mplx genesis revoke <GENESIS_ADDRESS> --revokeMint
```

## Presale Walkthrough

A Presale sells tokens at a fixed price determined by `quoteCap / allocation`. The steps are similar to a Launch Pool but use presale-specific commands.

### 1. Create the Genesis Account

Same as above:

```bash
mplx genesis create \
  --name "Presale Token" \
  --symbol "PSL" \
  --totalSupply 1000000000000000 \
  --decimals 9
```

### 2. Add a Presale Bucket

The key difference: you set a `--quoteCap` which determines the fixed token price.

```bash
mplx genesis bucket add-presale <GENESIS_ADDRESS> \
  --allocation 1000000000000000 \
  --quoteCap 100000000000 \
  --depositStart 1704067200 \
  --depositEnd 1704153600 \
  --claimStart 1704153601 \
  --claimEnd 1735689600
```

In this example:
- **Allocation:** 1,000,000 tokens (with 9 decimals)
- **Quote Cap:** 100 SOL (in lamports)
- **Price:** 100 SOL / 1,000,000 tokens = 0.0001 SOL per token

#### Optional Flags

```bash
# Set a minimum deposit and per-user deposit limit
mplx genesis bucket add-presale <GENESIS_ADDRESS> \
  --allocation 1000000000000000 \
  --quoteCap 100000000000 \
  --depositStart 1704067200 \
  --depositEnd 1704153600 \
  --claimStart 1704153601 \
  --minimumDeposit 100000000 \
  --depositLimit 10000000000
```

| Flag | Description |
|------|-------------|
| `--minimumDeposit` | Minimum deposit per transaction (lamports) |
| `--depositLimit` | Maximum total deposit per user (lamports) |
| `--claimEnd` | Defaults to far future if omitted |
| `--bucketIndex` | Auto-increments if omitted |

### 3. Add an Unlocked Bucket (Optional)

To receive the collected SOL after transition:

```bash
mplx genesis bucket add-unlocked <GENESIS_ADDRESS> \
  --recipient <YOUR_WALLET_ADDRESS> \
  --claimStart 1704153601 \
  --allocation 0
```

### 4. Finalize

```bash
mplx genesis finalize <GENESIS_ADDRESS>
```

### 5. Deposit into Presale

Users deposit during the deposit window:

```bash
mplx toolbox sol wrap 10

mplx genesis presale deposit <GENESIS_ADDRESS> \
  --amount 10000000000 \
  --bucketIndex 0
```

### 6. Claim from Presale

After the claim period opens:

```bash
mplx genesis presale claim <GENESIS_ADDRESS> \
  --bucketIndex 0
```

Token allocation formula:
```
userTokens = (userDeposit / quoteCap) * allocation
```

## Fetching State

### Genesis Account

```bash
mplx genesis fetch <GENESIS_ADDRESS>
```

Shows: bucket count, total supply, finalization status, base/quote mints.

### Buckets

Fetch by type with the `--type` flag:

```bash
# Launch pool (default)
mplx genesis bucket fetch <GENESIS_ADDRESS> --bucketIndex 0

# Presale
mplx genesis bucket fetch <GENESIS_ADDRESS> --bucketIndex 0 --type presale

# Unlocked
mplx genesis bucket fetch <GENESIS_ADDRESS> --bucketIndex 1 --type unlocked
```

## Complete Presale Example

End-to-end script using shell variables:

```bash
# Create the token
mplx genesis create \
  --name "Example Token" \
  --symbol "EXM" \
  --totalSupply 1000000000000000 \
  --decimals 9

# (copy GENESIS_ADDRESS from output)
GENESIS=<GENESIS_ADDRESS>

# Timestamps
NOW=$(date +%s)
DEPOSIT_START=$NOW
DEPOSIT_END=$((NOW + 86400))
CLAIM_START=$((DEPOSIT_END + 1))
CLAIM_END=$((NOW + 31536000))

# Add presale bucket: 1M tokens at 100 SOL cap
mplx genesis bucket add-presale $GENESIS \
  --allocation 1000000000000000 \
  --quoteCap 100000000000 \
  --depositStart $DEPOSIT_START \
  --depositEnd $DEPOSIT_END \
  --claimStart $CLAIM_START \
  --claimEnd $CLAIM_END

# Add unlocked bucket for team to receive SOL
mplx genesis bucket add-unlocked $GENESIS \
  --recipient $(solana address) \
  --claimStart $CLAIM_START \
  --allocation 0

# Finalize — no going back
mplx genesis finalize $GENESIS

# Verify
mplx genesis fetch $GENESIS
mplx genesis bucket fetch $GENESIS --bucketIndex 0 --type presale

# --- Users can now deposit ---
mplx toolbox sol wrap 1
mplx genesis presale deposit $GENESIS --amount 1000000000

# --- After deposit period ends, claim ---
mplx genesis presale claim $GENESIS --bucketIndex 0
```

## Command Reference

| Command | Description |
|---------|-------------|
| `genesis create` | Create a new Genesis account and token |
| `genesis fetch` | Fetch Genesis account details |
| `genesis finalize` | Lock configuration and activate the launch |
| `genesis revoke` | Revoke mint/freeze authority |
| `genesis deposit` | Deposit into a launch pool |
| `genesis withdraw` | Withdraw from a launch pool |
| `genesis claim` | Claim tokens from a launch pool |
| `genesis claim-unlocked` | Claim from an unlocked bucket |
| `genesis transition` | Execute end behaviors after deposit period |
| `genesis presale deposit` | Deposit into a presale bucket |
| `genesis presale claim` | Claim tokens from a presale bucket |
| `genesis bucket add-launch-pool` | Add a launch pool bucket |
| `genesis bucket add-presale` | Add a presale bucket |
| `genesis bucket add-unlocked` | Add an unlocked (treasury) bucket |
| `genesis bucket fetch` | Fetch bucket details by type |

Run `mplx genesis <command> --help` for full flag documentation on any command.

## Next Steps

- [Getting Started](/smart-contracts/genesis/getting-started) — Genesis fundamentals and SDK setup
- [Launch Pool](/smart-contracts/genesis/launch-pool) — SDK guide for launch pools
- [Presale](/smart-contracts/genesis/presale) — SDK guide for presales
