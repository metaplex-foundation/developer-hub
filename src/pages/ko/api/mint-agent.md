---
title: 에이전트 민팅
metaTitle: Metaplex API - 에이전트 민팅 | REST API | Metaplex
description: 에이전트 Core 애셋을 민팅하고 온체인 아이덴티티를 등록하는 부분 서명된 트랜잭션을 빌드합니다.
method: POST
created: '08-01-2026'
updated: '08-01-2026'
keywords:
  - Agent API
  - mint agent
  - agent registration
  - EIP-8004
about:
  - API endpoint
  - Agent minting
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

에이전트를 위한 MPL Core 애셋을 민팅하고 Agent Registry에 아이덴티티를 등록하는 트랜잭션을 한 단계로 빌드합니다. API는 에이전트 메타데이터를 오프체인에 저장하고, 지갑이 지불자(payer)로 공동 서명할 부분 서명된 트랜잭션을 반환합니다. {% .lead %}

## Summary

이 엔드포인트는 [에이전트 민팅하기](/agents/mint-agent) 가이드의 기반이 되는 엔드포인트입니다.

- 단일 트랜잭션에서 Core 애셋을 생성하고 `registerIdentity`를 호출
- 애셋 키페어는 서버 측에서 생성되어 사전 서명되므로 응답에 최종 `assetAddress`가 포함됨
- EIP-8004 메타데이터와 호스팅된 [A2A AgentCard](/ko/api/get-agent-card)를 저장 (직접 제공하거나 메타데이터로부터 합성)
- 호출자의 지갑이 지불자로 서명하고 트랜잭션을 제출

## Quick Reference

| 항목 | 값 |
|------|-------|
| **메서드** | `POST` |
| **경로** | `/agents/mint` |
| **인증** | 불필요 |
| **응답** | 직렬화된 트랜잭션 + `assetAddress` |

## 엔드포인트

```
POST /agents/mint
```

## 요청 본문

| 필드 | 타입 | 필수 | 설명 |
|-------|------|----------|-------------|
| `wallet` | `string` | 예 | 에이전트 비용을 지불하고 소유할 지갑 (base58) |
| `network` | `string` | 예 | `solana-mainnet` 또는 `solana-devnet` |
| `name` | `string` | 예 | Core 애셋의 에이전트 이름 |
| `uri` | `string` | 예 | 애셋의 오프체인 JSON 메타데이터 URI |
| `agentMetadata` | `object` | 예 | EIP-8004 에이전트 등록 JSON (name, description, image, services, registrations, active, …) |
| `collectionAddress` | `string` | 아니요 | 에이전트를 민팅해 넣을 Core 컬렉션 |
| `a2aCard` | `object` | 아니요 | 미리 작성한 A2A AgentCard. 생략 시 `agentMetadata`로부터 합성됩니다. |

## 요청 예시

```bash
curl -X POST "https://api.metaplex.com/v1/agents/mint" \
  -H "Content-Type: application/json" \
  -d '{
    "wallet": "4Nd1mYvJ9jVexjIXG5oJhanoGWyF7Cz6XkY8dEc4RsyG",
    "network": "solana-devnet",
    "name": "Example Agent",
    "uri": "https://example.com/agent-metadata.json",
    "agentMetadata": {
      "name": "Example Agent",
      "description": "An autonomous trading agent.",
      "active": true,
      "services": [],
      "registrations": []
    }
  }'
```

## 응답

```json
{
  "success": true,
  "tx": "<base64-encoded partially signed transaction>",
  "blockhash": {
    "blockhash": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    "lastValidBlockHeight": 123456789
  },
  "assetAddress": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
}
```

## 서명 및 제출 {% #signing-and-submitting %}

반환된 트랜잭션은 이미 애셋 키페어로 서명되어 있습니다. 지갑이 지불자로 공동 서명한 후 제출합니다:

```ts
import { base64 } from "@metaplex-foundation/umi/serializers";

const res = await fetch("https://api.metaplex.com/v1/agents/mint", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(input),
});
const result = await res.json();
if (!result.success) throw new Error(result.error);

const tx = umi.transactions.deserialize(base64.serialize(result.tx));
const signed = await umi.identity.signTransaction(tx);
await umi.rpc.sendTransaction(signed);
```

## 오류

| 상태 | 본문 | 의미 |
|--------|------|---------|
| `400` | `{ "success": false, "error": "Invalid input data", "details": [...] }` | 요청 본문이 유효성 검사에 실패했습니다. `details`에 문제 목록이 나열됩니다. |
| `400` | `{ "success": false, "error": "<message>" }` | 빌드 실패 (예: 컬렉션을 찾을 수 없음). |
| `500` | `{ "success": false, "error": "Failed to prepare mint agent" }` | 서버 오류. |

## Notes

- Metaplex 레지스트리 항목(`solana:101:metaplex`)이 `agentMetadata.registrations`의 맨 앞에 자동으로 추가됩니다.
- EIP-8004 소비자가 [AgentCard 엔드포인트](/ko/api/get-agent-card)를 발견할 수 있도록 호스팅된 A2A 서비스 항목이 `services[]`에 삽입됩니다. 이미 직접 작성한 경우에는 아무 작업도 수행하지 않습니다.
- 에이전트 레코드는 이 엔드포인트를 호출할 때 저장되지만, 서명된 트랜잭션이 확인되고 인덱싱된 후에야 [List Agents](/ko/api/list-agents)에 나타납니다.
- SDK를 사용한 단계별 안내는 [에이전트 민팅하기](/agents/mint-agent)를 참조하세요.
