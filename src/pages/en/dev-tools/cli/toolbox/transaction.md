---
title: Execute Transaction
metaTitle: Execute Transaction | Metaplex CLI
description: Sign and send arbitrary base64-encoded Solana instructions using the active wallet.
---

The `mplx toolbox transaction` command signs and sends arbitrary base64-encoded Solana instructions using the current wallet. When an asset-signer wallet is active, the instructions are automatically wrapped in an MPL Core `execute` instruction.

## Basic Usage

```bash
# Pass one or more instructions via flag
mplx toolbox transaction --instruction <base64>

# Pipe base64 instructions via stdin (one per line)
echo "<base64>" | mplx toolbox transaction --stdin
```

## Flags

- `-i, --instruction <base64>`: Base64-encoded instruction. Can be repeated to include multiple instructions.
- `--stdin`: Read base64 instructions from stdin, one per line. Mutually exclusive with `--instruction`.

## Examples

```bash
mplx toolbox transaction --instruction <base64EncodedInstruction>
mplx toolbox transaction --instruction <ix1> --instruction <ix2>
echo "<base64>" | mplx toolbox transaction --stdin
```

## Output

```
--------------------------------
  Signer:         <wallet_pubkey>
  Instructions:   <count>
  Signature:      <signature>
--------------------------------
<explorer_url>
```

## Notes

- Every instruction in the batch is signed with the current wallet's identity.
- If an [asset-signer wallet](/dev-tools/cli/config/asset-signer-wallets) is active, instructions are automatically wrapped in an MPL Core `execute` instruction.
- This command is an escape hatch — prefer purpose-built commands where possible.
