---
title: Assetの取得
metaTitle: Assetの取得 | Metaplex Core
description: Solana上でCore NFT AssetとCollectionを取得する方法を学びます。単一Assetの取得、所有者やCollectionでのクエリ、高速インデックスクエリ用のDAS APIの使用方法。
---

このガイドでは、Metaplex Core SDKを使用してSolanaブロックチェーンから**Core AssetとCollection**を取得する方法を説明します。個々のAssetの取得、所有者やCollectionでのクエリ、またはDASを使用したインデックスクエリを行います。 {% .lead %}

{% callout title="学習内容" %}

- アドレスで単一のAssetまたはCollectionを取得
- 所有者、Collection、更新権限でAssetをクエリ
- 高速インデックスクエリにDAS（Digital Asset Standard）APIを使用
- GPAとDASのパフォーマンストレードオフを理解

{% /callout %}

## 概要

SDKヘルパー関数またはDAS APIを使用してCore AssetとCollectionを取得します。ユースケースに応じて適切な方法を選択してください：

- **単一のAsset/Collection**: public keyで`fetchAsset()`または`fetchCollection()`を使用
- **複数のAsset**: `fetchAssetsByOwner()`、`fetchAssetsByCollection()`、または`fetchAssetsByUpdateAuthority()`を使用
- **DAS API**: より高速なパフォーマンスのためにインデックスクエリを使用（DAS対応RPCが必要）

## 対象外

Token Metadataの取得（mpl-token-metadataを使用）、圧縮NFTの取得（Bubblegum DAS拡張を使用）、オフチェーンメタデータの取得（URIを直接取得）。

## クイックスタート

**移動先：** [単一Asset](#単一assetまたはcollectionの取得) · [所有者別](#所有者でassetを取得) · [Collection別](#collectionでassetを取得) · [DAS API](#das---digital-asset-standard-api)

1. インストール: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. RPCエンドポイントでUmiを設定
3. Assetアドレスで`fetchAsset(umi, publicKey)`を呼び出す
4. Assetプロパティにアクセス: `name`、`uri`、`owner`、`plugins`

## 前提条件

- **Umi** - RPC接続が設定済み
- **Asset/Collectionアドレス** - 取得するpublic key
- **DAS対応RPC** - インデックスクエリ用（オプションだが推奨）

## 単一AssetまたはCollectionの取得

単一Assetを取得するには、以下の関数を使用できます：

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

## 複数Assetの取得

複数のAssetは、`getProgramAccounts`（GPA）コールを使用して取得できますが、これはRPC的に非常に高価で遅い場合があります。または、`Digital Asset Standard` APIを使用することもでき、これはより高速ですが[特定のRPCプロバイダー](/ja/rpc-providers)が必要です。

### 所有者でAssetを取得

{% dialect-switcher title="所有者でAssetを取得" %}

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

### CollectionでAssetを取得

{% dialect-switcher title="CollectionでAssetを取得" %}

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

### 更新権限でAssetを取得

単一Assetを取得するには、以下の関数を使用できます：

{% dialect-switcher title="単一Assetの取得" %}
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

DAS対応RPCを使用すると、インデックス化されたAssetを活用して超高速の取得とデータ検索が可能になります。

DASは、メタデータ、オフチェーンメタデータ、Collectionデータ、プラグイン（Attributesを含む）など、すべてをインデックス化します。Metaplex DAS APIについて詳しく知りたい場合は、[こちらをクリック](/ja/dev-tools/das-api)してください。一般的なDAS SDKに加えて、MPL Core SDKでさらに使用できる正しい型を直接返す[MPL Core用拡張機能](/ja/dev-tools/das-api/core-extension)が作成されました。また、Collectionから継承されたAssetのプラグインを自動的に派生させ、DAS-to-Core型変換のための関数を提供します。

以下は、DASでMPL Core Assetを取得した際の返されるデータの例です。

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

public keyが有効なCore Assetを指していません。以下を確認してください：
- アドレスが正しく、期待するネットワーク（devnet vs mainnet）にある
- アカウントが存在し、Core Asset（Token Metadataではない）である

### `RPC rate limit exceeded`

GPAクエリは高価になる可能性があります。解決策：
- インデックスクエリ用にDAS対応RPCを使用
- 結果を制限するためにページネーションを追加
- 適切な場所で結果をキャッシュ

## 注意事項

- `fetchAsset`はCollectionからの派生プラグインを含む完全なAssetを返します
- Asset レベルのプラグインのみを取得するには`skipDerivePlugins: true`を設定（高速）
- GPAクエリ（`fetchAssetsByOwner`など）はmainnetで遅くなる可能性があります - DASを推奨
- DASはオフチェーンメタデータを返します；SDK取得関数はオンチェーンデータのみを返します

## クイックリファレンス

### 取得関数

| 関数 | ユースケース |
|----------|----------|
| `fetchAsset(umi, publicKey)` | アドレスで単一Asset |
| `fetchCollection(umi, publicKey)` | アドレスで単一Collection |
| `fetchAssetsByOwner(umi, owner)` | ウォレットが所有するすべてのAsset |
| `fetchAssetsByCollection(umi, collection)` | Collection内のすべてのAsset |
| `fetchAssetsByUpdateAuthority(umi, authority)` | 更新権限別のすべてのAsset |

### DAS vs GPA比較

| 機能 | GPA (getProgramAccounts) | DAS API |
|---------|--------------------------|---------|
| 速度 | 遅い（全アカウントをスキャン） | 高速（インデックス化） |
| RPC負荷 | 高い | 低い |
| オフチェーンメタデータ | なし | あり |
| 特別なRPCが必要 | なし | あり |

## FAQ

### 複数のAssetを取得する場合、GPAとDASのどちらを使用すべきですか？

可能な限りDASを使用してください。GPAクエリはすべてのプログラムアカウントをスキャンし、mainnetでは遅く高価になる可能性があります。DASはより高速なインデックスクエリを提供し、オフチェーンメタデータも含みます。互換性のあるエンドポイントについては[DAS RPCプロバイダー](/ja/rpc-providers)を参照してください。

### Assetのオフチェーンメタデータを取得するにはどうすればよいですか？

`uri`フィールドにメタデータURLが含まれています。別途取得してください：

```ts
const asset = await fetchAsset(umi, assetAddress)
const metadata = await fetch(asset.uri).then(res => res.json())
```

### 複数のCollection間でAssetを取得できますか？

単一のクエリではできません。各CollectionのAssetを別々に取得して結果を結合するか、カスタムフィルター付きのDASを使用してください。

### `skipDerivePlugins`は何に役立ちますか？

デフォルトでは、`fetchAsset`はCollectionレベルのプラグインをAssetに派生させます。`skipDerivePlugins: true`を設定するとこのステップをスキップし、Assetレベルのプラグインのみを返します。Assetの独自のプラグインのみが必要な場合や、より高速な取得が必要な場合に使用してください。

### 大きな結果セットをページネーションするにはどうすればよいですか？

GPA関数には組み込みのページネーションがサポートされていません。大規模なCollectionの場合、`page`と`limit`パラメータをサポートするDASを使用するか、クライアント側のページネーションを実装してください。

## 用語集

| 用語 | 定義 |
|------|------------|
| **GPA** | getProgramAccounts - プログラムが所有するすべてのアカウントをクエリするSolana RPCメソッド |
| **DAS** | Digital Asset Standard - 高速Assetクエリ用のインデックスAPI |
| **派生プラグイン** | CollectionからAssetに継承されたプラグイン |
| **skipDerivePlugins** | 取得時にCollectionプラグインの派生をスキップするオプション |
| **オフチェーンメタデータ** | AssetのURIに保存されたJSONデータ（名前、画像、属性） |
| **オンチェーンデータ** | Solanaアカウントに直接保存されたデータ（所有者、プラグイン、URI） |

---

*Metaplex Foundationによって管理 · 最終確認日 2026年1月 · @metaplex-foundation/mpl-coreに適用*
