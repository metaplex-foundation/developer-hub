---
title: 에이전트 민팅
metaTitle: Solana에서 에이전트 민팅 | Metaplex Agent API
description: Metaplex Agent API를 사용하여 에이전트를 민팅합니다 — MPL Core 자산 생성과 신원 등록을 단일 API 호출로 수행합니다.
keywords:
  - mint agent
  - Agent API
  - mintAgent
  - mintAndSubmitAgent
  - MPL Core
  - agent registration
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Agent Minting
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '03-30-2026'
updated: '03-30-2026'
---

Metaplex Agent API를 사용하여 에이전트를 민팅합니다 — [MPL Core](/smart-contracts/core) 자산 생성과 신원 등록을 단일 API 호출로 수행합니다. {% .lead %}

## 요약

Metaplex Agent API는 Core 자산 생성과 신원 등록을 별도로 수행할 필요 없이 에이전트를 민팅하는 간소화된 방법을 제공합니다. 단일 API 호출로 자산 생성과 온체인 신원 등록을 수행하는 미서명 트랜잭션이 반환됩니다.

- **단일 API 호출** — `mintAgent`는 미서명 트랜잭션을 반환하고, `mintAndSubmitAgent`는 서명과 전송을 한 번에 수행
- 제공된 이름과 메타데이터 URI로 **Core 자산을 생성**
- 에이전트 메타데이터(서비스, 신뢰 메커니즘, 등록)로 **신원을 등록**
- **멀티 네트워크** — Solana mainnet/devnet, Eclipse, Sonic, Fogo 네트워크 지원
- `@metaplex-foundation/mpl-agent-registry` SDK가 **필요**

## 빠른 시작

1. [SDK 설치](#sdk-설치) — 에이전트 레지스트리 패키지 추가
2. [mintAndSubmitAgent로 민팅](#mintandsubmitagent로-원콜-민팅) — 등록된 에이전트로의 가장 빠른 경로
3. [mintAgent로 별도 서명](#mintagent로-별도-서명-단계) — 커스텀 서명 플로우용
4. [에이전트 메타데이터](#에이전트-메타데이터) — 온체인 메타데이터 페이로드 구조

## 학습 내용

이 가이드는 다음 방법을 보여줍니다:

- Metaplex API를 사용하여 단일 함수 호출로 에이전트 민팅
- 서비스 및 신뢰 메커니즘을 포함한 에이전트 메타데이터 구성
- API 오류 처리
- 다양한 SVM 네트워크 타겟 지정

## SDK 설치

```shell
npm install @metaplex-foundation/mpl-agent-registry @metaplex-foundation/umi-bundle-defaults
```

## mintAndSubmitAgent로 원콜 민팅

`mintAndSubmitAgent` 함수는 API를 호출하고, 반환된 트랜잭션에 서명한 후 네트워크에 전송합니다:

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

### 매개변수

| 매개변수 | 필수 | 설명 |
|-----------|----------|-------------|
| `wallet` | 예 | 에이전트 소유자의 지갑 공개 키 (트랜잭션 서명) |
| `name` | 예 | Core 자산의 표시 이름 |
| `uri` | 예 | Core 자산의 메타데이터 URI |
| `agentMetadata` | 예 | 온체인 에이전트 메타데이터 ([에이전트 메타데이터](#에이전트-메타데이터) 참조) |
| `network` | 아니오 | 타겟 네트워크 (기본값: `solana-mainnet`) |

### 반환 값

| 필드 | 타입 | 설명 |
|-------|------|-------------|
| `signature` | `Uint8Array` | 트랜잭션 서명 |
| `assetAddress` | `string` | 민팅된 에이전트의 Core 자산 주소 |

## mintAgent로 별도 서명 단계

`mintAgent` 함수는 커스텀 서명 플로우를 위한 미서명 트랜잭션을 반환합니다 — 추가 서명자가 필요하거나 하드웨어 지갑을 사용할 때 유용합니다:

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

### mintAgent 반환 값

| 필드 | 타입 | 설명 |
|-------|------|-------------|
| `transaction` | `Transaction` | 서명 가능한 역직렬화된 Umi 트랜잭션 |
| `blockhash` | `BlockhashWithExpiryBlockHeight` | 트랜잭션 유효성을 위한 blockhash |
| `assetAddress` | `string` | Core 자산 주소 |

## 에이전트 메타데이터

`agentMetadata` 객체는 에이전트의 기능을 설명하며 온체인 등록의 일부로 저장됩니다:

```typescript
interface AgentMetadata {
  type: string;              // e.g., 'agent'
  name: string;              // Display name
  description: string;       // What the agent does
  services: AgentService[];  // Service endpoints
  registrations: AgentRegistration[];  // External registry links
  supportedTrust: string[];  // Trust mechanisms
}

interface AgentService {
  name: string;      // Service type: 'web', 'A2A', 'MCP', etc.
  endpoint: string;  // Service URL
}

interface AgentRegistration {
  agentId: string;       // Agent identifier
  agentRegistry: string; // Registry identifier
}
```

전체 필드 레퍼런스는 [에이전트 등록 — 에이전트 등록 문서](/agents/register-agent#에이전트-등록-문서)를 참조하세요.

## API 구성

API 엔드포인트나 fetch 구현을 커스터마이즈하려면 두 번째 인수로 `AgentApiConfig` 객체를 전달합니다:

| 옵션 | 기본값 | 설명 |
|--------|---------|-------------|
| `baseUrl` | `https://api.metaplex.com` | Metaplex API의 기본 URL |
| `fetch` | `globalThis.fetch` | 커스텀 fetch 구현 (Node.js나 테스트에 유용) |

```typescript
const result = await mintAndSubmitAgent(
  umi,
  { baseUrl: 'https://api.metaplex.com' },
  input
);
```

## 지원되는 네트워크

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

## 오류 처리

API 클라이언트는 캐치하고 검사할 수 있는 타입 지정 오류를 던집니다:

| 오류 타입 | 설명 |
|------------|-------------|
| `AgentApiError` | HTTP 응답 오류 — `statusCode`와 `responseBody` 포함 |
| `AgentApiNetworkError` | 네트워크 연결 문제 — 근본적인 `cause` 포함 |
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

## 참고사항

- Metaplex API는 Core 자산 생성과 신원 등록을 단일 트랜잭션으로 수행합니다. `registerIdentityV1`을 별도로 호출할 필요가 없습니다.
- `uri` 매개변수는 Core 자산의 메타데이터(이름, 이미지 등)를 가리키고, `agentMetadata`에는 에이전트 고유의 등록 데이터(서비스, 신뢰 메커니즘)가 포함됩니다.
- `mintAgent`가 반환하는 트랜잭션에는 blockhash가 포함되어 있으며, blockhash가 만료되기 전(약 60~90초)에 서명하고 제출해야 합니다.
- API를 사용하지 않는 수동 등록에 대해서는 [에이전트 등록](/agents/register-agent)을 참조하세요.
