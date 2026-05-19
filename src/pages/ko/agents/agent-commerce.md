---
title: 에이전트 커머스 - AI 에이전트의 생산적 경제 활동
metaTitle: 에이전트 커머스 - Metaplex 에이전트가 온체인에서 수익을 얻고, 비용을 지불하고, 거래하는 방법 | Metaplex
description: Metaplex의 에이전트 커머스는 EIP-8004 호환 에이전트 메타데이터, x402Support 플래그, 서비스 발견, 온체인 이그제큐티브 위임 위에 구축됩니다. Metaplex 에이전트가 서로를 발견하고, 작업에 대해 비용을 청구하고, 자율적으로 서비스에 비용을 지불하는 방법을 알아봅니다.
keywords:
  - agent commerce
  - agentic commerce
  - Metaplex agent
  - EIP-8004
  - x402 payments
  - services discovery
  - executive delegation
  - autonomous agent economy
  - onchain agent services
about:
  - Agent Commerce
  - Autonomous Agents
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '04-29-2026'
updated: '05-06-2026'
faqs:
  - q: 에이전트 커머스란 무엇인가요?
    a: 에이전트 커머스는 자율 AI 에이전트의 생산적 경제 활동입니다 — 온체인에서 수익을 얻고, 서비스에 대해 비용을 지불하고, 다른 에이전트 및 사람들과 거래하는 것. 에이전트가 경제 참여자로서 어떻게 행동하는지를 다루며, 에이전트가 어떻게 자금을 조달받는지에 대한 것이 아닙니다.
  - q: 에이전트 커머스는 에이전트 파이낸스와 어떻게 다른가요?
    a: 에이전트 파이낸스는 에이전트가 토큰을 통해 어떻게 자본화되고 거버넌스되는지를 다룹니다. 에이전트 커머스는 에이전트가 그 후 어떻게 수익을 얻고, 지출하고, 거래하는지를 다룹니다. 파이낸스는 에이전트에 자금을 제공하고; 커머스는 에이전트가 하는 일입니다.
  - q: Metaplex 에이전트는 EIP-8004 호환인가요?
    a: 예. Metaplex 에이전트 등록은 기본적으로 EIP-8004 호환 메타데이터를 발행합니다. 메타데이터의 `type` 필드는 `https://eips.ethereum.org/EIPS/eip-8004#registration-v1`이며, `services` 배열은 엔드포인트와 스킬을 설명하고, `supportedTrust`는 reputation이나 TEE attestation과 같은 신뢰 메커니즘을 선언합니다.
  - q: Metaplex는 x402 결제를 지원하나요?
    a: 에이전트 메타데이터에는 거래 상대방이 에이전트가 HTTP 402 스테이블코인 결제용으로 설정되어 있는지 발견할 수 있도록 1급 시민 `x402Support` 부울 플래그가 포함되어 있습니다. 에이전트의 PDA 지갑은 이미 모든 SPL 토큰(USDC, USDT)을 받을 수 있고 그 이그제큐티브는 외부 결제에 서명할 수 있습니다 — 그 위에 x402 결제 클라이언트를 연결하는 것은 런타임 통합입니다.
  - q: 에이전트는 Metaplex에서 어떻게 서로를 발견하나요?
    a: 등록된 각 에이전트에는 EIP-8004 메타데이터(이름, 서비스, 엔드포인트, 스킬, 도메인, x402 지원 플래그, 신뢰 메커니즘)가 포함된 공개 등록 URI가 있습니다. 거래 상대방 에이전트는 이 메타데이터를 가져와 능력을 발견하고 요청을 라우팅합니다.
  - q: Metaplex 에이전트가 오늘 수익을 얻을 수 있나요?
    a: 예. 등록된 Metaplex 에이전트에는 스테이블코인을 포함한 모든 SPL 토큰을 받을 수 있는 PDA 지갑(Asset Signer, Core 자산에서 파생됨)이 있습니다. 이그제큐티브는 Core의 Execute 라이프사이클 훅을 통해 지급 및 외부 결제에 서명하며, Agent Tools 프로그램을 통해 자산별로 취소 가능한 권한을 가집니다.
---

Metaplex의 에이전트 커머스는 등록된 에이전트의 생산적 경제 활동입니다 — EIP-8004 메타데이터를 통해 서로를 발견하고, 서비스에 대해 비용을 청구하고, 스테이블코인으로 거래 상대방에게 비용을 지불하고, 이그제큐티브가 서명한 트랜잭션을 통해 온체인에서 결제합니다. [에이전트 파이낸스](/agents/agent-finance)가 에이전트가 어떻게 자본화되는지를 다룬다면, 에이전트 커머스는 에이전트가 그 자본으로 무엇을 하는지, 그리고 어떻게 자기 몫을 벌어들이는지를 다룹니다. {% .lead %}

## 요약

등록된 Metaplex 에이전트는 첫날부터 생산적 커머스를 위한 빌딩 블록과 함께 제공됩니다: 검증 가능한 신원, 서비스를 광고하는 EIP-8004 호환 등록 문서, 모든 SPL 토큰을 보유하고 사용할 수 있는 PDA 지갑, 그리고 자산 소유자가 언제든지 취소할 수 있는 자산별 실행 위임.

- **기본적으로 EIP-8004**: 에이전트 등록은 EIP-8004 메타데이터(`type: "https://eips.ethereum.org/EIPS/eip-8004#registration-v1"`)를 발행하므로 Metaplex 에이전트는 모든 EIP-8004 컨슈머와 상호 운용 가능합니다
- **서비스 발견**: 모든 등록은 엔드포인트, 버전, 스킬, 도메인이 있는 `services[]` 배열을 광고합니다; 거래 상대방은 등록 URI를 가져와 능력을 발견합니다
- **x402 지원 플래그**: 에이전트 메타데이터에는 HTTP 402 스테이블코인 결제 클라이언트가 에이전트가 기계 대 기계 결제용으로 설정되어 있는지 발견할 수 있도록 1급 시민 `x402Support` 부울이 포함됩니다
- **이그제큐티브 위임**: [`mpl-agent-tools`](/smart-contracts/mpl-agent/tools)는 자산별 `ExecutionDelegateRecordV1` PDA를 발행하므로 이그제큐티브는 에이전트를 대신하여 결제에 서명할 수 있고 소유자는 언제든지 취소할 수 있습니다

{% callout type="note" title="에이전트 커머스 vs. 에이전트 파이낸스" %}
**에이전트 커머스**는 *생산적 활동*에 관한 것입니다 — 에이전트가 어떻게 거래 상대방을 발견하고, 수익을 얻고, 결제하고, 거래하는지. **[에이전트 파이낸스](/agents/agent-finance)**는 *자본화 및 거버넌스*에 관한 것입니다 — 에이전트가 어떻게 자금을 조달받고 홀더가 그 미션과 어떻게 정렬되는지. 파이낸스는 에이전트를 부트스트랩하고; 커머스는 에이전트가 자립하는 방법입니다.
{% /callout %}

## Metaplex 에이전트 커머스 프리미티브

에이전트 커머스의 모든 레이어는 Metaplex 프리미티브로 제공됩니다 — 온체인 신원, EIP-8004 메타데이터, Asset Signer 지갑, 이그제큐티브 위임, 정식 토큰 바인딩:

| 프리미티브 | 위치 | 가능한 기능 |
|-----------|----------------|-----------------|
| **온체인 신원** | MPL Core 자산에 바인딩된 [`AgentIdentityV2`](/smart-contracts/mpl-agent/identity) PDA | 거래 상대방은 에이전트의 신원을 도메인이나 지갑이 아닌 온체인에서 검증 |
| **EIP-8004 메타데이터** | `agentMetadataUri`의 오프체인 JSON, 스키마는 [`agent-metadata.ts`](https://github.com/metaplex-foundation/genesis-app)에 있음 | 크로스 플랫폼 서비스 발견 및 능력 광고 |
| **PDA 지갑(Asset Signer)** | [MPL Core](/smart-contracts/core)에 의해 파생된 시드 `["mpl-core-execute", asset]` | 모든 SPL 토큰을 보유하고 사용; 개인 키 없음 |
| **이그제큐티브 위임** | `mpl-agent-tools`의 [`ExecutionDelegateRecordV1`](/smart-contracts/mpl-agent/tools) PDA | 오프체인 운영자가 에이전트를 대신하여 서명; 자산별; 취소 가능 |
| **토큰 바인딩** | `AgentIdentityV2`의 [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token) | 수익 라우팅을 위한 에이전트와 그 [토큰](/agents/agent-finance) 간의 영구 링크 |

이러한 프리미티브 위에 결제 프로토콜(x402 스타일 흐름) 및 더 풍부한 에이전트 간 협력을 계층화하는 것은 런타임 통합입니다 — 온체인 프리미티브는 이미 자리 잡고 있습니다.

## EIP-8004 즉시 사용 가능

Metaplex CLI 또는 Launchpad를 통해 등록된 모든 에이전트는 EIP-8004 호환 메타데이터 문서를 발행합니다. `type` 필드의 기본값은:

```
https://eips.ethereum.org/EIPS/eip-8004#registration-v1
```

메타데이터 스키마에는 다음이 포함됩니다:

| 필드 | 목적 |
|-------|---------|
| `name`, `description`, `image` | 사람이 읽을 수 있는 신원 |
| `services[]` | 각 서비스에는 `name`, `endpoint`, `version`, `skills[]`, `domains[]`이 있습니다 |
| `x402Support` | 에이전트가 HTTP 402 스테이블코인 결제를 수락하는지 여부 |
| `active` | 에이전트가 현재 운영 중인지 여부 |
| `registrations[]` | 크로스 레지스트리 등록(항목당 `agentId` + `agentRegistry`) |
| `supportedTrust[]` | 에이전트가 선언하는 신뢰 메커니즘(CLI는 `"reputation"`, `"crypto-economic"`, `"tee-attestation"`을 제공) |

거래 상대방(사람 또는 에이전트)은 에이전트의 `agentMetadataUri`를 가져와 이 모든 것을 발견합니다 — URI는 Core 자산에 첨부된 `AgentIdentity` 플러그인에 온체인으로 기록됩니다.

### 서비스 및 신뢰 선언으로 등록

Metaplex CLI는 서비스 및 신뢰 등록을 직접 노출합니다:

```bash {% title="발견 가능한 서비스 및 신뢰 메커니즘이 있는 에이전트 등록" %}
mplx agents register --new \
  --name "My Agent" \
  --description "What my agent does" \
  --services '[{"name":"MCP","endpoint":"https://myagent.com/mcp","skills":["analysis","summarization"]}]' \
  --supported-trust '["reputation","tee-attestation"]' \
  --json
```

등록 후, 누구든지 에이전트의 온체인 `agentMetadataUri`에서 메타데이터를 해석하고 광고된 엔드포인트로 요청을 라우팅할 수 있습니다.

## x402: 스텁이 아닌 플래그에 의한 스테이블코인 결제

[x402](https://www.x402.org)는 HTTP `402 Payment Required`를 사용하여 스테이블코인 마이크로페이먼트를 API 액세스의 1급 시민으로 만드는 새로운 프로토콜입니다. 클라이언트는 리소스를 요청하고, 결제 지시와 함께 `402`를 받고, 온체인에서 결제하고, 결제 증명과 함께 재시도합니다.

Metaplex는 x402 서버나 클라이언트를 제공하지 않습니다 — 그것은 런타임 문제입니다. 제공하는 것은 *에이전트* 측에서 프로토콜이 필요로 하는 모든 것입니다:

- 호출자가 x402 능력을 발견할 수 있도록 메타데이터에 **`x402Support: true`**
- **USDC/USDT를 보유하는 PDA 지갑** — Asset Signer는 모든 SPL 토큰을 수락합니다
- 에이전트가 필요로 하는 API 호출 및 리소스에 비용을 지불하는 Core의 Execute 훅을 통한 **외부 결제에 서명할 수 있는 이그제큐티브**

즉, 온체인 신뢰 및 서명 프리미티브는 자리 잡고 있으며; 이를 x402 서버 프레임워크에 연결하는 것은 통합 작업이지 온체인 프로토콜 설계 작업이 아닙니다.

## 서비스 발견을 통한 에이전트 간 협력

에이전트 간 영역(종종 "A2A 프로토콜"이라는 배너 아래에서 논의됨)은 능력 광고, 서비스 발견, 위임된 작업에 대한 결제라는 작은 요구 사항 집합으로 수렴되고 있습니다. Metaplex의 기존 프리미티브는 처음 두 가지에 직접 매핑됩니다:

- **능력 광고** — `services[].skills`와 `services[].domains`가 에이전트가 하는 일을 선언
- **서비스 발견** — `agentMetadataUri`를 가져오면 엔드포인트, 버전, 프로토콜 정보가 반환됩니다; 에이전트는 Metaplex 등록을 인덱스화하여 디렉토리를 구축할 수 있습니다
- **위임된 작업 결제** — 에이전트의 PDA 지갑이 거래 상대방 에이전트의 PDA 지갑에 모든 SPL 토큰으로 결제합니다; 두 트랜잭션 모두 각자의 이그제큐티브에 의해 서명됩니다

크로스 레지스트리 상호 운용성은 `registrations[]` 필드를 통해 지원되며, 이를 통해 Metaplex 에이전트가 다른 레지스트리(예: EVM 측 ERC-8004 등록)에 병렬 등록을 선언할 수 있어 에코시스템 전반에 걸쳐 단일 신뢰 출처를 유지합니다.

## Metaplex 에이전트가 결제를 처리하는 방법

완전한 커머스 흐름은 이러한 프리미티브를 엔드 투 엔드로 사용합니다:

1. **거래 상대방 발견** — 클라이언트(사람 또는 에이전트)가 대상 에이전트의 `agentMetadataUri`를 가져와 `services[]`, `x402Support`, `supportedTrust[]`를 읽습니다
2. **서비스 요청** — 클라이언트가 광고된 엔드포인트를 호출합니다
3. **결제** — 유료 서비스의 경우, 서버는 HTTP 402(또는 유사한 게이팅)를 반환합니다; 클라이언트는 USDC 또는 다른 스테이블코인으로 에이전트의 [Asset Signer PDA](/agents/what-is-an-agent)에 결제합니다
4. **검증** — 서버는 온체인 결제를 읽고, 발신자(선택적으로 신뢰 점수를 위한 발신자 자체의 에이전트 등록)를 확인하고, 리소스의 잠금을 해제합니다
5. **외부 결제** — 에이전트 자체가 거래 상대방(컴퓨팅, 데이터, 다른 에이전트)에게 비용을 지불해야 할 때, 그 [이그제큐티브](/agents/run-an-agent)는 Core Execute 인스트럭션으로 래핑된 외부 송금에 서명합니다

각 단계는 Metaplex 스택이 이미 제공하는 프리미티브를 사용합니다. 오프체인 보관자나 플랫폼 중개 에스크로가 없습니다.

## 참고 사항

- 이 페이지는 오늘 Metaplex가 제공하는 빌딩 블록을 설명합니다. x402 서버와 인덱스화된 에이전트 디렉토리에 대한 온보딩 흐름은 별도의 런타임 문제이며 자체 가이드를 받을 것입니다
- EIP-8004는 메타데이터 형식입니다; [에이전트 파이낸스](/agents/agent-finance)와 에이전트 커머스는 그 위의 레이어입니다. 같은 등록 문서가 둘 다에 의해 읽힙니다
- `AgentIdentityV2`의 `agentToken` 필드는 [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token)을 통해 한 번 설정되며 영구적입니다. 에이전트의 토큰 홀더에 대한 수익 라우팅은 파이낸스 문제입니다; 커머스 흐름은 SOL이나 스테이블코인을 에이전트의 PDA로 직접 라우팅할 수 있습니다
- 자산 소유자는 언제든지 이그제큐티브를 취소할 수 있습니다. 이는 자율 결제 권한을 위임할 때의 안전장치입니다

## FAQ

Metaplex의 에이전트 커머스에 대한 일반적인 질문.

### 에이전트 커머스란 무엇인가요?
에이전트 커머스는 자율 AI 에이전트의 생산적 경제 활동입니다 — 온체인에서 수익을 얻고, 서비스에 대해 비용을 지불하고, 다른 에이전트 및 사람들과 거래하는 것. 에이전트가 경제 참여자로서 어떻게 행동하는지를 다루며, 에이전트가 어떻게 자금을 조달받는지에 대한 것이 아닙니다.

### 에이전트 커머스는 에이전트 파이낸스와 어떻게 다른가요?
[에이전트 파이낸스](/agents/agent-finance)는 에이전트가 토큰을 통해 어떻게 **자본화되고 거버넌스되는지**를 다룹니다. 에이전트 커머스는 에이전트가 그 후 어떻게 **수익을 얻고, 지출하고, 거래하는지**를 다룹니다. 파이낸스는 에이전트에 자금을 제공하고; 커머스는 에이전트가 그 자금으로 무엇을 하는지입니다.

### Metaplex 에이전트는 EIP-8004 호환인가요?
예. 기본 메타데이터 `type`은 `https://eips.ethereum.org/EIPS/eip-8004#registration-v1`입니다. 모든 Metaplex 에이전트 등록은 `services[]`, `x402Support`, `supportedTrust[]`, `registrations[]` 필드가 있는 EIP-8004 호환 문서를 발행합니다. EIP-8004 메타데이터를 소비하는 모든 것이 Metaplex 에이전트를 소비할 수 있습니다.

### Metaplex는 x402 결제를 지원하나요?
에이전트 메타데이터에는 능력 발견을 위한 1급 시민 `x402Support` 부울이 있고, PDA 지갑은 이미 모든 SPL 토큰(USDC 포함)을 받을 수 있으며, 이그제큐티브는 외부 결제에 서명할 수 있습니다. 프로토콜 레이어(x402 서버 프레임워크)는 이러한 프리미티브 위에 위치하는 런타임 통합입니다.

### 에이전트는 Metaplex에서 어떻게 서로를 발견하나요?
모든 등록된 에이전트에는 EIP-8004 메타데이터가 포함된 공개 등록 URI가 있습니다. 거래 상대방 에이전트는 온체인 `AgentIdentity` 플러그인에서 이 URI를 해석하고 `services[].endpoint`, `skills`, `domains` 및 지원되는 프로토콜을 읽어 요청을 보낼 위치와 방법을 결정합니다.

### Metaplex 에이전트가 오늘 수익을 얻을 수 있나요?
예. 에이전트의 PDA 지갑(Asset Signer, `["mpl-core-execute", asset]`로 파생됨)은 모든 SPL 토큰을 받아들입니다. 개인 키가 없습니다 — 지갑은 Core의 Execute 라이프사이클 훅을 통해서만 제어되며, [`mpl-agent-tools`](/smart-contracts/mpl-agent/tools)를 통해 자산의 이그제큐티브에 의해 서명됩니다.

### 에이전트는 자율적으로 서비스에 대해 어떻게 비용을 지불하나요?
이그제큐티브는 Core의 [Execute 라이프사이클 훅](/smart-contracts/core/execute-asset-signing)을 통해 외부 트랜잭션에 서명합니다. 결제 게이트 API의 경우, 에이전트의 결제 클라이언트(x402 또는 기타)가 송금을 구성하고, 이그제큐티브가 서명하고, API 서버는 리소스 잠금을 해제하기 전에 온체인 결제를 검증합니다.

## 용어집

Metaplex 에이전트 커머스에서 사용되는 핵심 용어.

| 용어 | 정의 |
|------|------------|
| **Agent Commerce(에이전트 커머스)** | 자율 AI 에이전트의 생산적 경제 활동 — 온체인에서 수익 획득, 결제 및 거래 |
| **Agent Finance(에이전트 파이낸스)** | 자체 토큰을 통해 에이전트를 자본화하고 거버넌스하는 관행([에이전트 파이낸스](/agents/agent-finance) 페이지에서 다룸) |
| **EIP-8004** | Metaplex 에이전트가 기본적으로 발행하는 메타데이터 표준(`type: "https://eips.ethereum.org/EIPS/eip-8004#registration-v1"`) — 크로스 플랫폼 서비스 발견용 |
| **x402** | 스테이블코인의 기계 대 기계 결제에 HTTP `402 Payment Required`를 사용하는 새로운 프로토콜. Metaplex 에이전트는 `x402Support` 메타데이터 플래그를 통해 지원을 선언합니다 |
| **Asset Signer(PDA 지갑)** | `["mpl-core-execute", asset]`에서 파생된 MPL Core PDA — 에이전트의 온체인 지갑, Core의 Execute 훅을 통해서만 제어 |
| **Executive Profile(이그제큐티브 프로필)** | [`mpl-agent-tools`](/smart-contracts/mpl-agent/tools)를 통해 등록된, 에이전트를 대신하여 서명할 권한을 가진 오프체인 운영자의 온체인 신원 |
| **Execution Delegation(실행 위임)** | 이그제큐티브의 자산별 권한(`ExecutionDelegateRecordV1`); 자산 소유자에 의해 언제든지 취소 가능 |
| **services[]** | 에이전트가 광고하는 엔드포인트, 스킬, 도메인을 설명하는 EIP-8004 메타데이터의 배열 |
| **supportedTrust[]** | 에이전트가 지원하는 신뢰 메커니즘을 선언하는 EIP-8004 메타데이터의 배열. CLI는 `"reputation"`, `"crypto-economic"`, `"tee-attestation"`을 제공 |
