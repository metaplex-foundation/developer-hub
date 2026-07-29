---
title: Nori 예제 에이전트
metaTitle: Nori 예제 에이전트 - 추론, 이미지 생성, RPC 컨슈머 | Metaplex
description: 각 Nori 서비스를 소비하는 에이전트의 실제 동작 예제 - chat.completion을 사용하는 OpenAI 호환 추론 에이전트, image.generation을 사용하는 아트워크 에이전트, DAS와 함께 solana.rpc를 사용하는 포트폴리오 분석기, 그리고 원시 A2A JSON-RPC 호출자.
keywords:
  - Nori examples
  - example agents
  - OpenAI-compatible agent
  - chat.completion
  - image.generation
  - solana.rpc
  - DAS API
  - A2A message/send
  - agent template
about:
  - Nori
  - Autonomous Agents
  - Agent Commerce
  - Solana
  - Metaplex
proficiencyLevel: Intermediate
created: '07-08-2026'
updated: '07-08-2026'
programmingLanguage:
  - TypeScript
faqs:
  - q: Nori의 추론 서비스와 함께 작동하는 SDK는 무엇인가요?
    a: 모든 OpenAI 호환 클라이언트가 작동합니다 — createOpenAICompatible을 통한 Vercel AI SDK, 커스텀 baseURL을 사용하는 공식 OpenAI SDK, 또는 OpenAI 호환 프로바이더를 받아들이는 Mastra 같은 에이전트 프레임워크. 클라이언트를 NORI_URL/v1에 지정하고 베어러 토큰을 Authorization 헤더로 첨부하세요.
  - q: 내 에이전트가 Nori를 통해 getAssetsByOwner 같은 DAS 메서드를 사용할 수 있나요?
    a: 예. solana.rpc 서비스는 DAS를 지원하는 업스트림 프로바이더로의 투명한 JSON-RPC 패스스루이므로, DAS 메서드(getAsset, getAssetsByOwner 등)가 표준 Solana RPC 메서드와 완전히 동일하게 작동합니다 — 같은 엔드포인트, 같은 호출당 가격입니다.
  - q: 이 예제들은 위임 없이도 작동하나요?
    a: 예, x402 폴백 레일을 통해 작동합니다 — 각 첫 호출은 직접 실행되는 대신 결제 요구사항과 함께 HTTP 402를 반환합니다. 예제들은 결제 왕복을 제거해 주는 위임을 전제로 합니다; 1회 설정은 Nori에 위임하기를 참조하세요.
  - q: chat.completion을 통해 어떤 모델을 요청할 수 있나요?
    a: 요금표에 있는 모든 모델을 <provider>/<model> 형식으로 요청할 수 있습니다 — 예를 들어 anthropic/claude-sonnet-4-6, openai/gpt-5.4, google/gemini-2.5-flash. GET /v1/models가 실시간 디렉토리를 나열하고, GET /rate-card에 토큰당 가격이 있습니다.
---

이 예제들은 컨슈머 에이전트가 Nori의 세 가지 서비스 — LLM 추론, 이미지 생성, Solana RPC — 를 각각 사용하는 모습과, 에이전트 간 호출자를 위한 원시 A2A 엔벨로프를 보여줍니다. 각 예제는 1회 [위임 설정](/agents/nori/delegate-to-nori)이 완료되어 베어러 `token`이 준비되어 있다고 가정합니다; 동일한 요청은 위임 없이도 x402 폴백을 통해 결제 왕복이 추가된 채로 작동합니다. {% .lead %}

## 요약

모든 예제는 완전한 유료 Nori 호출입니다 — 어디에도 프로바이더 API 키가 없습니다.

- **추론 에이전트** — OpenAI 호환 클라이언트를 `NORI_URL/v1`에 지정하고 툴 호출과 함께 `chat.completion`을 실행합니다
- **아트워크 에이전트** — `image.generation`(gpt-image-1)으로 이미지를 생성합니다
- **포트폴리오 분석기** — DAS 메서드를 포함하여 `solana.rpc`로 잔액과 토큰 보유량을 읽습니다
- **A2A 호출자** — 에이전트 간 통합을 위해 JSON-RPC `message/send`로 동일한 스킬을 호출합니다

## chat.completion을 사용하는 추론 에이전트

OpenAI 호환 클라이언트를 `NORI_URL/v1`에 지정하면 에이전트의 LLM 두뇌를 전적으로 Nori에서 실행할 수 있습니다. 모델은 `<provider>/<model>` 형식으로 지정되어 업스트림의 Anthropic, OpenAI, Google로 라우팅됩니다; 툴 호출(`tools`, `tool_choice`, `tool_calls`)이 세 프로바이더 모두에서 지원되므로 전체 에이전트 루프가 수정 없이 작동합니다.

```typescript {% title="inference-agent.ts" %}
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText, tool } from 'ai';
import { z } from 'zod';

const nori = createOpenAICompatible({
  name: 'nori',
  baseURL: `${NORI_URL}/v1`,
  headers: { Authorization: `Bearer ${token}` }, // from /auth/handshake
});

const { text } = await generateText({
  model: nori('anthropic/claude-sonnet-4-6'),
  tools: {
    getSolPrice: tool({
      description: 'Get the current SOL price in USD',
      inputSchema: z.object({}),
      execute: async () => fetchSolPrice(),
    }),
  },
  prompt: 'Is SOL above $200 right now? Answer in one sentence.',
});
```

각 `generateText` 호출은 하나의 종량제 `chat.completion`입니다 — 선택한 모델의 [요금표](/agents/nori/pricing-and-billing) 가격에 따라 실제 입출력 토큰 수로 과금되며, 에이전트의 PDA에서 정산됩니다. 와이어 형식이 표준 OpenAI이므로 모델을 교체하는 것(또는 [장애 중](/agents/nori/#단일-장애점으로서의-nori) Nori가 아닌 프로바이더로 폴백하는 것)은 한 줄만 바꾸면 됩니다.

## image.generation을 사용하는 아트워크 에이전트

아트워크 — NFT 이미지, 아바타, 사용자를 위한 생성 콘텐츠 — 가 필요한 에이전트는 표준 OpenAI 이미지 요청 형식으로 `POST /v1/images/generations`를 호출합니다. Nori는 업스트림의 gpt-image-1로 라우팅하고 이미지당 고정 가격을 청구합니다.

```typescript {% title="artwork-agent.ts" %}
const response = await fetch(`${NORI_URL}/v1/images/generations`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    model: 'openai/gpt-image-1',
    prompt: 'Pixel-art portrait of a sea-otter plumber holding a wrench',
    n: 1,
    size: '1024x1024',
  }),
}).then((r) => r.json());

const imageB64 = response.data[0].b64_json;
```

일반적인 후속 작업은 이미지를 업로드하고 [MPL Core](/smart-contracts/core) 자산으로 민팅하는 것입니다 — 생성 단계와 민팅 단계는 독립적이며, 생성만 Nori 청구 대상입니다.

## solana.rpc를 사용하는 포트폴리오 분석기

온체인 데이터 에이전트는 동일한 과금 파이프를 통해 RPC와 DAS 액세스를 얻습니다. `POST /v1/solana/rpc`는 DAS를 지원하는 업스트림으로의 투명한 JSON-RPC 패스스루이므로, 표준 메서드(`getBalance`)와 DAS 메서드(`getAsset`, `getAssetsByOwner`)가 하나의 엔드포인트와 하나의 호출당 가격을 공유합니다. 이 포트폴리오 분석기는 수집 → 보강 → 요약 워크플로의 수집 단계를 구현합니다:

```typescript {% title="portfolio-analyzer.ts" %}
async function noriRpc(method: string, params: unknown[]) {
  const res = await fetch(`${NORI_URL}/v1/solana/rpc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  }).then((r) => r.json());
  return res.result;
}

// Gather: SOL balance + all token holdings for a wallet.
const owner = '11111111111111111111111111111112'; // wallet under analysis
const balance = await noriRpc('getBalance', [owner]);

// DAS method — same endpoint, same per-call price.
const assets = await noriRpc('getAssetsByOwner', [
  { ownerAddress: owner, page: 1, limit: 100 },
]);

// Enrich/summarize: feed the holdings to the inference agent above
// for a natural-language portfolio breakdown.
```

각 호출이 개별적으로 과금되므로(호출당 고정 가격), 루프 스타일 에이전트 — 주기적으로 폴링하는 가격 감시기, 페이지네이션된 보유량을 순회하는 분석기 — 는 호출을 신중하게 예산해야 합니다: PDA 잔액이 곧 지출 한도이며, 지갑이 비면 서비스가 [하드 스톱](/agents/nori/pricing-and-billing#하드-스톱-시맨틱스)됩니다.

## A2A message/send를 사용하는 에이전트 간 호출자

(OpenAI SDK가 아니라) 프로토콜 수준에서 통합하는 에이전트는 [에이전트 카드](/agents/nori/#nori가-제공하는-서비스)에서 발견한 `POST /a2a`의 JSON-RPC 2.0으로 동일한 스킬을 호출합니다. 스킬 입력은 HTTP 인터페이스와 바이트 단위로 동일합니다 — OpenAI 요청 본문이 단지 `message/send` 엔벨로프 안에서 DataPart로 이동할 뿐입니다:

```typescript {% title="a2a-caller.ts" %}
const task = await fetch(`${NORI_URL}/a2a`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'message/send',
    params: {
      requestId: crypto.randomUUID(),
      message: {
        parts: [
          {
            kind: 'data',
            data: {
              skill: 'chat.completion',
              input: {
                model: 'anthropic/claude-sonnet-4-6',
                messages: [{ role: 'user', content: 'Hello from another agent.' }],
              },
            },
          },
        ],
      },
    },
  }),
}).then((r) => r.json());
```

`message/send`는 완료된 태스크를 동기적으로 반환합니다; `tasks/get`은 ID로 이전 태스크를 조회합니다. HTTP 인터페이스와 동일한 입력 형식으로 `image.generation`이나 `solana.rpc`를 `skill`로 사용하세요.

{% callout type="note" title="v1에서는 스트리밍을 사용할 수 없습니다" %}
`message/sendStream`은 에이전트 카드에 선언되어 있지만 v1에서는 501을 반환하며, `/v1/chat/completions`는 비스트리밍입니다. 완전한 응답을 중심으로 에이전트 루프를 설계하세요.
{% /callout %}

## 빠른 참조

| 예제 | 서비스 | 엔드포인트 | 과금 방식 |
|---------|---------|----------|-----------|
| 추론 에이전트 | `chat.completion` | `POST /v1/chat/completions` | 모델별 입출력 토큰당 |
| 아트워크 에이전트 | `image.generation` | `POST /v1/images/generations` | 이미지당 |
| 포트폴리오 분석기 | `solana.rpc` | `POST /v1/solana/rpc` | 호출당(DAS 메서드 포함) |
| A2A 호출자 | 모든 스킬 | `POST /a2a` (`message/send`) | 기반 스킬과 동일 |

## 참고사항

- 모든 예제는 `NORI_URL`(Nori의 베이스 URL)과 `token`([핸드셰이크 흐름](/agents/nori/delegate-to-nori#3단계-베어러-토큰으로-인증)에서 발급된 베어러)을 전제로 합니다; 토큰은 15분 후 만료되므로 장시간 실행되는 에이전트는 재핸드셰이크합니다
- 베어러 토큰 없이도 동일한 요청이 x402 레일을 통해 작동합니다: 첫 호출에서 결제 요구사항과 함께 HTTP 402를 받고, 결제한 뒤 재시도하세요
- 실행 중인 에이전트에서 시작하고 싶다면 Metaplex 에이전트 템플릿이 이 패턴들을 바로 사용할 수 있는 Mastra 툴(`chat-completion`, `generate-image`, `solana-rpc-call`, `delegate-to-nori`)로 패키징해 제공합니다
- 성공 시 과금이 모든 예제에 적용됩니다: 실패한 업스트림 호출은 비용이 들지 않습니다 — [가격 및 과금](/agents/nori/pricing-and-billing#성공-시-과금-정산)을 참조하세요

Metaplex Foundation 관리. 최종 검증: 2026-07-08. [GitHub에서 소스 보기](https://github.com/metaplex-foundation/agent-plumber).

## FAQ

Nori 서비스를 이용한 개발에 대한 일반적인 질문.

### Nori의 추론 서비스와 함께 작동하는 SDK는 무엇인가요?
모든 OpenAI 호환 클라이언트가 작동합니다 — `createOpenAICompatible`을 통한 Vercel AI SDK, 커스텀 `baseURL`을 사용하는 공식 OpenAI SDK, 또는 OpenAI 호환 프로바이더를 받아들이는 Mastra 같은 에이전트 프레임워크. 클라이언트를 `NORI_URL/v1`에 지정하고 베어러 토큰을 `Authorization` 헤더로 첨부하세요.

### 내 에이전트가 Nori를 통해 getAssetsByOwner 같은 DAS 메서드를 사용할 수 있나요?
예. `solana.rpc` 서비스는 DAS를 지원하는 업스트림 프로바이더로의 투명한 JSON-RPC 패스스루이므로, DAS 메서드(`getAsset`, `getAssetsByOwner` 등)가 표준 Solana RPC 메서드와 완전히 동일하게 작동합니다 — 같은 엔드포인트, 같은 호출당 가격입니다.

### 이 예제들은 위임 없이도 작동하나요?
예, x402 폴백 레일을 통해 작동합니다 — 각 첫 호출은 직접 실행되는 대신 결제 요구사항과 함께 HTTP 402를 반환합니다. 예제들은 결제 왕복을 제거해 주는 위임을 전제로 합니다; 1회 설정은 [Nori에 위임하기](/agents/nori/delegate-to-nori)를 참조하세요.

### chat.completion을 통해 어떤 모델을 요청할 수 있나요?
요금표에 있는 모든 모델을 `<provider>/<model>` 형식으로 요청할 수 있습니다 — 예를 들어 `anthropic/claude-sonnet-4-6`, `openai/gpt-5.4`, `google/gemini-2.5-flash`. `GET /v1/models`가 실시간 디렉토리를 나열하고, [`GET /rate-card`](/agents/nori/pricing-and-billing)에 토큰당 가격이 있습니다.
