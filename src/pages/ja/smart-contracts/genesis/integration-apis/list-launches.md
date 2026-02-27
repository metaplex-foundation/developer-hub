---
title: Get Listings
metaTitle: Genesis - Get Listings | REST API | Metaplex
description: アクティブおよび今後の Genesis ローンチリスティングを取得します。メタデータ付きのページネーション対応リストを返します。
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

アクティブおよび今後の Genesis ローンチリスティングを取得します。メタデータ、トークン情報、ソーシャルリンク付きのページネーション対応リストを返します。 {% .lead %}

## エンドポイント

```
GET /launches
```

## パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|----------|-------------|
| `network` | `string` | いいえ | Network to query. Default: `solana-mainnet`. Use `solana-devnet` for devnet. |
| `status` | `string` | いいえ | ステータスでフィルタ: `upcoming`, `live`, `graduated`。デフォルト: 全件返却。 |
| `spotlight` | `string` | いいえ | スポットライトでフィルタ: `true` または `false`。デフォルト: 全件返却。 |

## リクエスト例

```bash
curl "https://api.metaplex.com/v1/launches?status=live"
```

## レスポンス

結果は `lastActivityAt` の降順でソートされます。

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

## レスポンス型

[共有型](/smart-contracts/genesis/integration-apis#shared-types)で `Launch`、`BaseToken`、`Socials` の定義を参照してください。

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

## 使用例

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

