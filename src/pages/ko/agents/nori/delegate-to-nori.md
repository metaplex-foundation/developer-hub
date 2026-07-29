---
title: Nori에 위임하기
metaTitle: Nori에 위임하기 - Delegate-Pay 과금을 위한 1회 온보딩 | Metaplex
description: Metaplex 에이전트에 Nori를 실행 델리게이트로 등록하여 모든 LLM, 이미지, RPC 호출이 에이전트의 PDA 지갑에서 자동으로 정산되도록 합니다. 무료 온보딩 — 수수료용 SOL도, RPC도 필요 없습니다.
keywords:
  - delegate to Nori
  - execution delegation
  - delegate-pay
  - agent onboarding
  - delegateExecutionV1
  - Nori bearer token
  - Metaplex agent billing
about:
  - Nori
  - Execution Delegation
  - Agent Commerce
  - Solana
  - Metaplex
proficiencyLevel: Intermediate
created: '07-08-2026'
updated: '07-08-2026'
programmingLanguage:
  - TypeScript
howToSteps:
  - Nori의 에이전트 카드를 가져와 serviceExecutiveAddress를 읽습니다.
  - Nori의 이그제큐티브 프로필을 가리키는 단일 delegateExecutionV1 인스트럭션이 포함된 트랜잭션을 Nori를 수수료 지불자로 하여 빌드합니다.
  - 에이전트의 이그제큐티브 키페어로 서명하고 트랜잭션을 Nori의 무료 /v1/delegate/submit 엔드포인트에 제출합니다.
  - /auth/handshake에서 서명된 챌린지를 베어러 토큰으로 교환합니다.
  - 베어러 토큰으로 유료 호출을 실행합니다 — 요금이 에이전트의 PDA 지갑에서 자동으로 정산됩니다.
howToTools:
  - '@metaplex-foundation/mpl-agent-registry'
  - '@metaplex-foundation/umi'
faqs:
  - q: Nori에 위임하는 데 비용이 드나요?
    a: 아니요. 위임 트랜잭션의 네트워크 수수료는 Nori가 지불하며(수수료 지불자로 공동 서명), 온보딩 엔드포인트는 무료이고 인증이 필요 없습니다. 다만 이후에는 에이전트의 PDA 지갑에 운영 SOL 잔액이 필요합니다. 호출당 요금이 인출되는 계정이기 때문입니다.
  - q: 위임은 Nori에게 어떤 권한을 부여하나요?
    a: 위임은 Nori의 이그제큐티브 프로필을 에이전트 자산의 실행 델리게이트로 등록하며, 이를 통해 Nori는 에이전트의 PDA 지갑에서 SOL을 이동하는 MPL Core Execute 트랜잭션에 서명할 수 있습니다. Nori는 이를 호출당 요금 정산에 사용하며, 각 청구에는 온체인 Memo 영수증이 첨부됩니다. PDA에는 운영 잔액만 보관하고 영수증을 감사하세요.
  - q: Nori가 내 에이전트에 요금을 청구하지 못하게 하려면 어떻게 하나요?
    a: 에이전트 자산의 실행 위임을 취소하세요. 다음 청구 시도는 온체인에서 실패하고, Nori의 캐시된 델리게이트 상태가 무효화되며, delegate-pay 레일이 하드 스톱됩니다 — 이후 호출은 자동 청구 대신 HTTP 402 x402 챌린지를 받습니다.
  - q: 위임했는데도 호출이 HTTP 402를 반환하는 이유는 무엇인가요?
    a: 402는 해당 호출에서 delegate-pay 레일을 사용할 수 없었다는 의미입니다 — 베어러 토큰이 없거나 만료되었거나(토큰 유효 기간 15분), 위임이 취소되었거나, 청구 자체가 실패한 경우(대개 PDA 지갑이 비어 있음)입니다. 핸드셰이크를 다시 실행하고, 위임 레코드가 존재하는지 확인하고, PDA 잔액을 점검하세요.
  - q: 위임하지 않고도 Nori를 사용할 수 있나요?
    a: 예. 위임하지 않은 호출자는 x402 폴백 레일을 사용합니다 — 첫 요청이 결제 요구사항과 함께 HTTP 402를 반환하고, SOL 또는 USDC로 결제한 뒤 재시도합니다. 비용은 동일하지만 모든 호출에 결제 왕복이 추가되는 반면, delegate-pay는 인라인으로 정산됩니다.
---

Nori에 위임하기는 에이전트의 자산에 Nori를 [실행 델리게이트](/smart-contracts/mpl-agent/tools)로 등록하는 1회 온체인 설정입니다. 그 후에는 에이전트가 Nori에 대해 실행하는 모든 LLM, 이미지, RPC 호출이 에이전트의 PDA 지갑에서 자동으로 정산됩니다 — 결제 왕복도, 지갑 프롬프트도, 프로바이더 API 키도 없습니다. 온보딩은 무료입니다: Nori가 트랜잭션 수수료를 지불하고 블록해시를 제공하므로, 에이전트의 키페어에 SOL이 있을 필요도, 자체 RPC가 있을 필요도 없습니다. {% .lead %}

## 요약

Nori에 실행 위임을 부여하면 에이전트는 두 번 왕복하는 [x402 폴백](/agents/nori/#nori-결제-작동-방식)에서 인라인 delegate-pay 레일로 전환됩니다.

- **1회 설정** — Nori의 이그제큐티브 프로필을 가리키는 단일 `delegateExecutionV1` 인스트럭션을 Nori가 무료로 공동 서명하고 제출합니다
- **호출당 정산** — Nori가 Memo 영수증이 첨부된 MPL Core Execute 트랜잭션으로 에이전트의 [Asset Signer PDA](/agents/what-is-an-agent)에 청구하며, [성공한 호출](/agents/nori/pricing-and-billing#성공-시-과금-정산)에만 청구합니다
- **베어러 토큰 인증** — 서명된 챌린지/핸드셰이크로 호출을 delegate-pay 레일로 라우팅하는 15분 유효 베어러 토큰을 발급합니다
- **언제든지 취소 가능** — 자산 소유자가 위임을 취소하면 자동 청구가 즉시 [하드 스톱](#nori-위임-취소)됩니다

{% callout type="warning" title="위임은 과금 권한을 부여합니다" %}
실행 델리게이트는 에이전트의 PDA 지갑에서 나가는 이체에 서명할 수 있습니다. PDA를 지출 계정으로 취급하세요: 자금고가 아니라 운영 잔액만 보관하고, 모든 청구에 첨부된 Memo 영수증을 감사하세요. Nori를 에이전트의 유일한 서비스 프로바이더로 삼기 전에 [단일 장애점 주의사항](/agents/nori/#단일-장애점으로서의-nori)을 확인하세요.
{% /callout %}

## 빠른 시작

1. [Nori의 에이전트 카드를 가져와](#1단계-nori의-이그제큐티브-주소-확인) `serviceExecutiveAddress`를 읽습니다
2. 이그제큐티브 키페어를 권한으로, Nori를 수수료 지불자로 하여 [위임 트랜잭션을 빌드](#2단계-위임-트랜잭션-빌드-및-제출)한 뒤 `POST /v1/delegate/submit`에 제출합니다
3. [에이전트의 PDA 지갑에](#에이전트-pda-지갑-충전) 운영 SOL 잔액을 충전합니다
4. `/auth/challenge` + `/auth/handshake`로 [베어러 토큰을 발급](#3단계-베어러-토큰으로-인증)받습니다
5. `Authorization: Bearer <token>`으로 [유료 호출을 실행](#4단계-유료-호출-실행)합니다

## 사전 요구사항

위임에는 기존 온체인 에이전트 신원이 필요합니다; 위임 트랜잭션이 자산과 그 신원 PDA를 참조합니다.

- [등록된 에이전트](/agents/register-agent) — `AgentIdentity` 레코드가 있는 MPL Core 자산
- 에이전트의 **이그제큐티브 키페어**([에이전트 실행](/agents/run-an-agent)을 통해 설정된, 에이전트가 실행에 사용하는 키페어) — 권한으로서 위임에 서명합니다
- `@metaplex-foundation/mpl-agent-registry`와 `@metaplex-foundation/umi` 설치
- 위임 자체에는 SOL도 RPC 엔드포인트도 필요하지 않습니다 — 둘 다 Nori가 제공합니다

## 1단계: Nori의 이그제큐티브 주소 확인

Nori의 에이전트 카드는 위임할 주소를 광고합니다. `/.well-known/agent-card.json`을 가져와 두 필드를 읽으세요:

- `serviceExecutiveAddress` — Nori의 이그제큐티브 키페어 공개 키입니다. 이 주소의 이그제큐티브 프로필 PDA가 자산에 델리게이트로 등록하는 대상입니다.
- `serviceAssetAddress` — Nori 자신의 에이전트 자산입니다. 이 자산의 PDA가 요금이 지급되는 곳이며, 모든 청구를 이 주소를 기준으로 온체인에서 검증할 수 있습니다.

```typescript {% title="fetch-nori-card.ts" %}
const NORI_URL = process.env.NORI_URL; // Nori's base URL

const card = await fetch(`${NORI_URL}/.well-known/agent-card.json`).then((r) =>
  r.json(),
);

const noriExecutive = card.serviceExecutiveAddress; // delegate to this
const noriServiceAsset = card.serviceAssetAddress; // charges are paid here
```

## 2단계: 위임 트랜잭션 빌드 및 제출

위임 트랜잭션에는 정확히 하나의 `delegateExecutionV1` 인스트럭션이 포함됩니다: 이그제큐티브 키페어가 권한으로 서명하고, Nori의 이그제큐티브 프로필이 델리게이트이며, Nori의 키페어가 수수료 지불자입니다. 오프라인으로 빌드하고 서명한 뒤(Nori의 무료 `GET /v1/solana/blockhash` 엔드포인트가 블록해시를 제공), 부분 서명된 트랜잭션을 `POST /v1/delegate/submit`에 POST합니다. Nori가 검증하고, 수수료 지불자로 공동 서명하고, 제출합니다.

```typescript {% title="delegate-to-nori.ts" %}
import { createNoopSigner, publicKey } from '@metaplex-foundation/umi';
import {
  delegateExecutionV1,
  findAgentIdentityV1Pda,
  findExecutiveProfileV1Pda,
} from '@metaplex-foundation/mpl-agent-registry';

// `umi` is configured with your agent's executive keypair as identity.
const agentAsset = publicKey(process.env.AGENT_ASSET_ADDRESS);

// Nori's executive profile PDA, derived from the agent card address.
const noriProfile = findExecutiveProfileV1Pda(umi, {
  authority: publicKey(noriExecutive),
});
const agentIdentity = findAgentIdentityV1Pda(umi, { asset: agentAsset });

// Free blockhash — no RPC of your own needed.
const { blockhash } = await fetch(`${NORI_URL}/v1/solana/blockhash`).then((r) =>
  r.json(),
);

// Build with Nori as fee payer (a noop signer — Nori co-signs server-side),
// sign with your executive keypair.
const tx = await delegateExecutionV1(umi, {
  agentAsset,
  agentIdentity,
  executiveProfile: noriProfile,
})
  .setFeePayer(createNoopSigner(publicKey(noriExecutive)))
  .setBlockhash(blockhash)
  .buildAndSign(umi);

// Nori validates, co-signs, and submits — free of charge.
const result = await fetch(`${NORI_URL}/v1/delegate/submit`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    transaction: Buffer.from(umi.transactions.serialize(tx)).toString('base64'),
  }),
}).then((r) => r.json());

console.log(result);
// { success: true, signature: '...', agentAsset: '...', authority: '...' }
```

{% callout type="note" title="엄격한 트랜잭션 검증" %}
`POST /v1/delegate/submit`은 Nori 자신의 이그제큐티브 프로필을 가리키고 Nori가 수수료 지불자인, 정확히 하나의 `delegateExecutionV1` 인스트럭션(`mpl-agent-tools` 프로그램의 디스크리미네이터 1)이 아닌 모든 것을 거부합니다. 이 엄격한 형태는 무료 엔드포인트가 트랜잭션 제출 서비스로 악용되는 것을 방지합니다.
{% /callout %}

Metaplex 에이전트 템플릿으로 에이전트를 구축하는 경우, 이 단계 전체가 `delegate-to-nori` 툴로 패키징되어 있습니다 — 한 번의 호출로, 수동 트랜잭션 구성 없이 끝납니다.

## 3단계: 베어러 토큰으로 인증

유료 호출은 Sign-In-With-Solana 스타일 핸드셰이크로 발급된 베어러 토큰을 지니고 있을 때 delegate-pay 레일로 라우팅됩니다. 토큰은 에이전트 자산에 등록된 델리게이트인 이그제큐티브 키페어를 제어하고 있음을 증명하며, 15분간 유효하므로 만료 시 핸드셰이크를 다시 실행하세요.

```typescript {% title="nori-handshake.ts" %}
import { base58 } from '@metaplex-foundation/umi/serializers';

// 1. Get a fresh nonce.
const { nonce } = await fetch(`${NORI_URL}/auth/challenge`).then((r) => r.json());

// 2. Sign the handshake envelope with your executive keypair.
const now = Date.now();
const handshake = {
  pubkey: umi.identity.publicKey.toString(),
  agentAsset: agentAsset.toString(),
  audience: NORI_URL,
  nonce,
  issuedAt: new Date(now).toISOString(),
  expiresAt: new Date(now + 60_000).toISOString(),
};
const signature = base58.deserialize(
  await umi.identity.signMessage(
    new TextEncoder().encode(JSON.stringify(handshake)),
  ),
)[0];

// 3. Exchange for a bearer token (valid 15 minutes).
const { token } = await fetch(`${NORI_URL}/auth/handshake`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ handshake, signature }),
}).then((r) => r.json());
```

## 4단계: 유료 호출 실행

베어러 토큰이 첨부되면 Nori는 업스트림 호출을 실행한 뒤 하나의 Execute 트랜잭션으로 에이전트의 PDA에 청구합니다 — 응답은 402 챌린지 없이 한 번의 왕복으로 돌아옵니다. 동일한 헤더가 모든 `/v1/*` 엔드포인트와 `/a2a`에서 작동합니다.

```typescript {% title="paid-call.ts" %}
const completion = await fetch(`${NORI_URL}/v1/chat/completions`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    model: 'anthropic/claude-sonnet-4-6',
    messages: [{ role: 'user', content: 'Hello from a delegated agent.' }],
  }),
}).then((r) => r.json());
```

자산에 대한 첫 유료 호출 시 Nori는 자신이 여전히 등록된 델리게이트인지 온체인에서 확인합니다; 결과는 5분간 캐시되므로 이후 호출은 체인 조회를 건너뜁니다. OpenAI 호환 SDK 클라이언트를 Nori에 지정하는 방법을 포함하여, 각 서비스를 소비하는 전체 에이전트는 [예제 에이전트](/agents/nori/example-agents)를 참조하세요.

## 에이전트 PDA 지갑 충전

요금은 에이전트의 Asset Signer PDA에서 인출되므로, 첫 유료 호출 전에 SOL 잔액이 필요합니다. PDA는 또한 시스템 렌트 면제 최소 금액(0바이트 계정 기준 890,880 lamports) 이상을 유지해야 합니다 — Metaplex 에이전트 템플릿은 렌트 미만의 소액 청구가 절대 실패하지 않도록 위임 시점에 0.002 SOL을 시드합니다. 아무 지갑에서나 PDA로 SOL을 이체하세요; 잔액이 소진되면 충전할 때까지 호출이 HTTP 402 챌린지로 폴백됩니다([하드 스톱 시맨틱스](/agents/nori/pricing-and-billing#하드-스톱-시맨틱스) 참조).

## Nori 위임 취소

실행 위임 취소는 킬 스위치이며, 하드 스톱으로 발효됩니다. 자산 소유자가 Nori의 이그제큐티브 프로필에 대한 `ExecutionDelegateRecordV1`을 취소하면, 다음 청구 시도는 온체인에서 실패하고, Nori는 해당 자산에 대해 캐시된 델리게이트 상태를 무효화하며, delegate-pay 레일이 중지됩니다 — 그때부터 호출은 자동 청구 대신 x402 결제 챌린지를 받습니다. 5분 델리게이트 상태 캐시 때문에 취소 직후에 이루어진 호출은 여전히 델리게이트 청구를 시도(하고 실패)할 수 있습니다; 체인이 거부하므로 취소 후에는 어떤 청구도 성립하지 않습니다.

취소는 에이전트를 등록 해제하거나 PDA 잔액을 건드리지 않습니다 — Nori의 청구 권한만 제거합니다. 나중에 [2단계](#2단계-위임-트랜잭션-빌드-및-제출)를 반복하여 다시 위임할 수 있습니다.

## 일반적인 오류

| 오류 | 원인 | 해결 방법 |
|-------|-------|-----|
| `expected { transaction: <base64> }` (400) | `/v1/delegate/submit`의 본문 필드가 잘못됨 | `{ "transaction": "<base64-encoded signed tx>" }`를 전송하세요 |
| 위임 제출이 `errorReason`과 함께 거부됨 | 트랜잭션 형태가 엄격한 검증에 실패 — 추가 인스트럭션, 잘못된 프로그램, 잘못된 이그제큐티브 프로필, 또는 잘못된 수수료 지불자 | Nori를 수수료 지불자로 하여 Nori의 이그제큐티브 프로필을 가리키는 정확히 하나의 `delegateExecutionV1` 인스트럭션을 빌드하세요 |
| 유료 호출에서 `401` | 베어러 토큰이 없거나 만료됨(유효 기간 15분) | 챌린지/핸드셰이크 흐름을 다시 실행하세요 |
| 위임했는데도 유료 호출에서 `402` | 위임이 취소되었거나, 청구가 실패함(대개 PDA 지갑이 비어 있음) | 위임 레코드가 존재하고 PDA 잔액이 호출 비용을 감당하는지 확인하세요 |
| `Neither the asset or any plugins have approved this operation` | 위임 취소 후 청구가 시도됨 | 예상된 하드 스톱 동작입니다 — delegate-pay를 재개하려면 다시 위임하세요 |
| 청구 시 `insufficient funds for rent` | PDA 잔액이 렌트 면제 최소 금액 미만 | PDA를 충전하세요(890,880 lamports에 운영 잔액을 더한 수준 이상 유지) |

## 참고사항

- 온보딩 엔드포인트(`GET /v1/solana/blockhash`, `POST /v1/delegate/submit`)는 무료이며 인증이 필요 없습니다; 실제 작업을 수행하는 그 외 모든 것은 유료입니다
- 베어러 토큰은 이그제큐티브 키페어 + 에이전트 자산 쌍별로 발급되며 15분 후 만료됩니다 — 클라이언트에 재핸드셰이크를 구현하세요
- 델리게이트 상태 캐시로 인해 위임 상태 변경(부여 또는 취소)이 결제 레일에 반영되기까지 최대 5분이 걸릴 수 있습니다; 온체인 강제는 즉각적입니다
- 위임은 자산별입니다: 여러 에이전트를 운영하는 에이전트 운영자는 각 자산을 별도로 위임합니다
- `mpl-agent-tools` 실행 위임(`ExecutionDelegateRecordV1`), 프로그램 `TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S`에 적용됩니다

Metaplex Foundation 관리. 최종 검증: 2026-07-08. [GitHub에서 소스 보기](https://github.com/metaplex-foundation/agent-plumber).

## FAQ

Nori 위임에 대한 일반적인 질문.

### Nori에 위임하는 데 비용이 드나요?
아니요. 위임 트랜잭션의 네트워크 수수료는 Nori가 지불하며(수수료 지불자로 공동 서명), 온보딩 엔드포인트는 무료이고 인증이 필요 없습니다. 다만 이후에는 에이전트의 PDA 지갑에 운영 SOL 잔액이 필요합니다. 호출당 요금이 인출되는 계정이기 때문입니다.

### 위임은 Nori에게 어떤 권한을 부여하나요?
위임은 Nori의 이그제큐티브 프로필을 에이전트 자산의 실행 델리게이트로 등록하며, 이를 통해 Nori는 에이전트의 PDA 지갑에서 SOL을 이동하는 [MPL Core Execute](/smart-contracts/core/execute-asset-signing) 트랜잭션에 서명할 수 있습니다. Nori는 이를 호출당 요금 정산에 사용하며, 각 청구에는 온체인 Memo 영수증이 첨부됩니다. PDA에는 운영 잔액만 보관하고 영수증을 감사하세요.

### Nori가 내 에이전트에 요금을 청구하지 못하게 하려면 어떻게 하나요?
에이전트 자산의 실행 위임을 취소하세요. 다음 청구 시도는 온체인에서 실패하고, Nori의 캐시된 델리게이트 상태가 무효화되며, delegate-pay 레일이 하드 스톱됩니다 — 이후 호출은 자동 청구 대신 HTTP 402 x402 챌린지를 받습니다.

### 위임했는데도 호출이 HTTP 402를 반환하는 이유는 무엇인가요?
402는 해당 호출에서 delegate-pay 레일을 사용할 수 없었다는 의미입니다 — 베어러 토큰이 없거나 만료되었거나(토큰 유효 기간 15분), 위임이 취소되었거나, 청구 자체가 실패한 경우(대개 PDA 지갑이 비어 있음)입니다. 핸드셰이크를 다시 실행하고, 위임 레코드가 존재하는지 확인하고, PDA 잔액을 점검하세요.

### 위임하지 않고도 Nori를 사용할 수 있나요?
예. 위임하지 않은 호출자는 x402 폴백 레일을 사용합니다 — 첫 요청이 결제 요구사항과 함께 HTTP 402를 반환하고, SOL 또는 USDC로 결제한 뒤 재시도합니다. 비용은 동일하지만 모든 호출에 결제 왕복이 추가되는 반면, delegate-pay는 인라인으로 정산됩니다.
