---
title: Get Listings
metaTitle: Genesis - Get Listings | REST API | Metaplex
description: "获取活跃和即将到来的 Genesis 发行列表。返回带有元数据的分页列表。"
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

获取活跃和即将到来的 Genesis 发行列表。返回带有元数据、代币信息和社交链接的分页列表。 {% .lead %}

## 端点

```
GET /launches
```

## 参数

| 参数 | 类型 | 必填 | 描述 |
|-----------|------|----------|-------------|
| `network` | `string` | 否 | 要查询的网络。默认值：`solana-mainnet`。使用 `solana-devnet` 查询开发网。 |
| `status` | `string` | 否 | 按状态筛选：`upcoming`、`live`、`graduated`。默认返回全部。 |
| `spotlight` | `string` | 否 | 按聚焦筛选：`true` 或 `false`。默认返回全部。 |

## 请求示例

```bash
curl "https://api.metaplex.com/v1/launches?status=live"
```

## 响应

结果按 `lastActivityAt` 降序排列。

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

## 响应类型

请参阅[共享类型](/smart-contracts/genesis/integration-apis#shared-types)了解 `Launch`、`BaseToken` 和 `Socials` 的定义。

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

## 使用示例

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

