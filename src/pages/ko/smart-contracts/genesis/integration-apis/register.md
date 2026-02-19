---
title: 런칭 등록
metaTitle: Genesis - 런칭 등록 | REST API | Metaplex
description: 온체인 트랜잭션이 확인된 후 Genesis 런칭을 등록합니다. 온체인 상태를 검증하고 런칭 목록을 생성합니다.
method: POST
created: '01-15-2025'
updated: '02-19-2026'
keywords:
  - Genesis API
  - register launch
  - submit launch
  - launch metadata
about:
  - API endpoint
  - Launch registration
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

[런칭 생성](/smart-contracts/genesis/integration-apis/create-launch)의 온체인 트랜잭션이 확인된 후 Genesis 런칭을 등록합니다. 이 엔드포인트는 온체인 상태를 검증하고, 런칭 목록을 생성하며, 런칭 페이지 URL을 반환합니다. {% .lead %}

{% callout type="warning" title="SDK 사용을 권장합니다" %}
대부분의 통합자는 SDK의 [`createAndRegisterLaunch`](/smart-contracts/genesis/sdk/api-client)를 사용해야 합니다. 이 함수는 트랜잭션 생성, 서명, 전송, 런칭 등록을 한 번의 호출로 처리합니다. 이 엔드포인트는 SDK 없이 직접 HTTP 접근이 필요한 경우에만 사용하세요.
{% /callout %}

## 엔드포인트

```
POST /v1/launches/register
```

## 요청 본문

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `genesisAccount` | `string` | 예 | Genesis 계정 공개 키 (런칭 생성 응답에서 제공) |
| `network` | `string` | 아니오 | `'solana-mainnet'` (기본값) 또는 `'solana-devnet'` |
| `launch` | `object` | 예 | 런칭 생성에서 사용한 것과 동일한 런칭 구성 |

`launch` 객체는 런칭 생성 엔드포인트로 전송한 것과 일치해야 API가 온체인 상태가 예상된 구성과 일치하는지 확인할 수 있습니다.

## 요청 예시

```bash
curl -X POST https://api.metaplex.com/v1/launches/register \
  -H "Content-Type: application/json" \
  -d '{
    "genesisAccount": "GenesisAccountPDA...",
    "network": "solana-devnet",
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
  "launch": {
    "id": "uuid-launch-id",
    "link": "https://www.metaplex.com/token/MintPublicKey..."
  },
  "token": {
    "id": "uuid-token-id",
    "mintAddress": "MintPublicKey..."
  }
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `success` | `boolean` | 성공 시 `true` |
| `existing` | `boolean?` | 런칭이 이미 등록된 경우 `true` (멱등성) |
| `launch.id` | `string` | 고유 런칭 ID |
| `launch.link` | `string` | 공개 런칭 페이지 URL |
| `token.id` | `string` | 고유 토큰 ID |
| `token.mintAddress` | `string` | 토큰 민트 공개 키 |

{% callout type="note" %}
런칭이 이미 등록된 경우, 엔드포인트는 중복 생성 대신 `existing: true`와 함께 기존 레코드를 반환합니다.
{% /callout %}

{% callout type="note" %}
메인넷 런칭은 등록 후 [metaplex.com](https://www.metaplex.com)에 표시됩니다. 반환되는 `launch.link`는 공개 런칭 페이지를 가리킵니다.
{% /callout %}

## 오류 응답

```json
{
  "success": false,
  "error": "Genesis account not found on-chain",
  "details": [...]
}
```

## 오류 코드

| 코드 | 설명 |
|------|------|
| `400` | 잘못된 입력, 온체인 상태 불일치, 또는 Genesis 계정을 찾을 수 없음 |
| `500` | 내부 서버 오류 |

## 유효성 검사

등록 엔드포인트는 광범위한 온체인 유효성 검사를 수행합니다:

- Genesis V2 계정을 가져와 존재 여부를 확인합니다
- 모든 버킷 계정이 예상된 할당과 일치하는지 검증합니다
- 토큰 메타데이터(이름, 심볼, 이미지)가 입력과 일치하는지 확인합니다
- 민트 속성(공급량, 소수점 자릿수, 권한)을 검사합니다

## 권장: SDK 사용

이 엔드포인트를 직접 호출하는 대신, 트랜잭션 생성, 서명, 전송, 등록의 전체 흐름을 한 번의 호출로 처리하는 [`createAndRegisterLaunch`](/smart-contracts/genesis/sdk/api-client)를 사용하세요:

{% code-tabs-imported from="genesis/api_easy_mode" frameworks="umi" filename="createAndRegisterLaunch" /%}

전체 SDK 문서와 세 가지 통합 모드에 대한 자세한 내용은 [API 클라이언트](/smart-contracts/genesis/sdk/api-client)를 참조하세요.
