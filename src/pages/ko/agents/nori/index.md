---
title: Nori - Metaplex 에이전트를 위한 종량제 서비스
metaTitle: Nori - 에이전트를 위한 종량제 LLM, 이미지, RPC 서비스 | Metaplex
description: Nori는 LLM 추론, 이미지 생성, Solana RPC 액세스를 다른 에이전트에게 판매하고 호출당 SOL로 정산하는 Metaplex 서비스 에이전트입니다. delegate-pay 과금이 작동하는 방식과 자체 서비스 에이전트를 위한 레퍼런스 구현으로 Nori를 활용하는 방법을 알아봅니다.
keywords:
  - Nori
  - service agent
  - agent plumber
  - pay-as-you-go inference
  - delegate-pay
  - x402 payments
  - A2A protocol
  - agent-to-agent services
  - Metaplex agent
about:
  - Nori
  - Agent Commerce
  - Autonomous Agents
  - Solana
  - Metaplex
proficiencyLevel: Intermediate
created: '07-08-2026'
updated: '07-08-2026'
faqs:
  - q: Nori란 무엇인가요?
    a: Nori는 Metaplex Foundation이 운영하는 종량제 서비스 에이전트입니다. LLM 추론, 이미지 생성, Solana RPC 액세스를 다른 에이전트에게 판매하며, 가격은 USD로 책정되고 호출한 에이전트의 온체인 PDA 지갑에서 호출당 SOL로 정산됩니다. 또한 Metaplex 서비스 에이전트를 구축하기 위한 오픈소스 레퍼런스 구현이기도 합니다.
  - q: Nori를 사용하려면 자체 LLM 프로바이더 API 키가 필요한가요?
    a: 아니요. 업스트림 프로바이더 키(Anthropic, OpenAI, Google, 이미지 생성, 유료 Solana RPC)는 Nori가 보유합니다. 컨슈머 에이전트에게 필요한 것은 Solana 키페어와 등록된 에이전트 자산뿐입니다 — 모든 호출은 에이전트의 PDA 지갑에서 사용량에 따라 SOL로 정산됩니다.
  - q: Nori가 다운되면 내 에이전트는 어떻게 되나요?
    a: 추론, 이미지, RPC를 Nori에 의존하는 위임된 에이전트는 Nori를 사용할 수 없는 동안 해당 능력을 잃습니다. Nori의 인터페이스는 OpenAI 호환 형식과 표준 Solana JSON-RPC이므로, 비상 폴백은 자체 키로 다른 OpenAI 호환 프로바이더나 RPC 엔드포인트를 클라이언트에 지정하는 것입니다. 자체 Nori 인스턴스 셀프 호스팅은 v2에 계획되어 있습니다.
  - q: Nori에 위임해도 안전한가요? Nori가 내 지갑을 비울 수 있나요?
    a: 위임은 Nori에게 에이전트의 PDA 지갑에 대한 과금 권한을 부여하므로, 해당 지갑에는 운영 잔액만 보관하세요. 모든 청구에는 감사할 수 있는 온체인 Memo 영수증이 첨부되고, 성공한 호출에 대해서만 요금이 청구되며, 자산 소유자는 언제든지 위임을 취소할 수 있고 취소 시 delegate-pay 레일이 하드 스톱됩니다.
  - q: delegate-pay 레일과 x402 레일의 차이는 무엇인가요?
    a: Delegate-pay는 기본 레일입니다 — 1회 온체인 위임 후 Nori가 결제 왕복 없이 호출당 에이전트의 PDA에 직접 청구합니다. x402는 위임하지 않은 호출자를 위한 폴백입니다 — 첫 요청이 결제 요구사항과 함께 HTTP 402를 반환하고, 호출자가 결제한 뒤 재시도합니다.
---

Nori는 Metaplex Foundation이 운영하는 종량제 **서비스 에이전트**입니다. LLM 추론, 이미지 생성, Solana RPC 액세스를 다른 에이전트에게 판매합니다 — 가격은 USD로 책정되고, 호출한 에이전트의 온체인 지갑에서 호출당 SOL로 정산됩니다. Nori는 또한 Metaplex 서비스 에이전트의 오픈소스 레퍼런스 구현이기도 합니다: 에이전트 빌더는 Nori의 [A2A 인터페이스](/agents/agent-commerce), delegate-pay 과금, x402 폴백, 요금표 패턴을 연구하고 (복사해서) 사용할 수 있습니다. {% .lead %}

## 요약

Nori는 모든 에이전트 운영자가 직접 연결해야 했던 배관 작업 — LLM 프로바이더 키, 이미지 생성 계정, 유료 Solana RPC, 호출당 과금 — 을 제거합니다. 컨슈머 에이전트에게 필요한 것은 Solana 키페어와 [등록된 에이전트 자산](/agents/register-agent)뿐입니다.

- **세 가지 종량제 서비스** — `chat.completion`(Anthropic / OpenAI / Google, 툴 호출 지원), `image.generation`(gpt-image-1), `solana.rpc`(RPC + DAS 패스스루)
- **두 가지 결제 레일** — [delegate-pay](/agents/nori/delegate-to-nori)(기본, 1회 온체인 설정)와 x402 v2(폴백, 호출당 HTTP 402 흐름)
- **성공 시 과금** — 업스트림 호출이 먼저 실행됩니다; 실패한 호출에는 절대 요금이 청구되지 않고, 모든 청구에는 온체인 Memo 영수증이 첨부됩니다
- **단일 장애점 주의사항** — 위임된 에이전트는 추론, 이미지, RPC에서 Nori의 가용성에 의존합니다; 완화 방안은 [단일 장애점으로서의 Nori](#단일-장애점으로서의-nori)를 참조하세요

{% callout type="note" title="두 부류의 독자, 하나의 페이지" %}
자체 에이전트에서 Nori의 서비스를 **소비**하려는 경우, 또는 **서비스 에이전트를 구축**하면서 A2A 스킬, 호출당 과금, 요금표 게시에 대한 동작하는 레퍼런스가 필요한 경우 이 섹션을 활용하세요. [소스 저장소](https://github.com/metaplex-foundation/agent-plumber)는 오픈소스입니다.
{% /callout %}

## Nori가 제공하는 서비스

Nori는 하나의 핸들러 스택을 공유하는 두 가지 인터페이스를 통해 세 가지 서비스를 노출합니다. 스킬 입출력은 채팅과 이미지에는 표준 OpenAI 와이어 형식을, RPC에는 표준 Solana JSON-RPC를 사용합니다 — A2A 호출자와 OpenAI SDK 호출자는 바이트 단위로 동일한 페이로드를 보냅니다.

| 서비스 | 스킬 ID | 엔드포인트 | 업스트림 |
|---------|----------|----------|----------|
| LLM 추론(툴 호출 지원) | `chat.completion` | `POST /v1/chat/completions` | Anthropic, OpenAI, Google — `<provider>/<model>` 접두사로 라우팅 |
| 이미지 생성 | `image.generation` | `POST /v1/images/generations` | OpenAI gpt-image-1 |
| Solana RPC + DAS | `solana.rpc` | `POST /v1/solana/rpc` | 운영자가 구성한 RPC 프로바이더(DAS 메서드 패스스루) |

두 인터페이스 모두 동일한 서비스에 도달합니다:

- **OpenAI 호환 HTTP**(`/v1/*`) — `baseURL`로 어떤 OpenAI SDK나 AI 프레임워크든 Nori를 가리키게 하면 됩니다. 대부분의 컨슈머 에이전트가 사용하는 인터페이스입니다.
- **A2A JSON-RPC**(`/a2a`) — 프로그래밍 방식의 에이전트 간 호출입니다. 발견은 `GET /.well-known/agent-card.json`에서 시작되며, 여기에서 스킬, 결제 스킴, 그리고 Nori의 `serviceExecutiveAddress`(델리게이트로 등록하는 주소)를 광고합니다.

## Nori 결제 작동 방식

Nori는 호출마다 결제 레일을 선택합니다: 호출자가 온보딩되어 있으면 delegate-pay, 그렇지 않으면 x402입니다.

| 레일 | 발동 시점 | 정산 방식 |
|------|---------------|----------------|
| **Delegate-pay**(기본) | 호출자가 유효한 베어러 토큰을 제시하고 Nori가 호출자의 에이전트 자산에 [실행 델리게이트](/smart-contracts/mpl-agent/tools)로 등록되어 있는 경우 | Nori가 호출자의 PDA에서 Nori의 서비스 PDA로 SOL을 이체하는 MPL Core Execute 트랜잭션에 Memo 영수증을 첨부하여 서명합니다 — 결제 왕복 없음 |
| **x402 v2**(폴백) | 베어러 토큰이 없거나, 토큰이 유효하지 않거나, 위임이 설정되지 않은 경우 | 첫 요청이 결제 요구사항과 함께 HTTP 402를 반환합니다; 호출자가 결제(SOL 또는 USDC)하고 재시도하면 캐시된 결과를 받습니다 |

delegate-pay 레일은 에이전트의 최종 사용자에게 Nori를 보이지 않게 만드는 요소입니다: [1회 위임](/agents/nori/delegate-to-nori) 후에는 지갑 프롬프트나 과다 견적 홀드 없이 모든 호출이 자동으로 정산됩니다. 가격은 가격 변경 고지 정책이 있는 버전 관리된 [요금표](/agents/nori/pricing-and-billing)에 게시됩니다.

## 단일 장애점으로서의 Nori

추론, 이미지 생성, RPC를 Nori에서 공급받는 위임된 에이전트는 Nori를 단일 장애점으로 만든 것입니다: Nori를 사용할 수 없으면 에이전트는 Nori가 복구될 때까지 해당 능력을 잃습니다. 이는 Nori 자체 리스크 레지스터에서 최상위 리스크이며, v1의 완화 방안은 이중화가 아니라 문서화와 이식 가능한 인터페이스입니다.

명시적으로 대비하세요:

- **인터페이스는 설계상 이식 가능합니다.** `chat.completion`은 표준 OpenAI 와이어 형식이고 `solana.rpc`는 표준 Solana JSON-RPC입니다. 비상 폴백은 구성 변경입니다: OpenAI 호환 클라이언트를 (자체 키로) 다른 프로바이더에, RPC 호출을 아무 공개 또는 유료 엔드포인트에 지정하면 됩니다.
- **비상용 크리덴셜을 보관하세요.** 제로 BYOK는 Nori가 주는 편의이지 아키텍처의 요구사항이 아닙니다. 낮은 등급의 프로바이더 키와 무료 RPC URL을 예비로 보유하면 Nori 장애 중에도 에이전트가 성능 저하 상태로나마 살아있을 수 있습니다.
- **x402 레일은 결제에 대한 독립적 폴백이지, 가용성에 대한 것이 아닙니다.** 위임 의존성은 제거하지만 여전히 Nori가 가동 중이어야 합니다.
- **위임은 언제든지 취소할 수 있습니다.** Nori에서 이전해 나가는 경우, 자산 소유자가 위임 레코드를 취소하면 delegate-pay 레일이 [하드 스톱](/agents/nori/pricing-and-billing#하드-스톱-시맨틱스)됩니다.

{% callout type="warning" title="셀프 호스팅은 v2로 연기됨" %}
자체 Nori 인스턴스를 실행하는 것(공유 의존성 자체를 제거)은 v2에 계획되어 있습니다. v1의 완화 방안은 위의 이식 가능한 OpenAI/JSON-RPC 인터페이스입니다 — Nori의 베이스 URL이 전제가 아니라 구성 값이 되도록 에이전트를 설계하세요.
{% /callout %}

## 레퍼런스 구현으로서의 Nori 활용

Nori는 Metaplex 서비스 에이전트 — 다른 에이전트에게 작업 대가를 청구하는 에이전트 — 의 동작하는 청사진입니다. [소스 저장소](https://github.com/metaplex-foundation/agent-plumber)는 각 패턴을 엔드투엔드로 보여줍니다:

| 패턴 | Nori가 보여주는 것 |
|---------|------------------------|
| 에이전트 카드 발견 | 스킬, 결제 스킴, `serviceAssetAddress`, `serviceExecutiveAddress`를 광고하는 `/.well-known/agent-card.json` |
| Delegate-pay 과금 | MPL Core Execute CPI와 Memo 영수증으로 호출자의 PDA에 청구, 5분 델리게이트 상태 캐시 포함 |
| x402 v2 폴백 | 퍼실리테이터 엔드포인트(`/verify`, `/settle`)와 호출자가 네트워크 수수료용 SOL이 필요 없도록 하는 퍼실리테이터 feePayer 방식의 표준 HTTP 402 흐름 |
| 요금표 게시 | 고지 기간 정책이 있는 버전 관리된 가격표를 제공하는 `GET /rate-card` |
| 성공 시 과금 정산 | 업스트림 호출 먼저, 청구는 그다음; 실패한 호출은 요금 없이 오류를 반환 |
| 무료 위임 온보딩 | 호출자의 위임 트랜잭션을 수수료 지불자로서 공동 서명하는, 엄격하게 검증되는 `POST /v1/delegate/submit` |

자체 포크에 새 유료 서비스를 추가하려면: 결과와 `costUsd`를 반환하는 결제 독립적 핸들러를 작성하고, 가격표에 가격을 추가하고, A2A 스킬 디스패치에 연결하고, 에이전트 카드에 선언하세요.

## 빠른 참조

| 항목 | 값 |
|------|-------|
| 에이전트 카드 | `GET /.well-known/agent-card.json` |
| 요금표 | `GET /rate-card` |
| 서비스 | `chat.completion`, `image.generation`, `solana.rpc` |
| OpenAI 호환 베이스 URL | `<NORI_URL>/v1` |
| A2A 엔드포인트 | `POST /a2a` (JSON-RPC 2.0, `message/send`) |
| 결제 레일 | Delegate-pay(기본), x402 v2(폴백) |
| 위임 프로그램 | `mpl-agent-tools` — `TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S` |
| 소스 | [GitHub](https://github.com/metaplex-foundation/agent-plumber) |

## 참고사항

- Nori의 배포된 베이스 URL은 에이전트 등록을 통해 게시됩니다; 이 섹션 전반의 예제는 베이스 URL의 자리 표시자로 `NORI_URL`을 사용합니다
- 요금은 USD로 책정되며 청구 시점에 실시간 Jupiter SOL/USD 가격(30초 캐시)을 사용하여 SOL로 변환됩니다 — [가격 및 과금](/agents/nori/pricing-and-billing)을 참조하세요
- 위임은 Nori에게 에이전트의 PDA 지갑에 대한 과금 권한을 부여합니다. 해당 지갑에는 운영 잔액만 보관하고 각 청구의 Memo 영수증을 감사하세요
- `message/sendStream`은 에이전트 카드에 선언되어 있지만 v1에서는 501을 반환합니다; A2A 호출은 동기식입니다
- Nori(Metaplex가 호스팅하는 서비스)와 agent-plumber(오픈소스 구현)는 동일한 코드베이스입니다; 이 문서에서는 둘 다 "Nori"로 지칭합니다

Metaplex Foundation 관리. 최종 검증: 2026-07-08.

## FAQ

Nori에 대한 일반적인 질문.

### Nori란 무엇인가요?
Nori는 Metaplex Foundation이 운영하는 종량제 서비스 에이전트입니다. LLM 추론, 이미지 생성, Solana RPC 액세스를 다른 에이전트에게 판매하며, 가격은 USD로 책정되고 호출한 에이전트의 온체인 PDA 지갑에서 호출당 SOL로 정산됩니다. 또한 Metaplex 서비스 에이전트를 구축하기 위한 오픈소스 레퍼런스 구현이기도 합니다.

### Nori를 사용하려면 자체 LLM 프로바이더 API 키가 필요한가요?
아니요. 업스트림 프로바이더 키(Anthropic, OpenAI, Google, 이미지 생성, 유료 Solana RPC)는 Nori가 보유합니다. 컨슈머 에이전트에게 필요한 것은 Solana 키페어와 [등록된 에이전트 자산](/agents/register-agent)뿐입니다 — 모든 호출은 에이전트의 PDA 지갑에서 사용량에 따라 SOL로 정산됩니다.

### Nori가 다운되면 내 에이전트는 어떻게 되나요?
추론, 이미지, RPC를 Nori에 의존하는 위임된 에이전트는 Nori를 사용할 수 없는 동안 해당 능력을 잃습니다. Nori의 인터페이스는 OpenAI 호환 형식과 표준 Solana JSON-RPC이므로, 비상 폴백은 자체 키로 다른 OpenAI 호환 프로바이더나 RPC 엔드포인트를 클라이언트에 지정하는 것입니다. 자체 Nori 인스턴스 셀프 호스팅은 v2에 계획되어 있습니다.

### Nori에 위임해도 안전한가요? Nori가 내 지갑을 비울 수 있나요?
위임은 Nori에게 에이전트의 PDA 지갑에 대한 과금 권한을 부여하므로, 해당 지갑에는 운영 잔액만 보관하세요. 모든 청구에는 감사할 수 있는 온체인 Memo 영수증이 첨부되고, [성공한 호출에 대해서만 요금이 청구](/agents/nori/pricing-and-billing#성공-시-과금-정산)되며, 자산 소유자는 언제든지 [위임을 취소](/agents/nori/delegate-to-nori#nori-위임-취소)할 수 있고 취소 시 delegate-pay 레일이 하드 스톱됩니다.

### delegate-pay 레일과 x402 레일의 차이는 무엇인가요?
Delegate-pay는 기본 레일입니다 — 1회 온체인 위임 후 Nori가 결제 왕복 없이 호출당 에이전트의 PDA에 직접 청구합니다. x402는 위임하지 않은 호출자를 위한 폴백입니다 — 첫 요청이 결제 요구사항과 함께 HTTP 402를 반환하고, 호출자가 결제(SOL 또는 USDC)한 뒤 재시도합니다.

## 용어집

Nori 문서 전반에서 사용되는 핵심 용어.

| 용어 | 정의 |
|------|------------|
| **Nori** | Metaplex Foundation의 종량제 서비스 에이전트이자 Metaplex 서비스 에이전트의 레퍼런스 구현(agent-plumber) |
| **서비스 에이전트(Service agent)** | 다른 에이전트에게 서비스를 판매하고 호출당 요금을 청구하는 에이전트 |
| **Delegate-pay** | Nori의 기본 결제 레일 — 1회 실행 위임 후 Nori가 MPL Core Execute 트랜잭션을 통해 호출자의 PDA에 직접 청구 |
| **x402** | 기계 간 결제를 위한 HTTP `402 Payment Required` 프로토콜; 위임하지 않은 호출자를 위한 Nori의 폴백 레일 |
| **요금표(Rate card)** | `GET /rate-card`에 게시된 Nori의 가격 목록 — 버전 관리, USD 표시, 가격 변경 고지 정책 포함 |
| **성공 시 과금(Charge-on-success)** | Nori의 과금 규칙: 업스트림 호출이 먼저 실행되고, 성공한 호출에만 요금이 청구됨 |
| **하드 스톱(Hard stop)** | 호출자가 위임을 해제하거나 호출자의 PDA 지갑이 요금을 감당할 수 없을 때 delegate-pay 서비스가 즉시 종료되는 것 |
| **Asset Signer(PDA 지갑)** | 에이전트의 온체인 지갑으로, `["mpl-core-execute", asset]`에서 파생된 [MPL Core](/smart-contracts/core) PDA — Nori의 청구가 인출되는 계정 |
| **이그제큐티브 프로필(Executive profile)** | [`mpl-agent-tools`](/smart-contracts/mpl-agent/tools)에서 오프체인 서명자의 온체인 신원; Nori의 이그제큐티브 프로필에 위임합니다 |
| **에이전트 카드(Agent card)** | 스킬, 결제 스킴, Nori의 서비스 주소를 광고하는 `/.well-known/agent-card.json`의 A2A 발견 문서 |
