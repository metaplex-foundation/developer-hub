---
title: Optimal transaction landing using Compute Units (CU) and priority fees
metaTitle: Umi - Optimal transaction landing using Compute Units (CU) and priority fees
description: Learn how to optimize your Solana transactions by calculating and setting appropriate Compute Units (CU) and priority fees.
created: '12-02-2024'
updated: '12-02-2024'
---

When sending transactions on Solana, optimizing two key parameters can significantly improve your transaction's success rate and cost-effectiveness:

## Priority Fees

Priority fees let you bid in local fee markets to get your transactions included faster. When the network is congested and multiple transactions compete to modify the same accounts, validators prioritize transactions with higher priority fees.

Key points about priority fees:
- They are calculated as: `compute_unit_limit * compute_unit_price`
- Higher fees increase likelihood of faster inclusion
- Only pay what's necessary based on current network competition

## Compute Unit Limit

Compute Units (CUs) represent the computational resources your transaction needs. While transactions default to requesting many CUs as a safety measure, this is often inefficient:

1. You pay priority fees for all requested CUs regardless of actual usage
2. Blocks have limited CU capacity - requesting excess CUs reduces total transactions per block

Benefits of optimizing your CU limit:
- Lower transaction costs by only paying for needed CUs
- Improved network efficiency by allowing more transactions per block
- Still ensures sufficient resources for execution

For example, a simple token transfer might only need 20,000 CUs, while an NFT mint could require 100,000 CUs. Setting these limits appropriately helps optimize both your costs and overall network throughput.

## Implementation Guide

This guide demonstrates how to programmatically calculate optimal values rather than guessing.

{% callout type="warning" %}
The code examples use `fetch` for RPC calls since Umi hasn't implemented these methods yet. When official support is added, prefer using Umi's built-in methods.
{% /callout %}

### Calculate Priority Fees
When using priority fees it is important to remember that those have the best effect when the competition is taken into account. Adding a huge number manually may result in overpaying more fees than required, while using a too low number might result in the transaction not being included into the block in case there is too much competition.

To get the last paid prioritization fees that were paid for the accounts in our transaction one can use the `getRecentPrioritizationFees` RPC call. We use the result to calculate an average based on the top 100 fees paid. This number can be aligned according to your experience.

The following steps are necessary:
1. Extract writable accounts from your transaction
2. Query recent fees paid for those accounts
3. Calculate optimal fee based on market conditions

At the bottom of the page you can find a full example where a Sol Transfer is done with this.

{% totem %}
{% totem-accordion title="Code Snippet" %}
```js
import {
  TransactionBuilder,
  Umi,
} from "@metaplex-foundation/umi";

export const getPriorityFee = async (
  umi: Umi,
  transaction: TransactionBuilder
): Promise<number> => {
  // Step 1: Get unique writable accounts involved in the transaction
  // We only care about writable accounts since they affect priority fees
  const distinctPublicKeys = new Set<string>();
  
  transaction.items.forEach(item => {
    item.instruction.keys.forEach(key => {
      if (key.isWritable) {
        distinctPublicKeys.add(key.pubkey.toString());
      }
    });
  });
  
  // Step 2: Query recent prioritization fees for these accounts from the RPC
  const response = await fetch(umi.rpc.getEndpoint(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getRecentPrioritizationFees",
      params: [Array.from(distinctPublicKeys)],
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch priority fees: ${response.status}`);
  }

  const data = await response.json() as {
    result: { prioritizationFee: number; slot: number; }[];
  };

  // Step 3: Calculate average of top 100 fees to get a competitive rate
  const fees = data.result?.map(entry => entry.prioritizationFee) || [];
  const topFees = fees.sort((a, b) => b - a).slice(0, 100);
  const averageFee = topFees.length > 0 ? Math.ceil(
    topFees.reduce((sum, fee) => sum + fee, 0) / topFees.length
  ) : 0;
  return averageFee;
};

```
{% /totem-accordion  %}
{% /totem %}

### Calculate Compute Units
To optimize transaction costs and ensure reliable execution, we can calculate the ideal compute unit limit by simulating the transaction first. This approach is more precise than using fixed values and helps avoid over-allocation of resources.

The simulation process works by:
1. Building the transaction with maximum compute units (1,400,000)
2. Simulating it to measure actual compute units consumed
3. Adding a 10% safety buffer to account for variations
4. Falling back to a conservative default if simulation fails

{% totem %}
{% totem-accordion title="Code Snippet" %}
```js
export const getRequiredCU = async (
  umi: Umi,
  transaction: Transaction // Step 1: pass the transaction
): Promise<number> => {
  // Default values if estimation fails
  const DEFAULT_COMPUTE_UNITS = 800_000; // Standard safe value
  const BUFFER_FACTOR = 1.1; // Add 10% safety margin

  // Step 2: Simulate the transaction to get actual compute units needed
  const response = await fetch(umi.rpc.getEndpoint(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "simulateTransaction",
      params: [
        base64.deserialize(umi.transactions.serialize(transaction))[0],
        {
          encoding: "base64",
          replaceRecentBlockhash: true,
          sigVerify: false,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to simulate transaction: ${response.status}`);
  }

  const data = await response.json();
  const unitsConsumed = data.result?.value?.unitsConsumed;

  // Fallback to default if simulation doesn't provide compute units
  if (!unitsConsumed) {
    console.log("Simulation didn't return compute units, using default value");
    return DEFAULT_COMPUTE_UNITS;
  }

  // Add safety buffer to estimated compute units
  return Math.ceil(unitsConsumed * BUFFER_FACTOR); // Step 3: use the buffer
};


  const withCU = baseTransaction.prepend(
    setComputeUnitPrice(umi, { microLamports: priorityFee })
  ).prepend(
    setComputeUnitLimit(umi, { units: 1400000 })
  );

  // Step 8: Calculate optimal compute unit limit
  console.log("Estimating required compute units...");
  const requiredUnits = await getRequiredCU(umi, withCU.build(umi));
```
{% /totem-accordion  %}
{% /totem %}

### Full example for Sol Transfer
Following the code above and introducing some boilerplate to create the Umi instance could result in a script like this to create a Sol Transfer transaction:

{% totem %}
{% totem-accordion title="Full Code Example" %}
```js
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  sol,
  publicKey,
  Transaction,
  Umi,
  generateSigner,
  keypairIdentity,
  TransactionBuilder,
} from "@metaplex-foundation/umi";
import {
  transferSol,
  setComputeUnitLimit,
  setComputeUnitPrice,
  mplToolbox,
} from "@metaplex-foundation/mpl-toolbox";
import { base58, base64 } from "@metaplex-foundation/umi/serializers";

/**
 * Calculates the optimal priority fee based on recent transactions
 * This helps ensure our transaction gets processed quickly by offering an appropriate fee
 * @param umi - The Umi instance
 * @param transaction - The transaction to calculate the fee for
 * @returns The average priority fee in microLamports (1 lamport = 0.000000001 SOL)
 */
export const getPriorityFee = async (
  umi: Umi,
  transaction: TransactionBuilder
): Promise<number> => {
  // Get unique writable accounts involved in the transaction
  // We only care about writable accounts since they affect priority fees
  const distinctPublicKeys = new Set<string>();
  
  transaction.items.forEach(item => {
    item.instruction.keys.forEach(key => {
      if (key.isWritable) {
        distinctPublicKeys.add(key.pubkey.toString());
      }
    });
  });
  
  // Query recent prioritization fees for these accounts from the RPC
  const response = await fetch(umi.rpc.getEndpoint(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getRecentPrioritizationFees",
      params: [Array.from(distinctPublicKeys)],
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch priority fees: ${response.status}`);
  }

  const data = await response.json() as {
    result: { prioritizationFee: number; slot: number; }[];
  };

  // Calculate average of top 100 fees to get a competitive rate
  const fees = data.result?.map(entry => entry.prioritizationFee) || [];
  const topFees = fees.sort((a, b) => b - a).slice(0, 100);
  const averageFee = topFees.length > 0 ? Math.ceil(
    topFees.reduce((sum, fee) => sum + fee, 0) / topFees.length
  ) : 0;
  return averageFee;
};

/**
 * Estimates the required compute units for a transaction
 * This helps prevent compute unit allocation errors while being cost-efficient
 * @param umi - The Umi instance
 * @param transaction - The transaction to estimate compute units for
 * @returns Estimated compute units needed with 10% safety buffer
 */
export const getRequiredCU = async (
  umi: Umi,
  transaction: Transaction
): Promise<number> => {
  // Default values if estimation fails
  const DEFAULT_COMPUTE_UNITS = 800_000; // Standard safe value
  const BUFFER_FACTOR = 1.1; // Add 10% safety margin

  // Simulate the transaction to get actual compute units needed
  const response = await fetch(umi.rpc.getEndpoint(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "simulateTransaction",
      params: [
        base64.deserialize(umi.transactions.serialize(transaction))[0],
        {
          encoding: "base64",
          replaceRecentBlockhash: true,
          sigVerify: false,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to simulate transaction: ${response.status}`);
  }

  const data = await response.json();
  const unitsConsumed = data.result?.value?.unitsConsumed;

  // Fallback to default if simulation doesn't provide compute units
  if (!unitsConsumed) {
    console.log("Simulation didn't return compute units, using default value");
    return DEFAULT_COMPUTE_UNITS;
  }

  // Add safety buffer to estimated compute units
  return Math.ceil(unitsConsumed * BUFFER_FACTOR);
};

/**
 * Example usage: Demonstrates how to send SOL with optimized compute units and priority fees
 * This example shows a complete flow of creating and optimizing a Solana transaction
 */
const example = async () => {
  // Step 1: Initialize Umi with your RPC endpoint
  const umi = createUmi("YOUR-ENDPOINT").use(mplToolbox());
  
  // Step 2: Set up a test wallet
  const signer = generateSigner(umi);
  umi.use(keypairIdentity(signer));
  
  // Step 3: Fund the wallet (devnet only)
  console.log("Requesting airdrop for testing...");
  await umi.rpc.airdrop(signer.publicKey, sol(0.001));
  await new Promise(resolve => setTimeout(resolve, 15000)); // Wait for airdrop confirmation
  
  // Step 4: Set up the basic transfer parameters
  const destination = publicKey("BeeryDvghgcKPTUw3N3bdFDFFWhTWdWHnsLuVebgsGSD");
  const transferAmount = sol(0.00001); // 0.00001 SOL
  
  // Step 5: Create the base transaction
  console.log("Creating base transfer transaction...");
  const baseTransaction = await transferSol(umi, {
    source: signer,
    destination,
    amount: transferAmount,
  }).setLatestBlockhash(umi);

  // Step 6: Calculate optimal priority fee
  console.log("Calculating optimal priority fee...");
  const priorityFee = await getPriorityFee(umi, baseTransaction);
  
  // Step 7: Create intermediate transaction for compute unit estimation
  const withCU = baseTransaction.prepend(
    setComputeUnitPrice(umi, { microLamports: priorityFee })
  ).prepend(
    setComputeUnitLimit(umi, { units: 1400000 })
  );

  // Step 8: Calculate optimal compute unit limit
  console.log("Estimating required compute units...");
  const requiredUnits = await getRequiredCU(umi, withCU.build(umi));
  
  // Step 9: Build the final optimized transaction
  const finalTransaction = baseTransaction.prepend(
    setComputeUnitPrice(umi, { microLamports: priorityFee })
  ).prepend(
    setComputeUnitLimit(umi, { units: requiredUnits })
  );
  console.log(`Transaction optimized with Priority Fee: ${priorityFee} microLamports and ${requiredUnits} compute units`);

  // Step 10: Send and confirm the transaction
  console.log("Sending optimized transaction...");
  const signature = await finalTransaction.sendAndConfirm(umi);
  console.log("Transaction confirmed! Signature:", base58.deserialize(signature.signature)[0]);
};

// Run the example
example().catch(console.error);

```
{% /totem-accordion  %}
{% /totem %}
