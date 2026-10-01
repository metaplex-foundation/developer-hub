---
title: V0에서 V1 트랜잭션으로 마이그레이션
metaTitle: V0에서 V1 트랜잭션으로 마이그레이션 | Umi
description: 컴퓨트 예산, 우선순위 수수료, 지갑 호환성을 포함하여 Umi 트랜잭션 빌더와 직접 트랜잭션 생성을 Solana V0 트랜잭션에서 V1 트랜잭션으로 마이그레이션합니다.
keywords:
  - Umi transaction v1
  - Solana transaction v1
  - Umi v0 migration
  - TransactionV1Config
  - useV1
  - setTransactionConfig
  - SIMD-0385
about:
  - Umi
  - Solana Transaction V1
  - Transaction Migration
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '09-21-2026'
updated: '09-21-2026'
howToSteps:
  - Umi 패키지를 1.6.0 이상으로, web3.js를 1.99.0 이상으로 업그레이드합니다
  - 트랜잭션 빌더별로 V1을 선택하거나 애플리케이션 기본값으로 설정합니다
  - Compute Budget 인스트럭션을 TransactionV1Config로 대체합니다
  - Address Lookup Tables가 필요한 트랜잭션은 V0으로 유지합니다
  - 서명 전에 연결된 모든 지갑이 V1 트랜잭션을 지원하는지 확인합니다
howToTools:
  - Umi 1.6.0 or later
  - web3.js 1.99.0 or later
  - Solana RPC
faqs:
  - q: Umi는 기본적으로 V1 트랜잭션을 사용하나요?
    a: 아니요. Umi 1.6.0은 이전 버전과의 호환성을 위해 V0을 기본값으로 유지합니다. 트랜잭션 빌더에서 useV1을 호출하거나 Umi를 생성할 때 defaultTransactionVersion을 1로 설정하세요.
  - q: Umi V1 트랜잭션에서 Address Lookup Table을 사용할 수 있나요?
    a: 아니요. V1 트랜잭션은 Address Lookup Tables를 지원하지 않습니다. Address Lookup Table이 필요한 트랜잭션은 V0으로 유지하세요.
  - q: V1 트랜잭션에 Compute Budget 프로그램 인스트럭션을 포함할 수 있나요?
    a: 아니요. Umi는 Compute Budget 인스트럭션이 포함된 V1 트랜잭션 빌더를 거부합니다. setTransactionConfig를 사용하여 컴퓨트 유닛 제한, 총 우선순위 수수료, 로드된 계정 데이터 크기 제한 또는 힙 크기를 설정하세요.
  - q: V1 트랜잭션 우선순위 수수료는 컴퓨트 유닛당 가격인가요?
    a: 아니요. TransactionV1Config.priorityFee는 SolAmount로 나타낸 총 우선순위 수수료입니다. 마이크로 램포트 가격에 컴퓨트 유닛 제한을 곱하고 1,000,000으로 나눈 다음 램포트 단위로 올림하여 변환하세요.
  - q: 모든 Solana 지갑이 V1 트랜잭션을 지원하나요?
    a: 아니요. Umi는 지갑 어댑터용 V1 트랜잭션을 직렬화할 수 있지만, 연결된 지갑이 트랜잭션 버전 1을 수락하고 서명할 수 있어야 합니다. V1을 애플리케이션 전체 기본값으로 설정하기 전에 지갑 지원 여부를 확인하세요.
---

Umi 애플리케이션을 V0에서 [V1 트랜잭션](https://github.com/solana-foundation/solana-improvement-documents/blob/main/proposals/0385-transaction-v1.md)으로 마이그레이션하여 더 큰 트랜잭션을 사용하고 트랜잭션 메시지에서 컴퓨트 예산을 직접 구성할 수 있습니다. {% .lead %}

{% callout title="마이그레이션할 항목" %}
이 가이드에서는 Umi V0 트랜잭션 빌더를 V1으로 전환하고, Compute Budget 인스트럭션을 `TransactionV1Config`로 대체하며, V1을 전역으로 구성하고, V0으로 유지해야 하는 트랜잭션을 식별합니다.
{% /callout %}

## 요약

Umi 1.6.0은 `useV1()`, `defaultTransactionVersion: 1`, 직접 트랜잭션 입력의 `version: 1`을 통해 선택적으로 V1 트랜잭션을 지원합니다.

- V1은 직렬화된 트랜잭션 제한을 1,232바이트에서 4,096바이트로 늘립니다.
- V1은 컴퓨트 제한과 총 우선순위 수수료를 `TransactionV1Config`에 저장합니다.
- V1은 Address Lookup Tables 또는 Compute Budget 인스트럭션을 지원하지 않습니다.
- Umi는 계속 V0을 기본값으로 사용하며, 연결된 지갑이 V1을 지원해야 합니다.

## 빠른 시작

트랜잭션 빌더에서 V1을 선택하고 Compute Budget 인스트럭션을 `setTransactionConfig()`로 대체하세요.

1. Umi 1.6.0 이상 및 `@solana/web3.js` 1.99.0 이상으로 업그레이드합니다.
2. 트랜잭션 빌더에 `.useV1()`을 추가합니다.
3. `setComputeUnitLimit` 및 `setComputeUnitPrice` 인스트럭션을 제거합니다.
4. `.setTransactionConfig({ computeUnitLimit, priorityFee })`를 추가합니다.
5. 애플리케이션에서 지원하는 모든 지갑으로 V1 서명을 테스트합니다.

**바로 가기:** [사전 요구 사항](#사전-요구-사항) · [V0 및 V1의 차이점](#v0-및-v1-트랜잭션의-차이점) · [빌더 마이그레이션](#트랜잭션-빌더를-v1으로-마이그레이션) · [애플리케이션 기본값](#v1을-애플리케이션-기본값으로-설정) · [직접 생성](#직접-트랜잭션-생성을-v1으로-마이그레이션) · [Address Lookup Tables](#address-lookup-table-트랜잭션을-v0으로-유지) · [일반적인 오류](#일반적인-v1-마이그레이션-오류) · [FAQ](#faq)

## 사전 요구 사항

V1 마이그레이션에는 호환되는 Umi, Web3.js, RPC 및 지갑 버전이 필요합니다.

| 구성 요소 | 요구 사항 |
|-----------|-------------|
| Umi packages | 1.6.0 이상 |
| `@solana/web3.js` | 1.99.0 이상 |
| Solana clusters | mainnet-beta, devnet 및 testnet에서 V1 활성화 |
| Wallet | 트랜잭션 버전 `1`을 수락하고 서명해야 함 |

{% callout type="warning" %}
연결된 모든 지갑 경로가 트랜잭션 버전 `1`을 지원하기 전에는 V1을 전역으로 활성화하지 마세요. Umi는 지갑 어댑터용 트랜잭션을 직렬화하지만, 호환되지 않는 지갑이 트랜잭션에 서명하도록 만들 수는 없습니다.
{% /callout %}

## V0 및 V1 트랜잭션의 차이점

V1은 트랜잭션 크기 제한을 늘리지만 V0 Address Lookup Tables 또는 Compute Budget 인스트럭션을 지원하지 않습니다.

| 기능 | V0 | V1 |
|------------|----------------|----------------|
| 직렬화 크기 제한 | 1,232바이트 | 4,096바이트 |
| Address lookup tables | 지원 | 지원하지 않음 |
| 컴퓨트 유닛 제한 | Compute Budget 인스트럭션 | `transactionConfig.computeUnitLimit` |
| 우선순위 수수료 | 컴퓨트 유닛당 마이크로 램포트 | `transactionConfig.priorityFee`의 총 `SolAmount` |
| Umi 1.6.0 기본값 | 예 | 아니요, 명시적으로 선택해야 함 |
| 빌더 선택자 | `useV0()` | `useV1()` |

V1은 Address Lookup Table에 의존하지 않으면서 트랜잭션이 V0 크기 제한을 초과할 때 가장 유용합니다.

## 트랜잭션 빌더를 V1으로 마이그레이션

V0 트랜잭션 빌더는 Compute Budget 인스트럭션을 `useV1()` 및 `setTransactionConfig()`로 대체하여 V1으로 마이그레이션할 수 있습니다.

### 마이그레이션 전 V0 트랜잭션 빌더

V0 트랜잭션 빌더는 컴퓨트 유닛 제한과 가격을 인스트럭션으로 표현합니다.

```typescript {% title="transaction-v0.ts" %}
import { transactionBuilder } from '@metaplex-foundation/umi'
import {
  setComputeUnitLimit,
  setComputeUnitPrice,
  transferSol,
} from '@metaplex-foundation/mpl-toolbox'

await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 600_000 }))
  .add(setComputeUnitPrice(umi, { microLamports: 1_000 }))
  .add(transferSol(umi, transferArgs))
  .sendAndConfirm(umi)
```

### 마이그레이션 후 V1 트랜잭션 빌더

V1 트랜잭션 빌더는 컴퓨트 유닛 제한과 총 우선순위 수수료를 트랜잭션 메시지에 표현합니다.

```typescript {% title="transaction-v1.ts" %}
import { lamports, transactionBuilder } from '@metaplex-foundation/umi'
import { transferSol } from '@metaplex-foundation/mpl-toolbox'

await transactionBuilder()
  .add(transferSol(umi, transferArgs))
  .useV1()
  .setTransactionConfig({
    computeUnitLimit: 600_000,
    priorityFee: lamports(600),
  })
  .sendAndConfirm(umi)
```

총 수수료 `600`램포트는 `600,000 × 1,000 ÷ 1,000,000`과 같습니다. 변환 결과가 정수 램포트가 아니면 올림하세요.

{% callout type="note" %}
`setTransactionConfig()`는 전체 구성을 대체합니다. 개별 필드로 반복 호출하지 말고 모든 사용자 지정 V1 설정을 한 번의 호출에 포함하세요.
{% /callout %}

## V1을 애플리케이션 기본값으로 설정

`defaultTransactionVersion: 1`을 설정하면 빌더가 다른 버전을 명시적으로 선택하지 않는 한 모든 트랜잭션 빌더가 V1을 사용합니다.

```typescript {% title="umi.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'

const umi = createUmi('https://api.mainnet-beta.solana.com', {
  defaultTransactionVersion: 1,
})
```

이 옵션은 Metaplex 프로그램 라이브러리가 반환하는 빌더에도 적용됩니다. `useV0()`을 호출하는 빌더는 여전히 애플리케이션 기본값을 재정의합니다.

트랜잭션 팩토리를 직접 설치하는 애플리케이션은 대신 플러그인을 구성할 수 있습니다.

```typescript {% title="umi-with-custom-plugins.ts" %}
import { web3JsTransactionFactory } from '@metaplex-foundation/umi-transaction-factory-web3js'

umi.use(web3JsTransactionFactory({ defaultTransactionVersion: 1 }))
```

## 직접 트랜잭션 생성을 V1으로 마이그레이션

직접 `umi.transactions.create()`를 호출할 때는 `version: 1`을 설정하고 0이 아닌 런타임 제한을 명시적으로 제공해야 합니다.

```typescript {% title="create-transaction-v1.ts" %}
const transaction = umi.transactions.create({
  version: 1,
  blockhash: (await umi.rpc.getLatestBlockhash()).blockhash,
  instructions: [myInstruction],
  payer: umi.payer.publicKey,
  transactionConfig: {
    computeUnitLimit: 200_000,
    loadedAccountsDataSizeLimit: 64 * 1024 * 1024,
  },
})
```

`TransactionBuilder`는 생략된 컴퓨트 및 로드된 계정 제한에 대해 레거시와 동일한 기본값을 제공합니다. 저수준 `create()` 메서드는 기본값을 제공하지 않으며, 생략된 제한은 런타임에서 0으로 처리됩니다.

## V1 트랜잭션 제한 구성

`TransactionV1Config`는 컴퓨트, 계정 데이터, 힙 크기 및 총 우선순위 수수료를 제어합니다.

| 필드 | 의미 | 유효 범위 또는 동작 |
|-------|---------|-------------------------|
| `computeUnitLimit` | 최대 컴퓨트 유닛 | `0`부터 `1,400,000`까지의 정수 |
| `priorityFee` | 총 우선순위 수수료 | 일반적으로 `lamports(...)`로 생성하는 `SolAmount` |
| `loadedAccountsDataSizeLimit` | 로드된 계정 데이터의 최대 크기 | 최대 64MiB |
| `heapSize` | 프로그램 힙 프레임 크기 | 1,024바이트 단위로 32,768~262,144바이트 |

빌더는 해당 필드가 생략되면 `computeUnitLimit`의 기본값을 `min(200,000 × 인스트럭션 수, 1,400,000)`으로, `loadedAccountsDataSizeLimit`의 기본값을 64MiB로 설정합니다.

## Address Lookup Table 트랜잭션을 V0으로 유지

[Address Lookup Tables](/dev-tools/umi/toolbox/address-lookup-table)가 필요한 트랜잭션은 V0으로 유지해야 합니다.

```typescript {% title="transaction-v0-with-lookup-table.ts" %}
const builder = transactionBuilder()
  .add(myInstruction)
  .useV0()
  .setAddressLookupTables([myLookupTable])
```

트랜잭션을 V1으로 강제 전환하기 위해 Address Lookup Table을 제거하지 마세요. 컴파일된 계정 목록과 직렬화 크기를 비교한 다음 트랜잭션 요구 사항을 충족하는 형식을 사용하세요.

## 사용자 지정 Umi 통합 업데이트

사용자 지정 트랜잭션 팩토리와 모든 버전을 빠짐없이 처리하는 코드는 Umi 1.6.0으로 업그레이드할 때 V1 지원을 추가해야 합니다.

- 사용자 지정 `TransactionFactoryInterface` 구현에 `getDefaultVersion()`을 구현합니다.
- `TransactionVersion`을 완전하게 분기하는 코드에 `1` 케이스를 추가합니다.
- 이제 V0 버전 필드가 필수이므로 직접 생성하는 V0 `TransactionInput` 객체에 `version: 0`을 추가합니다.
- 트랜잭션을 읽을 때 `transaction.message.version`을 확인합니다. V1 메시지에는 `transactionConfig`가 포함됩니다.

Umi의 RPC 통합은 `maxSupportedTransactionVersion: 1`을 요청하므로 `umi.rpc.getTransaction()`으로 V1 트랜잭션을 가져올 수 있습니다.

## 일반적인 V1 마이그레이션 오류

Umi는 호환되지 않는 빌더 조합을 트랜잭션 전송 전에 거부합니다.

| 오류 | 원인 | 해결 방법 |
|-------|-------|-----|
| `V1 transactions ignore ComputeBudget instructions. Set the compute budget with setTransactionConfig instead.` | V1 트랜잭션 빌더에 `setComputeUnitLimit`, `setComputeUnitPrice` 또는 다른 Compute Budget 인스트럭션이 포함됨 | 인스트럭션을 제거하고 `setTransactionConfig()` 사용 |
| `Address lookup tables are not supported by V1 transactions.` | V1 트랜잭션 빌더에 하나 이상의 Address Lookup Tables가 있음 | 빌더를 V0으로 유지하거나 lookup table 요구 사항 제거 |
| `Transaction configs are only supported by V1 transactions.` | 레거시 또는 V0 트랜잭션 빌더가 `setTransactionConfig()`를 호출함 | `useV1()`을 호출하거나 V0에서 Compute Budget 인스트럭션 사용 |
| 지갑이 트랜잭션을 거부하거나 역직렬화하지 못함 | 지갑이 트랜잭션 버전 `1`을 지원하지 않음 | 지갑이 V1 지원을 추가할 때까지 해당 지갑 흐름을 V0으로 유지 |
| 직접 생성한 트랜잭션이 불충분한 컴퓨트 예산으로 실패함 | `create()`에 `computeUnitLimit`이 전달되지 않음 | 0이 아닌 `transactionConfig.computeUnitLimit` 설정 |

## 참고 사항

- V1은 Umi 1.6.0에서 선택적으로 사용하며, 이전 버전과의 호환성을 위해 기본값은 V0으로 유지됩니다.
- V1은 2026년 9월 15일 epoch 1035부터 Solana mainnet-beta에서 활성화되었습니다.
- 전송 및 시뮬레이션은 1,232바이트보다 큰 V1 트랜잭션을 지원하는 base64 인코딩을 사용합니다.
- Umi는 직렬화 전에 컴퓨트 유닛 제한과 힙 크기를 검증합니다.
- 구현 및 호환성 세부 정보는 [metaplex-foundation/umi#216](https://github.com/metaplex-foundation/umi/pull/216)에 문서화되어 있습니다.

## FAQ

### Umi는 기본적으로 V1 트랜잭션을 사용하나요?

Umi 1.6.0은 이전 버전과의 호환성을 위해 V0을 기본값으로 유지합니다. 트랜잭션 빌더에서 `useV1()`을 호출하거나 Umi를 생성할 때 `defaultTransactionVersion: 1`을 설정하세요.

### Umi V1 트랜잭션에서 Address Lookup Table을 사용할 수 있나요?

V1 트랜잭션은 Address Lookup Tables를 지원하지 않습니다. Address Lookup Table이 필요한 트랜잭션은 V0으로 유지하세요.

### V1 트랜잭션에 Compute Budget 프로그램 인스트럭션을 포함할 수 있나요?

Umi는 Compute Budget 인스트럭션이 포함된 V1 트랜잭션 빌더를 거부합니다. `setTransactionConfig()`를 사용하여 컴퓨트 유닛 제한, 총 우선순위 수수료, 로드된 계정 데이터 크기 제한 또는 힙 크기를 설정하세요.

### V1 트랜잭션 우선순위 수수료는 컴퓨트 유닛당 가격인가요?

`TransactionV1Config.priorityFee`는 컴퓨트 유닛당 가격이 아니라 `SolAmount`로 나타낸 총 우선순위 수수료입니다. 마이크로 램포트 가격에 컴퓨트 유닛 제한을 곱하고 1,000,000으로 나눈 다음 램포트 단위로 올림하여 변환하세요.

### 모든 Solana 지갑이 V1 트랜잭션을 지원하나요?

트랜잭션 버전 `1`에 대한 지갑 지원은 보편적이지 않습니다. Umi는 지갑 어댑터용 V1 트랜잭션을 직렬화할 수 있지만, 연결된 지갑이 트랜잭션을 수락하고 서명할 수 있어야 합니다.
