---
title: Solana Transaction Fundamentals
metaTitle: Solana Transaction Fundamentals | How Transactions Work
description: Learn how Solana transactions work, including structure, signing, sending, and confirmation. Essential knowledge for building reliable applications.
# remember to update dates also in /components/guides/index.js
created: '02-04-2026'
updated: null
---

A comprehensive guide to understanding how Solana transactions work from structure to confirmation. {% .lead %}

## What You'll Learn

- The anatomy of a Solana transaction
- How to sign and send transactions
- Transaction confirmation and finality
- Versioned transactions vs legacy
- Common transaction errors and their meanings

## Prerequisites

- [Solana CLI installed](/guides/solana-cli-essentials)
- [Understanding Solana accounts](/guides/understanding-solana-accounts)

## Transaction Anatomy

A Solana transaction consists of several components:

```
┌─────────────────────────────────────────────────────────────┐
│                      Transaction                             │
├─────────────────────────────────────────────────────────────┤
│  Signatures: [sig1, sig2, ...]                              │
│                                                             │
│  Message:                                                   │
│    ├── Header                                               │
│    │     ├── num_required_signatures                        │
│    │     ├── num_readonly_signed_accounts                   │
│    │     └── num_readonly_unsigned_accounts                 │
│    │                                                        │
│    ├── Account Keys: [pubkey1, pubkey2, ...]               │
│    │                                                        │
│    ├── Recent Blockhash                                     │
│    │                                                        │
│    └── Instructions: [                                      │
│          { program_id_index, accounts, data },              │
│          { program_id_index, accounts, data },              │
│        ]                                                    │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

| Component | Description |
|-----------|-------------|
| **Signatures** | Ed25519 signatures from required signers |
| **Recent Blockhash** | A recent block hash (valid for ~60-90 seconds) |
| **Instructions** | The operations to perform |
| **Account Keys** | All accounts involved in the transaction |

## Instructions

Instructions are the actual operations in a transaction. Each instruction specifies:

- **Program ID** - Which program to execute
- **Accounts** - Which accounts the program needs
- **Data** - Serialized arguments for the program

```
Instruction:
  ├── program_id: 11111111111111111111111111111111  (System Program)
  ├── accounts:
  │     ├── sender    (signer, writable)
  │     └── recipient (not signer, writable)
  └── data: [encoded transfer amount]
```

### Multiple Instructions

Transactions can contain multiple instructions that execute atomically:

```javascript
import { transactionBuilder } from '@metaplex-foundation/umi'

// All instructions succeed or all fail (atomic)
const builder = transactionBuilder()
  .add(createAccountInstruction)
  .add(initializeMintInstruction)
  .add(mintTokensInstruction)

await builder.sendAndConfirm(umi)
```

This atomicity is powerful. If any instruction fails, the entire transaction is reverted.

## Recent Blockhash

Every transaction requires a **recent blockhash** that:
- Proves the transaction was created recently
- Prevents replay attacks
- Expires after ~60-90 seconds (~150 slots)

```javascript
// UMI handles blockhash automatically when sending transactions.
// To fetch it manually:
const { blockhash, lastValidBlockHeight } = await umi.rpc.getLatestBlockhash()
```

{% callout title="Blockhash Expiration" type="warning" %}
If your transaction isn't confirmed before the blockhash expires, it will be dropped. For long-running operations, fetch a fresh blockhash before sending.
{% /callout %}

## Signing Transactions

Transactions must be signed by all accounts marked as `isSigner`:

```javascript
// UMI signs automatically with the identity signer when sending.
// For additional signers, pass them during the build:
const tx = await myBuilder
  .setBlockhash(await umi.rpc.getLatestBlockhash())
  .buildAndSign(umi)

// For partial signing (multi-sig workflows), you can sign
// and serialize the transaction, then pass it to another party:
import { base64 } from '@metaplex-foundation/umi/serializers'

const serialized = umi.transactions.serialize(tx)
const encoded = base64.deserialize(serialized)[0]
// ... send encoded string to another party for additional signing ...
```

## Sending Transactions

### Basic Send

```javascript
// Send and wait for confirmation (recommended)
const result = await myBuilder.sendAndConfirm(umi)

// Or just send without waiting
const signature = await myBuilder.send(umi)
```

### Send with Options

```javascript
const result = await myBuilder.sendAndConfirm(umi, {
  send: { skipPreflight: false },
  confirm: { commitment: 'confirmed' },
})
```

## Transaction Confirmation

Solana has multiple **commitment levels** indicating transaction finality:

| Commitment | Description | Use Case |
|------------|-------------|----------|
| `processed` | Transaction received by leader | Real-time updates |
| `confirmed` | Voted on by supermajority | Most applications |
| `finalized` | 31+ blocks deep, irreversible | Financial operations |

### Checking Confirmation

```javascript
// sendAndConfirm waits for confirmation automatically.
// To check a signature status manually:
const result = await umi.rpc.getSignatureStatuses([signature])
```

### Commitment in Practice

```javascript
// For most operations, 'confirmed' is the right default
const result = await myBuilder.sendAndConfirm(umi, {
  confirm: { commitment: 'confirmed' },
})

// For financial operations where you need full finality
const result = await myBuilder.sendAndConfirm(umi, {
  confirm: { commitment: 'finalized' },
})
```

## Versioned Transactions

Solana currently supports two transaction formats:

### Legacy Transactions
- Original format
- Limited to 35 accounts
- Simpler structure

### Versioned Transactions (v0)
- Support **Address Lookup Tables** (ALTs)
- Can reference up to 256 accounts
- Required for complex DeFi operations

```javascript
// UMI uses V0 transactions by default
const result = await myBuilder
  .useV0()  // Explicit, but this is already the default
  .sendAndConfirm(umi)

// To use legacy transactions instead
const result = await myBuilder
  .useLegacyVersion()
  .sendAndConfirm(umi)

// With Address Lookup Tables
import { createLut } from '@metaplex-foundation/mpl-toolbox'

const [lutBuilder, lut] = createLut(umi, {
  recentSlot: await umi.rpc.getSlot({ commitment: 'finalized' }),
  addresses: [addressA, addressB, addressC],
})
await lutBuilder.sendAndConfirm(umi)

// Use the lookup table in your transaction
await myBuilder.setAddressLookupTables([lut]).sendAndConfirm(umi)
```

{% callout title="When to Use Versioned Transactions" %}
Use versioned transactions when:
- Your transaction involves many accounts (>35)
- You're interacting with DeFi protocols that require ALTs
- You want to reduce transaction size

For simple operations (transfers, basic mints), legacy transactions work fine.
{% /callout %}

## Transaction Size Limits

Solana transactions have strict size limits:

| Limit | Value |
|-------|-------|
| Maximum transaction size | 1232 bytes |
| Maximum accounts | 35 (legacy) / 256 (versioned with ALTs) |
| Maximum instructions | Limited by size |

### Dealing with Size Limits

If your transaction is too large:

1. **Use Address Lookup Tables** - Compress account references
2. **Split into multiple transactions** - Execute sequentially
3. **Optimize instruction data** - Minimize serialized data

## Simulation

Before sending, simulate transactions to catch errors:

```javascript
// Build the transaction without sending
const tx = await myBuilder
  .setBlockhash(await umi.rpc.getLatestBlockhash())
  .buildAndSign(umi)

// Simulate it
const simulation = await umi.rpc.simulateTransaction(tx, {
  commitment: 'confirmed',
})
console.log('Simulation result:', simulation)
```

Simulation helps you:
- Catch errors before paying fees
- Estimate compute units
- Debug program logic

## Common Transaction Errors

### "Blockhash not found"

**Cause**: The blockhash expired before confirmation.

**Solutions**:
1. Retry with a fresh blockhash (UMI fetches a new blockhash automatically on each send)
2. Use `'finalized'` commitment for blockhash when network is congested
3. Implement retry logic in your application

### "Insufficient funds"

**Cause**: Account doesn't have enough SOL for transaction fees + rent.

**Solution**: Ensure the fee payer has sufficient balance:
```bash
solana balance
solana airdrop 1  # On devnet
```

### "Transaction simulation failed"

**Cause**: Program logic error.

**Solution**: Check simulation logs on an explorer (see [Using Solana Explorers](/guides/using-solana-explorers)), or simulate the transaction before sending to inspect the error output.

### "Account not found"

**Cause**: An account in the transaction doesn't exist.

**Solution**: Create the account first or check addresses.

### "Invalid account owner"

**Cause**: Account is owned by a different program than expected.

**Solution**: Verify account ownership matches the program you're calling.

## Practical Example: Complete Flow

```javascript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { transferSol } from '@metaplex-foundation/mpl-toolbox'
import { signerIdentity, generateSigner, sol, publicKey } from '@metaplex-foundation/umi'
import { base58 } from '@metaplex-foundation/umi/serializers'

// 1. Create UMI instance
const umi = createUmi('https://api.devnet.solana.com')

// 2. Set up signer (your wallet)
const signer = generateSigner(umi)
umi.use(signerIdentity(signer))

// 3. Build and send the transaction
const result = await transferSol(umi, {
  source: umi.identity,
  destination: publicKey('RecipientAddressHere...'),
  amount: sol(1),
}).sendAndConfirm(umi)

// 4. Get the transaction signature
const signature = base58.deserialize(result.signature)[0]
console.log('Transaction confirmed:', signature)
console.log(`Explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet`)
```

## Next Steps

- [Compute units and priority fees](/guides/compute-units-and-priority-fees) - Optimize transaction landing
- [Working with devnet and testnet](/guides/working-with-devnet-and-testnet) - Test your transactions
- [Diagnose transaction errors](/guides/general/how-to-diagnose-solana-transaction-errors) - Debug failed transactions

## FAQ

### How long do I have to confirm a transaction?

A transaction's blockhash is valid for approximately 60-90 seconds (~150 slots). After that, the transaction will be dropped if not confirmed.

### Can I cancel a transaction?

No, once submitted, you cannot cancel a transaction. However, if it hasn't been confirmed, you can submit a new transaction with the same nonce (using durable nonces) to effectively "replace" it.

### What's the difference between "processed" and "confirmed"?

"Processed" means a validator received it. "Confirmed" means a supermajority (66%+) of validators voted on the block containing it. Always use "confirmed" or "finalized" for important operations.

### Why did my transaction fail after simulation succeeded?

State can change between simulation and execution. Another transaction may have modified the accounts. This is common in competitive scenarios like NFT mints.
