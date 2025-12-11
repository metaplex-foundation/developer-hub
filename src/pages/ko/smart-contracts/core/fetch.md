---
title: Assets 조회하기
metaTitle: Assets 조회하기 | Core
description: Metaplex Core 패키지의 `fetch` 함수를 사용하여 Core NFT Assets과 Collections를 조회하는 방법을 알아보세요.
---

## 단일 Asset 또는 Collection 조회하기

단일 Asset을 조회하려면 다음 함수를 사용할 수 있습니다:

{% dialect-switcher title="단일 asset 조회하기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

console.log(asset)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```ts
use std::str::FromStr;
use mpl_core::Asset;
use solana_client::nonblocking::rpc_client;
use solana_sdk::pubkey::Pubkey;

pub async fn fetch_asset() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let asset_id = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let rpc_data = rpc_client.get_account_data(&asset_id).await.unwrap();

    let asset = Asset::from_bytes(&rpc_data).unwrap();

    print!("{:?}", asset)
}
```

{% /dialect %}
{% /dialect-switcher %}

{% seperator h="6" /%}

{% dialect-switcher title="Core Collection 조회하기" %}
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

## 다중 Assets 조회하기

다중 Assets는 RPC 측면에서 상당히 비싸고 느릴 수 있는 `getProgramAccounts` (GPA) 호출을 사용하거나, 더 빠르지만 [특정 RPC 제공업체](/rpc-providers)가 필요한 `Digital Asset Standard` API를 사용하여 조회할 수 있습니다.

### 소유자별 Assets 조회하기

{% dialect-switcher title="소유자별 Assets 조회하기" %}

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

### Collection별 Assets 조회하기

{% dialect-switcher title="Collection별 Assets 조회하기" %}

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

### 업데이트 권한별 Assets 조회하기

단일 Asset을 조회하려면 다음 함수를 사용할 수 있습니다:

{% dialect-switcher title="단일 asset 조회하기" %}
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

DAS가 활성화된 RPC를 사용하면 색인된 Assets를 활용하여 매우 빠른 조회 및 데이터 검색을 할 수 있습니다.

DAS는 메타데이터, 오프체인 메타데이터, 컬렉션 데이터, 플러그인(Attributes 포함) 등 모든 것을 색인합니다. Metaplex DAS API에 대해 자세히 알아보려면 [여기를 클릭하세요](/das-api). 일반 DAS SDK 외에도 MPL Core SDK와 직접 사용할 수 있는 올바른 타입을 반환하는 [MPL Core용 확장](/das-api/core-extension)이 만들어졌습니다. 또한 컬렉션에서 상속된 자산의 플러그인을 자동으로 도출하고 DAS-to-Core 타입 변환을 위한 함수를 제공합니다.

다음은 DAS로 MPL Core Asset을 조회한 반환 데이터의 예시입니다.

### FetchAsset 예시

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