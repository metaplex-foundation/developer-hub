---
title: Get Spotlight
metaTitle: Genesis - Get Spotlight | REST API | Metaplex
description: "Genesis의 주요 스포트라이트 런칭을 조회합니다. 플랫폼에서 큐레이팅된 런칭을 반환합니다."
method: GET
created: '01-15-2025'
updated: '02-26-2026'
keywords:
  - Genesis API
  - spotlight
  - featured launches
  - curated launches
about:
  - API endpoint
  - Featured launches
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---

플랫폼에서 큐레이팅된 주요 스포트라이트 런칭을 조회합니다. 애플리케이션에서 선택된 런칭을 하이라이트하는 데 사용합니다. {% .lead %}

## Summary

플랫폼에서 스포트라이트로 큐레이팅된 런치를 조회합니다. `/launches` 엔드포인트에 `spotlight=true`를 사전 적용한 편의 필터입니다.

- `spotlight`가 `true`인 `LaunchData` 객체 배열 반환
- `status`(`upcoming`, `live`, `graduated`)로 추가 필터 가능
- 각 항목에는 런치 상세 정보, 베이스 토큰 메타데이터, 소셜 링크 포함
- `network` 쿼리 파라미터를 통해 메인넷(기본값) 및 데브넷 지원

## 엔드포인트

```
GET /launches?spotlight=true
```

## 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|-----------|------|----------|-------------|
| `network` | `string` | 아니요 | 조회할 네트워크. 기본값: `solana-mainnet`. 데브넷의 경우 `solana-devnet`을 사용하세요. |
| `status` | `string` | 아니요 | 상태별 필터: `upcoming`, `live`, `graduated`. 기본값: 전체 반환. |

## 요청 예시

```bash
curl "https://api.metaplex.com/v1/launches?spotlight=true"
```

## 응답

```json
{
  "data": [
    {
        "launch": {
          "launchPage": "https://example.com/launch/mytoken",
          "mechanic": "launchpoolV2",
          "genesisAddress": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN",
          "spotlight": true,
          "startTime": "2026-01-15T14:00:00.000Z",
          "endTime": "2026-01-15T18:00:00.000Z",
          "status": "live",
          "heroUrl": "launches/abc123/hero.webp",
          "graduatedAt": null,
          "lastActivityAt": "2026-01-15T16:30:00.000Z",
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

interface SpotlightResponse {
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
pub struct SpotlightResponse {
    pub data: Vec<LaunchData>,
}
```

## 사용 예시

### TypeScript

```ts
const response = await fetch(
  "https://api.metaplex.com/v1/launches?spotlight=true"
);
const { data }: SpotlightResponse = await response.json();
data.forEach((entry) => {
  console.log(entry.baseToken.name, entry.launch.type);
});
```

### Rust

```rust
let response: SpotlightResponse = reqwest::get(
    "https://api.metaplex.com/v1/launches?spotlight=true"
)
.await?
.json()
.await?;

for entry in &response.data {
    println!("{}", entry.base_token.name);
}
```

## Notes

- 스포트라이트 상태는 플랫폼에서 관리되며 API를 통해 설정할 수 없습니다.
- 이 엔드포인트는 `spotlight=true`를 쿼리 파라미터로 사용하는 동일한 `/launches` 라우트를 사용합니다 — 별도의 엔드포인트가 아닙니다.
- `mechanic` 필드는 할당 메커니즘(예: `launchpoolV2`, `presaleV2`)을 나타냅니다. `type` 필드는 런치 카테고리(`project`, `memecoin`, `custom`)를 나타냅니다.
