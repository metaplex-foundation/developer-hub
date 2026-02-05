---
title: Burn Delegate
metaTitle: Burn Delegateプラグイン | Metaplex Core
description: デリゲートがCore NFT Assetsをバーンできるようにします。ゲームメカニクス、サブスクリプションの期限切れ、自動アセット破棄にBurn Delegateプラグインを使用します。
updated: '01-31-2026'
keywords:
  - burn delegate
  - delegate burn
  - automated burn
  - NFT lifecycle
about:
  - Burn delegation
  - Game mechanics
  - Asset lifecycle
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Burn DelegateとPermanent Burn Delegateの違いは何ですか？
    a: Burn Delegateの権限は転送時に取り消されます。Permanent Burn Delegateの権限は永続し、forceApproveを使用するため、Assetがフリーズされていてもバーンできます。
  - q: Burn Delegateがいてもオーナーはバーンできますか？
    a: はい。オーナーはデリゲートに関係なく、常に自分のAssetをバーンできます。
  - q: Burn Delegateはフリーズされたアセットで機能しますか？
    a: いいえ。通常のBurn Delegateはフリーズされたアセットをバーンできません。フリーズされたアセットをバーンする必要がある場合はPermanent Burn Delegateを使用します。
  - q: Burn Delegateはいつ取り消されますか？
    a: Assetが新しいオーナーに転送されたとき。新しいオーナーは新しいBurn Delegateを追加する必要があります。
---
**Burn Delegateプラグイン**は、指定されたauthorityがオーナーに代わってCore Assetsをバーンできるようにします。ゲームメカニクス、サブスクリプションサービス、自動アセットライフサイクル管理に便利です。 {% .lead %}
{% callout title="学べること" %}
- AssetにBurn Delegateプラグインを追加
- バーン権限を別のアドレスにデリゲート
- バーン権限を取り消し
- ユースケース：ゲーム、サブスクリプション、自動バーン
{% /callout %}
## 概要
**Burn Delegate**は、デリゲートがAssetをバーンできるようにするOwner Managedプラグインです。追加されると、デリゲートはオーナーの承認なしにいつでもAssetをバーンできます。
- プログラムまたはウォレットにバーン権限をデリゲート
- 権限はAsset転送時に取り消し
- 取り消し不可能なバーン権限には[Permanent Burn Delegate](/smart-contracts/core/plugins/permanent-burn-delegate)を使用
- 追加の引数は不要
## 対象外
コレクションのバーン（別のプロセス）、永続的バーン権限（Permanent Burn Delegateを参照）、Token Metadataバーン権限（別のシステム）。
## クイックスタート
**ジャンプ先:** [プラグインを追加](#assetへのburnプラグインの追加) · [権限をデリゲート](#バーン権限のデリゲート) · [取り消し](#バーン権限の取り消し)
1. Burn Delegateプラグインを追加：`addPlugin(umi, { asset, plugin: { type: 'BurnDelegate' } })`
2. オプションで別のアドレスにデリゲート
3. デリゲートはいつでもAssetをバーン可能
{% callout type="note" title="Burn vs Permanent Burn Delegateの使い分け" %}
| ユースケース | Burn Delegate | Permanent Burn Delegate |
|----------|---------------|-------------------------|
| ゲームアイテム破棄 | ✅ 最適 | ✅ 動作する |
| サブスクリプション期限切れ | ✅ 最適 | ❌ 永続的すぎる |
| フリーズされたアセットをバーン | ❌ 不可 | ✅ 強制バーン可能 |
| 転送後も権限が持続 | ❌ 取り消し | ✅ 持続 |
| 緊急バーン機能 | ❌ 制限あり | ✅ 最適 |
**Burn Delegateを選択**するのは、バーン権限が所有権変更時にリセットされるべき場合です。
**[Permanent Burn Delegate](/smart-contracts/core/plugins/permanent-burn-delegate)を選択**するのは、権限が永続する必要がある場合です。
{% /callout %}
## 一般的なユースケース
- **ゲームメカニクス**: アイテムがゲーム内で消費、破壊、紛失されたときにNFTをバーン
- **サブスクリプションサービス**: 期限切れのサブスクリプショントークンを自動バーン
- **クラフトシステム**: 新しいアイテムをクラフトするときに材料NFTをバーン
- **実績引き換え**: 報酬と引き換えに実績トークンをバーン
- **イベントチケット**: イベントチェックイン後にチケットをバーン
- **期間限定アセット**: 有効期限後にアセットをバーン
## 対応
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |
## 引数
Burnプラグインには渡す引数がありません。
## AssetへのBurnプラグインの追加
{% dialect-switcher title="MPL Core AssetへのBurnプラグインの追加" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin } from '@metaplex-foundation/mpl-core'
(async () => {
    const asset = publicKey('11111111111111111111111111111111')
    await addPlugin(umi, {
    asset: asset,
    plugin: { type: 'BurnDelegate' },
    }).sendAndConfirm(umi)
})();
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```ts
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{BurnDelegate, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn add_burn_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let add_burn_delegate_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::BurnDelegate(BurnDelegate {}))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let add_burn_delegate_plugin_ix_tx = Transaction::new_signed_with_payer(
        &[add_burn_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&add_burn_delegate_plugin_ix_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## バーン権限のデリゲート
Burn Delegateプラグインの権限は、`approvePluginAuthority`関数を使用して別のアドレスにデリゲートできます。これにより、誰がAssetをバーンできるかを変更できます。
{% dialect-switcher title="バーン権限のデリゲート" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { approvePluginAuthority } from '@metaplex-foundation/mpl-core'
(async () => {
    const assetAddress = publicKey('11111111111111111111111111111111')
    const newDelegate = publicKey('22222222222222222222222222222222')
    await approvePluginAuthority(umi, {
    asset: assetAddress,
    plugin: { type: 'BurnDelegate' },
    newAuthority: { type: 'Address', address: newDelegate },
    }).sendAndConfirm(umi)
})();
```
{% /dialect %}
{% /dialect-switcher %}
## バーン権限の取り消し
バーン権限は`revokePluginAuthority`関数を使用して取り消すことができ、アセットオーナーに制御が戻ります。
{% dialect-switcher title="バーン権限の取り消し" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { revokePluginAuthority } from '@metaplex-foundation/mpl-core'
(async () => {
    const assetAddress = publicKey('11111111111111111111111111111111')
    await revokePluginAuthority(umi, {
    asset: assetAddress,
    plugin: { type: 'BurnDelegate' },
    }).sendAndConfirm(umi)
})();
```
{% /dialect %}
{% /dialect-switcher %}
## 一般的なエラー
### `Authority mismatch`
burn delegateのauthorityのみがAssetをバーンできます。正しいキーペアで署名していることを確認してください。
### `Asset is frozen`
フリーズされたアセットはバーンできません。フリーズauthorityがまずAssetを解凍する必要があります。
## 注意事項
- Owner Managed: 追加にはオーナーの署名が必要
- Assetが転送されると権限は自動的に取り消し
- フリーズされたアセットはバーンできない
- 転送後も権限が持続する必要がある場合はPermanent Burn Delegateを使用
- バーンは即時かつ不可逆
## クイックリファレンス
### 誰がバーンできる？
| Authority | バーン可能？ |
|-----------|-----------|
| Assetオーナー | はい（常に） |
| Burn Delegate | はい |
| Permanent Burn Delegate | はい（強制承認） |
| Update Authority | いいえ |
## FAQ
### Burn DelegateとPermanent Burn Delegateの違いは何ですか？
Burn Delegateの権限は転送時に取り消されます。Permanent Burn Delegateの権限は永続し、`forceApprove`を使用するため、Assetがフリーズされていてもバーンできます。
### Burn Delegateがいてもオーナーはバーンできますか？
はい。オーナーはデリゲートに関係なく、常に自分のAssetをバーンできます。
### Burn Delegateはフリーズされたアセットで機能しますか？
いいえ。通常のBurn Delegateはフリーズされたアセットをバーンできません。フリーズされたアセットをバーンする必要がある場合はPermanent Burn Delegateを使用します。
### Burn Delegateはいつ取り消されますか？
Assetが新しいオーナーに転送されたとき。新しいオーナーは新しいBurn Delegateを追加する必要があります。
## 関連プラグイン
- [Permanent Burn Delegate](/smart-contracts/core/plugins/permanent-burn-delegate) - forceApprove付きの取り消し不可能なバーン権限
- [Freeze Delegate](/smart-contracts/core/plugins/freeze-delegate) - 転送とバーンを一時的にブロック
- [Transfer Delegate](/smart-contracts/core/plugins/transfer-delegate) - デリゲートがAssetを転送できるようにする
## 用語集
| 用語 | 定義 |
|------|------------|
| **Burn Delegate** | デリゲートがAssetをバーンできるようにするOwner Managedプラグイン |
| **Owner Managed** | 追加にオーナーの署名が必要なプラグインタイプ |
| **Revoke** | デリゲートのバーン権限を削除 |
| **Permanent Burn Delegate** | 転送後も持続する取り消し不可能なバージョン |
| **forceApprove** | フリーズ制限を上書きする永続プラグインの機能 |
