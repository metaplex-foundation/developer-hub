---
title: 使用计算单元（CU）和优先费优化交易落地
metaTitle: Umi - 使用计算单元（CU）和优先费优化交易落地
description: 了解如何通过计算并设置适当的计算单元（CU）和优先费来优化 Solana 交易。
keywords:
  - Umi transaction v1
  - compute units
  - priority fees
  - transaction optimization
about:
  - Umi
  - Solana Transaction V1
  - Priority Fees
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '12-02-2024'
updated: '09-21-2026'
---

## 总结

Umi V1 交易通过模拟来估算计算消耗，并将计算上限和优先费总额存储在 `TransactionV1Config` 中。

- 使用 1,400,000 的计算单元上限进行模拟。
- 为消耗的计算单元增加安全余量。
- 估算每个计算单元的市场价格，单位为 micro-lamport。
- 在调用 `setTransactionConfig()` 前，将估算结果转换为以 lamport 计的费用总额。

在 Solana 上发送交易时，优化两个关键参数可以显著提高交易成功率和成本效益。

## 快速开始

在发送交易前，估算 V1 的计算单元上限和优先费总额。

1. 根据交易可写账户近期支付的费用[估算优先费](#优先费)。
2. 使用 V1 的最大计算单元上限[模拟交易](#计算单元上限)。
3. 使用 `setTransactionConfig()` [应用估算值](#实现指南)。
4. [运行完整的 SOL 转账示例](#sol-转账完整示例)。

## 优先费

优先费让您可以在本地费用市场中出价，使交易更快被纳入区块。当网络拥堵且多个交易竞争修改相同账户时，验证者会优先处理优先费更高的交易。

优先费的要点：
- 计算公式为：`compute_unit_limit * compute_unit_price`
- 更高的费用会提高交易更快被纳入区块的可能性
- 应根据当前网络竞争情况，仅支付必要的费用

## 计算单元上限

计算单元（CU）表示交易所需的计算资源。虽然交易默认会请求大量 CU 作为安全措施，但这通常效率不高：

1. 无论实际使用量如何，都要为所有请求的 CU 支付优先费
2. 区块的 CU 容量有限，请求过多 CU 会减少每个区块能够容纳的交易总数

优化 CU 上限的好处：
- 仅为所需的 CU 付费，从而降低交易成本
- 让每个区块容纳更多交易，从而提高网络效率
- 同时确保有足够的资源执行交易

例如，简单的代币转账可能只需要 20,000 CU，而 NFT 铸造可能需要 100,000 CU。适当设置这些上限有助于同时优化成本和整体网络吞吐量。

## 实现指南

本指南演示如何通过编程方式计算最佳值，而不是依靠猜测。

{% callout type="warning" %}
代码示例使用 `fetch` 进行 RPC 调用，因为 Umi 尚未实现这些方法。添加官方支持后，请优先使用 Umi 的内置方法。
{% /callout %}

### 计算优先费
使用优先费时，必须考虑竞争情况才能取得最佳效果。手动设置一个很大的数值可能导致支付远超所需的费用，而数值过低则可能在竞争激烈时导致交易无法被纳入区块。

要获取交易所涉及账户近期支付的优先费，可以使用 `getRecentPrioritizationFees` RPC 调用。我们根据返回结果中最高的 100 笔费用计算平均值。您可以根据实际经验调整这一数值。

需要执行以下步骤：
1. 从交易中提取可写账户
2. 查询这些账户近期支付的费用
3. 根据市场情况计算最佳费用

页面底部提供了一个使用此方法执行 SOL 转账的完整示例。

{% totem %}
{% totem-accordion title="代码片段" %}
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

### 计算计算单元
为了优化交易成本并确保可靠执行，可以先模拟交易，再计算理想的计算单元上限。这种方法比使用固定值更精确，并有助于避免过度分配资源。

模拟过程如下：
1. 使用最大计算单元数（1,400,000）构建交易
2. 模拟交易以测量实际消耗的计算单元
3. 增加 10% 的安全余量以应对波动
4. 如果模拟失败，则回退到保守的默认值

{% totem %}
{% totem-accordion title="代码片段" %}
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

  // Add a safety buffer without exceeding the V1 maximum.
  const bufferedUnits = Math.ceil(unitsConsumed * BUFFER_FACTOR);
  if (bufferedUnits > 1_400_000) {
    throw new Error(
      `Transaction requires ${bufferedUnits} compute units after buffering, so it cannot fit within the V1 maximum of 1,400,000. Split it into multiple transactions.`
    );
  }
  return bufferedUnits; // Step 3: use the buffer
};


  const withCU = baseTransaction
    .useV1()
    .setTransactionConfig({ computeUnitLimit: 1_400_000 });

  // Step 8: Calculate optimal compute unit limit
  console.log("Estimating required compute units...");
  const requiredUnits = await getRequiredCU(umi, withCU.build(umi));
```
{% /totem-accordion  %}
{% /totem %}

### SOL 转账完整示例
结合上述代码，并添加一些用于创建 Umi 实例的样板代码，可以得到以下创建 SOL 转账交易的脚本：

{% totem %}
{% totem-accordion title="完整代码示例" %}
```js
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  lamports,
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

  // Add a safety buffer without exceeding the V1 maximum.
  const bufferedUnits = Math.ceil(unitsConsumed * BUFFER_FACTOR);
  if (bufferedUnits > 1_400_000) {
    throw new Error(
      `Transaction requires ${bufferedUnits} compute units after buffering, so it cannot fit within the V1 maximum of 1,400,000. Split it into multiple transactions.`
    );
  }
  return bufferedUnits;
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
  const withCU = baseTransaction
    .useV1()
    .setTransactionConfig({ computeUnitLimit: 1_400_000 });

  // Step 8: Calculate optimal compute unit limit
  console.log("Estimating required compute units...");
  const requiredUnits = await getRequiredCU(umi, withCU.build(umi));

  // Step 9: Build the final optimized transaction
  const totalPriorityFeeLamports = Math.ceil(
    (priorityFee * requiredUnits) / 1_000_000
  );
  const finalTransaction = baseTransaction
    .useV1()
    .setTransactionConfig({
      computeUnitLimit: requiredUnits,
      priorityFee: lamports(totalPriorityFeeLamports),
    });
  console.log(`Transaction optimized with a total priority fee of ${totalPriorityFeeLamports} lamports and ${requiredUnits} compute units`);

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

## 注意事项

- 本指南适用于 Umi 1.6.0 或更高版本以及 V1 交易。
- `TransactionV1Config.priorityFee` 是以 lamport 计的总金额，而 `getRecentPrioritizationFees` 返回的是每个计算单元以 micro-lamport 计的价格。
- V1 交易不支持 Address Lookup Tables 或 Compute Budget 指令。
- 将现有 V0 交易构建器转换为 V1 时，请参阅[从 V0 迁移到 V1 交易](/dev-tools/umi/guides/migrate-to-transaction-v1)。
