---
title: Permanent Burn Delegate
metaTitle: Permanent Burn Delegate | Metaplex Core
description: フリーズ中でもAssetを破棄できる永続的なburn権限を付与します。ゲームメカニクス、サブスクリプション期限切れ、自動アセットライフサイクル管理に使用できます。
updated: '01-31-2026'
keywords:
  - permanent burn
  - irrevocable burn
  - subscription expiry
  - automated burn
about:
  - Permanent delegation
  - Asset lifecycle
  - Automated destruction
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Burn DelegateとPermanent Burn Delegateの違いは何ですか？
    a: 通常のBurn Delegateはフリーズ中のAssetをburnできず、転送時に取り消されます。Permanent Burn Delegateはフリーズ中のAssetもburn可能（forceApprove）で、永続的に有効です。
  - q: Permanent Burn Delegateはフリーズ中のAssetをburnできますか？
    a: はい。Permanent pluginはforceApproveを使用し、フリーズの拒否を上書きします。これはアイテムを破壊可能にする必要があるゲームメカニクスに便利です。
  - q: 既存のAssetにこれを追加できますか？
    a: いいえ。Permanent pluginはAsset作成時にのみ追加できます。既存のAssetには通常のBurn Delegateを使用してください。
  - q: Collection レベルのPermanent Burn Delegateはどのように機能しますか？
    a: delegateはCollection内の任意の個別Assetをburnできますが、一度に全てをburnすることはできません。各burnは別々のトランザクションです。
  - q: これは安全に使用できますか？
    a: 注意して使用してください。delegateはオーナーの承認なしにいつでもAssetをburnできます。信頼できるプログラムまたはアドレスにのみ割り当ててください。
---
**Permanent Burn Delegate Plugin**は、永続的に有効な取り消し不可能なburn権限を提供します。delegateはフリーズ中でもAssetをburnでき、ゲームやサブスクリプションサービスに最適です。 {% .lead %}
{% callout title="学習内容" %}

- 永続的なburn機能を持つAssetの作成
- Collection全体のburn権限の有効化
- フリーズ中のAssetのburn（`forceApprove`動作）
- ユースケース：ゲーム、サブスクリプション、自動クリーンアップ
{% /callout %}

## 概要

**Permanent Burn Delegate**は、作成時にのみ追加できるpermanent pluginです。delegateはAssetがフリーズ中でも、いつでもAssetをburnできます。

- Asset/Collection作成時にのみ追加可能
- 権限は永続的（取り消されない）
- `forceApprove`を使用 - フリーズ中でもburn可能
- Collectionレベル：Collection内の任意のAssetをburn可能

## 対象外

通常のburn delegate（[Burn Delegate](/ja/smart-contracts/core/plugins/burn-delegate)を参照）、条件付きburn、Token Metadata burn権限。

## クイックスタート

**移動先:** [Assetの作成](#creating-an-asset-with-a-permanent-burn-plugin)

1. Asset/Collection作成時に`PermanentBurnDelegate` pluginを追加
2. authorityをプログラムまたはdelegateアドレスに設定
3. delegateはフリーズ中でもいつでもAssetをburn可能
{% callout type="note" title="Permanent vs 通常のBurn Delegate" %}
| 機能 | Burn Delegate | Permanent Burn Delegate |
|---------|---------------|-------------------------|
| 作成後に追加 | ✅ 可能 | ❌ 作成時のみ |
| 転送後も権限が持続 | ❌ 取り消し | ✅ 永続 |
| フリーズ中のAssetをburn可能 | ❌ 不可 | ✅ 可能（forceApprove） |
| Collectionで動作 | ❌ 不可 | ✅ 可能 |
| 緊急破棄 | ❌ 限定的 | ✅ 最適な選択 |
**[Burn Delegate](/ja/smart-contracts/core/plugins/burn-delegate)を選択**：ユーザーが取り消し可能なburn権限の場合。
**Permanent Burn Delegateを選択**：ゲーム、緊急破棄、自動クリーンアップの場合。
{% /callout %}

## 一般的なユースケース

- **ゲームメカニクス**：ゲーム内でアイテムが消費、紛失、破壊された時にAssetを破棄
- **サブスクリプション期限切れ**：フリーズ中でも期限切れのサブスクリプショントークンを自動burn
- **緊急破棄**：状態に関係なく、侵害されたまたは不要なAssetを削除
- **クラフトシステム**：クラフト時に素材NFTをburn（ロック中でも可能）
- **期間限定アセット**：期限切れのコンテンツを自動的に破棄
- **コンプライアンス**：オーナーがフリーズしようとしても、規約に違反するAssetを削除

## 対応

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

### 動作

- **Asset**：delegatedアドレスを使用してAssetのburnを許可します。
- **Collection**：collection authorityを使用してCollection内の任意のAssetのburnを許可します。一度に全てをburnするわけではありません。

## 引数

Permanent Burn Pluginには渡す引数はありません。

## Permanent Burn Pluginを持つAssetの作成

{% dialect-switcher title="Permanent Freeze pluginを持つAssetの作成" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'
const assetSigner = generateSigner(umi)
const delegate = publicKey('33333333333333333333333333333')
await create(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    {
      type: 'PermanentBurnDelegate',
      authority: { type: 'Address', address: delegate },
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::CreateV1Builder,
    types::{PermanentBurnDelegate, Plugin, PluginAuthority, PluginAuthorityPair},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{signature::Keypair, signer::Signer, transaction::Transaction};
pub async fn create_asset_with_permanent_burn_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let payer = Keypair::new();
    let asset = Keypair::new();
    let create_asset_with_permanent_burn_delegate_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::PermanentBurnDelegate(PermanentBurnDelegate {}),
            authority: Some(PluginAuthority::None),
        }])
        .instruction();
    let signers = vec![&asset, &payer];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let create_asset_with_permanent_burn_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_permanent_burn_delegate_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_permanent_burn_delegate_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## 一般的なエラー

### `Cannot add permanent plugin after creation`

Permanent pluginはAsset/Collection作成時にのみ追加できます。既存のAssetにPermanent Burn Delegateを追加することはできません。

### `Authority mismatch`

plugin authorityのみがburnできます。正しいキーペアで署名しているか確認してください。

## 注意事項

- **作成時のみ**：Asset/Collection存在後は追加不可
- **Force approve**：フリーズ中でもburn可能
- **Collection動作**：Collection内の任意のAssetを個別にburn可能
- **永続的**：権限は取り消されない
- **不可逆**：burnされたAssetは復元不可

## FAQ

### Burn DelegateとPermanent Burn Delegateの違いは何ですか？

通常のBurn Delegateはフリーズ中のAssetをburnできず、転送時に取り消されます。Permanent Burn Delegateはフリーズ中のAssetもburn可能（forceApprove）で、永続的に有効です。

### Permanent Burn Delegateはフリーズ中のAssetをburnできますか？

はい。Permanent pluginは`forceApprove`を使用し、フリーズの拒否を上書きします。これはアイテムを破壊可能にする必要があるゲームメカニクスに便利です。

### 既存のAssetにこれを追加できますか？

いいえ。Permanent pluginはAsset作成時にのみ追加できます。既存のAssetには通常のBurn Delegateを使用してください。

### CollectionレベルのPermanent Burn Delegateはどのように機能しますか？

delegateはCollection内の任意の個別Assetをburnできますが、一度に全てをburnすることはできません。各burnは別々のトランザクションです。

### これは安全に使用できますか？

注意して使用してください。delegateはオーナーの承認なしにいつでもAssetをburnできます。信頼できるプログラムまたはアドレスにのみ割り当ててください。

## 関連Plugin

- [Burn Delegate](/ja/smart-contracts/core/plugins/burn-delegate) - 取り消し可能なburn権限
- [Permanent Freeze Delegate](/ja/smart-contracts/core/plugins/permanent-freeze-delegate) - 永続的なfreeze権限
- [Permanent Transfer Delegate](/ja/smart-contracts/core/plugins/permanent-transfer-delegate) - 永続的なtransfer権限

## 用語集

| 用語 | 定義 |
|------|------------|
| **Permanent Plugin** | 作成時にのみ追加でき、永続的に有効なPlugin |
| **forceApprove** | 他のpluginの拒否を上書きする検証 |
| **Collection Burn** | Collection内の任意のAssetをburnする機能 |
