---
title: Register
metaTitle: Genesis - Register Launch | REST API | Metaplex
description: メタデータ、ソーシャルリンク、ローンチページ URL を使用して新しい Genesis ローンチを登録します。
method: POST
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - Genesis API
  - register launch
  - submit launch
  - launch metadata
about:
  - API endpoint
  - Launch registration
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---

API で新しい Genesis ローンチを登録します。ローンチページ URL、ウェブサイト、ソーシャルリンクを送信して、アグリゲーターがローンチを発見・表示できるようにします。 {% .lead %}

{% callout type="warning" title="ドラフト" %}
これはサンプルページです。パラメータ、リクエスト/レスポンス形式、動作は、実際のインテグレーションが確定次第変更される可能性があります。
{% /callout %}

## エンドポイント

```
POST /register
```

## リクエストボディ

| フィールド | 型 | 必須 | 説明 |
|-------|------|----------|-------------|
| `genesisAddress` | `string` | はい | The genesis account public key |
| `launchPage` | `string` | はい | URL where users can participate in the launch |
| `website` | `string` | いいえ | Project website URL |
| `socials.x` | `string` | いいえ | X (Twitter) profile URL |
| `socials.telegram` | `string` | いいえ | Telegram group URL |
| `socials.discord` | `string` | いいえ | Discord server invite URL |

## リクエスト例

```bash
curl -X POST https://api.metaplex.com/v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "genesisAddress": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN",
    "launchPage": "https://example.com/launch/mytoken",
    "website": "https://example.com",
    "socials": {
      "x": "https://x.com/mytoken",
      "telegram": "https://t.me/mytoken",
      "discord": "https://discord.gg/mytoken"
    }
  }'
```

## レスポンス

```json
{
  "data": {
    "success": true,
    "genesisAddress": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
  }
}
```

## リクエスト＆レスポンス型

### TypeScript

```ts
interface RegisterRequest {
  genesisAddress: string;
  launchPage: string;
  website?: string;
  socials?: {
    x?: string;
    telegram?: string;
    discord?: string;
  };
}

interface RegisterResponse {
  data: {
    success: boolean;
    genesisAddress: string;
  };
}
```

### Rust

```rust
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RegisterRequest {
    pub genesis_address: String,
    pub launch_page: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub website: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub socials: Option<Socials>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RegisterData {
    pub success: bool,
    pub genesis_address: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RegisterResponse {
    pub data: RegisterData,
}
```

## 使用例

### TypeScript

```ts
const response = await fetch("https://api.metaplex.com/v1/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    genesisAddress: "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN",
    launchPage: "https://example.com/launch/mytoken",
    website: "https://example.com",
    socials: {
      x: "https://x.com/mytoken",
    },
  }),
});
const { data }: RegisterResponse = await response.json();
console.log(data.success); // true
```

### Rust

```rust
let client = reqwest::Client::new();
let response: RegisterResponse = client
    .post("https://api.metaplex.com/v1/register")
    .json(&RegisterRequest {
        genesis_address: "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN".to_string(),
        launch_page: "https://example.com/launch/mytoken".to_string(),
        website: Some("https://example.com".to_string()),
        socials: Some(Socials {
            x: Some("https://x.com/mytoken".to_string()),
            telegram: None,
            discord: None,
        }),
    })
    .send()
    .await?
    .json()
    .await?;

println!("Registered: {}", response.data.success);
```

## エラー

| コード | 説明 |
|------|-------------|
| `400` | Invalid request body or missing required fields |
| `409` | Launch already registered for this genesis address |
| `429` | Rate limit exceeded |
| `500` | Internal server error |

{% callout type="note" %}
`genesisAddress` はオンチェーン上の有効かつファイナライズ済みの Genesis アカウントに対応している必要があります。アカウントが存在しない場合、登録は失敗します。
{% /callout %}
