---
title: Edition Plugin
metaTitle: Core - Edition Plugin
description: Learn about the MPL Core Edition Plugin
---

The Edition Plugin is a `Authority Managed` plugin that stores an Edition Number within the asset. Together with the soon to be added Master Edition Plugin those Editions could be compared to the [Edition concept in Metaplex Token Metadata](/token-metadata/print).

The Edition Plugin will work in areas such as:

- Prints of the same Asset

We recommend to use Candy Machine to create and sell your editions. It will handle numbering automatically. 

{% callout type="note" title="Intended Useage" %}

We recommend to
- Group the Editions using the Master Edition Plugin 
- use Candy Machine with the Edition Guard to handled numbering automatically.
{% /callout %}

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |

## Arguments

| Arg           | Value                               |
| ------------- | ----------------------------------- |
| number        | number                              |

The number is a specific value that is assigned to the asset. Usually this number is unique, therefore the Creator should make sure that a number is not used twice. 

## Creating an Asset with the editions plugin

The Editions Plugin must be added on creation of the asset. As long as it is mutable the number can be changed.

### Create with a mutable Plugin

{% dialect-switcher title="Adding the Editions Plugin to an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { createV1, pluginAuthorityPair } from '@metaplex-foundation/mpl-core'

const asset = generateSigner(umi)

const result = createV1(umi, {
  asset: asset,
  name: 'My Nft',
  uri: 'https://example.com/my-nft',
  plugins: [
    pluginAuthorityPair({
      type: 'Edition',
      data: { number: 1 },
    }),
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use std::str::FromStr;
use mpl_core::{
    instructions::CreateV1Builder,
    types::{Creator, Plugin, PluginAuthority, PluginAuthorityPair, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn create_asset_with_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();
    let authority = Keypair::new();

    let creator = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::Edition(Edition {
                number: 1,
            })
        }])
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /dialect %}

{% /dialect-switcher %}

### Create with a immutable Plugin

To create the Asset with immutable Edition Plugin the following code can be used:

{% dialect-switcher title="Adding the Editions Plugin to an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}

To have the editions Plugin immutable the authority has to be set to `nonePluginAuthority()` like this:

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { createV1, pluginAuthorityPair } from '@metaplex-foundation/mpl-core'

const asset = generateSigner(umi)

const result = createV1(umi, {
  asset: asset,
  name: 'My Nft',
  uri: 'https://example.com/my-nft',
  plugins: [
    pluginAuthorityPair({
      type: 'Edition',
      data: { number: 1 },
      authority: nonePluginAuthority(),
    }),
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use std::str::FromStr;
use mpl_core::{
    instructions::CreateV1Builder,
    types::{Creator, Plugin, PluginAuthority, PluginAuthorityPair, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn create_asset_with_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();
    let authority = Keypair::new();

    let creator = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::Edition(Edition {
                number: 1,
            }),
            authority: None,
        }])
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /dialect %}

{% /dialect-switcher %}

## Update the Editions Plugin

If the Editions Plugin is mutable it can be updated similar to other Assets:

{% dialect-switcher title="Thaw an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePluginV1, createPlugin } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')

await updatePluginV1(umi, {
  asset: asset,
  plugin: createPlugin({ type: 'Edition', data: { number: 2 } }),
  authority: delegateAuthority
}).sendAndConfirm(umi);
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}
*coming soon*

{% /dialect %}
{% /dialect-switcher %}

