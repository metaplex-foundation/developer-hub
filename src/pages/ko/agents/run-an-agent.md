---
title: 에이전트 실행
metaTitle: Solana에서 에이전트 실행 | Metaplex Agent Registry
description: 이그제큐티브 프로필을 설정하고 실행을 위임하여 Solana에서 자율 에이전트를 실행합니다.
keywords:
  - run agent
  - executive profile
  - execution delegation
  - Agent Tools
  - autonomous agent
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Execution Delegation
  - Solana
  - Metaplex
proficiencyLevel: Intermediate
created: '03-11-2026'
updated: '03-12-2026'
---

이그제큐티브 프로필을 설정하고 실행을 위임하여 Solana에서 에이전트를 실행합니다. {% .lead %}

## 요약

실행 위임을 통해 오프체인 이그제큐티브가 에이전트 자산을 대신하여 트랜잭션에 서명할 수 있으며, 온체인 신원과 오프체인 운영 사이의 격차를 해소합니다.

- **이그제큐티브 프로필 등록** — 지갑당 1회의 온체인 설정으로 검증 가능한 운영자 신원 생성
- **실행 위임** — 자산 소유자가 온체인 위임 레코드를 통해 에이전트를 특정 이그제큐티브에 연결
- **위임 확인** — 위임 레코드 PDA를 파생하여 계정 존재 여부 확인
- [등록된 에이전트](/agents/register-agent)와 `@metaplex-foundation/mpl-agent-registry` 패키지(v0.2.0+)가 **필요**

## 빠른 시작

1. [위임이 필요한 이유](#위임이-필요한-이유) — 위임이 해결하는 문제 이해
2. [이그제큐티브 프로필 등록](#이그제큐티브-프로필-등록) — 지갑당 1회 설정
3. [실행 위임](#실행-위임) — 에이전트를 이그제큐티브에 연결
4. [위임 확인](#위임-확인) — 위임 레코드 존재 확인
5. [전체 예제](#전체-예제) — 엔드투엔드 코드 샘플

## 위임이 필요한 이유

모든 Core 자산에는 내장 지갑([Asset Signer](/smart-contracts/core/execute-asset-signing))이 있습니다 — 개인 키가 없는 PDA이므로 도난될 수 없습니다. Core의 Execute 라이프사이클 훅을 통해 자산 자체만이 해당 지갑에 대해 서명할 수 있습니다.

문제는 Solana가 백그라운드 작업이나 온체인 추론을 지원하지 않는다는 것입니다. 에이전트는 스스로 깨어나서 트랜잭션을 제출할 수 없습니다. 오프체인의 무언가가 이를 수행해야 합니다. 그러나 에이전트 소유자도 모든 작업을 승인하기 위해 컴퓨터 앞에 앉아 있을 필요는 없습니다.

실행 위임이 이 격차를 해소합니다. 소유자는 **이그제큐티브**에게 위임합니다 — Execute 훅을 사용하여 에이전트를 대신하여 트랜잭션에 서명하는 신뢰할 수 있는 오프체인 운영자입니다. 소유자는 모든 트랜잭션을 위해 온라인 상태일 필요 없이 누가 에이전트를 실행하는지 제어합니다.

## 이그제큐티브란?

이그제큐티브는 에이전트 자산을 운영할 수 있는 권한을 가진 지갑을 나타내는 온체인 프로필입니다. 서비스 계정으로 생각하세요: 지갑을 이그제큐티브로 한 번 등록하면 개별 에이전트 소유자가 실행을 위임할 수 있습니다.

이를 통해 **신원**(에이전트가 누구인지)과 **실행**(누가 운영하는지)이 분리됩니다. 이그제큐티브 프로필은 지갑의 공개 키에서 파생된 PDA입니다 — 지갑당 하나. 위임은 자산별로 이루어집니다: 에이전트 소유자가 에이전트를 특정 이그제큐티브에 연결하는 위임 레코드를 생성합니다. 하나의 이그제큐티브가 여러 에이전트를 실행할 수 있으며, 소유자는 에이전트의 신원을 건드리지 않고 이그제큐티브를 전환할 수 있습니다.

모든 이그제큐티브 프로필은 온체인에 존재하므로 레지스트리가 검증 가능한 디렉토리 역할을 합니다. 누구나 프로필을 열거하고, 이그제큐티브가 어떤 에이전트를 운영하는지 확인하고, 위임 이력을 검사할 수 있습니다. 이는 이그제큐티브가 온체인 실적에 따라 평가되는 평판 레이어의 기반을 마련합니다.

## 사전 요구사항

신원 기록과 AgentIdentity 플러그인이 있는 [등록된 에이전트](/agents/register-agent)와 `@metaplex-foundation/mpl-agent-registry` 패키지(v0.2.0+)가 필요합니다.

## 이그제큐티브 프로필 등록

이그제큐티브가 에이전트를 실행하기 전에 프로필이 필요합니다. 이것은 지갑당 1회 설정입니다:

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplAgentTools } from '@metaplex-foundation/mpl-agent-registry';
import { registerExecutiveV1 } from '@metaplex-foundation/mpl-agent-registry';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplAgentTools());

await registerExecutiveV1(umi, {
  payer: umi.payer,
}).sendAndConfirm(umi);
```

프로필 PDA는 시드 `["executive_profile", <authority>]`에서 파생되므로 각 지갑은 하나만 가질 수 있습니다.

## 실행 위임

이그제큐티브 프로필이 준비되면 에이전트 자산 소유자가 실행을 위임할 수 있습니다. 이를 통해 에이전트를 이그제큐티브에 연결하는 온체인 위임 레코드가 생성됩니다:

```typescript
import { delegateExecutionV1 } from '@metaplex-foundation/mpl-agent-registry';
import { findAgentIdentityV1Pda, findExecutiveProfileV1Pda } from '@metaplex-foundation/mpl-agent-registry';

const agentIdentity = findAgentIdentityV1Pda(umi, { asset: agentAssetPublicKey });
const executiveProfile = findExecutiveProfileV1Pda(umi, { authority: executiveAuthorityPublicKey });

await delegateExecutionV1(umi, {
  agentAsset: agentAssetPublicKey,
  agentIdentity,
  executiveProfile,
}).sendAndConfirm(umi);
```

자산 소유자만 실행을 위임할 수 있습니다. 프로그램은 다음을 검증합니다:

- 이그제큐티브 프로필이 존재하는지
- 에이전트 자산이 유효한 MPL Core 자산인지
- 에이전트가 등록된 신원을 가지고 있는지
- 서명자가 자산 소유자인지

## 매개변수

### RegisterExecutiveV1

| 매개변수 | 설명 |
|-----------|-------------|
| `payer` | 렌트 및 수수료 지불 (권한으로도 사용) |
| `authority` | 이 이그제큐티브 프로필을 소유하는 지갑 (기본값: `payer`) |

### DelegateExecutionV1

| 매개변수 | 설명 |
|-----------|-------------|
| `agentAsset` | 등록된 에이전트의 MPL Core 자산 |
| `agentIdentity` | 자산의 에이전트 신원 PDA |
| `executiveProfile` | 위임할 이그제큐티브 프로필 PDA |
| `payer` | 렌트 및 수수료 지불 (기본값: `umi.payer`) |
| `authority` | 자산 소유자여야 함 (기본값: `payer`) |

## 위임 확인

위임이 존재하는지 확인하려면 위임 레코드 PDA를 파생하고 계정이 존재하는지 확인합니다:

```typescript
import {
  findExecutiveProfileV1Pda,
  findExecutionDelegateRecordV1Pda,
} from '@metaplex-foundation/mpl-agent-registry';

const executiveProfile = findExecutiveProfileV1Pda(umi, {
  authority: executiveAuthorityPublicKey,
});

const delegateRecord = findExecutionDelegateRecordV1Pda(umi, {
  executiveProfile,
  agentAsset: agentAssetPublicKey,
});

const account = await umi.rpc.getAccount(delegateRecord);
console.log('Delegated:', account.exists);
```

## 전체 예제

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { generateSigner } from '@metaplex-foundation/umi';
import { create, createCollection } from '@metaplex-foundation/mpl-core';
import { mplAgentIdentity, mplAgentTools } from '@metaplex-foundation/mpl-agent-registry';
import {
  registerIdentityV1,
  registerExecutiveV1,
  delegateExecutionV1,
  findAgentIdentityV1Pda,
  findExecutiveProfileV1Pda,
} from '@metaplex-foundation/mpl-agent-registry';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplAgentIdentity())
  .use(mplAgentTools());

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

// 4. Register executive profile
await registerExecutiveV1(umi, {
  payer: umi.payer,
}).sendAndConfirm(umi);

// 5. Delegate execution
const agentIdentity = findAgentIdentityV1Pda(umi, { asset: asset.publicKey });
const executiveProfile = findExecutiveProfileV1Pda(umi, { authority: umi.payer.publicKey });

await delegateExecutionV1(umi, {
  agentAsset: asset.publicKey,
  agentIdentity,
  executiveProfile,
}).sendAndConfirm(umi);
```

## 참고사항

- 각 지갑은 하나의 이그제큐티브 프로필만 가질 수 있습니다. PDA는 `["executive_profile", <authority>]`에서 파생되므로 같은 지갑으로 `registerExecutiveV1`을 다시 호출하면 실패합니다.
- 위임은 자산별입니다 — 소유자는 이그제큐티브가 운영할 각 에이전트에 대해 별도의 위임 레코드를 생성해야 합니다.
- 자산 소유자만 실행을 위임할 수 있습니다. 프로그램은 온체인에서 소유권을 검증합니다.
- 소유자는 다른 이그제큐티브 프로필로 새 위임 레코드를 생성하여 이그제큐티브를 전환할 수 있습니다.

계정 레이아웃, PDA 파생 세부사항 및 오류 코드에 대해서는 [Agent Tools](/smart-contracts/mpl-agent/tools) 스마트 컨트랙트 레퍼런스를 참조하세요.

*Metaplex 관리 · 2026년 3월 검증 완료 · [GitHub에서 소스 보기](https://github.com/metaplex-foundation/mpl-agent)*
