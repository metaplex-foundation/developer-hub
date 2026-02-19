---
title: API 클라이언트
metaTitle: API 클라이언트 | Genesis SDK | Metaplex
description: Genesis API 클라이언트를 사용하여 Solana에서 토큰 런칭을 생성하고 등록하세요. 간단한 방식부터 완전한 제어까지 세 가지 통합 모드를 제공합니다.
created: '02-19-2026'
updated: '02-19-2026'
keywords:
  - Genesis API client
  - token launch SDK
  - createLaunch
  - registerLaunch
  - createAndRegisterLaunch
about:
  - SDK API client
  - Token launch creation
  - Launch registration
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

Genesis API 클라이언트는 토큰 런칭을 생성하고 등록하기 위한 고수준 함수를 제공합니다. Umi 기반의 간단한 인터페이스를 통해 트랜잭션 빌드, 서명, 온체인 등록을 처리합니다. {% .lead %}

{% callout type="note" %}
Genesis 프로그램의 전체 기능을 [metaplex.com](https://www.metaplex.com)에서 아직 지원하지 않으므로, 런칭을 프로그래밍 방식으로 생성하려면 SDK를 사용하는 것을 권장합니다. API를 통해 생성된 메인넷 런칭은 등록 후 metaplex.com에 표시됩니다.
{% /callout %}

## 설치

```bash
npm install @metaplex-foundation/genesis @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults
```

## 설정

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { genesis } from '@metaplex-foundation/genesis';
import { keypairIdentity } from '@metaplex-foundation/umi';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(genesis());

// For server-side or scripts, load a keypair
umi.use(keypairIdentity(myKeypair));
```

## 세 가지 통합 모드

SDK는 완전 자동부터 완전 수동까지, 런칭 생성을 위한 세 가지 모드를 제공합니다.

### 간편 모드 — `createAndRegisterLaunch`

가장 간단한 방식입니다. 하나의 함수 호출로 온체인 계정 생성, Umi를 통한 트랜잭션 서명 및 전송, 런칭 등록까지 모든 것을 처리합니다.

{% code-tabs-imported from="genesis/api_easy_mode" frameworks="umi" filename="createAndRegisterLaunch" /%}

**`CreateAndRegisterLaunchResult` 반환값:**

| 필드 | 타입 | 설명 |
|------|------|------|
| `signatures` | `Uint8Array[]` | 트랜잭션 서명 |
| `mintAddress` | `string` | 생성된 토큰 민트 주소 |
| `genesisAccount` | `string` | Genesis 계정 PDA 주소 |
| `launch.id` | `string` | 런칭 ID |
| `launch.link` | `string` | 런칭 페이지 URL |
| `token.id` | `string` | 토큰 ID |
| `token.mintAddress` | `string` | 토큰 민트 주소 |

### 중간 모드 — 커스텀 트랜잭션 전송

멀티시그 지갑이나 커스텀 재시도 로직과 같은 시나리오를 위해 `createAndRegisterLaunch`에 커스텀 `txSender` 콜백을 사용합니다.

{% code-tabs-imported from="genesis/api_custom_sender" frameworks="umi" filename="customTxSender" /%}

`txSender` 콜백은 미서명 트랜잭션 배열을 받아 서명 배열을 반환해야 합니다. SDK는 콜백이 완료된 후 등록을 처리합니다.

### 완전 제어 — `createLaunch` + `registerLaunch`

트랜잭션 라이프사이클을 완전히 제어할 수 있습니다. `createLaunch`를 호출하여 미서명 트랜잭션을 받고, 서명과 전송을 직접 처리한 다음, `registerLaunch`를 호출합니다.

{% code-tabs-imported from="genesis/api_full_control" frameworks="umi" filename="fullControl" /%}

**`createLaunch` 반환값 `CreateLaunchResponse`:**

| 필드 | 타입 | 설명 |
|------|------|------|
| `transactions` | `Transaction[]` | 서명하여 전송해야 할 미서명 Umi 트랜잭션 |
| `blockhash` | `BlockhashWithExpiryBlockHeight` | 트랜잭션 확인을 위한 블록해시 |
| `mintAddress` | `string` | 생성된 토큰 민트 주소 |
| `genesisAccount` | `string` | Genesis 계정 PDA 주소 |

**`registerLaunch` 반환값 `RegisterLaunchResponse`:**

| 필드 | 타입 | 설명 |
|------|------|------|
| `existing` | `boolean?` | 런칭이 이미 등록된 경우 `true` |
| `launch.id` | `string` | 런칭 ID |
| `launch.link` | `string` | 런칭 페이지 URL |
| `token.id` | `string` | 토큰 ID |
| `token.mintAddress` | `string` | 토큰 민트 주소 |

{% callout type="warning" %}
`registerLaunch`를 호출하기 전에 트랜잭션이 온체인에서 확인되어야 합니다. 등록 엔드포인트는 Genesis 계정이 존재하며 예상된 구성과 일치하는지 검증합니다.
{% /callout %}

---

## 구성

### CreateLaunchInput

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `wallet` | `PublicKey \| string` | 예 | 생성자의 지갑 (트랜잭션 서명) |
| `token` | `TokenMetadata` | 예 | 토큰 메타데이터 |
| `network` | `SvmNetwork` | 아니오 | `'solana-mainnet'` (기본값) 또는 `'solana-devnet'` |
| `quoteMint` | `QuoteMintInput` | 아니오 | `'SOL'` (기본값), `'USDC'`, 또는 민트 주소 직접 입력 |
| `launchType` | `LaunchType` | 예 | `'project'` |
| `launch` | `ProjectLaunchInput` | 예 | 런칭 구성 |

### TokenMetadata

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `name` | `string` | 예 | 토큰 이름, 1–32자 |
| `symbol` | `string` | 예 | 토큰 심볼, 1–10자 |
| `image` | `string` | 예 | 이미지 URL (유효한 HTTPS URL) |
| `description` | `string` | 아니오 | 최대 250자 |
| `externalLinks` | `ExternalLinks` | 아니오 | 웹사이트, Twitter, Telegram 링크 |

### ExternalLinks

| 필드 | 타입 | 설명 |
|------|------|------|
| `website` | `string?` | 웹사이트 URL |
| `twitter` | `string?` | Twitter/X 핸들 (`@mytoken`) 또는 전체 URL |
| `telegram` | `string?` | Telegram 핸들 또는 전체 URL |

### LaunchpoolConfig

| 필드 | 타입 | 설명 |
|------|------|------|
| `tokenAllocation` | `number` | 판매할 토큰 수량 (총 공급량 10억 중 일부) |
| `depositStartTime` | `Date \| string` | 예치 기간 시작 시점 (48시간 지속) |
| `raiseGoal` | `number` | 최소 모금 목표 견적 토큰, 정수 단위 (예: 200 SOL) |
| `raydiumLiquidityBps` | `number` | Raydium LP에 사용할 모금 자금 비율, 베이시스 포인트 (2000–10000) |
| `fundsRecipient` | `PublicKey \| string` | 잠금 해제된 모금 자금을 수령하는 지갑 |

### LockedAllocation (Streamflow 잠금)

`launch.lockedAllocations`를 통해 선택적으로 잠금 토큰 일정을 추가할 수 있습니다:

| 필드 | 타입 | 설명 |
|------|------|------|
| `name` | `string` | 스트림 이름, 최대 64자 (예: "Team", "Advisors") |
| `recipient` | `PublicKey \| string` | 잠금 수령 지갑 |
| `tokenAmount` | `number` | 잠금 일정의 총 토큰 수량 |
| `vestingStartTime` | `Date \| string` | 잠금 해제 일정 시작 시점 |
| `vestingDuration` | `{ value: number, unit: TimeUnit }` | 전체 잠금 기간 |
| `unlockSchedule` | `TimeUnit` | 토큰이 해제되는 빈도 |
| `cliff` | `object?` | `duration`과 `unlockAmount`가 포함된 선택적 클리프 |

{% callout type="warning" %}
`vestingStartTime`은 **예치 기간이 종료된 후** (즉, `depositStartTime` + 48시간 이후)여야 합니다. API는 예치 기간이 종료되기 전에 시작하는 잠금 일정을 거부합니다.
{% /callout %}

**TimeUnit 값:** `'SECOND'`, `'MINUTE'`, `'HOUR'`, `'DAY'`, `'WEEK'`, `'TWO_WEEKS'`, `'MONTH'`, `'QUARTER'`, `'YEAR'`

**잠금 할당이 포함된 예시:**

{% code-tabs-imported from="genesis/api_locked_allocations" frameworks="umi" filename="lockedAllocations" /%}

### SignAndSendOptions

`createAndRegisterLaunch`를 위한 옵션 (`RpcSendTransactionOptions` 확장):

| 필드 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `txSender` | `(txs: Transaction[]) => Promise<Uint8Array[]>` | — | 커스텀 트랜잭션 전송 콜백 |
| `commitment` | `string` | `'confirmed'` | 확인 커밋먼트 레벨 |
| `preflightCommitment` | `string` | `'confirmed'` | 프리플라이트 커밋먼트 레벨 |
| `skipPreflight` | `boolean` | `false` | 프리플라이트 검사 건너뛰기 |

---

## 오류 처리

SDK는 타입 가드 함수와 함께 세 가지 오류 타입을 제공합니다.

### GenesisApiError

API가 비성공 응답을 반환할 때 발생합니다.

```typescript
import { isGenesisApiError } from '@metaplex-foundation/genesis';

try {
  await createLaunch(umi, input);
} catch (err) {
  if (isGenesisApiError(err)) {
    console.error('API error:', err.statusCode, err.responseBody);
  }
}
```

| 속성 | 타입 | 설명 |
|------|------|------|
| `statusCode` | `number` | HTTP 상태 코드 |
| `responseBody` | `unknown` | API의 전체 응답 본문 |

### GenesisApiNetworkError

fetch 호출이 실패할 때 (네트워크 문제, DNS 실패 등) 발생합니다.

```typescript
import { isGenesisApiNetworkError } from '@metaplex-foundation/genesis';

if (isGenesisApiNetworkError(err)) {
  console.error('Network error:', err.cause.message);
}
```

| 속성 | 타입 | 설명 |
|------|------|------|
| `cause` | `Error` | 기본 fetch 오류 |

### GenesisValidationError

API 호출 전에 입력 유효성 검사가 실패할 때 발생합니다.

```typescript
import { isGenesisValidationError } from '@metaplex-foundation/genesis';

if (isGenesisValidationError(err)) {
  console.error(`Validation failed on field "${err.field}":`, err.message);
}
```

| 속성 | 타입 | 설명 |
|------|------|------|
| `field` | `string` | 유효성 검사에 실패한 입력 필드 |

### 종합 오류 처리

{% code-tabs-imported from="genesis/api_error_handling" frameworks="umi" filename="errorHandling" /%}

---

## 유효성 검사 규칙

SDK는 API로 전송하기 전에 입력을 검증합니다:

| 규칙 | 제약 조건 |
|------|-----------|
| 토큰 이름 | 1–32자 |
| 토큰 심볼 | 1–10자 |
| 토큰 이미지 | 유효한 HTTPS URL |
| 토큰 설명 | 최대 250자 |
| 토큰 할당 | 0보다 큼 |
| 모금 목표 | 0보다 큼 |
| Raydium 유동성 BPS | 2000–10000 (20%–100%) |
| 총 공급량 | 10억 토큰으로 고정 |
| 잠금 할당 이름 | 최대 64자 |

{% callout type="note" %}
총 공급량은 항상 10억 토큰입니다. SDK는 런치풀, Raydium LP, 잠금 할당을 뺀 나머지를 생성자 할당으로 자동 계산합니다.
{% /callout %}

---

## 헬퍼 함수

### signAndSendLaunchTransactions

기본 서명 및 전송 동작을 독립 함수로 사용하려는 경우 (재시도나 부분 흐름에 유용):

```typescript
import {
  createLaunch,
  signAndSendLaunchTransactions,
} from '@metaplex-foundation/genesis';

const createResult = await createLaunch(umi, input);
const signatures = await signAndSendLaunchTransactions(umi, createResult, {
  commitment: 'confirmed',
});
```

트랜잭션은 순차적으로 서명 및 전송됩니다 — 각 트랜잭션은 다음 트랜잭션이 전송되기 전에 확인됩니다.

### buildCreateLaunchPayload

입력을 검증하고 원시 API 페이로드를 빌드합니다. 고급 사용 사례를 위해 내보내기됩니다:

```typescript
import { buildCreateLaunchPayload } from '@metaplex-foundation/genesis';

const payload = buildCreateLaunchPayload(input);
// Use payload with your own HTTP client
```
