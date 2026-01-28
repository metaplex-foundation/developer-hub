---
title: Freeze Delegate
metaTitle: Freeze Delegate Plugin | Metaplex Core
description: Core NFT Assetをフリーズして転送とバーンをブロックする方法を学びます。Freeze Delegateプラグインは、エスクローレスステーキング、マーケットプレースリスティング、ゲームアイテムロックに使用できます。
---

**Freeze Delegate Plugin**は、Core Assetをフリーズして、オーナーのウォレットに残したまま転送とバーンをブロックできます。エスクローレスステーキング、マーケットプレースリスティング、ゲームメカニクスに最適です。 {% .lead %}

{% callout title="学習内容" %}

- AssetにFreeze Delegateプラグインを追加する
- Assetのフリーズと解凍
- freeze権限を別のアドレスに委任する
- ユースケース：ステーキング、リスティング、ゲームロック

{% /callout %}

## 概要

**Freeze Delegate**は、Assetを所定の位置でフリーズする所有者管理プラグインです。フリーズされると、freeze権限によって解凍されるまでAssetを転送またはバーンできません。

- エスクローに転送せずにAssetをフリーズ
- プログラムまたは他のウォレットにfreeze権限を委任
- 転送時に権限が取り消される（非永久バージョンの場合）
- 取り消し不能なフリーズには[Permanent Freeze Delegate](/ja/smart-contracts/core/plugins/permanent-freeze-delegate)を使用

## 対象外

コレクションレベルのフリーズ（Assetレベルのみ使用）、永久フリーズ（Permanent Freeze Delegateを参照）、Token Metadata freeze権限（別システム）。

## クイックスタート

**ジャンプ先:** [プラグイン追加](#assetにfreeze-delegateプラグインを追加) · [権限委任](#freeze権限の委任) · [フリーズ](#assetのフリーズ) · [解凍](#フリーズされたassetの解凍)

1. Freeze Delegateプラグインを追加: `addPlugin(umi, { asset, plugin: { type: 'FreezeDelegate', data: { frozen: true } } })`
2. Assetがフリーズされ、転送できなくなります
3. 準備ができたら解凍: `frozen: false`でプラグインを更新
4. 転送時に権限が取り消されます

{% callout type="note" title="Freeze vs Permanent Freeze Delegateの使い分け" %}

| ユースケース | Freeze Delegate | Permanent Freeze Delegate |
|----------|-----------------|---------------------------|
| マーケットプレースリスティング | ✅ 最適 | ❌ 過剰 |
| エスクローレスステーキング | ✅ 最適 | ✅ 使用可能 |
| ソウルバウンドトークン | ❌ 転送時に取り消し | ✅ 最適 |
| コレクション全体のフリーズ | ❌ Assetのみ | ✅ Collectionをサポート |
| レンタルプロトコル | ✅ 最適 | ✅ 使用可能 |

**Freeze Delegateを選択** - 所有権変更時に権限をリセットすべき場合。
**[Permanent Freeze Delegate](/ja/smart-contracts/core/plugins/permanent-freeze-delegate)を選択** - 権限が永続する必要がある場合。

{% /callout %}

## 一般的なユースケース

- **エスクローレスステーキング**: エスクローに転送せずにステーキング中のNFTをフリーズ
- **マーケットプレースリスティング**: エスクローアカウントなしで販売用NFTをロック
- **ゲームアイテムロック**: ゲームプレイ中にアイテムを一時的にロック
- **レンタルプロトコル**: レンタル中のNFTをロック
- **ガバナンス**: 投票期間中のトークンをロック
- **担保**: 貸付担保として使用されるNFTをロック
- **トーナメント**: 競技参加中のNFTをロック

## 動作対象

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |

コレクションレベルのフリーズには、代わりに[Permanent Freeze Delegate](/ja/smart-contracts/core/plugins/permanent-freeze-delegate)を使用してください。

## 引数

| 引数   | 値    |
| ------ | ----- |
| frozen | bool  |

## 関数

### AssetにFreeze Delegateプラグインを追加

`addPlugin`コマンドは、AssetにFreeze Delegateプラグインを追加します。このプラグインにより、Assetをフリーズして転送とバーンを防ぐことができます。

{% dialect-switcher title="MPL Core AssetにFreezeプラグインを追加" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin } from '@metaplex-foundation/mpl-core'

const assetAddress = publicKey('11111111111111111111111111111111')

await addPlugin(umi, {
  asset: assetAddress,
  plugin: { type: 'FreezeDelegate', data: { frozen: true } },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust CPI" id="rust-cpi" %}
```rust
AddPluginV1CpiBuilder::new(ctx.accounts.mpl_core_program)
    .asset(ctx.accounts.asset)
    .collection(Some(ctx.accounts.collection))
    .authority(Some(ctx.accounts.authority))
    .payer(ctx.accounts.payer)
    .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
    .invoke();
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

pub async fn add_freeze_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let add_freeze_delegate_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::FreezeDelegate(FreezeDelegate {frozen: true}))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let add_freeze_delegate_plugin_ix_tx = Transaction::new_signed_with_payer(
        &[add_freeze_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&add_freeze_delegate_plugin_ix_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

### Freeze権限の委任

`approvePluginAuthority`コマンドは、freeze権限を別のアドレスに委任します。これにより、所有権を維持しながら別のアドレスがAssetをフリーズおよび解凍できるようになります。

{% dialect-switcher title="Freeze権限の委任" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { approvePluginAuthority } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')
const delegateAddress = publicKey('22222222222222222222222222222222')

await approvePluginAuthority(umi, {
  asset: asset.publicKey,
  plugin: { type: 'FreezeDelegate' },
  newAuthority: { type: 'Address', address: delegateAddress },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust CPI" id="rust-cpi" %}
```rust
ApprovePluginAuthorityV1CpiBuilder::new(ctx.accounts.mpl_core_program)
    .asset(ctx.accounts.asset)
    .collection(Some(ctx.accounts.collection))
    .authority(Some(ctx.accounts.authority))
    .payer(ctx.accounts.payer)
    .plugin_type(PluginType::FreezeDelegate)
    .new_authority(PluginAuthority::Address { address: ctx.accounts.new_authority.key() })
    .invoke()?;
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

pub async fn approve_plugin_authority() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let new_authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let collection = Pubkey::from_str("2222222222222222222222222222222").unwrap();

    let approve_plugin_authority_plugin_ix = ApprovePluginAuthorityV1Builder::new()
        .asset(asset)
        // Assetがコレクションの一部である場合、コレクションを渡す必要があります
        .collection(Some(collection))
        .authority(Some(authority.pubkey()))
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .new_authority(PluginAuthority::Address { address: new_authority.pubkey() })
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let update_attributes_plugin_tx = Transaction::new_signed_with_payer(
        &[approve_plugin_authority_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&update_attributes_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res);
}
```

{% /dialect %}
{% /dialect-switcher %}

## Freeze Delegateプラグインの更新

Freeze Delegateプラグインは、Assetのフリーズ状態を変更するために更新できます。これは、以下に示す[Assetのフリーズ](#assetのフリーズ)と[フリーズされたAssetの解凍](#フリーズされたassetの解凍)関数を使用するのと同じです。

### Assetのフリーズ

`freezeAsset`コマンドは、Assetをフリーズして転送またはバーンを防ぎます。エスクローレスステーキングやマーケットプレースリスティングに有用です。

{% dialect-switcher title="MPL Core Assetのフリーズ" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { freezeAsset, fetchAsset } from '@metaplex-foundation/mpl-core'

const assetAddress = publicKey('11111111111111111111111111111111')
const assetAccount = await fetchAsset(umi, assetAddress)

const delegateSigner = generateSigner(umi)

await freezeAsset(umi, {
    asset: assetAccount,
    delegate: delegateSigner.publicKey,
    authority: delegateSigner,
  }).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust CPI" id="rust-cpi" %}
```rust
UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.update_authority.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    // FreezeDelegateプラグインを`frozen: true`に設定
    .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: true }))
    .invoke()?;
```
{% /dialect %}

{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{
    instructions::UpdatePluginV1Builder,
    types::{FreezeDelegate, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn update_freeze_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let collection = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let update_freeze_delegate_plugin_ix = UpdatePluginV1Builder::new()
        .asset(asset)
        // Assetがコレクションの一部である場合、コレクションを渡す
        .collection(Some(collection))
        .payer(authority.pubkey())
        // FreezeDelegateプラグインを`frozen: true`に設定
        .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: true }))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let update_freeze_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[update_freeze_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&update_freeze_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res);
}
```

{% /dialect %}
{% /dialect-switcher %}

### フリーズされたAssetの解凍

`thawAsset`コマンドは、フリーズされたAssetを解凍し、転送およびバーン機能を復元します。

{% dialect-switcher title="MPL Core Assetの解凍" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { thawAsset, fetchAsset } from '@metaplex-foundation/mpl-core'

const assetAddress = publicKey('11111111111111111111111111111111')
const assetAccount = await fetchAsset(umi, assetAddress)

const delegateSigner = generateSigner(umi)

await thawAsset(umi, {
  asset: assetAccount,
  delegate: delegateSigner,
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust CPI" id="rust-cpi" %}
```rust
UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.update_authority.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    // FreezeDelegateプラグインを`frozen: false`に設定
    .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
    .invoke()?;
```
{% /dialect %}

{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{
    instructions::UpdatePluginV1Builder,
    types::{FreezeDelegate, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn thaw_freeze_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let collection = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let thaw_freeze_delegate_plugin_ix = UpdatePluginV1Builder::new()
        .asset(asset)
        // Assetがコレクションの一部である場合、コレクションを渡す
        .collection(Some(collection))
        .payer(authority.pubkey())
        // FreezeDelegateプラグインを`frozen: false`に設定
        .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let thaw_freeze_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[thaw_freeze_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&thaw_freeze_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res);
}
```

{% /dialect %}
{% /dialect-switcher %}

## 一般的なエラー

### `Asset is frozen`

フリーズされたAssetを転送またはバーンしようとしました。freeze権限が先に解凍する必要があります。

### `Authority mismatch`

freeze delegate権限のみがAssetをフリーズ/解凍できます。誰がプラグイン権限を持っているか確認してください。

### `Plugin not found`

AssetにFreeze Delegateプラグインがありません。先に`addPlugin`で追加してください。

## 注意事項

- 所有者管理: 追加には所有者の署名が必要
- Assetが転送されると権限は自動的に取り消されます
- フリーズされたAssetは引き続き更新可能（メタデータ変更は許可）
- 転送後も権限を維持する必要がある場合はPermanent Freeze Delegateを使用
- フリーズは即時 - 確認期間なし

## クイックリファレンス

### フリーズ状態

| 状態 | 転送可能 | バーン可能 | 更新可能 |
|-------|--------------|----------|------------|
| 非フリーズ | はい | はい | はい |
| フリーズ | いいえ | いいえ | はい |

### 権限の動作

| イベント | 権限の結果 |
|-------|------------------|
| Asset転送 | 権限取り消し |
| プラグイン削除 | 権限なし |
| 解凍 | 権限維持 |

## FAQ

### 所有していないAssetをフリーズできますか？

いいえ。Freeze Delegateは所有者管理なので、所有者のみが追加できます。追加後、別のアドレスに権限を委任できます。

### Freeze DelegateとPermanent Freeze Delegateの違いは？

Freeze Delegate権限は転送時に取り消されます。Permanent Freeze Delegate権限は永続し、作成時にのみ追加できます。

### フリーズされたAssetをバーンできますか？

いいえ。フリーズされたAssetは転送とバーンの両方をブロックします。バーンしたい場合は先にAssetを解凍してください。

### コレクション全体を一度にフリーズできますか？

通常のFreeze Delegateではできません（Assetのみ）。代わりにCollectionに[Permanent Freeze Delegate](/ja/smart-contracts/core/plugins/permanent-freeze-delegate)を使用してください - コレクションレベルのフリーズをサポートし、そのCollection内のすべてのAssetを一度にフリーズします。Permanent Freeze DelegateはCollection作成時にのみ追加できることに注意してください。

### フリーズはメタデータ更新に影響しますか？

いいえ。Asset所有者またはupdate権限は、フリーズ中でもメタデータ（名前、URI）を更新できます。転送とバーンのみがブロックされます。

### エスクローレスステーキングの実装方法は？

1. ステーキングプログラムを権限としてFreeze Delegateプラグインを追加
2. ユーザーがステークする時: Assetをフリーズ
3. ユーザーがアンステークする時: Assetを解凍
4. NFTはユーザーのウォレットから離れません

## 関連プラグイン

- [Permanent Freeze Delegate](/ja/smart-contracts/core/plugins/permanent-freeze-delegate) - 取り消し不能なfreeze権限、Collectionをサポート
- [Transfer Delegate](/ja/smart-contracts/core/plugins/transfer-delegate) - 委任者によるAsset転送を許可
- [Burn Delegate](/ja/smart-contracts/core/plugins/burn-delegate) - 委任者によるAssetバーンを許可

## 用語集

| 用語 | 定義 |
|------|------------|
| **Freeze Delegate** | 転送とバーンをブロックする所有者管理プラグイン |
| **フリーズ** | 転送とバーンがブロックされたAsset状態 |
| **解凍** | Assetのフリーズを解除して再び転送を許可すること |
| **Delegate Authority** | Assetをフリーズ/解凍する権限を持つアカウント |
| **エスクローレス** | 保持アカウントに転送せずにステーキング/リスティング |
| **所有者管理** | 追加に所有者の署名が必要なプラグインタイプ |

---

*Metaplex Foundation管理 · 最終確認 2026年1月 · @metaplex-foundation/mpl-coreに適用*
