---
title: プラグインのデリゲートと取り消し
metaTitle: プラグイン権限のデリゲートと取り消し | Metaplex Core
description: Core Assetsでプラグイン権限をデリゲートおよび取り消す方法を学びます。プラグインを制御する人を変更し、プラグインデータを不変にします。
updated: '01-31-2026'
keywords:
  - delegate plugin
  - revoke plugin
  - plugin authority
  - immutable plugin
about:
  - Authority delegation
  - Plugin revocation
  - Immutability
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 取り消しと削除の違いは何ですか？
    a: 取り消しはプラグインを制御する人のみを変更します。プラグインとそのデータは残ります。削除はプラグインを完全に消去します。
  - q: 複数のアドレスにデリゲートできますか？
    a: いいえ。各プラグインは一度に1つのauthorityのみを持ちます。新しいアドレスにデリゲートすると、以前のauthorityが置き換えられます。
  - q: Assetを転送するとデリゲートされたプラグインはどうなりますか？
    a: Owner Managedプラグインは自動的にOwner authorityに戻ります。Authority Managedプラグインは変更されません。
  - q: authorityをNoneに設定したものを元に戻せますか？
    a: いいえ。authorityをNoneに設定すると、プラグインは永続的に不変になります。これは元に戻せません。
  - q: デリゲートは自分自身を取り消せますか？
    a: はい。デリゲートされたauthorityは自分のアクセスを取り消すことができ、制御はデフォルトのauthorityタイプに戻ります。
---
このガイドでは、Core Assetsで**プラグイン権限をデリゲートおよび取り消す**方法を説明します。プラグインの制御を他のアドレスに移譲したり、プラグインデータを永続的に不変にしたりします。 {% .lead %}
{% callout title="学べること" %}

- プラグイン権限を別のアドレスにデリゲート
- デリゲートされた権限を取り消し
- プラグインタイプによる取り消し動作の違いを理解
- プラグインデータを不変にする
{% /callout %}

## 概要

`approvePluginAuthority()`でプラグイン権限をデリゲートし、`revokePluginAuthority()`で取り消します。プラグインタイプによって取り消し動作が異なります。

- **Owner Managed**: `Owner` authorityに戻る
- **Authority Managed**: `UpdateAuthority`に戻る
- authorityを`None`に設定するとプラグインが不変になる
- Owner ManagedプラグインはAsset転送時に自動取り消し

## 対象外

プラグインの削除（[プラグインの削除](/smart-contracts/core/plugins/removing-plugins)を参照）、プラグインの追加（[プラグインの追加](/smart-contracts/core/plugins/adding-plugins)を参照）、永続的なプラグイン権限変更。

## クイックスタート

**ジャンプ先:** [権限をデリゲート](#権限のデリゲート) · [権限を取り消し](#権限の取り消し) · [不変にする](#プラグインデータを不変にする)

1. 新しいauthorityアドレスで`approvePluginAuthority()`を呼び出す
2. 取り消すには`revokePluginAuthority()`を呼び出す
3. 不変にするにはauthorityを`None`に設定

## 権限のデリゲート

プラグインは、Delegate Authority命令の更新で別のアドレスにデリゲートできます。デリゲートされたプラグインにより、メインのauthority以外のアドレスがそのプラグインの機能を制御できます。
{% dialect-switcher title="プラグイン権限のデリゲート" %}
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

プラグインの権限を取り消すと、取り消されるプラグインタイプによって異なる動作が発生します。

- **Owner Managedプラグイン:** `Owner Managedプラグイン`からアドレスが取り消されると、プラグインはデフォルトで`Owner` authorityタイプに戻ります。
- **Authority Managedプラグイン:** `Authority Managedプラグイン`からアドレスが取り消されると、プラグインはデフォルトで`UpdateAuthority` authorityタイプに戻ります。

### 誰がプラグインを取り消せるか？

#### Owner Managedプラグイン

- Owner Managedプラグインはオーナーによって取り消すことができ、デリゲートを取り消してpluginAuthorityタイプを`Owner`に設定します。
- プラグインのデリゲートされたAuthorityは自分自身を取り消すことができ、その後プラグインauthorityタイプは`Owner`に設定されます。
- 転送時、Owner Managedプラグインのデリゲートされた権限は自動的に取り消され、`Owner Authority`タイプに戻ります。

#### Authority Managedプラグイン

- AssetのUpdate Authorityはデリゲートを取り消すことができ、pluginAuthorityタイプを`UpdateAuthority`に設定します。
- プラグインのデリゲートされたAuthorityは自分自身を取り消すことができ、その後プラグインauthorityタイプは`UpdateAuthority`に設定されます。
プラグインとそのタイプのリストは[プラグイン概要](/smart-contracts/core/plugins)ページで確認できます。
{% dialect-switcher title="プラグイン権限の取り消し" %}
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

### Asset転送時のデリゲートリセット

すべてのOwner ManagedプラグインはAsset転送時にデリゲートされた権限が取り消され、`Owner` authorityタイプに戻ります。
これには以下が含まれます：

- Freeze Delegate
- Transfer Delegate
- Burn Delegate

## プラグインデータを不変にする

プラグインのauthorityを`None`値に更新すると、プラグインのデータが実質的に不変になります。
{% callout type="warning" %}
**警告** - これを行うと、プラグインデータは不変になります。注意して進めてください！
{% /callout %}
{% dialect-switcher title="プラグインを不変にする" %}
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

このプラグインをデリゲートまたは取り消す権限がありません。現在のauthorityのみがデリゲートでき、オーナー/authorityのみが取り消せます。

### `Plugin not found`

Asset/Collectionにこのプラグインタイプがアタッチされていません。

### `Cannot revoke None authority`

`None` authorityのプラグインは不変です。取り消すauthorityがありません。

## 注意事項

- デリゲートは制御を移譲しますが、元のauthorityの取り消し能力は削除されません
- authorityを`None`に設定することは永続的で不可逆です
- Owner ManagedプラグインはAssetが新しいオーナーに転送されると自動取り消しされます
- 取り消しはauthorityをデフォルトタイプ（OwnerまたはUpdateAuthority）に戻します

## クイックリファレンス

### プラグインタイプ別の取り消し動作

| プラグインタイプ | 取り消し先 |
|-------------|------------|
| Owner Managed | `Owner` authority |
| Authority Managed | `UpdateAuthority` |

### 誰がデリゲート/取り消しできるか

| アクション | Owner Managed | Authority Managed |
|--------|---------------|-------------------|
| デリゲート | オーナー | Update Authority |
| 取り消し | オーナーまたはデリゲート | Update Authorityまたはデリゲート |

## FAQ

### 取り消しと削除の違いは何ですか？

取り消しはプラグインを制御する人のみを変更します—プラグインとそのデータは残ります。削除はプラグインを完全に消去します。

### 複数のアドレスにデリゲートできますか？

いいえ。各プラグインは一度に1つのauthorityのみを持ちます。新しいアドレスにデリゲートすると、以前のauthorityが置き換えられます。

### Assetを転送するとデリゲートされたプラグインはどうなりますか？

Owner Managedプラグインは自動的に`Owner` authorityに戻ります。Authority Managedプラグインは変更されません。

### authorityをNoneに設定したものを元に戻せますか？

いいえ。authorityを`None`に設定すると、プラグインは永続的に不変になります。これは元に戻せません。

### デリゲートは自分自身を取り消せますか？

はい。デリゲートされたauthorityは自分のアクセスを取り消すことができ、制御はデフォルトのauthorityタイプに戻ります。

## 関連操作

- [プラグインの追加](/smart-contracts/core/plugins/adding-plugins) - Assets/Collectionsにプラグインを追加
- [プラグインの削除](/smart-contracts/core/plugins/removing-plugins) - プラグインを完全に削除
- [プラグインの更新](/smart-contracts/core/plugins/update-plugins) - プラグインデータを変更
- [プラグイン概要](/smart-contracts/core/plugins) - 利用可能なプラグインの完全なリスト

## 用語集

| 用語 | 定義 |
|------|------------|
| **デリゲート** | プラグインの一時的な制御を与えられたアドレス |
| **取り消し** | デリゲートされた権限を削除し、デフォルトに戻す |
| **None Authority** | プラグインを不変にする特別なauthorityタイプ |
| **自動取り消し** | 転送時のOwner Managedプラグインの自動取り消し |
| **Plugin Authority** | プラグインを制御する現在のアドレス |
