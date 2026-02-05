---
title: API
metaTitle: Genesis - API | ローンチデータAPI | Metaplex
description: Genesisアドレスまたはトークンミントによるローンチデータ照会用パブリックAPI。認証不要。
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - Genesis API
  - launch data API
  - token metadata API
  - aggregator API
  - REST API
about:
  - API reference
  - Data aggregation
  - Launch queries
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
faqs:
  - q: 認証は必要ですか？
    a: いいえ。Genesis APIはレート制限付きのパブリックAPIです。APIキーや認証は不要です。
  - q: トークンミントしか持っていない場合、どのエンドポイントを使用すべきですか？
    a: /tokens/{mint}を使用してトークンの全ローンチを取得してください。Genesisアドレスがある場合は/launches/{genesis_pubkey}を使用してください。
  - q: レート制限はどのようになっていますか？
    a: 不正利用防止のためレート制限が適用されています。429レスポンスを受け取った場合は、リクエスト頻度を下げてください。
  - q: 1つのトークンに複数のローンチを設定できますか？
    a: はい。/tokensエンドポイントはローンチの配列を返します。トークンは複数のキャンペーンを持つことができるためです。
---

Genesis APIは、アグリゲーターやアプリケーションがGenesisトークンローンチのデータを照会できるAPIです。これらのエンドポイントを使用して、アプリケーションにローンチ情報、トークンメタデータ、ソーシャルリンクを表示できます。 {% .lead %}

{% callout title="学べること" %}
このリファレンスでは以下を解説します：
- 利用可能なエンドポイントとそのユースケース
- リクエスト/レスポンスの形式と例
- TypeScriptおよびRustの型定義
- エラーハンドリング
{% /callout %}

## 概要

Genesis APIはローンチデータへの読み取り専用アクセスを提供します。Genesisアドレスまたはトークンミントで照会できます。

- レート制限付きパブリックAPI（認証不要）
- ローンチ情報、トークンメタデータ、ソーシャルリンクを返却
- TypeScriptおよびRustの型を提供
- 標準的なRESTエラーコード

{% callout type="note" %}
このAPIはレート制限付きのパブリックAPIです。認証は不要です。
{% /callout %}

## ベースURL

```
https://api.metaplex.com/v1
```

## ユースケース

- **`/launches/{genesis_pubkey}`** - オンチェーンイベントやトランザクションログなどからGenesisアドレスを持っている場合に使用します。
- **`/tokens/{mint}`** - トークンミントアドレスのみ分かっている場合に使用します。そのトークンに関連するすべてのローンチを返します（1つのトークンに複数のローンチキャンペーンが存在する場合があります）。

## エンドポイント

### Genesisアドレスでローンチを取得

```
GET /launches/{genesis_pubkey}
```

**リクエスト例：**

```
GET https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN
```

**レスポンス：**

```json
{
  "data": {
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
}
```

### トークンミントでローンチを取得

```
GET /tokens/{mint}
```

トークンのすべてのローンチを返します。レスポンスは`launches`が配列である点を除き同一です。

**レスポンス：**

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

{% callout type="note" %}
Genesis公開鍵の取得にはインデックス化または`getProgramAccounts`が必要です。トークンミントのみお持ちの場合は、代わりに`/tokens`エンドポイントを使用してください。
{% /callout %}

## エラー

```json
{
  "error": {
    "code": 404,
    "message": "Launch not found"
  }
}
```

| コード | 説明 |
| --- | --- |
| `400` | 不正なリクエスト - 無効なパラメータ |
| `404` | ローンチまたはトークンが見つかりません |
| `429` | レート制限超過 |
| `500` | 内部サーバーエラー |

## TypeScript型定義

```ts
interface Launch {
  launchPage: string;
  type: string;
  genesisAddress: string;
}

interface BaseToken {
  address: string;
  name: string;
  symbol: string;
  image: string;
  description: string;
}

interface Socials {
  x: string;
  telegram: string;
  discord: string;
}

interface LaunchResponse {
  data: {
    launch: Launch;
    baseToken: BaseToken;
    website: string;
    socials: Socials;
  };
}

interface TokenResponse {
  data: {
    launches: Launch[];
    baseToken: BaseToken;
    website: string;
    socials: Socials;
  };
}

interface ErrorResponse {
  error: {
    code: number;
    message: string;
  };
}
```

**使用例：**

```ts
const response = await fetch(
  "https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
);
const { data }: LaunchResponse = await response.json();
console.log(data.baseToken.name); // "My Token"
```

## Rust型定義

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Launch {
    pub launch_page: String,
    #[serde(rename = "type")]
    pub launch_type: String,
    pub genesis_address: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BaseToken {
    pub address: String,
    pub name: String,
    pub symbol: String,
    pub image: String,
    pub description: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Socials {
    pub x: String,
    pub telegram: String,
    pub discord: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LaunchData {
    pub launch: Launch,
    pub base_token: BaseToken,
    pub website: String,
    pub socials: Socials,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TokenData {
    pub launches: Vec<Launch>,
    pub base_token: BaseToken,
    pub website: String,
    pub socials: Socials,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LaunchResponse {
    pub data: LaunchData,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TokenResponse {
    pub data: TokenData,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiError {
    pub code: u16,
    pub message: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ErrorResponse {
    pub error: ApiError,
}
```

**使用例：**

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
`Cargo.toml`に以下の依存関係を追加してください：
```toml
[dependencies]
reqwest = { version = "0.11", features = ["json"] }
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
```
{% /callout %}

## FAQ

### 認証は必要ですか？
いいえ。Genesis APIはレート制限付きのパブリックAPIです。APIキーや認証は不要です。

### トークンミントしか持っていない場合、どのエンドポイントを使用すべきですか？
`/tokens/{mint}`を使用してトークンの全ローンチを取得してください。Genesisアドレスがある場合は`/launches/{genesis_pubkey}`を使用してください。

### レート制限はどのようになっていますか？
不正利用防止のためレート制限が適用されています。429レスポンスを受け取った場合は、リクエスト頻度を下げてください。

### 1つのトークンに複数のローンチを設定できますか？
はい。`/tokens`エンドポイントはローンチの配列を返します。トークンは複数のキャンペーンを持つことができるためです（異なる`genesisIndex`値を使用）。

## 用語集

| 用語 | 定義 |
|------|------|
| **Genesisアドレス** | 特定のローンチキャンペーンを識別するPDA |
| **Base Token** | ローンチされるトークン |
| **Launch Page** | ユーザーがローンチに参加できるURL |
| **ローンチタイプ** | 使用されるメカニズム（Launch Pool、Presale、オークション） |
| **Socials** | トークンに関連するソーシャルメディアリンク |

## 次のステップ

- [JavaScript SDK](/smart-contracts/genesis/sdk/javascript) - Genesisへのプログラム的アクセス
- [Aggregation API](/smart-contracts/genesis/aggregation) - 追加のAPI詳細とオンチェーンフェッチ
- [はじめに](/smart-contracts/genesis/getting-started) - 独自のトークンをローンチする
