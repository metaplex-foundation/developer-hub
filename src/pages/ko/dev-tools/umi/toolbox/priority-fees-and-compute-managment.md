---
title: 우선순위 수수료 및 컴퓨트 관리
metaTitle: 우선순위 수수료 및 컴퓨트 관리 | Toolbox
description: Umi V1 및 V0 트랜잭션의 컴퓨트 유닛 제한과 우선순위 수수료를 구성합니다.
keywords:
  - Umi priority fees
  - Umi compute units
  - TransactionV1Config
  - Compute Budget Program
about:
  - Umi
  - Solana Transaction Fees
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '09-04-2024'
updated: '09-21-2026'
---

## 요약

V1 트랜잭션에서 컴퓨트 유닛과 우선순위 수수료를 구성하려면 `setTransactionConfig()`를 사용하세요.

- V1은 `computeUnitLimit`과 총 `priorityFee`를 사용합니다.
- Umi V1 트랜잭션 빌더는 Compute Budget 프로그램 인스트럭션을 거부합니다.
- V0은 `setComputeUnitLimit` 및 `setComputeUnitPrice`를 사용합니다.
- 컴퓨트 유닛당 마이크로 램포트로 표시된 우선순위 수수료 추정치는 V1에서 총 램포트로 변환해야 합니다.

Umi V1 트랜잭션은 컴퓨트 제한과 총 우선순위 수수료를 트랜잭션 메시지에 저장하지만, V0 트랜잭션은 Compute Budget 프로그램 인스트럭션을 사용합니다.

## V1 컴퓨트 유닛 및 우선순위 수수료 구성

V1 트랜잭션은 `setTransactionConfig()`로 컴퓨트 유닛 제한과 총 우선순위 수수료를 구성합니다.

```ts {% title="V1 compute configuration" %}
import { lamports, transactionBuilder } from '@metaplex-foundation/umi'

await transactionBuilder()
  .add(myInstruction)
  .useV1()
  .setTransactionConfig({
    computeUnitLimit: 600_000,
    priorityFee: lamports(600),
  })
  .sendAndConfirm(umi)
```

`priorityFee`는 컴퓨트 유닛당 가격이 아니라 총 수수료입니다. 가격이 1,000마이크로 램포트이고 제한이 600,000유닛이면 총액은 `600,000 × 1,000 ÷ 1,000,000 = 600`램포트입니다.

{% callout type="warning" %}
V1 트랜잭션 빌더에 `setComputeUnitLimit` 또는 `setComputeUnitPrice` 인스트럭션을 추가하지 마세요. Umi는 V1 트랜잭션의 Compute Budget 인스트럭션을 거부합니다.
{% /callout %}

## V0 컴퓨트 유닛 및 우선순위 수수료 구성

V0 트랜잭션은 계속 `@metaplex-foundation/mpl-toolbox`의 Compute Budget 프로그램 인스트럭션을 사용합니다.

```ts {% title="V0 compute configuration" %}
import { transactionBuilder } from '@metaplex-foundation/umi'
import {
  setComputeUnitLimit,
  setComputeUnitPrice,
} from '@metaplex-foundation/mpl-toolbox'

await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 600_000 }))
  .add(setComputeUnitPrice(umi, { microLamports: 1_000 }))
  .add(myInstruction)
  .useV0()
  .sendAndConfirm(umi)
```

트랜잭션에 [Address Lookup Table](/dev-tools/umi/toolbox/address-lookup-table)이 필요하거나 연결된 지갑이 V1 트랜잭션을 지원하지 않으면 V0을 사용하세요.

## 참고 사항

- `useV1()` 및 `setTransactionConfig()`를 사용하려면 Umi 1.6.0 이상이 필요합니다.
- V1 컴퓨트 유닛 제한은 1,400,000을 초과할 수 없습니다.
- 컴퓨트 유닛과 수수료를 추정하려면 [최적 트랜잭션 랜딩](/dev-tools/umi/guides/optimal-transactions-with-compute-units-and-priority-fees)을 참조하세요.
- 모든 호환성 요구 사항은 [V0에서 V1 트랜잭션으로 마이그레이션](/dev-tools/umi/guides/migrate-to-transaction-v1)을 참조하세요.
