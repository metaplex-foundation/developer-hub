---
title: 에이전트 생성
metaTitle: Solana에서 에이전트 생성 | Metaplex Agent Registry
description: Solana에서 에이전트를 생성하고 등록합니다 — Metaplex Agent API를 사용한 단일 호출 플로우 또는 기존 MPL Core 자산을 수동으로 등록합니다.
keywords:
  - create agent
  - mint agent
  - register agent
  - Agent API
  - agent identity
  - MPL Core
  - AgentIdentity plugin
  - ERC-8004
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Agent Creation
  - Agent Registration
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '03-30-2026'
updated: '03-30-2026'
---

Solana에서 에이전트를 생성하고 등록합니다 — Metaplex Agent API를 사용한 단일 호출 플로우 또는 기존 [MPL Core](/smart-contracts/core) 자산에 `registerIdentityV1`을 사용하여 수동으로 등록합니다. {% .lead %}

## 요약

에이전트를 생성한다는 것은 MPL Core 자산을 민팅하고 온체인 신원 레코드를 바인딩하는 것을 의미합니다. Metaplex Agent API는 단일 트랜잭션으로 두 작업을 모두 수행합니다. 이미 Core 자산이 있는 경우 온체인 인스트럭션으로 직접 신원을 등록할 수 있습니다.

- **API 경로 (권장)** — `mintAndSubmitAgent`가 자산 생성과 신원 등록을 한 번의 호출로 수행
- **수동 경로** — `registerIdentityV1`이 기존 Core 자산에 신원을 바인딩
- **신원 레코드** — 자산의 공개 키에서 파생된 PDA로, `AgentIdentity` 플러그인과 라이프사이클 훅 포함
- **등록 문서** — 에이전트의 서비스와 메타데이터를 설명하는 [ERC-8004](https://eips.ethereum.org/EIPS/eip-8004) 기반의 오프체인 JSON
- `@metaplex-foundation/mpl-agent-registry` SDK **필요**

## 빠른 시작

1. [SDK 설치](#sdk-설치) — 에이전트 레지스트리 패키지 추가
2. [API로 민팅](#api로-에이전트-민팅) — 등록된 에이전트까지의 가장 빠른 경로 (권장)
3. [기존 자산 등록](#기존-자산-등록) — 이미 MPL Core 자산이 있는 사용자용
4. [에이전트 등록 문서](#에이전트-등록-문서) — 오프체인 메타데이터 구조
5. [등록 확인](#등록-확인) — 신원이 첨부되었는지 확인

## SDK 설치

```shell
npm install @metaplex-foundation/mpl-agent-registry @metaplex-foundation/umi-bundle-defaults
```

## API로 에이전트 민팅

Metaplex Agent API는 MPL Core 자산을 생성하고 단일 트랜잭션으로 신원을 등록합니다. 새로운 에이전트에 권장되는 경로입니다.

### 한 번의 호출로 민팅 및 제출

`mintAndSubmitAgent` 함수는 API를 호출하고, 반환된 트랜잭션에 서명하고, 네트워크에 전송합니다:

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mintAndSubmitAgent } from '@metaplex-foundation/mpl-agent-registry';

const umi = createUmi('https://api.mainnet-beta.solana.com');

const result = await mintAndSubmitAgent(umi, {}, {
  wallet: umi.identity.publicKey,
  name: 'My AI Agent',
  uri: 'https://example.com/agent-metadata.json',
  agentMetadata: {
    type: 'agent',
    name: 'My AI Agent',
    description: 'An autonomous agent that executes DeFi strategies on Solana.',
    services: [
      { name: 'web', endpoint: 'https://myagent.ai' },
      { name: 'A2A', endpoint: 'https://myagent.ai/agent-card.json' },
    ],
    registrations: [],
    supportedTrust: ['reputation'],
  },
});

console.log('Agent minted! Asset:', result.assetAddress);
console.log('Signature:', result.signature);
```

#### mintAndSubmitAgent 매개변수

| 매개변수 | 필수 | 설명 |
|-----------|----------|-------------|
| `wallet` | Yes | 에이전트 소유자의 지갑 공개 키 (트랜잭션 서명) |
| `name` | Yes | Core 자산의 표시 이름 |
| `uri` | Yes | Core 자산의 메타데이터 URI |
| `agentMetadata` | Yes | 온체인 에이전트 메타데이터 ([에이전트 등록 문서](#에이전트-등록-문서) 참조) |
| `network` | No | 대상 네트워크 (기본값 `solana-mainnet`) |

#### mintAndSubmitAgent 반환 값

| 필드 | 타입 | 설명 |
|-------|------|-------------|
| `signature` | `Uint8Array` | 트랜잭션 서명 |
| `assetAddress` | `string` | 민팅된 에이전트의 Core 자산 주소 |

### 별도 서명 단계로 민팅

`mintAgent` 함수는 사용자 정의 서명 플로우를 위한 미서명 트랜잭션을 반환합니다 — 추가 서명자나 하드웨어 지갑이 필요할 때 유용합니다:

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mintAgent, signAndSendAgentTransaction } from '@metaplex-foundation/mpl-agent-registry';

const umi = createUmi('https://api.mainnet-beta.solana.com');

// Step 1: Get the unsigned transaction from the API
const mintResult = await mintAgent(umi, {}, {
  wallet: umi.identity.publicKey,
  name: 'My AI Agent',
  uri: 'https://example.com/agent-metadata.json',
  agentMetadata: {
    type: 'agent',
    name: 'My AI Agent',
    description: 'An autonomous agent.',
    services: [],
    registrations: [],
    supportedTrust: [],
  },
});

console.log('Asset address:', mintResult.assetAddress);

// Step 2: Sign and send
const signature = await signAndSendAgentTransaction(umi, mintResult);
```

#### mintAgent 반환 값

| 필드 | 타입 | 설명 |
|-------|------|-------------|
| `transaction` | `Transaction` | 서명 준비가 된 역직렬화된 Umi 트랜잭션 |
| `blockhash` | `BlockhashWithExpiryBlockHeight` | 트랜잭션 유효성을 위한 블록해시 |
| `assetAddress` | `string` | Core 자산 주소 |

### API 설정

API 엔드포인트나 fetch 구현을 커스터마이즈하려면 두 번째 인수로 `AgentApiConfig` 객체를 전달합니다:

| 옵션 | 기본값 | 설명 |
|--------|---------|-------------|
| `baseUrl` | `https://api.metaplex.com` | Metaplex API의 기본 URL |
| `fetch` | `globalThis.fetch` | 사용자 정의 fetch 구현 (Node.js 또는 테스트에 유용) |

```typescript
const result = await mintAndSubmitAgent(
  umi,
  { baseUrl: 'https://api.metaplex.com' },
  input
);
```

### 지원 네트워크

`network` 매개변수는 에이전트가 민팅되는 SVM 네트워크를 제어합니다:

| Network ID | 설명 |
|------------|-------------|
| `solana-mainnet` | Solana Mainnet (기본값) |
| `solana-devnet` | Solana Devnet |
| `localnet` | 로컬 밸리데이터 |
| `eclipse-mainnet` | Eclipse Mainnet |
| `sonic-mainnet` | Sonic Mainnet |
| `sonic-devnet` | Sonic Devnet |
| `fogo-mainnet` | Fogo Mainnet |
| `fogo-testnet` | Fogo Testnet |

### API 에러 처리

API 클라이언트는 캐치하고 검사할 수 있는 타입화된 에러를 던집니다:

| 에러 타입 | 설명 |
|------------|-------------|
| `AgentApiError` | HTTP 응답 에러 — `statusCode`와 `responseBody` 포함 |
| `AgentApiNetworkError` | 네트워크 연결 문제 — 기본 `cause` 포함 |
| `AgentValidationError` | 클라이언트 측 유효성 검사 실패 — 실패한 `field` 포함 |

```typescript
import {
  isAgentApiError,
  isAgentApiNetworkError,
} from '@metaplex-foundation/mpl-agent-registry';

try {
  const result = await mintAndSubmitAgent(umi, {}, input);
} catch (err) {
  if (isAgentApiError(err)) {
    console.error('API error:', err.statusCode, err.responseBody);
  } else if (isAgentApiNetworkError(err)) {
    console.error('Network error:', err.cause.message);
  }
}
```

## 기존 자산 등록

이미 MPL Core 자산이 있는 경우 `registerIdentityV1` 인스트럭션을 사용하여 API 없이 직접 신원 레코드를 바인딩합니다.

{% callout type="note" %}
아직 자산이 없는 경우 위의 [API 경로](#api로-에이전트-민팅)를 대신 사용하세요. 단일 트랜잭션으로 자산을 생성하고 신원을 등록합니다.
{% /callout %}

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplAgentIdentity } from '@metaplex-foundation/mpl-agent-registry';
import { registerIdentityV1 } from '@metaplex-foundation/mpl-agent-registry';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplAgentIdentity());

await registerIdentityV1(umi, {
  asset: assetPublicKey,
  collection: collectionPublicKey,
  agentRegistrationUri: 'https://example.com/agent-registration.json',
}).sendAndConfirm(umi);
```

### registerIdentityV1 매개변수

| 매개변수 | 설명 |
|-----------|-------------|
| `asset` | 등록할 MPL Core 자산 |
| `collection` | 자산의 컬렉션 (선택 사항) |
| `agentRegistrationUri` | 오프체인 에이전트 등록 메타데이터를 가리키는 URI |
| `payer` | 렌트와 수수료 지불 (기본값 `umi.payer`) |
| `authority` | 컬렉션 권한 (기본값 `payer`) |

### 전체 수동 예제

```typescript
import { generateSigner } from '@metaplex-foundation/umi';
import { create, createCollection } from '@metaplex-foundation/mpl-core';
import { registerIdentityV1 } from '@metaplex-foundation/mpl-agent-registry';

// 1. Create a collection
const collection = generateSigner(umi);
await createCollection(umi, {
  collection,
  name: 'Agent Collection',
  uri: 'https://example.com/collection.json',
}).sendAndConfirm(umi);

// 2. Create an asset
const asset = generateSigner(umi);
await create(umi, {
  asset,
  name: 'My Agent',
  uri: 'https://example.com/agent.json',
  collection,
}).sendAndConfirm(umi);

// 3. Register identity
await registerIdentityV1(umi, {
  asset: asset.publicKey,
  collection: collection.publicKey,
  agentRegistrationUri: 'https://example.com/agent-registration.json',
}).sendAndConfirm(umi);
```

## 에이전트 등록 문서

`agentRegistrationUri`(수동 경로) 또는 `agentMetadata`(API 경로)는 에이전트의 신원, 서비스 및 메타데이터를 설명합니다. 이 형식은 Solana에 맞게 조정된 [ERC-8004](https://eips.ethereum.org/EIPS/eip-8004)를 따릅니다. JSON(및 관련 이미지)을 Arweave와 같은 영구 스토리지 프로바이더에 업로드하여 공개적으로 접근 가능하도록 합니다.

```json
{
  "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  "name": "Plexpert",
  "description": "An informational agent providing help related to Metaplex protocols and tools.",
  "image": "https://arweave.net/agent-avatar-tx-hash",
  "services": [
    {
      "name": "web",
      "endpoint": "https://metaplex.com/agent/<ASSET_PUBKEY>"
    },
    {
      "name": "A2A",
      "endpoint": "https://metaplex.com/agent/<ASSET_PUBKEY>/agent-card.json",
      "version": "0.3.0"
    },
    {
      "name": "MCP",
      "endpoint": "https://metaplex.com/agent/<ASSET_PUBKEY>/mcp",
      "version": "2025-06-18"
    }
  ],
  "active": true,
  "registrations": [
    {
      "agentId": "<MINT_ADDRESS>",
      "agentRegistry": "solana:101:metaplex"
    }
  ],
  "supportedTrust": [
    "reputation",
    "crypto-economic"
  ]
}
```

### 필드

| 필드 | 필수 | 설명 |
|-------|----------|-------------|
| `type` | Yes | 스키마 식별자. `https://eips.ethereum.org/EIPS/eip-8004#registration-v1` 사용. |
| `name` | Yes | 사람이 읽을 수 있는 에이전트 이름 |
| `description` | Yes | 에이전트에 대한 자연어 설명 — 무엇을 하는지, 어떻게 작동하는지, 어떻게 상호작용하는지 |
| `image` | Yes | 아바타 또는 로고 URI |
| `services` | No | 에이전트가 노출하는 서비스 엔드포인트 배열 (아래 참조) |
| `active` | No | 에이전트가 현재 활성 상태인지 여부 (`true`/`false`) |
| `registrations` | No | 이 에이전트의 신원에 연결되는 온체인 등록 배열 |
| `supportedTrust` | No | 에이전트가 지원하는 신뢰 모델 (예: `reputation`, `crypto-economic`, `tee-attestation`) |

### Services

각 서비스 항목은 에이전트와 상호작용하는 방법을 설명합니다:

| 필드 | 필수 | 설명 |
|-------|----------|-------------|
| `name` | Yes | 서비스 유형 — 예: `web`, `A2A`, `MCP`, `OASF`, `DID`, `email` |
| `endpoint` | Yes | 서비스에 도달할 수 있는 URL 또는 식별자 |
| `version` | No | 프로토콜 버전 |
| `skills` | No | 이 서비스를 통해 에이전트가 노출하는 스킬 배열 |
| `domains` | No | 에이전트가 운영하는 도메인 배열 |

### Registrations

각 등록 항목은 온체인 신원 레코드에 연결됩니다:

| 필드 | 필수 | 설명 |
|-------|----------|-------------|
| `agentId` | Yes | 에이전트의 민트 주소 |
| `agentRegistry` | Yes | 상수 레지스트리 식별자 — `solana:101:metaplex` 사용 |

## 등록 확인

```typescript
import { fetchAsset } from '@metaplex-foundation/mpl-core';

const assetData = await fetchAsset(umi, assetPublicKey);

// Check the AgentIdentity plugin
const agentIdentity = assetData.agentIdentities?.[0];
console.log(agentIdentity?.uri);               // your registration URI
console.log(agentIdentity?.lifecycleChecks?.transfer);  // truthy
console.log(agentIdentity?.lifecycleChecks?.update);    // truthy
console.log(agentIdentity?.lifecycleChecks?.execute);   // truthy
```

## Genesis 토큰 연결

신원을 등록한 후 선택적으로 `setAgentTokenV1`을 사용하여 [Genesis](/smart-contracts/genesis) 토큰을 에이전트에 연결할 수 있습니다. 이는 토큰 출시를 에이전트의 온체인 신원과 연결합니다. Genesis 계정은 `Mint` 펀딩 모드를 사용해야 합니다.

```typescript
import { setAgentTokenV1 } from '@metaplex-foundation/mpl-agent-registry';

await setAgentTokenV1(umi, {
  asset: asset.publicKey,
  genesisAccount: genesisAccountPublicKey,
}).sendAndConfirm(umi);
```

{% callout type="note" %}
에이전트 토큰은 신원당 한 번만 설정할 수 있습니다. 이 인스트럭션의 `authority`는 자산의 [Asset Signer](/smart-contracts/core/execute-asset-signing) PDA여야 합니다. 전체 계정 세부 정보는 [Agent Identity](/smart-contracts/mpl-agent/identity#instruction-setagenttokenv1) 참조를 확인하세요.
{% /callout %}

## 참고사항

- Metaplex API는 단일 트랜잭션으로 Core 자산을 생성하고 신원을 등록합니다. API를 사용할 때 `registerIdentityV1`을 별도로 호출할 필요가 없습니다.
- `uri` 매개변수(API 경로)는 Core 자산의 메타데이터(이름, 이미지 등)를 가리키고, `agentMetadata`는 에이전트별 등록 데이터(서비스, 신뢰 메커니즘)를 포함합니다.
- `mintAgent`가 반환한 트랜잭션에는 블록해시가 포함되며 블록해시가 만료되기 전(약 60-90초)에 서명하고 제출해야 합니다.
- `registerIdentityV1`을 통한 등록은 자산당 일회성 작업입니다. 이미 등록된 자산에 호출하면 실패합니다.
- `agentRegistrationUri`는 영구적으로 호스팅된 JSON(예: Arweave)을 가리켜야 합니다. URI에 접근할 수 없게 되면 온체인 신원은 여전히 존재하지만 클라이언트가 에이전트의 메타데이터를 가져올 수 없습니다.
- `collection` 매개변수는 선택 사항이지만 권장됩니다 — 등록 중 컬렉션 수준 권한 검사를 활성화합니다.
- Transfer, Update, Execute에 대한 라이프사이클 훅이 자동으로 첨부됩니다. 이러한 훅을 통해 신원 플러그인이 자산에 대한 오퍼레이션의 승인 또는 거부에 참여할 수 있습니다.
- `setAgentTokenV1`을 통한 Genesis 토큰 연결은 선택 사항이며 등록 후 언제든지 수행할 수 있습니다.

*[Metaplex](https://github.com/metaplex-foundation) 관리 · 최종 확인 2026년 3월*
