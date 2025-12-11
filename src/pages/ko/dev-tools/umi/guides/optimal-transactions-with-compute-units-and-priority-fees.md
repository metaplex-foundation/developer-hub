---
title: 컴퓨트 유닛(CU)과 우선순위 수수료를 사용한 최적 트랜잭션 랜딩
metaTitle: Umi - 컴퓨트 유닛(CU)과 우선순위 수수료를 사용한 최적 트랜잭션 랜딩
description: 적절한 컴퓨트 유닛(CU)과 우선순위 수수료를 계산하고 설정하여 Solana 트랜잭션을 최적화하는 방법을 배우세요.
created: '12-02-2024'
updated: '12-02-2024'
---

Solana에서 트랜잭션을 전송할 때, 두 가지 핵심 매개변수를 최적화하면 트랜잭션의 성공률과 비용 효율성을 크게 향상시킬 수 있습니다:

## 우선순위 수수료

우선순위 수수료를 통해 로컬 수수료 시장에서 입찰하여 트랜잭션이 더 빠르게 포함되도록 할 수 있습니다. 네트워크가 혼잡하고 여러 트랜잭션이 동일한 계정을 수정하려고 경쟁할 때, 검증자들은 더 높은 우선순위 수수료를 가진 트랜잭션을 우선시합니다.

우선순위 수수료에 대한 핵심 사항:
- 다음과 같이 계산됩니다: `compute_unit_limit * compute_unit_price`
- 더 높은 수수료는 더 빠른 포함 가능성을 증가시킵니다
- 현재 네트워크 경쟁에 기반하여 필요한 만큼만 지불하세요

## 컴퓨트 유닛 제한

컴퓨트 유닛(CU)은 트랜잭션에 필요한 계산 리소스를 나타냅니다. 트랜잭션이 안전 조치로 기본적으로 많은 CU를 요청하지만, 이는 종종 비효율적입니다:

1. 실제 사용량에 관계없이 요청한 모든 CU에 대해 우선순위 수수료를 지불합니다
2. 블록은 제한된 CU 용량을 가집니다 - 과도한 CU를 요청하면 블록당 총 트랜잭션 수가 줄어듭니다

CU 제한 최적화의 이점:
- 필요한 CU에 대해서만 지불하여 트랜잭션 비용 절감
- 블록당 더 많은 트랜잭션을 허용하여 네트워크 효율성 개선
- 실행에 충분한 리소스를 여전히 보장

예를 들어, 간단한 토큰 전송은 20,000 CU만 필요할 수 있지만, NFT 민팅은 100,000 CU가 필요할 수 있습니다. 이러한 제한을 적절히 설정하면 비용과 전체 네트워크 처리량을 모두 최적화하는 데 도움이 됩니다.

## 구현 가이드

이 가이드는 추측하기보다는 프로그래밍적으로 최적 값을 계산하는 방법을 보여줍니다.

{% callout type="warning" %}
코드 예시는 Umi가 아직 이러한 메서드를 구현하지 않았기 때문에 RPC 호출에 `fetch`를 사용합니다. 공식 지원이 추가되면 Umi의 내장 메서드를 사용하는 것이 좋습니다.
{% /callout %}

### 우선순위 수수료 계산
우선순위 수수료를 사용할 때는 경쟁이 고려될 때 가장 좋은 효과를 낸다는 점을 기억하는 것이 중요합니다. 수동으로 큰 숫자를 추가하면 필요 이상으로 많은 수수료를 지불할 수 있고, 너무 낮은 숫자를 사용하면 경쟁이 너무 치열한 경우 트랜잭션이 블록에 포함되지 않을 수 있습니다.

우리 트랜잭션의 계정에 대해 지불된 마지막 우선순위화 수수료를 얻으려면 `getRecentPrioritizationFees` RPC 호출을 사용할 수 있습니다. 결과를 사용하여 지불된 상위 100개 수수료를 기반으로 평균을 계산합니다. 이 숫자는 경험에 따라 조정할 수 있습니다.

다음 단계가 필요합니다:
1. 트랜잭션에서 쓰기 가능한 계정 추출
2. 해당 계정에 대해 지불된 최근 수수료 쿼리
3. 시장 상황에 기반한 최적 수수료 계산

페이지 하단에서 이를 사용하여 Sol Transfer를 수행하는 전체 예시를 찾을 수 있습니다.

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
  // 1단계: 트랜잭션에 포함된 고유한 쓰기 가능 계정 가져오기
  // 우선순위 수수료에 영향을 주는 쓰기 가능한 계정만 고려합니다
  const distinctPublicKeys = new Set<string>();

  transaction.items.forEach(item => {
    item.instruction.keys.forEach(key => {
      if (key.isWritable) {
        distinctPublicKeys.add(key.pubkey.toString());
      }
    });
  });

  // 2단계: RPC에서 이러한 계정에 대한 최근 우선순위화 수수료 쿼리
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

  // 3단계: 경쟁력 있는 비율을 얻기 위해 상위 100개 수수료의 평균 계산
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
트랜잭션 비용을 최적화하고 안정적인 실행을 보장하기 위해 먼저 트랜잭션을 시뮬레이션하여 이상적인 컴퓨트 유닛 제한을 계산할 수 있습니다. 이 접근법은 고정 값을 사용하는 것보다 더 정확하고 리소스의 과도한 할당을 피하는 데 도움이 됩니다.

시뮬레이션 프로세스는 다음과 같이 작동합니다:
1. 최대 컴퓨트 유닛(1,400,000)으로 트랜잭션 구축
2. 실제 소비된 컴퓨트 유닛을 측정하기 위해 시뮬레이션
3. 변동을 고려하여 10% 안전 버퍼 추가
4. 시뮬레이션이 실패하면 보수적인 기본값으로 대체

{% totem %}
{% totem-accordion title="코드 스니펫" %}
```js
export const getRequiredCU = async (
  umi: Umi,
  transaction: Transaction // 1단계: 트랜잭션 전달
): Promise<number> => {
  // 추정이 실패할 경우 기본값
  const DEFAULT_COMPUTE_UNITS = 800_000; // 표준 안전 값
  const BUFFER_FACTOR = 1.1; // 10% 안전 마진 추가

  // 2단계: 필요한 실제 컴퓨트 유닛을 얻기 위해 트랜잭션 시뮬레이션
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

  // 시뮬레이션이 컴퓨트 유닛을 제공하지 않으면 기본값으로 대체
  if (!unitsConsumed) {
    console.log("Simulation didn't return compute units, using default value");
    return DEFAULT_COMPUTE_UNITS;
  }

  // 추정된 컴퓨트 유닛에 안전 버퍼 추가
  return Math.ceil(unitsConsumed * BUFFER_FACTOR); // 3단계: 버퍼 사용
};


  const withCU = baseTransaction.prepend(
    setComputeUnitPrice(umi, { microLamports: priorityFee })
  ).prepend(
    setComputeUnitLimit(umi, { units: 1400000 })
  );

  // 8단계: 최적 컴퓨트 유닛 제한 계산
  console.log("Estimating required compute units...");
  const requiredUnits = await getRequiredCU(umi, withCU.build(umi));
```
{% /totem-accordion  %}
{% /totem %}

### Sol Transfer의 전체 예시
위의 코드를 따르고 Umi 인스턴스를 생성하기 위한 일부 상용구를 도입하면 Sol Transfer 트랜잭션을 생성하는 다음과 같은 스크립트가 나올 수 있습니다:

{% totem %}
{% totem-accordion title="전체 코드 예시" %}
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
 * 최근 트랜잭션을 기반으로 최적 우선순위 수수료를 계산합니다
 * 이는 적절한 수수료를 제공하여 트랜잭션이 빠르게 처리되도록 도움을 줍니다
 * @param umi - Umi 인스턴스
 * @param transaction - 수수료를 계산할 트랜잭션
 * @returns 마이크로램포트 단위의 평균 우선순위 수수료 (1 람포트 = 0.000000001 SOL)
 */
export const getPriorityFee = async (
  umi: Umi,
  transaction: TransactionBuilder
): Promise<number> => {
  // 트랜잭션에 포함된 고유한 쓰기 가능 계정 가져오기
  // 우선순위 수수료에 영향을 주는 쓰기 가능한 계정만 고려합니다
  const distinctPublicKeys = new Set<string>();

  transaction.items.forEach(item => {
    item.instruction.keys.forEach(key => {
      if (key.isWritable) {
        distinctPublicKeys.add(key.pubkey.toString());
      }
    });
  });

  // RPC에서 이러한 계정에 대한 최근 우선순위화 수수료 쿼리
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

  // 경쟁력 있는 비율을 얻기 위해 상위 100개 수수료의 평균 계산
  const fees = data.result?.map(entry => entry.prioritizationFee) || [];
  const topFees = fees.sort((a, b) => b - a).slice(0, 100);
  const averageFee = topFees.length > 0 ? Math.ceil(
    topFees.reduce((sum, fee) => sum + fee, 0) / topFees.length
  ) : 0;
  return averageFee;
};

/**
 * 트랜잭션에 필요한 컴퓨트 유닛을 추정합니다
 * 이는 비용 효율적이면서 컴퓨트 유닛 할당 오류를 방지하는 데 도움이 됩니다
 * @param umi - Umi 인스턴스
 * @param transaction - 컴퓨트 유닛을 추정할 트랜잭션
 * @returns 10% 안전 버퍼가 포함된 추정 필요 컴퓨트 유닛
 */
export const getRequiredCU = async (
  umi: Umi,
  transaction: Transaction
): Promise<number> => {
  // 추정이 실패할 경우 기본값
  const DEFAULT_COMPUTE_UNITS = 800_000; // 표준 안전 값
  const BUFFER_FACTOR = 1.1; // 10% 안전 마진 추가

  // 필요한 실제 컴퓨트 유닛을 얻기 위해 트랜잭션 시뮬레이션
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

  // 시뮬레이션이 컴퓨트 유닛을 제공하지 않으면 기본값으로 대체
  if (!unitsConsumed) {
    console.log("Simulation didn't return compute units, using default value");
    return DEFAULT_COMPUTE_UNITS;
  }

  // 추정된 컴퓨트 유닛에 안전 버퍼 추가
  return Math.ceil(unitsConsumed * BUFFER_FACTOR);
};

/**
 * 사용 예시: 최적화된 컴퓨트 유닛과 우선순위 수수료로 SOL을 전송하는 방법을 보여줍니다
 * 이 예시는 Solana 트랜잭션을 생성하고 최적화하는 완전한 흐름을 보여줍니다
 */
const example = async () => {
  // 1단계: RPC 엔드포인트로 Umi 초기화
  const umi = createUmi("YOUR-ENDPOINT").use(mplToolbox());

  // 2단계: 테스트 지갑 설정
  const signer = generateSigner(umi);
  umi.use(keypairIdentity(signer));

  // 3단계: 지갑에 자금 조달 (devnet만)
  console.log("Requesting airdrop for testing...");
  await umi.rpc.airdrop(signer.publicKey, sol(0.001));
  await new Promise(resolve => setTimeout(resolve, 15000)); // 에어드롭 확인 대기

  // 4단계: 기본 전송 매개변수 설정
  const destination = publicKey("BeeryDvghgcKPTUw3N3bdFDFFWhTWdWHnsLuVebgsGSD");
  const transferAmount = sol(0.00001); // 0.00001 SOL

  // 5단계: 기본 트랜잭션 생성
  console.log("Creating base transfer transaction...");
  const baseTransaction = await transferSol(umi, {
    source: signer,
    destination,
    amount: transferAmount,
  }).setLatestBlockhash(umi);

  // 6단계: 최적 우선순위 수수료 계산
  console.log("Calculating optimal priority fee...");
  const priorityFee = await getPriorityFee(umi, baseTransaction);

  // 7단계: 컴퓨트 유닛 추정을 위한 중간 트랜잭션 생성
  const withCU = baseTransaction.prepend(
    setComputeUnitPrice(umi, { microLamports: priorityFee })
  ).prepend(
    setComputeUnitLimit(umi, { units: 1400000 })
  );

  // 8단계: 최적 컴퓨트 유닛 제한 계산
  console.log("Estimating required compute units...");
  const requiredUnits = await getRequiredCU(umi, withCU.build(umi));

  // 9단계: 최종 최적화된 트랜잭션 구축
  const finalTransaction = baseTransaction.prepend(
    setComputeUnitPrice(umi, { microLamports: priorityFee })
  ).prepend(
    setComputeUnitLimit(umi, { units: requiredUnits })
  );
  console.log(`Transaction optimized with Priority Fee: ${priorityFee} microLamports and ${requiredUnits} compute units`);

  // 10단계: 트랜잭션 전송 및 확인
  console.log("Sending optimized transaction...");
  const signature = await finalTransaction.sendAndConfirm(umi);
  console.log("Transaction confirmed! Signature:", base58.deserialize(signature.signature)[0]);
};

// 예시 실행
example().catch(console.error);
```
{% /totem-accordion  %}
{% /totem %}