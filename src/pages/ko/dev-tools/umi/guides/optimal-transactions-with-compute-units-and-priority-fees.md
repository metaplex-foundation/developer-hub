---
title: 컴퓨트 유닛(CU)과 우선순위 수수료를 사용한 최적 트랜잭션 랜딩
metaTitle: Umi - 컴퓨트 유닛(CU)과 우선순위 수수료를 사용한 최적 트랜잭션 랜딩
description: 적절한 컴퓨트 유닛(CU)과 우선순위 수수료를 계산하고 설정하여 Solana 트랜잭션을 최적화하는 방법을 알아봅니다.
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

## 요약

Umi V1 트랜잭션은 시뮬레이션을 사용해 컴퓨트 소비량을 추정하고 컴퓨트 제한과 총 우선순위 수수료를 `TransactionV1Config`에 저장합니다.

- 1,400,000 컴퓨트 유닛 제한으로 시뮬레이션합니다.
- 소비된 유닛에 안전 여유분을 추가합니다.
- 컴퓨트 유닛당 마이크로 램포트 단위로 시장 가격을 추정합니다.
- `setTransactionConfig()`를 호출하기 전에 추정치를 총 램포트 수수료로 변환합니다.

Solana에서 트랜잭션을 전송할 때 두 가지 핵심 매개변수를 최적화하면 트랜잭션의 성공률과 비용 효율성을 크게 높일 수 있습니다.

## 빠른 시작

트랜잭션을 전송하기 전에 V1 컴퓨트 제한과 총 우선순위 수수료를 추정하세요.

1. 트랜잭션의 쓰기 가능 계정에 최근 지불된 수수료를 기준으로 [우선순위 수수료를 추정](#우선순위-수수료)합니다.
2. 최대 V1 컴퓨트 제한으로 [트랜잭션을 시뮬레이션](#컴퓨트-유닛-제한)합니다.
3. `setTransactionConfig()`로 [추정값을 적용](#구현-가이드)합니다.
4. [SOL 전송 전체 예시](#sol-전송-전체-예시)를 실행합니다.

## 우선순위 수수료

우선순위 수수료를 사용하면 로컬 수수료 시장에서 입찰하여 트랜잭션이 더 빠르게 포함되도록 할 수 있습니다. 네트워크가 혼잡하고 여러 트랜잭션이 동일한 계정을 수정하려고 경쟁할 때 검증자는 우선순위 수수료가 더 높은 트랜잭션을 우선 처리합니다.

우선순위 수수료의 핵심 사항은 다음과 같습니다.
- 계산식은 `compute_unit_limit * compute_unit_price`입니다.
- 수수료가 높을수록 더 빠르게 포함될 가능성이 커집니다.
- 현재 네트워크 경쟁 상황에 따라 필요한 만큼만 지불해야 합니다.

## 컴퓨트 유닛 제한

Compute Units(CU)는 트랜잭션에 필요한 계산 리소스를 나타냅니다. 트랜잭션은 안전을 위해 기본적으로 많은 CU를 요청하지만 이는 비효율적인 경우가 많습니다.

1. 실제 사용량과 관계없이 요청한 모든 CU에 대해 우선순위 수수료를 지불합니다.
2. 블록의 CU 용량은 제한되어 있으므로 과도한 CU 요청은 블록당 총 트랜잭션 수를 줄입니다.

CU 제한 최적화의 이점은 다음과 같습니다.
- 필요한 CU에 대해서만 지불하여 트랜잭션 비용을 낮춥니다.
- 블록당 더 많은 트랜잭션을 허용하여 네트워크 효율성을 높입니다.
- 실행에 충분한 리소스를 계속 보장합니다.

예를 들어 간단한 토큰 전송에는 20,000CU만 필요할 수 있지만 NFT 민팅에는 100,000CU가 필요할 수 있습니다. 이러한 제한을 적절히 설정하면 비용과 전체 네트워크 처리량을 모두 최적화할 수 있습니다.

## 구현 가이드

이 가이드에서는 값을 추측하는 대신 프로그래밍 방식으로 최적값을 계산하는 방법을 보여줍니다.

{% callout type="warning" %}
Umi가 아직 이러한 메서드를 구현하지 않았으므로 코드 예시는 RPC 호출에 `fetch`를 사용합니다. 공식 지원이 추가되면 Umi의 내장 메서드를 우선 사용하세요.
{% /callout %}

### 우선순위 수수료 계산
우선순위 수수료는 경쟁 상황을 고려할 때 가장 효과적입니다. 매우 큰 값을 수동으로 추가하면 필요 이상으로 수수료를 지불할 수 있고, 값이 너무 낮으면 경쟁이 심할 때 트랜잭션이 블록에 포함되지 않을 수 있습니다.

트랜잭션의 계정에 대해 최근 지불된 우선순위 수수료를 가져오려면 `getRecentPrioritizationFees` RPC 호출을 사용할 수 있습니다. 이 예시는 결과 중 상위 100개 수수료를 기준으로 평균을 계산합니다. 이 수치는 경험에 따라 조정할 수 있습니다.

필요한 단계는 다음과 같습니다.
1. 트랜잭션에서 쓰기 가능 계정을 추출합니다.
2. 해당 계정에 최근 지불된 수수료를 조회합니다.
3. 시장 상황에 따라 최적 수수료를 계산합니다.

페이지 아래쪽에서 이 방식을 사용해 SOL을 전송하는 전체 예시를 확인할 수 있습니다.

{% totem %}
{% totem-accordion title="코드 스니펫" %}
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

### 컴퓨트 유닛 계산
트랜잭션 비용을 최적화하고 안정적인 실행을 보장하려면 먼저 트랜잭션을 시뮬레이션하여 이상적인 컴퓨트 유닛 제한을 계산할 수 있습니다. 이 방식은 고정값을 사용하는 것보다 정밀하며 리소스 과다 할당을 방지하는 데 도움이 됩니다.

시뮬레이션 과정은 다음과 같습니다.
1. 최대 컴퓨트 유닛(1,400,000)으로 트랜잭션을 빌드합니다.
2. 실제 소비된 컴퓨트 유닛을 측정하도록 시뮬레이션합니다.
3. 변동을 고려하여 10% 안전 버퍼를 추가합니다.
4. 시뮬레이션이 실패하면 보수적인 기본값을 사용합니다.

{% totem %}
{% totem-accordion title="코드 스니펫" %}
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

### SOL 전송 전체 예시
위 코드를 사용하고 Umi 인스턴스를 생성하는 기본 코드를 추가하면 다음과 같은 스크립트로 SOL 전송 트랜잭션을 만들 수 있습니다.

{% totem %}
{% totem-accordion title="전체 코드 예시" %}
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

## 참고 사항

- 이 가이드는 Umi 1.6.0 이상과 V1 트랜잭션을 대상으로 합니다.
- `TransactionV1Config.priorityFee`는 총 램포트 금액이지만 `getRecentPrioritizationFees`는 컴퓨트 유닛당 마이크로 램포트 가격을 반환합니다.
- V1 트랜잭션은 Address Lookup Tables 또는 Compute Budget 인스트럭션을 지원하지 않습니다.
- 기존 V0 트랜잭션 빌더를 변환하려면 [V0에서 V1 트랜잭션으로 마이그레이션](/dev-tools/umi/guides/migrate-to-transaction-v1)을 참조하세요.
