---
title: Get Agent
metaTitle: Metaplex API - Get Agent | REST API | Metaplex
description: Core 애셋 주소로 등록된 단일 에이전트를 조회합니다. EIP-8004 등록 데이터, 생성한 토큰, 기본 에이전트 토큰을 포함합니다.
method: GET
created: '08-01-2026'
updated: '08-01-2026'
keywords:
  - Agent API
  - agent detail
  - EIP-8004
  - agent registry
about:
  - API endpoint
  - Agent data
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---

Core 애셋 주소로 등록된 단일 에이전트를 조회합니다. 에이전트의 아이덴티티, EIP-8004 등록 메타데이터, 에이전트가 생성한 토큰, 기본 에이전트 토큰을 반환합니다. {% .lead %}

## Summary

온체인 아이덴티티와 인덱싱된 메타데이터를 결합하여 한 에이전트의 전체 상세 정보를 조회합니다.

- 에이전트 아이덴티티: 이름, 설명, 이미지, 소유자, 권한(authority), 서명자 PDA 지갑
- EIP-8004 등록 JSON 필드가 응답에 병합됨
- `tokens` — 에이전트가 런칭한 모든 토큰을 `BaseToken` 객체로 반환
- `agentTokenInfo` — 런칭 목록 또는 온체인 메타데이터에서 확인된 에이전트의 기본 토큰

## Quick Reference

| 항목 | 값 |
|------|-------|
| **메서드** | `GET` |
| **경로** | `/agents/{address}` |
| **인증** | 불필요 |
| **응답** | 에이전트 상세 객체 |
| **페이지네이션** | 없음 |

## 엔드포인트

```
GET /agents/{address}
```

## 경로 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|-----------|------|----------|-------------|
| `address` | `string` | Yes | 에이전트의 Core 애셋 민트 주소 (base58) |

## 쿼리 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|-----------|------|----------|-------------|
| `network` | `string` | No | 조회할 네트워크. 기본값: `solana-mainnet`. 데브넷의 경우 `solana-devnet`을 사용하세요. |

## 요청 예시

```bash
curl "https://api.metaplex.com/v1/agents/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
```

## 응답

```json
{
  "success": true,
  "address": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN",
  "name": "Example Agent",
  "description": "An autonomous trading agent.",
  "image": "https://example.com/agent.png",
  "walletAddress": "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
  "owner": "4Nd1mYvJ9jVexjIXG5oJhanoGWyF7Cz6XkY8dEc4RsyG",
  "authority": "4Nd1mYvJ9jVexjIXG5oJhanoGWyF7Cz6XkY8dEc4RsyG",
  "agentMetadataUri": "https://api.metaplex.com/v1/agents/7nE9.../agent-card.json",
  "agentToken": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "a2aCard": { "…": "A2A AgentCard (spec §4.4), when hosted" },
  "verifiedAt": null,
  "tokens": [
    {
      "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "name": "Agent Token",
      "symbol": "AGT",
      "image": "https://example.com/token.png",
      "description": "The agent's primary token."
    }
  ],
  "agentTokenInfo": {
    "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "name": "Agent Token",
    "symbol": "AGT",
    "image": "https://example.com/token.png",
    "description": "The agent's primary token."
  }
}
```

## 응답 타입

### TypeScript

```ts
interface AgentResponse {
  success: true;
  /** Core asset address (the NFT representing this agent) */
  address: string;
  name: string;
  description: string;
  image?: string;
  /** The agent's signer PDA wallet (derived from the Core asset) */
  walletAddress: string;
  /** Owner of the Core asset */
  owner: string;
  /** Update authority of the Core asset */
  authority?: string;
  agentMetadataUri?: string;
  /** Primary token mint from on-chain agent identity */
  agentToken?: string;
  /** Hosted A2A AgentCard (spec §4.4) — only when hosted by Metaplex */
  a2aCard?: Record<string, unknown> | null;
  /** When an admin verified this agent */
  verifiedAt?: string | null;
  /** Tokens the agent has launched */
  tokens: BaseToken[];
  /** The agent's primary token, when set */
  agentTokenInfo?: BaseToken;
  // …plus any additional EIP-8004 registration fields
}

interface BaseToken {
  address: string;
  name: string;
  symbol: string;
  image: string;
  description: string;
}
```

## 사용 예시

### TypeScript

```ts
const response = await fetch(
  "https://api.metaplex.com/v1/agents/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
);
const agent: AgentResponse = await response.json();
if (agent.success) {
  console.log(agent.name, agent.walletAddress);
  console.log(`${agent.tokens.length} tokens launched`);
}
```

### Rust

```rust
let agent = reqwest::get(
    "https://api.metaplex.com/v1/agents/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
)
.await?
.json::<serde_json::Value>()
.await?;

println!("{} — wallet {}", agent["name"], agent["walletAddress"]);
```

## 오류

| 상태 | 본문 | 의미 |
|--------|------|---------|
| `404` | `{ "success": false, "error": "Agent not found" }` | 지정한 네트워크의 해당 주소에 등록된 에이전트가 없습니다. |
| `500` | `{ "success": false, "error": "Failed to fetch agent" }` | 서버 오류. |

## Notes

- 응답은 온체인 에이전트 아이덴티티와 에이전트의 EIP-8004 등록 JSON을 병합하므로, 문서화된 필드 외에 추가 메타데이터 필드가 나타날 수 있습니다.
- 에이전트 토큰이 에이전트 자신의 런칭 목록에 없는 경우 `agentTokenInfo`는 온체인 토큰 메타데이터로 대체됩니다.
- 응답은 캐싱됩니다. 최근의 온체인 변경 사항이 반영되기까지 짧은 지연이 있을 수 있습니다.
