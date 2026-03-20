---
title: Asset-Signer Wallets
metaTitle: Asset-Signer Wallets | Metaplex CLI
description: Use an MPL Core Asset's signer PDA as your active CLI wallet. All commands automatically wrap in execute — transfer SOL, tokens, and assets from a PDA without custom scripts.
keywords:
  - mplx cli
  - asset-signer wallet
  - PDA wallet
  - MPL Core execute
  - signer PDA
  - metaplex cli asset signer
  - core execute
about:
  - MPL Core Asset-signer wallets
  - PDA wallet management
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - TypeScript
faqs:
  - q: Do I need a separate execute command for each operation?
    a: No. When an asset-signer wallet is active, every CLI command is automatically wrapped in the execute instruction at send time. Use standard commands like `mplx toolbox sol transfer` or `mplx core asset create` — no separate execute subcommands exist for these operations.
  - q: What happens if the asset owner is not in my saved wallets?
    a: The CLI will return an error asking you to add the owner wallet first. Run `mplx config wallets add <name> <keypair-path>` with the asset owner's keypair before registering the asset-signer wallet.
  - q: Can a different wallet pay transaction fees while the PDA signs?
    a: Yes. Pass `-p /path/to/fee-payer.json` to any command. The asset owner still signs the execute instruction, but the -p wallet pays the Solana transaction fee.
  - q: Which operations cannot be wrapped in execute?
    a: Large account creation (Merkle trees, candy machines) and native SOL wrapping fail due to Solana CPI size limits. Create this infrastructure with a normal wallet first, then switch to the asset-signer wallet for subsequent operations.
  - q: How do I check what address the PDA resolves to?
    a: Run `mplx core asset execute info <assetId>`. This shows the deterministic signer PDA address and its current SOL balance.
created: '03-19-2026'
updated: '03-19-2026'
---

## Summary

Asset-signer wallets let you use an [MPL Core Asset's](/core) signer PDA as your active CLI wallet. When active, every CLI command automatically wraps its instructions in the on-chain [`execute`](/dev-tools/cli/core/execute) instruction — no custom scripting required.

- Register any Core Asset as a wallet with `mplx config wallets add <name> --asset <assetId>`
- All CLI commands transparently operate through the PDA when the asset-signer wallet is active
- The asset owner signs the `execute` instruction; a separate fee payer can be specified with `-p`
- Some operations are restricted by Solana CPI constraints (large account creation, native SOL wrapping)

## Quick Start

```bash {% title="Asset-signer wallet setup" %}
# 1. Create an asset (or use an existing one you own)
mplx core asset create --name "My Vault" --uri "https://example.com/vault"

# 2. Register it as a wallet (auto-detects the owner from on-chain data)
mplx config wallets add vault --asset <assetId>

# 3. Check the PDA info
mplx core asset execute info <assetId>

# 4. Fund the PDA
mplx toolbox sol transfer 0.1 <signerPdaAddress>

# 5. Switch to the asset-signer wallet
mplx config wallets set vault

# 6. Use any command as the PDA
mplx toolbox sol balance
mplx toolbox sol transfer 0.01 <destination>
mplx core asset create --name "PDA Created NFT" --uri "https://example.com/nft"
```

## How Asset-Signer Wallets Work

The CLI uses a noop-signer pattern to make PDA operations transparent. When an asset-signer wallet is active:

1. **`umi.identity`** is set to a noop signer with the PDA's public key — commands build instructions with the PDA as authority naturally
2. **`umi.payer`** is also set to the PDA noop signer — so derived addresses (ATAs, token accounts) resolve correctly
3. **At send time**, the transaction is wrapped in [MPL Core's `execute` instruction](/dev-tools/cli/core/execute), which signs on behalf of the PDA on-chain
4. **The real wallet** (asset owner) signs the outer transaction and pays fees via `setFeePayer`

## Registering an Asset-Signer Wallet

```bash {% title="Add asset-signer wallet" %}
mplx config wallets add <name> --asset <assetId>
```

The `--asset` flag is what distinguishes this from a normal wallet. The CLI fetches the asset on-chain, determines the owner, and matches it against your saved [wallets](/dev-tools/cli/config/wallets). If the owner is not in your wallet list, you must add the owner wallet first.

Once registered, use the standard [wallet commands](/dev-tools/cli/config/wallets) (`list`, `set`, `remove`) to manage it like any other wallet. Asset-signer wallets display as `asset-signer` type in the wallet list.

{% callout type="note" %}
The `-k` flag bypasses the active wallet for a single command, including asset-signer wallets.
{% /callout %}

## Separate Fee Payer

The on-chain `execute` instruction supports separate authority and fee payer accounts. Use `-p` to have a different wallet pay transaction fees while the asset owner signs the execute:

```bash {% title="Separate fee payer" %}
mplx toolbox sol transfer 0.01 <destination> -p /path/to/fee-payer.json
```

The asset owner still signs the `execute` instruction. The `-p` wallet only pays the Solana transaction fee.

## Supported Commands

All CLI commands work with asset-signer wallets. The transaction wrapping happens transparently in the send layer.

| Category | Commands |
|----------|----------|
| **Core** | `asset create`, `asset transfer`, `asset burn`, `asset update`, `collection create` |
| **Toolbox SOL** | `balance`, `transfer`, `wrap`, `unwrap` |
| **Toolbox Token** | `transfer`, `create`, `mint` |
| **Toolbox Raw** | `raw --instruction <base64>` |
| **Token Metadata** | `transfer`, `create`, `update` |
| **Bubblegum** | `nft create`, `nft transfer`, `nft burn`, `collection create` |
| **Genesis** | `create`, `bucket add-*`, `deposit`, `withdraw`, `claim`, `finalize`, `revoke` |
| **Distribution** | `create`, `deposit`, `withdraw` |
| **Candy Machine** | `insert`, `withdraw` |

## CPI Limitations

Some operations cannot be wrapped in `execute()` due to Solana CPI constraints:

- **Large account creation** — Merkle trees and candy machines exceed CPI account allocation limits
- **Native SOL wrapping** — `transferSol` to a token account fails in CPI context

{% callout type="warning" %}
For these operations, use a normal [wallet](/dev-tools/cli/config/wallets) or create the infrastructure first, then switch to the asset-signer wallet for subsequent operations.
{% /callout %}

## Raw Instructions with Toolbox Raw

The `mplx toolbox raw` command executes arbitrary base64-encoded instructions. When an asset-signer wallet is active, these are automatically wrapped in `execute()`.

```bash {% title="Execute raw instructions" %}
# Single instruction
mplx toolbox raw --instruction <base64>

# Multiple instructions
mplx toolbox raw --instruction <ix1> --instruction <ix2>

# Read from stdin
echo "<base64>" | mplx toolbox raw --stdin
```

### Building Raw Instructions

The CLI includes serialization helpers for building base64-encoded instructions:

```typescript {% title="build-raw-instruction.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { serializeInstruction } from '@metaplex-foundation/cli/lib/execute/deserializeInstruction'

const signerPda = '<PDA address from execute info>'
const destination = '<destination address>'

// System Program SOL transfer
const data = new Uint8Array(12)
const view = new DataView(data.buffer)
view.setUint32(0, 2, true)             // Transfer discriminator
view.setBigUint64(4, 1_000_000n, true) // 0.001 SOL

const ix = {
  programId: publicKey('11111111111111111111111111111111'),
  keys: [
    { pubkey: publicKey(signerPda), isSigner: true, isWritable: true },
    { pubkey: publicKey(destination), isSigner: false, isWritable: true },
  ],
  data,
}

console.log(serializeInstruction(ix))
// Pass the output to: mplx toolbox raw --instruction <base64>
```

### Instruction Binary Format

| Bytes | Field |
|-------|-------|
| 32 | Program ID |
| 2 | Number of accounts (u16 little-endian) |
| 33 per account | 32 bytes pubkey + 1 byte flags (bit 0 = isSigner, bit 1 = isWritable) |
| remaining | Instruction data |

## Quick Reference

| Item | Value |
|------|-------|
| Add wallet | `mplx config wallets add <name> --asset <assetId>` |
| Switch wallet | `mplx config wallets set <name>` |
| Inspect PDA | [`mplx core asset execute info <assetId>`](/dev-tools/cli/core/execute) |
| Override | `-k /path/to/keypair.json` on any command |
| Fee payer | `-p /path/to/payer.json` on any command |
| PDA derivation | `findAssetSignerPda(umi, { asset: assetPubkey })` |
| Config file | `~/.config/mplx/config.json` |
| Source | [GitHub — metaplex-foundation/cli](https://github.com/metaplex-foundation/cli) |

## Glossary

| Term | Definition |
|------|-----------|
| Signer PDA | A program-derived address derived from an [MPL Core Asset](/core) that can hold SOL, tokens, and own other assets |
| Execute instruction | The [MPL Core](/core) on-chain instruction that allows a PDA to sign instructions on behalf of the asset |
| Noop signer | A placeholder signer that provides a public key but produces no signature — used so commands build instructions targeting the PDA |
| CPI | Cross-Program Invocation — when one Solana program calls another; some operations have size limits in CPI context |

## FAQ

### Do I need a separate execute command for each operation?

No. When an asset-signer wallet is active, every CLI command is automatically wrapped in the `execute` instruction at send time. Use standard commands like `mplx toolbox sol transfer` or `mplx core asset create` — no separate execute subcommands exist for these operations.

### What happens if the asset owner is not in my saved wallets?

The CLI returns an error asking you to add the owner wallet first. Run `mplx config wallets add <name> <keypair-path>` with the asset owner's keypair before registering the asset-signer wallet.

### Can a different wallet pay transaction fees while the PDA signs?

Yes. Pass `-p /path/to/fee-payer.json` to any command. The asset owner still signs the [`execute`](/dev-tools/cli/core/execute) instruction, but the `-p` wallet pays the Solana transaction fee.

### Which operations cannot be wrapped in execute?

Large account creation (Merkle trees, candy machines) and native SOL wrapping fail due to Solana CPI size limits. Create this infrastructure with a normal [wallet](/dev-tools/cli/config/wallets) first, then switch to the asset-signer wallet for subsequent operations.

### How do I check what address the PDA resolves to?

Run [`mplx core asset execute info <assetId>`](/dev-tools/cli/core/execute). This shows the deterministic signer PDA address and its current SOL balance.

## Notes

- Asset-signer wallets require the asset owner's wallet to be saved in your [wallet configuration](/dev-tools/cli/config/wallets) — add the owner wallet first
- The asset-signer wallet stores the PDA address, the linked asset ID, and a reference to the owner wallet in your config file
- When you switch away from an asset-signer wallet, commands revert to normal keypair signing
- The `-k` flag always takes precedence over the active wallet, including asset-signer wallets
- Raw instructions via `mplx toolbox raw` are wrapped in `execute()` like any other command when an asset-signer wallet is active
