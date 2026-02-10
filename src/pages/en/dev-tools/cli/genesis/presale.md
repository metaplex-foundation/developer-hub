---
title: Presale
metaTitle: Presale | Metaplex CLI
description: Create a presale bucket, deposit, and claim tokens from a Genesis presale using the Metaplex CLI.
---

A presale sells tokens at a fixed price determined by `quoteCap / allocation`. This page covers the full presale lifecycle — from creating the bucket to claiming tokens.

## Add Presale Bucket

The `mplx genesis bucket add-presale` command adds a presale bucket to a Genesis account.

```bash
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

- `--allocation <string>` (`-a`): Base token allocation in base units (required)
- `--quoteCap <string>`: Total quote tokens accepted — determines price (required)
- `--bucketIndex <integer>` (`-b`): Bucket index (required)
- `--depositStart <string>`: Unix timestamp when deposits open (required)
- `--depositEnd <string>`: Unix timestamp when deposits close (required)
- `--claimStart <string>`: Unix timestamp when claims open (required)
- `--claimEnd <string>`: Unix timestamp when claims close (defaults to far future)
- `--minimumDeposit <string>`: Minimum deposit per transaction in quote token base units
- `--depositLimit <string>`: Maximum deposit per user in quote token base units

### Notes

- Price is calculated as `quoteCap / allocation`
- Example: 100 SOL quote cap / 1,000,000 tokens = 0.0001 SOL per token

## Deposit

The `mplx genesis presale deposit` command deposits quote tokens into a presale bucket during the deposit window.

```bash
mplx genesis presale deposit <GENESIS_ADDRESS> --amount 10000000000 --bucketIndex 0
```

### Options

- `--amount <string>` (`-a`): Amount of quote tokens to deposit in base units, e.g. lamports (required)
- `--bucketIndex <integer>` (`-b`): Index of the presale bucket (default: 0)

### Examples

1. Wrap SOL and deposit 10 SOL:
```bash
mplx toolbox sol wrap 10
mplx genesis presale deposit <GENESIS_ADDRESS> --amount 10000000000 --bucketIndex 0
```

## Claim

The `mplx genesis presale claim` command claims base tokens from a presale bucket after the claim period starts.

Token allocation is calculated as:
```
userTokens = (userDeposit / quoteCap) * allocation
```

```bash
mplx genesis presale claim <GENESIS_ADDRESS> --bucketIndex 0
```

### Options

- `--bucketIndex <integer>` (`-b`): Index of the presale bucket (default: 0)
- `--recipient <string>`: Recipient address for claimed tokens (default: signer)

### Examples

1. Claim to your own wallet:
```bash
mplx genesis presale claim <GENESIS_ADDRESS> --bucketIndex 0
```

2. Claim to a different wallet:
```bash
mplx genesis presale claim <GENESIS_ADDRESS> --bucketIndex 0 --recipient <WALLET_ADDRESS>
```

## Full Lifecycle Example

```bash
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
