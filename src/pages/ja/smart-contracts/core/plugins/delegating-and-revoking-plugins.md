---
title: Pluginの委任と取り消し
metaTitle: Plugin権限の委任と取り消し | Metaplex Core
description: Core AssetでPlugin権限を委任および取り消しする方法を学びます。Pluginを制御する人を変更し、Pluginデータを永続的に不変にします。
---

このガイドでは、Core Assetで**Plugin権限を委任および取り消し**する方法を説明します。Pluginの制御を他のアドレスに移行したり、Pluginデータを永続的に不変にしたりします。 {% .lead %}

{% callout title="学習内容" %}

- 別のアドレスにPlugin権限を委任
- 委任された権限を取り消し
- 異なるPluginタイプの取り消し動作を理解
- Pluginデータを不変にする

{% /callout %}

## 概要

`approvePluginAuthority()`を使用してPlugin権限を委任し、`revokePluginAuthority()`で取り消します。異なるPluginタイプには異なる取り消し動作があります。

- **所有者管理**：`Owner`権限に戻る
- **権限管理**：`UpdateAuthority`に戻る
- 権限を`None`に設定するとPluginが不変になる
- 所有者管理PluginはAsset転送時に自動取り消し

## 対象外

Pluginの削除（[Pluginの削除](/ja/smart-contracts/core/plugins/removing-plugins)を参照）、Pluginの追加（[Pluginの追加](/ja/smart-contracts/core/plugins/adding-plugins)を参照）、永続Plugin権限の変更は対象外です。

## クイックスタート

**ジャンプ：** [権限の委任](#権限の委任) · [権限の取り消し](#権限の取り消し) · [不変にする](#pluginデータを不変にする)

1. 新しい権限アドレスで`approvePluginAuthority()`を呼び出す
2. 取り消す場合：`revokePluginAuthority()`を呼び出す
3. 不変にする場合：権限を`None`に設定

## 権限の委任

Pluginは委任権限命令の更新で他のアドレスに委任できます。委任されたPluginは、メインの権限者以外のアドレスにも、そのPlugin機能の制御を許可します。

{% dialect-switcher title="Plugin権限の委任" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { approvePluginAuthority } from '@metaplex-foundation/mpl-core'

const assetAddress = publicKey('11111111111111111111111111111111')
const delegate = publicKey('33333333333333333333333333333')

await approvePluginAuthority(umi, {
  asset: assetAddress,
  plugin: { type: 'Attributes' },
  newAuthority: { type: 'Address', address: delegate },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::ApprovePluginAuthorityV1Builder,
    types::{PluginAuthority, PluginType},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn delegate_plugin_authority() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let delegate_authority = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let delegate_plugin_authority_ix = ApprovePluginAuthorityV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .new_authority(PluginAuthority::Address {
            address: delegate_authority,
        })
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let delegate_plugin_authority_tx = Transaction::new_signed_with_payer(
        &[delegate_plugin_authority_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&delegate_plugin_authority_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## 権限の取り消し

Pluginの権限を取り消した際の動作は、取り消されるPluginの種類によって異なります。

- **所有者管理Plugin：** `所有者管理Plugin`でアドレスを取り消した場合、Pluginは`Owner`権限タイプにデフォルトで戻ります。

- **権限管理Plugin：** `権限管理Plugin`でアドレスを取り消した場合、Pluginは`UpdateAuthority`権限タイプにデフォルトで戻ります。

### 誰がPluginを取り消せるか？

#### 所有者管理Plugin

- 所有者管理Pluginは所有者が取り消すことができ、委任者を取り消してpluginAuthority タイプを`Owner`に設定します。
- Pluginの委任された権限は自分自身を取り消すことができ、その後Plugin権限タイプが`Owner`に設定されます。
- 転送時、所有者管理Pluginの委任された権限は自動的に`Owner Authority`タイプに戻されます。

#### 権限管理Plugin

- Assetの更新権限は委任者を取り消すことができ、pluginAuthorityタイプを`UpdateAuthority`に設定します。
- Pluginの委任された権限は自分自身を取り消すことができ、その後Plugin権限タイプが`UpdateAuthority`に設定されます。

Pluginとそのタイプのリストは[Plugin概要](/ja/smart-contracts/core/plugins)ページで確認できます。

{% dialect-switcher title="Plugin権限の取り消し" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { revokePluginAuthority } from '@metaplex-foundation/mpl-core'

await revokePluginAuthority(umi, {
  asset: asset.publicKey,
  plugin: { type: 'Attributes' },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{instructions::RevokePluginAuthorityV1Builder, types::PluginType};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn revoke_plugin_authority() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let revoke_plugin_authority_ix = RevokePluginAuthorityV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let revoke_plugin_authority_tx = Transaction::new_signed_with_payer(
        &[revoke_plugin_authority_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&revoke_plugin_authority_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

### Asset転送時の委任リセット

すべての所有者管理Pluginは、Assetの転送時に委任された権限が取り消され、`Owner`の権限タイプに戻ります。

これには以下が含まれます：

- Freeze Delegate
- Transfer Delegate
- Burn Delegate

## Pluginデータを不変にする

Pluginの権限を`None`値に更新すると、Pluginのデータは実質的に不変になります。

{% callout type="warning" %}

**警告** - これを行うとPluginデータは不変になります。注意して進めてください！

{% /callout %}

{% dialect-switcher title="Pluginを不変にする" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  approvePluginAuthority
} from '@metaplex-foundation/mpl-core'

await approvePluginAuthority(umi, {
  asset: asset.publicKey,
  plugin: { type: 'FreezeDelegate' },
  newAuthority: { type: 'None' },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::ApprovePluginAuthorityV1Builder,
    types::{PluginAuthority, PluginType},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn make_plugin_data_immutable() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let make_plugin_data_immutable_ix = ApprovePluginAuthorityV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .new_authority(PluginAuthority::None)
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let make_plugin_data_immutable_tx = Transaction::new_signed_with_payer(
        &[make_plugin_data_immutable_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&make_plugin_data_immutable_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## 一般的なエラー

### `Authority mismatch`

このPluginを委任または取り消しする権限がありません。現在の権限のみが委任でき、所有者/権限のみが取り消しできます。

### `Plugin not found`

Asset/CollectionにはこのPluginタイプがアタッチされていません。

### `Cannot revoke None authority`

`None`権限のPluginは不変です。取り消す権限がありません。

## 注意事項

- 委任は制御を移行しますが、元の権限の取り消し能力は削除されない
- 権限を`None`に設定することは永続的で不可逆
- 所有者管理PluginはAssetが新しい所有者に転送されると自動取り消し
- 取り消しは権限をデフォルトタイプ（OwnerまたはUpdateAuthority）に戻す

## クイックリファレンス

### Pluginタイプ別の取り消し動作

| Pluginタイプ | 戻り先 |
|-------------|------------|
| 所有者管理 | `Owner`権限 |
| 権限管理 | `UpdateAuthority` |

### 誰が委任/取り消しできるか

| アクション | 所有者管理 | 権限管理 |
|--------|---------------|-------------------|
| 委任 | 所有者 | 更新権限 |
| 取り消し | 所有者または委任者 | 更新権限または委任者 |

## FAQ

### 取り消しとPluginの削除の違いは何ですか？

取り消しはPluginを制御する人を変更するだけで、Pluginとそのデータは残ります。削除はPluginを完全に削除します。

### 複数のアドレスに委任できますか？

いいえ。各Pluginは一度に1つの権限しか持てません。新しいアドレスに委任すると、前の権限が置き換えられます。

### Assetを転送すると委任されたPluginはどうなりますか？

所有者管理Pluginは自動的に`Owner`権限に戻ります。権限管理Pluginは変更されません。

### 権限をNoneに設定した後で元に戻せますか？

いいえ。権限を`None`に設定するとPluginは永久に不変になります。これは元に戻せません。

### 委任者は自分自身を取り消せますか？

はい。委任された権限は自分のアクセスを取り消すことができ、その後制御はデフォルトの権限タイプに戻ります。

## 関連操作

- [Pluginの追加](/ja/smart-contracts/core/plugins/adding-plugins) - Asset/CollectionにPluginを追加
- [Pluginの削除](/ja/smart-contracts/core/plugins/removing-plugins) - Pluginを完全に削除
- [Pluginの更新](/ja/smart-contracts/core/plugins/update-plugins) - Pluginデータの変更
- [Plugin概要](/ja/smart-contracts/core/plugins) - 利用可能なPluginの完全なリスト

## 用語集

| 用語 | 定義 |
|------|------------|
| **委任者** | Pluginの一時的な制御を与えられたアドレス |
| **取り消し** | 委任された権限を削除し、デフォルトに戻す |
| **None権限** | Pluginを不変にする特別な権限タイプ |
| **自動取り消し** | 転送時の所有者管理Pluginの自動取り消し |
| **Plugin権限** | Pluginを制御する現在のアドレス |

---

*Metaplex Foundationによって管理 · 最終確認2026年1月 · @metaplex-foundation/mpl-coreに適用*
