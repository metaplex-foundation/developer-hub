---
title: 에이전트 목록
metaTitle: Metaplex API - 에이전트 목록 | REST API | Metaplex
description: 등록된 AI 에이전트를 탐색하고 검색합니다. 메타데이터, 필터, 정렬 기능이 있는 페이지네이션된 에이전트 레코드를 반환합니다.
method: GET
created: '08-01-2026'
updated: '08-01-2026'
keywords:
  - Agent API
  - agent registry
  - agent search
  - agent listings
about:
  - API endpoint
  - Agent listings
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---

에이전트 레지스트리를 탐색하고 검색합니다. 인덱싱된 데이터베이스에서 페이지네이션된 에이전트 레코드를 반환하며, 기본적으로 최신 등록순으로 정렬됩니다. {% .lead %}

## Summary

전문(full-text) 검색, 필터, 정렬 옵션과 함께 등록된 에이전트 목록을 조회합니다. 결과는 항상 페이지네이션됩니다.

- `query`로 이름 검색
- `activeOnly`, `hasAgentToken`, `hasServices`, `spotlight`로 필터링
- 등록 시점 기준 `latest`(기본값) 또는 `oldest` 정렬
- 기본값은 1페이지, 페이지당 24개 결과 (`pageSize` 최대 100)

## Quick Reference

| 항목 | 값 |
|------|-------|
| **메서드** | `GET` |
| **경로** | `/agents` |
| **인증** | 불필요 |
| **응답** | 페이지네이션된 `AgentRecord[]` |
| **페이지네이션** | `page` / `pageSize` |

## 엔드포인트

```
GET /agents
```

## 쿼리 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|-----------|------|----------|-------------|
| `network` | `string` | 아니요 | 조회할 네트워크. 기본값: `solana-mainnet`. 데브넷의 경우 `solana-devnet`을 사용하세요. |
| `page` | `number` | 아니요 | 페이지 번호, `1`부터 시작. 기본값: `1`. |
| `pageSize` | `number` | 아니요 | 페이지당 결과 수, `1`–`100`. 기본값: `24`. |
| `query` | `string` | 아니요 | 에이전트 이름에 대한 자유 텍스트 검색. |
| `sort` | `string` | 아니요 | 등록 시점 기준 `latest`(기본값) 또는 `oldest`. |
| `activeOnly` | `boolean` | 아니요 | EIP-8004 메타데이터에서 활성으로 표시된 에이전트만. |
| `hasAgentToken` | `boolean` | 아니요 | 기본 에이전트 토큰이 설정된 에이전트만. |
| `hasServices` | `boolean` | 아니요 | 서비스 엔드포인트를 공개한 에이전트만. |
| `spotlight` | `boolean` | 아니요 | 디스커버 페이지에서 스포트라이트된 에이전트만. |

## 요청 예시

```bash
curl "https://api.metaplex.com/v1/agents?pageSize=10&sort=latest&activeOnly=true"
```

## 응답

```json
{
  "success": true,
  "data": {
    "agents": [
      {
        "mintAddress": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN",
        "network": "solana-mainnet",
        "name": "Example Agent",
        "description": "An autonomous trading agent.",
        "image": "https://example.com/agent.png",
        "walletAddress": "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        "authority": "4Nd1mYvJ9jVexjIXG5oJhanoGWyF7Cz6XkY8dEc4RsyG",
        "agentToken": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        "agentMetadataUri": "https://api.metaplex.com/v1/agents/7nE9.../agent-card.json",
        "metadata": { "…": "EIP-8004 registration JSON" },
        "a2aCard": { "…": "A2A AgentCard (spec §4.4)" },
        "isActive": true,
        "registrationSignature": "5J8…",
        "indexedAt": "2026-07-01T12:00:00.000Z",
        "spotlightedAt": null,
        "verifiedAt": null,
        "createdAt": "2026-07-01T11:59:58.000Z",
        "updatedAt": "2026-07-15T09:30:00.000Z"
      }
    ],
    "total": 132,
    "page": 1,
    "pageSize": 10,
    "totalPages": 14
  }
}
```

## 응답 타입

### TypeScript

```ts
interface PaginatedAgentsResponse {
  success: true;
  data: {
    agents: AgentRecord[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

interface AgentRecord {
  /** Core asset mint address (the NFT representing this agent) */
  mintAddress: string;
  network: string;
  name: string;
  description: string;
  image: string | null;
  /** The agent's signer PDA wallet, derived from the Core asset */
  walletAddress: string;
  /** Update authority of the Core asset */
  authority: string | null;
  /** Primary token mint, set via the setAgentToken instruction */
  agentToken: string | null;
  agentMetadataUri: string | null;
  /** EIP-8004 agent registration JSON */
  metadata: Record<string, unknown> | null;
  /** Hosted A2A AgentCard (spec §4.4) */
  a2aCard: Record<string, unknown> | null;
  isActive: boolean;
  registrationSignature: string | null;
  indexedAt: string | null;
  spotlightedAt: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
```

## 사용 예시

### TypeScript

```ts
const response = await fetch(
  "https://api.metaplex.com/v1/agents?pageSize=10&activeOnly=true"
);
const result: PaginatedAgentsResponse = await response.json();
if (result.success) {
  const { agents, total, totalPages } = result.data;
  console.log(`${agents.length} of ${total} agents (${totalPages} pages)`);
}
```

### Rust

```rust
let response = reqwest::get(
    "https://api.metaplex.com/v1/agents?pageSize=10&activeOnly=true"
)
.await?
.json::<serde_json::Value>()
.await?;

if response["success"].as_bool() == Some(true) {
    if let Some(agents) = response["data"]["agents"].as_array() {
        println!("{} agents on this page", agents.len());
    }
} else {
    eprintln!("API error: {}", response["error"]);
}
```

## Notes

- 결과는 실시간 온체인 스캔이 아닌 인덱싱된 데이터베이스에서 가져옵니다. 새로 민팅된 에이전트는 등록 트랜잭션이 인덱싱된 후에 나타납니다.
- 불리언 필터는 `true`/`false` 문자열 값을 허용합니다.
- 응답은 `success` 엔벨로프를 사용합니다. 자세한 내용은 [Agent API 개요](/ko/api)를 참조하세요.
