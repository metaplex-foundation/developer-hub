---
title: Compute Units and Priority Fees
metaTitle: Compute Units and Priority Fees | Solana Transaction Optimization
description: Learn how to optimize Solana transactions with compute units and priority fees for better landing rates during network congestion.
# remember to update dates also in /components/products/guides/index.js
created: '02-04-2026'
updated: null
---

Master compute units and priority fees to ensure your transactions land reliably, even during network congestion. {% .lead %}

## What You'll Learn

- What compute units are and how they work
- How to set compute unit limits and prices
- When and how to use priority fees
- Strategies for optimal transaction landing

## Prerequisites

- [Transaction fundamentals](/solana/solana-transaction-fundamentals)
- [Solana CLI installed](/solana/solana-cli-essentials)

## What Are Compute Units?

**Compute units (CUs)** measure the computational resources a transaction consumes. Think of them as "gas" on Solana.

| Concept | Description |
|---------|-------------|
| **Compute Unit** | A unit of computational work |
| **Compute Budget** | Maximum CUs a transaction can use |
| **Default Limit** | 200,000 CUs per instruction |
| **Maximum Limit** | 1,400,000 CUs per transaction |

### Why Compute Units Matter

1. **Transaction limits** - Transactions exceeding their compute budget fail
2. **Priority fees** - Fees are calculated based on compute units
3. **Block space** - Blocks have limited total compute capacity

## The Compute Budget Program

The **Compute Budget Program** lets you customize compute settings via two instructions:

### SetComputeUnitLimit

Request a specific compute unit budget:

```javascript
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'

const builder = transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 300000 }))
  .add(yourInstruction)
```

### SetComputeUnitPrice

Set the price per compute unit (priority fee):

```javascript
import { setComputeUnitPrice } from '@metaplex-foundation/mpl-toolbox'

const builder = transactionBuilder()
  .add(setComputeUnitPrice(umi, { microLamports: 1000 }))
  .add(yourInstruction)
```

{% callout title="Instruction Order" %}
Always add compute budget instructions **first** in your transaction, before other instructions.
{% /callout %}

## Priority Fees Explained

**Priority fees** are optional fees that incentivize validators to include your transaction sooner. They're calculated as:

```
Priority Fee = Compute Units × Compute Unit Price (in micro-lamports)
```

### Example Calculation

```
Compute Units: 200,000
Price: 1,000 micro-lamports per CU
Priority Fee: 200,000 × 1,000 = 200,000,000 micro-lamports
            = 200,000 lamports
            = 0.0002 SOL
```

### When to Use Priority Fees

| Scenario | Priority Fee Strategy |
|----------|----------------------|
| Normal network conditions | None or minimal (50-100 micro-lamports) |
| Moderate congestion | 1,000-10,000 micro-lamports |
| High congestion / NFT mints | 10,000-100,000+ micro-lamports |
| Time-sensitive DeFi | Dynamic based on recent fees |

## Estimating Compute Units

### Method 1: Simulation

Simulate your transaction to see actual CU consumption. Build the transaction first, then simulate:

```javascript
const tx = await myBuilder
  .setBlockhash(await umi.rpc.getLatestBlockhash())
  .buildAndSign(umi)

const simulation = await umi.rpc.simulateTransaction(tx)
// Use the consumed units with a 10-20% buffer
```

### Method 2: RPC Methods

Some RPC providers offer priority fee estimation endpoints. Check your provider's documentation for specific APIs.

## Setting Optimal Compute Limits

### Too High
- Wastes block space
- May be deprioritized by validators
- Higher risk of transaction being skipped

### Too Low
- Transaction fails if it exceeds limit
- You lose the transaction fee

### Best Practice

Simulate first, then set a compute limit with a buffer:

```javascript
import { setComputeUnitLimit, setComputeUnitPrice } from '@metaplex-foundation/mpl-toolbox'
import { transactionBuilder } from '@metaplex-foundation/umi'

// 1. Build your instruction(s)
const baseBuilder = transactionBuilder().add(yourInstruction)

// 2. Simulate to estimate CUs (check explorer logs for consumed CUs)
// 3. Add compute budget with a buffer
const optimizedBuilder = transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: estimatedCUs * 1.2 }))
  .add(setComputeUnitPrice(umi, { microLamports: 1000 }))
  .add(yourInstruction)

await optimizedBuilder.sendAndConfirm(umi)
```

## Dynamic Priority Fees

For competitive scenarios like popular mints, increase priority fees based on network conditions. Monitor recent transaction fees via your RPC provider's dashboard or priority fee APIs, and adjust accordingly.

## Complete Example with UMI

```javascript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { setComputeUnitLimit, setComputeUnitPrice } from '@metaplex-foundation/mpl-toolbox'
import { transactionBuilder } from '@metaplex-foundation/umi'

const umi = createUmi('https://api.devnet.solana.com')

// Build an optimized transaction with compute budget
const builder = transactionBuilder()
  // Compute budget instructions go FIRST
  .add(setComputeUnitLimit(umi, { units: 300000 }))
  .add(setComputeUnitPrice(umi, { microLamports: 1000 }))
  // Then your actual instructions
  .add(yourInstruction)

await builder.sendAndConfirm(umi)
```

See the [Optimal transaction landing with UMI](/umi/guides/optimal-transactions-with-compute-units-and-priority-fees) guide for detailed patterns including simulation-based estimation.

## Cost Considerations

### Fee Calculation

Total transaction cost = Base fee + Priority fee

```
Base fee: 5,000 lamports (0.000005 SOL) per signature
Priority fee: CUs × Price in micro-lamports
```

## Troubleshooting

### "Compute budget exceeded"

**Cause**: Transaction used more CUs than allocated.

**Solution**: Increase compute unit limit:
```javascript
setComputeUnitLimit(umi, { units: 400000 })
```

### Transaction Dropped Despite Priority Fee

**Causes**:
- Blockhash expired
- Fee still too low for current demand
- Transaction was included but failed

**Solutions**:
1. Retry with fresh blockhash
2. Increase priority fee
3. Check if transaction was actually included (check signature)

### High Priority Fee but Slow Confirmation

**Cause**: The accounts you're writing to may be heavily contested (hot accounts).

**Solution**: For contested accounts, even higher fees may be needed, or retry with exponential backoff.

## Best Practices

1. **Always simulate first** - Get accurate CU estimates
2. **Add buffer to estimates** - 10-20% extra prevents failures
3. **Start with low priority fees** - Increase only if needed
4. **Monitor network conditions** - Adjust strategy based on congestion
5. **Don't overpay** - High fees don't guarantee faster confirmation on uncongested networks

## Next Steps

- [Working with devnet and testnet](/solana/working-with-devnet-and-testnet) - Test without real fees
- [Transaction fundamentals](/solana/solana-transaction-fundamentals) - Understand transaction structure
- [How to diagnose transaction errors](/solana/general/how-to-diagnose-solana-transaction-errors) - Debug issues

## FAQ

### Do I always need priority fees?

No. During normal network conditions, transactions land fine without priority fees. Only add them during congestion or for time-sensitive operations.

### What's a good default priority fee?

For general use, 1,000-5,000 micro-lamports per CU is reasonable. Monitor recent fees for your specific use case.

### Why set compute unit limit at all?

Setting an accurate limit:
- Signals to validators your transaction won't waste block space
- Can improve prioritization
- Prevents overpaying on priority fees (fee = CUs × price)

### Can I get a refund for unused compute units?

No. You're charged based on the compute unit limit you set, not what you actually use. That's why accurate estimation matters.
