---
title: Register
metaTitle: Genesis - Register Launch | REST API | Metaplex
description: "메타데이터, 소셜 링크, 런칭 페이지 URL로 새로운 Genesis 런칭을 등록합니다."
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

API로 새로운 Genesis 런칭을 등록합니다. 런칭 페이지 URL, 웹사이트, 소셜 링크를 제출하여 애그리게이터가 런칭을 발견하고 표시할 수 있도록 합니다. {% .lead %}

{% callout type="warning" title="초안" %}
이 페이지는 예시입니다. 파라미터, 요청/응답 형식 및 동작은 실제 통합이 확정되면 변경될 수 있습니다.
{% /callout %}

## 엔드포인트

```
POST /register
```

## 요청 본문

| 필드 | 타입 | 필수 | 설명 |
|-------|------|----------|-------------|
| `genesisAddress` | `string` | 예 | The genesis account public key |
| `launchPage` | `string` | 예 | URL where users can participate in the launch |
| `website` | `string` | 아니요 | Project website URL |
| `socials.x` | `string` | 아니요 | X (Twitter) profile URL |
| `socials.telegram` | `string` | 아니요 | Telegram group URL |
| `socials.discord` | `string` | 아니요 | Discord server invite URL |

## 요청 예시

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

## 응답

```json
{
  "data": {
    "success": true,
    "genesisAddress": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
  }
}
```

## 요청 및 응답 타입

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

## 사용 예시

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

## 오류

| 코드 | 설명 |
|------|-------------|
| `400` | 잘못된 요청 본문 또는 필수 필드 누락 |
| `409` | 해당 Genesis 주소로 이미 등록된 런칭이 존재함 |
| `429` | 요청 속도 제한 초과 |
| `500` | 내부 서버 오류 |

{% callout type="note" %}
`genesisAddress`는 온체인에 존재하는 유효하고 확정된 Genesis 계정이어야 합니다. 계정이 존재하지 않으면 등록에 실패합니다.
{% /callout %}
