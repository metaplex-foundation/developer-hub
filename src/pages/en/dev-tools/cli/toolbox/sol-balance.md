---
title: SOL Balance
description: Check SOL balance for a wallet address
---

Check the SOL balance for a wallet address. This command allows you to quickly verify the SOL balance of any wallet on the network.

## Basic Usage

```bash
mplx toolbox sol-balance <address>
```

## Arguments

| Argument | Description |
|----------|-------------|
| `address` | The wallet address to check (optional, defaults to active wallet) |

## Examples

### Check active wallet balance

```bash
mplx toolbox sol-balance
```

### Check specific wallet balance

```bash
mplx toolbox sol-balance 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
```

## Output

The command will display the SOL balance in a formatted output:

```
--------------------------------
SOL Balance
--------------------------------
Address: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
Balance: 1.5 SOL
--------------------------------
```

## Notes

- If no address is provided, the command will check the balance of the active wallet
- The balance is displayed in SOL (not lamports)
- The command uses the active RPC endpoint
- Make sure you have sufficient SOL for transactions
- The balance is real-time and reflects the current state of the blockchain

## Related Commands

- [SOL Transfer](/dev-tools/cli/toolbox/sol-transfer) - Transfer SOL between addresses
- [Token Transfer](/dev-tools/cli/toolbox/token-transfer) - Transfer tokens
- [Airdrop](/dev-tools/cli/toolbox/sol-airdrop) - Request SOL airdrop (devnet only) 