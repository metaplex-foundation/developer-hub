---
title: Permanent Freeze Delegate
metaTitle: Permanent Freeze Delegate | Metaplex Core
description: Permanent Freeze Delegate pluginでソウルバウンドNFTを作成し、Collection全体をフリーズします。永続的に有効な取り消し不可能なfreeze権限。
updated: '01-31-2026'
keywords:
  - soulbound NFT
  - permanent freeze
  - non-transferable NFT
  - collection freeze
about:
  - Soulbound tokens
  - Permanent plugins
  - Collection freezing
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: ソウルバウンド（譲渡不可）トークンはどのように作成しますか？
    a: PermanentFreezeDelegateでAssetを作成し、frozenをtrueに設定し、authorityをNoneに設定します。Assetは決してアンフリーズまたは転送できなくなります。
  - q: Freeze DelegateとPermanent Freeze Delegateの違いは何ですか？
    a: 通常のFreeze Delegate authorityは転送時に取り消され、Assetでのみ機能します。Permanent Freeze Delegateは永続的に有効で、Collectionで機能し、forceApproveを使用します。
  - q: Collection内の個別のAssetをフリーズできますか？
    a: いいえ。Permanent Freeze DelegateがCollectionにある場合、フリーズは全てのAssetに一度に影響します。個別制御にはAssetレベルのPermanent Freeze Delegateを使用してください。
  - q: 永続的にフリーズされたAssetはburnできますか？
    a: Permanent Burn Delegateもある場合のみ可能です。通常のBurn DelegateはフリーズされたAssetをburnできませんが、Permanent Burn DelegateはforceApproveを使用します。
---
**Permanent Freeze Delegate Plugin**は、転送後も持続する取り消し不可能なfreeze権限を提供します。ソウルバウンドトークン、Collection全体のフリーズ、永続的なロックメカニズムに使用します。 {% .lead %}
{% callout title="学習内容" %}
- 永続的なfreeze機能を持つAssetの作成
- Collection全体を一度にフリーズ
- ソウルバウンド（譲渡不可）トークンの実装
- permanent vs 通常のfreeze delegateの理解
{% /callout %}
## 概要
**Permanent Freeze Delegate**は、作成時にのみ追加できるpermanent pluginです。通常のFreeze Delegateとは異なり、この権限は永続的に有効で、転送後もフリーズ/解凍できます。
- Asset/Collection作成時にのみ追加可能
- 権限は転送後も持続（取り消されない）
- `forceApprove`を使用 - 他のブロッキングpluginがあってもフリーズ可能
- Collectionレベルのフリーズは、Collection内の全Assetに影響
## 対象外
通常のfreeze delegate（[Freeze Delegate](/ja/smart-contracts/core/plugins/freeze-delegate)を参照）、一時的なフリーズ、Token Metadata freeze権限。
## クイックスタート
**移動先:** [Assetの作成](#creating-an-asset-with-a-permanent-freeze-plugin) · [Collectionの作成](#creating-a-collection-with-a-permanent-freeze-plugin) · [更新（解凍）](#updating-the-permanent-freeze-delegate-plugin-on-an-asset)
1. Asset/Collection作成時に`PermanentFreezeDelegate` pluginを追加
2. 即時フリーズには`frozen: true`、後でフリーズするには`false`を設定
3. delegateは転送後もいつでもフリーズ/解凍可能
{% callout type="note" title="Permanent vs 通常のFreeze Delegate" %}
| 機能 | Freeze Delegate | Permanent Freeze Delegate |
|---------|-----------------|---------------------------|
| 作成後に追加 | ✅ 可能 | ❌ 作成時のみ |
| 転送後も権限が持続 | ❌ 取り消し | ✅ 持続 |
| Collectionで動作 | ❌ 不可 | ✅ 可能 |
| forceApprove | ❌ なし | ✅ あり |
| ソウルバウンドトークン | ❌ 限定的 | ✅ 最適な選択 |
**[Freeze Delegate](/ja/smart-contracts/core/plugins/freeze-delegate)を選択**：一時的で取り消し可能なフリーズの場合。
**Permanent Freeze Delegateを選択**：永続的な権限またはCollection全体のフリーズの場合。
{% /callout %}
## 一般的なユースケース
- **ソウルバウンドトークン**：譲渡不可の資格証明、実績、またはメンバーシップを作成
- **Collection全体のフリーズ**：1つのpluginでCollection内の全Assetをフリーズ
- **永続的な担保**：所有権の変更後も存続する担保としてAssetをロック
- **ゲームアイテムの永続性**：取引に関係なくロックされたままのアイテム
- **コンプライアンス要件**：規制上の理由でフリーズしたままにする必要があるAsset
## 対応
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |
### 動作
- **Asset**：delegatedアドレスがいつでもNFTをフリーズおよび解凍できるようにします。
- **Collection**：collection authorityがCollection全体を一度にフリーズおよび解凍できるようにします。このdelegateを使用してCollection内の単一assetをフリーズすることは**できません**。
## 引数
| 引数    | 値 |
| ------ | ----- |
| frozen | bool  |
## Permanent Freeze pluginを持つAssetの作成
以下の例は、Permanent Freeze pluginを持つAssetを作成する方法を示しています。
{% dialect-switcher title="Permanent Freeze pluginを持つAssetの作成" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'
const assetSigner = generateSigner(umi)
const delegate = publicKey('33333333333333333333333333333')
await create(umi, {
  asset: assetSigner,
  name: 'My NFT',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    {
      type: 'PermanentFreezeDelegate',
      frozen: true,
      authority: { type: 'Address', address: delegate },
    },
  ],
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use std::str::FromStr;
use mpl_core::{
    instructions::CreateV1Builder,
    types::{PermanentFreezeDelegate, Plugin, PluginAuthority, PluginAuthorityPair},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
pub async fn create_asset_with_permanent_freeze_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let payer = Keypair::new();
    let asset = Keypair::new();
    let delegate = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let create_asset_with_permanent_freeze_delegate_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::PermanentFreezeDelegate(PermanentFreezeDelegate { frozen: true }),
            authority: Some(PluginAuthority::Address { address: delegate }),
        }])
        .instruction();
    let signers = vec![&asset, &payer];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let create_asset_with_permanent_freeze_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_permanent_freeze_delegate_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_permanent_freeze_delegate_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## AssetのPermanent Freeze Delegate pluginの更新
以下の例は、AssetのPermanent Freeze Delegate pluginを更新する方法を示しています。`frozen`引数を`true`または`false`に設定してフリーズまたは解凍します。署名ウォレットがplugin authorityであることを前提としています。
{% dialect-switcher title="AssetのPermanent Freeze Delegate pluginの更新" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { updatePlugin } from '@metaplex-foundation/mpl-core'
const updateAssetResponse = await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: "PermanentFreezeDelegate",
    frozen: false,
  },
}).sendAndConfirm(umi);
```
{% /dialect %}
{% /dialect-switcher %}
## Permanent Freeze pluginを持つCollectionの作成
以下の例は、Permanent Freeze pluginを持つCollectionを作成する方法を示しています。
{% dialect-switcher title="Permanent Freeze pluginを持つCollectionの作成" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createCollection } from '@metaplex-foundation/mpl-core'
const collectionSigner = generateSigner(umi)
await createCollection(umi, {
  collection: collectionSigner,
  name: "Frozen Collection",
  uri: "https://example.com/my-collection.json",
  plugins: [
      {
        type: 'PermanentFreezeDelegate',
        frozen: true,
        authority: { type: "UpdateAuthority"}, // The update authority can unfreeze it
      },
    ],
  }).sendAndConfirm(umi);
```
{% /dialect %}
{% /dialect-switcher %}
## Permanent Freeze pluginを持つCollectionの更新
以下の例は、CollectionのPermanent Freeze Delegate pluginを更新する方法を示しています。`frozen`引数を`true`または`false`に設定してフリーズまたは解凍します。署名ウォレットがplugin authorityであることを前提としています。
{% dialect-switcher title="Permanent Freeze pluginを持つCollectionの更新" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { updateCollectionPlugin } from '@metaplex-foundation/mpl-core'
const updateCollectionResponse =  await updateCollectionPlugin(umi, {
  collection: collectionSigner.publicKey,
  plugin: {
      type: "PermanentFreezeDelegate",
      frozen: false,
    },
  }).sendAndConfirm(umi);
```
{% /dialect %}
{% /dialect-switcher %}
## 一般的なエラー
### `Cannot add permanent plugin after creation`
Permanent pluginはAsset/Collection作成時にのみ追加できます。既存のAssetにPermanent Freeze Delegateを追加することはできません。
### `Authority mismatch`
plugin authorityのみがフリーズ/解凍できます。正しいキーペアで署名しているか確認してください。
## 注意事項
- **作成時のみ**：Asset/Collection存在後は追加不可
- **Force approve**：競合するpluginがあってもフリーズ可能
- **Collection動作**：全Assetを一度にフリーズ、個別ではない
- **永続的**：権限は転送後も取り消されない
- ソウルバウンドトークンには`frozen: true`とauthority `None`を設定して使用
## FAQ
### ソウルバウンド（譲渡不可）トークンはどのように作成しますか？
`PermanentFreezeDelegate`でAssetを作成し、`frozen: true`に設定し、authorityを`None`に設定します。Assetは決してアンフリーズまたは転送できなくなります。
### Freeze DelegateとPermanent Freeze Delegateの違いは何ですか？
通常のFreeze Delegate authorityは転送時に取り消され、Assetでのみ機能します。Permanent Freeze Delegateは永続的に有効で、Collectionで機能し、`forceApprove`を使用します。
### Collection内の個別のAssetをフリーズできますか？
いいえ。Permanent Freeze DelegateがCollectionにある場合、フリーズは全てのAssetに一度に影響します。個別制御にはAssetレベルのPermanent Freeze Delegateを使用してください。
### 永続的にフリーズされたAssetはburnできますか？
Permanent Burn Delegateもある場合のみ可能です。通常のBurn DelegateはフリーズされたAssetをburnできませんが、Permanent Burn Delegateは`forceApprove`を使用します。
## 関連Plugin
- [Freeze Delegate](/ja/smart-contracts/core/plugins/freeze-delegate) - 一時的なロック用の取り消し可能なfreeze
- [Permanent Transfer Delegate](/ja/smart-contracts/core/plugins/permanent-transfer-delegate) - 永続的なtransfer権限
- [Permanent Burn Delegate](/ja/smart-contracts/core/plugins/permanent-burn-delegate) - フリーズ中のAssetもburn可能
## 用語集
| 用語 | 定義 |
|------|------------|
| **Permanent Plugin** | 作成時にのみ追加でき、永続的に有効なPlugin |
| **forceApprove** | 他のpluginの拒否を上書きする検証 |
| **Soulbound** | ウォレットに永続的にフリーズされた譲渡不可のトークン |
| **Collection Freeze** | Collection内の全Assetを一度にフリーズ |
