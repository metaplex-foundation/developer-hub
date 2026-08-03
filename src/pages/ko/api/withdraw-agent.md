---
title: Withdraw from Agent
metaTitle: Metaplex API - Withdraw from Agent Wallet | REST API | Metaplex
description: 에이전트 지갑에서 소유자에게 SOL을 출금하는 트랜잭션을 빌드합니다. 소유자 전용입니다.
method: POST
created: '08-01-2026'
updated: '08-01-2026'
keywords:
  - Agent API
  - withdraw
  - agent wallet
  - execute
about:
  - API endpoint
  - Agent finance
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

에이전트의 서명자 PDA 지갑에서 에이전트 소유자에게 SOL을 다시 전송하는 트랜잭션을 빌드합니다. 에이전트 Core 애셋의 현재 소유자만 출금할 수 있습니다. {% .lead %}

## Summary

- 에이전트의 지갑 PDA가 서명할 수 있도록 SOL 전송을 `execute` 명령어로 래핑
- 트랜잭션이 빌드되기 전에 Core 애셋을 기준으로 서버 측에서 소유권 검증
- 소유자가 서명하고 제출할 미서명 트랜잭션 반환

## Quick Reference

| 항목 | 값 |
|------|-------|
| **메서드** | `POST` |
| **경로** | `/agents/{address}/withdraw` |
| **인증** | 불필요 (소유권은 온체인 및 빌드 시점에 강제됨) |
| **응답** | 직렬화된 트랜잭션 |

## 엔드포인트

```
POST /agents/{address}/withdraw
```

## 경로 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|-----------|------|----------|-------------|
| `address` | `string` | Yes | 에이전트의 Core 애셋 민트 주소 (base58) |

## 요청 본문

| 필드 | 타입 | 필수 | 설명 |
|-------|------|----------|-------------|
| `sender` | `string` | Yes | 에이전트 소유자의 지갑 (base58). SOL을 수령하고 트랜잭션에 서명합니다. |
| `amount` | `number` | Yes | SOL 단위 금액. 양수여야 합니다. |
| `network` | `string` | No | `solana-mainnet`(기본값) 또는 `solana-devnet` |

## 요청 예시

```bash
curl -X POST "https://api.metaplex.com/v1/agents/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN/withdraw" \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "4Nd1mYvJ9jVexjIXG5oJhanoGWyF7Cz6XkY8dEc4RsyG",
    "amount": 0.25
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

소유자가 트랜잭션을 역직렬화하고 서명한 후 제출합니다. [서명 및 제출](/api/mint-agent#signing-and-submitting)을 참조하세요.

## 오류

| 상태 | 본문 | 의미 |
|--------|------|---------|
| `400` | `{ "success": false, "error": "Invalid input data" }` | 본문 또는 주소가 유효성 검사에 실패했습니다. |
| `403` | `{ "success": false, "error": "Only the agent owner can withdraw funds" }` | `sender`가 에이전트의 Core 애셋을 소유하고 있지 않습니다. |
| `404` | `{ "success": false, "error": "Agent not found" }` | 지정한 네트워크의 해당 주소에 Core 애셋이 없습니다. |
| `500` | `{ "success": false, "error": "Failed to prepare withdraw transaction" }` | 서버 오류. |

## Notes

- 빌드 시점의 소유권 확인은 편의를 위한 것입니다. `execute` 명령어가 어떤 경우에도 온체인에서 소유권을 강제하므로, 위조된 요청으로는 자금을 이동할 수 없습니다.
- 출금 대상은 항상 `sender`(소유자)입니다. 자금을 제3자에게 보낼 수 없습니다.
- 자금을 추가하려면 [Fund Agent](/api/fund-agent)를 참조하세요.
