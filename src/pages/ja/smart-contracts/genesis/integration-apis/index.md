---
title: Integration APIs
metaTitle: Genesis - Integration APIs | ローンチデータ | Metaplex
description: HTTP REST エンドポイントとオンチェーン SDK メソッドを通じて Genesis ローンチデータにアクセスします。認証不要のパブリック API です。
created: '01-15-2025'
updated: '02-19-2026'
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

Genesis Integration APIs により、アグリゲーターやアプリケーションが Genesis トークンローンチのデータをクエリできます。REST エンドポイントを通じてメタデータにアクセスしたり、SDK でリアルタイムのオンチェーン状態を取得したりできます。 {% .lead %}

## ベース URL

```
https://api.metaplex.com/v1
```

## ネットワーク選択

デフォルトでは、API は Solana メインネットのデータを返します。devnet のローンチをクエリするには、`network` クエリパラメータを追加します：

```
?network=solana-devnet
```

**例：**

```bash
# Mainnet (default)
curl https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN

# Devnet
curl "https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN?network=solana-devnet"
```

## 認証

認証は不要です。API はレート制限付きで公開されています。

## 利用可能なエンドポイント

| メソッド | エンドポイント | 説明 |
|--------|----------|-------------|
| `GET` | [`/launches/{genesis_pubkey}`](/smart-contracts/genesis/integration-apis/get-launch) | Genesis アドレスでローンチデータを取得 |
| `GET` | [`/tokens/{mint}`](/smart-contracts/genesis/integration-apis/get-launches-by-token) | トークンミントに対する全ローンチを取得 |
| `GET` | [`/listings`](/smart-contracts/genesis/integration-apis/get-listings) | アクティブおよび今後のローンチリスティングを取得 |
| `GET` | [`/spotlight`](/smart-contracts/genesis/integration-apis/get-spotlight) | 注目のスポットライトローンチを取得 |
| `POST` | [`/launches/create`](/smart-contracts/genesis/integration-apis/create-launch) | 新しいローンチのオンチェーントランザクションを構築 |
| `POST` | [`/launches/register`](/smart-contracts/genesis/integration-apis/register) | 確認済みローンチをリスティング用に登録 |
| `CHAIN` | [`fetchBucketState`](/smart-contracts/genesis/integration-apis/fetch-bucket-state) | オンチェーンからバケット状態を取得 |
| `CHAIN` | [`fetchDepositState`](/smart-contracts/genesis/integration-apis/fetch-deposit-state) | オンチェーンからデポジット状態を取得 |

{% callout type="note" %}
`POST` エンドポイント（`/launches/create` と `/launches/register`）は新しいトークンローンチを作成するために組み合わせて使用します。ほとんどのユースケースでは、[SDK API クライアント](/smart-contracts/genesis/sdk/api-client)が両方のエンドポイントをラップしたシンプルなインターフェースを提供します。
{% /callout %}

## エラーコード

| コード | 説明 |
| --- | --- |
| `400` | 不正なリクエスト - 無効なパラメータ |
| `404` | ローンチまたはトークンが見つからない |
| `429` | レート制限超過 |
| `500` | 内部サーバーエラー |

エラーレスポンスの形式：

```json
{
  "error": {
    "message": "Launch not found"
  }
}
```

## 共有型

### TypeScript

```ts
interface Launch {
  launchPage: string;
  type: string;
  genesisAddress: string;
  status: 'upcoming' | 'live' | 'graduated';
  startTime: string;
  endTime: string;
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
    pub status: String,
    pub start_time: String,
    pub end_time: String,
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
reqwest = { version = "0.12", features = ["json"] }
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
```
{% /callout %}
