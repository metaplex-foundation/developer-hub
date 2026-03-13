---
title: Manage
metaTitle: Manage | Metaplex CLI
description: Finalize, fetch, manage unlocked buckets, and revoke authorities for a Genesis account using the Metaplex CLI.
keywords:
  - genesis finalize
  - genesis fetch
  - genesis revoke
  - unlocked bucket
  - mint authority
about:
  - Genesis account management
  - unlocked buckets
  - finalization
  - authority revocation
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
howToSteps:
  - Add unlocked buckets for team or treasury allocations using bucket add-unlocked
  - Finalize the Genesis configuration to lock it and activate the launch
  - Fetch Genesis account and bucket details to verify state
  - Claim tokens or forwarded SOL from unlocked buckets
  - Revoke mint and freeze authorities after the launch
howToTools:
  - Metaplex CLI (mplx)
  - Solana CLI
faqs:
  - q: What does finalize do?
    a: Finalize locks the Genesis configuration permanently. After finalization, no more buckets can be added and the launch becomes active.
  - q: Can I undo finalization?
    a: No. Finalization is irreversible. Double-check all bucket configurations before running genesis finalize.
  - q: What is an unlocked bucket used for?
    a: Unlocked buckets let a designated recipient claim tokens or SOL forwarded via end behaviors. They are typically used for team or treasury allocations.
  - q: What does revoking mint authority mean?
    a: Revoking mint authority ensures no new tokens can ever be minted, permanently fixing the total supply.
---

{% callout title="What This Covers" %}
Genesis account management commands:
- Adding unlocked (treasury) buckets
- Finalizing configuration
- Fetching account and bucket state
- Claiming from unlocked buckets
- Revoking mint/freeze authorities
{% /callout %}

## Summary

These commands handle Genesis account management — adding unlocked buckets, finalizing configuration, fetching state, claiming from unlocked buckets, fetching bucket details, and revoking authorities.

- **Unlocked buckets**: Designated recipient claims tokens or forwarded quote tokens directly
- **Finalize**: Irreversible lock that activates the launch
- **Fetch**: Inspect Genesis account and individual bucket state
- **Revoke**: Permanently remove mint and/or freeze authority

## Out of Scope

Launch pool configuration, presale configuration, deposit/withdraw flows, frontend integration, token economics.

**Jump to:** [Unlocked Bucket](#add-unlocked-bucket) · [Finalize](#finalize) · [Fetch](#fetch) · [Fetch Bucket](#fetch-bucket) · [Claim Unlocked](#claim-unlocked) · [Revoke](#revoke) · [Common Errors](#common-errors) · [FAQ](#faq)

*Maintained by Metaplex Foundation · Last verified February 2026 · Requires Metaplex CLI (mplx)*

## Add Unlocked Bucket

The `mplx genesis bucket add-unlocked` command adds an unlocked bucket. Unlocked buckets let a designated recipient claim tokens or SOL forwarded via end behaviors.

```bash {% title="Add an unlocked bucket" %}
mplx genesis bucket add-unlocked <GENESIS_ADDRESS> \
  --recipient <RECIPIENT_WALLET_ADDRESS> \
  --claimStart 1704153601 \
  --allocation 0
```

### Options

| Flag | Short | Description | Required |
|------|-------|-------------|----------|
| `--recipient <string>` | | Wallet address that can claim from this bucket | Yes |
| `--claimStart <string>` | | Unix timestamp when claims open | Yes |
| `--claimEnd <string>` | | Unix timestamp when claims close (defaults to far future) | No |
| `--allocation <string>` | `-a` | Base token allocation in base units (default: 0) | No |
| `--bucketIndex <integer>` | `-b` | Bucket index | No |

### Notes

- `--allocation 0` means this bucket doesn't hold base tokens — it only receives quote tokens via end behaviors
- Typically used as a destination for launch pool end behaviors so the team/treasury can claim collected SOL

## Finalize

The `mplx genesis finalize` command locks the Genesis configuration. After finalization, no more buckets can be added.

```bash {% title="Finalize Genesis" %}
mplx genesis finalize <GENESIS_ADDRESS>
```

No additional flags. This action is irreversible — double-check all bucket configurations before running this command.

## Fetch

The `mplx genesis fetch` command retrieves Genesis account details including bucket count, total supply, finalization status, and base/quote mints.

```bash {% title="Fetch Genesis account" %}
mplx genesis fetch <GENESIS_ADDRESS>
```

No additional flags.

## Fetch Bucket

The `mplx genesis bucket fetch` command retrieves details for a specific bucket.

```bash {% title="Fetch bucket details" %}
mplx genesis bucket fetch <GENESIS_ADDRESS> --bucketIndex 0 --type launch-pool
```

### Options

| Flag | Short | Description | Required |
|------|-------|-------------|----------|
| `--bucketIndex <integer>` | `-b` | Index of the bucket to fetch (default: 0) | No |
| `--type <launch-pool\|presale\|unlocked>` | `-t` | Bucket type (default: `launch-pool`) | No |

### Examples

1. Fetch a launch pool bucket:
```bash {% title="Fetch launch pool" %}
mplx genesis bucket fetch <GENESIS_ADDRESS> --bucketIndex 0
```

2. Fetch a presale bucket:
```bash {% title="Fetch presale" %}
mplx genesis bucket fetch <GENESIS_ADDRESS> --bucketIndex 0 --type presale
```

3. Fetch an unlocked bucket:
```bash {% title="Fetch unlocked" %}
mplx genesis bucket fetch <GENESIS_ADDRESS> --bucketIndex 1 --type unlocked
```

## Claim Unlocked

The `mplx genesis claim-unlocked` command claims tokens or SOL from an unlocked bucket. Typically used by team/treasury wallets to claim quote tokens forwarded via end behaviors.

```bash {% title="Claim from unlocked bucket" %}
mplx genesis claim-unlocked <GENESIS_ADDRESS> --bucketIndex 1
```

### Options

| Flag | Short | Description | Required |
|------|-------|-------------|----------|
| `--bucketIndex <integer>` | `-b` | Index of the unlocked bucket (default: 0) | No |
| `--recipient <string>` | | Recipient address for claimed tokens (default: signer) | No |

## Revoke

The `mplx genesis revoke` command revokes mint and/or freeze authority on the token. At least one flag must be specified.

```bash {% title="Revoke mint authority" %}
mplx genesis revoke <GENESIS_ADDRESS> --revokeMint
```

### Options

| Flag | Description |
|------|-------------|
| `--revokeMint` | Revoke the mint authority (no more tokens can be minted) |
| `--revokeFreeze` | Revoke the freeze authority (tokens cannot be frozen) |

### Examples

1. Revoke mint authority only:
```bash {% title="Revoke mint" %}
mplx genesis revoke <GENESIS_ADDRESS> --revokeMint
```

2. Revoke both authorities:
```bash {% title="Revoke both" %}
mplx genesis revoke <GENESIS_ADDRESS> --revokeMint --revokeFreeze
```

### Notes

- Revoking mint authority ensures no new tokens can ever be minted
- These actions are irreversible

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Genesis already finalized | Trying to add buckets after `finalize` | Finalization is irreversible — create a new Genesis account |
| Genesis not finalized | Trying to deposit or claim before finalizing | Run `genesis finalize` first |
| Not the designated recipient | Claiming from an unlocked bucket with the wrong wallet | Use the wallet specified as `--recipient` when the bucket was created |
| No flags specified | Running `revoke` without `--revokeMint` or `--revokeFreeze` | Specify at least one: `--revokeMint` and/or `--revokeFreeze` |
| Authority already revoked | Revoking an authority that was already revoked | No action needed — the authority is already permanently removed |
| Claim period not active | Claiming from an unlocked bucket before `claimStart` | Wait until after the claim start timestamp |
| Invalid bucket type | Using wrong `--type` flag in `bucket fetch` | Use `launch-pool`, `presale`, or `unlocked` |

## FAQ

**What does finalize do?**
Finalize locks the Genesis configuration permanently. After finalization, no more buckets can be added and the launch becomes active. Deposits can begin once the configured deposit windows open.

**Can I undo finalization?**
No. Finalization is irreversible. Double-check all bucket configurations before running `genesis finalize`.

**What is an unlocked bucket used for?**
Unlocked buckets let a designated recipient claim tokens or SOL forwarded via end behaviors. Common uses: team allocation, treasury, marketing budget, or receiving collected SOL from launch pool end behaviors.

**What does revoking mint authority mean?**
Revoking mint authority ensures no new tokens can ever be minted, permanently fixing the total supply. This is a trust signal for token holders.

**Should I revoke freeze authority too?**
Revoking freeze authority means tokens can never be frozen in user wallets. Whether to revoke depends on your project's requirements — most fair launches revoke both.

**Can I check the state of my launch without modifying anything?**
Yes. Use `genesis fetch` and `genesis bucket fetch` to inspect the full state of your Genesis account and individual buckets at any time.

## Glossary

| Term | Definition |
|------|------------|
| **Unlocked Bucket** | Bucket type for team/treasury — the designated recipient can claim tokens or forwarded quote tokens directly |
| **Finalize** | Irreversible action that locks the Genesis configuration and activates the launch |
| **Mint Authority** | The right to create new tokens — revoking it permanently fixes the supply |
| **Freeze Authority** | The right to freeze tokens in user wallets — revoking prevents any future freezing |
| **Recipient** | The wallet address designated to claim from an unlocked bucket |
| **Bucket Index** | Numeric identifier for buckets of the same type within a Genesis account |
