---
title: Manage
metaTitle: Manage | Metaplex CLI
description: Finalize, fetch, manage unlocked buckets, and revoke authorities for a Genesis account using the Metaplex CLI.
---

These commands handle Genesis account management — adding unlocked buckets, finalizing configuration, fetching state, claiming from unlocked buckets, fetching bucket details, and revoking authorities.

## Add Unlocked Bucket

The `mplx genesis bucket add-unlocked` command adds an unlocked bucket. Unlocked buckets let a designated recipient claim tokens or SOL forwarded via end behaviors.

```bash
mplx genesis bucket add-unlocked <GENESIS_ADDRESS> \
  --recipient <RECIPIENT_WALLET_ADDRESS> \
  --claimStart 1704153601 \
  --allocation 0
```

### Options

- `--recipient <string>`: Wallet address that can claim from this bucket (required)
- `--claimStart <string>`: Unix timestamp when claims open (required)
- `--claimEnd <string>`: Unix timestamp when claims close (defaults to far future)
- `--allocation <string>` (`-a`): Base token allocation in base units (default: 0)
- `--bucketIndex <integer>` (`-b`): Bucket index

### Notes

- `--allocation 0` means this bucket doesn't hold base tokens — it only receives quote tokens via end behaviors
- Typically used as a destination for launch pool end behaviors so the team/treasury can claim collected SOL

## Finalize

The `mplx genesis finalize` command locks the Genesis configuration. After finalization, no more buckets can be added.

```bash
mplx genesis finalize <GENESIS_ADDRESS>
```

No additional flags. This action is irreversible — double-check all bucket configurations before running this command.

## Fetch

The `mplx genesis fetch` command retrieves Genesis account details including bucket count, total supply, finalization status, and base/quote mints.

```bash
mplx genesis fetch <GENESIS_ADDRESS>
```

No additional flags.

## Fetch Bucket

The `mplx genesis bucket fetch` command retrieves details for a specific bucket.

```bash
mplx genesis bucket fetch <GENESIS_ADDRESS> --bucketIndex 0 --type launch-pool
```

### Options

- `--bucketIndex <integer>` (`-b`): Index of the bucket to fetch (default: 0)
- `--type <launch-pool|presale|unlocked>` (`-t`): Bucket type (default: `launch-pool`)

### Examples

1. Fetch a launch pool bucket:
```bash
mplx genesis bucket fetch <GENESIS_ADDRESS> --bucketIndex 0
```

2. Fetch a presale bucket:
```bash
mplx genesis bucket fetch <GENESIS_ADDRESS> --bucketIndex 0 --type presale
```

3. Fetch an unlocked bucket:
```bash
mplx genesis bucket fetch <GENESIS_ADDRESS> --bucketIndex 1 --type unlocked
```

## Claim Unlocked

The `mplx genesis claim-unlocked` command claims tokens or SOL from an unlocked bucket. Typically used by team/treasury wallets to claim quote tokens forwarded via end behaviors.

```bash
mplx genesis claim-unlocked <GENESIS_ADDRESS> --bucketIndex 1
```

### Options

- `--bucketIndex <integer>` (`-b`): Index of the unlocked bucket (default: 0)
- `--recipient <string>`: Recipient address for claimed tokens (default: signer)

## Revoke

The `mplx genesis revoke` command revokes mint and/or freeze authority on the token. At least one flag must be specified.

```bash
mplx genesis revoke <GENESIS_ADDRESS> --revokeMint
```

### Options

- `--revokeMint`: Revoke the mint authority (no more tokens can be minted)
- `--revokeFreeze`: Revoke the freeze authority (tokens cannot be frozen)

### Examples

1. Revoke mint authority only:
```bash
mplx genesis revoke <GENESIS_ADDRESS> --revokeMint
```

2. Revoke both authorities:
```bash
mplx genesis revoke <GENESIS_ADDRESS> --revokeMint --revokeFreeze
```

### Notes

- Revoking mint authority ensures no new tokens can ever be minted
- These actions are irreversible
