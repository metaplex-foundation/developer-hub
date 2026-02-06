---
title: SOL Airdrop
metaTitle: SOL Airdrop | Metaplex CLI
description: Airdrop SOL to a specified address
---

The `mplx toolbox sol airdrop` command allows you to airdrop SOL to a specified address. This is useful for testing and development purposes.

## Basic Usage

### Airdrop to Current Wallet
```bash
mplx toolbox sol airdrop <amount>
```

### Airdrop to Specific Address
```bash
mplx toolbox sol airdrop <amount> <address>
```

## Arguments

- `amount`: Amount of SOL to airdrop (required)
- `address`: Address to airdrop SOL to (optional, defaults to current wallet)

## Examples

### Airdrop 1 SOL to Current Wallet
```bash
mplx toolbox sol airdrop 1
```

### Airdrop 2 SOL to Specific Address
```bash
mplx toolbox sol airdrop 2 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa
```

## Output

After a successful airdrop, the command will display:
```
--------------------------------
    Airdropped <amount> SOL to <address>
--------------------------------
```

## Notes

- This command is primarily intended for testing and development purposes
- The airdrop amount is specified in SOL (not lamports)
- If no address is provided, the SOL will be airdropped to the current wallet address
- The command requires a connection to a development network (devnet/testnet)
- Make sure you have sufficient SOL in your wallet for the airdrop operation
