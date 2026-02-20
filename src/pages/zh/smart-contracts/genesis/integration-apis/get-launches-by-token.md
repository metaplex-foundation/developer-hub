---
title: Get Launches by Token
metaTitle: Genesis - Get Launches by Token | REST API | Metaplex
description: 获取与代币铸造地址关联的所有发行。返回发行信息、代币元数据和社交链接。
method: GET
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - Genesis API
  - token launches
  - token mint
  - launch data
about:
  - API endpoint
  - Token queries
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---

检索与代币铸造地址关联的所有发行。一个代币可以有多个发行活动，因此响应返回发行数组。 {% .lead %}

## 端点

```
GET /tokens/{mint}
```

## 参数

| 参数 | 类型 | 必填 | 描述 |
|-----------|------|----------|-------------|
| `mint` | `string` | 是 | 代币铸造公钥 |
| `network` | `string` | 否 | 查询的网络。默认：`solana-mainnet`。使用 `solana-devnet` 查询 devnet。 |

## 请求示例

```bash
curl https://api.metaplex.com/v1/tokens/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
```

## 响应

```json
{
  "data": {
    "launches": [
      {
        "launchPage": "https://example.com/launch/mytoken",
        "type": "launchpool",
        "genesisAddress": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
      }
    ],
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

## 响应类型

### TypeScript

```ts
interface TokenResponse {
  data: {
    launches: Launch[];
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
pub struct TokenData {
    pub launches: Vec<Launch>,
    pub base_token: BaseToken,
    pub website: String,
    pub socials: Socials,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TokenResponse {
    pub data: TokenData,
}
```

## 使用示例

### TypeScript

```ts
const response = await fetch(
  "https://api.metaplex.com/v1/tokens/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
);
const { data }: TokenResponse = await response.json();
console.log(data.launches.length); // Number of launch campaigns
console.log(data.baseToken.symbol); // "MTK"
```

### Rust

```rust
let response: TokenResponse = reqwest::get(
    "https://api.metaplex.com/v1/tokens/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
)
.await?
.json()
.await?;

println!("{} launches found", response.data.launches.len());
```

{% callout type="note" %}
一个代币可以使用不同的 `genesisIndex` 值拥有多个发行。响应返回所有关联的发行活动。
{% /callout %}
