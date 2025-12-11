---
title: プラグインの追加
metaTitle: プラグインの追加 | Core
description: MPL Core NFTアセットとコレクションにプラグインを追加する方法を学びます。
---

プラグインは、MPL Core AssetとMPL Core Collectionの両方に割り当てることができます。MPL Core AssetとMPL Core Collectionは、利用可能なプラグインの似たようなリストを共有しています。それぞれでどのプラグインを使用できるかを知るには、[プラグイン概要](/ja/core/plugins)エリアを訪問してください。

## Core Assetにプラグインを追加

プラグインは、プラグインに対する権限を割り当てる機能をサポートしています。`initAuthority`引数が提供されると、これは権限を希望するプラグイン権限タイプに設定します。割り当てられない場合、プラグインのデフォルト権限タイプが割り当てられます（次のセクション）。

**Create Plugin ヘルパー**

`createPlugin()`ヘルパーは、`addPlugin()`プロセス中にプラグインを割り当てることができる型付きメソッドを提供します。
プラグインとその引数の完全なリストについては、[プラグイン概要](/ja/core/plugins)ページを参照してください。

### デフォルト権限でプラグインを追加

プラグインの権限を指定せずにアセットまたはコレクションにプラグインを追加すると、権限はそのプラグインのデフォルト権限タイプに設定されます。

- 所有者管理プラグインは、プラグイン権限タイプ`Owner`にデフォルト設定されます。
- 権限管理プラグインは、プラグイン権限タイプ`UpdateAuthority`にデフォルト設定されます。
- 永続プラグインは、プラグイン権限タイプ`UpdateAuthority`にデフォルト設定されます

{% dialect-switcher title="デフォルト権限でプラグインを追加" %}
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

### 割り当てられた権限でプラグインを追加

プラグインの権限を設定するのに役立つ権限ヘルパーがいくつかあります。

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

これは、プラグインの権限を特定のアドレスに設定します。

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

これは、プラグインの権限を`Owner`タイプに設定します。
アセットの現在の所有者がこのプラグインにアクセスできるようになります。

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

これは、プラグインの権限を`UpdateAuthority`タイプに設定します。
アセットの現在の更新権限がこのプラグインにアクセスできるようになります。

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

これは、プラグインの権限を`None`タイプに設定します。
プラグインのデータがある場合、この時点で不変になります。

{% dialect-switcher title="割り当てられた権限でプラグインを追加" %}
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

## コレクションにプラグインを追加

Coreコレクションにプラグインを追加することは、Core Assetに追加することと似ています。作成時および`addCollectionV1`インストラクションを使用してプラグインを追加できます。コレクションは`権限プラグイン`と`永続プラグイン`のみにアクセスできます。

### デフォルト権限でコレクションプラグインを追加

{% dialect-switcher title="デフォルト権限でコレクションプラグインを追加" %}
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

### 割り当てられた権限でコレクションプラグインを追加

{% dialect-switcher title="アセットのバーン" %}
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