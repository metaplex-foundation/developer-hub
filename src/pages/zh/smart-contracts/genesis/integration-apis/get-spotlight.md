---
title: Get Spotlight
metaTitle: Genesis - Get Spotlight | REST API | Metaplex
description: "获取 Genesis 精选聚焦发行。返回平台策划的精选发行。"
method: GET
created: '01-15-2025'
updated: '01-31-2026'
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

{% callout type="warning" title="草稿" %}
这是一个示例页面。参数、请求/响应格式和行为可能会在实际集成确定后发生变化。
{% /callout %}

## 端点

```
GET /spotlight
```

## 参数

| 参数 | 类型 | 必填 | 描述 |
|-----------|------|----------|-------------|
| `network` | `string` | 否 | 要查询的网络。默认值：`solana-mainnet`。使用 `solana-devnet` 查询开发网。 |
| `limit` | `number` | 否 | 返回的结果数量。默认值：`5`。最大值：`20`。 |

## 请求示例

```bash
curl "https://api.metaplex.com/v1/spotlight?limit=3"
```

## 响应

```json
{
  "data": {
    "spotlight": [
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
        }
      }
    ]
  }
}
```

## 响应类型

### TypeScript

```ts
interface SpotlightEntry {
  launch: Launch;
  baseToken: BaseToken;
  website: string;
  socials: Socials;
}

interface SpotlightResponse {
  data: {
    spotlight: SpotlightEntry[];
  };
}
```

### Rust

```rust
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SpotlightEntry {
    pub launch: Launch,
    pub base_token: BaseToken,
    pub website: String,
    pub socials: Socials,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SpotlightData {
    pub spotlight: Vec<SpotlightEntry>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SpotlightResponse {
    pub data: SpotlightData,
}
```

## 使用示例

### TypeScript

```ts
const response = await fetch(
  "https://api.metaplex.com/v1/spotlight?limit=3"
);
const { data }: SpotlightResponse = await response.json();
data.spotlight.forEach((entry) => {
  console.log(entry.baseToken.name, entry.launch.type);
});
```

### Rust

```rust
let response: SpotlightResponse = reqwest::get(
    "https://api.metaplex.com/v1/spotlight?limit=3"
)
.await?
.json()
.await?;

for entry in &response.data.spotlight {
    println!("{}", entry.base_token.name);
}
```
