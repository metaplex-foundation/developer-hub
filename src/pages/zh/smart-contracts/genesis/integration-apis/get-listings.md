---
title: Get Listings
metaTitle: Genesis - Get Listings | REST API | Metaplex
description: "获取活跃和即将到来的 Genesis 发行列表。返回带有元数据的分页列表。"
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

获取活跃和即将到来的 Genesis 发行列表。返回带有元数据、代币信息和社交链接的分页列表。 {% .lead %}

{% callout type="warning" title="草稿" %}
这是一个示例页面。参数、请求/响应格式和行为可能会在实际集成确定后发生变化。
{% /callout %}

## 端点

```
GET /listings
```

## 参数

| 参数 | 类型 | 必填 | 描述 |
|-----------|------|----------|-------------|
| `network` | `string` | 否 | 要查询的网络。默认值：`solana-mainnet`。使用 `solana-devnet` 查询开发网。 |
| `status` | `string` | 否 | 按状态筛选：`active`、`upcoming`、`completed`。默认返回全部。 |
| `limit` | `number` | 否 | 每页返回的结果数量。默认值：`20`。最大值：`100`。 |
| `offset` | `number` | 否 | 分页跳过的结果数量。默认值：`0`。 |

## 请求示例

```bash
curl "https://api.metaplex.com/v1/listings?status=active&limit=10"
```

## 响应

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

## 响应类型

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

## 使用示例

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

## 分页

使用 `limit` 和 `offset` 对结果进行分页：

```bash
# First page
curl "https://api.metaplex.com/v1/listings?limit=20&offset=0"

# Second page
curl "https://api.metaplex.com/v1/listings?limit=20&offset=20"
```

响应中的 `total` 字段表示匹配的发行列表总数。
