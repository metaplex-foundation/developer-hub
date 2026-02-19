---
title: 런칭 생성
metaTitle: Genesis - 런칭 생성 | REST API | Metaplex
description: 새로운 Genesis 토큰 런칭을 위한 온체인 트랜잭션을 빌드합니다. 서명 및 전송 준비가 된 미서명 트랜잭션을 반환합니다.
method: POST
created: '02-19-2026'
updated: '02-19-2026'
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

새로운 Genesis 토큰 런칭을 위한 온체인 트랜잭션을 빌드합니다. [런칭 등록](/smart-contracts/genesis/integration-apis/register)을 호출하기 전에 서명하여 전송해야 하는 미서명 트랜잭션을 반환합니다. {% .lead %}

{% callout type="warning" title="SDK 사용을 권장합니다" %}
대부분의 통합자는 SDK의 [`createAndRegisterLaunch`](/smart-contracts/genesis/sdk/api-client)를 사용해야 합니다. 이 함수는 트랜잭션 생성, 서명, 전송, 런칭 등록을 한 번의 호출로 처리합니다. 이 엔드포인트는 SDK 없이 직접 HTTP 접근이 필요한 경우에만 사용하세요.
{% /callout %}

{% callout type="note" %}
Genesis 프로그램의 전체 기능을 [metaplex.com](https://www.metaplex.com)에서 아직 지원하지 않으므로, Create API(또는 SDK)를 사용하여 런칭을 프로그래밍 방식으로 생성하는 것을 권장합니다. API를 통해 생성된 메인넷 런칭은 [등록](/smart-contracts/genesis/integration-apis/register) 후 metaplex.com에 표시됩니다.
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

### 런칭 구성

`launch` 객체는 전체 토큰 및 런칭 설정을 설명합니다:

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `name` | `string` | 예 | 토큰 이름, 1–32자 |
| `symbol` | `string` | 예 | 토큰 심볼, 1–10자 |
| `image` | `string` | 예 | 토큰 이미지 URL (Irys 게이트웨이) |
| `description` | `string` | 아니오 | 토큰 설명, 최대 250자 |
| `decimals` | `number` | 아니오 | 토큰 소수점 자릿수 (기본값 6) |
| `supply` | `number` | 아니오 | 총 토큰 공급량 (기본값 1,000,000,000) |
| `network` | `string` | 아니오 | `'solana-mainnet'` (기본값) 또는 `'solana-devnet'` |
| `quoteMint` | `string` | 아니오 | 견적 토큰 민트 주소 (기본값은 래핑된 SOL) |
| `type` | `string` | 예 | `'project'` |
| `finalize` | `boolean` | 아니오 | 런칭 확정 여부 (기본값 `true`) |
| `allocations` | `array` | 예 | 할당 구성 배열 |
| `externalLinks` | `object` | 아니오 | 웹사이트, Twitter, Telegram 링크 |
| `publicKey` | `string` | 예 | 생성자의 지갑 공개 키 (최상위 `wallet` 필드와 동일해야 함) |

### 할당 유형

`allocations` 배열의 각 할당에는 `type` 필드가 있습니다:

- **`launchpoolV2`** — 비례 배분 풀
- **`raydiumV2`** — Raydium LP 할당
- **`unlockedV2`** — 수령인에게 잠금 해제된 토큰
- **`lockedV2`** — Streamflow를 통한 잠금 토큰
- **`presaleV2`** — 고정가 사전 판매

{% callout type="note" %}
SDK의 `buildCreateLaunchPayload` 함수는 간소화된 `CreateLaunchInput`을 이 전체 페이로드 형식으로 변환하는 것을 처리합니다. [API 클라이언트](/smart-contracts/genesis/sdk/api-client) 문서를 참조하세요.
{% /callout %}

## 요청 예시

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
      "type": "project",
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

이 엔드포인트를 직접 호출하는 대신, 트랜잭션 생성, 서명, 전송, 등록의 전체 흐름을 한 번의 호출로 처리하는 [`createAndRegisterLaunch`](/smart-contracts/genesis/sdk/api-client)를 사용하세요:

{% code-tabs-imported from="genesis/api_easy_mode" frameworks="umi" filename="createAndRegisterLaunch" /%}

전체 SDK 문서와 세 가지 통합 모드에 대한 자세한 내용은 [API 클라이언트](/smart-contracts/genesis/sdk/api-client)를 참조하세요.
