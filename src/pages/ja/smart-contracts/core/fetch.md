---
title: Assetの取得
metaTitle: Assetの取得 | Metaplex Core
description: SolanaでCore NFT AssetとCollectionを取得する方法を学びましょう。単一のAssetの取得、所有者やCollectionによるクエリ、高速なインデックスクエリのためのDAS APIの使用方法を説明します。
updated: '01-31-2026'
keywords:
  - fetch NFT
  - query NFT
  - DAS API
  - get NFT by owner
  - mpl-core fetch
about:
  - NFT queries
  - DAS API
  - Asset retrieval
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
howToSteps:
  - Install SDK with npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi
  - Configure Umi with your RPC endpoint
  - Call fetchAsset(umi, publicKey) with the Asset address
  - Access Asset properties like name, uri, owner, plugins
howToTools:
  - Node.js
  - Umi framework
  - mpl-core SDK
  - DAS-enabled RPC (optional)
faqs:
  - q: 複数のAssetを取得する場合、GPAとDASのどちらを使うべきですか？
    a: 可能な限りDASを使用してください。GPAクエリはすべてのプログラムアカウントをスキャンするため、メインネットでは遅くコストがかかる可能性があります。DASはより高速でオフチェーンメタデータも含むインデックスクエリを提供します。
  - q: Assetのオフチェーンメタデータはどうやって取得しますか？
    a: uriフィールドにメタデータURLが含まれています。Assetを取得した後、標準的なHTTPリクエストで別途取得してください。
  - q: 複数のCollectionにまたがってAssetを取得できますか？
    a: 単一のクエリでは不可能です。各CollectionのAssetを別々に取得して結果を組み合わせるか、DASでカスタムフィルターを使用してください。
  - q: skipDerivePluginsはなぜ便利ですか？
    a: デフォルトでは、fetchAssetはCollectionレベルのプラグインをAssetに継承します。skipDerivePluginsをtrueに設定するとこのステップをスキップし、Assetレベルのプラグインのみを返すため、より高速に取得できます。
  - q: 大きな結果セットをページネーションするにはどうすればよいですか？
    a: GPA関数は組み込みのページネーションをサポートしていません。大規模なコレクションの場合は、pageとlimitパラメータをサポートするDASを使用するか、クライアントサイドのページネーションを実装してください。
---
このガイドでは、Metaplex Core SDKを使用してSolanaブロックチェーンから**Core AssetとCollectionを取得**する方法を説明します。個々のAssetを取得したり、所有者やCollectionでクエリしたり、インデックスクエリにDASを使用できます。 {% .lead %}
{% callout title="学習内容" %}

- アドレスで単一のAssetまたはCollectionを取得
- 所有者、Collection、またはUpdate AuthorityでAssetをクエリ
- DAS（Digital Asset Standard）APIで高速なインデックスクエリを使用
- GPAとDASのパフォーマンスのトレードオフを理解
{% /callout %}

## 概要

SDKヘルパー関数またはDAS APIを使用してCore AssetとCollectionを取得します。ユースケースに基づいて適切な方法を選択してください：

- **単一のAsset/Collection**: 公開鍵で`fetchAsset()`または`fetchCollection()`を使用
- **複数のAsset**: `fetchAssetsByOwner()`、`fetchAssetsByCollection()`、または`fetchAssetsByUpdateAuthority()`を使用
- **DAS API**: より高速なパフォーマンスのためにインデックスクエリを使用（DAS対応RPCが必要）

## スコープ外

Token Metadataの取得（mpl-token-metadataを使用）、圧縮NFTの取得（Bubblegum DAS拡張を使用）、オフチェーンメタデータの取得（URIを直接フェッチ）。

## クイックスタート

**ジャンプ先:** [単一Asset](#単一のassetまたはcollectionの取得) · [所有者別](#所有者別assetの取得) · [Collection別](#collection別assetの取得) · [DAS API](#das---digital-asset-standard-api)

1. インストール: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. RPCエンドポイントでUmiを設定
3. Assetアドレスで`fetchAsset(umi, publicKey)`を呼び出す
4. Assetプロパティにアクセス: `name`、`uri`、`owner`、`plugins`

## 前提条件

- RPC接続が設定された**Umi**
- 取得する**Asset/Collectionアドレス**（公開鍵）
- インデックスクエリ用の**DAS対応RPC**（オプションだが推奨）

## 単一のAssetまたはCollectionの取得

単一のAssetを取得するには、以下の関数を使用できます：
{% code-tabs-imported from="core/fetch-asset" frameworks="umi" /%}
{% seperator h="6" /%}
{% dialect-switcher title="Core Collectionの取得" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchCollection } from '@metaplex-foundation/mpl-core'
const asset = await fetchCollection(umi, collection.publicKey, {
  skipDerivePlugins: false,
})
console.log(asset)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```ts
use std::str::FromStr;
use mpl_core::Collection;
use solana_client::nonblocking::rpc_client;
use solana_sdk::pubkey::Pubkey;
pub async fn fetch_asset() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let collection_id = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let rpc_data = rpc_client.get_account_data(&collection_id).await.unwrap();
    let collection = Collection::from_bytes(&rpc_data).unwrap();
    print!("{:?}", collection)
}
```

{% /dialect %}
{% /dialect-switcher %}

## 複数のAssetの取得

複数のAssetは、`getProgramAccounts`（GPA）呼び出しを使用して取得できます。これはRPC的にかなり高コストで遅くなる可能性がありますが、`Digital Asset Standard` APIを使用する方法もあります。こちらはより高速ですが、[特定のRPCプロバイダー](/rpc-providers)が必要です。

### 所有者別Assetの取得

{% dialect-switcher title="所有者別Assetの取得" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { fetchAssetsByOwner } from '@metaplex-foundation/mpl-core'
const owner = publicKey('11111111111111111111111111111111')
const assetsByOwner = await fetchAssetsByOwner(umi, owner, {
  skipDerivePlugins: false,
})
console.log(assetsByOwner)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use std::str::FromStr;
use mpl_core::{accounts::BaseAssetV1, types::Key, ID as MPL_CORE_ID};
use solana_client::{
    nonblocking::rpc_client,
    rpc_config::{RpcAccountInfoConfig, RpcProgramAccountsConfig},
    rpc_filter::{Memcmp, MemcmpEncodedBytes, RpcFilterType},
};
use solana_sdk::pubkey::Pubkey;
pub async fn fetch_assets_by_owner() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let owner = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let rpc_data = rpc_client
        .get_program_accounts_with_config(
            &MPL_CORE_ID,
            RpcProgramAccountsConfig {
                filters: Some(vec![
                    RpcFilterType::Memcmp(Memcmp::new(
                        0,
                        MemcmpEncodedBytes::Bytes(vec![Key::AssetV1 as u8]),
                    )),
                    RpcFilterType::Memcmp(Memcmp::new(
                        1,
                        MemcmpEncodedBytes::Base58(owner.to_string()),
                    )),
                ]),
                account_config: RpcAccountInfoConfig {
                    encoding: None,
                    data_slice: None,
                    commitment: None,
                    min_context_slot: None,
                },
                with_context: None,
            },
        )
        .await
        .unwrap();
    let accounts_iter = rpc_data.into_iter().map(|(_, account)| account);
    let mut assets: Vec<BaseAssetV1> = vec![];
    for account in accounts_iter {
        let asset = BaseAssetV1::from_bytes(&account.data).unwrap();
        assets.push(asset);
    }
    print!("{:?}", assets)
}
```

{% /dialect %}
{% /dialect-switcher %}

### Collection別Assetの取得

{% dialect-switcher title="Collection別Assetの取得" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { fetchAssetsByCollection } from '@metaplex-foundation/mpl-core'
const collection = publicKey('11111111111111111111111111111111')
const assetsByCollection = await fetchAssetsByCollection(umi, collection, {
  skipDerivePlugins: false,
})
console.log(assetsByCollection)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```ts
use mpl_core::{accounts::BaseAssetV1, types::Key, ID as MPL_CORE_ID};
use solana_client::{
    nonblocking::rpc_client,
    rpc_config::{RpcAccountInfoConfig, RpcProgramAccountsConfig},
    rpc_filter::{Memcmp, MemcmpEncodedBytes, RpcFilterType},
};
use solana_sdk::pubkey::Pubkey;
use std::str::FromStr;
pub async fn fetch_assets_by_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let rpc_data = rpc_client
        .get_program_accounts_with_config(
            &MPL_CORE_ID,
            RpcProgramAccountsConfig {
                filters: Some(vec![
                    RpcFilterType::Memcmp(Memcmp::new(
                        0,
                        MemcmpEncodedBytes::Bytes(vec![Key::AssetV1 as u8]),
                    )),
                    RpcFilterType::Memcmp(Memcmp::new(
                        34,
                        MemcmpEncodedBytes::Bytes(vec![2 as u8]),
                    )),
                    RpcFilterType::Memcmp(Memcmp::new(
                        35,
                        MemcmpEncodedBytes::Base58(collection.to_string()),
                    )),
                ]),
                account_config: RpcAccountInfoConfig {
                    encoding: None,
                    data_slice: None,
                    commitment: None,
                    min_context_slot: None,
                },
                with_context: None,
            },
        )
        .await
        .unwrap();
    let accounts_iter = rpc_data.into_iter().map(|(_, account)| account);
    let mut assets: Vec<BaseAssetV1> = vec![];
    for account in accounts_iter {
        let asset = BaseAssetV1::from_bytes(&account.data).unwrap();
        assets.push(asset);
    }
    print!("{:?}", assets)
}
```

{% /dialect %}
{% /dialect-switcher %}

### Update Authority別Assetの取得

単一のAssetを取得するには、以下の関数を使用できます：
{% dialect-switcher title="単一のAssetを取得" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { fetchAssetsByUpdateAuthority } from '@metaplex-foundation/mpl-core'
const updateAuthority = publicKey('11111111111111111111111111111111')
const assetsByUpdateAuthority = await fetchAssetsByUpdateAuthority(
  umi,
  updateAuthority,
  { skipDerivePlugins: false }
)
console.log(assetsByUpdateAuthority)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```ts
pub async fn fetch_assets_by_update_authority() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let update_authority = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let rpc_data = rpc_client
        .get_program_accounts_with_config(
            &MPL_CORE_ID,
            RpcProgramAccountsConfig {
                filters: Some(vec![
                    RpcFilterType::Memcmp(Memcmp::new(
                        0,
                        MemcmpEncodedBytes::Bytes(vec![Key::AssetV1 as u8]),
                    )),
                    RpcFilterType::Memcmp(Memcmp::new(
                        34,
                        MemcmpEncodedBytes::Bytes(vec![1 as u8]),
                    )),
                    RpcFilterType::Memcmp(Memcmp::new(
                        35,
                        MemcmpEncodedBytes::Base58(update_authority.to_string()),
                    )),
                ]),
                account_config: RpcAccountInfoConfig {
                    encoding: None,
                    data_slice: None,
                    commitment: None,
                    min_context_slot: None,
                },
                with_context: None,
            },
        )
        .await
        .unwrap();
    let accounts_iter = rpc_data.into_iter().map(|(_, account)| account);
    let mut assets: Vec<BaseAssetV1> = vec![];
    for account in accounts_iter {
        let asset = BaseAssetV1::from_bytes(&account.data).unwrap();
        assets.push(asset);
    }
    print!("{:?}", assets)
}
```

{% /dialect %}
{% /dialect-switcher %}

## DAS - Digital Asset Standard API

DAS対応RPCを使用すると、インデックス化されたAssetを活用して超高速のフェッチとデータ取得が可能になります。
DASはメタデータ、オフチェーンメタデータ、コレクションデータ、プラグイン（Attributesを含む）など、すべてをインデックス化します。Metaplex DAS APIについて詳しくは[こちら](/dev-tools/das-api)をご覧ください。一般的なDAS SDKに加えて、[MPL Core用の拡張機能](/dev-tools/das-api/core-extension)が作成されており、MPL Core SDKでさらに使用できる正しい型を直接返します。また、Collectionから継承されたAssetのプラグインを自動的に継承し、DASからCoreへの型変換関数も提供します。
以下は、DASでMPL Core Assetを取得した際に返されるデータの例です。

### FetchAssetの例

```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "result": {
    "authorities": [
      {
        "address": "Gi47RpRmg3wGsRRzFvcmyXHkELHznpx6DxEELGWBRWoC",
        "scopes": ["full"]
      }
    ],
    "burnt": false,
    "compression": {
      "asset_hash": "",
      "compressed": false,
      "creator_hash": "",
      "data_hash": "",
      "eligible": false,
      "leaf_id": 0,
      "seq": 0,
      "tree": ""
    },
    "content": {
      "$schema": "https://schema.metaplex.com/nft1.0.json",
      "files": [],
      "json_uri": "https://example.com/asset",
      "links": {},
      "metadata": {
        "name": "Test Asset",
        "symbol": ""
      }
    },
    "creators": [],
    "grouping": [
      {
        "group_key": "collection",
        "group_value": "8MPNmg4nyMGKdStSxbo2r2aoQGWz1pdjtYnQEt1kA2V7"
      }
    ],
    "id": "99A5ZcoaRSTGRigMpeu1u4wdgQsv6NgTDs5DR2Ug9TCQ",
    "interface": "MplCore",
    "mutable": true,
    "ownership": {
      "delegate": null,
      "delegated": false,
      "frozen": false,
      "owner": "Gi47RpRmg3wGsRRzFvcmyXHkELHznpx6DxEELGWBRWoC",
      "ownership_model": "single"
    },
    "plugins": {
      "FreezeDelegate": {
        "authority": {
          "Pubkey": {
            "address": "Gi47RpRmg3wGsRRzFvcmyXHkELHznpx6DxEELGWBRWoC"
          }
        },
        "data": {
          "frozen": false
        },
        "index": 0,
        "offset": 119
      }
    },
    "royalty": {
      "basis_points": 0,
      "locked": false,
      "percent": 0,
      "primary_sale_happened": false,
      "royalty_model": "creators",
      "target": null
    },
    "supply": null,
    "unknown_plugins": [
      {
        "authority": {
          "Pubkey": {
            "address": "Gi47RpRmg3wGsRRzFvcmyXHkELHznpx6DxEELGWBRWoC"
          }
        },
        "data": "CQA=",
        "index": 1,
        "offset": 121,
        "type": 9
      }
    ]
  }
}
```

## よくあるエラー

### `Asset not found`

公開鍵が有効なCore Assetを指していません。確認してください：

- アドレスが正しく、期待されるネットワーク（devnet対mainnet）にあること
- アカウントが存在し、Core Asset（Token Metadataではない）であること

### `RPC rate limit exceeded`

GPAクエリはコストがかかる場合があります。解決策：

- インデックスクエリにDAS対応RPCを使用する
- ページネーションを追加して結果を制限する
- 適切な場所で結果をキャッシュする

## 注意事項

- `fetchAsset`はCollectionから継承されたプラグインを含む完全なAssetを返します
- Assetレベルのプラグインのみを取得するには`skipDerivePlugins: true`を設定（より高速）
- GPAクエリ（`fetchAssetsByOwner`など）はメインネットでは遅くなる可能性あり - DASを推奨
- DASはオフチェーンメタデータを返し、SDKフェッチ関数はオンチェーンデータのみを返します

## クイックリファレンス

### フェッチ関数

| 関数 | ユースケース |
|----------|----------|
| `fetchAsset(umi, publicKey)` | アドレスで単一Asset |
| `fetchCollection(umi, publicKey)` | アドレスで単一Collection |
| `fetchAssetsByOwner(umi, owner)` | ウォレットが所有するすべてのAsset |
| `fetchAssetsByCollection(umi, collection)` | Collection内のすべてのAsset |
| `fetchAssetsByUpdateAuthority(umi, authority)` | Update Authority別のすべてのAsset |

### DAS vs GPA比較

| 機能 | GPA (getProgramAccounts) | DAS API |
|---------|--------------------------|---------|
| 速度 | 遅い（全アカウントをスキャン） | 高速（インデックス化） |
| RPC負荷 | 高い | 低い |
| オフチェーンメタデータ | なし | あり |
| 特別なRPCが必要 | いいえ | はい |

## FAQ

### 複数のAssetを取得する場合、GPAとDASのどちらを使うべきですか？

可能な限りDASを使用してください。GPAクエリはすべてのプログラムアカウントをスキャンするため、メインネットでは遅くコストがかかる可能性があります。DASはより高速でオフチェーンメタデータも含むインデックスクエリを提供します。互換性のあるエンドポイントについては[DAS RPCプロバイダー](/rpc-providers)を参照してください。

### Assetのオフチェーンメタデータはどうやって取得しますか？

`uri`フィールドにメタデータURLが含まれています。別途取得してください：

```ts
const asset = await fetchAsset(umi, assetAddress)
const metadata = await fetch(asset.uri).then(res => res.json())
```

### 複数のCollectionにまたがってAssetを取得できますか？

単一のクエリでは不可能です。各CollectionのAssetを別々に取得して結果を組み合わせるか、DASでカスタムフィルターを使用してください。

### `skipDerivePlugins`はなぜ便利ですか？

デフォルトでは、`fetchAsset`はCollectionレベルのプラグインをAssetに継承します。`skipDerivePlugins: true`に設定するとこのステップをスキップし、Assetレベルのプラグインのみを返します。Asset自身のプラグインのみが必要な場合や、より高速なフェッチが必要な場合に使用してください。

### 大きな結果セットをページネーションするにはどうすればよいですか？

GPA関数は組み込みのページネーションをサポートしていません。大規模なコレクションの場合は、`page`と`limit`パラメータをサポートするDASを使用するか、クライアントサイドのページネーションを実装してください。

## 用語集

| 用語 | 定義 |
|------|------------|
| **GPA** | getProgramAccounts - プログラムが所有するすべてのアカウントをクエリするSolana RPCメソッド |
| **DAS** | Digital Asset Standard - 高速なAssetクエリ用のインデックスAPI |
| **継承されたプラグイン** | CollectionからAssetに継承されたプラグイン |
| **skipDerivePlugins** | フェッチ時にCollectionプラグインの継承をスキップするオプション |
| **オフチェーンメタデータ** | AssetのURIに保存されたJSONデータ（名前、画像、属性） |
| **オンチェーンデータ** | Solanaアカウントに直接保存されたデータ（所有者、プラグイン、URI） |
