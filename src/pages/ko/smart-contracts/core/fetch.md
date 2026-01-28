---
title: Asset 가져오기
metaTitle: Asset 가져오기 | Metaplex Core
description: Solana에서 Core NFT Asset과 Collection을 가져오는 방법을 알아보세요. 단일 Asset 검색, 소유자나 Collection별 쿼리, 빠른 인덱스 쿼리를 위한 DAS API 사용법.
---

이 가이드에서는 Metaplex Core SDK를 사용하여 Solana 블록체인에서 **Core Asset과 Collection**을 가져오는 방법을 설명합니다. 개별 Asset 검색, 소유자나 Collection별 쿼리, 또는 DAS를 사용한 인덱스 쿼리를 수행합니다. {% .lead %}

{% callout title="학습 내용" %}

- 주소로 단일 Asset 또는 Collection 가져오기
- 소유자, Collection, 업데이트 권한별로 Asset 쿼리
- 빠른 인덱스 쿼리를 위해 DAS (Digital Asset Standard) API 사용
- GPA vs DAS 성능 트레이드오프 이해

{% /callout %}

## 요약

SDK 헬퍼 함수 또는 DAS API를 사용하여 Core Asset과 Collection을 가져옵니다. 사용 사례에 따라 적절한 방법을 선택하세요:

- **단일 Asset/Collection**: public key로 `fetchAsset()` 또는 `fetchCollection()` 사용
- **여러 Asset**: `fetchAssetsByOwner()`, `fetchAssetsByCollection()`, 또는 `fetchAssetsByUpdateAuthority()` 사용
- **DAS API**: 더 빠른 성능을 위해 인덱스 쿼리 사용 (DAS 지원 RPC 필요)

## 범위 외

Token Metadata 가져오기 (mpl-token-metadata 사용), 압축 NFT 가져오기 (Bubblegum DAS 확장 사용), 오프체인 메타데이터 가져오기 (URI 직접 가져오기).

## 빠른 시작

**이동:** [단일 Asset](#단일-asset-또는-collection-가져오기) · [소유자별](#소유자별-asset-가져오기) · [Collection별](#collection별-asset-가져오기) · [DAS API](#das---digital-asset-standard-api)

1. 설치: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. RPC 엔드포인트로 Umi 구성
3. Asset 주소로 `fetchAsset(umi, publicKey)` 호출
4. Asset 속성에 액세스: `name`, `uri`, `owner`, `plugins`

## 전제 조건

- **Umi** - RPC 연결이 구성됨
- **Asset/Collection 주소** - 가져올 public key
- **DAS 지원 RPC** - 인덱스 쿼리용 (선택 사항이지만 권장)

## 단일 Asset 또는 Collection 가져오기

단일 Asset을 가져오려면 다음 함수를 사용할 수 있습니다:

{% code-tabs-imported from="core/fetch-asset" frameworks="umi" /%}

{% seperator h="6" /%}

{% dialect-switcher title="Core Collection 가져오기" %}
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

## 여러 Asset 가져오기

여러 Asset은 RPC 측면에서 상당히 비싸고 느릴 수 있는 `getProgramAccounts` (GPA) 호출을 사용하거나, 더 빠르지만 [특정 RPC 제공업체](/ko/rpc-providers)가 필요한 `Digital Asset Standard` API를 사용하여 가져올 수 있습니다.

### 소유자별 Asset 가져오기

{% dialect-switcher title="소유자별 Asset 가져오기" %}

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

### Collection별 Asset 가져오기

{% dialect-switcher title="Collection별 Asset 가져오기" %}

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

### 업데이트 권한별 Asset 가져오기

단일 Asset을 가져오려면 다음 함수를 사용할 수 있습니다:

{% dialect-switcher title="단일 Asset 가져오기" %}
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

DAS 지원 RPC를 사용하면 인덱스된 Asset을 활용하여 매우 빠른 가져오기와 데이터 검색이 가능합니다.

DAS는 메타데이터, 오프체인 메타데이터, Collection 데이터, 플러그인(Attributes 포함) 등 모든 것을 인덱스합니다. Metaplex DAS API에 대해 자세히 알아보려면 [여기를 클릭](/ko/dev-tools/das-api)하세요. 일반 DAS SDK 외에도 MPL Core SDK에서 직접 사용할 수 있는 올바른 타입을 반환하는 [MPL Core용 확장](/ko/dev-tools/das-api/core-extension)이 만들어졌습니다. 또한 Collection에서 상속된 Asset의 플러그인을 자동으로 도출하고 DAS-to-Core 타입 변환을 위한 함수를 제공합니다.

다음은 DAS로 MPL Core Asset을 가져온 반환 데이터의 예시입니다.

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

## 일반적인 오류

### `Asset not found`

public key가 유효한 Core Asset을 가리키지 않습니다. 확인하세요:
- 주소가 정확하고 예상하는 네트워크(devnet vs mainnet)에 있는지
- 계정이 존재하고 Core Asset인지 (Token Metadata가 아님)

### `RPC rate limit exceeded`

GPA 쿼리는 비쌀 수 있습니다. 해결책:
- 인덱스 쿼리를 위해 DAS 지원 RPC 사용
- 결과를 제한하기 위해 페이지네이션 추가
- 적절한 곳에서 결과 캐시

## 참고 사항

- `fetchAsset`은 Collection에서 도출된 플러그인을 포함한 전체 Asset을 반환합니다
- Asset 레벨 플러그인만 가져오려면 `skipDerivePlugins: true` 설정 (더 빠름)
- GPA 쿼리(`fetchAssetsByOwner` 등)는 mainnet에서 느릴 수 있음 - DAS 권장
- DAS는 오프체인 메타데이터를 반환; SDK 가져오기 함수는 온체인 데이터만 반환

## 빠른 참조

### 가져오기 함수

| 함수 | 사용 사례 |
|----------|----------|
| `fetchAsset(umi, publicKey)` | 주소로 단일 Asset |
| `fetchCollection(umi, publicKey)` | 주소로 단일 Collection |
| `fetchAssetsByOwner(umi, owner)` | 지갑이 소유한 모든 Asset |
| `fetchAssetsByCollection(umi, collection)` | Collection 내 모든 Asset |
| `fetchAssetsByUpdateAuthority(umi, authority)` | 업데이트 권한별 모든 Asset |

### DAS vs GPA 비교

| 기능 | GPA (getProgramAccounts) | DAS API |
|---------|--------------------------|---------|
| 속도 | 느림 (모든 계정 스캔) | 빠름 (인덱스) |
| RPC 부하 | 높음 | 낮음 |
| 오프체인 메타데이터 | 없음 | 있음 |
| 특별한 RPC 필요 | 없음 | 있음 |

## FAQ

### 여러 Asset을 가져올 때 GPA와 DAS 중 어떤 것을 사용해야 하나요?

가능하면 DAS를 사용하세요. GPA 쿼리는 모든 프로그램 계정을 스캔하며 mainnet에서 느리고 비쌀 수 있습니다. DAS는 더 빠른 인덱스 쿼리를 제공하고 오프체인 메타데이터도 포함합니다. 호환되는 엔드포인트는 [DAS RPC 제공업체](/ko/rpc-providers)를 참조하세요.

### Asset의 오프체인 메타데이터를 가져오려면 어떻게 하나요?

`uri` 필드에 메타데이터 URL이 포함되어 있습니다. 별도로 가져오세요:

```ts
const asset = await fetchAsset(umi, assetAddress)
const metadata = await fetch(asset.uri).then(res => res.json())
```

### 여러 Collection에 걸쳐 Asset을 가져올 수 있나요?

단일 쿼리로는 불가능합니다. 각 Collection의 Asset을 별도로 가져와 결과를 결합하거나, 사용자 정의 필터가 있는 DAS를 사용하세요.

### `skipDerivePlugins`는 무엇에 유용한가요?

기본적으로 `fetchAsset`은 Collection 레벨 플러그인을 Asset에 도출합니다. `skipDerivePlugins: true`를 설정하면 이 단계를 건너뛰고 Asset 레벨 플러그인만 반환합니다. Asset의 자체 플러그인만 필요하거나 더 빠른 가져오기가 필요할 때 사용하세요.

### 큰 결과 집합을 페이지네이션하려면 어떻게 하나요?

GPA 함수는 내장 페이지네이션을 지원하지 않습니다. 대규모 Collection의 경우 `page`와 `limit` 매개변수를 지원하는 DAS를 사용하거나 클라이언트 측 페이지네이션을 구현하세요.

## 용어집

| 용어 | 정의 |
|------|------------|
| **GPA** | getProgramAccounts - 프로그램이 소유한 모든 계정을 쿼리하는 Solana RPC 메서드 |
| **DAS** | Digital Asset Standard - 빠른 Asset 쿼리를 위한 인덱스 API |
| **도출된 플러그인** | Collection에서 Asset으로 상속된 플러그인 |
| **skipDerivePlugins** | 가져오기 시 Collection 플러그인 도출을 건너뛰는 옵션 |
| **오프체인 메타데이터** | Asset의 URI에 저장된 JSON 데이터 (이름, 이미지, 속성) |
| **온체인 데이터** | Solana 계정에 직접 저장된 데이터 (소유자, 플러그인, URI) |

---

*Metaplex Foundation에서 관리 · 마지막 확인 2026년 1월 · @metaplex-foundation/mpl-core에 적용*
