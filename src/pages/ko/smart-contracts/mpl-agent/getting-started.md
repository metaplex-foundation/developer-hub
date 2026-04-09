---
title: 시작하기
metaTitle: MPL 에이전트 레지스트리 시작하기 | Metaplex
description: MPL 에이전트 레지스트리 SDK를 설치하고 Solana에서 첫 번째 에이전트 신원을 등록합니다.
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
updated: '03-12-2026'
---

SDK를 설치하고 첫 번째 에이전트 신원을 등록합니다. {% .lead %}

## Summary

`@metaplex-foundation/mpl-agent-registry` 패키지를 설치하고, `mplAgentIdentity()`와 `mplAgentTools()` 플러그인으로 Umi를 구성하며, MPL Core 자산에 첫 번째 에이전트 신원을 등록합니다.

- **설치** — npm으로 SDK를 설치하고 `mplAgentIdentity()`와 `mplAgentTools()`로 Umi를 구성합니다
- **생성** — MPL Core 컬렉션과 자산이 아직 없다면 먼저 생성합니다
- **등록** — `registerIdentityV1`로 신원을 등록하고 연결된 `AgentIdentity` 플러그인을 확인합니다
- **필요 조건** — `@metaplex-foundation/umi-bundle-defaults`와 `@metaplex-foundation/mpl-core`가 필요합니다

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

## 신원 등록하기

MPL Core 자산이 필요합니다. 아직 없다면 먼저 생성하세요.

```typescript
import { generateSigner } from '@metaplex-foundation/umi';
import { create, createCollection } from '@metaplex-foundation/mpl-core';
import {
  registerIdentityV1,
  findAgentIdentityV1Pda,
  fetchAgentIdentityV1,
} from '@metaplex-foundation/mpl-agent-registry';

// 컬렉션과 자산 생성
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

// 에이전트 메타데이터를 가리키는 URI로 신원 등록
await registerIdentityV1(umi, {
  asset: asset.publicKey,
  collection: collection.publicKey,
  agentRegistrationUri: 'https://example.com/agent-registration.json',
}).sendAndConfirm(umi);

// 확인
const pda = findAgentIdentityV1Pda(umi, { asset: asset.publicKey });
const identity = await fetchAgentIdentityV1(umi, pda);
console.log(identity.asset); // asset.publicKey와 일치
```

## AgentIdentity 플러그인 확인하기

등록 후 자산에는 URI와 라이프사이클 체크가 있는 `AgentIdentity` 플러그인이 연결됩니다.

```typescript
import { fetchAsset } from '@metaplex-foundation/mpl-core';

const assetData = await fetchAsset(umi, asset.publicKey);

// AgentIdentity 플러그인 확인
const agentIdentity = assetData.agentIdentities?.[0];
console.log(agentIdentity?.uri);               // 'https://example.com/agent-registration.json'
console.log(agentIdentity?.lifecycleChecks?.transfer);  // truthy
console.log(agentIdentity?.lifecycleChecks?.update);    // truthy
console.log(agentIdentity?.lifecycleChecks?.execute);   // truthy
```

## 다음 단계

- **[에이전트 신원](/smart-contracts/mpl-agent/identity)** — 신원 프로그램의 전체 세부 정보
- **[에이전트 도구](/smart-contracts/mpl-agent/tools)** — 임원 프로필 및 실행 위임

*[Metaplex](https://github.com/metaplex-foundation) 관리 · 2026년 3월 최종 확인 · [GitHub에서 소스 보기](https://github.com/metaplex-foundation/mpl-agent)*
