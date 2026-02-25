---
title: Get Spotlight
metaTitle: Genesis - Get Spotlight | REST API | Metaplex
description: Genesis の注目スポットライトローンチを取得します。プラットフォームが厳選したローンチを返します。
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

プラットフォームが厳選した注目スポットライトローンチを取得します。アプリケーションで選択されたローンチをハイライト表示するために使用します。 {% .lead %}

{% callout type="warning" title="ドラフト" %}
これはサンプルページです。パラメータ、リクエスト/レスポンス形式、動作は、実際のインテグレーションが確定次第変更される可能性があります。
{% /callout %}

## エンドポイント

```
GET /spotlight
```

## パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|----------|-------------|
| `network` | `string` | いいえ | Network to query. Default: `solana-mainnet`. Use `solana-devnet` for devnet. |
| `limit` | `number` | いいえ | Number of results to return. Default: `5`. Max: `20`. |

## リクエスト例

```bash
curl "https://api.metaplex.com/v1/spotlight?limit=3"
```

## レスポンス

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

## レスポンス型

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

## 使用例

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
