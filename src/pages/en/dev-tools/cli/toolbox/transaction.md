---
# Remember to also update the date in src/components/products/guides/index.js
title: Execute Transaction
metaTitle: Execute Transaction | Metaplex CLI
description: Sign and send arbitrary base64-encoded Solana instructions using the active wallet.
keywords:
  - mplx CLI
  - execute transaction
  - base64 instruction
  - MPL Core execute
  - Solana
about:
  - Metaplex CLI
  - Solana Transactions
proficiencyLevel: Advanced
created: '04-20-2026'
updated: '04-20-2026'
---

## Summary

The `mplx toolbox transaction` command signs and sends arbitrary base64-encoded Solana instructions using the current wallet.

- Accepts one or more base64-encoded instructions via `--instruction` (repeatable).
- Reads instructions line-by-line from stdin when `--stdin` is used.
- Automatically wraps instructions in an MPL Core `execute` call when an [asset-signer wallet](/dev-tools/cli/config/asset-signer-wallets) is active.
- `--instruction` and `--stdin` are mutually exclusive.

## Quick Reference

The table below summarizes the command's flags and wrapping behavior.

| Item | Value |
|------|-------|
| Command | `mplx toolbox transaction --instruction <b64>` |
| Flags | `-i, --instruction <b64>` (repeatable), `--stdin` |
| Input | Base64-encoded Solana instruction |
| Asset-signer wallet | Instructions wrapped in MPL Core `execute` |
| Mutually exclusive | `--instruction` and `--stdin` |

## Basic Usage

Pass each base64-encoded instruction via `--instruction`, or pipe them through stdin.

```bash
# Pass one or more instructions via flag
mplx toolbox transaction --instruction <base64>

# Pipe base64 instructions via stdin (one per line)
echo "<base64>" | mplx toolbox transaction --stdin
```

## Flags

The command is driven entirely by flags.

- `-i, --instruction <base64>`: Base64-encoded instruction. Can be repeated to include multiple instructions.
- `--stdin`: Read base64 instructions from stdin, one per line. Mutually exclusive with `--instruction`.

## Examples

These examples show single, batched, and piped invocations.

```bash
mplx toolbox transaction --instruction <base64EncodedInstruction>
mplx toolbox transaction --instruction <ix1> --instruction <ix2>
echo "<base64>" | mplx toolbox transaction --stdin
```

## Output

On success the command prints the signer, the instruction count, and the transaction signature.

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
