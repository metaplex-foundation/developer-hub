---
title: コンピュートユニット（CU）と優先料金を使用した最適なトランザクション実行
metaTitle: Umi - コンピュートユニット（CU）と優先料金を使用した最適なトランザクション実行
description: 適切なコンピュートユニット（CU）と優先料金を計算・設定して、Solanaトランザクションを最適化する方法を学びます。
created: '12-02-2024'
updated: '12-02-2024'
---

Solanaでトランザクションを送信する際、2つの重要なパラメータを最適化することで、トランザクションの成功率とコスト効率を大幅に向上させることができます：

## 優先料金

優先料金により、ローカル料金市場で入札を行い、トランザクションをより速く含めることができます。ネットワークが混雑し、複数のトランザクションが同じアカウントの変更を競合する場合、バリデータは優先料金の高いトランザクションを優先します。

優先料金に関する重要なポイント：
- 計算式：`compute_unit_limit * compute_unit_price`
- 料金が高いほど、より速い実行の可能性が向上
- 現在のネットワーク競合に基づいて必要な分だけ支払う

## コンピュートユニット制限

コンピュートユニット（CU）は、トランザクションが必要とする計算リソースを表します。トランザクションは安全策として多くのCUをリクエストすることがデフォルトですが、これは多くの場合非効率です：

1. 実際の使用量に関係なく、リクエストしたすべてのCUに対して優先料金を支払う
2. ブロックのCU容量は限られている - 過剰なCUのリクエストはブロック当たりの総トランザクション数を減らす

CU制限の最適化の利点：
- 必要なCUのみに支払うことによるトランザクションコストの削減
- ブロック当たりのトランザクション数増加によるネットワーク効率の向上
- 実行に十分なリソースを確保

例えば、シンプルなトークン転送には20,000 CUしか必要ないかもしれませんが、NFTのミントには100,000 CUが必要な場合があります。これらの制限を適切に設定することで、コストと全体的なネットワークスループットの両方を最適化できます。

## 実装ガイド

このガイドでは、推測ではなくプログラムで最適な値を計算する方法を説明します。

{% callout type="warning" %}
Umiはまだこれらのメソッドを実装していないため、コード例ではRPC呼び出しに`fetch`を使用しています。公式サポートが追加された際は、Umiの組み込みメソッドの使用を優先してください。
{% /callout %}

### 優先料金の計算
優先料金を使用する際は、競合を考慮に入れることが重要です。手動で巨大な数値を追加すると必要以上の料金を支払うことになり、数値が低すぎると競合が激しい場合にトランザクションがブロックに含まれない可能性があります。

トランザクション内のアカウントに対して支払われた最後の優先料金を取得するには、`getRecentPrioritizationFees` RPC呼び出しを使用できます。結果を使用して、上位100件の支払済み料金に基づく平均を計算します。この数値は経験に応じて調整できます。

必要な手順：
1. トランザクションから書き込み可能なアカウントを抽出
2. それらのアカウントに対して最近支払われた料金を照会
3. 市場条件に基づいて最適な料金を計算

ページの下部に、これを使ったSol転送の完全な例があります。

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
  // ステップ1：トランザクションに関与するユニークな書き込み可能アカウントを取得
  // 優先料金に影響するのは書き込み可能アカウントのみなので、それらのみを対象とする
  const distinctPublicKeys = new Set<string>();
  
  transaction.items.forEach(item => {
    item.instruction.keys.forEach(key => {
      if (key.isWritable) {
        distinctPublicKeys.add(key.pubkey.toString());
      }
    });
  });
  
  // ステップ2：これらのアカウントの最近の優先料金をRPCから照会
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

  // ステップ3：上位100件の料金の平均を計算して競争力のある料金を取得
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

### コンピュートユニットの計算
トランザクションコストを最適化し、信頼できる実行を確保するために、まずトランザクションをシミュレートして理想的なコンピュートユニット制限を計算できます。このアプローチは固定値を使用するよりも正確で、リソースの過度な割り当てを避けるのに役立ちます。

シミュレーションプロセスの動作：
1. 最大コンピュートユニット（1,400,000）でトランザクションを構築
2. シミュレートして実際に消費されるコンピュートユニットを測定
3. バリエーションを考慮して10%の安全バッファを追加
4. シミュレーションが失敗した場合は保守的なデフォルトにフォールバック

{% totem %}
{% totem-accordion title="Code Snippet" %}
```js
export const getRequiredCU = async (
  umi: Umi,
  transaction: Transaction // ステップ1：トランザクションを渡す
): Promise<number> => {
  // 推定が失敗した場合のデフォルト値
  const DEFAULT_COMPUTE_UNITS = 800_000; // 標準的な安全な値
  const BUFFER_FACTOR = 1.1; // 10%の安全マージンを追加

  // ステップ2：トランザクションをシミュレートして実際に必要なコンピュートユニットを取得
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

  // シミュレーションがコンピュートユニットを提供しない場合はデフォルトにフォールバック
  if (!unitsConsumed) {
    console.log("Simulation didn't return compute units, using default value");
    return DEFAULT_COMPUTE_UNITS;
  }

  // 推定されたコンピュートユニットに安全バッファを追加
  return Math.ceil(unitsConsumed * BUFFER_FACTOR); // ステップ3：バッファを使用
};


  const withCU = baseTransaction.prepend(
    setComputeUnitPrice(umi, { microLamports: priorityFee })
  ).prepend(
    setComputeUnitLimit(umi, { units: 1400000 })
  );

  // ステップ8：最適なコンピュートユニット制限を計算
  console.log("Estimating required compute units...");
  const requiredUnits = await getRequiredCU(umi, withCU.build(umi));
```
{% /totem-accordion  %}
{% /totem %}

### Sol転送の完全な例
上記のコードに従い、Umiインスタンスを作成するためのボイラープレートを導入すると、Sol転送トランザクションを作成する以下のようなスクリプトが作成できます：

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
 * 最近のトランザクションに基づいて最適な優先料金を計算
 * 適切な料金を提供することで、トランザクションが迅速に処理されることを確保する
 * @param umi - Umiインスタンス
 * @param transaction - 料金を計算するトランザクション
 * @returns マイクロラムポートでの平均優先料金（1ラムポート = 0.000000001 SOL）
 */
export const getPriorityFee = async (
  umi: Umi,
  transaction: TransactionBuilder
): Promise<number> => {
  // トランザクションに関与するユニークな書き込み可能アカウントを取得
  // 優先料金に影響するのは書き込み可能アカウントのみなので、それらのみを対象とする
  const distinctPublicKeys = new Set<string>();
  
  transaction.items.forEach(item => {
    item.instruction.keys.forEach(key => {
      if (key.isWritable) {
        distinctPublicKeys.add(key.pubkey.toString());
      }
    });
  });
  
  // これらのアカウントの最近の優先料金をRPCから照会
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

  // 上位100件の料金の平均を計算して競争力のある料金を取得
  const fees = data.result?.map(entry => entry.prioritizationFee) || [];
  const topFees = fees.sort((a, b) => b - a).slice(0, 100);
  const averageFee = topFees.length > 0 ? Math.ceil(
    topFees.reduce((sum, fee) => sum + fee, 0) / topFees.length
  ) : 0;
  return averageFee;
};

/**
 * トランザクションに必要なコンピュートユニットを推定
 * コストを効率的に保ちながら、コンピュートユニット割り当てエラーを防ぐ
 * @param umi - Umiインスタンス
 * @param transaction - コンピュートユニットを推定するトランザクション
 * @returns 10%の安全バッファ付きの推定必要コンピュートユニット
 */
export const getRequiredCU = async (
  umi: Umi,
  transaction: Transaction
): Promise<number> => {
  // 推定が失敗した場合のデフォルト値
  const DEFAULT_COMPUTE_UNITS = 800_000; // 標準的な安全な値
  const BUFFER_FACTOR = 1.1; // 10%の安全マージンを追加

  // トランザクションをシミュレートして実際に必要なコンピュートユニットを取得
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

  // シミュレーションがコンピュートユニットを提供しない場合はデフォルトにフォールバック
  if (!unitsConsumed) {
    console.log("Simulation didn't return compute units, using default value");
    return DEFAULT_COMPUTE_UNITS;
  }

  // 推定されたコンピュートユニットに安全バッファを追加
  return Math.ceil(unitsConsumed * BUFFER_FACTOR);
};

/**
 * 使用例：最適化されたコンピュートユニットと優先料金でSOLを送信する方法のデモンストレーション
 * この例では、Solanaトランザクションの作成と最適化の完全なフローを示します
 */
const example = async () => {
  // ステップ1：RPCエンドポイントでUmiを初期化
  const umi = createUmi("YOUR-ENDPOINT").use(mplToolbox());
  
  // ステップ2：テストウォレットのセットアップ
  const signer = generateSigner(umi);
  umi.use(keypairIdentity(signer));
  
  // ステップ3：ウォレットに資金を供給（devnetのみ）
  console.log("Requesting airdrop for testing...");
  await umi.rpc.airdrop(signer.publicKey, sol(0.001));
  await new Promise(resolve => setTimeout(resolve, 15000)); // エアドロップ確認を待機
  
  // ステップ4：基本的な転送パラメータのセットアップ
  const destination = publicKey("BeeryDvghgcKPTUw3N3bdFDFFWhTWdWHnsLuVebgsGSD");
  const transferAmount = sol(0.00001); // 0.00001 SOL
  
  // ステップ5：基本トランザクションの作成
  console.log("Creating base transfer transaction...");
  const baseTransaction = await transferSol(umi, {
    source: signer,
    destination,
    amount: transferAmount,
  }).setLatestBlockhash(umi);

  // ステップ6：最適な優先料金の計算
  console.log("Calculating optimal priority fee...");
  const priorityFee = await getPriorityFee(umi, baseTransaction);
  
  // ステップ7：コンピュートユニット推定のための中間トランザクションの作成
  const withCU = baseTransaction.prepend(
    setComputeUnitPrice(umi, { microLamports: priorityFee })
  ).prepend(
    setComputeUnitLimit(umi, { units: 1400000 })
  );

  // ステップ8：最適なコンピュートユニット制限の計算
  console.log("Estimating required compute units...");
  const requiredUnits = await getRequiredCU(umi, withCU.build(umi));
  
  // ステップ9：最終的な最適化されたトランザクションの構築
  const finalTransaction = baseTransaction.prepend(
    setComputeUnitPrice(umi, { microLamports: priorityFee })
  ).prepend(
    setComputeUnitLimit(umi, { units: requiredUnits })
  );
  console.log(`Transaction optimized with Priority Fee: ${priorityFee} microLamports and ${requiredUnits} compute units`);

  // ステップ10：トランザクションの送信と確認
  console.log("Sending optimized transaction...");
  const signature = await finalTransaction.sendAndConfirm(umi);
  console.log("Transaction confirmed! Signature:", base58.deserialize(signature.signature)[0]);
};

// 例を実行
example().catch(console.error);

```
{% /totem-accordion  %}
{% /totem %}
