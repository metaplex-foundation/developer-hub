---
title: Aggregation API
metaTitle: Genesis - Aggregation API | ローンチデータ | Metaplex
description: Genesis アドレスまたはトークンミントによる Genesis ローンチデータのクエリ用パブリック API。オンチェーン状態の取得を含みます。
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - Genesis API
  - aggregation API
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
faqs:
  - q: API とオンチェーン取得の違いは何ですか？
    a: API は集約されたメタデータ（ソーシャル、画像）を返します。SDK によるオンチェーン取得は、デポジット合計や時間条件などのリアルタイム状態を返します。
  - q: リアルタイムのデポジット合計を取得するにはどうすればよいですか？
    a: Genesis SDK の fetchLaunchPoolBucketV2 または fetchPresaleBucketV2 を使用して、現在のオンチェーン状態を読み取ります。
  - q: bucket の時間条件をクエリできますか？
    a: はい。bucket アカウントを取得し、depositStartCondition、depositEndCondition、claimStartCondition、claimEndCondition にアクセスしてください。
  - q: ユーザーがデポジットしたかどうかを確認するにはどうすればよいですか？
    a: deposit PDA を指定して safeFetchLaunchPoolDepositV2 または safeFetchPresaleDepositV2 を使用します。デポジットが存在しない場合は null を返します。
---

Genesis API を使用すると、アグリゲーターやアプリケーションが Genesis トークンローンチのローンチデータをクエリできます。これらのエンドポイントを使用して、アプリケーションにローンチ情報、トークンメタデータ、ソーシャルリンクを表示できます。 {% .lead %}

{% callout title="学習内容" %}
このリファレンスでは以下を解説します：

- ローンチメタデータ用の HTTP API エンドポイント
- JavaScript SDK によるオンチェーン状態の取得
- TypeScript および Rust の型定義
- リアルタイムの bucket およびデポジット状態
{% /callout %}

## 概要

メタデータには HTTP API を、リアルタイムのオンチェーン状態には SDK を使用して Genesis データにアクセスします。

- HTTP API はローンチ情報、トークンメタデータ、ソーシャル情報を返します
- SDK はリアルタイム状態を提供します：デポジット、カウント、時間条件
- HTTP API には認証は不要です
- オンチェーン取得には Umi と Genesis SDK が必要です

{% callout type="note" %}
API はレート制限付きで公開されています。認証は不要です。
{% /callout %}

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

## ユースケース

- **`/launches/{genesis_pubkey}`** - オンチェーンイベントやトランザクションログなどから Genesis アドレスがわかっている場合に使用します。
- **`/tokens/{mint}`** - トークンミントアドレスのみがわかっている場合に使用します。そのトークンに関連するすべてのローンチを返します（1つのトークンに複数のローンチキャンペーンが存在する場合があります）。

## エンドポイント

### Genesis アドレスによるローンチ取得

```
GET /launches/{genesis_pubkey}
```

**リクエスト例：**

```bash
curl https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN
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

### トークンミントによるローンチ取得

```
GET /tokens/{mint}
```

トークンに関連するすべてのローンチを返します。レスポンスは `launches` が配列であること以外は同じです。

**リクエスト例：**

```bash
curl https://api.metaplex.com/v1/tokens/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
```

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
Genesis 公開鍵を見つけるにはインデックス化または `getProgramAccounts` が必要です。トークンミントのみがわかっている場合は、代わりに `/tokens` エンドポイントを使用してください。
{% /callout %}

## エラー

```json
{
  "error": {
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

## 型と例

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
    message: string;
  };
}
```

**例：**

```ts
const response = await fetch(
  "https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
);
const { data }: LaunchResponse = await response.json();
console.log(data.baseToken.name); // "My Token"
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
    pub message: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ErrorResponse {
    pub error: ApiError,
}
```

**例：**

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
`Cargo.toml` に以下の依存関係を追加してください：

```toml
[dependencies]
reqwest = { version = "0.11", features = ["json"] }
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
```

{% /callout %}

## オンチェーン状態の取得（JavaScript SDK）

HTTP API に加えて、Genesis JavaScript SDK を使用してブロックチェーンからローンチ状態を直接取得できます。これはデポジット合計や時間条件などのリアルタイムデータを取得するのに便利です。

### Bucket 状態

```typescript
import { fetchLaunchPoolBucketV2 } from '@metaplex-foundation/genesis';

const bucket = await fetchLaunchPoolBucketV2(umi, launchPoolBucket);

console.log('Total deposits:', bucket.quoteTokenDepositTotal);
console.log('Deposit count:', bucket.depositCount);
console.log('Claim count:', bucket.claimCount);
console.log('Token allocation:', bucket.bucket.baseTokenAllocation);
```

### 時間条件

各 bucket には、ローンチフェーズを制御する4つの時間条件があります：

```typescript
const bucket = await fetchLaunchPoolBucketV2(umi, launchPoolBucket);

// Deposit window
const depositStart = bucket.depositStartCondition.time;
const depositEnd = bucket.depositEndCondition.time;

// Claim window
const claimStart = bucket.claimStartCondition.time;
const claimEnd = bucket.claimEndCondition.time;

console.log('Deposit starts:', new Date(Number(depositStart) * 1000));
console.log('Deposit ends:', new Date(Number(depositEnd) * 1000));
console.log('Claims start:', new Date(Number(claimStart) * 1000));
console.log('Claims end:', new Date(Number(claimEnd) * 1000));
```

### デポジット状態

```typescript
import {
  fetchLaunchPoolDepositV2,
  safeFetchLaunchPoolDepositV2,
} from '@metaplex-foundation/genesis';

// Throws if not found
const deposit = await fetchLaunchPoolDepositV2(umi, depositPda);

// Returns null if not found
const maybeDeposit = await safeFetchLaunchPoolDepositV2(umi, depositPda);

if (deposit) {
  console.log('Amount:', deposit.amountQuoteToken);
  console.log('Claimed:', deposit.claimed);
}
```

## FAQ

### API とオンチェーン取得の違いは何ですか？

API は集約されたメタデータ（ソーシャル、画像）を返します。SDK によるオンチェーン取得は、デポジット合計や時間条件などのリアルタイム状態を返します。

### リアルタイムのデポジット合計を取得するにはどうすればよいですか？

Genesis SDK の `fetchLaunchPoolBucketV2` または `fetchPresaleBucketV2` を使用して、現在のオンチェーン状態を読み取ります。

### Bucket の時間条件をクエリできますか？

はい。bucket アカウントを取得し、`depositStartCondition`、`depositEndCondition`、`claimStartCondition`、`claimEndCondition` にアクセスしてください。

### ユーザーがデポジットしたかどうかを確認するにはどうすればよいですか？

deposit PDA を指定して `safeFetchLaunchPoolDepositV2` または `safeFetchPresaleDepositV2` を使用します。デポジットが存在しない場合は null を返します。

## 用語集

| 用語 | 定義 |
|------|------|
| **Aggregation** | 複数のソースからデータを収集し正規化すること |
| **Bucket 状態** | デポジット合計やカウントを含む現在のオンチェーンデータ |
| **時間条件** | フェーズの開始または終了を制御する Unix タイムスタンプ |
| **Deposit PDA** | ユーザーのデポジットレコードを保存するプログラム派生アドレス |
| **safeFetch** | アカウントが存在しない場合にスローする代わりに null を返す取得バリアント |

## 次のステップ

- [JavaScript SDK](/smart-contracts/genesis/sdk/javascript) - SDK の完全なセットアップと設定
- [API リファレンス](/smart-contracts/genesis/api) - HTTP API エンドポイントの詳細
- [Launch Pool](/smart-contracts/genesis/launch-pool) - 比例配分のセットアップ
