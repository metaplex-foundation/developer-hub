---
title: Create Address Lookup Table
metaTitle: Create Address Lookup Table | Metaplex CLI
description: Create a new Solana Address Lookup Table (LUT) with optional initial addresses.
---

The `mplx toolbox lut create` command creates a new Solana Address Lookup Table (LUT) and optionally extends it with a set of initial addresses in the same transaction.

## Basic Usage

```bash
# Create an empty LUT
mplx toolbox lut create

# Create a LUT with initial addresses
mplx toolbox lut create "<pubkey1>,<pubkey2>"
```

## Arguments

- `addresses` *(optional)*: Comma-separated list of public keys to include in the LUT.

## Flags

- `--recentSlot <number>`: Recent slot to use for LUT creation. Defaults to the latest slot.
- `--authority <pubkey>`: Authority public key for the LUT. Defaults to the current identity.

## Examples

```bash
mplx toolbox lut create
mplx toolbox lut create "11111111111111111111111111111111,TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
mplx toolbox lut create "11111111111111111111111111111111" --authority <pubkey>
```

## Output

```
--------------------------------
Address Lookup Table Created
LUT Address: <lut_address>
Signature: <transaction_signature>
--------------------------------
```

## Notes

- The LUT address is a PDA derived from the authority and recent slot.
- Use [`toolbox lut fetch`](/dev-tools/cli/toolbox/lut-fetch) to read back the contents.
- To remove a LUT, deactivate it first with [`toolbox lut deactivate`](/dev-tools/cli/toolbox/lut-deactivate), then close it with [`toolbox lut close`](/dev-tools/cli/toolbox/lut-close).
