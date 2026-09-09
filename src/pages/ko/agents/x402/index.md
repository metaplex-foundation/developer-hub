---
title: Metaplex x402 - 요청당 결제하는 AI 및 Solana RPC
metaTitle: Metaplex x402 - 에이전트를 위한 요청당 과금 AI 추론 및 Solana RPC | Metaplex
description: Metaplex x402는 API 키나 계정 없이 HTTP로 LLM 추론, 이미지 생성, Solana RPC를 판매합니다. 모든 요청은 지갑, Core 에셋 또는 위임된 에이전트에서 USDC로 자체 결제됩니다.
keywords:
  - Metaplex x402
  - x402 payments
  - pay per request API
  - agent payments
  - OpenAI compatible API
  - Solana RPC
  - USDC micropayments
  - Mech agent
about:
  - Metaplex x402
  - Agent Commerce
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '09-08-2026'
updated: '09-08-2026'
faqs:
  - q: Metaplex x402란 무엇인가요?
    a: Metaplex x402는 LLM 추론, 이미지 생성, Solana RPC 액세스를 판매하는 요청당 과금 HTTP API입니다. API 키, 계정, 구독이 필요 없으며 각 요청은 x402 프로토콜을 사용해 Solana에서 USDC로 결제됩니다. x402는 HTTP 402 Payment Required 상태를 기계가 결제 가능한 흐름으로 바꾸는 프로토콜입니다.
  - q: Metaplex x402를 사용하려면 API 키나 계정이 필요한가요?
    a: 아니요. 결제가 곧 인증입니다. USDC를 보유한 Solana 지갑, Core 에셋 또는 등록된 에이전트만 있으면 됩니다. OpenAI SDK는 비어 있지 않은 apiKey 값을 요구하므로 예제에서는 문자열 'x402'를 전달하지만 게이트웨이는 이를 무시합니다.
  - q: Mech란 무엇인가요?
    a: Mech는 x402 서비스를 운영하는 온체인 Metaplex 에이전트입니다. 결제는 Mech의 Core 지갑 — 즉 에셋 서명자 PDA — 으로 USDC로 정산됩니다. Mech는 여러분의 에이전트나 지갑에 서비스를 판매하는 에이전트이며 주소는 MECHjj31U1hBapoVeJtZo5U5WGRd2293JEwRErvPTuF입니다.
  - q: Nori 서비스 에이전트 문서는 어떻게 되었나요?
    a: Nori 페이지는 공개 릴리스된 적이 없고 더 이상 유지보수되지 않는 초기 프로토타입을 설명한 것이었습니다. 이를 대체해 실제로 출시된 서비스가 Metaplex x402입니다. 현재 Nori라는 이름은 metaplex.com/nori의 Metaplex AI 코파일럿을 가리키며, 유료 추론이나 RPC와는 무관한 별개의 제품입니다.
  - q: Metaplex x402는 SOL로 과금하나요, USDC로 과금하나요?
    a: USDC입니다. 결제는 클래식 SPL Token 연관 토큰 계정에서 이루어지며 Token-2022 결제 민트는 지원되지 않습니다. Core 에셋 및 에이전트 결제 모드에서는 Core execute 트랜잭션 수수료를 충당하기 위해 에셋 서명자 PDA에 소량의 SOL 잔액도 필요합니다.
  - q: Metaplex x402 서버는 오픈소스인가요?
    a: 클라이언트는 오픈소스입니다. TypeScript 클라이언트, 예제, 프로토콜 타입은 github.com/metaplex-foundation/x402에 Apache-2.0으로 공개되어 있습니다. 호스팅 서비스를 구동하는 서버는 현재 공개되어 있지 않습니다.
  - q: 요청 한 건의 비용은 얼마인가요?
    a: 추론 가격은 업스트림 제공자의 토큰 요율을 따르며 요청당 $0.001의 최소 금액이 적용됩니다. RPC 호출은 요청당 $0.00001부터 과금되며 무거운 메서드에는 더 높은 요율이 적용됩니다. GET /x402/pricing은 최신 요율을 반환하며 무료로 호출할 수 있습니다.
---

Metaplex x402는 LLM 추론, 이미지 생성, Solana RPC를 위한 요청당 과금 HTTP API입니다 — API 키도, 계정도, 구독도 없습니다. USDC를 보유한 Solana 지갑, [Core 에셋](/smart-contracts/core) 또는 [등록된 에이전트](/agents/register-agent)만 준비하면 모든 요청이 그때그때 USDC로 자체 결제됩니다. {% .lead %}

## 요약 {% #summary %}

Metaplex x402는 HTTP의 `402 Payment Required` 상태를 기계가 결제 가능한 흐름으로 바꿉니다. 앱이 평소처럼 엔드포인트를 호출하면 서버가 결제 요건과 함께 `402`를 응답하고, 클라이언트가 USDC 결제에 서명해 재시도하면 서버가 Solana에서 정산한 뒤 응답을 반환합니다. 이 서비스는 온체인 Metaplex 에이전트인 [Mech](#mech-the-agent-that-operates-metaplex-x402)가 운영합니다.

- **세 가지 서비스** — OpenAI 호환 채팅 완성, OpenAI 호환 이미지 생성, [DAS](/solana/rpcs-and-das) 패스스루를 지원하는 Solana JSON-RPC
- **세 가지 결제 모드** — 표준 지갑, Core 에셋 또는 에이전트의 직접 결제, 요청마다 서명하지 않고 결제하는 [위임 에이전트](/agents/x402/payment-modes#pay-instantly-with-a-delegated-agent)
- **USDC 정산** — 결제는 클래식 SPL Token 연관 토큰 계정에서 이루어지며 Token-2022 결제 민트는 지원되지 않습니다
- **오픈소스 클라이언트** — [`@metaplex-foundation/x402`](https://github.com/metaplex-foundation/x402)는 Apache-2.0이며 실행 가능한 예제 12개가 포함됩니다. 호스팅 서버는 공개되어 있지 않습니다

{% callout type="note" title="Metaplex x402와 Nori라는 이름" %}
Metaplex x402는 여기에서 "Nori"로 문서화되어 있던 초기 서비스 에이전트 프로토타입을 대체합니다. 해당 프로토타입은 공개 릴리스된 적이 없고 더 이상 유지보수되지 않으며, SOL 기반 과금, `/a2a` 표면, 에이전트 카드는 이 서비스에 존재하지 않습니다. **[Nori](https://www.metaplex.com/nori)는 이제 Metaplex AI 코파일럿**이며, 유료 추론 및 RPC와는 무관한 별개의 제품입니다.
{% /callout %}

## Metaplex x402가 제공하는 서비스 {% #services-metaplex-x402-provides %}

Metaplex x402는 단일 베이스 URL `https://api.metaplex.com/x402` 아래에서 세 가지 유료 서비스와 두 가지 무료 디스커버리 엔드포인트를 제공합니다.

| 서비스 | 엔드포인트 | 결제 | 업스트림 |
|-------|----------|------|---------|
| 채팅 완성 | `POST /x402/chat/completions` | 유료 | Anthropic 및 OpenAI 모델, `<provider>/<model>` 형식으로 지정 |
| 이미지 생성 | `POST /x402/images/generations` | 유료 | OpenAI `gpt-image-1.5` 및 `gpt-image-2` |
| Solana RPC 및 DAS | `POST /x402/rpc` | 유료 | Solana JSON-RPC, HTTP 전용 |
| 모델 조회 | `GET /x402/models` | 무료 | 사용 가능한 모델 ID |
| 가격 조회 | `GET /x402/pricing` | 무료 | 토큰 요율, 요청 최소 금액, RPC 메서드별 가격 |

채팅과 이미지 엔드포인트는 표준 OpenAI 와이어 포맷을 사용하므로, OpenAI 호환 클라이언트라면 `baseURL`을 변경하고 결제 지원 `fetch`를 전달하기만 하면 동작합니다. 요청과 응답의 자세한 내용은 [API 레퍼런스](/agents/x402/api-reference)를 참고하세요.

## Mech: Metaplex x402를 운영하는 에이전트 {% #mech-the-agent-that-operates-metaplex-x402 %}

Mech는 x402 서비스를 판매하는 온체인 Metaplex 에이전트이며, USDC 결제는 Mech의 Core 지갑으로 정산됩니다. Mech 자체도 [Asset Signer PDA 지갑](/smart-contracts/core/execute-asset-signing)을 가진 [등록된 에이전트](/agents/what-is-an-agent)입니다 — 에이전트가 여러분의 에이전트에게 서비스를 판매하는 것으로, [에이전트 커머스](/agents/agent-commerce) 모델이 엔드투엔드로 작동하는 모습입니다.

| 항목 | 값 |
|------|-----|
| 에이전트 주소 | `MECHjj31U1hBapoVeJtZo5U5WGRd2293JEwRErvPTuF` |
| 공개 페이지 | [metaplex.com/agents/MECHjj…](https://www.metaplex.com/agents/MECHjj31U1hBapoVeJtZo5U5WGRd2293JEwRErvPTuF) |
| 정산 자산 | USDC |

## 빠른 시작 {% #quick-start %}

클라이언트를 설치하고 결제 지원 `fetch`로 OpenAI SDK를 Metaplex x402에 연결합니다. 이 예제는 표준 지갑에서 결제하며, 세 가지 모드 전체는 [결제 모드 가이드](/agents/x402/payment-modes)에서 다룹니다.

```sh {% title="클라이언트 및 피어 패키지 설치" %}
pnpm add @metaplex-foundation/x402 \
  @metaplex-foundation/umi \
  @solana/kit \
  @x402/core \
  @x402/fetch \
  @x402/svm \
  openai
```

```ts {% title="표준 지갑에서의 유료 채팅 완성" %}
import { METAPLEX_X402_BASE_URL } from '@metaplex-foundation/x402';
import { createKeyPairSignerFromBytes, getBase58Encoder } from '@solana/kit';
import { x402Client } from '@x402/core/client';
import { wrapFetchWithPayment } from '@x402/fetch';
import { ExactSvmScheme } from '@x402/svm/exact/client';
import OpenAI from 'openai';

// A Solana signer whose token account holds USDC.
const svmSigner = await createKeyPairSignerFromBytes(
  getBase58Encoder().encode(process.env.SVM_PRIVATE_KEY!),
);

const paymentClient = new x402Client();
paymentClient.register('solana:*', new ExactSvmScheme(svmSigner));

const openai = new OpenAI({
  // The OpenAI SDK requires a value, but this gateway authenticates by payment.
  apiKey: 'x402',
  baseURL: METAPLEX_X402_BASE_URL,
  fetch: wrapFetchWithPayment(fetch, paymentClient),
});

const completion = await openai.chat.completions.create({
  model: 'openai/gpt-5.4-mini',
  messages: [{ role: 'user', content: 'Say hi in one word.' }],
});
```

결제는 래핑된 `fetch` 내부에서 처리되며, 코드에는 최종 API 응답만 보입니다.

## 결제 모드 한눈에 보기 {% #payment-modes-at-a-glance %}

Metaplex x402는 세 가지 결제 방식을 지원하며, USDC의 출처와 소유자가 서명하는 빈도가 다릅니다.

| 모드 | 자금 출처 | 소유자 서명 | 적합한 용도 |
|------|---------|-----------|-----------|
| **표준 지갑** | 내 지갑의 USDC 토큰 계정 | 결제마다 | 앱과 스크립트가 자기 자신으로서 결제하는 경우 |
| **Core 에셋 또는 에이전트(직접)** | 에셋 서명자 PDA의 토큰 계정 | 결제마다 | 소유자 감독하에 에셋에 자체 예산을 부여하는 경우 |
| **위임 에이전트(즉시)** | 에이전트 서명자 PDA의 토큰 계정 | 위임 시 한 번만 | 감독 없이 결제하는 자율 에이전트 |

위임은 언제든 취소할 수 있는 온체인 승인입니다. 각 모드의 설정, 코드, 취소 절차는 [결제 모드 가이드](/agents/x402/payment-modes)에 있습니다.

## Metaplex x402의 요청 과금 방식 {% #how-metaplex-x402-prices-requests %}

Metaplex x402는 추론을 업스트림 제공자의 토큰 요율로, RPC를 요청 단위로 과금하며 최신 요금표를 `GET /x402/pricing`에서 무료로 공개합니다.

- **채팅 완성** — 100만 토큰당 요율로 입력, 캐시된 입력, 출력에 각각 별도 요율이 적용되며 요청당 `$0.001`의 최소 금액이 적용됩니다
- **이미지 생성** — 입력 텍스트, 입력 이미지, 출력 이미지, 출력 텍스트의 4개 구분에 대해 100만 토큰당 과금되며 동일한 `$0.001` 최소 금액이 적용됩니다
- **Solana RPC** — 기본값은 요청당 `$0.00001`이며, `getSignaturesForAddress` 같은 무거운 메서드는 `$0.0001`처럼 더 높은 요율이 적용됩니다

{% callout type="note" title="유효한 가격표는 라이브 엔드포인트입니다" %}
문서에 게시된 요율은 스냅샷입니다. 라이브 서비스의 `GET /x402/pricing`이 유효한 가격표이며, 결제도 서명자도 필요 없고 SDK에서는 `getPricing()`으로 제공됩니다.
{% /callout %}

## 참고 사항 {% #notes %}

- 결제는 클래식 SPL Token 연관 토큰 계정에서 USDC로 정산됩니다. Token-2022 결제 민트는 현재 지원되지 않습니다.
- Core 에셋 및 에이전트 결제 모드에서는 Core `execute` 트랜잭션 수수료를 충당하기 위해 에셋 서명자 PDA에 소량의 SOL 잔액이 필요합니다. 표준 지갑 결제에는 SOL이 필요 없으며 서비스의 수수료 지불자가 네트워크 수수료를 부담합니다.
- x402 RPC 엔드포인트는 HTTP 요청만 지원합니다. WebSocket 연결과 구독은 지원되지 않습니다.
- 호스팅 서버는 오픈소스가 아닙니다. 클라이언트, 예제, 프로토콜 타입은 Apache-2.0으로 공개되어 있습니다.
- 서비스 이용은 [Metaplex.com 이용약관](https://www.metaplex.com/terms-of-use) 및 [개인정보 처리방침](https://www.metaplex.com/privacy)에 동의하는 것을 의미합니다.

## 빠른 참조 {% #quick-reference %}

| 항목 | 값 |
|------|-----|
| API 베이스 URL | `https://api.metaplex.com/x402` |
| RPC URL | `https://api.metaplex.com/x402/rpc` |
| JS 클라이언트 | `@metaplex-foundation/x402` (`0.1.0`) |
| 런타임 | Node.js 20.18+, ESM |
| 정산 자산 | USDC (클래식 SPL Token) |
| 운영 에이전트 | `MECHjj31U1hBapoVeJtZo5U5WGRd2293JEwRErvPTuF` |
| 소스 | [GitHub](https://github.com/metaplex-foundation/x402) (Apache-2.0) |

## FAQ {% #faq %}

Metaplex x402에 대한 일반적인 질문.

### Metaplex x402란 무엇인가요? {% #what-is-metaplex-x402 %}
Metaplex x402는 LLM 추론, 이미지 생성, Solana RPC 액세스를 판매하는 요청당 과금 HTTP API입니다. API 키, 계정, 구독이 필요 없으며 각 요청은 [x402 프로토콜](https://www.x402.org)을 사용해 Solana에서 USDC로 결제됩니다. x402는 HTTP `402 Payment Required` 상태를 기계가 결제 가능한 흐름으로 바꾸는 프로토콜입니다.

### Metaplex x402를 사용하려면 API 키나 계정이 필요한가요? {% #do-i-need-an-api-key-or-an-account-to-use-metaplex-x402 %}
아니요. 결제가 곧 인증입니다. USDC를 보유한 Solana 지갑, Core 에셋 또는 등록된 에이전트만 있으면 됩니다. OpenAI SDK는 비어 있지 않은 `apiKey` 값을 요구하므로 예제에서는 문자열 `'x402'`를 전달하지만 게이트웨이는 이를 무시합니다.

### Mech란 무엇인가요? {% #what-is-mech %}
Mech는 x402 서비스를 운영하는 온체인 Metaplex 에이전트입니다. 결제는 Mech의 Core 지갑 — 즉 Asset Signer PDA — 으로 USDC로 정산됩니다. Mech는 여러분의 에이전트나 지갑에 서비스를 판매하는 에이전트이며 주소는 `MECHjj31U1hBapoVeJtZo5U5WGRd2293JEwRErvPTuF`입니다.

### Nori 서비스 에이전트 문서는 어떻게 되었나요? {% #what-happened-to-the-nori-service-agent-documentation %}
Nori 페이지는 공개 릴리스된 적이 없고 더 이상 유지보수되지 않는 초기 프로토타입을 설명한 것이었습니다. 이를 대체해 실제로 출시된 서비스가 Metaplex x402입니다. 현재 **Nori**라는 이름은 [Metaplex AI 코파일럿](https://www.metaplex.com/nori)을 가리키며, 유료 추론 및 RPC와는 무관한 별개의 제품입니다.

### Metaplex x402는 SOL로 과금하나요, USDC로 과금하나요? {% #does-metaplex-x402-charge-in-sol-or-usdc %}
USDC입니다. 결제는 클래식 SPL Token 연관 토큰 계정에서 이루어지며 Token-2022 결제 민트는 지원되지 않습니다. Core 에셋 및 에이전트 결제 모드에서는 Core `execute` 트랜잭션 수수료를 충당하기 위해 에셋 서명자 PDA에 소량의 SOL 잔액도 필요합니다.

### Metaplex x402 서버는 오픈소스인가요? {% #is-the-metaplex-x402-server-open-source %}
클라이언트는 오픈소스입니다. TypeScript 클라이언트, 예제, 프로토콜 타입은 [github.com/metaplex-foundation/x402](https://github.com/metaplex-foundation/x402)에 Apache-2.0으로 공개되어 있습니다. 호스팅 서비스를 구동하는 서버는 현재 공개되어 있지 않습니다.

### 요청 한 건의 비용은 얼마인가요? {% #how-much-does-a-request-cost %}
추론 가격은 업스트림 제공자의 토큰 요율을 따르며 요청당 `$0.001`의 최소 금액이 적용됩니다. RPC 호출은 요청당 `$0.00001`부터 과금되며 무거운 메서드에는 더 높은 요율이 적용됩니다. `GET /x402/pricing`은 최신 요율을 반환하며 무료로 호출할 수 있습니다.

## 용어집 {% #glossary %}

Metaplex x402 문서 전반에서 사용되는 용어.

| 용어 | 정의 |
|------|------|
| **x402** | HTTP `402 Payment Required` 상태를 사용해 스테이블코인 마이크로페이먼트를 API 요청/응답 주기의 일부로 만드는 개방형 프로토콜 |
| **Metaplex x402** | 추론, 이미지 생성, Solana RPC를 판매하는 `https://api.metaplex.com/x402`의 Metaplex 호스팅 x402 서비스 |
| **Mech** | Metaplex x402를 운영하고 USDC 결제를 수령하는 온체인 Metaplex 에이전트 |
| **Asset Signer PDA** | `["mpl-core-execute", asset]`에서 파생되는 MPL Core PDA. Core 에셋의 온체인 지갑이며 Core의 [Execute 라이프사이클 훅](/smart-contracts/core/execute-asset-signing)을 통해 제어됩니다 |
| **결제 모드** | 어떤 계정이 결제를 부담하고 그 소유자가 얼마나 자주 서명하는지 — 표준 지갑, Core 에셋 또는 에이전트 직접 결제, 위임 에이전트 |
| **실행 위임** | 요청마다 소유자가 서명하지 않아도 Mech가 등록된 에이전트의 지갑에서 결제를 승인할 수 있게 하는 취소 가능한 온체인 승인(`ExecutionDelegateRecordV1`) |
| **퍼실리테이터** | 리소스를 반환하기 전에 제출된 결제를 검증하고 온체인에서 정산하는 x402 구성 요소 |
| **DAS** | [Digital Asset Standard](/solana/rpcs-and-das) 읽기 API. x402 RPC 엔드포인트에서 패스스루로 사용할 수 있습니다 |

---

Metaplex Foundation 관리. 최종 검증: 2026-09-08. 클라이언트 버전: `@metaplex-foundation/x402` `0.1.0`. [GitHub에서 소스 보기](https://github.com/metaplex-foundation/x402).
