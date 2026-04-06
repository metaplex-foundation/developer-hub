---
title: 런치 목록
metaTitle: Genesis - 런치 목록 | REST API | Metaplex
description: "활성 및 예정된 Genesis 런칭 리스팅을 조회합니다. 메타데이터가 포함된 목록을 반환합니다."
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

활성 및 예정된 Genesis 런칭 리스팅을 조회합니다. 메타데이터, 토큰 정보, 소셜 링크가 포함된 목록을 반환합니다. {% .lead %}

## Summary

상태 및 스포트라이트 옵션 필터를 사용하여 모든 Genesis 런치를 목록으로 조회합니다. 최근 활동순으로 정렬된 `LaunchData` 객체 배열을 반환합니다.

- `status`(`upcoming`, `live`, `graduated`) 및/또는 `spotlight`(`true`, `false`)로 필터 가능
- 결과는 `lastActivityAt` 내림차순으로 정렬
- 각 항목에는 런치 상세 정보, 베이스 토큰 메타데이터, 소셜 링크 포함
- `network` 쿼리 파라미터를 통해 메인넷(기본값) 및 데브넷 지원

## Quick Reference

| 항목 | 값 |
|------|-------|
| **메서드** | `GET` |
| **경로** | `/launches` |
| **인증** | 불필요 |
| **응답** | `LaunchData[]` |
| **페이지네이션** | 없음 |

## 엔드포인트

```
GET /launches
```

## 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|-----------|------|----------|-------------|
| `network` | `string` | 아니요 | 조회할 네트워크. 기본값: `solana-mainnet`. 데브넷의 경우 `solana-devnet`을 사용하세요. |
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
        "type": "launchpool"
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

interface LaunchesResponse {
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
pub struct LaunchesResponse {
    pub data: Vec<LaunchData>,
}
```

## 사용 예시

### TypeScript

```ts
const response = await fetch(
  "https://api.metaplex.com/v1/launches?status=live"
);
const { data }: LaunchesResponse = await response.json();
console.log(`${data.length} launches`);
data.forEach((entry) => {
  console.log(entry.baseToken.name, entry.launch.status);
});
```

### Rust

```rust
let response: LaunchesResponse = reqwest::get(
    "https://api.metaplex.com/v1/launches?status=live"
)
.await?
.json()
.await?;

println!("{} launches", response.data.len());
```

## Notes

- 결과는 페이지네이션되지 않습니다. 엔드포인트는 일치하는 모든 런치를 단일 응답으로 반환합니다.
- `status` 필터는 `upcoming`, `live`, `graduated`를 허용합니다. 생략하면 모든 상태를 반환합니다.
- `mechanic` 필드는 할당 메커니즘(예: `launchpoolV2`, `presaleV2`)을 나타냅니다. `type` 필드는 기본 런치 메커니즘(`launchpool` 또는 `presale`)을 나타냅니다.

