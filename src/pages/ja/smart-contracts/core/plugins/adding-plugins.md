---
title: Pluginの追加
metaTitle: Core AssetへのPluginの追加 | Metaplex Core
description: Core NFT AssetとCollectionにPluginを追加する方法を学びます。Plugin権限を設定し、作成時または作成後にPluginデータを構成します。
---

このガイドでは、Core AssetとCollectionに**Pluginを追加する**方法を説明します。Pluginはロイヤリティ、フリーズ、属性、委任権限などの機能を追加します。 {% .lead %}

{% callout title="学習内容" %}

- 既存のAssetとCollectionにPluginを追加
- デフォルトとカスタムのPlugin権限を設定
- 追加時にPluginデータを構成
- 権限タイプの違いを理解

{% /callout %}

## 概要

`addPlugin()`を使用してAssetに、`addCollectionPlugin()`を使用してCollectionにPluginを追加します。各Pluginにはデフォルトの権限タイプがありますが、オーバーライドできます。

- **所有者管理**Pluginはデフォルトで`Owner`権限
- **権限管理**Pluginはデフォルトで`UpdateAuthority`
- **永続**Pluginは作成時にのみ追加可能
- カスタム権限は`authority`パラメータで設定可能

## 対象外

永続Plugin（作成時に追加が必要）、Pluginの削除（[Pluginの削除](/ja/smart-contracts/core/plugins/removing-plugins)を参照）、Pluginの更新（[Pluginの更新](/ja/smart-contracts/core/plugins/update-plugins)を参照）は対象外です。

## クイックスタート

**ジャンプ：** [Assetに追加](#core-assetにpluginを追加) · [Collectionに追加](#collectionにpluginを追加) · [カスタム権限](#割り当てられた権限でpluginを追加)

1. [Plugin概要](/ja/smart-contracts/core/plugins)からPluginを選択
2. AssetアドレスとPlugin設定で`addPlugin()`を呼び出す
3. Pluginは即座に有効化

PluginはMPL Core AssetとMPL Core Collectionの両方に割り当てることができます。MPL Core AssetとMPL Core Collectionは、利用可能なPluginの似たようなリストを共有しています。それぞれでどのPluginを使用できるかを知るには、[Plugin概要](/ja/smart-contracts/core/plugins)エリアを訪問してください。

## Core AssetにPluginを追加

Pluginは、Pluginに対する権限を割り当てる機能をサポートしています。`initAuthority`引数が提供されると、これは権限を希望するPlugin権限タイプに設定します。割り当てられない場合、Pluginのデフォルト権限タイプが割り当てられます（次のセクション）。

**Create Pluginヘルパー**

`createPlugin()`ヘルパーは、`addPlugin()`プロセス中にPluginを割り当てることができる型付きメソッドを提供します。
Pluginとその引数の完全なリストについては、[Plugin概要](/ja/smart-contracts/core/plugins)ページを参照してください。

### デフォルト権限でPluginを追加

Pluginの権限を指定せずにAssetまたはCollectionにPluginを追加すると、権限はそのPluginのデフォルト権限タイプに設定されます。

- 所有者管理Pluginは、Plugin権限タイプ`Owner`にデフォルト設定されます。
- 権限管理Pluginは、Plugin権限タイプ`UpdateAuthority`にデフォルト設定されます。
- 永続Pluginは、Plugin権限タイプ`UpdateAuthority`にデフォルト設定されます

{% dialect-switcher title="デフォルト権限でPluginを追加" %}
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

### 割り当てられた権限でPluginを追加

Pluginの権限を設定するのに役立つ権限ヘルパーがいくつかあります。

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

これは、Pluginの権限を特定のアドレスに設定します。

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

これは、Pluginの権限を`Owner`タイプに設定します。
Assetの現在の所有者がこのPluginにアクセスできるようになります。

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

これは、Pluginの権限を`UpdateAuthority`タイプに設定します。
Assetの現在の更新権限がこのPluginにアクセスできるようになります。

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

これは、Pluginの権限を`None`タイプに設定します。
Pluginのデータがある場合、この時点で不変になります。

{% dialect-switcher title="割り当てられた権限でPluginを追加" %}
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

## CollectionにPluginを追加

Core CollectionにPluginを追加することは、Core Assetに追加することと似ています。作成時および`addCollectionV1`インストラクションを使用してPluginを追加できます。Collectionは`権限Plugin`と`永続Plugin`のみにアクセスできます。

### デフォルト権限でCollection Pluginを追加

{% dialect-switcher title="デフォルト権限でCollection Pluginを追加" %}
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

### 割り当てられた権限でCollection Pluginを追加

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

このPluginを追加する権限がありません。所有者管理Pluginには所有者の署名が必要です。権限管理Pluginには更新権限が必要です。

### `Plugin already exists`

Asset/Collectionには既にこのPluginタイプがあります。代わりに`updatePlugin`を使用して変更してください。

### `Cannot add permanent plugin`

永続Pluginは作成時にのみ追加できます。既存のAsset/Collectionには追加できません。

## 注意事項

- 所有者管理Pluginは追加に**所有者の署名**が必要
- 権限管理Pluginは追加に**更新権限の署名**が必要
- 永続Pluginは**作成時**にのみ追加可能
- Pluginを追加するとアカウントサイズとレントが増加

## クイックリファレンス

### デフォルト権限タイプ

| Pluginタイプ | デフォルト権限 |
|-------------|-------------------|
| 所有者管理 | `Owner` |
| 権限管理 | `UpdateAuthority` |
| 永続 | `UpdateAuthority` |

### 権限オプション

| 権限タイプ | 説明 |
|----------------|-------------|
| `Owner` | 現在のAsset所有者 |
| `UpdateAuthority` | 現在の更新権限 |
| `Address` | 特定の公開鍵 |
| `None` | 不変（誰も更新不可） |

## FAQ

### 1つのトランザクションで複数のPluginを追加できますか？

はい、Asset作成時に可能です。既存のAssetの場合、各`addPlugin`呼び出しは別々のトランザクションです。

### 権限をNoneに設定するとどうなりますか？

Pluginは不変になります。誰も更新や削除ができなくなります。

### 更新権限として所有者管理Pluginを追加できますか？

いいえ。所有者管理Pluginは、誰が署名するかに関係なく、追加には常に所有者の署名が必要です。

### 永続Pluginを追加できないのはなぜですか？

永続PluginはAsset/Collection作成時にのみ追加できます。既存のアカウントには追加できません。

## 関連操作

- [Pluginの削除](/ja/smart-contracts/core/plugins/removing-plugins) - Asset/CollectionからPluginを削除
- [Pluginの委任](/ja/smart-contracts/core/plugins/delegating-and-revoking-plugins) - Plugin権限の変更
- [Pluginの更新](/ja/smart-contracts/core/plugins/update-plugins) - Pluginデータの変更
- [Plugin概要](/ja/smart-contracts/core/plugins) - 利用可能なPluginの完全なリスト

## 用語集

| 用語 | 定義 |
|------|------------|
| **所有者管理** | 追加に所有者の署名が必要なPlugin |
| **権限管理** | 更新権限が追加できるPlugin |
| **永続** | 作成時にのみ追加可能なPlugin |
| **initAuthority** | カスタムPlugin権限を設定するパラメータ |

---

*Metaplex Foundationによって管理 · 最終確認2026年1月 · @metaplex-foundation/mpl-coreに適用*
