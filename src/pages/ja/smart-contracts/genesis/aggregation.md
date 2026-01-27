---
title: アグリゲーションAPI
metaTitle: Genesis - アグリゲーションAPI
description: genesisアドレスまたはトークンミントでGenesisローンチデータを照会するパブリックAPI。
---

Genesis APIにより、アグリゲーターやアプリケーションはGenesisトークンローンチからのデータを照会できます。これらのエンドポイントを使用して、アプリケーションにローンチ情報、トークンメタデータ、ソーシャルリンクを表示してください。

{% callout type="note" %}
APIはレート制限付きのパブリックAPIです。認証は不要です。
{% /callout %}

## ベースURL

```
https://api.metaplex.com/v1
```

## ネットワーク選択

デフォルトでは、APIはSolanaメインネットからデータを返します。代わりにdevnetのローンチを照会するには、`network`クエリパラメータを追加します：

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

- **`/launches/{genesis_pubkey}`** - オンチェーンイベントやトランザクションログからのgenesisアドレスがある場合に使用します。
- **`/tokens/{mint}`** - トークンミントアドレスのみを知っている場合に使用します。そのトークンに関連するすべてのローンチを返します（トークンは複数のローンチキャンペーンを持つことができます）。

## エンドポイント

### Genesisアドレスでローンチを取得

```
GET /launches/{genesis_pubkey}
```

**リクエスト例:**

```bash
curl https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN
```

**レスポンス:**

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
      "description": "サンプルエコシステムのためのコミュニティ主導トークン。"
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

トークンのすべてのローンチを返します。`launches`が配列であることを除き、レスポンスは同一です。

**リクエスト例:**

```bash
curl https://api.metaplex.com/v1/tokens/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
```

**レスポンス:**

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
      "description": "サンプルエコシステムのためのコミュニティ主導トークン。"
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
genesis pubkeyを見つけるにはインデックス作成または`getProgramAccounts`が必要です。トークンミントのみの場合は、代わりに`/tokens`エンドポイントを使用してください。
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
| `404` | ローンチまたはトークンが見つからない |
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

**例:**

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

**例:**

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

## オンチェーン状態の取得（JavaScript SDK）

HTTP APIに加えて、Genesis JavaScript SDKを使用してブロックチェーンから直接ローンチ状態を取得できます。これは預金総額や時間条件などのリアルタイムデータを取得するのに便利です。

### バケット状態

```typescript
import { fetchLaunchPoolBucketV2 } from '@metaplex-foundation/genesis';

const bucket = await fetchLaunchPoolBucketV2(umi, launchPoolBucket);

console.log('総預金額:', bucket.quoteTokenDepositTotal);
console.log('預金回数:', bucket.depositCount);
console.log('請求回数:', bucket.claimCount);
console.log('トークン割り当て:', bucket.bucket.baseTokenAllocation);
```

### 時間条件

各バケットにはローンチフェーズを制御する4つの時間条件があります：

```typescript
const bucket = await fetchLaunchPoolBucketV2(umi, launchPoolBucket);

// 預金期間
const depositStart = bucket.depositStartCondition.time;
const depositEnd = bucket.depositEndCondition.time;

// 請求期間
const claimStart = bucket.claimStartCondition.time;
const claimEnd = bucket.claimEndCondition.time;

console.log('預金開始:', new Date(Number(depositStart) * 1000));
console.log('預金終了:', new Date(Number(depositEnd) * 1000));
console.log('請求開始:', new Date(Number(claimStart) * 1000));
console.log('請求終了:', new Date(Number(claimEnd) * 1000));
```

### 預金状態

```typescript
import {
  fetchLaunchPoolDepositV2,
  safeFetchLaunchPoolDepositV2,
} from '@metaplex-foundation/genesis';

// 見つからない場合はエラーをスロー
const deposit = await fetchLaunchPoolDepositV2(umi, depositPda);

// 見つからない場合はnullを返す
const maybeDeposit = await safeFetchLaunchPoolDepositV2(umi, depositPda);

if (deposit) {
  console.log('金額:', deposit.amountQuoteToken);
  console.log('請求済み:', deposit.claimed);
}
```
