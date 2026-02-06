---
title: Permanent Transfer Delegate
metaTitle: Permanent Transfer Delegate | Metaplex Core
description: 所有権の変更後も持続する永続的なtransfer権限を付与します。ゲームメカニクス、サブスクリプションサービス、自動アセット管理に使用できます。
updated: '01-31-2026'
keywords:
  - permanent transfer
  - irrevocable delegate
  - automated transfers
  - game mechanics
about:
  - Permanent delegation
  - Automated management
  - Game integration
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Transfer DelegateとPermanent Transfer Delegateの違いは何ですか？
    a: 通常のTransfer Delegateは1回の転送後に取り消されます。Permanent Transfer Delegateは永続的に有効で、無制限に転送できます。
  - q: Permanent Transfer Delegateはフリーズ中のAssetを転送できますか？
    a: はい。Permanent pluginはforceApproveを使用し、フリーズの拒否を上書きします。
  - q: 既存のAssetにこれを追加できますか？
    a: いいえ。Permanent pluginはAsset作成時にのみ追加できます。既存のAssetには通常のTransfer Delegateを使用してください。
  - q: CollectionレベルのPermanent Transfer Delegateはどのように機能しますか？
    a: delegateはCollection内の任意の個別Assetを転送できますが、一度に全てを転送することはできません。各転送は別々のトランザクションです。
---
**Permanent Transfer Delegate Plugin**は、永続的に有効な取り消し不可能なtransfer権限を提供します。通常のTransfer Delegateとは異なり、この権限は取り消されず、Assetを繰り返し転送できます。 {% .lead %}
{% callout title="学習内容" %}

- 永続的なtransfer機能を持つAssetの作成
- Collection全体のtransfer権限の有効化
- ユースケース：ゲーム、サブスクリプション、自動化システム
- permanent vs 通常のtransfer delegateの理解
{% /callout %}

## 概要

**Permanent Transfer Delegate**は、作成時にのみ追加できるpermanent pluginです。delegateはオーナーの承認なしに無制限にAssetを転送できます。

- Asset/Collection作成時にのみ追加可能
- 権限は永続的（取り消されない）
- `forceApprove`を使用 - フリーズ中でも転送可能
- Collectionレベル：Collection内の任意のAssetを転送可能

## 対象外

通常のtransfer delegate（[Transfer Delegate](/ja/smart-contracts/core/plugins/transfer-delegate)を参照）、エスクローレスリスティング（通常のdelegateを使用）、Token Metadata transfer権限。

## クイックスタート

**移動先:** [Assetの作成](#creating-a-mpl-core-asset-with-a-permanent-transfer-plugin)

1. Asset/Collection作成時に`PermanentTransferDelegate` pluginを追加
2. authorityをプログラムまたはdelegateアドレスに設定
3. delegateはいつでも無制限にAssetを転送可能
{% callout type="note" title="Permanent vs 通常のTransfer Delegate" %}
| 機能 | Transfer Delegate | Permanent Transfer Delegate |
|---------|-------------------|----------------------------|
| 作成後に追加 | ✅ 可能 | ❌ 作成時のみ |
| 転送後も権限が持続 | ❌ 1回の転送後に取り消し | ✅ 永続 |
| 複数回の転送 | ❌ 1回限り | ✅ 無制限 |
| フリーズ中のAssetを転送可能 | ❌ 不可 | ✅ 可能（forceApprove） |
| Collectionで動作 | ❌ 不可 | ✅ 可能 |
**[Transfer Delegate](/ja/smart-contracts/core/plugins/transfer-delegate)を選択**：1回限りのエスクローレス販売の場合。
**Permanent Transfer Delegateを選択**：ゲーム、レンタル、または繰り返し転送が必要な自動化システムの場合。
{% /callout %}

## 一般的なユースケース

- **ゲームメカニクス**：ゲームイベント（バトルでの敗北、取引）発生時にAssetを転送
- **レンタル返却**：レンタルしたNFTを自動的にオーナーに返却
- **サブスクリプション管理**：サブスクリプションの終了または更新時にトークンを転送
- **DAOトレジャリー管理**：DAOがAsset配布を管理できるようにする
- **自動化システム**：転送ごとの承認なしにAssetを移動する必要があるプログラム

## 対応

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

### 動作

- **Asset**：delegatedアドレスを使用してAssetの転送を許可します。
- **Collection**：collection authorityを使用してCollection内の任意のAssetの転送を許可します。一度に全てを転送するわけではありません。

## 引数

| 引数    | 値 |
| ------ | ----- |
| frozen | bool  |

## Permanent Transfer Pluginを持つMPL Core Assetの作成

{% dialect-switcher title="Permanent Transfer Pluginを持つMPL Core Assetの作成" %}
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
      type: 'PermanentTransferDelegate',
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
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn create_asset_with_permanent_burn_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let payer = Keypair::new();
    let asset = Keypair::new();
    let delegate = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let create_asset_with_burn_transfer_delegate_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::PermanentBurnDelegate(PermanentBurnDelegate {}),
            authority: Some(PluginAuthority::Address { address: delegate }),
        }])
        .instruction();
    let signers = vec![&asset, &payer];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let create_asset_with_burn_transfer_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_burn_transfer_delegate_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_burn_transfer_delegate_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## 一般的なエラー

### `Cannot add permanent plugin after creation`

Permanent pluginはAsset/Collection作成時にのみ追加できます。既存のAssetにPermanent Transfer Delegateを追加することはできません。

### `Authority mismatch`

plugin authorityのみが転送できます。正しいキーペアで署名しているか確認してください。

## 注意事項

- **作成時のみ**：Asset/Collection存在後は追加不可
- **Force approve**：フリーズ中でも転送可能
- **Collection動作**：Collection内の任意のAssetを個別に転送可能
- **永続的**：権限は取り消されない
- **無制限の転送**：delegateが転送できる回数に制限なし

## FAQ

### Transfer DelegateとPermanent Transfer Delegateの違いは何ですか？

通常のTransfer Delegateは1回の転送後に取り消されます。Permanent Transfer Delegateは永続的に有効で、無制限に転送できます。

### Permanent Transfer Delegateはフリーズ中のAssetを転送できますか？

はい。Permanent pluginは`forceApprove`を使用し、フリーズの拒否を上書きします。

### 既存のAssetにこれを追加できますか？

いいえ。Permanent pluginはAsset作成時にのみ追加できます。既存のAssetには通常のTransfer Delegateを使用してください。

### CollectionレベルのPermanent Transfer Delegateはどのように機能しますか？

delegateはCollection内の任意の個別Assetを転送できますが、一度に全てを転送することはできません。各転送は別々のトランザクションです。

## 関連Plugin

- [Transfer Delegate](/ja/smart-contracts/core/plugins/transfer-delegate) - 1回限りのtransfer権限
- [Permanent Freeze Delegate](/ja/smart-contracts/core/plugins/permanent-freeze-delegate) - 永続的なfreeze権限
- [Permanent Burn Delegate](/ja/smart-contracts/core/plugins/permanent-burn-delegate) - 永続的なburn権限

## 用語集

| 用語 | 定義 |
|------|------------|
| **Permanent Plugin** | 作成時にのみ追加でき、永続的に有効なPlugin |
| **forceApprove** | 他のpluginの拒否を上書きする検証 |
| **Collection Transfer** | Collection内の任意のAssetを転送する機能 |
