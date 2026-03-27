---
title: 에이전트 민팅
metaTitle: 에이전트 민팅 | Metaplex
description: Metaplex API와 mpl-agent-registry SDK를 사용하여 단일 트랜잭션으로 온체인 AI 에이전트를 생성합니다. 호스팅된 API가 에이전트 메타데이터를 저장하고 서명 및 제출할 미서명 트랜잭션을 반환합니다.
keywords:
  - mint agent
  - agent registration
  - Metaplex API
  - mpl-agent-registry
  - mintAgent
  - mintAndSubmitAgent
  - Core asset
  - agent identity
  - Solana
about:
  - Agent Registration
  - Metaplex API
  - Solana
programmingLanguage:
  - JavaScript
  - TypeScript
proficiencyLevel: Beginner
created: '03-27-2026'
updated: '03-27-2026'
howToSteps:
  - mpl-agent-registry를 설치하고 Umi 인스턴스를 구성합니다
  - 지갑, 에이전트 이름, 메타데이터 URI, agentMetadata를 지정하여 mintAndSubmitAgent를 호출합니다
  - Metaplex API가 메타데이터를 저장하고 미서명 Solana 트랜잭션을 반환합니다
  - 트랜잭션에 서명하고 제출하여 Core 에셋과 에이전트 ID를 온체인에 등록합니다
howToTools:
  - Node.js
  - Umi framework
  - mpl-agent-registry SDK v0.2.0+
faqs:
  - q: mintAndSubmitAgent와 mintAgent의 차이점은 무엇인가요?
    a: mintAndSubmitAgent는 mintAgent를 호출한 후 한 번에 트랜잭션에 서명하고 제출하는 편의 래퍼입니다. 수동 서명 제어, 커스텀 트랜잭션 전송자, 또는 제출 전 트랜잭션 검사가 필요한 경우 mintAgent를 직접 사용하세요.
  - q: Metaplex API를 통한 민팅과 registerIdentityV1을 직접 사용하는 것의 차이점은 무엇인가요?
    a: Metaplex API 흐름(mintAgent / mintAndSubmitAgent)은 단일 트랜잭션으로 Core 에셋과 에이전트 ID를 모두 생성합니다. 기존 에셋이 필요하지 않습니다. registerIdentityV1 방식은 이미 소유한 Core 에셋에 ID 플러그인을 연결합니다.
  - q: mintAndSubmitAgent를 호출하기 전에 Core 에셋을 생성해야 하나요?
    a: 아니요. API가 하나의 트랜잭션으로 Core 에셋 생성과 에이전트 ID 등록을 동시에 처리합니다. 지갑 주소, 에이전트 이름, 메타데이터 URI, agentMetadata 객체만 있으면 됩니다.
  - q: uri 필드와 agentMetadata의 차이점은 무엇인가요?
    a: uri는 Core 에셋의 온체인 메타데이터에 직접 저장됩니다. 일반 NFT와 마찬가지로 공개적으로 호스팅된 JSON 파일을 가리켜야 합니다. agentMetadata 객체는 Metaplex API로 전송되어 에이전트 레코드와 함께 오프체인에 저장됩니다. 둘 다 민팅 시 설정됩니다.
  - q: 메인넷으로 이동하기 전에 devnet에서 테스트할 수 있나요?
    a: 네. 입력에 network "solana-devnet"을 전달하고 Umi 인스턴스를 Solana devnet RPC 엔드포인트로 설정하세요.
  - q: API가 트랜잭션을 반환했지만 온체인 제출이 실패하면 어떻게 되나요?
    a: 온체인 트랜잭션 실패는 Core 에셋이 생성되지 않고 에이전트 ID가 등록되지 않았음을 의미합니다. mintAgent를 다시 호출하여 새 블록해시가 포함된 새 트랜잭션을 받고 재시도하세요.
  - q: Metaplex API는 어떤 네트워크를 지원하나요?
    a: Solana 메인넷, Solana Devnet, Localnet, Eclipse 메인넷, Sonic 메인넷, Sonic Devnet, Fogo 메인넷, Fogo 테스트넷을 지원합니다.
  - q: 에이전트 민팅 비용은 얼마인가요?
    a: 민팅에는 표준 Solana 트랜잭션 수수료와 Core 에셋 계정 및 Agent Identity PDA의 렌트 비용이 듭니다. Metaplex API의 민팅에는 추가 프로토콜 수수료가 없습니다.
---

Metaplex API와 `mpl-agent-registry` SDK를 사용하여 단일 호출로 온체인에 AI 에이전트를 등록합니다. {% .lead %}

## Summary

Metaplex API는 에이전트 메타데이터를 저장하고 미서명 Solana 트랜잭션을 반환하는 호스팅 엔드포인트를 제공합니다. 해당 트랜잭션에 서명하고 제출하면 에이전트를 나타내는 [MPL Core](/core) 에셋이 생성되고 단일 원자적 작업으로 [Agent Identity](/smart-contracts/mpl-agent/identity) PDA가 등록됩니다.

- **생성** — MPL Core 에셋과 Agent Identity PDA를 하나의 트랜잭션으로 동시 생성. 기존 에셋 불필요
- **호스팅 API** — `https://api.metaplex.com`이 메타데이터 저장 처리. 민팅 전 별도 업로드 불필요
- **두 가지 SDK 함수** — 원클릭 흐름에는 `mintAndSubmitAgent`, 수동 서명 제어에는 `mintAgent`
- **멀티 네트워크** — Solana 메인넷·devnet, Eclipse, Sonic, Fogo 지원
- **필요 사항** — `@metaplex-foundation/mpl-agent-registry` v0.2.0+

{% callout title="빌드할 내용" %}
Metaplex API와 `mpl-agent-registry` SDK를 통해 생성된, Agent Identity PDA가 연결된 MPL Core 에셋인 등록된 온체인 AI 에이전트.
{% /callout %}

## 빠른 시작

1. [흐름 이해](#how-it-works)
2. [SDK 설치](#installation)
3. [Umi 인스턴스 구성](#umi-setup)
4. [원클릭 민팅 및 등록](#mint-and-submit-an-agent)
5. [결과 확인](#verify-the-result)

## How It Works

Metaplex API를 통한 에이전트 민팅은 SDK가 조율하는 3단계 흐름입니다.

1. **API 호출** — SDK가 에이전트 세부 정보를 `https://api.metaplex.com`의 `POST /v1/agents/mint`에 전송합니다. API는 `agentMetadata`를 오프체인에 저장하고 미서명 Solana 트랜잭션을 구성합니다.
2. **미서명 트랜잭션 반환** — API는 트랜잭션에 서명하지 않고 반환합니다. 개인 키는 환경 밖으로 나가지 않으며, API는 명령 세트만 구성합니다.
3. **서명 및 제출** — 사용자(또는 `mintAndSubmitAgent`가 자동으로) 키페어로 트랜잭션에 서명하고 네트워크에 제출합니다. 온체인에서 단일 원자적 작업으로 Core 에셋이 생성되고 Agent Identity PDA가 등록됩니다.

### 두 필드, 두 가지 저장 위치

`mintAndSubmitAgent` 또는 `mintAgent`를 호출할 때 두 가지 별개의 메타데이터를 제공합니다.

| 필드 | 저장 위치 | 목적 |
|------|-----------|------|
| `uri` | 온체인(Core 에셋 메타데이터 내) | 공개 호스팅된 JSON 파일을 가리킵니다. 표준 Core 에셋 URI와 동일하게 작동합니다. |
| `agentMetadata` | 오프체인(Metaplex API 저장) | 에이전트의 기능, 서비스, 신뢰 모델을 설명합니다. 레지스트리에서 검색을 위해 인덱싱됩니다. |

둘 다 민팅 시 설정되며 에이전트를 업데이트하지 않고는 독립적으로 변경할 수 없습니다.

{% callout type="note" %}
이 가이드는 새 Core 에셋 생성과 에이전트 ID 등록을 하나의 트랜잭션으로 처리합니다. 이미 Core 에셋을 소유하고 있고 ID만 연결하려면 대신 [`registerIdentityV1`](/agents/register-agent)을 사용하세요.
{% /callout %}

## Prerequisites

민팅 전 다음이 필요합니다.

- Node.js 18 이상
- 자금이 있는 Solana 지갑 키페어(이 지갑이 트랜잭션 비용을 지불하고 에이전트 소유자가 됩니다)
- Core 에셋 NFT 메타데이터 JSON을 위한 공개 접근 가능한 `uri`

## Installation

세 가지 필수 패키지를 설치합니다: Agent Registry SDK, 핵심 Umi 프레임워크, RPC 클라이언트와 트랜잭션 전송자를 제공하는 기본 Umi 번들.

```bash {% title="Terminal" %}
npm install @metaplex-foundation/mpl-agent-registry @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults
```

## Umi Setup

[Umi](/umi)는 Solana 프로그램과 상호작용하는 데 사용되는 Metaplex JavaScript 프레임워크입니다. SDK 함수를 호출하기 전에 RPC 엔드포인트와 키페어로 구성하세요.

`mplAgentIdentity()` 플러그인은 Agent Identity 프로그램의 명령 빌더와 계정 역직렬화기를 Umi 인스턴스에 등록합니다. 이것 없이는 Umi가 Agent Identity 프로그램 명령을 구성하거나 읽을 수 없습니다.

```typescript {% title="setup.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity } from '@metaplex-foundation/umi';
import { mplAgentIdentity } from '@metaplex-foundation/mpl-agent-registry';

// 선호하는 RPC로 Umi 설정
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplAgentIdentity());

// 키페어 로드 — 이 지갑이 트랜잭션 비용을 지불하고 에이전트 소유자가 됩니다
const keypair = umi.eddsa.createKeypairFromSecretKey(mySecretKeyBytes);
umi.use(keypairIdentity(keypair));
```

위 예제는 `keypairIdentity`를 사용합니다(원시 비밀 키를 Umi에 직접 로드). 이것은 서버 사이드 스크립트와 백엔드 통합의 표준 접근 방식입니다. Umi는 환경에 따라 두 가지 다른 ID 패턴도 지원합니다.

| 접근 방식 | 방법 | 최적 용도 |
|-----------|------|-----------|
| **원시 키페어**(이 예제) | `keypairIdentity` + `createKeypairFromSecretKey` | 서버 사이드 스크립트, 백엔드 |
| **파일시스템 지갑** | JSON 키 파일과 함께 `createSignerFromKeypair` + `signerIdentity` | 로컬 개발 및 CLI 도구 |
| **브라우저 지갑 어댑터** | `umi-signer-wallet-adapters`의 `walletAdapterIdentity` | Phantom, Backpack 등 웹 dApp |

각 접근 방식의 전체 코드 예제는 Umi 문서의 [지갑 연결](/dev-tools/umi/getting-started#connecting-a-wallet)을 참조하세요.

## Mint and Submit an Agent

`mintAndSubmitAgent`는 Metaplex API를 호출하고, 반환된 트랜잭션에 서명한 후 한 번에 네트워크에 제출합니다. 대부분의 통합에 이 방식을 사용하세요.

{% code-tabs-imported from="agents/mint_and_submit" frameworks="umi" filename="mintAndSubmitAgent" /%}

## Mint an Agent with Manual Signing

`mintAgent`는 트랜잭션을 제출하지 않고 미서명 상태로 반환합니다. 우선 수수료 추가, 하드웨어 지갑 사용, 또는 커스텀 재시도 로직 통합이 필요한 경우 사용하세요.

{% code-tabs-imported from="agents/mint_manual" frameworks="umi" filename="mintAgent" /%}

## Verify the Result

민팅 후 Core 에셋을 가져오고 `AgentIdentity` 플러그인을 확인하여 에이전트 ID가 등록되었는지 확인합니다. 성공적인 등록은 Transfer, Update, Execute에 대한 라이프사이클 훅을 연결합니다. 이것들이 확인해야 할 신호입니다.

{% code-tabs-imported from="agents/verify" frameworks="umi" filename="verifyRegistration" /%}

`agentIdentities`가 undefined이거나 비어 있으면 ID가 등록되지 않은 것입니다. 트랜잭션이 자동으로 실패했거나 확인되지 않았을 수 있습니다. 재시도하기 전에 온체인에서 트랜잭션 서명을 확인하세요.

## Agent Metadata Fields

`agentMetadata` 객체는 Metaplex API로 전송되어 에이전트 레코드와 함께 오프체인에 저장됩니다. Core 에셋의 `uri`(NFT 메타데이터 파일)와는 별개입니다. 자세한 내용은 [How It Works](#how-it-works)를 참조하세요.

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `type` | `string` | 예 | 스키마 식별자. `'agent'`를 사용하세요. |
| `name` | `string` | 예 | 에이전트 표시 이름 |
| `description` | `string` | 예 | 에이전트의 기능과 상호작용 방법 |
| `services` | `AgentService[]` | 아니요 | 에이전트가 제공하는 서비스 엔드포인트 |
| `registrations` | `AgentRegistration[]` | 아니요 | 외부 레지스트리 항목 링크 |
| `supportedTrust` | `string[]` | 아니요 | 지원되는 신뢰 메커니즘(예: `'tee'`, `'reputation'`) |

### Agent Service 필드

`services`의 각 항목은 에이전트와 상호작용하는 한 가지 방법을 설명합니다.

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `name` | `string` | 예 | 서비스 유형(예: `'trading'`, `'chat'`, `'MCP'`, `'A2A'`) |
| `endpoint` | `string` | 예 | 서비스에 접근할 수 있는 URL |

## Supported Networks

입력 객체에 `network` 값을 전달합니다. 생략하면 기본값은 `'solana-mainnet'`입니다. 선택한 네트워크와 Umi RPC 엔드포인트가 일치하는지 확인하세요.

| 네트워크 | `network` 값 |
|---------|--------------|
| Solana 메인넷 | `solana-mainnet`(기본값) |
| Solana Devnet | `solana-devnet` |
| Localnet | `localnet` |
| Eclipse 메인넷 | `eclipse-mainnet` |
| Sonic 메인넷 | `sonic-mainnet` |
| Sonic Devnet | `sonic-devnet` |
| Fogo 메인넷 | `fogo-mainnet` |
| Fogo 테스트넷 | `fogo-testnet` |

## Devnet Testing

메인넷으로 이동하기 전에 Solana devnet에서 통합을 테스트합니다. Umi 인스턴스를 devnet RPC로 설정하고 `network: 'solana-devnet'`을 전달하면 API가 devnet 클러스터에 에이전트를 등록합니다. devnet에서 민팅된 에이전트는 메인넷과 별도의 에셋 주소를 가지며 메인넷 탐색기에 표시되지 않습니다.

{% code-tabs-imported from="agents/devnet" frameworks="umi" filename="devnetTest" /%}

## Custom API Base URL

구성 인수(`mintAgent` 또는 `mintAndSubmitAgent`의 두 번째 매개변수)에 `baseUrl`을 전달하여 스테이징 또는 자체 호스팅 API를 대상으로 할 수 있습니다. 비프로덕션 환경과 통합할 때 사용하세요.

{% code-tabs-imported from="agents/custom_api_url" frameworks="umi" filename="customApiUrl" /%}

## Custom Transaction Sender

`mintAndSubmitAgent`의 네 번째 인수로 `txSender` 함수를 전달하여 자체 서명 및 제출 인프라를 사용합니다. Jito 번들 팁, 우선 수수료, 커스텀 확인 폴링 추가에 적합합니다.

{% code-tabs-imported from="agents/custom_sender" frameworks="umi" filename="customSender" /%}

## Error Handling

SDK는 타입이 지정된 에러 가드를 내보내어 일반 에러를 캐치하는 대신 각 실패 모드를 명시적으로 처리할 수 있습니다.

{% code-tabs-imported from="agents/error_handling" frameworks="umi" filename="errorHandling" /%}

## Common Errors

가장 빈번한 실패 모드와 해결 방법입니다.

| 에러 | 원인 | 해결 방법 |
|------|------|-----------|
| `isAgentValidationError` | 필수 입력 필드가 누락되었거나 잘못된 형식 | `err.field`를 확인하고 필수 `agentMetadata` 필드가 모두 제공되었는지 확인하세요 |
| `isAgentApiNetworkError` | API 엔드포인트에 도달할 수 없음 | 네트워크 연결을 확인하고 `err.cause`에서 근본적인 에러를 조사하세요 |
| `isAgentApiError` | API가 2xx가 아닌 상태 반환 | `err.statusCode`와 `err.responseBody`를 확인하고 `uri`가 공개적으로 접근 가능한지 확인하세요 |
| 블록해시 만료 | 블록해시가 만료되기 전에 트랜잭션이 제출되지 않음 | `mintAgent`를 다시 호출하여 새 트랜잭션을 받고 제출을 재시도하세요 |
| 민팅 후 `agentIdentities` 비어 있음 | 트랜잭션은 확인되었지만 ID 플러그인이 연결되지 않음 | 트랜잭션 영수증을 확인하여 성공 여부를 확인하세요. 자동으로 실패한 경우 전체 민팅을 재시도하세요 |

## Full Example

설정, 민팅, 확인이 포함된 완전한 엔드투엔드 코드 스니펫으로 바로 복사하여 실행할 수 있습니다.

{% code-tabs-imported from="agents/full_example" frameworks="umi" filename="fullExample" /%}

## Notes

- `mintAndSubmitAgent`는 호출할 때마다 새로운 Core 에셋을 생성합니다. 중복 제거가 없습니다. 같은 입력으로 두 번 호출하면 두 개의 서로 다른 에셋 주소에 두 개의 별도 에이전트가 생성됩니다.
- `uri` 필드는 Core 에셋의 온체인 메타데이터에 저장되며 공개적으로 접근 가능한 JSON 문서를 가리켜야 합니다. 호스팅된 메타데이터 URI가 없다면 먼저 Arweave나 다른 영구 저장소 제공자에 파일을 업로드하세요.
- 새 Core 에셋을 생성하지 않고 기존 Core 에셋에 에이전트 ID를 연결하려면 대신 [`registerIdentityV1`](/agents/register-agent)을 사용하세요.
- Metaplex API 기본 URL은 `https://api.metaplex.com`입니다. API 키가 필요하지 않습니다.
- 민팅에는 표준 Solana 트랜잭션 수수료와 Core 에셋 계정 및 Agent Identity PDA의 렌트 비용이 듭니다.
- `@metaplex-foundation/mpl-agent-registry` v0.2.0+가 필요합니다.

## FAQ

### `mintAndSubmitAgent`와 `mintAgent`의 차이점은 무엇인가요?
`mintAndSubmitAgent`는 `mintAgent`를 호출한 후 한 번에 트랜잭션에 서명하고 제출하는 편의 래퍼입니다. 수동 서명 제어, 커스텀 트랜잭션 전송자, 또는 제출 전 트랜잭션 검사가 필요한 경우 `mintAgent`를 직접 사용하세요.

### Metaplex API를 통한 민팅과 `registerIdentityV1`을 직접 사용하는 것의 차이점은 무엇인가요?
Metaplex API 흐름(`mintAgent` / `mintAndSubmitAgent`)은 단일 트랜잭션으로 Core 에셋 **및** 에이전트 ID를 모두 생성합니다. 기존 Core 에셋이 필요하지 않습니다. [`registerIdentityV1`](/agents/register-agent) 방식은 이미 소유한 MPL Core 에셋에 ID 플러그인을 연결합니다.

### `uri` 필드와 `agentMetadata`의 차이점은 무엇인가요?
`uri`는 Core 에셋의 온체인 메타데이터에 직접 저장됩니다. 일반 NFT처럼 공개 호스팅된 JSON 파일을 가리켜야 합니다. `agentMetadata` 객체는 Metaplex API로 전송되어 에이전트 레코드와 함께 오프체인에 저장됩니다. 둘 다 민팅 시 설정됩니다. 자세한 내용은 [How It Works](#how-it-works)를 참조하세요.

### `mintAndSubmitAgent`를 호출하기 전에 Core 에셋을 생성해야 하나요?
아니요. API가 Core 에셋 생성과 에이전트 ID 등록을 동시에 처리합니다. 지갑 주소, 에이전트 이름, 메타데이터 URI, `agentMetadata` 객체만 있으면 됩니다.

### 메인넷으로 이동하기 전에 devnet에서 테스트할 수 있나요?
네. 입력에 `network: 'solana-devnet'`을 전달하고 Umi 인스턴스를 `https://api.devnet.solana.com`으로 설정하세요.

### API가 트랜잭션을 반환했지만 온체인 제출이 실패하면 어떻게 되나요?
온체인 트랜잭션 실패는 Core 에셋이 생성되지 않고 에이전트 ID가 등록되지 않았음을 의미합니다. `mintAgent`를 다시 호출하여 새 블록해시가 포함된 새 트랜잭션을 받고 재시도하세요.

### Metaplex API는 어떤 네트워크를 지원하나요?
Solana 메인넷, Solana Devnet, Localnet, Eclipse 메인넷, Sonic 메인넷, Sonic Devnet, Fogo 메인넷, Fogo 테스트넷. 전달할 정확한 값은 [Supported Networks](#supported-networks)를 참조하세요.

### 에이전트 민팅 비용은 얼마인가요?
민팅에는 표준 Solana 트랜잭션 수수료와 Core 에셋 계정 및 Agent Identity PDA의 렌트 비용이 듭니다. Metaplex API의 민팅에는 추가 프로토콜 수수료가 없습니다.
