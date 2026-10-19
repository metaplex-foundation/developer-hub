---
title: コンピュートユニット（CU）と優先料金によるトランザクション実行の最適化
metaTitle: Umi - コンピュートユニット（CU）と優先料金によるトランザクション実行の最適化
description: 適切なコンピュートユニット（CU）と優先料金を計算・設定して、Solanaトランザクションを最適化する方法を学びます。
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

## まとめ

UmiのV1トランザクションでは、シミュレーションでコンピュート消費量を推定し、コンピュート制限と優先料金の合計を`TransactionV1Config`に格納します。

- 1,400,000のコンピュートユニット制限でシミュレーションします。
- 消費されたユニットに安全マージンを加えます。
- コンピュートユニットあたりのマイクロラムポートで市場価格を見積もります。
- `setTransactionConfig()`を呼び出す前に、見積もりをラムポート単位の合計料金へ変換します。

Solanaでトランザクションを送信する際は、2つの重要なパラメータを最適化することで、トランザクションの成功率とコスト効率を大幅に向上させることができます。

## クイックスタート

トランザクションを送信する前に、V1のコンピュート制限と優先料金の合計を見積もります。

1. トランザクションの書き込み可能アカウントに対して最近支払われた料金から[優先料金を見積もります](#優先料金)。
2. V1の最大コンピュート制限で[トランザクションをシミュレーションします](#コンピュートユニット制限)。
3. `setTransactionConfig()`を使用して[見積もった値を適用します](#実装ガイド)。
4. [SOL転送の完全な例を実行します](#sol転送の完全な例)。

## 優先料金

優先料金を使用すると、ローカル料金市場で入札し、トランザクションをより早く取り込ませることができます。ネットワークが混雑し、複数のトランザクションが同じアカウントの変更を競う場合、バリデーターは優先料金が高いトランザクションを優先します。

優先料金の要点：
- 計算式は`compute_unit_limit * compute_unit_price`です
- 料金が高いほど、より早く取り込まれる可能性が高まります
- 現在のネットワーク競合に基づき、必要な金額だけを支払います

## コンピュートユニット制限

コンピュートユニット（CU）は、トランザクションに必要な計算リソースを表します。トランザクションは安全策として多くのCUを要求するのがデフォルトですが、多くの場合これは非効率です。

1. 実際の使用量に関係なく、要求したすべてのCUに対して優先料金を支払います
2. ブロックのCU容量は限られているため、過剰なCUの要求はブロックあたりの総トランザクション数を減らします

CU制限を最適化する利点：
- 必要なCUのみに支払うことでトランザクションコストを削減できます
- 1ブロックに含められるトランザクション数が増え、ネットワーク効率が向上します
- 実行に十分なリソースを確保できます

たとえば、単純なトークン転送には20,000 CUで十分でも、NFTのミントには100,000 CUが必要な場合があります。これらの制限を適切に設定すると、コストとネットワーク全体のスループットの両方を最適化できます。

## 実装ガイド

このガイドでは、推測ではなくプログラムによって最適な値を計算する方法を説明します。

{% callout type="warning" %}
Umiはまだこれらのメソッドを実装していないため、コード例ではRPC呼び出しに`fetch`を使用しています。公式サポートが追加されたら、Umiの組み込みメソッドを優先して使用してください。
{% /callout %}

### 優先料金を計算する
優先料金を使用する際は、競合を考慮することが重要です。手動で非常に大きな値を指定すると必要以上の料金を支払う可能性があり、低すぎる値を指定すると競合が激しい場合にトランザクションがブロックへ取り込まれない可能性があります。

トランザクション内のアカウントに対して最近支払われた優先料金は、`getRecentPrioritizationFees` RPC呼び出しで取得できます。ここでは、支払われた料金の上位100件に基づいて平均を計算します。この件数は経験に応じて調整できます。

必要な手順：
1. トランザクションから書き込み可能なアカウントを抽出します
2. それらのアカウントに対して最近支払われた料金を照会します
3. 市場の状況に基づいて最適な料金を計算します

ページ下部には、この処理を使用したSOL転送の完全な例があります。

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

### コンピュートユニットを計算する
トランザクションコストを最適化し、信頼性の高い実行を確保するには、最初にトランザクションをシミュレーションして、理想的なコンピュートユニット制限を計算します。この方法は固定値を使用するより正確で、リソースの過剰割り当てを防ぐのに役立ちます。

シミュレーションの手順：
1. 最大コンピュートユニット（1,400,000）でトランザクションを構築します
2. シミュレーションして、実際に消費されるコンピュートユニットを測定します
3. 変動を考慮して10%の安全バッファを追加します
4. シミュレーションが失敗した場合は、保守的なデフォルト値へフォールバックします

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

### SOL転送の完全な例
上記のコードにUmiインスタンスを作成するためのボイラープレートを加えると、SOL転送トランザクションを作成する次のようなスクリプトになります。

{% totem %}
{% totem-accordion title="Full Code Example" %}
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

## 注意事項

- このガイドはUmi 1.6.0以降とV1トランザクションを対象としています。
- `TransactionV1Config.priorityFee`はラムポート単位の合計金額ですが、`getRecentPrioritizationFees`はコンピュートユニットあたりのマイクロラムポート単位の価格を返します。
- V1トランザクションはAddress Lookup TablesやCompute Budget命令をサポートしません。
- 既存のV0トランザクションビルダーを変換する場合は、[V0からV1トランザクションへの移行](/dev-tools/umi/guides/migrate-to-transaction-v1)を参照してください。
