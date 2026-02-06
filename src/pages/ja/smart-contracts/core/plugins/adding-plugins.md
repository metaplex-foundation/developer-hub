---
title: プラグインの追加
metaTitle: Core Assetにプラグインを追加 | Metaplex Core
description: Core NFT AssetとCollectionにプラグインを追加する方法を学びます。プラグインの権限を設定し、作成時または後からプラグインデータを設定します。
updated: '01-31-2026'
keywords:
  - add plugin
  - addPlugin
  - plugin authority
  - configure plugin
about:
  - Adding plugins
  - Plugin configuration
  - Authority management
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 1つのトランザクションで複数のプラグインを追加できますか？
    a: はい、Assetの作成時に可能です。既存のAssetの場合、各addPlugin呼び出しは別々のトランザクションになります。
  - q: 権限をNoneに設定するとどうなりますか？
    a: プラグインは不変になります。誰も更新や削除ができなくなります。
  - q: update authorityとしてOwner Managedプラグインを追加できますか？
    a: いいえ。Owner Managedプラグインは、誰が署名しても常にオーナーの署名が必要です。
  - q: なぜPermanentプラグインを追加できないのですか？
    a: Permanentプラグインは、Asset/Collection作成時にのみ追加できます。既存のアカウントには追加できません。
---
このガイドでは、Core AssetとCollectionに**プラグインを追加**する方法を説明します。プラグインは、ロイヤリティ、凍結、属性、委任権限などの機能を追加します。 {% .lead %}
{% callout title="学べること" %}

- 既存のAssetとCollectionにプラグインを追加
- デフォルトとカスタムのプラグイン権限を設定
- 追加時にプラグインデータを設定
- 権限タイプの違いを理解
{% /callout %}

## 概要

`addPlugin()`を使用してAssetに、または`addCollectionPlugin()`を使用してCollectionにプラグインを追加します。各プラグインにはデフォルトの権限タイプがありますが、上書きすることができます。

- **Owner Managed**プラグインはデフォルトで`Owner`権限
- **Authority Managed**プラグインはデフォルトで`UpdateAuthority`
- **Permanent**プラグインは作成時にのみ追加可能
- `authority`パラメータでカスタム権限を設定可能

## 範囲外

Permanentプラグイン（作成時に追加が必要）、プラグインの削除（[プラグインの削除](/ja/smart-contracts/core/plugins/removing-plugins)を参照）、プラグインの更新（[プラグインの更新](/ja/smart-contracts/core/plugins/update-plugins)を参照）。

## クイックスタート

**ジャンプ：** [Assetに追加](#core-assetにプラグインを追加) · [Collectionに追加](#collectionにプラグインを追加) · [カスタム権限](#権限を指定してプラグインを追加)

1. [プラグイン概要](/ja/smart-contracts/core/plugins)からプラグインを選択
2. Assetアドレスとプラグイン設定で`addPlugin()`を呼び出す
3. トランザクションを送信
4. トランザクション確認後、プラグインがアクティブになる
プラグインはMPL Core AssetとMPL Core Collectionの両方に割り当てることができます。MPL Core AssetとMPL Core Collectionは、利用可能なプラグインの同様のリストを共有しています。各プラグインがどれで使用できるかについては、[プラグイン概要](/ja/smart-contracts/core/plugins)エリアをご覧ください。

## Core Assetにプラグインを追加

プラグインは、プラグインに対する権限を割り当てる機能をサポートしています。`initAuthority`引数が指定された場合、希望するプラグイン権限タイプに権限が設定されます。未指定の場合、プラグインのデフォルト権限タイプが割り当てられます（次のセクション）。
**createPluginヘルパー**
`createPlugin()`ヘルパーは、`addPlugin()`プロセス中にプラグインを割り当てることができる型付きメソッドを提供します。
プラグインとその引数の完全なリストについては、[プラグイン概要](/ja/smart-contracts/core/plugins)ページを参照してください。

### デフォルト権限でプラグインを追加

プラグインの権限を指定せずにAssetまたはCollectionにプラグインを追加すると、権限はそのプラグインのデフォルト権限タイプに設定されます。

- Owner Managedプラグインはデフォルトで`Owner`タイプのプラグイン権限になります。
- Authority Managedプラグインはデフォルトで`UpdateAuthority`タイプのプラグイン権限になります。
- Permanentプラグインはデフォルトで`UpdateAuthority`タイプのプラグイン権限になります。
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

### 権限を指定してプラグインを追加

プラグインの権限を設定するためのいくつかの権限ヘルパーがあります。
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

これにより、プラグインの権限が特定のアドレスに設定されます。
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

これにより、プラグインの権限が`Owner`タイプに設定されます。
Assetの現在のオーナーがこのプラグインにアクセスできます。
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

これにより、プラグインの権限が`UpdateAuthority`タイプに設定されます。
Assetの現在のupdate authorityがこのプラグインにアクセスできます。
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

これにより、プラグインの権限が`None`タイプに設定されます。
プラグインのデータがある場合、この時点で不変になります。
{% dialect-switcher title="権限を指定してプラグインを追加" %}
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

## Collectionにプラグインを追加

Core Collectionにプラグインを追加することは、Core Assetに追加するのと似ています。作成中にプラグインを追加することも、`addCollectionV1`命令を使用して追加することもできます。Collectionは`Authority Plugins`と`Permanent Plugins`にのみアクセスできます。

### デフォルト権限でCollectionプラグインを追加

{% dialect-switcher title="デフォルト権限でCollectionプラグインを追加" %}
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

### 権限を指定してCollectionプラグインを追加

{% dialect-switcher title="Assetのバーン" %}
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

## 一般的なエラー

### `Authority mismatch`

このプラグインを追加する権限がありません。Owner Managedプラグインはオーナーの署名が必要で、Authority Managedプラグインはupdate authorityが必要です。

### `Plugin already exists`

Asset/Collectionには既にこのプラグインタイプがあります。代わりに`updatePlugin`を使用して変更してください。

### `Cannot add permanent plugin`

Permanentプラグインは作成時にのみ追加できます。既存のAsset/Collectionには追加できません。

## 注意事項

- Owner Managedプラグインは追加に**オーナー署名**が必要
- Authority Managedプラグインは**update authority署名**が必要
- Permanentプラグインは**作成時**にのみ追加可能
- プラグインを追加するとアカウントサイズとrentが増加

## クイックリファレンス

### デフォルト権限タイプ

| プラグインタイプ | デフォルト権限 |
|-------------|-------------------|
| Owner Managed | `Owner` |
| Authority Managed | `UpdateAuthority` |
| Permanent | `UpdateAuthority` |

### 権限オプション

| 権限タイプ | 説明 |
|----------------|-------------|
| `Owner` | 現在のAssetオーナー |
| `UpdateAuthority` | 現在のupdate authority |
| `Address` | 特定の公開鍵 |
| `None` | 不変（誰も更新不可） |

## FAQ

### 1つのトランザクションで複数のプラグインを追加できますか？

はい、Assetの作成時に可能です。既存のAssetの場合、各`addPlugin`呼び出しは別々の命令です。複数の命令を1つのトランザクションに組み合わせることができます。

### 権限をNoneに設定するとどうなりますか？

プラグインは不変になります。誰も更新や削除ができなくなります。

### update authorityとしてOwner Managedプラグインを追加できますか？

いいえ。Owner Managedプラグインは、誰が署名しても常にオーナーの署名が必要です。

### なぜPermanentプラグインを追加できないのですか？

Permanentプラグインは、Asset/Collection作成時にのみ追加できます。既存のアカウントには追加できません。

## 関連操作

- [プラグインの削除](/ja/smart-contracts/core/plugins/removing-plugins) - Asset/Collectionからプラグインを削除
- [プラグインの委任](/ja/smart-contracts/core/plugins/delegating-and-revoking-plugins) - プラグイン権限の変更
- [プラグインの更新](/ja/smart-contracts/core/plugins/update-plugins) - プラグインデータの変更
- [プラグイン概要](/ja/smart-contracts/core/plugins) - 利用可能なプラグインの完全なリスト

## 用語集

| 用語 | 定義 |
|------|------------|
| **Owner Managed** | 追加にオーナー署名が必要なプラグイン |
| **Authority Managed** | update authorityが追加できるプラグイン |
| **Permanent** | 作成時にのみ追加可能なプラグイン |
| **initAuthority** | カスタムプラグイン権限を設定するパラメータ |
