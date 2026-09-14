---
title: Create
metaTitle: Create MPL-Distro Distribution | Metaplex CLI
description: Create a wallet or legacy NFT MPL-Distro distribution with mplx distro create.
keywords:
  - mplx distro create
  - MPL-Distro CLI
  - Merkle airdrop create
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
  - Generate a base58 Merkle root with prepareDistribution
  - Run mplx distro create with name, mint, claimant count, ISO window, and root
  - Save the printed distribution public key
howToTools:
  - Metaplex CLI (mplx)
  - MPL-Distro JavaScript SDK 0.4.x
faqs:
  - q: Does distro create generate Merkle proofs?
    a: No. Pass a 32-byte root that you already built with prepareDistribution. Proofs must be stored off-chain.
  - q: What is the merkleRoot flag format?
    a: Base58 encoding of exactly 32 bytes. Hex strings are rejected.
  - q: Can the CLI create a permissioned distributor?
    a: No. --allowedDistributor accepts permissionless or recipient only.
---

{% callout title="What You'll Do" %}
Create an [MPL-Distro](/smart-contracts/mpl-distro) account from the terminal:
- Commit a Merkle root, claim window, mint, and access mode on-chain
- Choose wallet or legacy NFT allocation type
- Save the distribution PDA for deposit, fetch, and withdraw
{% /callout %}

## Summary

The `mplx distro create` command initializes an [MPL-Distro](/smart-contracts/mpl-distro) PDA for an existing original SPL Token mint.

- **Required** (unless `--wizard` or `--distroConfig`): `--name`, `--mint`, `--totalClaimants`, `--startTime`, `--endTime`, `--merkleRoot`
- **Defaults**: `--distributionType wallet`, `--allowedDistributor permissionless`, `--subsidizeReceipts` off
- **Output**: Distribution PDA (base58 public key), mint, claimant count, type, timestamps, and transaction signature

Published `@metaplex-foundation/cli` 0.4.3 still depends on mpl-distro 0.3.x. Use a 0.4.x client; see the [CLI overview](/dev-tools/cli/distro).

**Jump to:** [Basic Usage](#basic-usage) · [Options](#options) · [JSON Config](#json-config-file) · [Examples](#examples) · [Output](#output) · [Common Errors](#common-errors) · [FAQ](#faq)

## Basic Usage

Pass every required flag, or use the wizard / a JSON file.

```bash {% title="Create a wallet distribution" %}
mplx distro create \
  --name "Community Airdrop" \
  --mint <TOKEN_MINT> \
  --totalClaimants 1000 \
  --startTime "2026-09-01T00:00:00Z" \
  --endTime "2026-09-30T23:59:59Z" \
  --merkleRoot <BASE58_32_BYTE_ROOT>
```

```bash {% title="Wizard mode" %}
mplx distro create --wizard
```

## Options

Create accepts flags, a JSON file, or the interactive wizard. `--wizard` and `--distroConfig` cannot be combined with the individual required flags.

| Flag | Short | Description | Required | Default |
|------|-------|-------------|----------|---------|
| `--name <string>` | `-n` | Display name, maximum 32 bytes | Yes* | |
| `--mint <string>` | `-m` | Existing original SPL Token mint | Yes* | |
| `--totalClaimants <integer>` | `-t` | Allocation count used to compute tree height | Yes* | |
| `--startTime <ISO-8601>` | | Claim window start (UTC recommended) | Yes* | |
| `--endTime <ISO-8601>` | | Claim window end; must be after start | Yes* | |
| `--merkleRoot <string>` | | 32-byte Merkle root, base58 encoded | Yes* | |
| `--distributionType <wallet\|legacy-nft>` | | Allocation identity model | No | `wallet` |
| `--allowedDistributor <permissionless\|recipient>` | | Who may submit a valid proof | No | `permissionless` |
| `--subsidizeReceipts` | | Use extra SOL on the PDA to pay claim-receipt rent | No | `false` |
| `--distroConfig <path>` | | JSON file with the same fields | No | |
| `--wizard` | | Interactive prompts | No | |

\*Required unless `--wizard` or `--distroConfig` supplies the value.

`--merkleRoot` is base58 of 32 bytes (about 43–44 characters). Encode it with `prepareDistribution` as shown in [Encode the Merkle Root](/dev-tools/cli/distro#encode-the-merkle-root).

The CLI computes `treeHeight` with `computeTreeHeight(totalClaimants)` and generates a random seed signer. It does not print the seed. `totalClaimants` is metadata and does not cap successful proofs.

## JSON Config File

`--distroConfig` reads the same fields as the flags.

```json {% title="distribution-config.json" %}
{
  "name": "Community Airdrop",
  "mint": "TokenMint111111111111111111111111111111111",
  "totalClaimants": 1000,
  "startTime": "2026-09-01T00:00:00Z",
  "endTime": "2026-09-30T23:59:59Z",
  "merkleRoot": "base58Encoded32ByteRoot",
  "distributionType": "wallet",
  "subsidizeReceipts": false,
  "allowedDistributor": "permissionless"
}
```

```bash {% title="Create from JSON" %}
mplx distro create --distroConfig ./distribution-config.json
```

The flag is `--distroConfig`, not `--config`.

## Examples

Create a legacy NFT distribution that only the NFT owner can submit:

```bash {% title="Legacy NFT, recipient-only" %}
mplx distro create \
  --name "Holder Rewards" \
  --mint <REWARD_MINT> \
  --totalClaimants 500 \
  --startTime "2026-09-01T12:00:00Z" \
  --endTime "2026-09-15T12:00:00Z" \
  --merkleRoot <BASE58_32_BYTE_ROOT> \
  --distributionType legacy-nft \
  --allowedDistributor recipient
```

## Output

On success the command prints the new PDA and transaction.

```text {% title="Expected output" %}
Distribution created: <DISTRIBUTION_ADDRESS>
Name: Community Airdrop
Mint: <TOKEN_MINT>
Total Claimants: 1000
Distribution Type: Wallet
Start Time: 2026-09-01T00:00:00.000Z
End Time: 2026-09-30T23:59:59.000Z

Transaction: <SIGNATURE>
```

`--json` uses the same PDA string:

```json {% title="JSON distribution field" %}
{
  "distribution": "<DISTRIBUTION_ADDRESS>"
}
```

Pass that address to `deposit`, `fetch`, or `withdraw`.

## Common Errors

These failures happen at create time.

| Error | Cause | Fix |
|-------|-------|-----|
| `BorshIoError` | CLI Distro client is 0.3.x (published 0.4.3) | Depend on `@metaplex-foundation/mpl-distro@^0.4.0` |
| Missing required flag: `--merkleRoot` | Incomplete flags and no JSON/wizard | Pass the remaining required flags |
| Invalid mint owner | Token-2022 or non-mint account | Use an original SPL Token mint |
| Name too long | Name exceeds 32 bytes | Shorten `--name` |
| Invalid distribution time range | `endTime` is not after `startTime` | Use a later end timestamp |

## Notes

Create does not deposit tokens and does not store proofs.

- Fund the vault with [`distro deposit`](/dev-tools/cli/distro/deposit) after create.
- `--subsidizeReceipts` does not transfer SOL by itself. Extra lamports must already sit on the distribution account; the CLI has no subsidy-deposit command.
- `Permissioned` distributor mode is SDK-only. See [Wallet Distribution](/smart-contracts/mpl-distro/wallet-distribution).

## FAQ

**Does distro create generate Merkle proofs?**
No. Pass a 32-byte root that you already built with `prepareDistribution`. Proofs must be stored off-chain. See [Production Delivery](/smart-contracts/mpl-distro/production-delivery).

**What is the merkleRoot flag format?**
Base58 encoding of exactly 32 bytes. Hex strings are rejected.

**Can the CLI create a permissioned distributor?**
No. `--allowedDistributor` accepts `permissionless` or `recipient` only.
