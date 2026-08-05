---
title: 에이전트 자금 지원
metaTitle: Metaplex API - 에이전트 지갑 자금 지원 | REST API | Metaplex
description: 등록된 에이전트의 지갑에 자금을 보내는 SOL 전송 트랜잭션을 온체인 메모와 함께 빌드합니다.
method: POST
created: '08-01-2026'
updated: '08-01-2026'
keywords:
  - Agent API
  - fund agent
  - agent wallet
  - SOL transfer
about:
  - API endpoint
  - Agent finance
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

송신자 지갑에서 에이전트의 서명자 PDA 지갑으로 SOL을 전송하는 트랜잭션을 온체인 메모와 함께 빌드합니다. 누구나 어떤 에이전트에든 자금을 보낼 수 있습니다. {% .lead %}

## Summary

- 에이전트의 지갑 PDA로 SOL 전송 (에이전트 주소로부터 서버 측에서 확인됨)
- 출처 표시를 위해 송신자가 서명하는 필수 메모 명령어 첨부
- 송신자가 서명하고 제출할 미서명 트랜잭션 반환

## Quick Reference

| 항목 | 값 |
|------|-------|
| **메서드** | `POST` |
| **경로** | `/agents/{address}/fund` |
| **인증** | 불필요 |
| **응답** | 직렬화된 트랜잭션 |

## 엔드포인트

```
POST /agents/{address}/fund
```

## 경로 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|-----------|------|----------|-------------|
| `address` | `string` | 예 | 에이전트의 Core 애셋 민트 주소 (base58) |

## 요청 본문

| 필드 | 타입 | 필수 | 설명 |
|-------|------|----------|-------------|
| `sender` | `string` | 예 | SOL을 보내는 지갑 (base58). 트랜잭션에 서명합니다. |
| `amount` | `number` | 예 | SOL 단위 금액. 양수여야 합니다. |
| `memo` | `string` | 예 | 온체인에 기록되는 메모, 1–256자. |
| `network` | `string` | 아니요 | `solana-mainnet`(기본값) 또는 `solana-devnet` |

## 요청 예시

```bash
curl -X POST "https://api.metaplex.com/v1/agents/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN/fund" \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "4Nd1mYvJ9jVexjIXG5oJhanoGWyF7Cz6XkY8dEc4RsyG",
    "amount": 0.5,
    "memo": "Operating budget for July"
  }'
```

## 응답

```json
{
  "success": true,
  "tx": "<base64-encoded transaction>",
  "blockhash": {
    "blockhash": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    "lastValidBlockHeight": 123456789
  }
}
```

송신자가 트랜잭션을 역직렬화하고 서명한 후 제출합니다. [서명 및 제출](/ko/api/mint-agent#signing-and-submitting)을 참조하세요.

## 오류

| 상태 | 본문 | 의미 |
|--------|------|---------|
| `400` | `{ "success": false, "error": "Invalid input data" }` | 본문이 유효성 검사에 실패했습니다 (잘못된 공개 키, 양수가 아닌 금액, 메모 누락). |
| `404` | `{ "success": false, "error": "Agent not found" }` | 지정한 네트워크의 해당 주소에 등록된 에이전트가 없습니다. |
| `500` | `{ "success": false, "error": "Failed to prepare fund transaction" }` | 서버 오류. |

## Notes

- 전송 대상은 Core 애셋 주소가 아닌 에이전트의 **지갑 PDA**입니다. API가 자동으로 확인해 줍니다.
- 자금을 다시 빼내려면 에이전트 소유자가 [에이전트 출금](/ko/api/withdraw-agent)를 사용합니다.
- 에이전트 지갑의 개념에 대해서는 [에이전트 파이낸스](/ko/agents/agent-finance)를 참조하세요.
