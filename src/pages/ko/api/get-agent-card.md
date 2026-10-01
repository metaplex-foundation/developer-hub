---
title: AgentCard 조회
metaTitle: Metaplex API - A2A AgentCard 조회 | REST API | Metaplex
description: 등록된 에이전트의 호스팅된 A2A AgentCard를 조회합니다. ETag 캐싱을 지원하는 표준 준수 AgentCard JSON입니다.
method: GET
created: '08-01-2026'
updated: '08-01-2026'
keywords:
  - Agent API
  - A2A
  - AgentCard
  - agent discovery
about:
  - API endpoint
  - A2A protocol
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

등록된 에이전트의 호스팅된 A2A AgentCard를 조회합니다. A2A 클라이언트가 직접 사용할 수 있도록 원시 AgentCard JSON(A2A 스펙 §4.4)을 반환합니다. {% .lead %}

## Summary

Metaplex는 앱을 통해 등록된 에이전트를 위해 A2A AgentCard를 호스팅합니다. EIP-8004 소비자는 에이전트의 `services[]` 항목을 통해 이 엔드포인트를 발견합니다.

- 저장된 그대로의 AgentCard 반환 — 응답 엔벨로프 없음
- `ETag` / `If-None-Match`를 통한 조건부 요청 지원 (`304 Not Modified`)
- 에이전트에 호스팅된 카드가 없으면 `404` 반환

## Quick Reference

| 항목 | 값 |
|------|-------|
| **메서드** | `GET` |
| **경로** | `/agents/{address}/agent-card.json` |
| **인증** | 불필요 |
| **응답** | A2A AgentCard JSON |
| **캐싱** | `max-age=60, stale-while-revalidate=600`, ETag |

## 엔드포인트

```
GET /agents/{address}/agent-card.json
```

## 경로 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|-----------|------|----------|-------------|
| `address` | `string` | 예 | 에이전트의 Core 애셋 민트 주소 (base58) |

## 쿼리 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|-----------|------|----------|-------------|
| `network` | `string` | 아니요 | 조회할 네트워크. 기본값: `solana-mainnet`. 데브넷의 경우 `solana-devnet`을 사용하세요. |

## 요청 예시

```bash
curl "https://api.metaplex.com/v1/agents/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN/agent-card.json"
```

## 응답

[A2A AgentCard](https://a2a-protocol.org/latest/specification/#44-agentcard) 객체:

```json
{
  "name": "Example Agent",
  "description": "An autonomous trading agent.",
  "url": "https://api.metaplex.com/v1/agents/7nE9.../agent-card.json",
  "version": "1.0.0",
  "capabilities": { "streaming": false },
  "skills": [
    {
      "id": "trade",
      "name": "Trade tokens",
      "description": "Executes token swaps on Solana.",
      "tags": ["solana", "trading"]
    }
  ],
  "defaultInputModes": ["text/plain"],
  "defaultOutputModes": ["text/plain"]
}
```

## 조건부 요청

응답에는 `ETag` 헤더가 포함됩니다. 이를 `If-None-Match`로 다시 보내면 카드가 변경되지 않았을 때 `304 Not Modified`를 받습니다:

```bash
curl -H 'If-None-Match: "m3k9x1"' \
  "https://api.metaplex.com/v1/agents/7nE9.../agent-card.json"
```

## 오류

| 상태 | 의미 |
|--------|---------|
| `304` | 제공한 ETag 이후 카드가 변경되지 않았습니다. |
| `404` | 에이전트를 찾을 수 없거나 에이전트에 호스팅된 AgentCard가 없습니다. |

## Notes

- 이 엔드포인트는 의도적으로 `success` 엔벨로프를 **사용하지 않습니다**. A2A 디스커버리 규약에 따라 본문 자체가 AgentCard입니다.
- 카드는 민팅 시 에이전트 생성자가 직접 작성하거나 에이전트의 등록 메타데이터로부터 합성됩니다.
