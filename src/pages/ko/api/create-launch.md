---
title: 런칭 생성
metaTitle: Metaplex API - 런칭 생성 | REST API | Metaplex
description: 새로운 Genesis 토큰 런칭을 위한 온체인 트랜잭션을 빌드합니다. 서명 및 전송 준비가 된 미서명 트랜잭션을 반환합니다.
method: POST
created: '02-19-2026'
updated: '09-26-2026'
keywords:
  - Genesis API
  - create launch
  - token launch
  - launch transactions
about:
  - API endpoint
  - Launch creation
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

새로운 Genesis 토큰 런칭을 위한 온체인 트랜잭션을 빌드합니다. [런칭 등록](/ko/api/register)을 호출하기 전에 서명하여 전송해야 하는 미서명 트랜잭션을 반환합니다. {% .lead %}

{% callout type="warning" title="SDK 사용을 권장합니다" %}
대부분의 통합자는 SDK의 [`createAndRegisterLaunch`](/ko/smart-contracts/genesis/sdk/api-client)를 사용해야 합니다. 이 함수는 트랜잭션 생성, 서명, 전송, 런칭 등록을 한 번의 호출로 처리합니다. 이 엔드포인트는 SDK 없이 직접 HTTP 접근이 필요한 경우에만 사용하세요.
{% /callout %}

{% callout type="note" %}
Genesis 프로그램의 전체 기능을 [metaplex.com](https://www.metaplex.com)에서 아직 지원하지 않으므로, Create API(또는 SDK)를 사용하여 런칭을 프로그래밍 방식으로 생성하는 것을 권장합니다. API를 통해 생성된 메인넷 런칭은 [등록](/ko/api/register) 후 metaplex.com에 표시됩니다.
{% /callout %}

## 엔드포인트

```
POST /v1/launches/create
```

## 요청 본문

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `wallet` | `string` | 예 | 생성자의 지갑 공개 키 |
| `launch` | `object` | 예 | 전체 런칭 구성 (아래 참조) |
| `agent` | `object` | 아니오 | 등록된 [에이전트](/ko/agents)를 대신하여 런칭 ([에이전트 런칭](#agent-launches) 참조) |

요청 본문은 `includeBackendSigner`, `derivedSignerPublicKey`, `nonce`, `buildAllTxs`도 허용합니다. 이 필드들은 [metaplex.com](https://www.metaplex.com) 자체의 서명 흐름에서 사용되므로, API를 직접 호출할 때는 설정하지 마세요.

### 런칭 구성

`launch` 객체는 전체 토큰 및 런칭 설정을 설명합니다:

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `name` | `string` | 예 | 토큰 이름, 1–32자 |
| `symbol` | `string` | 예 | 토큰 심볼, 1–10자 |
| `image` | `string` | 예 | 토큰 이미지 URL (Irys 게이트웨이) |
| `description` | `string` | 아니오 | 토큰 설명, 최대 250자 |
| `decimals` | `number` | 아니오 | 토큰 소수점 자릿수, 1–9 (기본값 6). 새 `launchpool` 토큰은 6이어야 하며, 기존 토큰은 온체인 민트와 일치해야 함 |
| `supply` | `number` | 아니오 | 총 토큰 공급량 (기본값 1,000,000,000) |
| `network` | `string` | 아니오 | `'solana-mainnet'` (기본값) 또는 `'solana-devnet'` |
| `quoteMint` | `string` | 아니오 | 견적 토큰 민트 주소 (기본값은 래핑된 SOL) |
| `type` | `string` | 예 | 런칭 유형 ([런칭 유형](#launch-types) 참조) |
| `finalize` | `boolean` | 아니오 | 런칭 확정 여부 (기본값 `true`) |
| `allocations` | `array` | 예 | 할당 구성 배열 |
| `externalLinks` | `object` | 아니오 | 웹사이트, Twitter, Telegram 링크 |
| `publicKey` | `string` | 예 | 생성자의 지갑 공개 키 (최상위 `wallet` 필드와 동일해야 함) |
| `useExistingToken` | `boolean` | 아니오 | 새 토큰을 민팅하는 대신 기존 SPL 토큰을 런칭 ([기존 토큰](#existing-tokens) 참조) |
| `mintAddress` | `string` | 아니오 | 기존 토큰의 민트. `useExistingToken`이 `true`일 때 필수 |
| `isMutable` | `boolean` | 아니오 | 토큰 메타데이터의 변경 가능 여부 (기본값 `true`) |

새 토큰의 경우 할당 공급량의 합계는 `supply`와 정확히 일치해야 합니다. 기본값 1,000,000,000이 아닌 `supply`를 사용하는 새 토큰은 계정에 사용자 지정 공급량이 활성화되어 있지 않으면 `403`을 반환합니다.

### 런칭 유형 {% #launch-types %}

| `type` | 설명 |
|--------|------|
| `launchpool` | 비례 배분 풀. 할당: `launchpoolV2`와 임의 개수의 `unlockedV2` 및 `claimScheduleV2` |
| `presale` | 고정가 사전 판매. 할당(순서대로): `presaleV2`, `unlockedV2`, 이후 임의 개수의 `claimScheduleV2` |
| `bondingCurve` | 본딩 커브 런칭. 할당: `bondingCurveV2`. 공급량 1,000,000,000, 소수점 6자리, SOL 견적으로 고정 |

스키마에는 `auction`과 `custom`도 정의되어 있습니다. `auction`은 아직 구현되지 않은 자리 표시자이며, `custom`은 공개 API에서 `400`으로 거부됩니다.

### 할당 유형 {% #allocation-types %}

`allocations` 배열의 각 할당에는 `type` 필드, `name`, `supply`, 그리고 같은 유형 이름을 키로 하는 구성 객체가 있습니다:

- **`launchpoolV2`** — 비례 배분 풀
- **`presaleV2`** — 고정가 사전 판매
- **`bondingCurveV2`** — 본딩 커브 판매
- **`unlockedV2`** — 수령인에게 잠금 해제된 토큰
- **`claimScheduleV2`** — 베스팅 일정에 따라 수령인에게 해제되는 토큰 (클리프 선택 사항)

Raydium 유동성은 별도의 할당이 아니라 판매 할당의 펀드 플로우로 구성됩니다. `RaydiumLP` 플로우는 Raydium CPMM 풀을, `RaydiumClmmLP` 플로우는 Raydium CLMM(집중 유동성) 포지션을 생성합니다. CLMM 런칭은 계정에서 활성화되어 있지 않으면 `403`을 반환합니다.

{% callout type="warning" title="Streamflow 할당은 폐지되었습니다" %}
이전의 `lockedV2`(Streamflow) 할당 유형은 더 이상 허용되지 않습니다. 잠금 및 베스팅 할당에는 `claimScheduleV2`를 사용하세요.
{% /callout %}

### 기존 토큰 {% #existing-tokens %}

이미 민팅한 토큰을 런칭하려면 `useExistingToken: true`를 설정하고 토큰의 `mintAddress`를 전달합니다. `decimals`는 온체인 민트와 일치해야 합니다. 새 토큰과 달리 할당은 공급량의 일부만 충당할 수 있습니다. 합계는 0보다 크고 `supply` 이하여야 하며, 나머지는 생성자의 지갑에 남습니다. 기존 토큰 런칭은 계정에서 활성화되어 있지 않으면 `403`을 반환하며, `bondingCurve` 유형에서는 사용할 수 없습니다.

### 에이전트 런칭 {% #agent-launches %}

등록된 [에이전트](/ko/agents)를 생성자로 하여 런칭을 만들려면 `agent`를 전달합니다:

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `agent.mint` | `string` | 예 | 에이전트의 Core 자산 주소. `wallet`이 소유해야 함 |
| `agent.setToken` | `boolean` | 예 | 런칭된 토큰을 에이전트의 토큰으로 설정할지 여부 |

에이전트의 자산 서명자 지갑이 런칭 생성자가 됩니다. [런칭 등록](/ko/api/register)에도 같은 `agent.mint`를 전달하세요.

{% callout type="note" %}
SDK의 `buildCreateLaunchPayload` 함수는 간소화된 `CreateLaunchInput`을 이 전체 페이로드 형식으로 변환하는 것을 처리합니다. [API 클라이언트](/ko/smart-contracts/genesis/sdk/api-client) 문서를 참조하세요.
{% /callout %}

## 요청 예시 — Launch Pool Type

```bash
curl -X POST https://api.metaplex.com/v1/launches/create \
  -H "Content-Type: application/json" \
  -d '{
    "wallet": "YourWalletPublicKey...",
    "launch": {
      "name": "My Token",
      "symbol": "MTK",
      "image": "https://gateway.irys.xyz/...",
      "decimals": 6,
      "supply": 1000000000,
      "network": "solana-devnet",
      "quoteMint": "So11111111111111111111111111111111111111112",
      "type": "launchpool",
      "finalize": true,
      "publicKey": "YourWalletPublicKey...",
      "allocations": [...]
    }
  }'
```

## 성공 응답

```json
{
  "success": true,
  "transactions": [
    "base64-encoded-transaction-1...",
    "base64-encoded-transaction-2..."
  ],
  "blockhash": {
    "blockhash": "...",
    "lastValidBlockHeight": 123456789
  },
  "mintAddress": "MintPublicKey...",
  "genesisAccount": "GenesisAccountPDA..."
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `success` | `boolean` | 성공 시 `true` |
| `transactions` | `string[]` | Base64로 인코딩된 직렬화 트랜잭션 |
| `blockhash` | `object` | 트랜잭션 확인을 위한 블록해시 |
| `mintAddress` | `string` | 토큰 민트 공개 키 |
| `genesisAccount` | `string` | Genesis 계정 PDA 공개 키 |

## 오류 응답

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [...]
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `success` | `boolean` | 오류 시 `false` |
| `error` | `string` | 오류 메시지 |
| `details` | `array?` | 유효성 검사 오류 세부 정보 (해당되는 경우) |

## 오류 코드

| 코드 | 설명 |
|------|------|
| `400` | 잘못된 입력 또는 유효성 검사 실패 |
| `500` | 내부 서버 오류 |

## 권장: SDK 사용

이 엔드포인트를 직접 호출하는 대신, 트랜잭션 생성, 서명, 전송, 등록의 전체 흐름을 한 번의 호출로 처리하는 [`createAndRegisterLaunch`](/ko/smart-contracts/genesis/sdk/api-client)를 사용하세요:

{% code-tabs-imported from="genesis/api_easy_mode" frameworks="umi" filename="createAndRegisterLaunch" /%}

전체 SDK 문서와 세 가지 통합 모드에 대한 자세한 내용은 [API 클라이언트](/ko/smart-contracts/genesis/sdk/api-client)를 참조하세요.
