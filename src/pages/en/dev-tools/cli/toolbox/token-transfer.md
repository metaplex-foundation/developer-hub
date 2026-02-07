---
title: Token Transfer
metaTitle: Token Transfer | Metaplex CLI
description: Transfer tokens to a destination address
---

Transfer tokens from your wallet to a destination address. If the destination wallet doesn't have a token account, it will be created automatically.

## Basic Usage

```bash
mplx toolbox token transfer <mintAddress> <amount> <destination>
```

## Arguments

| Argument | Description |
|----------|-------------|
| `mintAddress` | The mint address of the token to transfer |
| `amount` | Amount of tokens to transfer in basis points |
| `destination` | Destination wallet address |

## Examples

### Transfer 100 tokens to a destination address

```bash
mplx toolbox token transfer 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU 10000000000 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
```

## Output

The command will display a progress spinner while transferring the tokens and show the transaction signature upon success:

```
--------------------------------
Token Transfer         
--------------------------------
⠋ Transferring tokens...
✔ Tokens Transferred Successfully!
--------------------------------
'Tokens Transferred Successfully!'
Signature: 2xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
--------------------------------
```

## Notes

- The command automatically creates a token account for the destination address if it doesn't exist
- The amount is specified in basis points (1 token = 1,000,000,000 basis points)
- The transaction requires SOL for rent exemption if creating a new token account
- Make sure you have sufficient tokens in your wallet before transferring

## Error Handling

If the transfer fails, the command will display an error message and throw an exception. Common errors include:

- Insufficient token balance
- Invalid mint address
- Invalid destination address
- Network errors

## Related Commands

- [Token Creation](/dev-tools/cli/toolbox/token-create) - Create new tokens
- [Balance Check](/dev-tools/cli/toolbox/sol-balance) - Check token balances
- [SOL Transfer](/dev-tools/cli/toolbox/sol-transfer) - Transfer SOL between addresses
