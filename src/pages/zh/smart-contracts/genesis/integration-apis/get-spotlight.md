---
title: Get Spotlight
metaTitle: Genesis - Get Spotlight | REST API | Metaplex
description: "获取 Genesis 精选聚焦发行。返回平台策划的精选发行。"
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

获取平台策划的精选聚焦发行。使用此端点在您的应用中展示精选发行。 {% .lead %}

## Summary

获取平台策划的聚焦精选发行。这是 `/launches` 端点预设 `spotlight=true` 的便捷过滤器。

- 返回 `spotlight` 为 `true` 的 `LaunchData` 对象数组
- 可通过 `status`（`upcoming`、`live`、`graduated`）进一步过滤
- 每个条目包含发行详情、基础代币元数据和社交链接
- 通过 `network` 查询参数支持主网（默认）和开发网

## Quick Reference

| 项目 | 值 |
|------|-------|
| **方法** | `GET` |
| **路径** | `/launches?spotlight=true` |
| **认证** | 无需 |
| **响应** | `LaunchData[]` |
| **分页** | 无 |

## 端点

```
GET /launches?spotlight=true
```

## 参数

| 参数 | 类型 | 必填 | 描述 |
|-----------|------|----------|-------------|
| `network` | `string` | 否 | 要查询的网络。默认值：`solana-mainnet`。使用 `solana-devnet` 查询开发网。 |
| `status` | `string` | 否 | 按状态筛选：`upcoming`、`live`、`graduated`。默认返回全部。 |

## 请求示例

```bash
curl "https://api.metaplex.com/v1/launches?spotlight=true"
```

## 响应

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

## 使用示例

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

- 聚焦状态由平台管理，不能通过 API 设置。
- 此端点使用 `spotlight=true` 作为查询参数的相同 `/launches` 路由 — 它不是一个单独的端点。
- `mechanic` 字段表示分配机制（例如 `launchpoolV2`、`presaleV2`）。`type` 字段表示底层发行机制（`launchpool` 或 `presale`）。
