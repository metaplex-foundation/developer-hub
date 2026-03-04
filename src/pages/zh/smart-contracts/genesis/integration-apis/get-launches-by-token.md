---
title: Get Launches by Token
metaTitle: Genesis - Get Launches by Token | REST API | Metaplex
description: 获取与代币铸造地址关联的所有发行。返回发行信息、代币元数据和社交链接。
method: GET
created: '01-15-2025'
updated: '02-26-2026'
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

## Summary

获取与代币铸造地址关联的所有发行。由于一个代币可以使用不同的 `genesisIndex` 值拥有多个发行活动，因此返回发行数组。

- 需要代币铸造公钥作为路径参数
- 返回包含 `launches` 数组的 `TokenData` 对象
- 发行数据中包含基础代币元数据和社交链接
- 通过 `network` 查询参数支持主网（默认）和开发网

## Quick Reference

| 项目 | 值 |
|------|-------|
| **方法** | `GET` |
| **路径** | `/tokens/{mint}` |
| **认证** | 无需 |
| **响应** | `TokenData`（包含 `launches` 数组） |
| **分页** | 无 |

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

请参阅[共享类型](/smart-contracts/genesis/integration-apis#shared-types)了解 `Launch`、`BaseToken` 和 `Socials` 的定义。

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

## Notes

- 一个代币可以使用不同的 `genesisIndex` 值拥有多个发行。响应返回所有关联的发行活动。
- 如果代币铸造地址未找到，返回 `404`。
- `mechanic` 字段表示分配机制（例如 `launchpoolV2`、`presaleV2`）。`type` 字段表示发行类别（`project`、`memecoin` 或 `custom`）。
