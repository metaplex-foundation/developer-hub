---
title: 发行列表
metaTitle: Genesis - 发行列表 | REST API | Metaplex
description: "获取活跃和即将到来的 Genesis 发行列表。返回带有元数据的列表。"
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

获取活跃和即将到来的 Genesis 发行列表。返回带有元数据、代币信息和社交链接的列表。 {% .lead %}

## Summary

使用状态和聚焦的可选过滤器列出所有 Genesis 发行。返回按最近活动排序的 `LaunchData` 对象数组。

- 可通过 `status`（`upcoming`、`live`、`graduated`）和/或 `spotlight`（`true`、`false`）过滤
- 结果按 `lastActivityAt` 降序排列
- 每个条目包含发行详情、基础代币元数据和社交链接
- 通过 `network` 查询参数支持主网（默认）和开发网

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

## 使用示例

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

- 结果不分页。端点在单个响应中返回所有匹配的发行。
- `status` 过滤器接受 `upcoming`、`live` 或 `graduated`。省略则返回所有状态。
- `mechanic` 字段表示分配机制（例如 `launchpoolV2`、`presaleV2`）。`type` 字段表示发行类别（`project`、`memecoin` 或 `custom`）。

