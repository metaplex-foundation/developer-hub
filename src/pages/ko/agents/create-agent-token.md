---
title: 에이전트 토큰 생성
metaTitle: Metaplex Genesis로 에이전트 토큰 생성하기 | Metaplex Agents
description: Genesis SDK를 사용하여 Metaplex 에이전트를 대신해 본딩 커브 토큰을 발행하는 방법. 크리에이터 수수료 자동 라우팅, 첫 번째 구매, devnet 테스트, 오류 처리를 포함합니다.
keywords:
  - agent token
  - token launch
  - Genesis
  - bonding curve
  - agent wallet
  - Solana agents
  - Metaplex
  - createAndRegisterLaunch
  - creator fee
  - first buy
about:
  - Agent Tokens
  - Genesis
  - Bonding Curve
  - Solana
programmingLanguage:
  - JavaScript
  - TypeScript
proficiencyLevel: Intermediate
created: '04-05-2026'
updated: '04-07-2026'
howToSteps:
  - Register your agent on Solana to get its Core asset address
  - Install the Genesis SDK and configure a Umi instance
  - Call createAndRegisterLaunch with the agent field and your token metadata
  - Read mintAddress and launch.link from the result
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
  - Metaplex API
faqs:
  - q: 에이전트 토큰이란 무엇인가요?
    a: 에이전트 토큰은 Metaplex Genesis 프로토콜을 사용하여 에이전트의 온체인 지갑에서 발행되는 토큰입니다. createAndRegisterLaunch에 agent 필드를 전달하면, SDK가 크리에이터 수수료를 에이전트의 Core asset 서명자 PDA로 자동 라우팅하고, 에이전트가 온체인에서 실행할 수 있도록 launch 트랜잭션을 Core execute 명령어로 래핑합니다.
  - q: 에이전트 토큰 발행 시 크리에이터 수수료는 어디로 가나요?
    a: 크리에이터 수수료는 에이전트의 Core asset 서명자 PDA(시드 ['mpl-core-execute', <agent_asset>]에서 파생)로 자동 라우팅됩니다. creatorFeeWallet을 수동으로 설정할 필요 없이 agent 필드를 전달하는 것만으로 충분합니다. launch.creatorFeeWallet을 명시적으로 설정하여 수수료 지갑을 재정의할 수 있습니다.
  - q: setToken은 되돌릴 수 있나요?
    a: 아닙니다. setToken을 true로 설정하면 발행된 토큰이 에이전트의 기본 토큰으로 영구적으로 연결됩니다. 트랜잭션이 확인된 후에는 되돌리거나 재할당할 수 없습니다. 이 토큰을 에이전트에 영구적으로 연결하려는 것이 확실한 경우에만 setToken을 true로 설정하세요.
  - q: devnet에서 에이전트 토큰 발행을 먼저 테스트할 수 있나요?
    a: 네. launch 입력에 network 'solana-devnet'을 전달하고 Umi 인스턴스를 devnet RPC로 연결하세요. API가 요청을 devnet 인프라로 라우팅합니다. 트랜잭션을 보내기 전에 에이전트 지갑에 devnet SOL을 충전하세요.
  - q: 에이전트 발행 시 첫 번째 구매와 크리에이터 수수료를 함께 사용할 수 있나요?
    a: 네. agent 필드와 함께 launch 객체에 firstBuyAmount를 설정하세요. 첫 번째 구매는 수수료가 없어 프로토콜 수수료나 크리에이터 수수료가 부과되지 않습니다. agent가 제공되면 첫 번째 구매자는 기본적으로 에이전트 PDA가 됩니다.
---

[Genesis](/smart-contracts/genesis) 프로토콜과 Metaplex API를 사용하여 에이전트의 온체인 지갑에서 토큰을 발행합니다. {% .lead %}

{% callout title="이 가이드에서 만드는 것" %}
이 가이드를 완료하면 다음을 수행할 수 있습니다.
- Metaplex 에이전트를 대신해 본딩 커브 토큰 발행
- 크리에이터 수수료를 에이전트의 온체인 지갑으로 자동 라우팅
- 선택적으로 에이전트를 위한 첫 번째 스왑을 수수료 없이 예약
{% /callout %}

## 요약

`agent` 필드를 사용한 `createAndRegisterLaunch`는 새 토큰을 생성하고, 크리에이터 수수료를 에이전트의 [Core](/core) asset PDA로 라우팅하며, 에이전트가 온체인에서 실행할 수 있도록 launch 트랜잭션을 Core execute 명령어로 래핑합니다.

- **단일 호출** — `createAndRegisterLaunch`가 생성, 서명, 전송, 등록을 순서대로 처리
- **자동 수수료 라우팅** — 크리에이터 수수료가 에이전트 PDA로 전송되며 지갑 주소를 수동으로 설정할 필요 없음
- **취소 불가능한 토큰 연결** — `setToken: true`는 토큰을 에이전트에 영구적으로 연결
- **적용 대상** `@metaplex-foundation/genesis` 1.x · 최종 확인: 2026년 4월

## 빠른 시작

**바로 이동:** [설치](#installation) · [Umi 설정](#umi-setup) · [발행](#launching-an-agent-token) · [첫 번째 구매](#first-buy) · [토큰 메타데이터](#token-metadata) · [Devnet](#devnet-testing) · [오류](#error-handling)

1. [Solana에서 에이전트를 등록](/agents/register-agent)하여 Core asset 주소 획득
2. Genesis SDK를 설치하고 키페어로 Umi 인스턴스 구성
3. `agent: { mint: agentAssetAddress, setToken: true }`를 사용하여 `createAndRegisterLaunch` 호출
4. 응답에서 `result.mintAddress`와 `result.launch.link` 읽기

## 사전 요구사항

- [등록된 Metaplex 에이전트](/agents/register-agent) — Core asset 주소가 필요
- **Node.js 18 이상** — 네이티브 `BigInt` 지원에 필요
- 트랜잭션 수수료 및 첫 번째 구매 금액을 위한 SOL이 충전된 Solana 지갑 키페어
- Solana RPC 엔드포인트(mainnet-beta 또는 devnet)
- [Irys](https://irys.xyz)에 미리 업로드된 토큰 이미지 — `image` 필드는 Irys 게이트웨이 URL이어야 함

## 설치 {#installation}

```bash {% title="Terminal" %}
npm install @metaplex-foundation/genesis \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults
```

## Umi 설정 {#umi-setup}

Genesis 함수를 호출하기 전에 키페어 ID로 Umi 인스턴스를 구성하세요.

```typescript {% title="setup.ts" showLineNumbers=true %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity } from '@metaplex-foundation/umi';

const umi = createUmi('https://api.mainnet-beta.solana.com');

// 키페어를 로드합니다 — 프로덕션에서는 원하는 키 관리 솔루션을 사용하세요.
const keypair = umi.eddsa.createKeypairFromSecretKey(mySecretKeyBytes);
umi.use(keypairIdentity(keypair));
```

{% callout type="note" %}
Genesis API 함수는 명령어를 직접 제출하는 대신 HTTP를 통해 호스팅된 Metaplex API와 통신합니다. Umi 인스턴스는 서명자 ID와 트랜잭션 전송 기능에만 사용되며 `genesis()` 플러그인은 필요하지 않습니다.
{% /callout %}

## 에이전트 토큰 발행 {#launching-an-agent-token}

`createAndRegisterLaunch`에 에이전트의 [Core](/core) asset 주소를 지정한 `agent` 필드를 전달하세요. SDK가 자동으로 다음을 수행합니다.

- 크리에이터 수수료 지갑을 에이전트의 Core asset 서명자 PDA(`['mpl-core-execute', <agent_asset>]`에서 파생)로 설정
- 에이전트가 온체인에서 실행할 수 있도록 launch 트랜잭션을 Core execute 명령어로 래핑

```typescript {% title="agent-launch.ts" showLineNumbers=true %}
import { createAndRegisterLaunch } from '@metaplex-foundation/genesis/api';

const result = await createAndRegisterLaunch(umi, {}, {
  wallet: umi.identity.publicKey,
  agent: {
    mint: agentAssetAddress,  // 등록된 에이전트의 Core asset 주소
    setToken: true,           // 이 토큰을 에이전트에 영구적으로 연결
  },
  launchType: 'bondingCurve',
  token: {
    name: 'Agent Token',
    symbol: 'AGT',
    image: 'https://gateway.irys.xyz/your-image-id',
  },
  launch: {},
});

console.log('토큰이 발행되었습니다!');
console.log('민트 주소:', result.mintAddress);
console.log('확인 링크:', result.launch.link);
```

{% callout type="warning" %}
`setToken: true`는 발행된 토큰을 에이전트의 기본 토큰으로 영구적으로 연결합니다. **이는 취소할 수 없습니다.** 트랜잭션이 확인된 후에는 되돌리거나 재할당할 수 없습니다. 에이전트에 연결할 올바른 토큰임이 확실한 경우에만 `setToken: true`를 설정하세요.
{% /callout %}

`launch: {}`가 비어 있으면, 공급 분할, 가상 리저브, 잠금 일정 등 모든 프로토콜 매개변수가 프로토콜 기본값으로 설정됩니다.

본딩 커브 가격 책정, 수수료, 졸업 방식에 대한 자세한 설명은 [본딩 커브 — 동작 이론](/smart-contracts/genesis/bonding-curve)을 참조하세요.

## 첫 번째 구매 {#first-buy}

첫 번째 구매는 지정된 SOL 금액으로 에이전트 PDA를 위해 커브의 초기 스왑을 예약하며, 모든 수수료가 면제됩니다.

`firstBuyAmount`를 수수료 없는 초기 구매의 SOL 금액으로 설정하세요. `agent`가 제공되면 첫 번째 구매자는 기본적으로 에이전트 PDA가 됩니다.

```typescript {% title="agent-launch-with-first-buy.ts" showLineNumbers=true %}
const result = await createAndRegisterLaunch(umi, {}, {
  wallet: umi.identity.publicKey,
  agent: {
    mint: agentAssetAddress,
    setToken: true,
  },
  launchType: 'bondingCurve',
  token: {
    name: 'Agent Token',
    symbol: 'AGT',
    image: 'https://gateway.irys.xyz/your-image-id',
  },
  launch: {
    firstBuyAmount: 0.1, // 0.1 SOL, 수수료 없음
  },
});
```

첫 번째 구매는 launch 트랜잭션 흐름의 일부로 실행됩니다. 트랜잭션이 확인되면 커브에는 이미 초기 구매가 적용되어 있습니다. `firstBuyAmount`를 생략하거나 `0`으로 설정하면 첫 번째 구매가 적용되지 않으며 어떤 지갑이든 첫 번째 스왑을 할 수 있습니다.

## 토큰 메타데이터 {#token-metadata}

모든 발행에는 다음 필드를 포함한 `token` 객체가 필요합니다.

| 필드 | 필수 | 제약 조건 |
|------|------|-----------|
| `name` | 예 | 1~32자 |
| `symbol` | 예 | 1~10자 |
| `image` | 예 | Irys URL(`https://gateway.irys.xyz/...`)이어야 함 |
| `description` | 아니오 | 최대 250자 |
| `externalLinks` | 아니오 | 선택적 `website`, `twitter`, `telegram` URL |

```typescript {% title="token-metadata.ts" %}
token: {
  name: 'Agent Token',
  symbol: 'AGT',
  image: 'https://gateway.irys.xyz/your-image-id',
  description: 'The official token of my agent',
  externalLinks: {
    website: 'https://myagent.com',
    twitter: '@myagent',
  },
},
```

`image` 필드는 Irys 게이트웨이 URL을 가리켜야 합니다. 먼저 [Irys](https://irys.xyz)에 이미지를 업로드하고 반환된 `https://gateway.irys.xyz/<id>` URL을 사용하세요. 다른 호스트는 API 유효성 검사에서 실패합니다.

## Devnet 테스트 {#devnet-testing}

`network: 'solana-devnet'`을 전달하고 Umi 인스턴스를 devnet RPC 엔드포인트로 연결하면 launch를 devnet 인프라를 통해 라우팅할 수 있습니다.

```typescript {% title="devnet-agent-launch.ts" showLineNumbers=true %}
const umi = createUmi('https://api.devnet.solana.com');
umi.use(keypairIdentity(keypair));

const result = await createAndRegisterLaunch(umi, {}, {
  wallet: umi.identity.publicKey,
  agent: {
    mint: agentAssetAddress,
    setToken: false, // devnet 테스트 시 실수로 잠기지 않도록 false 사용
  },
  launchType: 'bondingCurve',
  network: 'solana-devnet',
  token: {
    name: 'Test Token',
    symbol: 'TEST',
    image: 'https://gateway.irys.xyz/test-image',
  },
  launch: {},
});
```

## 오류 처리 {#error-handling}

SDK는 다양한 장애 유형에 대한 타입별 오류를 제공합니다.

| 오류 유형 | 가드 | 원인 |
|----------|------|------|
| 유효성 검사 오류 | `isGenesisValidationError` | 유효하지 않은 입력(예: Irys가 아닌 이미지 URL, 이름이 너무 김) |
| 네트워크 오류 | `isGenesisApiNetworkError` | `https://api.metaplex.com`에 연결할 수 없음 |
| API 오류 (4xx) | `isGenesisApiError` | API에서 요청 거부됨. `err.responseBody` 확인 |
| API 오류 (5xx) | `isGenesisApiError` | Metaplex API 이용 불가. 백오프 후 재시도 |

```typescript {% title="error-handling.ts" showLineNumbers=true %}
import {
  createAndRegisterLaunch,
  isGenesisApiError,
  isGenesisApiNetworkError,
  isGenesisValidationError,
} from '@metaplex-foundation/genesis/api';

try {
  const result = await createAndRegisterLaunch(umi, {}, input);
} catch (err) {
  if (isGenesisValidationError(err)) {
    console.error(`"${err.field}" 유효성 검사 오류: ${err.message}`);
  } else if (isGenesisApiNetworkError(err)) {
    console.error('네트워크 오류:', err.message);
  } else if (isGenesisApiError(err)) {
    console.error(`API 오류 (${err.statusCode}): ${err.message}`);
    console.error('세부 정보:', err.responseBody);
  } else {
    throw err;
  }
}
```

## 참고 사항

- `createAndRegisterLaunch`는 내부적으로 두 번의 API 호출을 합니다. create 트랜잭션은 확인되었지만 `registerLaunch`가 실패하면 토큰은 온체인에 존재하지만 metaplex.com에는 표시되지 않습니다. 이 경우를 처리하려면 `createLaunch` + `registerLaunch`를 [수동 서명 흐름](/smart-contracts/genesis/bonding-curve-launch#manual-signing-flow)으로 별도 사용하세요
- `launch.creatorFeeWallet`을 명시적으로 설정하면 크리에이터 수수료 지갑을 재정의할 수 있으며, 에이전트 PDA보다 우선합니다
- 첫 번째 구매는 launch 생성 시 구성되며 커브가 라이브 상태가 된 후에는 추가할 수 없습니다
- 크리에이터 수수료는 스왑마다 전송되는 것이 아니라 버킷에 누적됩니다. 권한 없이도 사용할 수 있는 `claimBondingCurveCreatorFeeV2`(본딩 커브) 및 `claimRaydiumCreatorFeeV2`(졸업 후 Raydium) 명령어로 청구하세요 — [스왑 통합 가이드](/smart-contracts/genesis/bonding-curve-swaps#claiming-creator-fees) 참조
- Metaplex API는 트랜잭션을 구성하여 미서명 상태로 반환합니다. 서명 키는 항상 호출자가 보유합니다

## 자주 묻는 질문

### 에이전트 토큰이란 무엇인가요?

에이전트 토큰은 [Genesis](/smart-contracts/genesis) 프로토콜을 사용하여 에이전트의 온체인 지갑에서 발행되는 토큰입니다. `createAndRegisterLaunch`에 `agent` 필드를 전달하면 크리에이터 수수료가 에이전트의 [Core](/core) asset 서명자 PDA로 자동 라우팅되고, 에이전트가 온체인에서 실행할 수 있도록 launch 트랜잭션이 Core execute 명령어로 래핑됩니다.

### 에이전트 토큰 발행 시 크리에이터 수수료는 어디로 가나요?

크리에이터 수수료는 에이전트의 Core asset 서명자 PDA(시드 `['mpl-core-execute', <agent_asset>]`에서 파생)로 자동 라우팅됩니다. `creatorFeeWallet`을 수동으로 설정할 필요 없이 `agent` 필드를 전달하는 것만으로 충분합니다. `launch.creatorFeeWallet`을 명시적으로 설정하면 수수료 지갑을 재정의할 수 있습니다.

### `setToken`은 되돌릴 수 있나요?

아닙니다. `setToken: true`를 설정하면 발행된 토큰이 에이전트의 기본 토큰으로 영구적으로 연결됩니다. 트랜잭션이 확인된 후에는 되돌리거나 재할당할 수 없습니다. 확실하지 않은 경우 `setToken: false`를 설정하고 토큰 연결을 별도로 처리하세요.

### devnet에서 에이전트 토큰 발행을 먼저 테스트할 수 있나요?

네. launch 입력에 `network: 'solana-devnet'`을 전달하고 Umi 인스턴스를 `https://api.devnet.solana.com`으로 연결하세요. 트랜잭션을 보내기 전에 에이전트 지갑에 devnet SOL을 충전하세요.

### 에이전트 발행 시 첫 번째 구매와 크리에이터 수수료를 함께 사용할 수 있나요?

네. `agent` 필드와 함께 `launch` 객체에 `firstBuyAmount`를 설정하세요. 첫 번째 구매는 수수료가 없어 그 구매에는 프로토콜 수수료나 크리에이터 수수료가 부과되지 않습니다. 크리에이터 수수료는 커브의 이후 모든 스왑에 정상적으로 적용됩니다.
