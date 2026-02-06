---
title: 使用计算单元（CU）和优先费优化交易落地
metaTitle: Umi - 使用计算单元（CU）和优先费优化交易落地
description: 学习如何通过计算和设置适当的计算单元（CU）和优先费来优化您的 Solana 交易。
created: '12-02-2024'
updated: '12-02-2024'
---

在 Solana 上发送交易时，优化两个关键参数可以显著提高交易的成功率和成本效益：

## 优先费

优先费让您可以在本地费用市场中出价，以更快地将交易包含在区块中。当网络拥堵且多个交易竞争修改相同账户时，验证者会优先处理具有更高优先费的交易。

关于优先费的要点：

- 它们的计算方式为：`compute_unit_limit * compute_unit_price`
- 更高的费用增加更快包含的可能性
- 根据当前网络竞争情况只支付必要的费用

## 计算单元限制

计算单元（CU）表示您的交易所需的计算资源。虽然交易默认请求许多 CU 作为安全措施，但这通常是低效的：

1. 无论实际使用情况如何，您都要为所有请求的 CU 支付优先费
2. 区块具有有限的 CU 容量 - 请求过多的 CU 会减少每个区块的总交易数

优化 CU 限制的好处：

- 通过只支付所需的 CU 来降低交易成本
- 通过允许每个区块更多交易来提高网络效率
- 仍然确保有足够的资源用于执行

例如，简单的代币转账可能只需要 20,000 CU，而 NFT 铸造可能需要 100,000 CU。适当设置这些限制有助于优化您的成本和整体网络吞吐量。

## 实现指南

本指南演示如何以编程方式计算最佳值，而不是猜测。

{% callout type="warning" %}
代码示例使用 `fetch` 进行 RPC 调用，因为 Umi 尚未实现这些方法。当添加官方支持时，优先使用 Umi 的内置方法。
{% /callout %}

### 计算优先费

使用优先费时，重要的是要记住，当考虑竞争时，这些费用效果最好。手动添加一个巨大的数字可能导致支付超过所需的费用，而使用太低的数字可能导致在竞争激烈时交易不被包含在区块中。

要获取为我们交易中的账户支付的最后优先费，可以使用 `getRecentPrioritizationFees` RPC 调用。我们使用结果基于前 100 个支付的费用计算平均值。这个数字可以根据您的经验进行调整。

需要以下步骤：

1. 从您的交易中提取可写账户
2. 查询这些账户最近支付的费用
3. 根据市场条件计算最优费用

在页面底部，您可以找到一个使用此方法进行 Sol 转账的完整示例。

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
  // 步骤 1：获取交易中涉及的唯一可写账户
  // 我们只关心可写账户，因为它们影响优先费
  const distinctPublicKeys = new Set<string>();

  transaction.items.forEach(item => {
    item.instruction.keys.forEach(key => {
      if (key.isWritable) {
        distinctPublicKeys.add(key.pubkey.toString());
      }
    });
  });

  // 步骤 2：从 RPC 查询这些账户的最近优先费
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

  // 步骤 3：计算前 100 个费用的平均值以获得有竞争力的费率
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

为了优化交易成本并确保可靠执行，我们可以通过首先模拟交易来计算理想的计算单元限制。这种方法比使用固定值更精确，有助于避免资源的过度分配。

模拟过程的工作原理：

1. 使用最大计算单元（1,400,000）构建交易
2. 模拟它以测量实际消耗的计算单元
3. 添加 10% 的安全缓冲区以应对变化
4. 如果模拟失败，则回退到保守的默认值

{% totem %}
{% totem-accordion title="代码片段" %}

```js
export const getRequiredCU = async (
  umi: Umi,
  transaction: Transaction // 步骤 1：传入交易
): Promise<number> => {
  // 如果估算失败的默认值
  const DEFAULT_COMPUTE_UNITS = 800_000; // 标准安全值
  const BUFFER_FACTOR = 1.1; // 添加 10% 安全余量

  // 步骤 2：模拟交易以获取实际需要的计算单元
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

  // 如果模拟不提供计算单元，则回退到默认值
  if (!unitsConsumed) {
    console.log("Simulation didn't return compute units, using default value");
    return DEFAULT_COMPUTE_UNITS;
  }

  // 将安全缓冲区添加到估计的计算单元
  return Math.ceil(unitsConsumed * BUFFER_FACTOR); // 步骤 3：使用缓冲区
};


  const withCU = baseTransaction.prepend(
    setComputeUnitPrice(umi, { microLamports: priorityFee })
  ).prepend(
    setComputeUnitLimit(umi, { units: 1400000 })
  );

  // 步骤 8：计算最优计算单元限制
  console.log("Estimating required compute units...");
  const requiredUnits = await getRequiredCU(umi, withCU.build(umi));
```

{% /totem-accordion  %}
{% /totem %}

### Sol 转账完整示例

按照上面的代码并引入一些样板代码来创建 Umi 实例，可以生成这样的脚本来创建 Sol 转账交易：

{% totem %}
{% totem-accordion title="完整代码示例" %}

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
 * 根据最近的交易计算最优优先费
 * 这有助于确保我们的交易通过提供适当的费用快速处理
 * @param umi - Umi 实例
 * @param transaction - 要计算费用的交易
 * @returns 以 microLamports 为单位的平均优先费（1 lamport = 0.000000001 SOL）
 */
export const getPriorityFee = async (
  umi: Umi,
  transaction: TransactionBuilder
): Promise<number> => {
  // 获取交易中涉及的唯一可写账户
  // 我们只关心可写账户，因为它们影响优先费
  const distinctPublicKeys = new Set<string>();

  transaction.items.forEach(item => {
    item.instruction.keys.forEach(key => {
      if (key.isWritable) {
        distinctPublicKeys.add(key.pubkey.toString());
      }
    });
  });

  // 从 RPC 查询这些账户的最近优先费
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

  // 计算前 100 个费用的平均值以获得有竞争力的费率
  const fees = data.result?.map(entry => entry.prioritizationFee) || [];
  const topFees = fees.sort((a, b) => b - a).slice(0, 100);
  const averageFee = topFees.length > 0 ? Math.ceil(
    topFees.reduce((sum, fee) => sum + fee, 0) / topFees.length
  ) : 0;
  return averageFee;
};

/**
 * 估算交易所需的计算单元
 * 这有助于防止计算单元分配错误，同时保持成本效益
 * @param umi - Umi 实例
 * @param transaction - 要估算计算单元的交易
 * @returns 带有 10% 安全缓冲区的估计所需计算单元
 */
export const getRequiredCU = async (
  umi: Umi,
  transaction: Transaction
): Promise<number> => {
  // 如果估算失败的默认值
  const DEFAULT_COMPUTE_UNITS = 800_000; // 标准安全值
  const BUFFER_FACTOR = 1.1; // 添加 10% 安全余量

  // 模拟交易以获取实际需要的计算单元
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

  // 如果模拟不提供计算单元，则回退到默认值
  if (!unitsConsumed) {
    console.log("Simulation didn't return compute units, using default value");
    return DEFAULT_COMPUTE_UNITS;
  }

  // 将安全缓冲区添加到估计的计算单元
  return Math.ceil(unitsConsumed * BUFFER_FACTOR);
};

/**
 * 使用示例：演示如何使用优化的计算单元和优先费发送 SOL
 * 此示例展示了创建和优化 Solana 交易的完整流程
 */
const example = async () => {
  // 步骤 1：使用您的 RPC 端点初始化 Umi
  const umi = createUmi("YOUR-ENDPOINT").use(mplToolbox());

  // 步骤 2：设置测试钱包
  const signer = generateSigner(umi);
  umi.use(keypairIdentity(signer));

  // 步骤 3：为钱包充值（仅限 devnet）
  console.log("Requesting airdrop for testing...");
  await umi.rpc.airdrop(signer.publicKey, sol(0.001));
  await new Promise(resolve => setTimeout(resolve, 15000)); // 等待空投确认

  // 步骤 4：设置基本转账参数
  const destination = publicKey("BeeryDvghgcKPTUw3N3bdFDFFWhTWdWHnsLuVebgsGSD");
  const transferAmount = sol(0.00001); // 0.00001 SOL

  // 步骤 5：创建基础交易
  console.log("Creating base transfer transaction...");
  const baseTransaction = await transferSol(umi, {
    source: signer,
    destination,
    amount: transferAmount,
  }).setLatestBlockhash(umi);

  // 步骤 6：计算最优优先费
  console.log("Calculating optimal priority fee...");
  const priorityFee = await getPriorityFee(umi, baseTransaction);

  // 步骤 7：创建用于计算单元估算的中间交易
  const withCU = baseTransaction.prepend(
    setComputeUnitPrice(umi, { microLamports: priorityFee })
  ).prepend(
    setComputeUnitLimit(umi, { units: 1400000 })
  );

  // 步骤 8：计算最优计算单元限制
  console.log("Estimating required compute units...");
  const requiredUnits = await getRequiredCU(umi, withCU.build(umi));

  // 步骤 9：构建最终优化的交易
  const finalTransaction = baseTransaction.prepend(
    setComputeUnitPrice(umi, { microLamports: priorityFee })
  ).prepend(
    setComputeUnitLimit(umi, { units: requiredUnits })
  );
  console.log(`Transaction optimized with Priority Fee: ${priorityFee} microLamports and ${requiredUnits} compute units`);

  // 步骤 10：发送并确认交易
  console.log("Sending optimized transaction...");
  const signature = await finalTransaction.sendAndConfirm(umi);
  console.log("Transaction confirmed! Signature:", base58.deserialize(signature.signature)[0]);
};

// 运行示例
example().catch(console.error);

```

{% /totem-accordion  %}
{% /totem %}
