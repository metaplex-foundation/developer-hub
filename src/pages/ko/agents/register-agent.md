---
title: 에이전트 등록
metaTitle: Solana에서 에이전트 등록 | Metaplex 014 Agent Registry
description: MPL Core 자산에 신원 기록을 바인딩하여 Metaplex 014 에이전트 레지스트리에 에이전트 신원을 등록합니다.
keywords:
  - register agent
  - agent identity
  - MPL Core
  - AgentIdentity plugin
  - ERC-8004
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Agent Registration
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '02-25-2026'
updated: '03-30-2026'
---

MPL Core 자산에 신원 기록을 바인딩하여 Metaplex 014 에이전트 레지스트리에 에이전트를 등록합니다. {% .lead %}

## 요약

`registerIdentityV1` 명령은 온체인 신원 기록을 MPL Core 자산에 바인딩하여 검색 가능한 PDA를 생성하고 Transfer, Update, Execute 라이프사이클 훅을 첨부합니다.

- 자산의 공개 키에서 파생된 PDA를 **생성**하여 온체인 검색 가능성 제공
- `AgentIdentity` 플러그인과 라이프사이클 훅을 Core 자산에 **첨부**
- 에이전트 메타데이터를 위한 [ERC-8004](https://eips.ethereum.org/EIPS/eip-8004) 준수 오프체인 등록 문서에 **링크**
- 기존 MPL Core 자산과 `@metaplex-foundation/mpl-agent-registry` SDK가 **필요**

## 빠른 시작

1. [사전 요구사항](#사전-요구사항) — MPL Core 자산 획득 및 SDK 설치
2. [에이전트 등록](#에이전트-등록-1) — `registerIdentityV1` 호출하여 신원 바인딩
3. [에이전트 등록 문서](#에이전트-등록-문서) — 오프체인 메타데이터 JSON 생성
4. [등록 확인](#등록-확인) — 신원이 첨부되었는지 확인
5. [전체 예제](#전체-예제) — 엔드투엔드 코드 샘플

## 학습 내용
이 가이드는 다음을 포함하는 에이전트 등록 방법을 보여줍니다:

- MPL Core 자산에 연결된 신원 기록
- 에이전트를 온체인에서 검색 가능하게 하는 PDA(Program Derived Address)
- Transfer, Update, Execute 라이프사이클 훅이 있는 AgentIdentity 플러그인

## 사전 요구사항

등록 전에 MPL Core 자산이 필요합니다. 아직 없다면 [NFT 만들기](/nfts/create-nft)를 참조하세요. 신원 프로그램 자체에 대한 자세한 내용은 [MPL Agent Registry](/smart-contracts/mpl-agent) 문서를 참조하세요.

## 에이전트 등록

등록은 자산의 공개 키에서 파생된 PDA를 생성하고 Transfer, Update, Execute 라이프사이클 훅이 있는 `AgentIdentity` 플러그인을 첨부합니다. PDA를 통해 에이전트를 검색할 수 있습니다 — 누구나 자산 주소에서 PDA를 파생하여 등록된 신원이 있는지 확인할 수 있습니다.

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

## 매개변수

| 매개변수 | 설명 |
|-----------|-------------|
| `asset` | 등록할 MPL Core 자산 |
| `collection` | 자산의 컬렉션 (선택사항) |
| `agentRegistrationUri` | 오프체인 에이전트 등록 메타데이터를 가리키는 URI |
| `payer` | 렌트 및 수수료 지불 (기본값: `umi.payer`) |
| `authority` | 컬렉션 권한 (기본값: `payer`) |

## 에이전트 등록 문서

`agentRegistrationUri`는 에이전트의 신원, 서비스 및 메타데이터를 설명하는 JSON 문서를 가리킵니다. 형식은 Solana에 맞게 조정된 [ERC-8004](https://eips.ethereum.org/EIPS/eip-8004)를 따릅니다. JSON(및 관련 이미지)을 Arweave와 같은 영구 스토리지 제공자에 업로드하여 공개적으로 접근 가능하게 하세요. 프로그래밍 방식의 업로드에 대해서는 이 [가이드](/smart-contracts/mpl-hybrid/guides/create-deterministic-metadata-with-turbo)를 참조하세요.

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
| `type` | 예 | 스키마 식별자. `https://eips.ethereum.org/EIPS/eip-8004#registration-v1` 사용. |
| `name` | 예 | 사람이 읽을 수 있는 에이전트 이름 |
| `description` | 예 | 에이전트에 대한 자연어 설명 — 무엇을 하는지, 어떻게 작동하는지, 어떻게 상호작용하는지 |
| `image` | 예 | 아바타 또는 로고 URI |
| `services` | 아니오 | 에이전트가 노출하는 서비스 엔드포인트 배열 (아래 참조) |
| `active` | 아니오 | 에이전트가 현재 활성 상태인지 여부 (`true`/`false`) |
| `registrations` | 아니오 | 에이전트의 신원에 다시 연결되는 온체인 등록 배열 |
| `supportedTrust` | 아니오 | 에이전트가 지원하는 신뢰 모델 (예: `reputation`, `crypto-economic`, `tee-attestation`) |

### 서비스

각 서비스 항목은 에이전트와 상호작용하는 방법을 설명합니다:

| 필드 | 필수 | 설명 |
|-------|----------|-------------|
| `name` | 예 | 서비스 유형 — 예: `web`, `A2A`, `MCP`, `OASF`, `DID`, `email` |
| `endpoint` | 예 | 서비스에 도달할 수 있는 URL 또는 식별자 |
| `version` | 아니오 | 프로토콜 버전 |
| `skills` | 아니오 | 이 서비스를 통해 에이전트가 노출하는 스킬 배열 |
| `domains` | 아니오 | 에이전트가 운영하는 도메인 배열 |

### 등록

각 등록 항목은 온체인 신원 기록에 다시 연결됩니다:

| 필드 | 필수 | 설명 |
|-------|----------|-------------|
| `agentId` | 예 | 에이전트의 민트 주소 |
| `agentRegistry` | 예 | 고정 레지스트리 식별자 — `solana:101:metaplex` 사용 |

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

## 전체 예제

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

## Genesis 토큰 링크

신원을 등록한 후 선택적으로 `setAgentTokenV1`을 사용하여 [Genesis](/smart-contracts/genesis) 토큰을 에이전트에 링크할 수 있습니다. 이를 통해 토큰 출시가 에이전트의 온체인 신원에 연결됩니다. Genesis 계정은 `Mint` 펀딩 모드를 사용해야 합니다.

```typescript
import { setAgentTokenV1 } from '@metaplex-foundation/mpl-agent-registry';

await setAgentTokenV1(umi, {
  asset: asset.publicKey,
  genesisAccount: genesisAccountPublicKey,
}).sendAndConfirm(umi);
```

{% callout type="note" %}
에이전트 토큰은 신원당 한 번만 설정할 수 있습니다. 이 명령의 `authority`는 자산의 [Asset Signer](/smart-contracts/core/execute-asset-signing) PDA여야 합니다. 전체 계정 세부사항은 [Agent Identity](/smart-contracts/mpl-agent/identity#instruction-setagenttokenv1) 레퍼런스를 참조하세요.
{% /callout %}

## 참고사항

- 등록은 자산당 1회 작업입니다. 이미 등록된 자산에 대해 `registerIdentityV1`을 호출하면 실패합니다.
- `agentRegistrationUri`는 영구적으로 호스팅된 JSON(예: Arweave)을 가리켜야 합니다. URI에 접근할 수 없게 되더라도 온체인 신원은 여전히 존재하지만 클라이언트는 에이전트의 메타데이터를 가져올 수 없습니다.
- `collection` 매개변수는 선택사항이지만 권장됩니다 — 등록 시 컬렉션 수준 권한 검사를 활성화합니다.
- Transfer, Update, Execute 라이프사이클 훅은 자동으로 첨부됩니다. 이러한 훅을 통해 신원 플러그인이 자산에 대한 작업의 승인 또는 거부에 참여할 수 있습니다.
- `setAgentTokenV1`을 통한 Genesis 토큰 링크는 선택사항이며 등록 후 언제든지 수행할 수 있습니다.
