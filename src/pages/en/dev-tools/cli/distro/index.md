---
title: Overview
metaTitle: MPL-Distro CLI Overview | Metaplex CLI
description: Create, fund, inspect, and recover MPL-Distro token distributions with the Metaplex CLI (mplx distro).
keywords:
  - MPL-Distro CLI
  - mplx distro
  - Solana token airdrop CLI
  - Merkle distribution
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
faqs:
  - q: What does mplx distro do?
    a: The mplx distro command group creates an MPL-Distro account, deposits and withdraws SPL tokens, and fetches on-chain distribution details. It does not generate Merkle proofs or submit claims.
  - q: Which CLI version works with the current MPL-Distro program?
    a: The on-chain program requires the @metaplex-foundation/mpl-distro 0.4.x client. Published @metaplex-foundation/cli 0.4.3 still depends on 0.3.x and fails distro create with BorshIoError. Use a CLI build that depends on mpl-distro 0.4.0 or newer.
  - q: Does the CLI submit recipient claims?
    a: No. Generate proofs with prepareDistribution and submit distribute or distributeToLegacyNft through the JavaScript SDK or your claim app.
  - q: When can the authority withdraw tokens?
    a: Before the start timestamp or after the end timestamp. Withdrawals are rejected while the claim window is active.
---

{% callout title="What This Covers" %}
The complete CLI reference for [MPL-Distro](/smart-contracts/mpl-distro) authority operations:
- **Create**: Initialize a wallet or legacy NFT distribution from flags, JSON, or the wizard
- **Fund and recover**: Deposit tokens and withdraw leftovers outside the claim window
- **Inspect**: Fetch on-chain configuration, status, and Merkle root
{% /callout %}

## Summary

The `mplx distro` commands create, fund, inspect, and recover [MPL-Distro](/smart-contracts/mpl-distro) distributions from the terminal.

- **Tool**: Metaplex CLI (`mplx`) with the `distro` command group
- **Client**: Requires `@metaplex-foundation/mpl-distro` **0.4.x** against the current program
- **On-chain work**: Create the distribution PDA, deposit tokens, withdraw leftovers, fetch account data
- **Off-chain work**: Merkle roots, proofs, and claims stay in the [JavaScript SDK](/smart-contracts/mpl-distro/sdk/javascript)

{% callout title="Published CLI 0.4.3" type="warning" %}
The Distro commands in this documentation require `@metaplex-foundation/mpl-distro` **0.4.x**. The published `@metaplex-foundation/cli` **0.4.3** still depends on 0.3.x, so `mplx distro create` fails with `BorshIoError`. Use a CLI build that depends on `@metaplex-foundation/mpl-distro@^0.4.0` (or a newer CLI release when published).
{% /callout %}

**Jump to:** [Prerequisites](#prerequisites) · [General Flow](#general-flow) · [Command Reference](#command-reference) · [Merkle Root](#encode-the-merkle-root) · [Common Errors](#common-errors) · [FAQ](#faq) · [Glossary](#glossary)

## Prerequisites

MPL-Distro CLI commands require a funded identity, an existing original SPL Token mint, and a 32-byte Merkle root.

- The Metaplex CLI installed and on your `PATH`, built against `@metaplex-foundation/mpl-distro` 0.4.x
- A Solana keypair configured with `mplx config` (the distribution authority)
- SOL for rent and transaction fees
- An existing [SPL token](/solana/spl-tokens-and-token-programs) mint (not Token-2022) and a funded associated token account for deposits
- An RPC endpoint via `mplx config rpcs add` or `-r`

Check the command group:

```bash {% title="Check CLI" %}
mplx distro --help
```

## General Flow

Authority setup uses the CLI. Recipients claim through an app that stores proofs.

1. **Allocate** — Build the recipient list and generate the Merkle root with `prepareDistribution` in the [JavaScript SDK](/smart-contracts/mpl-distro/sdk/javascript). Persist every address, amount, nonce, and proof.
2. **Create** — `mplx distro create` writes the root, claim window, mint, and access mode on-chain.
3. **Deposit** — `mplx distro deposit` moves tokens into the distribution vault. Deposits are allowed at any time.
4. **Claim** — Recipients (or a relayer) submit `distribute` / `distributeToLegacyNft` with the stored proof. The CLI has no claim command.
5. **Recover** — After `endTime` (or before `startTime`), `mplx distro withdraw` returns unclaimed tokens.

See [Production Delivery](/smart-contracts/mpl-distro/production-delivery) for proof storage and claim pages.

```bash {% title="Create, fund, inspect, recover" %}
mplx distro create \
  --name "Community Airdrop" \
  --mint <TOKEN_MINT> \
  --totalClaimants 2 \
  --startTime "2026-09-01T00:00:00Z" \
  --endTime "2026-09-08T00:00:00Z" \
  --merkleRoot <BASE58_32_BYTE_ROOT>

mplx distro deposit <DISTRIBUTION> --amount 1.0
mplx distro fetch <DISTRIBUTION>
mplx distro withdraw <DISTRIBUTION> --amount 0.5
```

{% callout title="Save the Distribution Address" type="note" %}
`distro create` prints the distribution PDA as a base58 public key. Pass that address unchanged to `deposit`, `fetch`, and `withdraw`.
{% /callout %}

## Command Reference

`mplx distro` exposes four commands. None of them generate proofs or submit claims.

| Command | Description |
|---------|-------------|
| [`distro create`](/dev-tools/cli/distro/create) | Create a wallet or legacy NFT distribution |
| [`distro deposit`](/dev-tools/cli/distro/deposit) | Deposit SPL tokens into the distribution vault |
| [`distro fetch`](/dev-tools/cli/distro/fetch) | Fetch on-chain distribution details |
| [`distro withdraw`](/dev-tools/cli/distro/withdraw) | Withdraw unclaimed tokens while the window is inactive |

The CLI does not support `AllowedDistributor.Permissioned`, `updateDistribution`, `withdrawSubsidy`, or claim instructions.

## Encode the Merkle Root

`--merkleRoot` is the 32-byte allocation root encoded as base58, not a hex string.

Generate it with `prepareDistribution`, then encode the `root` bytes:

```ts {% title="Encode a Distro Merkle root" %}
import { prepareDistribution } from '@metaplex-foundation/mpl-distro'
import { publicKey } from '@metaplex-foundation/umi'
import { base58 } from '@metaplex-foundation/umi/serializers'

const { root, proofs, treeHeight } = prepareDistribution([
  { address: publicKey('RecipientWallet111111111111111111111111111'), amount: 100_000n },
  { address: publicKey('RecipientWallet222222222222222222222222222'), amount: 250_000n },
])

const merkleRoot = base58.deserialize(root)[0]
console.log(merkleRoot)
```

Set `--totalClaimants` to the number of allocations in that same list. The CLI stores `computeTreeHeight(totalClaimants)` on-chain; proofs from `prepareDistribution` must not be longer than that height.

## Common Errors

These are the failures seen most often with `mplx distro`.

| Error | Cause | Fix |
|-------|-------|-----|
| `BorshIoError` / Failed to serialize or deserialize account data | CLI still uses mpl-distro 0.3.x (published 0.4.3) | Use a CLI build that depends on `@metaplex-foundation/mpl-distro@^0.4.0` |
| `InvalidPublicKeyError` | The distribution argument is not a base58 public key | Pass the PDA printed by `distro create` |
| Missing required flag | Create ran without flags, JSON, or `--wizard` | Pass `--name`, `--mint`, `--totalClaimants`, `--startTime`, `--endTime`, and `--merkleRoot`, or use `--distroConfig` / `--wizard` |
| Insufficient balance | The identity ATA does not hold enough tokens | Mint or transfer tokens, then retry deposit |
| Distribution not found | Wrong PDA or cluster | Confirm the address with `distro fetch` on the same RPC |

## Notes

The CLI is an authority tool around an SDK-built Merkle allocation.

- The mint must be owned by the original SPL Token program. Token-2022 mints are rejected.
- Amounts in `--amount` use the mint's decimals. `--basisAmount` uses token base units.
- Deposits are not time-gated. Withdrawals are rejected while `startTime <= clusterTime <= endTime`.
- `--allowedDistributor` accepts `permissionless` or `recipient` only.
- The CLI generates a random seed signer and does not print it. Save the distribution PDA from create output.

## FAQ

### What does mplx distro do?

The `mplx distro` command group creates an MPL-Distro account, deposits and withdraws SPL tokens, and fetches on-chain distribution details. It does not generate Merkle proofs or submit claims.

### Which CLI version works with the current MPL-Distro program?

The on-chain program requires the `@metaplex-foundation/mpl-distro` 0.4.x client. Published `@metaplex-foundation/cli` 0.4.3 still depends on 0.3.x and fails `distro create` with `BorshIoError`. Use a CLI build that depends on mpl-distro 0.4.0 or newer.

### Does the CLI submit recipient claims?

No. Generate proofs with `prepareDistribution` and submit `distribute` or `distributeToLegacyNft` through the [JavaScript SDK](/smart-contracts/mpl-distro/sdk/javascript) or a [claim page](/smart-contracts/mpl-distro/production-delivery).

### When can the authority withdraw tokens?

Before the start timestamp or after the end timestamp. Withdrawals are rejected while the claim window is active.

## Glossary

| Term | Definition |
|------|------------|
| Distribution PDA | On-chain account derived from `["distribution", mint, seed]`. The CLI generates the seed internally. |
| Merkle root | 32-byte hash of the allocation tree, passed to create as base58. |
| Basis amount | Token smallest units (`10 ^ decimals` per 1.0 token). |
| Claim window | Inclusive period from `startTime` to `endTime` when claims succeed and withdrawals fail. |
| Allowed distributor | Who may submit a valid proof: `permissionless` or `recipient` in the CLI. |
