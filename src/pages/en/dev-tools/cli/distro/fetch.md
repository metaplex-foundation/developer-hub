---
title: Fetch
metaTitle: Fetch MPL-Distro Distribution | Metaplex CLI
description: Fetch on-chain MPL-Distro details with mplx distro fetch.
keywords:
  - mplx distro fetch
  - inspect token distribution
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
  - Pass the distribution public key printed by distro create
  - Review status, mint, Merkle root, and claim window
howToTools:
  - Metaplex CLI (mplx)
---

{% callout title="What You'll Do" %}
Read an [MPL-Distro](/smart-contracts/mpl-distro) account from the terminal:
- Confirm the mint, Merkle root, claim window, and access mode
- See whether the distribution has not started, is active, or has ended
{% /callout %}

## Summary

The `mplx distro fetch` command loads a distribution account and prints its configuration.

- **Required argument**: distribution public key
- **Optional flag**: `--json` for machine-readable output
- **Status**: `Not Started`, `Active`, or `Ended` from the local clock versus `startTime` / `endTime`

**Jump to:** [Quick Reference](#quick-reference) · [Usage](#usage) · [Output](#output) · [Notes](#notes)

## Quick Reference

| Item | Value |
|------|-------|
| **Command** | `mplx distro fetch <DISTRIBUTION>` |
| **Required argument** | Distribution PDA as a base58 public key |
| **Optional flags** | `--json` |

## Usage

Pass only the distribution address.

```bash {% title="Fetch a distribution" %}
mplx distro fetch <DISTRIBUTION>
```

```bash {% title="JSON output" %}
mplx distro fetch <DISTRIBUTION> --json
```

## Output

Human-readable output lists identity, amounts, window, and root.

```text {% title="Expected fields" %}
Distribution: <DISTRIBUTION>

Distribution Details:
  Name: Community Airdrop
  Authority: <WALLET>
  Mint: <TOKEN_MINT>
  Total Claimants: <n>
  Tree Height: <n>
  Distribution Type: Wallet | Legacy NFT
  Allowed Distributor: Permissionless | Recipient | Permissioned
  Total Amount: 1 tokens (1000000 basis)
  Claim Amount: 0 tokens (0 basis)
  Claim Count: <n>
  Subsidize Receipts: true | false
  Start Time: <ISO-8601>
  End Time: <ISO-8601>
  Status: Not Started | Active | Ended
  Merkle Root: <base58>
```

`Name` is the UTF-8 string stored on-chain (trailing nulls stripped). Amounts use mint decimals when the mint can be fetched; otherwise they print as `<n> basis`. `Allowed Distributor` prints `Permissioned` when that mode is set on-chain, and fetch then also prints `Permissioned Distributor`. The CLI cannot create `Permissioned` distributions, so those fields appear only for SDK-created accounts.

## Notes

Fetch is a read-only command. It does not change on-chain state.

- Status uses the local clock, not Solana cluster time.
- If the mint account cannot be fetched, `Total Amount` and `Claim Amount` fall back to raw basis units.
- Pass the PDA printed by [`distro create`](/dev-tools/cli/distro/create). A malformed address fails with `InvalidPublicKeyError`.
