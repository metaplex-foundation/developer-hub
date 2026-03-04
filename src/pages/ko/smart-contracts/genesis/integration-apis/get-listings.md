---
title: Get Listings
metaTitle: Genesis - Get Listings | REST API | Metaplex
description: "활성 및 예정된 Genesis 런칭 리스팅을 조회합니다. 메타데이터가 포함된 페이지네이션 목록을 반환합니다."
method: GET
created: '01-15-2025'
updated: '01-31-2026'
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

{% callout type="warning" title="초안" %}
이 페이지는 예시입니다. 파라미터, 요청/응답 형식 및 동작은 실제 통합이 확정되면 변경될 수 있습니다.
{% /callout %}

## 엔드포인트

```
GET /listings
```

## 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|-----------|------|----------|-------------|
| `network` | `string` | 아니요 | Network to query. Default: `solana-mainnet`. Use `solana-devnet` for devnet. |
| `status` | `string` | 아니요 | Filter by status: `active`, `upcoming`, `completed`. Default: returns all. |
| `limit` | `number` | 아니요 | Number of results per page. Default: `20`. Max: `100`. |
| `offset` | `number` | 아니요 | Number of results to skip for pagination. Default: `0`. |

## 요청 예시

```bash
curl "https://api.metaplex.com/v1/listings?status=active&limit=10"
```

## 응답

```json
{
  "data": {
    "listings": [
      {
        "launch": {
          "launchPage": "https://example.com/launch/mytoken",
          "type": "launchpool",
          "genesisAddress": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
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
        },
        "status": "active"
      }
    ],
    "total": 42,
    "limit": 10,
    "offset": 0
  }
}
```

## 응답 타입

### TypeScript

```ts
interface ListingEntry {
  launch: Launch;
  baseToken: BaseToken;
  website: string;
  socials: Socials;
  status: "active" | "upcoming" | "completed";
}

interface ListingsResponse {
  data: {
    listings: ListingEntry[];
    total: number;
    limit: number;
    offset: number;
  };
}
```

### Rust

```rust
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ListingEntry {
    pub launch: Launch,
    pub base_token: BaseToken,
    pub website: String,
    pub socials: Socials,
    pub status: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ListingsData {
    pub listings: Vec<ListingEntry>,
    pub total: u64,
    pub limit: u64,
    pub offset: u64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ListingsResponse {
    pub data: ListingsData,
}
```

## 사용 예시

### TypeScript

```ts
const response = await fetch(
  "https://api.metaplex.com/v1/listings?status=active&limit=10"
);
const { data }: ListingsResponse = await response.json();
console.log(`${data.total} total listings`);
data.listings.forEach((entry) => {
  console.log(entry.baseToken.name, entry.status);
});
```

### Rust

```rust
let response: ListingsResponse = reqwest::get(
    "https://api.metaplex.com/v1/listings?status=active&limit=10"
)
.await?
.json()
.await?;

println!("{} total listings", response.data.total);
```

## 페이지네이션

Use `limit` and `offset` to paginate through results:

```bash
# First page
curl "https://api.metaplex.com/v1/listings?limit=20&offset=0"

# Second page
curl "https://api.metaplex.com/v1/listings?limit=20&offset=20"
```

The `total` field in the response indicates the total number of matching listings.
