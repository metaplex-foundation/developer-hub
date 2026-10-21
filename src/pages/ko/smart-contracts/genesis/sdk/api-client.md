---
title: API 클라이언트
metaTitle: API 클라이언트 | Genesis SDK | Metaplex
description: Genesis API 클라이언트를 사용하여 Solana에서 토큰 런칭을 생성하고 등록하세요. 간단한 방식부터 완전한 제어까지 세 가지 통합 모드를 제공합니다.
created: '02-19-2026'
updated: '10-12-2026'
keywords:
  - Genesis API client
  - token launch SDK
  - createLaunch
  - registerLaunch
  - createAndRegisterLaunch
  - claimCreatorRewards
  - creator rewards
about:
  - SDK API client
  - Token launch creation
  - Launch registration
  - Creator rewards claiming
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

## 함수 개요 {% #function-overview %}

| 함수 | 목적 |
|----------|---------|
| [`createAndRegisterLaunch`](#easy-mode-create-and-register-launch) | 한 번의 호출로 토큰 런치 — 생성, 서명, 전송, 등록 |
| [`createLaunch`](#full-control-create-launch-register-launch) | 맞춤 서명 흐름을 위한 서명되지 않은 런치 트랜잭션 생성 |
| [`registerLaunch`](#full-control-create-launch-register-launch) | 생성 트랜잭션이 온체인에서 확인된 후 런치 등록 |
| [`claimCreatorRewards`](#claim-creator-rewards) | 지갑의 모든 버킷에서 누적된 창작자 보상 청구 |

## 세 가지 통합 모드

SDK는 완전 자동부터 완전 수동까지, 런칭 생성을 위한 세 가지 모드를 제공합니다.

### 간편 모드 — `createAndRegisterLaunch` {% #easy-mode-create-and-register-launch %}

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

### 완전 제어 — `createLaunch` + `registerLaunch` {% #full-control-create-launch-register-launch %}

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

## 창작자 보상 청구 {% #claim-creator-rewards %}

`claimCreatorRewards`는 `POST /v1/creator-rewards/claim`을 호출하고, 청구 가능한 모든 본딩 커브 및 Raydium 버킷에 대한 Base64 인코딩된 청구 트랜잭션을 Umi `Transaction`으로 역직렬화하여 반환합니다. 각 트랜잭션에 Umi identity로 서명하고 전송하세요. 창작자 수수료 구성, 누적 확인, 버킷별 하위 수준 명령을 포함한 전체 청구 흐름은 [Genesis 본딩 커브의 창작자 수수료](/ko/smart-contracts/genesis/creator-fees)를 참조하세요.

{% code-tabs-imported from="genesis/api_claim_creator_rewards" frameworks="umi" filename="claimCreatorRewards" /%}

### ClaimCreatorRewardsInput

| 필드 | 타입 | 필수 | 설명 |
|-------|------|----------|-------------|
| `wallet` | `PublicKey \| string` | 예 | 청구 대상 창작자 수수료 지갑. |
| `network` | `SvmNetwork` | 아니요 | `'solana-mainnet'`(기본값) 또는 `'solana-devnet'`. API 기본 URL(`https://api.metaplex.com`)과 일치해야 합니다 |
| `payer` | `PublicKey \| string` | 아니요 | 반환된 트랜잭션의 수수료와 렌트를 부담하는 지갑. 기본값은 `wallet`. 창작자 수수료 지갑에 SOL이 없는 경우(예: 에이전트 PDA)에 사용하세요. payer는 반환된 트랜잭션에 서명해야 하며, 청구된 SOL은 계속 창작자 수수료 지갑이 받습니다. |

### ClaimCreatorRewardsResponse

| 필드 | 타입 | 설명 |
|-------|------|-------------|
| `transactions` | `Transaction[]` | 역직렬화된 Umi 트랜잭션, 청구하는 버킷당 하나. payer identity로 각각 서명하고 전송하세요. |
| `blockhash` | `BlockhashWithExpiryBlockHeight` | 트랜잭션이 빌드된 블록해시. 확인에는 이것을 사용하세요. 새로 가져온 블록해시로 대체하지 마세요. |

{% callout type="warning" title="보상 없음은 빈 배열이 아니라 타입이 지정된 오류입니다" %}
지갑에 청구할 것이 없으면 API는 HTTP `400`과 `{"error":{"message":"No rewards available to claim"}}`을 반환하고 SDK는 `GenesisApiError`를 던집니다. 호출자는 오류를 잡아 `err.message`(또는 `err.statusCode === 400`)로 분기해야 하며, `result.transactions.length === 0`에 의존할 수 없습니다. [보상 없음 사례 처리](/ko/smart-contracts/genesis/creator-fees#handling-the-no-rewards-case)를 참조하세요.
{% /callout %}

{% code-tabs-imported from="genesis/api_claim_creator_rewards_errors" frameworks="umi" filename="errorHandling" /%}

---

## 구성

### CreateLaunchInput

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `wallet` | `PublicKey \| string` | 예 | 생성자의 지갑 (트랜잭션 서명) |
| `token` | `TokenMetadata` | 예 | 토큰 메타데이터 |
| `network` | `SvmNetwork` | 아니오 | `'solana-mainnet'` (기본값) 또는 `'solana-devnet'` |
| `quoteMint` | `QuoteMintInput` | 아니요 | `'SOL'`(기본값) 또는 `'USDC'` |
| `launchType` | `CreateLaunchType` | 예 | `'launchpool'` — 기본 런칭 메커니즘 |
| `launch` | `LaunchpoolLaunchInput` | 예 | 런칭 구성 |

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
| `raiseGoal` | `number` | 최소 모금 목표 견적 토큰, 정수 단위 (예: 250 SOL). 최소 250 SOL 또는 5,000 USDC |
| `raydiumLiquidityBps` | `number` | Raydium LP에 사용할 모금 자금 비율, 베이시스 포인트 (2000–10000) |
| `fundsRecipient` | `PublicKey \| string` | 잠금 해제된 모금 자금을 수령하는 지갑 |
| `softCap` | `number?` | 모금할 견적 토큰의 선택적 상한, 정수 단위. 이를 초과하는 예치금은 비례하여 환불됩니다. 0보다 커야 하며, 상한이 없으면 생략 |

### ClaimScheduleAllocation (베스팅 잠금)

`ClaimScheduleAllocation`은 토큰 공급량 일부에 대한 Genesis 네이티브 베스팅 잠금을 정의하며 `launch.claimScheduleAllocations`로 전달합니다. 각 할당은 온체인 `ClaimScheduleBucketV2`가 됩니다. 토큰은 선택적 클리프가 있는 선형 곡선을 따라 누적되며, SDK는 아래의 사람이 읽기 쉬운 일정을 온체인 초 단위 및 베이시스 포인트 값으로 변환합니다.

| 필드 | 타입 | 필수 | 설명 |
|-------|------|----------|-------------|
| `name` | `string` | 예 | 잠금 이름, 최대 64자 (예: "Team", "Advisors") |
| `recipient` | `PublicKey \| string` | 예 | 베스팅된 토큰을 청구할 수 있는 지갑 |
| `tokenAmount` | `number` | 예 | 베스팅 일정의 총 토큰 수량 |
| `vestingStartTime` | `Date \| string` | 예 | 선형 베스팅 곡선이 누적되기 시작하는 시점 |
| `vestingDuration` | `{ value: number, unit: TimeUnit }` | 예 | 선형 베스팅 기간의 길이 |
| `unlockSchedule` | `TimeUnit` | 예 | 토큰이 잠금 해제되는 빈도 |
| `cliff` | `{ duration, unlockAmount? }` | 아니요 | 선택적 클리프. `duration`은 `vestingStartTime`부터 측정하며, `unlockAmount`는 토큰 수량 또는 비례 몫을 뜻하는 `'linear'`(기본값) |
| `cancelable` | `boolean` | 아니요 | 런치 생성자가 잠금을 취소할 수 있습니다. 기본값 `false` |
| `cancelableByRecipient` | `boolean` | 아니요 | 수령인이 잠금을 취소할 수 있습니다. 기본값 `false` |
| `transferable` | `boolean` | 아니요 | 런치 생성자가 잠금을 이전할 수 있습니다. 기본값 `false` |
| `transferableByRecipient` | `boolean` | 아니요 | 수령인이 잠금을 이전할 수 있습니다. 기본값 `false` |
| `pausable` | `boolean` | 아니요 | Genesis 권한자가 베스팅을 일시 중지하고 재개할 수 있습니다. 기본값 `false` |

{% callout type="note" %}
런치 풀에서는 `vestingStartTime`이 더 이른 시점이고 토큰이 이미 누적되었더라도, 런치가 졸업(graduate)하기 전까지는 베스팅된 토큰을 **청구**할 수 없습니다. 확정된 클리프 몫은 0보다 커야 합니다.
{% /callout %}

{% callout type="warning" title="lockedAllocations는 더 이상 사용되지 않습니다" %}
`launch.lockedAllocations`(이전 Streamflow 잠금)는 더 이상 사용되지 않습니다(deprecated). SDK는 여전히 이를 허용하고 각 항목을 클레임 스케줄에 매핑하므로 기존 통합은 계속 컴파일됩니다. 새 통합에는 `claimScheduleAllocations`를 사용하세요. 마이그레이션할 때 `cancelableBySender`는 `cancelable`로, `transferableBySender`는 `transferable`로 이름을 바꾸세요.
{% /callout %}

**TimeUnit 값:** `'SECOND'`, `'MINUTE'`, `'HOUR'`, `'DAY'`, `'WEEK'`, `'TWO_WEEKS'`, `'MONTH'`, `'QUARTER'`, `'YEAR'`

**베스팅 잠금 예시:**

{% code-tabs-imported from="genesis/api_locked_allocations" frameworks="umi" filename="claimScheduleAllocations" /%}

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
  await createLaunch(umi, {}, input);
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

const createResult = await createLaunch(umi, {}, input);
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
