---
title: Register
metaTitle: Genesis - Register Launch | REST API | Metaplex
description: "使用元数据、社交链接和发行页面 URL 注册新的 Genesis 发行。"
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

通过 API 注册新的 Genesis 发行。提交您的发行页面 URL、网站和社交链接，以便聚合器可以发现和展示您的发行。 {% .lead %}

{% callout type="warning" title="草稿" %}
这是一个示例页面。参数、请求/响应格式和行为可能会在实际集成确定后发生变化。
{% /callout %}

## 端点

```
POST /register
```

## 请求体

| 字段 | 类型 | 必填 | 描述 |
|-------|------|----------|-------------|
| `genesisAddress` | `string` | 是 | Genesis 账户公钥 |
| `launchPage` | `string` | 是 | 用户可以参与发行的 URL |
| `website` | `string` | 否 | 项目网站 URL |
| `socials.x` | `string` | 否 | X (Twitter) 个人资料 URL |
| `socials.telegram` | `string` | 否 | Telegram 群组 URL |
| `socials.discord` | `string` | 否 | Discord 服务器邀请 URL |

## 请求示例

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

## 响应

```json
{
  "data": {
    "success": true,
    "genesisAddress": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
  }
}
```

## 请求和响应类型

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

## 使用示例

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

## 错误

| 代码 | 描述 |
|------|-------------|
| `400` | 无效的请求体或缺少必填字段 |
| `409` | 该 Genesis 地址已注册发行 |
| `429` | 超出速率限制 |
| `500` | 内部服务器错误 |

{% callout type="note" %}
`genesisAddress` 必须对应链上一个有效的、已确认的 Genesis 账户。如果该账户不存在，注册将失败。
{% /callout %}
