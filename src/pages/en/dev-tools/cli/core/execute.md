---
title: Execute
metaTitle: Execute | Metaplex CLI
description: Inspect an MPL Core Asset's signer PDA address and SOL balance, and understand how execute wraps transactions for PDA wallets in the Metaplex CLI.
keywords:
  - mplx cli
  - core execute
  - asset signer PDA
  - MPL Core execute
  - metaplex cli execute
  - PDA wallet
  - execute info
about:
  - MPL Core Execute instruction
  - Asset-signer PDA
  - Metaplex CLI
proficiencyLevel: Intermediate
created: '03-19-2026'
updated: '03-20-2026'
---

## Summary

The `mplx core asset execute info` command displays the signer PDA address and current SOL balance for any [MPL Core Asset](/core). The signer PDA is a deterministic program-derived address that can hold SOL, tokens, and own other assets on behalf of the asset.

- Derives and displays the signer PDA address for any Core Asset
- Verifies the asset exists on-chain before returning results
- Shows the PDA's current SOL balance
- Used alongside [asset-signer wallets](/dev-tools/cli/config/asset-signer-wallets) for full PDA wallet functionality

## Basic Usage

```bash {% title="Get execute info for an asset" %}
mplx core asset execute info <assetId>
```

## Arguments

| Argument | Description |
|----------|-------------|
| `ASSET_ID` | The address of the [MPL Core Asset](/core) to derive the signer PDA for |

## Global Flags

| Flag | Description |
|------|-------------|
| `-c, --config <value>` | Path to config file. Default is `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | Path to keypair file or ledger (e.g., `usb://ledger?key=0`) |
| `-p, --payer <value>` | Path to payer keypair file or ledger |
| `-r, --rpc <value>` | RPC URL for the cluster |
| `--commitment <option>` | Commitment level: `processed`, `confirmed`, or `finalized` |
| `--json` | Format output as JSON |
| `--log-level <option>` | Logging level: `debug`, `warn`, `error`, `info`, or `trace` (default: `info`) |

## Examples

### Display PDA Info for an Asset

```bash {% title="Get signer PDA info" %}
mplx core asset execute info 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa
```

Output:

``` {% title="execute info output" %}
--------------------------------
  Asset:         5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa
  Signer PDA:    7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
  SOL Balance:   0.1 SOL
--------------------------------
```

### Get Structured JSON Output

```bash {% title="Execute info with JSON output" %}
mplx core asset execute info <assetId> --json
```

Returns:

```json {% title="JSON response" %}
{
  "asset": "<assetId>",
  "signerPda": "<pdaAddress>",
  "balance": 0.1
}
```

### Fund the PDA After Inspection

A common workflow is to inspect the PDA, then fund it:

```bash {% title="Inspect and fund the PDA" %}
# 1. Get the PDA address
mplx core asset execute info <assetId>

# 2. Send SOL to the PDA
mplx toolbox sol transfer 0.1 <signerPdaAddress>

# 3. Confirm the balance
mplx core asset execute info <assetId>
```

## How Execute Works

Every [MPL Core](/core) asset has a deterministic signer PDA derived from its address using `findAssetSignerPda`. This PDA can act as a wallet — holding SOL, owning tokens, and signing instructions via the on-chain `execute` instruction.

The typical workflow is:

1. **Derive the PDA** — use `mplx core asset execute info <assetId>` to find the PDA address
2. **Fund the PDA** — send SOL to the PDA address using `mplx toolbox sol transfer`
3. **Register as wallet** — add the asset as an [asset-signer wallet](/dev-tools/cli/config/asset-signer-wallets) with `mplx config wallets add <name> --asset <assetId>`
4. **Use normally** — all CLI commands auto-wrap in the `execute` instruction when an asset-signer wallet is active

{% callout type="note" %}
`info` is the only execute subcommand. To perform operations as the PDA, register the asset as an [asset-signer wallet](/dev-tools/cli/config/asset-signer-wallets) — all regular CLI commands will then auto-wrap in `execute` transparently.
{% /callout %}

## Quick Reference

| Item | Value |
|------|-------|
| Command | `mplx core asset execute info` |
| Applies to | [MPL Core Assets](/core) only |
| Related | [Asset-Signer Wallets](/dev-tools/cli/config/asset-signer-wallets) |
| PDA derivation | `findAssetSignerPda(umi, { asset: assetPubkey })` |
| Source | [GitHub — metaplex-foundation/cli](https://github.com/metaplex-foundation/cli) |

## Notes

- The signer PDA is deterministic — the same asset always produces the same PDA address
- The PDA can hold SOL, SPL tokens, and even own other [MPL Core Assets](/core)
- Only the asset owner (or authorized delegate) can invoke the `execute` instruction for a given asset's PDA
- The command verifies the asset exists on-chain before deriving the PDA; a non-existent asset will produce an error
- The balance shown is the SOL balance only — use `mplx toolbox sol balance` with an [asset-signer wallet](/dev-tools/cli/config/asset-signer-wallets) active to check token balances
- This is a read-only command — it does not create or modify any on-chain state
- Some operations cannot be wrapped in `execute` due to Solana CPI constraints — see [CPI Limitations](/dev-tools/cli/config/asset-signer-wallets#cpi-limitations)
