---
title: 에이전트 데이터 읽기
metaTitle: Solana에서 에이전트 데이터 읽기 | Metaplex Agent Registry
description: Solana에서 에이전트 등록을 확인하고 에이전트 신원 데이터를 읽습니다.
keywords:
  - read agent data
  - agent identity
  - AgentIdentity plugin
  - Asset Signer
  - agent wallet
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Agent Data
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '02-25-2026'
updated: '03-12-2026'
---

[등록](/agents/create-agent) 후 온체인에서 에이전트 신원 데이터를 읽고 확인합니다. {% .lead %}

## 요약

에이전트 신원 데이터 읽기, 등록 상태 확인, AgentIdentity 플러그인 검사, 오프체인 등록 문서 가져오기, 에이전트의 내장 지갑 주소 파생.

- `safeFetchAgentIdentityV1`을 사용하여 **등록 확인** — 미등록 자산에 대해 `null` 반환
- 가져온 Core 자산에서 URI와 라이프사이클 훅을 직접 확인하여 **AgentIdentity 플러그인 검사**
- 온체인 URI에서 **등록 문서 가져오기**로 에이전트 메타데이터와 서비스 엔드포인트 읽기
- `findAssetSignerPda`를 사용하여 **에이전트의 지갑 파생** — 개인 키가 없는 PDA가 에이전트의 자금 보유

## 등록 확인

안전 가져오기 메서드는 신원이 존재하지 않을 때 throw 대신 `null`을 반환하여 자산이 등록되었는지 확인하는 데 유용합니다:

```typescript
import { safeFetchAgentIdentityV1, findAgentIdentityV1Pda } from '@metaplex-foundation/mpl-agent-registry';

const pda = findAgentIdentityV1Pda(umi, { asset: assetPublicKey });
const identity = await safeFetchAgentIdentityV1(umi, pda);

console.log('Registered:', identity !== null);
```

## 시드에서 가져오기

PDA를 수동으로 파생하지 않고 자산의 공개 키에서 직접 신원을 가져올 수도 있습니다:

```typescript
import { fetchAgentIdentityV1FromSeeds } from '@metaplex-foundation/mpl-agent-registry';

const identity = await fetchAgentIdentityV1FromSeeds(umi, {
  asset: assetPublicKey,
});
```

## AgentIdentity 플러그인 확인

등록은 Core 자산에 `AgentIdentity` 플러그인을 첨부합니다. 가져온 자산에서 직접 읽어 등록 URI와 라이프사이클 훅을 검사할 수 있습니다:

```typescript
import { fetchAsset } from '@metaplex-foundation/mpl-core';

const assetData = await fetchAsset(umi, assetPublicKey);

const agentIdentity = assetData.agentIdentities?.[0];
console.log(agentIdentity?.uri);               // registration URI
console.log(agentIdentity?.lifecycleChecks?.transfer);  // truthy
console.log(agentIdentity?.lifecycleChecks?.update);    // truthy
console.log(agentIdentity?.lifecycleChecks?.execute);   // truthy
```

## 등록 문서 읽기

`AgentIdentity` 플러그인의 `uri`는 에이전트의 전체 프로필(이름, 설명, 서비스 엔드포인트 등)을 포함하는 오프체인 JSON 문서를 가리킵니다. 다른 URI처럼 가져옵니다:

```typescript
import { fetchAsset } from '@metaplex-foundation/mpl-core';

const assetData = await fetchAsset(umi, assetPublicKey);
const agentIdentity = assetData.agentIdentities?.[0];

if (agentIdentity?.uri) {
  const response = await fetch(agentIdentity.uri);
  const registration = await response.json();

  console.log(registration.name);          // "Plexpert"
  console.log(registration.description);   // "An informational agent..."
  console.log(registration.active);        // true

  for (const service of registration.services) {
    console.log(service.name);             // "web", "A2A", "MCP", etc.
    console.log(service.endpoint);         // service URL
    console.log(service.version);          // protocol version (if set)
  }
}
```

이 문서는 [ERC-8004](https://eips.ethereum.org/EIPS/eip-8004) 에이전트 등록 표준을 따릅니다. 일반적인 형태는 다음과 같습니다:

```json
{
  "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  "name": "An informational agent providing help related to Metaplex protocols and tools.",
  "description": "An autonomous agent that executes DeFi strategies on Solana.",
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
    }
  ],
  "active": true,
  "registrations": [
    {
      "agentId": "<MINT_ADDRESS>",
      "agentRegistry": "solana:101:metaplex"
    }
  ],
  "supportedTrust": ["reputation", "crypto-economic"]
}
```

전체 필드 레퍼런스는 [에이전트 등록](/agents/create-agent#agent-registration-document)을 참조하세요.

## 에이전트의 지갑 가져오기

모든 Core 자산에는 **Asset Signer**라는 내장 지갑이 있습니다 — 자산의 공개 키에서 파생된 PDA입니다. 개인 키가 존재하지 않으므로 도난될 수 없습니다. 지갑은 SOL, 토큰 또는 기타 자산을 보유할 수 있습니다. `findAssetSignerPda`로 주소를 파생합니다:

```typescript
import { findAssetSignerPda } from '@metaplex-foundation/mpl-core';

const assetSignerPda = findAssetSignerPda(umi, { asset: assetPublicKey });

const balance = await umi.rpc.getBalance(assetSignerPda);
console.log('Agent wallet:', assetSignerPda);
console.log('Balance:', balance.basisPoints.toString(), 'lamports');
```

주소는 결정론적이므로 누구나 자산의 공개 키에서 주소를 파생하여 자금을 보내거나 잔액을 확인할 수 있습니다. 이 지갑에 대해 서명할 수 있는 것은 위임된 [이그제큐티브](/agents/run-an-agent)를 통한 Core의 [Execute](/smart-contracts/core/execute-asset-signing) 명령에 의한 자산 자체뿐입니다.

계정 레이아웃, PDA 파생 세부사항 및 오류 코드에 대해서는 [MPL Agent Registry](/smart-contracts/mpl-agent) 스마트 컨트랙트 문서를 참조하세요.

## 참고사항

- Asset Signer는 PDA입니다 — 개인 키가 존재하지 않습니다. 모든 소스에서 자금을 받을 수 있지만, Core의 [Execute](/smart-contracts/core/execute-asset-signing) 명령을 통해 자산 자체만이 발신 트랜잭션에 서명할 수 있습니다.
- `safeFetchAgentIdentityV1`은 미등록 자산에 대해 throw 대신 `null`을 반환하여 try/catch 없이 존재 여부를 안전하게 확인할 수 있습니다.
- `findAssetSignerPda`는 지갑 주소를 결정론적으로 파생합니다. 네트워크에 관계없이 동일한 주소가 반환되므로 동일한 자산 키로 devnet과 mainnet 모두에서 사용할 수 있습니다.
