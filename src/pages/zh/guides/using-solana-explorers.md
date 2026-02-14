---
title: Using Solana Explorers
metaTitle: Using Solana Explorers | Solana Development Debugging Guide
description: Learn how to use Solana Explorer, SolanaFM, and CLI tools to inspect transactions, accounts, and debug issues during development.
created: '02-06-2026'
updated: null
---

Learn to inspect transactions, decode accounts, and debug issues using Solana explorers and CLI tools—essential skills for every Solana developer. {% .lead %}

## What You'll Learn

- How to use Solana Explorer and SolanaFM
- Reading transaction details and logs
- Inspecting account data
- Debugging failed transactions
- CLI-based debugging tools

## Prerequisites

- [Solana CLI installed](/guides/solana-cli-essentials)
- [Understanding Solana accounts](/guides/understanding-solana-accounts)
- [Transaction fundamentals](/guides/solana-transaction-fundamentals)

## Web Explorers

### Solana Explorer

The official explorer at [explorer.solana.com](https://explorer.solana.com/).

**Key features:**
- Transaction inspection with instruction breakdown
- Account data viewer
- Program verification
- Cluster switching (mainnet, devnet, testnet, custom)

**Switching to devnet:**
Click the cluster dropdown (top right) and select "Devnet". This is essential—if you're testing on devnet, you must view devnet on the explorer too.

### SolanaFM

[SolanaFM](https://solana.fm/) provides enhanced data decoding.

**Key features:**
- Automatic account data decoding for known programs
- Human-readable instruction names for Metaplex programs
- NFT and token visualization
- Transaction flow diagrams

### Solscan

[Solscan](https://solscan.io/) is popular for token and DeFi analysis.

**Key features:**
- Token holdings overview
- DeFi activity tracking
- Portfolio view

### Metaplex Core Explorer

While Metaplex core is supported by all larger Explorers not all of them show every detail about plugins. Therefore it can be helpful to use The [Explorer](https://core.metaplex.com/explorer) in the context of Metaplex Core.

## Inspecting Transactions

### Finding Your Transaction

After sending a transaction, you'll get a **signature** (a base58 string). Use it to look up the transaction:

```
https://explorer.solana.com/tx/<SIGNATURE>?cluster=devnet
```

Or via CLI:

```bash
# Get transaction details
solana confirm <SIGNATURE> -v

# Get transaction details in JSON
solana transaction-history <ADDRESS> --limit 5
```

### Reading Transaction Details

A transaction on the explorer shows:

| Section | What It Tells You |
|---------|-------------------|
| **Status** | Success or failure |
| **Block** | Which block included the transaction |
| **Timestamp** | When it was confirmed |
| **Fee** | SOL paid for the transaction |
| **Compute Units** | CUs consumed vs requested |
| **Signers** | Who signed the transaction |
| **Instructions** | What the transaction did |
| **Logs** | Program output messages |

### Understanding Program Logs

Logs are your best debugging tool. Each instruction produces log output:

```
Program 11111111111111111111111111111111 invoke [1]
Program 11111111111111111111111111111111 success
Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]
Program log: Instruction: Transfer
Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4644 of 200000 compute units
Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success
```

Key patterns:
- **`invoke [1]`** - Top-level instruction call
- **`invoke [2]`** - Cross-program invocation (CPI) from another program
- **`Program log:`** - Custom log messages from the program
- **`consumed X of Y compute units`** - Actual vs allocated CUs
- **`success`** or **`failed`** - Instruction result

### Failed Transaction Logs

When a transaction fails, the logs show exactly where and why:

```
Program CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d invoke [1]
Program log: Instruction: Create
Program log: Error: Account already initialized
Program CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d consumed 5234 of 200000 compute units
Program CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d failed: custom program error: 0x0
```

The error message and program ID tell you what went wrong and which program reported it.

## Inspecting Accounts

### On the Explorer

Navigate to an account by pasting its address. The explorer shows:

- **SOL balance**
- **Owner program**
- **Data size**
- **Executable status** (is it a program?)

For known programs (Token Program, Metaplex), the data is decoded into readable fields.

### Via CLI

```bash
# Basic account info
solana account <ADDRESS>

# JSON output (for scripting)
solana account <ADDRESS> --output json

# Check if account exists and its owner
solana account <ADDRESS> --output json | grep -E "owner|lamports"
```

### Common Account Types to Inspect

| Account Type | What to Look For |
|-------------|-----------------|
| **Wallet** | Balance, owner is System Program |
| **Mint** | Supply, decimals, authorities |
| **Token Account** | Balance, owner wallet, associated mint |
| **Metadata** | Name, symbol, URI, creators |
| **Core Asset** | Name, URI, owner, plugins |

## CLI Debugging Tools

### Transaction Logs (Real-Time)

Stream logs from a specific program:

```bash
# Watch all logs for a program on devnet
solana logs <PROGRAM_ID> --url devnet

# Watch all transactions (verbose, use for short sessions)
solana logs --url devnet
```

This is invaluable during development—run it in a side terminal while testing.

### Account Monitoring

```bash
# Watch an account's balance
watch -n 2 solana balance <ADDRESS>

# Check account history
solana transaction-history <ADDRESS> --limit 10
```

### Transaction Simulation

Simulate before sending to catch errors without paying fees:

```javascript
// Build the transaction without sending
const tx = await myBuilder
  .setBlockhash(await umi.rpc.getLatestBlockhash())
  .buildAndSign(umi)

// Simulate it
const simulation = await umi.rpc.simulateTransaction(tx)
console.log('Simulation result:', simulation)
```

## Debugging Common Scenarios

### "Transaction simulation failed"

1. Check the explorer for the transaction (if you have the signature)
2. Read the **program logs** for the specific error message
3. Look at which **instruction** failed (instruction index in the error)
4. Verify account addresses are correct

### Account Data Doesn't Match Expected

```bash
# Check account owner - is it the right program?
solana account <ADDRESS> --output json | grep owner

# Check data size - does it match the expected struct?
solana account <ADDRESS> --output json | grep "data"
```

### NFT/Token Not Showing Up

1. Verify you're on the **right cluster** (devnet vs mainnet)
2. Check the **mint account** exists: `solana account <MINT>`
3. Check your **token account** exists: `spl-token accounts`
4. For Metaplex assets, check the **metadata account** exists

### Debugging with Amman Explorer

If you're using [Amman](/dev-tools/amman) for local development, the Amman Explorer provides:
- Transaction relay for local validator inspection
- Account label mapping
- Real-time transaction streaming

```bash
# Start Amman with relay enabled
npx amman start
# Open http://localhost:50474 for the Amman Explorer relay
```

## Useful Explorer URLs

Bookmark these patterns for quick access:

```
# Transaction (devnet)
https://explorer.solana.com/tx/<SIGNATURE>?cluster=devnet

# Account (devnet)
https://explorer.solana.com/address/<ADDRESS>?cluster=devnet

# SolanaFM transaction
https://solana.fm/tx/<SIGNATURE>?cluster=devnet-solana

# SolanaFM account
https://solana.fm/address/<ADDRESS>?cluster=devnet-solana
```

### Generating Explorer Links in Code

```javascript
import { base58 } from '@metaplex-foundation/umi/serializers'

// After sending a transaction with UMI
const result = await myBuilder.sendAndConfirm(umi)
const signature = base58.deserialize(result.signature)[0]
console.log(`Explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet`)
```

## Best Practices

1. **Always log explorer links** - Print transaction URLs after sending for easy debugging
2. **Check the right cluster** - Most "missing" accounts are cluster mismatches
3. **Use `solana logs` during development** - Real-time log streaming catches issues immediately
4. **Simulate first** - Use `simulateTransaction` to catch errors before paying fees
5. **Read the full log output** - Error messages in logs are usually very descriptive

## Next Steps

- [How to diagnose transaction errors](/guides/general/how-to-diagnose-solana-transaction-errors) - Detailed error diagnosis
- [Compute units and priority fees](/guides/compute-units-and-priority-fees) - Understand CU consumption in logs
- [Working with devnet and testnet](/guides/working-with-devnet-and-testnet) - Environment setup

## FAQ

### Why does the explorer show "Not Found" for my transaction?

Either the transaction hasn't been confirmed yet, you're on the wrong cluster (e.g., viewing mainnet while testing on devnet), or the transaction was dropped before inclusion in a block.

### How do I decode account data for custom programs?

For Metaplex programs, SolanaFM and Solana Explorer decode data automatically. For custom programs, you'll need to deserialize the data in your code using the program's IDL or data structures.

### Can I see transactions on a local validator in the explorer?

Not on the public explorer. Use [Amman Explorer](/dev-tools/amman) for local validator transaction inspection, or use `solana logs` and `solana confirm -v` via CLI.
