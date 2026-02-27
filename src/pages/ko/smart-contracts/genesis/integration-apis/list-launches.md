---
title: Get Listings
metaTitle: Genesis - Get Listings | REST API | Metaplex
description: "활성 및 예정된 Genesis 런칭 리스팅을 조회합니다. 메타데이터가 포함된 페이지네이션 목록을 반환합니다."
method: GET
created: '01-15-2025'
updated: '02-26-2026'
keywords:
  - Genesis API
  - listings
  - active launches
  - launch directory
about:
  - API endpoint
  - Launch listings
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---

활성 및 예정된 Genesis 런칭 리스팅을 조회합니다. 메타데이터, 토큰 정보, 소셜 링크가 포함된 페이지네이션 목록을 반환합니다. {% .lead %}

## 엔드포인트

```
GET /launches
```

## 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|-----------|------|----------|-------------|
| `network` | `string` | 아니요 | Network to query. Default: `solana-mainnet`. Use `solana-devnet` for devnet. |
| `status` | `string` | 아니요 | 상태별 필터: `upcoming`, `live`, `graduated`. 기본값: 전체 반환. |
| `spotlight` | `string` | 아니요 | 스포트라이트 필터: `true` 또는 `false`. 기본값: 전체 반환. |

## 요청 예시

```bash
curl "https://api.metaplex.com/v1/launches?status=live"
```

## 응답

결과는 `lastActivityAt` 내림차순으로 정렬됩니다.

```json
{
  "data": [
    {
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
  ]
}
```

## 응답 타입

`Launch`, `BaseToken`, `Socials` 정의는 [공유 타입](/smart-contracts/genesis/integration-apis#shared-types)을 참조하세요.

### TypeScript

```ts
interface LaunchData {
  launch: Launch;
  baseToken: BaseToken;
  website: string;
  socials: Socials;
}

interface ListingsResponse {
  data: LaunchData[];
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
pub struct ListingsResponse {
    pub data: Vec<LaunchData>,
}
```

## 사용 예시

### TypeScript

```ts
const response = await fetch(
  "https://api.metaplex.com/v1/launches?status=live"
);
const { data }: ListingsResponse = await response.json();
console.log(`${data.length} launches`);
data.forEach((entry) => {
  console.log(entry.baseToken.name, entry.launch.status);
});
```

### Rust

```rust
let response: ListingsResponse = reqwest::get(
    "https://api.metaplex.com/v1/launches?status=live"
)
.await?
.json()
.await?;

println!("{} launches", response.data.len());
```

