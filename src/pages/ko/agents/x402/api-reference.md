---
title: Metaplex x402 API 레퍼런스
metaTitle: Metaplex x402 API 레퍼런스 - 엔드포인트, 가격, 클라이언트 익스포트 | Metaplex
description: Metaplex x402 API의 전체 레퍼런스 - 베이스 URL, 채팅 완성·이미지 생성·Solana RPC 엔드포인트, 무료 디스커버리 엔드포인트, 위임 라우트, 결제 챌린지 필드, 최신 가격, 클라이언트가 제공하는 헬퍼와 옵션.
keywords:
  - Metaplex x402 API
  - x402 endpoints
  - x402 pricing
  - OpenAI compatible endpoint
  - Solana RPC endpoint
  - MetaplexSvmExactScheme
  - payment required header
about:
  - Metaplex x402
  - API Reference
  - Solana
  - Metaplex
proficiencyLevel: Intermediate
programmingLanguage:
  - TypeScript
created: '09-08-2026'
updated: '09-08-2026'
---

Metaplex x402 API는 `https://api.metaplex.com/x402`에서 제공되며 세 가지 유료 서비스, 두 가지 무료 디스커버리 엔드포인트, 네 개의 에이전트 위임 라우트를 노출합니다. 이 페이지는 엔드포인트, 가격, 클라이언트 익스포트 레퍼런스이며, 유료 엔드포인트에 필요한 결제 지원 `fetch`를 구성하는 방법은 [결제 모드 가이드](/agents/x402/payment-modes)에서 다룹니다. {% .lead %}

## 요약 {% #summary %}

모든 유료 엔드포인트는 결제되지 않은 요청에 대해 HTTP `402`와 무엇을 얼마나 결제해야 하는지 정확히 기술한 `PAYMENT-REQUIRED` 헤더로 응답하며, 클라이언트는 USDC 결제에 서명해 재시도합니다. 디스커버리 엔드포인트에는 결제도 서명자도 필요 없습니다.

- **베이스 URL** — API는 `https://api.metaplex.com/x402`, Solana JSON-RPC는 `https://api.metaplex.com/x402/rpc`
- **와이어 포맷** — 채팅과 이미지는 표준 OpenAI 요청/응답 바디, RPC는 표준 Solana JSON-RPC
- **정산** — Solana 메인넷의 USDC, x402 프로토콜 버전 2, `exact` 스킴
- **클라이언트 버전** — `@metaplex-foundation/x402` `0.1.0`, Node.js 20.18+, ESM 전용

## 베이스 URL 및 상수 {% #base-urls-and-constants %}

클라이언트는 두 베이스 URL을 모두 익스포트하므로 애플리케이션에서 하드코딩할 필요가 없습니다.

| 상수 | 값 |
|------|-----|
| `METAPLEX_X402_BASE_URL` | `https://api.metaplex.com/x402` |
| `METAPLEX_X402_RPC_URL` | `https://api.metaplex.com/x402/rpc` |

## 엔드포인트 {% #endpoints %}

유료 엔드포인트에는 결제 지원 `fetch`가 필요하고, 무료 엔드포인트에는 필요하지 않습니다.

| 메서드 | 경로 | 결제 | 설명 |
|-------|------|------|------|
| `GET` | `/x402/models` | 무료 | 사용 가능한 모델 ID |
| `GET` | `/x402/pricing` | 무료 | 모델 요율, 요청 최소 금액, RPC 메서드별 가격, 법적 고지 URL |
| `POST` | `/x402/chat/completions` | 유료 | OpenAI 호환 채팅 완성 |
| `POST` | `/x402/images/generations` | 유료 | OpenAI 호환 이미지 생성 |
| `POST` | `/x402/rpc` | 유료 | Solana JSON-RPC 및 DAS, HTTP 전용 |
| `GET` | `/x402/core-execute-delegate/status` | 무료 | Core 에셋의 위임 상태 |
| `POST` | `/x402/core-execute-delegate/approve` | 무료 | 실행 위임 승인 |
| `POST` | `/x402/core-execute-delegate/revoke` | 무료 | 실행 위임 취소 |
| `POST` | `/x402/core-execute-delegate/auth` | 무료 | Sign-In-With-X 서명을 24시간 유효한 베어러 토큰으로 교환 |

위임 라우트는 [클라이언트 익스포트](#client-exports)에 나열된 SDK 헬퍼로 래핑되어 있습니다. 라우트를 직접 호출하지 말고 이 헬퍼를 사용하세요.

## 디스커버리 엔드포인트 {% #discovery-endpoints %}

디스커버리 엔드포인트는 무료로 호출할 수 있으며 클라이언트 헬퍼를 통해 타입이 지정된 데이터를 반환합니다.

```ts {% title="결제 없이 모델과 가격 조회하기" %}
import { getModels, getPricing } from '@metaplex-foundation/x402';

// Available model IDs, e.g. 'openai/gpt-5.4-mini'.
const models = await getModels();

// Per-model token rates, request minimums, RPC method prices, and legal URLs.
const pricing = await getPricing();
```

`GET /x402/models`는 OpenAI 형식의 모델 목록을 반환합니다.

```json {% title="GET /x402/models 응답 (발췌)" %}
{
  "object": "list",
  "data": [
    { "id": "anthropic/claude-opus-4.8", "object": "model", "created": 0, "owned_by": "anthropic" },
    { "id": "openai/gpt-5.4-mini", "object": "model", "created": 0, "owned_by": "openai" }
  ]
}
```

## 채팅 완성 엔드포인트 {% #chat-completions-endpoint %}

`POST /x402/chat/completions`는 표준 OpenAI 채팅 완성 바디를 받고 반환하며, 모델은 `<provider>/<model>` 형식으로 지정합니다.

```ts {% title="OpenAI SDK를 통한 채팅 완성" %}
import { METAPLEX_X402_BASE_URL } from '@metaplex-foundation/x402';
import OpenAI from 'openai';

const openai = new OpenAI({
  // The OpenAI SDK requires a value, but this gateway authenticates by payment.
  apiKey: 'x402',
  baseURL: METAPLEX_X402_BASE_URL,
  fetch: fetchWithPayment,
});

const completion = await openai.chat.completions.create({
  model: 'openai/gpt-5.4-mini',
  messages: [{ role: 'user', content: 'Say hi in one word.' }],
});
```

Vercel AI SDK는 OpenAI 호환 프로바이더를 통해 동일한 엔드포인트에 도달합니다.

```ts {% title="Vercel AI SDK를 통한 채팅 완성" %}
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { METAPLEX_X402_BASE_URL } from '@metaplex-foundation/x402';
import { generateText } from 'ai';

const metaplex = createOpenAICompatible({
  name: 'metaplex-x402',
  apiKey: 'x402',
  baseURL: METAPLEX_X402_BASE_URL,
  fetch: fetchWithPayment,
});

const { text } = await generateText({
  model: metaplex.chatModel('openai/gpt-5.4-mini'),
  prompt: 'Say hi in one word.',
});
```

## 이미지 생성 엔드포인트 {% #image-generation-endpoint %}

`POST /x402/images/generations`는 표준 OpenAI 이미지 생성 바디를 받습니다.

```ts {% title="OpenAI SDK를 통한 이미지 생성" %}
const image = await openai.images.generate({
  model: 'openai/gpt-image-1.5',
  prompt: 'A yellow square.',
  size: '1024x1024',
});
```

```ts {% title="Vercel AI SDK를 통한 이미지 생성" %}
import { generateImage } from 'ai';

const { image } = await generateImage({
  model: metaplex.imageModel('openai/gpt-image-1.5'),
  prompt: 'A yellow square.',
  size: '1024x1024',
});
```

## Solana RPC 엔드포인트 {% #solana-rpc-endpoint %}

`POST /x402/rpc`는 표준 Solana JSON-RPC 요청을 받고 [DAS](/solana/rpcs-and-das) 메서드를 패스스루하며, 각 요청을 개별적으로 과금하고 결제합니다.

```ts {% title="Solana Kit을 통한 Solana RPC" %}
import { createSolanaRpcFromTransport, type RpcTransport } from '@solana/kit';
import { METAPLEX_X402_RPC_URL } from '@metaplex-foundation/x402';

const rpcTransport: RpcTransport = async ({ payload, signal }) => {
  const response = await fetchWithPayment(METAPLEX_X402_RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: signal ?? null,
  });

  return response.json();
};

const rpc = createSolanaRpcFromTransport(rpcTransport);
const slot = await rpc.getSlot().send();
```

```ts {% title="web3.js를 통한 Solana RPC" %}
import { METAPLEX_X402_RPC_URL } from '@metaplex-foundation/x402';
import { Connection } from '@solana/web3.js';

const connection = new Connection(METAPLEX_X402_RPC_URL, {
  fetch: fetchWithPayment,
});
const slot = await connection.getSlot();
```

{% callout type="warning" title="x402 RPC 엔드포인트는 HTTP 전용입니다" %}
WebSocket 연결과 구독은 지원되지 않습니다. `accountSubscribe`, `logsSubscribe` 등 구독 메서드에는 일반 RPC 제공자를 사용하세요.
{% /callout %}

## 결제 챌린지 필드 {% #payment-challenge-fields %}

유료 엔드포인트에 결제 없이 요청하면 base64로 인코딩된 `PAYMENT-REQUIRED` 헤더와 함께 HTTP `402`가 반환됩니다. `@metaplex-foundation/x402`로 만든 클라이언트는 이를 자동으로 파싱하며, 아래 필드는 디버깅 용도와 JavaScript 이외의 클라이언트를 위한 문서입니다.

| 필드 | 값 예시 | 의미 |
|------|--------|------|
| `x402Version` | `2` | 프로토콜 버전 |
| `accepts[].scheme` | `exact` | 결제 스킴 |
| `accepts[].network` | `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` | Solana 메인넷의 CAIP-2 네트워크 식별자 |
| `accepts[].asset` | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` | USDC 민트 |
| `accepts[].amount` | `1000` | 자산의 원자 단위 금액 — `1000`은 `$0.001` |
| `accepts[].payTo` | `9AYgwvWMhZuir6rZoto13jrU1oZA1XxRDhqPznxyomHv` | 수취 계정 |
| `accepts[].maxTimeoutSeconds` | `300` | 결제를 제출해야 하는 시간 범위 |
| `accepts[].extra.quoteId` | UUID | 결제 대상 견적을 식별 |
| `accepts[].extra.usage` | OpenAI usage 객체 | 견적 산정의 근거가 된 실측 토큰 사용량 |
| `accepts[].extra.memo` | `metaplex:x402:chat.completions` | 정산과 함께 기록되는 Memo |
| `accepts[].extra.feePayer` | 공개 키 | 결제 트랜잭션의 네트워크 수수료를 부담하는 계정 |
| `extensions["metaplex-core-execute-delegate"]` | 객체 | 위임 인증 정보 — `sign-in-with-x`, 베어러 토큰, 토큰 엔드포인트, 결제 에셋을 지정하는 `X-METAPLEX-CORE-ASSET` 헤더 |

{% callout type="note" title="견적은 실측 사용량으로 산정됩니다" %}
추론 요청의 `402` 챌린지에는 `quoteId`와 값이 채워진 `usage` 객체가 포함되므로, 금액은 추정치가 아니라 요청이 실제로 소비한 토큰을 반영합니다. 응답 헤더 `PAYMENT-REQUIRED`와 `PAYMENT-RESPONSE`는 모두 CORS로 노출됩니다.
{% /callout %}

## 채팅 완성 가격 {% #chat-completion-pricing %}

채팅 모델은 100만 토큰당 요율로 과금되며 입력, 캐시된 입력, 출력에 각각 별도 요율이 적용되고 요청당 `$0.001`의 최소 금액이 적용됩니다. 아래 요율은 2026-09-08에 `GET /x402/pricing`에서 읽은 값입니다.

| 모델 | 입력 | 캐시된 입력 | 출력 |
|------|------|-----------|------|
| `anthropic/claude-opus-4.8` | $5.00 | $0.50 | $25.00 |
| `anthropic/claude-opus-4.7` | $5.00 | $0.50 | $25.00 |
| `anthropic/claude-opus-4.6` | $5.00 | $0.50 | $25.00 |
| `anthropic/claude-opus-4.5` | $5.00 | $0.50 | $25.00 |
| `anthropic/claude-sonnet-4.6` | $3.00 | $0.30 | $15.00 |
| `anthropic/claude-sonnet-4.5` | $3.00 | $0.30 | $15.00 |
| `anthropic/claude-haiku-4.5` | $1.00 | $0.10 | $5.00 |
| `openai/gpt-5.5` | $5.00 | $0.50 | $30.00 |
| `openai/gpt-5.4` | $2.50 | $0.25 | $15.00 |
| `openai/gpt-5.4-mini` | $0.75 | $0.075 | $4.50 |
| `openai/gpt-5.4-nano` | $0.20 | $0.02 | $1.25 |

`openai/gpt-5.5`와 `openai/gpt-5.4`는 입력 272,000 토큰을 초과하면 더 높은 롱 컨텍스트 요율이 적용됩니다 — `gpt-5.5`는 입력 $10.00·출력 $45.00, `gpt-5.4`는 입력 $5.00·출력 $22.50입니다.

## 이미지 생성 가격 {% #image-generation-pricing %}

이미지 모델은 네 가지 구분에 대해 100만 토큰당 과금되며 동일한 요청당 `$0.001` 최소 금액이 적용됩니다.

| 모델 | 입력 텍스트 | 입력 이미지 | 출력 이미지 | 출력 텍스트 |
|------|-----------|-----------|-----------|-----------|
| `openai/gpt-image-1.5` | $5.00 | $8.00 | $32.00 | $10.00 |
| `openai/gpt-image-2` | $5.00 | $8.00 | $30.00 | $10.00 |

## Solana RPC 가격 {% #solana-rpc-pricing %}

RPC 호출은 기본적으로 요청당 `$0.00001`이며 무거운 메서드에는 더 높은 요율이 적용됩니다.

| 메서드 | 요청당 가격 |
|-------|-----------|
| 기본값 (목록에 없는 모든 메서드) | $0.00001 |
| `getBlockTime` | $0.00001 |
| `getTransaction` | $0.00002 |
| `getBlocks` | $0.00002 |
| `getBlocksWithLimit` | $0.00002 |
| `getConfirmedTransaction` | $0.00002 |
| `getBlock` | $0.00005 |
| `getConfirmedBlock` | $0.00005 |
| `getSignaturesForAddress` | $0.00010 |

## `MetaplexSvmExactScheme` 옵션 {% #metaplexsvmexactscheme-options %}

`MetaplexSvmExactScheme`는 Core 에셋 및 에이전트 결제에 사용하는 결제 스킴입니다.

| 옵션 | 필수 | 설명 |
|------|------|------|
| `rpcUrl` | 예 | 결제 트랜잭션 구성에 사용하는 RPC 엔드포인트 |
| `coreExecute.asset` | Core 에셋 결제의 경우 | 결제 자금을 대는 서명자 PDA를 가진 Core 에셋 또는 에이전트 |
| `coreExecute.collection` | 에셋이 컬렉션에 속한 경우 | 해당 에셋의 Core 컬렉션 |
| `coreExecute.executionDelegateRecord` | 아니요 | 고급: 실행 위임 레코드를 재정의 |
| `commitment` | 아니요 | 블록해시 조회 시 커밋먼트. 기본값은 `confirmed` |
| `computeUnitLimit` | 아니요 | Core `execute` 결제는 기본 200,000, 그 외에는 20,000 |

이 스킴은 Umi 서명자와 Solana Kit 부분 트랜잭션 서명자를 허용하지만 sign-and-send 서명자는 허용하지 않습니다. Kit 서명자는 내부적으로 변환됩니다.

## 클라이언트 익스포트 {% #client-exports %}

`@metaplex-foundation/x402`는 공개 API를 패키지 루트에 집약합니다.

| 분류 | 익스포트 |
|------|---------|
| 결제 | `MetaplexSvmExactScheme`, `MetaplexSvmSigner`, `kitPartialTransactionSignerToUmiSigner` |
| 에이전트 위임 | `fetchMetaplexCoreExecuteDelegateStatus`, `approveMetaplexCoreExecuteDelegate`, `revokeMetaplexCoreExecuteDelegate`, `authorizeMetaplexCoreExecuteDelegate` |
| 에이전트 결제 트랜스포트 | `createMetaplexCoreExecuteDelegateClientExtension`, `wrapFetchWithMetaplexCoreExecuteDelegate`, 각 토큰 스토어 구현 |
| 디스커버리 | `getModels`, `getPricing`, `METAPLEX_X402_BASE_URL`, `METAPLEX_X402_RPC_URL` |

옵션 및 결과 타입, 프로토콜 상수, 위임 라우트 스키마도 패키지 루트에서 익스포트됩니다.

## 환경 변수 {% #environment-variables %}

[x402 저장소](https://github.com/metaplex-foundation/x402/tree/main/examples)의 실행 가능한 예제는 다음 변수를 읽습니다.

| 변수 | 필수 | 설명 |
|------|------|------|
| `SVM_PRIVATE_KEY` | 예 | Base58로 인코딩된 64바이트 개발용 키페어 |
| `CORE_ASSET_ADDRESS` | Core 에셋·에이전트 예제 | 해당 키페어가 소유한 Metaplex Core 에셋 |
| `SVM_RPC_URL` | 아니요 | x402 SVM 스킴이 사용하는 사용자 지정 Solana RPC URL |
| `METAPLEX_X402_BASE_URL` | 아니요 | API 베이스 URL. 기본값은 `https://api.metaplex.com/x402` |
| `METAPLEX_X402_RPC_URL` | 아니요 | RPC URL. 기본값은 `https://api.metaplex.com/x402/rpc` |
| `METAPLEX_API_BASE_URL` | 아니요 | 로컬 개발용 API 루트 재정의. 예: `http://localhost:3000/api` |

## 참고 사항 {% #notes %}

- 이 레퍼런스의 가격은 2026-09-08에 읽은 스냅샷입니다. 유효한 가격표는 라이브 서비스의 `GET /x402/pricing`이며 무료로 호출할 수 있습니다.
- 결제는 클래식 SPL Token 연관 토큰 계정에서 USDC로 정산됩니다. Token-2022 결제 민트는 현재 지원되지 않습니다.
- Core 에셋 및 에이전트 결제 모드에서는 Core `execute` 수수료를 위해 에셋 서명자 PDA에 SOL이 필요합니다. 표준 지갑 결제에는 필요하지 않습니다.
- 호스팅 서버는 오픈소스가 아닙니다. 클라이언트, 예제, 프로토콜 타입은 Apache-2.0으로 공개되어 있습니다.
- API 이용은 [Metaplex.com 이용약관](https://www.metaplex.com/terms-of-use) 및 [개인정보 처리방침](https://www.metaplex.com/privacy)에 동의하는 것을 의미합니다.

## 빠른 참조 {% #quick-reference %}

| 항목 | 값 |
|------|-----|
| API 베이스 URL | `https://api.metaplex.com/x402` |
| RPC URL | `https://api.metaplex.com/x402/rpc` |
| JS 클라이언트 | `@metaplex-foundation/x402` (`0.1.0`) |
| 런타임 | Node.js 20.18+, ESM |
| 프로토콜 | x402 버전 2, `exact` 스킴 |
| 네트워크 | `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` (Solana 메인넷) |
| 결제 민트 | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` (USDC) |
| 운영 에이전트 | `MECHjj31U1hBapoVeJtZo5U5WGRd2293JEwRErvPTuF` |
| 소스 | [GitHub](https://github.com/metaplex-foundation/x402) (Apache-2.0) |

---

Metaplex Foundation 관리. 최종 검증: 2026-09-08. 클라이언트 버전: `@metaplex-foundation/x402` `0.1.0`. [GitHub에서 소스 보기](https://github.com/metaplex-foundation/x402).
