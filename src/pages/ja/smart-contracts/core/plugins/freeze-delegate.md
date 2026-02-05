---
title: Freeze Delegate
metaTitle: Freeze Delegateプラグイン | Metaplex Core
description: Core NFT Assetsをフリーズして転送とバーンをブロックする方法を学びます。エスクローレスステーキング、マーケットプレイスリスティング、ゲームアイテムのロックにFreeze Delegateプラグインを使用します。
updated: '01-31-2026'
keywords:
  - freeze NFT
  - freeze delegate
  - escrowless staking
  - lock NFT
  - freeze plugin
about:
  - Asset freezing
  - Escrowless mechanics
  - Staking
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
faqs:
  - q: 所有していないAssetをフリーズできますか？
    a: いいえ。Freeze DelegateはOwner Managedなので、オーナーのみが追加できます。追加後、別のアドレスに権限をデリゲートできます。
  - q: Freeze DelegateとPermanent Freeze Delegateの違いは何ですか？
    a: Freeze Delegateの権限は転送時に取り消されます。Permanent Freeze Delegateの権限は永続し、作成時にのみ追加できます。
  - q: フリーズされたAssetをバーンできますか？
    a: いいえ。フリーズされたアセットは転送とバーンの両方をブロックします。バーンしたい場合は先にAssetを解凍してください。
  - q: コレクション全体を一度にフリーズできますか？
    a: 通常のFreeze Delegateでは不可。代わりにCollectionでPermanent Freeze Delegateを使用してください。これはコレクションレベルのフリーズをサポートしています。Collection作成時にのみ追加可能であることに注意してください。
  - q: フリーズはメタデータの更新に影響しますか？
    a: いいえ。Assetオーナーまたはupdate authorityはフリーズ中でもメタデータを更新できます。転送とバーンのみがブロックされます。
  - q: エスクローレスステーキングを実装するにはどうすればよいですか？
    a: ステーキングプログラムをauthorityとしてFreeze Delegateを追加します。ユーザーがステークするとAssetをフリーズします。ユーザーがアンステークするとAssetを解凍します。NFTはユーザーのウォレットから離れません。
---
**Freeze Delegateプラグイン**を使用すると、Core Assetsをフリーズして、アセットがオーナーのウォレットに残ったまま転送とバーンをブロックできます。エスクローレスステーキング、マーケットプレイスリスティング、ゲームメカニクスに最適です。 {% .lead %}
{% callout title="学べること" %}
- AssetにFreeze Delegateプラグインを追加
- Assetのフリーズと解凍
- フリーズ権限を別のアドレスにデリゲート
- ユースケース：ステーキング、リスティング、ゲームロック
{% /callout %}
## 概要
**Freeze Delegate**は、Assetsを所定の位置にフリーズするOwner Managedプラグインです。フリーズされると、フリーズauthorityによって解凍されるまで、Assetは転送またはバーンできません。
- エスクローに転送せずにAssetsをフリーズ
- プログラムまたは別のウォレットにフリーズ権限をデリゲート
- 権限は転送時に取り消し（非永続バージョンの場合）
- 取り消し不可能なフリーズには[Permanent Freeze Delegate](/smart-contracts/core/plugins/permanent-freeze-delegate)を使用
## 対象外
コレクションレベルのフリーズ（Assetレベルのみ使用）、永続的フリーズ（Permanent Freeze Delegateを参照）、Token Metadataフリーズ権限（別のシステム）。
## クイックスタート
**ジャンプ先:** [プラグインを追加](#assetへのfreeze-delegateプラグインの追加) · [権限をデリゲート](#フリーズ権限のデリゲート) · [フリーズ](#assetのフリーズ) · [解凍](#フリーズされたassetの解凍)
1. Freeze Delegateプラグインを追加：`addPlugin(umi, { asset, plugin: { type: 'FreezeDelegate', data: { frozen: true } } })`
2. Assetがフリーズされ、転送できなくなる
3. 準備ができたら解凍：`frozen: false`でプラグインを更新
4. 権限は転送時に取り消し
{% callout type="note" title="Freeze vs Permanent Freezeの使い分け" %}
| ユースケース | Freeze Delegate | Permanent Freeze Delegate |
|----------|-----------------|---------------------------|
| マーケットプレイスリスティング | ✅ 最適 | ❌ 過剰 |
| エスクローレスステーキング | ✅ 最適 | ✅ 動作する |
| ソウルバウンドトークン | ❌ 転送時に取り消し | ✅ 最適 |
| コレクション全体フリーズ | ❌ Assetのみ | ✅ Collectionsをサポート |
| レンタルプロトコル | ✅ 最適 | ✅ 動作する |
**Freeze Delegateを選択**するのは、権限が所有権変更時にリセットされるべき場合です。
**[Permanent Freeze Delegate](/smart-contracts/core/plugins/permanent-freeze-delegate)を選択**するのは、権限が永続する必要がある場合です。
{% /callout %}
## 一般的なユースケース
- **エスクローレスステーキング**: エスクローに転送せずにステーク中のNFTをフリーズ
- **マーケットプレイスリスティング**: エスクローアカウントなしで販売用NFTをロック
- **ゲームアイテムロック**: ゲームプレイ中にアイテムを一時的にロック
- **レンタルプロトコル**: 貸し出し中のNFTをロック
- **ガバナンス**: 投票期間中にトークンをロック
- **担保**: 貸出担保として使用されるNFTをロック
- **トーナメント**: 競技参加中のNFTをロック
## 対応
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |
コレクションレベルのフリーズには、代わりに[Permanent Freeze Delegate](/smart-contracts/core/plugins/permanent-freeze-delegate)を使用してください。
## 引数
| 引数    | 値 |
| ------ | ----- |
| frozen | bool  |
## 関数
### AssetへのFreeze Delegateプラグインの追加
`addPlugin`コマンドはAssetにFreeze Delegateプラグインを追加します。このプラグインにより、Assetをフリーズして転送とバーンを防ぐことができます。
{% dialect-switcher title="MPL Core AssetへのFreezeプラグインの追加" %}
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
### フリーズ権限のデリゲート
`approvePluginAuthority`コマンドは、フリーズ権限を別のアドレスにデリゲートします。これにより、所有権を維持しながら別のアドレスがAssetをフリーズおよび解凍できるようになります。
{% dialect-switcher title="フリーズ権限のデリゲート" %}
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
        // Assetがコレクションの一部の場合、コレクションを渡す必要があります
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
Freeze Delegateプラグインを更新して、アセットのフリーズ状態を変更できます。これは、以下に示す[Assetのフリーズ](#assetのフリーズ)と[フリーズされたAssetの解凍](#フリーズされたassetの解凍)関数の使用と同じです。
### Assetのフリーズ
`freezeAsset`コマンドはAssetをフリーズし、転送またはバーンを防ぎます。これはエスクローレスステーキングやマーケットプレイスリスティングに便利です。
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
        // Assetがコレクションの一部の場合、Collectionを渡す
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
`thawAsset`コマンドはフリーズされたAssetを解凍し、転送とバーンの機能を復元します。
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
        // Assetがコレクションの一部の場合、Collectionを渡す
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
フリーズされたAssetを転送またはバーンしようとしました。フリーズauthorityがまず解凍する必要があります。
### `Authority mismatch`
freeze delegateのauthorityのみがAssetをフリーズ/解凍できます。誰がプラグイン権限を持っているか確認してください。
### `Plugin not found`
AssetにFreeze Delegateプラグインがありません。まず`addPlugin`で追加してください。
## 注意事項
- Owner Managed: 追加にはオーナーの署名が必要
- Assetが転送されると権限は自動的に取り消し
- フリーズされたアセットは引き続き更新可能（メタデータ変更は許可）
- 転送後も権限が持続する必要がある場合はPermanent Freeze Delegateを使用
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
| プラグイン削除 | 権限消失 |
| 解凍 | 権限維持 |
## FAQ
### 所有していないAssetをフリーズできますか？
いいえ。Freeze DelegateはOwner Managedなので、オーナーのみが追加できます。追加後、別のアドレスに権限をデリゲートできます。
### Freeze DelegateとPermanent Freeze Delegateの違いは何ですか？
Freeze Delegateの権限は転送時に取り消されます。Permanent Freeze Delegateの権限は永続し、作成時にのみ追加できます。
### フリーズされたAssetをバーンできますか？
いいえ。フリーズされたアセットは転送とバーンの両方をブロックします。バーンしたい場合は先にAssetを解凍してください。
### コレクション全体を一度にフリーズできますか？
通常のFreeze Delegate（Assetのみ）では不可。代わりにCollectionで[Permanent Freeze Delegate](/smart-contracts/core/plugins/permanent-freeze-delegate)を使用してください - コレクションレベルのフリーズをサポートし、そのコレクション内のすべてのAssetを一度にフリーズします。Permanent Freeze DelegateはCollection作成時にのみ追加可能であることに注意してください。
### フリーズはメタデータの更新に影響しますか？
いいえ。Assetオーナーまたはupdate authorityはフリーズ中でもメタデータ（名前、URI）を更新できます。転送とバーンのみがブロックされます。
### エスクローレスステーキングを実装するにはどうすればよいですか？
1. ステーキングプログラムをauthorityとしてFreeze Delegateプラグインを追加
2. ユーザーがステークするとき：Assetをフリーズ
3. ユーザーがアンステークするとき：Assetを解凍
4. NFTはユーザーのウォレットから離れない
## 関連プラグイン
- [Permanent Freeze Delegate](/smart-contracts/core/plugins/permanent-freeze-delegate) - 取り消し不可能なフリーズ権限、Collectionsをサポート
- [Transfer Delegate](/smart-contracts/core/plugins/transfer-delegate) - デリゲートがAssetを転送できるようにする
- [Burn Delegate](/smart-contracts/core/plugins/burn-delegate) - デリゲートがAssetをバーンできるようにする
## 用語集
| 用語 | 定義 |
|------|------------|
| **Freeze Delegate** | 転送とバーンをブロックするOwner Managedプラグイン |
| **Frozen** | 転送とバーンがブロックされたAsset状態 |
| **Thaw** | 転送を再び許可するためにAssetを解凍 |
| **Delegate Authority** | Assetをフリーズ/解凍する権限を持つアカウント |
| **Escrowless** | 保持アカウントに転送せずにステーキング/リスティング |
| **Owner Managed** | 追加にオーナーの署名が必要なプラグインタイプ |
