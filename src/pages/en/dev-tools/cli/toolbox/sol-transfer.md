---
title: SOL Transfer
metaTitle: SOL Transfer | Metaplex CLI
description: Transfer SOL to a specified address
---

The `mplx toolbox sol transfer` command allows you to transfer SOL from your current wallet to any Solana address.

## Basic Usage

```bash
mplx toolbox sol transfer <amount> <address>
```

## Arguments

- `amount`: Amount of SOL to transfer (required)
- `address`: Solana address to transfer SOL to (required)

## Examples

### Transfer 1 SOL to an Address

```bash
mplx toolbox sol transfer 1 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa
```

## Output

After a successful transfer, the command will display:

```
--------------------------------
    Transferred <amount> SOL to <address>
    Signature: <transactionSignature>
--------------------------------
```

## Notes

- The transfer amount is specified in SOL (not lamports)
- The destination address must be a valid Solana public key
- The command requires a connection to a Solana network (mainnet/devnet/testnet)
- Make sure you have sufficient SOL in your wallet for the transfer
- The transaction signature is provided for verification purposes
- The transfer is irreversible once confirmed on the blockchain
