---
title: Get Launch
metaTitle: Genesis - Get Launch | REST API | Metaplex
description: 通过Genesis地址获取发行数据。返回发行信息、代币元数据和社交链接。
method: GET
created: '01-15-2025'
updated: '02-26-2026'
keywords:
  - Genesis API
  - get launch
  - genesis address
  - launch data
about:
  - API endpoint
  - Launch queries
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---

检索特定 genesis 地址的发行数据。返回发行信息、代币元数据、网站和社交链接。 {% .lead %}

## 端点

```
GET /launches/{genesis_pubkey}
```

## 参数

| 参数 | 类型 | 必填 | 描述 |
|-----------|------|----------|-------------|
| `genesis_pubkey` | `string` | 是 | genesis 账户公钥 |
| `network` | `string` | 否 | 查询的网络。默认：`solana-mainnet`。使用 `solana-devnet` 查询 devnet。 |

## 请求示例

```bash
curl https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN
```

## 响应

```json
{
  "data": {
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
}
```

## 响应类型

请参阅[共享类型](/smart-contracts/genesis/integration-apis#shared-types)了解 `Launch`、`BaseToken` 和 `Socials` 的定义。

### TypeScript

```ts
interface LaunchResponse {
  data: {
    launch: Launch;
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
pub struct LaunchData {
    pub launch: Launch,
    pub base_token: BaseToken,
    pub website: String,
    pub socials: Socials,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LaunchResponse {
    pub data: LaunchData,
}
```

## 使用示例

### TypeScript

```ts
const response = await fetch(
  "https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
);
const { data }: LaunchResponse = await response.json();
console.log(data.baseToken.name); // "My Token"
```

### Rust

```rust
let response: LaunchResponse = reqwest::get(
    "https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
)
.await?
.json()
.await?;

println!("{}", response.data.base_token.name); // "My Token"
```

{% callout type="note" %}
查找 genesis 公钥需要索引或 `getProgramAccounts`。如果您只有代币铸造地址，请改用[按代币获取发行](/smart-contracts/genesis/integration-apis/get-launches-by-token)端点。
{% /callout %}
