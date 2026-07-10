---
title: 에이전트 데이터 읽기
metaTitle: Solana에서 에이전트 데이터 읽기 | Metaplex Agent Registry
description: 에이전트 등록을 확인하고, 신원 및 등록 문서를 온체인에서 읽거나, DAS API를 통해 인덱싱된 에이전트 필드를 읽습니다.
keywords:
  - read agent data
  - agent identity
  - AgentIdentity plugin
  - Asset Signer
  - agent wallet
  - DAS API
  - isAgent
  - agentToken
  - assetSigner
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Agent Data
  - DAS API
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '02-25-2026'
updated: '07-08-2026'
faqs:
  - q: DAS 응답에서 agentToken은 언제 나타나나요?
    a: agentToken 필드는 에이전트의 AgentIdentityV2 PDA에 setAgentTokenV1을 통해 토큰 민트가 설정된 경우에만 포함됩니다. 연결된 토큰이 없는 등록된 에이전트는 이 필드를 생략합니다. AgentIdentityV1 PDA는 토큰 민트를 보유하지 않으며 agentToken을 채우지 않습니다.
  - q: assetSigner는 에이전트 지갑과 같나요?
    a: 예. assetSigner는 Core Asset Signer PDA이며 SDK의 findAssetSignerPda가 반환하는 주소와 동일합니다. DAS는 MplCoreAsset 행에 asset_signer를 반환하며, 에이전트는 해당 PDA를 온체인 지갑으로 사용합니다.
  - q: isAgent로 Core가 아닌 자산을 필터링할 수 있나요?
    a: 아니요. isAgent, agentToken, assetSigner는 MplCoreAsset 행에만 적용됩니다. Token Metadata NFT 및 기타 인터페이스는 DAS 응답에서 이러한 필드를 완전히 생략합니다.
  - q: 모든 DAS 제공업체가 에이전트 토큰 필드를 지원하나요?
    a: 에이전트 토큰 인덱싱은 Metaplex DAS 인덱서(digital-asset-rpc-infrastructure)와 함께 제공됩니다. 서드파티 DAS 제공업체는 이러한 필드가 응답에 나타나기 전에 에이전트 레지스트리 트랜스포머와 데이터베이스 마이그레이션을 포함하는 호환 인덱서 버전을 실행해야 합니다.
---

[등록](/agents/register-agent) 후 에이전트 신원을 읽고 확인합니다 — SDK로 온체인에서 직접 읽거나, 인덱서가 파싱한 [DAS API](/dev-tools/das-api)를 통해 읽을 수 있습니다. {% .lead %}

## 요약

에이전트 신원은 [Agent Registry](/smart-contracts/mpl-agent) SDK로 온체인에서 읽거나, 인덱싱된 필드는 [DAS API](/dev-tools/das-api)를 통해 읽습니다.

- **온체인(SDK)** — 등록 확인, [`AgentIdentity`](/smart-contracts/mpl-agent/identity) 플러그인 검사, ERC-8004 문서 가져오기, [Asset Signer](/smart-contracts/core/execute-asset-signing) PDA 파생
- **인덱싱(DAS)** — [`getAsset`](/dev-tools/das-api/methods/get-asset)에서 `is_agent`, `asset_signer`, `agent_token` 읽기; [`searchAssets`](/dev-tools/das-api/methods/search-assets)로 에이전트 검색
- **동일한 지갑 주소** — `findAssetSignerPda`와 DAS `asset_signer`는 동일한 PDA를 반환합니다

## 빠른 시작

이 페이지는 SDK 등록 확인, 등록 문서, 지갑 PDA, DAS 인덱싱 에이전트 필드를 다룹니다.

**이동:** [등록 확인](#check-registration) · [등록 문서](#read-the-registration-document) · [에이전트 지갑](#fetch-the-agents-wallet) · [DAS를 통한 읽기](#read-agent-data-via-das-api)

1. **단일 에이전트, 전체 세부 정보** — `safeFetchAgentIdentityV1`과 `fetchAsset` 사용(아래 SDK 섹션)
2. **단일 에이전트, 인덱싱된 필드** — Core 자산 주소로 `getAsset` 호출(아래 DAS 섹션)
3. **에이전트 검색** — `isAgent: true`로 `searchAssets` 호출 또는 `agentToken` / `assetSigner`로 필터링

## 등록 확인 {#check-registration}

안전 가져오기 메서드는 신원이 존재하지 않을 때 throw 대신 `null`을 반환하여 자산이 등록되었는지 확인하는 데 유용합니다:

{% code-tabs-imported from="agents/read_agent_check_registration" frameworks="umi" defaultFramework="umi" /%}

## 시드에서 가져오기

PDA를 수동으로 파생하지 않고 자산의 공개 키에서 직접 신원을 가져올 수도 있습니다:

{% code-tabs-imported from="agents/read_agent_fetch_from_seeds" frameworks="umi" defaultFramework="umi" /%}

## AgentIdentity 플러그인 확인

등록은 Core 자산에 `AgentIdentity` 플러그인을 첨부합니다. 가져온 자산에서 직접 읽어 등록 URI와 라이프사이클 훅을 검사할 수 있습니다:

{% code-tabs-imported from="agents/read_agent_verify_plugin" frameworks="umi" defaultFramework="umi" /%}

## 등록 문서 읽기 {#read-the-registration-document}

`AgentIdentity` 플러그인의 `uri`는 에이전트의 전체 프로필(이름, 설명, 서비스 엔드포인트 등)을 포함하는 오프체인 JSON 문서를 가리킵니다. 다른 URI처럼 가져옵니다:

{% code-tabs-imported from="agents/read_agent_registration_document" frameworks="umi" defaultFramework="umi" /%}

이 문서는 [ERC-8004](https://eips.ethereum.org/EIPS/eip-8004) 에이전트 등록 표준을 따릅니다. 일반적인 형태는 다음과 같습니다:

```json
{
  "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  "name": "An informational agent providing help related to Metaplex protocols and tools.",
  "description": "An autonomous agent that executes DeFi strategies on Solana.",
  "image": "https://arweave.net/agent-avatar-tx-hash",
  "services": [
    {
      "name": "web",
      "endpoint": "https://metaplex.com/agent/<ASSET_PUBKEY>"
    },
    {
      "name": "A2A",
      "endpoint": "https://metaplex.com/agent/<ASSET_PUBKEY>/agent-card.json",
      "version": "0.3.0"
    }
  ],
  "active": true,
  "registrations": [
    {
      "agentId": "<MINT_ADDRESS>",
      "agentRegistry": "solana:101:metaplex"
    }
  ],
  "supportedTrust": ["reputation", "crypto-economic"]
}
```

전체 필드 레퍼런스는 [에이전트 등록](/agents/register-agent#agent-registration-document)을 참조하세요.

## 에이전트 지갑 가져오기 {#fetch-the-agents-wallet}

모든 Core 자산에는 **Asset Signer**라는 내장 지갑이 있습니다 — 자산의 공개 키에서 파생된 PDA입니다. 개인 키가 존재하지 않으므로 도난될 수 없습니다. 지갑은 SOL, 토큰 또는 기타 자산을 보유할 수 있습니다. `findAssetSignerPda`로 주소를 파생합니다:

{% code-tabs-imported from="agents/read_agent_fetch_asset_signer" frameworks="umi" defaultFramework="umi" /%}

주소는 결정론적이므로 누구나 자산의 공개 키에서 주소를 파생하여 자금을 보내거나 잔액을 확인할 수 있습니다. 이 지갑에 대해 서명할 수 있는 것은 위임된 [이그제큐티브](/agents/run-an-agent)를 통한 Core의 [Execute](/smart-contracts/core/execute-asset-signing) 명령에 의한 자산 자체뿐입니다.

계정 레이아웃, PDA 파생 세부사항 및 오류 코드에 대해서는 [MPL Agent Registry](/smart-contracts/mpl-agent) 스마트 컨트랙트 문서를 참조하세요.

## DAS API를 통해 에이전트 데이터 읽기 {#read-agent-data-via-das-api}

[DAS API](/dev-tools/das-api)는 MPL Core 자산의 에이전트 필드(등록 상태, 지갑 PDA, 정식 토큰 민트)를 인덱싱하므로 Core 계정을 직접 파싱하지 않고 읽을 수 있습니다.

**사전 요구사항:** [DAS 지원 RPC 엔드포인트](/solana/rpcs-and-das)와 [Umi](/umi) 인스턴스의 `@metaplex-foundation/digital-asset-standard-api`.

### DAS 에이전트 응답 필드

DAS는 두 가지 온체인 소스에서 에이전트 메타데이터를 파생하여 최상위 응답 필드로 노출합니다.

| 필드 | 타입 | 포함 대상 | 소스 |
|------|------|-----------|------|
| `is_agent` | `boolean` | `MplCoreAsset` | 자산에 `AgentIdentity` 외부 플러그인이 있을 때 `true` |
| `asset_signer` | `string` (pubkey) | `MplCoreAsset`만 | 위 [`findAssetSignerPda`](#fetch-the-agents-wallet)와 동일한 PDA |
| `agent_token` | `string` (pubkey) | 설정된 경우 `MplCoreAsset` | [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token)으로 기록된 `AgentIdentityV2` PDA 민트 |

{% callout type="note" %}
에이전트가 될 수 있는 것은 **`MplCoreAsset`** 행뿐입니다(`is_agent: true`). 컬렉션과 그룹은 DAS 응답에 `is_agent: false`가 포함될 수 있지만, 에이전트 등록은 개별 Core 자산에만 적용됩니다. Core가 아닌 자산(Token Metadata NFT, 압축 NFT, 대체 가능 토큰)은 세 필드를 모두 생략합니다.
{% /callout %}

연결된 토큰이 없는 등록된 에이전트는 `is_agent: true`와 `asset_signer`를 반환하지만 `agent_token`은 생략합니다:

```json {% title="getAsset response (registered, no token)" %}
{
  "interface": "MplCoreAsset",
  "id": "84jw9dw7hMRJXFvzJXrBzVQpmVWaGUtYT7R6QhNU9qt3",
  "is_agent": true,
  "asset_signer": "6ttUwc5VVmHeVKTddB6XM5vQgBMfw62DThuoiVEufVZq",
  "external_plugins": [
    {
      "type": "AgentIdentity",
      "adapter_config": { "uri": "https://example.com/agent-registration.json" }
    }
  ]
}
```

[`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token) 이후 DAS는 `agent_token`을 포함합니다:

```json {% title="getAsset response (registered with token)" %}
{
  "interface": "MplCoreAsset",
  "id": "84jw9dw7hMRJXFvzJXrBzVQpmVWaGUtYT7R6QhNU9qt3",
  "is_agent": true,
  "agent_token": "FakeToken11111111111111111111111111111111111",
  "asset_signer": "6ttUwc5VVmHeVKTddB6XM5vQgBMfw62DThuoiVEufVZq"
}
```

JSON-RPC 응답은 snake_case(`is_agent`, `agent_token`, `asset_signer`)를 사용합니다. `searchAssets` 요청 매개변수는 camelCase(`isAgent`, `agentToken`, `assetSigner`)를 사용하며 snake_case 별칭도 허용됩니다.

### DAS로 단일 에이전트 가져오기

Core 자산 주소를 알고 있을 때 [`getAsset`](/dev-tools/das-api/methods/get-asset)을 사용합니다.

{% code-tabs-imported from="agents/read_agent_das_get" frameworks="umi,curl" defaultFramework="umi" /%}

### 등록된 에이전트 검색

`isAgent: true`로 [`searchAssets`](/dev-tools/das-api/methods/search-assets)를 사용하여 등록된 에이전트를 나열합니다. `interface: "MplCoreAsset"`과 함께 사용하여 컬렉션과 그룹을 제외합니다.

{% code-tabs-imported from="agents/read_agent_das_search" frameworks="umi,curl" defaultFramework="umi" /%}

### 토큰 민트로 에이전트 조회

에이전트가 정식 토큰을 연결한 후 `agentToken`으로 필터링하여 민트 주소에서 에이전트 Core 자산을 확인합니다. 각 에이전트는 최대 하나의 토큰만 가질 수 있으며 — 바인딩은 영구적입니다.

{% code-tabs-imported from="agents/read_agent_das_lookup_token" frameworks="curl" defaultFramework="curl" /%}

### Asset Signer로 에이전트 조회

`assetSigner` 필터는 주어진 주소와 execute PDA가 일치하는 Core 자산을 찾습니다. 에이전트 지갑은 알지만 자산 pubkey는 모를 때 사용합니다.

{% code-tabs-imported from="agents/read_agent_das_lookup_signer" frameworks="curl" defaultFramework="curl" /%}

### DAS 인덱싱 동작 방식

DAS는 수집 중 두 가지 온체인 소스에서 에이전트 필드를 채웁니다. **MPL Core 자산** 계정 업데이트는 `is_agent`(`AgentIdentity` 플러그인이 있을 때)를 설정하고 `MplCoreAsset` 행에 대해 `asset_signer`를 파생합니다. **Agent Registry** PDA 업데이트는 `AgentIdentityV2` 민트가 있을 때 기존 `MplCoreAsset` 행에 `agent_token`을 설정합니다.

| 이벤트 | 업데이트되는 필드 | 참고 |
|--------|-------------------|------|
| Core 자산 생성 또는 업데이트 | `is_agent`, `asset_signer` | `MplCoreAsset` 행에만 적용; `is_agent`는 `AgentIdentity` 외부 플러그인을 반영; `asset_signer`는 인덱싱된 모든 Core 자산에 대해 파생 |
| `AgentIdentityV2` PDA 업데이트 | `agent_token` | Agent Registry 트랜스포머가 기록; 기존의 소각되지 않은 `MplCoreAsset` 행만 업데이트 |
| 자산 소각 | — | 이후 Agent Registry 업데이트는 무시됨 |
| 오래된 슬롯 PDA 재생 | — | `slot_updated_agent_registry`보다 낮은 슬롯의 업데이트는 건너뜀 |

## 참고사항

- Asset Signer는 PDA입니다 — 개인 키가 존재하지 않습니다. 모든 소스에서 자금을 받을 수 있지만, Core의 [Execute](/smart-contracts/core/execute-asset-signing) 명령을 통해서만 자산 자체가 발신 트랜잭션에 서명할 수 있습니다.
- `safeFetchAgentIdentityV1`은 미등록 자산에 대해 throw 대신 `null`을 반환하여 try/catch 없이 존재 여부를 안전하게 확인할 수 있습니다.
- `findAssetSignerPda`와 DAS `asset_signer`는 모든 네트워크에서 동일한 결정론적 주소를 반환합니다.
- [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token)으로 설정된 `agent_token`은 **영구적**입니다 — 이를 지우거나 재할당하는 명령은 없습니다.
- DAS `asset_signer`는 등록된 에이전트뿐 아니라 **`MplCoreAsset`** 행에서 반환됩니다; `is_agent`로 에이전트와 일반 Core NFT를 구분하세요.
- 연결된 토큰이 없는 등록된 에이전트는 `agent_token`을 생략합니다 — [`createAndRegisterLaunch`](/agents/create-agent-token) 또는 수동 `setAgentTokenV1` 이전에는 예상된 동작입니다.
- Agent Registry 업데이트는 새 자산 행을 생성하지 않습니다; Core 자산이 먼저 인덱싱되어야 합니다.
- 제공업체 지원은 다양합니다 — [DAS 제공업체](/solana/rpcs-and-das)가 에이전트 레지스트리 지원 인덱서를 실행하는지 확인하세요.

## 빠른 참조

이 표는 에이전트 관련 DAS 필터, 응답 필드, 프로그램 ID를 정리합니다.

| 항목 | 값 |
|------|-----|
| Agent Registry 프로그램 | `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p` |
| MPL Core 프로그램 | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
| Asset Signer 시드 | `['mpl-core-execute', <core_asset_pubkey>]` |
| DAS `isAgent` 필터 | `searchAssets` 매개변수 `isAgent: true \| false` |
| DAS `agentToken` 필터 | `searchAssets` 매개변수 `agentToken: <mint_pubkey>` |
| DAS `assetSigner` 필터 | `searchAssets` 매개변수 `assetSigner: <pda_pubkey>` |
| DAS 응답 메서드 | `getAsset`, `getAssets`, `searchAssets` |

## FAQ

### DAS 응답에서 `agentToken`은 언제 나타나나요?

`agent_token`은 에이전트의 `AgentIdentityV2` PDA에 [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token)을 통해 토큰 민트가 설정된 경우에만 포함됩니다. 연결된 토큰이 없는 등록된 에이전트는 이 필드를 생략합니다. `AgentIdentityV1` PDA는 토큰 민트를 보유하지 않으며 `agent_token`을 채우지 않습니다.

### `assetSigner`는 에이전트 지갑과 같나요?

예. DAS `asset_signer`는 Core [Asset Signer](/smart-contracts/core/execute-asset-signing) PDA이며 [`findAssetSignerPda`](#fetch-the-agents-wallet)와 동일한 주소입니다. `MplCoreAsset` 행에서 반환되며, 등록된 에이전트의 경우 온체인 지갑 역할을 합니다.

### `isAgent`로 Core가 아닌 자산을 필터링할 수 있나요?

아니요. `is_agent`, `agent_token`, `asset_signer`는 **`MplCoreAsset`**에만 적용됩니다. Token Metadata NFT 및 기타 자산 유형은 이러한 필드를 생략합니다.

### 모든 DAS 제공업체가 에이전트 토큰 필드를 지원하나요?

에이전트 토큰 인덱싱은 [Metaplex DAS 인덱서](https://github.com/metaplex-foundation/digital-asset-rpc-infrastructure)와 함께 제공됩니다. 서드파티 제공업체는 에이전트 레지스트리 트랜스포머와 데이터베이스 마이그레이션을 포함하는 호환 인덱서 버전을 실행해야 합니다.

## 용어집

다음 용어는 에이전트 DAS 응답과 위 SDK 읽기 경로에서 사용됩니다.

| 용어 | 정의 |
|------|------|
| **`AgentIdentity` 플러그인** | [등록](/agents/register-agent) 중 Core 자산에 설정되는 외부 플러그인; 오프체인 등록 URI를 보유 |
| **`is_agent`** | Core 자산에 `AgentIdentity` 외부 플러그인이 있음을 나타내는 DAS 불리언 |
| **`agent_token`** | `AgentIdentityV2` PDA에서 인덱싱된 정식 토큰 민트 pubkey; [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token)로 한 번 설정 |
| **`asset_signer`** | 에이전트의 온체인 지갑 역할을 하는 Core execute PDA; `['mpl-core-execute', <asset>]`에서 파생 |
| **`AgentIdentityV2`** | 연결된 토큰 민트를 저장하는 Agent Registry PDA; Core 자산 계정과 독립적으로 업데이트 |
| **`Agent Registry transformer`** | Agent Registry PDA 업데이트에서 `agent_token`을 기존 Core 자산 행에 기록하는 DAS 수집 핸들러 |
