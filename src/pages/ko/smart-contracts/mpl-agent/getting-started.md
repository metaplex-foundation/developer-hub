---
title: 시작하기
metaTitle: MPL Agent Registry 시작하기 | Metaplex
description: MPL Agent Registry SDK를 설치하고 Solana에서 첫 번째 에이전트 신원을 등록합니다.
keywords:
  - MPL Agent Registry
  - getting started
  - agent identity SDK
  - Umi
  - Solana
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Smart Contracts
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '02-25-2026'
updated: '03-30-2026'
---

SDK를 설치하고 첫 번째 에이전트 신원을 등록합니다. {% .lead %}

## 요약

`@metaplex-foundation/mpl-agent-registry` 패키지를 설치하고, Umi를 identity 및 tools 플러그인으로 구성한 다음, MPL Core 자산에 첫 번째 에이전트 신원을 등록합니다.

- SDK를 npm으로 **설치**하고 Umi를 `mplAgentIdentity()` 및 `mplAgentTools()`로 구성합니다
- 아직 없다면 MPL Core 컬렉션과 자산을 **생성**합니다
- `registerIdentityV1`로 신원을 **등록**하고 첨부된 `AgentIdentity` 플러그인을 확인합니다
- `@metaplex-foundation/umi-bundle-defaults` 및 `@metaplex-foundation/mpl-core`가 **필요**합니다

## 설치

```shell
npm install @metaplex-foundation/mpl-agent-registry
```

## 설정

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCore } from '@metaplex-foundation/mpl-core';
import { mplAgentIdentity, mplAgentTools } from '@metaplex-foundation/mpl-agent-registry';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplCore())
  .use(mplAgentIdentity())
  .use(mplAgentTools());
```

## 신원 등록

MPL Core 자산이 필요합니다. 아직 없다면 먼저 생성하세요:

```typescript
import { generateSigner } from '@metaplex-foundation/umi';
import { create, createCollection } from '@metaplex-foundation/mpl-core';
import {
  registerIdentityV1,
  findAgentIdentityV1Pda,
  fetchAgentIdentityV1,
} from '@metaplex-foundation/mpl-agent-registry';

// Create a collection and asset
const collection = generateSigner(umi);
const asset = generateSigner(umi);

await createCollection(umi, {
  collection,
  name: 'Agent Collection',
  uri: 'https://example.com/collection.json',
}).sendAndConfirm(umi);

await create(umi, {
  asset,
  name: 'My Agent',
  uri: 'https://example.com/agent.json',
  collection,
}).sendAndConfirm(umi);

// Register the identity with a URI pointing to agent metadata
await registerIdentityV1(umi, {
  asset: asset.publicKey,
  collection: collection.publicKey,
  agentRegistrationUri: 'https://example.com/agent-registration.json',
}).sendAndConfirm(umi);

// Verify
const pda = findAgentIdentityV1Pda(umi, { asset: asset.publicKey });
const identity = await fetchAgentIdentityV1(umi, pda);
console.log(identity.asset); // matches asset.publicKey
```

## AgentIdentity 플러그인 확인

등록 후 자산에는 URI와 라이프사이클 검사가 포함된 `AgentIdentity` 플러그인이 첨부됩니다:

```typescript
import { fetchAsset } from '@metaplex-foundation/mpl-core';

const assetData = await fetchAsset(umi, asset.publicKey);

// Check the AgentIdentity plugin
const agentIdentity = assetData.agentIdentities?.[0];
console.log(agentIdentity?.uri);               // 'https://example.com/agent-registration.json'
console.log(agentIdentity?.lifecycleChecks?.transfer);  // truthy
console.log(agentIdentity?.lifecycleChecks?.update);    // truthy
console.log(agentIdentity?.lifecycleChecks?.execute);   // truthy
```

## 다음 단계

- **[Agent Identity](/smart-contracts/mpl-agent/identity)** — 신원 프로그램에 대한 전체 세부사항
- **[Agent Tools](/smart-contracts/mpl-agent/tools)** — Executive 프로필 및 실행 위임
