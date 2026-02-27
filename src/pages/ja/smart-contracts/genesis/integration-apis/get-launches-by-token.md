---
title: Get Launches by Token
metaTitle: Genesis - Get Launches by Token | REST API | Metaplex
description: トークンミントアドレスに関連するすべてのローンチを取得します。ローンチ情報、トークンメタデータ、ソーシャルリンクを返します。
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

トークンミントアドレスに関連するすべてのローンチを取得します。1つのトークンに複数のローンチキャンペーンが存在する場合があるため、レスポンスはローンチの配列を返します。 {% .lead %}

## エンドポイント

```
GET /tokens/{mint}
```

## パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|----------|-------------|
| `mint` | `string` | はい | トークンミントの公開鍵 |
| `network` | `string` | いいえ | クエリするネットワーク。デフォルト：`solana-mainnet`。devnet の場合は `solana-devnet` を使用。 |

## リクエスト例

```bash
curl https://api.metaplex.com/v1/tokens/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
```

## レスポンス

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

## レスポンス型

[共有型](/smart-contracts/genesis/integration-apis#shared-types)で `Launch`、`BaseToken`、`Socials` の定義を参照してください。

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

## 使用例

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
1つのトークンは異なる `genesisIndex` 値を使用して複数のローンチを持つことができます。レスポンスは関連するすべてのローンチキャンペーンを返します。
{% /callout %}
