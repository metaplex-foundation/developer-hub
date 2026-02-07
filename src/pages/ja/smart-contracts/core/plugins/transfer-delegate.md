---
title: Transfer Delegateプラグイン
metaTitle: Transfer Delegateプラグイン | Metaplex Core
description: デリゲートがCore NFT Assetsを転送できるようにします。エスクローレス販売、ゲームメカニクス、マーケットプレイスリスティングにTransfer Delegateプラグインを使用します。
updated: '01-31-2026'
keywords:
  - transfer delegate
  - delegate transfer
  - escrowless sale
  - NFT marketplace
about:
  - Transfer delegation
  - Escrowless mechanics
  - Marketplace integration
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: なぜ転送権限が取り消されたのですか？
    a: Transfer Delegate権限は転送後に自動的に取り消されます。これはマーケットプレイスの安全性のための設計です—デリゲートは一度しか転送できません。
  - q: エスクローレスリスティングを実装するにはどうすればよいですか？
    a: 売り手がマーケットプレイスをauthorityとしてTransfer Delegateを追加します。買い手が支払うと、マーケットプレイスがAssetを買い手に転送します。authorityが取り消されるため、売り手は二重リスティングができません。
  - q: Transfer DelegateとPermanent Transfer Delegateの違いは何ですか？
    a: Transfer Delegateは1回の転送後に取り消されます。Permanent Transfer Delegateは永続し、Asset作成時にのみ追加できます。
  - q: デリゲートとしてフリーズされたAssetを転送できますか？
    a: いいえ。フリーズされたAssetはデリゲート転送を含むすべての転送をブロックします。複雑なエスクローシナリオにはPermanent Transfer DelegateとPermanent Freeze Delegateを使用してください。
  - q: オーナーは各転送を承認する必要がありますか？
    a: いいえ。Transfer Delegateが設定されると、デリゲートはオーナーの承認なしに転送できます。ただし、authorityが取り消される前に一度しかできません。
---
**Transfer Delegateプラグイン**は、指定されたauthorityがオーナーに代わってCore Assetsを転送できるようにします。エスクローレスマーケットプレイス販売、ゲームメカニクス、サブスクリプションサービスに不可欠です。 {% .lead %}
{% callout title="学べること" %}
- AssetにTransfer Delegateプラグインを追加
- マーケットプレイスやプログラムに転送権限をデリゲート
- デリゲートとして転送を実行
- 転送時のauthority動作
{% /callout %}
## 概要
**Transfer Delegate**は、デリゲートがAssetを転送できるようにするOwner Managedプラグインです。デリゲートされると、authorityはオーナーの承認なしにAssetを任意のアドレスに転送できます。
- エスクローレスマーケットプレイスリスティングを有効化
- authorityは**転送後に取り消される**（一回限りの使用）
- 永続的な権限には[Permanent Transfer Delegate](/smart-contracts/core/plugins/permanent-transfer-delegate)を使用
- 追加の引数は不要
## 対象外
永続的な転送権限（Permanent Transfer Delegateを参照）、コレクションレベルの転送、Token Metadata転送権限（別のシステム）。
## クイックスタート
**ジャンプ先:** [プラグインを追加](#assetへのtransfer-delegateプラグインの追加) · [権限をデリゲート](#転送権限のデリゲート) · [デリゲートとして転送](#デリゲートとしてのasset転送)
1. デリゲートアドレスでTransfer Delegateプラグインを追加
2. デリゲートがAssetを一度転送可能に
3. 転送後、authorityは自動的に取り消される
## 概要
`Transfer Delegate`プラグインは、Transfer DelegateプラグインのauthorityがいつでもAssetを転送できるようにする`Owner Managed`プラグインです。
Transfer Pluginは以下のような分野で機能します：
- Assetのエスクローレス販売：エスクローアカウントを必要とせずにNFTを買い手に直接転送
- ユーザーがイベントに基づいてアセットを交換/失うゲームシナリオ：ゲームイベント発生時にアセットを自動転送
- サブスクリプションサービス：サブスクリプションサービスの一部としてNFTを転送
{% callout type="note" title="Transfer vs Permanent Transfer Delegateの使い分け" %}
| ユースケース | Transfer Delegate | Permanent Transfer Delegate |
|----------|-------------------|----------------------------|
| マーケットプレイスリスティング | ✅ 最適 | ❌ リスクが高すぎる |
| 一回限りの転送 | ✅ 最適 | ❌ 過剰 |
| レンタル返却 | ❌ 一回限り | ✅ 最適 |
| ゲームアセットスワップ | ✅ 最適 | ✅ 動作する |
| 転送後も権限が持続 | ❌ 取り消し | ✅ 持続 |
**Transfer Delegateを選択**するのは、一回限りのエスクローレス販売（転送後にauthorityが取り消される）の場合です。
**[Permanent Transfer Delegate](/smart-contracts/core/plugins/permanent-transfer-delegate)を選択**するのは、authorityが永続する必要がある場合です。
{% /callout %}
{% callout title="警告！" %}
Transfer delegate authorityは一時的で、アセット転送時にリセットされます。
{% /callout %}
## 対応
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |
## 引数
Transfer Pluginには渡す引数がありません。
## 関数
### AssetへのTransfer Delegateプラグインの追加
`addPlugin`コマンドは、AssetにTransfer Delegateプラグインを追加します。このプラグインにより、デリゲートがいつでもAssetを転送できます。
{% dialect-switcher title="MPL Core AssetへのTransferプラグインの追加" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin } from '@metaplex-foundation/mpl-core'
const assetAddress = publicKey('11111111111111111111111111111111')
const delegate = publicKey('22222222222222222222222222222222')
await addPlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'TransferDelegate',
    authority: { type: 'Address', address: delegate },
  },
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
    .plugin(Plugin::TransferDelegate(TransferDelegate {}))
    .invoke();
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{Plugin, TransferDelegate},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn add_transfer_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let add_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::TransferDelegate(TransferDelegate {}))
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
### 転送権限のデリゲート
`approvePluginAuthority`コマンドは、転送権限を別のアドレスにデリゲートします。これにより、所有権を維持しながら別のアドレスがAssetを転送できます。
{% dialect-switcher title="転送権限のデリゲート" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { approvePluginAuthority } from '@metaplex-foundation/mpl-core'
const asset = publicKey("11111111111111111111111111111111");
const collection = publicKey("22222222222222222222222222222222");
const delegateAddress = publicKey("33333333333333333333333333333333");
await approvePluginAuthority(umi, {
  asset: asset,
  collection: collection,
  plugin: { type: "TransferDelegate" },
  newAuthority: { type: "Address", address: delegateAddress },
}).sendAndConfirm(umi);
```
{% /dialect %}
{% dialect title="Rust CPI" id="rust-cpi" %}
```rust
ApprovePluginAuthorityV1CpiBuilder::new(ctx.accounts.mpl_core_program)
    .asset(ctx.accounts.asset)
    .collection(Some(ctx.accounts.collection))
    .authority(Some(ctx.accounts.authority))
    .payer(ctx.accounts.payer)
    .plugin_type(PluginType::TransferDelegate)
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
    let approve_plugin_authority_ix = ApprovePluginAuthorityV1Builder::new()
        .asset(asset)
        // Assetがコレクションの一部である場合はcollectionを渡す必要がある
        .collection(Some(collection))
        .authority(Some(authority.pubkey()))
        .payer(authority.pubkey())
        .plugin_type(PluginType::TransferDelegate)
        .new_authority(PluginAuthority::Address { address: new_authority.pubkey() })
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let approve_plugin_authority_tx = Transaction::new_signed_with_payer(
        &[approve_plugin_authority_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&approve_plugin_authority_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res);
}
```
{% /dialect %}
{% /dialect-switcher %}
### デリゲートとしてのAsset転送
`transfer`命令は、transfer delegate authorityを使用してAssetを別のアドレスに転送します。
{% dialect-switcher title="MPL Core Assetの転送" %}
{% dialect title="JavaScript" id="js" %}
```ts
import {
  fetchAsset,
  fetchCollection,
  transfer,
} from "@metaplex-foundation/mpl-core";
import { publicKey } from "@metaplex-foundation/umi";
// 転送したいAsset ID
const assetId = publicKey("11111111111111111111111111111111");
// Assetを取得
const assetItem = await fetchAsset(umi, assetId);
// Assetがコレクションの一部である場合はコレクションを取得
const collectionItem =
    assetItem.updateAuthority.type == "Collection" &&
    assetItem.updateAuthority.address
      ? await fetchCollection(umi, assetItem.updateAuthority.address)
      : undefined;
// Core NFT Assetを転送
const { signature } = await transfer(umi, {
    asset: assetItem,
    newOwner: publicKey("22222222222222222222222222222222"),
    collection: collectionItem,
  })
  .sendAndConfirm(umi);
```
{% /dialect %}
{% dialect title="Rust CPI" id="rust-cpi" %}
```rust
TransferV1CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .new_owner(&ctx.accounts.new_owner.to_account_info())
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.delegate_authority.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .invoke()?;
```
{% /dialect %}
{% /dialect-switcher %}
## Transfer Delegate Authorityの更新
Transfer Delegateプラグインは更新するプラグインデータを含まないため（空のオブジェクト`{}`）、主な「更新」操作はプラグインauthorityの変更です。これにより、異なるアドレスに転送権限をデリゲートできます。
### Transfer Delegate Authorityの変更
`approvePluginAuthority`関数を使用して、転送権限を持つ人を変更できます：
{% dialect-switcher title="Transfer Delegate Authorityの更新" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { approvePluginAuthority } from '@metaplex-foundation/mpl-core'
(async () => {
    const assetAddress = publicKey('11111111111111111111111111111111')
    const newDelegate = publicKey('44444444444444444444444444444444')
    // Transfer delegateを新しいアドレスに変更
    await approvePluginAuthority(umi, {
    asset: assetAddress,
    plugin: { type: 'TransferDelegate' },
    newAuthority: { type: 'Address', address: newDelegate },
    }).sendAndConfirm(umi)
})();
```
{% /dialect %}
{% /dialect-switcher %}
### Transfer Delegate Authorityの取り消し
転送権限は`revokePluginAuthority`関数を使用して取り消すことができ、アセットオーナーに転送制御が戻ります。
{% dialect-switcher title="Transfer Delegate Authorityの取り消し" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { revokePluginAuthority } from '@metaplex-foundation/mpl-core'
const assetAddress = publicKey('11111111111111111111111111111111')
await revokePluginAuthority(umi, {
  asset: assetAddress,
  plugin: { type: 'TransferDelegate' },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% /dialect-switcher %}
## 一般的なエラー
### `Authority mismatch`
Transfer delegate authorityのみがAssetを転送できます。正しいキーペアで署名していることを確認してください。
### `Asset is frozen`
フリーズされたAssetは転送できません。Freeze authorityがまずAssetを解凍する必要があります。
### `Transfer delegate not found`
AssetにTransfer Delegateプラグインがないか、以前の転送後にauthorityがすでに取り消されています。
## 注意事項
- Owner Managed: 追加にはオーナーの署名が必要
- authorityは**転送後に自動的に取り消される**
- 各転送には新しいオーナーによる再デリゲートが必要
- フリーズされたAssetはデリゲートによって転送できない
- 永続的な権限にはPermanent Transfer Delegateを使用
## クイックリファレンス
### Authorityライフサイクル
| イベント | Authorityステータス |
|-------|------------------|
| プラグイン追加 | アクティブ |
| Asset転送 | **取り消し** |
| 新しいオーナーがプラグインを追加 | アクティブ（新しいデリゲート） |
### 誰が転送できる？
| Authority | 転送可能？ |
|-----------|---------------|
| Assetオーナー | はい（常に） |
| Transfer Delegate | はい（一度） |
| Permanent Transfer Delegate | はい（常に） |
| Update Authority | いいえ |
## FAQ
### なぜ転送権限が取り消されたのですか？
Transfer Delegate authorityは転送後に自動的に取り消されます。これはマーケットプレイスの安全性のための設計です—デリゲートは一度しか転送できません。
### エスクローレスリスティングを実装するにはどうすればよいですか？
1. 売り手がマーケットプレイスをauthorityとしてTransfer Delegateを追加
2. 買い手が支払うと、マーケットプレイスがAssetを買い手に転送
3. authorityが取り消されるため、売り手は二重リスティングができない
### Transfer DelegateとPermanent Transfer Delegateの違いは何ですか？
Transfer Delegateは1回の転送後に取り消されます。Permanent Transfer Delegateは永続し、Asset作成時にのみ追加できます。
### デリゲートとしてフリーズされたAssetを転送できますか？
いいえ。フリーズされたAssetはデリゲート転送を含むすべての転送をブロックします。複雑なエスクローシナリオにはPermanent Transfer DelegateとPermanent Freeze Delegateを使用してください。
### オーナーは各転送を承認する必要がありますか？
いいえ。Transfer Delegateが設定されると、デリゲートはオーナーの承認なしに転送できます。ただし、authorityが取り消される前に一度しかできません。
## 関連プラグイン
- [Permanent Transfer Delegate](/smart-contracts/core/plugins/permanent-transfer-delegate) - 取り消し不可能な転送権限
- [Freeze Delegate](/smart-contracts/core/plugins/freeze-delegate) - 転送を一時的にブロック
- [Burn Delegate](/smart-contracts/core/plugins/burn-delegate) - デリゲートがAssetsをバーンできるようにする
## 用語集
| 用語 | 定義 |
|------|------------|
| **Transfer Delegate** | 一回限りの転送権限を許可するOwner Managedプラグイン |
| **Owner Managed** | 追加にオーナーの署名が必要なプラグインタイプ |
| **エスクローレス** | 保持アカウントに転送せずに販売 |
| **Permanent Transfer Delegate** | 作成時に追加される取り消し不可能なバージョン |
