---
title: Integration APIs
metaTitle: Genesis - Integration APIs | ローンチデータ | Metaplex
description: HTTP RESTエンドポイントとオンチェーンSDKメソッドを通じてGenesisローンチデータにアクセスします。認証不要の公開API。
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - Genesis API
  - integration API
  - launch data
  - token queries
  - on-chain state
about:
  - API integration
  - Data aggregation
  - Launch information
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---

Genesis Integration APIs を使用すると、アグリゲーターやアプリケーションが Genesis トークンローンチのローンチデータをクエリできます。RESTエンドポイントからメタデータにアクセスするか、SDKでリアルタイムのオンチェーン状態を取得できます。 {% .lead %}

## ベース URL

```
https://api.metaplex.com/v1
```

## ネットワーク選択

デフォルトでは、API は Solana メインネットからデータを返します。代わりに devnet のローンチをクエリするには、`network` クエリパラメータを追加します：

```
?network=solana-devnet
```

**例：**

```bash
# メインネット（デフォルト）
curl https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN

# Devnet
curl "https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN?network=solana-devnet"
```

## 認証

認証は不要です。API はレート制限付きで公開されています。

## 利用可能なエンドポイント

| メソッド | エンドポイント | 説明 |
|--------|----------|-------------|
| `GET` | [`/launches/{genesis_pubkey}`](/smart-contracts/genesis/integration-apis/get-launch) | Genesis アドレスによるローンチデータの取得 |
| `GET` | [`/tokens/{mint}`](/smart-contracts/genesis/integration-apis/get-launches-by-token) | トークンミントの全ローンチの取得 |
| `GET` | [`/listings`](/smart-contracts/genesis/integration-apis/get-listings) | アクティブおよび今後のローンチリスティングの取得 |
| `GET` | [`/spotlight`](/smart-contracts/genesis/integration-apis/get-spotlight) | 注目スポットライトローンチの取得 |
| `POST` | [`/register`](/smart-contracts/genesis/integration-apis/register) | メタデータ付きで新しいローンチを登録 |
| `CHAIN` | [`fetchBucketState`](/smart-contracts/genesis/integration-apis/fetch-bucket-state) | オンチェーンからバケット状態を取得 |
| `CHAIN` | [`fetchDepositState`](/smart-contracts/genesis/integration-apis/fetch-deposit-state) | オンチェーンからデポジット状態を取得 |

## エラーコード

| コード | 説明 |
| --- | --- |
| `400` | 不正なリクエスト - 無効なパラメータ |
| `404` | ローンチまたはトークンが見つかりません |
| `429` | レート制限超過 |
| `500` | 内部サーバーエラー |

エラーレスポンス形式：

```json
{
  "error": {
    "message": "Launch not found"
  }
}
```

## 共通型

### TypeScript

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
  x?: string;
  telegram?: string;
  discord?: string;
}

interface ErrorResponse {
  error: {
    message: string;
  };
}
```

### Rust

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
    pub x: Option<String>,
    pub telegram: Option<String>,
    pub discord: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiError {
    pub message: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ErrorResponse {
    pub error: ApiError,
}
```

{% callout type="note" %}
`Cargo.toml` に以下の依存関係を追加してください：
```toml
[dependencies]
reqwest = { version = "0.11", features = ["json"] }
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
```
{% /callout %}
