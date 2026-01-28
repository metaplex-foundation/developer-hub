---
title: Fetching Assets
metaTitle: Fetching Assets | Metaplex Core
description: Learn how to fetch Core NFT Assets and Collections on Solana. Retrieve single assets, query by owner or collection, and use the DAS API for fast indexed queries.
---

This guide shows how to **fetch Core Assets and Collections** from the Solana blockchain using the Metaplex Core SDK. Retrieve individual Assets, query by owner or collection, or use DAS for indexed queries. {% .lead %}

{% callout title="What You'll Learn" %}

- Fetch a single Asset or Collection by address
- Query Assets by owner, collection, or update authority
- Use DAS (Digital Asset Standard) API for fast indexed queries
- Understand GPA vs DAS performance trade-offs

{% /callout %}

## Summary

Fetch Core Assets and Collections using SDK helper functions or the DAS API. Choose the right method based on your use case:

- **Single Asset/Collection**: Use `fetchAsset()` or `fetchCollection()` with the public key
- **Multiple Assets**: Use `fetchAssetsByOwner()`, `fetchAssetsByCollection()`, or `fetchAssetsByUpdateAuthority()`
- **DAS API**: Use indexed queries for faster performance (requires DAS-enabled RPC)

## Out of Scope

Token Metadata fetching (use mpl-token-metadata), compressed NFT fetching (use Bubblegum DAS extensions), and off-chain metadata fetching (fetch the URI directly).

## Quick Start

**Jump to:** [Single Asset](#fetch-a-single-asset-or-collection) · [By Owner](#fetch-assets-by-owner) · [By Collection](#fetch-assets-by-collection) · [DAS API](#das---digital-asset-standard-api)

1. Install: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. Configure Umi with your RPC endpoint
3. Call `fetchAsset(umi, publicKey)` with the Asset address
4. Access Asset properties: `name`, `uri`, `owner`, `plugins`

## Prerequisites

- **Umi** configured with an RPC connection
- **Asset/Collection address** (public key) to fetch
- **DAS-enabled RPC** for indexed queries (optional but recommended)

## Fetch a Single Asset or Collection

To fetch a single Asset the following function can be used:

{% code-tabs-imported from="core/fetch-asset" frameworks="umi" /%}

{% seperator h="6" /%}

{% dialect-switcher title="Fetch a Core Collection" %}
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

## Fetch Multiple Assets

Multiple Assets can either be fetched using a `getProgramAccounts` (GPA) call, which can be quite expensive and slow RPC wise, or using the `Digital Asset Standard` API, which is faster but requires [specific RPC providers](/rpc-providers).

### Fetch Assets By Owner

{% dialect-switcher title="fetch Assets by Owner" %}

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

### Fetch Assets by Collection

{% dialect-switcher title="Fetch Assets by Collection" %}

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

### Fetch Assets by Update Authority

To fetch a single Asset the following function can be used:

{% dialect-switcher title="Fetch a single asset" %}
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

If you use a DAS enabled RPC you'll be able to take advantage of indexed Assets for lighting fast fetches and data retrieval.

DAS will index everything from metadata, off chain metadata, collection data, plugins (including Attributes), and more. To learn more about the Metaplex DAS API you can [click here](/dev-tools/das-api). In addition to the general DAS SDK an [extension for MPL Core](/dev-tools/das-api/core-extension) has been created that directly returns you the correct types to further use with the MPL Core SDKs. It also automatically derives the plugins in assets inherited from the collection and provides functions for DAS-to-Core type conversions.

Below is an example of returned data from fetching a MPL Core Asset with DAS.

### FetchAsset Example

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

## Common Errors

### `Asset not found`

The public key doesn't point to a valid Core Asset. Verify:
- The address is correct and on the expected network (devnet vs mainnet)
- The account exists and is a Core Asset (not Token Metadata)

### `RPC rate limit exceeded`

GPA queries can be expensive. Solutions:
- Use a DAS-enabled RPC for indexed queries
- Add pagination to limit results
- Cache results where appropriate

## Notes

- `fetchAsset` returns the full Asset including derived plugins from the Collection
- Set `skipDerivePlugins: true` to fetch only Asset-level plugins (faster)
- GPA queries (`fetchAssetsByOwner`, etc.) can be slow on mainnet - prefer DAS
- DAS returns off-chain metadata; SDK fetch functions return on-chain data only

## Quick Reference

### Fetch Functions

| Function | Use Case |
|----------|----------|
| `fetchAsset(umi, publicKey)` | Single Asset by address |
| `fetchCollection(umi, publicKey)` | Single Collection by address |
| `fetchAssetsByOwner(umi, owner)` | All Assets owned by a wallet |
| `fetchAssetsByCollection(umi, collection)` | All Assets in a Collection |
| `fetchAssetsByUpdateAuthority(umi, authority)` | All Assets by update authority |

### DAS vs GPA Comparison

| Feature | GPA (getProgramAccounts) | DAS API |
|---------|--------------------------|---------|
| Speed | Slow (scans all accounts) | Fast (indexed) |
| RPC Load | High | Low |
| Off-chain Metadata | No | Yes |
| Requires Special RPC | No | Yes |

## FAQ

### Should I use GPA or DAS for fetching multiple Assets?

Use DAS whenever possible. GPA queries scan all program accounts and can be slow and expensive on mainnet. DAS provides indexed queries that are faster and include off-chain metadata. See [DAS RPC providers](/rpc-providers) for compatible endpoints.

### How do I fetch an Asset's off-chain metadata?

The `uri` field contains the metadata URL. Fetch it separately:

```ts
const asset = await fetchAsset(umi, assetAddress)
const metadata = await fetch(asset.uri).then(res => res.json())
```

### Can I fetch Assets across multiple Collections?

Not in a single query. Fetch each Collection's Assets separately and combine the results, or use DAS with custom filters.

### Why is `skipDerivePlugins` useful?

By default, `fetchAsset` derives Collection-level plugins onto the Asset. Setting `skipDerivePlugins: true` skips this step, returning only Asset-level plugins. Use this when you only need the Asset's own plugins or want faster fetches.

### How do I paginate large result sets?

GPA functions don't support built-in pagination. For large collections, use DAS which supports `page` and `limit` parameters, or implement client-side pagination.

## Glossary

| Term | Definition |
|------|------------|
| **GPA** | getProgramAccounts - Solana RPC method to query all accounts owned by a program |
| **DAS** | Digital Asset Standard - Indexed API for fast asset queries |
| **Derived Plugin** | A plugin inherited from the Collection onto an Asset |
| **skipDerivePlugins** | Option to skip Collection plugin derivation during fetch |
| **Off-chain Metadata** | JSON data stored at the Asset's URI (name, image, attributes) |
| **On-chain Data** | Data stored directly in the Solana account (owner, plugins, URI) |

---

*Maintained by Metaplex Foundation · Last verified January 2026 · Applies to @metaplex-foundation/mpl-core*
