---
title: Metaplex x402 결제 모드
metaTitle: Metaplex x402 결제 모드 - 지갑, Core 에셋, 위임 에이전트 | Metaplex
description: Metaplex x402의 세 가지 결제 모드(표준 Solana 지갑, Core 에셋 또는 에이전트의 직접 결제, 요청마다 서명하지 않고 결제하는 위임 에이전트)를 설정합니다. 위임 승인, 취소, 일반적인 오류를 함께 다룹니다.
keywords:
  - x402 payment modes
  - delegated agent payments
  - Core asset payments
  - execution delegation
  - x402 client setup
  - agent wallet USDC
about:
  - Metaplex x402
  - Agent Commerce
  - Solana
  - Metaplex
proficiencyLevel: Intermediate
programmingLanguage:
  - TypeScript
created: '09-08-2026'
updated: '09-08-2026'
howToTools:
  - "@metaplex-foundation/x402"
  - Node.js 20.18+
  - USDC를 보유한 Solana 지갑, Core 에셋 또는 등록된 에이전트
howToSteps:
  - x402 클라이언트와 선택한 Solana 툴킷용 피어 패키지를 설치합니다.
  - 결제 계정에 USDC를 입금하고, Core 에셋 및 에이전트 모드에서는 서명자 PDA에 SOL도 준비합니다.
  - 선택한 모드에 맞는 결제 스킴을 등록해 결제 지원 fetch를 구성합니다.
  - 위임 에이전트의 경우 approveMetaplexCoreExecuteDelegate로 온체인 실행 위임을 한 번 승인합니다.
  - 결제 지원 fetch를 원하는 HTTP 클라이언트에 전달해 유료 요청을 실행합니다.
faqs:
  - q: Metaplex x402에서 어떤 결제 모드를 사용해야 하나요?
    a: 앱이 자기 자신으로서 결제할 때는 표준 지갑을, 소유자 감독하에 에셋이 자체 예산을 갖게 하려면 Core 에셋 또는 에이전트 직접 결제를, 자율 에이전트가 사람의 서명 없이 요청마다 결제해야 한다면 위임 에이전트를 사용하세요.
  - q: Metaplex x402 요청을 결제하려면 SOL이 필요한가요?
    a: Core 에셋 및 에이전트 결제 모드에서만 필요하며, 이 경우 Core execute 트랜잭션 수수료를 충당하기 위해 에셋 서명자 PDA에 SOL이 필요합니다. 표준 지갑 결제에는 SOL이 필요 없으며 결제 트랜잭션의 네트워크 수수료는 서비스의 수수료 지불자가 부담합니다.
  - q: 위임 에이전트의 인증 토큰은 얼마나 유지되나요?
    a: 인가 JWT는 24시간 후 만료됩니다. 만료된 토큰은 폐기되고 자동으로 교체되며, 교체에는 메시지 서명만 필요하고 온체인 위임 승인을 다시 할 필요는 없습니다.
  - q: 리액티브 확장과 프로액티브 fetch 래퍼를 함께 쓸 수 있나요?
    a: 아니요. 둘은 대체 관계이며 함께 구성하면 흐름이 깨집니다. 이미 x402Client를 운영 중이거나 직접 결제 폴백을 선택적으로 사용하려면 리액티브 클라이언트 확장을, Metaplex 엔드포인트만 대상으로 가장 단순하게 연결하려면 프로액티브 fetch 래퍼를 사용하세요.
  - q: 위임 에이전트의 결제를 중단하려면 어떻게 하나요?
    a: 승인할 때 사용한 것과 동일한 서명자, 에셋, RPC 옵션으로 revokeMetaplexCoreExecuteDelegate를 호출하세요. 위임은 온체인 승인이므로 취소는 온체인에서 적용되며, 서버는 더 이상 에이전트의 지갑에서 결제를 구성할 수 없습니다.
  - q: Token-2022 USDC나 다른 스테이블코인으로 결제할 수 있나요?
    a: 아니요. 결제 출처는 항상 클래식 SPL Token 연관 토큰 계정이며 Token-2022 결제 민트는 현재 지원되지 않습니다.
---

Metaplex x402는 세 가지 결제 모드 — 표준 Solana 지갑, [Core 에셋](/smart-contracts/core) 또는 [에이전트](/agents/what-is-an-agent)의 직접 결제, 요청마다 서명하지 않고 결제하는 위임 에이전트 — 를 지원합니다. 모든 모드가 만들어내는 결과물은 동일합니다. 이미 사용 중인 HTTP 클라이언트에 그대로 전달할 수 있는 결제 지원 `fetch`입니다. {% .lead %}

## 요약 {% #summary %}

결제 모드를 고른다는 것은 어떤 계정의 USDC로 요청을 결제하고 그 소유자가 얼마나 자주 서명할지를 정하는 일입니다. 클라이언트 연결은 등록하는 결제 스킴만 다를 뿐, 그 이후의 요청 코드는 세 모드 모두 동일합니다.

- **표준 지갑** — `ExactSvmScheme`를 사용하는 순정 x402. 소유자가 결제마다 서명하며 SOL은 필요하지 않습니다
- **Core 에셋 또는 에이전트(직접)** — `coreExecute` 타깃을 지정한 `MetaplexSvmExactScheme`. 자금은 에셋의 서명자 PDA에서 나오지만 소유자는 여전히 결제마다 서명합니다
- **위임 에이전트(즉시)** — 일회성 온체인 승인으로 Mech가 에이전트의 지갑에서 결제를 승인할 수 있게 되며, 클라이언트는 메시지 서명으로 인증합니다
- **언제든 취소 가능** — 위임은 온체인 승인이므로, 취소하면 정책이 아니라 온체인에서 결제가 중단됩니다

{% callout type="note" title="이 가이드에서 만들 것" %}
이 가이드를 마치면 각 요청의 결제를 투명하게 처리하는 `fetchWithPayment` 함수를, 지출시키려는 계정에 연결된 상태로 갖게 됩니다. 이 페이지의 모든 레시피가 바로 그 함수를 만들어냅니다.
{% /callout %}

## 사전 요구 사항 {% #prerequisites %}

Metaplex x402에는 자금이 있는 Solana 계정과 결제 트랜잭션을 구성할 수 있는 서명자가 필요합니다.

- Node.js 20.18+ 및 ESM 프로젝트
- Solana 서명자 — [Solana Kit](https://github.com/anza-xyz/kit) 키페어 서명자 또는 [Umi](/dev-tools/umi) 서명자
- 결제 계정의 클래식 SPL Token 연관 토큰 계정에 있는 USDC
- Core 에셋 및 에이전트 모드의 경우 해당 서명자가 소유한 Core 에셋과 그 서명자 PDA의 SOL
- 위임 에이전트 모드의 경우 [등록된 에이전트 신원](/agents/register-agent) — [새 에이전트를 민팅](/agents/mint-agent)하거나 기존 Core 에셋을 등록하세요

{% callout type="warning" title="브라우저 코드에 개인 키를 넣지 마세요" %}
아래 예제는 개발용 키페어를 환경 변수에서 읽습니다. 브라우저에서는 지갑 어댑터 서명자를 사용하세요 — 클라이언트로 전송된 개인 키는 이미 공개된 개인 키입니다.
{% /callout %}

## 빠른 시작 {% #quick-start %}

클라이언트를 설치하고 결제 계정에 자금을 넣은 다음, 선택한 모드의 스킴을 등록합니다.

```sh {% title="클라이언트 및 피어 패키지 설치" %}
pnpm add @metaplex-foundation/x402 \
  @metaplex-foundation/umi \
  @solana/kit \
  @x402/core \
  @x402/fetch \
  @x402/svm
```

그런 다음 사용할 클라이언트를 추가합니다.

| 클라이언트 | 설치 |
|----------|------|
| OpenAI SDK | `pnpm add openai` |
| Vercel AI SDK | `pnpm add ai @ai-sdk/openai-compatible` |
| Solana web3.js | `pnpm add @solana/web3.js` |

각 모드로 이동: [표준 지갑](#pay-with-a-standard-solana-wallet) · [Core 에셋 또는 에이전트](#pay-directly-with-a-core-asset-or-agent) · [위임 에이전트](#pay-instantly-with-a-delegated-agent).

## 결제 모드별 자금 요건 {% #funding-requirements-by-payment-mode %}

각 모드는 서로 다른 계정에서 USDC를 인출하며, SOL이 필요한 것은 Core `execute` 모드뿐입니다.

| 결제 모드 | USDC 출처 | SOL 요건 |
|----------|----------|---------|
| 표준 지갑 | 해당 지갑의 USDC 토큰 계정 | 불필요 — 네트워크 수수료는 서비스의 수수료 지불자가 부담 |
| Core 에셋 또는 에이전트(직접·위임) | 에셋 서명자 PDA의 USDC 토큰 계정 | Core `execute` 수수료를 위해 서명자 PDA에 필요 |

결제 출처는 항상 클래식 SPL Token 연관 토큰 계정입니다. Token-2022 결제 민트는 현재 지원되지 않습니다.

## 표준 Solana 지갑으로 결제하기 {% #pay-with-a-standard-solana-wallet %}

직접 관리하는 지갑에서 결제하려면 `@x402/svm`의 `ExactSvmScheme`를 등록하세요. 이는 순정 x402이며, Metaplex 클라이언트가 더하는 것은 엔드포인트 상수와 디스커버리 헬퍼뿐입니다.

```ts {% title="표준 지갑 결제" %}
import { createKeyPairSignerFromBytes, getBase58Encoder } from '@solana/kit';
import { x402Client } from '@x402/core/client';
import { wrapFetchWithPayment } from '@x402/fetch';
import { ExactSvmScheme } from '@x402/svm/exact/client';

const svmSigner = await createKeyPairSignerFromBytes(
  getBase58Encoder().encode(process.env.SVM_PRIVATE_KEY!),
);

const paymentClient = new x402Client();
paymentClient.register('solana:*', new ExactSvmScheme(svmSigner));

const fetchWithPayment = wrapFetchWithPayment(fetch, paymentClient);
```

## Core 에셋 또는 에이전트로 직접 결제하기 {% #pay-directly-with-a-core-asset-or-agent %}

소유자가 계속 결제마다 서명하면서도 Core 에셋 자신의 지갑에서 자금을 대려면, `coreExecute` 타깃을 지정한 `MetaplexSvmExactScheme`를 등록하세요. 모든 Core 에셋은 내장 지갑인 [Asset Signer PDA](/smart-contracts/core/execute-asset-signing)를 가지므로, 그 지갑에 자금을 넣으면 메인 지갑과 지출이 분리되고 소유권이 이전되면 예산도 에셋과 함께 이동합니다.

```ts {% title="Core 에셋 또는 에이전트 직접 결제" %}
import { MetaplexSvmExactScheme } from '@metaplex-foundation/x402';
import { x402Client } from '@x402/core/client';
import { wrapFetchWithPayment } from '@x402/fetch';

const paymentClient = new x402Client();
paymentClient.register(
  'solana:*',
  new MetaplexSvmExactScheme(svmSigner, {
    rpcUrl: svmRpcUrl,
    coreExecute: {
      asset: coreAssetAddress,
    },
  }),
);

const fetchWithPayment = wrapFetchWithPayment(fetch, paymentClient);
```

`svmSigner`는 에셋을 제어하는 서명자, `svmRpcUrl`은 결제 트랜잭션 구성에 사용하는 Solana RPC 엔드포인트, `coreAssetAddress`는 Core 에셋 또는 에이전트 주소입니다.

{% callout type="note" title="컬렉션에 속한 에셋에는 컬렉션 주소가 필요합니다" %}
에셋이 Core 컬렉션에 속해 있으면 `coreExecute.collection`을 전달하세요. 모든 옵션은 [스킴 옵션 표](/agents/x402/api-reference#metaplexsvmexactscheme-options)에 있습니다.
{% /callout %}

## 위임 에이전트로 즉시 결제하기 {% #pay-instantly-with-a-delegated-agent %}

에이전트를 Mech에 한 번 위임해 두면, 서버가 요청마다 소유자 서명 없이 에이전트의 지갑에서 결제를 승인할 수 있습니다. 자율 에이전트와 고빈도 워크로드에 적합한 모드입니다.

에이전트는 승인하는 서명자가 소유한 [등록된 에이전트 신원](/agents/register-agent)이어야 합니다. 위임 후 클라이언트는 Sign-In-With-X 메시지 서명으로 인증해 24시간 유효한 베어러 토큰을 받고, 서버가 에이전트의 지갑에서 결제를 구성합니다. 이 위임은 언제든 취소할 수 있는 온체인 승인입니다.

### 위임을 한 번만 승인하기 {% #approve-the-delegation-once %}

반복 실행 시 트랜잭션을 다시 제출하지 않도록, 승인 전에 현재 상태를 확인합니다.

```ts {% title="일회성 위임 승인" %}
import {
  approveMetaplexCoreExecuteDelegate,
  fetchMetaplexCoreExecuteDelegateStatus,
} from '@metaplex-foundation/x402';

const status = await fetchMetaplexCoreExecuteDelegateStatus(coreAssetAddress);

if (!status.isDelegated) {
  await approveMetaplexCoreExecuteDelegate(svmSigner, coreAssetAddress, {
    rpcUrl: svmRpcUrl,
  });
}
```

### 리액티브 또는 프로액티브 통합 방식 선택하기 {% #choose-a-reactive-or-proactive-integration-style %}

리액티브와 프로액티브 통합은 대체 관계입니다 — 둘 중 하나만 사용하고 함께 쓰지 마세요.

| 방식 | 인증 방법 | 선택 기준 |
|------|---------|---------|
| **리액티브** | 클라이언트 확장. 최초 `402` 응답이 인증을 이끌며 서버의 동적 결제 요건을 보존합니다 | 이미 다른 유료 서비스와 함께 `x402Client`를 운영 중이거나, 직접 결제 폴백을 선택적으로 쓰고 싶은 경우 |
| **프로액티브** | 리소스 요청 전에 인증하는 `fetch` 래퍼. `402` 왕복이 드러나지 않습니다 | Metaplex 엔드포인트만 대상으로 가장 단순하게 연결하고 싶은 경우 |

아래 두 스니펫 모두에서 `solanaSigner`는 인증에 사용하는 메시지 서명 가능한 Solana 서명자입니다. Solana Kit 키페어 서명자를 사용할 수 있습니다.

```ts {% title="리액티브 위임 에이전트 결제" %}
import {
  createMetaplexCoreExecuteDelegateClientExtension,
  InMemoryMetaplexCoreExecuteDelegateAuthTokenStore,
  MetaplexSvmExactScheme,
} from '@metaplex-foundation/x402';
import { x402Client } from '@x402/core/client';
import { wrapFetchWithPayment } from '@x402/fetch';

const authTokenStore = new InMemoryMetaplexCoreExecuteDelegateAuthTokenStore();
const paymentClient = new x402Client();

paymentClient.register(
  'solana:*',
  new MetaplexSvmExactScheme(svmSigner, { rpcUrl: svmRpcUrl }),
);
paymentClient.registerExtension(
  createMetaplexCoreExecuteDelegateClientExtension({
    signer: solanaSigner,
    asset: coreAssetAddress,
    authTokenStore,
  }),
);

const fetchWithPayment = wrapFetchWithPayment(fetch, paymentClient);
```

```ts {% title="프로액티브 위임 에이전트 결제" %}
import {
  InMemoryMetaplexCoreExecuteDelegateAuthTokenStore,
  wrapFetchWithMetaplexCoreExecuteDelegate,
} from '@metaplex-foundation/x402';

const authTokenStore = new InMemoryMetaplexCoreExecuteDelegateAuthTokenStore();

const fetchWithPayment = wrapFetchWithMetaplexCoreExecuteDelegate(fetch, {
  signer: solanaSigner,
  asset: coreAssetAddress,
  authTokenStore,
});
```

프로액티브 방식에서도 위임 승인은 여전히 필요하며, 다른 오리진으로 가는 요청은 그대로 통과합니다.

### 인증 토큰 저장과 만료 처리 {% #store-auth-tokens-and-handle-expiry %}

인가 JWT는 24시간 후 만료되며, 클라이언트는 온체인 재승인이 아니라 메시지 서명으로 자동 교체합니다.

- Node.js에서는 `InMemoryMetaplexCoreExecuteDelegateAuthTokenStore`를, 브라우저 전용 코드에서는 `LocalStorageMetaplexCoreExecuteDelegateAuthTokenStore`를 사용하세요
- 다른 스토리지 백엔드를 쓰려면 `MetaplexCoreExecuteDelegateAuthTokenStore` 인터페이스를 구현하세요
- 리액티브 직접 결제 폴백은 기본적으로 비활성화되어 있습니다. 등록된 결제 스킴이 위임 실패를 처리하도록 하려는 경우에만 `fallback: true`를 설정하세요
- 인증, 캐시, 폴백 동작을 관찰하려면 `onEvent`를 전달하세요

### 위임 취소하기 {% #revoke-the-delegation %}

승인할 때 사용한 것과 동일한 서명자, 에셋, RPC 옵션으로 `revokeMetaplexCoreExecuteDelegate`를 호출하세요.

```ts {% title="위임 취소" %}
import { revokeMetaplexCoreExecuteDelegate } from '@metaplex-foundation/x402';

await revokeMetaplexCoreExecuteDelegate(svmSigner, coreAssetAddress, {
  rpcUrl: svmRpcUrl,
});
```

이 승인은 온체인에 존재하므로, 취소하면 서버는 에이전트의 지갑에서 결제를 구성할 수 없게 됩니다 — 서비스가 선택적으로 지키는 정책이 아닙니다.

## 일반적인 오류 {% #common-errors %}

결제 구성 실패는 거의 항상 자금, 네트워크 불일치, 위임 상태 중 하나로 귀결됩니다.

| 증상 | 원인 | 해결 |
|------|------|------|
| 결제 구성이 실패함 | 결제 계정에 결제 민트의 USDC가 없음 | 지갑, Core 에셋 또는 에이전트 서명자 PDA에 USDC를 입금 |
| Core `execute` 결제가 실패함 | 에셋 서명자 PDA에 트랜잭션 수수료용 SOL이 없음 | 에셋 서명자 PDA에 SOL을 전송 |
| 결제가 네트워크 불일치로 거부됨 | `SVM_RPC_URL`이 `402` 응답이 선언한 네트워크와 다름 | `402` 응답이 선언한 네트워크로 RPC URL을 맞춤 |
| Core 에셋의 서명이 거부됨 | 해당 에셋이 전달한 서명자의 제어 대상이 아님 | Core 에셋을 소유한 서명자를 전달 |
| 위임 결제가 폴백되거나 실패함 | 에셋이 등록된 에이전트 신원이 아니거나 위임이 승인되지 않음 | `fetchMetaplexCoreExecuteDelegateStatus()`가 `isDelegated: true`를 반환하는지 확인 |
| 인증이 반복되거나 이중 결제가 발생함 | 리액티브 확장과 프로액티브 래퍼를 함께 구성함 | 통합 방식은 하나만 사용 |

## 검증된 구성 {% #tested-configuration %}

| 패키지 | 버전 |
|-------|------|
| `@metaplex-foundation/x402` | `0.1.0` |
| Node.js | 20.18+ (ESM) |
| 결제 민트 | USDC (클래식 SPL Token) |

## 참고 사항 {% #notes %}

- `MetaplexSvmExactScheme`는 Umi 서명자와 Solana Kit 부분 트랜잭션 서명자를 허용하지만 sign-and-send 서명자는 허용하지 않습니다. Kit 서명자는 내부적으로 변환됩니다.
- 서비스·클라이언트·결제 모드의 모든 조합에 대해 실행 가능한 예제가 [x402 저장소](https://github.com/metaplex-foundation/x402/tree/main/examples)에 있으며 `pnpm example:<name>`으로 실행할 수 있습니다.
- 위임 에이전트 예제는 최초 실행 시 승인 트랜잭션을 제출할 수 있습니다.
- 위임은 요청 결제를 위해 에이전트의 지갑에서 USDC를 옮길 권한을 Mech에 부여합니다. 서명자 PDA에는 운용에 필요한 잔액만 두고, 에이전트를 사용하지 않을 때는 취소하세요.

## 빠른 참조 {% #quick-reference %}

| 항목 | 값 |
|------|-----|
| 표준 지갑 스킴 | `ExactSvmScheme` (`@x402/svm`) |
| Core 에셋·에이전트 스킴 | `MetaplexSvmExactScheme` |
| 위임 헬퍼 | `fetchMetaplexCoreExecuteDelegateStatus`, `approveMetaplexCoreExecuteDelegate`, `revokeMetaplexCoreExecuteDelegate` |
| 위임 트랜스포트 | `createMetaplexCoreExecuteDelegateClientExtension`, `wrapFetchWithMetaplexCoreExecuteDelegate` |
| 인증 토큰 수명 | 24시간 |
| 위임 엔드포인트 | `/x402/core-execute-delegate/{status,approve,revoke,auth}` |

## FAQ {% #faq %}

Metaplex x402 결제 모드에 대한 일반적인 질문.

### Metaplex x402에서 어떤 결제 모드를 사용해야 하나요? {% #which-metaplex-x402-payment-mode-should-i-use %}
앱이 자기 자신으로서 결제할 때는 표준 지갑을, 소유자 감독하에 에셋이 자체 예산을 갖게 하려면 Core 에셋 또는 에이전트 직접 결제를, 자율 에이전트가 사람의 서명 없이 요청마다 결제해야 한다면 위임 에이전트를 사용하세요.

### Metaplex x402 요청을 결제하려면 SOL이 필요한가요? {% #do-i-need-sol-to-pay-for-metaplex-x402-requests %}
Core 에셋 및 에이전트 결제 모드에서만 필요하며, 이 경우 Core `execute` 트랜잭션 수수료를 충당하기 위해 에셋 서명자 PDA에 SOL이 필요합니다. 표준 지갑 결제에는 SOL이 필요 없으며 결제 트랜잭션의 네트워크 수수료는 서비스의 수수료 지불자가 부담합니다.

### 위임 에이전트의 인증 토큰은 얼마나 유지되나요? {% #how-long-does-a-delegated-agent-auth-token-last %}
인가 JWT는 24시간 후 만료됩니다. 만료된 토큰은 폐기되고 자동으로 교체되며, 교체에는 메시지 서명만 필요하고 온체인 위임 승인을 다시 할 필요는 없습니다.

### 리액티브 확장과 프로액티브 fetch 래퍼를 함께 쓸 수 있나요? {% #can-i-use-the-reactive-extension-and-the-proactive-fetch-wrapper-together %}
아니요. 둘은 대체 관계이며 함께 구성하면 흐름이 깨집니다. 이미 `x402Client`를 운영 중이거나 직접 결제 폴백을 선택적으로 사용하려면 리액티브 클라이언트 확장을, Metaplex 엔드포인트만 대상으로 가장 단순하게 연결하려면 프로액티브 `fetch` 래퍼를 사용하세요.

### 위임 에이전트의 결제를 중단하려면 어떻게 하나요? {% #how-do-i-stop-a-delegated-agent-from-paying %}
승인할 때 사용한 것과 동일한 서명자, 에셋, RPC 옵션으로 `revokeMetaplexCoreExecuteDelegate`를 호출하세요. 위임은 온체인 승인이므로 취소는 온체인에서 적용되며, 서버는 더 이상 에이전트의 지갑에서 결제를 구성할 수 없습니다.

### Token-2022 USDC나 다른 스테이블코인으로 결제할 수 있나요? {% #can-i-pay-with-token-2022-usdc-or-another-stablecoin %}
아니요. 결제 출처는 항상 클래식 SPL Token 연관 토큰 계정이며 Token-2022 결제 민트는 현재 지원되지 않습니다.

---

Metaplex Foundation 관리. 최종 검증: 2026-09-08. 클라이언트 버전: `@metaplex-foundation/x402` `0.1.0`. [GitHub에서 소스 보기](https://github.com/metaplex-foundation/x402).
