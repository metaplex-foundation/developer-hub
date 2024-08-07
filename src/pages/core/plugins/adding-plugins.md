---
title: Adding Plugins
metaTitle: Core - Adding Plugins
description: Learn how to add plugins to MPL Core Assets and Collections
---

Plugins can be assigned to both the MPL Core Asset and also the MPL Core Collection. MPL
Core Asset and MPL Core Collection both share a similar list of available plugins. To find out which plugins can be used on each visit the [Plugins Overview](/core/plugins) area.

## Adding a Plugin to a Core Asset

Plugins support the ability to assign an authority over the plugin. If an `initAuthority` argument is supplied this will set the authority to the desired plugin authority type. If left unassigned the plugins default authority type will be assigned (next section).

**Create Plugin Helper**

The `createPlugin()` helper gives you a typed method that allows you to assign plugins during the `addPlugin()` process.
For a full list of plugins and their arguments see the [plugins overview](/core/plugins) page.

### Adding a Plugin with the default authority

If you add a plugin to an Asset or Collection without specifying the authority of the plugin the authority will be set to that plugins default authority type.

- Owner Managed Plugins will default to the plugin authority type of `Owner`.
- Authority Managed Plugins will default to the plugin authority type of `UpdateAuthority`.
- Permanent Plugins will default to the plugin authority type of `UpdateAuthority`

{% dialect-switcher title="Adding a Plugin with the default authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin } from '@metaplex-foundation/mpl-core'

const assetId = publicKey('11111111111111111111111111111111')

await addPlugin(umi, {
  asset: assetId,
  plugin: {
    type: 'Attributes',
    attributeList: [{ key: 'key', value: 'value' }],
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{FreezeDelegate, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let add_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let add_plugin_tx = Transaction::new_signed_with_payer(
        &[add_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&add_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

### Adding a Plugin with an assigned authority

There are a few authority helpers to aid you in setting the authorities of plugins.

**Address**

```js
await addPlugin(umi, {
    ...
    plugin: {
      ...
      authority: {
        type: 'Address',
        address: publicKey('22222222222222222222222222222222'),
      },
    },
  }).sendAndConfirm(umi);
```

This sets the plugin's authority to a specific address.

**Owner**

```js
await addPlugin(umi, {
    ...
    plugin: {
      ...
      authority: {
        type: 'Owner'
      },
    },
  }).sendAndConfirm(umi);
```

This sets the plugin's authority to the type of `Owner`.
The current owner of the Asset will have access to this plugin.

**UpdateAuthority**

```js
await addPlugin(umi, {
    ...
    plugin: {
      ...
      authority: {
        type: "UpdateAuthority",
      },
    },
  }).sendAndConfirm(umi);
```

This sets the plugin's authority to the type of `UpdateAuthority`.
The current update authority of the Asset will have access to this plugin.

**None**

```js
await addPlugin(umi, {
    ...
    plugin: {
      ...
      authority: {
        type: "None",
      },
    },
  }).sendAndConfirm(umi);
```

This sets the plugin's authority to the type of `None`.
The plugin's data if it has any becomes immutable at this point.

{% dialect-switcher title="Adding a Plugin with an assigned authority" %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{FreezeDelegate, Plugin, PluginAuthority},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_plugin_with_authority() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let plugin_authority = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let add_plugin_with_authority_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
        .init_authority(PluginAuthority::Address {
            address: plugin_authority,
        })
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let add_plugin_with_authority_tx = Transaction::new_signed_with_payer(
        &[add_plugin_with_authority_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&add_plugin_with_authority_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}

{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  addPlugin,
} from '@metaplex-foundation/mpl-core'

const asset = publicKey("11111111111111111111111111111111")
const delegate = publicKey('222222222222222222222222222222')

await addPlugin(umi, {
    asset: asset.publicKey,
    plugin: {
      type: 'Attributes',
      attributeList: [{ key: 'key', value: 'value' }],
      authority: {
        type: 'Address',
        address: delegate,
      },
    },
  }).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

## Adding a Plugin to a Collection

Adding a Plugin to a Core Collection is similar to that of adding to a Core Asset. You can add plugins during creation and also using the `addCollectionV1` instruction. Collections only have access to `Authority Plugins` and `Permanent Plugins`.

### Adding a Collection Plugin with the default authority

{% dialect-switcher title="Adding a Collection Plugin with the default authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addCollectionPlugin, ruleSet } from '@metaplex-foundation/mpl-core'

const collection = publicKey('11111111111111111111111111111111')

const creator = publicKey('22222222222222222222222222222222')

await addCollectionPlugin(umi, {
  collection: collection,
  plugin: {
    type: 'Royalties',
    data: {
      basisPoints: 5000,
      creators: [
        {
          address: creator,
          percentage: 100,
        },
      ],
      ruleSet: ruleSet('None'),
    },
  },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::AddCollectionPluginV1Builder,
    types::{FreezeDelegate, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_plugin_to_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let add_plugin_to_collection_ix = AddCollectionPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let add_plugin_to_collection_tx = Transaction::new_signed_with_payer(
        &[add_plugin_to_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&add_plugin_to_collection_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

### Adding a Collection Plugin with an assigned authority

{% dialect-switcher title="Burning an Assets" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  addCollectionPlugin,
  ruleSet,
} from '@metaplex-foundation/mpl-core'

const collection = publicKey('11111111111111111111111111111111')
const delegate = publicKey('22222222222222222222222222222222')

await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'Attributes',
    attributeList: [{ key: 'key', value: 'value' }],
    authority: {
      type: 'Address',
      address: delegate,
    },
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::AddCollectionPluginV1Builder,
    types::{FreezeDelegate, Plugin, PluginAuthority},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_plugin_to_collection_with_authority() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let plugin_authority = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let add_plugin_to_collection_with_authority_ix = AddCollectionPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
        .init_authority(PluginAuthority::Address {
            address: plugin_authority,
        })
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let add_plugin_to_collection_with_authority_tx = Transaction::new_signed_with_payer(
        &[add_plugin_to_collection_with_authority_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&add_plugin_to_collection_with_authority_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}
