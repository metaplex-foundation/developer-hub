---
title: Metaplex API
metaTitle: Metaplex API - パブリック REST API リファレンス | Metaplex
description: api.metaplex.com のMetaplexパブリック REST API — Genesis ローンチデータ、ローンチ作成、エージェントレジストリ、エージェントウォレットトランザクション。認証不要です。
created: '01-15-2025'
updated: '08-01-2026'
keywords:
  - Metaplex API
  - Genesis API
  - agent registry API
  - launch data
  - token queries
  - REST API
about:
  - API integration
  - Data aggregation
  - Launch information
  - Agent registry
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---

Metaplex API は `api.metaplex.com` のパブリック REST API です。Genesis ローンチデータの提供、ローンチ作成トランザクションの構築に加え、Metaplex Agent Registry — エージェントの閲覧、A2A AgentCard の提供、エージェントウォレットトランザクションの構築 — を公開しています。 {% .lead %}

## Summary

- Genesis アドレスまたはトークンミントでローンチをクエリ、あるいはすべてのアクティブなローンチを閲覧
- 新しい Genesis ローンチの作成と登録
- エージェントレジストリの閲覧・検索、エージェントごとの A2A AgentCard の取得
- エージェントのミント、資金供給、引き出しトランザクションの構築
- `https://api.metaplex.com/v1` のパブリック REST API — 認証不要
- Solana メインネット（デフォルト）およびデブネットを `network` クエリパラメータでサポート
- 機械可読な OpenAPI 3.1 仕様：[JSON](https://api.metaplex.com/v1/openapi.json) / [YAML](https://api.metaplex.com/v1/openapi.yaml)、[RFC 9727 API カタログ](https://api.metaplex.com/.well-known/api-catalog)から発見可能

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

## ローンチエンドポイント

| メソッド | エンドポイント | 説明 |
|--------|----------|-------------|
| `GET` | [`/launches/{genesis_pubkey}`](/api/get-launch) | Genesis アドレスでローンチデータを取得 |
| `GET` | [`/tokens/{mint}`](/api/get-launches-by-token) | トークンミントに対する全ローンチを取得 |
| `GET` | [`/launches`](/api/list-launches) | フィルタ付きでローンチ一覧を取得 |
| `GET` | [`/launches?spotlight=true`](/api/get-spotlight) | 注目のスポットライトローンチを取得 |
| `POST` | [`/launches/create`](/api/create-launch) | 新しいローンチのオンチェーントランザクションを構築 |
| `POST` | [`/launches/register`](/api/register) | 確認済みローンチをリスティング用に登録 |
| `POST` | [`/twitter/verify`](/api/verify-twitter) | ローンチ登録用の Twitter アカウント所有権を検証 |
| `POST` | [`/creator-rewards/claim`](/api/claim-creator-rewards) | クリエイター報酬請求トランザクションを構築 |

{% callout type="note" %}
`POST` エンドポイント（`/launches/create` と `/launches/register`）は新しいトークンローンチを作成するために組み合わせて使用します。ほとんどのユースケースでは、[SDK API クライアント](/smart-contracts/genesis/sdk/api-client)が両方のエンドポイントをラップしたシンプルなインターフェースを提供します。リアルタイムのオンチェーンローンチ状態は、SDK チェーンメソッドの [`fetchBucketState`](/smart-contracts/genesis/integration-apis/fetch-bucket-state) と [`fetchDepositState`](/smart-contracts/genesis/integration-apis/fetch-deposit-state) で直接読み取れます。
{% /callout %}

## エージェントエンドポイント

| メソッド | エンドポイント | 説明 |
|--------|----------|-------------|
| `GET` | [`/agents`](/api/list-agents) | 登録済みエージェントの一覧・検索（ページネーション付き） |
| `GET` | [`/agents/{address}`](/api/get-agent) | 単一エージェントをトークンとメタデータ付きで取得 |
| `GET` | [`/agents/{address}/agent-card.json`](/api/get-agent-card) | ホストされた A2A AgentCard を取得 |
| `POST` | [`/agents/mint`](/api/mint-agent) | エージェントのミント＋登録トランザクションを構築 |
| `POST` | [`/agents/{address}/fund`](/api/fund-agent) | エージェントウォレットへの SOL 送金を構築 |
| `POST` | [`/agents/{address}/withdraw`](/api/withdraw-agent) | エージェントウォレットからの引き出しを構築（オーナーのみ） |

ガイド付きのウォークスルーでエージェントをミントするには、[エージェントのミント](/agents/mint-agent)をご参照ください。

## トランザクション構築エンドポイント

トランザクションを構築する `POST` エンドポイントは、ユーザーの鍵を保持することも、トランザクションを送信することもありません。各エンドポイントは、base64 でシリアライズされた1つ以上のトランザクションと、その構築に使用されたブロックハッシュを返します。アプリケーション側でデシリアライズし、ユーザーのウォレットで署名し、ネットワークに送信してください。

## エラーコード

| コード | 説明 |
| --- | --- |
| `400` | 不正なリクエスト - 無効なパラメータ |
| `403` | 操作の権限がない（例：所有していないエージェントからの引き出し） |
| `404` | ローンチ、トークン、またはエージェントが見つからない |
| `429` | レート制限超過 |
| `500` | 内部サーバーエラー |

## レスポンスエンベロープ

API の進化を反映して、2つのエンベロープ規約が使われています：

**ローンチ読み取りエンドポイント**（`/launches*`、`/tokens/*`、`/creator-rewards/claim`）は結果を `data` で、エラーを `error.message` でラップします：

```json
{ "data": { "…": "…" } }
```

```json
{ "error": { "message": "Launch not found" } }
```

**エージェントエンドポイント、ローンチ書き込みエンドポイント、`/twitter/verify`** は `success` ディスクリミネーターを使用します：

```json
{ "success": true, "…": "…" }
```

```json
{ "success": false, "error": "Agent not found" }
```

例外は [`/agents/{address}/agent-card.json`](/api/get-agent-card) で、A2A クライアントが直接利用できるよう、エンベロープなしの生の AgentCard JSON を返します。正確なレスポンス形式は各エンドポイントページと [OpenAPI 仕様](https://api.metaplex.com/v1/openapi.json)に記載されています。

## 機械可読仕様

API の完全なコントラクトは OpenAPI 3.1 ドキュメントとして公開されており、API のリクエストバリデーターから直接生成されるため、実装と乖離することはありません：

| フォーマット | URL |
|--------|-----|
| JSON（正規版） | `https://api.metaplex.com/v1/openapi.json` |
| YAML | `https://api.metaplex.com/v1/openapi.yaml` |
| 現行バージョンのエイリアス | `https://api.metaplex.com/openapi.json` / `openapi.yaml` |
| RFC 9727 API カタログ | `https://api.metaplex.com/.well-known/api-catalog` |

仕様を Postman、Swagger UI、コードジェネレーター、エージェントフレームワークにインポートすると、すべてのエンドポイントに対する型付きクライアントや呼び出し可能なツールを生成できます。

## Notes

- API にはレート制限があります。`429` レスポンスを受け取った場合は、リクエスト頻度を下げてください。
- すべての日付フィールド（`startTime`、`endTime`、`graduatedAt`、`lastActivityAt`）は ISO 8601 文字列として返されます。
- デフォルトのネットワークは `solana-mainnet` です。デブネットのデータは `?network=solana-devnet` で利用可能です。
- `POST` エンドポイントについては、`/launches/create` と `/launches/register` の両方をラップする [SDK API クライアント](/smart-contracts/genesis/sdk/api-client)の使用を推奨します。

## 共有型

### TypeScript

```ts
interface Launch {
  launchPage: string;
  mechanic: string;
  genesisAddress: string;
  spotlight: boolean;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'live' | 'graduated' | 'ended';
  heroUrl: string | null;
  graduatedAt: string | null;
  lastActivityAt: string;
  type: 'launchpool' | 'presale';
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
    pub mechanic: String,
    pub genesis_address: String,
    pub spotlight: bool,
    pub start_time: String,
    pub end_time: String,
    pub status: String,
    pub hero_url: Option<String>,
    pub graduated_at: Option<String>,
    pub last_activity_at: String,
    #[serde(rename = "type")]
    pub launch_type: String,
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

## Glossary

| 用語 | 定義 |
|------|------------|
| **Genesis Address** | 特定のローンチキャンペーンを一意に識別する PDA（Program Derived Address） |
| **Base Token** | ミントアドレスで識別される、ローンチされるトークン |
| **Launch Page** | ユーザーがローンチに参加できる URL |
| **Mechanic** | ローンチに使用される割り当てメカニズム（例：`launchpoolV2`、`presaleV2`、`auction`） |
| **Launch Type** | ローンチの基盤メカニズム：`launchpool` または `presale` |
| **Spotlight** | プラットフォームが厳選した注目ローンチを示すフラグ |
| **Status** | ローンチの現在の状態：`upcoming`、`live`、`graduated`、`ended` |
| **Socials** | トークンに関連するソーシャルメディアリンク（X/Twitter、Telegram、Discord） |
| **LaunchData** | `launch`、`baseToken`、`website`、`socials` を含むレスポンスラッパー |
| **TokenData** | トークンクエリ用のレスポンスラッパー。`launches` 配列と `baseToken`、`website`、`socials` を含む |
