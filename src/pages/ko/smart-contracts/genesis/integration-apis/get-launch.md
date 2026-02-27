---
title: Get Launch
metaTitle: Genesis - Get Launch | REST API | Metaplex
description: Genesis 주소로 런칭 데이터를 조회합니다. 런칭 정보, 토큰 메타데이터, 소셜 링크를 반환합니다.
method: GET
created: '01-15-2025'
updated: '02-26-2026'
keywords:
  - Genesis API
  - get launch
  - genesis address
  - launch data
about:
  - API endpoint
  - Launch queries
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---

특정 genesis 주소의 런칭 데이터를 조회합니다. 런칭 정보, 토큰 메타데이터, 웹사이트, 소셜 링크를 반환합니다. {% .lead %}

## 엔드포인트

```
GET /launches/{genesis_pubkey}
```

## 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|-----------|------|----------|-------------|
| `genesis_pubkey` | `string` | Yes | genesis 계정 공개 키 |
| `network` | `string` | No | 조회할 네트워크. 기본값: `solana-mainnet`. 데브넷의 경우 `solana-devnet`을 사용하세요. |

## 요청 예시

```bash
curl https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN
```

## 응답

```json
{
  "data": {
    "launch": {
      "launchPage": "https://example.com/launch/mytoken",
      "mechanic": "launchpoolV2",
      "genesisAddress": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN",
      "spotlight": false,
      "startTime": "2026-01-15T14:00:00.000Z",
      "endTime": "2026-01-15T18:00:00.000Z",
      "status": "graduated",
      "heroUrl": "launches/abc123/hero.webp",
      "graduatedAt": "2026-01-15T18:05:00.000Z",
      "lastActivityAt": "2026-01-15T17:45:00.000Z",
      "type": "project"
    },
    "baseToken": {
      "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "name": "My Token",
      "symbol": "MTK",
      "image": "https://example.com/token-image.png",
      "description": "A community-driven token for the example ecosystem."
    },
    "website": "https://example.com",
    "socials": {
      "x": "https://x.com/mytoken",
      "telegram": "https://t.me/mytoken",
      "discord": "https://discord.gg/mytoken"
    }
  }
}
```

## 응답 타입

`Launch`, `BaseToken`, `Socials` 정의는 [공유 타입](/smart-contracts/genesis/integration-apis#shared-types)을 참조하세요.

### TypeScript

```ts
interface LaunchResponse {
  data: {
    launch: Launch;
    baseToken: BaseToken;
    website: string;
    socials: Socials;
  };
}
```

### Rust

```rust
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LaunchData {
    pub launch: Launch,
    pub base_token: BaseToken,
    pub website: String,
    pub socials: Socials,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LaunchResponse {
    pub data: LaunchData,
}
```

## 사용 예시

### TypeScript

```ts
const response = await fetch(
  "https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
);
const { data }: LaunchResponse = await response.json();
console.log(data.baseToken.name); // "My Token"
```

### Rust

```rust
let response: LaunchResponse = reqwest::get(
    "https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
)
.await?
.json()
.await?;

println!("{}", response.data.base_token.name); // "My Token"
```

{% callout type="note" %}
genesis 공개 키를 찾으려면 인덱싱 또는 `getProgramAccounts`가 필요합니다. 토큰 민트만 있는 경우 [토큰별 런치 조회](/smart-contracts/genesis/integration-apis/get-launches-by-token) 엔드포인트를 대신 사용하세요.
{% /callout %}
