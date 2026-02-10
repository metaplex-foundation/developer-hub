---
title: Launch Pool
metaTitle: Launch Pool | Metaplex CLI
description: Create a launch pool bucket, deposit, withdraw, transition, and claim tokens using the Metaplex CLI.
---

A launch pool collects deposits during a window and distributes tokens proportionally. This page covers the full launch pool lifecycle — from creating the bucket to claiming tokens.

## Add Launch Pool Bucket

The `mplx genesis bucket add-launch-pool` command adds a launch pool bucket to a Genesis account.

```bash
mplx genesis bucket add-launch-pool <GENESIS_ADDRESS> \
  --allocation 500000000000000 \
  --depositStart 1704067200 \
  --depositEnd 1704153600 \
  --claimStart 1704153601 \
  --claimEnd 1735689600
```

### Options

- `--allocation <string>` (`-a`): Base token allocation for this bucket in base units (required)
- `--depositStart <string>`: Unix timestamp when deposits open (required)
- `--depositEnd <string>`: Unix timestamp when deposits close (required)
- `--claimStart <string>`: Unix timestamp when claims open (required)
- `--claimEnd <string>`: Unix timestamp when claims close (required)
- `--bucketIndex <integer>` (`-b`): Bucket index (default: 0)
- `--endBehavior <string>`: End behavior in format `<destinationBucketAddress>:<percentageBps>` where `10000` = 100%. Can be specified multiple times to split funds.
- `--minimumDeposit <string>`: Minimum deposit per transaction in base units
- `--depositLimit <string>`: Maximum deposit per user in base units
- `--minimumQuoteTokenThreshold <string>`: Minimum total quote tokens required for the bucket to succeed
- `--depositPenalty <json>`: Deposit penalty schedule — `{"slopeBps":0,"interceptBps":200,"maxBps":200,"startTime":0,"endTime":0}`
- `--withdrawPenalty <json>`: Withdraw penalty schedule (same format as depositPenalty)
- `--bonusSchedule <json>`: Bonus schedule — `{"slopeBps":0,"interceptBps":0,"maxBps":0,"startTime":0,"endTime":0}`
- `--claimSchedule <json>`: Claim vesting schedule — `{"startTime":0,"endTime":0,"period":0,"cliffTime":0,"cliffAmountBps":0}`
- `--allowlist <json>`: Allowlist configuration — `{"merkleTreeHeight":10,"merkleRoot":"<hex>","endTime":0,"quoteCap":0}`

### Examples

1. Basic launch pool:
```bash
mplx genesis bucket add-launch-pool <GENESIS_ADDRESS> \
  --allocation 500000000000000 \
  --depositStart 1704067200 \
  --depositEnd 1704153600 \
  --claimStart 1704153601 \
  --claimEnd 1735689600
```

2. With end behavior and minimum deposit:
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

3. With claim vesting:
```bash
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

```bash
mplx genesis deposit <GENESIS_ADDRESS> --amount 10000000000 --bucketIndex 0
```

### Options

- `--amount <string>` (`-a`): Amount of quote tokens to deposit in base units, e.g. lamports (required)
- `--bucketIndex <integer>` (`-b`): Index of the launch pool bucket (default: 0)

### Examples

1. Wrap SOL and deposit 10 SOL:
```bash
mplx toolbox sol wrap 10
mplx genesis deposit <GENESIS_ADDRESS> --amount 10000000000 --bucketIndex 0
```

## Withdraw

The `mplx genesis withdraw` command withdraws quote tokens from a launch pool bucket. Only available during the deposit period.

```bash
mplx genesis withdraw <GENESIS_ADDRESS> --amount 5000000000 --bucketIndex 0
```

### Options

- `--amount <string>` (`-a`): Amount of quote tokens to withdraw in base units (required)
- `--bucketIndex <integer>` (`-b`): Index of the launch pool bucket (default: 0)

## Transition

The `mplx genesis transition` command executes end behaviors after the deposit period closes, moving collected quote tokens to destination buckets.

```bash
mplx genesis transition <GENESIS_ADDRESS> --bucketIndex 0
```

### Options

- `--bucketIndex <integer>` (`-b`): Index of the launch pool bucket (required — no default; the target bucket must be specified explicitly because transition executes end behaviors for a specific bucket)

### Notes

- Must be called after the deposit period ends
- Only needed if the bucket has end behaviors configured

## Claim

The `mplx genesis claim` command claims base tokens from a launch pool bucket. Users receive tokens proportional to their deposit.

```bash
mplx genesis claim <GENESIS_ADDRESS> --bucketIndex 0
```

### Options

- `--bucketIndex <integer>` (`-b`): Index of the launch pool bucket (default: 0)
- `--recipient <string>`: Recipient address for claimed tokens (default: signer)

### Examples

1. Claim to your own wallet:
```bash
mplx genesis claim <GENESIS_ADDRESS> --bucketIndex 0
```

2. Claim to a different wallet:
```bash
mplx genesis claim <GENESIS_ADDRESS> --bucketIndex 0 --recipient <WALLET_ADDRESS>
```

## Full Lifecycle Example

```bash
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
