---
title: Metaplex API를 통한 본딩 커브 런칭
metaTitle: Metaplex API를 통한 본딩 커브 토큰 런칭 | Genesis
description: Genesis SDK와 Metaplex API를 사용하여 본딩 커브 토큰 런칭을 생성, 서명, 전송 및 등록하는 방법 — 창작자 수수료, 첫 번째 구매, 에이전트 런칭, 오류 처리 포함.
keywords:
  - bonding curve
  - bonding curve v2
  - genesis
  - token launch
  - createAndRegisterLaunch
  - createLaunch
  - registerLaunch
  - Metaplex API
  - creator fee
  - first buy
  - agent launch
  - Solana
  - Raydium CPMM
about:
  - Bonding Curve
  - Token Launch
  - Genesis
  - Solana
programmingLanguage:
  - JavaScript
  - TypeScript
  - Bash
cli: /dev-tools/cli/genesis/launch
proficiencyLevel: Intermediate
created: '04-07-2026'
updated: '04-09-2026'
howToSteps:
  - Install the Genesis SDK and configure a Umi instance
  - Call createLaunch with token metadata and launch options
  - Sign and submit the returned transactions with signAndSendLaunchTransactions
  - Register the confirmed launch with registerLaunch so it appears on metaplex.com
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
  - Metaplex API
faqs:
  - q: createAndRegisterLaunch과 createLaunch를 따로 호출한 후 registerLaunch를 호출하는 것의 차이점은 무엇인가요?
    a: createAndRegisterLaunch는 createLaunch를 호출하고, 트랜잭션에 서명 및 전송하고, registerLaunch를 순서대로 호출하는 편의 래퍼입니다. 기본 Umi 서명자 및 발신자가 충분할 때 사용하세요. 커스텀 서명 로직, Jito 번들, 우선 수수료, 또는 생성과 등록 단계 사이의 재시도 처리가 필요할 때는 createLaunch + registerLaunch를 별도로 사용하세요.
  - q: 메인넷으로 가기 전에 devnet에서 본딩 커브 런칭을 테스트할 수 있나요?
    a: 네. 런칭 입력에서 network "solana-devnet"을 전달하고 Umi 인스턴스가 devnet RPC 엔드포인트를 가리키도록 설정하세요. API는 요청을 devnet 인프라로 라우팅합니다. 트랜잭션을 전송하기 전에 지갑에 devnet SOL이 충분한지 확인하세요.
  - q: 에이전트에 setToken을 true로 설정한 후 토큰을 변경하고 싶다면 어떻게 하나요?
    a: setToken을 true로 설정하면 런칭된 토큰이 에이전트의 기본 토큰으로 영구적으로 연결됩니다. 이 작업은 되돌릴 수 없으며 취소하거나 재할당할 수 없습니다. 이 토큰이 에이전트의 올바른 토큰임을 확실할 때만 setToken을 true로 설정하세요.
  - q: 창작자 수수료 지갑을 첫 번째 구매와 결합할 수 있나요?
    a: 네. 런칭 객체에서 creatorFeeWallet와 firstBuyAmount를 모두 설정하세요. 첫 번째 구매 자체는 수수료가 없습니다 — 초기 구매에는 프로토콜 수수료나 창작자 수수료가 부과되지 않습니다. 이후의 모든 스왑에는 구성된 지갑에 창작자 수수료가 부과됩니다.
  - q: 토큰 메타데이터에 어떤 이미지 형식과 호스팅이 필요한가요?
    a: 이미지 필드는 https://gateway.irys.xyz/<id> 형식의 Irys URL이어야 합니다. 먼저 이미지를 Irys에 업로드하고 반환된 게이트웨이 URL을 사용하세요. 다른 호스트나 Irys가 아닌 URL은 API 검증에 실패합니다.
  - q: registerLaunch는 왜 트랜잭션이 온체인에서 확인된 후에 호출해야 하나요?
    a: registerLaunch는 런칭을 Metaplex 데이터베이스에 기록하므로 metaplex.com에 표시됩니다. 생성 트랜잭션이 확인되기 전에 호출하면 계정이 아직 확인될 수 없어 API 오류가 반환됩니다.
---

Genesis SDK와 Metaplex API를 사용하여 Solana에서 [본딩 커브](/smart-contracts/genesis/bonding-curve) 토큰 런칭을 생성, 서명, 전송 및 등록합니다. {% .lead %}

{% callout title="빌드할 내용" %}
이 가이드는 다음을 다룹니다:
- `createAndRegisterLaunch`를 사용한 단일 호출로 본딩 커브 토큰 런칭
- 창작자 수수료 추가 — 특정 지갑 또는 에이전트 PDA에 자동으로
- 런칭 시 수수료 없는 첫 번째 구매 구성
- `createLaunch` + `registerLaunch`로 수동으로 서명 및 등록
- devnet 테스트 및 커스텀 API 기본 URL 또는 트랜잭션 발신자 사용
- 유형화된 SDK 오류 처리
{% /callout %}

## 요약

`createAndRegisterLaunch` (또는 하위 수준의 동등물)는 `POST /v1/launches/create`를 호출하고, 서명되지 않은 Solana 트랜잭션을 반환하고, 이에 서명하여 전송한 후 토큰이 [metaplex.com](https://www.metaplex.com)에 표시되도록 런칭을 등록합니다.

- **단일 호출 경로** — `createAndRegisterLaunch`가 단일 awaited 호출에서 전체 흐름을 처리합니다
- **수동 경로** — 커스텀 서명, 번들, 또는 재시도 로직에는 `createLaunch` + `signAndSendLaunchTransactions` + `registerLaunch`
- **창작자 수수료** — 본딩 커브와 졸업 후 Raydium 풀에서 스왑당 선택적 수수료; 지갑별 구성 또는 [에이전트 런칭](/agents/create-agent-token)을 위해 자동으로 파생
- **첫 번째 구매** — 커브 생성 시 런칭 지갑 또는 에이전트 PDA를 위해 예약된 선택적 수수료 없는 초기 구매

## 빠른 시작

**바로 가기:** [설치](#설치) · [설정](#umi-설정) · [단일 호출 런칭](#본딩-커브-런칭-단일-호출-흐름) · [창작자 수수료](/smart-contracts/genesis/creator-fees) · [첫 번째 구매](#첫-번째-구매) · [수동 서명](#수동-서명-흐름) · [토큰 메타데이터](#토큰-메타데이터) · [Devnet](#devnet-테스트) · [고급](#고급) · [오류](#일반적인-오류) · [API 참조](#api-참조)

1. Genesis SDK를 설치하고 키페어 ID로 Umi 인스턴스를 구성합니다
2. `token` 메타데이터와 `launch: {}` 객체로 `createAndRegisterLaunch`를 호출합니다
3. 응답에서 `result.mintAddress`와 `result.launch.link`를 읽습니다

커스텀 서명 또는 재시도 로직에는 [수동 서명 흐름](#수동-서명-흐름)을 사용하세요.

## 사전 요구 사항

- **Node.js 18+** — 네이티브 `BigInt` 지원에 필요합니다
- 트랜잭션 수수료 및 선택적 첫 번째 구매 금액을 위해 SOL이 충전된 Solana 지갑 키페어
- Solana RPC 엔드포인트 (mainnet-beta 또는 devnet)
- [Irys](https://irys.xyz)에 미리 업로드된 이미지 — 토큰 메타데이터 `image` 필드는 Irys 게이트웨이 URL이어야 합니다

## 설치

세 가지 필수 패키지를 설치합니다.

```bash {% title="Terminal" %}
npm install @metaplex-foundation/genesis \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults
```

## Umi 설정

Genesis API 함수를 호출하기 전에 키페어 ID로 Umi 인스턴스를 구성합니다.

```typescript {% title="setup.ts" showLineNumbers=true %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity } from '@metaplex-foundation/umi';

const umi = createUmi('https://api.mainnet-beta.solana.com');

// 키페어를 로드합니다 — 프로덕션에서는 원하는 키 관리 솔루션을 사용하세요.
const keypair = umi.eddsa.createKeypairFromSecretKey(mySecretKeyBytes);
umi.use(keypairIdentity(keypair));
```

{% callout type="note" %}
Genesis API 함수는 `genesis()` 플러그인이 필요하지 않습니다 — 명령어를 직접 제출하는 대신 HTTP를 통해 호스팅된 Metaplex API와 통신합니다. Umi 인스턴스는 서명자 ID와 트랜잭션 전송 기능에만 사용됩니다.
{% /callout %}

## 본딩 커브 런칭 (단일 호출 흐름)

`createAndRegisterLaunch`가 가장 간단한 방법입니다 — 단일 awaited 호출에서 런칭을 생성하고, 모든 트랜잭션에 서명하여 전송하고, metaplex.com에 토큰을 등록합니다.

{% code-tabs-imported from="genesis/api_bonding_curve_launch" frameworks="umi,cli" defaultFramework="umi" /%}

`launch: {}`가 비어 있을 때 모든 프로토콜 매개변수 — 공급 분할, 가상 리저브, 자금 흐름, 잠금 일정 — 는 프로토콜 기본값으로 설정됩니다. 아래 섹션에서는 창작자 수수료와 첫 번째 구매를 추가하는 방법을 보여줍니다.

## 창작자 수수료

선택적 스왑당 수수료가 매수와 매도에서 구성된 지갑에 누적됩니다. `launch` 객체에서 `creatorFeeWallet`을 설정하여 특정 주소로 수수료를 지정하고, 기본적으로는 런칭 지갑이 사용됩니다.

```typescript {% title="launch-with-creator-fee.ts" %}
launch: {
  creatorFeeWallet: 'FeeRecipientWalletAddress...',
},
```

전체 구성 옵션, 누적 잔액 확인 방법, 청구 명령어(`claimBondingCurveCreatorFeeV2` / `claimRaydiumCreatorFeeV2`)는 [창작자 수수료](/smart-contracts/genesis/creator-fees)를 참조하세요.

## 첫 번째 구매

첫 번째 구매는 커브의 초기 스왑을 지정된 SOL 금액으로 런칭 지갑에 예약하며 모든 수수료가 면제됩니다.

`firstBuyAmount`를 수수료 없는 초기 구매의 SOL 금액으로 설정합니다.

{% code-tabs-imported from="genesis/api_bonding_curve_first_buy" frameworks="umi,cli" defaultFramework="umi" /%}

API는 런칭 트랜잭션 흐름의 일부로 첫 번째 구매를 실행합니다 — 트랜잭션이 확인되면 커브에는 이미 초기 구매가 적용되어 있습니다. 구매자는 기본적으로 런칭 `wallet`이거나, `agent`가 제공될 때는 에이전트 PDA입니다. 다른 구매자를 지정하려면 `firstBuyWallet`(`Signer`)으로 재정의하세요.

`firstBuyAmount`가 생략되거나 `0`이면 첫 번째 구매 제한이 적용되지 않고 모든 지갑이 첫 번째 스왑을 할 수 있습니다.

창작자 수수료 지갑과 첫 번째 구매를 결합할 수 있습니다:

```typescript {% title="launch-combined.ts" %}
launch: {
  creatorFeeWallet: 'FeeRecipientWalletAddress...',
  firstBuyAmount: 0.5,
},
```

## 수동 서명 흐름

`createLaunch`와 `registerLaunch`를 별도로 사용하여 트랜잭션이 서명되고 제출되는 방식을 제어할 수 있습니다 — 예를 들어 Jito 번들, 우선 수수료, 또는 커스텀 재시도 로직을 사용할 때.

```typescript {% title="manual-launch.ts" showLineNumbers=true %}
import {
  createLaunch,
  registerLaunch,
  signAndSendLaunchTransactions,
} from '@metaplex-foundation/genesis/api';

// 1단계: API를 호출하여 서명되지 않은 트랜잭션을 가져옵니다.
const createResult = await createLaunch(umi, {}, {
  wallet: umi.identity.publicKey,
  launchType: 'bondingCurve',
  token: {
    name: 'My Token',
    symbol: 'MTK',
    image: 'https://gateway.irys.xyz/your-image-id',
  },
  launch: {
    creatorFeeWallet: 'FeeRecipientWalletAddress...',
  },
});

console.log('Mint address:', createResult.mintAddress);
console.log('Transactions to sign:', createResult.transactions.length);

// 2단계: 트랜잭션에 서명하고 전송합니다.
const signatures = await signAndSendLaunchTransactions(umi, createResult);

// 3단계: 모든 트랜잭션이 온체인에서 확인된 후 런칭을 등록합니다.
const registered = await registerLaunch(umi, {}, {
  genesisAccount: createResult.genesisAccount,
  createLaunchInput: {
    wallet: umi.identity.publicKey,
    launchType: 'bondingCurve',
    token: {
      name: 'My Token',
      symbol: 'MTK',
      image: 'https://gateway.irys.xyz/your-image-id',
    },
    launch: {
      creatorFeeWallet: 'FeeRecipientWalletAddress...',
    },
  },
});

console.log('Launch live at:', registered.launch.link);
```

{% callout type="note" %}
생성 트랜잭션이 온체인에서 확인된 후에만 `registerLaunch`를 호출하세요. API는 등록하기 전에 genesis 계정이 존재하는지 확인합니다 — 너무 일찍 호출하면 API 오류가 반환됩니다.
{% /callout %}

## 토큰 메타데이터

모든 런칭에는 다음 필드가 포함된 `token` 객체가 필요합니다.

| 필드 | 필수 여부 | 제약 조건 |
|------|-----------|-----------|
| `name` | 예 | 1–32자 |
| `symbol` | 예 | 1–10자 |
| `image` | 예 | Irys URL이어야 함 (`https://gateway.irys.xyz/...`) |
| `description` | 아니요 | 최대 250자 |
| `externalLinks` | 아니요 | 선택적 `website`, `twitter`, `telegram` 값 |

```typescript {% title="token-metadata.ts" %}
token: {
  name: 'My Token',
  symbol: 'MTK',
  image: 'https://gateway.irys.xyz/your-image-id',
  description: 'A token launched on the bonding curve',
  externalLinks: {
    website: 'https://mytoken.com',
    twitter: '@mytoken',
    telegram: '@mytoken',
  },
},
```

## Devnet 테스트

`network: 'solana-devnet'`을 전달하고 Umi 인스턴스가 devnet RPC 엔드포인트를 가리키도록 설정하면 devnet 인프라를 통해 런칭을 라우팅합니다. CLI의 경우 구성된 RPC 엔드포인트에 의해 네트워크가 결정됩니다.

{% code-tabs-imported from="genesis/api_bonding_curve_devnet" frameworks="umi,cli" defaultFramework="umi" /%}

## 고급

### 커스텀 API 기본 URL

SDK는 기본적으로 `https://api.metaplex.com`을 사용합니다. 구성 객체(두 번째 인수)에서 `baseUrl`을 전달하여 스테이징 API와 같은 다른 환경을 대상으로 할 수 있습니다.

```typescript {% title="custom-base-url.ts" showLineNumbers=true %}
const API_CONFIG = { baseUrl: 'https://your-api-base-url.example.com' };

const result = await createAndRegisterLaunch(umi, API_CONFIG, {
  wallet: umi.identity.publicKey,
  launchType: 'bondingCurve',
  token: {
    name: 'My Token',
    symbol: 'MTK',
    image: 'https://gateway.irys.xyz/your-image-id',
  },
  launch: {},
});
```

동일한 `API_CONFIG` 객체는 수동 서명 흐름에서 `createLaunch`와 `registerLaunch`에서도 허용됩니다.

### 커스텀 트랜잭션 발신자

옵션(네 번째 인수)에서 `txSender` 콜백을 전달하여 자체 서명 및 제출 인프라를 사용할 수 있습니다.

```typescript {% title="custom-sender.ts" showLineNumbers=true %}
const result = await createAndRegisterLaunch(
  umi,
  {},
  {
    wallet: umi.identity.publicKey,
    launchType: 'bondingCurve',
    token: {
      name: 'My Token',
      symbol: 'MTK',
      image: 'https://gateway.irys.xyz/your-image-id',
    },
    launch: {},
  },
  {
    txSender: async (txs) => {
      const signatures = [];
      for (const tx of txs) {
        const signed = await umi.identity.signTransaction(tx);
        signatures.push(await myCustomSend(signed));
      }
      return signatures;
    },
  }
);
```

## 일반적인 오류

| 오류 | 유형 확인 | 원인 | 해결 방법 |
|------|-----------|------|-----------|
| `Validation error on "token.image"` | `isGenesisValidationError` | 이미지 URL이 Irys 게이트웨이 URL이 아님 | 이미지를 Irys에 업로드하고 `https://gateway.irys.xyz/...` URL을 사용하세요 |
| `Validation error on "token.name"` | `isGenesisValidationError` | 이름이 32자를 초과하거나 비어 있음 | 토큰 이름을 1–32자로 줄이세요 |
| `Network error` | `isGenesisApiNetworkError` | `https://api.metaplex.com`에 연결할 수 없음 | 연결을 확인하거나 접근 가능한 엔드포인트를 가리키는 `baseUrl`을 제공하세요 |
| `API error (4xx)` | `isGenesisApiError` | 잘못된 입력이 API에 의해 거부됨 | 필드 수준 오류 세부 정보를 위해 `err.responseBody`를 읽으세요 |
| `API error (5xx)` | `isGenesisApiError` | Metaplex API를 사용할 수 없음 | 지수적 백오프로 재시도하세요; 이미 확인된 트랜잭션은 다시 전송하지 마세요 |
| `registerLaunch` API error | `isGenesisApiError` | 생성 트랜잭션이 확인되기 전에 등록됨 | 모든 서명이 온체인에서 확인된 후에 `registerLaunch`를 호출하세요 |

유형화된 오류 가드를 사용하여 이러한 케이스를 구분하세요:

```typescript {% title="error-handling.ts" showLineNumbers=true %}
import {
  createLaunch,
  isGenesisApiError,
  isGenesisApiNetworkError,
  isGenesisValidationError,
} from '@metaplex-foundation/genesis/api';

try {
  const result = await createLaunch(umi, {}, input);
} catch (err) {
  if (isGenesisValidationError(err)) {
    console.error(`Validation error on "${err.field}": ${err.message}`);
  } else if (isGenesisApiNetworkError(err)) {
    console.error('Network error:', err.message);
  } else if (isGenesisApiError(err)) {
    console.error(`API error (${err.statusCode}): ${err.message}`);
    console.error('Details:', err.responseBody);
  } else {
    throw err;
  }
}
```

## 참고 사항

- `createAndRegisterLaunch`는 호출자의 관점에서는 원자적이지만 내부적으로 두 개의 API 호출을 수행합니다 — 생성 트랜잭션이 확인된 후 `registerLaunch` 전에 실패하면 토큰은 온체인에 존재하지만 아직 metaplex.com에 표시되지 않습니다; 등록을 완료하려면 `registerLaunch`를 수동으로 호출하세요
- Metaplex API 엔드포인트(`https://api.metaplex.com`)는 호스팅 인프라입니다 — 서명되지 않은 트랜잭션을 구성하고 반환합니다; 호출자는 항상 서명을 보유하고 제어합니다
- `launch: {}`가 비어 있을 때 가상 리저브, 공급 분할, 잠금 일정은 프로토콜 기본값으로 설정됩니다; 런칭별로 재정의하는 API는 없습니다
- `agent.setToken` 플래그는 되돌릴 수 없습니다 — 토큰이 에이전트의 기본 토큰으로 설정되면 변경하거나 재할당할 수 없습니다; 전체 에이전트 런칭 흐름은 [에이전트 토큰 생성](/agents/create-agent-token)을 참조하세요
- 커브가 라이브되면 [본딩 커브 스왑 통합](/smart-contracts/genesis/bonding-curve-swaps) 가이드를 사용하여 스왑을 통합하세요
- 첫 번째 구매는 런칭 생성 시 구성되며 커브가 라이브된 후에는 추가할 수 없습니다; `firstBuyAmount: 0`이거나 필드를 생략하면 완전히 비활성화됩니다
- 창작자 수수료는 버킷에 누적되며 스왑당 전송되지 않습니다; 권한 없는 `claimBondingCurveCreatorFeeV2` (본딩 커브) 및 `claimRaydiumCreatorFeeV2` (졸업 후 Raydium) 명령어를 통해 청구하세요

## API 참조

### `createAndRegisterLaunch(umi, config, input, options?)`

전체 런칭 흐름을 조율하는 편의 함수: 생성, 서명, 전송, 등록.

| 매개변수 | 유형 | 설명 |
|----------|------|------|
| `umi` | `Umi` | ID 및 RPC가 구성된 Umi 인스턴스 |
| `config` | `GenesisApiConfig \| null` | 선택적 API 구성 (`baseUrl`, 커스텀 `fetch`) |
| `input` | `CreateBondingCurveLaunchInput` | 런칭 구성 |
| `options` | `SignAndSendOptions` | 선택적 `txSender` 재정의 |
| `registerOptions` | `RegisterOptions` | `registerLaunch`에 전달되는 선택적 필드 (예: `creatorWallet`, `twitterVerificationToken`) |

반환 `Promise<CreateAndRegisterLaunchResult>`:

| 필드 | 설명 |
|------|------|
| `signatures` | 트랜잭션 서명 |
| `mintAddress` | 생성된 토큰 민트 주소 |
| `genesisAccount` | Genesis 계정 PDA |
| `launch.link` | metaplex.com에서 토큰을 보는 URL |

### `createLaunch(umi, config, input)`

`POST /v1/launches/create`를 호출하고 역직렬화된 트랜잭션을 반환합니다.

반환 `Promise<CreateLaunchResponse>`:

| 필드 | 설명 |
|------|------|
| `transactions` | 서명하고 전송할 Umi `Transaction` 객체 배열 |
| `blockhash` | 트랜잭션 유효성을 위한 Blockhash |
| `mintAddress` | 생성된 토큰 민트 주소 |
| `genesisAccount` | Genesis 계정 PDA |

### `registerLaunch(umi, config, input)`

metaplex.com에 확인된 genesis 계정을 등록합니다. 모든 생성 트랜잭션이 온체인에서 확인된 후에 호출하세요.

반환 `Promise<RegisterLaunchResponse>`:

| 필드 | 설명 |
|------|------|
| `launch.id` | 런칭 식별자 |
| `launch.link` | 토큰을 보는 URL |
| `token.mintAddress` | 확인된 민트 주소 |

### 유형

```typescript {% title="types.ts" %}
interface CreateBondingCurveLaunchInput {
  wallet: PublicKey | string;
  launchType: 'bondingCurve';
  token: TokenMetadata;
  network?: 'solana-mainnet' | 'solana-devnet';
  quoteMint?: 'SOL';
  agent?: {
    mint: PublicKey | string;   // Core 에셋 (NFT) 주소
    setToken: boolean;          // 런칭된 토큰을 에이전트의 기본 토큰으로 설정
  };
  launch: BondingCurveLaunchInput;
}

interface BondingCurveLaunchInput {
  creatorFeeWallet?: PublicKey | string;
  firstBuyAmount?: number;   // SOL 금액 (예: 0.1 = 0.1 SOL)
  firstBuyWallet?: Signer;
}

interface TokenMetadata {
  name: string;           // 최대 32자
  symbol: string;         // 최대 10자
  image: string;          // Irys URL이어야 함: https://gateway.irys.xyz/...
  description?: string;   // 최대 250자
  externalLinks?: {
    website?: string;
    twitter?: string;
    telegram?: string;
  };
}

interface GenesisApiConfig {
  baseUrl?: string;
  fetch?: typeof fetch;
}
```

## FAQ

### `createAndRegisterLaunch`와 `createLaunch` 후 `registerLaunch`를 따로 호출하는 것의 차이점은 무엇인가요?

`createAndRegisterLaunch`는 단일 호출에서 전체 흐름을 처리하는 편의 래퍼입니다. 커스텀 서명 로직(예: Jito 번들, 우선 수수료)이 필요하거나 제출 전에 서명되지 않은 트랜잭션을 검사하거나 수정하려면 하위 수준 함수를 별도로 사용하세요. [수동 서명 흐름](#수동-서명-흐름)을 참조하세요.

### 메인넷으로 가기 전에 devnet에서 본딩 커브 런칭을 테스트할 수 있나요?

네. 입력에서 `network: 'solana-devnet'`을 전달하고 Umi 인스턴스가 `https://api.devnet.solana.com`을 가리키도록 설정하세요. API는 요청을 devnet 인프라로 라우팅합니다. 트랜잭션을 전송하기 전에 지갑에 devnet SOL이 충분한지 확인하세요. [Devnet 테스트](#devnet-테스트)를 참조하세요.

### `agent.setToken: true`를 실수로 설정하면 어떻게 되나요?

`setToken: true`를 설정하면 런칭된 토큰이 에이전트의 기본 토큰으로 영구적으로 연결됩니다 — 이는 되돌릴 수 없으며 취소하거나 재할당할 수 없습니다. 확실하지 않으면 `agent` 필드를 생략하거나 `setToken: false`로 설정하고 토큰 연결을 별도로 처리하세요.

### 창작자 수수료 지갑을 첫 번째 구매와 결합할 수 있나요?

네. `launch` 객체에서 `creatorFeeWallet`와 `firstBuyAmount`를 모두 설정하세요. 첫 번째 구매 자체는 수수료가 없습니다 — 초기 구매에는 프로토콜 수수료나 창작자 수수료가 부과되지 않습니다. 창작자 수수료는 이후 모든 스왑에 정상적으로 적용됩니다. [첫 번째 구매](#첫-번째-구매)를 참조하세요.

### 토큰 메타데이터에 어떤 이미지 형식과 호스팅이 필요한가요?

`image` 필드는 Irys URL이어야 합니다 — `https://gateway.irys.xyz/<id>`. 먼저 이미지를 Irys에 업로드하고 반환된 게이트웨이 URL을 사용하세요. 다른 호스트는 API 검증에 실패합니다. SDK는 이를 `token.image` 필드의 `isGenesisValidationError`로 표면화합니다.

### `registerLaunch`를 트랜잭션이 온체인에서 확인된 후에 호출해야 하는 이유는 무엇인가요?

`registerLaunch`는 런칭 레코드를 Metaplex의 데이터베이스에 기록하고 등록하기 전에 genesis 계정이 온체인에 존재하는지 확인합니다. 생성 트랜잭션이 확인되기 전에 호출하면 계정이 아직 표시되지 않아 API 오류가 반환됩니다. `createAndRegisterLaunch`에서는 이 순서가 자동으로 처리됩니다.
