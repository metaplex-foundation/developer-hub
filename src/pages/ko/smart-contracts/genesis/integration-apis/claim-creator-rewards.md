---
title: 창작자 보상 청구
metaTitle: Genesis - 창작자 보상 청구 | REST API | Metaplex
description: 단일 API 호출로 지갑의 모든 Genesis 본딩 커브 및 Raydium 버킷에서 누적된 창작자 보상을 청구합니다. 서명할 준비가 된 Solana 트랜잭션을 반환합니다.
method: POST
created: '04-23-2026'
updated: '04-23-2026'
keywords:
  - Genesis API
  - claim creator rewards
  - creator fees
  - claimCreatorRewards
  - v1/creator-rewards/claim
  - payer
about:
  - API endpoint
  - Creator rewards
  - Bonding curve fees
  - Raydium CPMM fees
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Bash
---

지갑이 자격이 있는 모든 Genesis 본딩 커브와 Raydium CPMM 버킷의 누적된 창작자 보상을 단일 호출로 청구합니다. 엔드포인트는 지갑(또는 지정된 `payer`)이 서명하고 제출해야 하는 base64 인코딩된 Solana 트랜잭션 목록을 반환합니다. {% .lead %}

{% callout type="note" title="SDK 래퍼 사용 가능" %}
대부분의 통합자는 Genesis JavaScript SDK의 [`claimCreatorRewards`](/smart-contracts/genesis/sdk/api-client#claim-creator-rewards)를 사용해야 합니다 — 트랜잭션을 역직렬화하고 오류 파싱을 처리하며, 서명을 위해 [Umi 신원](/dev-tools/umi/getting-started#connecting-a-wallet)에 직접 연결됩니다. SDK에 의존할 수 없는 경우에만 이 엔드포인트를 직접 호출하세요.
{% /callout %}

## Summary

`POST /v1/creator-rewards/claim`은 한 번의 호출로 지갑의 모든 본딩 커브 및 Raydium CPMM 버킷에서 누적된 창작자 보상을 청구하는 데 필요한 Solana 트랜잭션을 반환합니다.

- **집계** — 한 번의 요청으로 모든 자격 있는 버킷을 청구합니다; 버킷당 하나의 트랜잭션이 반환됩니다
- **서명** — 응답은 지갑(또는 선택적 `payer`)이 서명하고 제출해야 하는 base64 인코딩된 Solana 트랜잭션입니다
- **오류** — 누적된 것이 없으면 HTTP `400` `"No rewards available to claim"`를 반환합니다; 호출자는 빈 배열이 아니라 오류로 분기해야 합니다
- **SDK 래퍼** — [`claimCreatorRewards`](/smart-contracts/genesis/sdk/api-client#claim-creator-rewards)는 역직렬화, 타입화된 오류, Umi 서명을 처리합니다

## 엔드포인트

```
POST /v1/creator-rewards/claim
```

| 환경 | 베이스 URL |
|-------------|----------|
| Devnet & Mainnet | `https://api.metaplex.com` |

## 요청 본문

| 필드 | 타입 | 필수 | 설명 |
|-------|------|----------|-------------|
| `wallet` | `string` | 예 | 청구할 창작자 수수료 지갑의 base58 인코딩된 공개 키. 이는 버킷에서 `creatorFeeWallet`로 설정된 지갑 — 또는 오버라이드가 구성되지 않은 경우 런칭 지갑입니다. |
| `network` | `string` | 아니요 | `'solana-mainnet'` (기본값) 또는 `'solana-devnet'`. 베이스 URL의 클러스터와 일치해야 합니다. |
| `payer` | `string` | 아니요 | 반환된 트랜잭션의 트랜잭션 수수료와 임대료를 부담하는 base58 인코딩된 공개 키. 생략 시 기본값은 `wallet`입니다. |

### `payer`를 설정하는 시기

창작자 수수료 지갑이 SOL을 보유하고 있지 않을 때(예: 에이전트 PDA 또는 콜드 지갑) `payer`를 다른 지갑으로 설정하세요. `payer`는 반환된 트랜잭션에 서명해야 하므로, 일반적으로 창작자를 대신해 청구를 제출하는 지갑입니다. 창작자 수수료 수령자는 청구된 SOL을 계속 받습니다 — `payer`는 수수료와 임대료만 부담합니다.

## 요청 예시

{% code-tabs-imported from="genesis/api_claim_creator_rewards" frameworks="umi,curl" defaultFramework="umi" /%}

## 성공 응답

```json
{
  "data": {
    "transactions": ["<base64 transaction>", "<base64 transaction>"],
    "blockhash": {
      "blockhash": "ERKYmtrmNSKaw3VpnFYAfK3jvWGnd15Nf9kJxZqJ7JHx",
      "lastValidBlockHeight": 445407640
    }
  }
}
```

| 필드 | 타입 | 설명 |
|-------|------|-------------|
| `data.transactions` | `string[]` | base64 인코딩된 Solana 트랜잭션. 각각을 역직렬화하고, payer(및 별도의 서명자인 경우 창작자 수수료 지갑)가 서명한 후 제출해야 합니다. |
| `data.blockhash.blockhash` | `string` | 트랜잭션이 작성된 최근 블록해시. 이를 `confirmTransaction`과 함께 사용하세요 — 새로 가져온 블록해시로 대체하지 마세요. |
| `data.blockhash.lastValidBlockHeight` | `number` | 블록해시가 만료되는 슬롯 높이. |

{% callout type="note" %}
API는 청구되는 버킷마다 하나의 트랜잭션을 반환합니다 — 보통 두 개(본딩 커브와 Raydium). 순차적으로 제출하세요; 순서는 중요하지 않습니다.
{% /callout %}

## 오류 응답

오류는 HTTP 상태 `400`과 다음 형태로 반환됩니다:

```json
{ "error": { "message": "No rewards available to claim" } }
```

### 알려진 오류 메시지

| 메시지 | HTTP | 원인 |
|---------|------|-------|
| `No rewards available to claim` | `400` | 지갑에 어떤 버킷에서도 누적되어 미청구된 창작자 보상이 없습니다. 빈 `transactions` 배열 대신 반환되므로, 호출자는 이를 비예외적인 결과로 처리해야 합니다. |
| `✖ Invalid wallet address` | `400` | `wallet`이 유효한 base58 Solana 공개 키가 아닙니다. |

{% callout type="warning" title="보상 없음은 빈 배열이 아닌 400" %}
지갑에 청구할 것이 없을 때 엔드포인트는 HTTP `400`과 `No rewards available to claim` 메시지를 반환합니다 — `transactions: []`를 포함한 `200`을 반환하지 **않습니다**. 호출자는 오류를 잡거나(또는 `response.status`와 `body.error.message`를 검사하고) 이를 실패가 아닌 "할 일 없음" 사례로 처리해야 합니다. SDK는 이를 타입화된 `GenesisApiError`로 표면화합니다; [오류 처리](/smart-contracts/genesis/creator-fees#보상-없음-사례-처리)를 참조하세요.
{% /callout %}

## 참고 사항

- 엔드포인트는 버킷 수준에서 멱등적입니다 — 성공적인 청구 직후에 다시 호출하면 새 수수료가 누적될 때까지 `No rewards available to claim`을 반환합니다.
- 반환된 트랜잭션은 `data.blockhash`의 블록해시를 사용합니다. 확인이 ~60–90초 이상 걸리면 블록해시가 만료되며, 새로운 트랜잭션 세트를 얻기 위해 호출을 반복해야 합니다.
- 창작자 보상은 매 스왑(본딩 커브)과 LP 거래 활동(Raydium CPMM)에서 누적됩니다 — 이 엔드포인트는 둘 다 집계합니다. 기본 누적 메커니즘과 버킷별 페치 헬퍼는 [Genesis 본딩 커브의 창작자 수수료](/smart-contracts/genesis/creator-fees)를 참조하세요.
- 창작자 수수료 지갑은 버킷 생성 시 `creatorFeeWallet`을 통해 설정되며, 커브가 활성화된 후에는 변경할 수 없습니다.

## 권장: SDK 사용

이 엔드포인트를 직접 호출하는 대신 `@metaplex-foundation/genesis`의 [`claimCreatorRewards`](/smart-contracts/genesis/sdk/api-client#claim-creator-rewards)를 사용하세요:

{% code-tabs-imported from="genesis/api_claim_creator_rewards" frameworks="umi" filename="claimCreatorRewards" /%}

전체 SDK 표면에 대해서는 [API 클라이언트](/smart-contracts/genesis/sdk/api-client) 페이지를, 엔드투엔드 청구 가이드에 대해서는 [창작자 수수료](/smart-contracts/genesis/creator-fees)를 참조하세요.
